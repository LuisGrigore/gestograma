import { GodotEventBus } from "./EventBus";
import { createFpsTracker } from "./utils/debug/fps_tracker";
import { createHandDetectionService } from "./services/hand_detection.service";
import { createGodotService } from "./services/godot.service";
import { createSubsystemController } from "./controllers/subsystem.controller";
import { createGestureDetectionService } from "./services/gesture_detection.service";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { InferenceSession } from "onnxruntime-web";
import { createCameraService } from "./services/camera.service";
import { createMediapipeLandmarkerService } from "./services/landmarker.service";

const setupInput = (bus: GodotEventBus) => {
  document.addEventListener("keydown", (event) => {
    bus.sendEventToGodot("Gesture", event.key);
  });
};

const setupGodotEvents = (bus: GodotEventBus) => {
  bus.onEventFromGodot("Message", (message: unknown) => {
    console.log((message as any).content);
  });
};

interface InitParams {
  wasmPath?: string;
  modelPath?: string;
  numHands?: number;
}

export const createHandLandmarker = async ({
  wasmPath = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  modelPath = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  numHands = 2,
}: InitParams = {}): Promise<HandLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(wasmPath);

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands,
  });

  return handLandmarker;
};

export const startApp = async () => {
  const bus = new GodotEventBus();

  const godotService = createGodotService(bus);

  const fpsTracker = createFpsTracker();

  const cameraService = createCameraService({ fps: 18 });
  const landmarkerService = await createMediapipeLandmarkerService({
    cameraService,
  });
  const rightHandDetectionService = createHandDetectionService({
    handedness: "right",
    sequenceLength: 20,
    landmarkerService: landmarkerService,
  });
  const leftHandDetectionService = createHandDetectionService({
    handedness: "left",
    sequenceLength: 20,
    landmarkerService: landmarkerService,
  });

  const rightGestureDetectionService = await createGestureDetectionService({
    handedness: "right",
    session: await InferenceSession.create("./models/right/model.onnx", {
      executionProviders: ["wasm"],
    }),
    confidenceThreshold: 0.7,
  });

  createSubsystemController({
    godotService,
    rightHandDetectionService,
    leftHandDetectionService,
    rightGestureDetectionService,
    cameraService,
    landmarkerService,
  });

  setupInput(bus);
  setupGodotEvents(bus);
};
