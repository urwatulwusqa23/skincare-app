import { motion } from 'framer-motion'

const items = [
  'Niacinamide', '◆', 'Retinol', '◆', 'Hyaluronic Acid', '◆', 'Vitamin C', '◆',
  'Ceramides', '◆', 'Peptides', '◆', 'AHA / BHA', '◆', 'Squalane', '◆',
  'Bakuchiol', '◆', 'Snail Mucin', '◆', 'Azelaic Acid', '◆', 'Tranexamic Acid', '◆',
]

export default function Marquee({ reverse = false, accent = false }) {
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden whitespace-nowrap py-3.5 select-none"
      style={{
        background: accent ? '#f53d1c' : '#0e0c0a',
        borderTop: '1px solid rgba(245,240,234,0.06)',
        borderBottom: '1px solid rgba(245,240,234,0.06)',
      }}
    >
      <motion.div
        className="inline-flex gap-10"
        animate={{ x: reverse ? ['0%', '50%'] : ['-50%', '0%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-bold tracking-[0.22em] uppercase"
            style={{
              color: item === '◆'
                ? (accent ? 'rgba(255,255,255,0.5)' : '#f53d1c')
                : (accent ? 'rgba(255,255,255,0.85)' : 'rgba(245,240,234,0.4)'),
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
