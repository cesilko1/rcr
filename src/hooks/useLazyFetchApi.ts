import { CallResult, Callback, ApiHook, ErrorHandlerOptions } from '@/types';
import { useErrorHandler } from '@/utils';
import { useState } from 'react';

export type LazyFetchApiOptions = ErrorHandlerOptions;

export interface UseLazyFetchApi {
  <T extends unknown[], K>(
    apiCallback: Callback<T, K>,
    opts?: Partial<LazyFetchApiOptions>,
  ): ApiHook<T, K>;
}

export const useLazyFetchApi: UseLazyFetchApi = <Args extends unknown[], Res>(
  apiCallback: Callback<Args, Res>,
  opts?: LazyFetchApiOptions,
) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallResult<Res>>();

  const requestWrapper = useErrorHandler<Args, Res>(apiCallback, opts);

  const call = async (...args: Args): Promise<CallResult<Res>> => {
    setLoading(true);
    const response = await requestWrapper(...args);
    setResult(response);
    setLoading(false);
    return response;
  };

  return {
    call,
    loading,
    data: result?.data as Res,
    errorMessage: result?.errorMessage,
  };
};
