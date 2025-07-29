import Link from "next/link";
import { Tag } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

type TagWithCount = Tag & {
  _count?: {
    notes: number;
  };
};

interface TagBadgesProps {
  tags: TagWithCount[];
  limit?: number;
  onEdit?: (tag: TagWithCount) => void;
  onDelete?: (tag: TagWithCount) => void;
  showCount?: boolean;
  highlightTagId?: string; // ID of tag to highlight as primary
  disableLinks?: boolean; // Disable links to prevent nested anchor tags
}

export default function TagBadges({
  tags,
  limit,
  onEdit,
  onDelete,
  showCount = false,
  highlightTagId,
  disableLinks = false,
}: TagBadgesProps) {
  const total = tags.length;
  const displayTags = limit != null ? tags.slice(0, limit) : tags;
  const remaining = limit != null ? Math.max(0, total - limit) : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => {
        const badgeText =
          showCount && tag._count?.notes !== undefined
            ? `${tag.name} (${tag._count.notes})`
            : tag.name;

        const isHighlighted = highlightTagId && tag.id === highlightTagId;
        const badgeVariant = isHighlighted ? "default" : "secondary";

        // If no edit/delete actions, render as simple link or badge
        if (!onEdit && !onDelete) {
          const badgeElement = (
            <Badge
              variant={badgeVariant}
              className={`transition-colors text-xs ${
                disableLinks
                  ? "cursor-default"
                  : "cursor-pointer hover:bg-primary/90"
              }`}
            >
              {badgeText}
            </Badge>
          );

          return disableLinks ? (
            <div key={tag.id}>{badgeElement}</div>
          ) : (
            <Link key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
              {badgeElement}
            </Link>
          );
        }

        // Render with hover actions for edit/delete
        return (
          <div key={tag.id} className="relative group">
            {disableLinks ? (
              <Badge
                variant={badgeVariant}
                className="cursor-default transition-colors pr-12 text-xs"
              >
                {badgeText}
              </Badge>
            ) : (
              <Link href={`/tags/${encodeURIComponent(tag.name)}`}>
                <Badge
                  variant={badgeVariant}
                  className="cursor-pointer hover:bg-muted-foreground transition-colors pr-12 text-xs"
                >
                  {badgeText}
                </Badge>
              </Link>
            )}

            {/* Hover actions */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-0.5 bg-background/80 backdrop-blur-sm rounded px-1">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-secondary hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(tag);
                  }}
                  title="Edit tag"
                >
                  <Edit2 className="h-3 w-3" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(tag);
                  }}
                  title="Delete tag"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          </div>
        );
      })}

      {remaining > 0 && <Badge key="more">+{remaining}</Badge>}
    </div>
  );
}
