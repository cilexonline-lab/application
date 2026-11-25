import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ScreenTitle } from '../components/ui';
import { Icon } from '../components/Icon';
import { useContent } from '../content';
import { useLang, useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { tap } from '../haptics';
import { colors, space } from '../theme';

const ROLE: Record<string, string> = { beach: 'roleBeach', lunch: 'roleLunch', sunset: 'roleSunset', dinner: 'roleDinner', night: 'roleNight', afternoon: 'roleAfternoon' };

// Itinerari: ogni tappa rimanda a un luogo o a un club già presenti nell'app. Niente prezzi né orari.
export default function ItinerariesScreen() {
  const t = useT();
  const lang = useLang();
  const nav = useNavigation<any>();
  const { itineraries, places, getClub } = useContent();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 64 }}>
      <ScreenTitle style={s.h1}>{t('itinTitle')}</ScreenTitle>
      <Text style={s.sub}>{t('itinSub')}</Text>
      {itineraries.map((it) => {
        const stops = it.stops
          .map((st) => {
            if (st.ref === 'club') { const c = getClub(st.id); return c ? { key: `c-${st.id}`, name: c.name, st, open: () => nav.navigate('ClubDetail', { clubId: c.id }) } : null; }
            const p = places.find((x) => x.id === st.id);
            return p ? { key: `p-${st.id}`, name: p.name, st, open: () => nav.navigate('PlaceDetail', { placeId: p.id }) } : null;
          })
          .filter(Boolean) as { key: string; name: string; st: (typeof it.stops)[number]; open: () => void }[];
        if (!stops.length) return null;
        return (
          <Card key={it.id} style={{ marginBottom: space.md }}>
            <Text style={s.title}>{it.title[lang]}</Text>
            <Text style={s.intro}>{it.intro[lang]}</Text>
            {!!it.season && <Text style={s.season}>{it.season[lang]}</Text>}
            {stops.map((x, i) => (
              <Pressable key={x.key} accessibilityRole="button" onPress={() => { tap(); x.open(); }} style={s.stop}>
                <View style={s.num}><Text style={s.numTxt}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.role}>{t(ROLE[x.st.role] ?? 'roleBeach').toUpperCase()}</Text>
                  <Text style={s.name}>{x.name}</Text>
                  {!!x.st.note && <Text style={s.note}>{x.st.note[lang]}</Text>}
                </View>
                <Icon name="chevron" size={18} color={colors.muted} />
              </Pressable>
            ))}
            <Button icon="ask" variant="ghost" label={t('itinAsk')} onPress={() => openWhatsApp(`${t('itinAskMsg')} ${it.title[lang]} (${stops.map((x) => x.name).join(' → ')})`, t('waMissing'))} style={{ marginTop: space.sm }} />
          </Card>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'left' },
  sub: { color: colors.muted, fontSize: 15, marginTop: 4, marginBottom: space.md },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  season: { color: colors.brand, fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: space.sm },
  stop: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, minHeight: 56, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,219,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  numTxt: { color: colors.brand, fontSize: 13, fontWeight: '800' },
  role: { color: colors.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 2 },
  note: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
