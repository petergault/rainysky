import React, { Suspense } from 'react';
import ZipcodeInput from '@/components/ZipcodeInput';
import ClientWeatherForecast from '@/components/ClientWeatherForecast';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Triple Check Weather</h1>
      <ZipcodeInput />
      <Suspense fallback={<div className="text-center">Loading weather data...</div>}>
        <ClientWeatherForecast />
      </Suspense>
    </main>
  );
}