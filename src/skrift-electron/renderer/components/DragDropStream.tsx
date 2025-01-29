import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { MoveMode } from "../interfaces/state/index.js";
import { StreamDropIndicator } from "./StreamDropIndicator.js";
import { BaseEventPayload, DropTargetLocalizedData, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types.js";

interface Props {
    streamKey: number;
    onDropOnCard: (sourceKey: number, targetKey: number, mode: MoveMode) => void;
    onDropOnStream: (sourceKey: number, targetStreamKey: number, mode: MoveMode) => void;
}

function getMoveMode(closestEdge: Edge): MoveMode {
    switch (closestEdge) {
        case "top":
        case "left":
            return "before";
        case "bottom":
        case "right":
            return "after";
        default:
            throw new Error(`Invalid move mode ${closestEdge}`);
    }
}

export const DragDropStream: React.FC<PropsWithChildren<Props>> = ({
    streamKey,
    onDropOnCard,
    onDropOnStream,
    children
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    const conditionallySetClosestEdge = useCallback(({ self, location }: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
        const target = location.current.dropTargets[0];

        // If the dragged card is dragged over a stream, but not a card, the first
        // drop target will be the stream itself. In that case, we set closest edge,
        // so the drop indicator is shown.
        if (self.element === target?.element) {
            setClosestEdge(extractClosestEdge(self.data));
        } else {
            setClosestEdge(null);
        }
    }, [setClosestEdge]);

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
                    allowedEdges: ["left", "right"],
                })
            },
            onDragEnter: conditionallySetClosestEdge,
            onDrag: conditionallySetClosestEdge,
            onDragLeave: () => setClosestEdge(null),
            onDrop: ({ source, location }) => {
                setClosestEdge(null);

                const sourceKey = source.data.key as number;
                const target = location.current.dropTargets[0];
                const targetKey = target.data.key as number;
                const closestEdge = extractClosestEdge(target.data);
                invariant(closestEdge, "No closest edge");

                if (target.data.type === "stream") {
                    onDropOnStream(sourceKey, targetKey, getMoveMode(closestEdge));
                } else {
                    onDropOnCard(sourceKey, targetKey, getMoveMode(closestEdge));
                }
            },
        });
    }, [streamKey, onDropOnCard, onDropOnStream]);

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
        <div ref={ref} className="p-2 first:ml-2 h-full min-h-0 flex-1 max-w-[32rem] relative">
            {children}
            <StreamDropIndicator edge={closestEdge} />
        </div>
    );
}; 