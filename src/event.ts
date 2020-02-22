type Callback<T> = (data: T) => void;
type Unsubscribe = () => void;

export class TypedEvent<T> {
  callbacks: Map<number, Callback<T>>;
  callbackId: number;

  constructor() {
    this.callbacks = new Map();
    this.callbackId = 0;
  }

  emit(data: T) {
    this.callbacks.forEach(callback => callback(data));
  }

  subscribe(callback: (data: T) => void): Unsubscribe {
    const id = this.callbackId++;
    this.callbacks.set(id, callback);
    return () => this.callbacks.delete(id);
  }
}
