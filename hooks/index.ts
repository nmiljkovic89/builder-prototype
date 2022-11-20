import { useEffect, useRef } from "react";

export function useOuterClick<T extends HTMLElement>(
  callback: (params?: any) => void
) {
  const callbackRef = useRef((e: MouseEvent) => {}); // initialize mutable ref, which stores callback
  const innerRef = useRef<T | null>(null); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
    function handleClick(e: MouseEvent) {
      if (
        innerRef.current &&
        callbackRef.current &&
        typeof callbackRef.current === "function" &&
        !innerRef.current.contains(e.target as Node)
      )
        callbackRef.current(e);
    }
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref himself)
}
