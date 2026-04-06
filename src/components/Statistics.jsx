// src/components/Statistics.jsx
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { loadLessons } from '../data/lessonStorage';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

export default function Statistics({ onClose }) {
  const { activeProfile, scores } = useProfile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const loaded = loadLessons();
      setLessons(loaded || []);
    } catch (err) {
      console.error("Erreur chargement leçons:", err);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!activeProfile || loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
          <p className="text-lg">Chargement des statistiques...</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Fermer</button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
          <p className="text-lg">Aucune leçon trouvée.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Fermer</button>
        </div>
      </div>
    );
  }

  // Données par leçon
  const lessonData = lessons.map(lesson => {
    const saved = scores[lesson.id];
    const score = saved ? saved.score : 0;
    const total = saved ? saved.total : (lesson.questions ? lesson.questions.length : 0);
    return {
      name: lesson.title.length > 15 ? lesson.title.substring(0, 12) + '...' : lesson.title,
      score,
      total,
    };
  });

  const totalScore = lessonData.reduce((acc, d) => acc + d.score, 0);
  const totalPossible = lessonData.reduce((acc, d) => acc + d.total, 0);
  const pieData = [
    { name: 'Réussite', value: totalScore },
    { name: 'Non acquis', value: totalPossible - totalScore },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  const subjectMap = {};
  lessons.forEach(lesson => {
    const subj = lesson.subject || 'Sans matière';
    const saved = scores[lesson.id];
    const score = saved ? saved.score : 0;
    const total = saved ? saved.total : (lesson.questions ? lesson.questions.length : 0);
    if (!subjectMap[subj]) subjectMap[subj] = { score: 0, total: 0 };
    subjectMap[subj].score += score;
    subjectMap[subj].total += total;
  });
  const subjectData = Object.entries(subjectMap).map(([name, { score, total }]) => ({
    name: name.length > 10 ? name.substring(0, 8) + '...' : name,
    percentage: total > 0 ? (score / total) * 100 : 0,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Statistiques de progression</h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded">Fermer</button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Scores par leçon</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lessonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#ccc' : '#333' }} />
                <YAxis tick={{ fill: isDark ? '#ccc' : '#333' }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff' }} />
                <Legend />
                <Bar dataKey="score" fill="#3b82f6" name="Score obtenu" />
                <Bar dataKey="total" fill="#9ca3af" name="Total possible" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Réussite globale</h3>
            <p className="text-center text-lg">{Math.round((totalScore/totalPossible)*100)}% de réussite</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name}: ${(percent*100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                  {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Résultats par matière</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#ccc' : '#333' }} />
                <YAxis domain={[0,100]} tick={{ fill: isDark ? '#ccc' : '#333' }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff' }} />
                <Legend />
                <Bar dataKey="percentage" fill="#8b5cf6" name="Pourcentage de réussite (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}