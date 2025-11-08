import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
}

interface StatsContextType {
  stats: GameStats;
  updateStats: (win: boolean) => void;
  resetStats: () => void;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
};

const StatsContext = createContext<StatsContextType>({
  stats: defaultStats,
  updateStats: () => {},
  resetStats: () => {},
});

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const stored = localStorage.getItem("wordle-stats");
    if (stored) {
      const parsed: GameStats = JSON.parse(stored);

      const nowUTC = new Date();
      const todayUTC = new Date(
        Date.UTC(
          nowUTC.getUTCFullYear(),
          nowUTC.getUTCMonth(),
          nowUTC.getUTCDate(),
        ),
      );
      const yesterdayUTC = new Date(todayUTC);
      yesterdayUTC.setUTCDate(todayUTC.getUTCDate() - 1);
      if (parsed.lastPlayedDate) {
        const lastPlayed = new Date(parsed.lastPlayedDate + "T00:00:00Z");
        const diffDays = Math.floor(
          (todayUTC.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) {
          localStorage.removeItem("game-data");
        }
        if (diffDays > 1) {
          parsed.currentStreak = 0;
          localStorage.removeItem("game-data");
        }
      }

      setStats(parsed);
      localStorage.setItem("wordle-stats", JSON.stringify(parsed));
    }
  }, []);

  const updateStats = useCallback((win: boolean) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStats((prev) => {
      const updated = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: win ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: win ? prev.currentStreak + 1 : 0,
        maxStreak: win
          ? Math.max(prev.maxStreak, prev.currentStreak + 1)
          : prev.maxStreak,
        lastPlayedDate: todayStr,
      };
      localStorage.setItem("wordle-stats", JSON.stringify(updated));
      return updated;
    });
  }, []);
  const resetStats = () => {
    localStorage.removeItem("wordle-stats");
    setStats(defaultStats);
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
