"use client";

import React, { useState, useEffect } from "react";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function Clock() {
  const [time, setTime] = useState<Date>();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    setTime(new Date());
    setGreeting(getGreeting());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const greetingTimerId = setInterval(() => {
        setGreeting(getGreeting());
    }, 60000); // Update greeting every minute

    return () => {
      clearInterval(timerId);
      clearInterval(greetingTimerId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-white">
      <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter text-shadow" style={{textShadow: '0 2px 10px hsla(var(--primary), 0.5)'}}>
        {time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : <span className="opacity-0">00:00</span>}
      </h1>
      <p className="mt-2 text-xl md:text-2xl font-medium font-headline text-foreground/80">
        {greeting || <>&nbsp;</>}
      </p>
    </div>
  );
}
