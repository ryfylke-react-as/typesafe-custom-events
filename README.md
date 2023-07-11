# Typesafe CustomEvents

> Lets you easily set up typesafe [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) channels in Typescript.

## Install

💾 ~[**0.67KB**](https://bundlephobia.com/package/typesafe-custom-events) minified, no additional dependencies.

```bash
npm i typesafe-custom-events
```

You can also alternatively copy/paste the source directly from [here](#source).

## Use

You can create typesafe custom events by setting up a new channel.

### Creating a new channel

```typescript
import { CustomEventChannel } from "typesafe-custom-events";

type Toast = {
  title: string;
  status: "info" | "error";
};

const toastChannel = new CustomEventChannel<Toast>();
```

By passing a generic, you enforce a certain type for the custom event messages.

### Listening for new events

```typescript
// Start listening for events
const unsubscribe = toastChannel.subscribe((event) => {
  // Do something when channel receives event
});

// Stop listening for events
unsubscribe();
```

### Sending events

```typescript
toastChannel.send({
  title: "Foobar",
  status: "info",
});
```

### Reference

You can create a new `CustomEventChannel` using the following arguments:

```typescript
const name: string = "custom-channel-name"; // optional

const options: {
  target?: EventTarget; // default: `globalThis`
} = {}; // optional

const channel = new CustomEventChannel(name, options);
```

A `CustomEventChannel` instance contains the following properties:

- **send** `(event: T) => void` Send event to channel
- **subscribe** `(onEvent: ((onEvent) => void)) => UnsubscribeFunction` Subscribes to the given channel
- **name** `string` The channel name used to send and receive CustomEvents.
- **id** `string` A unique identifier for the channel
- **subscriberCount** `number` The current number of subscribers to the channel

## Source

The following is the entire library source, if you prefer - you can copy/paste this into a file in your project.

```typescript
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
```
