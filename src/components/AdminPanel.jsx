// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { loadLessons, addLesson, updateLesson, deleteLesson } from '../data/lessonStorage';
import { colors } from '../constants/colors';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

export default function AdminPanel({ onClose }) {
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    color: 'yellow',
    content: '',
    image: '',
    level: 'CP',
    subject: '',
    language: 'fr',
    course: '',
    questions: []
  });

  const editor = useEditor({
    extensions: [StarterKit, Image, Youtube],
    content: formData.course || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, course: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (editor && editingLesson) {
      editor.commands.setContent(editingLesson.course || '');
    }
  }, [editingLesson, editor]);

  // ✅ LOAD LESSONS (async)
  useEffect(() => {
    const fetchLessons =  () => {
      const data =  loadLessons();
      setLessons(data);
    };
    fetchLessons();
  }, []);

  // ✅ SAVE LESSON (async)
  const handleSave = () => {
    if (!formData.title.trim()) return alert("Le titre est obligatoire.");
    if (!formData.content.trim()) return alert("Le contenu est obligatoire.");

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) return alert(`La question ${i + 1} n'a pas de texte.`);
      if (q.type === 'choice' && (!q.options || q.options.length === 0)) {
        return alert(`La question ${i + 1} n'a pas d'options.`);
      }
      if (q.type === 'image' && (!q.options || q.options.length === 0)) {
        return alert(`La question ${i + 1} n'a pas d'images.`);
      }
      if (!q.answers || q.answers.length === 0) {
        return alert(`La question ${i + 1} n'a pas de réponses.`);
      }
    }

    const dataToSave = {
      ...formData,
      subject: formData.subject.trim() || "Général",
      level: formData.level.trim() || "CP",
      language: formData.language || "fr",
      course: formData.course || '',
      questions: formData.questions.map(q => ({
        ...q,
        text: q.text.trim(),
        answers: (q.answers || []).filter(a => a.trim() !== ""),
        options: q.type === 'choice'
          ? (q.options || []).filter(opt =>
              typeof opt === 'string'
                ? opt.trim() !== ""
                : (opt?.text || "").trim() !== ""
            )
          : (q.options || []).filter(opt =>
              opt && opt.text?.trim() && opt.img?.trim()
            )
      }))
    };

    if (editingLesson) {
      const updated = updateLesson(editingLesson.id, dataToSave);
      setLessons(updated);
    } else {
      const updated = addLesson(dataToSave);
      setLessons(updated);
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingLesson(null);
    setFormData({
      title: '',
      color: 'yellow',
      content: '',
      image: '',
      level: 'CP',
      subject: '',
      language: 'fr',
      course: '',
      questions: []
    });
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData(lesson);
  };

  // ✅ DELETE (async)
  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette leçon ?')) {
      const updated =  deleteLesson(id);
      setLessons(updated);
      if (editingLesson?.id === id) resetForm();
    }
  };

  // QUESTIONS
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '', type: 'text', answers: [], options: [] }]
    });
  };

  const updateQuestion = (idx, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[idx][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (idx) => {
    const newQuestions = formData.questions.filter((_, i) => i !== idx);
    setFormData({ ...formData, questions: newQuestions });
  };

  // OPTIONS TEXTE
  const addTextOption = (qIdx) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateTextOption = (qIdx, optIdx, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options[optIdx] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeTextOption = (qIdx, optIdx) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options = newQuestions[qIdx].options.filter((_, i) => i !== optIdx);
    setFormData({ ...formData, questions: newQuestions });
  };

  // OPTIONS IMAGE
  const addImageOption = (qIdx) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options.push({ text: '', img: '' });
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateImageOption = (qIdx, optIdx, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options[optIdx][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeImageOption = (qIdx, optIdx) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIdx].options = newQuestions[qIdx].options.filter((_, i) => i !== optIdx);
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Administration des leçons</h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded">Fermer</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LISTE */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Leçons</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {lessons.map(lesson => (
                <li key={lesson.id} className="flex justify-between p-2 border rounded">
                  <span>{lesson.title}</span>
                  <div>
                    <button onClick={() => handleEdit(lesson)}>✏️</button>
                    <button onClick={() => handleDelete(lesson.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* FORM */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {editingLesson ? 'Modifier' : 'Ajouter'} une leçon
            </h3>

            <input type="text" placeholder="Titre"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded mb-2" />

            <textarea placeholder="Contenu"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full p-2 border rounded mb-2" />

            <label className="font-semibold">Cours :</label>
            <EditorContent editor={editor} className="border p-2 mb-2" />

            <button onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}