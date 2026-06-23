import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Crown, Flame } from 'lucide-react'
import { useState } from 'react'

const ROUTINES = [
  { id:1, user:'Sophia K.', avatar:'👩🏻', skinType:'Dry + Sensitive', glow:92,
    routine:['Gentle Cleanser','Hyaluronic Acid','Vitamin C','Moisturiser','SPF 50'],
    tags:['#glasskin','#kbeauty','#hydration'], likes:847, comments:63, verified:true,
    badge:'🏆 Top Routine', accent:'#0ea5e9' },
  { id:2, user:'Mia L.',    avatar:'👩🏽', skinType:'Oily + Acne',    glow:88,
    routine:['BHA Cleanser','Niacinamide','BHA Toner','Oil-free Moisturiser','SPF'],
    tags:['#acneprone','#bha','#poreminimizing'], likes:612, comments:41, verified:false,
    badge:'🔥 Trending', accent:'#f53d1c' },
  { id:3, user:'Zara M.',   avatar:'👩🏾', skinType:'Combo + Hyperpig', glow:85,
    routine:['Foaming Cleanser','AHA Toner','Vitamin C+E','Niacinamide','SPF 30'],
    tags:['#evenSkin','#vitaminC','#glow'], likes:534, comments:28, verified:true,
    badge:null, accent:'#7c3aed' },
  { id:4, user:'Luna P.',   avatar:'👩🏼', skinType:'Mature + Dry',    glow:91,
    routine:['Cream Cleanser','Retinol 0.3%','Peptide Serum','Rich Moisturiser','Eye Cream'],
    tags:['#antiaging','#retinol','#peptides'], likes:723, comments:55, verified:true,
    badge:'✨ Staff Pick', accent:'#00a877' },
]

const TRENDING = [
  { name:'Niacinamide',     usage:89, trend:'+12%', color:'#f53d1c' },
  { name:'Hyaluronic Acid', usage:78, trend:'+8%',  color:'#0ea5e9' },
  { name:'Retinol',         usage:65, trend:'+23%', color:'#7c3aed' },
  { name:'Vitamin C',       usage:72, trend:'+5%',  color:'#f59e0b' },
  { name:'Peptides',        usage:55, trend:'+31%', color:'#00a877' },
]

function RoutineCard({ r, i }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(r.likes)

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.09 }}
      whileHover={{ y:-4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow"
      style={{ border: '1px solid #dfd3c4' }}>

      <div className="h-1 w-full" style={{ background: r.accent }} />

      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate:8, scale:1.08 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background:`${r.accent}12`, border:`1px solid ${r.accent}30` }}>
              {r.avatar}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold" style={{ color: '#0e0c0a' }}>{r.user}</span>
                {r.verified && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ background: r.accent }}>✓</div>
                )}
              </div>
              <span className="text-[11px]" style={{ color: '#6b5e55' }}>{r.skinType}</span>
            </div>
          </div>
          {r.badge && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background: `${r.accent}10`, color: r.accent }}>
              {r.badge}
            </span>
          )}
        </div>

        {/* Glow score */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px]" style={{ color: '#a09080' }}>Glow Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: '#dfd3c4' }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${r.glow}%` }}
                transition={{ delay:i*0.09+0.3, duration:0.8 }}
                className="h-full rounded-full glow-bar" style={{ background: r.accent }}/>
            </div>
            <span className="text-sm font-bold" style={{ color: r.accent }}>{r.glow}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {r.routine.map((step, j) => (
            <motion.span key={step}
              initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.09+j*0.04 }}
              className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: '#f5f0ea', color: '#6b5e55', border: '1px solid #dfd3c4' }}>
              {j+1}. {step}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {r.tags.map(t => (
            <span key={t} className="text-[10px] font-bold" style={{ color: r.accent }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 flex items-center gap-4"
        style={{ borderTop: '1px solid #dfd3c4', background: '#faf7f3' }}>
        <motion.button onClick={() => { setLiked(!liked); setLikes(l => liked ? l-1 : l+1) }}
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.85 }}
          className="flex items-center gap-1.5 text-xs transition-colors font-medium"
          style={{ color: liked ? '#f53d1c' : '#a09080' }}>
          <motion.div animate={liked ? { scale:[1,1.4,1] } : {}} transition={{ duration:0.3 }}>
            <Heart size={13} fill={liked?'#f53d1c':'none'}/>
          </motion.div>
          {likes.toLocaleString()}
        </motion.button>
        <button className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: '#a09080' }}>
          <MessageCircle size={13}/> {r.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium transition-colors ml-auto"
          style={{ color: '#a09080' }}>
          <Share2 size={13}/> Share
        </button>
      </div>
    </motion.div>
  )
}

export default function Community() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6" style={{ background: '#f5f0ea' }}>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 rounded-full" style={{ background: '#7c3aed' }} />
            <h1 className="font-display text-5xl font-bold" style={{ color: '#0e0c0a' }}>Community</h1>
          </div>
          <p className="ml-4" style={{ color: '#6b5e55' }}>Real routines, real results — sorted by glow score.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROUTINES.map((r, i) => <RoutineCard key={r.id} r={r} i={i} />)}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Trending ingredients */}
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
              className="bg-white rounded-2xl p-6 shadow-soft" style={{ border:'1px solid #dfd3c4' }}>
              <div className="flex items-center gap-2 mb-5">
                <Flame size={15} style={{ color: '#f53d1c' }}/>
                <h3 className="font-display font-bold" style={{ color: '#0e0c0a' }}>Trending Ingredients</h3>
              </div>
              <div className="space-y-4">
                {TRENDING.map((ing, i) => (
                  <motion.div key={ing.name} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.35+i*0.06 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: '#0e0c0a' }}>{ing.name}</span>
                      <span className="text-[11px] font-bold" style={{ color: '#00a877' }}>{ing.trend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#dfd3c4' }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${ing.usage}%` }}
                          transition={{ delay:0.45+i*0.06, duration:0.7 }}
                          className="h-full rounded-full glow-bar" style={{ background: ing.color }}/>
                      </div>
                      <span className="text-[10px] w-7 font-medium" style={{ color: '#a09080' }}>{ing.usage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}
              className="bg-white rounded-2xl p-6 shadow-soft" style={{ border:'1px solid #dfd3c4' }}>
              <div className="flex items-center gap-2 mb-5">
                <Crown size={15} style={{ color: '#f59e0b' }}/>
                <h3 className="font-display font-bold" style={{ color: '#0e0c0a' }}>Glow Leaderboard</h3>
              </div>
              <div className="space-y-2">
                {[...ROUTINES].sort((a,b)=>b.glow-a.glow).map((r,i) => (
                  <motion.div key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5+i*0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-colors"
                    style={{ background: i === 0 ? `${r.accent}08` : 'transparent' }}>
                    <span className="text-sm w-5 font-bold">
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':<span style={{ color:'#a09080' }}>{i+1}.</span>}
                    </span>
                    <span className="text-xl">{r.avatar}</span>
                    <span className="text-sm flex-1" style={{ color: '#6b5e55' }}>{r.user}</span>
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
