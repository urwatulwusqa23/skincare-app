import { motion } from 'framer-motion'
import { useState } from 'react'
import { TrendingUp, Plus, Droplets, Sun, Moon, Star } from 'lucide-react'

const SKIN_DATA = [
  { month:'Jan', hydration:45, clarity:40, texture:38, overall:41 },
  { month:'Feb', hydration:50, clarity:48, texture:42, overall:47 },
  { month:'Mar', hydration:55, clarity:52, texture:50, overall:52 },
  { month:'Apr', hydration:60, clarity:65, texture:58, overall:61 },
  { month:'May', hydration:72, clarity:70, texture:68, overall:70 },
  { month:'Jun', hydration:82, clarity:78, texture:75, overall:78 },
]

const METRICS = [
  { key:'hydration', label:'Hydration', color:'#0ea5e9', icon:<Droplets size={14}/> },
  { key:'clarity',   label:'Clarity',   color:'#f53d1c', icon:<Sun      size={14}/> },
  { key:'texture',   label:'Texture',   color:'#7c3aed', icon:<Moon     size={14}/> },
  { key:'overall',   label:'Overall',   color:'#00a877', icon:<Star     size={14}/> },
]

const CONCERNS = [
  { label:'Acne',               before:7, after:3, emoji:'🔴' },
  { label:'Hyperpigmentation',  before:6, after:4, emoji:'🟤' },
  { label:'Dryness',            before:5, after:2, emoji:'💧' },
  { label:'Pores',              before:8, after:6, emoji:'🔵' },
]

