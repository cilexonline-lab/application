// Richiesta Luxury: stessa logica della Richiesta (WhatsApp precompilato, ID, salvataggio in "Le tue richieste") con identità oro.
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import DateRangePicker from '../components/DateRangePicker';
import { Icon } from '../components/Icon';
import { useStore } from '../store';
import { getLang, useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { fmtDate, requestRef, todayStr } from '../utils';
import { success, tap } from '../haptics';
import { luxury, radius, space, type } from '../theme';

export default function LuxuryRequestScreen() {
  const t = useT();
  const { kind, service } = (useRoute<any>().params ?? {}) as { kind: string; service: string };
  const store = useStore();
  const range = kind === 'villa' || kind === 'apartment';
  const [date, setDate] = useState('');
  const [end, setEnd] = useState('');
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');

  const send = async () => {
    if (!date || date < todayStr()) { setErr(t('errDate')); return; }
    setErr('');
    const ref = requestRef();
    const pf = store.prefs || { diet: '', music: '', occasion: '' };
    const lines = [
      `Cilex App · ${ref}`,
      `${t('lxReqKind').toUpperCase()} · ${t(service)}`,
      `${t(range ? 'checkIn' : 'date')}: ${fmtDate(date)} (${date})`,
      range && end ? `${t('checkOut')}: ${fmtDate(end)} (${end})` : '',
      `${t('people')}: ${people}`,
      notes.trim() ? `${t('notes')}: ${notes.trim()}` : '',
      pf.diet.trim() ? `${t('prefsDiet')}: ${pf.diet.trim()}` : '',
      pf.music.trim() ? `${t('prefsMusic')}: ${pf.music.trim()}` : '',
      pf.occasion.trim() ? `${t('prefsOccasion')}: ${pf.occasion.trim()}` : '',
      store.prCode?.trim() ? `PR: ${store.prCode.trim()}` : '',
      `${t('cqLang')}: ${getLang().toUpperCase()}`,
    ].filter(Boolean);
    const msg = lines.join('\n');
    success();
    store.addRequest({ ref, at: new Date().toISOString(), kind: 'lxReqKind', msg, q: t(service) });
    await openWhatsApp(msg, t('waMissing'));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: luxury.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 72 }} keyboardShouldPersistTaps="handled">
        <Text style={[s.kicker, type.luxury.kicker]}>{t('lxReqKind').toUpperCase()}</Text>
        <Text style={[s.h1, type.luxury.title]}>{t(service)}</Text>
        <View style={s.rule} />
        <Text style={s.sub}>{t('lxReqNote')}</Text>

        <Text style={[s.label, type.luxury.kicker]}>{t(range ? 'checkIn' : 'date').toUpperCase()}</Text>
        <View style={[s.box, !!err && { borderColor: luxury.danger }]}>
          <DateRangePicker accent={luxury.brand} single={!range} start={date} end={range ? end : ''} onChange={(a, b) => { setDate(a); setEnd(b); setErr(''); }} />
          {!!date && <Text style={s.sel}>{fmtDate(date)}{range && end ? ` → ${fmtDate(end)}` : ''}</Text>}
        </View>
        {!!err && <Text style={s.err}>{err}</Text>}

        <Text style={[s.label, type.luxury.kicker]}>{t('people').toUpperCase()}</Text>
        <View style={s.stepper}>
          <Pressable accessibilityLabel="-" accessibilityRole="button" onPress={() => { tap(); setPeople((p) => Math.max(1, p - 1)); }} style={s.stepBtn}><Icon name="minus" size={20} color={luxury.brand} /></Pressable>
          <Text style={s.count}>{people}</Text>
          <Pressable accessibilityLabel="+" accessibilityRole="button" onPress={() => { tap(); setPeople((p) => Math.min(99, p + 1)); }} style={s.stepBtn}><Icon name="plus" size={20} color={luxury.brand} /></Pressable>
        </View>

        <Text style={[s.label, type.luxury.kicker]}>{t('notes').toUpperCase()}</Text>
        <TextInput style={s.input} value={notes} onChangeText={setNotes} placeholder={t('lxReqHolder')} placeholderTextColor={luxury.muted} multiline textAlignVertical="top" maxLength={600} accessibilityLabel={t('notes')} />

        <Text style={s.cancel}>{t('noCancel')}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={t('cqSend')} onPress={send} style={({ pressed }) => [s.send, pressed && { opacity: 0.85 }]}>
          <Icon name="send" size={18} color="#0A0805" stroke={2.2} />
          <Text style={s.sendTxt}>{t('cqSend')}</Text>
        </Pressable>
        <Text style={s.fine}>{t('lxPrivate')} {t('replyPromise')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  kicker: { color: luxury.brand, fontSize: 11 },
  h1: { color: luxury.text, fontSize: 34, marginTop: 6, letterSpacing: 2 },
  rule: { height: StyleSheet.hairlineWidth * 2, backgroundColor: luxury.brandDark, width: 64, marginVertical: space.md },
  sub: { color: luxury.muted, fontSize: 14, lineHeight: 21, marginBottom: space.md },
  label: { color: luxury.brandDark, fontSize: 11, marginTop: space.lg, marginBottom: space.sm },
  box: { backgroundColor: luxury.card, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: luxury.border, padding: space.sm },
  sel: { color: luxury.brand, fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: space.sm },
  err: { color: luxury.danger, fontSize: 13, marginTop: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  stepBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: luxury.brandDark, alignItems: 'center', justifyContent: 'center' },
  count: { color: luxury.text, fontSize: 26, fontWeight: '300', minWidth: 40, textAlign: 'center' },
  input: { backgroundColor: luxury.card, color: luxury.text, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: luxury.border, padding: 14, fontSize: 16, minHeight: 110 },
  cancel: { color: luxury.text, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: space.lg },
  send: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: luxury.brand, borderRadius: 999, minHeight: 54, marginTop: space.sm },
  sendTxt: { color: '#0A0805', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  fine: { color: luxury.muted, fontSize: 12, textAlign: 'center', marginTop: space.md, lineHeight: 18 },
});
