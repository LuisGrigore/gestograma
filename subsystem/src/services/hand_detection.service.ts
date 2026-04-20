import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

import { mapHands } from "../mappers/hands.mapper";
import { DualHandSample } from "../models/hands.model";

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
  sequenceLength?: number;
  camera?: { width: number; height: number };
  fps?: number;
}

export interface HandDetectionService {
  start: (
    onHands: (results: DualHandSample) => void,
    onSequence?: (results: DualHandSample[]) => void
  ) => Promise<void>;
  stop: () => void;
  destroy: () => void;
}

export const createHandsDetectionService = ({
  sequenceLength,
  camera = { width: 320, height: 240 },
  fps = 30,
}: Params): HandDetectionService => {
  let video: HTMLVideoElement | null = null;
  let stream: MediaStream | null = null;
  let handLandmarker: HandLandmarker | null = null;

  let running = false;
  let rafId: number | null = null;

  let lastTime = 0;
  let isProcessing = false;

  let onHands: ((h: DualHandSample) => void) | null = null;
  let onSeq: ((h: DualHandSample[]) => void) | null = null;

  const interval = 1000 / fps;

  let sequence: SlidingWindow<DualHandSample> | null = null;

  const init = async () => {
    video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.transform = "scaleX(-1)";

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    stream = await navigator.mediaDevices.getUserMedia({
      video: camera,
    });

    video.srcObject = stream;
    await video.play();

    sequence = new SlidingWindow(
      sequenceLength ?? MAX_SEQUENCE_LENGTH
    );
  };

  const loop = (time: number) => {
    if (!running) return;

    rafId = requestAnimationFrame(loop);

    if (!video || !handLandmarker) return;
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

      onHands?.(sample);

      if (sequence && onSeq) {
        sequence.add(sample);
        onSeq(sequence.get());
      }
    } finally {
      isProcessing = false;
    }
  };

  const start = async (
    h: (r: DualHandSample) => void,
    s?: (r: DualHandSample[]) => void
  ) => {
    if (running) return;

    onHands = h;
    onSeq = s ?? null;

    if (!video || !handLandmarker) await init();

    running = true;
    lastTime = 0;

    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const destroy = () => {
    stop();
    stream?.getTracks().forEach((t) => t.stop());
    handLandmarker?.close();

    stream = null;
    video = null;
    handLandmarker = null;
  };

  return { start, stop, destroy };
};