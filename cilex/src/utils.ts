import { getLang } from './i18n';
export const pad = (n: number) => String(n).padStart(2, '0');

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}
export const dayNum = (iso: string) => String(Number(iso.slice(8, 10)));
export const monthShort = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(getLang(), { month: 'short' }).replace('.', '').toUpperCase();

export function initials(name: string) {
  const w = name.replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/);
  return (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase();
}

// Accetta YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD/MM (anno corrente o prossimo). Restituisce ISO o null.
export function parseDate(input: string, now = new Date(), allowPast = false): string | null {
  const t = input.trim();
  let y: number, m: number, d: number;
  let mt = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (mt) { y = +mt[1]; m = +mt[2]; d = +mt[3]; }
  else if ((mt = t.match(/^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?$/))) {
    d = +mt[1]; m = +mt[2];
    if (mt[3]) y = mt[3].length === 2 ? 2000 + +mt[3] : +mt[3];
    else {
      y = now.getFullYear();
      if (todayStr(new Date(y, m - 1, d)) < todayStr(now)) y += 1;
    }
  } else return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  const iso = todayStr(dt);
  return allowPast || iso >= todayStr(now) ? iso : null;
}

export type TimeFilter = 'all' | 'tonight' | 'weekend' | 'week';

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function matchesTime(date: string, f: TimeFilter, now = new Date()): boolean {
  if (f === 'all') return true;
  const today = todayStr(now);
  if (f === 'tonight') return date === today;
  const end = todayStr(addDays(now, 7));
  if (date < today || date > end) return false;
  if (f === 'week') return true;
  const wd = new Date(date + 'T12:00:00').getDay(); // 5=ven 6=sab 0=dom
  return wd === 5 || wd === 6 || wd === 0;
}

export function daysUntil(iso: string, now = new Date()): number {
  const a = new Date(iso + 'T12:00:00').getTime();
  const b = new Date(todayStr(now) + 'T12:00:00').getTime();
  return Math.round((a - b) / 86400000);
}

// ID richiesta leggibile (senza caratteri ambigui), es. CX-4F7K
export function requestRef(rand: () => number = Math.random): string {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = '';
  for (let i = 0; i < 4; i++) r += a[Math.floor(rand() * a.length)];
  return 'CX-' + r;
}

export const fmtLong = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
