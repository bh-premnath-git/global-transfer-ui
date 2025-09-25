import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, RefreshCw, Wallet, Receipt, ArrowLeftRight, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/useAccount";
import { useTransfers } from "@/hooks/useTransfers";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/components/layout/AppLayout";

const formatCurrency = (value: number, currency?: string) => {
  if (!currency) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const DashboardSidebar = () => {
  const { wallet, ledger, isLoading: isLoadingAccount, refetchLedger, refetchWallet } = useAccount();
  const { transfers, isLoading: isLoadingTransfers } = useTransfers();
  const { isCollapsed, toggleCollapse } = useSidebarState();

  const latestTransfers = useMemo(() => {
    if (!Array.isArray(transfers)) return [];
    return [...transfers].slice(0, 3);
  }, [transfers]);

  const recentLedger = useMemo(() => {
    if (!Array.isArray(ledger)) return [];
    return ledger.slice(0, 5);
  }, [ledger]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full",
        "bg-card border-r border-border",
        "transition-all duration-300 ease-in-out",
        "flex flex-col z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Dashboard</span>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className={cn(
            "p-1.5 rounded-lg hover:bg-accent transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Wallet Balance Section */}
      <div className={cn(
        "px-4 py-4 border-b border-border",
        isCollapsed && "px-2"
      )}>
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Wallet Balance</p>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={() => {
                  refetchWallet();
                  refetchLedger();
                }}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            {wallet ? (
              <>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ledger:</span>
                    <span className="font-medium">
                      {formatCurrency(wallet.ledgerBalance, wallet.currency)}
                    </span>
                  </div>
                  {wallet.pending > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium text-amber-600">
                        {formatCurrency(wallet.pending, wallet.currency)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Updated {formatDate(wallet.lastUpdated)}</span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Wallet className="h-6 w-6 mx-auto text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <SidebarItem
          icon={<Receipt className="h-5 w-5" />}
          label="Recent ledger"
          isCollapsed={isCollapsed}
          active
        />
        <SidebarItem
          icon={<ArrowLeftRight className="h-5 w-5" />}
          label="Latest transfers"
          badge={Array.isArray(transfers) ? transfers.length : 0}
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border">
        <Button
          asChild
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-4 rounded-lg",
            "text-sm hover:bg-accent",
            isCollapsed && "px-2"
          )}
        >
          <Link to="/transactions">
            {!isCollapsed && "View all transfers"}
            {isCollapsed && <ArrowUpRight className="h-4 w-4" />}
          </Link>
        </Button>
      </div>
    </aside>
  );
};

function SidebarItem({
  icon,
  label,
  badge,
  isCollapsed,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isCollapsed: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3",
        "px-3 py-2 rounded-lg",
        "transition-colors duration-200",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground",
        isCollapsed && "justify-center"
      )}
    >
      {icon}
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium">{label}</span>
          {badge && badge > 0 && (
            <Badge variant="secondary" className="px-2 py-0.5 text-xs">
              {badge}
            </Badge>
          )}
        </>
      )}
    </button>
  );
}
