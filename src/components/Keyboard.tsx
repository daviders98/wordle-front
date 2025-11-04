import styled from "styled-components";

const KeyboardContainer = styled.div`
margin-top:20px;
  width: 100%;
  background-color: #121213;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  z-index: 5;

  @supports (padding: env(safe-area-inset-bottom)) {
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }

  @media (max-width: 600px) {
    gap: 8px;
    padding: 8px 0;
  }
`;


const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
`;

const Key = styled.button<{ $status?: "absent" | "present" | "correct" }>`
  background-color: ${({ $status }) => {
    if ($status === "correct") return "#538d4e";
    if ($status === "present") return "#b59f3b";
    if ($status === "absent") return "#3a3a3c";
    return "#818384";
  }};
  color: #f8f8f8;
  font-weight: bold;
  font-size: clamp(12px, 4vw, 18px);
  border: none;
  border-radius: 6px;
  padding: 18px 16px 18px;
  cursor: pointer;
  flex: 1;
  text-transform: uppercase;
  min-height:58px;

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 600px) {
    padding: 12px 7px; 
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
                flex: key === "ENTER" || key === "⌫" ? "1.5" : "1",
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
