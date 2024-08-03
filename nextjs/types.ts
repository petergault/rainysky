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