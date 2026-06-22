import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { ArrowRight, Sparkles, Droplets, Star, Shield, Bell, CheckCircle } from 'lucide-react'
import { useStore } from '../store'
import { useCounter } from '../hooks/useCounter'
import Marquee from '../components/Marquee'

const Scene3D = lazy(() => import('../components/Scene3D'))

/* ─── Animated counter ─────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }) {
  const { count, ref } = useCounter(to)
  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-bold text-stone-dark tabular-nums">
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
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.07 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ─── Scrollytelling step panel ────────────────────── */
const STORY_STEPS = [
  {
    icon: '🧴',
    label: 'Step 01',
    title: 'You build a routine',
    desc: 'Add products to your AM or PM routine. GlowOS checks every ingredient combination in real-time.',
    visual: (
      <div className="space-y-2">
        {['CeraVe Cleanser', 'Niacinamide Serum', 'SPF 50'].map((p, i) => (
          <motion.div key={p}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.18 }}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card"
          >
            <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-sm">{['🧴','✨','☀️'][i]}</div>
            <span className="text-sm font-medium text-stone-dark">{p}</span>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.18 + 0.4 }}
              className="ml-auto w-5 h-5 rounded-full bg-sage-light flex items-center justify-center">
              <CheckCircle size={12} className="text-sage-dark" />
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
        className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm mb-1">Conflict detected</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Retinol + Glycolic Acid — using these together causes over-exfoliation. Move one to alternate nights.
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-200 text-amber-800 font-medium">Fix automatically</button>
          <button className="text-[11px] px-3 py-1.5 rounded-lg bg-white text-amber-700 font-medium border border-amber-200">Learn why</button>
        </div>
      </motion.div>
    ),
  },
  {
    icon: '📦',
    label: 'Step 03',
    title: 'Drops match your skin',
    desc: 'A brand restocks. Within seconds, users with matching skin profiles get a personalised alert. No irrelevant noise.',
    visual: (
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl p-4 shadow-card border border-cream-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blush-light flex items-center justify-center text-xl">📦</div>
          <div>
            <p className="text-xs font-bold text-stone-dark">New Drop for you</p>
            <p className="text-[11px] text-stone">Matched to oily + acne skin</p>
          </div>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: 3, duration: 0.5 }}
            className="ml-auto w-2 h-2 rounded-full bg-blush-dark" />
        </div>
        <p className="text-xs text-stone-dark font-semibold">Paula's Choice BHA 2% — Back in stock</p>
        <p className="text-[11px] text-stone mt-1">Your skin type: ✓ oily ✓ pores ✓ acne</p>
        <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #d4836a, #b85c42)' }}>Shop now — $34</button>
      </motion.div>
    ),
  },
  {
    icon: '📈',
    label: 'Step 04',
    title: 'Watch your glow build',
    desc: 'Log your skin monthly. The data reveals what\'s actually moving the needle — and what\'s not.',
    visual: (
      <div>
        <svg viewBox="0 0 260 100" className="w-full">
          <defs>
            <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4836a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d4836a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14" fill="none" stroke="#e8d8c8" strokeWidth="1.5" />
          <motion.path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14"
            fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
          <motion.path d="M 10,80 L 60,68 L 110,52 L 160,38 L 210,22 L 250,14 L 250,90 L 10,90 Z"
            fill="url(#glow-grad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
          {[['Jan',10,80],['Feb',60,68],['Mar',110,52],['Apr',160,38],['May',210,22],['Jun',250,14]].map(([m,x,y], i) => (
            <motion.circle key={m} cx={x} cy={y} r="4" fill="#d4836a" stroke="white" strokeWidth="1.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.18 + 0.4 }} />
          ))}
          {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
            <text key={m} x={[10,60,110,160,210,250][i]} y="98" textAnchor="middle" fontSize="7" fill="#c4b4ac">{m}</text>
          ))}
        </svg>
        <p className="text-xs text-sage-dark font-semibold text-center mt-2">↑ 90% skin improvement in 6 months</p>
      </div>
    ),
  },
]

