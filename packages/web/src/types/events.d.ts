declare interface TypeEvent<T extends EventTarget> extends Event {
  target: T;
}
