import { DualHandSample, HandSample } from "../models/hands.model";
import { LandmarkerService } from "./landmarker.service";
import { createPublisher } from "../pub_sub/pub";
import { Subscriber } from "../pub_sub/sub";

export type Handedness = "left" | "right";

const MAX_SEQUENCE_LENGTH = 60;
class SlidingWindow<T> {
  private buffer: T[];
  private index = 0;
  private filled = false;

  constructor(private size: number) {
    this.buffer = new Array(size);
  }

  add(value: T) {
    this.buffer[this.index] = value;
    this.index = (this.index + 1) % this.size;

    if (this.index === 0) this.filled = true;
  }

  isFilled() {
    return this.filled;
  }

  get(): T[] {
    if (!this.filled) return this.buffer.slice(0, this.index);

    return [
      ...this.buffer.slice(this.index),
      ...this.buffer.slice(0, this.index),
    ];
  }
}

interface Params {
  handedness: Handedness;
  landmarkerService: LandmarkerService;
  sequenceLength?: number;
}

export interface HandDetectionService {
  start: () => void;
  stop: () => void;
  suscribeHand: (suscriber: Subscriber<HandSample>) => () => void;
  suscribeHandSequence: (suscriber: Subscriber<HandSample[]>) => void;
}

export const createHandDetectionService = ({
  handedness,
  landmarkerService,
  sequenceLength,
}: Params): HandDetectionService => {
  const handPublisher = createPublisher<HandSample>();
  const handSequencePublisher = createPublisher<HandSample[]>();
  const handSequence = new SlidingWindow<HandSample>(
    sequenceLength ?? MAX_SEQUENCE_LENGTH,
  );

  let unsuscribe: (() => void) | null = null;
  let sequenceStarted = false;

  const start = async () => {
    unsuscribe = landmarkerService.subscribe({
      canConsume: true,
      consume: (dualHandSample: DualHandSample) => {
        const hand =
          handedness === "right" ? dualHandSample.right : dualHandSample.left;

        if (!hand || hand?.landmarks.length == 0) return;
        handPublisher.publish(hand);

        handSequence.add(hand);

        if (!sequenceStarted && handSequence.isFilled()) {
          sequenceStarted = true;
          handSequencePublisher.publish(handSequence.get());
        }

        if (sequenceStarted) {
          handSequencePublisher.publish(handSequence.get());
        }
      },
    });

    await landmarkerService.start();
  };

  const stop = () => {
    unsuscribe?.();
    landmarkerService.stop();
  };

  return {
    start,
    stop,
    suscribeHand: handPublisher.subscribe,
    suscribeHandSequence: handSequencePublisher.subscribe,
  };
};
