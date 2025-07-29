
import { PageContainer } from "@/components/app/PageContainer";
import AuthenticatedPageWrapper from "@/components/app/AuthenticatedPageWrapper";
import TagsList from "@/components/tags/TagsList";
import TagContent from "@/components/tags/TagContent";

export default async function TagPage({ params }: {params: Promise<{ tagName: string }>}) {
  const { tagName } = await params;
  return (
    <AuthenticatedPageWrapper>
      {(session) => (
        <PageContainer>
          <TagContent tagName={tagName} session={session} />
        </PageContainer>
      )}
    </AuthenticatedPageWrapper>
  );
}