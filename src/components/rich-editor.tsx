import ReactQuill, { QuillOptions } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

type RichEditorProps = {
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

const quillOptions: QuillOptions = {
  theme: 'bubble',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  },
};

export default function RichEditor({ value, readOnly = false, onChange }: RichEditorProps) {
  return (
    <ReactQuill
      className="react-quill-container text-sm leading-6 text-slate-400 bg-slate-800 resize-none flex-1 outline-none"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={readOnly ? '' : 'Escreva algo...'}
      {...quillOptions}
    />
  );
}
