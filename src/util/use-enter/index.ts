import { useCallback, useEffect } from 'react';

export const useEnter = (callback: Function) => {
  const handleUserKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      if (keyCode === 13) {
        callback();
      }
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);
};

export default useEnter;
export * from './UseEnterWrapper';
