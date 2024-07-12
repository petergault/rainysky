'use client';

import React, { useEffect, useState } from 'react';

interface WeatherData {
  forecast: {
    DailyForecasts: {
      Date: string;
      Temperature: {
        Minimum: { Value: number };
        Maximum: { Value: number };
      };
      Day: { IconPhrase: string };
      Night: { IconPhrase: string };
      RainProbability: number;
    }[];
  };
  hourly: {
    DateTime: string;
    Temperature: { Value: number };
    IconPhrase: string;
  }[];
}

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Error fetching weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (isLoading) return <div className="text-center p-4">Loading weather data...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!weatherData) return <div className="text-center p-4">No weather data available.</div>;

  return (
    <div className="p-6">
      {weatherData.forecast.DailyForecasts.map((day, index) => (
        <div key={index} className="mb-8 border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">
              {index === 0 ? 'Today' : new Date(day.Date).toLocaleDateString('en-US', { weekday: 'long' })}
            </h2>
            <div className="text-right">
              <p>Rain {day.RainProbability}%</p>
            </div>
          </div>
          <p className="mb-2">
            Avg {Math.round((day.Temperature.Minimum.Value + day.Temperature.Maximum.Value) / 2)}°F 
            Low {Math.round(day.Temperature.Minimum.Value)}°F 
            High {Math.round(day.Temperature.Maximum.Value)}°F
          </p>
          {index === 0 && weatherData.hourly && (
            <div className="flex overflow-x-auto py-2">
              {weatherData.hourly.map((hour, hourIndex) => (
                <div key={hourIndex} className="flex-shrink-0 w-20 text-center">
                  <p className="text-sm">{new Date(hour.DateTime).toLocaleTimeString('en-US', { hour: 'numeric' })}</p>
                  <p className="font-bold">{Math.round(hour.Temperature.Value)}°F</p>
                  <p className="text-xs">{hour.IconPhrase}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;