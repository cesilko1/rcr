import { RCRContext } from '../contexts';
import { Callback, CallResult, ErrorHandlerOptions } from '../types';
import { useContext } from 'react';

export interface HandlerErrorOptions {
  enableToast: boolean;
}

export interface UseErrorHandler<T extends unknown[], K> {
  (...args: T): Promise<CallResult<K>>;
}

export const useErrorHandler = <Args extends unknown[], Res>(
  callback: Callback<Args, Res>,
  opts?: ErrorHandlerOptions,
): UseErrorHandler<Args, Res> => {
  const context = useContext(RCRContext);

  if (!context) throw new Error('RCR hook used outside RCRProvider!');

  return async (...args: Args): Promise<CallResult<Res>> => {
    let data, errorMessage;

    try {
      data = await callback(...args);
    } catch (e) {
      const err = e as Error;
      errorMessage = err.message;

      if (opts?.errorHandler) {
        opts.errorHandler(err);
      } else if (context.errorHandler) {
        context.errorHandler(err);
      } else {
        console.warn('Error handler for RCR was not provided');
      }
    }

    return errorMessage ? { errorMessage } : { data: data as Res };
  };
};
