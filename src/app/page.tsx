"use client";

import React, { useState, useEffect, useCallback } from "react";
import Clock from "@/components/cyber/Clock";
import SearchBar from "@/components/cyber/SearchBar";
import Shortcuts from "@/components/cyber/Shortcuts";
import Weather from "@/components/cyber/Weather";
import Settings from "@/components/cyber/Settings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedWallpaper = localStorage.getItem("cybertab-wallpaper");
      if (savedWallpaper) {
        setWallpaper(savedWallpaper);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  const handleWallpaperUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setWallpaper(result);
      try {
        localStorage.setItem("cybertab-wallpaper", result);
      } catch (error) {
        console.error("Could not save wallpaper to localStorage:", error);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const clearWallpaper = useCallback(() => {
    setWallpaper(null);
    try {
      localStorage.removeItem("cybertab-wallpaper");
    } catch (error) {
      console.error("Could not remove wallpaper from localStorage:", error);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-4xl space-y-8 p-4">
           <Skeleton className="h-24 w-1/2 mx-auto" />
           <Skeleton className="h-12 w-full" />
           <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full bg-background bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ backgroundImage: wallpaper ? `url(${wallpaper})` : "" }}
    >
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12">
        <header className="flex w-full max-w-7xl items-start justify-between">
          <Weather />
          <Settings onWallpaperUpload={handleWallpaperUpload} onClearWallpaper={clearWallpaper} />
        </header>

        <main className="flex flex-col items-center gap-8 text-center">
          <Clock />
          <SearchBar />
        </main>
        
        <footer className="w-full max-w-5xl">
          <Shortcuts />
        </footer>
      </div>
    </div>
  );
}
