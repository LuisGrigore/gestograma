import { GodotEventBus } from "../EventBus";
import { DualHandSample } from "../models/hands.model";
// import { HandsData } from "../models/hands.model";

export interface GodotService {
  sendHandData: (handData: DualHandSample) => void;
  sendGesture: (callback: any) => void;
  onStartDataStream: (callback: () => void) => void;
  onStopDataStream: (callback: () => void) => void;
}

export const createGodotService = (bus: GodotEventBus): GodotService => {
  const onStartDataStream = (startDataStreamHandler: () => void) => {
    bus.onEventFromGodot("StartDataStream", startDataStreamHandler);
  };
    const onStopDataStream = (stopDataStreamHandler: () => void) => {
    bus.onEventFromGodot("StopDataStream", stopDataStreamHandler);
  };

  const sendHandData = (handData: DualHandSample) => {
    bus.sendEventToGodot("HandData", handData);
  };
  const sendGesture = (gesture: any) => {
    bus.sendEventToGodot("Gesture", gesture);
  };

  return {
    sendHandData,
    sendGesture,
    onStartDataStream,
	onStopDataStream,
  };
};
