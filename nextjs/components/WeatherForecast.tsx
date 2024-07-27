"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WeatherService, DailyForecast, WeatherData } from '@/types';

const generateDailyData = (azureData: any, date: Date): DailyForecast => {
  const azureService: WeatherService = {
    name: 'Azure Maps',
    hourlyForecast: azureData.forecasts
      .filter((forecast: any) => new Date(forecast.date).toDateString() === date.toDateString())
      .map((forecast: any) => ({
        precipChance: forecast.precipitationProbability,
      })),
  };

  // Simulate data for other services (replace with actual API calls when available)
  const accuWeatherService: WeatherService = {
    name: 'AccuWeather',
    hourlyForecast: Array(24).fill(null).map(() => ({
      precipChance: Math.floor(Math.random() * 100),
    })),
  };

  const openWeatherService: WeatherService = {
    name: 'OpenWeather',
    hourlyForecast: Array(24).fill(null).map(() => ({
      precipChance: Math.floor(Math.random() * 100),
    })),
  };

  return {
    date,
    services: [azureService, accuWeatherService, openWeatherService],
  };
};

const WeeklyForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchWeatherData = async () => {
      const zipcode = searchParams.get('zipcode');
      if (!zipcode) {
        setError('Please enter a zipcode to get weather data.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/weather/azuremaps?zipcode=${zipcode}&duration=240`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch weather data: ${errorData.error}. Details: ${errorData.details || 'No additional details'}`);
        }
        const azureData = await response.json();
        
        const startDate = new Date();
        const weekForecast = Array.from({ length: 10 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          return generateDailyData(azureData, date);
        });
        
        setWeatherData({
          locationName: azureData.locationName,
          weekForecast: weekForecast
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message || 'Failed to load weather data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [searchParams]);

  if (isLoading) {
    return <div className="text-center">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!weatherData) {
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
                      className="h-6 w-full"
                      style={{ backgroundColor: `rgba(30, 144, 255, ${hour.precipChance / 100})` }}
                      title={`Hour ${hourIndex}: ${hour.precipChance}% chance of precipitation`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Avg: {Math.round(
                    service.hourlyForecast?.reduce((sum, hour) => sum + hour.precipChance, 0) /
                    (service.hourlyForecast?.length || 1)
                  )}% chance of precipitation
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyForecast;