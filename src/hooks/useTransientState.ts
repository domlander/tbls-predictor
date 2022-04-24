import { useCallback, useEffect, useState } from "react";

// https://malcolmkee.com/blog/use-transient-state/
const useTransientState = (steadyState: boolean, restorationTime = 2000) => {
  const [state, setState] = useState<boolean>(steadyState);
  const [calledTimes, setCallTimes] = useState(0);

  const setTemporaryState = useCallback((newValue: boolean): void => {
    setState(newValue);
    setCallTimes((x) => x + 1);
  }, []);

  useEffect(() => {
    if (state !== steadyState && restorationTime) {
      const timeoutId = setTimeout(
        () => setState(steadyState),
        restorationTime
      );

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [state, steadyState, restorationTime, calledTimes]);

  // https://fettblog.eu/typescript-react-typeing-custom-hooks/#option-2%3A-as-const
  return [state, setTemporaryState] as const;
};

export default useTransientState;
