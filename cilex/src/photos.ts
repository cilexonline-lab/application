// "Vedi foto": nessuna foto copiata o salvata. Apre una pagina pubblica (Instagram ufficiale se noto, altrimenti Google Maps).
export function seePhotosUrl(name: string, area?: string, link?: string): string {
  if (link && /^https?:\/\/(www\.)?instagram\.com\//i.test(link)) return link;
  const q = encodeURIComponent([name, area, 'Ibiza'].filter(Boolean).join(' '));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
