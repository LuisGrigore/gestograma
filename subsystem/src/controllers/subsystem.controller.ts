import { HandSample } from "../models/hands.model";
import { CameraService } from "../services/camera.service";
import { GestureClassificationModel } from "../classification/gesture_classification_model";
import { GodotService } from "../services/godot.service";
import { HandDetectionService } from "../services/hand_detection.service";
import { LandmarkerService } from "../services/landmarker.service";

export const createSubsystemController = (options: {
  godotService: GodotService;
  rightHandDetectionService: HandDetectionService;
  leftHandDetectionService: HandDetectionService;
  rightGestureDetectionService: GestureClassificationModel;
  cameraService: CameraService;
  landmarkerService: LandmarkerService;
}) => {
  const {
    godotService,
    rightHandDetectionService,
    leftHandDetectionService,
    rightGestureDetectionService,
    cameraService,
    landmarkerService,
  } = options;

  rightHandDetectionService.suscribeHand({
    canConsume: true,
    consume: (hand: HandSample) => {
      //godotService.sendGesture(result);
    },
  });

  rightHandDetectionService.suscribeHandSequence({
    canConsume: true,
    consume: async (sequence: HandSample[]) => {
      const result = await rightGestureDetectionService.classify(sequence);
      if (result) {
        console.log("RIGHT:", result.class);
        godotService.sendGesture(result.class);
      }
    },
  });

  godotService.onStartDataStream(async () => {
    await cameraService.start();
    await landmarkerService.start();
    await rightHandDetectionService.start();
    await leftHandDetectionService.start();
  });

  godotService.onStopDataStream(() => {
    rightHandDetectionService.stop();
    leftHandDetectionService.stop();
    landmarkerService.stop();
    cameraService.stop();
  });
};
