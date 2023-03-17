export interface Callback<T extends unknown[], K> {
  (...args: T): Promise<K>;
}

export type CallResult<K> =
  | {
      data: K;
      errorMessage?: string;
    }
  | {
      data?: K;
      errorMessage: string;
    };

export interface ApiHook<T extends unknown[], K> {
  call: (...args: T) => Promise<CallResult<K>>;
  loading: boolean;
  data: K;
  errorMessage?: string;
}

export interface ErrorHandler {
  (e: Error): void | unknown;
  (e: Error): Promise<void | unknown>;
}
export interface ErrorHandlerOptions {
  errorHandler?: ErrorHandler;
}
