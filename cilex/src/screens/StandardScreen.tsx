import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconName } from '../components/Icon';
import { useT } from '../i18n';
import { tap } from '../haptics';
import { colors, radius, space } from '../theme';

type Item = { key: string; label: string; icon: IconName; go: (nav: any, t: (k: string) => string) => void };
const ITEMS: Item[] = [
  { key: 'clubs', label: 'stdClubs', icon: 'music', go: (n) => n.navigate('Clubs', { seg: 'club' }) },
  { key: 'beach', label: 'stdBeach', icon: 'umbrella', go: (n) => n.navigate('Clubs', { seg: 'beach' }) },
  { key: 'food', label: 'stdFood', icon: 'dining', go: (n) => n.navigate('Clubs', { seg: 'restaurant' }) },
  { key: 'table', label: 'table', icon: 'table', go: (n) => n.navigate('Request', { kind: 'table' }) },
  { key: 'openbar', label: 'stdOpenBar', icon: 'cocktail', go: (n, t) => n.navigate('Request', { kind: 'concierge', note: `Standard · ${t('stdOpenBar')}` }) },
  { key: 'boatparty', label: 'stdBoatParty', icon: 'party', go: (n, t) => n.navigate('Request', { kind: 'boat', note: `Standard · ${t('stdBoatParty')}` }) },
  { key: 'formentera', label: 'stdFormentera', icon: 'compass', go: (n, t) => n.navigate('Request', { kind: 'concierge', note: `Standard · ${t('stdFormentera')}` }) },
];

// Standard: identità CILEX (nero + azzurro). Club, eventi, ristoranti, beach club, Selezione Cilex.
export default function StandardScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}>
      <Text style={s.kicker}>{t('worldStandardKicker').toUpperCase()}</Text>
      <Text style={s.h1}>{t('worldStandard')}</Text>
      <Text style={s.sub}>{t('worldStandardSub')}</Text>
      {ITEMS.map((it) => (
        <Pressable key={it.key} accessibilityRole="button" onPress={() => { tap(); it.go(nav, t); }} style={({ pressed }) => [s.row, pressed && { opacity: 0.85 }]}>
          <View style={s.ic}><Icon name={it.icon} size={22} color={colors.brand} /></View>
          <Text style={s.label}>{t(it.label)}</Text>
          <Icon name="chevron" size={20} color={colors.muted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  kicker: { color: colors.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  h1: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 4 },
  sub: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.md, minHeight: 64, marginBottom: space.sm },
  ic: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.brandDark, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '700' },
});
