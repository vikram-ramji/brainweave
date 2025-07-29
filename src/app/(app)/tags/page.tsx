import { AppHeader } from "@/components/app/AppHeader";
import AuthenticatedPageWrapper from "@/components/app/AuthenticatedPageWrapper";
import { PageContainer } from "@/components/app/PageContainer";
import TagsList from "@/components/tags/TagsList";
import React from "react";

export default function TagsPage() {
  return (
    <AuthenticatedPageWrapper>
      {(session) => (
        <PageContainer>
          <AppHeader session={session} />
          <TagsList />
        </PageContainer>
      )}
    </AuthenticatedPageWrapper>
  );
}
