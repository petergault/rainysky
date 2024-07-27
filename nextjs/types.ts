export interface HourlyForecast {
  precipChance: number;
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