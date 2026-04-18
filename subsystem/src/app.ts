import { GodotEventBus } from "./EventBus";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { mapHands } from "./mappers/hands.mapper";
import { createFpsTracker } from "./utils/debug/fps_tracker";
import { createHandsDetectionService } from "./services/hand_detection.service";
import { createGodotService } from "./services/godot.service";

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
  const godotService = createGodotService(bus);

  const trackFps = createFpsTracker();
  const handleHands = (results: HandLandmarkerResult, time: number) => {
    trackFps(time);

    if (results.landmarks.length === 0 && results.handedness.length === 0)
      return;

    godotService.sendHandData(mapHands({ inference: results, time }));
  };

  const handDetectionService = createHandsDetectionService({
    onResults: handleHands,
  });

  godotService.onStartHandDataSend(handDetectionService.start)
  godotService.onStopHandDataSend(handDetectionService.stop)

  setupInput(bus);
  setupGodotEvents(bus);

};
