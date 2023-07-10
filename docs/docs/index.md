---
slug: /
sidebar_position: 1
title: Docs
---

# Typesafe CustomEvents

> Lets you easily set up typesafe [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) channels in Typescript.

## Install

💾 ~**0.67KB** minified

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
```
