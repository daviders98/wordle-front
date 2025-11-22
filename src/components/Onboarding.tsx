import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import TutorialModal from "./TutorialModal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Onboarding({
  previousGameExist,
  jwtValue,
  getJWT
}: {
  previousGameExist: boolean;
  jwtValue: string | null;
  getJWT: ()=>Promise<string | null>
}) {
  const navigate = useNavigate();
  const [tutorialModalOpened, setTutorialModalOpened] = useState(false);
  const toggleTutorialModal = () => setTutorialModalOpened((prev) => !prev);

  const [nextWordDiff, setNextWordDiff] = useState(
    moment.duration(
      moment().utc().add(1, "days").startOf("day").diff(moment().utc()),
    ),
  );
  const [pastWords, setPastWords] = useState(null);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  
  const getPastWords = useCallback(
    async ({retry = true,token=null}:{retry:boolean; token: string | null;}): Promise<any> => {
      const response = await fetch(
        `${process.env.REACT_APP_RENDER_BASE_URL}/api/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401 && retry) {
        const token = await getJWT()
        return await getPastWords({retry:false,token:token});
      }
      const data = await response.json();

      setPastWords(data);
      return data;
    },
    [getJWT],
  );
  useEffect(() => {
    getPastWords({retry:false,token:jwtValue || null});
    const interval = setInterval(() => {
      const diff = moment.duration(
        moment().utc().add(1, "days").startOf("day").diff(moment().utc()),
      );
      setNextWordDiff(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [jwtValue,getPastWords]);

  return (
    <FadeInContainer mounted={mounted}>
      <Container>
      {tutorialModalOpened && <TutorialModal onClose={toggleTutorialModal} />}
        <OnboardingContainer>
          <NextWordText>
            Next word coming in: {nextWordDiff.hours()}h{" "}
            {nextWordDiff.minutes()}m {nextWordDiff.seconds()}s
          </NextWordText>

          <Title>Welcome {previousGameExist && "back"}!</Title>
          <Logo src={"/logo.png"} alt="wordle logo" />
          <MainHeading>Better Wordle</MainHeading>
          <Description>Get 6 chances to guess a 5-letter word.</Description>

          <ButtonsContainer>
            <MainButton onClick={() => navigate("/play")}>
              {previousGameExist ? "Continue" : "Play"}
            </MainButton>
            <SecondaryButton onClick={toggleTutorialModal}>
              How to Play
            </SecondaryButton>
            <UnderlinedText onClick={() => navigate("/history")}>
              View Word History
            </UnderlinedText>
            <UnderlinedText onClick={() => navigate("/changelog")}>
              View App changelog
            </UnderlinedText>
          </ButtonsContainer>

          <DateText>{moment().format("MMMM DD YYYY")}</DateText>
          <WordCountText>
            Word #{pastWords && pastWords[0]["solution_number"] + 1}
          </WordCountText>
          <EditedByText>Edited by David Garcia</EditedByText>
          <DevLogo src={"/logo-devgarcia.png"} alt="devgarcia logo" />
        </OnboardingContainer>
    </Container>
    </FadeInContainer>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 8px;
`;

const FadeInContainer = styled.div<{ mounted: boolean }>`
  opacity: ${props => (props.mounted ? 1 : 0)};
  transition: opacity 2s ease-in-out;
  width: 100%;
`;

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
  margin: 10px 0;

  @media (max-width: 400px) {
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 8px 0;
  color: #0c100f;
`;

const MainHeading = styled.h1`
  font-size: 2.2rem;
  margin: 4px 0;
  color: #0c100f;

  @media (max-width: 400px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: #0c100f;
  margin-bottom: 20px;

  @media (max-width: 400px) {
    font-size: 0.9rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
`;

const MainButton = styled.button`
  background-color: #0c100f;
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  border-radius: 99px;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #222;
  }

  @media (max-width: 400px) {
    font-size: 0.9rem;
    padding: 12px 20px;
  }
`;

const SecondaryButton = styled(MainButton)`
  background-color: transparent;
  color: #0c100f;
  border: 2px solid #0c100f;

  &:active {
    background-color: #f0efed;
  }
`;

const UnderlinedText = styled.button`
  background-color: transparent;
  border: none;
  color: #0c100f;
  padding: 10px;
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
`;

const NextWordText = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
  color: #0c100f;
  margin-bottom: 16px;

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

const DateText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #0c100f;
`;

const WordCountText = styled.p`
  font-size: 0.85rem;
  color: #0c100f;
`;

const EditedByText = styled.p`
  font-size: 0.75rem;
  color: #0c100f;
  margin-top: 30px;
`;

const DevLogo = styled.img`
  width: 32px;
  height: auto;
  margin-top: 6px;
`;
