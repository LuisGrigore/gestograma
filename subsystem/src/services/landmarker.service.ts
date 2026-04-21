import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { DualHandSample } from "../models/hands.model";
import { createPublisher, Publisher } from "../pub_sub/pub";
import { CameraService, CameraFrame } from "./camera.service";
import { mapHands } from "../mappers/hands.mapper";
import { Subscriber } from "../pub_sub/sub";

export interface LandmarkerService {
  start: () => Promise<void>;
  stop: () => void;
  subscribe: (subscriber: Subscriber<DualHandSample>) => () => void;
}

interface InitParams {
  wasmPath?: string;
  modelPath?: string;
  numHands?: number;
  cameraService: CameraService;
}

export const createMediapipeLandmarkerService = async ({
  wasmPath = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  modelPath = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  numHands = 2,
  cameraService,
}: InitParams): Promise<LandmarkerService> => {
  const publisher = createPublisher<DualHandSample>();

  const vision = await FilesetResolver.forVisionTasks(wasmPath);

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands,
  });

  let unsubscribe: (() => void) | null = null;
  let running = false;
  let isProcessing = false;

  const start = async () => {
    if (running) return;

    //await cameraService.init();

    unsubscribe = cameraService.subscribe({
      canConsume: true,
      consume: ({ video, time }: CameraFrame) => {
        if (isProcessing) return;

        isProcessing = true;

        try {
          const results = handLandmarker.detectForVideo(video, time);

          const sample: DualHandSample = mapHands({
            inference: results,
            time,
          });

          publisher.publish(sample);
        } finally {
          isProcessing = false;
        }
      },
    });
   // cameraService.start();
    running = true;
  };

  const stop = () => {
    if (!running) return;

    unsubscribe?.();
    unsubscribe = null;

    //cameraService.stop();
    running = false;
  };

  return {
    subscribe: publisher.subscribe,
    start,
    stop,
  };
};
