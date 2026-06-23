import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Flame, Clock, Bell, BellOff, TrendingUp } from 'lucide-react'
import { useStore } from '../store'
import { useCounter } from '../hooks/useCounter'
import Marquee from '../components/Marquee'

const DROPS = [
  { id:1, name:'La Mer Regenerating Serum', brand:'La Mer',         category:'Serum',       skinTypes:['dry','sensitive','mature'], price:'$385', originalPrice:'$480', discount:20, image:'💎', color:'#7c3aed', status:'live',    endsIn:7200,  stock:12, totalStock:50,  hot:true,  desc:'Miracle Broth™ for transformative hydration.' },
  { id:2, name:"Paula's Choice BHA 2%",     brand:"Paula's Choice", category:'Exfoliant',   skinTypes:['oily','acne','combo'],      price:'$34',  originalPrice:'$34',  discount:0,  image:'🧪', color:'#f53d1c', status:'restock', endsIn:null,  stock:89, totalStock:100, hot:true,  desc:'The cult BHA that unclogs pores. Just restocked!' },
  { id:3, name:'Tatcha Silk Peony Eye',     brand:'Tatcha',         category:'Eye Care',    skinTypes:['all'],                      price:'$72',  originalPrice:'$90',  discount:20, image:'🌸', color:'#f59e0b', status:'live',    endsIn:3600,  stock:4,  totalStock:20,  hot:false, desc:'Japanese silk + peony for bright eyes.' },
  { id:4, name:'Summer Fridays Jet Lag',    brand:'Summer Fridays', category:'Mask',        skinTypes:['dry','normal','sensitive'], price:'$55',  originalPrice:'$55',  discount:0,  image:'✈️', color:'#00a877', status:'coming',  endsIn:86400, stock:0,  totalStock:200, hot:false, desc:'The overnight mask that fixes your skin.' },
  { id:5, name:'Drunk Elephant Protini',    brand:'Drunk Elephant', category:'Moisturiser', skinTypes:['all'],                      price:'$68',  originalPrice:'$68',  discount:0,  image:'🐘', color:'#0ea5e9', status:'restock', endsIn:null,  stock:45, totalStock:100, hot:true,  desc:'Signal peptides + amino acids for firming.' },
  { id:6, name:'Glow Recipe Watermelon',    brand:'Glow Recipe',    category:'Toner',       skinTypes:['oily','combo','sensitive'], price:'$38',  originalPrice:'$48',  discount:21, image:'🍉', color:'#f53d1c', status:'live',    endsIn:14400, stock:23, totalStock:80,  hot:false, desc:'Watermelon + AHAs for glassy skin.' },
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
          {i < 2 && <span className="text-[10px] mx-0.5" style={{ color: '#a09080' }}>:</span>}
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
      className="relative tilt-card bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="card-shine rounded-2xl" />

      {/* Top color bar */}
      <div className="h-1 w-full" style={{ background: drop.color }} />

      <div className="absolute top-5 left-5 z-10 flex gap-1.5">
        {drop.hot && (
          <motion.span animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
            style={{ background: '#f53d1c' }}>
            <Flame size={9} /> Hot
          </motion.span>
        )}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          drop.status === 'live'    ? 'text-white' :
          drop.status === 'restock' ? 'text-white' : 'text-white'
        }`}
          style={{
            background: drop.status === 'live' ? '#00a877' : drop.status === 'restock' ? '#7c3aed' : '#6b5e55',
          }}>
          {drop.status === 'live' ? '● Live' : drop.status === 'restock' ? '↑ Back' : '○ Soon'}
        </span>
      </div>

      <motion.button
        onClick={() => { setWishlisted(!wishlisted); if (!wishlisted) addAlert({ type: 'match', title: 'Wishlisted!', body: `We'll alert you about ${drop.name}.` }) }}
        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
        className="absolute top-5 right-5 z-10 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-card"
        style={{ border: '1px solid #dfd3c4' }}>
        <AnimatePresence mode="wait">
          {wishlisted
            ? <motion.div key="on"  initial={{ scale: 0 }} animate={{ scale: 1 }}><Bell    size={13} style={{ color: '#f53d1c' }} /></motion.div>
            : <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }}><BellOff size={13} style={{ color: '#6b5e55' }} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Product image */}
      <div className="h-44 flex items-center justify-center overflow-hidden"
        style={{ background: `${drop.color}0d` }}>
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl"
          style={{ filter: `drop-shadow(0 16px 32px ${drop.color}44)` }}>
          {drop.image}
        </motion.div>
        {drop.discount > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white"
            style={{ background: drop.color }}>-{drop.discount}%</div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold mb-1" style={{ color: '#a09080' }}>{drop.brand}</p>
        <h3 className="font-display font-bold text-lg leading-snug mb-1.5" style={{ color: '#0e0c0a' }}>{drop.name}</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: '#6b5e55' }}>{drop.desc}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {drop.skinTypes.map(t => (
            <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: `${drop.color}0e`, color: drop.color, border: `1px solid ${drop.color}25` }}>{t}</span>
          ))}
        </div>

        {drop.stock > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1.5" style={{ color: '#a09080' }}>
              <span>{drop.stock} left</span>
              <span style={{ color: stockPct < 30 ? '#f53d1c' : '#00a877' }}>{Math.round(stockPct)}% remaining</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#dfd3c4' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stockPct}%` }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 + 0.5, duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full glow-bar"
                style={{ background: stockPct < 30 ? '#f53d1c' : drop.color }}
              />
            </div>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold" style={{ color: '#0e0c0a' }}>{drop.price}</span>
              {drop.originalPrice !== drop.price && (
                <span className="text-sm line-through" style={{ color: '#a09080' }}>{drop.originalPrice}</span>
              )}
            </div>
            {drop.endsIn && (
              <div className="flex items-center gap-1 mt-1">
                <Clock size={9} style={{ color: '#a09080' }} />
                <Countdown seconds={drop.endsIn} />
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 rounded-lg text-xs font-bold text-white"
            style={{ background: drop.status === 'coming' ? '#6b5e55' : drop.color }}>
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
    <div style={{ background: '#f5f0ea' }}>

      {/* Parallax header */}
      <div ref={headerRef} className="relative overflow-hidden pt-36 pb-24 px-6"
        style={{ background: '#0e0c0a' }}>
        <motion.div style={{ y: headerY }} className="absolute inset-0 opacity-100 pointer-events-none">
          {/* Geometric accents */}
          <div className="absolute top-8 right-16 w-64 h-64 rounded-full"
            style={{ border: '1px solid rgba(245,61,28,0.15)', background: 'rgba(245,61,28,0.04)' }} />
          <div className="absolute bottom-4 left-12 w-40 h-40 rounded-full"
            style={{ border: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.04)' }} />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f53d1c' }}>
              Personalised for you
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: '#f5f0ea' }}>
              Product Drops
            </h1>
            <div className="flex items-center gap-3">
              <div ref={countRef} className="font-display text-4xl font-bold" style={{ color: '#f53d1c' }}>
                {dropCount}
              </div>
              <p className="text-sm" style={{ color: 'rgba(245,240,234,0.5)' }}>
                drops this week matched to oily + acne-prone skin
              </p>
            </div>
          </motion.div>
        </div>

        {/* Diagonal clip */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: '#f5f0ea', clipPath: 'polygon(0 100%, 100% 20%, 100% 100%)' }} />
      </div>

      <Marquee />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Filter bar */}
        <div className="flex gap-2 mb-10 flex-wrap items-center">
          {[['all', '✦ All'], ['live', '● Live'], ['restock', '↑ Restocked'], ['coming', '○ Coming']].map(([f, l]) => (
            <motion.button key={f} onClick={() => setFilter(f)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: filter === f ? '#f53d1c' : 'white',
                color:      filter === f ? 'white'   : '#6b5e55',
                border:     `1px solid ${filter === f ? '#f53d1c' : '#dfd3c4'}`,
              }}>{l}</motion.button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#6b5e55' }}>
            <TrendingUp size={12} style={{ color: '#00a877' }} />
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
