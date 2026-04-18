import { Landmark } from "../types/landmark.type";

export type HandsData = {
  leftHand: Landmark[];
  rightHand: Landmark[];
  timestamp: number;
};