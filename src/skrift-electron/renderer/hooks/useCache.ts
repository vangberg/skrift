import React, { useCallback, useContext, useEffect } from "react";
import { ImmerHook } from "use-immer";
import { SCache } from "../../../skrift/scache/index.js";

type Cache = SCache<any>;

export const CacheContext = React.createContext<ImmerHook<Cache>>([
  {},
  () => { },
]);

export const useCache = <Value>(
  key: string,
  defaultValue: Value
): [Value, (value: Value) => void] => {
  const [cache, setCache] = useContext(CacheContext);

  useEffect(() => {
    setCache((draft) => {
      SCache.claim(draft, key, defaultValue);
    });

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
        setCache((draft) => {
          SCache.release(draft, key);
        });
      }, 1500);
    };
  }, []);

  const setValue = useCallback(
    (value: Value) => {
      setCache((draft) => {
        SCache.set(draft, key, value);
      });
    },
    [setCache, key]
  );

  const value = SCache.get(cache, key) || defaultValue;

  return [value, setValue];
};
