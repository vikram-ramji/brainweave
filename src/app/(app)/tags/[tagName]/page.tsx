import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { auth } from "@/modules/auth/lib/auth";
import TagPage from "@/modules/tags/components/TagPage";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function page({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { tagName } = await params;
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      ...trpc.notes.getMany.infiniteQueryOptions({ tagName }),
      staleTime: 1000 * 60 * 5,
    }),
    queryClient.prefetchQuery({
      ...trpc.tags.getOne.queryOptions({ name: tagName }),
      staleTime: 1000 * 60 * 5,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <TagPage tagName={tagName} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
