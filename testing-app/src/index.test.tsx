import "@testing-library/dom";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import { CustomEventChannel } from "../../src/index";

describe("CustomEventChannel", () => {
  test("should be able to send and receive events", async () => {
    const channel = new CustomEventChannel<string>();
    const handler = vi.fn();
    channel.subscribe(handler);
    channel.send("test-event");
    expect(handler).toBeCalledTimes(1);
  });

  test("keeps track of subscriberCount", async () => {
    const channel = new CustomEventChannel<string>();
    const handler = vi.fn();
    channel.subscribe(handler);
    channel.subscribe(handler);
    const unsubscribe = channel.subscribe(handler);
    expect(channel.subscriberCount).toBe(3);
    unsubscribe();
    expect(channel.subscriberCount).toBe(2);
  });

  test("receives manually emitted events", async () => {
    const channel = new CustomEventChannel<string>("my-channel");
    const handler = vi.fn();
    channel.subscribe(handler);
    globalThis.dispatchEvent(
      new CustomEvent(channel.name, { detail: "test-event" })
    );
    expect(handler).toBeCalledTimes(1);
  });

  test("can use custom target for event emitting ", async () => {
    const target = new EventTarget();
    const channel = new CustomEventChannel<string>(
      "my-channel",
      { target }
    );
    const handler = vi.fn();
    channel.subscribe(handler);
    target.dispatchEvent(
      new CustomEvent(channel.name, { detail: "test-event" })
    );
    expect(handler).toBeCalledTimes(1);
    channel.send("test-event");
    expect(handler).toBeCalledTimes(2);
  });
});
