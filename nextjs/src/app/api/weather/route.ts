import { NextResponse } from 'next/server';

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const LOCATION_KEY = '349727'; // New York City, change as needed

export async function GET() {
  try {
    if (!ACCUWEATHER_API_KEY) {
      throw new Error('AccuWeather API key is not set');
    }

    const forecastResponse = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}&details=true`
    );
    if (!forecastResponse.ok) {
      throw new Error(`HTTP error! status: ${forecastResponse.status}`);
    }
    const forecastData = await forecastResponse.json();

    const hourlyResponse = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${LOCATION_KEY}?apikey=${ACCUWEATHER_API_KEY}`
    );
    if (!hourlyResponse.ok) {
      throw new Error(`HTTP error! status: ${hourlyResponse.status}`);
    }
    const hourlyData = await hourlyResponse.json();

    return NextResponse.json({ forecast: forecastData, hourly: hourlyData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}