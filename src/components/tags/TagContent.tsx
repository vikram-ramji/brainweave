"use client";
import { UserSession } from "@/types/UserSession";
import React, { useEffect, useState } from "react";
import { AppHeader } from "../app/AppHeader";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import { ApiDataResponse } from "@/types/ApiResponse";
import { TagWithNotes } from "@/types/TagWithNotes";
import { NotesGrid } from "../notes/NotesGrid";
import { Tag } from "lucide-react";

export default function TagContent({
  tagName,
  session,
}: {
  tagName: string;
  session: UserSession;
}) {
  const [tag, setTag] = useState<TagWithNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await axios.get<
          ApiDataResponse<TagWithNotes>
        >(`/api/tags/${tagName}`);
        if (response.success) {
          setTag(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to fetch tag details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTag();
  }, [tagName]);

  const handleNoteDelete = (noteId: string) => {
    // Update the tag state by removing the deleted note
    if (tag) {
      setTag({
        ...tag,
        notes: tag.notes.filter((note) => note.id !== noteId),
        _count: {
          ...tag._count,
          notes: tag._count.notes - 1,
        },
      });
    }
  };

  return (
    <div>
      <AppHeader session={session} />
      <div className="container mx-auto">
        <div className="p-4 border-b">
          <Label className="text-2xl font-bold">Tag: {tagName}</Label>
          {tag && (
            <p className="text-muted-foreground mt-1">
              {tag._count.notes} note{tag._count.notes === 1 ? "" : "s"} tagged
              with "{tagName}"
            </p>
          )}
        </div>

        {/* Display notes using the NotesGrid component */}
        <NotesGrid
          notes={tag?.notes || []}
          onNoteDelete={handleNoteDelete}
          isLoading={isLoading}
          emptyState={{
            icon: Tag,
            title: "No notes found",
            description: `No notes are currently tagged with "${tagName}".`,
            subtitle: "Create a note and add this tag to see it here.",
          }}
        />
      </div>
    </div>
  );
}
