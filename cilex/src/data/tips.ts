import { SHOW_DEMO_DATA } from '../config';

export type Tip = { id: string; title: string; body: string; demo?: boolean };

// ➜ Consigli utili (trasferimenti, orari, dress code, regole). Meglio gestirli dal JSON remoto.
const real: Tip[] = [];
const demo: Tip[] = [
  { id: 'tip-demo', title: 'Consiglio di esempio', body: 'Qui andranno consigli pratici confermati da voi (trasferimenti, orari, cosa sapere prima di uscire).', demo: true },
];
export const bundledTips: Tip[] = [...real, ...(SHOW_DEMO_DATA ? demo : [])];
