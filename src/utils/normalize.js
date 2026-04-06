// src/utils/normalize.js
export const normalize = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// Vérifie si le texte contient le mot recherché (mot entier)
export const containsWord = (text, word) => {
  const normalizedText = normalize(text);
  const normalizedWord = normalize(word);
  const regex = new RegExp(`\\b${normalizedWord}\\b`, 'i');
  return regex.test(normalizedText);
};