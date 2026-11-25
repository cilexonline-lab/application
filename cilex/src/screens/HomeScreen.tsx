import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Chip, EventCard, GoldCard, SectionTitle } from '../components/ui';
import { LogoWordmark } from '../components/Logo';
import { Icon, IconName } from '../components/Icon';
import { useContent } from '../content';
import { useStore } from '../store';
import { sendQuestion } from '../askWhatsApp';
import { BRAND_TAGLINE, CONTENT_URL } from '../config';
import { LANGS, setLang, useLang, useT } from '../i18n';
import { tap } from '../haptics';
import { matchesTime, monthShort, TimeFilter, todayStr } from '../utils';
import { leaveReview } from '../reviewLink';
import { colors, luxury, radius, space, type } from '../theme';

const QUICK: { kind: string; icon: IconName }[] = [
  { kind: 'table', icon: 'table' },
  { kind: 'boat', icon: 'boat' },
  { kind: 'concierge', icon: 'concierge' },
  { kind: 'apartment', icon: 'apartment' },
  { kind: 'villa', icon: 'villa' },
];
const SHORT: { key: string; label: string; icon: IconName; to: string }[] = [
  { key: 'events', label: 'tonight', icon: 'clubs', to: 'Clubs' },
  { key: 'map', label: 'tabMap', icon: 'map', to: 'Map3D' },
  { key: 'plan', label: 'tabPlan', icon: 'plan', to: 'Plan' },
];
const TIMES: TimeFilter[] = ['all', 'tonight', 'weekend', 'week'];
const timeKey: Record<TimeFilter, string> = { all: 'all', tonight: 'tonight', weekend: 'weekend', week: 'week' };