function LineChart({ data, metrics, activeMetric }) {
  const W=600, H=200, PAD=40
  const iW = W-PAD*2, iH = H-PAD*2
  const path = key => 'M ' + data.map((d,i) => `${PAD+(i/(data.length-1))*iW},${PAD+iH-(d[key]/100)*iH}`).join(' L ')
  const area = key => {
    const pts = data.map((d,i) => ({ x:PAD+(i/(data.length-1))*iW, y:PAD+iH-(d[key]/100)*iH }))
    return `M ${pts[0].x},${PAD+iH} L ${pts.map(p=>`${p.x},${p.y}`).join(' L ')} L ${pts[pts.length-1].x},${PAD+iH} Z`
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        {metrics.map(m => (
          <linearGradient key={m.key} id={`g-${m.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={m.color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={m.color} stopOpacity="0"  />
          </linearGradient>
        ))}
      </defs>
      {[0,25,50,75,100].map(v => {
        const y = PAD+iH-(v/100)*iH
        return <g key={v}>
          <line x1={PAD} y1={y} x2={PAD+iW} y2={y} stroke="#dfd3c4" strokeWidth="1"/>
          <text x={PAD-8} y={y+4} fill="#a09080" fontSize="10" textAnchor="end">{v}</text>
        </g>
      })}
      {data.map((d,i) => (
        <text key={d.month} x={PAD+(i/(data.length-1))*iW} y={H-8} fill="#a09080" fontSize="11" textAnchor="middle">{d.month}</text>
      ))}
      {metrics.map(m => {
        const active = activeMetric==='all' || m.key===activeMetric
        return <g key={m.key} opacity={active ? 1 : 0.15}>
          <path d={area(m.key)} fill={`url(#g-${m.key})`}/>
          <path d={path(m.key)} fill="none" stroke={m.color} strokeWidth={m.key===activeMetric?2.5:1.5} strokeLinecap="round" strokeLinejoin="round"/>
          {data.map((d,i) => {
            const x=PAD+(i/(data.length-1))*iW, y=PAD+iH-(d[m.key]/100)*iH
            return <circle key={i} cx={x} cy={y} r={m.key===activeMetric?4:2.5} fill={m.color} stroke="white" strokeWidth="1.5"/>
          })}
        </g>
      })}
    </svg>
  )
}

export default function Tracker() {
  const [activeMetric, setActiveMetric] = useState('overall')
  const [logOpen, setLogOpen] = useState(false)
  const [ratings, setRatings] = useState({ hydration:8, clarity:8, texture:7, overall:8 })

  const latest = SKIN_DATA[SKIN_DATA.length-1]
  const prev   = SKIN_DATA[SKIN_DATA.length-2]

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6" style={{ background: '#f5f0ea' }}>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-10 rounded-full" style={{ background: '#00a877' }} />
              <h1 className="font-display text-5xl font-bold" style={{ color: '#0e0c0a' }}>Glow Tracker</h1>
            </div>
            <p className="ml-4" style={{ color: '#6b5e55' }}>6-month progress. Your skin is 90% better than January.</p>
          </div>
          <motion.button onClick={() => setLogOpen(true)} whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
            style={{ background:'#f53d1c' }}>
            <Plus size={15}/> Log Today
          </motion.button>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m, i) => {
            const val = latest[m.key], delta = val - prev[m.key]
            return (
              <motion.div key={m.key}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.09 }}
                onClick={() => setActiveMetric(m.key)}
                className="bg-white rounded-2xl p-5 cursor-pointer transition-all shadow-card hover:shadow-soft"
                style={{ borderTop: `3px solid ${activeMetric===m.key ? m.color : 'transparent'}`, border: `1px solid #dfd3c4`, borderTopWidth: 3 }}>
                <div className="flex items-center gap-2 mb-3" style={{ color: m.color }}>
                  {m.icon}
                  <span className="text-xs font-medium" style={{ color: '#6b5e55' }}>{m.label}</span>
                </div>
                <div className="font-display text-3xl font-bold mb-1" style={{ color: '#0e0c0a' }}>{val}</div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} style={{ color: '#00a877' }}/>
                  <span className="text-[11px]" style={{ color: '#00a877' }}>+{delta} this month</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#dfd3c4' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${val}%` }}
                    transition={{ delay:i*0.09+0.4, duration:0.8 }}
                    className="h-full rounded-full glow-bar" style={{ background:m.color }} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="bg-white rounded-2xl p-8 mb-6 shadow-soft" style={{ border:'1px solid #dfd3c4' }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-xl font-bold" style={{ color: '#0e0c0a' }}>6-Month Progress</h2>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setActiveMetric('all')}
                className="text-xs px-3 py-1.5 rounded-lg transition-all font-semibold"
                style={{ background:activeMetric==='all'?'#f53d1c':'transparent', color:activeMetric==='all'?'white':'#6b5e55', border:`1px solid ${activeMetric==='all'?'#f53d1c':'#dfd3c4'}` }}>
                All
              </button>
              {METRICS.map(m => (
                <button key={m.key} onClick={() => setActiveMetric(m.key)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-semibold"
                  style={{ background:activeMetric===m.key?`${m.color}12`:'transparent', color:activeMetric===m.key?m.color:'#6b5e55', border:`1px solid ${activeMetric===m.key?`${m.color}40`:'#dfd3c4'}` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background:m.color }}/>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={SKIN_DATA} metrics={METRICS} activeMetric={activeMetric}/>
        </motion.div>

        {/* Concerns */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          className="bg-white rounded-2xl p-8 shadow-soft" style={{ border:'1px solid #dfd3c4' }}>
          <h2 className="font-display text-xl font-bold mb-6" style={{ color: '#0e0c0a' }}>Skin Concerns — Before vs Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONCERNS.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.09 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2" style={{ color: '#0e0c0a' }}>{c.emoji} {c.label}</span>
                  <span className="text-xs font-bold" style={{ color: '#00a877' }}>-{Math.round(((c.before-c.after)/c.before)*100)}% better</span>
                </div>
                {[['Before', c.before, '#f53d1c'], ['Now', c.after, '#00a877']].map(([lbl, val, col]) => (
                  <div key={lbl} className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] w-10 text-right font-medium" style={{ color: '#a09080' }}>{lbl}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#dfd3c4' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${val*10}%` }}
                        transition={{ delay:0.6+i*0.09, duration:0.7 }}
                        className="h-full rounded-full glow-bar" style={{ background:col }}/>
                    </div>
                    <span className="text-[10px] w-4 font-medium" style={{ color: '#6b5e55' }}>{val}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Log modal */}
        {logOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
            style={{ background: 'rgba(14,12,10,0.5)' }}
            onClick={() => setLogOpen(false)}>
            <motion.div initial={{ scale:0.92, y:16 }} animate={{ scale:1, y:0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-blush"
              style={{ border: '1px solid #dfd3c4' }}>
              <h3 className="font-display text-2xl font-bold mb-1" style={{ color: '#0e0c0a' }}>Log Today's Skin</h3>
              <p className="text-sm mb-6" style={{ color: '#6b5e55' }}>Rate each metric from 1–10</p>
              {METRICS.map(m => (
                <div key={m.key} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2" style={{ color:m.color }}>{m.icon} {m.label}</span>
                    <span className="font-bold text-sm" style={{ color: '#0e0c0a' }}>{ratings[m.key]}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={ratings[m.key]}
                    onChange={e => setRatings(r => ({ ...r, [m.key]:+e.target.value }))}
                    className="w-full" style={{ accentColor: m.color }}/>
                </div>
              ))}
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => setLogOpen(false)}
                className="w-full py-3 rounded-xl text-white font-bold shadow-blush"
                style={{ background:'#f53d1c' }}>
                Save Entry ✓
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
