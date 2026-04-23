import { useEffect, useRef } from 'react';

const COLORS = [
  [0, 245, 255],   // cyan
  [191, 95, 255],  // purple
  [255, 60, 172],  // pink
  [57, 255, 20],   // green
  [255, 255, 255], // white
];

export default function SpaceParticles() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({ w: 0, h: 0, particles: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const COUNT = 45;

    function resize() {
      state.w = canvas.width = window.innerWidth;
      state.h = canvas.height = window.innerHeight;
    }

    function createParticle(randomY = false) {
      const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * state.w,
        y: randomY ? Math.random() * state.h : state.h + 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 0.6 + 0.2),
        r: Math.random() * 2 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.2,
        cr: r, cg: g, cb: b,
        life: 0,
        maxLife: Math.random() * 400 + 200,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: (Math.random() - 0.5) * 0.02,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, state.w, state.h);
      const { particles } = state;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.3;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.baseAlpha * (
          lifeRatio < 0.1 ? lifeRatio * 10
          : lifeRatio > 0.9 ? (1 - lifeRatio) * 10
          : 1
        );
        const a = Math.max(0, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${a})`;
        ctx.fill();

        // Soft glow for larger particles
        if (p.r > 1.5 && a > 0.05) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grd.addColorStop(0, `rgba(${p.cr},${p.cg},${p.cb},${a * 0.3})`);
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -20) {
          particles.splice(i, 1);
          particles.push(createParticle(false));
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();

    // Seed initial particles scattered across screen
    for (let i = 0; i < COUNT; i++) {
      const p = createParticle(true);
      p.life = Math.random() * p.maxLife;
      state.particles.push(p);
    }

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
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
