import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, TagIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tags, Tag } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";

export default function TagInput({
  userTags,
  noteTags,
  noteId,
}: {
  userTags: Tags;
  noteTags: Tags;
  noteId: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTag = useMutation(
    trpc.tags.create.mutationOptions({
      onSuccess: (newTag) => {
        queryClient.setQueryData(
          trpc.tags.getAll.queryOptions().queryKey,
          (oldTags) => {
            if (!oldTags) return [newTag];
            return [...oldTags, newTag];
          },
        );
        queryClient.invalidateQueries({
          queryKey: trpc.tags.getAll.queryOptions().queryKey,
        });
        addTagToNote.mutate({ noteId, tagId: newTag.id });
      },
    }),
  );

  const addTagToNote = useMutation(
    trpc.notes.addTag.mutationOptions({
      onSuccess: (updatedNote) => {
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: updatedNote.id }).queryKey,
          updatedNote,
        );
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
      },
      onError: (error) => {
        console.error("Error adding tag to note:", error);
      },
    }),
  );

  const removeTagFromNote = useMutation(
    trpc.notes.removeTag.mutationOptions({
      onSuccess: (updatedNote) => {
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: updatedNote.id }).queryKey,
          updatedNote,
        );
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
      },
    }),
  );

  const selectedTagIds = useMemo(
    () => new Set(noteTags.map((t) => t.id)),
    [noteTags],
  );

  const handleSelect = (tag: Tag) => {
    if (selectedTagIds.has(tag.id)) {
      removeTagFromNote.mutate({ noteId, tagId: tag.id });
    } else {
      addTagToNote.mutate({ noteId, tagId: tag.id });
    }
    setSearchTerm("");
    setOpen(false);
  };

  const handleCreate = (tagName: string) => {
    createTag.mutate({ name: tagName });
    setSearchTerm("");
    setOpen(false);
  };

  const isCreatingNew =
    searchTerm &&
    !userTags.some(
      (tag) => tag.name.toLowerCase() === searchTerm.toLowerCase(),
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="flex items-center w-full py-1 px-2 border border-dashed hover:border-foreground/50 rounded-full mt-2 text-muted-foreground hover:text-foreground">
          <TagIcon className="mr-2 size-4" />
          <div className="flex flex-wrap gap-1 flex-1 text-sm">
            {noteTags.map((tag, index) => (
              <span key={tag.id}>
                {tag.name}
                {index < noteTags.length - 1 && <span>,</span>}
              </span>
            ))}
            <span>{noteTags.length > 0 ? "" : "Add tags"}</span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {userTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => handleSelect(tag)}
                  className="flex justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <TagIcon
                      className={cn(
                        "h-4 w-4 mr-2",
                        selectedTagIds.has(tag.id)
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    />
                    {tag.name}
                  </div>
                  <div
                    className={cn(
                      "h-4 w-4",
                      selectedTagIds.has(tag.id) ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {isCreatingNew && (
              <CommandGroup>
                <CommandItem
                  value={searchTerm}
                  onSelect={handleCreate}
                  className="cursor-pointer"
                >
                  {`Create "${searchTerm}"`}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
