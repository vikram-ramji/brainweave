import { AppHeader } from "@/components/app/AppHeader";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { PageContainer } from "@/components/app/PageContainer";
import AuthenticatedPageWrapper from "@/components/app/AuthenticatedPageWrapper";

export default async function DashboardPage() {
  return (
    <AuthenticatedPageWrapper>
      {(session) => (
        <PageContainer variant="dashboard">
          <AppHeader session={session} />
          <DashboardClient />
        </PageContainer>
      )}
    </AuthenticatedPageWrapper>
  );
}
