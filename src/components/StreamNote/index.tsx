import React, { useCallback, useMemo } from "react";
import { remote, clipboard } from "electron";

import { Backlinks } from "./Backlinks";
import { Toolbar } from "./Toolbar";
import { Note } from "../../interfaces/note";
import { NoteEditorContainer } from "../../containers/NoteEditorContainer";
import { StreamLocation } from "../../interfaces/streams";
import { Draggable } from "react-beautiful-dnd";
import { useUniqueId } from "../../useUniqueId";

type Props = {
  location: StreamLocation;
  note: Note;
  onOpen: (id: string, push: boolean) => void;
  onDelete: () => void;
  onClose: () => void;
};

export const StreamNote: React.FC<Props> = ({
  location,
  note,
  onOpen,
  onDelete,
  onClose,
}) => {
  const handleDelete = useCallback(async () => {
    const { response } = await remote.dialog.showMessageBox({
      type: "question",
      message: `Are you sure you want to delete the note ${note.title}`,
      buttons: ["Yes", "No"],
    });
    if (response === 0) {
      onDelete();
    }
  }, [note.title, onDelete]);

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, [note]);

  const draggableId = useUniqueId();

  return (
    // eslint-disable-next-line react/jsx-key
    <Draggable draggableId={`stream-note-${draggableId}`} index={location[1]}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shadow rounded m-2 px-2 bg-white"
        >
          <div className="float-right pt-2 pr-2">
            <Toolbar
              onCopy={handleCopy}
              onClose={onClose}
              onDelete={handleDelete}
              draggableProps={provided.dragHandleProps}
            />
          </div>

          <div className="p-2">
            <NoteEditorContainer id={note.id} onOpen={onOpen} />
          </div>

          <Backlinks note={note} onOpen={onOpen} />
        </div>
      )}
    </Draggable>
  );
};
