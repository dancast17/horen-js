import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#FF0000", "#fd0c0c", "#660000", "#001F3F"]; // Deep red and dark blue for contrast

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 180 + 80;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.filter = "blur(60px)"; // Stronger blur for fog effect
        ctx.arc(
          this.x + parallaxRef.current.x, 
          this.y + parallaxRef.current.y, 
          this.size, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.filter = "none";
      }

      reactToMouse(mouseX, mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size * 0.8) {
          // Push particle away smoothly
          const force = Math.max(0, 1 - distance / (this.size * 0.8));
          this.vx += dx * 0.05 * force;
          this.vy += dy * 0.05 * force;
        }
      }
    }

    let particles = Array.from({ length: 15 }, () => 
      new Particle(Math.random() * width, Math.random() * height)
    );

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function handleMouseMove(e) {
      const moveX = (e.clientX / width - 0.5) * 50; 
      const moveY = (e.clientY / height - 0.5) * 50;
      parallaxRef.current = { x: moveX, y: moveY };

      // Make particles react to mouse
      particles.forEach(p => p.reactToMouse(e.clientX, e.clientY));
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default ParticleBackground;
