import { HelpOutline } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
`;

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  12% { transform: translateX(-8px); }
  24% { transform: translateX(8px); }
  36% { transform: translateX(-6px); }
  48% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  72% { transform: translateX(4px); }
  84% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const Message = styled.div`
  position: absolute;
  top: 100px;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  animation: ${fadeInOut} 2.5s ease-in-out;
  pointer-events: none;
  z-index: 5;
`;

const GameContainer = styled.div`
  position: relative; /* needed for Message absolute positioning */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #121213;
`;

const NavBarContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: #1a1a1b;
  display: flex;
  align-items: center;
  color: #f8f8f8;
  position: fixed;
  top: 0;
`;

const HelpIcon = styled(HelpOutline)`
  color: #f8f8f8;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  height: 100%;
  &:hover {
    color: #d7dadc;
    background-color: #333334;
  }
`;

const IconsContainer = styled.div`
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div<{ $shake: boolean }>`
  display: flex;
  gap: 4px;
  justify-content: center;
  
  ${({ $shake }) =>
    $shake
      ? css`
          animation: ${shakeAnimation} 700ms ease-in-out;
        `
      : ""}
`;

const Cell = styled.div<{ $animate: boolean; $flip: boolean }>`
  width: 60px;
  height: 60px;
  border: 2px solid #565758;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #d7dadc;
  background-color: #121213;
  transform-style: preserve-3d;
  perspective: 400px;

  ${({ $animate }) =>
    $animate
      ? css`
          animation: ${popAnimation} 0.15s ease-in-out;
        `
      : undefined}

  ${({ $flip }) =>
    $flip
      ? css`
          animation: ${flipAnimation} 1s ease-in-out;
        `
      : undefined}
`;

const flipAnimation = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(90deg);
    background-color: #3a3a3c;
  }
  100% {
    transform: rotateX(0deg);
  }
`;

function Game() {
  const initialArray = Array.from({ length: 6 }, () => Array(5).fill(""));
  const [guesses, setGuesses] = useState(initialArray);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [isGuessing, setIsGuessing] = useState(false);
  const [gameStatus, setGameStatus] = useState("in progress");
  const [flippedCells, setFlippedCells] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(false))
  );
  const [animatedCells, setAnimatedCells] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(false))
  );

  const [shakingRows, setShakingRows] = useState(Array(6).fill(false));
  const [message, setMessage] = useState("");
  const messageCooldown = useRef(false);
  const lastMessage = useRef("");
  const shakeCooldown = useRef(Array(6).fill(false));
  const shakingRowsRef = useRef(Array(6).fill(false));

  const testWord = async (word: string)=>{
    const response = await fetch(`${process.env.REACT_APP_DICTIONARY_API_URL}${word}`,{method:'get'})
    return response.status===200
  }

  const showMessage = (text: string) => {
  if (messageCooldown.current && lastMessage.current === text) return;

  setMessage(text);
  lastMessage.current = text;
  messageCooldown.current = true;

  setTimeout(() => {
    setMessage("");
    messageCooldown.current = false;
  }, 2000);
};

  const shakeRow = (rowIndex: number) => {
  if (shakeCooldown.current[rowIndex]) return;

  shakingRowsRef.current[rowIndex] = true;
  shakeCooldown.current[rowIndex] = true;
  setShakingRows([...shakingRowsRef.current]);

  setTimeout(() => {
    shakingRowsRef.current[rowIndex] = false;
    setShakingRows([...shakingRowsRef.current]);
  }, 700);

  setTimeout(() => {
    shakeCooldown.current[rowIndex] = false;
  }, 1000);
};

  useEffect(() => {
    setGuesses((prevGuesses) => {
      const newGuesses = prevGuesses.map((row) => [...row]);
      if (currentGuess.length > 5) return newGuesses;

      for (let i = 0; i < 5; i++) {
        newGuesses[currentRowIndex][i] = currentGuess[i] || "";
      }

      if (currentGuess.length > 0) {
        const index = currentGuess.length - 1;
        if (currentGuess.length > prevGuesses[currentRowIndex].join("").length) {
          setAnimatedCells((prev) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][index] = true;
            return copy;
          });
        }

        setTimeout(() => {
          setAnimatedCells((prev) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][index] = false;
            return copy;
          });
        }, 1500);
      }

      return newGuesses;
    });
  }, [currentGuess, currentRowIndex]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (/^[a-zA-Z]$/.test(key)) {
        if (gameStatus !== "game-over") {
          setCurrentGuess((prev) =>
            prev.length === 5 ? prev : prev + key.toUpperCase()
          );
        }
      } else if (key === "Backspace") {
        if (gameStatus !== "game-over") {
          setCurrentGuess((prev) => prev.slice(0, -1));
        }
      } else if (key === "Enter") {
        setCurrentGuess((prev) => {
          if (prev.length === 5) {
            setIsGuessing(true);
          } else {
            showMessage("Not enough letters.");
            shakeRow(currentRowIndex);
          }
          return prev;
        });
      }
    },
    [gameStatus, currentRowIndex]
  );

  useEffect(()=>{
    if (!isGuessing || !currentGuess) return;
    const guessing = async () => {
        const isValidGuess = await testWord(currentGuess);
    if (isGuessing && isValidGuess && currentGuess) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          setFlippedCells((prev) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][i] = true;
            return copy;
          });

          setTimeout(() => {
            setFlippedCells((prev) => {
              const copy = prev.map((row) => [...row]);
              copy[currentRowIndex][i] = false;
              return copy;
            });
          }, 1000);
        }, i * 400);
      }

      setTimeout(() => {
        setCurrentRowIndex((prevCurrentRowIndex) => {
          if (prevCurrentRowIndex === 5) {
            setGameStatus("game-over");
            return prevCurrentRowIndex;
          } else {
            setCurrentGuess("");
          }
          return prevCurrentRowIndex + 1;
        });
        setIsGuessing(false);
      }, 5 * 300 + 500);
    }else if(!isValidGuess && isGuessing && currentGuess){
        showMessage("Cannot find word in dictionary.");
        shakeRow(currentRowIndex);
        setIsGuessing(false)
    }
}
guessing()
  }
, [isGuessing, currentRowIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <NavBarContainer>
        <IconsContainer>
          <HelpIcon />
        </IconsContainer>
      </NavBarContainer>
      <GameContainer>
        {message && <Message>{message}</Message>}
        <Board>
          {Array.from({ length: 6 }).map((_, row) => (
            <Row key={row} $shake={shakingRows[row]}>
              {Array.from({ length: 5 }).map((_, col) => (
                <Cell
                  key={col}
                  $animate={animatedCells[row][col]}
                  $flip={flippedCells[row][col]}
                >
                  {guesses[row][col]}
                </Cell>
              ))}
            </Row>
          ))}
        </Board>
      </GameContainer>
    </>
  );
}

export default Game;
