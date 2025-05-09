import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import clsx from "clsx";
import React from "react";

export const CardDropIndicator: React.FC<{ edge: Edge | null }> = ({ edge }) => {
    if (!edge) return null;

    const className = clsx(
        "absolute left-0 right-0 h-1 bg-blue-400 rounded-full",
        edge === "top" && "-top-0.5",
        edge === "bottom" && "-bottom-0.5",
    );

    return <div className={className} />;
};
