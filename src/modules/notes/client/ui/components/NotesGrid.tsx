"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useTRPC } from "@/trpc/client";
import NoteCard from "./NoteCard";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function NotesGrid() {
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.notes.getMany.infiniteQueryOptions(
        {},
        {
          getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
          },
        },
      ),
    );

  const notes = data.pages.flatMap((page) => page.notes);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full">
      <div className="w-full text-xl sm:text-2xl md:text-3xl max-w-6xl mx-auto px-6 mt-10 md:mt-16">
        All Notes
      </div>
      <div className="max-w-5xl mx-auto w-full px-8">
        <HoverEffect>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </HoverEffect>
        {hasNextPage && <div ref={ref} className="h-1" />}

        {isFetchingNextPage && (
          <p className="text-center my-8 text-muted-foreground">
            Loading more notes...
          </p>
        )}

        {!hasNextPage && notes.length > 0 && data.pages.length > 1 && (
          <p className="text-center my-8 text-muted-foreground">
            You&apos;ve reached the end.
          </p>
        )}

        {!hasNextPage && notes.length === 0 && (
          <p className="text-center my-8 text-muted-foreground">
            No notes found.
          </p>
        )}
      </div>
    </div>
  );
}
