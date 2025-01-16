import React, { PropsWithChildren, useContext } from "react";
import { StateContext } from "../interfaces/state/index.js";
import { DragDropStream } from "../components/DragDropStream.js";

interface Props {
    streamKey: number;
}

export const DragDropStreamContainer: React.FC<PropsWithChildren<Props>> = ({ streamKey, children }) => {
    const [, { dropOnStream }] = useContext(StateContext);

    return (
        <DragDropStream
            streamKey={streamKey}
            onDrop={dropOnStream}
        >
            {children}
        </DragDropStream>
    );
}; 