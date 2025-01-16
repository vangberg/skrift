import React, { useContext } from "react";
import { StateContext } from "../interfaces/state/index.js";
import { DropOnStream } from "../components/DropOnStream.js";

type Props = {
    streamKey: number;
};

export const DropOnStreamContainer: React.FC<Props> = ({ streamKey }) => {
    const [, { dropOnStream }] = useContext(StateContext);

    return <DropOnStream streamKey={streamKey} onDrop={dropOnStream} />;
}; 