import { HandsData } from "../models/hands.model";
import { GodotService } from "../services/godot.service";
import { HandDetectionService } from "../services/hand_detection.service";

export const createSubsystemController = (options: {
  godotService: GodotService;
  handDetectionService: HandDetectionService;
}) => {
  const { godotService, handDetectionService } = options;

  const handleHands = (results: HandsData) =>
    godotService.sendHandData(results);

  godotService.onStartHandDataSend(() =>
    handDetectionService.start(handleHands),
  );
  godotService.onStopHandDataSend(handDetectionService.stop);
};
