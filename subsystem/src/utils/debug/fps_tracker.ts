export const createFpsTracker = () => {
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