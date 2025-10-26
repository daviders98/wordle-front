import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import SucessWordExample from './SucessWordExample';

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
  padding: 20px; 
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
`;  

const ExampleTitle = styled.h4`
  color: #f8f8f8;
  margin-bottom: 10px;
  font-size: 16px;
`;

export default function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <TutorialModalContainer>
      <TutorialModalContent>
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
            <SucessWordExample word={'wordy'} />
            {/* <PresentWordExample word={'light'}/>
            <AbsentWordExample word={'rogue'}/> */}
        </ExampleSection>
      </TutorialModalContent>
    </TutorialModalContainer>
  );
}
