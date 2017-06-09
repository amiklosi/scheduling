export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const pad = (n) => n < 10 ? '0' + n : n

export const codeToTime = (code, dayIndex) => {
  let h = Math.floor(code)
  let m = code == h ? '00' : '30'
  return pad(h - dayIndex * 24) + ':' + m
}

export const timeToCode = (time) => {
  let hourAndMinute = time.match(/[0-9:]+/)[0]
  let [h,m] = hourAndMinute.split(':').map(v => Number(v))
  let hasAmPm = !!time.match(/am|pm/i)
  if (hasAmPm) {
    let isAm = !!time.match(/am/i)
    return isAm ? (h + m / 60) : (h + 12 + m / 60)
  } else {
    return h + m / 60
  }
}
