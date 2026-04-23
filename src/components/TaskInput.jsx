import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { key: 'work',     label: 'Work',     color: '#7c5cfc' },
  { key: 'personal', label: 'Personal', color: '#22d3ee' },
  { key: 'urgent',   label: 'Urgent',   color: '#ef4444' },
  { key: 'health',   label: 'Health',   color: '#22c55e' },
];

const PROGRESSES = [0, 25, 50, 75];

export default function AddTaskModal({ onAdd, onClose }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('work');
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ text: text.trim(), category, progress, time });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(18,18,28,0.65)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: '28px 28px',
          width: 'min(480px, 92vw)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add New Task</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Create your next mission objective</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            ✕
          </motion.button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Task text */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Task Name
            </label>
            <input
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={80}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontSize: 14,
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(124,92,252,0.5)'; e.target.style.background = 'rgba(124,92,252,0.08)'; }}
              onBlur={e  => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>

          {/* Time */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Time (optional)
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontSize: 14,
                colorScheme: 'dark',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.key}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCategory(cat.key)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: category === cat.key ? `${cat.color}22` : 'rgba(255,255,255,0.04)',
                    border: category === cat.key ? `1.5px solid ${cat.color}66` : '1.5px solid rgba(255,255,255,0.08)',
                    color: category === cat.key ? cat.color : 'var(--text-muted)',
                    transition: 'all 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
              Initial Progress
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PROGRESSES.map(p => (
                <motion.button
                  key={p}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProgress(p)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: progress === p ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.04)',
                    border: progress === p ? '1.5px solid rgba(124,92,252,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                    color: progress === p ? 'var(--accent-purple-light)' : 'var(--text-muted)',
                    transition: 'all 0.18s',
                  }}
                >
                  {p}%
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!text.trim()}
            whileHover={text.trim() ? { scale: 1.02, y: -1 } : {}}
            whileTap={text.trim() ? { scale: 0.98 } : {}}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              background: text.trim()
                ? 'linear-gradient(135deg, #7c5cfc, #3b9eff)'
                : 'rgba(255,255,255,0.06)',
              color: text.trim() ? '#fff' : 'var(--text-muted)',
              boxShadow: text.trim() ? '0 4px 20px rgba(124,92,252,0.4)' : 'none',
              transition: 'all 0.2s ease',
              letterSpacing: 0.3,
            }}
          >
            + Add Task
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
