import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from './ui';
import { askPermission, clearReminders, notificationsSupported } from '../notify';
import { useStore } from '../store';
import { useT } from '../i18n';
import { success } from '../haptics';
import { colors } from '../theme';

// Il permesso si chiede solo dopo il tap dell'utente, mai all'apertura dell'app.
export default function RemindersCard() {
  const t = useT();
  const { notifOn, setNotifOn } = useStore();
  const [denied, setDenied] = useState(false);

  const enable = async () => {
    const ok = await askPermission();
    setDenied(!ok);
    setNotifOn(ok);
    if (ok) success();
  };
  const disable = async () => { setNotifOn(false); await clearReminders(); };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Text style={s.h}>{t('remindersTitle').toUpperCase()}</Text>
      {!notificationsSupported ? (
        <Text style={s.p}>{t('remindersWeb')}</Text>
      ) : notifOn ? (
        <View style={{ gap: 8 }}>
          <Text style={s.p}>{t('remindersOn')} · {t('remindersNote')}</Text>
          <Button label={t('remindersOff')} variant="ghost" onPress={disable} />
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <Text style={s.p}>{t('remindersBody')}</Text>
          {denied && <Text style={[s.p, { color: colors.danger }]}>{t('remindersDenied')}</Text>}
          <Button label={t('remindersEnable')} variant="gold" onPress={enable} />
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  h: { color: colors.brand, fontWeight: '800', fontSize: 12, letterSpacing: 1.5, marginBottom: 6 },
  p: { color: colors.text, fontSize: 14, lineHeight: 20 },
});
