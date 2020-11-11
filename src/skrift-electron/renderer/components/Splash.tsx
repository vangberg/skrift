import React from "react";

export const Splash: React.FC<{ loaded: number }> = ({ loaded }) => {
  return (
    <div className="h-screen flex-1 flex bg-gray-200 text-sm">
      <div className="flex-1 flex flex-row justify-center items-center px-1">
        <h1>Loading {loaded} notes…</h1>
      </div>
    </div>
  );
};
