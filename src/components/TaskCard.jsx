import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_CONFIG = {
  work:     { label: 'Work',     color: '#7c5cfc', bg: 'rgba(124,92,252,0.15)', dot: '#7c5cfc' },
  personal: { label: 'Personal', color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', dot: '#22d3ee' },
  urgent:   { label: 'Urgent',   color: '#ef4444', bg: 'rgba(239,68,68,0.13)',  dot: '#ef4444' },
  health:   { label: 'Health',   color: '#22c55e', bg: 'rgba(34,197,94,0.13)',  dot: '#22c55e' },
};

export default function TaskCardDash({ task, onComplete, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const cfg = PRIORITY_CONFIG[task.category] || PRIORITY_CONFIG.work;
  const progress = task.progress ?? 0;

  const timeStr = task.time || '—';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: task.completed
          ? 'rgba(255,255,255,0.02)'
          : `linear-gradient(135deg, ${cfg.color}14 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid ${hovered && !task.completed ? cfg.color + '44' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
        flexShrink: 0,
        opacity: task.completed ? 0.6 : 1,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: hovered && !task.completed
          ? `0 8px 32px ${cfg.color}18, 0 0 0 1px ${cfg.color}22`
          : '0 2px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Left color bar */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 0,
        width: 3,
        height: 'calc(100% - 28px)',
        background: cfg.color,
        borderRadius: '0 3px 3px 0',
        opacity: task.completed ? 0.4 : 1,
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}>
            {/* Category badge */}
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 20,
              background: cfg.bg,
              color: cfg.color,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}>
              {cfg.label}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {timeStr}
            </span>
          </div>

          <h3 style={{
            fontSize: 14,
            fontWeight: 600,
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none',
            lineHeight: 1.4,
          }}>
            {task.text}
          </h3>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 4, flexShrink: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: task.completed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                  color: task.completed ? '#22c55e' : 'var(--text-secondary)',
                  fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'all 0.15s',
                }}
              >
                {task.completed ? '↺' : '✓'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(239,68,68,0.2)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'all 0.15s',
                }}
              >
                ✕
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {!task.completed && progress > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)`,
                borderRadius: 4,
                boxShadow: `0 0 8px ${cfg.color}66`,
              }}
            />
          </div>
        </div>
      )}

      {task.completed && (
        <div style={{
          marginTop: 8,
          fontSize: 11,
          color: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span>✓</span> Completed
        </div>
      )}
    </motion.div>
  );
}
