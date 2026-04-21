// import { InferenceSession, Tensor } from "onnxruntime-web";
// import { DualHandSample, HandSample } from "../models/hands.model";

// export type Gesture =
//   | "NONE"
//   | "SELECT"
//   | "MOVE_LEFT"
//   | "MOVE_RIGHT"
//   | "ACCEPT"
//   | "A"
//   | "B"
//   | "C"
//   | "D"
//   | "E"
//   | "F"
//   | "G"
//   | "H"
//   | "I"
//   | "J"
//   | "K";

// const RIGHT_GESTURES: Gesture[] = [
//   "A",
//   "B",
//   "C",
// //   "D",
// //   "E",
// //   "F",
// //   "G",
// //   "H",
// //   "I",
// //   "J",
// //   "K",
//   "NONE",
// ];

// // =========================
// // MATH (igual Python)
// // =========================

// const sigmoid = (x: number) =>
//   x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));

// const centroid = (lm: any[]) => {
//   let x = 0,
//     y = 0,
//     z = 0;

//   for (const l of lm) {
//     x += l.x;
//     y += l.y;
//     z += l.z ?? 0;
//   }

//   return [x / lm.length, y / lm.length, z / lm.length];
// };

// const norm = (v: number[]) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

// // =========================
// // FEATURE ENGINEERING
// // =========================

// const extractFeatures = (sequence: HandSample[]) => {
//   const frames: number[][] = [];

//   for (let i = 0; i < sequence.length; i++) {
//     const curr = sequence[i].landmarks;

//     const currC = centroid(curr);
//     const wrist = curr[0];

//     const centered = curr.flatMap((l) => [
//       l.x - wrist.x,
//       l.y - wrist.y,
//       (l.z ?? 0) - (wrist.z ?? 0),
//     ]);

//     let velocity = [0, 0, 0];

//     if (i > 0) {
//       const prev = sequence[i - 1].landmarks;

//       const prevC = centroid(prev);

//       const dt = Math.max(
//         sequence[i].timestamp - sequence[i - 1].timestamp,
//         1e-6,
//       );

//       const d = [
//         (currC[0] - prevC[0]) / dt,
//         (currC[1] - prevC[1]) / dt,
//         (currC[2] - prevC[2]) / dt,
//       ];

//       const n = Math.max(norm(d), 1e-6);
//       const s = sigmoid(n);

//       const factor = s / n;

//       velocity = d.map((v) => v * factor);
//     }

//     frames.push([...centered, ...velocity]);
//   }

//   return frames;
// };

// // =========================
// // SERVICE
// // =========================
// export interface GestureDetectionService {
//   detect: (sequence: DualHandSample[]) => Promise<Gesture>;
//   destroy: () => void;
// }

// export const createGestureDetectionService = async (config: {
//   modelUrl: string;
//   confidenceThreshold: number;
// }) => {
//   const session = await InferenceSession.create(config.modelUrl, {
//     executionProviders: ["wasm"],
//   });

//   const inputName = session.inputNames[0];
//   const outputName = session.outputNames[0];

//   const predict = async (seq: HandSample[]) => {
//     const features = extractFeatures(seq);

//     const tensor = new Tensor("float32", Float32Array.from(features.flat()), [
//       1,
//       features.length,
//       features[0].length,
//     ]);

//     const out = await session.run({ [inputName]: tensor });

//     const data = out[outputName].data as Float32Array;

//     let maxIdx = 0;
//     let maxVal = data[0];

//     for (let i = 1; i < data.length; i++) {
//       if (data[i] > maxVal) {
//         maxVal = data[i];
//         maxIdx = i;
//       }
//     }

//     return {
//       gesture: RIGHT_GESTURES[maxIdx],
//       confidence: maxVal,
//     };
//   };

//   const detect = async (sequence: DualHandSample[]) => {
//     if (!sequence.length) return "NONE";

//     const right = sequence.map((s) => s.right).filter(Boolean) as HandSample[];

//     if (!right.length) return "NONE";

//     const res = await predict(right);

//     if (res.confidence < config.confidenceThreshold) {
//       return "NONE";
//     }

//     return res.gesture;
//   };

//   return {
//     detect,
//     destroy: () => session.release(),
//   };
// };

import { InferenceSession, Tensor } from "onnxruntime-web";
import { HandSample } from "../models/hands.model";

export type Handedness = "left" | "right";

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
  | "I"
  | "J"
  | "K";

const RIGHT_GESTURES: Gesture[] = ["A", "B", "C", "NONE"];
const LEFT_GESTURES: Gesture[] = ["NONE"]; // 👈 placeholder (puedes ampliarlo)

// =========================
// MATH
// =========================

const sigmoid = (x: number) =>
  x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));

const centroid = (lm: any[]) => {
  let x = 0,
    y = 0,
    z = 0;

  for (const l of lm) {
    x += l.x;
    y += l.y;
    z += l.z ?? 0;
  }

  return [x / lm.length, y / lm.length, z / lm.length];
};

const norm = (v: number[]) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

// =========================
// FEATURE ENGINEERING
// =========================

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

// =========================
// SERVICE
// =========================

export interface GestureDetectionService {
  detect: (sequence: HandSample[]) => Promise<Gesture>;
  destroy: () => void;
}

interface Params {
  handedness: Handedness;
  session: InferenceSession; // 👈 inyectado
  confidenceThreshold: number;
}

export const createGestureDetectionService = ({
  handedness,
  session,
  confidenceThreshold,
}: Params): GestureDetectionService => {
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];

  const gestures =
    handedness === "right" ? RIGHT_GESTURES : LEFT_GESTURES;

  let isProcessing = false;

  const predict = async (seq: HandSample[]) => {
    const features = extractFeatures(seq);

    const tensor = new Tensor("float32", Float32Array.from(features.flat()), [
      1,
      features.length,
      features[0].length,
    ]);

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

    return {
      gesture: gestures[maxIdx] ?? "NONE",
      confidence: maxVal,
    };
  };

  const detect = async (sequence: HandSample[]) => {
    if (!sequence.length) return "NONE";

    // Wait if another detection is in progress
    while (isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    isProcessing = true;
    try {
      const res = await predict(sequence);

      if (res.confidence < confidenceThreshold) {
        return "NONE";
      }

      return res.gesture;
    } finally {
      isProcessing = false;
    }
  };

  return {
    detect,
    destroy: () => session.release(),
  };
};
