import { useEffect, useRef, useState, useCallback } from "react";

const HoverGlow = ({ titleRef }) => {
  const canvasRef = useRef(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const colors = ["#FF0000", "#fd0c0c", "#cc0000", "#660000"];

  const updateTitlePosition = useCallback(() => {
    if (titleRef?.current) {
      const rect = titleRef.current.getBoundingClientRect();
      setGlowPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width * 1.3,
        height: rect.height * 1.5,
      });
    }
  }, [titleRef]);

  useEffect(() => {
    updateTitlePosition();
    window.addEventListener("resize", updateTitlePosition);
    return () => window.removeEventListener("resize", updateTitlePosition);
  }, [updateTitlePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let glowBall = { ...glowPosition };

    let colorIndex = 0;
    let transitionFactor = 0;

    function interpolateColor(color1, color2, factor) {
      let c1 = parseInt(color1.slice(1), 16),
          c2 = parseInt(color2.slice(1), 16);

      let r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
      let r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

      return `rgb(${Math.round(r1 + (r2 - r1) * factor)},
                  ${Math.round(g1 + (g2 - g1) * factor)},
                  ${Math.round(b1 + (b2 - b1) * factor)})`;
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      glowBall.x = glowPosition.x + Math.sin(Date.now() * 0.002) * 5;
      glowBall.y = glowPosition.y + Math.cos(Date.now() * 0.002) * 5;
      glowBall.width = glowPosition.width;
      glowBall.height = glowPosition.height;

      let nextColorIndex = (colorIndex + 1) % colors.length;
      let currentColor = interpolateColor(colors[colorIndex], colors[nextColorIndex], transitionFactor);

      transitionFactor += 0.005;
      if (transitionFactor >= 1) {
        transitionFactor = 0;
        colorIndex = nextColorIndex;
      }

      const gradient = ctx.createRadialGradient(
        glowBall.x, glowBall.y, 10,
        glowBall.x, glowBall.y, glowBall.width
      );

      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.7;
      ctx.filter = "blur(80px)";

      ctx.beginPath();
      ctx.ellipse(glowBall.x, glowBall.y, glowBall.width * 0.7, glowBall.height * 0.75, 0, 0, Math.PI * 2);
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

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [glowPosition]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none mix-blend-lighten z-10" />;
};

export default HoverGlow;
