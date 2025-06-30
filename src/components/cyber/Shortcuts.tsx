"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical } from "lucide-react";
import GlassCard from "./GlassCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type Shortcut = {
  id: string;
  name: string;
  url: string;
};

type FormValues = {
  name: string;
  url: string;
};

const defaultShortcuts: Shortcut[] = [
  { id: "1", name: "Gmail", url: "https://mail.google.com" },
  { id: "2", name: "GitHub", url: "https://github.com" },
  { id: "3", name: "YouTube", url: "https://youtube.com" },
  { id: "4", name: "Reddit", url: "https://reddit.com" },
];

export default function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedShortcuts = localStorage.getItem("cybertab-shortcuts");
      if (savedShortcuts) {
        setShortcuts(JSON.parse(savedShortcuts));
      } else {
        setShortcuts(defaultShortcuts);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setShortcuts(defaultShortcuts);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("cybertab-shortcuts", JSON.stringify(shortcuts));
      } catch (error) {
        console.error("Could not save shortcuts to localStorage:", error);
      }
    }
  }, [shortcuts, isMounted]);

  const addShortcut: SubmitHandler<FormValues> = (data) => {
    const { name, url } = data;
    const newShortcut: Shortcut = {
      id: new Date().toISOString(),
      name,
      url: url.startsWith("http") ? url : `https://${url}`,
    };
    if (shortcuts.length >= 8) {
      toast({
        title: "Shortcut limit reached",
        description: "You can have a maximum of 8 shortcuts.",
        variant: "destructive",
      });
      return;
    }
    setShortcuts([...shortcuts, newShortcut]);
    reset();
    document.getElementById('close-dialog')?.click();
    toast({
      title: "Shortcut added!",
      description: `${name} has been added to your shortcuts.`,
    });
  };

  const removeShortcut = (id: string) => {
    setShortcuts(shortcuts.filter((s) => s.id !== id));
    toast({
      title: "Shortcut removed.",
      variant: "destructive",
    });
  };

  if (!isMounted) {
    return (
       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 w-24 bg-black/10 rounded-2xl animate-pulse" />
        ))}
       </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 justify-center gap-2 sm:grid-cols-4 md:grid-cols-8 md:gap-4">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="group relative">
            <a
              href={shortcut.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-transparent bg-black/20 p-2 text-center backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-black/40"
            >
              <Image
                src={`https://www.google.com/s2/favicons?domain=${new URL(shortcut.url).hostname}&sz=64`}
                alt={`${shortcut.name} favicon`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="w-full truncate text-sm text-white">{shortcut.name}</span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
              onClick={() => removeShortcut(shortcut.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {shortcuts.length < 8 && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 bg-black/10 p-4 text-center text-white/50 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-black/20 hover:text-white">
                <Plus className="h-8 w-8" />
                <span className="text-sm">Add New</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-primary/20">
              <DialogHeader>
                <DialogTitle className="font-headline">Add a new shortcut</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(addShortcut)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" {...register("name", { required: "Name is required" })} className="col-span-3" />
                    {errors.name && <p className="col-span-4 text-right text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">URL</Label>
                    <Input id="url" {...register("url", { required: "URL is required", pattern: { value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, message: "Invalid URL format" } })} placeholder="example.com" className="col-span-3" />
                    {errors.url && <p className="col-span-4 text-right text-sm text-destructive">{errors.url.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" id="close-dialog">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add Shortcut</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
