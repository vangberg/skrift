import React, { useCallback } from "react";

import { Note } from "../../../skrift/note";
import { MiniCard } from "./MiniCard";
import { MiniCardToolbar } from "./MiniCardToolbar";
import { MiniCardBody } from "./MiniCardBody";

type Props = {
  note: Note;
};

export const MiniNoteCard: React.FC<Props> = ({ note }) => {
  return (
    <MiniCard>
      <MiniCardToolbar backgroundColor="bg-green-300" />
      <MiniCardBody>{note.title}</MiniCardBody>
    </MiniCard>
  );
};
