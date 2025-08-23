"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import NoteCard from "./NoteCard";

export default function NotesList() {
  const trpc = useTRPC();
  const { data: notes } = useSuspenseQuery(trpc.notes.getMany.queryOptions());

  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </HoverEffect>
    </div>
  );
}
