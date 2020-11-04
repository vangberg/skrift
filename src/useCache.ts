import produce from "immer";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { SCache } from "./interfaces/scache";

type Cache = SCache<string, any>;

type Context = [Cache, React.Dispatch<React.SetStateAction<Cache>>];

export const UseCacheContext = React.createContext<Context>([
  new Map(),
  () => {},
]);

export const useCache = <Value>(
  key: string,
  defaultValue: Value
): [Value, (value: Value) => void] => {
  const [cache, setCache] = useContext(UseCacheContext);

  useEffect(() => {
    setCache((cache) =>
      produce(cache, (draft) => {
        SCache.claim(draft, key, defaultValue);
      })
    );

    /*
    When a card is moved from one stream to another, there is (sometimes)
    a tiny moment where the component for the dragged card is unmounted
    before the component for the card in the destination stream is mounted.
    This means that the card is removed from the cache, and has to be loaded,
    causing a small flicker. By delaying the release a bit, we ensure that
    the new component can claim the state before it is removed from the cache.
    */
    return () => {
      setTimeout(() => {
        setCache((cache) =>
          produce(cache, (draft) => {
            SCache.release(draft, key);
          })
        );
      }, 1500);
    };
  }, []);

  const setValue = useCallback(
    (value: Value) => {
      setCache((cache) =>
        produce(cache, (draft) => {
          SCache.set(draft, key, value);
        })
      );
    },
    [setCache, key]
  );

  const value = SCache.get(cache, key) || defaultValue;

  return [value, setValue];
};
