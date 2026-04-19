import { Landmark } from "../types/landmark.type";

export type Handedness = "left" | "right";

export type HandSample = {
  landmarks: Landmark[];
  timestamp: number;
};

export type DualHandSample = Partial<Record<Handedness, HandSample>>;

// export type HandsData = {
//   leftHand: Landmark[];
//   rightHand: Landmark[];
//   timestamp: number;
// };