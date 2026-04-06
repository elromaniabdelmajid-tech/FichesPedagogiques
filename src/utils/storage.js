// src/utils/storage.js

// ---------- Profils ----------
export const getProfiles = () => {
  const stored = localStorage.getItem('profiles');
  return stored ? JSON.parse(stored) : [];
};

export const saveProfile = (profile) => {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem('profiles', JSON.stringify(profiles));
  return profiles;
};

export const deleteProfile = (profileId) => {
  let profiles = getProfiles();
  profiles = profiles.filter(p => p.id !== profileId);
  localStorage.setItem('profiles', JSON.stringify(profiles));
  localStorage.removeItem(`scores_${profileId}`);
  return profiles;
};

// ---------- Scores par profil ----------
export const getScoresForProfile = (profileId) => {
  const stored = localStorage.getItem(`scores_${profileId}`);
  return stored ? JSON.parse(stored) : {};
};

export const saveScoreForProfile = (profileId, lessonId, score, total) => {
  const scores = getScoresForProfile(profileId);
  scores[lessonId] = { score, total, timestamp: Date.now() };
  localStorage.setItem(`scores_${profileId}`, JSON.stringify(scores));
  return scores;
};

export const resetAllScoresForProfile = (profileId) => {
  localStorage.removeItem(`scores_${profileId}`);
  return {};
};

// ---------- Export / Import ----------
export const exportAllData = () => {
  const profiles = getProfiles();
  const allScores = {};
  profiles.forEach(profile => {
    allScores[profile.id] = getScoresForProfile(profile.id);
  });
  const exportData = { profiles, scores: allScores };
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `profil_scores_${new Date().toISOString().slice(0,19)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importAllData = (jsonFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.profiles && data.scores) {
          localStorage.setItem('profiles', JSON.stringify(data.profiles));
          for (const [profileId, scores] of Object.entries(data.scores)) {
            localStorage.setItem(`scores_${profileId}`, JSON.stringify(scores));
          }
          resolve(data);
        } else {
          reject(new Error('Format JSON invalide : doit contenir "profiles" et "scores".'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(jsonFile);
  });
};