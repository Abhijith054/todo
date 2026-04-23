import { motion } from 'framer-motion';

export default function HUD({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: 'rgba(2,2,16,0.82)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,245,255,0.15)',
        borderRadius: 50,
        padding: '10px 28px',
        boxShadow: '0 0 30px rgba(0,245,255,0.08), inset 0 0 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* App title */}
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 3,
        color: '#00f5ff',
        textShadow: '0 0 12px rgba(0,245,255,0.8)',
      }}>
        ZERO-G
      </div>

      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

      {/* Stats */}
      <StatItem label="ACTIVE" value={active} color="#00f5ff" />
      <StatItem label="DONE" value={completed} color="#39ff14" />
      <StatItem label="TOTAL" value={total} color="#bf5fff" />

      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 80,
          height: 4,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00f5ff, #39ff14)',
              borderRadius: 2,
              boxShadow: '0 0 8px rgba(0,245,255,0.6)',
            }}
          />
        </div>
        <span style={{
          fontSize: 10,
          fontFamily: 'Orbitron, sans-serif',
          color: '#39ff14',
          textShadow: '0 0 8px rgba(57,255,20,0.6)',
          minWidth: 32,
        }}>
          {pct}%
        </span>
      </div>
    </motion.div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 16,
        fontWeight: 700,
        color,
        textShadow: `0 0 10px ${color}`,
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 7,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
        marginTop: 3,
      }}>
        {label}
      </div>
    </div>
  );
}
