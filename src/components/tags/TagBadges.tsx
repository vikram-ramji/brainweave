import Link from "next/link";
import { Tag } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TagBadgesProps {
  tags: Tag[];
  asLink?: boolean;
  limit?: number;
  onEdit?: (tag: Tag) => void;
  onDelete?: (tag: Tag) => void;
}

export default function TagBadges({
  tags,
  asLink = false,
  limit,
  onEdit,
  onDelete,
}: TagBadgesProps) {
  const total = tags.length;
  const displayTags = limit != null ? tags.slice(0, limit) : tags;
  const remaining = limit != null ? Math.max(0, total - limit) : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => {
        const badge = <Badge key={tag.id}>{tag.name}</Badge>;

        // if neither link nor actions, just render badge
        if (!asLink && !onEdit && !onDelete) {
          return badge;
        }

        // build wrapped content
        let content: React.ReactNode = badge;
        if (asLink) {
          content = (
            <Link href={`/tag/${tag.name}`} key={tag.id}>
              {badge}
            </Link>
          );
        }

        // if we have edit/delete hooks, wrap in a dropdown
        if (onEdit || onDelete) {
          return (
            <DropdownMenu key={tag.id}>
              <DropdownMenuTrigger asChild>{content}</DropdownMenuTrigger>
              <DropdownMenuContent>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(tag)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(tag)}>
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return content;
      })}

      {remaining > 0 && <Badge key="more">+{remaining}</Badge>}
    </div>
  );
}
