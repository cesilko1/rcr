import { CallResult, useMutateApi } from '../src';
import { User, getUser, getUserWithError, mockUser } from './mocks';
import { act, renderHook, waitFor } from '@testing-library/react';

describe('unit: useMutateApi', () => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  const loginHandlerSpy = jest.fn();
  const consoleLogSpy = jest.spyOn(console, 'log');
  const consoleWarnSpy = jest.spyOn(console, 'warn');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  beforeEach(() => {
    consoleLogSpy.mockReset();
    consoleWarnSpy.mockReset();
    consoleErrorSpy.mockReset();
    loginHandlerSpy.mockReset();
  });

  it('handle loading state', async () => {
    const { result } = renderHook(() => useMutateApi(loginHandlerSpy));

    expect(result.current.loading).toBe(false);
    expect(loginHandlerSpy).toBeCalledTimes(0);

    act(() => {
      result.current.call(15);
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(loginHandlerSpy).toBeCalledTimes(1);
      expect(loginHandlerSpy).toBeCalledWith(15);
    });
  });

  it('handle call response', async () => {
    let response: CallResult<User>;
    const { result } = renderHook(() => useMutateApi(getUser));

    expect(result.current.loading).toBe(false);

    await act(async () => {
      response = await result.current.call(1);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.data).toStrictEqual(mockUser(1));
    expect(result.current.loading).toBe(false);
  });

  it('handle call response with error', async () => {
    let response: CallResult<User>;
    const { result } = renderHook(() => useMutateApi(getUserWithError));

    expect(result.current.loading).toBe(false);

    await act(async () => {
      response = await result.current.call(10);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.data).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.errorMessage).toBe('Can not find user with id: 10');
    expect(consoleWarnSpy).toBeCalledWith('Error handler for RCR was not provided');
    expect(result.current.loading).toBe(false);
  });

  it('handle call response with custom error handler', async () => {
    let response: CallResult<User>;
    const errorHandler = jest.fn();
    const { result } = renderHook(() => useMutateApi(getUserWithError, {
      errorHandler
    }));

    expect(result.current.loading).toBe(false);
    expect(errorHandler).toBeCalledTimes(0);

    await act(async () => {
      response = await result.current.call(10);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.data).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.errorMessage).toBe('Can not find user with id: 10');
    expect(result.current.loading).toBe(false);
    expect(errorHandler).toBeCalledTimes(1);
  });
});
