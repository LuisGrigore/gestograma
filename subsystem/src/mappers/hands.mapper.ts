import { HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { Landmark } from "../types/landmark.type";
import { HandsData } from "../models/hands.model";

const mapLandmark = ({ x, y, z }: NormalizedLandmark) => ({
  x,
  y,
  z,
});

const mapLandmarks = (landmarks: NormalizedLandmark[]) =>
  landmarks.map(mapLandmark);


export const mapHands = (result: {
  inference: HandLandmarkerResult;
  time: number;
}):HandsData => {
  const { inference, time } = result;
  const landmarks = inference.landmarks ?? [];
  const handedness = inference.handedness ?? [];

  const leftHand: Landmark[] = mapLandmarks(
    landmarks.filter((_, i) => handedness[i][0].categoryName === "Left")[0] ||
      [],
  );

  const rightHand: Landmark[] = mapLandmarks(
    landmarks.filter((_, i) => handedness[i][0].categoryName === "Right")[0] ||
      [],
  );

  return {
    leftHand,
    rightHand,
    timestamp: time,
  };
};
