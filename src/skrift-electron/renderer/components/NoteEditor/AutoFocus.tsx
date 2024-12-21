import { useEditorEffect } from "@nytimes/react-prosemirror";
import { TextSelection } from "prosemirror-state";
import React from "react";

export const AutoFocus: React.FC = () => {
    useEditorEffect((view) => {
        // Set initial selection to end of document, so the initial
        // focus after render starts at the end of the note.
        view.dispatch(
            view.state.tr.setSelection(TextSelection.atEnd(view.state.doc))
        );

        view.dom.focus();
    }, []);

    return null;
};
