import { useState, useEffect } from "react";

export function FullScreenHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // generate hearts only once on mount
    const newHearts = Array.from({ length: 80 }).map(() => ({
      size: Math.random() * 30 + 16,
      delay: Math.random() * 5,
      x: Math.random() * 100
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="intro-floating-hearts">
      {hearts.map((heart, i) => (
        <span
          key={i}
          className="intro-heart"
          style={{
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            left: `${heart.x}%`
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}