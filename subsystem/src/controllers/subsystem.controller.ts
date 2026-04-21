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


  const handleRightHand = (hand: HandSample) => {

  };

  const handleRightSequence = async (sequence: HandSample[]) => {
    const result = await rightGestureDetectionService.detect(sequence);
    console.log("RIGHT:", result);

    //godotService.sendGesture(result);
  };


  const handleLeftHand = (hand: HandSample) => {

  };

  const handleLeftSequence = async (sequence: HandSample[]) => {

  };


  godotService.onStartDataStream(() => {
    rightHandDetectionService.start(
      handleRightHand,
      handleRightSequence,
    );

    leftHandDetectionService.start(
      handleLeftHand,
      handleLeftSequence,
    );
  });

  godotService.onStopDataStream(() => {
    rightHandDetectionService.stop();
    leftHandDetectionService.stop();
  });
};