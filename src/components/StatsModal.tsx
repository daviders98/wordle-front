import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useStats } from "../context/StatsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface StatsModalProps {
  onClose: () => void;
}

export default function StatsModal({ onClose }: StatsModalProps) {
  const { stats } = useStats();

  const successRate = stats.gamesPlayed
    ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
    : "0";

  const handleResetStats = () => {
    localStorage.removeItem("wordle-stats");
    localStorage.removeItem("game-data");
    window.location.reload();
  };
  return (
    <StatsModalContainer onClick={onClose}>
      <StatsModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon sx={{ fontSize: 26 }} />
        </CloseButton>

        <StatsModalTitle>📊 Your Stats</StatsModalTitle>
        <StatsModalSubHeading>
          Keep your streak alive and improve your Wordle mastery.
        </StatsModalSubHeading>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#1e1e1f",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <Table size="small" aria-label="stats table">
            <TableHead>
              <TableRow>
                <StyledTableHeader>Metric</StyledTableHeader>
                <StyledTableHeader align="right">Value</StyledTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledRow>
                <StyledCell>Current Streak</StyledCell>
                <StyledCell align="right">
                  {stats.currentStreak || 0}
                </StyledCell>
              </StyledRow>
              <StyledRow>
                <StyledCell>Max Streak</StyledCell>
                <StyledCell align="right">{stats.maxStreak || 0}</StyledCell>
              </StyledRow>
              <StyledRow>
                <StyledCell>Games Played</StyledCell>
                <StyledCell align="right">{stats.gamesPlayed || 0}</StyledCell>
              </StyledRow>
              <StyledRow>
                <StyledCell>Games Won</StyledCell>
                <StyledCell align="right">{stats.gamesWon || 0}</StyledCell>
              </StyledRow>
              <StyledRow>
                <StyledCell>Success Rate</StyledCell>
                <StyledCell align="right">{successRate || 0}%</StyledCell>
              </StyledRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ResetButton onClick={handleResetStats}>Reset All Data</ResetButton>

        <TutorialEndingText>
          🕛 A new puzzle unlocks daily at midnight (UTC+0).
        </TutorialEndingText>
      </StatsModalContent>
    </StatsModalContainer>
  );
}

const ResetButton = styled.button`
  margin-top: 18px;
  width: 30%;
  padding: 12px;
  background-color: #b91c1c; /* red-700 */
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  justify-self: center;
  justify-content: center;

  &:hover {
    background-color: #dc2626;
  }

  &:active {
    background-color: #991b1b;
  }
`;

const StatsModalContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.25s ease;
  padding: 12px;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StatsModalContent = styled.div`
  position: relative;
  background-color: #1a1a1b;
  padding: 24px;
  border-radius: 14px;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 10px;
  }
`;

const CloseButton = styled.button`
  position: sticky;
  top: 0;
  right: 0;
  float: right;
  background: #1a1a1b;
  border: none;
  cursor: pointer;
  color: #f8f8f8;
  padding: 6px;
  border-radius: 50%;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatsModalTitle = styled.h2`
  color: #f8f8f8;
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 2rem;
  text-align: center;
`;

const StatsModalSubHeading = styled.h3`
  color: #b0b3b8;
  margin-bottom: 16px;
  font-size: 1rem;
  text-align: center;
`;

const TutorialEndingText = styled.p`
  color: #d7dadc;
  margin-top: 20px;
  font-size: 1rem;
  text-align: center;
`;

const StyledTableHeader = styled(TableCell)`
  && {
    color: #f8f8f8;
    font-weight: bold;
    border-bottom: 1px solid #333;
  }
`;

const StyledCell = styled(TableCell)`
  && {
    color: #d7dadc;
    border-bottom: 1px solid #2c2c2c;
  }
`;

const StyledRow = styled(TableRow)`
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
