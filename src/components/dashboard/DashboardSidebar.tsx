import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, RefreshCw, Wallet, Receipt, ArrowLeftRight, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/useAccount";
import { useTransfers } from "@/hooks/useTransfers";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  const latestTransfers = useMemo(() => {
    if (!Array.isArray(transfers)) return [];
    return [...transfers].slice(0, 3);
  }, [transfers]);

  const recentLedger = useMemo(() => {
    if (!Array.isArray(ledger)) return [];
    return ledger.slice(0, 5);
  }, [ledger]);

  return (
    <>
      {/* Desktop: Fixed sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "w-64 bg-card border-r",
          "transform transition-transform duration-300",
          "lg:translate-x-0", // Always visible on desktop
          isMobile && (openMobile ? "translate-x-0" : "-translate-x-full")
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-semibold">Dashboard</span>
          </div>
          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="p-2 rounded-md hover:bg-accent lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sidebar Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Wallet Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Wallet Balance</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                  onClick={() => {
                    refetchWallet();
                    refetchLedger();
                  }}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              {wallet ? (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Ledger:</span>
                    <span className="font-medium text-foreground/80">
                      {formatCurrency(wallet.ledgerBalance, wallet.currency)}
                    </span>
                  </div>
                  {wallet.pending > 0 && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium text-amber-600">
                        {formatCurrency(wallet.pending, wallet.currency)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated {wallet ? formatDate(wallet.lastUpdated) : "soon"}</span>
              </div>
            </div>

            <Separator />

            {/* Recent Ledger Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Receipt className="size-4" />
                <h3 className="text-sm font-medium">Recent ledger</h3>
              </div>
              <div className="space-y-2">
                {isLoadingAccount && !recentLedger.length ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`ledger-skeleton-${index}`} className="h-10 w-full rounded-md" />
                  ))
                ) : recentLedger.length ? (
                  recentLedger.map((entry) => (
                    <div key={entry.id} className="p-2 rounded-md hover:bg-accent/50">
                      <div className="flex w-full items-center justify-between text-xs font-semibold">
                        <span>{entry.description}</span>
                        <span className={entry.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}>
                          {entry.type === 'credit' ? '+' : '-'}{formatCurrency(entry.amount, entry.currency)}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{formatDate(entry.createdAt)} • {entry.reference}</span>
                    </div>
                  ))
                ) : (
                  <p className="px-2 text-xs text-muted-foreground">No ledger activity yet.</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Latest Transfers Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="size-4" />
                  <span className="text-sm font-medium">Latest transfers</span>
                </div>
                <Badge variant="outline" className="text-[11px]">
                  {Array.isArray(transfers) ? transfers.length : 0}
                </Badge>
              </div>
              <div className="space-y-2">
                {isLoadingTransfers && !latestTransfers.length ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={`transfer-skeleton-${index}`} className="h-12 w-full rounded-md" />
                  ))
                ) : latestTransfers.length ? (
                  latestTransfers.map((transfer) => (
                    <div key={transfer.id} className="p-2 rounded-md hover:bg-accent/50">
                      <div className="flex w-full items-center justify-between text-xs font-semibold">
                        <span>{transfer.toCurrency} transfer</span>
                        <Badge
                          variant={
                            transfer.status === 'completed'
                              ? 'secondary'
                              : transfer.status === 'failed'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {transfer.status}
                        </Badge>
                      </div>
                      <div className="flex w-full items-center justify-between text-[11px] text-muted-foreground">
                        <span>{transfer.recipientDetails?.name ?? 'Recipient'} • {formatDate(transfer.createdAt)}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(transfer.totalAmount, transfer.fromCurrency)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-2 text-xs text-muted-foreground">No transfers yet. Start one now!</p>
                )}
              </div>
              <Button asChild variant="ghost" size="sm" className="mt-2 h-8 w-full text-xs">
                <Link to="/transactions" className="flex items-center justify-center gap-1">
                  View all transfers
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop toggle button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-20 -right-3 z-20",
            "h-7 w-7 rounded-full",
            "bg-background border-2 border-border shadow-lg",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-all duration-200",
            "hidden lg:flex items-center justify-center"
          )}
        >
          <Menu className="h-4 w-4" />
        </button>
      </aside>

      {/* Mobile: Overlay backdrop */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Mobile: Floating trigger button */}
      {isMobile && !openMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className={cn(
            "fixed bottom-4 left-4 z-40",
            "p-3 rounded-full",
            "bg-primary text-primary-foreground",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-200",
            "lg:hidden" // Hide on desktop
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </>
  );
};
