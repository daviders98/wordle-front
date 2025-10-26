import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import WordExample from './ExampleWord';

interface TutorialModalProps {
  onClose: () => void;
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <TutorialModalContainer onClick={onClose}>
      <TutorialModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon sx={{ fontSize: 26 }} />
        </CloseButton>

        <TutorialModalTitle>How to play</TutorialModalTitle>
        <TutorialModalSubHeading>Guess the WORDLE in 6 tries.</TutorialModalSubHeading>
        
        <TutorialModalText>
          Each guess must be a valid 5-letter word. Hit the enter button to submit.
        </TutorialModalText>
        <TutorialModalText>
          After each guess, the color of the tiles will change to show how close your guess was to the word.
        </TutorialModalText>

        <ExampleSection>
          <ExampleTitle>Examples</ExampleTitle>
          <WordExample letterHighlight={'w'} word={'wordy'} type={'success'} explanation='is in the word and in the correct spot.' />
          <WordExample letterHighlight={'i'} word={'light'} type={'present'} explanation='is in the word but in the wrong spot.'/>
          <WordExample letterHighlight={'u'} word={'rogue'} type={'absent'} explanation='is not in the word in any spot.'/>
        </ExampleSection>

        <TutorialEndingText>
          A new puzzle is released daily at midnight (UTC+0).
        </TutorialEndingText>
      </TutorialModalContent>
    </TutorialModalContainer>
  );
}

const TutorialModalContainer = styled.div`
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
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const TutorialModalContent = styled.div`
  position: relative;
  background-color: #1a1a1b;
  padding: 22px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 360px) {
    padding: 14px;
    width: 95%;
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
    background-color: rgba(255,255,255,0.1);
  }

  @media (max-width: 480px) {
    padding: 4px;
  }
`;

const TutorialModalTitle = styled.h2`
  color: #f8f8f8;
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 1.4rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const TutorialModalSubHeading = styled.h3`
  color: #f8f8f8;
  margin-bottom: 10px;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TutorialModalText = styled.li`
  color: #d7dadc;
  margin-bottom: 8px;
  font-size: 0.9rem;
  line-height: 1.45;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ExampleSection = styled.div`
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #333;
`;

const ExampleTitle = styled.h4`
  color: #f8f8f8;
  margin-bottom: 8px;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TutorialEndingText = styled.p`
  color: #d7dadc;
  margin-top: 16px;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.35;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;
