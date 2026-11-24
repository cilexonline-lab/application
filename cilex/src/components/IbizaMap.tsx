import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Image, LayoutChangeEvent, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';
import { PIN_COLOR } from './mapTypes';
import type { MapProps } from './mapTypes';

// Proiezione dell'illustrazione (tools/make_map.py): deve coincidere con quella usata per generare l'immagine.
const LNG0 = 1.14, LNG1 = 1.69, LAT0 = 38.58, LAT1 = 39.38;
const IMG_W = 2000, IMG_H = 3740, RATIO = IMG_H / IMG_W;
const MAX_ZOOM = 5;
const artDay = require('../../assets/ibiza-map.jpg');
const artNight = require('../../assets/ibiza-map-night.jpg');

type V = { s: number; fx: number; fy: number }; // s = scala (1 = immagine larga quanto lo schermo), fx/fy = punto al centro (0..1 dell'immagine)
const fracX = (lng: number) => (lng - LNG0) / (LNG1 - LNG0);
const fracY = (lat: number) => (LAT1 - lat) / (LAT1 - LAT0);

const INK = 'rgba(14,16,20,0.92)';
function Glyph({ kind }: { kind: string }) {
  const st = { stroke: INK, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  if (kind === 'kClub') return (<><Path d="M13.4 16V7.4l6.4-1.6v8.2" {...st} /><Circle cx="11" cy="16.4" r="2.5" fill={INK} /><Circle cx="17.4" cy="14" r="2.5" fill={INK} /></>);
  if (kind === 'kRestaurant') return (<><Path d="M10.3 7v4.6M13 7v4.6M10.3 11.6h2.7M11.65 11.6V20.5M18.2 7c-2.2 1.6-2.2 5-.2 6.6V20.5" {...st} /></>);
  if (kind === 'kDay') return (<><Circle cx="14" cy="14" r="3.2" fill={INK} /><Path d="M14 6.6v2M14 19.4v2M6.6 14h2M19.4 14h2M8.8 8.8l1.4 1.4M17.8 17.8l1.4 1.4M19.2 8.8l-1.4 1.4M10.2 17.8l-1.4 1.4" {...st} /></>);
  // Tramonto: mezzo sole sull'orizzonte.
  if (kind === 'kSunset') return (<><Path d="M9 16.2a5 5 0 0 1 10 0z" fill={INK} /><Path d="M6.6 18.6h14.8M14 7.4v2.2M8.4 10.2l1.5 1.5M19.6 10.2l-1.5 1.5" {...st} /></>);
  // Beach club: ombrellone sulla sabbia.
  if (kind === 'kBeachclub') return (<><Path d="M7.6 13.4a6.4 6.4 0 0 1 12.8 0z" fill={INK} /><Path d="M14 13.4v6.4M9.4 20.4h9.2" {...st} /></>);
  return (<><Path d="M7.2 11.4q3.4-3.6 6.8 0t6.8 0" {...st} /><Path d="M7.2 16.6q3.4-3.6 6.8 0t6.8 0" {...st} /></>);
}

function PinIcon({ color, size, selected, kind }: { color: string; size: number; selected: boolean; kind: string }) {
  return (
    <Svg width={size} height={size * 1.29} viewBox="0 0 28 36">
      <Path d="M14 1C6.8 1 1 6.8 1 13.9 1 23.6 14 35 14 35s13-11.4 13-21.1C27 6.8 21.2 1 14 1z" fill={color} stroke={selected ? '#ffffff' : 'rgba(14,16,20,0.85)'} strokeWidth={selected ? 2.4 : 1.6} />
      <Glyph kind={kind} />
    </Svg>
  );
}

function Pulse({ color }: { color: string }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(v, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }));
    a.start();
    return () => a.stop();
  }, [v]);
  return <Animated.View pointerEvents="none" style={[s.pulse, { borderColor: color, opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }), transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.6] }) }] }]} />;
}

