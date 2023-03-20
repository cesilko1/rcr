import { RCRProvider, ErrorHandlerOptions } from 'rcr';
import { FC, PropsWithChildren } from 'react';

const RCR: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const errorHandler = async (e: Error) => {
    let errorMessage;

    errorMessage = (e as Error).message || 'There is unexpected error';

    errorMessage &&
      console.log({
        title: errorMessage,
        status: 'error',
      });
  };

  const options: ErrorHandlerOptions = {
    errorHandler,
  };

  return (
    <RCRProvider options={options}>
      {children}
    </RCRProvider>
  );
};

export default RCR;