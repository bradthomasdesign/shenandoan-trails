export type WeatherKind = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunder' | 'snow' | 'fog' | 'wind';

export function weatherKind(shortForecast: string): WeatherKind {
  const s = shortForecast.toLowerCase();
  if (s.includes('thunderstorm')) return 'thunder';
  if (s.includes('snow') || s.includes('flurries') || s.includes('sleet')) return 'snow';
  if (s.includes('rain') || s.includes('shower')) return 'rain';
  if (s.includes('fog') || s.includes('haze')) return 'fog';
  if (s.includes('wind')) return 'wind';
  if (s.includes('mostly cloudy') || s.includes('overcast') || s === 'cloudy') return 'cloudy';
  if (s.includes('partly') || s.includes('few clouds') || s.includes('scattered clouds')) return 'partly-cloudy';
  if (s.includes('clear') || s.includes('sunny')) return 'clear';
  return 'partly-cloudy';
}

// Solid/filled glyphs, not thin outlines — reads with more weight at small
// card sizes. Single color (currentColor) so it stays inside the palette.
const ICONS: Record<WeatherKind, React.ReactNode> = {
  clear: (
    <g>
      <circle cx="12" cy="12" r="5.2" />
      <g strokeWidth="2.4" strokeLinecap="round" stroke="currentColor">
        <path d="M12 1.8v2.6M12 19.6v2.6M22.2 12h-2.6M4.4 12H1.8" />
        <path d="M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8M19.1 19.1l-1.8-1.8M6.7 6.7l-1.8-1.8" />
      </g>
    </g>
  ),
  'partly-cloudy': (
    <g>
      <g transform="translate(-1.5,-1.5)">
        <circle cx="9.5" cy="8.5" r="4" />
        <g strokeWidth="2.2" strokeLinecap="round" stroke="currentColor">
          <path d="M9.5 1.7v2M3.2 8.5h2M4.9 3.9l1.4 1.4M15.5 3.9l-1.4 1.4" />
        </g>
      </g>
      <path d="M8.7 21.3h9.8a4 4 0 0 0 .4-7.98A6 6 0 0 0 7.6 15.6a3.6 3.6 0 0 0 1.1 5.7Z" />
    </g>
  ),
  cloudy: <path d="M6 20a4.6 4.6 0 0 1-.6-9.17A6.3 6.3 0 0 1 17.7 9.2a4.85 4.85 0 0 1 1.2 9.55 4.6 4.6 0 0 1-.6.25H6Z" />,
  rain: (
    <g>
      <path d="M6 14.2a4.4 4.4 0 0 1-.5-8.76A6 6 0 0 1 17.4 4.2a4.65 4.65 0 0 1 1.1 9.1H6Z" />
      <g strokeWidth="2.4" strokeLinecap="round" stroke="currentColor">
        <path d="M7.5 17.5 6.2 21M12.5 17.5l-1.3 3.5M17.5 17.5l-1.3 3.5" />
      </g>
    </g>
  ),
  thunder: (
    <g>
      <path d="M6 12.7a4.4 4.4 0 0 1-.5-8.76A6 6 0 0 1 17.4 2.7a4.65 4.65 0 0 1 1.1 9.1H6Z" />
      <path d="M13.6 12 9.8 17.3h3.1l-1.7 5.1 5.4-6.6h-3.2l1.9-3.8Z" />
    </g>
  ),
  snow: (
    <g>
      <path d="M6 12.2a4.4 4.4 0 0 1-.5-8.76A6 6 0 0 1 17.4 2.2a4.65 4.65 0 0 1 1.1 9.1H6Z" />
      <g strokeWidth="2.4" strokeLinecap="round" stroke="currentColor">
        <path d="M7.5 16v6M5.3 17.2l4.4 3.6M9.7 17.2l-4.4 3.6M16.5 16v6M14.3 17.2l4.4 3.6M18.7 17.2l-4.4 3.6" />
      </g>
    </g>
  ),
  fog: (
    <g strokeWidth="2.4" strokeLinecap="round" stroke="currentColor">
      <path d="M6.5 8.3a4.7 4.7 0 0 1 8.9-2.1" />
      <path d="M17.2 9.6a3.7 3.7 0 0 1-.4 7.35" fill="none" />
      <path d="M3.2 12.3h14.1M2.2 15.9h17.6M4.6 19.4h13.3" />
    </g>
  ),
  wind: (
    <g strokeWidth="2.6" strokeLinecap="round" stroke="currentColor">
      <path d="M2.5 8.2h11.8a2.9 2.9 0 1 0-2.7-4" />
      <path d="M2.5 12.5h15.3a2.9 2.9 0 1 1-2.7 4" />
      <path d="M2.5 16.8h8.7a2.3 2.3 0 1 1-2.1 3.2" />
    </g>
  ),
};

export default function WeatherIcon({ kind, size = 34 }: { kind: WeatherKind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {ICONS[kind]}
    </svg>
  );
}
