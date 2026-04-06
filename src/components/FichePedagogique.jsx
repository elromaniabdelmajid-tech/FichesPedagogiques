import { useState, useEffect } from "react";
import { loadLessons } from "../data/lessonStorage";
import { useProfile } from "../context/ProfileContext";
import { normalize, containsWord } from "../utils/normalize";
import LessonList from "./LessonList";
import LessonPlayer from "./LessonPlayer";

export default function FichePedagogique() {
  const { activeProfile, scores, saveScore, resetScores, switchProfile } = useProfile();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showCorrection, setShowCorrection] = useState(false);
  const [revisionMode, setRevisionMode] = useState(false);
  const [incorrectIndices, setIncorrectIndices] = useState([]);
  const [originalAnswers, setOriginalAnswers] = useState([]);

  // Chargement des leçons depuis le stockage
  useEffect(() => {
    setLessons(loadLessons());
  }, []);

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(""));
    setShowCorrection(false);
    setRevisionMode(false);
    setIncorrectIndices([]);
    setOriginalAnswers([]);
  };

  // Lecture des paramètres URL pour partage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');
    const profileId = params.get('profileId');
    if (profileId && switchProfile) {
      switchProfile(profileId);
    }
    if (lessonId && !selectedLesson && lessons.length > 0) {
      const lesson = lessons.find(l => l.id.toString() === lessonId);
      if (lesson) startLesson(lesson);
    }
  }, [lessons, selectedLesson, switchProfile]);

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
  const text = selectedLesson.content + ". " + selectedLesson.questions.map((q, i) => ` ${i+1}. ${q.text}. `).join('');
  const isArabic = selectedLesson.language === 'ar';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = isArabic ? 'ar-SA' : 'fr-FR';

  const speakWithVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (isArabic) {
      const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));
      if (arabicVoice) utterance.voice = arabicVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length) {
    speakWithVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = speakWithVoice;
  }
};

  if (!selectedLesson) {
    return <LessonList lessons={lessons} onStartLesson={startLesson} scores={scores} onResetScores={resetScores} />;
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