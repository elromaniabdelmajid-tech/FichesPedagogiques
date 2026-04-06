import { motion, AnimatePresence } from "framer-motion";

export default function CourseModal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">✖️</button>
          </div>
          <div className="p-6 prose dark:prose-invert max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500">Aucun contenu de cours disponible.</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}