// Transizione tra sezioni: breve schermata nera con il logo Cilex (glow), poi la sezione richiesta.
// Standard = azzurro e rapida; Luxury = oro e più lenta. "Riduci movimento" attivo = nessuna animazione.
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LogoWordmark } from './Logo';
import { colors, luxury } from '../theme';

const SECTIONS = new Set(['Home', 'Products', 'Clubs', 'Map3D', 'Ask', 'Plan', 'Request', 'Standard', 'Luxury', 'Itineraries']);
const ND = Platform.OS !== 'web';

export default function SectionTransition({ route }: { route?: string }) {
  const prev = useRef<string | undefined>(undefined);
  const reduce = useRef(false);
  const [world, setWorld] = useState<'standard' | 'luxury' | null>(null);
  const veil = useRef(new Animated.Value(0)).current;
  const logo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { reduce.current = !!v; }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v: boolean) => { reduce.current = v; });
    return () => (sub as any)?.remove?.();
  }, []);

  useEffect(() => {
    const from = prev.current;
    prev.current = route;
    if (!route || !from || from === route) return;
    if (!SECTIONS.has(route) || !SECTIONS.has(from)) return; // solo tra sezioni, non per le schede di dettaglio
    if (reduce.current) return;
    const lux = route === 'Luxury';
    setWorld(lux ? 'luxury' : 'standard');
    veil.setValue(1);
    logo.setValue(0);
    const k = lux ? 1.5 : 1;
    Animated.sequence([
      Animated.timing(logo, { toValue: 1, duration: 380 * k, easing: Easing.out(Easing.cubic), useNativeDriver: ND }),
      Animated.delay(320 * k),
      Animated.timing(veil, { toValue: 0, duration: 280 * k, easing: Easing.inOut(Easing.quad), useNativeDriver: ND }),
    ]).start(() => setWorld(null));
  }, [route, veil, logo]);

  if (!world) return null;
  const pal = world === 'luxury' ? luxury : colors;
  return (
    <Animated.View pointerEvents="auto" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, s.veil, { backgroundColor: pal.bg, opacity: veil }]}>
      <Animated.View style={{ alignItems: 'center', justifyContent: 'center', opacity: logo, transform: [{ scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) }] }}>
        <Svg width={340} height={340} style={s.glow} pointerEvents="none">
          <Defs>
            <RadialGradient id="g" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={pal.brand} stopOpacity="0.38" />
              <Stop offset="1" stopColor={pal.brand} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="170" cy="170" r="170" fill="url(#g)" />
        </Svg>
        <LogoWordmark width={170} color={pal.brand} />
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  veil: { alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  glow: { position: 'absolute', left: '50%', top: '50%', marginLeft: -170, marginTop: -170 },
});
