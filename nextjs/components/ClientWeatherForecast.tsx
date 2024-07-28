"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import WeatherForecast from './WeatherForecast';

const ClientWeatherForecast: React.FC = () => {
  const searchParams = useSearchParams();
  const zipcode = searchParams.get('zipcode');

  if (!zipcode) {
    return <div className="text-center">Enter a zipcode to see the weather forecast.</div>;
  }

  return <WeatherForecast zipcode={zipcode} />;
};

export default ClientWeatherForecast;