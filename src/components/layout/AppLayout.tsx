import { Outlet } from "react-router-dom";

import { Header } from "@/components/common/Header";
import { AuthDialogProvider } from "@/providers/AuthDialogProvider";

const AppLayout = () => {
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
};

export default AppLayout;
