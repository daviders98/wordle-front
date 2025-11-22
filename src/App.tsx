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
  const [pastWords, setPastWords] = useState(null);

  const togglePreviousGameExist: () => void = () =>
    setPreviousGameExist((prev) => !prev);
  const getJWT = useCallback(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const jwt = await response.json();
    setJwtValue(jwt.token);
    return jwt.token || null;
  }, []);

  const getPastWords = useCallback(
    async ({
      retry = true,
      token = null,
    }: {
      retry: boolean;
      token: string | null;
    }): Promise<any> => {
      const response = await fetch(
        `${process.env.REACT_APP_RENDER_BASE_URL}/api/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401 && retry) {
        const token = await getJWT();
        return await getPastWords({ retry: false, token: token });
      }
      const data = await response.json();

      setPastWords(data);
      return data;
    },
    [getJWT],
  );
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
  useEffect(() => {
    getPastWords({ retry: true, token: jwtValue || null });
  }, [jwtValue, getPastWords]);

  useMidnightUTCReset();
  const finishedLoading = useCallback(() => {
    setLoadingFinished(true);
  }, [setLoadingFinished]);

  return (
    <BrowserRouter>
      <StatsProvider>
        <Routes>
          <Route
            path="/"
            element={
              loadingFinished && wakeUpDone && jwtValue && pastWords ? (
                <Onboarding
                  previousGameExist={previousGameExist}
                  pastWords={pastWords}
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
