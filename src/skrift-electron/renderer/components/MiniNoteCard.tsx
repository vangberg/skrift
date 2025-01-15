import React, { useCallback } from "react";

import { Note } from "../../../skrift/note/index.js";
import { MiniCard } from "./MiniCard.js";
import { MiniCardToolbar } from "./MiniCardToolbar.js";
import { MiniCardBody } from "./MiniCardBody.js";

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
