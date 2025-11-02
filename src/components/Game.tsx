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
  position: relative;
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
  gap: 12px;
`;

const Row = styled.div<{ $shake: boolean }>`
  display: flex;
  gap: 8px;
  justify-content: center;

  ${({ $shake }) =>
    $shake
      ? css`
          animation: ${shakeAnimation} 700ms ease-in-out;
        `
      : ""}
`;


const CellContainer = styled.div<{
  $animate: boolean;
  $flip: boolean;
}>`
  width: 60px;
  height: 60px;
  perspective: 400px;
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${popAnimation} 0.15s ease-in-out;
    `}
`;

const CellInner = styled.div<{
  $flip: boolean;
}>`
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
  font-size: 24px;
  font-weight: bold;
  color: #d7dadc;
  background-color: #121213;
  backface-visibility: hidden;
`;

const CellBack = styled.div<{
  $status?: "absent" | "present" | "correct";
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #565758;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #d7dadc;
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  background-color: ${({ $status }) => {
    if ($status === "correct") return "#538d4e";
    if ($status === "present") return "#b59f3b";
    if ($status === "absent") return "#3a3a3c";
    return "#3a3a3c";
  }};
`;

export default function Game() {
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
const [cellStatuses, setCellStatuses] = useState( Array.from({ length: 6 }, () => Array<"absent" | "present" | "correct" | undefined>(5).fill(undefined)) );
  const [shakingRows, setShakingRows] = useState(Array(6).fill(false));
  const [message, setMessage] = useState("");
  const [jwtValue, setJwtValue] = useState<string | null>(null);
  const messageCooldown = useRef(false);
  const lastMessage = useRef("");
  const shakeCooldown = useRef(Array(6).fill(false));
  const shakingRowsRef = useRef(Array(6).fill(false));

  const testWord = async (word: string)=>{
    const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/validate-word/`,{
        method:'POST',
        body:JSON.stringify({
            word: word
        }),
        headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtValue}`,
        }
    })
    const data = await response.json()
    return data.valid
  }
  const compareWithSolution = async (word: string)=>{ 
    const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/check-guess/`,{ method:'POST', body:JSON.stringify({ guess: word }), 
    headers:{ 'Content-Type': 'application/json', Authorization: `Bearer ${jwtValue}`, } })
     const data = await response.json(); 
     return data.letters } 
     
  const mapResultToStatus = (result: number[]): ("absent" | "present" | "correct")[] => { return result.map((val) => { if (val === 0) return "absent"; if (val === 1) return "present"; if (val === 2) return "correct"; return "absent"; }); };

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
      const resultArray = await compareWithSolution(currentGuess)
      for (let i = 0; i < 5; i++) {
        const status = mapResultToStatus(resultArray)[i];
        setTimeout(() => {
          setCellStatuses((prev) => {
              const copy = prev.map((row) => [...row]);
              copy[currentRowIndex][i] = status;
              return copy;
            });
          setFlippedCells((prev) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][i] = true;
            return copy;
          });
        }, i * 350);
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

  const didFetchJWT = useRef(false);
  useEffect(()=>{
    const getJWT = async function() {
        const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`,{
        method:'POST',
        credentials: "include",
    })
    const jwt = await response.json()
    setJwtValue(jwt.token)
    }
    if(!didFetchJWT.current){
        getJWT()
        didFetchJWT.current = true
    }
  },[])

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
                <CellContainer $animate={animatedCells[row][col]} $flip={flippedCells[row][col]}>
  <CellInner $flip={flippedCells[row][col]}>
    <CellFront>{guesses[row][col]}</CellFront>
    <CellBack $status={cellStatuses[row][col]}>
      {guesses[row][col]}
    </CellBack>
  </CellInner>
</CellContainer>
              ))}
            </Row>
          ))}
        </Board>
      </GameContainer>
    </>
  );
}