import { Subscriber } from "./sub";

export interface Publisher<T> {
  subscribe: (subscriber: Subscriber<T>) => () => void;
  publish: (event: T) => void;
}

export const createPublisher = <T>(): Publisher<T> => {
  const subscribers: Subscriber<T>[] = [];

  const subscribe = (subscriber: Subscriber<T>) => {
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  const publish = (event: T) => {
    subscribers.forEach((subscriber) => {
      if (subscriber.canConsume) {
        subscriber.consume(event);
      }
    });
  };

  return {
    subscribe,
    publish,
  };
};