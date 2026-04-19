// import { HandsData } from "../models/hands.model";
import { DualHandSample } from "../models/hands.model";
import { GodotService } from "../services/godot.service";
import { HandDetectionService } from "../services/hand_detection.service";
import { Landmark } from "../types/landmark.type";
import * as tf from "@tensorflow/tfjs";

const landmarksToTensor = (landmarks: Landmark[]) => {
  return tf.tensor2d(landmarks.map((l) => [l.x, l.y, l.z]));
};

const getCentroid = (landmarks: Landmark[]) => {
  const tensor = landmarksToTensor(landmarks);
  return tensor.mean(0);
};

const centerLandmarks = (landmarks: Landmark[]) => {
  const tensor = landmarksToTensor(landmarks);
  const centroid = tensor.mean(0);

  return tensor.sub(centroid);
};

export const createSubsystemController = (options: {
  godotService: GodotService;
  handDetectionService: HandDetectionService;
}) => {
  const { godotService, handDetectionService } = options;

  const handleHands = (results: DualHandSample) => {
    godotService.sendHandData(results);
  };
  const handleHandsSequence = (sequence: DualHandSample[]) => {
    console.log(sequence);
  };

  godotService.onStartDataStream(() => handDetectionService.start(handleHands, handleHandsSequence));
  godotService.onStopDataStream(handDetectionService.stop);
};
