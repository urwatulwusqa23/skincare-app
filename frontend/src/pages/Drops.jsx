import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Flame, Clock, Bell, BellOff, TrendingUp, Zap } from 'lucide-react'
import { useStore } from '../store'
import { useCounter } from '../hooks/useCounter'
import Marquee from '../components/Marquee'

const DROPS = [
  { id:1, name:'La Mer Regenerating Serum', brand:'La Mer',         category:'Serum',       skinTypes:['dry','sensitive','mature'], price:'$385', originalPrice:'$480', discount:20, image:'💎', color:'#88b8c0', status:'live',    endsIn:7200,  stock:12, totalStock:50,  hot:true,  desc:'Miracle Broth™ for transformative hydration.' },
  { id:2, name:"Paula's Choice BHA 2%",     brand:"Paula's Choice", category:'Exfoliant',   skinTypes:['oily','acne','combo'],      price:'$34',  originalPrice:'$34',  discount:0,  image:'🧪', color:'#d4836a', status:'restock', endsIn:null,  stock:89, totalStock:100, hot:true,  desc:'The cult BHA that unclogs pores. Just restocked!' },
  { id:3, name:'Tatcha Silk Peony Eye',     brand:'Tatcha',         category:'Eye Care',    skinTypes:['all'],                      price:'$72',  originalPrice:'$90',  discount:20, image:'🌸', color:'#c8a8d0', status:'live',    endsIn:3600,  stock:4,  totalStock:20,  hot:false, desc:'Japanese silk + peony for bright eyes.' },
  { id:4, name:'Summer Fridays Jet Lag',    brand:'Summer Fridays', category:'Mask',        skinTypes:['dry','normal','sensitive'], price:'$55',  originalPrice:'$55',  discount:0,  image:'✈️', color:'#d4c070', status:'coming',  endsIn:86400, stock:0,  totalStock:200, hot:false, desc:'The overnight mask that fixes your skin.' },
  { id:5, name:'Drunk Elephant Protini',    brand:'Drunk Elephant', category:'Moisturiser', skinTypes:['all'],                      price:'$68',  originalPrice:'$68',  discount:0,  image:'🐘', color:'#b5c9b8', status:'restock', endsIn:null,  stock:45, totalStock:100, hot:true,  desc:'Signal peptides + amino acids for firming.' },
  { id:6, name:'Glow Recipe Watermelon',    brand:'Glow Recipe',    category:'Toner',       skinTypes:['oily','combo','sensitive'], price:'$38',  originalPrice:'$48',  discount:21, image:'🍉', color:'#e8a598', status:'live',    endsIn:14400, stock:23, totalStock:80,  hot:false, desc:'Watermelon + AHAs for glassy skin.' },
]

