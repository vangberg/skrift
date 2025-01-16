import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { StreamDropIndicator } from "./StreamDropIndicator.js";
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { MoveMode } from "../interfaces/state/index.js";

interface Props {
    streamKey: number;
    onDrop: (sourceKey: number, targetKey: number, mode: MoveMode) => void;
}

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

export const DragDropStream: React.FC<PropsWithChildren<Props>> = ({
    streamKey,
    onDrop,
    children
}) => {
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
                if (source.data.type !== "stream" || source.data.key === streamKey) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDrag: ({ self, source }) => {
                if (source.data.type !== "stream" || source.data.key === streamKey) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDragLeave: () => setClosestEdge(null),
            onDrop: ({ source, location }) => {
                setClosestEdge(null);
                if (source.data.type !== "stream") return;

                const sourceKey = source.data.key as number;
                const target = location.current.dropTargets[0];

                const closestEdge = extractClosestEdge(target.data);
                invariant(closestEdge, "No closest edge");

                onDrop(sourceKey, streamKey, getMoveMode(closestEdge));
            },
        });
    }, [streamKey, onDrop]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            getInitialData: () => ({
                type: "stream",
                key: streamKey,
            }),
            element: el,
        })
    }, [streamKey]);

    return (
        <div ref={ref} className="flex flex-1 relative h-full overflow-hidden">
            {children}
            <StreamDropIndicator edge={closestEdge} />
        </div>
    );
}; 