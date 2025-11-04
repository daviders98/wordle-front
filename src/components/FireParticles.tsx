import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const riseAndSway = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-20px, -100vh) scale(0.5); opacity: 0; }
`;

const FireParticle = styled.div<{
  $x: number;
  $y: number;
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
    forwards;
  pointer-events: none;
  z-index: 100;
  will-change: transform, opacity;
`;

export default function FireParticles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 10,
      duration: 2 + Math.random() * 2,
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
          $duration={p.duration}
          $size={p.size}
        >
          🔥
        </FireParticle>
      ))}
    </>
  );
}
