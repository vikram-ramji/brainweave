import NoteUpdateForm from "@/components/notes/NoteUpdateForm";
import { PageContainer } from "@/components/app/PageContainer";
import AuthenticatedPageWrapper from "@/components/app/AuthenticatedPageWrapper";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AuthenticatedPageWrapper>
      {(session) => (
        <PageContainer variant="editor">
          <NoteUpdateForm session={session} noteId={id} />
        </PageContainer>
      )}
    </AuthenticatedPageWrapper>
  );
}
