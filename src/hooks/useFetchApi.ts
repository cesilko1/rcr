import { CallResult, Callback, ApiHook, ErrorHandlerOptions } from '../types';
import { useErrorHandler, useCallbackOnFocus } from '../utils';
import { useState, useEffect } from 'react';

export type FetchApiOptions<T> = ErrorHandlerOptions & {
  initialData?: T;
  revalidateOnArgsChange?: boolean;
  revalidateOnFocus?: boolean;
};

export type ArgsWithOptions<T extends unknown[], K> =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  | [...T]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  | [Partial<FetchApiOptions<K>>, ...T];

export type ApiHookRevalidate<T extends unknown[], K> = ApiHook<T, K> & {
  revalidate: () => Promise<CallResult<K>>;
  revalidating: boolean;
};
export interface UseFetchApi {
  <T extends unknown[], K>(
    apiCallback: Callback<T, K>,
    ...args: ArgsWithOptions<T, K>
  ): ApiHookRevalidate<T, K>;
}

export const useFetchApi: UseFetchApi = <Args extends unknown[], Res>(
  apiCallback: Callback<Args, Res>,
  ...args: ArgsWithOptions<Args, Res>
): ApiHookRevalidate<Args, Res> => {
  const [loading, setLoading] = useState(true);
  const [revalidating, setRevalidating] = useState(true);

  const opts = (
    args.length > 0 && typeof args[0] === 'object' && !Array.isArray(args[0])
      ? (args.shift() as Partial<FetchApiOptions<Res>>)
      : {}
  ) as FetchApiOptions<Res>;

  const options: FetchApiOptions<Res> = {
    revalidateOnArgsChange: opts.revalidateOnArgsChange ?? true,
    errorHandler: opts.errorHandler,
    initialData: opts.initialData,
    revalidateOnFocus: opts.revalidateOnFocus ?? true,
  };

  const [result, setResult] = useState<CallResult<Res> | null>(
    opts.initialData ? { data: opts.initialData } : null,
  );

  const requestWrapper = useErrorHandler<Args, Res>(apiCallback, options);

  const call = async (...args: Args): Promise<CallResult<Res>> => {
    setLoading(true);
    const response = await requestWrapper(...args);
    setResult(response);
    setLoading(false);
    setRevalidating(false);
    return response;
  };

  const revalidate = async (): Promise<CallResult<Res>> => {
    setRevalidating(true);
    const response = await requestWrapper(...(args as Args));
    setResult(response);
    setRevalidating(false);
    return response;
  };

  useCallbackOnFocus(revalidate);

  useEffect(() => {
    call(...(args as Args));
  }, []);

  useEffect(
    () => {
      if (options.revalidateOnArgsChange && !loading) {
        revalidate();
      }
    },
    options.revalidateOnArgsChange ? [...(args as Args)] : [],
  );

  return {
    call,
    loading,
    revalidate,
    revalidating,
    data: result?.data as Res,
    errorMessage: result?.errorMessage,
  };
};
