import { BarChartOutlined, HelpOutline, Whatshot, AccessTime } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatsModal from './StatsModal';
import TutorialModal from './TutorialModal';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../context/StatsContext';

export default function NavBar() {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const { stats } = useStats();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextWord());

  const toggleStatsModal = () => setShowStatsModal(prev => !prev);
  const toggleTutorialModal = () => setShowTutorialModal(prev => !prev);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextWord());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NavBarContainer>
      {showStatsModal && <StatsModal onClose={toggleStatsModal} />}
      {showTutorialModal && <TutorialModal onClose={toggleTutorialModal} />}

      <NavContent>
        <ImageLogo src="logo.png" alt="logo" onClick={() => navigate('/')} />

        <RightIconsContainer>
          <Tooltip title="Current streak in days" arrow>
            <StreakContainer>
              <FireIcon />
              <StreakNumber>{stats.currentStreak}</StreakNumber>
            </StreakContainer>
          </Tooltip>

          <Tooltip title="Next word coming up in..." arrow>
            <CountdownContainer>
              <ClockIcon />
              <CountdownText>{timeLeft}</CountdownText>
            </CountdownContainer>
          </Tooltip>

          <StatsIcon onClick={toggleStatsModal} />
          <HelpIcon fontSize="medium" onClick={toggleTutorialModal} />
        </RightIconsContainer>
      </NavContent>
    </NavBarContainer>
  );
}

function getTimeUntilNextWord() {
  const now = new Date();
  const nextUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ));

  const diff = nextUTC.getTime() - now.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

const NavBarContainer = styled.div`
  width: 100vw;
  height: 60px;
  background-color: #1a1a1b;
  display: flex;
  align-items: center;
  color: #f8f8f8;
  z-index: 10;

  @media (max-width: 600px) {
    height: 50px;
  }
`;

const NavContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;

  @media (max-width: 600px) {
    padding: 0 4px;
  }
`;

const ImageLogo = styled.img`
  cursor: pointer;
  height: 40px;
  border-radius: 4px;

  &:hover {
    background-color: #333334;
  }
`;

const RightIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HelpIcon = styled(HelpOutline)`
  color: #f8f8f8;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  font-size: 28px;
  &:hover {
    color: #d7dadc;
    background-color: #333334;
  }
`;

const StatsIcon = styled(BarChartOutlined)`
  color: #f8f8f8;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  font-size: 28px;
  &:hover {
    color: #d7dadc;
    background-color: #333334;
  }
`;

const StreakContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;

  &:hover {
    background-color: #333334;
    cursor: default;
  }
`;

const FireIcon = styled(Whatshot)`
  color: #ff6b35;
  font-size: 28px;
`;

const StreakNumber = styled.span`
  color: #f8f8f8;
  font-weight: 600;
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  &:hover {
    background-color: #333334;
    cursor: default;
  }
`;

const ClockIcon = styled(AccessTime)`
  color: #f8f8f8;
  font-size: 24px;
`;

const CountdownText = styled.span`
  color: #f8f8f8;
  font-weight: 600;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size:12px;
  }
`;
