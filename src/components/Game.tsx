import { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import Keyboard from "./Keyboard";
import { useStats } from "../context/StatsContext";
import StatsModal from "./StatsModal";
import NavBar from "./NavBar";
import FireParticles from "./FireParticles";

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
  top: 80px;
  background-color: white;
  color: #333;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: clamp(12px, 3.5vw, 16px);
  animation: ${fadeInOut} 2.5s ease-in-out;
  pointer-events: none;
  z-index: 5;
`;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121213;
`;

const GameContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  background-color: #121213;
  padding: 12px 0;
`;


const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;

  @media (max-width: 600px) {
    gap: 1.5vh;
  }
`;

const Row = styled.div<{ $shake: boolean }>`
  display: flex;
  gap: .5vw;
  justify-content: center;

  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shakeAnimation} 700ms ease-in-out;
    `}

  @media (max-width: 600px) {
    gap: 1vw;
  }
`;

const CellContainer = styled.div<{
  $animate: boolean;
  $flip: boolean;
  $win?: boolean;
  $winDelay?: number;
}>`
  width: 12vw;
  height: 12vw;
  max-width: 60px;
  max-height: 60px;
  perspective: 400px;

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${popAnimation} 0.15s ease-in-out;
    `}

  ${({ $win, $winDelay }) =>
    $win &&
    css`
      animation: ${jumpAnimation} 0.8s ease-in-out ${$winDelay}s 1 forwards;
    `}

  @media (max-width: 600px) {
    width: 14vw;
    height: 14vw;
  }
`;

const jumpAnimation = keyframes`
  0% { transform: translateY(0) scale(1); }
  25% { transform: translateY(-25px) scale(1.1); }
  50% { transform: translateY(-30px) scale(1.1); }
  75% { transform: translateY(-25px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
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
  font-size: clamp(16px, 4vw, 24px);
  font-weight: bold;
  color: #d7dadc;
  background-color: #121213;
  backface-visibility: hidden;
`;

const CellBack = styled(CellFront)<{ $status?: "absent" | "present" | "correct" }>`
  transform: rotateX(-180deg);
  background-color: ${({ $status }) => {
    if ($status === "correct") return "#538d4e";
    if ($status === "present") return "#b59f3b";
    if ($status === "absent") return "#3a3a3c";
    return "#3a3a3c";
  }};
`;

export default function Game({togglePreviousGameExist}:{togglePreviousGameExist:()=>void}) {
  const previousData = localStorage.getItem('game-data')
  const parsedPreviousData = previousData ? JSON.parse(previousData) : null;
  const previousRowIndex = parsedPreviousData ? parsedPreviousData?.guesses.findIndex(
  (row:string[]) => row.every(cell => cell === "")
): 0;
  const initialArray = Array.from({ length: 6 }, () => Array(5).fill(""));
  const initialCellStatuses = Array.from({ length: 6 }, () => Array<"absent" | "present" | "correct" | undefined>(5).fill(undefined))
  const hasCorrectRow = parsedPreviousData?.cellStatuses?.some(
  (row: string[]) => row.every(cell => cell === "correct")
);
const allRowsFilled = parsedPreviousData?.guesses?.every(
  (row: string[]) => row.every(cell => cell !== "")
);
  const initialGameStatus = hasCorrectRow || allRowsFilled ? "game-over" : "start";
  const [hasPreviousData,setHasPreviousData] = useState(previousData)
  const [guesses, setGuesses] = useState(parsedPreviousData?.guesses || initialArray);
  const [showStatsModal,setShowStatsModal] = useState(false)
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRowIndex, setCurrentRowIndex] = useState(previousRowIndex);
  const [isGuessing, setIsGuessing] = useState(false);
  const [gameStatus, setGameStatus] = useState(initialGameStatus);
  const [flippedCells, setFlippedCells] = useState(
    parsedPreviousData?.guesses || initialArray
  );
  const [animatedCells, setAnimatedCells] = useState(
    parsedPreviousData?.guesses || initialArray
  );
