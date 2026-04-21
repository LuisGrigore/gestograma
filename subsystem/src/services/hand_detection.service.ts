// import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

// import { mapHands } from "../mappers/hands.mapper";
// import { DualHandSample, HandSample } from "../models/hands.model";

// const MAX_SEQUENCE_LENGTH = 60;

// class SlidingWindow<T> {
//   private buffer: T[];
//   private index = 0;
//   private filled = false;

//   constructor(private size: number) {
//     this.buffer = new Array(size);
//   }

//   add(value: T) {
//     this.buffer[this.index] = value;
//     this.index = (this.index + 1) % this.size;

//     if (this.index === 0) this.filled = true;
//   }

//   get(): T[] {
//     if (!this.filled) return this.buffer.slice(0, this.index);

//     return [
//       ...this.buffer.slice(this.index),
//       ...this.buffer.slice(0, this.index),
//     ];
//   }
// }

// interface Params {
//   sequenceLength?: number;
//   camera?: { width: number; height: number };
//   fps?: number;
// }

// export interface HandDetectionService {
//   start: (
//     onRightHand?: (h: HandSample) => void,
//     onLeftHand?: (h: HandSample) => void,
//     onRightHandSeq?: (h: HandSample[]) => void,
//     onLeftHandSeq?: (h: HandSample[]) => void,
//   ) => Promise<void>;
//   stop: () => void;
//   destroy: () => void;
// }

// export const createHandsDetectionService = ({
//   sequenceLength,
//   camera = { width: 320, height: 240 },
//   fps = 30,
// }: Params): HandDetectionService => {
//   let video: HTMLVideoElement | null = null;
//   let stream: MediaStream | null = null;
//   let handLandmarker: HandLandmarker | null = null;

//   let running = false;
//   let rafId: number | null = null;

//   let lastTime = 0;
//   let isProcessing = false;

//   //   let onHands: ((h: DualHandSample) => void) | null = null;
//   let _onRightHand: ((h: HandSample) => void) | null = null;
//   let _onLeftHand: ((h: HandSample) => void) | null = null;

//   //   let onSeq: ((h: DualHandSample[]) => void) | null = null;
//   let _onRightHandSeq: ((h: HandSample[]) => void) | null = null;
//   let _onLeftHandSeq: ((h: HandSample[]) => void) | null = null;

//   const interval = 1000 / fps;

//   //   let sequence: SlidingWindow<DualHandSample> | null = null;
//   let _sequenceRight: SlidingWindow<HandSample> | null = null;
//   let _sequenceLeft: SlidingWindow<HandSample> | null = null;

//   const init = async () => {
//     video = document.createElement("video");
//     video.autoplay = true;
//     video.playsInline = true;
//     video.style.transform = "scaleX(-1)";

//     const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
//     );

//     handLandmarker = await HandLandmarker.createFromOptions(vision, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
//         delegate: "GPU",
//       },
//       runningMode: "VIDEO",
//       numHands: 2,
//     });

//     stream = await navigator.mediaDevices.getUserMedia({
//       video: camera,
//     });

//     video.srcObject = stream;
//     await video.play();

//     // sequence = new SlidingWindow(sequenceLength ?? MAX_SEQUENCE_LENGTH);
//     _sequenceRight = new SlidingWindow(sequenceLength ?? MAX_SEQUENCE_LENGTH);
//     _sequenceLeft = new SlidingWindow(sequenceLength ?? MAX_SEQUENCE_LENGTH);
//   };

//   const loop = (time: number) => {
//     if (!running) return;

//     rafId = requestAnimationFrame(loop);

//     if (!video || !handLandmarker) return;
//     if (isProcessing) return;
//     if (time - lastTime < interval) return;

//     lastTime = time;
//     isProcessing = true;

//     try {
//       const results = handLandmarker.detectForVideo(video, time);

//       const sample = mapHands({
//         inference: results,
//         time,
//       });

//       //   onHands?.(sample);
//       if (sample.right) _onRightHand?.(sample.right);
//       if (sample.left) _onLeftHand?.(sample.left);

//       //   if (sequence && onSeq) {
//       //     sequence.add(sample);
//       //     onSeq(sequence.get());
//       //   }
//       if (_sequenceRight && _onRightHandSeq && sample.right) {
//         _sequenceRight.add(sample.right);
//         _onRightHandSeq(_sequenceRight.get());
//       }
//       if (_sequenceLeft && _onLeftHandSeq && sample.left) {
//         _sequenceLeft.add(sample.left);
//         _onLeftHandSeq(_sequenceLeft.get());
//       }
//     } finally {
//       isProcessing = false;
//     }
//   };

