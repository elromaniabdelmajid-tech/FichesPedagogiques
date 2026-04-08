import { motion } from "framer-motion";

export default function QuestionChoice({
  index,
  question,
  options,
  selectedValue,
  onSelect,
  showCorrection,
  validAnswers,
  language,
}) {
  const isRTL = language === 'ar';
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow" dir={isRTL ? "rtl" : "ltr"}>
      <p className="text-lg font-bold mb-3 dark:text-white">
        {index + 1}. {question}
      </p>
      <div className="flex flex-wrap gap-4">
        {options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(index, opt)}
            className={`px-4 py-2 rounded-xl border-2 shadow ${
              selectedValue === opt
                ? "bg-green-300 dark:bg-green-700 border-green-500"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
      {showCorrection && (
        <div className="text-green-700 dark:text-green-400 font-semibold mt-2">
          <p>✔ Réponses : {validAnswers.join(" / ")}</p>
          <p>✏️ Ta réponse : {selectedValue || "..."}</p>
        </div>
      )}
    </div>
  );
}