import { Callback, ApiHook, CallResult, ErrorHandlerOptions } from 'types';
import { useErrorHandler } from 'utils';
import { useState } from 'react';

export type MutateApiOptions = ErrorHandlerOptions;

export interface UseMutateApi {
  <T extends unknown[], K>(apiCallback: Callback<T, K>, opts?: Partial<MutateApiOptions>): ApiHook<
    T,
    K
  >;
}

export const useMutateApi: UseMutateApi = <Args extends unknown[], Res>(
  apiCallback: Callback<Args, Res>,
  opts?: Partial<MutateApiOptions>,
) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallResult<Res> | null>(null);

  const requestWrapper = useErrorHandler(apiCallback, opts);

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
