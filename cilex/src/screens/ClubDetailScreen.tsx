import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, EventCard, SectionTitle } from '../components/ui';
import { seePhotosUrl } from '../photos';
import { ClubHero } from '../components/ClubCard';
import { useContent } from '../content';
import { useT } from '../i18n';
import { colors, space } from '../theme';

export default function ClubDetailScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { clubId } = useRoute<any>().params;
  const { getClub, upcoming } = useContent();
  const insets = useSafeAreaInsets();
  const club = getClub(clubId);
  if (!club) return null;
  const list = upcoming.filter((e) => e.clubId === club.id);
  const q = encodeURIComponent(club.mapQuery || `${club.name} Ibiza`);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
      <ClubHero club={club} topInset={insets.top + 44} />
      <View style={{ paddingHorizontal: space.md }}>
      {!!club.area && <Text style={s.area}>{club.area.toUpperCase()}</Text>}
      <Text style={s.name}>{club.name}</Text>
      {!!club.description && <Text style={s.desc}>{club.description}</Text>}

      <View style={{ gap: space.sm, marginVertical: space.md }}>
        {/* Azione principale: richiesta a Cilex (modulo con data, persone e ID richiesta → WhatsApp). */}
        <Button icon="table" label={t('bookTableCilex')} onPress={() => nav.navigate('Request', { kind: 'table', clubId: club.id })} />
        <Button label={club.ticketUrl ? t('tickets') : t('ticketsSoon')} variant="ghost" disabled={!club.ticketUrl} onPress={() => Linking.openURL(club.ticketUrl)} />
        <Button icon="camera" label={t('seePhotos')} variant="ghost" onPress={() => Linking.openURL(seePhotosUrl(club.name, club.area))} />
        <Button icon="map" label={t('openMaps')} variant="ghost" onPress={() => Linking.openURL(`http://maps.apple.com/?q=${q}`)} />
      </View>

      {!!club.rules && (
        <Card style={{ marginBottom: space.sm }}>
          <Text style={{ color: colors.brand, fontWeight: '800', fontSize: 12, letterSpacing: 1.5, marginBottom: 6 }}>{t('goodToKnow').toUpperCase()}</Text>
          <Text style={{ color: colors.text, fontSize: 14, lineHeight: 21 }}>{club.rules}</Text>
        </Card>
      )}

      <SectionTitle>{t('eventsOf')}</SectionTitle>
      {list.length === 0 && <Text style={{ color: colors.muted }}>{t('noEventsFilter')}</Text>}
      {list.map((e) => (
        <EventCard key={e.id} ev={e} club={club} demoLabel={t('demoTag')} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} />
      ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  area: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', letterSpacing: 2.4, marginTop: space.md },
  name: { color: colors.text, fontSize: 32, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  desc: { color: colors.muted, fontSize: 15, marginTop: space.sm, lineHeight: 22 },
});
