// Calendario intervallo (arrivo → partenza), fatto in casa: nessuna dipendenza. Settimana da lunedì, date passate disabilitate.
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { useLang } from '../i18n';
import { todayStr } from '../utils';
import { colors, radius, space } from '../theme';

type Props = { start: string; end: string; onChange: (start: string, end: string) => void; hint?: string; single?: boolean; accent?: string };
const iso = (y: number, m: number, d: number) => todayStr(new Date(y, m, d));

// single = un solo giorno (tavolo, barca…); altrimenti periodo arrivo → partenza.
export default function DateRangePicker({ start, end, onChange, hint, single, accent }: Props) {
  const ac = accent || colors.brand;
  const lang = useLang();
  const today = todayStr();
  const first = start || today;
  const [ym, setYm] = useState({ y: +first.slice(0, 4), m: +first.slice(5, 7) - 1 });

  const monthLabel = new Date(ym.y, ym.m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(lang, { weekday: 'narrow' })), [lang]);
  const longDay = (s: string) => new Date(s + 'T12:00:00').toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const cells = useMemo(() => {
    const offset = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7; // lunedì = 0
    const days = new Date(ym.y, ym.m + 1, 0).getDate();
    const out: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= days; d++) out.push(iso(ym.y, ym.m, d));
    while (out.length % 7) out.push(null);
    return out;
  }, [ym]);

  const atMin = ym.y === +today.slice(0, 4) && ym.m <= +today.slice(5, 7) - 1;
  const go = (delta: number) => { const d = new Date(ym.y, ym.m + delta, 1); setYm({ y: d.getFullYear(), m: d.getMonth() }); };

  const pick = (day: string) => {
    if (day < today) return;
    if (single) return onChange(day, '');
    if (!start || (start && end)) return onChange(day, '');
    if (day <= start) return onChange(day, '');
    onChange(start, day);
  };

  return (
    <View>
      <View style={s.nav}>
        <Pressable accessibilityRole="button" accessibilityLabel="‹" disabled={atMin} onPress={() => go(-1)} style={[s.navBtn, atMin && { opacity: 0.3 }]} hitSlop={6}>
          <View style={{ transform: [{ rotate: '180deg' }] }}><Icon name="chevron" size={20} color={colors.text} /></View>
        </Pressable>
        <Text style={s.month} accessibilityRole="header">{monthLabel}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="›" onPress={() => go(1)} style={s.navBtn} hitSlop={6}>
          <Icon name="chevron" size={20} color={colors.text} />
        </Pressable>
      </View>
      <View style={s.row}>{weekdays.map((w, i) => <Text key={i} style={s.wd}>{w.toUpperCase()}</Text>)}</View>
      <View style={s.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e${i}`} style={s.cell} />;
          const past = day < today;
          const isStart = day === start, isEnd = day === end;
          const inRange = !!start && !!end && day > start && day < end;
          return (
            <Pressable
              key={day}
              accessibilityRole="button"
              accessibilityLabel={longDay(day)}
              accessibilityState={{ disabled: past, selected: isStart || isEnd }}
              disabled={past}
              onPress={() => pick(day)}
              style={[s.cell, inRange && [s.inRange, !!accent && { backgroundColor: ac + '29' }], (isStart || isEnd) && [s.edge, { backgroundColor: ac }], isStart && !!end && s.edgeL, isEnd && s.edgeR]}
            >
              <Text style={[s.day, past && { opacity: 0.3 }, (isStart || isEnd) && { color: '#001418', fontWeight: '800' }, day === today && !isStart && !isEnd && { color: ac }]}>{+day.slice(8)}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!hint && <Text style={s.hint}>{hint}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  navBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  month: { color: colors.text, fontSize: 16, fontWeight: '800', textTransform: 'capitalize' },
  row: { flexDirection: 'row' },
  wd: { width: '14.2857%', textAlign: 'center', color: colors.muted, fontSize: 11, fontWeight: '700', marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', height: 44, alignItems: 'center', justifyContent: 'center' },
  day: { color: colors.text, fontSize: 15 },
  inRange: { backgroundColor: 'rgba(0,219,255,0.16)' },
  edge: { backgroundColor: colors.brand, borderRadius: radius.md },
  edgeL: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  edgeR: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  hint: { color: colors.muted, fontSize: 12, marginTop: space.sm, textAlign: 'center' },
});
