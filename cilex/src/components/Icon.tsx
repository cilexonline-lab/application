import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home' | 'clubs' | 'plan' | 'request' | 'info' | 'share' | 'table' | 'boat'
  | 'ask' | 'send' | 'concierge' | 'apartment' | 'villa' | 'chevron' | 'map' | 'check' | 'plus' | 'minus';

export function Icon({ name, size = 22, color = '#fff', stroke = 1.8 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && <Path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...p} />}
      {name === 'clubs' && (<><Circle cx="12" cy="12" r="9" {...p} /><Circle cx="12" cy="12" r="3" {...p} /></>)}
      {name === 'plan' && (<><Rect x="3" y="5" width="18" height="16" rx="2.5" {...p} /><Path d="M3 10h18M8 3v4M16 3v4" {...p} /></>)}
      {name === 'request' && <Path d="M12 3l2.6 5.6L20 9.5l-4 4 1 5.8-5-2.8-5 2.8 1-5.8-4-4 5.4-.9z" {...p} />}
      {name === 'info' && (<><Circle cx="12" cy="12" r="9" {...p} /><Path d="M12 11v6M12 7.5v.01" {...p} /></>)}
      {name === 'share' && <Path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M8 7l4-4 4 4" {...p} />}
      {name === 'table' && <Path d="M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 21h8" {...p} />}
      {name === 'boat' && <Path d="M3 16l2 4h14l2-4zM12 3v9M12 4l6 7h-6" {...p} />}
      {name === 'concierge' && <Path d="M6 17v-6a6 6 0 0 1 12 0v6M4 17h16M10 20h4" {...p} />}
      {name === 'apartment' && <Path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 10h3a1 1 0 0 1 1 1v10M3 21h18M8.5 8h3M8.5 12h3M8.5 16h3" {...p} />}
      {name === 'villa' && <Path d="M3 12l9-8 9 8M5.5 10.5V20h13v-9.5M10 20v-5h4v5M16 7V4.5h2V9" {...p} />}
      {name === 'ask' && (<><Path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" {...p} /><Path d="M9 10.5h6M9 13.5h3.5" {...p} /></>)}
      {name === 'send' && <Path d="M12 19V5M5 12l7-7 7 7" {...p} />}
      {name === 'chevron' && <Path d="M9 6l6 6-6 6" {...p} />}
      {name === 'map' && <Path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" {...p} />}
      {name === 'check' && <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
    </Svg>
  );
}
