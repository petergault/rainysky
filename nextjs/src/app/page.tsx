import WeatherForecast from '@/components/WeatherForecast';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <WeatherForecast />
      </div>
    </main>
  );
}