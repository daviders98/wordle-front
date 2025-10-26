import { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(360deg); }
  100% { transform: rotateX(720deg); }
`;

const CorrectLetter = styled.span<{ animate: boolean }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 2px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  background-color: #6aaa64; 
  color: white;
  border-radius: 4px;
  border: 2px solid #565758;

  ${({ animate }) =>
    animate &&
    css`
      animation: ${spin} 2s ease-in-out;
    `}
`;

const WordContainer = styled.div`
  margin-top: 10px;
`;

const RestLetters = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 2px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  color: white;
  border-radius: 4px;
  border: 2px solid #565758;
`;

const SuccessWordExampleContainer = styled.div`
  margin-top: 10px;
`;

const SuccessWordExplanation = styled.p`
  margin-top: 10px;
  color: #d7dadc;
`;
function SuccessWordExample({ word }: { word: string }) {
  const letters = word.toUpperCase().split('');
  const correctLetter = letters[0];
  const restLetters = letters.slice(1);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <SuccessWordExampleContainer>
    <WordContainer>
      <CorrectLetter animate={animate}>{correctLetter}</CorrectLetter>
      {restLetters.map((letter, index) => (
        <RestLetters key={index}>{letter}</RestLetters>
      ))}
    </WordContainer>
    <SuccessWordExplanation><b>{correctLetter}</b> is in the word and in the correct spot.</SuccessWordExplanation>
    </SuccessWordExampleContainer>
  );
}

export default SuccessWordExample;
