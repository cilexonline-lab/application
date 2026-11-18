import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button, EventCard } from '../components/ui';
import RemindersCard from '../components/RemindersCard';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { success } from '../haptics';
import { colors, space } from '../theme';

export default function ArtistScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { name } = useRoute<any>().params;
  const { eventsByArtist, getClub } = useContent();
  const { isFollowing, toggleFollow } = useStore();
  const list = eventsByArtist(name);
  const on = isFollowing(name);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md }}>
      <Banner name={name} height={130} />
      <Text style={{ color: colors.muted, letterSpacing: 2, fontSize: 12, marginTop: space.md }}>{t('artist').toUpperCase()}</Text>
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: space.sm }}>{name}</Text>
      <Button icon={on ? 'check' : 'plus'} label={on ? t('following') : t('follow')} variant={on ? 'ghost' : 'gold'} onPress={() => { success(); toggleFollow(name); }} />
      {!on && <Text style={{ color: colors.muted, fontSize: 13, marginTop: 8 }}>{t('followHint')}</Text>}
      <View style={{ height: space.md }} />
      {on && <RemindersCard />}
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: space.sm }}>{t('eventsOf')}</Text>
      {list.map((e) => (
        <EventCard key={e.id} ev={e} club={getClub(e.clubId)} demoLabel={t('demoTag')} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} />
      ))}
    </ScrollView>
  );
}
