import { useEffect } from "react";

export default function useMidnightUTCReset() {
  useEffect(() => {
    const now = new Date();
    const nextUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));

    const delay = nextUTC.getTime() - now.getTime();

    const timer = setTimeout(() => {
      localStorage.removeItem("game-data");
      window.location.reload();
    }, delay);

    console.log("⏰ Will reset at next UTC midnight in", Math.round(delay / 1000 / 60), "minutes");

    return () => clearTimeout(timer);
  }, []);
}
