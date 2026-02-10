import React, { useState, useEffect } from "react";

export function MainHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate a new heart every 400ms
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random().toString(36).substr(2, 9),
        size: Math.random() * 8 + 24,
        left: Math.random() * 90 + 5,
        duration: Math.random() * 3 + 8, // 8-11 seconds float duration
        delay: -Math.random() * 3,
      };
      setHearts((prev) => [...prev, newHeart]);

      // Remove the heart after its animation duration
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, newHeart.duration * 1000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-hearts-container">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            fontSize: `${heart.size}px`,
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}