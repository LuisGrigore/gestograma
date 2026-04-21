import { HandSample } from "../models/hands.model";
import { GestureDetectionService } from "../services/gesture_detection.service";
import { GodotService } from "../services/godot.service";
import { HandDetectionService } from "../services/hand_detection.service";

export const createSubsystemController = (options: {
  godotService: GodotService;
  rightHandDetectionService: HandDetectionService;
  leftHandDetectionService: HandDetectionService;
  rightGestureDetectionService: GestureDetectionService;
}) => {
  const {
    godotService,
    rightHandDetectionService,
    leftHandDetectionService,
    rightGestureDetectionService,
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
      const result = await rightGestureDetectionService.detect(sequence);
      console.log("RIGHT:", result);

      //godotService.sendGesture(result);
    },
  });

  godotService.onStartDataStream(async () => {
    await rightHandDetectionService.start();
    await leftHandDetectionService.start();
  });

  godotService.onStopDataStream(() => {
    rightHandDetectionService.stop();
    leftHandDetectionService.stop();
  });
};
