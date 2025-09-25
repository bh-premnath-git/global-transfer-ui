import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, RefreshCw, Wallet, Receipt, ArrowLeftRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/useAccount";
import { useTransfers } from "@/hooks/useTransfers";
import { useMemo } from "react";

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

export const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
  const { wallet, ledger, isLoading: isLoadingAccount, refetchLedger, refetchWallet } = useAccount();
  const { transfers, isLoading: isLoadingTransfers } = useTransfers();

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
      <Sidebar collapsible="icon" className="bg-muted/40 top-14 h-[calc(100vh-3.5rem)] [&_[data-sidebar=rail]]:!hidden [&_*]:!cursor-default">
        <SidebarTrigger className="absolute top-4 -right-3 z-20 h-6 w-6 rounded-full border border-border bg-background shadow-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200" />
        <SidebarHeader className="p-3">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Wallet className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {wallet ? formatCurrency(wallet.balance, wallet.currency) : 'Loading...'}
              </span>
              <span className="truncate text-xs">
                {wallet ? `Ledger: ${formatCurrency(wallet.ledgerBalance, wallet.currency)}` : 'Wallet Balance'}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-primary/10 group-data-[collapsible=icon]:hidden"
              onClick={(e) => {
                e.stopPropagation();
                refetchWallet();
                refetchLedger();
              }}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </SidebarMenuButton>
        </SidebarHeader>
        <Separator className="mx-2" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Receipt className="size-4" />
              Recent ledger
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoadingAccount && !recentLedger.length ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <SidebarMenuItem key={`ledger-skeleton-${index}`}>
                      <Skeleton className="h-10 w-full rounded-md" />
                    </SidebarMenuItem>
                  ))
                ) : recentLedger.length ? (
                  recentLedger.map((entry) => (
                    <SidebarMenuItem key={entry.id}>
                      <SidebarMenuButton className="flex-col items-start gap-1">
                        <div className="flex w-full items-center justify-between text-xs font-semibold">
                          <span>{entry.description}</span>
                          <span className={entry.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}>
                            {entry.type === 'credit' ? '+' : '-'}{formatCurrency(entry.amount, entry.currency)}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{formatDate(entry.createdAt)} • {entry.reference}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <p className="px-2 text-xs text-muted-foreground">No ledger activity yet.</p>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="size-4" />
                <span>Latest transfers</span>
              </div>
              <Badge variant="outline" className="text-[11px] group-data-[collapsible=icon]:hidden">
                {Array.isArray(transfers) ? transfers.length : 0} total
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoadingTransfers && !latestTransfers.length ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={`transfer-skeleton-${index}`}>
                      <Skeleton className="h-12 w-full rounded-md" />
                    </SidebarMenuItem>
                  ))
                ) : latestTransfers.length ? (
                  latestTransfers.map((transfer) => (
                    <SidebarMenuItem key={transfer.id}>
                      <SidebarMenuButton className="flex-col items-start gap-1">
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
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <p className="px-2 text-xs text-muted-foreground">No transfers yet. Start one now!</p>
                )}
              </SidebarMenu>
              <Button asChild variant="ghost" size="sm" className="mt-2 h-8 w-full text-xs">
                <Link to="/transactions" className="flex items-center justify-center gap-1">
                  View all transfers
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <p>Track balances and history from here. Use the toggle button to collapse for more space.</p>
        </SidebarFooter>
        </Sidebar>
      {children}
    </>
  );
};
