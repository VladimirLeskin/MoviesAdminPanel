import {useCallback, useState} from 'react';

export function useBooleanState(initValue: boolean = false) {
  const [state, setState] = useState(initValue);
  const toggleState = useCallback(() => setState(v => !v), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return {state, setState, toggleState, setTrue, setFalse};
}
