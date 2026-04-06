import { createContext, useContext, useState, useEffect } from 'react';
import { getProfiles, getScoresForProfile, saveScoreForProfile, resetAllScoresForProfile } from '../utils/storage';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [scores, setScores] = useState({});

  // Charger les profils au démarrage
  useEffect(() => {
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
    const savedActiveId = localStorage.getItem('activeProfileId');
    if (savedActiveId && loadedProfiles.find(p => p.id === savedActiveId)) {
      const profile = loadedProfiles.find(p => p.id === savedActiveId);
      setActiveProfile(profile);
      setScores(getScoresForProfile(profile.id));
    } else if (loadedProfiles.length > 0) {
      setActiveProfile(loadedProfiles[0]);
      setScores(getScoresForProfile(loadedProfiles[0].id));
    }
  }, []);

  // Sauvegarder le profil actif dans localStorage
  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('activeProfileId', activeProfile.id);
      setScores(getScoresForProfile(activeProfile.id));
    } else {
      localStorage.removeItem('activeProfileId');
      setScores({});
    }
  }, [activeProfile]);

  const addProfile = (profile) => {
    const newProfiles = [...profiles, profile];
    setProfiles(newProfiles);
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    setActiveProfile(profile);
  };

  const switchProfile = (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  const deleteProfile = (profileId) => {
    const newProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(newProfiles);
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    localStorage.removeItem(`scores_${profileId}`);
    
    if (activeProfile?.id === profileId) {
      if (newProfiles.length > 0) {
        setActiveProfile(newProfiles[0]);
      } else {
        setActiveProfile(null);
      }
    }
  };

  const saveScore = (lessonId, score, total) => {
    if (!activeProfile) return;
    const newScores = saveScoreForProfile(activeProfile.id, lessonId, score, total);
    setScores(newScores);
  };

  const resetScores = () => {
    if (!activeProfile) return;
    resetAllScoresForProfile(activeProfile.id);
    setScores({});
  };

  return (
    <ProfileContext.Provider value={{
      profiles,
      activeProfile,
      scores,
      addProfile,
      switchProfile,
      deleteProfile,
      saveScore,
      resetScores,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
}