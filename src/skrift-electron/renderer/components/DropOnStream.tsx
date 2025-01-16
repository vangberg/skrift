import React, { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { MoveMode } from "../interfaces/state/index.js";
import clsx from "clsx";

type Props = {
    streamKey: number;
    onDrop: (sourceKey: number, targetStreamKey: number, mode: MoveMode) => void;
};

function getMoveMode(closestEdge: Edge): MoveMode {
    switch (closestEdge) {
        case "top":
            return "before";
        case "bottom":
            return "after";
        default:
            throw new Error(`Invalid move mode ${closestEdge}`);
    }
}

export const DropOnStream: React.FC<Props> = ({ streamKey, onDrop }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return dropTargetForElements({
            element: el,
            getData: ({ input, element }) => {
                const data = {
                    type: "stream",
                    key: streamKey,
                }
                return attachClosestEdge(data, {
                    input,
                    element,
                    allowedEdges: ["top", "bottom"],
                })
            },
            onDragEnter: ({ self, source }) => {
                if (source.data.type !== "card") return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDrag: ({ self, source }) => {
                if (source.data.type !== "card") return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDragLeave: () => setClosestEdge(null),
            onDrop: ({ source, location }) => {
                setClosestEdge(null);
                if (source.data.type !== "card") return;

                const sourceKey = source.data.key as number;
                const target = location.current.dropTargets[0];

                const closestEdge = extractClosestEdge(target.data);
                invariant(closestEdge, "No closest edge");

                onDrop(sourceKey, streamKey, getMoveMode(closestEdge));
            },
        });
    }, [streamKey, onDrop]);

    return (
        <div
            ref={ref}
            className={clsx(
                "absolute left-0 right-0 h-2 bg-gray-300 opacity-0 transition-opacity",
                {
                    "opacity-100": closestEdge,
                }
            )}
            style={{
                top: closestEdge === "top" ? "-8px" : undefined,
                bottom: closestEdge === "bottom" ? "-8px" : undefined,
            }}
        />
    );
}; 