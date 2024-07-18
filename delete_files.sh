#!/bin/bash

# Delete the route.ts file
rm -f nextjs/src/app/api/weather/route.ts

# Delete the WeatherForecast.tsx file
rm -f nextjs/src/components/WeatherForecast.tsx

echo "Deleted route.ts and WeatherForecast.tsx files."