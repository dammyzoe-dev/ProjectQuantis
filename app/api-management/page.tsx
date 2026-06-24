import { AppShell } from "@/components/layout/app-shell";
import { ApiManagementView } from "./components/api-management-view";

export default function ApiManagementPage() {
  return (
    <AppShell>
      <ApiManagementView />
    </AppShell>
  );
}
