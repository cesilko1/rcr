import { useCallback, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type Callback<T extends unknown[]> = (...args: [...T]) => void

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useCallbackOnFocus = <T extends unknown[]>(cb: Callback<T>, ...args: [...T]): void => {
    const callback = useCallback(() => {
        if (!document.hidden) {
            cb(...args);
        }
    }, [...args]);

    useEffect(() => {
        window.addEventListener('visibilitychange', callback);
        return () => {window.removeEventListener('visibilitychange', callback);}
    }, []);
}
