import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONTENT_URL } from './config';
import { bundledClubs, Club } from './data/clubs';
import { bundledEvents, EventItem } from './data/events';
import { bundledNews, NewsItem } from './data/news';
import { bundledTips, Tip } from './data/tips';
import { bundledPlaces, Place, sanitizePlaces, validCoord } from './places';
import { bundledStays, sanitizeStays, Stay } from './stays';
import { todayStr } from './utils';

type Remote = { clubs?: Club[]; events?: EventItem[]; news?: NewsItem[]; tips?: Tip[]; places?: Place[]; stays?: Stay[] };
type Ctx = {
  clubs: Club[];
  events: EventItem[]; // tutti
  upcoming: EventItem[]; // da oggi in poi
  news: NewsItem[];
  tips: Tip[];
  places: Place[];
  stays: Stay[];
  refreshing: boolean;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
  getClub: (id: string) => Club | undefined;
  getEvent: (id: string) => EventItem | undefined;
  eventsByArtist: (name: string) => EventItem[];
};

const CACHE = 'cilex.content.v1';
const C = createContext<Ctx | null>(null);
const isStr = (x: unknown): x is string => typeof x === 'string' && x.length > 0;

// Validazione difensiva: un JSON sbagliato NON deve mai rompere l'app.
export function sanitize(raw: any): Remote | null {
  if (!raw || typeof raw !== 'object') return null;
  const out: Remote = {};
  if (Array.isArray(raw.clubs)) {
    out.clubs = raw.clubs
      .filter((c: any) => c && isStr(c.id) && isStr(c.name))
      .map((c: any) => ({
        id: c.id, name: c.name,
        ticketUrl: typeof c.ticketUrl === 'string' ? c.ticketUrl : '',
        description: typeof c.description === 'string' ? c.description : '',
        rules: isStr(c.rules) ? c.rules : undefined,
        imageUrl: isStr(c.imageUrl) ? c.imageUrl : undefined,
        mapQuery: isStr(c.mapQuery) ? c.mapQuery : undefined,
        lat: validCoord(c.lat, c.lng) ? c.lat : undefined,
        lng: validCoord(c.lat, c.lng) ? c.lng : undefined,
      }));
  }
  if (Array.isArray(raw.events)) {
    out.events = raw.events
      .filter((e: any) => e && isStr(e.id) && isStr(e.clubId) && isStr(e.title) && /^\d{4}-\d{2}-\d{2}$/.test(e.date ?? ''))
      .map((e: any) => ({
        id: e.id, clubId: e.clubId, title: e.title, date: e.date,
        lineup: Array.isArray(e.lineup) ? e.lineup.filter(isStr) : [],
        ticketUrl: isStr(e.ticketUrl) ? e.ticketUrl : undefined,
        imageUrl: isStr(e.imageUrl) ? e.imageUrl : undefined,
      }));
  }
  if (Array.isArray(raw.news)) {
    out.news = raw.news
      .filter((n: any) => n && isStr(n.id) && isStr(n.title))
      .map((n: any) => ({
        id: n.id, title: n.title, date: typeof n.date === 'string' ? n.date : '',
        body: typeof n.body === 'string' ? n.body : '', imageUrl: isStr(n.imageUrl) ? n.imageUrl : undefined,
      }));
  }
  if (Array.isArray(raw.tips)) {
    out.tips = raw.tips
      .filter((x: any) => x && isStr(x.id) && isStr(x.title))
      .map((x: any) => ({ id: x.id, title: x.title, body: typeof x.body === 'string' ? x.body : '' }));
  }
  if (Array.isArray(raw.places)) out.places = sanitizePlaces(raw.places);
  if (Array.isArray(raw.stays)) out.stays = sanitizeStays(raw.stays);
  return out;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [remote, setRemote] = useState<Remote>({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchRemote = useCallback(async () => {
    if (!CONTENT_URL) return;
    setRefreshing(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    try {
      const res = await fetch(CONTENT_URL, { signal: ctrl.signal, headers: { 'Cache-Control': 'no-cache' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = sanitize(await res.json());
      if (data) {
        setRemote(data);
        const now = Date.now();
        setLastUpdated(now);
        AsyncStorage.setItem(CACHE, JSON.stringify({ data, at: now })).catch(() => {});
      }
    } catch {
      // offline o errore: si resta su cache/dati inclusi
    } finally {
      clearTimeout(timer);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CACHE);
        if (raw) {
          const { data, at } = JSON.parse(raw);
          const clean = sanitize(data);
          if (clean) { setRemote(clean); setLastUpdated(at ?? null); }
        }
      } catch {}
      fetchRemote();
    })();
  }, [fetchRemote]);

  const value = useMemo<Ctx>(() => {
    // Club: i dati inclusi sono la base; il JSON remoto li aggiorna per id o ne aggiunge.
    const map = new Map(bundledClubs.map((c) => [c.id, c]));
    (remote.clubs ?? []).forEach((c) => map.set(c.id, { ...map.get(c.id), ...c }));
    const clubs = Array.from(map.values());
    const events = [...(remote.events ?? bundledEvents)].sort((a, b) => a.date.localeCompare(b.date));
    const news = [...(remote.news ?? bundledNews)].sort((a, b) => b.date.localeCompare(a.date));
    const tips = remote.tips ?? bundledTips;
    const places = remote.places ?? bundledPlaces;
    const stays = remote.stays ?? bundledStays;
    const today = todayStr();
    return {
      clubs, events, news, tips, places, stays, refreshing, lastUpdated,
      upcoming: events.filter((e) => e.date >= today),
      refresh: fetchRemote,
      getClub: (id) => clubs.find((c) => c.id === id),
      getEvent: (id) => events.find((e) => e.id === id),
      eventsByArtist: (name) => events.filter((e) => e.lineup.includes(name) && e.date >= today),
    };
  }, [remote, refreshing, lastUpdated, fetchRemote]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useContent() {
  const c = useContext(C);
  if (!c) throw new Error('ContentProvider missing');
  return c;
}
