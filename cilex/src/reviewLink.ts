import { Linking } from 'react-native';
import { REVIEW_URL } from './config';
import { openWhatsApp } from './whatsapp';

// Apre il link per lasciare una recensione (REVIEW_URL in config.ts) oppure, se manca, WhatsApp col team.
export function leaveReview(waText: string, waMissing: string) {
  if (/^https:\/\//.test(REVIEW_URL)) return Linking.openURL(REVIEW_URL);
  return openWhatsApp(waText, waMissing);
}
