import { SHOW_DEMO_DATA } from '../config';

export type NewsItem = { id: string; title: string; date: string; body: string; imageUrl?: string; demo?: boolean };

const real: NewsItem[] = [];
const demo: NewsItem[] = [
  { id: 'n-demo', title: 'News di esempio', date: '2027-05-20', body: 'Questo è un testo di esempio. Sostituiscilo con le notizie reali (JSON remoto o src/data/news.ts).', demo: true },
];
export const bundledNews: NewsItem[] = [...real, ...(SHOW_DEMO_DATA ? demo : [])];
