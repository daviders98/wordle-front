import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import Game from "./components/Game";
import Loading from "./components/Loading";
import { StatsProvider } from "./context/StatsContext";
import useMidnightUTCReset from "./hooks/UseMidnightUTCReset";
import ChangelogPage from "./components/ChangelogPage";
import WordHistory from "./components/WordHistory";

function App() {
  const [wakeUpDone, setWakeUpDone] = useState(false);
  const wakeUpCalled = useRef(false);
  const [previousGameExist, setPreviousGameExist] = useState(false);

  const togglePreviousGameExist: () => void = () =>
    setPreviousGameExist((prev) => !prev);

  useEffect(() => {
    if (wakeUpCalled.current) return;
    wakeUpCalled.current = true;

    fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`)
      .then(() => setWakeUpDone(true))
      .catch(() => alert("Error, game cannot be played."));

    const previousData = localStorage.getItem("game-data");
    setPreviousGameExist(!!previousData);
  }, []);

  useMidnightUTCReset();

  return (
    <BrowserRouter>
      <StatsProvider>
        <Routes>
          <Route
            path="/"
            element={<Onboarding previousGameExist={previousGameExist} />}
          />
          <Route
            path="/play"
            element={
              wakeUpDone ? (
                <Game togglePreviousGameExist={togglePreviousGameExist} />
              ) : (
                <Loading />
              )
            }
          />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/history" element={<WordHistory />} />
        </Routes>
      </StatsProvider>
    </BrowserRouter>
  );
}

export default App;
