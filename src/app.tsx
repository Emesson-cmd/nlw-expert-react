import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import SearchNotes from './components/search-notes';
import Separator from './components/separator';

const note = {
  date: new Date(),
  content: 'Hello world',
};

export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="logo nlw expert" />
      <SearchNotes />
      <Separator />

      <div className="grid grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard />
        <NoteCard note={note} />
        <NoteCard note={note} />
      </div>
    </div>
  );
}
