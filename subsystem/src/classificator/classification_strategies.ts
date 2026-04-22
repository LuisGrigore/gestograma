import { ClassificationModel } from "./classification_models";

export interface ClassificationStrategy {
  schedule<T, R>(task: () => Promise<R>): Promise<R>;
}

export const queueStrategy = (): ClassificationStrategy => {
  let chain: Promise<any> = Promise.resolve();

  return {
    schedule(task) {
      const run = chain.then(task);
      chain = run.catch(() => {});
      return run;
    },
  };
};

export const dropStrategy = (): ClassificationStrategy => {
  let running = false;

  return {
    schedule(task) {
      if (running) {
        return Promise.resolve(null as any);
      }

      running = true;

      return task().finally(() => {
        running = false;
      });
    },
  };
};

export const replaceLatestStrategy = (): ClassificationStrategy => {
  let running = false;
  let latest: (() => Promise<any>) | null = null;

  return {
    schedule(task) {
      if (running) {
        latest = task;
        return new Promise((resolve) => {
          const check = async () => {
            if (!running && latest === null) {
              resolve(await task());
            } else {
              setTimeout(check, 0);
            }
          };
          check();
        });
      }

      running = true;

      const run = async () => {
        let current: (() => Promise<any>) | null = task;

        let result: any;

        while (current) {
          result = await current();
          current = latest;
          latest = null;
        }

        running = false;
        return result;
      };

      return run();
    },
  };
};

export const withStrategy = <T, C>(
  model: ClassificationModel<T, C>,
  strategy: ClassificationStrategy,
): ClassificationModel<T, C> => {
  return {
    destroy: model.destroy,

    classify: (input: T) => {
      return strategy.schedule(() => model.classify(input));
    },
  };
};
