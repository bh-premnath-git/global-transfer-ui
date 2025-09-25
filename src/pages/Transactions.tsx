import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransfers } from "@/hooks/useTransfers";
import { useAccount } from "@/hooks/useAccount";

const statusVariant = {
  completed: "secondary" as const,
  processing: "outline" as const,
  pending: "outline" as const,
  failed: "destructive" as const,
};

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

const Transactions = () => {
  const { transfers, isLoading } = useTransfers();
  const { wallet } = useAccount();

  const rows = useMemo(() => (Array.isArray(transfers) ? transfers : []), [transfers]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Link to="/" className="flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to dashboard
              </Link>
            </Button>
            {wallet ? (
              <Badge variant="secondary" className="rounded-full px-3 text-[11px]">
                Wallet {formatCurrency(wallet.balance, wallet.currency)}
              </Badge>
            ) : null}
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Transfer history</h1>
          <p className="text-sm text-muted-foreground">
            Review all transfers, their statuses and recipient details. Click any row for a quick overview.
          </p>
        </div>
        <Button asChild variant="gradient" size="sm" className="h-10">
          <Link to="/" className="flex items-center gap-1.5 text-xs">
            Start a new transfer
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">All transfers</CardTitle>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading your transfers..." : `${rows.length} transfers recorded`}
            </p>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Created</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    Loading transfers...
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(transfer.createdAt)}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      <div>{transfer.recipientDetails?.name ?? 'Recipient'}</div>
                      <div className="text-xs text-muted-foreground">{transfer.recipientDetails?.email}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatCurrency(transfer.sendAmount, transfer.fromCurrency)} {transfer.fromCurrency}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatCurrency(transfer.receiveAmount, transfer.toCurrency)} {transfer.toCurrency}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {formatCurrency(transfer.totalAmount, transfer.fromCurrency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[transfer.status]} className="capitalize">
                        {transfer.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    No transfers yet. Send your first transfer from the dashboard.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
