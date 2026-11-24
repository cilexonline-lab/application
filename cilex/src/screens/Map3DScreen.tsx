import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Button, Chip } from '../components/ui';
import IbizaMap from '../components/IbizaMap';
import { LogoMark } from '../components/Logo';
import type { Pin } from '../components/mapTypes';
import { useContent } from '../content';
import { useT } from '../i18n';
import { kindKey } from './ExploreScreen';
import { colors, radius, space } from '../theme';

type F = 'club' | 'beach' | 'restaurant' | 'sunset' | 'day';
const FILTERS: { k: F; label: string }[] = [{ k: 'club', label: 'segClubs' }, { k: 'beach', label: 'segBeach' }, { k: 'restaurant', label: 'segEat' }, { k: 'sunset', label: 'segSunset' }, { k: 'day', label: 'segDay' }];

export default function Map3DScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { clubs, places } = useContent();
  const [filter, setFilter] = useState<F[]>(['club', 'beach', 'restaurant', 'sunset', 'day']);
  const [sel, setSel] = useState<string | null>(null);

  const all = useMemo<Pin[]>(() => {
    const out: Pin[] = [];
    clubs.forEach((c) => { if (c.lat != null && c.lng != null) out.push({ id: 'c-' + c.id, name: c.name, kind: 'kClub', lat: c.lat, lng: c.lng, onPress: () => nav.navigate('ClubDetail', { clubId: c.id }) }); });
    places.forEach((p) => { if (p.lat != null && p.lng != null) out.push({ id: 'p-' + p.id, name: p.name, kind: kindKey(p.kind), lat: p.lat, lng: p.lng, onPress: () => nav.navigate('PlaceDetail', { placeId: p.id }) }); });
    return out;
  }, [clubs, places, nav]);

  const segOf = (kind: string): F => (kind === 'kClub' ? 'club' : kind === 'kRestaurant' ? 'restaurant' : kind === 'kDay' ? 'day' : kind === 'kSunset' ? 'sunset' : 'beach');
  const pins = useMemo(() => all.filter((p) => filter.includes(segOf(p.kind))), [all, filter]);
  const selected = pins.find((p) => p.id === sel) ?? null;
  const missing = [...clubs.filter((c) => c.lat == null).map((c) => c.name), ...places.filter((p) => p.lat == null).map((p) => p.name)];
  const toggle = (k: F) => setFilter((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));

  return (
    <View style={s.root}>
      <IbizaMap pins={pins} selected={selected ? selected.id : null} onSelect={setSel} />

      <LinearGradient pointerEvents="none" colors={['rgba(8,40,70,0.62)', 'rgba(8,40,70,0)']} style={s.topFade} />
      <View pointerEvents="box-none" style={s.top}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LogoMark width={22} />
          <Text style={s.h1}>{t('map3dTitle')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -space.md }} contentContainerStyle={{ paddingHorizontal: space.md }}>{FILTERS.map((x) => <Chip key={x.k} label={t(x.label)} active={filter.includes(x.k)} onPress={() => toggle(x.k)} />)}</ScrollView>
      </View>

      <LinearGradient pointerEvents="none" colors={['rgba(8,40,70,0)', 'rgba(8,40,70,0.88)']} style={s.botFade} />
      <View pointerEvents="box-none" style={s.bottom}>
        {selected ? (
          <View style={s.sel}>
            <Text style={s.selName}>{selected.name}</Text>
            <Text style={s.selKind}>{t(selected.kind)}</Text>
            <View style={{ flexDirection: 'row', gap: space.sm, marginTop: 10 }}>
              <Button style={{ flex: 1, paddingHorizontal: 8 }} label={t('mapDetails')} onPress={selected.onPress} />
              <Button style={{ flex: 1, paddingHorizontal: 8 }} variant="ghost" icon="map" label={t('openMaps2')} onPress={() => Linking.openURL(`http://maps.apple.com/?ll=${selected.lat},${selected.lng}&q=${encodeURIComponent(selected.name)}`)} />
            </View>
          </View>
        ) : (
          <Text style={s.hint}>{pins.length ? t('mapTap') : t('mapEmpty')}</Text>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: space.md }} style={{ flexGrow: 0 }}>
          {pins.map((p) => <Chip key={p.id} label={p.name} active={p.id === sel} onPress={() => setSel(p.id)} />)}
        </ScrollView>
        <Text style={s.credit}>
          {t('mapDrag')} · © OpenStreetMap contributors · Copernicus DEM · {t('mapIllus')}
          {missing.length > 0 ? `\n${t('mapNoPos')} ${missing.join(', ')}` : ''}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2a86be' },
  topFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 150 },
  top: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: space.md, paddingTop: space.sm },
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: space.sm },
  botFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 240 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.md, paddingBottom: space.sm },
  hint: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: space.sm },
  credit: { color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 15, marginTop: space.sm },
  sel: { backgroundColor: 'rgba(14,16,20,0.9)', borderRadius: radius.md, borderWidth: 1, borderColor: colors.brand, padding: 14, marginBottom: space.sm },
  selName: { color: colors.text, fontSize: 18, fontWeight: '800' },
  selKind: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
