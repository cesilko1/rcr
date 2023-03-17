import { ErrorHandlerOptions } from 'types';
import { PropsWithChildren, createContext, FC } from 'react';
import * as React from 'react';

export interface RCRProviderProps extends PropsWithChildren {
  options: ErrorHandlerOptions;
}

export const RCRContext = createContext<ErrorHandlerOptions | null>(null);

export const RCRProvider: FC<RCRProviderProps> = (props: RCRProviderProps) => {
  return <RCRContext.Provider value={props.options}>{props.children}</RCRContext.Provider>;
};
