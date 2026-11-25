import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconName } from '../components/Icon';
import { useT } from '../i18n';
import { tap } from '../haptics';
import { luxury, radius, space, type } from '../theme';

type Item = { key: string; label: string; icon: IconName; go: (nav: any, t: (k: string) => string) => void };
const req = (kind: string, lab: string) => (nav: any, t: (k: string) => string) => nav.navigate('Request', { kind, note: `Luxury · ${t(lab)}` });
// Servizi di fascia alta: nessun prezzo ("su richiesta"), richiesta via WhatsApp (stesso sistema della Richiesta).
const ITEMS: Item[] = [
  { key: 'boatparty', label: 'lxBoatParty', icon: 'boat', go: req('boat', 'lxBoatParty') },
  { key: 'excursions', label: 'lxExcursions', icon: 'map', go: req('concierge', 'lxExcursions') },
  { key: 'openbar', label: 'lxOpenBar', icon: 'concierge', go: req('concierge', 'lxOpenBar') },
  { key: 'yacht', label: 'lxYacht', icon: 'boat', go: req('boat', 'lxYacht') },
  { key: 'vip', label: 'table', icon: 'table', go: (n) => n.navigate('Request', { kind: 'table' }) },
  { key: 'villas', label: 'lxVillas', icon: 'villa', go: (n) => n.navigate('Stays', { kind: 'villa' }) },
];

// Luxury: nero più profondo, oro/champagne, tipografia leggera e spaziata, bordi sottili, "su invito".
export default function LuxuryScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: luxury.bg }} contentContainerStyle={{ padding: space.lg, paddingBottom: 64 }}>
      <Text style={[s.kicker, type.luxury.kicker]}>{t('worldLuxuryKicker').toUpperCase()}</Text>
      <Text style={[s.h1, type.luxury.title]}>{t('worldLuxury')}</Text>
      <View style={s.rule} />
      <Text style={s.sub}>{t('lxIntro')}</Text>
      {ITEMS.map((it) => (
        <Pressable key={it.key} accessibilityRole="button" accessibilityLabel={t(it.label)} onPress={() => { tap(); it.go(nav, t); }} style={({ pressed }) => [s.row, pressed && { opacity: 0.8 }]}>
          <Icon name={it.icon} size={22} color={luxury.brand} stroke={1.2} />
          <View style={{ flex: 1 }}>
            <Text style={[s.label, type.luxury.title, { fontSize: 19, letterSpacing: 1.5 }]}>{t(it.label)}</Text>
            <Text style={s.on}>{t('lxOnRequest')}</Text>
          </View>
          <Icon name="chevron" size={18} color={luxury.brandDark} stroke={1.2} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  kicker: { color: luxury.brand, fontSize: 11 },
  h1: { color: luxury.text, fontSize: 38, marginTop: 6 },
  rule: { height: StyleSheet.hairlineWidth * 2, backgroundColor: luxury.brandDark, width: 64, marginVertical: space.md },
  sub: { color: luxury.muted, fontSize: 14, lineHeight: 22, marginBottom: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: StyleSheet.hairlineWidth * 2, borderTopColor: luxury.border, paddingVertical: 20, minHeight: 72 },
  label: { color: luxury.text },
  on: { color: luxury.muted, fontSize: 12, marginTop: 3, letterSpacing: 0.5 },
});
