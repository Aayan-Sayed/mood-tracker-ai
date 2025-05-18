import React, { useEffect, useRef } from 'react';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import { MoodType } from '../types';

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { entries } = useMood();
  const { theme } = useTheme();

  // Get the predominant mood for the last week
  const getPredominantMood = (): MoodType => {
    if (entries.length === 0) return MoodType.NEUTRAL;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = entries.filter(
      entry => new Date(entry.date) >= oneWeekAgo
    );
    
    if (recentEntries.length === 0) return MoodType.NEUTRAL;
    
    const moodCounts: Record<MoodType, number> = {
      [MoodType.JOYFUL]: 0,
      [MoodType.HAPPY]: 0,
      [MoodType.CONTENT]: 0,
      [MoodType.NEUTRAL]: 0,
      [MoodType.ANXIOUS]: 0,
      [MoodType.STRESSED]: 0,
      [MoodType.SAD]: 0,
      [MoodType.DEPRESSED]: 0,
    };
    
    recentEntries.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    return Object.entries(moodCounts).reduce(
      (max, [mood, count]) => (count > moodCounts[max as MoodType] ? mood as MoodType : max),
      MoodType.NEUTRAL
    );
  };
  
  // Get colors based on mood and theme
  const getColors = () => {
    const mood = getPredominantMood();
    const baseColors: Record<MoodType, string[]> = {
      [MoodType.JOYFUL]: ['255, 236, 66', '255, 224, 130'],
      [MoodType.HAPPY]: ['74, 222, 128', '134, 239, 172'],
      [MoodType.CONTENT]: ['96, 165, 250', '147, 197, 253'],
      [MoodType.NEUTRAL]: ['209, 213, 219', '229, 231, 235'],
      [MoodType.ANXIOUS]: ['251, 146, 60', '253, 186, 116'],
      [MoodType.STRESSED]: ['248, 113, 113', '254, 178, 178'],
      [MoodType.SAD]: ['129, 140, 248', '165, 180, 252'],
      [MoodType.DEPRESSED]: ['192, 132, 252', '216, 180, 254'],
    };
    
    // Adjust opacity based on theme
    const opacity = theme === 'dark' ? '0.1' : '0.05';
    
    return {
      colorA: `rgba(${baseColors[mood][0]}, ${opacity})`,
      colorB: `rgba(${baseColors[mood][1]}, ${opacity})`,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize bubbles
    const createBubbles = () => {
      const { colorA, colorB } = getColors();
      const bubbles = [];
      const count = Math.floor(window.innerWidth / 100); // Responsive number of bubbles

      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 100 + 50,
          color: Math.random() > 0.5 ? colorA : colorB,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
        });
      }

      return bubbles;
    };

    resizeCanvas();
    let bubbles = createBubbles();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update bubbles
      bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();

        // Move bubbles
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off walls
        if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
        if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;
        if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      bubbles = createBubbles();
    });

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [entries, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default BackgroundAnimation;