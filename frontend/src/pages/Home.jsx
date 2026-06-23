import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Droplets, Star, Bell, CheckCircle } from 'lucide-react'
import { useStore } from '../store'
import { useCounter } from '../hooks/useCounter'
import Marquee from '../components/Marquee'

/* ─── Lightweight hero visual (replaces heavy Three.js scene) ── */
function HeroVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Outer rotating coral ring */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ width:780, height:780, right:-260, top:'50%', marginTop:-390,
          border:'1px solid rgba(245,61,28,0.13)' }} />
      {/* Inner violet ring */}
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ width:520, height:520, right:-120, top:'50%', marginTop:-260,
          border:'1px solid rgba(124,58,237,0.1)' }} />
      {/* Teal ring */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ width:320, height:320, right:30, top:'50%', marginTop:-160,
          border:'1px solid rgba(0,168,119,0.09)' }} />
      {/* Coral filled dot — top */}
      {[
        { size:10, right:180, top:'22%', color:'#f53d1c', delay:0 },
        { size:6,  right:340, top:'35%', color:'#7c3aed', delay:0.8 },
        { size:8,  right:90,  top:'55%', color:'#00a877', delay:1.5 },
        { size:5,  right:260, top:'68%', color:'#f59e0b', delay:0.4 },
        { size:7,  right:420, top:'20%', color:'#f53d1c', delay:1.1 },
      ].map((d, i) => (
        <motion.div key={i}
          animate={{ y:[0,-18,0], opacity:[0.4,0.85,0.4] }}
          transition={{ duration:3.5+i*0.6, repeat:Infinity, delay:d.delay, ease:'easeInOut' }}
          className="absolute rounded-full"
          style={{ width:d.size, height:d.size, right:d.right, top:d.top, background:d.color }} />
      ))}
      {/* Subtle radial glow behind the rings */}
      <div className="absolute rounded-full"
        style={{ width:600, height:600, right:-180, top:'50%', marginTop:-300,
          background:'radial-gradient(circle, rgba(245,61,28,0.04) 0%, transparent 70%)' }} />
    </div>
  )
}

/* ─── Animated counter ─────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }) {
  const { count, ref } = useCounter(to)
  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-bold tabular-nums"
      style={{ color: '#0e0c0a' }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

/* ─── Split-text word reveal ───────────────────────── */
function SplitReveal({ text, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.08 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ─── Step accent colors ────────────────────────────── */
const STEP_ACCENTS = ['#f53d1c', '#f59e0b', '#00a877', '#7c3aed']

/* ─── Scrollytelling steps ──────────────────────────── */
const STORY_STEPS = [
  {
    icon: '🧴',
    label: 'Step 01',
    title: 'You build a routine',
    desc: 'Add products to your AM or PM routine. GlowOS checks every ingredient combination in real-time.',
    visual: (
      <div className="space-y-2.5">
        {['Saeed Ghani Neem Wash', 'Derma Shine Niacinamide', 'Iba SPF 40'].map((p, i) => (
          <motion.div key={p}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.18 }}
            className="flex items-center gap-3 bg-paper rounded-xl px-4 py-3"
            style={{ border: '1px solid #dfd3c4' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(245,61,28,0.08)' }}>
              {['🌿', '💎', '☀️'][i]}
            </div>
            <span className="text-sm font-medium" style={{ color: '#0e0c0a' }}>{p}</span>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.18 + 0.4 }}
              className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,168,119,0.12)' }}>
              <CheckCircle size={12} style={{ color: '#00a877' }} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    icon: '⚗️',
    label: 'Step 02',
    title: 'We catch conflicts instantly',
    desc: 'Retinol + AHA on the same night? We warn you before your skin pays the price.',
    visual: (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl p-5"
        style={{ background: '#fffbeb', border: '1px solid #fde48a' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: '#92400e' }}>Conflict detected</p>
            <p className="text-xs leading-relaxed" style={{ color: '#b45309' }}>
              Retinol + Glycolic Acid — using these together causes over-exfoliation. Move one to alternate nights.
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="text-[11px] px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: '#f59e0b', color: 'white' }}>Fix automatically</button>
          <button className="text-[11px] px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: 'white', color: '#b45309', border: '1px solid #fde48a' }}>Learn why</button>
        </div>
      </motion.div>
    ),
  },
  {
    icon: '📦',
    label: 'Step 03',
    title: 'Drops match your skin',
    desc: "A brand restocks. Within seconds, users with matching skin profiles get a personalised alert.",
    visual: (
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl p-4 shadow-card"
        style={{ border: '1px solid #dfd3c4' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(0,168,119,0.1)' }}>📦</div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#0e0c0a' }}>New Drop for you</p>
            <p className="text-[11px]" style={{ color: '#6b5e55' }}>Matched to oily + acne skin</p>
          </div>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: 3, duration: 0.5 }}
            className="ml-auto w-2 h-2 rounded-full" style={{ background: '#f53d1c' }} />
        </div>
        <p className="text-xs font-bold" style={{ color: '#0e0c0a' }}>Iba Halal SPF 50+ — Back in stock</p>
        <p className="text-[11px] mt-1" style={{ color: '#6b5e55' }}>Your skin type: ✓ oily ✓ sensitive ✓ all types</p>
        <button className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: '#f53d1c' }}>Shop Now — Rs. 620</button>
      </motion.div>
    ),
  },
  {
    icon: '📈',
    label: 'Step 04',
    title: 'Watch your glow build',
    desc: "Log your skin monthly. The data reveals what's actually moving the needle — and what's not.",
    visual: (
      <div>
        <svg viewBox="0 0 260 100" className="w-full">
          <defs>
            <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14" fill="none" stroke="#dfd3c4" strokeWidth="1.5" />
          <motion.path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14"
            fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
          <motion.path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14 L 250,90 L 10,90 Z"
            fill="url(#glow-grad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
          {[['Jan',10,80],['Feb',60,68],['Mar',110,52],['Apr',160,38],['May',210,22],['Jun',250,14]].map(([m,x,y], i) => (
            <motion.circle key={m} cx={x} cy={y} r="4" fill="#7c3aed" stroke="white" strokeWidth="1.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.18 + 0.4 }} />
          ))}
          {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
            <text key={m} x={[10,60,110,160,210,250][i]} y="98" textAnchor="middle" fontSize="7" fill="#a09080">{m}</text>
          ))}
        </svg>
        <p className="text-xs font-bold text-center mt-2" style={{ color: '#7c3aed' }}>↑ 90% skin improvement in 6 months</p>
      </div>
    ),
  },
]

