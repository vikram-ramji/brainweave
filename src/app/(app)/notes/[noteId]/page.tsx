import LoadingState from "@/components/LoadingState";
import { auth } from "@/modules/auth/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ErrorState from "@/components/ErrorState";
import NoteEditor from "@/modules/notes/ui/components/NoteEditor";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { noteId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    ...trpc.notes.getOne.queryOptions({ id: noteId }),
    staleTime: 60000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <NoteEditor noteId={noteId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