export default function HomeScreen() {
  const t = useT();
  const lang = useLang();
  const nav = useNavigation<any>();
  const { clubs, upcoming, news, reviews, getClub, refresh, refreshing } = useContent();
  const store = useStore();
  const { name, following } = store;
  const [homeQ, setHomeQ] = useState('');
  const submitHome = async () => { if (!homeQ.trim()) return; tap(); if (await sendQuestion(homeQ, store, t)) setHomeQ(''); };
  const [club, setClub] = useState<string>('');
  const [time, setTime] = useState<TimeFilter>('all');

  const tonight = useMemo(() => upcoming.filter((e) => e.date === todayStr()), [upcoming]);
  const mine = useMemo(() => upcoming.filter((e) => e.lineup.some((a) => following.includes(a))), [upcoming, following]);
  const list = upcoming.filter((e) => (!club || e.clubId === club) && matchesTime(e.date, time));

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={{ padding: space.md, paddingBottom: 48 }}
      refreshControl={CONTENT_URL ? <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.brand} /> : undefined}
    >
      <View style={{ alignItems: 'center', marginTop: space.md, marginBottom: space.lg }}>
        <View style={s.langRow}>
          {LANGS.map((l) => (
            <Pressable key={l} accessibilityRole="button" accessibilityState={{ selected: l === lang }} onPress={() => setLang(l)} hitSlop={{ top: 14, bottom: 14, left: 6, right: 6 }}>
              <Text style={[s.lang, l === lang && s.langOn]}>{l.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Info" onPress={() => nav.navigate('Info')} hitSlop={12} style={{ position: 'absolute', right: 0, top: 0 }}>
          <Icon name="info" size={24} color={colors.muted} />
        </Pressable>
        <LogoWordmark width={150} />
        <Text style={s.tag}>{BRAND_TAGLINE.toUpperCase()}</Text>
        {!!name && <Text style={s.hello}>{t('hello')}, {name.split(' ')[0]}</Text>}
      </View>

      <Text style={s.heroLine}>{t('heroTitle')}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t('worldStandard')} onPress={() => { tap(); nav.navigate('Clubs'); }} style={({ pressed }) => [s.world, s.worldStd, pressed && { opacity: 0.85 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[s.worldKicker, { color: colors.brand }]}>{t('worldStandardKicker').toUpperCase()}</Text>
          <Text style={[s.worldTitle, { color: colors.text }]}>{t('worldStandard')}</Text>
          <Text style={s.worldSub}>{t('worldStandardSub')}</Text>
        </View>
        <Icon name="chevron" size={22} color={colors.brand} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('worldLuxury')} onPress={() => { tap(); nav.navigate('Request', { kind: 'concierge' }); }} style={({ pressed }) => [s.world, s.worldLux, pressed && { opacity: 0.85 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[s.worldKicker, type.luxury.kicker, { color: luxury.brand }]}>{t('worldLuxuryKicker').toUpperCase()}</Text>
          <Text style={[s.worldTitle, type.luxury.title, { color: luxury.text }]}>{t('worldLuxury')}</Text>
          <Text style={[s.worldSub, { color: luxury.muted }]}>{t('worldLuxurySub')}</Text>
        </View>
        <Icon name="chevron" size={22} color={luxury.brand} />
      </Pressable>

      {tonight.length > 0 ? (
        <GoldCard>
          <Text style={s.goldKicker}>{t('tonightTitle').toUpperCase()}</Text>
          {tonight.slice(0, 3).map((e) => (
            <Pressable key={e.id} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} style={s.goldRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.goldTitle} numberOfLines={1}>{e.title}</Text>
                <Text style={s.goldSub}>{getClub(e.clubId)?.name}{e.lineup.length ? ` · ${e.lineup.slice(0, 2).join(', ')}` : ''}</Text>
              </View>
              <Icon name="chevron" size={18} color="#001014" />
            </Pressable>
          ))}
        </GoldCard>
      ) : (
        null
      )}

      {/* Barra "Scrivi al tuo concierge": niente IA, invio diretto su WhatsApp col messaggio pronto. */}
      <View style={s.askBar}>
        <Icon name="ask" size={18} color={colors.brand} />
        <TextInput
          style={s.askBarInput}
          value={homeQ}
          onChangeText={setHomeQ}
          placeholder={t('homeAsk')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('homeAsk')}
          returnKeyType="send"
          onSubmitEditing={submitHome}
        />
        <Pressable accessibilityRole="button" accessibilityLabel={t('cqSend')} onPress={submitHome} hitSlop={6} style={[s.askBarGo, !homeQ.trim() && { opacity: 0.5 }]}>
          <Icon name="send" size={16} color="#001418" stroke={2.4} />
        </Pressable>
      </View>

      <View style={s.quickRow}>
        {SHORT.map((q) => (
          <Pressable key={q.key} accessibilityRole="button" accessibilityLabel={t(q.label)} onPress={() => { tap(); nav.navigate(q.to); }} style={({ pressed }) => [s.quick, pressed && { opacity: 0.8 }]}>
            <View style={s.quickIcon}><Icon name={q.icon} size={22} color={colors.brand} /></View>
            <Text style={s.quickLabel} numberOfLines={1}>{t(q.label)}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle>{t('worldServices')}</SectionTitle>
      <View style={s.quickRow}>
        {QUICK.map((q) => (
          <Pressable
            key={q.kind}
            accessibilityRole="button"
            accessibilityLabel={t(q.kind)}
            onPress={() => { tap(); if (q.kind === 'apartment' || q.kind === 'villa') nav.navigate('Stays', { kind: q.kind }); else nav.navigate('Request', { kind: q.kind }); }}
            style={({ pressed }) => [s.quick, pressed && { opacity: 0.8 }]}
          >
            <View style={s.quickIcon}><Icon name={q.icon} size={22} color={colors.brand} /></View>
            <Text style={s.quickLabel} numberOfLines={1}>{t(q.kind)}</Text>
          </Pressable>
        ))}
      </View>


      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('itinTitle')}
        onPress={() => { tap(); nav.navigate('Itineraries'); }}
        style={({ pressed }) => [s.mapCard, pressed && { opacity: 0.85 }]}
      >
        <View style={s.quickIcon}><Icon name="plan" size={22} color={colors.brand} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.mapTitle}>{t('itinTitle')}</Text>
          <Text style={s.mapSub}>{t('itinSub')}</Text>
        </View>
        <Icon name="chevron" size={20} color={colors.muted} />
      </Pressable>

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

      <SectionTitle>{t('upcoming')}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TIMES.map((f) => (
          <Chip key={f} label={t(timeKey[f])} active={time === f} onPress={() => { tap(); setTime(f); }} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: space.sm }}>
        <Chip label={t('allClubs')} active={!club} onPress={() => setClub('')} />
        {clubs.map((c) => (
          <Chip key={c.id} label={c.name} active={club === c.id} onPress={() => { tap(); setClub(c.id); }} />
        ))}
      </ScrollView>

      {list.length === 0 && <Text style={s.muted}>{club || time !== 'all' ? t('noEventsFilter') : t('noEvents')}</Text>}
      {list.map((e) => (
        <EventCard key={e.id} ev={e} club={getClub(e.clubId)} demoLabel={t('demoTag')} onPress={() => nav.navigate('EventDetail', { eventId: e.id })} />
      ))}

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
  langRow: { position: 'absolute', left: 0, top: 2, flexDirection: 'row', gap: 10, zIndex: 1 },
  lang: { color: colors.muted, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  langOn: { color: colors.brand },
  root: { flex: 1, backgroundColor: colors.bg },
  tag: { color: colors.muted, fontSize: 11, letterSpacing: 3, marginTop: 6 },
  hello: { color: colors.text, fontSize: 15, marginTop: 10, fontWeight: '600' },
  hero: { backgroundColor: colors.cardAlt, borderColor: colors.brandDark, paddingVertical: space.lg },
  heroTitle: { color: colors.text, fontSize: 26, fontWeight: '800', lineHeight: 32 },
  heroSub: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8 },
  goldKicker: { color: '#001014', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  goldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  goldTitle: { color: '#001014', fontSize: 20, fontWeight: '800' },
  goldSub: { color: '#003844', fontSize: 14, fontWeight: '600', marginTop: 2 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  quick: { flexBasis: '30%', flexGrow: 1, alignItems: 'center', gap: 8, paddingVertical: 14, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  quickIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.brandDark },
  quickLabel: { color: colors.text, fontSize: 12, fontWeight: '600' },
  muted: { color: colors.muted, fontSize: 14, marginBottom: space.sm },
  newsDate: { color: colors.brand, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  newsTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: 4 },
  review: { width: 280, backgroundColor: colors.card, borderRadius: 22, padding: 18, justifyContent: 'space-between', gap: 12 },
  stars: { color: colors.brand, fontSize: 14, letterSpacing: 2 },
  starsOff: { color: 'rgba(255,255,255,0.18)' },
  reviewTxt: { color: colors.text, fontSize: 15, lineHeight: 22 },
  reviewBy: { color: colors.muted, fontSize: 12, letterSpacing: 0.3 },
  reviewLeave: { color: colors.brand, fontSize: 14, fontWeight: '700', marginTop: 12, alignSelf: 'flex-start' },
  heroLine: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 25, marginBottom: space.md },
  world: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, padding: space.md, minHeight: 96, marginBottom: space.sm },
  worldStd: { backgroundColor: colors.card, borderColor: colors.brand },
  worldLux: { backgroundColor: luxury.bg, borderColor: luxury.brandDark, borderWidth: StyleSheet.hairlineWidth * 2 },
  worldKicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  worldTitle: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  worldSub: { color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  askBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 999, paddingVertical: 8, paddingLeft: 16, paddingRight: 8, marginTop: space.md },
  askBarInput: { flex: 1, minWidth: 0, color: colors.text, fontSize: 15, paddingVertical: 8 },
  askBarGo: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  mapCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.brand, padding: 14, marginTop: space.md },
  mapTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  mapSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
