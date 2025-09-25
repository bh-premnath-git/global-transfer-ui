import { useState, createContext, useContext } from 'react';
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/common/Header";
import { AuthDialogProvider } from "@/providers/AuthDialogProvider";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
});

export const useSidebarState = () => useContext(SidebarContext);

const AuthenticatedLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Fixed width that changes on collapse */}
        <DashboardSidebar />

        {/* Main Content - Dynamically adjusts based on sidebar */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            "transition-all duration-300 ease-in-out",
            isCollapsed ? "ml-16" : "ml-64"
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0">
            <Header />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
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
      <AuthenticatedLayout />
    </AuthDialogProvider>
  );
};

export default AppLayout;
