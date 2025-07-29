"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag } from "@/generated/prisma";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit2 } from "lucide-react";
import TagBadges from "./TagBadges";

type TagWithCount = Tag & {
  _count?: {
    notes: number;
  };
};

export default function TagsList() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newTagName, setNewTagName] = useState<string>("");
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
  const [editTagName, setEditTagName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Get notes count with tags
      const response = await axios.get("/api/tags");
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        setError("Failed to fetch tags");
        toast.error("Failed to fetch tags");
      }
    } catch (err) {
      setError("Error fetching tags");
      toast.error("Error fetching tags");
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = async (name: string) => {
    if (!name.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    try {
      setIsCreating(true);
      const response = await axios.post("/api/tags", { name: name.trim() });
      if (response.data.success) {
        setTags((prev) => [...prev, response.data.data]);
        setNewTagName("");
        toast.success("Tag created successfully");
      } else {
        toast.error("Failed to create tag");
      }
    } catch (err) {
      toast.error("Error creating tag");
      console.error("Error creating tag:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const updateTag = async (id: string, name: string) => {
    if (!name.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    try {
      const response = await axios.put(`/api/tags/${id}`, {
        name: name.trim(),
      });
      if (response.data.success) {
        setTags((prev) =>
          prev.map((tag) => (tag.id === id ? response.data.data : tag))
        );
        setEditingTag(null);
        setEditTagName("");
        toast.success("Tag updated successfully");
      } else {
        toast.error("Failed to update tag");
      }
    } catch (err) {
      toast.error("Error updating tag");
      console.error("Error updating tag:", err);
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const response = await axios.delete(`/api/tags/${id}`);
      if (response.data.success) {
        setTags((prev) => prev.filter((tag) => tag.id !== id));
        toast.success("Tag deleted successfully");
      } else {
        toast.error("Failed to delete tag");
      }
    } catch (err) {
      toast.error("Error deleting tag");
      console.error("Error deleting tag:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handler functions
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTag(newTagName.trim());
    }
  };

  const handleEditTag = (tag: TagWithCount) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
  };

  const handleUpdateTag = () => {
    if (editingTag && editTagName.trim()) {
      updateTag(editingTag.id, editTagName.trim());
    }
  };

  const handleDeleteTag = (tag: TagWithCount) => {
    deleteTag(tag.id);
  };

  // Filter tags based on search query
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tags...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={fetchTags} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tags ({filteredTags.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
              className="flex-1 sm:w-48"
            />
            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || isCreating}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Add"}
            </Button>
          </div>
        </div>

        {/* Tags Display */}
        {filteredTags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No tags found matching your search"
                : "No tags found"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Create your first tag using the input above
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <TagBadges
              tags={filteredTags}
              onEdit={handleEditTag}
              onDelete={handleDeleteTag}
              showCount={true}
            />
          </div>
        )}

        {/* Edit Tag Section */}
        {editingTag && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Edit Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleUpdateTag()}
                  placeholder="Tag name..."
                  className="flex-1"
                />
                <Button onClick={handleUpdateTag} size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingTag(null);
                    setEditTagName("");
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
