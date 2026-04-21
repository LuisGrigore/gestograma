interface CameraParams {
  width?: number;
  height?: number;
}

export interface CameraService {
  init: () => Promise<MediaStream>;
  stop: () => void;
  getStream: () => MediaStream | null;
}

export const createCameraService = ({
  width = 320,
  height = 240,
}: CameraParams = {}): CameraService => {
  let stream: MediaStream | null = null;

  const init = async () => {
    if (stream) return stream;

    stream = await navigator.mediaDevices.getUserMedia({
      video: { width, height },
    });

    return stream;
  };

  const stop = () => {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  };

  const getStream = () => stream;

  return { init, stop, getStream };
};