import {
  HandLandmarkerResult,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { Landmark } from "../types/landmark.type";
import { DualHandSample } from "../models/hands.model";

const mapLandmark = ({ x, y, z }: NormalizedLandmark): Landmark => ({
  x,
  y,
  z,
});

const mapLandmarks = (landmarks: NormalizedLandmark[]) =>
  landmarks.map(mapLandmark);

const getHand = (
  landmarks: NormalizedLandmark[][],
  handedness: any[],
  type: "Left" | "Right"
) => {
  const idx = handedness.findIndex(
    (h) => h[0]?.categoryName === type
  );

  if (idx === -1) return [];

  return landmarks[idx] ?? [];
};

export const mapHands = (
  result: {
    inference: HandLandmarkerResult;
    time: number;
  }
): DualHandSample => {
  const { inference, time } = result;

  const landmarks = inference.landmarks ?? [];
  const handedness = inference.handedness ?? [];

  const left = getHand(landmarks, handedness, "Left");
  const right = getHand(landmarks, handedness, "Right");

  return {
    left: {
      landmarks: mapLandmarks(left),
      timestamp: time,
    },
    right: {
      landmarks: mapLandmarks(right),
      timestamp: time,
    },
  };
};