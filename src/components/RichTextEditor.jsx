import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image', 'video'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Contenu du cours (HTML)'
      });
      quillInstance.current.on('text-change', () => {
        onChange(quillInstance.current.root.innerHTML);
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillInstance.current && quillInstance.current.root.innerHTML !== value) {
      quillInstance.current.root.innerHTML = value || '';
    }
  }, [value]);

  return <div ref={editorRef} className="bg-white dark:bg-gray-800 rounded" />;
}