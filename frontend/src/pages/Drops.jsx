import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Flame, Clock, Bell, BellOff, TrendingUp } from 'lucide-react'
import { useStore } from '../store'
import { useCounter } from '../hooks/useCounter'

const BG     = '#0e0c0a'
const CARD   = '#1e1a16'
const BORDER = 'rgba(245,240,234,0.08)'
const TEXT   = '#f5f0ea'
const DIM    = 'rgba(245,240,234,0.45)'
const MUTED  = 'rgba(245,240,234,0.28)'
const TRACK  = 'rgba(245,240,234,0.08)'

const DROPS = [
  { id:1, name:'Saeed Ghani Rose Glow Serum',          brand:'Saeed Ghani',    category:'Serum',       skinTypes:['dry','sensitive','dull'],   price:'Rs. 850',  originalPrice:'Rs. 1,200', discount:29, image:'🌹', color:'#7c3aed', status:'live',    endsIn:7200,  stock:18, totalStock:60,  hot:true,  desc:'Pure rose extract + hyaluronic acid for deep hydration and natural glow.' },
  { id:2, name:'Iba Halal Care SPF 50+ Sunscreen',     brand:'Iba Halal Care', category:'Sunscreen',   skinTypes:['all'],                      price:'Rs. 620',  originalPrice:'Rs. 620',   discount:0,  image:'☀️', color:'#00a877', status:'restock', endsIn:null,  stock:74, totalStock:100, hot:true,  desc:"Pakistan's #1 halal-certified SPF 50+. Just restocked after a 3-week sellout!" },
  { id:3, name:'Hemani Vitamin C Brightening Serum',   brand:'Hemani',         category:'Serum',       skinTypes:['dull','combo','hyperpig'],  price:'Rs. 540',  originalPrice:'Rs. 675',   discount:20, image:'🍊', color:'#f59e0b', status:'live',    endsIn:3600,  stock:5,  totalStock:25,  hot:false, desc:'Stabilised Vitamin C + Kojic acid targets dark spots and uneven skin tone.' },
  { id:4, name:'Rivaj UK Salicylic Acid Face Wash',    brand:'Rivaj UK',       category:'Cleanser',    skinTypes:['oily','acne','combo'],       price:'Rs. 480',  originalPrice:'Rs. 480',   discount:0,  image:'🧴', color:'#f53d1c', status:'coming',  endsIn:86400, stock:0,  totalStock:150, hot:false, desc:'2% Salicylic acid cleanser — deep-cleans pores without stripping moisture.' },
  { id:5, name:'Derma Shine Hyaluronic Moisture Boost',brand:'Derma Shine',    category:'Moisturiser', skinTypes:['dry','normal','sensitive'], price:'Rs. 720',  originalPrice:'Rs. 720',   discount:0,  image:'💧', color:'#0ea5e9', status:'restock', endsIn:null,  stock:38, totalStock:80,  hot:true,  desc:'Hyaluronic acid + Vitamin E for plump, bouncy skin in the Pakistani heat.' },
  { id:6, name:'Hemani Black Seed Anti-Aging Cream',   brand:'Hemani',         category:'Moisturiser', skinTypes:['all','mature'],              price:'Rs. 395',  originalPrice:'Rs. 500',   discount:21, image:'🌿', color:'#00a877', status:'live',    endsIn:14400, stock:29, totalStock:70,  hot:false, desc:'Kalonji oil + collagen peptides — traditional healing in a modern formula.' },
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
          <motion.span key={v} initial={{ y:-4, opacity:0 }} animate={{ y:0, opacity:1 }} className="countdown-digit">
            {String(v).padStart(2,'0')}
          </motion.span>
          {i < 2 && <span className="text-[10px] mx-0.5" style={{ color: MUTED }}>:</span>}
        </span>
      ))}
    </div>
  )
}

