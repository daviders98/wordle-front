import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const riseAndSway = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  15% { transform: translate(20px, -20vh) scale(0.95); }
  85% { transform: translate(-20px, -110vh) scale(0.6); }
  100% { transform: translate(15px, -130vh) scale(0.5); opacity: 0; }
`;

const FireParticle = styled.div<{
  $x: number;
  $y: number;
  $delay: number;
  $duration: number;
  $size: number;
}>`
  position: fixed;
  bottom: ${({ $y }) => $y}vh;
  left: ${({ $x }) => $x}%;
  font-size: ${({ $size }) => $size}rem;
  animation: ${riseAndSway}
    ${({ $duration }) => $duration}s
    ease-in-out
    ${({ $delay }) => $delay}s
    forwards;
  pointer-events: none;
  z-index: 100;
  will-change: transform, opacity;
`;

export default function FireParticles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; delay: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 10,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2.5,
      size: 1 + Math.random() * 1.2,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 5000);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <>
      {particles.map((p) => (
        <FireParticle
          key={p.id}
          $x={p.x}
          $y={p.y}
          $delay={p.delay}
          $duration={p.duration}
          $size={p.size}
        >
          🔥
        </FireParticle>
      ))}
    </>
  );
}
