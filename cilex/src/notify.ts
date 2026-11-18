// Promemoria LOCALI (nessun server): partono dal telefono per gli eventi degli artisti
// seguiti e degli eventi nel Piano. Non sono notifiche push remote.
import { Platform } from 'react-native';
import type { EventItem } from './data/events';

export type Reminder = { id: string; at: Date; eventId: string; artist?: string; planned: boolean };

export const REMINDER_HOUR = 12; // ore 12:00 locali del giorno dell'evento
const MAX_PENDING = 40; // iOS accetta max 64 notifiche locali in coda

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function planReminders(opts: { events: EventItem[]; following: string[]; planned: string[]; now?: Date }): Reminder[] {
  const now = opts.now ?? new Date();
  const out: Reminder[] = [];
  for (const e of opts.events) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || e.date < ymd(now)) continue;
    const artist = e.lineup.find((a) => opts.following.includes(a));
    const planned = opts.planned.includes(e.id);
    if (!artist && !planned) continue;
    const [y, m, d] = e.date.split('-').map(Number);
    const at = new Date(y, m - 1, d, REMINDER_HOUR, 0, 0);
    if (at.getTime() <= now.getTime()) continue; // orario già passato
    out.push({ id: 'cilex-ev-' + e.id, at, eventId: e.id, artist, planned });
  }
  return out.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, MAX_PENDING);
}

type Texts = (r: Reminder) => { title: string; body: string };

export const notificationsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

async function lib() {
  return await import('expo-notifications');
}

export async function currentPermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  try { return (await (await lib()).getPermissionsAsync()).granted; } catch { return false; }
}

// Da chiamare SOLO dopo un tap dell'utente (momento giusto per il permesso).
export async function askPermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  try {
    const N = await lib();
    const cur = await N.getPermissionsAsync();
    if (cur.granted) return true;
    if (!cur.canAskAgain) return false;
    return (await N.requestPermissionsAsync()).granted;
  } catch { return false; }
}

export async function syncReminders(reminders: Reminder[], texts: Texts): Promise<void> {
  if (!notificationsSupported) return;
  try {
    const N = await lib();
    N.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });
    await N.cancelAllScheduledNotificationsAsync();
    for (const r of reminders) {
      const { title, body } = texts(r);
      await N.scheduleNotificationAsync({
        identifier: r.id,
        content: { title, body, data: { eventId: r.eventId } },
        trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: r.at },
      });
    }
  } catch {
    // Mai bloccare l'app per un promemoria.
  }
}

export async function clearReminders(): Promise<void> {
  if (!notificationsSupported) return;
  try { await (await lib()).cancelAllScheduledNotificationsAsync(); } catch {}
}
