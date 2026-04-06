import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

export default function ProfileSelector() {
  const { profiles, activeProfile, addProfile, switchProfile, deleteProfile } = useProfile();
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleCreateProfile = () => {
    if (!newName.trim()) return;
    const newProfile = {
      id: Date.now().toString(),
      name: newName.trim(),
      avatar: selectedAvatar,
    };
    addProfile(newProfile);
    setNewName('');
    setShowNewProfile(false);
  };

  // Si aucun profil n'existe, afficher le formulaire de création
  if (profiles.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Créer votre profil</h2>
          <input
            type="text"
            placeholder="Votre prénom"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mb-4 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {avatars.map(avatar => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`text-2xl p-2 rounded-full ${selectedAvatar === avatar ? 'bg-purple-200 dark:bg-purple-700' : ''}`}
              >
                {avatar}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreateProfile}
            disabled={!newName.trim()}
            className="w-full py-2 bg-purple-500 text-white rounded-xl disabled:opacity-50"
          >
            Créer
          </button>
        </div>
      </div>
    );
  }

  // Menu déroulant quand des profils existent
  return (
    <div className="relative">
      <button
        onClick={() => document.getElementById('profileDropdown')?.classList.toggle('hidden')}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <span className="text-2xl">{activeProfile?.avatar || '👤'}</span>
        <span className="font-medium">{activeProfile?.name || 'Profil'}</span>
        <span>▼</span>
      </button>
      <div
        id="profileDropdown"
        className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10"
      >
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => {
              switchProfile(profile.id);
              document.getElementById('profileDropdown')?.classList.add('hidden');
            }}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-xl">{profile.avatar}</span>
            <span>{profile.name}</span>
            {activeProfile?.id === profile.id && <span>✓</span>}
          </button>
        ))}
        <hr className="my-1" />
        <button
          onClick={() => setShowNewProfile(true)}
          className="flex items-center gap-2 w-full px-4 py-2 text-purple-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span>➕</span> Nouveau profil
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Supprimer le profil "${activeProfile?.name}" ?`)) {
              deleteProfile(activeProfile.id);
              document.getElementById('profileDropdown')?.classList.add('hidden');
            }
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          🗑️ Supprimer ce profil
        </button>
      </div>

      {/* Modal création nouveau profil */}
      {showNewProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Nouveau profil</h2>
            <input
              type="text"
              placeholder="Prénom"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl mb-4 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-2 rounded-full ${selectedAvatar === avatar ? 'bg-purple-200 dark:bg-purple-700' : ''}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewProfile(false)}
                className="flex-1 px-4 py-2 border rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProfile}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-xl"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}