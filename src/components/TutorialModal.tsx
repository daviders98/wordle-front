import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import WordExample from './ExampleWord';

const TutorialModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TutorialModalContent = styled.div`
  background-color: #1a1a1b;
  padding: 24px; 
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #f8f8f8;
`;

const TutorialModalTitle = styled.h2`
  color: #f8f8f8;
  margin-bottom: 10px;
`;

const TutorialModalSubHeading = styled.h3`
  color: #f8f8f8;
  margin-bottom: 10px;
`;

const TutorialModalText = styled.li`
  color: #d7dadc;
  margin-bottom: 10px;
`;

interface TutorialModalProps {
  onClose: () => void;
}

const ExampleSection = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid #f8f8f8;
`;  

const ExampleTitle = styled.h4`
  color: #f8f8f8;
  margin-bottom: 10px;
  font-size: 16px;
`;

const TutorialEndingText = styled.p`
  color: #d7dadc;
  margin-top: 20px;
  font-size: 14px;
`;  

export default function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <TutorialModalContainer onClick={onClose}>
      <TutorialModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon />
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
            <WordExample letterHighlight={'w'} word={'wordy'} type='sucess' explanation='is in the word and in the correct spot.' />
            <WordExample letterHighlight={'i'} word={'light'} type={'present'} explanation='is in the word but in the wrong spot.'/>
            <WordExample letterHighlight={'u'} word={'rogue'} type={'abscent'} explanation='is not in the word in any spot.'/>
        </ExampleSection>
        <TutorialEndingText>A new puzzle is released daily at midnight. UTC+0</TutorialEndingText>
      </TutorialModalContent>
    </TutorialModalContainer>
  );
}
