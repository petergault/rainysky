declare module 'us-zips' {
  interface ZipInfo {
    zip: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }

  const usZips: { [zipcode: string]: ZipInfo };
  export default usZips;
}