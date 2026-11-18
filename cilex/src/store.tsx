import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlanState = { planned: string[]; outfits: Record<string, string>; name: string; following: string[]; arrival: string; departure: string; prCode: string; aiConsent: boolean; deviceId: string; notifOn: boolean };
type Ctx = PlanState & {
  toggle: (eventId: string) => void;
  setOutfit: (eventId: string, text: string) => void;
  setName: (name: string) => void;
  toggleFollow: (artist: string) => void;
  isFollowing: (artist: string) => boolean;
  setTrip: (arrival: string, departure: string) => void;
  setPrCode: (code: string) => void;
  setAiConsent: (v: boolean) => void;
  setNotifOn: (v: boolean) => void;
  isPlanned: (eventId: string) => boolean;
};

const KEY = 'cilex.plan.v1';
const EMPTY: PlanState = { planned: [], outfits: {}, name: '', following: [], arrival: '', departure: '', prCode: '', aiConsent: false, deviceId: '', notifOn: false };
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlanState>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const st = { ...EMPTY, ...(raw ? JSON.parse(raw) : {}) } as PlanState;
        if (!st.deviceId) st.deviceId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        setState(st);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      toggle: (id) =>
        setState((s) => ({
          ...s,
          planned: s.planned.includes(id) ? s.planned.filter((x) => x !== id) : [...s.planned, id],
        })),
      setOutfit: (id, text) => setState((s) => ({ ...s, outfits: { ...s.outfits, [id]: text } })),
      setName: (name) => setState((s) => ({ ...s, name })),
      toggleFollow: (a) =>
        setState((s) => ({ ...s, following: s.following.includes(a) ? s.following.filter((x) => x !== a) : [...s.following, a] })),
      isFollowing: (a) => state.following.includes(a),
      setTrip: (arrival, departure) => setState((s) => ({ ...s, arrival, departure })),
      setPrCode: (prCode) => setState((s) => ({ ...s, prCode })),
      setAiConsent: (aiConsent) => setState((s) => ({ ...s, aiConsent })),
      setNotifOn: (notifOn) => setState((s) => ({ ...s, notifOn })),
      isPlanned: (id) => state.planned.includes(id),
    }),
    [state],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}
