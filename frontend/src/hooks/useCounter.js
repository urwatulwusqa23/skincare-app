import { useEffect, useRef, useState } from 'react'

export function useCounter(target, duration = 1800, startOnMount = false) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(startOnMount)
  const ref = useRef(null)

  useEffect(() => {
    if (!started) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  useEffect(() => {
    if (startOnMount || !ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [startOnMount])

  return { count, ref }
}
