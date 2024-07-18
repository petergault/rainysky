import WeeklyForecast from '@/components/WeatherForecast';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Triple Check Weather</h1>
      <WeeklyForecast />
    </main>
  );
}