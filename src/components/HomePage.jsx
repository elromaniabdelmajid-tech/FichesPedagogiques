import { motion } from "framer-motion";
import Footer from "./Footer";

export default function HomePage({ onStart }) {
  const schoolLogo = "/images/logo.png";
  const schoolPhoto = "/images/ecole.jpg";
  const schoolName = "École Les Petits Génies";
  const welcomeMessage = "Bienvenue sur notre plateforme pédagogique ! Apprends en t'amusant avec nos fiches interactives.";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <img
              src={schoolLogo}
              alt="Logo"
              className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/128?text=Logo"; }}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-purple-700 dark:text-purple-300">
              {schoolName}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <img
              src={schoolPhoto}
              alt="Établissement"
              className="w-full h-64 object-cover"
              onError={(e) => { e.target.src = "https://picsum.photos/800/400"; }}
            />
            <div className="p-6 text-center">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                {welcomeMessage}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="px-8 py-3 bg-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-purple-700 transition"
              >
                Commencer l'aventure 🚀
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-500 dark:text-gray-400 text-sm space-y-1"
          >
            <p>📚 Des fiches pédagogiques interactives pour tous les niveaux</p>
            <p>🎯 Suivi des progrès, révisions et partage</p>
			<p>👨🏻‍🏫 EL ROMANI.A </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}