const [cellStatuses, setCellStatuses] = useState(parsedPreviousData?.cellStatuses || initialCellStatuses);
  const [shakingRows, setShakingRows] = useState(Array(6).fill(false));
  const [message, setMessage] = useState("");
  const [jwtValue, setJwtValue] = useState<string | null>(null);
  const [didWin,setDidWin] = useState(hasCorrectRow|| false);
  const messageCooldown = useRef(false);
  const lastMessage = useRef("");
  const shakeCooldown = useRef(Array(6).fill(false));
  const shakingRowsRef = useRef(Array(6).fill(false));
  const { updateStats } = useStats();
  const toggleStatsModal = ()=>setShowStatsModal(prev=>!prev)
  const isWinningRow = (rowIndex: number) => {
  return (
    rowIndex === currentRowIndex &&
    cellStatuses[rowIndex].every((status:string) => status === "correct")
  );
};
  const testWord = async (word: string,retry=true):Promise<boolean>=>{
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
    if(response.status === 401 && retry){
      await getJWT()
      return await testWord(word,false)
    }
    const data = await response.json()
    return data.valid
  }
  const compareWithSolution = async (word: string,retry=true):Promise<Array<number>>=>{ 
    const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/check-guess/`,{ method:'POST', body:JSON.stringify({ guess: word }), 
    headers:{ 'Content-Type': 'application/json', Authorization: `Bearer ${jwtValue}`, } })
    if(response.status === 401){
      await getJWT()
      return await compareWithSolution(word,false)
    }
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
  if (gameStatus === "game-over") {
    showMessage(didWin?"Splendid! 🎉":"Better luck next time 🥲")
    setTimeout(()=>{
      if(!hasPreviousData){
        updateStats(didWin)
      }
      setShowStatsModal(true);
    },900)
  }
}, [gameStatus, didWin]);


  useEffect(() => {
      setGuesses((prevGuesses: any[]) => {
      const newGuesses = prevGuesses.map((row) => [...row]);
      if (currentGuess.length > 5) return newGuesses;

      for (let i = 0; i < 5; i++) {
        newGuesses[currentRowIndex][i] = currentGuess[i] || "";
      }

      if (currentGuess.length > 0) {
        const index = currentGuess.length - 1;
        if (currentGuess.length > prevGuesses[currentRowIndex].join("").length) {
          setAnimatedCells((prev:any[][]) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][index] = true;
            return copy;
          });
        }

        setTimeout(() => {
          setAnimatedCells((prev:any[][]) => {
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
    if(isGuessing){
      localStorage.setItem('game-data',JSON.stringify({guesses,cellStatuses}))
      togglePreviousGameExist()
    }
  },[cellStatuses])

  useEffect(()=>{
    if (!isGuessing || !currentGuess) return;
    const guessing = async () => {
        const isValidGuess = await testWord(currentGuess);
    if (isGuessing && isValidGuess && currentGuess) {
      const resultArray = await compareWithSolution(currentGuess)
      for (let i = 0; i < 5; i++) {
        const status = mapResultToStatus(resultArray)[i];
        setTimeout(() => {
          setCellStatuses((prev:any) => {
              const copy = prev.map((row:any) => [...row]);
              copy[currentRowIndex][i] = status;
              return copy;
            });
          setFlippedCells((prev: any[][]) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRowIndex][i] = true;
            return copy;
          });
        }, i * 350);
      }
      setTimeout(() => {
        setCurrentRowIndex((prevCurrentRowIndex:number) => {
          if(resultArray.every((val:number)=>{
            return val === 2
          })){
            setGameStatus("game-over")
            setDidWin(true)
            return prevCurrentRowIndex;
          }else if (prevCurrentRowIndex === 5) {
            setGameStatus("game-over");
            return prevCurrentRowIndex;
          }
          setCurrentGuess("");
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

  const getJWT = async function() {
        const response = await fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`,{
        method:'POST',
        credentials: "include",
    })
    const jwt = await response.json()
    setJwtValue(jwt.token)
    }
  useEffect(()=>{
    getJWT()
  },[])
  const computeKeyStatuses = (
  cellStatuses: ("absent" | "present" | "correct" | undefined)[][],
  guesses: string[][]
) => {
  const map: Record<string, "absent" | "present" | "correct"> = {};
  guesses.forEach((row, rIndex) => {
    row.forEach((letter, cIndex) => {
      const status = cellStatuses?.[rIndex]?.[cIndex];
      if (!letter || !status) return;
      map[letter] = status;
    });
  });
  return map;
};

const keyStatuses = computeKeyStatuses(cellStatuses, guesses);

  return (
    <PageContainer>
      {showStatsModal && <StatsModal onClose={toggleStatsModal}/>}
      <NavBar/>
      <FireParticles active={didWin} />
      <GameContainer>
        {message && <Message>{message}</Message>}
        <Board>
          {Array.from({ length: 6 }).map((_, row) => (
            <Row key={row} $shake={shakingRows[row]}>
              {Array.from({ length: 5 }).map((_, col) => (
                <CellContainer
                    key={col}
                    $animate={animatedCells[row][col]}
                    $flip={flippedCells[row][col]}
                    $win={gameStatus === "game-over" &&
                      cellStatuses[row].every((status:string) => status === "correct")}
                      $winDelay={isWinningRow(row) ? col * 0.1 : 0}
                  >
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
        <Keyboard
  onKeyPress={(key) => {
    if (gameStatus === "game-over") return;
    
    if (key === "ENTER") {
      setIsGuessing(true);
    } else if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) =>
        prev.length < 5 ? prev + key : prev
      );
    }
  }}
  keyStatuses={keyStatuses}
/>
      </GameContainer>
    </PageContainer>
  );
}