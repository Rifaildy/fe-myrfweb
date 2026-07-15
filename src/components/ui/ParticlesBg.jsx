import { useEffect, useRef } from 'react';

const ParticlesBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.4;
        this.alpha = Math.random() * 0.6 + 0.15;
        this.baseAlpha = this.alpha;
        const palette = [
          [59, 130, 246],  // blue
          [6, 182, 212],   // cyan
          [124, 58, 237],  // purple
          [30, 58, 138],   // deep blue
        ];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce at edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.alpha = Math.min(1, this.baseAlpha + (1 - dist / 120) * 0.7);
          const force = (120 - dist) / 120;
          this.x -= dx * force * 0.015;
          this.y -= dy * force * 0.015;
        } else {
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.join(',')},${this.alpha})`;
        ctx.fill();
      }
    }

    const init = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 180);
      particles = Array.from({ length: count }, () => new Particle());
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 110;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();

    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBg;
