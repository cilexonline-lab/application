export type Pin = { id: string; name: string; kind: string; lat: number; lng: number; onPress: () => void };
export type MapProps = { pins: Pin[]; selected: string | null; onSelect: (id: string | null) => void };
export const PIN_COLOR: Record<string, string> = { kClub: '#00DBFF', kBeachclub: '#FFFFFF', kBeach: '#FFFFFF', kRestaurant: '#FF6B6B', kDay: '#B6F04A', kSunset: '#FFA24A' };
