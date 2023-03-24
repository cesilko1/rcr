import { renderHook } from '@testing-library/react-hooks';
import { useFetchApi } from '../src';
import { getUser } from './mocks';

describe('unit: useFetchApi', () => {
  it('Should loading', () => {
    const {result} = renderHook(() => useFetchApi(getUser, 1));
  
    expect(result.current.loading).toBe(true);
  });
})