import { NextResponse } from 'next/server';

const AZURE_MAPS_ENDPOINT = 'https://atlas.microsoft.com/weather/forecast/hourly/json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const duration = searchParams.get('duration') || '240'; // Default to 10 days (240 hours)

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  const url = new URL(AZURE_MAPS_ENDPOINT);
  url.searchParams.append('api-version', '1.1');
  url.searchParams.append('query', `${lat},${lon}`);
  url.searchParams.append('duration', duration);
  url.searchParams.append('unit', 'metric');
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('subscription-key', process.env.AZURE_MAPS_KEY || '');

  console.log('Fetching Azure Maps data from URL:', url.toString().replace(process.env.AZURE_MAPS_KEY || '', '[REDACTED]'));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure Maps API Error:', response.status, errorText);
      throw new Error(`Azure Maps API responded with status: ${response.status}. Error: ${errorText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Azure Maps data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data', details: error.message }, { status: 500 });
  }
}