"use client";

import { useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Search } from "lucide-react";
import fetchNotes from "@/helpers/fetchNotes";
import { NotesGrid } from "./NotesGrid";
import { NotesWithPagination } from "@/types/NotesApi";

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
    queryClient.setQueryData<InfiniteData<NotesWithPagination>>(
      ["notes", searchQuery],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notes: page.notes.filter((note) => note.id !== noteId),
          })),
        };
      }
    );
  };

  // Error state
  if (error) {
    return (
      <div className=" text-center p-4 text-red-600">
        Error loading notes: {error.message}
      </div>
    );
  }

  // Search-specific empty state
  if (searchQuery && !isLoading && notes.length === 0) {
    return (
      <NotesGrid
        notes={[]}
        onNoteDelete={handleNoteDelete}
        isLoading={false}
        emptyState={{
          icon: Search,
          title: "No results found",
          description: `No results found for "${searchQuery}".`,
          subtitle: undefined,
        }}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Use NotesGrid for the main notes display */}
      <NotesGrid
        notes={notes}
        onNoteDelete={handleNoteDelete}
        isLoading={isLoading}
        context={searchQuery ? `matching "${searchQuery}"` : ""}
      />

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="mt-6">
        {hasNextPage && isFetchingNextPage && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        )}
        {!hasNextPage && notes.length > 0 && hasLoadedMultiplePages && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              All caught up! You&apos;ve viewed all your notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
