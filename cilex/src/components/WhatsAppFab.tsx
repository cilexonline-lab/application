import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../i18n';
import { tap } from '../haptics';
import { openWhatsApp } from '../whatsapp';

// Widget WhatsApp fisso su ogni sezione: apre la chat con il team Cilex (numero in src/config.ts).
const TAB_ROUTES: Record<string, string> = { Home: 'tabHome', Clubs: 'tabClubs', Map3D: 'tabMap', Ask: 'tabAsk', Plan: 'tabPlan', Request: 'tabRequest' };
const TAB_BAR = 49;

export default function WhatsAppFab({ route }: { route?: string }) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const name = route ?? 'Home';
  const onTabs = name in TAB_ROUTES;
  let bottom = onTabs ? TAB_BAR + insets.bottom + 14 : insets.bottom + 18;
  const pos: any = { right: 14, bottom };
  // Mappa: piccolo, in alto a destra accanto al titolo, così non copre la costa ovest (Sant Antoni, Cala Comte, tramonti) né la scheda in basso.
  const small = name === 'Map3D';
  if (small) { delete pos.bottom; pos.top = insets.top + 4; pos.right = 14; pos.width = 40; pos.height = 40; pos.borderRadius = 20; } // finisce a safe+44, i filtri iniziano a safe+48

  // In Chiedi il contatto col team è già in alto e sotto le risposte: il pulsante coprirebbe la chat.
  if (name === 'Ask') return null;

  const press = () => {
    tap();
    const ctx = onTabs ? `\n(${t(TAB_ROUTES[name])})` : '';
    openWhatsApp(`${t('waFabMsg')}${ctx}`, t('waMissing'));
  };
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('waFabLabel')} onPress={press} hitSlop={small ? 4 : 0} style={({ pressed }) => [s.fab, pos, pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] }]}>
        <Svg width={small ? 22 : 30} height={small ? 22 : 30} viewBox="0 0 24 24">
          <Path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l5-1.3A9.8 9.8 0 1 0 12 2.2z" stroke="#fff" strokeWidth={1.7} strokeLinejoin="round" fill="none" />
          <Path d="M8.6 7.8c-.3.3-.7 1-.4 1.9.5 1.4 1.5 2.6 2.8 3.6 1.1.9 2.3 1.4 3.2 1.5.7 0 1.2-.4 1.4-.9l.1-.5-1.6-.9-.7.6c-.3.2-.6.2-1-.1a6.6 6.6 0 0 1-2.5-2.5c-.2-.4-.1-.7.1-.9l.5-.6-.8-1.7-.5-.1c-.4 0-.5 0-.6.1z" fill="#fff" />
        </Svg>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  fab: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: '#25D366', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)',
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 6px 18px rgba(0,0,0,0.45)' } as any) : { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8 }),
  },
});
