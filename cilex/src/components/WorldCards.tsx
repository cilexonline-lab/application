import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from './Icon';
import { useT } from '../i18n';
import { tap } from '../haptics';
import { colors, luxury, radius, space, type } from '../theme';

// I due ingressi ai "mondi": Standard (nero + azzurro) e Luxury (nero profondo + oro). Usati in Home e in Prodotti.
export default function WorldCards() {
  const t = useT();
  const nav = useNavigation<any>();
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel={t('worldStandard')} onPress={() => { tap(); nav.navigate('Standard'); }} style={({ pressed }) => [s.world, s.worldStd, pressed && { opacity: 0.85 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[s.worldKicker, { color: colors.brand }]}>{t('worldStandardKicker').toUpperCase()}</Text>
          <Text style={[s.worldTitle, { color: colors.text }]}>{t('worldStandard')}</Text>
          <Text style={s.worldSub}>{t('worldStandardSub')}</Text>
        </View>
        <Icon name="chevron" size={22} color={colors.brand} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('worldLuxury')} onPress={() => { tap(); nav.navigate('Luxury'); }} style={({ pressed }) => [s.world, s.worldLux, pressed && { opacity: 0.85 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[s.worldKicker, type.luxury.kicker, { color: luxury.brand }]}>{t('worldLuxuryKicker').toUpperCase()}</Text>
          <Text style={[s.worldTitle, type.luxury.title, { color: luxury.text }]}>{t('worldLuxury')}</Text>
          <Text style={[s.worldSub, { color: luxury.muted }]}>{t('worldLuxurySub')}</Text>
        </View>
        <Icon name="chevron" size={22} color={luxury.brand} />
      </Pressable>
    </>
  );
}

const s = StyleSheet.create({
  world: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, padding: space.md, minHeight: 96, marginBottom: space.sm },
  worldStd: { backgroundColor: colors.card, borderColor: colors.brand },
  worldLux: { backgroundColor: luxury.bg, borderColor: luxury.brandDark, borderWidth: StyleSheet.hairlineWidth * 2 },
  worldKicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  worldTitle: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  worldSub: { color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
});
