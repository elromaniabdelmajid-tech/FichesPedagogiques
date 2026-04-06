import { useState } from "react";
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import FichePedagogique from './components/FichePedagogique';
import HomePage from './components/HomePage';

function App() {
  const [showApp, setShowApp] = useState(false);

  const handleStart = () => setShowApp(true);

  if (!showApp) {
    return <HomePage onStart={handleStart} />;
  }

  return (
    <ThemeProvider>
      <ProfileProvider>
        <FichePedagogique />
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;