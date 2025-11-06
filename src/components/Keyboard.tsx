import styled from "styled-components";

const KeyboardContainer = styled.div`
  width: 100%;
  background-color: #121213;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px 16px;
  box-sizing: border-box;
  z-index: 5;

  @supports (padding: env(safe-area-inset-bottom)) {
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  @media (max-width: 600px) {
    gap: 10px;
    padding: 10px 6px 20px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 6px;
  width: 100%;
  max-width: 600px;
  padding: 0 4px;

  @media (max-width: 600px) {
    gap: 5px;
  }
`;

const Key = styled.button<{ $status?: "absent" | "present" | "correct" }>`
  flex: 1;
  min-width: 0;
  border: none;
  border-radius: 8px;
  background-color: ${({ $status }) => {
    if ($status === "correct") return "#538d4e";
    if ($status === "present") return "#b59f3b";
    if ($status === "absent") return "#3a3a3c";
    return "#818384";
  }};
  color: #f8f8f8;
  font-weight: bold;
  font-size: clamp(14px, 4.5vw, 20px);
  text-transform: uppercase;
  padding: 16px 0;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 56px;
  transition: transform 0.05s ease;

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 600px) {
    min-height: 54px;
    border-radius: 10px;
  }
`;

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: Record<string, "absent" | "present" | "correct" | undefined>;
}

export default function Keyboard({ onKeyPress, keyStatuses }: KeyboardProps) {
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "⌫"],
  ];

  return (
    <KeyboardContainer>
      {rows.map((row, rIndex) => (
        <Row key={rIndex}>
          {row.map((key) => (
            <Key
              key={key}
              onClick={() => onKeyPress(key)}
              $status={keyStatuses[key]}
              style={{
                flex: key === "ENTER"? "2" : key === "⌫"? '1.3'  : "1",
              }}
            >
              {key}
            </Key>
          ))}
        </Row>
      ))}
    </KeyboardContainer>
  );
}
