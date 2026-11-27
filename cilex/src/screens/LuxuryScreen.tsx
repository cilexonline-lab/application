import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconName } from '../components/Icon';
import FadeIn from '../components/FadeIn';
import { useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { tap } from '../haptics';
import { luxury, radius, space, type } from '../theme';

type Item = { key: string; label: string; desc: string; icon: IconName; kind: string };
// Servizi Luxury: nessun prezzo; ogni voce apre la richiesta dedicata (WhatsApp precompilato). Le descrizioni sono generiche, non promesse.
const ITEMS: Item[] = [
  { key: 'yacht', label: 'lxYacht', desc: 'lxYachtD', icon: 'yacht', kind: 'boat' },
  { key: 'vip', label: 'table', desc: 'lxVipD', icon: 'table', kind: 'table' },
  { key: 'villas', label: 'lxVillas', desc: 'lxVillasD', icon: 'villa', kind: 'villa' },
  { key: 'transfer', label: 'lxTransfer', desc: 'lxTransferD', icon: 'car', kind: 'concierge' },
  { key: 'chef', label: 'lxChef', desc: 'lxChefD', icon: 'dining', kind: 'concierge' },
  { key: 'celebrations', label: 'lxCelebrations', desc: 'lxCelebrationsD', icon: 'party', kind: 'concierge' },
  { key: 'jet', label: 'lxJet', desc: 'lxJetD', icon: 'jet', kind: 'concierge' },
  { key: 'bespoke', label: 'lxBespoke', desc: 'lxBespokeD', icon: 'sparkle', kind: 'concierge' },
];

// Luxury: nero profondo, oro/champagne, tipografia leggera e spaziata, filetti sottili, "su invito".
export default function LuxuryScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: luxury.bg }} contentContainerStyle={{ paddingBottom: 72 }}>
      <LinearGradient colors={[luxury.bg, '#1A140A', luxury.bg]} locations={[0, 0.4, 1]} style={s.hero}>
        <FadeIn>
          <Text style={[s.kicker, type.luxury.kicker]}>{t('worldLuxuryKicker').toUpperCase()}</Text>
          <Text style={[s.h1, type.luxury.brand]}>{t('worldLuxury').toUpperCase()}</Text>
          <View style={s.rule} />
          <Text style={s.slogan}>{t('lxSlogan')}</Text>
        </FadeIn>
      </LinearGradient>

      <View style={{ paddingHorizontal: space.lg }}>
        <FadeIn index={1}>
          <View style={s.concierge}>
            <Text style={[s.cTitle, type.luxury.title]}>{t('lxConcierge')}</Text>
            <Text style={s.cSub}>{t('lxConciergeSub')}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={t('lxConciergeBtn')} onPress={() => { tap(); openWhatsApp(`${t('lxReqKind')} · ${t('lxConcierge')}`, t('waMissing')); }} style={({ pressed }) => [s.cBtn, pressed && { opacity: 0.8 }]}>
              <Icon name="ask" size={18} color="#0A0805" stroke={2} />
              <Text style={s.cBtnTxt}>{t('lxConciergeBtn')}</Text>
            </Pressable>
          </View>
        </FadeIn>

        <Text style={[s.section, type.luxury.kicker]}>{t('worldServices').toUpperCase()}</Text>
        {ITEMS.map((it, i) => (
          <FadeIn key={it.key} index={i + 2}>
            <Pressable accessibilityRole="button" accessibilityLabel={t(it.label)} onPress={() => { tap(); nav.navigate('LuxuryRequest', { kind: it.kind, service: it.label }); }} style={({ pressed }) => [s.row, pressed && { opacity: 0.75 }]}>
              <Text style={s.num}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.label, type.luxury.title]}>{t(it.label)}</Text>
                <Text style={s.desc}>{t(it.desc)}</Text>
              </View>
              <Icon name={it.icon} size={20} color={luxury.brand} stroke={1.2} />
            </Pressable>
          </FadeIn>
        ))}

        <Text style={[s.section, type.luxury.kicker, { marginTop: space.xl }]}>{t('lxHow').toUpperCase()}</Text>
        {['reqStep1', 'reqStep2', 'reqStep3'].map((k, i) => (
          <View key={k} style={s.step}>
            <Text style={s.stepNum}>{i + 1}</Text>
            <Text style={s.stepTxt}>{t(k)}</Text>
          </View>
        ))}
        <Text style={s.fine}>{t('lxNoPrices')}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xl },
  kicker: { color: luxury.brand, fontSize: 11 },
  h1: { color: luxury.text, fontSize: 46, marginTop: 8, letterSpacing: 8 },
  rule: { height: StyleSheet.hairlineWidth * 2, backgroundColor: luxury.brand, width: 72, marginVertical: space.md },
  slogan: { color: luxury.muted, fontSize: 15, lineHeight: 23, fontStyle: 'italic' },
  concierge: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: luxury.brandDark, borderRadius: radius.lg, padding: space.lg, backgroundColor: luxury.card },
  cTitle: { color: luxury.text, fontSize: 22, letterSpacing: 2 },
  cSub: { color: luxury.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  cBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: luxury.brand, borderRadius: 999, minHeight: 50, marginTop: space.md },
  cBtnTxt: { color: '#0A0805', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  section: { color: luxury.brandDark, fontSize: 11, marginTop: space.xl, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: StyleSheet.hairlineWidth * 2, borderTopColor: luxury.border, paddingVertical: 22, minHeight: 84 },
  num: { color: luxury.brandDark, fontSize: 13, letterSpacing: 2, width: 26 },
  label: { color: luxury.text, fontSize: 21, letterSpacing: 1.5 },
  desc: { color: luxury.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  stepNum: { color: luxury.brand, fontSize: 14, width: 24, height: 24, textAlign: 'center', lineHeight: 22, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: luxury.brandDark, borderRadius: 12 },
  stepTxt: { flex: 1, color: luxury.text, fontSize: 14, lineHeight: 20 },
  fine: { color: luxury.muted, fontSize: 12, lineHeight: 18, marginTop: space.lg },
});
