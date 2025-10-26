import moment from 'moment'
import React from 'react'
import TutorialModal from './TutorialModal';
import styled from 'styled-components'

export default function Onboarding() {
    const [tutorialModalOpened, setTutorialModalOpened] = React.useState(false);
    const openTutorialModal = () => {
        setTutorialModalOpened(true);
    }

  return (
    <Container>
        {tutorialModalOpened && <TutorialModal/>}
        <OnboardingContainer>
            <h2>Welcome!</h2>
        <img width={64} height={64} src={'/logo.png'} alt='wordle logo'/>
        <h1>Wordle</h1>
        <p>Get 6 chances to guess a 5-letter word.</p>
        <ButtonsContainer>
            <MainButton>Play</MainButton>
            <SecondaryButton onClick={openTutorialModal}>How to Play</SecondaryButton>
            <HistoryButton>View word History</HistoryButton>
        </ButtonsContainer>
        <DateText>{moment().format('MMMM DD YYYY')}</DateText>
        <WordCountText>Word #1</WordCountText>
        <EditedByText>Edited by David Garcia</EditedByText>
        <img width={36} height={32} src={'/logo-devgarcia.png'} alt='devgarcia logo'/>
        </OnboardingContainer>

    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e3e2e0;
`

const OnboardingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    `   
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
`

const MainButton = styled.button`
    background-color: #0C100F; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 99px;
    min-width: 80%;
`

const SecondaryButton = styled.button`
    background-color: transparent; 
    border: 2px solid #0C100F;
    color: #0C100F;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 99px;
    min-width: 80%;
`
const HistoryButton = styled.button`
    background-color: transparent;
    border: none;
    color: #0C100F;
    padding: 10px;
    text-align: center;
    text-decoration: underline;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
`
const DateText = styled.p`
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #0C100F;
`
const WordCountText = styled.p`
    font-size: 14px;
    color: #0C100F;
`
const EditedByText = styled.p`
    font-size: 12px;
    color: #0C100F;
    margin-top: 40px;
`