import React, { useContext, useMemo, useCallback } from "react";
import { StateContext } from "../state";
import { Editor } from "../components/Editor";
import { NoteID, Note } from "../interfaces/note";
import { StreamLocation } from "../interfaces/streams";
import { Node } from "slate";
import { useNote } from "../useNote";
import { IpcSetNote, IpcDeleteNote } from "../types";
import { ipcRenderer } from "electron";

interface Props {
  id: NoteID;
  location: StreamLocation;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, location }) => {
  const [, dispatch] = useContext(StateContext);
  const [stream] = location;
  const note = useNote(id);

  const handleUpdate = useCallback(
    (slate: Node[]) => {
      const message: IpcSetNote = { id, slate };
      ipcRenderer.send("set-note", message);
    },
    [id]
  );

  const handleDelete = useCallback(() => {
    dispatch({ type: "streams/CLOSE_NOTE", location });

    const message: IpcDeleteNote = { id };
    ipcRenderer.send("delete-note", message);
  }, [dispatch, location, id]);

  const handleOpen = useCallback(
    (id, push) => {
      const idx = push ? stream + 1 : stream;
      dispatch({ type: "streams/OPEN_NOTE", stream: idx, id });
    },
    [dispatch, stream]
  );

  const handleClose = useCallback(
    () => dispatch({ type: "streams/CLOSE_NOTE", location }),
    [dispatch, location]
  );

  if (!note) {
    return null;
  }

  return (
    <Editor
      note={note}
      onOpen={handleOpen}
      onDelete={handleDelete}
      onClose={handleClose}
      onUpdate={handleUpdate}
    />
  );
};
