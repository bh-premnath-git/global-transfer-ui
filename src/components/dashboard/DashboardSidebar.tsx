import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, RefreshCw } from "lucide-react";
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
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/useAccount";
import { useTransfers } from "@/hooks/useTransfers";
import { useMemo } from "react";

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

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
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-muted/40">
        <SidebarHeader className="space-y-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Wallet</h3>
            {wallet ? (
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(wallet.balance, wallet.currency)}
              </p>
            ) : (
              <Skeleton className="h-5 w-24" />
            )}
            <div className="text-[11px] text-muted-foreground">
              <span>Ledger balance </span>
              {wallet ? (
                <span className="font-semibold text-foreground/80">
                  {formatCurrency(wallet.ledgerBalance, wallet.currency)}
                </span>
              ) : (
                <Skeleton className="mt-1 h-3 w-16" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Updated {wallet ? formatDate(wallet.lastUpdated) : "soon"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 flex-1 text-[11px]"
              onClick={() => {
                refetchWallet();
                refetchLedger();
              }}
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
            {wallet ? (
              <Badge variant="secondary" className="h-7 rounded-full px-3 text-[11px]">
                Pending {formatCurrency(wallet.pending, wallet.currency)}
              </Badge>
            ) : (
              <Skeleton className="h-7 w-20 rounded-full" />
            )}
          </div>
        </SidebarHeader>
        <Separator className="mx-2" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Recent ledger</SidebarGroupLabel>
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
              <span>Latest transfers</span>
              <Badge variant="outline" className="text-[11px]">
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
        <SidebarFooter className="text-[11px] text-muted-foreground">
          <p>Track balances and history from here. Collapse for more space when you need it.</p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </SidebarProvider>
  );
};
