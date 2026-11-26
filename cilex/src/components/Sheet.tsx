// Foglio che sale dal basso per i dettagli (locali, club, servizi). Si chiude trascinando la maniglia
// verso il basso, toccando lo sfondo o col tasto ×. Solo Reanimated + Gesture Handler.
// "Riduci movimento" attivo = semplice dissolvenza (nessuno scorrimento).
import React, { useCallback, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useT } from '../i18n';
import { colors, radius } from '../theme';

const OPEN_MS = 340; // sotto i 600 ms
const CLOSE_MS = 240;

export default function Sheet({ children, bg = colors.bg, accent = colors.brand }: { children: React.ReactNode; bg?: string; accent?: string }) {
  const t = useT();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const H = Dimensions.get('window').height;
  const p = useSharedValue(0);   // 0 = chiuso, 1 = aperto
  const drag = useSharedValue(0); // px trascinati verso il basso

  useEffect(() => {
    p.value = withTiming(1, { duration: reduce ? 180 : OPEN_MS, easing: Easing.out(Easing.cubic) });
  }, []);

  const leave = useCallback(() => { if (nav.canGoBack()) nav.goBack(); }, [nav]);
  const close = useCallback(() => {
    p.value = withTiming(0, { duration: reduce ? 150 : CLOSE_MS, easing: Easing.in(Easing.cubic) }, (done) => { if (done) runOnJS(leave)(); });
  }, [leave, reduce]);

  const pan = Gesture.Pan()
    .onUpdate((e) => { drag.value = Math.max(0, e.translationY); })
    .onEnd((e) => {
      if (drag.value > 120 || e.velocityY > 900) {
        // chiude partendo dalla posizione raggiunta
        p.value = withTiming(0, { duration: CLOSE_MS, easing: Easing.out(Easing.quad) }, (done) => { if (done) runOnJS(leave)(); });
      } else {
        drag.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      }
    });

  const back = useAnimatedStyle(() => ({ opacity: interpolate(p.value, [0, 1], [0, 0.6]) * interpolate(drag.value, [0, H * 0.5], [1, 0.3], 'clamp') }));
  const sheet = useAnimatedStyle(() => ({
    opacity: reduce ? p.value : interpolate(p.value, [0, 0.25, 1], [0, 1, 1]),
    transform: [{ translateY: reduce ? 0 : interpolate(p.value, [0, 1], [H, 0]) + drag.value }],
  }));

  return (
    <View style={s.root}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, back]}>
        <Pressable style={{ flex: 1 }} onPress={close} accessibilityRole="button" accessibilityLabel={t('back')} />
      </Animated.View>
      <Animated.View style={[s.sheet, { backgroundColor: bg, marginTop: insets.top + 16 }, sheet]}>
        <GestureDetector gesture={pan}>
          <View style={s.grab} accessible accessibilityRole="adjustable" accessibilityLabel={t('back')}>
            <View style={s.handle} />
          </View>
        </GestureDetector>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('back')} style={s.x}>
          <Text style={{ color: accent, fontSize: 22, lineHeight: 24, fontWeight: '600' }}>×</Text>
        </Pressable>
        <View style={{ flex: 1 }}>{children}</View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: { flex: 1, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, overflow: 'hidden' },
  grab: { position: 'absolute', top: 0, left: 0, right: 0, height: 44, alignItems: 'center', paddingTop: 10, zIndex: 5 },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  x: { position: 'absolute', top: 8, right: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 6 },
});
