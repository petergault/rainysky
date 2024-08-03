import { NextResponse } from 'next/server';
import { getCoordinatesFromZipcode } from '@/utils/geocoding';

const AZURE_MAPS_ENDPOINT = 'https://atlas.microsoft.com/weather/forecast/hourly/json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipcode = searchParams.get('zipcode');
  const duration = searchParams.get('duration') || '240';

  if (!zipcode) {
    return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 });
  }

  try {
    const { lat, lon, locationName } = await getCoordinatesFromZipcode(zipcode);

    const url = new URL(AZURE_MAPS_ENDPOINT);
    url.searchParams.append('api-version', '1.1');
    url.searchParams.append('query', `${lat},${lon}`);
    url.searchParams.append('duration', duration);
    url.searchParams.append('unit', 'metric');
    url.searchParams.append('language', 'en-US');
    url.searchParams.append('subscription-key', process.env.AZURE_MAPS_KEY || '');

    console.log('Fetching Azure Maps data from URL:', url.toString().replace(process.env.AZURE_MAPS_KEY || '', '[REDACTED]'));

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure Maps API Error:', response.status, errorText);
      throw new Error(`Azure Maps API responded with status: ${response.status}. Error: ${errorText}`);
    }
    const data = await response.json();

    const forecasts = data.forecasts?.map((forecast: any) => ({
      date: forecast.date,
      precipitationProbability: forecast.precipitationProbability ?? 0,
      rainFall: forecast.rain ?? 0
    })) ?? [];

    return NextResponse.json({ 
      forecasts,
      locationName 
    });
  } catch (error) {
    console.error('Error fetching Azure Maps data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data', details: (error as Error).message }, { status: 500 });
  }
}