// src/data/lessonStorageFirestore.js
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { lessons as defaultLessons } from './lessons';

const COLLECTION = 'lessons';

export const loadLessons = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.empty) {
      // Initialiser avec les leçons par défaut
      for (const lesson of defaultLessons) {
        await setDoc(doc(db, COLLECTION, lesson.id.toString()), lesson);
      }
      return defaultLessons;
    }
    return snapshot.docs.map(doc => ({ id: Number(doc.id), ...doc.data() }));
  } catch (error) {
    console.error("Erreur Firestore :", error);
    return defaultLessons;
  }
};

export const addLesson = async (lesson) => {
  const newId = Date.now();
  const newLesson = { ...lesson, id: newId };
  await setDoc(doc(db, COLLECTION, newId.toString()), newLesson);
  return await loadLessons();
};

export const updateLesson = async (id, updatedLesson) => {
  await setDoc(doc(db, COLLECTION, id.toString()), { ...updatedLesson, id }, { merge: true });
  return await loadLessons();
};

export const deleteLesson = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id.toString()));
  return await loadLessons();
};