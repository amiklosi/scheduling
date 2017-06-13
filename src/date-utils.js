export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const pad = (n) => n < 10 ? '0' + n : n

export const normalizeCodeToDay = (code, dayIndex) => {
  return code - 24 * dayIndex
}

export const codeToTime24 = (code, dayIndex) => {
  let h = Math.floor(code)
  let m = code == h ? '00' : '30'
  return pad(h - dayIndex * 24) + ':' + m
}

export const codeToTime = (code, dayIndex) => {
  if (code === undefined) {
    return undefined
  }
  let h = Math.floor(code)
  let m = code == h ? '00' : '30'
  let normalizedH = (h - dayIndex * 24)
  let displayH = normalizedH % 12 == 0 ? 12 : normalizedH % 12
  return pad(displayH) + ':' + m + ' ' + (normalizedH == 24 ? 'AM' : (normalizedH >= 12 ? 'PM' : 'AM'))
}

export const timeToCode = (time) => {
  let hourAndMinute = time.match(/[0-9:]+/)[0]
  let [h, m] = hourAndMinute.split(':').map(v => Number(v))
  let hasAmPm = !!time.match(/am|pm/i)
  if (hasAmPm) {
    let isAm = !!time.match(/am/i)
    if (h == 12) {
      h = 0
    }
    return isAm ? (h + m / 60) : (h + 12 + m / 60)
  } else {
    return h + m / 60
  }
}
