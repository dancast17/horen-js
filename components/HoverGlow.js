"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HoverGlow = ({ titleRef }) => {
  const canvasRef = useRef(null);

  // Colors to interpolate between
  const colors = ["#84B7DC", "#D7799C", "#F69686", "#CF94B6"];

  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // 🔹 Update glow position only when necessary
  const updateTitlePosition = useCallback(() => {
    if (titleRef?.current) {
      const rect = titleRef.current.getBoundingClientRect();
      setGlowPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width * 1.2, // Slightly wider than title
        height: rect.height * 1.7, // Taller ellipse
      });
    }
  }, [titleRef]);

  useEffect(() => {
    updateTitlePosition(); // Run once when mounted

    const handleResize = () => updateTitlePosition();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateTitlePosition]); // Runs only when `titleRef` changes

  // Function to interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    let c1 = parseInt(color1.slice(1), 16),
      c2 = parseInt(color2.slice(1), 16);

    let r1 = (c1 >> 16) & 255,
      g1 = (c1 >> 8) & 255,
      b1 = c1 & 255;

    let r2 = (c2 >> 16) & 255,
      g2 = (c2 >> 8) & 255,
      b2 = c2 & 255;

    let r = Math.round(r1 + (r2 - r1) * factor);
    let g = Math.round(g1 + (g2 - g1) * factor);
    let b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let glowBall = { x: glowPosition.x, y: glowPosition.y, width: glowPosition.width, height: glowPosition.height };

    let colorIndex = 0;
    let transitionFactor = 0;

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Floating effect
      glowBall.x = glowPosition.x + Math.sin(Date.now() * 0.002) * 5;
      glowBall.y = glowPosition.y + Math.cos(Date.now() * 0.002) * 5;
      glowBall.width = glowPosition.width;
      glowBall.height = glowPosition.height;

      // Interpolate between colors smoothly
      let nextColorIndex = (colorIndex + 1) % colors.length;
      let currentColor = interpolateColor(colors[colorIndex], colors[nextColorIndex], transitionFactor);

      transitionFactor += 0.005; // Linear transition speed
      if (transitionFactor >= 1) {
        transitionFactor = 0;
        colorIndex = nextColorIndex; // Move to the next color in sequence
      }

      // Create gradient for smooth fading effect
      const gradient = ctx.createRadialGradient(
        glowBall.x, glowBall.y, 10, // Bright center
        glowBall.x, glowBall.y, glowBall.width // Outer fade
      );

      gradient.addColorStop(0, currentColor); // Center color
      gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.3)"); // Mid fade
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fully faded edges

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.7;
      ctx.filter = "blur(80px)";

      // Draw elliptical glow (slightly taller)
      ctx.beginPath();
      ctx.ellipse(glowBall.x, glowBall.y, glowBall.width * 0.5, glowBall.height * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.filter = "none";

      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [glowPosition.x, glowPosition.y, glowPosition.width, glowPosition.height]); // Re-run when necessary

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none mix-blend-lighten z-10"
    />
  );
};

export default HoverGlow;
