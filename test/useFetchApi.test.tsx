import { renderHook, waitFor } from '@testing-library/react';
import { useFetchApi } from '../src';
import { getUser, getUserWithError, mockUser } from './mocks';

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
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.data).toStrictEqual(user);
    }, {
      timeout: 300
    });
  });

  it('handle loading and error logic', async () => {
    const { result } = renderHook(() => useFetchApi(getUserWithError, 1));

    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
      expect(result.current.errorMessage).toBe('Can not find user with id: 1');
      expect(consoleWarnSpy).toBeCalledWith('Error handler for RCR was not provided');
    }, {
      timeout: 300
    });
  });

  it('handle loading and error logic with custom error handler', async () => {
    const errorHandler = jest.fn();
    const { result } = renderHook(() => useFetchApi(getUserWithError, {
      errorHandler
    }, 1));

    expect(result.current.loading).toBe(true);
    expect(result.current.revalidating).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.revalidating).toBe(false);
      expect(result.current.errorMessage).toBe('Can not find user with id: 1');
      expect(errorHandler).toBeCalled();
    }, {
      timeout: 300
    });
  });

  // it('handle argument change', async () => {
  //   const firstUser = mockUser(1);
  //   const secondUser = mockUser(2);
  //   let userId = 1;
  //   const { result, rerender } = renderHook(() => useFetchApi(getUser, userId));

  //   await waitFor(() => {
  //     expect(result.current.loading).toBe(true);
  //     expect(result.current.revalidating).toBe(true);
  //   });

  //   await waitFor(() => {
  //     expect(result.current.loading).toBe(false);
  //     expect(result.current.revalidating).toBe(false);
  //     expect(result.current.errorMessage).toBeUndefined();
  //     expect(result.current.data).toStrictEqual(firstUser);
  //   }, {
  //     timeout: 500
  //   });

  //   userId = 2;
  //   await rerender();

  //   expect(result.current.loading).toBe(true);
  //   expect(result.current.revalidating).toBe(true);

  //   await waitFor(() => {
  //     expect(result.current.loading).toBe(false);
  //     expect(result.current.revalidating).toBe(false);
  //     expect(result.current.errorMessage).toBeUndefined();
  //     expect(result.current.data).toStrictEqual(secondUser);
  //   });
  // });
})