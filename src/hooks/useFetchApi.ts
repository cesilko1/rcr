import { useEffect } from 'react';

export const useFetchApi = () => {
  useEffect(() => {
    console.log('Effect!');
  }, []);
};
