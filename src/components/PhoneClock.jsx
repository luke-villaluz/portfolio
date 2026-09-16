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

  // Tick exactly on the minute boundary rather than polling: the displayed
  // minute flips the instant it changes, and we wake once a minute instead of
  // six times. Each tick schedules the next one, so it can't drift.
  useEffect(() => {
    let id
    const schedule = () => {
      const current = new Date()
      const msToNextMinute = 60000 - (current.getSeconds() * 1000 + current.getMilliseconds())
      id = setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msToNextMinute)
    }
    schedule()
    return () => clearTimeout(id)
  }, [])

  const { time, date } = format(now)

  return (
    <div className="phone-clock">
      <div className="phone-clock__time">{time}</div>
      <div className="phone-clock__date">{date}</div>
    </div>
  )
}
