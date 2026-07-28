export type ForecastPeriod = {
  name: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  windSpeed: string;
  windDirection: string;
  isDaytime: boolean;
};

const NWS_HEADERS = {
  'User-Agent': 'shenandoan-trails.vercel.app (trail guide, contact via site)',
  Accept: 'application/geo+json',
};

// National Weather Service API — free, no key, US government data.
// Two-step lookup: coordinates -> forecast grid -> forecast periods.
export async function getForecast(lat: number, lng: number): Promise<ForecastPeriod[] | null> {
  try {
    const pointRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lng.toFixed(4)}`, {
      headers: NWS_HEADERS,
      cache: 'no-store',
    });
    if (!pointRes.ok) return null;
    const pointData = await pointRes.json();
    const forecastUrl = pointData?.properties?.forecast;
    if (!forecastUrl) return null;

    const forecastRes = await fetch(forecastUrl, { headers: NWS_HEADERS, cache: 'no-store' });
    if (!forecastRes.ok) return null;
    const forecastData = await forecastRes.json();
    const periods = forecastData?.properties?.periods;
    if (!Array.isArray(periods)) return null;

    return periods.slice(0, 3);
  } catch {
    return null;
  }
}

export function forecastIcon(shortForecast: string): string {
  const s = shortForecast.toLowerCase();
  if (s.includes('thunderstorm')) return '⛈️';
  if (s.includes('snow') || s.includes('flurries')) return '❄️';
  if (s.includes('rain') || s.includes('shower')) return '🌧️';
  if (s.includes('fog') || s.includes('haze')) return '🌫️';
  if (s.includes('wind')) return '💨';
  if (s.includes('mostly cloudy') || s.includes('cloudy')) return '☁️';
  if (s.includes('partly') || s.includes('few clouds')) return '⛅';
  if (s.includes('clear') || s.includes('sunny')) return '☀️';
  return '⛅';
}
