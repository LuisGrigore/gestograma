import { GodotEventBus } from "./EventBus";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

type Message = {
  content: string;
};

export const startApp = async () => {
  const bus = new GodotEventBus();

  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  console.log("Hands model loaded");

  // -----------------------------
  // Detection loop
  // -----------------------------
  let lastTime = 0;
  const FPS = 30;
  const interval = 1000 / FPS;

  const detectHands = (time: number = 0) => {
    requestAnimationFrame(detectHands);

    if (time - lastTime < interval) return;
    lastTime = time;

    const results = handLandmarker.detectForVideo(video, time);

    // ✅ SOLO enviar si hay detección real
    const hands = results.landmarks ?? [];

    if (hands.length > 0) {
      bus.sendEventToGodot("hands", {
        hands,
        world: results.worldLandmarks ?? [],
        timestamp: time,
      });
    }
  };

  // -----------------------------
  // Camera
  // -----------------------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
      },
    });

    video.srcObject = stream;

    video.onloadeddata = () => {
      requestAnimationFrame(detectHands);
    };
  };

  // -----------------------------
  // Messages from Godot
  // -----------------------------
  const onMessage = (message: unknown) => {
    const msg = message as Message;
    console.log(msg.content);
  };

  // -----------------------------
  // Keyboard → Godot
  // -----------------------------
  document.addEventListener("keydown", (event) => {
    bus.sendEventToGodot("input", event.key);
  });

  // -----------------------------
  // Godot → Web
  // -----------------------------
  bus.onEventFromGodot("Message", onMessage);

  await startCamera();
};