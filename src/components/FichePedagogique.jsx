import { useState, useEffect } from "react";
//import { loadLessons } from "../data/lessonStorageFirestore"; // à adapter si vous restez sur localStorage
import { loadLessons } from '../data/lessonStorage';
import { useProfile } from "../context/ProfileContext";
import { normalize, containsWord } from "../utils/normalize";
import LessonList from "./LessonList";
import LessonPlayer from "./LessonPlayer";

export default function FichePedagogique() {
  const { activeProfile, scores, saveScore, resetScores, switchProfile } = useProfile();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showCorrection, setShowCorrection] = useState(false);
  const [revisionMode, setRevisionMode] = useState(false);
  const [incorrectIndices, setIncorrectIndices] = useState([]);
  const [originalAnswers, setOriginalAnswers] = useState([]);

  useEffect(() => {
  const lessonsData = loadLessons();
  setLessons(lessonsData);
  setLoading(false);
}, []);

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(""));
    setShowCorrection(false);
    setRevisionMode(false);
    setIncorrectIndices([]);
    setOriginalAnswers([]);
  };

  const resetLesson = () => setSelectedLesson(null);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    if (!selectedLesson) return 0;
    let score = 0;
    selectedLesson.questions.forEach((q, i) => {
      const userAnswerRaw = answers[i] || "";
      const userAnswerNorm = normalize(userAnswerRaw);
      const validAnswers = q.answers;
      const isValid = validAnswers.some(ans => {
        const normAns = normalize(ans);
        if (normAns.includes(' ')) return userAnswerNorm.includes(normAns);
        return containsWord(userAnswerRaw, ans);
      });
      if (isValid) score++;
    });
    return score;
  };

  const handleShowCorrection = () => {
    if (selectedLesson) {
      const score = calculateScore();
      saveScore(selectedLesson.id, score, selectedLesson.questions.length);
    }
    setShowCorrection(true);
  };

  const startRevision = () => {
    if (!selectedLesson) return;
    const incorrect = [];
    const currentAnswers = [...answers];
    selectedLesson.questions.forEach((q, i) => {
      const userAnswerRaw = currentAnswers[i] || "";
      const userAnswerNorm = normalize(userAnswerRaw);
      const validAnswers = q.answers;
      const isValid = validAnswers.some(ans => {
        const normAns = normalize(ans);
        if (normAns.includes(' ')) return userAnswerNorm.includes(normAns);
        return containsWord(userAnswerRaw, ans);
      });
      if (!isValid && userAnswerRaw.trim() !== "") {
        incorrect.push(i);
      }
    });
    if (incorrect.length === 0) {
      alert("Aucune question à réviser !");
      return;
    }
    setOriginalAnswers([...answers]);
    const newAnswers = [...answers];
    incorrect.forEach(idx => { newAnswers[idx] = ""; });
    setAnswers(newAnswers);
    setIncorrectIndices(incorrect);
    setRevisionMode(true);
    setShowCorrection(false);
  };

  const exitRevision = () => {
    setAnswers(originalAnswers);
    setRevisionMode(false);
    setIncorrectIndices([]);
    setOriginalAnswers([]);
    setShowCorrection(false);
  };

  const speak = () => {
    if (!selectedLesson) return;
    let text = selectedLesson.content + ". ";
    selectedLesson.questions.forEach((q, i) => {
      text += ` Question ${i+1} : ${q.text}. `;
    });
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = selectedLesson.language === 'ar' ? 'ar-SA' : 'fr-FR';
    speechSynthesis.speak(msg);
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement des leçons...</div>;
  }

  if (!selectedLesson) {
    return (
      <LessonList
        lessons={lessons}
        onStartLesson={startLesson}
        scores={scores}
        onResetScores={resetScores}
        onScoresChanged={() => {}} // si nécessaire
      />
    );
  }

  return (
    <LessonPlayer
      lesson={selectedLesson}
      answers={answers}
      showCorrection={showCorrection}
      onAnswerChange={handleChange}
      onShowCorrection={handleShowCorrection}
      onResetAnswers={() => setAnswers(new Array(selectedLesson.questions.length).fill(""))}
      onReturn={resetLesson}
      calculateScore={calculateScore}
      speak={speak}
      revisionMode={revisionMode}
      incorrectIndices={incorrectIndices}
      onStartRevision={startRevision}
      onExitRevision={exitRevision}
      activeProfile={activeProfile}
    />
  );
}