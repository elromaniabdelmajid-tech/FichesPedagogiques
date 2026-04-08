// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { loadLessons, addLesson, updateLesson, deleteLesson } from '../data/lessonStorageFirestore'; // ou lessonStorage selon votre config
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

  // Initialisation de l'éditeur TipTap pour le champ "cours"
  const editor = useEditor({
    extensions: [StarterKit, Image, Youtube],
    content: formData.course || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, course: editor.getHTML() }));
    },
  });

  useEffect(() => {
    loadLessons().then(setLessons);
  }, []);

  const handleSave = async () => {
    // Validations minimales
    if (!formData.title.trim()) { alert("Le titre est obligatoire."); return; }
    if (!formData.content.trim()) { alert("Le contenu est obligatoire."); return; }
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) { alert(`La question ${i+1} n'a pas de texte.`); return; }
      if (q.type === 'choice' && (!q.options || q.options.length === 0)) {
        alert(`La question ${i+1} est de type QCM texte mais n'a pas d'options.`);
        return;
      }
      if (q.type === 'image' && (!q.options || q.options.length === 0)) {
        alert(`La question ${i+1} est de type QCM image mais n'a pas d'options.`);
        return;
      }
      if (!q.answers || q.answers.length === 0) {
        alert(`La question ${i+1} n'a pas de réponses attendues.`);
        return;
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
          ? (q.options || []).filter(opt => typeof opt === 'string' ? opt.trim() !== "" : (opt?.text || "").trim() !== "")
          : (q.options || []).filter(opt => opt && opt.text && opt.text.trim() !== "" && opt.img && opt.img.trim() !== "")
      }))
    };
    if (editingLesson) {
      const updated = await updateLesson(editingLesson.id, dataToSave);
      setLessons(updated);
    } else {
      const updated = await addLesson(dataToSave);
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
    editor?.commands.setContent('');
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData(lesson);
    editor?.commands.setContent(lesson.course || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette leçon ?')) {
      const updated = await deleteLesson(id);
      setLessons(updated);
      if (editingLesson?.id === id) resetForm();
    }
  };

  // Gestion des questions
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

  // Gestion des options pour QCM texte
  const addTextOption = (qIdx) => {
    const newQuestions = [...formData.questions];
    if (!newQuestions[qIdx].options) newQuestions[qIdx].options = [];
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

  // Gestion des options pour QCM image
  const addImageOption = (qIdx) => {
    const newQuestions = [...formData.questions];
    if (!newQuestions[qIdx].options) newQuestions[qIdx].options = [];
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
          {/* Liste des leçons */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Leçons existantes</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {lessons.map(lesson => (
                <li key={lesson.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{lesson.title}</span>
                  <div>
                    <button onClick={() => handleEdit(lesson)} className="text-blue-500 mr-2">✏️</button>
                    <button onClick={() => handleDelete(lesson.id)} className="text-red-500">🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulaire d'ajout / modification */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{editingLesson ? 'Modifier' : 'Ajouter'} une leçon</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Titre" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
              <textarea placeholder="Contenu" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" rows="3" />
              <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
              <label className="block font-semibold">Cours (éditeur riche)</label>
              <EditorContent editor={editor} className="border rounded p-2 min-h-[200px] bg-white dark:bg-gray-700" />
              <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700">
                {Object.keys(colors).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Niveau" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
              <input type="text" placeholder="Matière" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
              <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700">
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>

              <h4 className="font-semibold">Questions</h4>
              {formData.questions.map((q, qIdx) => (
                <div key={qIdx} className="border p-2 rounded mb-2">
                  <input type="text" placeholder="Texte de la question" value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)} className="w-full p-1 mb-1 border rounded dark:bg-gray-700" />
                  <select value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value)} className="w-full p-1 mb-1 border rounded dark:bg-gray-700">
                    <option value="text">Texte libre</option>
                    <option value="choice">QCM texte</option>
                    <option value="image">QCM image</option>
                  </select>

                  {q.type === 'choice' && (
                    <div className="ml-4 mt-2 p-2 border-l-2 border-blue-300">
                      <p className="text-sm font-semibold">Options (texte) :</p>
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center mb-1">
                          <input type="text" placeholder="Option" value={opt} onChange={e => updateTextOption(qIdx, optIdx, e.target.value)} className="flex-1 p-1 border rounded dark:bg-gray-700" />
                          <button onClick={() => removeTextOption(qIdx, optIdx)} className="text-red-500 text-sm">🗑️</button>
                        </div>
                      ))}
                      <button onClick={() => addTextOption(qIdx)} className="text-sm bg-green-200 dark:bg-green-800 px-2 py-1 rounded">+ Ajouter option</button>
                    </div>
                  )}

                  {q.type === 'image' && (
                    <div className="ml-4 mt-2 p-2 border-l-2 border-blue-300">
                      <p className="text-sm font-semibold">Options (images) :</p>
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center mb-1">
                          <input type="text" placeholder="Texte" value={opt.text} onChange={e => updateImageOption(qIdx, optIdx, 'text', e.target.value)} className="flex-1 p-1 border rounded dark:bg-gray-700" />
                          <input type="text" placeholder="URL image" value={opt.img} onChange={e => updateImageOption(qIdx, optIdx, 'img', e.target.value)} className="flex-1 p-1 border rounded dark:bg-gray-700" />
                          <button onClick={() => removeImageOption(qIdx, optIdx)} className="text-red-500 text-sm">🗑️</button>
                        </div>
                      ))}
                      <button onClick={() => addImageOption(qIdx)} className="text-sm bg-green-200 dark:bg-green-800 px-2 py-1 rounded">+ Ajouter option</button>
                    </div>
                  )}

                  <input type="text" placeholder="Réponses (séparées par des virgules)" value={q.answers.join(',')} onChange={e => updateQuestion(qIdx, 'answers', e.target.value.split(',').map(s=>s.trim()))} className="w-full p-1 my-1 border rounded dark:bg-gray-700" />
                  <button onClick={() => removeQuestion(qIdx)} className="text-red-500 text-sm">Supprimer cette question</button>
                </div>
              ))}
              <button onClick={addQuestion} className="px-3 py-1 bg-green-500 text-white rounded">+ Ajouter question</button>

              <div className="flex gap-2 pt-3">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
                <button onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}