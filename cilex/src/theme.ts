// Due mondi, due palette: si cambiano qui, in un punto solo.
// Standard = identità CILEX (nero + azzurro). Luxury = nero più profondo con accenti oro/champagne.
export const palettes = {
  standard: {
    bg: '#050607',
    card: '#0E1215',
    cardAlt: '#151A1E',
    border: '#232A30',
    text: '#F2F8FA',
    muted: '#8A98A0',
    brand: '#00DBFF',      // azzurro CILEX (dal logo ufficiale)
    brandDark: '#0097B3',
    danger: '#FF6B6B',
  },
  luxury: {
    bg: '#030303',
    card: '#0B0A08',
    cardAlt: '#13110D',
    border: '#2E2718',
    text: '#F5EFE0',
    muted: '#A59B84',
    brand: '#D9B96E',      // oro / champagne
    brandDark: '#A8863F',
    danger: '#FF6B6B',
  },
};
export type Palette = typeof palettes.standard;

// `colors` resta la palette Standard: tutta l'app esistente continua a funzionare invariata.
export const colors: Palette = palettes.standard;
export const luxury: Palette = palettes.luxury;

// Tipografia: Standard = peso pieno e compatto; Luxury = più leggera e spaziata.
export const type = {
  standard: { title: { fontWeight: '800' as const, letterSpacing: 0 }, kicker: { fontWeight: '800' as const, letterSpacing: 1.5 } },
  luxury: { title: { fontWeight: '300' as const, letterSpacing: 3 }, kicker: { fontWeight: '600' as const, letterSpacing: 4 } },
};

export const radius = { sm: 10, md: 16, lg: 24 };
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
