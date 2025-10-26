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

const PresentLetter = styled.span<{ animate: boolean }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 2px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  background-color: #b59f3b; 
  color: white;
  border-radius: 4px;
  border: 2px solid #565758;

  ${({ animate }) =>
    animate &&
    css`
      animation: ${spin} 2s ease-in-out;
    `}
`;

const AbscentLetter = styled.span<{ animate: boolean }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 2px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  background-color: #787c7e;
  color: white;
  border-radius: 4px;
  border: 2px solid #565758;
  
  ${({ animate }) =>
    animate &&
    css`
      animation: ${spin} 2s ease-in-out;
    `}
`;


function WordExample({ word, letterHighlight,type, explanation}: { letterHighlight:string, word: string, type: string, explanation: string }) {
  const letterHighlightUppercase = letterHighlight.toUpperCase();
  const letters = word.toUpperCase().split('');
  const correctLetter = letters.find(letter => letter.toUpperCase() === letterHighlight.toUpperCase()) || '';

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <SuccessWordExampleContainer>
    <WordContainer>
      {letters.map((letter, index) => {
        return letterHighlightUppercase === letter ? 
          type ==='sucess' ?
        <CorrectLetter animate={animate}>{correctLetter}</CorrectLetter>
        : type ==='present' ?
        <PresentLetter animate={animate}>{correctLetter}</PresentLetter>
        : <AbscentLetter animate={animate}>{correctLetter}</AbscentLetter>:
        <RestLetters key={index}>{letter}</RestLetters>;
      })}
    </WordContainer>
    <SuccessWordExplanation><b>{letterHighlightUppercase}</b> {explanation}</SuccessWordExplanation>
    </SuccessWordExampleContainer>
  );
}

export default WordExample
