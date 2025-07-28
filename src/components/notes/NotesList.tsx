"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import NoteCard from "@/components/notes/NoteCard";
import { Lightbulb } from "lucide-react";
import fetchNotes from "@/helpers/fetchNotes";
import Link from "next/link";

export function NotesList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.nextCursor
        : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const notes = data?.pages.flatMap((p) => p.notes) ?? [];
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(loadMoreRef, {
    rootMargin: "200px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 1) Initial loading skeleton
  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // 2) Error state
  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading notes: {error.message}
      </div>
    );
  }

  // 3) Empty state
  if (!notes.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <Lightbulb className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-2xl font-semibold">Your canvas is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Click on “Create Note” in the sidebar to capture your first idea.
        </p>
      </div>
    );
  }

  // 4) Data grid + infinite‐scroll sentinel
  return (
    <div className="p-4 flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Link key={note.id} href={`/note/${note.id}`}>
            <NoteCard
              key={note.id}
              note={note}
              onNoteDelete={() => {
                // TODO: update your cache here
              }}
            />
          </Link>
        ))}
      </div>

      {/* infinite-scroll sentinel */}
      <div ref={loadMoreRef} className="mt-6">
        {hasNextPage && isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        )}
        {!hasNextPage && notes.length > 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            You’ve reached the end.
          </p>
        )}
      </div>
    </div>
  );
}
