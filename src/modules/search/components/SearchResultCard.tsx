import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NoteSearch } from "@/modules/notes/types";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

export default function SearchResultCard({ note }: { note: NoteSearch }) {
  const sanitizedSnippet = DOMPurify.sanitize(note.snippet, {
    ALLOWED_TAGS: ["mark", "em", "strong"],
    ALLOWED_ATTR: [],
  });
  return (
    <Link href={`/notes/${encodeURIComponent(note.id)}`}>
      <Card className="border-0 border-b rounded-none shadow-none hover:bg-muted/40 py-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="min-w-0 space-y-2">
            <CardTitle className="line-clamp-2">{note.title}</CardTitle>
            <CardDescription>
              <p
                className="truncate"
                dangerouslySetInnerHTML={{ __html: sanitizedSnippet }}
              />
              <span aria-hidden={true}>...</span>
            </CardDescription>
          </div>
          <div className="ml-4 shrink-0">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(new Date(note.updatedAt))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
