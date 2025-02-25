import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const FlashingLights = ({ titleRef }) => {
  const canvasRef = useRef(null);
  const [lights, setLights] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#FF0000", "#fd0c0c", "#cc0000", "#660000"];

    let titleSize = 200; // Default size before measuring title

    if (titleRef?.current) {
      const rect = titleRef.current.getBoundingClientRect();
      titleSize = rect.width * 0.8; // Scale lights based on title
    }

    function generateLights(num) {
      let newLights = [];

      for (let i = 0; i < num; i++) {
        let x, y, tooClose;

        do {
          x = Math.random() * width;
          y = Math.random() * height;
          tooClose = newLights.some((l) => {
            const dx = l.x - x;
            const dy = l.y - y;
            return Math.sqrt(dx * dx + dy * dy) < titleSize * 1.5; // Avoid collisions
          });
        } while (tooClose);

        newLights.push({
          x,
          y,
          size: titleSize, // Match title glow size
          opacity: 0.8, // Steady glow unless hovered
          color: colors[Math.floor(Math.random() * colors.length)],
          isHovered: false,
        });
      }

      return newLights;
    }

    let flashingLights = generateLights(6);
    setLights(flashingLights);

    function drawLights() {
      ctx.clearRect(0, 0, width, height);

      flashingLights.forEach((light) => {
        ctx.beginPath();
        ctx.fillStyle = light.color;
        ctx.globalAlpha = light.opacity;
        ctx.filter = "blur(60px)"; // Strong blur for effect
        ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.filter = "none";
      });

      requestAnimationFrame(drawLights);
    }

    drawLights();
  }, [titleRef]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-5" />;
};

FlashingLights.propTypes = {
  titleRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};

FlashingLights.defaultProps = {
  titleRef: null,
};


export default FlashingLights;
