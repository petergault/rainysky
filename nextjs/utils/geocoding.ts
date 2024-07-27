const AZURE_MAPS_SEARCH_ENDPOINT = 'https://atlas.microsoft.com/search/address/json';

export async function getCoordinatesFromZipcode(zipcode: string): Promise<{ lat: number; lon: number; locationName: string }> {
  const url = new URL(AZURE_MAPS_SEARCH_ENDPOINT);
  url.searchParams.append('api-version', '1.0');
  url.searchParams.append('query', zipcode);
  url.searchParams.append('countrySet', 'US');
  url.searchParams.append('subscription-key', process.env.AZURE_MAPS_KEY || '');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Azure Maps Search API responded with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lon } = data.results[0].position;
      const locationName = `${data.results[0].address.municipality}, ${data.results[0].address.countrySubdivision}`;
      return { lat, lon, locationName };
    } else {
      throw new Error('No results found for the given zipcode');
    }
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw new Error('Failed to convert zipcode to coordinates');
  }
}