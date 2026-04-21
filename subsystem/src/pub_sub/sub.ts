export interface Subscriber<T> {
  canConsume: boolean;
  consume: (event: T) => void;
}
