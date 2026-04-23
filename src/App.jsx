import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import TaskCard from './components/TaskCard';
import AddTaskModal from './components/TaskInput';
import CalendarPanel from './components/CalendarPanel';
import GlowButton from './components/GlowButton';
import UnicornBackground from './components/UnicornBackground';
import './index.css';

const STORAGE_KEY = 'zerogravity_tasks_v3';

function loadTasks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveTasks(t) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch (e) { console.error("Error saving tasks:", e); }
}

const GREETINGS = ['Good Morning', 'Good Afternoon', 'Good Evening'];
function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? GREETINGS[0] : h < 17 ? GREETINGS[1] : GREETINGS[2];
}

const FILTERS = ['All', 'To-Do', 'In Progress', 'Done'];
const FILTER_ICONS = ['◈', '◻', '◑', '✓'];

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => saveTasks(tasks), [tasks]);

  const addTask = useCallback(({ text, category, progress, time }) => {
    setTasks(prev => [{
      id: uuidv4(),
      text,
      category,
      progress,
      time,
      completed: false,
      createdAt: Date.now(),
    }, ...prev]);
  }, []);

  const completeTask = useCallback(id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback(id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.text.toLowerCase().includes(q));
    }
    if (filter === 'To-Do') list = list.filter(t => !t.completed && t.progress === 0);
    else if (filter === 'In Progress') list = list.filter(t => !t.completed && t.progress > 0);
    else if (filter === 'Done') list = list.filter(t => t.completed);
    return list;
  }, [tasks, filter, search]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => !t.completed && t.progress === 0).length,
    inProgress: tasks.filter(t => !t.completed && t.progress > 0).length,
    done: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const today = new Date();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      background: 'transparent',
    }}>
      <UnicornBackground />

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        gap: 0,
      }}>
        {/* Left: Dashboard panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 28px 24px 28px',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(15,15,23,0.50)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexShrink: 0 }}
          >
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>
                {getGreeting()}! 👋
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                You have{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #7c5cfc, #3b9eff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stats.total} tasks
                </span>{' '}
                this month
              </h1>
            </div>

            {/* Add Task button */}
            <GlowButton onClick={() => setShowModal(true)} style={{ flexShrink: 0 }}>
              <span style={{ fontSize: 15, lineHeight: 1 }}>+</span>
              Add Task
            </GlowButton>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              position: 'relative',
              marginBottom: 22,
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 14,
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}>
              ⌕
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search a task..."
              style={{
                width: '100%',
                padding: '11px 16px 11px 38px',
                background: searchFocused ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.04)',
                border: searchFocused ? '1px solid rgba(124,92,252,0.45)' : '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14,
                color: 'var(--text-primary)',
                fontSize: 13,
                transition: 'all 0.2s',
                boxShadow: searchFocused ? '0 0 0 3px rgba(124,92,252,0.1)' : 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />
          </motion.div>

          {/* Category stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 24,
              flexShrink: 0,
            }}
          >
            {[
              { label: 'To-Do', count: stats.todo, color: '#ef4444', icon: '◻' },
              { label: 'In Progress', count: stats.inProgress, color: '#eab308', icon: '◑' },
              { label: 'Done', count: stats.done, color: '#22c55e', icon: '✓' },
            ].map(s => (
              <motion.div
                key={s.label}
                whileHover={{ y: -2, scale: 1.02 }}
                onClick={() => setFilter(filter === s.label ? 'All' : s.label)}
                style={{
                  flex: 1,
                  padding: '14px 14px',
                  background: filter === s.label
                    ? `${s.color}18`
                    : 'rgba(255,255,255,0.04)',
                  border: filter === s.label
                    ? `1.5px solid ${s.color}55`
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: filter === s.label
                    ? `0 4px 24px ${s.color}22`
                    : '0 2px 12px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${s.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: 16,
                  color: s.color,
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600, letterSpacing: 0.3 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tasks list header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {filter === 'All' ? "Today's Tasks" : filter}
            </h2>
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTERS.map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background: filter === f ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.05)',
                    border: filter === f ? '1px solid rgba(124,92,252,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    color: filter === f ? 'var(--accent-purple-light)' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Task list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingRight: 4,
          }}>
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    paddingTop: 48,
                    gap: 10,
                  }}
                >

                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {search ? 'No tasks match your search' : 'No tasks yet'}
                  </p>
                  <p style={{ fontSize: 12 }}>
                    {search ? 'Try a different keyword' : 'Hit "+ Add Task" to get started'}
                  </p>
                </motion.div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Calendar + Timeline panel */}
        <div style={{
          width: 320,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px 24px',
          overflow: 'hidden',
          background: 'rgba(22,22,31,0.45)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}>
          {/* Panel header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 20, flexShrink: 0 }}
          >
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Schedule</h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </motion.div>

          {/* Calendar + Timeline */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <CalendarPanel tasks={tasks} />
          </div>

          {/* Bottom summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 16,
              padding: '14px',
              background: 'rgba(124,92,252,0.06)',
              border: '1px solid rgba(124,92,252,0.18)',
              borderRadius: 14,
              flexShrink: 0,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-purple-light)' }}>
                {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: stats.total > 0 ? `${(stats.done / stats.total) * 100}%` : '0%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #7c5cfc, #3b9eff)',
                  borderRadius: 5,
                  boxShadow: '0 0 8px rgba(124,92,252,0.5)',
                }}
              />
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
              {stats.done} of {stats.total} tasks completed
            </p>
          </motion.div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showModal && (
          <AddTaskModal onAdd={addTask} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
