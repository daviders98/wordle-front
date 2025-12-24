import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import Game from "./components/Game";
import Loading from "./components/Loading";
import { StatsProvider } from "./context/StatsContext";
import useMidnightUTCReset from "./hooks/UseMidnightUTCReset";
import ChangelogPage from "./components/ChangelogPage";
import WordHistory from "./components/WordHistory";
import { isSameUTCDate } from "./utils/helpers";
import { SolutionMeaningProvider } from "./context/SolutionMeaningContext";

interface PastWordsResponse {
  words: any[];
  page: number;
  per_page: number;
  total: number;
  latest_solution_number: number;
}

function App() {
  const [wakeUpDone, setWakeUpDone] = useState(false);
  const wakeUpCalled = useRef(false);
  const [previousGameExist, setPreviousGameExist] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [jwtValue, setJwtValue] = useState<string | null>(null);
  const [pastWords, setPastWords] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [total, setTotal] = useState<number | null>(null);
  const [loadingWords, setLoadingWords] = useState(true);
  const [solutionNumber, setSolutionNumber] = useState(0);

  const togglePreviousGameExist: () => void = () =>
    setPreviousGameExist((prev) => !prev);

  const checkDailyReset = useCallback(() => {
    const statsRaw = localStorage.getItem("wordle-stats");
    if (!statsRaw) return;
    try {
      const stats = JSON.parse(statsRaw);
      const lastPlayed = stats.lastPlayedDate;
      if (!isSameUTCDate(lastPlayed)) {
        localStorage.removeItem("game-data");
        window.location.reload();
      }
    } catch (e) {
      console.error("Failed to parse stats during visibility check:", e);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkDailyReset();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [checkDailyReset]);

  const getJWT = useCallback(async (): Promise<string | null> => {
    const response = await fetch(
      `${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`,
      { method: "POST", credentials: "include" },
    );
    const jwt = await response.json();
    setJwtValue(jwt.token);
    return jwt.token || null;
  }, []);

  const getPastWords = useCallback(
    async (pageParam: number): Promise<void> => {
      if (!jwtValue) return;

      setLoadingWords(true);

      const response = await fetch(
        `${process.env.REACT_APP_RENDER_BASE_URL}/api/list?page=${pageParam}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtValue}`,
          },
        },
      );

      if (response.status === 401) {
        await getJWT();
        return getPastWords(pageParam);
      }

      const data: PastWordsResponse = await response.json();
      setSolutionNumber(data.latest_solution_number);
      setPastWords(data.words);
      setTotal(data.total);
      setPage(data.page);
      setLoadingWords(false);
    },
    [jwtValue, perPage, getJWT],
  );

  useEffect(() => {
    getJWT();
    if (wakeUpCalled.current) return;
    wakeUpCalled.current = true;

    fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`)
      .then(() => setWakeUpDone(true))
      .catch(() => alert("Error, game cannot be played."));

    const previousData = localStorage.getItem("game-data");
    const statsRaw = localStorage.getItem("wordle-stats");

    if (previousData && statsRaw) {
      try {
        const stats = JSON.parse(statsRaw);
        const lastPlayed = stats.lastPlayedDate;

        if (isSameUTCDate(lastPlayed)) {
          setPreviousGameExist(true);
        } else {
          localStorage.removeItem("game-data");
          setPreviousGameExist(false);
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to parse stats:", err);
        setPreviousGameExist(false);
      }
    } else {
      setPreviousGameExist(false);
    }
  }, [getJWT]);

  useEffect(() => {
    if (jwtValue) getPastWords(1);
  }, [jwtValue, getPastWords]);

  useMidnightUTCReset();
  const finishedLoading = useCallback(() => {
    setLoadingFinished(true);
  }, [setLoadingFinished]);

  return (
    <BrowserRouter>
      <StatsProvider>
        <SolutionMeaningProvider>
          <Routes>
            <Route
              path="/"
              element={
                loadingFinished && wakeUpDone && jwtValue && pastWords ? (
                  <Onboarding
                    previousGameExist={previousGameExist}
                    latestSolutionNumber={solutionNumber}
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
            <Route
              path="/history"
              element={
                <WordHistory
                  pastWords={pastWords}
                  loadPage={getPastWords}
                  page={page}
                  total={total}
                  loadingWords={loadingWords}
                />
              }
            />
          </Routes>
        </SolutionMeaningProvider>
      </StatsProvider>
    </BrowserRouter>
  );
}

export default App;
