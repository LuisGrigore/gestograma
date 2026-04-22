import { GodotEventBus } from "./EventBus";
import { createFpsTracker } from "./utils/debug/fps_tracker";
import { createHandDetectionService } from "./services/hand_detection.service";
import { createGodotService } from "./services/godot.service";
import { createSubsystemController } from "./controllers/subsystem.controller";
import { createGestureClassificationModel } from "./classification/gesture_classification_model";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { InferenceSession } from "onnxruntime-web";
import { createCameraService } from "./services/camera.service";
import { createMediapipeLandmarkerService } from "./services/landmarker.service";
import { Gesture } from "./types/gesture.type";

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


const RIGHT_GESTURES: Gesture[] = ["A", "B", "C", "NONE"];
const LEFT_GESTURES: Gesture[] = ["NONE"];

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

  const rightGestureDetectionService = await createGestureClassificationModel({
    gestures: RIGHT_GESTURES,
	onnxModelPath: "./models/right/model.onnx",
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
