import { useCallback, useEffect, useRef, useState } from "react";

type StateCallback<S> = (s: S) => void;
type SetStateCallback<S> = (state: S, callback?: StateCallback<S>) => void;

export function useStateCallback<S>(initialState: S | (() => S)): [S, SetStateCallback<S>] {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<StateCallback<S>>(); // init mutable ref container for callbacks

  const setStateCallback = useCallback((state: S, cb?: StateCallback<S>) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render, 
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}