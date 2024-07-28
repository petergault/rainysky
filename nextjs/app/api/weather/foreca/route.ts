import { NextResponse } from 'next/server';

const FORECA_API_ENDPOINT = 'https://foreca-weather.p.rapidapi.com';

async function getLocationId(zipcode: string): Promise<string> {
  const searchUrl = new URL(FORECA_API_ENDPOINT + '/location/search/' + zipcode);
  searchUrl.searchParams.append('country', 'us');  // Assuming US zipcodes

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_FORECA_WEATHER_KEY || '',
      'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
    }
  };

  const response = await fetch(searchUrl.toString(), options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Foreca location search failed: ${response.status}. Error: ${errorText}`);
  }

  const data = await response.json();
  if (data.locations && data.locations.length > 0) {
    return data.locations[0].id;
  } else {
    throw new Error('No location found for the given zipcode');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipcode = searchParams.get('location');

  if (!zipcode) {
    return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 });
  }

  try {
    const locationId = await getLocationId(zipcode);
    
    const forecastUrl = new URL(FORECA_API_ENDPOINT + '/forecast/hourly/' + locationId);
    forecastUrl.searchParams.append('alt', '0');
    forecastUrl.searchParams.append('tempunit', 'C');
    forecastUrl.searchParams.append('windunit', 'MS');
    forecastUrl.searchParams.append('periods', '168');  // 7 days
    forecastUrl.searchParams.append('dataset', 'full');

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_FORECA_WEATHER_KEY || '',
        'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
      }
    };

    const response = await fetch(forecastUrl.toString(), options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Foreca API Error:', response.status, errorText);
      throw new Error(`Foreca API responded with status: ${response.status}. Error: ${errorText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Foreca data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data', details: error.message }, { status: 500 });
  }
}