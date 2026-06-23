import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Crown, Flame } from 'lucide-react'
import { useState } from 'react'

const BG     = '#0e0c0a'
const CARD   = '#1e1a16'
const BORDER = 'rgba(245,240,234,0.08)'
const TEXT   = '#f5f0ea'
const DIM    = 'rgba(245,240,234,0.45)'
const MUTED  = 'rgba(245,240,234,0.28)'
const TRACK  = 'rgba(245,240,234,0.08)'

const ROUTINES = [
  { id:1, user:'Ayesha K.',  avatar:'👩🏻', skinType:'Dry + Sensitive',           glow:92,
    routine:['Saeed Ghani Rose Cleanser','Hemani Vitamin C','Iba SPF 40','Aloe Vera Gel'],
    tags:['#khaalskin','#naturalcare','#halalglow'],   likes:1204, comments:87, verified:true,
    badge:'🏆 Top Routine', accent:'#f53d1c' },
  { id:2, user:'Fatima R.',  avatar:'👩🏽', skinType:'Oily + Acne-Prone',         glow:88,
    routine:['Rivaj UK Salicylic Wash','Derma Shine Niacinamide','Aloe Vera Gel','Iba SPF 50+'],
    tags:['#acnefree','#niacinamide','#glow'],          likes:892,  comments:64, verified:false,
    badge:'🔥 Trending', accent:'#7c3aed' },
  { id:3, user:'Zainab M.',  avatar:'👩🏾', skinType:'Combo + Hyperpigmentation',  glow:85,
    routine:['Saeed Ghani Neem Wash','Hemani Vit C Serum','Derma Shine Kojic','Iba SPF 50+'],
    tags:['#brightenskin','#vitaminC','#desiglowup'],   likes:741,  comments:52, verified:true,
    badge:null, accent:'#00a877' },
  { id:4, user:'Amna T.',    avatar:'👩🏼', skinType:'Mature + Sun-Damaged',      glow:91,
    routine:['Rivaj Micellar Water','Hemani Black Seed Cream','Rivaj Retinol Night','Iba SPF 40'],
    tags:['#antiaging','#retinol','#sunsafety'],         likes:968,  comments:73, verified:true,
    badge:'✨ Staff Pick', accent:'#0ea5e9' },
]

const TRENDING = [
  { name:'Niacinamide',     usage:91, trend:'+15%', color:'#f53d1c' },
  { name:'SPF / Sunscreen', usage:85, trend:'+28%', color:'#00a877' },
  { name:'Vitamin C',       usage:78, trend:'+11%', color:'#f59e0b' },
  { name:'Kojic Acid',      usage:69, trend:'+35%', color:'#7c3aed' },
  { name:'Retinol',         usage:52, trend:'+22%', color:'#0ea5e9' },
]

function RoutineCard({ r, i }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(r.likes)

  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04, duration:0.35 }}
      whileHover={{ y:-4 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: CARD, border:`1px solid ${BORDER}` }}>

      <div className="h-1 w-full" style={{ background: r.accent }} />

      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate:8, scale:1.08 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background:`${r.accent}18`, border:`1px solid ${r.accent}35` }}>
              {r.avatar}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold" style={{ color: TEXT }}>{r.user}</span>
                {r.verified && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ background: r.accent }}>✓</div>
                )}
              </div>
              <span className="text-[11px]" style={{ color: MUTED }}>{r.skinType}</span>
            </div>
          </div>
          {r.badge && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background:`${r.accent}18`, color: r.accent }}>
              {r.badge}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px]" style={{ color: MUTED }}>Glow Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: TRACK }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${r.glow}%` }}
                transition={{ delay:i*0.04+0.2, duration:0.5 }}
                className="h-full rounded-full glow-bar" style={{ background: r.accent }} />
            </div>
            <span className="text-sm font-bold" style={{ color: r.accent }}>{r.glow}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {r.routine.map((step,j) => (
            <span key={step} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{ background:'rgba(245,240,234,0.06)', color: DIM, border:`1px solid ${BORDER}` }}>
              {j+1}. {step}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {r.tags.map(t => (
            <span key={t} className="text-[10px] font-bold" style={{ color: r.accent }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 flex items-center gap-4"
        style={{ borderTop:`1px solid ${BORDER}`, background:'rgba(245,240,234,0.03)' }}>
        <motion.button onClick={() => { setLiked(!liked); setLikes(l => liked ? l-1 : l+1) }}
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.85 }}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: liked ? '#f53d1c' : MUTED }}>
          <motion.div animate={liked ? { scale:[1,1.4,1] } : {}} transition={{ duration:0.3 }}>
            <Heart size={13} fill={liked?'#f53d1c':'none'}/>
          </motion.div>
          {likes.toLocaleString()}
        </motion.button>
        <button className="flex items-center gap-1.5 text-xs font-medium" style={{ color: MUTED }}>
          <MessageCircle size={13}/> {r.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium ml-auto" style={{ color: MUTED }}>
          <Share2 size={13}/> Share
        </button>
      </div>
    </motion.div>
  )
}

export default function Community() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 rounded-full" style={{ background:'#7c3aed' }} />
            <h1 className="font-display text-5xl font-bold" style={{ color: TEXT }}>Community</h1>
          </div>
          <p className="text-base ml-4" style={{ color: DIM }}>Pakistani routines, real results — sorted by glow score.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROUTINES.map((r,i) => <RoutineCard key={r.id} r={r} i={i} />)}
          </div>

          <div className="space-y-5">

            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1, duration:0.35 }}
              className="rounded-2xl p-6" style={{ background: CARD, border:`1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2 mb-5">
                <Flame size={15} style={{ color:'#f53d1c' }} />
                <h3 className="font-display font-bold" style={{ color: TEXT }}>Trending in Pakistan</h3>
              </div>
              <div className="space-y-4">
                {TRENDING.map((ing,i) => (
                  <motion.div key={ing.name}
                    initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15+i*0.04 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: TEXT }}>{ing.name}</span>
                      <span className="text-[11px] font-bold" style={{ color:'#00a877' }}>{ing.trend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: TRACK }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${ing.usage}%` }}
                          transition={{ delay:0.2+i*0.04, duration:0.5 }}
                          className="h-full rounded-full glow-bar" style={{ background: ing.color }} />
                      </div>
                      <span className="text-[10px] w-7 font-medium" style={{ color: MUTED }}>{ing.usage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15, duration:0.35 }}
              className="rounded-2xl p-6" style={{ background: CARD, border:`1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2 mb-5">
                <Crown size={15} style={{ color:'#f59e0b' }} />
                <h3 className="font-display font-bold" style={{ color: TEXT }}>Glow Leaderboard</h3>
              </div>
              <div className="space-y-2">
                {[...ROUTINES].sort((a,b) => b.glow-a.glow).map((r,i) => (
                  <motion.div key={r.id}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2+i*0.04 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: i===0 ? `${r.accent}12` : 'transparent' }}>
                    <span className="text-sm w-5 font-bold">
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':<span style={{ color: MUTED }}>{i+1}.</span>}
                    </span>
                    <span className="text-xl">{r.avatar}</span>
                    <span className="text-sm flex-1" style={{ color: DIM }}>{r.user}</span>
                    <span className="text-sm font-bold" style={{ color: r.accent }}>{r.glow}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
