import * as Haptics from 'expo-haptics';

export const tap = () => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} };
export const success = () => { try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {} };
