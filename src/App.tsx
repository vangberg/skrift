import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from "react";
import produce from "immer";
import { StoreContext } from "./store";
import { NoteList } from "./components/NoteList";
import { NoteEditorContainer } from "./components/NoteEditor";
import { Note } from "./interfaces/note";
import { NotesContext } from "./notesContext";

const App: React.FC = () => {
  const store = useContext(StoreContext);
  const [notes, setNotes] = useState(() => store.getNotes());
  const noteIds = useMemo(() => [...notes.keys()].sort().reverse(), [notes]);
  const [openNoteIds, setOpenNoteIds] = useState(noteIds.slice(0, 1));

  useEffect(() => {
    store.onUpdate(() => setNotes(store.getNotes()));
  }, [store]);

  const handleSelectNote = useCallback(
    (id: string) => {
      setOpenNoteIds(ids =>
        produce(ids, draft => {
          if (ids.indexOf(id) < 0) {
            draft.push(id);
          }
        })
      );
    },
    [setOpenNoteIds]
  );

  const handleAddNote = useCallback(
    title => {
      const [id] = store.generate();
      store.save(id, Note.fromMarkdown(`# ${title}`));
      handleSelectNote(id);
    },
    [store, handleSelectNote]
  );

  const handleCloseNote = useCallback((id: string) => {
    setOpenNoteIds(ids => ids.filter(i => i !== id));
  }, []);

  return (
    <NotesContext.Provider value={notes}>
      <div className="flex flex-1 bg-gray-100">
        <div className="p-2 max-w-xs bg-white border-r-2">
          <NoteList
            ids={noteIds}
            onSelectNote={handleSelectNote}
            onAddNote={handleAddNote}
          />
        </div>

        <div className="flex-grow p-2 overflow-y-scroll">
          {[...openNoteIds].map(id => (
            <NoteEditorContainer key={id} id={id} onClose={handleCloseNote} />
          ))}
        </div>
      </div>
    </NotesContext.Provider>
  );
};

export default App;
