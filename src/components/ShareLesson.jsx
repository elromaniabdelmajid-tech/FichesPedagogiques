import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareLesson({ lessonId, lessonTitle, profileId }) {
  const [showModal, setShowModal] = useState(false);
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}?lessonId=${lessonId}${profileId ? `&profileId=${profileId}` : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Lien copié dans le presse-papier !");
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-indigo-500 text-white rounded-xl shadow"
      >
        🔗 Partager
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 dark:text-white">Partager "{lessonTitle}"</h2>
              <div className="flex justify-center mb-4">
                <QRCodeSVG value={shareUrl} size={150} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-all">Lien : {shareUrl}</p>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl"
                >
                  Copier le lien
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}