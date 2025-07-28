"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import NoteCard from "@/components/notes/NoteCard";
import { Lightbulb, CheckCircle } from "lucide-react";
import fetchNotes from "@/helpers/fetchNotes";

export function NotesList({ searchQuery }: { searchQuery: string }) {
  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notes", searchQuery],
    queryFn: fetchNotes,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.nextCursor
        : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const notes = data?.pages.flatMap((p) => p.notes) ?? [];
  const hasLoadedMultiplePages = (data?.pages.length ?? 0) > 1;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(loadMoreRef, {
    rootMargin: "200px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNoteDelete = (noteId: string) => {
    // Update the cache by removing the deleted note from all pages
    queryClient.setQueryData(["notes", searchQuery], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          notes: page.notes.filter((note: any) => note.id !== noteId),
        })),
      };
    });
  };

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
      <div className=" text-center p-4 text-red-600">
        Error loading notes: {error.message}
      </div>
    );
  }

  // 3) No results found for search query
  if (searchQuery && !isLoading && notes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No results found for "{searchQuery}".
        </p>
      </div>
    );
  }

  // 4) Empty state
  if (!notes.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center border-dashed border-gray-200">
        <Lightbulb className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-2xl font-semibold">Your canvas is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Click on "Create Note" in the sidebar to capture your first idea.
        </p>
      </div>
    );
  }

  // 5) Data grid + infinite‐scroll sentinel
  return (
    <div className="p-4 flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDelete={handleNoteDelete} />
        ))}
      </div>

      {/* infinite-scroll sentinel */}
      <div ref={loadMoreRef} className="mt-6">
        {hasNextPage && isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        )}
        {!hasNextPage && notes.length > 0 && hasLoadedMultiplePages && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              All caught up! You've viewed all your notes.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {notes.length} note{notes.length === 1 ? "" : "s"} in total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
