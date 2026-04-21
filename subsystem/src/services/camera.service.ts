import { createPublisher, Publisher } from "../pub_sub/pub";
import { Subscriber } from "../pub_sub/sub";

export type CameraFrame = {
  video: HTMLVideoElement;
  time: number;
};

interface CameraParams {
  width?: number;
  height?: number;
  fps?: number;
}

export interface CameraService{
  init: () => Promise<void>;
  start: () => void;
  stop: () => void;
  getVideo: () => HTMLVideoElement | null;
  subscribe: (subscriber:Subscriber<CameraFrame>) => () => void;
}

export const createCameraService = ({
  width = 320,
  height = 240,
  fps = 30,
}: CameraParams = {}): CameraService => {
  const publisher = createPublisher<CameraFrame>();

  let stream: MediaStream | null = null;
  let video: HTMLVideoElement | null = null;

  let rafId: number | null = null;
  let running = false;

  let lastTime = 0;
  const interval = 1000 / fps;

  const init = async () => {
    if (stream) return;

    stream = await navigator.mediaDevices.getUserMedia({
      video: { width, height },
    });

    video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.transform = "scaleX(-1)";
    video.srcObject = stream;

    await video.play();
  };

  const loop = (time: number) => {
    if (!running) return;

    rafId = requestAnimationFrame(loop);

    if (!video) return;
    if (time - lastTime < interval) return;

    lastTime = time;

    publisher.publish({
      video,
      time,
    });
  };

  const start = () => {
    if (running) return;
    if (!video) throw new Error("Camera not initialized");

    running = true;
    lastTime = 0;

    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    stream?.getTracks().forEach((t) => t.stop());

    stream = null;
    video = null;
  };

  const getVideo = () => video;

  return {
    subscribe:publisher.subscribe,
    init,
    start,
    stop,
    getVideo,
  };
};