import React, { useEffect, useId, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, SvgXml } from 'react-native-svg';
import type { Club } from '../data/clubs';
import { clubLogo } from '../data/clubLogos';
import { initials } from '../utils';
import { tap } from '../haptics';
import { colors } from '../theme';

const native = Platform.OS !== 'web';
export const clubAccent = (c?: Club) => c?.accent ?? colors.brand;

// Luce sfumata nel colore del club (cerchio radiale che sfuma nel nero, senza bordi).
export function ClubGlow({ color, strength = 0.55, cx = '50%', cy = '50%', rx = '55%', ry = '60%' }: { color: string; strength?: number; cx?: string; cy?: string; rx?: string; ry?: string }) {
  const id = 'g' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx={cx} cy={cy} rx={rx} ry={ry} fx={cx} fy={cy} gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={color} stopOpacity={strength} />
          <Stop offset="0.45" stopColor={color} stopOpacity={strength * 0.35} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

// Logo bianco del club; senza logo, il nome in maiuscolo spaziato.
export function ClubLogoMark({ club, width, height }: { club: Club; width: number; height: number }) {
  const logo = clubLogo(club.id);
  if (typeof logo === 'string') {
    return (
      <View style={{ width, height }} accessibilityLabel={club.name}>
        <SvgXml xml={logo} width="100%" height="100%" />
      </View>
    );
  }
  if (logo) return <Image source={logo as ImageSourcePropType} accessibilityLabel={club.name} style={{ width, height }} resizeMode="contain" />;
  return (
    <Text style={[s.word, { fontSize: Math.min(height * 0.6, 44) }]} numberOfLines={1} adjustsFontSizeToFit>
      {club.name.toUpperCase() || initials(club.name)}
    </Text>
  );
}

type Props = {
  club: Club;
  count: number;
  index: number;
  labels: { events: string; soon: string };
  onOpen: () => void;
};

// Vetrina del club in Esplora: nero, luce del club dietro al logo bianco, zona e numero eventi in basso.
export function ClubCard({ club, count, index, labels, onOpen }: Props) {
  const accent = clubAccent(club);
  const scale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 420, delay: 70 * index, useNativeDriver: native }).start();
  }, [enter, index]);

  const press = (to: number) => Animated.spring(scale, { toValue: to, useNativeDriver: native, speed: 40, bounciness: 6 }).start();

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }, { scale }],
        marginBottom: 14,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${club.name}${club.area ? ', ' + club.area : ''}`}
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        onPress={() => { tap(); onOpen(); }}
        style={s.card}
      >
        <ClubGlow color={accent} cy="44%" />
        <View style={s.logoWrap}>
          <ClubLogoMark club={club} width={190} height={64} />
        </View>
        <View style={s.bottom}>
          <Text style={s.area} numberOfLines={1}>{(club.area ?? '').toUpperCase()}</Text>
          {count > 0 ? (
            <View style={[s.pill, { backgroundColor: accent }]}>
              <Text style={s.pillTxt}>{labels.events.replace('{n}', String(count))}</Text>
            </View>
          ) : (
            <View style={[s.pill, s.pillSoon]}>
              <Text style={[s.pillTxt, { color: colors.text }]}>{labels.soon}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Testata a tutto schermo per la pagina del club e dell'evento (sta sotto l'intestazione trasparente).
export function ClubHero({ club, height = 360, topInset = 0, children }: { club: Club; height?: number; topInset?: number; children?: React.ReactNode }) {
  return (
    <View style={[s.hero, { height }]}>
      <ClubGlow color={clubAccent(club)} cy="52%" rx="70%" ry="55%" strength={0.65} />
      <View style={[s.heroLogo, { paddingTop: topInset }]}>
        <ClubLogoMark club={club} width={240} height={96} />
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: { height: 196, borderRadius: 26, backgroundColor: '#000000', overflow: 'hidden' },
  logoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingBottom: 18 },
  word: { color: '#FFFFFF', fontWeight: '900', letterSpacing: 6, textAlign: 'center' },
  bottom: { position: 'absolute', left: 20, right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  area: { flex: 1, color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: '700', letterSpacing: 2.4 },
  pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  pillSoon: { backgroundColor: 'rgba(255,255,255,0.12)' },
  pillTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  hero: { width: '100%', backgroundColor: colors.bg, overflow: 'hidden' },
  heroLogo: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
});
