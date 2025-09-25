import { Hero } from "@/components/Hero";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { TransferSteps } from "@/components/TransferSteps";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="space-y-8 pb-8">
        <Hero />
        <CurrencyConverter />
        <TransferSteps />
      </div>
    );
  }

  return (
    <DashboardSidebar>
      <SidebarInset>
        <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Send money instantly and keep an eye on your balances in one place.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link to="/transactions" className="flex items-center gap-1.5 text-xs">
                View transfer history
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <CurrencyConverter />
          <TransferSteps />
        </div>
      </SidebarInset>
    </DashboardSidebar>
  );
};

export default Index;
