"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "@bprogress/next/app";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import SearchResults from "./SearchResults";
import { SearchIcon } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery] = useDebounce(searchQuery.trim(), 500);

  useEffect(() => {
    if (debouncedQuery !== query) {
      const url =
        debouncedQuery.length > 0
          ? `/search?${new URLSearchParams({ q: debouncedQuery }).toString()}`
          : "/search";
      router.replace(url);
    }
  }, [debouncedQuery, query, router]);

  return (
    <div className="flex flex-col h-screen items-center mx-auto w-full pt-18">
      <div className="max-w-2xl w-full">
        <div>
          <h1 className="text-4xl font-semibold p-4">Search</h1>
        </div>
        <div className="flex items-center my-3 border focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] rounded-full p-2 px-4">
          <SearchIcon className="size-6 shrink-0 opacity-50" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!bg-transparent border-0 focus-visible:ring-0 shadow-none md:text-lg"
          />
        </div>
      </div>
      {query.length < 2 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium">Search for something</p>
          <p className="text-muted-foreground">
            Enter at least 2 characters to begin searching.
          </p>
        </div>
      ) : (
        <SearchResults query={query} />
      )}
    </div>
  );
}
