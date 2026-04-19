import { GodotEventBus } from "../EventBus";
import { HandsData } from "../models/hands.model";

export interface GodotService {
  sendHandData: (handData: HandsData) => void;
  sendGesture: (callback: any) => void;
  onStartGestureSend: (callback: () => void) => void;
  onStopGestureSend: (callback: () => void) => void;
  onStartHandDataSend: (callback: () => void) => void;
  onStopHandDataSend: (callback: () => void) => void;
}

export const createGodotService = (bus: GodotEventBus): GodotService => {
  const onStartGestureSend = (startGestureSendHandler: () => void) => {
    bus.onEventFromGodot("StartGestureSend", startGestureSendHandler);
  };

  const onStopGestureSend = (stopGestureSendHandler: () => void) => {
    bus.onEventFromGodot("StopGestureSend", stopGestureSendHandler);
  };

  const onStartHandDataSend = (startHandDataSendHandler: () => void) => {
    bus.onEventFromGodot("StartHandDataSend", startHandDataSendHandler);
  };

  const onStopHandDataSend = (stopHandDataSendHandler: () => void) => {
    bus.onEventFromGodot("StopHandDataSend", stopHandDataSendHandler);
  };

  const sendHandData = (handData: HandsData) => {
    bus.sendEventToGodot("HandData", handData);
  };
  const sendGesture = (gesture: any) => {
    bus.sendEventToGodot("Gesture", gesture);
  };

  return {
    sendHandData,
    sendGesture,
    onStartGestureSend,
    onStopGestureSend,
    onStartHandDataSend,
    onStopHandDataSend,
  };
};
