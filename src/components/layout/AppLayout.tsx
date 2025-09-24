import { Outlet } from "react-router-dom";

import { Header } from "@/components/common/Header";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
