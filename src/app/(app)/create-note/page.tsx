import NoteCreateForm from "@/components/notes/NoteCreateForm";
import { PageContainer } from "@/components/app/PageContainer";
import AuthenticatedPageWrapper from "@/components/app/AuthenticatedPageWrapper";

export default async function CreateNotePage() {
  return (
    <AuthenticatedPageWrapper>
      {(session) => (
        <PageContainer variant="editor">
          <NoteCreateForm session={session} />
        </PageContainer>
      )}
    </AuthenticatedPageWrapper>
  );
}
