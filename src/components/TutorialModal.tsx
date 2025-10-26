import React from 'react'
import styled from 'styled-components'

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
`

const TutorialModalContent = styled.div`
  background-color: #1a1a1b;
    padding: 20px; 
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
`
const TutorialModalTitle = styled.h2`
    color: #ffffff;
    margin-bottom: 10px;
`

const TutorialModalSubHeading = styled.h3`
    color: #ffffff;
    margin-bottom: 10px;
`

const TutorialModalText = styled.li`
    color: #d7dadc;
    margin-bottom: 10px;
`
export default function TutorialModal() {
  return (
    <TutorialModalContainer>
        <TutorialModalContent>
            <TutorialModalTitle>How to play</TutorialModalTitle>
            <TutorialModalSubHeading>Guess the WORDLE in 6 tries.</TutorialModalSubHeading>
            <TutorialModalText>Each guess must be a valid 5-letter word. Hit the enter button to submit.</TutorialModalText>
            <TutorialModalText>After each guess, the color of the tiles will change to show how close your guess was to the word.</TutorialModalText>
        </TutorialModalContent>
    </TutorialModalContainer>
  )
}