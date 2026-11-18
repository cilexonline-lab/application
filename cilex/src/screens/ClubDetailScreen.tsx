import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button, Card, EventCard, SectionTitle } from '../components/ui';
import { useContent } from '../content';
import { useT } from '../i18n';
import { colors, space } from '../theme';

export default function ClubDetailScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { clubId } = useRoute<any>().params;
  const { getClub, upcoming } = useContent();
  const club = getClub(clubId);
  if (!club) return null;
  const list = upcoming.filter((e) => e.clubId === club.id);
  const q = encodeURIComponent(club.mapQuery || `${club.name} Ibiza`);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}>
      <Banner name={club.name} imageUrl={club.imageUrl} height={170} />
      <Text style={s.name}>{club.name}</Text>
      {!!club.description && <Text style={s.desc}>{club.description}</Text>}

      <View style={{ gap: space.sm, marginVertical: space.md }}>
        <Button label={club.ticketUrl ? t('tickets') : t('ticketsSoon')} disabled={!club.ticketUrl} onPress={() => Linking.openURL(club.ticketUrl)} />
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Button style={{ flex: 1, paddingHorizontal: 8 }} icon="table" label={t('table')} variant="ghost" onPress={() => nav.navigate('Request', { kind: 'table', clubId: club.id })} />
        </View>
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  name: { color: colors.text, fontSize: 32, fontWeight: '800', letterSpacing: 1, marginTop: space.md },
  desc: { color: colors.muted, fontSize: 15, marginTop: space.sm, lineHeight: 22 },
});
