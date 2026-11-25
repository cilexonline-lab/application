import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EventCard, SectionTitle } from '../components/ui';
import { LogoWordmark } from '../components/Logo';
import WorldCards from '../components/WorldCards';
import { Icon, IconName } from '../components/Icon';
import { useContent } from '../content';
import { useStore } from '../store';
import { sendQuestion } from '../askWhatsApp';
import { BRAND_TAGLINE, CONTENT_URL } from '../config';
import { LANGS, setLang, useLang, useT } from '../i18n';
import { tap } from '../haptics';
import { monthShort, todayStr } from '../utils';
import { leaveReview } from '../reviewLink';
import { colors, radius, space } from '../theme';

// Home pulita: un solo messaggio, un'azione principale (scrivi al concierge), due mondi, gli eventi in un carosello.
const DISCOVER: { key: string; label: string; icon: IconName; to: string }[] = [
  { key: 'itin', label: 'itinTitle', icon: 'plan', to: 'Itineraries' },
  { key: 'map', label: 'tabMap', icon: 'map', to: 'Map3D' },
  { key: 'plan', label: 'tabPlan', icon: 'clubs', to: 'Plan' },
];

export default function HomeScreen() {
  const t = useT();
  const lang = useLang();
  const nav = useNavigation<any>();
  const { upcoming, news, reviews, getClub, refresh, refreshing } = useContent();
  const store = useStore();
  const { name, following } = store;
  const [homeQ, setHomeQ] = useState('');
  const submitHome = async () => { if (!homeQ.trim()) return; tap(); if (await sendQuestion(homeQ, store, t)) setHomeQ(''); };

  const tonight = useMemo(() => upcoming.filter((e) => e.date === todayStr()), [upcoming]);
  const mine = useMemo(() => upcoming.filter((e) => e.lineup.some((a) => following.includes(a))), [upcoming, following]);
  const carousel = (tonight.length ? tonight : upcoming).slice(0, 8);

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={{ padding: space.md, paddingBottom: 56 }}
      refreshControl={CONTENT_URL ? <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.brand} /> : undefined}
    >
      <View style={s.top}>
        <View style={s.langRow}>
          {LANGS.map((l) => (
            <Pressable key={l} accessibilityRole="button" accessibilityState={{ selected: l === lang }} onPress={() => setLang(l)} hitSlop={{ top: 14, bottom: 14, left: 6, right: 6 }}>
              <Text style={[s.lang, l === lang && s.langOn]}>{l.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Info" onPress={() => nav.navigate('Info')} hitSlop={12} style={s.info}>
          <Icon name="info" size={22} color={colors.muted} />
        </Pressable>
        <LogoWordmark width={118} />
        <Text style={s.tag}>{BRAND_TAGLINE.toUpperCase()}</Text>
      </View>

      <Text style={s.h1}>{!!name ? `${t('hello')}, ${name.split(' ')[0]}. ` : ''}{t('heroTitle')}</Text>

      {/* Azione principale: scrivere al concierge (WhatsApp precompilato). */}
      <View style={s.ask}>
        <TextInput
          style={s.askInput}
          value={homeQ}
          onChangeText={setHomeQ}
          placeholder={t('homeAsk')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('homeAsk')}
          returnKeyType="send"
          onSubmitEditing={submitHome}
        />
        <Pressable accessibilityRole="button" accessibilityLabel={t('cqSend')} onPress={submitHome} hitSlop={6} style={[s.askGo, !homeQ.trim() && { opacity: 0.45 }]}>
          <Icon name="send" size={18} color="#001418" stroke={2.4} />
        </Pressable>
      </View>
      <Text style={s.askNote}>{t('cqReply')}</Text>

      <View style={{ marginTop: space.lg }}>
        <WorldCards compact />
      </View>

      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{t(tonight.length ? 'tonightTitle' : 'upcoming')}</Text>
        <Text style={s.seeAll} onPress={() => { tap(); nav.navigate('Clubs'); }} accessibilityRole="button">{t('seeAll')}</Text>
      </View>
      {carousel.length === 0 ? (
        <Text style={s.muted}>{t('noEvents')}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingRight: space.md }}>
          {carousel.map((e) => (
            <Pressable key={e.id} accessibilityRole="button" onPress={() => { tap(); nav.navigate('EventDetail', { eventId: e.id }); }} style={({ pressed }) => [s.ev, pressed && { opacity: 0.85 }]}>
              <Text style={s.evDate}>{+e.date.slice(8)} {monthShort(e.date).toUpperCase()}</Text>
              <Text style={s.evTitle} numberOfLines={2}>{e.title}</Text>
              <Text style={s.evClub} numberOfLines={1}>{getClub(e.clubId)?.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={s.list}>
        {DISCOVER.map((d) => (
          <Pressable key={d.key} accessibilityRole="button" onPress={() => { tap(); nav.navigate(d.to); }} style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
            <Icon name={d.icon} size={20} color={colors.brand} />
            <Text style={s.rowTxt}>{t(d.label)}</Text>
            <Icon name="chevron" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      {mine.length > 0 && (
        <>
          <SectionTitle>{t('yourArtists')}</SectionTitle>
          {mine.slice(0, 3).map((e) => (
            <EventCard key={'m' + e.id} ev={e} club={getClub(e.clubId)} demoLabel={t('demoTag')} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} />
          ))}
        </>
      )}

      {/* Recensioni: solo vere, con consenso (src/data/reviews.ts). Senza recensioni la sezione non compare. */}
      {reviews.length > 0 && (
        <>
          <SectionTitle>{t('reviewsTitle')}</SectionTitle>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingRight: space.md }}>
            {reviews.slice(0, 12).map((r) => (
              <View key={r.id} style={s.review}>
                {!!r.rating && (
                  <Text style={s.stars} accessibilityLabel={`${r.rating}/5`}>
                    {'★'.repeat(r.rating)}<Text style={s.starsOff}>{'★'.repeat(5 - r.rating)}</Text>
                  </Text>
                )}
                <Text style={s.reviewTxt} numberOfLines={7}>“{r.text}”</Text>
                <Text style={s.reviewBy} numberOfLines={1}>{r.name} · {t('src_' + r.source)} · {monthShort(r.date)} {r.date.slice(0, 4)}</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={s.reviewLeave} onPress={() => { tap(); leaveReview(t('reviewWaMsg'), t('waMissing')); }}>{t('reviewsLeave')}</Text>
        </>
      )}

      {news.length > 0 && (
        <>
          <SectionTitle>{t('news')}</SectionTitle>
          {news.map((n) => (
            <Pressable key={n.id} accessibilityRole="button" onPress={() => nav.navigate('NewsStory', { id: n.id })}>
              <Card style={{ marginBottom: space.sm }}>
                <Text style={s.newsDate}>{n.date}{n.demo ? ` · ${t('demoTag')}` : ''}</Text>
                <Text style={s.newsTitle}>{n.title}</Text>
              </Card>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { alignItems: 'center', marginTop: space.sm, marginBottom: space.md },
  langRow: { position: 'absolute', left: 0, top: 2, flexDirection: 'row', gap: 10, zIndex: 1 },
  lang: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  langOn: { color: colors.brand },
  info: { position: 'absolute', right: 0, top: 0 },
  tag: { color: colors.muted, fontSize: 10, letterSpacing: 3, marginTop: 6 },
  h1: { color: colors.text, fontSize: 27, fontWeight: '800', lineHeight: 33, marginTop: space.md },
  ask: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingVertical: 6, paddingLeft: 20, paddingRight: 6, marginTop: space.md },
  askInput: { flex: 1, minWidth: 0, color: colors.text, fontSize: 16, paddingVertical: 10 },
  askGo: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  askNote: { color: colors.muted, fontSize: 12, marginTop: 8, marginLeft: 6 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 36, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  seeAll: { color: colors.brand, fontSize: 14, fontWeight: '700', paddingVertical: 8 },
  ev: { width: 210, minHeight: 112, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, justifyContent: 'space-between' },
  evDate: { color: colors.brand, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  evTitle: { color: colors.text, fontSize: 17, fontWeight: '700', lineHeight: 22, marginTop: 6 },
  evClub: { color: colors.muted, fontSize: 13, marginTop: 8 },
  list: { marginTop: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowTxt: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '600' },
  muted: { color: colors.muted, fontSize: 14, marginBottom: space.sm },
  newsDate: { color: colors.brand, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  newsTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: 4 },
  review: { width: 280, backgroundColor: colors.card, borderRadius: 22, padding: 18, justifyContent: 'space-between', gap: 12 },
  stars: { color: colors.brand, fontSize: 14, letterSpacing: 2 },
  starsOff: { color: 'rgba(255,255,255,0.18)' },
  reviewTxt: { color: colors.text, fontSize: 15, lineHeight: 22 },
  reviewBy: { color: colors.muted, fontSize: 12, letterSpacing: 0.3 },
  reviewLeave: { color: colors.brand, fontSize: 14, fontWeight: '700', marginTop: 12, alignSelf: 'flex-start' },
});
