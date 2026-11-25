import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ScreenTitle } from '../components/ui';
import WorldCards from '../components/WorldCards';
import { useT } from '../i18n';
import { colors, space } from '../theme';

// "Prodotti": porta ai due mondi, Standard e Luxury.
export default function ProductsScreen() {
  const t = useT();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}>
      <ScreenTitle style={s.h1}>{t('tabProducts')}</ScreenTitle>
      <Text style={s.sub}>{t('productsSub')}</Text>
      <WorldCards />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'left' },
  sub: { color: colors.muted, fontSize: 15, marginTop: 4, marginBottom: space.md },
});
