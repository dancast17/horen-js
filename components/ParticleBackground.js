"use client";

import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  let particles = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [ "#84B7DC", "#D7799C", "#F69686", "#CF94B6"];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.initialVx = this.vx;
        this.initialVy = this.vy;
        this.size = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // **Soft Border Handling**: Instead of bouncing, gently push them back
        const margin = 50; // Allow some margin before pushing back

        if (this.x < margin) this.vx += (margin - this.x) * 0.01;
        if (this.x > width - margin) this.vx -= (this.x - (width - margin)) * 0.01;
        if (this.y < margin) this.vy += (margin - this.y) * 0.01;
        if (this.y > height - margin) this.vy -= (this.y - (height - margin)) * 0.01;

        // **Slow down gradually, return to initial speed**
        this.vx += (this.initialVx - this.vx) * 0.02;
        this.vy += (this.initialVy - this.vy) * 0.02;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.filter = "blur(40px)";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.filter = "none";
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(Math.random() * width, Math.random() * height));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function mouseMove(e) {
      particles.forEach((particle) => {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          // **Smooth repel effect based on proximity**
          const force = Math.max(0, 1 - distance / 150);
          const speedBoost = force * 2;

          particle.vx += (dx * 0.05) * speedBoost;
          particle.vy += (dy * 0.05) * speedBoost;
        }
      });
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", mouseMove);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default ParticleBackground;
