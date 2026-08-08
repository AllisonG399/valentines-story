import { useEffect, useState } from "react";

const sparkleMap = {
  hearts: "❤️",
  "black-heart": "🖤",
  "heart-emoji": "😍",
  "kiss-emoji": "😘",
  skulls: "💀",
  taco: "🌮",
  pizza: "🍕",
  sushi: "🍣",
  cookie: "🍪",
  book: "📖",
  "heart-envelope": "💌",
  flowers: "🌹",
  stars: "✨",
};

export default function Sparkles({ type = "hearts", count = 80 }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    let mounted = true;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!mounted) return;
        setSparkles((prev) => [
          ...prev,
          {
            id: Math.random(),
            left: Math.random() * 90 + 5, // 5% → 95%
            size: Math.random() * 12 + 20, // more size variation
            riseDuration: Math.random() * 1.5 + 1.5, // 1.5 → 3s
            fallDelay: Math.random() * 3, // stagger start 0 → 2s
            fallDuration: Math.random() * 2 + 3, // 3 → 5s
            horizontalOffset: (Math.random() - 0.5) * 100, // wider spread
            startBottom: Math.random() * 20 + 60, // random start height %
          },
        ]);
      }, Math.random() * 1000); // random delay for creation
    }

    return () => {
      mounted = false;
    };
  }, [count]);

  return (
    <div 
      className="sparkles-container"
      aria-hidden="true"
    >
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            fontSize: `${sparkle.size}px`,
            opacity: 0,
            bottom: `${sparkle.startBottom}%`,
            animation: `riseAndFall ${sparkle.riseDuration + sparkle.fallDuration}s ease forwards`,
            animationDelay: `${sparkle.fallDelay}s`,
            "--horizontal-offset": `${sparkle.horizontalOffset}px`,
          }}
        >
          {sparkleMap[type] || "✨"}
        </span>
      ))}
    </div>
  );
}