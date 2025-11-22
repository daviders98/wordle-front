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

  useEffect(() => {
    let phase: "yellow" | "green" = "yellow";

    const animateRow = (rowIdx: number, colIdx: number) => {
      setFlippedCells((prev) => {
        const newArr = prev.map((r) => [...r]);
        newArr[rowIdx][colIdx] = true;
        return newArr;
      });

      setCellStatuses((prev) => {
        const newArr = prev.map((r) => [...r]);
        newArr[rowIdx][colIdx] = phase === "yellow" ? "present" : "correct";
        return newArr;
      });
    };

    const runAnimation = (delayMs = 0) => {
      let delay = delayMs;
      for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        const word = words[rowIdx];
        for (let col = 0; col < word.length; col++) {
          setTimeout(() => animateRow(rowIdx, col), delay);
          delay += 200;
        }
      }
      setTimeout(() => {
        if (phase === "yellow") {
          phase = "green";
          setFlippedCells(
            Array.from({ length: rows }, () => Array(cols).fill(false)),
          );
          runAnimation(400);
        } else {
          animationEnded();
        }
      }, delay + 400);
    };

    runAnimation();
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
