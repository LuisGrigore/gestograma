export type ClassificationModelResult<C> = {
  class: C;
  confidence: number;
} | null;

export interface ClassificationModel<T, C> {
  classify: (input: T) => Promise<ClassificationModelResult<C>>;
  destroy: () => void;
}

export const withQueue = <T, C>(
  model: ClassificationModel<T, C>,
): ClassificationModel<T, C> => {
  let queue: Promise<void> = Promise.resolve();

  return {
    destroy: model.destroy,

    classify: (input: T) => {
      const job = queue.then(() => model.classify(input));
      queue = job.then(
        () => {},
        () => {},
      );

      return job;
    },
  };
};

export const withDrop = <T, C>(
  model: ClassificationModel<T, C>,
): ClassificationModel<T, C | null> => {
  let running = false;

  return {
    destroy: model.destroy,

    classify: async (input: T) => {
      if (running) return null;

      running = true;
      try {
        return await model.classify(input);
      } finally {
        running = false;
      }
    },
  };
};

export const withReplaceLatest = <T, C>(
  model: ClassificationModel<T, C>,
): ClassificationModel<T, C> => {
  let running = false;
  let nextInput: T | null = null;

  const run = async (input: T): Promise<ClassificationModelResult<C>> => {
    running = true;

    try {
      let currentInput: T | null = input;
      let result: ClassificationModelResult<C>;

      while (currentInput) {
        result = await model.classify(currentInput);
        currentInput = nextInput;
        nextInput = null;
      }

      return result!;
    } finally {
      running = false;
    }
  };

  return {
    destroy: model.destroy,

    classify: (input: T) => {
      if (!running) {
        return run(input);
      }

      nextInput = input;

      return new Promise((resolve) => {
        const check = () => {
          if (!running && nextInput === null) {
            model.classify(input).then(resolve);
          } else {
            setTimeout(check, 0);
          }
        };
        check();
      });
    },
  };
};
