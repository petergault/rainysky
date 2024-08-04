"use client";

import React, { useEffect, useState } from 'react';
import { WeatherService, DailyForecast, WeatherData, ForecaForecast, AzureForecast, NOAAForecast } from '@/types';
import { format, parseISO, addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface WeatherForecastProps {
  zipcode: string;
}

const generateDailyData = (azureData: AzureForecast, forecaData: ForecaForecast, noaaData: NOAAForecast, date: Date, dayIndex: number): DailyForecast => {
  const azureService: WeatherService = {
    name: 'Azure Maps',
    hourlyForecast: azureData.forecasts
      .filter((forecast) => new Date(forecast.date).toDateString() === date.toDateString())
      .map((forecast) => ({
        precipChance: forecast.precipitationProbability,
        rainAmount: forecast.rainFall.value,
        time: forecast.date,
      })),
  };

  const forecaService: WeatherService = {
    name: 'Foreca',
    hourlyForecast: forecaData.forecast
      .filter((hour) => new Date(hour.time).toDateString() === date.toDateString())
      .map((hour) => ({
        precipChance: hour.precipProb,
        rainAmount: hour.precipAccum,
        time: hour.time,
      })),
  };

  const startIndex = dayIndex * 24;
  const endIndex = startIndex + 24;
  const noaaService: WeatherService = {
    name: 'NOAA Rapid Refresh',
    hourlyForecast: noaaData.hourly.time
      .slice(startIndex, endIndex)
      .map((time, index) => ({
        precipChance: noaaData.hourly.precipitation_probability[startIndex + index],
        rainAmount: noaaData.hourly.precipitation[startIndex + index],
        time: time,
      })),
  };

  return {
    date,
    services: [azureService, forecaService, noaaService].filter(service => service.hourlyForecast && service.hourlyForecast.length > 0),
  };
};

const WeatherForecast: React.FC<WeatherForecastProps> = ({ zipcode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!zipcode) {
        setError('Please enter a zipcode to get weather data.');
        setIsLoading(false);
        return;
      }

      try {
        const [azureResponse, forecaResponse, noaaResponse] = await Promise.all([
          fetch(`/api/weather/azuremaps?zipcode=${zipcode}&duration=240`),
          fetch(`/api/weather/foreca?location=${zipcode}`),
          fetch(`/api/weather/noaa?zipcode=${zipcode}`)
        ]);

        if (!azureResponse.ok || !forecaResponse.ok || !noaaResponse.ok) {
          throw new Error('Failed to fetch weather data from one or more sources.');
        }

        const azureData: AzureForecast = await azureResponse.json();
        const forecaData: ForecaForecast = await forecaResponse.json();
        const noaaData: NOAAForecast = await noaaResponse.json();
        
        const startDate = new Date();
        const weekForecast = Array.from({ length: 7 }, (_, i) => {
          const date = addDays(startDate, i);
          return generateDailyData(azureData, forecaData, noaaData, date, i);
        }).filter(day => day.services.length > 0);
        
        setWeatherData({
          locationName: azureData.locationName,
          weekForecast: weekForecast
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError((err as Error).message || 'Failed to load weather data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [zipcode]);

  const formatTimeToEST = (timeString: string) => {
    const date = parseISO(timeString);
    const estDate = utcToZonedTime(date, 'America/New_York');
    return format(estDate, 'h:mm a');
  };

  const formatRainAmount = (amount: number | undefined): string => {
    if (amount === undefined || isNaN(amount)) {
      return 'N/A';
    }
    return amount.toFixed(2);
  };

  if (isLoading) {
    return <div className="text-center">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!weatherData || weatherData.weekForecast.length === 0) {
    return <div className="text-center">No weather data available.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Weather Forecast for {weatherData.locationName}
      </h2>
      {weatherData.weekForecast.map((day, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">{day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          <div className="space-y-4">
            {day.services.map((service, serviceIndex) => (
              <div key={serviceIndex}>
                <h4 className="text-lg font-medium mb-2">{service.name}</h4>
                <div className="grid grid-cols-25 gap-1">
                  {service.hourlyForecast?.map((hour, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="h-20 w-full flex flex-col items-center justify-center text-xs font-semibold"
                      style={{
                        backgroundColor: `rgba(30, 144, 255, ${hour.precipChance / 100})`,
                        color: hour.precipChance > 50 ? 'white' : 'black'
                      }}
                      title={`Hour ${hourIndex}: ${hour.precipChance}% chance of precipitation, ${formatRainAmount(hour.rainAmount)}mm rain`}
                    >
                      <div>{hour.precipChance}%</div>
                      <div>{formatRainAmount(hour.rainAmount)}mm</div>
                      <div className="mt-1 text-[10px]">{formatTimeToEST(hour.time)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Avg: {Math.round(
                    (service.hourlyForecast?.reduce((sum, hour) => sum + hour.precipChance, 0) || 0) /
                    (service.hourlyForecast?.length || 1)
                  )}% chance of precipitation
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Total: {formatRainAmount(service.hourlyForecast?.reduce((sum, hour) => sum + (hour.rainAmount || 0), 0))}mm rain
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;