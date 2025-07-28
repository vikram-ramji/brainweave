import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Plus } from "lucide-react";
import { Tag } from "@/generated/prisma";

interface TagManagerProps {
  currentTags: (Tag | { id: string; name: string })[];
  availableTagsFiltered: Tag[];
  newTagName: string;
  setNewTagName: (name: string) => void;
  isCreatingTag: boolean;
  onCreateTag: () => void;
  onRemoveTag: (tagId: string) => void;
  onAddExistingTag: (tag: Tag) => void;
  showLoadingState?: boolean;
}

export function TagManager({
  currentTags,
  availableTagsFiltered,
  newTagName,
  setNewTagName,
  isCreatingTag,
  onCreateTag,
  onRemoveTag,
  onAddExistingTag,
  showLoadingState = false,
}: TagManagerProps) {
  return (
    <div className="p-4 border-b space-y-3">
      {/* Current Tags */}
      <div className="flex flex-wrap gap-2">
        {currentTags.length > 0 ? (
          currentTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onRemoveTag(tag.id)}
                disabled={showLoadingState && tag.name.startsWith("Loading")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No tags added yet</p>
        )}
      </div>

      {/* Create New Tag */}
      <div className="flex gap-2">
        <Input
          placeholder="Create new tag..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCreateTag();
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={onCreateTag}
          disabled={!newTagName.trim() || isCreatingTag}
          size="sm"
        >
          <Plus className="h-4 w-4" />
          {isCreatingTag ? "Creating..." : "Add"}
        </Button>
      </div>

      {/* Existing Tags */}
      {availableTagsFiltered.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Available tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTagsFiltered.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => onAddExistingTag(tag)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
