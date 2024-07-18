"use client";

import React, { useEffect, useState } from 'react';
import { WeatherService, DailyForecast } from '@/types';

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
  const [weekForecast, setWeekForecast] = useState<DailyForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // For this example, we'll use fixed coordinates for New York City
        const response = await fetch('/api/weather/azuremaps?lat=40.7128&lon=-74.0060&duration=240');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch weather data: ${errorData.error}. Details: ${errorData.details || 'No additional details'}`);
        }
        const azureData = await response.json();
        
        const startDate = new Date();
        const newWeekForecast = Array.from({ length: 10 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          return generateDailyData(azureData, date);
        });
        
        setWeekForecast(newWeekForecast);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message || 'Failed to load weather data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {weekForecast.map((day, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">{day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
          <div className="space-y-4">
            {day.services.map((service, serviceIndex) => (
              <div key={serviceIndex}>
                <h3 className="text-lg font-medium mb-2">{service.name}</h3>
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