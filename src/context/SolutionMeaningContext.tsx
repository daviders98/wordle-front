import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

const SolutionMeaningContext = createContext<{
  solution: string | null;
  meaning: string | null;
  setSolution: Dispatch<SetStateAction<string | null>>;
  setMeaning: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export const SolutionMeaningProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [solution, setSolution] = useState<string | null>(null);
  const [meaning, setMeaning] = useState<string | null>(null);
  return (
    <SolutionMeaningContext.Provider
      value={{
        solution,
        meaning,
        setSolution,
        setMeaning,
      }}
    >
      {children}
    </SolutionMeaningContext.Provider>
  );
};
export const useSolutionMeaning = () => {
  const ctx = useContext(SolutionMeaningContext);
  if (!ctx) {
    throw new Error("useSolutionMeaning must be used inside Provider");
  }
  return ctx;
};
