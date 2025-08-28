import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "@bprogress/next/app";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import DOMPurify from "isomorphic-dompurify";

interface SearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SearchDialog({ open, setOpen }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  // State to manually control which item is highlighted
  const [activeIndex, setActiveIndex] = useState(-1);

  const [debouncedQuery] = useDebounce(query.trim(), 300);

  const router = useRouter();
  const trpc = useTRPC();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [open]);

  const { data, isLoading } = useQuery({
    ...trpc.notes.search.queryOptions({ query: debouncedQuery, limit: 7 }),
    enabled: debouncedQuery.length > 1,
  });

  const results = data?.searchNotes;
  const noteCount = results?.length ?? 0;
  const hasViewAllLink = debouncedQuery.length > 1 && results;
  const totalItems = noteCount + (hasViewAllLink ? 1 : 0);

  // Effect to reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleSelect = (callback: () => unknown) => {
    setOpen(false);
    callback();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex !== -1) {
        if (activeIndex < noteCount) {
          handleSelect(() => router.push(`/notes/${results![activeIndex].id}`));
        }
      } else {
        if (debouncedQuery) {
          handleSelect(() => router.push(`/search?q=${debouncedQuery}`));
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("overflow-hidden p-0 gap-0")}
        showCloseButton={true}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Dialog</DialogTitle>
          <DialogDescription>Search here...</DialogDescription>
        </DialogHeader>
        <div className="flex h-12 items-center border-b px-3">
          <SearchIcon className="size-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search a note by its title, content, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 bg-transparent! border-0 focus-visible:ring-0 shadow-none"
          />
        </div>
        <div className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto">
          {isLoading && (
            <div className="py-6 text-center text-sm">Searching...</div>
          )}
          {!isLoading && !results?.length && debouncedQuery.length > 1 && (
            <div className="py-6 text-center text-sm">No results found.</div>
          )}
          {results && results.length > 0 && (
            <ul>
              {results.map((note, index) => (
                <li
                  key={note.id}
                  className={cn(
                    "relative flex flex-col items-start cursor-pointer gap-2 rounded-sm px-2 py-1.5 mx-1.5 my-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                    index === activeIndex && "bg-accent text-accent-foreground",
                  )}
                  onClick={() =>
                    handleSelect(() =>
                      router.push(`/notes/${encodeURIComponent(note.id)}`),
                    )
                  }
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium truncate">{note.title}</span>
                    <span className="ml-4 text-xs text-muted-foreground flex-shrink-0">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(note.updatedAt))}
                    </span>
                  </div>
                  <p
                    className="text-xs text-muted-foreground w-full truncate"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(note.snippet, {
                        ALLOWED_TAGS: ["mark", "em", "strong"],
                        ALLOWED_ATTR: [],
                      }),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        {debouncedQuery.length > 1 && results && (
          <>
            <Separator />
            <div className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto">
              <div
                onClick={() =>
                  handleSelect(() => router.push(`/search?q=${debouncedQuery}`))
                }
                className={cn(
                  "relative flex items-center cursor-pointer gap-2 rounded-md px-2 py-2.5 mx-1.5 my-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                  activeIndex === noteCount &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                <span>View all results for &ldquo;{debouncedQuery}&rdquo;</span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
