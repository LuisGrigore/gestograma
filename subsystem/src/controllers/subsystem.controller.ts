// import { HandsData } from "../models/hands.model";
import { DualHandSample } from "../models/hands.model";
import { GestureDetectionService } from "../services/gesture_detection.service";
import { GodotService } from "../services/godot.service";
import { HandDetectionService } from "../services/hand_detection.service";


export const createSubsystemController = (options: {
  godotService: GodotService;
  handDetectionService: HandDetectionService;
  gestureDetectionService: GestureDetectionService;
}) => {
  const { godotService, handDetectionService, gestureDetectionService } = options;

  const handleHands = (results: DualHandSample) => {
    //godotService.sendHandData(results);
  };
  const handleHandsSequence = async (sequence: DualHandSample[]) => {
    //console.log(sequence);
	const result = await gestureDetectionService.detect(sequence)
	console.log(result)
	godotService.sendGesture(result)
  };

  godotService.onStartDataStream(() =>
    handDetectionService.start(handleHands, handleHandsSequence),
  );
  godotService.onStopDataStream(handDetectionService.stop);
};
