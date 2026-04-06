// src/components/QuestionImage.jsx
import { motion } from "framer-motion";

export default function QuestionImage({
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

  // Vérifie que options est bien un tableau
  if (!options || !Array.isArray(options)) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow" dir={isRTL ? "rtl" : "ltr"}>
      <p className="text-lg font-bold mb-3 dark:text-white">
        {index + 1}. {question}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(index, opt.text)}
            className={`p-3 rounded-2xl border-2 shadow ${
              selectedValue === opt.text
                ? "bg-green-300 dark:bg-green-700 border-green-500"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <img
              src={opt.img}
              alt={opt.text}
              className="w-20 h-20 mx-auto mb-2 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=Image";
              }}
            />
            <p className="text-lg dark:text-white">{opt.text}</p>
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