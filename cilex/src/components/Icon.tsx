import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home' | 'clubs' | 'plan' | 'request' | 'info' | 'share' | 'table' | 'boat'
  | 'ask' | 'send' | 'concierge' | 'apartment' | 'villa' | 'chevron' | 'map' | 'check' | 'plus' | 'minus'
  | 'products' | 'music' | 'umbrella' | 'dining' | 'cocktail' | 'party' | 'compass' | 'yacht' | 'sparkle' | 'camera' | 'car' | 'jet';

// Set di icone "duotone": tratto pulito + riempimento tenue dello stesso colore (profondità senza peso).
export function Icon({ name, size = 22, color = '#fff', stroke = 1.8 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const f = { ...p, fill: color, fillOpacity: 0.16 };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && <Path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...f} />}
      {name === 'clubs' && (<><Circle cx="12" cy="12" r="9" {...f} /><Circle cx="12" cy="12" r="3" {...p} /></>)}
      {name === 'plan' && (<><Rect x="3" y="5" width="18" height="16" rx="2.5" {...f} /><Path d="M3 10h18M8 3v4M16 3v4" {...p} /></>)}
      {name === 'request' && <Path d="M12 3l2.6 5.6L20 9.5l-4 4 1 5.8-5-2.8-5 2.8 1-5.8-4-4 5.4-.9z" {...f} />}
      {name === 'info' && (<><Circle cx="12" cy="12" r="9" {...f} /><Path d="M12 11v6M12 7.5v.01" {...p} /></>)}
      {name === 'share' && <Path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M8 7l4-4 4 4" {...p} />}
      {name === 'table' && (<><Path d="M8 3h8l-1 7a3 3 0 0 1-6 0z" {...f} /><Path d="M12 13v7M8 21h8" {...p} /></>)}
      {name === 'boat' && (<><Path d="M3 16l2 4h14l2-4z" {...f} /><Path d="M12 3v9M12 4l6 7h-6" {...p} /></>)}
      {name === 'concierge' && (<><Path d="M6 17v-6a6 6 0 0 1 12 0v6z" {...f} /><Path d="M4 17h16M10 20h4M12 3.5V5" {...p} /></>)}
      {name === 'apartment' && (<><Path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16z" {...f} /><Path d="M15 10h3a1 1 0 0 1 1 1v10M3 21h18M8.5 8h3M8.5 12h3M8.5 16h3" {...p} /></>)}
      {name === 'villa' && (<><Path d="M5.5 10.5V20h13v-9.5L12 5z" {...f} /><Path d="M3 12l9-8 9 8M10 20v-5h4v5M16 7V4.5h2V9" {...p} /></>)}
      {name === 'ask' && (<><Path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" {...f} /><Path d="M9 10.5h6M9 13.5h3.5" {...p} /></>)}
      {name === 'send' && <Path d="M12 19V5M5 12l7-7 7 7" {...p} />}
      {name === 'chevron' && <Path d="M9 6l6 6-6 6" {...p} />}
      {name === 'map' && (<><Path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" {...f} /><Circle cx="12" cy="10" r="2.5" {...p} /></>)}
      {name === 'check' && <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'products' && (<><Path d="M6.5 3h11l4 6L12 21 2.5 9z" {...f} /><Path d="M2.5 9h19M9 3L7 9l5 12M15 3l2 6-5 12" {...p} /></>)}
      {name === 'music' && (<><Path d="M4 14v-2a8 8 0 0 1 16 0v2" {...p} /><Rect x="3.5" y="14" width="4" height="7" rx="1.5" {...f} /><Rect x="16.5" y="14" width="4" height="7" rx="1.5" {...f} /></>)}
      {name === 'umbrella' && (<><Path d="M3 12a9 9 0 0 1 18 0z" {...f} /><Path d="M12 12v7a2 2 0 0 0 4 0M12 3v0" {...p} /></>)}
      {name === 'dining' && (<><Path d="M6 3v6a2.5 2.5 0 0 0 5 0V3M8.5 3v18" {...p} /><Path d="M17 21V3c-2.2 1.6-3.2 4.2-3.2 7.2H17" {...f} /></>)}
      {name === 'cocktail' && (<><Path d="M4 4h16l-8 9z" {...f} /><Path d="M12 13v7M8 21h8M15.5 3l3-1.5" {...p} /></>)}
      {name === 'party' && (<><Path d="M3 21l5-13 8 8z" {...f} /><Path d="M14 4v2.5M20 10h-2.5M16.5 6.5l1.8-1.8M11 3.5v.01M20.5 5v.01" {...p} /></>)}
      {name === 'compass' && (<><Circle cx="12" cy="12" r="9" {...f} /><Path d="M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5z" {...p} /></>)}
      {name === 'yacht' && (<><Path d="M3 17h18l-3 4H6z" {...f} /><Path d="M12 3v13M12 4.5l6.5 10.5H12M12 7.5L6.5 15H12" {...p} /></>)}
      {name === 'sparkle' && <Path d="M12 3c.9 5 3 7.1 8 9-5 1.9-7.1 4-8 9-.9-5-3-7.1-8-9 5-1.9 7.1-4 8-9z" {...f} />}
      {name === 'car' && (<><Path d="M3.5 17v-4l2-5.5h13l2 5.5v4z" {...f} /><Path d="M3.5 13h17M6 17v2M18 17v2" {...p} /><Circle cx="8" cy="15.2" r="0.6" {...p} /><Circle cx="16" cy="15.2" r="0.6" {...p} /></>)}
      {name === 'jet' && (<><Path d="M12 2.5c1 0 1.7 1 1.7 2.4V10l8 4.6v2.2l-8-2.2v4.1l2.3 1.7v1.7L12 20.8 8 22v-1.7l2.3-1.7v-4.1l-8 2.2v-2.2l8-4.6V4.9c0-1.4.7-2.4 1.7-2.4z" {...f} /></>)}
      {name === 'camera' && (<><Path d="M4 8h3l2-3h6l2 3h3v11H4z" {...f} /><Circle cx="12" cy="13" r="3.5" {...p} /></>)}
    </Svg>
  );
}
