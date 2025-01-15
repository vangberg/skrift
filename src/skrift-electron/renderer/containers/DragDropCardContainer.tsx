import React, { PropsWithChildren, useContext } from "react";
import { Card as CardType, StateContext } from "../interfaces/state/index.js";
import { DragDropCard } from "../components/DragDropCard.js";

interface Props {
    card: CardType;
}

export const DragDropCardContainer: React.FC<PropsWithChildren<Props>> = ({ card, children }) => {
    const [, { dropOnCard }] = useContext(StateContext);

    return (
        <DragDropCard
            cardKey={card.meta.key}
            onDrop={dropOnCard}
        >
            {children}
        </DragDropCard>
    );
};