/* ─── Sticky scrollytelling section ───────────────── */
function Scrollytelling() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      setActiveStep(Math.min(STORY_STEPS.length - 1, Math.floor(v * STORY_STEPS.length)))
    })
  }, [scrollYProgress])

  const step = STORY_STEPS[activeStep]

  return (
    <section ref={containerRef} style={{ height: `${STORY_STEPS.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — changes */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStep}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -32 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#e8a598' }}>
                  {step.label}
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-dark leading-tight mb-5">
                  {step.title}
                </h2>
                <p className="text-stone text-lg leading-relaxed max-w-sm">
                  {step.desc}
                </p>

                {/* Step dots */}
                <div className="flex gap-2 mt-10">
                  {STORY_STEPS.map((_, i) => (
                    <motion.div key={i}
                      animate={{ width: i === activeStep ? 28 : 8, background: i === activeStep ? '#d4836a' : '#e8d8c8' }}
                      transition={{ duration: 0.3 }}
                      className="h-2 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — visual panel */}
          <AnimatePresence mode="wait">
            <motion.div key={activeStep}
              initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.96, rotate: -1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 shadow-soft border border-cream-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{step.icon}</span>
                <div className="flex gap-1">
                  {['#f5d5ce','#fde8df','#f0ddd0'].map(c => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>
              {step.visual}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─────────────────────────────────── */
const REVIEWS = [
  { name:'Anya R.',   skin:'Dry + Sensitive', text:'I\'ve tried so many serums. GlowOS was the first thing that actually told me WHY they weren\'t working together.', stars:5, avatar:'👩🏻' },
  { name:'Priya M.',  skin:'Oily + Acne',     text:'The drop alerts are insane. Got notified about a BHA restock, checked out in 3 minutes. Never miss anything now.', stars:5, avatar:'👩🏾' },
  { name:'Claire S.', skin:'Combo',            text:'My skin in January vs June is unrecognisable. Having the tracker made me actually commit to a routine.', stars:5, avatar:'👩🏼' },
]

/* ─── Main page ────────────────────────────────────── */
export default function Home() {
  const setPage = useStore(s => s.setPage)
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(heroScroll, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0])

  return (
    <div className="bg-cream overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* 3D scene parallaxes up as you scroll */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </motion.div>

        {/* Soft gradient over scene so text pops */}
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(253,248,244,0.92) 40%, rgba(253,248,244,0.2) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10"
            style={{ background: 'rgba(242,196,176,0.35)', border: '1px solid rgba(212,131,106,0.3)' }}
          >
            <Sparkles size={11} className="text-blush-dark" />
            <span className="text-xs font-semibold text-stone tracking-wide">Skincare, finally intelligent</span>
          </motion.div>

          {/* Headline — each word slides up */}
          <h1 className="font-display font-bold leading-[1.05] mb-8">
            <div className="text-5xl md:text-7xl lg:text-8xl text-stone-dark">
              <SplitReveal text="Your skin." delay={0.15} />
            </div>
            <div className="text-5xl md:text-7xl lg:text-8xl" style={{
              background: 'linear-gradient(135deg, #c46f63, #d4836a 40%, #b5c9b8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              <SplitReveal text="Smarter." delay={0.3} />
            </div>
            <div className="text-5xl md:text-7xl lg:text-8xl text-stone-dark">
              <SplitReveal text="Glowier." delay={0.45} />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
            className="text-stone text-xl leading-relaxed max-w-md mb-12"
          >
            Build routines that actually work. Get personalised drop alerts. Track your glow — month by month.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button onClick={() => setPage('routine')}
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-sm shadow-blush"
              style={{ background: 'linear-gradient(135deg, #d4836a, #b85c42)' }}
            >
              Start My Routine <ArrowRight size={15} />
            </motion.button>
            <motion.button onClick={() => setPage('drops')}
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm bg-white text-stone-dark shadow-card border border-cream-300"
            >
              View Drops
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] font-semibold tracking-widest uppercase text-stone">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-5 h-8 rounded-full border-2 border-sand-dark flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-stone" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <Marquee />

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream-300 rounded-3xl overflow-hidden">
            {[
              { to: 2400000, suffix: '+', label: 'Products tracked', sub: 'across 180 brands',       icon: <Droplets size={20} className="text-blush-dark" /> },
              { to: 890000,  suffix: '+', label: 'Active routines',  sub: 'built this month',          icon: <Star     size={20} className="text-sage-dark"   /> },
              { to: 142,     suffix: '',  label: 'Drops this week',  sub: 'matched to skin profiles',  icon: <Bell     size={20} className="text-peach-dark"  /> },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="bg-white p-10 md:p-14 flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-cream flex items-center justify-center">{s.icon}</div>
                <Counter to={s.to} suffix={s.suffix} />
                <div>
                  <p className="font-semibold text-stone-dark">{s.label}</p>
                  <p className="text-sm text-stone mt-0.5">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLLYTELLING ───────────────────────────── */}
      <div className="bg-cream">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="text-xs font-bold tracking-widest uppercase text-stone mb-4">How it works</motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-dark max-w-lg leading-tight">
            <SplitReveal text="Four steps to your best skin." />
          </h2>
        </div>
        <Scrollytelling />
      </div>

      {/* ── MARQUEE 2 ────────────────────────────────── */}
      <Marquee reverse accent />

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-xs font-bold tracking-widest uppercase text-stone mb-3">Real results</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-dark">
              Skin that speaks for itself.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity:0, y:32 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }}
                transition={{ delay: i*0.12, duration:0.55 }}
                whileHover={{ y:-6 }}
                className="bg-cream rounded-3xl p-8 border border-cream-300 shadow-card hover:shadow-soft transition-shadow"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <motion.span key={j} initial={{ scale:0 }} whileInView={{ scale:1 }}
                      viewport={{ once:true }} transition={{ delay: i*0.12 + j*0.07 }}
                      className="text-base">⭐</motion.span>
                  ))}
                </div>
                <p className="text-stone-dark text-sm leading-relaxed mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-card">{r.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-stone-dark">{r.name}</p>
                    <p className="text-[11px] text-stone">{r.skin}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: '#2a1f1a' }}>
        {/* Soft warm orbs */}
        <div className="orb w-96 h-96 top-0 -right-20 opacity-30" style={{ background:'#d4836a', '--dur':'10s' }} />
        <div className="orb w-80 h-80 bottom-0 -left-20 opacity-20" style={{ background:'#b5c9b8', '--dur':'13s','--del':'2s' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color:'#e8a598' }}>
            Ready?
          </motion.p>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-8" style={{ color:'#fdf8f4' }}>
            <SplitReveal text="Your glow era starts now." />
          </h2>
          <motion.p initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-lg mb-12 leading-relaxed" style={{ color:'rgba(253,248,244,0.6)' }}>
            Join 890,000+ people who stopped guessing and started glowing.
          </motion.p>
          <motion.button onClick={() => setPage('routine')}
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            whileHover={{ scale:1.06, y:-4 }} whileTap={{ scale:0.97 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-sm shadow-blush"
            style={{ background:'linear-gradient(135deg,#d4836a,#b85c42)', color:'white' }}
          >
            <Sparkles size={16} /> Build My Routine — It's Free
          </motion.button>
        </div>
      </section>
    </div>
  )
}
