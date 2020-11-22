import useEnter from './index';

interface Props {
  allowed: boolean;
  callback: () => void;
}
export const UseEnterWrapper = ({ allowed, callback }: Props) => {
  useEnter(() => {
    if (!allowed) {
      callback();
    }
  });

  return null;
};

export default UseEnterWrapper;
