import React, { useCallback } from "react";
import { Icon } from "./Icon.js";
import { OpenCardMode } from "../interfaces/state/index.js";
import { mouseEventToMode } from "../mouseEventToMode.js";

type Props = {
    onOpenSearch: (mode: OpenCardMode) => void;
};

export const OpenSearch: React.FC<Props> = ({ onOpenSearch }) => {
    const handleOpenSearch = useCallback((event: React.MouseEvent) => {
        onOpenSearch(mouseEventToMode(event.nativeEvent));
    }, [onOpenSearch]);

    return (
        <div className="flex flex-row justify-center">
            <span
                onClick={handleOpenSearch}
                className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
            >
                <Icon name="search" className="w-4 h-4" />
            </span>
        </div>
    );
};
