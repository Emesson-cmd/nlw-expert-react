import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import RichEditor from './rich-editor';

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChange(value: string) {

    setContent(value);

    if (value === '<p><br></p>') {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === '') {
      if (shouldShowOnboarding) {
        toast.info('Escolha uma opção para escrever o conteúdo.');
      } else {
        toast.info('Vocë ainda náo tem nenhum conteúdo.');
      }

      return;
    }

    onNoteCreated(content);

    setContent('');
    setShouldShowOnboarding(true);

    setOpen(false);

    toast.success('Nota salva com sucesso!');
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Infelizmente seu navegador não suporta a API de gravação!');
      return;
    }

    if ('brave' in navigator) {
      toast.error('Navegador Brave ainda não é compatível com digitação por voz.');
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcrription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');

      setContent(transcrription);
    };

    speechRecognition.onerror = (event) => {
      console.log(event.error);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    speechRecognition?.stop();
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 text-left gap-y-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50 " />
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none md:max-h-[70vh]">
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col max-h-[100vh] md:max-h-[60vh]">
            <div className="flex flex-1 flex-col gap-3 p-5 h-0">
              <span className="text-sm font-medium text-slate-300">Aidiconar nota</span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-md text-lime-400 hover:underline mx-1"
                  >
                    gravando uma nota
                  </button>
                  em áudio ou se preferir
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-md text-lime-400 hover:underline mx-1"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <RichEditor onChange={handleContentChange} value={content} />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full bg-red-500 animate-ping" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handleSaveNote}
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
