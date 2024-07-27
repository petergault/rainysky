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