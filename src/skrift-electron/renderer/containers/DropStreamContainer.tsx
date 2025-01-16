import React, { PropsWithChildren, useContext } from "react";
import { StateContext } from "../interfaces/state/index.js";
import { DropStream } from "../components/DropStream.js";

type Props = {
    mode: "prepend" | "append";
};

export const DropStreamContainer: React.FC<Props> = ({ mode }) => {
    const [, { dropOnNewStream }] = useContext(StateContext);

    const handleDrop = (key: number) => {
        dropOnNewStream(key, mode);
    };

    return <DropStream mode={mode} onDrop={handleDrop} />;
};