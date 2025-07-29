import { useState, useCallback } from "react";
import { Tag } from "@/generated/prisma";
import axios from "axios";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

interface UseTagManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onTagChange?: () => void;
}

export function useTagManagement({ form, onTagChange }: UseTagManagementProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Watch tagIds to display current tags
  const watchedTagIds = form.watch("tagIds");

  // Get current selected tags from available tags
  const currentTags: Tag[] = availableTags.filter((tag) =>
    watchedTagIds?.includes(tag.id)
  );

  // Don't auto-fetch tags in the hook - let the parent component control when to fetch
  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get("/api/tags");
      if (response.data.success) {
        setAvailableTags(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
    }
  }, []);

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreatingTag(true);
    try {
      const response = await axios.post("/api/tags", {
        name: newTagName.trim(),
      });
      if (response.data.success) {
        const newTag = response.data.data;
        setAvailableTags((prev) => [...prev, newTag]);

        // Add the new tag to the form
        const currentTagIds = form.getValues("tagIds") || [];
        form.setValue("tagIds", [...currentTagIds, newTag.id]);

        setNewTagName("");
        onTagChange?.();
        toast.success("Tag created and added!");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const removeTag = (tagId: string) => {
    const currentTagIds = form.getValues("tagIds") || [];
    form.setValue(
      "tagIds",
      currentTagIds.filter((id: string) => id !== tagId)
    );
    onTagChange?.();
  };

  const addExistingTag = (tag: Tag) => {
    const currentTagIds = form.getValues("tagIds") || [];
    if (!currentTagIds.includes(tag.id)) {
      form.setValue("tagIds", [...currentTagIds, tag.id]);
      onTagChange?.();
    }
  };

  const availableTagsFiltered = availableTags.filter(
    (tag) => !watchedTagIds?.includes(tag.id)
  );

  return {
    availableTags,
    currentTags,
    availableTagsFiltered,
    newTagName,
    setNewTagName,
    isCreatingTag,
    createTag,
    removeTag,
    addExistingTag,
    setAvailableTags,
    fetchTags, // Export fetchTags so parent can control when to fetch
  };
}
