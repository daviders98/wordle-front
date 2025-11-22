import { useEffect, useState } from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121213;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const CellContainer = styled.div<{ $flip?: boolean }>`
  width: clamp(40px, 12vw, 60px);
  height: clamp(40px, 12vw, 60px);
  perspective: 400px;
`;

const CellInner = styled.div<{ $flip?: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: rotateX(${({ $flip }) => ($flip ? -180 : 0)}deg);
`;

const CellFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #565758;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: clamp(22px, 5vw, 24px);
  color: #d7dadc;
  background-color: #3a3a3c;
  backface-visibility: hidden;
  border-radius: 4px;
`;

const CellBack = styled(CellFront)<{ $status?: "present" | "correct" }>`
  transform: rotateX(-180deg);
  background-color: ${({ $status }) =>
    $status === "correct"
      ? "#538d4e"
      : $status === "present"
        ? "#b59f3b"
        : "#3a3a3c"};
  color: #fff;
`;

const words = ["BETTER", "WORDLE"];
const rows = words.length;
const cols = Math.max(...words.map((w) => w.length));

const Loading = ({ animationEnded }: { animationEnded: () => void }) => {
  const [flippedCells, setFlippedCells] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(false)),
  );
  const [cellStatuses, setCellStatuses] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(undefined)),
  );

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    let mounted = true;
    const phaseRef = { current: "yellow" as "yellow" | "green" };

    const animateCell = (
      rowIdx: number,
      colIdx: number,
      status: "present" | "correct",
    ) => {
      setFlippedCells((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[rowIdx][colIdx] = true;
        return copy;
      });
      setCellStatuses((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[rowIdx][colIdx] = status;
        return copy;
      });
    };

    const run = async (startDelay = 0) => {
      if (startDelay) await sleep(startDelay);

      for (let rowIdx = 0; rowIdx < rows && mounted; rowIdx++) {
        const word = words[rowIdx];
        for (let colIdx = 0; colIdx < word.length && mounted; colIdx++) {
          const status = phaseRef.current === "yellow" ? "present" : "correct";
          animateCell(rowIdx, colIdx, status);
          await sleep(200);
        }
      }
    };

    (async () => {
      await run(0);

      await sleep(600 + 50);

      if (!mounted) return;

      if (phaseRef.current === "yellow") {
        phaseRef.current = "green";
        setFlippedCells(
          Array.from({ length: rows }, () => Array(cols).fill(false)),
        );
        setCellStatuses(
          Array.from({ length: rows }, () => Array(cols).fill(undefined)),
        );

        await run(0);
        await sleep(600 + 100);
        if (mounted) animationEnded();
      } else {
        animationEnded();
      }
    })();
    return () => {
      mounted = false;
    };
  }, [animationEnded]);

  return (
    <LoadingContainer>
      {words.map((word, rowIdx) => (
        <Row key={rowIdx}>
          {word.split("").map((letter, colIdx) => (
            <CellContainer key={colIdx}>
              <CellInner $flip={flippedCells[rowIdx][colIdx]}>
                <CellFront>{letter}</CellFront>
                <CellBack $status={cellStatuses[rowIdx][colIdx]}>
                  {letter}
                </CellBack>
              </CellInner>
            </CellContainer>
          ))}
        </Row>
      ))}
    </LoadingContainer>
  );
};

export default Loading;