//   const start = async (
//     // h: (r: DualHandSample) => void,
//     // s?: (r: DualHandSample[]) => void,
//     onRightHand?: (h: HandSample) => void,
//     onLeftHand?: (h: HandSample) => void,
//     onRightHandSeq?: (h: HandSample[]) => void,
//     onLeftHandSeq?: (h: HandSample[]) => void,
//   ) => {
//     if (running) return;

//     // onHands = h;
//     // onSeq = s ?? null;
//     _onRightHand = onRightHand ?? null;
//     _onLeftHand = onLeftHand ?? null;
//     _onRightHandSeq = onRightHandSeq ?? null;
//     _onLeftHandSeq = onLeftHandSeq ?? null;

//     if (!video || !handLandmarker) await init();

//     running = true;
//     lastTime = 0;

//     rafId = requestAnimationFrame(loop);
//   };

//   const stop = () => {
//     running = false;
//     if (rafId) cancelAnimationFrame(rafId);
//     rafId = null;
//   };

//   const destroy = () => {
//     stop();
//     stream?.getTracks().forEach((t) => t.stop());
//     handLandmarker?.close();

//     stream = null;
//     video = null;
//     handLandmarker = null;
//   };

//   return { start, stop, destroy };
// };

import { HandLandmarker } from "@mediapipe/tasks-vision";
import { mapHands } from "../mappers/hands.mapper";
import { HandSample } from "../models/hands.model";

export type Handedness = "left" | "right";

const MAX_SEQUENCE_LENGTH = 60;

class SlidingWindow<T> {
  private buffer: T[];
  private index = 0;
  private filled = false;

  constructor(private size: number) {
    this.buffer = new Array(size);
  }

  add(value: T) {
    this.buffer[this.index] = value;
    this.index = (this.index + 1) % this.size;

    if (this.index === 0) this.filled = true;
  }

  get(): T[] {
    if (!this.filled) return this.buffer.slice(0, this.index);

    return [
      ...this.buffer.slice(this.index),
      ...this.buffer.slice(0, this.index),
    ];
  }
}

interface Params {
  handedness: Handedness;
  handLandmarker: HandLandmarker;
  stream: MediaStream;
  sequenceLength?: number;
  fps?: number;
}
export interface HandDetectionService {
  start: (
    onHand?: (h: HandSample) => void,
    onSequence?: (seq: HandSample[]) => void,
  ) => Promise<void>;
  stop: () => void;
  //destroy: () => void;
}

export const createHandDetectionService = ({
  handedness,
  handLandmarker,
  sequenceLength,
  stream,
  fps = 30,
}: Params): HandDetectionService => {
  let video: HTMLVideoElement | null = null;
  //let stream: MediaStream | null = null;

  let running = false;
  let rafId: number | null = null;

  let lastTime = 0;
  let isProcessing = false;

  let _onHand: ((h: HandSample) => void) | null = null;
  let _onSequence: ((seq: HandSample[]) => void) | null = null;

  const interval = 1000 / fps;

  let sequence: SlidingWindow<HandSample> | null = null;

  const init = async () => {
    video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.transform = "scaleX(-1)";

    video.srcObject = stream;
    await video.play();

    sequence = new SlidingWindow(sequenceLength ?? MAX_SEQUENCE_LENGTH);
  };

  const loop = (time: number) => {
    if (!running) return;

    rafId = requestAnimationFrame(loop);

    if (!video) return;
    if (isProcessing) return;
    if (time - lastTime < interval) return;

    lastTime = time;
    isProcessing = true;

    try {
      const results = handLandmarker.detectForVideo(video, time);

      const sample = mapHands({
        inference: results,
        time,
      });

      const hand = handedness === "right" ? sample.right : sample.left;

      if (!hand) return;

      _onHand?.(hand);

      if (sequence && _onSequence) {
        sequence.add(hand);
        _onSequence(sequence.get());
      }
    } finally {
      isProcessing = false;
    }
  };

  const start = async (
    onHand?: (h: HandSample) => void,
    onSequence?: (seq: HandSample[]) => void,
  ) => {
    if (running) return;

    _onHand = onHand ?? null;
    _onSequence = onSequence ?? null;

    if (!video) await init();

    running = true;
    lastTime = 0;

    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

//   const destroy = () => {
//     stop();
//     stream?.getTracks().forEach((t) => t.stop());

//     stream = null;
//     video = null;
//   };

  return { start, stop, /*destroy*/ };
};
