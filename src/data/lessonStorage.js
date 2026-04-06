import { lessons as defaultLessons } from './lessons';

const STORAGE_KEY = 'custom_lessons';

export const loadLessons = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialiser avec les leçons par défaut
  saveLessons(defaultLessons);
  return defaultLessons;
};

export const saveLessons = (lessons) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
};

// Dans lessonStorage.js
export const addLesson = (lesson) => {
  const lessons = loadLessons();
  const newId = Math.max(...lessons.map(l => l.id), 0) + 1;
 
  // Extrait de addLesson
const newLesson = {
  id: newId,
  title: lesson.title || "Nouvelle leçon",
  color: lesson.color || "yellow",
  content: lesson.content || "",
  image: lesson.image || "",
  level: lesson.level || "CP",
  subject: lesson.subject || "Général",
  language: lesson.language || "fr",
  course: lesson.course || "",   // ← AJOUT
  questions: lesson.questions || []
};
  const updated = [...lessons, newLesson];
  saveLessons(updated);
  return updated;
};

export const updateLesson = (lessonId, updatedLesson) => {
  const lessons = loadLessons();
  const index = lessons.findIndex(l => l.id === lessonId);
  if (index !== -1) {
    lessons[index] = { ...lessons[index], ...updatedLesson, id: lessonId };
    saveLessons(lessons);
  }
  return lessons;
};

export const deleteLesson = (lessonId) => {
  const lessons = loadLessons();
  const filtered = lessons.filter(l => l.id !== lessonId);
  saveLessons(filtered);
  return filtered;
};