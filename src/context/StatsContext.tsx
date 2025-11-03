import React, { createContext, useContext, useEffect, useState } from "react";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
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
};

const StatsContext = createContext<StatsContextType>({
  stats: defaultStats,
  updateStats: () => {},
  resetStats: () => {},
});

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const stored = localStorage.getItem("wordle-stats");
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  const updateStats = (win: boolean) => {
    setStats(prev => {
      const updated = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: win ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: win ? prev.currentStreak + 1 : 0,
        maxStreak: win
          ? Math.max(prev.maxStreak, prev.currentStreak + 1)
          : prev.maxStreak,
      };
      localStorage.setItem("wordle-stats", JSON.stringify(updated));
      return updated;
    });
  };

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
