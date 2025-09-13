"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import NoteCard from "@/modules/notes/client/ui/components/NoteCard";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { TagIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TagActions from "./TagActions";

export default function TagPage({ tagName }: { tagName: string }) {
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.notes.getMany.infiniteQueryOptions(
        { tagName },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
          },
        },
      ),
    );

  const { data: tag } = useSuspenseQuery(
    trpc.tags.getOne.queryOptions({ name: tagName }),
  );

  const notes = data.pages.flatMap((page) => page.notes);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="max-w-5xl mx-auto w-full pt-18">
      <div className="flex items-center w-full text-4xl font-semibold group">
        <TagIcon className="mr-3 size-7" />
        {tagName}
        <TagActions tag={tag} />
      </div>
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
  );
}
