import { motion, AnimatePresence } from 'framer-motion';

export default function EmptyState() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        {/* Pulsing orb */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, rgba(191,95,255,0.08) 60%, transparent 100%)',
            border: '1px solid rgba(0,245,255,0.2)',
            margin: '0 auto 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,245,255,0.15), inset 0 0 40px rgba(191,95,255,0.08)',
          }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 40, display: 'block', lineHeight: 1 }}
          >
            ◈
          </motion.span>
        </motion.div>

        <motion.h2
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 4,
            color: '#00f5ff',
            textShadow: '0 0 20px rgba(0,245,255,0.8)',
            marginBottom: 12,
          }}
        >
          SPACE IS EMPTY
        </motion.h2>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: 'rgba(232,232,255,0.4)',
          letterSpacing: 1,
          lineHeight: 1.8,
        }}>
          Initialize mission objectives<br />to populate the gravity field
        </p>

        <motion.div
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          style={{
            marginTop: 20,
            fontSize: 10,
            fontFamily: 'Orbitron, sans-serif',
            color: 'rgba(0,245,255,0.5)',
            letterSpacing: 3,
          }}
        >
          ▼ MISSION CONTROL BELOW ▼
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
