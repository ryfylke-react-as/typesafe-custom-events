const PREFIX = "tsce";

let i = 0;
const generateId = () => {
  i++;
  return `${i}`;
};

type UnsubscribeFunction = () => void;
type Options = {
  target?: EventTarget;
};

export class CustomEventChannel<T> {
  constructor(name?: string, opts?: Options) {
    this.id = generateId();
    this.name = name ?? `${PREFIX}-${this.id}`;
    this.target = opts?.target ?? globalThis;
  }
  /** Target for emitting CustomEvent */
  target: EventTarget;
  /** Name of the CustomEvent and channel */
  name: string;
  /** Unique identifier for channel */
  id: string;
  /** Total amount of subscribers */
  subscriberCount: number = 0;
  /** Sends a new event to channel subscribers */
  send(args: T) {
    if (args === undefined) return;
    this.target.dispatchEvent(
      new CustomEvent(this.name, { detail: args })
    );
  }
  /** Subscribes to events from channel */
  subscribe(onEvent: (event: T) => any): UnsubscribeFunction {
    const listener = (e: Event) => {
      const event = e as Event & {
        detail?: T;
      };
      if (event.detail !== undefined) {
        onEvent(event.detail);
      }
    };
    this.target.addEventListener(this.name, listener);
    this.subscriberCount++;
    return () => {
      this.target.removeEventListener(this.name, listener);
      this.subscriberCount--;
    };
  }
}
