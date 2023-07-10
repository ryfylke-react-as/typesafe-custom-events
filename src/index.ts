const PREFIX = "tsce";

let i = 0;
const generateId = () => {
  i++;
  return `${i}`;
};

type UnsubscribeFunction = () => void;

export class CustomEventChannel<T> {
  /** Name of the CustomEvent and channel */
  name: string;
  /** Unique identifier for channel */
  id: string;
  /** Sends a new event to channel subscribers */
  send: (args: T) => void;
  /** Subscribes to events from channel */
  subscribe: (onEvent: (event: T) => any) => UnsubscribeFunction;
  /** Total amount of subscribers */
  subscriberCount: number = 0;

  constructor(name?: string) {
    this.id = generateId();
    this.name = name ?? `${PREFIX}-${this.id}`;
    this.send = (args: T) => {
      if (args === undefined) return;
      document.dispatchEvent(
        new CustomEvent(this.name, { detail: args })
      );
    };
    this.subscribe = (
      onEvent: (event: T) => void
    ): UnsubscribeFunction => {
      const listener = (e: Event) => {
        const event = e as Event & {
          detail?: T;
        };
        if (event.detail !== undefined) {
          onEvent(event.detail);
        }
      };
      document.addEventListener(this.name, listener);
      this.subscriberCount++;
      return () => {
        document.removeEventListener(this.name, listener);
        this.subscriberCount--;
      };
    };
  }
}
