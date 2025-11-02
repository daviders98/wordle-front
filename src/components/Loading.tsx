import CircularProgress from '@mui/material/CircularProgress';
import styled, { keyframes } from 'styled-components';
import TutorialModal from './TutorialModal';
import { useState } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1b;
  gap: 16px;
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin: 8px 0;
  animation: ${fadeIn} 1.2s ease-in-out forwards;
  text-align: center;
  letter-spacing: 0.3px;
  padding: 0 14px 0 ;

  &:last-of-type {
    color: #bdbdbd;
    font-size: 0.95rem;
    opacity: 0.85;
  }
`;

const StyledSpinner = styled(CircularProgress)`
  color: white !important;
  animation: ${spin} 2s linear infinite !important;
  margin-top: 16px !important;
`;

function Loading() {
    const [tutorialModalOpened, setTutorialModalOpened] = useState(true);
      const toggleTutorialModal = () => setTutorialModalOpened(prev => !prev);
  return (
    <LoadingContainer>
        {tutorialModalOpened && <TutorialModal onClose={toggleTutorialModal} />}
      <LoadingText>Server is waking up now, please wait a little bit.</LoadingText>
      <LoadingText>Perfection takes time {'[:'}</LoadingText>
      <StyledSpinner size={60} thickness={4} />
    </LoadingContainer>
  );
}

export default Loading;
