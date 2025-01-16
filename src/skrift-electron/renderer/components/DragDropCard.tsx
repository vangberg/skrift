import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { CardDropIndicator } from "./CardDropIndicator.js";
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { MoveMode } from "../interfaces/state/index.js";

interface Props {
    cardKey: number;
    onDrop: (sourceKey: number, targetKey: number, mode: MoveMode) => void;
}

function getMoveMode(closestEdge: Edge): MoveMode {
    switch (closestEdge) {
        case "left":
            return "before";
        case "right":
            return "after";
        default:
            throw new Error(`Invalid move mode ${closestEdge}`);
    }
}

export const DragDropCard: React.FC<PropsWithChildren<Props>> = ({
    cardKey,
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
                    type: "card",
                    key: cardKey,
                }
                return attachClosestEdge(data, {
                    input,
                    element,
                    allowedEdges: ["left", "right"],
                })
            },
            onDragEnter: ({ self, source }) => {
                if (source.data.key === cardKey) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDrag: ({ self, source }) => {
                if (source.data.key === cardKey) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDragLeave: () => setClosestEdge(null),
            onDrop: ({ source, location }) => {
                setClosestEdge(null);
                const sourceKey = source.data.key as number;
                const target = location.current.dropTargets[0];

                const closestEdge = extractClosestEdge(target.data);
                invariant(closestEdge, "No closest edge");

                onDrop(sourceKey, cardKey, getMoveMode(closestEdge));
            },
        });
    }, [cardKey, onDrop]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            getInitialData: () => ({
                type: "card",
                key: cardKey,
            }),
            element: el,
        })
    }, [cardKey]);

    return (
        <div ref={ref} className="flex flex-1 max-w-[32rem] relative h-full overflow-hidden">
            {children}
            <CardDropIndicator edge={closestEdge} />
        </div>
    );
}; 