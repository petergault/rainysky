import { NextResponse } from 'next/server';
import usZips from 'us-zips';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipcode = searchParams.get('zipcode');

  if (!zipcode) {
    return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 });
  }

  const location = usZips[zipcode];
  if (!location) {
    return NextResponse.json({ error: 'Invalid zipcode' }, { status: 400 });
  }

  const { latitude, longitude } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation_probability,precipitation&timezone=America%2FNew_York&forecast_days=7&models=gfs_seamless`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NOAA API responded with status: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}