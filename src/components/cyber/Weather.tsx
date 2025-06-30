"use client";

import React, { useState, useEffect, useCallback } from "react";
import GlassCard from "./GlassCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, MapPin, Wind, Droplets } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type WeatherData = {
  current_condition: [
    {
      FeelsLikeC: string;
      temp_C: string;
      weatherDesc: [{ value: string }];
      windspeedKmph: string;
      humidity: string;
    }
  ];
  nearest_area: [
    {
      areaName: [{ value: string }];
      country: [{ value: string }];
    }
  ];
};

export default function Weather() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
      if (!response.ok) {
        throw new Error("City not found. Please try again.");
      }
      const data: WeatherData = await response.json();
      setWeather(data);
      try {
        localStorage.setItem("cybertab-weather-city", location);
      } catch (e) { console.error(e); }
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("cybertab-weather-city") || "New York";
      setCity(savedCity);
      fetchWeather(savedCity);
    } catch (e) {
      console.error(e);
      setCity("New York");
      fetchWeather("New York");
    }
  }, [fetchWeather]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) {
      fetchWeather(city);
    }
  };

  return (
    <GlassCard className="w-full max-w-xs p-3">
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : weather ? (
        <div className="text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold">{weather.current_condition[0].temp_C}°C</p>
              <p className="text-sm text-white/80">
                Feels like {weather.current_condition[0].FeelsLikeC}°C
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold capitalize">
                {weather.current_condition[0].weatherDesc[0].value}
              </p>
              <p className="text-sm text-white/80 flex items-center justify-end gap-1">
                 <MapPin size={12}/> {weather.nearest_area[0].areaName[0].value},{" "}
                 {weather.nearest_area[0].country[0].value}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/70">
             <span className="flex items-center gap-1"><Wind size={12}/> {weather.current_condition[0].windspeedKmph} km/h</span>
             <span className="flex items-center gap-1"><Droplets size={12}/> {weather.current_condition[0].humidity}%</span>
          </div>
        </div>
      ) : null}
       <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
              className="h-8 text-xs bg-white/5 border-white/10 placeholder:text-white/40"
            />
            <Button type="submit" size="sm" variant="secondary" className="h-8">
              <Search size={14} />
            </Button>
          </form>
    </GlassCard>
  );
}
