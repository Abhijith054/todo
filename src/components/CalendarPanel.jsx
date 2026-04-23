import { useMemo } from 'react';
import { motion } from 'framer-motion';

function getDayAbbr(d) { return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]; }
function fmt12(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2,'0')} ${ampm}`;
}

const CATEGORY_COLORS = {
  work:     { color: '#7c5cfc', bg: 'rgba(124,92,252,0.15)', light: '#a78bfa' },
  personal: { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', light: '#67e8f9' },
  urgent:   { color: '#ef4444', bg: 'rgba(239,68,68,0.13)',  light: '#fca5a5' },
  health:   { color: '#22c55e', bg: 'rgba(34,197,94,0.13)',  light: '#86efac' },
};

export default function CalendarPanel({ tasks }) {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Build a 7-day week starting from Monday
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0=Sun
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + diff);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [today]);

  const [selectedDayIdx] = useMemo(() => {
    const idx = weekDays.findIndex(d =>
      d.getDate() === todayDate &&
      d.getMonth() === todayMonth &&
      d.getFullYear() === todayYear
    );
    return [idx === -1 ? 0 : idx];
  }, [weekDays, todayDate, todayMonth, todayYear]);

  // Tasks with parsed times for timeline
  const timedTasks = useMemo(() => {
    return tasks
      .filter(t => t.time && !t.completed)
      .map(t => {
        const [hStr, mStr] = t.time.split(':');
        return { ...t, hour: parseInt(hStr), min: parseInt(mStr) };
      })
      .sort((a, b) => a.hour * 60 + a.min - (b.hour * 60 + b.min));
  }, [tasks]);

  const untimedTasks = tasks.filter(t => !t.time && !t.completed);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 0,
    }}>
      {/* Week strip */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '0 0 20px 0',
        flexShrink: 0,
      }}>
        {weekDays.map((d, i) => {
          const isToday = d.getDate() === todayDate && d.getMonth() === todayMonth;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 4px',
                borderRadius: 12,
                background: isToday
                  ? 'linear-gradient(135deg, #7c5cfc, #3b9eff)'
                  : 'rgba(255,255,255,0.04)',
                border: isToday ? '1px solid rgba(124,92,252,0.5)' : '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: isToday ? '0 4px 20px rgba(124,92,252,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{
                fontSize: 9,
                fontWeight: 600,
                color: isToday ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
                {getDayAbbr(d.getDay())}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: isToday ? '#fff' : 'var(--text-secondary)',
              }}>
                {d.getDate()}
              </div>
              {isToday && (
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#fff',
                  margin: '4px auto 0',
                  opacity: 0.8,
                }} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: 4,
      }}>
        {timedTasks.length === 0 && untimedTasks.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            color: 'var(--text-muted)',
            textAlign: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 28 }}>📅</span>
            <p style={{ fontSize: 12 }}>No tasks scheduled today</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timedTasks.map((task, idx) => {
              const cfg = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}
                >
                  {/* Timeline line + dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: cfg.color,
                      boxShadow: `0 0 8px ${cfg.color}88`,
                      flexShrink: 0,
                      marginTop: 12,
                      zIndex: 1,
                    }} />
                    <div style={{
                      width: 1.5,
                      flex: 1,
                      background: `linear-gradient(180deg, ${cfg.color}66, transparent)`,
                      marginTop: 4,
                      marginBottom: 0,
                    }} />
                  </div>

                  {/* Task block */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    style={{
                      flex: 1,
                      background: `${cfg.color}0e`,
                      border: `1px solid ${cfg.color}28`,
                      borderRadius: 12,
                      padding: '10px 14px',
                      marginBottom: 10,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                          {task.text}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {fmt12(task.hour, task.min)}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: cfg.color,
                        background: `${cfg.color}22`,
                        padding: '2px 8px',
                        borderRadius: 20,
                        flexShrink: 0,
                        marginLeft: 8,
                        marginTop: 2,
                      }}>
                        {fmt12(task.hour, task.min)}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Untimed tasks */}
            {untimedTasks.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Unscheduled
                </p>
                {untimedTasks.map((task, i) => {
                  const cfg = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${cfg.color}20`,
                        borderRadius: 10,
                        padding: '9px 14px',
                        marginBottom: 7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{task.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
