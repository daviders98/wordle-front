import { useEffect } from "react";

export default function useMidnightUTCReset() {
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
        const statsData = localStorage.getItem("wordle-stats");
        if (statsData) {
          const parsed = JSON.parse(statsData);
          parsed.currentStreak = 0;
          localStorage.setItem("wordle-stats", JSON.stringify(parsed));
        }
        localStorage.removeItem("game-data");
        console.log("🌙 Midnight UTC reached → resetting game data");
        window.location.reload();
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
