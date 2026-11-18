import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, space } from '../theme';
import { EventItem } from '../data/events';
import { Club } from '../data/clubs';
import { dayNum, initials, monthShort } from '../utils';
import { Icon, IconName } from './Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { LogoMark } from './Logo';
import { SvgXml } from 'react-native-svg';

export function Button({
  label, onPress, variant = 'gold', disabled, style, icon,
}: { label: string; onPress: () => void; variant?: 'gold' | 'ghost'; disabled?: boolean; style?: ViewStyle; icon?: IconName }) {
  const gold = variant === 'gold';
  const tint = gold ? '#111' : colors.brand;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, gold ? s.btnGold : s.btnGhost, disabled && { opacity: 0.4 }, pressed && { opacity: 0.8 }, style]}
    >
      {icon && <Icon name={icon} size={18} color={tint} />}
      <Text style={[s.btnText, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#111' }]}>{label}</Text>
    </Pressable>
  );
}

export { LogoWordmark as Wordmark } from './Logo';

// Titolo di sezione con il simbolo CILEX.
export function ScreenTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  const flat = StyleSheet.flatten(style) ?? {};
  const { marginBottom, ...textStyle } = flat as any;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom }}>
      <LogoMark width={22} />
      <Text style={[textStyle, { flexShrink: 1 }]}>{children}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function GoldCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <LinearGradient colors={['#33E4FF', '#00A9C9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.lg, padding: space.md }, style]}>
      {children}
    </LinearGradient>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.section}>{children}</Text>;
}

// Banner: foto se disponibile (con permesso del club), altrimenti monogramma elegante.
export function Banner({ name, imageUrl, logo, height = 150 }: { name: string; imageUrl?: string; logo?: string | ImageSourcePropType; height?: number }) {
  return (
    <View style={[s.banner, { height }]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <>
          <View style={[s.ring, { width: height * 1.15, height: height * 1.15, borderRadius: height, borderColor: colors.brandDark, opacity: 0.35 }]} />
          {!logo && <View style={[s.ring, { width: height * 0.72, height: height * 0.72, borderRadius: height, borderColor: colors.brand, opacity: 0.5 }]} />}
          {typeof logo === 'string' ? (
            <View style={{ width: '68%', height: height * 0.4 }} accessibilityLabel={name}>
              <SvgXml xml={logo} width="100%" height="100%" />
            </View>
          ) : logo ? (
            <Image source={logo} accessibilityLabel={name} style={{ width: '70%', height: height * 0.66 }} resizeMode="contain" />
          ) : (
            <Text style={s.mono}>{initials(name)}</Text>
          )}
        </>
      )}
    </View>
  );
}

export function EventCard({ ev, club, onPress, demoLabel }: { ev: EventItem; club?: Club; onPress: () => void; demoLabel: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.event, pressed && { opacity: 0.85 }]}>
      <View style={s.dateBlock}>
        <Text style={s.dateDay}>{dayNum(ev.date)}</Text>
        <Text style={s.dateMon}>{monthShort(ev.date)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.evTitle} numberOfLines={2}>{ev.title}</Text>
        <Text style={s.evClub}>{club?.name}{ev.demo ? ` · ${demoLabel}` : ''}</Text>
        {ev.lineup.length > 0 && <Text style={s.evLine} numberOfLines={1}>{ev.lineup.join(' · ')}</Text>}
      </View>
      <Icon name="chevron" size={18} color={colors.muted} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { flexDirection: 'row', gap: 8, justifyContent: 'center', paddingVertical: 14, paddingHorizontal: space.lg, borderRadius: radius.md, alignItems: 'center' },
  btnGold: { backgroundColor: colors.brand },
  btnGhost: { borderWidth: 1, borderColor: colors.brandDark, backgroundColor: 'transparent' },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.border, marginRight: space.sm, marginBottom: space.sm },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md, borderWidth: 1, borderColor: colors.border },
  section: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: space.sm, marginTop: space.md },
  banner: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  ring: { position: 'absolute', borderWidth: 1 },
  mono: { color: colors.brand, fontSize: 36, fontWeight: '800', letterSpacing: 6 },
  event: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: space.sm },
  dateBlock: { width: 56, height: 62, borderRadius: radius.md, borderWidth: 1, borderColor: colors.brandDark, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardAlt },
  dateDay: { color: colors.text, fontSize: 22, fontWeight: '800', lineHeight: 26 },
  dateMon: { color: colors.brand, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  evTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  evClub: { color: colors.brand, fontSize: 13, fontWeight: '600', marginTop: 2 },
  evLine: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
