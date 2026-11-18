import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Banner } from '../components/ui';
import { useContent } from '../content';
import { colors, space } from '../theme';

export default function NewsStoryScreen() {
  const { id } = useRoute<any>().params;
  const { news } = useContent();
  const item = news.find((n) => n.id === id);
  if (!item) return null;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.md }}>
      {!!item.imageUrl && <Banner name={item.title} imageUrl={item.imageUrl} height={180} />}
      <Text style={{ color: colors.brand, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginTop: space.md }}>{item.date}</Text>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginVertical: space.sm }}>{item.title}</Text>
      <Text style={{ color: colors.muted, fontSize: 16, lineHeight: 25 }}>{item.body}</Text>
    </ScrollView>
  );
}
