import * as tf from "@tensorflow/tfjs";
import { DualHandSample, HandSample } from "../models/hands.model";

export type Gesture =
  | "NONE"
  | "SELECT"
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "ACCEPT"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I";

export interface GestureDetectionService {
  detect: (sequence: DualHandSample[]) => Promise<Gesture>;
  destroy: () => void;
}

const LEFT_GESTURES: Gesture[] = [
  "NONE",
  "SELECT",
  "MOVE_LEFT",
  "MOVE_RIGHT",
  "ACCEPT",
];

const RIGHT_GESTURES: Gesture[] = [
  "NONE",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
];

export const createGestureDetectionService = (
  leftModel: tf.LayersModel,
  rightModel: tf.LayersModel,
  confidenceThreshold: number,
): GestureDetectionService => {
  const extractFeatures = (hand: HandSample): number[] => {
    return hand.landmarks.flatMap((l) => [l.x, l.y, l.z ?? 0]);
  };

  const predict = (
    model: tf.LayersModel,
    sequence: HandSample[],
    gestureMap: Gesture[],
  ): { gesture: Gesture; confidence: number } => {
    return tf.tidy(() => {
      const inputSeq = sequence.map(extractFeatures);
      const input = tf.tensor(inputSeq).expandDims(0);

      const output = model.predict(input) as tf.Tensor;
      const data = output.dataSync();

      let maxIdx = 0;
      let maxVal = data[0];

      for (let i = 1; i < data.length; i++) {
        if (data[i] > maxVal) {
          maxVal = data[i];
          maxIdx = i;
        }
      }

      return {
        gesture: gestureMap[maxIdx] ?? "NONE",
        confidence: maxVal,
      };
    });
  };

  const detect = async (sequence: DualHandSample[]): Promise<Gesture> => {
    if (!sequence.length) return "NONE";

    const leftSeq: HandSample[] = sequence
      .map((s) => s.left)
      .filter((h): h is HandSample => !!h);

    const rightSeq: HandSample[] = sequence
      .map((s) => s.right)
      .filter((h): h is HandSample => !!h);

    const hasLeft = leftSeq.length > 0;
    const hasRight = rightSeq.length > 0;

    let leftResult: { gesture: Gesture; confidence: number } | null = null;
    let rightResult: { gesture: Gesture; confidence: number } | null = null;

    if (hasLeft) {
      leftResult = predict(leftModel, leftSeq, LEFT_GESTURES);
    }

    if (hasRight) {
      rightResult = predict(rightModel, rightSeq, RIGHT_GESTURES);
    }

    let result: { gesture: Gesture; confidence: number } | null = null;

    if (rightResult && !leftResult) {
      result = rightResult;
    } else if (leftResult && !rightResult) {
      result = leftResult;
    } else if (leftResult && rightResult) {
      result =
        rightResult.confidence >= leftResult.confidence
          ? rightResult
          : leftResult;
    }

    if (!result) return "NONE";

    if (result.confidence < confidenceThreshold) {
      return "NONE";
    }

    return result.gesture;
  };

  const destroy = () => {
    leftModel.dispose();
    rightModel.dispose();
  };

  return {
    detect,
    destroy,
  };
};