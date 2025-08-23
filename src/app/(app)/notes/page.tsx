import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { auth } from "@/modules/auth/lib/auth";
import NotesList from "@/modules/notes/ui/components/NotesList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function NotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.notes.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <NotesList />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
