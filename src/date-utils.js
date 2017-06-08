export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const pad = (n) => n < 10 ? '0' + n : n

export const codeToTime = (code, dayIndex) => {
  let h = Math.floor(code)
  let m = code == h ? '00' : '30'
  return pad(h - dayIndex * 24) + ':' + m
}
