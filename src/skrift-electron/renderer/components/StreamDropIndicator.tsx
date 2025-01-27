import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import clsx from "clsx";
import React from "react";

export const StreamDropIndicator: React.FC<{ edge: Edge | null }> = ({ edge }) => {
    if (!edge) return null;

    const className = clsx(
        "absolute top-2 bottom-2 w-1 bg-blue-400 rounded-full",
        edge === "left" && "-left-0.5",
        edge === "right" && "-right-0.5",
    );

    return <div className={className} />
};