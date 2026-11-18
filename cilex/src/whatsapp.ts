import { Alert, Linking } from 'react-native';
import { WHATSAPP_NUMBER } from './config';

export async function openWhatsApp(text: string, missingMsg: string) {
  if (!WHATSAPP_NUMBER) {
    Alert.alert('Cilex', missingMsg);
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  await Linking.openURL(url);
}
