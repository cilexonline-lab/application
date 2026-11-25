import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { Button, Card, SectionTitle } from '../components/ui';
import { LogoOval } from '../components/Logo';
import { BRAND_TAGLINE, PRIVACY_URL, SITE_URL, SUPPORT_EMAIL, SUPPORT_URL } from '../config';
import { useContent } from '../content';
import { useT } from '../i18n';
import { openWhatsApp } from '../whatsapp';
import { colors, space } from '../theme';

export default function InfoScreen() {
  const t = useT();
  const { lastUpdated, tips } = useContent();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.lg, paddingBottom: 64 }}>
      <View style={{ alignItems: 'center', marginVertical: space.lg }}>
        <LogoOval width={210} />
        <Text style={{ color: colors.muted, letterSpacing: 3, fontSize: 11, marginTop: 6 }}>{BRAND_TAGLINE.toUpperCase()}</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 23 }}>{t('infoText')}</Text>
      <Button label={t('contact')} onPress={() => openWhatsApp('Hi Cilex!', t('waMissing'))} style={{ marginTop: space.lg }} />

      <Button label={`${t('emailUs')} · ${SUPPORT_EMAIL}`} variant="ghost" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} style={{ marginTop: space.sm }} />
      <Button label={`${t('visitSite')} · cilexibiza.com`} variant="ghost" onPress={() => Linking.openURL(SITE_URL)} style={{ marginTop: space.sm }} />

      {tips.length > 0 && (
        <>
          <SectionTitle>{t('goodToKnow')}</SectionTitle>
          {tips.map((x) => (
            <Card key={x.id} style={{ marginBottom: space.sm }}>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{x.title}{x.demo ? ` · ${t('demoTag')}` : ''}</Text>
              {!!x.body && <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 }}>{x.body}</Text>}
            </Card>
          ))}
        </>
      )}

      <View style={{ gap: space.sm, marginTop: space.lg }}>
        {!!PRIVACY_URL && <Button label={t('privacy')} variant="ghost" onPress={() => Linking.openURL(PRIVACY_URL)} />}
        {!!SUPPORT_URL && <Button label={t('support')} variant="ghost" onPress={() => Linking.openURL(SUPPORT_URL)} />}
      </View>
      {lastUpdated && (
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: space.lg }}>
          {t('updated')}: {new Date(lastUpdated).toLocaleString()}
        </Text>
      )}
    </ScrollView>
  );
}
