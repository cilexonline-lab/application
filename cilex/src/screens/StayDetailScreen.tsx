import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { stayFacts } from './StaysScreen';
import { colors, radius, space } from '../theme';

export default function StayDetailScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { stayId } = useRoute<any>().params;
  const { stays } = useContent();
  const st = stays.find((x) => x.id === stayId);
  if (!st) return null;
  const facts = stayFacts(st, t);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 120 }}>
      <Banner name={st.name} imageUrl={st.imageUrl} height={210} />
      <Text style={s.kind}>{t(st.kind).toUpperCase()}{st.area ? ` · ${st.area}` : ''}{st.demo ? ` · ${t('demoTag')}` : ''}</Text>
      <Text style={s.name}>{st.name}</Text>
      {!!facts && <Text style={s.facts}>{facts}</Text>}
      {!!st.description && <Text style={s.desc}>{st.description}</Text>}

      {!!st.amenities?.length && (
        <>
          <Text style={s.label}>{t('amenitiesL')}</Text>
          <View style={s.chips}>{st.amenities.map((a) => <Text key={a} style={s.chip}>{a}</Text>)}</View>
        </>
      )}

      <View style={s.priceBox}>
        <Text style={s.price}>{st.priceNote ?? t('priceOnRequest')}</Text>
        {st.minNights != null && <Text style={s.min}>{t('minNightsL')}: {st.minNights}</Text>}
      </View>

      <View style={{ gap: space.sm, marginTop: space.md }}>
        <Button icon={st.kind === 'villa' ? 'villa' : 'apartment'} label={t('requestStay')} onPress={() => nav.navigate('Request', { kind: st.kind, note: `${t(st.kind)}: ${st.name}` })} />
        <Button label={t('waFabLabel')} variant="ghost" onPress={() => openWhatsApp(`${t('waStayMsg')} ${st.name} (${t(st.kind)})`, t('waMissing'))} />
        {!!st.link && <Button label={t('moreInfo')} variant="ghost" onPress={() => Linking.openURL(st.link!)} />}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  kind: { color: colors.brand, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginTop: space.md },
  name: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  facts: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 8 },
  desc: { color: colors.muted, fontSize: 15, marginTop: space.sm, lineHeight: 22 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginTop: space.lg, marginBottom: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { color: colors.text, fontSize: 13, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, overflow: 'hidden' },
  priceBox: { marginTop: space.lg, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.brandDark, backgroundColor: colors.card },
  price: { color: colors.brand, fontSize: 17, fontWeight: '800' },
  min: { color: colors.muted, fontSize: 13, marginTop: 4 },
});
