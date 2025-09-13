import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { auth } from "@/modules/auth/lib/auth";
import NotesGrid from "@/modules/notes/client/ui/components/NotesGrid";
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
  queryClient.prefetchInfiniteQuery(
    trpc.notes.getMany.infiniteQueryOptions({}),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <NotesGrid />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
