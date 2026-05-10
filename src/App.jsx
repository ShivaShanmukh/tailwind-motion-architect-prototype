import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── DATA ────────────────────────────────────────────────────────────────────
// Each row of the comparison table lives here as data, not hardcoded JSX.
// This is intentional: in a real product, this data would come from an API.
// Keeping data separate from UI is clean component architecture.
const rows = [
  {
    feature: "Visitor experience",
    static: "Same page for everyone",
    architect: "Adapts to every visitor in real-time",
    icon: "👤",
  },
  {
    feature: "Creating a page",
    static: "Days of manual work",
    architect: "Describe it, live in minutes",
    icon: "⚡",
  },
  {
    feature: "Website improvements",
    static: "Manual updates only",
    architect: "Improves itself with every visit",
    icon: "📈",
  },
  {
    feature: "Page insights",
    static: "Pageviews only",
    architect: "What convinced them to buy",
    icon: "🧠",
  },
  {
    feature: "Returning visitors",
    static: "Same page again",
    architect: "Remembers exactly who they are",
    icon: "🔁",
  },
]

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
// This hook counts from 0 to a target number when active=true.
// useEffect watches [active] — when it flips to true, the counter starts.
// This is a reusable pattern you'll use in many projects.
function useCounter(target, active, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutQuart — starts fast, slows at the end. Feels satisfying.
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return value
}

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
// A single conversion metric. Animates its number when Architect mode is on.
function MetricCard({ label, target, active, delay }) {
  const value = useCounter(target, active)
  return (
    // motion.div with initial/animate lets it slide up and fade in
    // The delay prop staggers each card so they don't all appear at once
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: active ? 1 : 0.3, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20"
    >
      <div className="text-3xl font-bold text-white mb-1">
        {active ? `+${value}%` : "—"}
      </div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  )
}

// ─── COMPARISON ROW ───────────────────────────────────────────────────────────
// One row of the comparison table. Shows static vs architect value.
// The architect side animates in when isArchitect flips to true.
function ComparisonRow({ row, isArchitect, index }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4 border-b border-white/10 last:border-0">
      {/* Feature label — always visible */}
      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
        <span>{row.icon}</span>
        <span>{row.feature}</span>
      </div>

      {/* Static value — fades out when Architect mode is on */}
      <motion.div
        animate={{ opacity: isArchitect ? 0.25 : 1 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-white/50 flex items-center"
      >
        {row.static}
      </motion.div>

      {/* Architect value — animates in with a stagger delay based on index */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: isArchitect ? 1 : 0.3,
          x: isArchitect ? 0 : 10,
        }}
        transition={{ duration: 0.45, delay: index * 0.07 }}
        // Template literal: conditionally adds green glow when active
        className={`text-sm font-medium flex items-center transition-colors duration-500 ${
          isArchitect ? "text-emerald-300" : "text-white/30"
        }`}
      >
        {/* Green dot indicator — only visible in Architect mode */}
        {isArchitect && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 flex-shrink-0"
          />
        )}
        {row.architect}
      </motion.div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // THE single piece of state. Everything else is derived from this.
  const [isArchitect, setIsArchitect] = useState(false)

  return (
    // Full viewport, dark background, centred content
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <motion.p
            className="text-white/40 text-sm tracking-widest uppercase mb-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Before & After
          </motion.p>

          {/* AnimatePresence allows elements to animate OUT when removed */}
          {/* This is how the headline morphs when you toggle */}
          <div className="h-14 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {isArchitect ? (
                <motion.h1
                  key="architect"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-3xl font-bold text-white"
                >
                  Your website now{" "}
                  <span className="text-emerald-400">thinks</span>
                </motion.h1>
              ) : (
                <motion.h1
                  key="static"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-3xl font-bold text-white/60"
                >
                  Static website. Same for everyone.
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── MAIN CARD ──────────────────────────────────────────────── */}
        {/* The card itself changes background colour when Architect mode is on */}
        <motion.div
          animate={{
            backgroundColor: isArchitect ? "#0f1a14" : "#0f0f14",
            borderColor: isArchitect
              ? "rgba(52,211,153,0.2)"
              : "rgba(255,255,255,0.08)",
          }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border p-8 mb-6"
        >
          {/* Column headers */}
          <div className="grid grid-cols-3 gap-4 mb-2 pb-3 border-b border-white/10">
            <div className="text-xs text-white/30 uppercase tracking-wider">Feature</div>
            <div className="text-xs text-white/30 uppercase tracking-wider">Static Website</div>
            <motion.div
              animate={{ color: isArchitect ? "#34d399" : "rgba(255,255,255,0.3)" }}
              transition={{ duration: 0.4 }}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              Architect ✦
            </motion.div>
          </div>

          {/* Render all comparison rows */}
          {rows.map((row, i) => (
            <ComparisonRow
              key={row.feature}
              row={row}
              isArchitect={isArchitect}
              index={i}
            />
          ))}
        </motion.div>

        {/* ── METRICS BAR ────────────────────────────────────────────── */}
        <motion.div
          animate={{ opacity: isArchitect ? 1 : 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <MetricCard label="Conversion for Atlas"        target={17.9} active={isArchitect} delay={0.1} />
          <MetricCard label="Conversion for Cenoa"        target={13.8} active={isArchitect} delay={0.2} />
          <MetricCard label="Conversion for Hawk Ridge"   target={300}  active={isArchitect} delay={0.3} />
        </motion.div>

        {/* ── TOGGLE BUTTON ──────────────────────────────────────────── */}
        {/* The entire prototype lives or dies on this feeling good */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsArchitect((v) => !v)}
            className="relative group"
          >
            {/* Glow behind the button — only visible in Architect mode */}
            <motion.div
              animate={{ opacity: isArchitect ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl scale-150"
            />

            {/* The pill toggle */}
            <motion.div
              animate={{
                backgroundColor: isArchitect ? "#059669" : "#1f2937",
              }}
              transition={{ duration: 0.4 }}
              className="relative flex items-center gap-3 px-7 py-4 rounded-full cursor-pointer"
            >
              {/* Moving dot inside the toggle */}
              <motion.div
                animate={{ x: isArchitect ? 0 : 0 }}
                className="w-2 h-2 rounded-full bg-white"
              />
              <motion.span
                animate={{ color: isArchitect ? "#ffffff" : "#9ca3af" }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold tracking-wide select-none"
              >
                {isArchitect ? "← Back to Static" : "Give it a brain →"}
              </motion.span>
            </motion.div>
          </button>
        </div>

        {/* ── FOOTER TAG ─────────────────────────────────────────────── */}
        <motion.p
          animate={{ opacity: isArchitect ? 0.5 : 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white/30 text-xs mt-8"
        >
          Built by Siva. I — prototype for Architect design engineer application
        </motion.p>

      </div>
    </div>
  )
}