export default function IbizaMap({ pins, selected, onSelect }: MapProps) {
  const [night, setNight] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setViewState] = useState<V>({ s: 1, fx: 0.49, fy: fracY(38.97) });
  const vref = useRef<V>(view);
  const sizeRef = useRef(size);
  const host = useRef<any>(null);
  const anim = useRef<number | null>(null);

  const cover = size.w ? Math.max(1, size.h / (size.w * RATIO)) : 1;
  const coverRef = useRef(cover);
  coverRef.current = cover;

  const clamp = useCallback((v: V): V => {
    const { w, h } = sizeRef.current;
    if (!w) return v;
    const s = Math.min(Math.max(v.s, coverRef.current), coverRef.current * MAX_ZOOM);
    const hw = w / (2 * w * s), hh = h / (2 * w * RATIO * s);
    return { s, fx: Math.min(Math.max(v.fx, hw), 1 - hw), fy: Math.min(Math.max(v.fy, hh), 1 - hh) };
  }, []);
  const setV = useCallback((v: V) => { const c = clamp(v); vref.current = c; setViewState(c); }, [clamp]);
  const stopAnim = () => { if (anim.current != null) { cancelAnimationFrame(anim.current); anim.current = null; } };

  const flyTo = useCallback((to: V, ms = 480) => {
    stopAnim();
    const from = vref.current; const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms); const e = 1 - Math.pow(1 - k, 3);
      setV({ s: from.s + (to.s - from.s) * e, fx: from.fx + (to.fx - from.fx) * e, fy: from.fy + (to.fy - from.fy) * e });
      anim.current = k < 1 ? requestAnimationFrame(step) : null;
    };
    step();
  }, [setV]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    sizeRef.current = { w: width, h: height }; setSize({ w: width, h: height });
    coverRef.current = Math.max(1, height / (width * RATIO));
    setV({ s: coverRef.current * 1.0, fx: 0.49, fy: fracY(38.97) });
  };

  // vola sul pin selezionato (lo mette sopra la scheda in basso)
  useEffect(() => {
    if (!selected || !size.w) return;
    const p = pins.find((x) => x.id === selected);
    if (!p) return;
    const s = Math.max(vref.current.s, coverRef.current * 2.6);
    const CH = size.w * RATIO * s;
    flyTo({ s, fx: fracX(p.lng), fy: fracY(p.lat) + (size.h * 0.12) / CH });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, size.w, size.h]);

  // gesti: trascina + pizzica
  const g = useRef({ x: 0, y: 0, d: 0, s0: 1, fx0: 0, fy0: 0, moved: false });
  const dist = (e: GestureResponderEvent) => { const t = e.nativeEvent.touches; return t.length >= 2 ? Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY) : 0; };
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (e, gs) => e.nativeEvent.touches.length >= 2 || Math.abs(gs.dx) + Math.abs(gs.dy) > 5,
    onMoveShouldSetPanResponderCapture: (e, gs) => e.nativeEvent.touches.length >= 2 || Math.abs(gs.dx) + Math.abs(gs.dy) > 5,
    onPanResponderGrant: (e) => { stopAnim(); const v = vref.current; g.current = { x: 0, y: 0, d: dist(e), s0: v.s, fx0: v.fx, fy0: v.fy, moved: false }; },
    onPanResponderMove: (e, gs) => {
      const { w } = sizeRef.current; if (!w) return;
      const d = dist(e); const c = g.current;
      if (d > 0 && c.d === 0) { c.d = d; c.s0 = vref.current.s; c.fx0 = vref.current.fx; c.fy0 = vref.current.fy; c.x = gs.dx; c.y = gs.dy; }
      const s = d > 0 && c.d > 0 ? c.s0 * (d / c.d) : vref.current.s;
      const base = d > 0 && c.d > 0 ? { x: c.x, y: c.y } : { x: 0, y: 0 };
      const dx = gs.dx - base.x, dy = gs.dy - base.y;
      const fx = (d > 0 && c.d > 0 ? c.fx0 : c.fx0) - dx / (w * s);
      const fy = c.fy0 - dy / (w * RATIO * s);
      setV({ s, fx, fy });
    },
    onPanResponderRelease: () => { const v = vref.current; g.current.fx0 = v.fx; g.current.fy0 = v.fy; g.current.d = 0; },
    onPanResponderTerminationRequest: () => true,
  }), [setV]);

  // rotella del mouse (anteprima web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = host.current as unknown as HTMLElement | null;
    if (!el || !el.addEventListener) return;
    const fn = (ev: WheelEvent) => { ev.preventDefault(); stopAnim(); const v = vref.current; setV({ ...v, s: v.s * Math.exp(-ev.deltaY * 0.0015) }); };
    el.addEventListener('wheel', fn, { passive: false });
    return () => el.removeEventListener('wheel', fn);
  }, [setV, size.w]);

  const { w, h } = size;
  const CW = w * view.s, CH = w * RATIO * view.s;
  const left = w / 2 - view.fx * CW, top = h / 2 - view.fy * CH;
  const zoomed = view.s / cover > 2.2;
  const zoomBy = (k: number) => flyTo({ ...vref.current, s: vref.current.s * k }, 260);
  const reset = () => { onSelect(null); flyTo({ s: cover * 1.0, fx: 0.49, fy: fracY(38.97) }, 520); };

  return (
    <View ref={host} style={s.root} onLayout={onLayout} {...pan.panHandlers}>
      {w > 0 && (
        <>
          <Image source={night ? artNight : artDay} style={{ position: 'absolute', left, top, width: CW, height: CH }} resizeMode="stretch" />
          {pins.map((p) => {
            const x = left + fracX(p.lng) * CW, y = top + fracY(p.lat) * CH;
            if (x < -60 || x > w + 60 || y < -80 || y > h + 60) return null;
            const sel = p.id === selected; const col = PIN_COLOR[p.kind] ?? colors.brand; const sz = sel ? 34 : 24;
            return (
              <React.Fragment key={p.id}>
                {sel && <View pointerEvents="none" style={{ position: 'absolute', left: x - 28, top: y - 28, width: 56, height: 56 }}><Pulse color={col} /></View>}
                <Pressable onPress={() => onSelect(sel ? null : p.id)} hitSlop={10} style={{ position: 'absolute', left: x - sz / 2, top: y - sz * 1.29, zIndex: sel ? 20 : 1 }}>
                  <PinIcon color={col} size={sz} selected={sel} kind={p.kind} />
                </Pressable>
                {(sel || zoomed) && (
                  <View pointerEvents="none" style={{ position: 'absolute', left: x - 90, width: 180, top: sel ? y - sz * 1.29 - 30 : y + 2, alignItems: 'center', zIndex: sel ? 21 : 2 }}>
                    <Text numberOfLines={1} style={sel ? s.pillSel : s.pill}>{p.name}</Text>
                  </View>
                )}
              </React.Fragment>
            );
          })}
          <View style={s.ctrls}>
            <Pressable style={s.btn} onPress={() => zoomBy(1.6)} accessibilityLabel="Zoom in"><Text style={s.btnTxt}>+</Text></Pressable>
            <Pressable style={s.btn} onPress={() => zoomBy(1 / 1.6)} accessibilityLabel="Zoom out"><Text style={s.btnTxt}>−</Text></Pressable>
            <Pressable style={s.btn} onPress={reset} accessibilityLabel="Reset"><Text style={s.btnTxt}>⌂</Text></Pressable>
            <Pressable style={[s.btn, night && { backgroundColor: colors.brand }]} onPress={() => setNight((n) => !n)} accessibilityLabel="Day / Night"><Text style={[s.btnTxt, night && { color: '#0e1014' }]}>{night ? '☾' : '☀'}</Text></Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#2a86be', overflow: 'hidden' },
  pulse: { width: 56, height: 56, borderRadius: 28, borderWidth: 3 },
  pill: { color: '#0e2a3c', fontSize: 11, fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.88)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  pillSel: { color: '#0e1014', fontSize: 13, fontWeight: '800', backgroundColor: colors.brand, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  ctrls: { position: 'absolute', right: 12, top: '34%', gap: 8 },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(14,16,20,0.82)', borderWidth: 1, borderColor: 'rgba(0,219,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: colors.brand, fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
