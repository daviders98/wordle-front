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
  padding: 0 20px;
`;
function Game() {
  return (
    <>
    <NavBarContainer></NavBarContainer>
    <GameContainer></GameContainer>
    </>
  )
}

export default Game