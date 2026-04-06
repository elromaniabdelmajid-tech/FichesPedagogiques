import { motion } from "framer-motion";
export default function QuestionText({
  index,
  question,
  answerValue,
  onChange,
  showCorrection,
  validAnswers,
  language,
}) {
  const isRTL = language === 'ar';
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow" dir={isRTL ? "rtl" : "ltr"}>
      <p className="font-semibold text-lg mb-2 dark:text-white">
        {index + 1}. {question}
      </p>
      <textarea
        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 text-lg bg-white dark:bg-gray-700 dark:text-white"
        rows={2}
        value={answerValue}
        onChange={(e) => onChange(index, e.target.value)}
        dir={isRTL ? "rtl" : "ltr"}
      />
      {showCorrection && (
        <div className="text-green-700 dark:text-green-400 font-semibold mt-2">
          <p>✔ Réponses : {validAnswers.join(" / ")}</p>
          <p>✏️ Ta réponse : {answerValue || "..."}</p>
        </div>
      )}
    </div>
  );
}
