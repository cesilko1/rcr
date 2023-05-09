import { useFetchApi, CallResult } from '../src';
import { User, getUser, getUserWithError, mockUser } from './mocks';
import { act, renderHook, waitFor } from '@testing-library/react';

describe('unit: useFetchApi', () => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  const consoleLogSpy = jest.spyOn(console, 'log');
  const consoleWarnSpy = jest.spyOn(console, 'warn');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  beforeEach(() => {
    consoleLogSpy.mockReset();
    consoleWarnSpy.mockReset();
    consoleErrorSpy.mockReset();
  });

  it('handle loading logic and return user', async () => {
    const user = mockUser(1);
    const { result } = renderHook(() => useFetchApi(getUser, 1));

    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
        expect(result.current.errorMessage).toBeUndefined();
        expect(result.current.data).toStrictEqual(user);
      },
      {
        timeout: 300,
      },
    );
  });

  it('handle loading and error logic', async () => {
    const { result } = renderHook(() => useFetchApi(getUserWithError, 1));

    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
        expect(result.current.errorMessage).toBe('Can not find user with id: 1');
        expect(consoleWarnSpy).toBeCalledWith('Error handler for RCR was not provided');
      },
      {
        timeout: 300,
      },
    );
  });

  it('handle loading and error logic with custom error handler', async () => {
    const errorHandler = jest.fn();
    const { result } = renderHook(() =>
      useFetchApi(
        getUserWithError,
        {
          errorHandler,
        },
        1,
      ),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
        expect(result.current.errorMessage).toBe('Can not find user with id: 1');
        expect(errorHandler).toBeCalled();
      },
      {
        timeout: 300,
      },
    );
  });

  describe('useFetchApi: revalidate method', () => {
    it('handle loading state', async () => {
      const mockApi = jest.fn();
      const { result } = renderHook(() => useFetchApi(mockApi, 1));

      expect(result.current.loading).toBe(true);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(mockApi).toBeCalledTimes(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });

      act(() => {
        result.current.revalidate();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(mockApi).toBeCalledTimes(2);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });
    });

    it('check returned data from revalidate method', async () => {
      let response: CallResult<User>;
      const firstUser = mockUser(1);

      const { result } = renderHook(() => useFetchApi(getUser, 1));

      expect(result.current.loading).toBe(true);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(result.current.data).toStrictEqual(firstUser);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });

      await act(async () => {
        response = await result.current.revalidate();
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(response.data).toStrictEqual(firstUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
    });
  });

  describe('useFetchApi: call method', () => {
    it('handle loading state', async () => {
      const mockApi = jest.fn();
      const { result } = renderHook(() => useFetchApi(mockApi, 1));

      expect(result.current.loading).toBe(true);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(mockApi).toBeCalledTimes(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });

      act(() => {
        result.current.call(2);
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(mockApi).toBeCalledTimes(2);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });
    });

    it('check returned data from call method', async () => {
      let response: CallResult<User>;
      const firstUser = mockUser(1);
      const secondUser = mockUser(2);

      const { result } = renderHook(() => useFetchApi(getUser, 1));

      expect(result.current.loading).toBe(true);
      expect(result.current.revalidating).toBe(true);

      await waitFor(() => {
        expect(result.current.data).toStrictEqual(firstUser);
        expect(result.current.loading).toBe(false);
        expect(result.current.revalidating).toBe(false);
      });

      await act(async () => {
        response = await result.current.call(2);
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(response.data).toStrictEqual(secondUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
    });
  });
});
