import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Crown, Flame } from 'lucide-react'
import { useState } from 'react'

const ROUTINES = [
  { id:1, user:'Sophia K.', avatar:'👩🏻', skinType:'Dry + Sensitive', glow:92,
    routine:['Gentle Cleanser','Hyaluronic Acid','Vitamin C','Moisturiser','SPF 50'],
    tags:['#glasskin','#kbeauty','#hydration'], likes:847, comments:63, verified:true,
    badge:'🏆 Top Routine', accent:'#88b8c0' },
  { id:2, user:'Mia L.',    avatar:'👩🏽', skinType:'Oily + Acne',    glow:88,
    routine:['BHA Cleanser','Niacinamide','BHA Toner','Oil-free Moisturiser','SPF'],
    tags:['#acneprone','#bha','#poreminimizing'], likes:612, comments:41, verified:false,
    badge:'🔥 Trending', accent:'#d4836a' },
  { id:3, user:'Zara M.',   avatar:'👩🏾', skinType:'Combo + Hyperpig', glow:85,
    routine:['Foaming Cleanser','AHA Toner','Vitamin C+E','Niacinamide','SPF 30'],
    tags:['#evenSkin','#vitaminC','#glow'], likes:534, comments:28, verified:true,
    badge:null, accent:'#c8a8d0' },
  { id:4, user:'Luna P.',   avatar:'👩🏼', skinType:'Mature + Dry',    glow:91,
    routine:['Cream Cleanser','Retinol 0.3%','Peptide Serum','Rich Moisturiser','Eye Cream'],
    tags:['#antiaging','#retinol','#peptides'], likes:723, comments:55, verified:true,
    badge:'✨ Staff Pick', accent:'#b5c9b8' },
]

const TRENDING = [
  { name:'Niacinamide',     usage:89, trend:'+12%', color:'#d4836a' },
  { name:'Hyaluronic Acid', usage:78, trend:'+8%',  color:'#88b8c0' },
  { name:'Retinol',         usage:65, trend:'+23%', color:'#c8a8d0' },
  { name:'Vitamin C',       usage:72, trend:'+5%',  color:'#d4a870' },
  { name:'Peptides',        usage:55, trend:'+31%', color:'#7a9e80' },
]

function RoutineCard({ r, i }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(r.likes)

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.09 }}
      whileHover={{ y:-4 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-shadow">

      <div className="h-1 w-full" style={{ background:`linear-gradient(90deg, ${r.accent}80, ${r.accent}20)` }} />

      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate:8, scale:1.08 }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-soft"
              style={{ background:`${r.accent}20`, border:`1px solid ${r.accent}40` }}>
              {r.avatar}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-stone-dark">{r.user}</span>
                {r.verified && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ background:r.accent }}>✓</div>
                )}
              </div>
              <span className="text-[11px] text-stone">{r.skinType}</span>
            </div>
          </div>
          {r.badge && (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-cream-200 text-stone">{r.badge}</span>
          )}
        </div>

        {/* Glow score */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] text-stone">Glow Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-cream-300 rounded-full overflow-hidden">
              <motion.div initial={{ width:0 }} animate={{ width:`${r.glow}%` }}
                transition={{ delay:i*0.09+0.3, duration:0.8 }}
                className="h-full rounded-full glow-bar" style={{ background:r.accent }}/>
            </div>
            <span className="text-sm font-bold" style={{ color:r.accent }}>{r.glow}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {r.routine.map((step, j) => (
            <motion.span key={step}
              initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.09+j*0.04 }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-cream text-stone font-medium border border-cream-300">
              {j+1}. {step}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {r.tags.map(t => (
            <span key={t} className="text-[10px] font-medium" style={{ color:r.accent }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-cream-200 px-5 py-3 flex items-center gap-4 bg-cream/40">
        <motion.button onClick={() => { setLiked(!liked); setLikes(l => liked ? l-1 : l+1) }}
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.85 }}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: liked ? '#d4836a' : '#8a7870' }}>
          <motion.div animate={liked ? { scale:[1,1.4,1] } : {}} transition={{ duration:0.3 }}>
            <Heart size={13} fill={liked?'#d4836a':'none'}/>
          </motion.div>
          {likes.toLocaleString()}
        </motion.button>
        <button className="flex items-center gap-1.5 text-xs text-stone hover:text-stone-dark transition-colors">
          <MessageCircle size={13}/> {r.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-stone hover:text-stone-dark transition-colors ml-auto">
          <Share2 size={13}/> Share
        </button>
      </div>
    </motion.div>
  )
}

export default function Community() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6 bg-cream">
      <div className="orb w-80 h-80 bg-blush-light top-20   left-0  opacity-40" style={{ '--dur': '10s' }} />
      <div className="orb w-64 h-64 bg-sage-light  bottom-40 right-10 opacity-40" style={{ '--dur': '12s', '--del': '2s' }} />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="mb-10">
          <h1 className="font-display text-5xl font-bold text-stone-dark mb-2">Community</h1>
          <p className="text-stone">Real routines, real results — sorted by glow score.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROUTINES.map((r, i) => <RoutineCard key={r.id} r={r} i={i} />)}
          </div>

          <div className="space-y-6">
            {/* Trending */}
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
              className="bg-white rounded-3xl p-6 shadow-soft border border-cream-300">
              <div className="flex items-center gap-2 mb-5">
                <Flame size={15} className="text-blush-dark"/>
                <h3 className="font-display font-bold text-stone-dark">Trending Ingredients</h3>
              </div>
              <div className="space-y-4">
                {TRENDING.map((ing, i) => (
                  <motion.div key={ing.name} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.35+i*0.06 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-stone-dark">{ing.name}</span>
                      <span className="text-[11px] font-medium text-sage-dark">{ing.trend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-cream-300 rounded-full overflow-hidden">
                        <motion.div initial={{ width:0 }} animate={{ width:`${ing.usage}%` }}
                          transition={{ delay:0.45+i*0.06, duration:0.7 }}
                          className="h-full rounded-full glow-bar" style={{ background:ing.color }}/>
                      </div>
                      <span className="text-[10px] text-stone w-7">{ing.usage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}
              className="bg-white rounded-3xl p-6 shadow-soft border border-cream-300">
              <div className="flex items-center gap-2 mb-5">
                <Crown size={15} className="text-peach-dark"/>
                <h3 className="font-display font-bold text-stone-dark">Glow Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {[...ROUTINES].sort((a,b)=>b.glow-a.glow).map((r,i) => (
                  <motion.div key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5+i*0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream transition-colors">
                    <span className="text-sm w-5 font-bold">{i===0?'🥇':i===1?'🥈':i===2?'🥉':<span className="text-stone">{i+1}.</span>}</span>
                    <span className="text-xl">{r.avatar}</span>
                    <span className="text-sm text-stone flex-1">{r.user}</span>
                    <span className="text-sm font-bold text-gradient-warm">{r.glow}</span>
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
