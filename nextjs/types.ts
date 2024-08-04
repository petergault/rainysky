export interface HourlyForecast {
  precipChance: number;
  rainAmount: number;
  time: string;
}

export interface WeatherService {
  name: string;
  hourlyForecast?: HourlyForecast[];
}

export interface DailyForecast {
  date: Date;
  services: WeatherService[];
}

export interface WeatherData {
  locationName: string;
  weekForecast: DailyForecast[];
}

export interface ForecaHourlyForecast {
  time: string;
  precipProb: number;
  precipAccum: number;
}

export interface ForecaForecast {
  forecast: ForecaHourlyForecast[];
}

export interface AzureForecast {
  forecasts: Array<{
    date: string;
    precipitationProbability: number;
    rainFall: {
      value: number;
      unit: string;
      unitType: number;
    };
  }>;
  locationName: string;
}

export interface NOAAForecast {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    precipitation_probability: string;
    precipitation: string;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    precipitation: number[];
  };
}