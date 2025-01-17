import React, { PropsWithChildren, useContext } from "react";
import { Stream as StreamType, StateContext } from "../interfaces/state/index.js";
import { DragDropStream } from "../components/DragDropStream.js";

interface Props {
    stream: StreamType;
}

export const DragDropStreamContainer: React.FC<PropsWithChildren<Props>> = ({ stream, children }) => {
    const [, { dropOnCard, dropOnStream }] = useContext(StateContext);

    return (
        <DragDropStream
            streamKey={stream.key}
            onDropOnCard={dropOnCard}
            onDropOnStream={dropOnStream}
        >
            {children}
        </DragDropStream >
    );
};
