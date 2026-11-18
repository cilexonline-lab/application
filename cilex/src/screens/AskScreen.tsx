import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Chip, ScreenTitle } from '../components/ui';
import { LogoWordmark } from '../components/Logo';
import { Icon } from '../components/Icon';
import { AI_AVAILABLE, AiError, askAI, ChatMsg } from '../ai';
import { useStore } from '../store';
import { useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { tap } from '../haptics';
import { colors, radius, space } from '../theme';

type Row = { id: number; role: 'user' | 'assistant'; text: string; failed?: boolean };
const SUGG = ['sugg1', 'sugg2', 'sugg3', 'sugg4'];

export default function AskScreen() {
  const t = useT();
  const { aiConsent, setAiConsent, deviceId } = useStore();
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
    try {
      const reply = await askAI(history, deviceId);
      setRows((r) => [...r, { id: next.current++, role: 'assistant', text: reply }]);
    } catch (e) {
      const limited = e instanceof AiError && e.kind === 'rate_limited';
      setRows((r) => [...r, { id: next.current++, role: 'assistant', text: limited ? t('askLimit') : t('askError'), failed: true }]);
    } finally {
      setBusy(false);
    }
  };

  const report = (row: Row) => {
    const q = [...rows].reverse().find((r) => r.id < row.id && r.role === 'user')?.text ?? '';
    openWhatsApp(`Report AI answer\nQ: ${q}\nA: ${row.text}`, t('waMissing'));
  };

  if (!AI_AVAILABLE) {
    return (
      <View style={[s.root, { padding: space.lg, justifyContent: 'center', gap: space.md }]}>
        <View style={{ alignItems: 'center' }}><LogoWordmark width={150} /></View>
        <Text style={[s.h1, { textAlign: 'center' }]}>{t('askTitle')}</Text>
        <Text style={[s.sub, { textAlign: 'center' }]}>{t('askSoon')}</Text>
        <Button label={t('askTeam')} onPress={() => openWhatsApp('Hi Cilex!', t('waMissing'))} />
      </View>
    );
  }

  if (!aiConsent) {
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
      {rows.length > 0 && <View style={{ paddingHorizontal: space.md, paddingTop: space.sm }}><LogoWordmark width={84} /></View>}
      <ScrollView ref={scroll} contentContainerStyle={{ padding: space.md, paddingBottom: space.lg }} keyboardShouldPersistTaps="handled">
        {rows.length === 0 && (
          <>
            <ScreenTitle style={s.h1}>{t('askTitle')}</ScreenTitle>
            <Text style={[s.sub, { marginBottom: space.md }]}>{t('askSub')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {SUGG.map((k) => (
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
            {r.role === 'assistant' && !r.failed && (
              <Text style={s.report} onPress={() => report(r)}>{t('askReport')}</Text>
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

      <Text style={s.disclaimer}>{t('askDisclaimer')}</Text>
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
  report: { color: colors.muted, fontSize: 12, marginTop: 4, marginLeft: 6, textDecorationLine: 'underline' },
  disclaimer: { color: colors.muted, fontSize: 11, textAlign: 'center', paddingHorizontal: space.md, marginBottom: 6 },
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.md, paddingBottom: space.md },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, borderRadius: 22, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 16, minHeight: 46, maxHeight: 110 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
});
