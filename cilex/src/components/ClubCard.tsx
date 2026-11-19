import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import type { Club } from '../data/clubs';
import type { EventItem } from '../data/events';
import { clubLogo } from '../data/clubLogos';
import { dayNum, initials, monthShort } from '../utils';
import { tap } from '../haptics';
import { colors, radius, space } from '../theme';
import { Icon } from './Icon';

const native = Platform.OS !== 'web';

// "#RRGGBB" + opacità → "#RRGGBBAA"
const alpha = (hex: string, a: number) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

type Props = {
  club: Club;
  next?: EventItem;
  index: number;
  labels: { next: string; soon: string; table: string };
  onOpen: () => void;
  onTable: () => void;
};

export function ClubCard({ club, next, index, labels, onOpen, onTable }: Props) {
  const accent = club.accent ?? colors.brand;
  const logo = clubLogo(club.id);
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
        marginBottom: space.md,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={club.name}
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        onPress={() => { tap(); onOpen(); }}
        style={[s.card, { borderColor: alpha(accent, 0.35) }]}
      >
        <LinearGradient
          colors={[alpha(accent, 0.38), alpha(accent, 0.08), 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[s.glow, { backgroundColor: alpha(accent, 0.22) }]} />

        <View style={s.logoBox}>
          {typeof logo === 'string' ? (
            <SvgXml xml={logo} width="100%" height="100%" />
          ) : logo ? (
            <Image source={logo as ImageSourcePropType} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          ) : (
            <Text style={[s.mono, { color: accent }]}>{initials(club.name)}</Text>
          )}
        </View>

        <View style={s.info}>
          {!!club.area && <Text style={s.area} numberOfLines={1}>{club.area.toUpperCase()}</Text>}
          <Text style={s.name} numberOfLines={1}>{club.name}</Text>
          {next ? (
            <View style={s.nextRow}>
              <View style={[s.date, { borderColor: alpha(accent, 0.6) }]}>
                <Text style={s.dateDay}>{dayNum(next.date)}</Text>
                <Text style={s.dateMon}>{monthShort(next.date)}</Text>
              </View>
              <Text style={s.nextTitle} numberOfLines={2}>{next.title}</Text>
            </View>
          ) : (
            <Text style={s.soon}>{labels.soon}</Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${labels.table} – ${club.name}`}
            onPress={() => { tap(); onTable(); }}
            hitSlop={8}
            style={({ pressed }) => [s.tableBtn, pressed && { opacity: 0.8 }]}
          >
            <Icon name="table" size={14} color="#001418" />
            <Text style={s.tableTxt}>{labels.table}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 168,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.card,
    overflow: 'hidden',
    padding: space.md,
    gap: space.md,
  },
  glow: { position: 'absolute', left: -40, top: -40, width: 200, height: 200, borderRadius: 100, opacity: 0.6 },
  logoBox: { width: '42%', height: 96, alignItems: 'center', justifyContent: 'center' },
  mono: { fontSize: 40, fontWeight: '900', letterSpacing: 4 },
  info: { flex: 1, gap: 6 },
  area: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  name: { color: colors.text, fontSize: 22, fontWeight: '900', letterSpacing: 0.3 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3, alignItems: 'center', minWidth: 38 },
  dateDay: { color: colors.text, fontSize: 14, fontWeight: '900' },
  dateMon: { color: colors.brand, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  nextTitle: { flex: 1, color: colors.text, fontSize: 12, fontWeight: '600', lineHeight: 16 },
  soon: { color: colors.muted, fontSize: 12, fontStyle: 'italic' },
  tableBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  tableTxt: { color: '#001418', fontSize: 12, fontWeight: '800' },
});
