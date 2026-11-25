// CODICE IA SPENTO (non collegato alla navigazione). Riaccendere: tornare a usare questa schermata in App.tsx al posto di AskScreen.
// Tenuto di proposito: vedi docs/HANDOFF.md e backend/ai-worker.
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Chip, ScreenTitle } from '../components/ui';
import { LogoWordmark } from '../components/Logo';
import { Icon, IconName } from '../components/Icon';
import { AI_AVAILABLE, AiError, askAI, ChatMsg } from '../ai';
import { AskAction, detectActions, resolveActions } from '../intents';
import { useContent } from '../content';
import { useStore } from '../store';
import { useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { tap } from '../haptics';
import { colors, radius, space } from '../theme';

type Row = { id: number; role: 'user' | 'assistant'; text: string; failed?: boolean; actions?: AskAction[]; q?: string; sugg?: string[] };
// Suggerimenti: prima i servizi (portano richieste), poi una domanda su Ibiza.
const SUGG_AI = ['suggTable', 'suggBoat', 'suggVilla', 'sugg1'];
const SUGG_LOCAL = ['suggTable', 'suggBoat', 'suggVilla', 'suggEvents'];
const ICON: Record<string, IconName> = { table: 'table', boat: 'boat', concierge: 'concierge', villa: 'villa', apartment: 'apartment', club: 'clubs', event: 'clubs', explore: 'clubs', map: 'map', plan: 'plan', whatsapp: 'ask' };

export default function AskScreen() {
  const t = useT();
  const nav = useNavigation<any>();
  const { aiConsent, setAiConsent, deviceId } = useStore();
  const { clubs, upcoming, getClub, getEvent } = useContent();
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scroll = useRef<any>(null);
  const next = useRef(1);

  useEffect(() => { setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50); }, [rows, busy]);

  const send = async (text: string) => {
    const q = text.trim().slice(0, 500);
    if (!q || busy) return;
    tap();
    setInput('');
    const history: ChatMsg[] = [
      ...rows.filter((r) => !r.failed).map((r) => ({ role: r.role, content: r.text } as ChatMsg)),
      { role: 'user', content: q },
    ];
    setRows((r) => [...r, { id: next.current++, role: 'user', text: q }]);
    setBusy(true);
    const local = detectActions(q, clubs, upcoming);
    try {
      if (!AI_AVAILABLE) {
        // Senza IA: porta il cliente alla sezione giusta, oppure al team.
        await new Promise((res) => setTimeout(res, 350));
        const actions = local.length ? local : [{ type: 'whatsapp', target: '' } as AskAction];
        setRows((r) => [...r, { id: next.current++, role: 'assistant', text: t(local.length ? 'askLocalFound' : 'askLocalNone'), actions, q }]);
        return;
      }
      const { reply, actions, suggestions } = await askAI(history, deviceId);
      const server = resolveActions(actions, clubs, upcoming);
      setRows((r) => [...r, { id: next.current++, role: 'assistant', text: reply, actions: server.length ? server : local, q, sugg: suggestions }]);
    } catch (e) {
      const limited = e instanceof AiError && e.kind === 'rate_limited';
      setRows((r) => [...r, { id: next.current++, role: 'assistant', text: limited ? t('askLimit') : t('askError'), failed: true }]);
    } finally {
      setBusy(false);
    }
  };

  const label = (a: AskAction) => {
    switch (a.type) {
      case 'table': { const c = getClub(a.target); return c ? `${t('actTable')} · ${c.name}` : t('actTable'); }
      case 'club': return `${t('actOpen')} ${getClub(a.target)?.name ?? ''}`.trim();
      case 'event': return getEvent(a.target)?.title ?? t('actClubs');
      case 'explore': return t(a.target === 'beach' ? 'actBeach' : a.target === 'restaurant' ? 'actFood' : a.target === 'day' ? 'actDay' : 'actClubs');
      default: return t({ boat: 'actBoat', concierge: 'actConcierge', villa: 'actVilla', apartment: 'actApartment', map: 'actMap', plan: 'actPlan', whatsapp: 'actTeam' }[a.type] ?? 'actTeam');
    }
  };
  const SEG: Record<string, string> = { club: 'club', beach: 'beach', restaurant: 'restaurant', day: 'day' };
  const run = (a: AskAction) => {
    tap();
    switch (a.type) {
      case 'table': return nav.navigate('Request', { kind: 'table', clubId: a.target || '' });
      case 'boat': case 'concierge': return nav.navigate('Request', { kind: a.type });
      case 'villa': case 'apartment': return nav.navigate('Stays', { kind: a.type });
      case 'club': return nav.navigate('ClubDetail', { clubId: a.target });
      case 'event': return nav.navigate('EventDetail', { eventId: a.target });
      case 'explore': return nav.navigate('Clubs', { seg: SEG[a.target] ?? 'club' });
      case 'map': return nav.navigate('Map3D');
      case 'plan': return nav.navigate('Plan');
      default: return handoff();
    }
  };
  // Passaggio al team senza far ripetere nulla: il messaggio WhatsApp contiene le ultime domande del cliente.
  const handoff = () => {
    tap();
    const asked = rows.filter((r) => r.role === 'user').slice(-3).map((r) => `• ${r.text}`);
    openWhatsApp(asked.length ? `${t('askHandoff')}\n${asked.join('\n')}` : t('waFabMsg'), t('waMissing'));
  };

  const report = (row: Row) => {
    const q = [...rows].reverse().find((r) => r.id < row.id && r.role === 'user')?.text ?? '';
    openWhatsApp(`Report AI answer\nQ: ${q}\nA: ${row.text}`, t('waMissing'));
  };

  if (AI_AVAILABLE && !aiConsent) {
    return (
      <View style={[s.root, { padding: space.lg, justifyContent: 'center', gap: space.lg }]}>
        <View style={{ alignItems: 'center' }}><LogoWordmark width={150} /></View>
        <Card>
          <Text style={[s.h1, { fontSize: 22 }]}>{t('askConsentTitle')}</Text>
          <Text style={[s.sub, { marginVertical: space.md, lineHeight: 22 }]}>{t('askConsentBody')}</Text>
          <Button label={t('askAccept')} onPress={() => setAiConsent(true)} />
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={s.head}>
        {rows.length > 0 ? <LogoWordmark width={84} /> : <View />}
        <Pressable accessibilityRole="button" accessibilityLabel={t('askTeam')} onPress={handoff} hitSlop={8} style={({ pressed }) => [s.teamPill, pressed && { opacity: 0.75 }]}>
          <Icon name="ask" size={15} color={colors.brand} stroke={2} />
          <Text style={s.teamTxt}>{t('askTeamShort')}</Text>
        </Pressable>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: space.md, paddingBottom: space.lg }} keyboardShouldPersistTaps="handled">
        {rows.length === 0 && (
          <>
            <ScreenTitle style={s.h1}>{t('askTitle')}</ScreenTitle>
            <Text style={[s.sub, { marginBottom: space.md }]}>{t(AI_AVAILABLE ? 'askSub' : 'askSubLocal')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {(AI_AVAILABLE ? SUGG_AI : SUGG_LOCAL).map((k) => (
                <Chip key={k} label={t(k)} onPress={() => send(t(k))} />
              ))}
            </View>
          </>
        )}
        {rows.map((r) => (
          <View key={r.id} style={{ marginBottom: space.sm, alignItems: r.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <View style={[s.bubble, r.role === 'user' ? s.user : s.bot]}>
              <Text style={[s.msg, r.role === 'user' && { color: '#111' }]} selectable>{r.text}</Text>
            </View>
            {r.role === 'assistant' && !!r.actions?.length && (
              <View style={s.actions}>
                {r.actions.map((a, i) => (
                  <Pressable key={a.type + a.target} accessibilityRole="button" onPress={() => run(a)} style={({ pressed }) => [s.act, i === 0 && s.actMain, pressed && { opacity: 0.75 }]}>
                    <Icon name={ICON[a.type] ?? 'chevron'} size={16} color={i === 0 ? '#001418' : colors.brand} stroke={2} />
                    <Text style={[s.actTxt, i === 0 && { color: '#001418' }]} numberOfLines={1}>{label(a)}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {AI_AVAILABLE && r.role === 'assistant' && !r.failed && (
              <Text style={s.report} onPress={() => report(r)}>{t('askReport')}</Text>
            )}
            {r.role === 'assistant' && !!r.sugg?.length && r.id === rows[rows.length - 1]?.id && !busy && (
              <View style={[s.actions, { marginTop: 10 }]}>
                {r.sugg.map((q) => <Chip key={q} label={q} onPress={() => send(q)} />)}
              </View>
            )}
            {r.role === 'assistant' && r.failed && (
              <Text style={s.report} onPress={() => openWhatsApp('Hi Cilex!', t('waMissing'))}>{t('askTeam')}</Text>
            )}
          </View>
        ))}
        {busy && (
          <View style={{ alignItems: 'flex-start', marginBottom: space.sm }}>
            <View style={[s.bubble, s.bot]}><Text style={[s.msg, { color: colors.muted }]}>{t('askThinking')}</Text></View>
          </View>
        )}
      </ScrollView>

      {AI_AVAILABLE && <Text style={s.disclaimer}>{t('askDisclaimer')}</Text>}
      <View style={s.bar}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('askPlaceholder')}
          placeholderTextColor={colors.muted}
          maxLength={500}
          multiline
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
          blurOnSubmit
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={() => send(input)} disabled={busy || !input.trim()} style={[s.sendBtn, (busy || !input.trim()) && { opacity: 0.4 }]}>
          <Icon name="send" size={22} color="#111" stroke={2.4} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'left' },
  sub: { color: colors.muted, fontSize: 15, marginTop: 4 },
  bubble: { maxWidth: '88%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.lg },
  user: { backgroundColor: colors.brand, borderBottomRightRadius: 6 },
  bot: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 6 },
  msg: { color: colors.text, fontSize: 15, lineHeight: 22 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.md, paddingTop: space.sm, paddingBottom: 6, minHeight: 48, backgroundColor: colors.bg, zIndex: 2, overflow: 'hidden' },
  teamPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,219,255,0.45)', paddingVertical: 7, paddingHorizontal: 12 },
  teamTxt: { color: colors.brand, fontSize: 13, fontWeight: '700' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, maxWidth: '92%' },
  act: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,219,255,0.55)', paddingVertical: 9, paddingHorizontal: 14, maxWidth: '100%' },
  actMain: { backgroundColor: colors.brand, borderColor: colors.brand },
  actTxt: { color: colors.brand, fontSize: 14, fontWeight: '700', flexShrink: 1 },
  report: { color: colors.muted, fontSize: 12, marginTop: 4, marginLeft: 6, textDecorationLine: 'underline' },
  disclaimer: { color: colors.muted, fontSize: 11, textAlign: 'center', paddingHorizontal: space.md, marginBottom: 6 },
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.md, paddingBottom: space.md },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, borderRadius: 22, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 16, minHeight: 46, maxHeight: 110 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
});
