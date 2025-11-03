import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Game from './components/Game';
import Loading from './components/Loading';
import { StatsProvider } from './context/StatsContext';

function App() {
  const [wakeUpDone, setWakeUpDone] = useState(false);
  const wakeUpCalled = useRef(false);

  useEffect(() => {
    if (wakeUpCalled.current) return;
    wakeUpCalled.current = true;

    fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`)
      .then(() => setWakeUpDone(true))
      .catch(() => alert('Error, game cannot be played.'));
  }, []);

  return (
    <BrowserRouter>
    <StatsProvider>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route
          path="/play"
          element={wakeUpDone ? <Game /> : <Loading />}
        />
      </Routes>
      </StatsProvider>
    </BrowserRouter>
  );
}

export default App;
