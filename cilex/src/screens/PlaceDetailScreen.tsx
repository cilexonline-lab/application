import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import { kindKey } from './ExploreScreen';
import { colors, space } from '../theme';

export default function PlaceDetailScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { placeId } = useRoute<any>().params;
  const { places } = useContent();
  const p = places.find((x) => x.id === placeId);
  if (!p) return null;
  const q = p.lat != null && p.lng != null
    ? `ll=${p.lat},${p.lng}&q=${encodeURIComponent(p.name)}`
    : `q=${encodeURIComponent(p.mapQuery || `${p.name} Ibiza`)}`;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}>
      <Banner name={p.name} imageUrl={p.imageUrl} height={170} />
      <Text style={s.kind}>{t(kindKey(p.kind)).toUpperCase()}{p.area ? ` · ${p.area}` : ''}</Text>
      <Text style={s.name}>{p.name}</Text>
      {!!p.description && <Text style={s.desc}>{p.description}</Text>}
      <View style={{ gap: space.sm, marginTop: space.md }}>
        {p.bookable && (
          <Button icon="concierge" label={t('bookViaCilex')} onPress={() => nav.navigate('Request', { kind: 'concierge', note: p.name })} />
        )}
        {!!p.link && <Button label={t('openLink')} variant="ghost" onPress={() => Linking.openURL(p.link!)} />}
        <Button icon="map" label={t('openMaps2')} variant="ghost" onPress={() => Linking.openURL(`http://maps.apple.com/?${q}`)} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  kind: { color: colors.brand, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginTop: space.md },
  name: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 4 },
  desc: { color: colors.muted, fontSize: 15, marginTop: space.sm, lineHeight: 22 },
});
