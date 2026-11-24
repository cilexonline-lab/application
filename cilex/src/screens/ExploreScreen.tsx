import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Banner, Chip, ScreenTitle } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import type { Place, PlaceKind } from '../places';
import { colors, space } from '../theme';
import { ClubCard } from '../components/ClubCard';
import { tap } from '../haptics';

type Seg = 'club' | 'beach' | 'restaurant' | 'sunset' | 'day';
const SEGS: { k: Seg; label: string }[] = [
  { k: 'club', label: 'segClubs' }, { k: 'beach', label: 'segBeach' }, { k: 'restaurant', label: 'segEat' }, { k: 'sunset', label: 'segSunset' }, { k: 'day', label: 'segDay' },
];
export const kindKey = (k: PlaceKind) => ({ beachclub: 'kBeachclub', beach: 'kBeach', restaurant: 'kRestaurant', day: 'kDay', sunset: 'kSunset' }[k]);
const kindsOf = (seg: Seg): PlaceKind[] => (seg === 'beach' ? ['beach', 'beachclub'] : seg === 'restaurant' ? ['restaurant'] : seg === 'sunset' ? ['sunset'] : seg === 'day' ? ['day'] : []);
// Sotto-filtro della sezione Mare.
type Sea = '' | 'beach' | 'beachclub';
const SEA: { k: Sea; label: string }[] = [{ k: '', label: 'seaAll' }, { k: 'beach', label: 'seaBeaches' }, { k: 'beachclub', label: 'seaClubs' }];

export default function ExploreScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { clubs, upcoming, places } = useContent();
  const [seg, setSeg] = useState<Seg>('club');
  const [sea, setSea] = useState<Sea>('');
  const kinds = kindsOf(seg);
  // Spiagge prima dei beach club, poi l'ordine del file.
  const list: Place[] = places
    .filter((p) => kinds.includes(p.kind) && (seg !== 'beach' || !sea || p.kind === sea))
    .map((p, i) => ({ p, i }))
    .sort((a, b) => kinds.indexOf(a.p.kind) - kinds.indexOf(b.p.kind) || a.i - b.i)
    .map((x) => x.p);
  const curated = list.some((p) => !p.demo);
  const [area, setArea] = useState('');
  const areas = ['', ...Array.from(new Set(clubs.map((c) => c.area).filter((a): a is string => !!a)))];
  // Prima i club con eventi in arrivo, poi gli altri nell'ordine originale.
  const shownClubs = clubs
    .filter((c) => !area || c.area === area)
    .map((c, i) => ({ c, i, has: upcoming.some((e) => e.clubId === c.id) }))
    .sort((a, b) => Number(b.has) - Number(a.has) || a.i - b.i)
    .map((x) => x.c);

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
          contentContainerStyle={{ paddingHorizontal: space.md, paddingBottom: 120 }}
          data={shownClubs}
          keyExtractor={(c) => c.id}
          ListHeaderComponent={
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: space.md }}>
              {areas.map((a) => (
                <Chip key={a || 'all'} label={a || t('allAreas')} active={area === a} onPress={() => { tap(); setArea(a); }} />
              ))}
            </ScrollView>
          }
          renderItem={({ item, index }) => (
            <ClubCard
              club={item}
              index={index}
              next={upcoming.filter((e) => e.clubId === item.id).sort((a, b) => a.date.localeCompare(b.date))[0]}
              labels={{ next: t('nextLabel'), soon: t('datesSoon'), table: t('table') }}
              onOpen={() => nav.navigate('ClubDetail', { clubId: item.id })}
              onTable={() => nav.navigate('Request', { kind: 'table', clubId: item.id })}
            />
          )}
        />
      )}

      {seg !== 'club' && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: space.md, paddingTop: space.xs, paddingBottom: 120 }}
          data={list}
          ListHeaderComponent={
            <View style={{ marginBottom: space.md }}>
              {curated && <Text style={s.curTitle}>{t('curatedTitle').toUpperCase()}</Text>}
              {curated && <Text style={s.curSub}>{t('curatedSub')}</Text>}
              {seg === 'beach' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: space.sm }}>
                  {SEA.map((x) => <Chip key={x.k || 'all'} label={t(x.label)} active={sea === x.k} onPress={() => { tap(); setSea(x.k); }} />)}
                </ScrollView>
              )}
            </View>
          }
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
  name2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  sub: { color: colors.muted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  curTitle: { color: colors.brand, fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  curSub: { color: colors.muted, fontSize: 12, marginTop: 3, lineHeight: 17 },
  kindTxt: { color: colors.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 10 },
});
