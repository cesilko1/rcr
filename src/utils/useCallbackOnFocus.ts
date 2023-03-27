import { useCallback, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type Callback<T extends unknown[]> = (...args: [...T]) => void | unknown | Promise<void | unknown>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useCallbackOnFocus = <T extends unknown[]>(
  cb: Callback<T>,
  enable?: boolean,
  ...args: [...T]
): void => {
  const callback = useCallback(() => {
    if (!document.hidden) {
      cb(...args);
    }
  }, [...args, cb]);

  useEffect(() => {
    if (!enable) return;

    window.addEventListener('visibilitychange', callback);
    return () => {
      window.removeEventListener('visibilitychange', callback);
    };
  }, []);
};
