"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Sun, Moon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SettingsProps = {
  onWallpaperUpload: (file: File) => void;
  onClearWallpaper: () => void;
};

export default function Settings({ onWallpaperUpload, onClearWallpaper }: SettingsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("cybertab-theme");
    const theme = savedTheme === "light" ? false : true;
    setIsDarkMode(theme);
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("cybertab-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("cybertab-theme", "light");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      onWallpaperUpload(file);
      toast({
          title: "Wallpaper updated!",
          description: "Your new wallpaper has been set.",
      });
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full">
        <SettingsIcon className="h-6 w-6" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Settings</DialogTitle>
            <DialogDescription>
              Customize your CyberTab experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span className="font-medium">Theme</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Toggle between dark and light mode.
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <Sun className={`h-5 w-5 ${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                 <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                  />
                <Moon className={`h-5 w-5 ${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallpaper-upload">Custom Wallpaper</Label>
               <div className="flex gap-2">
                  <Input id="wallpaper-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="file:text-primary-foreground" />
                  <Button variant="destructive" size="icon" onClick={onClearWallpaper} aria-label="Remove wallpaper">
                    <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
              <p className="text-sm text-muted-foreground">Upload a custom background image (max 5MB).</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
