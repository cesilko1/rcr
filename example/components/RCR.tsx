import React from "react";
import { PropsWithChildren } from "react";
import { RCRProvider, ErrorHandlerOptions } from "../../dist";

const RCR = ({ children }: PropsWithChildren<any>) => {
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

export default RCR;