import { GodotEventBus } from "./EventBus";
import { createFpsTracker } from "./utils/debug/fps_tracker";
import { createHandsDetectionService } from "./services/hand_detection.service";
import { createGodotService } from "./services/godot.service";
import { createSubsystemController } from "./controllers/subsystem.controller";

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
  const fpsTracker = createFpsTracker();
  const handDetectionService = createHandsDetectionService({fpsTracker:fpsTracker, sequenceLength: 5});

  createSubsystemController({godotService, handDetectionService})


  setupInput(bus);
  setupGodotEvents(bus);

};
