export const lessons = [
  {
    id: 1,
    title: "🐟 Le 1er avril",
    color: "yellow",
    content: "Le 1er avril est une journée spéciale : c’est le jour des blagues et des farces !\nEn France, on parle de poisson d’avril.",
    image: "/images/poisson.png",
    level: "CP",
    subject: "français",
    language: "fr",
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
    language: "fr",
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
    id: 3,
    title:  "📘 Informatique",
     image: "/images/informatique.png",
    color: "blue",
    content: "Dans cette leçon, nous allons découvrir les bases de la programmation : variables, conditions, boucles.",
    level: "CP",
    subject: "découverte du monde",
    language: "fr",
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
  }
];