import { SHOW_DEMO_DATA } from '../config';

export type EventItem = {
  id: string;
  clubId: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  lineup: string[];
  // Se vuoto usa il ticketUrl del club.
  ticketUrl?: string;
  imageUrl?: string;
  demo?: boolean;
};

// ➜ Eventi reali inclusi nell'app (consigliato: usare invece il JSON remoto, CONTENT_URL).
const realEvents: EventItem[] = [];

const demoEvents: EventItem[] = [
  { id: 'demo-1', clubId: 'pacha', title: 'Evento di esempio', date: '2027-06-05', lineup: ['Artista 1', 'Artista 2'], demo: true },
  { id: 'demo-2', clubId: 'unvrs', title: 'Evento di esempio', date: '2027-06-06', lineup: ['Artista 3'], demo: true },
  { id: 'demo-3', clubId: 'amnesia', title: 'Evento di esempio', date: '2027-06-07', lineup: ['Artista 4', 'Artista 5'], demo: true },
];

export const bundledEvents: EventItem[] = [...realEvents, ...(SHOW_DEMO_DATA ? demoEvents : [])];