function DropCard({ drop, i }) {
  const [wishlisted, setWishlisted] = useState(false)
  const { addAlert } = useStore()
  const stockPct = drop.totalStock > 0 ? (drop.stock / drop.totalStock) * 100 : 0

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22,1,0.36,1] }}
      whileHover={{ y:-4 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}>

      <div className="h-1 w-full" style={{ background: drop.color }} />

      <div className="absolute top-5 left-5 z-10 flex gap-1.5">
        {drop.hot && (
          <motion.span animate={{ scale:[1,1.06,1] }} transition={{ repeat:Infinity, duration:2 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
            style={{ background:'#f53d1c' }}>
            <Flame size={9} /> Hot
          </motion.span>
        )}
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
          style={{ background: drop.status==='live' ? '#00a877' : drop.status==='restock' ? '#7c3aed' : '#3a2e26' }}>
          {drop.status==='live' ? '● Live' : drop.status==='restock' ? '↑ Back' : '○ Soon'}
        </span>
      </div>

      <motion.button
        onClick={() => { setWishlisted(!wishlisted); if (!wishlisted) addAlert({ type:'match', title:'Wishlisted!', body:`We'll alert you about ${drop.name}.` }) }}
        whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
        className="absolute top-5 right-5 z-10 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background:'rgba(245,240,234,0.06)', border:`1px solid ${BORDER}` }}>
        <AnimatePresence mode="wait">
          {wishlisted
            ? <motion.div key="on"  initial={{ scale:0 }} animate={{ scale:1 }}><Bell    size={13} style={{ color:'#f53d1c' }} /></motion.div>
            : <motion.div key="off" initial={{ scale:0 }} animate={{ scale:1 }}><BellOff size={13} style={{ color: DIM }} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <div className="h-44 flex items-center justify-center overflow-hidden relative"
        style={{ background:`${drop.color}15` }}>
        <motion.div
          animate={{ y:[0,-12,0], rotate:[0,3,-3,0] }}
          transition={{ duration:4+i*0.3, repeat:Infinity, ease:'easeInOut' }}
          className="text-8xl"
          style={{ filter:`drop-shadow(0 16px 32px ${drop.color}55)` }}>
          {drop.image}
        </motion.div>
        {drop.discount > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white"
            style={{ background: drop.color }}>-{drop.discount}%</div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold mb-1" style={{ color: MUTED }}>{drop.brand}</p>
        <h3 className="font-display font-bold text-lg leading-snug mb-1.5" style={{ color: TEXT }}>{drop.name}</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: DIM }}>{drop.desc}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {drop.skinTypes.map(t => (
            <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
              style={{ background:`${drop.color}18`, color: drop.color, border:`1px solid ${drop.color}30` }}>{t}</span>
          ))}
        </div>

        {drop.stock > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1.5" style={{ color: MUTED }}>
              <span>{drop.stock} left</span>
              <span style={{ color: stockPct < 30 ? '#f53d1c' : '#00a877' }}>{Math.round(stockPct)}% remaining</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: TRACK }}>
              <motion.div
                initial={{ width:0 }} animate={{ width:`${stockPct}%` }}
                transition={{ delay:i*0.04+0.2, duration:0.5 }}
                className="h-full rounded-full glow-bar" style={{ background: stockPct < 30 ? '#f53d1c' : drop.color }} />
            </div>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold" style={{ color: TEXT }}>{drop.price}</span>
              {drop.originalPrice !== drop.price && (
                <span className="text-sm line-through" style={{ color: MUTED }}>{drop.originalPrice}</span>
              )}
            </div>
            {drop.endsIn && (
              <div className="flex items-center gap-1 mt-1">
                <Clock size={9} style={{ color: MUTED }} />
                <Countdown seconds={drop.endsIn} />
              </div>
            )}
          </div>
          <motion.button whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.95 }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: drop.status==='coming' ? '#3a2e26' : drop.color }}>
            {drop.status==='coming' ? 'Notify Me' : 'Shop Now'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Drops() {
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all' ? DROPS : DROPS.filter(d => d.status===filter)
  const { count: dropCount, ref: countRef } = useCounter(58)

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
          className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-10 rounded-full" style={{ background:'#f53d1c' }} />
              <h1 className="font-display text-5xl font-bold" style={{ color: TEXT }}>Product Drops</h1>
            </div>
            <p className="text-base ml-4" style={{ color: DIM }}>Pakistani brands · Limited drops · Matched to your skin.</p>
          </div>
          <div className="flex items-center gap-3">
            <div ref={countRef} className="font-display text-4xl font-bold" style={{ color:'#f53d1c' }}>{dropCount}</div>
            <div>
              <p className="text-xs font-bold" style={{ color: TEXT }}>drops this week</p>
              <p className="text-[11px]" style={{ color: DIM }}>matched to your profile</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.08 }}
          className="flex gap-2 mb-10 flex-wrap items-center">
          {[['all','✦ All'],['live','● Live'],['restock','↑ Restocked'],['coming','○ Coming']].map(([f,l]) => (
            <motion.button key={f} onClick={() => setFilter(f)}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: filter===f ? '#f53d1c' : 'rgba(245,240,234,0.05)',
                color:      filter===f ? 'white'   : DIM,
                border:     `1px solid ${filter===f ? '#f53d1c' : BORDER}`,
              }}>{l}</motion.button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: DIM }}>
            <TrendingUp size={12} style={{ color:'#00a877' }} />
            {filtered.length} of {DROPS.length} match your profile
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((d,i) => <DropCard key={d.id} drop={d} i={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
