import { useCallback, useEffect, useState } from "react";

// https://malcolmkee.com/blog/use-transient-state/
const useTransientState = (steadyState: unknown, restorationTime = 2000) => {
  const [state, setState] = useState(steadyState);

  const setTemporaryState = useCallback((newValue) => {
    setState(newValue);
  }, []);

  useEffect(() => {
    if (state !== steadyState && restorationTime) {
      const timeoutId = setTimeout(
        () => setState(steadyState),
        restorationTime
      );

      return () => clearTimeout(timeoutId);
    }
  }, [state, steadyState, restorationTime]);

  return [state, setTemporaryState];
};

export default useTransientState;
