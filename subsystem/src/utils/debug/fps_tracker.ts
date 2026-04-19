
export type FpsTracker = (time:number) => void

export const createFpsTracker = ():FpsTracker => {
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