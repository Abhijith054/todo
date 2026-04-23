/**
 * BeamButton — pill button with:
 *   • rotating conic-gradient orange beam border
 *   • animated dot-grid background
 *   • orange bottom glow on hover
 *   • arrow icon that slides on hover
 *
 * Props:
 *   onClick  — click handler
 *   children — label text
 *   style    — optional extra wrapper styles
 *   small    — tighter padding variant
 */
export default function GlowButton({ onClick, children, style = {}, small = false }) {
  return (
    <button
      className="beam-btn"
      onClick={onClick}
      style={{ padding: small ? '9px 20px' : '14px 36px', ...style }}
    >
      {/* ── Rotating conic beam border ── */}
      <div className="beam-btn__border">
        <div className="beam-btn__border-spin" />
        <div className="beam-btn__border-fill" />
      </div>

      {/* ── Dark inner layer with effects ── */}
      <div className="beam-btn__inner">
        {/* Subtle top-to-transparent gradient */}
        <div className="beam-btn__inner-grad" />
        {/* Animated dot grid */}
        <div className="beam-btn__inner-dots" />
        {/* Orange glow blooms from bottom on hover */}
        <div className="beam-btn__inner-glow" />
      </div>

      {/* ── Content ── */}
      <span style={{ position: 'relative', zIndex: 10 }}>{children}</span>

      {/* ── Arrow ── */}
      <svg
        className="beam-btn__arrow"
        xmlns="http://www.w3.org/2000/svg"
        width={small ? 13 : 15}
        height={small ? 13 : 15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}
