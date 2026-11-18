import { useEffect, useMemo } from 'react';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { clearReminders, currentPermission, notificationsSupported, planReminders, syncReminders } from '../notify';

// Riprogramma i promemoria quando cambiano eventi, artisti seguiti o piano.
export default function RemindersSync() {
  const t = useT();
  const { events, getClub } = useContent();
  const { following, planned, notifOn, setNotifOn } = useStore();

  // Se l'utente ha tolto il permesso da Impostazioni, allinea lo stato.
  useEffect(() => {
    if (!notifOn || !notificationsSupported) return;
    currentPermission().then((ok) => { if (!ok) setNotifOn(false); });
  }, [notifOn]);

  const key = useMemo(() => JSON.stringify([events.map((e) => [e.id, e.date, e.lineup]), following, planned]), [events, following, planned]);

  useEffect(() => {
    if (!notificationsSupported) return;
    if (!notifOn) { clearReminders(); return; }
    const byId = new Map(events.map((e) => [e.id, e]));
    syncReminders(planReminders({ events, following, planned }), (r) => {
      const ev = byId.get(r.eventId);
      const club = (ev && getClub(ev.clubId)?.name) || '';
      const fill = (s: string) => s.replace('{artist}', r.artist ?? '').replace('{title}', ev?.title ?? '').replace('{club}', club);
      return r.artist
        ? { title: fill(t('remTitleArtist')), body: fill(t('remBodyArtist')) }
        : { title: fill(t('remTitlePlan')), body: fill(t('remBodyPlan')) };
    });
  }, [notifOn, key]);

  return null;
}
