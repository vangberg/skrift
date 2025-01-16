import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import clsx from "clsx";
import React from "react";

export const CardDropIndicator: React.FC<{ edge: Edge | null }> = ({ edge }) => {
    if (!edge) return null;

    const className = clsx(
        "absolute top-0 bottom-0 w-0.5 bg-blue-500",
        edge === "left" && "left-0",
        edge === "right" && "right-0",
    );

    return <div className={className} />;
};
