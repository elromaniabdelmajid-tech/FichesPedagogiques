import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { colors } from "../constants/colors";
import QuestionText from "./QuestionText";
import QuestionImage from "./QuestionImage";
import ShareLesson from "./ShareLesson";
import Footer from "./Footer";
import CourseModal from "./CourseModal";
import QuestionChoice from "./QuestionChoice";

export default function LessonPlayer({
  lesson,
  answers,
  showCorrection,
  onAnswerChange,
  onShowCorrection,
  onResetAnswers,
  onReturn,
  calculateScore,
  speak,
  revisionMode,
  incorrectIndices,
  onStartRevision,
  onExitRevision,
  activeProfile,
}) {
  const score = calculateScore();
  const isPerfect = score === lesson.questions.length;
  const isArabic = lesson.language === 'ar';

  const labels = {
    fr: {
      back: "← Retour",
      readTitle: "📖 Je lis",
      listen: "🔊 Écouter",
      answerTitle: "✏️ Je réponds",
      correct: "✔ Corriger",
      reset: "🔄 Reset",
      revise: "🔁 Réviser les erreurs",
      exitRevise: "✖️ Sortir de la révision",
      tipTitle: "💡 Astuce",
      tipText: "Relis bien le texte avant de répondre !",
      perfect: "🎉 Bravo ! Parfait !",
      good: "👍 Bien joué !",
      tryAgain: "💪 Essaie encore !",
      score: "🎯 Score",
      revisionBadge: (count) => `🔄 Mode révision (${count} question(s) à reprendre)`
    },
    ar: {
      back: "← رجوع",
      readTitle: "📖 أقرأ",
      listen: "🔊 استمع",
      answerTitle: "✏️ أجيب",
      correct: "✔ صحح",
      reset: "🔄 إعادة تعيين",
      revise: "🔁 مراجعة الأخطاء",
      exitRevise: "✖️ خروج من المراجعة",
      tipTitle: "💡 نصيحة",
      tipText: "أعد قراءة النص قبل الإجابة!",
      perfect: "🎉 رائع! ممتاز!",
      good: "👍 أحسنت!",
      tryAgain: "💪 حاول مرة أخرى!",
      score: "🎯 النتيجة",
      revisionBadge: (count) => `🔄 وضع المراجعة (${count} سؤال(أسئلة) للإعادة)`
    }
  };
  const t = labels[isArabic ? 'ar' : 'fr'];

  useEffect(() => {
    if (showCorrection && isPerfect && !revisionMode) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [showCorrection, isPerfect, revisionMode]);

  const displayedQuestions = revisionMode
    ? lesson.questions.filter((_, idx) => incorrectIndices.includes(idx))
    : lesson.questions;
	

  const getRealIndex = (displayedIndex) => {
    if (!revisionMode) return displayedIndex;
    return incorrectIndices[displayedIndex];
  };
  // Dans le composant, après les autres états (par exemple après revisionMode)
const [showCourse, setShowCourse] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="p-6 max-w-4xl mx-auto space-y-6" dir={isArabic ? "rtl" : "ltr"}>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:text-white"
            onClick={onReturn}
          >
            {t.back}
          </motion.button>
		  <button
  onClick={() => setShowCourse(true)}
  className="px-4 py-2 bg-indigo-500 text-white rounded-xl shadow"
>
  📚 Voir le cours
</button>

          <motion.div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{lesson.title}</h1>
            {revisionMode && <span className="mt-2 px-3 py-1 bg-yellow-200 rounded-full text-sm">{t.revisionBadge(incorrectIndices.length)}</span>}
          </motion.div>

          {/* Lecture */}
          <motion.div variants={fadeInUp} className={`${colors[lesson.color]} border-4 rounded-3xl p-6 shadow-lg text-center`}>
            <h2 className="text-2xl font-bold mb-4">{t.readTitle}</h2>
            <img src={lesson.image} alt="illustration" className="w-48 mx-auto mb-4" />
            <p className="text-lg whitespace-pre-line">{lesson.content}</p>
            <button onClick={speak} className="mt-4 px-5 py-2 bg-purple-500 text-white rounded-full">{t.listen}</button>
          </motion.div>

          {/* Questions */}
          <motion.div variants={fadeInUp} className="bg-blue-200 dark:bg-blue-900 border-4 border-blue-400 rounded-3xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">{t.answerTitle}</h2>
            <AnimatePresence>
              {displayedQuestions.map((q, displayIdx) => {
                const realIdx = getRealIndex(displayIdx);
                return (
                  <motion.div key={realIdx} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: displayIdx * 0.1 }}>
                    {q.type === "text" && (
                      <QuestionText index={realIdx} question={q.text} answerValue={answers[realIdx]} onChange={onAnswerChange}
                        showCorrection={showCorrection} validAnswers={q.answers} language={lesson.language} />
                    )}
                    {q.type === "image" && (
                      <QuestionImage index={realIdx} question={q.text} options={q.options} selectedValue={answers[realIdx]} onSelect={onAnswerChange}
                        showCorrection={showCorrection} validAnswers={q.answers} language={lesson.language} />
                    )}
					{q.type === "choice" && (
                  <QuestionChoice
                   index={realIdx}
                   question={q.text}
                   options={q.options}
                   selectedValue={answers[realIdx]}
                   onSelect={onAnswerChange}
                   showCorrection={showCorrection}
                   validAnswers={q.answers}
                   language={lesson.language}
                   />
                   )}
				   
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex flex-wrap gap-4">
              <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-green-500 text-white rounded-xl" onClick={onShowCorrection}>{t.correct}</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 border rounded-xl bg-white" onClick={onResetAnswers}>{t.reset}</motion.button>
              {!revisionMode && showCorrection && score < lesson.questions.length && (
                <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-yellow-500 text-white rounded-xl" onClick={onStartRevision}>{t.revise}</motion.button>
              )}
              {revisionMode && (
                <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gray-500 text-white rounded-xl" onClick={onExitRevision}>{t.exitRevise}</motion.button>
              )}
              {!revisionMode && <ShareLesson lessonId={lesson.id} lessonTitle={lesson.title} profileId={activeProfile?.id} />}
            </div>

            <AnimatePresence>
              {showCorrection && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-green-100 p-4 rounded-2xl text-center mt-4">
                    <motion.p className="text-xl font-bold" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      {t.score} : {score} / {lesson.questions.length}
                    </motion.p>
                    <div className="text-4xl mt-2">{"⭐".repeat(score)}</div>
                  </div>
                  <motion.div className="text-center text-2xl font-bold mt-4">
                    {isPerfect ? <p className="text-green-600">{t.perfect}</p> : score > 0 ? <p className="text-yellow-600">{t.good}</p> : <p className="text-red-600">{t.tryAgain}</p>}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Astuce */}
          <motion.div variants={fadeInUp} className="bg-pink-200 border-4 border-pink-400 rounded-3xl p-5 text-center">
            <h2 className="text-xl font-bold text-pink-800">{t.tipTitle}</h2>
            <p className="text-lg">{t.tipText}</p>
          </motion.div>
        </div>
      </div>
	  
      <Footer />
	  <CourseModal
  isOpen={showCourse}
  onClose={() => setShowCourse(false)}
  title={`Cours : ${lesson.title}`}
  content={lesson.course}
/>
    </div>
  );
}