"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { NotesList } from "@/components/notes/NotesList";

export function DashboardClient() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <Input
          placeholder="Search notes by title, content, or tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <NotesList searchQuery={debouncedSearchQuery} />
    </div>
  );
}
