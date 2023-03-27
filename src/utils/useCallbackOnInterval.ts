import { useRef, useCallback, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type Callback<T extends unknown[]> = (...args: [...T]) => void | unknown | Promise<void | unknown>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useCallbackOnInterval = <T extends unknown[]>(
  cb: Callback<T>,
  interval?: number,
  ...args: [...T]
): void => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const callbackHandler = useCallback(async () => {
    await cb(...args);
    timeoutRef.current = setTimeout(callbackHandler, interval);
  }, [...args, interval, cb]);

  const focusHandler = useCallback(() => {
    if (document.hidden) {
      clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(callbackHandler, interval);
    }
  }, []);

  useEffect(() => {
    if (!interval) return;

    timeoutRef.current = setTimeout(callbackHandler, interval);
    window.addEventListener('visibilitychange', focusHandler);
    return () => {
      window.removeEventListener('visibilitychange', focusHandler);
      clearTimeout(timeoutRef.current);
    };
  }, []);
};
