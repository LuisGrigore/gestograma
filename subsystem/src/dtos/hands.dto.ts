import { HandsData } from "../models/hands.model";

export type HandsPayload = {
  leftHand: HandsData | null;
  rightHand: HandsData | null;
};