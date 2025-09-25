import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/common/Header";
import { AuthDialogProvider } from "@/providers/AuthDialogProvider";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

const AuthenticatedLayout = () => {
  const { open, isMobile } = useSidebar();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area with dynamic sidebar offset */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : open ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthDialogProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </AuthDialogProvider>
    );
  }

  return (
    <AuthDialogProvider>
      <SidebarProvider>
        <AuthenticatedLayout />
      </SidebarProvider>
    </AuthDialogProvider>
  );
};

export default AppLayout;
