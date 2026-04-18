
import {
	FilesetResolver,
	HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

export type HandsDetectorOptions = {
  onResults: (results: HandLandmarkerResult, time: number) => void;
};

export const createHandsDetector = (options: HandsDetectorOptions) => {
  let video: HTMLVideoElement | null = null;
  let stream: MediaStream | null = null;
  let handLandmarker: HandLandmarker | null = null;

  let running = false;
  let rafId: number | null = null;

  let lastTime = 0;
  let isProcessing = false;

  const FPS = 30;
  const interval = 1000 / FPS;

  const init = async () => {
	video = document.createElement("video");
	video.autoplay = true;
	video.playsInline = true;

	const vision = await FilesetResolver.forVisionTasks(
	  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
	);

	handLandmarker = await HandLandmarker.createFromOptions(vision, {
	  baseOptions: {
		modelAssetPath:
		  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
		delegate: "GPU",
	  },
	  runningMode: "VIDEO",
	  numHands: 2,
	});

	stream = await navigator.mediaDevices.getUserMedia({
	  video: { width: 320, height: 240 },
	});

	video.srcObject = stream;

	await video.play();
  };

  const loop = (time: number) => {
	if (!running) return;

	rafId = requestAnimationFrame(loop);

	if (!video || !handLandmarker) return;
	if (isProcessing) return;
	if (time - lastTime < interval) return;

	lastTime = time;
	isProcessing = true;

	const results = handLandmarker.detectForVideo(video, time);

	isProcessing = false;

	options.onResults(results, time);
  };

  const start = async () => {
	if (running) return;

	if (!video || !handLandmarker) {
	  await init();
	}

	running = true;
	rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
	running = false;

	if (rafId !== null) {
	  cancelAnimationFrame(rafId);
	  rafId = null;
	}
  };

  const destroy = () => {
	stop();

	stream?.getTracks().forEach((t) => t.stop());
	stream = null;

	handLandmarker?.close();
	handLandmarker = null;

	video = null;
  };

  return {
	start,
	stop,
	destroy,
  };
};