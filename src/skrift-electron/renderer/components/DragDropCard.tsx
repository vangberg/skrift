import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { CardDropIndicator } from "./CardDropIndicator.js";
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { Card } from "../interfaces/state/index.js";

interface Props {
    card: Card;
}

export const DragDropCard: React.FC<PropsWithChildren<Props>> = ({
    card,
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
                    key: card.meta.key,
                }
                return attachClosestEdge(data, {
                    input,
                    element,
                    allowedEdges: ["left", "right"],
                })
            },
            onDragEnter: ({ self, source }) => {
                if (source.data.key === card.meta.key) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDrag: ({ self, source }) => {
                if (source.data.key === card.meta.key) return;
                setClosestEdge(extractClosestEdge(self.data));
            },
            onDragLeave: () => setClosestEdge(null),
            onDrop: () => {
                setClosestEdge(null);
            },
        });
    }, [card.meta.key]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            getInitialData: () => ({
                type: "card",
                key: card.meta.key,
            }),
            element: el,
        })
    }, [card.meta.key]);

    return (
        <div ref={ref} className="flex flex-1 max-w-[32rem] relative h-full overflow-hidden">
            {children}
            <CardDropIndicator edge={closestEdge} />
        </div>
    );
}; 