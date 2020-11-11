import { useRef } from "react";

// Source: https://gist.github.com/sqren/fc897c1629979e669714893df966b1b7#gistcomment-3189166
let uniqueId = 0;
const getUniqueId = () => uniqueId++;

export function useUniqueId(): number {
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
