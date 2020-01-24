import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from "react";
import { StoreContext } from "./store";
import { NoteList } from "./components/NoteList";
import { NoteEditor } from "./components/NoteEditor";
import { Note } from "./interfaces/note";
import { NotesContext } from "./notesContext";

const App: React.FC = () => {
  const store = useContext(StoreContext);
  const [notes, setNotes] = useState(() => store.getNotes());
  const noteIds = useMemo(() => [...notes.keys()], [notes]);
  const [openNoteIds, setOpenNoteIds] = useState(noteIds.slice(0, 1));

  useEffect(() => {
    store.onUpdate(() => setNotes(store.getNotes()));
  }, [store]);

  const handleSelectNote = useCallback((id: string) => {
    setOpenNoteIds(ids => [...ids, id]);
  }, []);

  const handleUpdateNote = useCallback(
    (id: string, markdown: string) => {
      store.save(id, Note.fromMarkdown(markdown));
    },
    [store]
  );

  return (
    <NotesContext.Provider value={notes}>
      <div className="flex flex-1 ">
        <div className="p-2 max-w-xs bg-gray-100">
          <NoteList ids={noteIds} onSelectNote={handleSelectNote} />
        </div>

        <div className="flex-grow p-2">
          {[...openNoteIds].map(id => (
            <NoteEditor key={id} id={id} onUpdate={handleUpdateNote} />
          ))}
        </div>
      </div>
    </NotesContext.Provider>
  );
};

export default App;
