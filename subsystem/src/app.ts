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
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU", // 🔥 CLAVE
    },
    runningMode: "VIDEO",
    numHands: 2,
  });
  console.log("Hands model loaded");

  // -----------------------------
  // FPS tracking
  // -----------------------------
  //   let frameCount = 0;
  //   let lastFpsTime = performance.now();

  // -----------------------------
  // Detection loop
  // -----------------------------
  let lastTime = 0;
  let isProcessing = false;

  const FPS = 30;
  const interval = 1000 / FPS;

  let frameCount = 0;
  let lastFpsTime = performance.now();

  const detectHands = (time: number = 0) => {
    requestAnimationFrame(detectHands);

    // evitar múltiples inferencias simultáneas
    if (isProcessing) return;

    // control de FPS
    if (time - lastTime < interval) return;
    lastTime = time;

    isProcessing = true;

    const results = handLandmarker.detectForVideo(video, time);

    isProcessing = false;

    // -----------------------------
    // FPS counter
    // -----------------------------
    frameCount++;

    if (time - lastFpsTime >= 1000) {
      console.log("Inference FPS:", frameCount);
      frameCount = 0;
      lastFpsTime = time;
    }

    // -----------------------------
    // Procesar manos
    // -----------------------------
    const landmarks = results.landmarks ?? [];
    const world = results.worldLandmarks ?? [];
    const handedness = results.handedness ?? [];

    let leftHand = null;
    let rightHand = null;

    for (let i = 0; i < landmarks.length; i++) {
      const label = handedness[i]?.[0]?.categoryName;

      const handData = {
        landmarks: landmarks[i],
        world: world[i],
        timestamp: time,
      };

      if (label === "Left") {
        leftHand = handData;
      } else if (label === "Right") {
        rightHand = handData;
      }
    }

    // -----------------------------
    // Enviar a Godot
    // -----------------------------
    if (leftHand || rightHand) {
      bus.sendEventToGodot("hands", {
        leftHand,
        rightHand,
      });
    }
  };

  // -----------------------------
  // Camera
  // -----------------------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 320,
        height: 240,
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
