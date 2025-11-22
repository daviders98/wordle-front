import { useState, useEffect, useRef, useCallback } from "react";
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
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [jwtValue, setJwtValue] = useState<string | null>(null);

  const togglePreviousGameExist: () => void = () =>
    setPreviousGameExist((prev) => !prev);
  const getJWT = useCallback(async () => {
  const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`, {
    method: "POST",
    credentials: "include",
  });
  const jwt = await response.json();
  setJwtValue(jwt.token);
  return jwt.token || null;
}, []);

  useEffect(() => {
    getJWT();
    if (wakeUpCalled.current) return;
    wakeUpCalled.current = true;

    fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`)
      .then(() => setWakeUpDone(true))
      .catch(() => alert("Error, game cannot be played."));

    const previousData = localStorage.getItem("game-data");
    setPreviousGameExist(!!previousData);
  }, [getJWT]);

  useMidnightUTCReset();
  const finishedLoading = () => setLoadingFinished(true);

  return (
    <BrowserRouter>
      <StatsProvider>
        <Routes>
          <Route
            path="/"
            element={
              loadingFinished && wakeUpDone && jwtValue ? (
                <Onboarding
                  previousGameExist={previousGameExist}
                  jwtValue={jwtValue}
                  getJWT={getJWT}
                />
              ) : (
                <Loading animationEnded={finishedLoading} />
              )
            }
          />
          <Route
            path="/play"
            element={
              wakeUpDone && loadingFinished ? (
                <Game togglePreviousGameExist={togglePreviousGameExist} />
              ) : (
                <Loading animationEnded={finishedLoading} />
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
