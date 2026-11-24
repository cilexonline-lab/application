import React, { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, EventCard, GoldCard, ScreenTitle } from '../components/ui';
import { Icon } from '../components/Icon';
import RemindersCard from '../components/RemindersCard';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { success } from '../haptics';
import { daysUntil, fmtDate, fmtLong, parseDate } from '../utils';
import { colors, radius, space } from '../theme';
import { leaveReview } from '../reviewLink';
import { openWhatsApp } from '../whatsapp';

const toInput = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');

export default function PlanScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { planned, outfits, setOutfit, toggle, arrival, departure, setTrip } = useStore();
  const { events, getClub } = useContent();
  const [a, setA] = useState(toInput(arrival));
  const [d, setD] = useState(toInput(departure));
  const [err, setErr] = useState('');

  const list = events.filter((e) => planned.includes(e.id));
  const days = Array.from(new Set(list.map((e) => e.date))).sort();

  let trip = '';
  if (arrival) {
    const n = daysUntil(arrival);
    if (n > 1) trip = t('tripIn').replace('{n}', String(n));
    else if (n === 1) trip = t('tripTomorrow');
    else if (!departure || daysUntil(departure) >= 0) trip = t('tripToday').replace('{n}', String(1 - n));
  }

  const saveTrip = () => {
    const A = a.trim() ? parseDate(a, new Date(), true) : '';
    const D = d.trim() ? parseDate(d, new Date(), true) : '';
    if ((a.trim() && !A) || (d.trim() && !D) || (A && D && D < A)) return setErr(t('errTrip'));
    setErr('');
    success();
    setTrip(A ?? '', D ?? '');
  };

  const sharePlan = async () => {
    const lines = [`${t('sharePlanMsg')} 🌴`];
    days.forEach((day) => {
      lines.push('', fmtLong(day));
      list.filter((e) => e.date === day).forEach((e) => {
        const o = outfits[e.id]?.trim();
        lines.push(`• ${e.title} – ${getClub(e.clubId)?.name}${o ? ` (${o})` : ''}`);
      });
    });
    try { await Share.share({ message: lines.join('\n') }); } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md, paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
      <ScreenTitle style={s.h1}>{t('planTitle')}</ScreenTitle>
      <RemindersCard />

      {!!trip && (
        <GoldCard style={{ marginBottom: space.md }}>
          <Text style={{ color: '#001014', fontSize: 22, fontWeight: '800' }}>{trip}</Text>
        </GoldCard>
      )}

      {/* Dopo la partenza: grazie, recensione vera e prossimo viaggio. */}
      {!!departure && daysUntil(departure) < 0 && (
        <Card style={{ marginBottom: space.md }}>
          <Text style={s.doneTitle}>{t('tripDoneTitle')}</Text>
          <Text style={s.doneBody}>{t('tripDoneBody')}</Text>
          <Button label={t('reviewsLeave')} onPress={() => { success(); leaveReview(t('reviewWaMsg'), t('waMissing')); }} style={{ marginTop: space.md }} />
          <Button variant="ghost" label={t('tripDoneTeam')} onPress={() => openWhatsApp(t('waFabMsg'), t('waMissing'))} style={{ marginTop: space.sm }} />
        </Card>
      )}

      <Card style={{ marginBottom: space.md }}>
        <Text style={s.label}>{t('yourTrip')}</Text>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={s.small}>{t('arrival')}</Text>
            <TextInput style={[s.input, s.dateInput]} value={a} onChangeText={setA} placeholder={t('dateHint')} placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.small}>{t('departure')}</Text>
            <TextInput style={[s.input, s.dateInput]} value={d} onChangeText={setD} placeholder={t('dateHint')} placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        {!!err && <Text style={{ color: colors.danger, marginTop: 8 }}>{err}</Text>}
        <Button label={t('saveTrip')} variant="ghost" onPress={saveTrip} style={{ marginTop: space.sm }} />
      </Card>

      {list.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: space.lg, gap: space.md }}>
          <Icon name="plan" size={44} color={colors.brandDark} />
          <Text style={{ color: colors.muted, textAlign: 'center', lineHeight: 21 }}>{t('planEmpty')}</Text>
          <Button label={t('browse')} variant="ghost" onPress={() => nav.navigate('Home')} />
        </View>
      )}

      {days.map((day) => {
        const items = list.filter((e) => e.date === day);
        return (
          <View key={day} style={{ marginBottom: space.md }}>
            <Text style={s.day}>{fmtLong(day)}</Text>
            {items.length > 1 && <Text style={s.clash}>⚠ {t('clash')}</Text>}
            {items.map((e) => (
              <View key={e.id} style={{ marginBottom: space.sm }}>
                <EventCard ev={e} club={getClub(e.clubId)} demoLabel={t('demoTag')} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} />
                <TextInput
                  value={outfits[e.id] ?? ''}
                  onChangeText={(x) => setOutfit(e.id, x)}
                  placeholder={`${t('outfit')}: ${t('outfitHint')}`}
                  placeholderTextColor={colors.muted}
                  multiline
                  style={[s.input, { minHeight: 52 }]}
                />
                <Text style={s.remove} onPress={() => toggle(e.id)}>{t('remove')}</Text>
              </View>
            ))}
          </View>
        );
      })}

      {list.length > 0 && <Button icon="share" label={t('sharePlan')} onPress={sharePlan} />}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  doneTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  doneBody: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: space.md },
  label: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: space.sm },
  small: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  // Date affiancate: su iPhone SE "GG/MM/AAAA" deve entrare intero.
  dateInput: { paddingHorizontal: 10, fontSize: 14 },
  input: { backgroundColor: colors.cardAlt, color: colors.text, borderRadius: radius.md, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  day: { color: colors.brand, fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  clash: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  remove: { color: colors.muted, fontSize: 13, marginTop: 8, textAlign: 'right', textDecorationLine: 'underline' },
});
