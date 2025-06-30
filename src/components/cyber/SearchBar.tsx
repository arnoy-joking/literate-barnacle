"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const isUrl = (input: string): boolean => {
    try {
      new URL(input);
      return (input.startsWith("http://") || input.startsWith("https://")) && input.includes(".");
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    if (isUrl(query)) {
      window.location.href = query;
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Google or type a URL"
          className="h-14 w-full rounded-full border-2 border-transparent bg-black/30 pl-12 pr-4 text-base text-white placeholder:text-muted-foreground focus:border-primary focus:bg-black/40 focus:ring-0"
        />
      </div>
    </form>
  );
}
