import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button, Card, Chip, ScreenTitle } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import type { Stay, StayKind } from '../stays';
import { colors, space } from '../theme';

export const stayFacts = (st: Stay, t: (k: string) => string) =>
  [st.bedrooms != null ? `${t('bedrooms')} ${st.bedrooms}` : '', st.bathrooms != null ? `${t('bathrooms')} ${st.bathrooms}` : '', st.guests != null ? `${t('guestsMax')} ${st.guests}` : ''].filter(Boolean).join(' · ');

export default function StaysScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const params = (useRoute<any>().params ?? {}) as { kind?: StayKind };
  const { stays } = useContent();
  const [kind, setKind] = useState<StayKind | 'all'>(params.kind ?? 'all');
  const [area, setArea] = useState('');
  const areas = useMemo(() => Array.from(new Set(stays.filter((x) => kind === 'all' || x.kind === kind).map((x) => x.area).filter(Boolean) as string[])), [stays, kind]);
  const list = stays.filter((x) => (kind === 'all' || x.kind === kind) && (!area || x.area === area));

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space.md, paddingBottom: 110 }}
      data={list}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={
        <View>
          <ScreenTitle style={s.h1}>{t('staysTitle')}</ScreenTitle>
          <Text style={s.sub}>{t('staysSub')}</Text>
          <View style={s.row}>
            <Chip label={t('allStays')} active={kind === 'all'} onPress={() => { setKind('all'); setArea(''); }} />
            <Chip label={t('apartment')} active={kind === 'apartment'} onPress={() => { setKind('apartment'); setArea(''); }} />
            <Chip label={t('villa')} active={kind === 'villa'} onPress={() => { setKind('villa'); setArea(''); }} />
          </View>
          {areas.length > 1 && (
            <View style={s.row}>
              <Chip label={`${t('areaL')}: ${t('allStays')}`} active={!area} onPress={() => setArea('')} />
              {areas.map((a) => <Chip key={a} label={a} active={area === a} onPress={() => setArea(area === a ? '' : a)} />)}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={{ color: colors.muted, lineHeight: 22 }}>{t('staysSoon')}</Text>}
      renderItem={({ item }) => {
        const facts = stayFacts(item, t);
        return (
          <Pressable accessibilityRole="button" onPress={() => nav.navigate('StayDetail', { stayId: item.id })} style={({ pressed }) => [{ marginBottom: space.lg }, pressed && { opacity: 0.9 }]}>
            <Banner name={item.name} imageUrl={item.imageUrl} height={170} />
            <Text style={s.kindTxt}>{t(item.kind).toUpperCase()}{item.area ? ` · ${item.area}` : ''}{item.demo ? ` · ${t('demoTag')}` : ''}</Text>
            <Text style={s.name}>{item.name}</Text>
            {!!facts && <Text style={s.facts}>{facts}</Text>}
            <Text style={s.price}>{item.priceNote ?? t('priceOnRequest')}</Text>
          </Pressable>
        );
      }}
      ListFooterComponent={
        <Card style={{ marginTop: space.sm }}>
          <Text style={s.ctaTitle}>{t('staysCtaTitle')}</Text>
          <Text style={s.ctaBody}>{t('staysCtaBody')}</Text>
          <Button label={t('staysCtaBtn')} onPress={() => nav.navigate('Request', { kind: kind === 'all' ? 'villa' : kind })} style={{ marginTop: space.md }} />
        </Card>
      }
    />
  );
}

const s = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: space.xs },
  sub: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space.sm, marginBottom: space.sm },
  kindTxt: { color: colors.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 10 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 2 },
  facts: { color: colors.muted, fontSize: 13, marginTop: 4 },
  price: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 4 },
  ctaTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  ctaBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
});
