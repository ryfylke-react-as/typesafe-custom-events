type UnsubscribeFunction = () => void;
export declare class CustomEventChannel<T> {
    /** Name of the CustomEvent and channel */
    name: string;
    /** Unique identifier for channel */
    id: string;
    /** Sends a new event to channel subscribers */
    send: (args: T) => void;
    /** Subscribes to events from channel */
    subscribe: (onEvent: (event: T) => any) => UnsubscribeFunction;
    /** Total amount of subscribers */
    subscriberCount: number;
    constructor(name?: string);
}
export {};
