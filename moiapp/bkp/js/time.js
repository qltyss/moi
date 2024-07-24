const d = new Date()
const h = d.getHours();
const m = d.getMinutes();
const s = d.getSeconds();
time.style.setProperty('--ds', s)
time.style.setProperty('--dm', m + s/60)
time.style.setProperty('--dh', h + m/60 + s/3600)