import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { auth } from "@/modules/auth/lib/auth";
import SearchPage from "@/modules/search/components/SearchPage";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const query = (await searchParams).q || "";

  const queryClient = getQueryClient();

  if (query.length >= 2) {
    queryClient.prefetchInfiniteQuery(
      trpc.notes.search.infiniteQueryOptions({ query, limit: 12 }),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <SearchPage />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
