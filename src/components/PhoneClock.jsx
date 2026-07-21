import { useEffect, useState } from 'react'
import './PhoneClock.css'

function format(now) {
  let h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  const time = `${h}:${m} ${ampm}`
  const date = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`
  return { time, date }
}

/** Retro flip-phone LCD: 8-bit pixel time + date, black on a blue screen. */
export default function PhoneClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])

  const { time, date } = format(now)

  return (
    <div className="phone-clock">
      <div className="phone-clock__time">{time}</div>
      <div className="phone-clock__date">{date}</div>
    </div>
  )
}
