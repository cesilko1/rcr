import { renderHook, waitFor } from '@testing-library/react';
import { useFetchApi } from '../src';
import { getUser, mockUser } from './mocks';

describe('unit: useFetchApi', () => {
  const user = mockUser(1);
  const { result } = renderHook(() => useFetchApi(getUser, 1));

  it('Should return user', async () => {
    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toStrictEqual(user);
    }, {
      timeout: 500
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
    }, {
      timeout: 300
    });
  });
})