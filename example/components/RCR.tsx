import { PropsWithChildren } from "react";
import { RCRProvider, ErrorHandlerOptions } from "../..";
import * as React from 'react';

export const RCR = ({ children }: PropsWithChildren<any>) => {
  console.log("rendering");
  const errorHandler = (e: Error) => {
    console.log(e);
  }
  
  const options: ErrorHandlerOptions = {
    errorHandler
  }

  return (
    <RCRProvider options={options}>
      {children}
    </RCRProvider>
  )
}