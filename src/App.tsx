import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Game from './components/Game';
import Loading from './components/Loading';
import { StatsProvider } from './context/StatsContext';
import useMidnightUTCReset from './hooks/UseMidnightUTCReset';

function App() {
  const [wakeUpDone, setWakeUpDone] = useState(false);
  const wakeUpCalled = useRef(false);
  const [previousGameExist,setPreviousGameExist] = useState(false)

  useEffect(() => {
    if (wakeUpCalled.current) return;
    wakeUpCalled.current = true;

    fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`)
      .then(() => setWakeUpDone(true))
      .catch(() => alert('Error, game cannot be played.'));
    
    const previousData = localStorage.getItem('game-data')
    setPreviousGameExist(!!previousData)
  }, []);

  useMidnightUTCReset();

  return (
    <BrowserRouter>
    <StatsProvider>
      <Routes>
        <Route path="/" element={<Onboarding previousGameExist={previousGameExist}/>} />
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
