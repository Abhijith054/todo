import { useEffect, useRef } from 'react';

export default function StarField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    const shootingStars = [];
    const STAR_COUNT = 220;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createStar() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        dAlpha: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        hue: Math.random() > 0.85 ? `${180 + Math.random() * 100}` : '210',
      };
    }

    function createShootingStar() {
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        vx: (Math.random() * 6 + 3) * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.random() * 3 + 1,
        len: Math.random() * 120 + 60,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
      };
    }

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar());
    }

    // Draw nebula clouds
    function drawNebulas(ctx, w, h) {
      const nebulas = [
        { x: w * 0.15, y: h * 0.25, r: 250, c1: 'rgba(63,14,128,0.18)', c2: 'transparent' },
        { x: w * 0.80, y: h * 0.65, r: 300, c1: 'rgba(0,80,180,0.14)', c2: 'transparent' },
        { x: w * 0.50, y: h * 0.80, r: 200, c1: 'rgba(191,0,96,0.10)', c2: 'transparent' },
      ];
      nebulas.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.c1);
        g.addColorStop(1, n.c2);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
      bg.addColorStop(0, '#07071a');
      bg.addColorStop(0.5, '#04040f');
      bg.addColorStop(1, '#02020a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawNebulas(ctx, width, height);

      // Stars
      stars.forEach(s => {
        s.alpha += s.dAlpha;
        if (s.alpha > 1 || s.alpha < 0.05) s.dAlpha *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 70%, 85%, ${s.alpha})`;
        ctx.fill();

        // Star cross glow for brighter ones
        if (s.r > 1.1 && s.alpha > 0.7) {
          ctx.strokeStyle = `hsla(${s.hue}, 80%, 90%, ${s.alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3, s.y);
          ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3);
          ctx.lineTo(s.x, s.y + s.r * 3);
          ctx.stroke();
        }
      });

      // Shooting stars
      if (Math.random() < 0.008 && shootingStars.length < 3) {
        shootingStars.push(createShootingStar());
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha = 1 - ss.life / ss.maxLife;

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * (ss.len / Math.abs(ss.vx)), ss.y - ss.vy * (ss.len / Math.abs(ss.vx)));
        grad.addColorStop(0, `rgba(180, 240, 255, ${ss.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - (ss.vx / Math.abs(ss.vx)) * ss.len, ss.y - (ss.vy / Math.abs(ss.vx)) * ss.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
