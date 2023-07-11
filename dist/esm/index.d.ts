type UnsubscribeFunction = () => void;
type Options = {
    target?: EventTarget;
};
export declare class CustomEventChannel<T> {
    constructor(name?: string, opts?: Options);
    /** Target for emitting CustomEvent */
    target: EventTarget;
    /** Name of the CustomEvent and channel */
    name: string;
    /** Unique identifier for channel */
    id: string;
    /** Total amount of subscribers */
    subscriberCount: number;
    /** Sends a new event to channel subscribers */
    send(args: T): void;
    /** Subscribes to events from channel */
    subscribe(onEvent: (event: T) => any): UnsubscribeFunction;
}
export {};
