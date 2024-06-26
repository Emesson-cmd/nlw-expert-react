import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import {  useState } from 'react';
import { toast } from 'sonner';
import RichEditor from './rich-editor';

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteEdited: (id: string, content: string) => void;
}

export function NoteCard({
  note: { id, date, content: currentContent },
  onNoteDeleted,
  onNoteEdited,
}: NoteCardProps) {
  const [content, setContent] = useState(currentContent);
  const [shouldShowDeleteButton, setShouldShowDeleteButton] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleContentChange(value: string) {
    setContent(value);
    setShouldShowDeleteButton(false);
  }

  function handleResetEditing() {
    setContent(currentContent);
    setShouldShowDeleteButton(true);
  }

  function handleSaveEditing() {
    if (content === '') {
      toast.info('Vocë náo tem nenhum conteúdo.');
      return;
    }

    onNoteEdited(id, content);

    setOpen(false);

    toast.success('Nota salva com sucesso!');
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
        </span>

        <RichEditor readOnly value={content} />

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-0 right-0 rounded-tr-md bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5  max-h-[calc(100%-3rem)]">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
            </span>

            <RichEditor onChange={handleContentChange} value={content} />
          </div>

          <div className='rounded-br-md rounded-bl-md overflow-hidden'>
            {shouldShowDeleteButton ? (
              confirmDelete ? (
                <div className="flex flex-row">
                  <button
                    type="button"
                    onClick={() => onNoteDeleted(id)}
                    className="w-[50%] bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
                  >
                    <span className="text-red-400 hover:underline group-hover:underline">
                      Apagar essa nota
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="w-[50%] bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
                  >
                    <span className="text-lime-400 hover:underline group-hover:underline">
                      Não apagar essa nota
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
                >
                  Deseja{' '}
                  <span className="text-red-400 hover:underline group-hover:underline">
                    apagar essa nota
                  </span>
                  ?
                </button>
              )
            ) : (
              <div className="flex flex-row">
                <button
                  type="button"
                  onClick={handleResetEditing}
                  className="w-[50%] bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
                >
                  <span className="text-red-400 hover:underline group-hover:underline">
                    Resetar edição
                  </span>
                </button>

                <button
                  type="button"
                  className="w-[50%] bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                  onClick={handleSaveEditing}
                >
                  Salvar edição
                </button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
