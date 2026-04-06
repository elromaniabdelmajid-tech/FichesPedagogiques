import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext';
import { exportAllData, importAllData } from '../utils/storage';
import ProfileSelector from "./ProfileSelector";
import Footer from "./Footer";
import Statistics from "./Statistics";
import AdminPanel from "./AdminPanel"; // ← IMPORT AJOUTÉ

export default function LessonList({ lessons, onStartLesson, scores, onResetScores, onScoresChanged }) {
  const { theme, toggleTheme } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // ← ÉTAT POUR ADMIN
  const fileInputRef = useRef(null);

  // Niveaux et matières
  const levels = [...new Set(lessons.map((l) => l.level))];
  const subjects = [...new Set(lessons.map((l) => l.subject))];

  // Filtrage
  const filteredLessons = lessons.filter((lesson) => {
    if (selectedLevel !== "all" && lesson.level !== selectedLevel) return false;
    if (selectedSubject !== "all" && lesson.subject !== selectedSubject) return false;
    return true;
  });

  // Regroupement par matière
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const subject = lesson.subject;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(lesson);
    return acc;
  }, {});

  // Progression
  const totalFiltered = filteredLessons.length;
  const perfectCount = filteredLessons.filter((lesson) => {
    const saved = scores[lesson.id];
    return saved && saved.score === saved.total;
  }).length;
  const progressPercent = totalFiltered > 0 ? (perfectCount / totalFiltered) * 100 : 0;

  const getBadge = (lesson) => {
    const saved = scores[lesson.id];
    if (!saved) return null;
    const { score, total } = saved;
    if (score === total) return <span className="ml-2 text-yellow-500 text-xl" title="Parfait !">⭐</span>;
    if (score > 0) return <span className="ml-2 text-blue-500 text-sm" title={`${score}/${total}`}>{score}/{total}</span>;
    return null;
  };

  const handleExport = () => exportAllData();
  const handleImportClick = () => fileInputRef.current.click();
  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await importAllData(file);
      if (onScoresChanged) onScoresChanged();
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    event.target.value = '';
  };

  const handleAdminClick = () => {
    const pwd = prompt("Mot de passe admin :");
    if (pwd === "admin123") setShowAdmin(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow p-6 max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400">📚 Fiches pédagogiques</h1>
          <div className="flex gap-2">
            <ProfileSelector />
            <button onClick={toggleTheme} className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 justify-center mb-8">
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:text-white">
            <option value="all">Tous niveaux</option>
            {levels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:text-white">
            <option value="all">Toutes matières</option>
            {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mb-6 flex-wrap">
          <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded-xl">📤 Exporter</button>
          <button onClick={handleImportClick} className="px-4 py-2 bg-green-500 text-white rounded-xl">📥 Importer</button>
          <button onClick={onResetScores} className="px-4 py-2 bg-red-500 text-white rounded-xl">🔄 Réinitialiser</button>
          <button onClick={() => setShowStats(true)} className="px-4 py-2 bg-purple-500 text-white rounded-xl">📊 Statistiques</button>
          <button onClick={handleAdminClick} className="px-4 py-2 bg-gray-700 text-white rounded-xl">🔧 Admin</button>
          <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" className="hidden" />
        </div>

        {/* Barre de progression */}
        {totalFiltered > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progression ({perfectCount}/{totalFiltered})</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}

        {/* Message félicitations */}
        {totalFiltered > 0 && perfectCount === totalFiltered && (
          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-3 rounded-lg text-center mb-6">
            🎉 Félicitations ! Toutes les leçons sont réussies !
          </div>
        )}

        {/* Regroupement par matière */}
        <div className="space-y-8">
          {Object.entries(groupedLessons).map(([subject, lessonsGroup]) => (
            <div key={subject}>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4 border-b-2 border-pink-200 dark:border-pink-800 inline-block">
                {subject}
              </h3>
              <div className="grid gap-6 mt-4">
                {lessonsGroup.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div
                      className="cursor-pointer rounded-2xl shadow-md border-2 border-pink-200 dark:border-pink-800 p-6 bg-white dark:bg-gray-800"
                      onClick={() => onStartLesson(lesson)}
                      dir={lesson.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                        {lesson.title}
                        {getBadge(lesson)}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Clique pour commencer l'exercice ✏️
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      {showStats && <Statistics onClose={() => setShowStats(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}