import { motion } from 'framer-motion';

const navItems = [
  { icon: '⊞', label: 'Dashboard', active: true },
  { icon: '◫', label: 'My Tasks' },
  { icon: '◷', label: 'Schedule' },
  { icon: '◑', label: 'Analytics' },
  { icon: '◻', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 72,
      height: '100%',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
      gap: 6,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #7c5cfc, #3b9eff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(124,92,252,0.4)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >

      </motion.div>

      {navItems.map(item => (
        <motion.button
          key={item.label}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
          title={item.label}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: item.active ? 'rgba(124,92,252,0.18)' : 'transparent',
            border: item.active ? '1px solid rgba(124,92,252,0.35)' : '1px solid transparent',
            color: item.active ? 'var(--accent-purple-light)' : 'var(--text-muted)',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {item.icon}
        </motion.button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f472b6, #fb923c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          cursor: 'pointer',
          border: '2px solid rgba(255,255,255,0.15)',
        }}
      >
        👤
      </motion.div>
    </aside>
  );
}
