// src/components/Footer.jsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center text-gray-500 dark:text-gray-400 text-sm py-4 mt-8 border-t border-gray-200 dark:border-gray-700">
      <p>
        © {currentYear} École Les Petits Génies – Tous droits réservés.
        <br />
        Application pédagogique " EL ROMANI.A  – Conçue avec ❤️ pour l’apprentissage.
      </p>
    </footer>
  );
}