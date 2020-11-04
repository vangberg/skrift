import React, { useState, useEffect, useContext } from "react";
import process from "process";
import { UseCacheContext } from "../useCache";

const bToMb = (kb: number) => kb / 1024 / 1025;

export const DevInfo: React.FC = () => {
  const [memUsage, setMemUsage] = useState(() => process.memoryUsage());
  const [cache] = useContext(UseCacheContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setMemUsage(process.memoryUsage());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 right-0 bg-white p-1">
      RSS: {Math.round(bToMb(memUsage.rss))} MB | Cache: {cache.size}
    </div>
  );
};
