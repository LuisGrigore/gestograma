import { InferenceSession, Tensor } from "onnxruntime-web";
import { HandSample } from "../models/hands.model";
import { centroid, norm, sigmoid } from "../utils/math";
import {
  queueStrategy,
  withStrategy,
} from "../classificator/classification_strategies";
import { ClassificationModel } from "../classificator/classification_models";
import { Gesture } from "../types/gesture.type";

const extractFeatures = (sequence: HandSample[]) => {
  const frames: number[][] = [];

  for (let i = 0; i < sequence.length; i++) {
    const curr = sequence[i].landmarks;

    const currC = centroid(curr);
    const wrist = curr[0];

    const centered = curr.flatMap((l) => [
      l.x - wrist.x,
      l.y - wrist.y,
      (l.z ?? 0) - (wrist.z ?? 0),
    ]);

    let velocity = [0, 0, 0];

    if (i > 0) {
      const prev = sequence[i - 1].landmarks;

      const prevC = centroid(prev);

      const dt = Math.max(
        sequence[i].timestamp - sequence[i - 1].timestamp,
        1e-6,
      );

      const d = [
        (currC[0] - prevC[0]) / dt,
        (currC[1] - prevC[1]) / dt,
        (currC[2] - prevC[2]) / dt,
      ];

      const n = Math.max(norm(d), 1e-6);
      const s = sigmoid(n);

      const factor = s / n;

      velocity = d.map((v) => v * factor);
    }

    frames.push([...centered, ...velocity]);
  }

  return frames;
};

export type GestureClassificationModel = ClassificationModel<HandSample[], Gesture>

interface Params {
  gestures: Gesture[];
  onnxModelPath: string;
  confidenceThreshold: number;
}

export const createGestureClassificationModel = async ({
  gestures,
  onnxModelPath,
  confidenceThreshold,
}: Params): Promise<GestureClassificationModel> => {
  const session = await InferenceSession.create(onnxModelPath, {
    executionProviders: ["wasm"],
  });
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];
  const model = withStrategy(
    {
      classify: async (seq: HandSample[]) => {
        if (!seq.length) return null;

        const features = extractFeatures(seq);

        const tensor = new Tensor(
          "float32",
          Float32Array.from(features.flat()),
          [1, features.length, features[0].length],
        );

        const out = await session.run({ [inputName]: tensor });

        const data = out[outputName].data as Float32Array;

        let maxIdx = 0;
        let maxVal = data[0];

        for (let i = 1; i < data.length; i++) {
          if (data[i] > maxVal) {
            maxVal = data[i];
            maxIdx = i;
          }
        }

        if (maxVal < confidenceThreshold) return null;

		if (maxIdx < 0 || maxIdx > gestures.length - 1) return null;
		
        return {
          class: gestures[maxIdx],
          confidence: maxVal,
        };
      },
      destroy: () => session.release(),
    },
    queueStrategy(),
  );

  return model;
};
