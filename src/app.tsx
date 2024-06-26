import { ChangeEvent, useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import SearchNotes from './components/search-notes';
import Separator from './components/separator';
import { toast } from 'sonner';

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const noteOnStorage = localStorage.getItem('notes');

    if (noteOnStorage) {
      return JSON.parse(noteOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const noteArray = [newNote, ...notes];

    setNotes(noteArray);

    localStorage.setItem('notes', JSON.stringify(noteArray));
  }

  function onNoteEdited(id: string, content: string) {
    const newNote = {
      id,
      date: new Date(),
      content,
    };

    const noteArray = [newNote, ...notes.filter((note) => note.id !== id)];

    setNotes(noteArray);

    localStorage.setItem('notes', JSON.stringify(noteArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));

    toast.success('Nota deletada com sucesso!');
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 xl:px-0">
      <img id="logo" src={logo} alt="logo nlw expert" />

      <SearchNotes onChange={handleSearch} />

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onNoteDeleted={onNoteDeleted}
            onNoteEdited={onNoteEdited}
          />
        ))}
      </div>
    </div>
  );
}
