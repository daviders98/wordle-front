import { HelpOutline } from '@mui/icons-material';
import React from 'react'
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #121213;
`;
const NavBarContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: #1a1a1b;
  display: flex;
  align-items: center;
  text-color: #f8f8f8;
  fixed: top;
`;
const HelpIcon = styled(HelpOutline)`
  color: #f8f8f8;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  height:100%;
  &:hover {
    color: #d7dadc;
    background-color: #333334;
}
`
const IconsContainer = styled.div`
    cursor: pointer;
    height:100%;
    display:flex;
    align-items:center;
`;
function Game() {
  return (
    <>
    <NavBarContainer><IconsContainer><HelpIcon /></IconsContainer></NavBarContainer>
    <GameContainer>
    </GameContainer>
    </>
  )
}

export default Game