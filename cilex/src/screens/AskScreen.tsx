// "Scrivi al tuo concierge": nessuna IA. Il messaggio del cliente parte su WhatsApp verso il team.
// Il codice IA è conservato (AskScreenAI.tsx, src/ai.ts, backend/ai-worker) ma spento.
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Chip, ScreenTitle } from '../components/ui';
import { useStore } from '../store';
import { useT } from '../i18n';
import { sendQuestion } from '../askWhatsApp';
import { tap } from '../haptics';
import { colors, radius, space } from '../theme';

const SUGG = ['cqTable', 'cqBoat', 'cqVilla', 'cqTransfer', 'cqTonight'];

export default function AskScreen() {
  const t = useT();
  const store = useStore();
  const [text, setText] = useState('');

  const send = async () => {
    if (!text.trim()) return;
    tap();
    if (await sendQuestion(text, store, t)) setText('');
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView contentContainerStyle={{ padding: space.md, paddingTop: space.xl, paddingBottom: space.xl }} keyboardShouldPersistTaps="handled">
        <ScreenTitle style={s.h1}>{t('cqTitle')}</ScreenTitle>
        <Text style={s.sub}>{t('cqSub')}</Text>
        <TextInput
          style={s.input}
          value={text}
          onChangeText={setText}
          placeholder={t('cqPlaceholder')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('cqPlaceholder')}
          multiline
          textAlignVertical="top"
        />
        <Button label={t('cqSend')} icon="ask" onPress={send} style={{ marginTop: space.md, opacity: text.trim() ? 1 : 0.5 }} />
        <Text style={s.reply}>{t('cqReply')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: space.md }}>
          {SUGG.map((k) => <Chip key={k} label={t(k)} onPress={() => { tap(); setText(t(k)); }} />)}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  h1: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'left' },
  sub: { color: colors.muted, fontSize: 15, marginTop: 4, marginBottom: space.md, lineHeight: 22 },
  input: { backgroundColor: colors.cardAlt, color: colors.text, borderRadius: radius.md, padding: 14, fontSize: 16, borderWidth: 1, borderColor: colors.border, minHeight: 130 },
  reply: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: space.sm },
});
