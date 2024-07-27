import { NextResponse } from 'next/server';

const TOMORROW_IO_ENDPOINT = 'https://api.tomorrow.io/v4/weather/forecast';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const url = new URL(TOMORROW_IO_ENDPOINT);
  url.searchParams.append('location', location);
  url.searchParams.append('timesteps', 'hourly');
  url.searchParams.append('apikey', process.env.TOMORROW_IO_API_KEY || '');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tomorrow.IO API Error:', response.status, errorText);
      throw new Error(`Tomorrow.IO API responded with status: ${response.status}. Error: ${errorText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Tomorrow.IO data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data', details: error.message }, { status: 500 });
  }
}