/* ─── How it works — static 2×2 grid ───────────────── */
function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pb-4">
      {STORY_STEPS.map((step, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl p-8 shadow-soft"
          style={{ border: '1px solid #dfd3c4', borderTop: `3px solid ${STEP_ACCENTS[i]}` }}>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{ color: STEP_ACCENTS[i] }}>{step.label}</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{step.icon}</span>
            <h3 className="font-display text-xl font-bold leading-snug" style={{ color: '#0e0c0a' }}>
              {step.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b5e55' }}>{step.desc}</p>
          <div>{step.visual}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Reviews ───────────────────────────────────────── */
const REVIEWS = [
  { name: 'Ayesha R.',  skin: 'Dry + Sensitive',         text: "Saeed Ghani ke products use karti thi but kabhi result nahi milta tha. GlowOS ne bataya kaunse products sath chalte hain — ab meri skin finally hydrated hai.", stars: 5, avatar: '👩🏻' },
  { name: 'Fatima M.',  skin: 'Oily + Acne-Prone',       text: 'Iba SPF 50+ restock ka alert mila aur 5 minutes mein order kar diya. Everywhere sold out tha. GlowOS ke bina miss ho jata.', stars: 5, avatar: '👩🏾' },
  { name: 'Mariam S.',  skin: 'Combo + Hyperpigmentation', text: 'Meri melasma itni kam ho gayi hai. Derma Shine Kojic + Hemani Vitamin C — GlowOS ne confirm kiya ke yeh safe combination hai.', stars: 5, avatar: '👩🏼' },
]

/* ─── Main ──────────────────────────────────────────── */
export default function Home() {
  const setPage = useStore(s => s.setPage)
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(heroScroll, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0])

  return (
    <div style={{ background: '#f5f0ea' }} className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: '#0e0c0a' }}>

        {/* Geometric hero visual */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <HeroVisual />
        </motion.div>

        {/* Strong left gradient so text pops */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #0e0c0a 42%, rgba(14,12,10,0.88) 62%, rgba(14,12,10,0.1) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-36">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10 text-xs font-bold tracking-widest uppercase text-white"
            style={{ background: '#f53d1c' }}
          >
            <Sparkles size={10} />
            Skincare, finally intelligent
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-bold mb-10" style={{ lineHeight: '0.93' }}>
            <div className="text-6xl md:text-8xl lg:text-[108px]" style={{ color: '#f5f0ea' }}>
              <SplitReveal text="Your skin." delay={0.15} />
            </div>
            <div className="text-6xl md:text-8xl lg:text-[108px]" style={{ color: '#f53d1c' }}>
              <SplitReveal text="Smarter." delay={0.3} />
            </div>
            <div className="text-6xl md:text-8xl lg:text-[108px]" style={{ color: 'rgba(245,240,234,0.38)' }}>
              <SplitReveal text="Glowier." delay={0.45} />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            className="text-xl leading-relaxed max-w-md mb-12"
            style={{ color: 'rgba(245,240,234,0.55)' }}
          >
            Pakistani brands. Personalised routines. Drop alerts before they sell out. Track your glow — month by month.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <motion.button onClick={() => setPage('routine')}
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white"
              style={{ background: '#f53d1c' }}>
              Start My Routine <ArrowRight size={15} />
            </motion.button>
            <motion.button onClick={() => setPage('drops')}
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm"
              style={{ background: 'transparent', border: '1.5px solid rgba(245,240,234,0.2)', color: 'rgba(245,240,234,0.75)' }}>
              View Drops
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: 'rgba(245,240,234,0.3)' }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1.5px solid rgba(245,240,234,0.18)' }}>
            <div className="w-1 h-2 rounded-full" style={{ background: '#f53d1c' }} />
          </motion.div>
        </motion.div>

        {/* Diagonal clip to paper section */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: '#f5f0ea', clipPath: 'polygon(0 100%, 100% 15%, 100% 100%)' }} />
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <Marquee />

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-grid" style={{ background: '#f5f0ea' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { to: 48000,  suffix: '+', label: 'Products tracked',   sub: 'across 50+ Pakistani brands',     color: '#f53d1c', icon: <Droplets size={18} /> },
              { to: 92000,  suffix: '+', label: 'Active routines',    sub: 'built by Pakistani users',        color: '#00a877', icon: <Star     size={18} /> },
              { to: 58,     suffix: '',  label: 'Drops this week',    sub: 'matched to your skin profile',    color: '#7c3aed', icon: <Bell     size={18} /> },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 md:p-12"
                style={{ borderLeft: `4px solid ${s.color}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                  style={{ background: `${s.color}12`, color: s.color }}>
                  {s.icon}
                </div>
                <Counter to={s.to} suffix={s.suffix} />
                <p className="font-semibold mt-4" style={{ color: '#0e0c0a' }}>{s.label}</p>
                <p className="text-sm mt-1" style={{ color: '#6b5e55' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#f5f0ea' }}>
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f53d1c' }}>
            How it works
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold max-w-lg leading-tight"
            style={{ color: '#0e0c0a' }}>
            <SplitReveal text="Four steps to your best skin." />
          </h2>
          <HowItWorks />
        </div>
      </section>

      {/* ── MARQUEE 2 ────────────────────────────────── */}
      <Marquee reverse accent />

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0e0c0a' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f53d1c' }}>Real results</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#f5f0ea' }}>
              Skin that speaks for itself.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-8 transition-shadow"
                style={{ background: '#1e1a16', border: '1px solid rgba(245,240,234,0.07)' }}>
                <div className="font-display text-6xl leading-none mb-4" style={{ color: '#f53d1c' }}>"</div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(245,240,234,0.7)' }}>
                  {r.text}
                </p>
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} style={{ color: '#f53d1c', fontSize: '13px' }}>★</span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(245,240,234,0.06)' }}>{r.avatar}</div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#f5f0ea' }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(245,240,234,0.38)' }}>{r.skin}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: '#f53d1c' }}>
        {/* Geometric accent — big circle top-right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.08)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            Ready?
          </motion.p>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
            <SplitReveal text="Your glow era starts now." />
          </h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-lg mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join 92,000+ Pakistanis who stopped guessing and started glowing.
          </motion.p>
          <motion.button onClick={() => setPage('routine')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            whileHover={{ scale: 1.06, y: -4 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-sm"
            style={{ background: '#0e0c0a', color: 'white' }}>
            <Sparkles size={16} /> Build My Routine — It's Free
          </motion.button>
        </div>
      </section>
    </div>
  )
}
