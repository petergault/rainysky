export interface HourlyForecast {
  precipChance: number;
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

export interface TomorrowIOHourlyForecast {
  time: string;
  values: {
    precipitationProbability: number;
  };
}

export interface TomorrowIOForecast {
  timelines: {
    hourly: TomorrowIOHourlyForecast[];
  };
}

export interface ForecaHourlyForecast {
  time: string;
  precipProb: number;
}

export interface ForecaForecast {
  forecast: ForecaHourlyForecast[];
}