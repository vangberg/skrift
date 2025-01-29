import React from "react";
import { Icon } from "./Icon.js";

type Props = {
    onOpenSearch: () => void;
};

export const OpenSearch: React.FC<Props> = ({ onOpenSearch }) => {
    return (
        <div className="first:ml-2 mr-2 flex flex-col justify-center">
            <span
                onClick={onOpenSearch}
                className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
            >
                <Icon name="search" className="w-4 h-4" />
            </span>
        </div>
    );
};