function Countdown({ seconds }) {
  const [rem, setRem] = useState(seconds)
  useEffect(() => {
    if (!seconds) return
    const t = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [seconds])
  if (!rem) return null
  const h = Math.floor(rem / 3600), m = Math.floor((rem % 3600) / 60), s = rem % 60
  return (
    <div className="flex items-center gap-0.5">
      {[h, m, s].map((v, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <motion.span key={v} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="countdown-digit">
            {String(v).padStart(2, '0')}
          </motion.span>
          {i < 2 && <span className="text-stone text-[10px] mx-0.5">:</span>}
        </span>
      ))}
    </div>
  )
}

function DropCard({ drop, i }) {
  const [wishlisted, setWishlisted] = useState(false)
  const cardRef = useRef()
  const { addAlert } = useStore()
  const stockPct = drop.totalStock > 0 ? (drop.stock / drop.totalStock) * 100 : 0

  const onMove = (e) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    cardRef.current.style.transform = `perspective(900px) rotateX(${(y - 50) / 10}deg) rotateY(${(x - 50) / -10}deg) translateZ(10px)`
    const shine = cardRef.current.querySelector('.card-shine')
    if (shine) { shine.style.setProperty('--x', `${x}%`); shine.style.setProperty('--y', `${y}%`) }
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (i % 3) * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative tilt-card bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-shadow"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="card-shine rounded-3xl" />

      {/* Top accent line */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${drop.color}80, transparent)` }} />

      <div className="absolute top-5 left-5 z-10 flex gap-1.5">
        {drop.hot && (
          <motion.span animate={{ scale: [1,1.06,1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: '#d4836a' }}>
            <Flame size={9} /> Hot
          </motion.span>
        )}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          drop.status==='live'    ? 'text-sage-dark bg-sage-light' :
          drop.status==='restock' ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'
        }`}>
          {drop.status==='live' ? '● Live' : drop.status==='restock' ? '↑ Back' : '○ Soon'}
        </span>
      </div>

      <motion.button
        onClick={() => { setWishlisted(!wishlisted); if (!wishlisted) addAlert({ type:'match', title:'Wishlisted!', body:`We'll alert you about ${drop.name}.` }) }}
        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
        className="absolute top-5 right-5 z-10 w-8 h-8 rounded-xl bg-white border border-cream-300 flex items-center justify-center shadow-card"
      >
        <AnimatePresence mode="wait">
          {wishlisted
            ? <motion.div key="on"  initial={{ scale:0 }} animate={{ scale:1 }}><Bell    size={13} className="text-blush-dark" /></motion.div>
            : <motion.div key="off" initial={{ scale:0 }} animate={{ scale:1 }}><BellOff size={13} className="text-stone" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Image */}
      <div className="h-44 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${drop.color}15, ${drop.color}05)` }}>
        <motion.div
          animate={{ y: [0,-14,0], rotate: [0,3,-3,0] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl"
          style={{ filter: `drop-shadow(0 16px 32px ${drop.color}55)` }}
        >
          {drop.image}
        </motion.div>
        {drop.discount > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white"
            style={{ background: drop.color }}>-{drop.discount}%</div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold text-stone mb-1">{drop.brand}</p>
        <h3 className="font-display font-bold text-stone-dark text-lg leading-snug mb-1.5">{drop.name}</h3>
        <p className="text-xs text-stone leading-relaxed mb-4">{drop.desc}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {drop.skinTypes.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-cream text-stone font-medium border border-cream-300">{t}</span>
          ))}
        </div>

        {drop.stock > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-stone mb-1.5">
              <span>{drop.stock} left</span>
              <span style={{ color: stockPct < 30 ? '#d4836a' : '#7a9e80' }}>{Math.round(stockPct)}% remaining</span>
            </div>
            <div className="h-1.5 bg-cream-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stockPct}%` }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 + 0.5, duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full glow-bar"
                style={{ background: stockPct < 30 ? '#d4836a' : drop.color }}
              />
            </div>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-stone-dark">{drop.price}</span>
              {drop.originalPrice !== drop.price && (
                <span className="text-sm text-stone line-through">{drop.originalPrice}</span>
              )}
            </div>
            {drop.endsIn && (
              <div className="flex items-center gap-1 mt-1">
                <Clock size={9} className="text-stone" />
                <Countdown seconds={drop.endsIn} />
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-blush"
            style={{ background: `linear-gradient(135deg, ${drop.color}, ${drop.color}bb)` }}
          >
            {drop.status === 'coming' ? 'Notify Me' : 'Shop Now'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Drops() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? DROPS : DROPS.filter(d => d.status === filter)
  const { count: dropCount, ref: countRef } = useCounter(142)

  const headerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <div className="bg-cream">
      {/* Parallax header */}
      <div ref={headerRef} className="relative overflow-hidden pt-32 pb-20 px-6"
        style={{ background: 'linear-gradient(135deg, #2a1f1a 0%, #3d2a22 100%)' }}>
        <motion.div style={{ y: headerY }} className="absolute inset-0 opacity-20">
          <div className="orb w-96 h-96 bg-blush-dark top-0 right-0" style={{ '--dur':'8s' }} />
          <div className="orb w-72 h-72 bg-sage top-10 left-10"    style={{ '--dur':'11s','--del':'3s' }} />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color:'#e8a598' }}>
              Personalised for you
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4" style={{ color:'#fdf8f4' }}>
              Product Drops
            </h1>
            <div className="flex items-center gap-3">
              <div ref={countRef} className="font-display text-3xl font-bold" style={{ color:'#e8a598' }}>
                {dropCount}
              </div>
              <p style={{ color:'rgba(253,248,244,0.55)' }} className="text-sm">
                drops this week matched to oily + acne-prone skin
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Marquee />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter bar */}
        <div className="flex gap-2 mb-10 flex-wrap items-center">
          {[['all','✦ All'],['live','● Live'],['restock','↑ Restocked'],['coming','○ Coming']].map(([f, l]) => (
            <motion.button key={f} onClick={() => setFilter(f)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: filter===f ? '#fde8df' : 'white',
                color:      filter===f ? '#b85c42' : '#8a7870',
                border:     `1px solid ${filter===f ? '#f2c4b0' : '#e8d8c8'}`,
                boxShadow:  filter===f ? '0 2px 8px rgba(212,131,106,0.18)' : 'none',
              }}>{l}</motion.button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-stone">
            <TrendingUp size={12} className="text-sage-dark" />
            {filtered.length} of {DROPS.length} match your profile
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((d, i) => <DropCard key={d.id} drop={d} i={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
