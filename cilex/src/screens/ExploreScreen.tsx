import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Banner, Chip, ScreenTitle } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import type { Place, PlaceKind } from '../places';
import { colors, space } from '../theme';

type Seg = 'club' | 'beach' | 'restaurant' | 'day';
const SEGS: { k: Seg; label: string }[] = [
  { k: 'club', label: 'segClubs' }, { k: 'beach', label: 'segBeach' }, { k: 'restaurant', label: 'segEat' }, { k: 'day', label: 'segDay' },
];
export const kindKey = (k: PlaceKind) => ({ beachclub: 'kBeachclub', beach: 'kBeach', restaurant: 'kRestaurant', day: 'kDay' }[k]);
const kindsOf = (seg: Seg): PlaceKind[] => (seg === 'beach' ? ['beachclub', 'beach'] : seg === 'restaurant' ? ['restaurant'] : seg === 'day' ? ['day'] : []);

export default function ExploreScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { clubs, upcoming, places } = useContent();
  const [seg, setSeg] = useState<Seg>('club');
  const list: Place[] = places.filter((p) => kindsOf(seg).includes(p.kind));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: space.md, paddingTop: space.sm }}>
        <ScreenTitle style={s.h1}>{t('exploreTitle')}</ScreenTitle>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space.md, columnGap: 0, rowGap: space.sm, paddingBottom: space.sm }}>
        {SEGS.map((x) => <Chip key={x.k} label={t(x.label)} active={seg === x.k} onPress={() => setSeg(x.k)} />)}
      </View>

      {seg === 'club' && (
        <FlatList
          contentContainerStyle={{ padding: space.md }}
          columnWrapperStyle={{ gap: space.sm }}
          numColumns={2}
          data={clubs}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => {
            const n = upcoming.filter((e) => e.clubId === item.id).length;
            return (
              <Pressable accessibilityRole="button" style={s.tile} onPress={() => nav.navigate('ClubDetail', { clubId: item.id })}>
                <Banner name={item.name} imageUrl={item.imageUrl} height={110} />
                <View style={{ paddingTop: 10, paddingHorizontal: 4 }}>
                  <Text style={s.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={s.sub}>{n === 1 ? t('eventCount1') : `${n} ${t('eventsCount')}`}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {(seg === 'beach' || seg === 'restaurant' || seg === 'day') && (
        <FlatList
          contentContainerStyle={{ padding: space.md }}
          data={list}
          keyExtractor={(p) => p.id}
          ListEmptyComponent={<Text style={{ color: colors.muted }}>{t('placesSoon')}</Text>}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => nav.navigate('PlaceDetail', { placeId: item.id })} style={{ marginBottom: space.md }}>
              <Banner name={item.name} imageUrl={item.imageUrl} height={120} />
              <Text style={s.kindTxt}>{t(kindKey(item.kind)).toUpperCase()}{item.area ? ` · ${item.area}` : ''}{item.demo ? ` · ${t('demoTag')}` : ''}</Text>
              <Text style={s.name2}>{item.name}</Text>
              {!!item.description && <Text style={s.sub} numberOfLines={2}>{item.description}</Text>}
            </Pressable>
          )}
        />
      )}

    </View>
  );
}

const s = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: space.sm },
  tile: { flexBasis: '48.5%', maxWidth: '48.5%', flexGrow: 0, marginBottom: space.md },
  name: { color: colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  name2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  sub: { color: colors.muted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  kindTxt: { color: colors.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 10 },
});
