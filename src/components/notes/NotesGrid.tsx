"use client";

import NoteCard from "@/components/notes/NoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteWithTags } from "@/types/NoteWithTags";
import { Lightbulb } from "lucide-react";

interface NotesGridProps {
  notes: NoteWithTags[];
  onNoteDelete: (noteId: string) => void;
  isLoading?: boolean;
  emptyState?: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    subtitle?: string;
  };
  context?: string; // For contextual messages like tagName or searchQuery
}

export function NotesGrid({
  notes,
  onNoteDelete,
  isLoading = false,
  emptyState,
  context,
}: NotesGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Empty state
  if (!notes.length) {
    const defaultEmptyState = {
      icon: Lightbulb,
      title: "Your canvas is empty",
      description:
        'Click on "Create Note" in the sidebar to capture your first idea.',
      subtitle: undefined,
    };

    const displayEmptyState = emptyState || defaultEmptyState;
    const IconComponent = displayEmptyState.icon;

    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center border-dashed border-gray-200">
        <IconComponent className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-2xl font-semibold">{displayEmptyState.title}</h2>
        <p className="mt-2 text-muted-foreground">
          {displayEmptyState.description}
        </p>
        {displayEmptyState.subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {displayEmptyState.subtitle}
          </p>
        )}
      </div>
    );
  }

  // Notes grid
  return (
    <div className="p-4 flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>

      {/* Notes count - only show if there's context */}
      {context && (
        <div className="flex justify-center mt-6 py-4">
          <p className="text-sm text-muted-foreground">
            {notes.length} note{notes.length === 1 ? "" : "s"} {context}
          </p>
        </div>
      )}
    </div>
  );
}
