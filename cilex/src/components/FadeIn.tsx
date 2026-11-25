// Entrata morbida (dissolvenza + piccolo scorrimento) con ritardo a scalare. Con "Riduci movimento" nessuna animazione.
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, ViewStyle } from 'react-native';

export default function FadeIn({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: ViewStyle }) {
  const v = useRef(new Animated.Value(0)).current;
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => {
      if (!live) return;
      if (r) { setSkip(true); return; }
      Animated.timing(v, { toValue: 1, duration: 480, delay: 90 * index, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
    }).catch(() => { v.setValue(1); });
    return () => { live = false; };
  }, [index, v]);
  if (skip) return <>{children}</>;
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>{children}</Animated.View>;
}
