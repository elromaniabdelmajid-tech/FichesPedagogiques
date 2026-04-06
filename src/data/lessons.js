export const lessons = [
  {
    id: 1,
    title: "🐟 Le 1er avril",
    color: "yellow",
    content: `Le 1er avril est une journée spéciale : c’est le jour des blagues et des farces !
En France, on parle de poisson d’avril.`,
    level: "CP",          // Niveau
    subject: "français",  // Matière
    image: "/images/poisson.png",
    questions: [
      {
        text: "Comment s'appelle la fête en France ?",
        type: "text",
        answers: ["poisson d’avril"]
      },
      {
        text: "Quel roi a changé le Nouvel An ?",
        type: "text",
        answers: ["charles ix"]
      },
      {
        text: "Pourquoi certains continuaient en avril ?",
        type: "text",
        answers: ["habitudes"]
      }
    ]
  },
  {
    id: 2,
    title: "🌦️ Les saisons",
    image: "/images/saisons.png",
    color: "blue",
    content: "Il y a quatre saisons : hiver, printemps, été et automne.",
    level: "CP",
    subject: "découverte du monde",
    questions: [
      {
        text: "Combien y a-t-il de saisons ?",
        type: "text",
        answers: ["4", "quatre"]
      },
      {
        text: "Quelle est la saison actuelle ?",
        type: "image",
        options: [
          { text: "hiver", img: "/images/hiver.png" },
          { text: "printemps", img: "/images/printemps.png" },
          { text: "été", img: "/images/ete.png" },
          { text: "automne", img: "/images/automne.png" }
        ],
        answers: ["printemps"]
      }
    ]
  },

 {
  id: 3, // ID unique
  title: "🐮 Les animaux de la ferme",
  color: "green", // une couleur parmi celles définies dans colors.js
  content: `Dans la ferme, il y a des animaux : la vache, le cochon, le mouton, la poule, le canard...
Chaque animal a son cri et ses habitudes.`,
  image: "/images/ferme.png", // illustration principale (à placer dans public/images/)
  level: "CP",
  subject: "découverte du monde",
  questions: [
    // Question 1 : texte libre
    {
      text: "Quel animal dit 'meuh' ?",
      type: "text",
      answers: ["vache"]
    },
    // Question 2 : texte libre
    {
      text: "Quel animal dit 'coin-coin' ?",
      type: "text",
      answers: ["canard"]
    },
    // Question 3 : QCM avec images
    {
      text: "Quel animal donne du lait ?",
      type: "image",
      options: [
        { text: "vache", img: "/images/vache.png" },
        { text: "cochon", img: "/images/cochon.png" },
        { text: "mouton", img: "/images/mouton.png" }
      ],
      answers: ["vache"]
    }
  ]
},
{
  id: 4,
  title: "🍎 Les fruits",
  color: "green",          // couleur du bandeau (jaune, bleu, rose, vert)
  content: "Les fruits sont délicieux et pleins de vitamines. Connais-tu leur nom ?",
  image: "/images/fruits.png",
  level: "CP",
  subject: "découverte du monde",
  questions: [
    {
      text: "Quel fruit est rouge et rond ?",
      type: "image",
      options: [
        { text: "pomme", img: "/images/pomme.png" },
        { text: "banane", img: "/images/banane.png" },
        { text: "cerise", img: "/images/cerise.png" }
      ],
      answers: ["pomme"]
    },
    {
      text: "Quel fruit est jaune et allongé ?",
      type: "image",
      options: [
        { text: "orange", img: "/images/orange.png" },
        { text: "banane", img: "/images/banane.png" },
        { text: "poire", img: "/images/poire.png" }
      ],
      answers: ["banane"]
    },
    {
      text: "Quel fruit est orange et rond ?",
      type: "image",
      options: [
        { text: "pomme", img: "/images/pomme.png" },
        { text: "orange", img: "/images/orange.png" },
        { text: "citron", img: "/images/citron.png" }
      ],
      answers: ["orange"]
    }
  ]
},
{
  id:5,
  title: "➕ Mathématique;",
  color: "green",          // couleur du bandeau (jaune, bleu, rose, vert)
  content: "Pour faire la somme d'un chiffre avec le nombre 10 ,On remplace le zéro des unitée par ce chiffre ",
  image: "/images/Maths.png",
  level: "CP",
  subject: "faire la somme avec 10 et un chifre ",
  questions: [
    {
      text: "quelle est la valeur de la somme de 10+3 ",
      type: "image",
      options: [
        { text: "31" },
        { text: "33" },
        { text: "13" }
      ],
      answers: ["13"]
    },
    {
      text: "Quel fruit est jaune et allongé ?",
      type: "image",
      options: [
        { text: "orange", img: "/images/orange.png" },
        { text: "banane", img: "/images/banane.png" },
        { text: "poire", img: "/images/poire.png" }
      ],
      answers: ["banane"]
    },
    {
      text: "Quel fruit est orange et rond ?",
      type: "image",
      options: [
        { text: "pomme", img: "/images/pomme.png" },
        { text: "orange", img: "/images/orange.png" },
        { text: "citron", img: "/images/citron.png" }
      ],
      answers: ["orange"]
    }
  ]
},

 {
  id: Date.now(),
  title: "درس تجريبي بالعربية",
  color: "green",
  content: "هذا درس تجريبي باللغة العربية. أجب على الأسئلة التالية.",
  image: "/images/saisons.png", // image existante
  level: "CP",
  subject: "اللغة العربية",
  language: "ar",
  questions: [
    {
      text: "ما هو لون السماء؟",
      type: "text",
      answers: ["أزرق", "ازرق"]
    },
    {
      text: "اختر الحيوان الذي يعيش في الماء:",
      type: "image",
      options: [
        { text: "سمكة", img: "/images/poisson.png" },
        { text: "بقرة", img: "/images/vache.png" }
      ],
      answers: ["سمكة"]
    }
  ]
}

];