import { GodotEventBus } from "./EventBus";
import {
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

import { HandsData } from "./models/hands.model";
import { createHandsDetector } from "./services/hand_detection.service";
import { map_hands } from "./mappers/hands.mapper";


export type HandsPayload = {
  leftHand: HandsData | null;
  rightHand: HandsData | null;
};

const createFpsTracker = () => {
  let frameCount = 0;
  let lastTime = performance.now();

  return (time: number) => {
    frameCount++;

    if (time - lastTime >= 1000) {
      console.log("Inference FPS:", frameCount);
      frameCount = 0;
      lastTime = time;
    }
  };
};


const setupInput = (bus: GodotEventBus) => {
  document.addEventListener("keydown", (event) => {
    bus.sendEventToGodot("input", event.key);
  });
};


const setupGodotEvents = (bus: GodotEventBus) => {
  bus.onEventFromGodot("Message", (message: unknown) => {
    console.log((message as any).content);
  });
};


export const startApp = async () => {
  const bus = new GodotEventBus();

  setupInput(bus);
  setupGodotEvents(bus);

  const trackFps = createFpsTracker();

  const handleHands = (results: HandLandmarkerResult, time: number) => {
    trackFps(time);

    if (results.landmarks.length === 0 && results.handedness.length === 0)
      return;

    bus.sendEventToGodot("hands", map_hands({ inference: results, time }));
  };


  const detector = createHandsDetector({
    onResults: handleHands,
  });

  await detector.start();

  bus.onEventFromGodot("StartHands", () => {
    detector.start();
  });

  bus.onEventFromGodot("StopHands", () => {
    detector.stop();
  });
};
