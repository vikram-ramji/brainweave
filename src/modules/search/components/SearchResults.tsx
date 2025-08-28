"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SearchResultCard from "./SearchResultCard";
import { Loader2 } from "lucide-react";

export default function SearchResults({ query }: { query: string }) {
  const trpc = useTRPC();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.notes.search.infiniteQueryOptions(
        { query, limit: 12 },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    );

  const results = data.pages.flatMap((page) => page.searchNotes);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="w-full flex flex-col items-center overflow-auto">
      {results.length > 0 ? (
        <div className="w-full max-w-2xl ml-4">
          {results.map((note) => (
            <SearchResultCard key={note.id} note={note} />
          ))}
          {hasNextPage && <div ref={ref} className="h-1" />}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center my-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
