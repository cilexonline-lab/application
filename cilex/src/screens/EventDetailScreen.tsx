import React from 'react';
import { Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Banner, Button, Chip, SectionTitle } from '../components/ui';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { success } from '../haptics';
import { fmtDate } from '../utils';
import { colors, space } from '../theme';

export default function EventDetailScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { eventId } = useRoute<any>().params;
  const { isPlanned, toggle } = useStore();
  const { getEvent, getClub } = useContent();
  const ev = getEvent(eventId);
  if (!ev) return null;
  const club = getClub(ev.clubId);
  const ticket = ev.ticketUrl || club?.ticketUrl || '';
  const planned = isPlanned(ev.id);

  const share = async () => {
    try {
      await Share.share({ message: `${t('shareMsg')}: ${ev.title} – ${club?.name}, ${fmtDate(ev.date)}${ticket ? `\n${ticket}` : ''}` });
    } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}>
      <Banner name={club?.name ?? ev.title} imageUrl={ev.imageUrl || club?.imageUrl} height={150} />
      <Text style={s.date}>{fmtDate(ev.date)}{ev.demo ? ` · ${t('demoTag')}` : ''}</Text>
      <Text style={s.title}>{ev.title}</Text>
      {club && <Text style={s.club} onPress={() => nav.navigate('ClubDetail', { clubId: club.id })}>{club.name} ›</Text>}

      {ev.lineup.length > 0 && (
        <>
          <SectionTitle>{t('lineup')}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {ev.lineup.map((a) => (
              <Chip key={a} label={a} onPress={() => nav.navigate('Artist', { name: a })} />
            ))}
          </View>
        </>
      )}

      <View style={{ gap: space.sm, marginTop: space.lg }}>
        <Button label={ticket ? t('tickets') : t('ticketsSoon')} disabled={!ticket} onPress={() => Linking.openURL(ticket)} />
        <Button icon={planned ? 'check' : 'plus'} label={planned ? t('inPlan') : t('addPlan')} variant="ghost" onPress={() => { success(); toggle(ev.id); }} />
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Button style={{ flex: 1, paddingHorizontal: 8 }} icon="table" label={t('table')} variant="ghost" onPress={() => nav.navigate('Request', { kind: 'table', clubId: ev.clubId, date: ev.date })} />
        </View>
        <Button icon="share" label={t('share')} variant="ghost" onPress={share} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  date: { color: colors.brand, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: space.md },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginVertical: 6 },
  club: { color: colors.muted, fontSize: 16 },
});
