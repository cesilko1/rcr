import { useEffect } from 'react';

export interface useFetchApi {
  (text: string): string;
}

export const useFetchApi: useFetchApi = (text: string) => {
  useEffect(() => {
    console.log('Effect!', text);
  }, [text]);

  return text;
};
