"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeftRight, LocateFixed, MapPin, Plane, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import LocationSearch from "@/components/LocationSearch";
import CurrentWeather from "@/components/CurrentWeather";
import FiveDayForecast from "@/components/FiveDayForecast";
import WeatherComparison from "@/components/WeatherComparison";
import TravelSummary from "@/components/TravelSummary";
import PackingChecklist from "@/components/PackingChecklist";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import type { LocationResult, Unit, WeatherPlace, WeatherResponse } from "@/lib/types";
import { toWeatherPlace } from "@/lib/openMeteo";

export default function HomePage() {
  const [home, setHome] = useState<LocationResult | null>(null);
  const [destination, setDestination] = useState<LocationResult | null>(null);
  const [homeWeather, setHomeWeather] = useState<WeatherPlace | null>(null);
  const [destinationWeather, setDestinationWeather] = useState<WeatherPlace | null>(null);
  const [unit, setUnit] = useState<Unit>("celsius");
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoMessage, setGeoMessage] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("wtc-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : prefersDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("wtc-theme", dark ? "dark" : "light");
  }, [dark]);

  const loadWeather = useCallback(async (location: LocationResult): Promise<WeatherPlace> => {
    const params = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude) });
    const response = await fetch(`/api/weather?${params}`);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(payload.error ?? "Unable to retrieve weather.");
    }
    const data = await response.json() as WeatherResponse;
    return toWeatherPlace(location, data);
  }, []);

  async function compareWeather() {
    if (!home || !destination) { setError("Choose both a home location and a destination before comparing."); return; }
    if (home.latitude === destination.latitude && home.longitude === destination.longitude) {
      setError("Your home location and destination are the same. Choose two different locations."); return;
    }
    setLoading(true); setError(""); setHomeWeather(null); setDestinationWeather(null);
    try {
      const [homeData, destinationData] = await Promise.all([loadWeather(home), loadWeather(destination)]);
      setHomeWeather(homeData); setDestinationWeather(destinationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally { setLoading(false); }
  }

  function useCurrentLocation() {
    setGeoMessage("");
    if (!("geolocation" in navigator)) { setGeoMessage("This browser does not support location access. Search for your city instead."); return; }
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(position => {
      const loc: LocationResult = {
        id: -1, name: "Current location", latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setHome(loc); setHomeWeather(null); setGeoBusy(false);
      setGeoMessage("Current coordinates are used only to request the forecast and are not stored.");
    }, err => {
      setGeoBusy(false);
      setGeoMessage(err.code === err.PERMISSION_DENIED
        ? "Location permission was denied. You can still search for your home city manually."
        : "We couldn’t determine your location. Please search for your city instead.");
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  }

  return <main className="min-h-screen">
    <div className="mx-auto max-w-7xl">
      <Header unit={unit} onUnitChange={setUnit} dark={dark} onThemeChange={() => setDark(v => !v)}/>
      <div className="px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
        <section className="mx-auto mb-9 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm dark:border-sky-900 dark:bg-slate-900 dark:text-sky-300"><Sparkles size={14}/> Plan smarter, wherever you go</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">A clearer forecast for <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">every journey.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">Compare the weather at home and where you’re headed. Get a five-day outlook and practical tips before you pack.</p>
        </section>

        <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"><Plane size={18}/></span><div><h2 className="font-bold">Where are you travelling?</h2><p className="text-xs text-slate-500">Choose two locations to compare their forecast.</p></div></div>
            <button onClick={useCurrentLocation} disabled={geoBusy} className="inline-flex items-center gap-2 rounded-full border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-50 dark:border-sky-900 dark:text-sky-300 dark:hover:bg-sky-950"><LocateFixed size={15}/>{geoBusy ? "Finding location…" : "Use my location"}</button>
          </div>
          <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Your browser will ask permission before sharing your location. Coordinates are sent to this app’s weather endpoint and forwarded to Open-Meteo; they are not saved by this app.</p>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <LocationSearch label="Home location" placeholder="e.g. Chennai" selected={home} onSelect={loc => { setHome(loc); setHomeWeather(null); }} onClear={() => { setHome(null); setHomeWeather(null); }}/>
            <div className="hidden h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 md:grid dark:bg-slate-800"><ArrowLeftRight size={19}/></div>
            <LocationSearch label="Travel destination" placeholder="e.g. Bengaluru" selected={destination} onSelect={loc => { setDestination(loc); setDestinationWeather(null); }} onClear={() => { setDestination(null); setDestinationWeather(null); }}/>
          </div>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">Try: Chennai and Bengaluru · London and Paris</p>
            <button onClick={compareWeather} disabled={loading || !home || !destination} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"><MapPin size={17}/>{loading ? "Comparing…" : "Compare weather"}</button>
          </div>
          {geoMessage && <p className="mt-3 text-xs text-slate-500" role="status">{geoMessage}</p>}
          {error && <div className="mt-4"><ErrorState message={error} onRetry={home && destination ? compareWeather : undefined}/></div>}
        </section>

        <div className="mx-auto mt-8 max-w-6xl space-y-9">
          {loading && <LoadingState label="Comparing your locations…"/>}
          {!loading && homeWeather && destinationWeather && <>
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3"><h2 className="text-lg font-bold">Home · Current weather</h2><CurrentWeather place={homeWeather} unit={unit}/></div>
              <div className="space-y-3"><h2 className="text-lg font-bold">Destination · Current weather</h2><CurrentWeather place={destinationWeather} unit={unit}/></div>
            </section>
            <FiveDayForecast days={homeWeather.days} unit={unit} title={`At home · ${homeWeather.location.name}`}/>
            <FiveDayForecast days={destinationWeather.days} unit={unit} title={`At destination · ${destinationWeather.location.name}`}/>
            <WeatherComparison home={homeWeather} destination={destinationWeather} unit={unit}/>
            <section className="grid gap-5 lg:grid-cols-2"><TravelSummary home={homeWeather} destination={destinationWeather}/><PackingChecklist days={destinationWeather.days}/></section>
            <p className="text-center text-xs text-slate-500">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Open-Meteo</a>. Forecasts are estimates and may change.</p>
          </>}
          {!loading && !homeWeather && !error && <div className="mx-auto max-w-xl py-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300"><MapPin size={28}/></div><h2 className="mt-4 text-lg font-bold">Your weather comparison starts here</h2><p className="mt-2 text-sm leading-6 text-slate-500">Select a home city and a destination above. We’ll bring together the five-day forecast, compare the conditions, and help you prepare.</p></div>}
        </div>
      </div>
      <footer className="border-t border-slate-200/70 px-5 py-6 text-center text-xs text-slate-500 dark:border-slate-700/70">Made for more confident journeys · Powered by Open-Meteo</footer>
    </div>
  </main>;
}
