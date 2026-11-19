import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Button, Chip, ScreenTitle } from '../components/ui';
import { Icon, IconName } from '../components/Icon';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { fmtDate, parseDate, requestRef, todayStr } from '../utils';
import { CONCIERGE_TOPICS } from '../config';
import { success } from '../haptics';
import { openWhatsApp } from '../whatsapp';
import { colors, radius, space } from '../theme';

type Kind = 'table' | 'boat' | 'concierge' | 'apartment' | 'villa';
const KINDS: { k: Kind; icon: IconName }[] = [
  { k: 'table', icon: 'table' },
  { k: 'boat', icon: 'boat' },
  { k: 'concierge', icon: 'concierge' },
  { k: 'apartment', icon: 'apartment' },
  { k: 'villa', icon: 'villa' },
];

const isoToInput = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

// Date rapide a un tocco (oggi + 5 giorni): niente formato da indovinare, mese scritto per esteso.
const QUICK_DAYS = 6;
const quickDates = (now = new Date()) =>
  Array.from({ length: QUICK_DAYS }, (_, i) => todayStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)));

export default function RequestScreen() {
  const t = useT();
  const params = (useRoute<any>().params ?? {}) as { kind?: Kind; clubId?: string; date?: string; note?: string };
  const { clubs, getClub } = useContent();
  const { name: savedName, setName: saveName, prCode: savedPr, setPrCode } = useStore();
  const [kind, setKind] = useState<Kind>(params.kind ?? 'table');
  const [clubId, setClubId] = useState<string>(params.clubId ?? '');
  const [name, setName] = useState(savedName);
  const [date, setDate] = useState(params.date ? isoToInput(params.date) : '');
  const [checkout, setCheckout] = useState('');
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState(params.note ?? '');
  const [error, setError] = useState('');
  const [pr, setPr] = useState(savedPr);
  const [topic, setTopic] = useState('');
  const [sentRef, setSentRef] = useState('');

  useEffect(() => {
    if (params.kind) setKind(params.kind);
    if (params.clubId !== undefined) setClubId(params.clubId);
    if (params.date) setDate(isoToInput(params.date));
    if (params.note) setNotes(params.note);
  }, [params.kind, params.clubId, params.date, params.note]);

  useEffect(() => { if (!name && savedName) setName(savedName); }, [savedName]);
  useEffect(() => { if (!pr && savedPr) setPr(savedPr); }, [savedPr]);

  const showClub = kind === 'table';
  const isApt = kind === 'apartment' || kind === 'villa';

  const send = () => {
    const iso = parseDate(date);
    if (!name.trim()) return setError(t('errName'));
    if (!iso) return setError(t('errDate'));
    if (people < 1) return setError(t('errPeople'));
    const outIso = isApt && checkout.trim() ? parseDate(checkout) : null;
    if (isApt && checkout.trim() && (!outIso || outIso <= iso)) return setError(t('errCheckOut'));
    setError('');
    saveName(name.trim());
    setPrCode(pr.trim());
    const ref = requestRef();
    setSentRef(ref);
    success();
    const lines = [
      `Cilex App · ${ref}`,
      `${t(kind)}`,
      `${t('name')}: ${name.trim()}`,
      showClub && clubId ? `${t('club')}: ${getClub(clubId)?.name}` : '',
      `${t(isApt ? 'checkIn' : 'date')}: ${fmtDate(iso)} (${iso})`,
      outIso ? `${t('checkOut')}: ${fmtDate(outIso)} (${outIso})` : '',
      `${t('people')}: ${people}`,
      kind === 'concierge' && topic ? `${t('topics')} ${t(topic)}` : '',
      notes.trim() ? `${t('notes')}: ${notes.trim()}` : '',
      pr.trim() ? `PR: ${pr.trim()}` : '',
    ].filter(Boolean);
    openWhatsApp(lines.join('\n'), t('waMissing'));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.md, paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle style={s.h1}>{t('reqTitle')}</ScreenTitle>
        <Text style={s.sub}>{t('reqSubtitle')}</Text>

        <View style={s.kinds}>
          {KINDS.map(({ k, icon }) => {
            const on = kind === k;
            return (
              <Pressable key={k} accessibilityRole="button" onPress={() => setKind(k)} style={[s.kind, on && s.kindOn]}>
                <Icon name={icon} size={22} color={on ? '#111' : colors.brand} />
                <Text style={[s.kindLabel, on && { color: '#111' }]} numberOfLines={1}>{t(k)}</Text>
              </Pressable>
            );
          })}
        </View>

        {showClub && (
          <>
            <Text style={s.label}>{t('club')}</Text>
            <View style={s.row}>
              <Chip label={t('anyClub')} active={!clubId} onPress={() => setClubId('')} />
              {clubs.map((c) => (
                <Chip key={c.id} label={c.name} active={clubId === c.id} onPress={() => setClubId(c.id)} />
              ))}
            </View>
          </>
        )}

        {kind === 'concierge' && (
          <>
            <Text style={s.label}>{t('topics')}</Text>
            <View style={s.row}>
              {CONCIERGE_TOPICS.map((k) => (
                <Chip key={k} label={t(k)} active={topic === k} onPress={() => setTopic(topic === k ? '' : k)} />
              ))}
            </View>
          </>
        )}

        <Text style={s.label}>{t('name')}</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} autoCapitalize="words" textContentType="name" placeholderTextColor={colors.muted} />

        <Text style={s.label}>{t(isApt ? 'checkIn' : 'date')}</Text>
        {!isApt && (
          <View style={s.row}>
            {quickDates().map((iso, i) => (
              <Chip
                key={iso}
                label={i === 0 ? t('dateToday') : i === 1 ? t('dateTomorrow') : fmtDate(iso)}
                active={parseDate(date) === iso}
                onPress={() => { setDate(isoToInput(iso)); setError(''); }}
              />
            ))}
          </View>
        )}
        <TextInput style={s.input} value={date} onChangeText={setDate} placeholder={isApt ? t('dateHint') : `${t('dateOther')} · ${t('dateHint')}`} keyboardType="numbers-and-punctuation" placeholderTextColor={colors.muted} />
        {isApt && (
          <>
            <Text style={s.label}>{t('checkOut')}</Text>
            <TextInput style={s.input} value={checkout} onChangeText={setCheckout} placeholder={t('dateHint')} keyboardType="numbers-and-punctuation" placeholderTextColor={colors.muted} />
          </>
        )}

        <Text style={s.label}>{t('people')}</Text>
        <View style={s.stepper}>
          <Pressable accessibilityLabel="-" onPress={() => setPeople((p) => Math.max(1, p - 1))} style={s.stepBtn}><Icon name="minus" size={20} color={colors.brand} /></Pressable>
          <Text style={s.stepVal}>{people}</Text>
          <Pressable accessibilityLabel="+" onPress={() => setPeople((p) => Math.min(99, p + 1))} style={s.stepBtn}><Icon name="plus" size={20} color={colors.brand} /></Pressable>
        </View>

        <Text style={s.label}>{t('notes')}</Text>
        <TextInput style={[s.input, { height: 90, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline placeholderTextColor={colors.muted} />

        <Text style={s.label}>{t('prCode')}</Text>
        <TextInput style={s.input} value={pr} onChangeText={setPr} autoCapitalize="characters" placeholderTextColor={colors.muted} />

        {!!error && <Text style={s.error}>{error}</Text>}
        <Button label={t('send')} onPress={send} style={{ marginTop: space.lg }} />
        {!!sentRef && <Text style={s.ref}>Ref {sentRef}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800' },
  sub: { color: colors.muted, marginTop: 4, marginBottom: space.md },
  kinds: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  kind: { flexBasis: '30%', flexGrow: 1, alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  kindOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  kindLabel: { color: colors.text, fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  label: { color: colors.text, fontWeight: '700', marginTop: space.md, marginBottom: 6 },
  input: { backgroundColor: colors.card, color: colors.text, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, fontSize: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  stepBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.brandDark, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  stepVal: { color: colors.text, fontSize: 24, fontWeight: '800', minWidth: 40, textAlign: 'center' },
  ref: { color: colors.muted, textAlign: 'center', marginTop: space.md, letterSpacing: 2, fontWeight: '700' },
  error: { color: colors.danger, marginTop: space.md, fontWeight: '600' },
});
