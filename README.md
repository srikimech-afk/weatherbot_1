# Weather Travel Companion

A responsive weather comparison app that helps travellers compare a home location with a destination. It shows current conditions, a five-day forecast, daily weather differences, a rule-based travel summary, and a destination packing checklist.

## Features

- Search for cities, towns, and locations with disambiguated geocoding results.
- Optional browser geolocation for a current-location starting point.
- Current conditions and a five-day forecast for both locations.
- Daily comparisons for high/low temperature, precipitation probability and amount, wind, and UV.
- Rule-based travel summary and packing recommendations.
- Celsius/Fahrenheit display, light/dark theme, keyboard-accessible autocomplete, responsive layout.
- No database, login, API key, or paid service required.

## Technology

- Next.js 15 App Router and React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Lucide React
- Open-Meteo Geocoding and Forecast APIs
- Vitest

## Folder structure

```text
weather-travel-companion/
├── app/
│   ├── api/
│   │   ├── geocode/route.ts
│   │   └── weather/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CurrentWeather.tsx
│   ├── ErrorState.tsx
│   ├── FiveDayForecast.tsx
│   ├── ForecastCard.tsx
│   ├── Header.tsx
│   ├── LoadingState.tsx
│   ├── LocationSearch.tsx
│   ├── PackingChecklist.tsx
│   ├── TravelSummary.tsx
│   ├── WeatherComparison.tsx
│   └── WeatherIcon.tsx
├── lib/
│   ├── comparison.ts
│   ├── comparison.test.ts
│   ├── openMeteo.ts
│   ├── temperature.test.ts
│   ├── temperature.ts
│   ├── travelAdvice.test.ts
│   ├── travelAdvice.ts
│   ├── types.ts
│   ├── weatherCodes.test.ts
│   └── weatherCodes.ts
├── public/favicon.svg
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Requirements

- Node.js 20.9 or newer (Node.js 22 LTS recommended)
- npm 10 or newer
- Git

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test and build

```bash
npm run test
npm run build
npm run start
```

`npm run test` runs the Vitest unit tests. `npm run build` creates the optimized Next.js production build.

## APIs and attribution

This project uses free Open-Meteo endpoints and requires no API key:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`
- Provider: [Open-Meteo](https://open-meteo.com/)

Weather data is provided by Open-Meteo. Please retain visible attribution when publishing. Review [Open-Meteo's terms](https://open-meteo.com/en/terms) for the current attribution and usage requirements. The app uses timezone-aware forecasts (`timezone=auto`) with five forecast days.

## Environment variables

No environment variables are required. There are no secrets or paid API keys.

## GitHub: create and push a repository

1. Sign in to [GitHub](https://github.com/).
2. Select **New repository**, name it `weather-travel-companion`, and create it without initializing extra files (the project already includes a README).
3. In the extracted project directory, run:

```bash
git init
git add .
git commit -m "Initial weather travel companion"
git branch -M main
git remote add origin <MY_GITHUB_REPOSITORY_URL>
git push -u origin main
```

Replace `<MY_GITHUB_REPOSITORY_URL>` with the HTTPS or SSH URL copied from your GitHub repository.

## Deploy to Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Select **Add New Project**.
3. Import the `weather-travel-companion` GitHub repository.
4. Confirm that Vercel detects the **Next.js** framework.
5. Keep the default build settings; no environment variables are needed.
6. Select **Deploy** and wait for the build to finish.
7. Open the generated Vercel URL and test city search and comparison.

Every push to the connected production branch will trigger a new deployment.

## Troubleshooting

- **Search has no results:** enter at least three characters, check spelling, and try a nearby larger town.
- **Weather request fails:** check your connection and retry. Open-Meteo may occasionally be unavailable or rate limited.
- **Location permission denied:** use the manual home-location search. Geolocation requires HTTPS in production (localhost is also treated as secure by modern browsers).
- **Build fails:** use Node.js 20.9+ (22 LTS recommended), remove `node_modules` and `.next`, then run `npm install` again.
- **Theme flashes or does not persist:** theme preference is stored only in local browser storage; clear site storage to reset it.

## Privacy

Browser geolocation is optional and is requested only after the user presses **Use my location**. The browser's permission prompt is controlled by the browser. Coordinates are sent to this app's weather route and forwarded to Open-Meteo; they are not written to a database or persisted by the app. The app has no account, analytics, or database. Network infrastructure (the browser, hosting provider, and Open-Meteo) necessarily processes requests as part of serving the service; consult their privacy policies.

## Future enhancements

- Compare selectable date ranges and multiple destinations.
- Add accessible map previews using a free mapping provider.
- Add severe-weather alerts from a suitable open data source.
- Add exportable trip summaries and printable packing lists.
- Add saved locations locally in the browser (with an explicit privacy choice).
- Add more languages and localized units.
