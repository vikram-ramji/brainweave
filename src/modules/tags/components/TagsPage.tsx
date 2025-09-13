"use client";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { TagsIcon } from "lucide-react";
import Link from "next/link";

export default function TagsPage() {
  const trpc = useTRPC();
  const { data: tags } = useQuery(trpc.tags.getAll.queryOptions());

  return (
    // Maybe try implementing a alphabetical scroll like in the niagara?
    <div className="flex flex-col items-center h-full">
      <div className="flex items-center mt-10 md:mt-16 mb-6 px-6 w-full max-w-5xl text-xl sm:text-2xl md:text-3xl">
        <TagsIcon />
        <span className="font-bold ml-2">Tags</span>
      </div>
      <div className="w-full max-w-5xl px-8">
        {tags && tags.length > 0 ? (
          <div className="flex">
            {tags.map((tag) => (
              <div key={tag.id} className="p-2">
                <Link href={`/tags/${tag.name}`}>
                  <Badge className="text-sm md:text-base">{tag.name}</Badge>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2">
            <span className="text-lg font-medium">No tags found</span>
          </div>
        )}
      </div>
    </div>
  );
}
