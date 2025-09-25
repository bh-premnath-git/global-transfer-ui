import { FormEvent, useMemo, useState } from "react";
import { ArrowUpDown, Calculator, CheckCircle, Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTransfers } from "@/hooks/useTransfers";
import { CURRENCIES, FEE_RATES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useAccount } from "@/hooks/useAccount";

const processingSteps = [
  "Validating transfer details",
  "Locking in your exchange rate",
  "Sending to partner network",
  "Transfer completed",
];

const recipientDefaults = {
  name: "",
  email: "",
  accountNumber: "",
  country: "",
  bankName: "",
};

type RecipientFormState = typeof recipientDefaults;

export const CurrencyConverter = () => {
  const [sendAmount, setSendAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [recipient, setRecipient] = useState<RecipientFormState>(recipientDefaults);
  const [transferError, setTransferError] = useState<string | null>(null);

  const { useExchangeRate, createTransfer, updateStatus, refetchTransfers } = useTransfers();
  const { isAuthenticated } = useAuth();
  const { refetchLedger, refetchWallet } = useAccount();
  const { toast } = useToast();

  const { data: exchangeRateData, isLoading: isLoadingRate } = useExchangeRate(fromCurrency, toCurrency);
  const exchangeRate = exchangeRateData?.rate?.rate ?? 0.85;

  const numSendAmount = parseFloat(sendAmount) || 0;
  const receiveAmount = useMemo(() => (numSendAmount * exchangeRate).toFixed(2), [numSendAmount, exchangeRate]);
  const fee = useMemo(() => (numSendAmount * FEE_RATES.STANDARD).toFixed(2), [numSendAmount]);
  const totalAmount = useMemo(() => (numSendAmount + parseFloat(fee)).toFixed(2), [numSendAmount, fee]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const resetDialogState = () => {
    setRecipient(recipientDefaults);
    setCurrentStep(-1);
    setIsProcessing(false);
    setTransferError(null);
  };

  const handleStartTransfer = () => {
    if (!isAuthenticated) {
      return;
    }

    resetDialogState();
    setIsDialogOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (numSendAmount <= 0 || isProcessing) {
      return;
    }

    if (!recipient.name || !recipient.email || !recipient.accountNumber || !recipient.country) {
      setTransferError("Please fill in all required recipient details.");
      return;
    }

    setTransferError(null);
    setIsProcessing(true);

    const recipientId = `rec-${Date.now()}`;

    createTransfer(
      {
        fromCurrency,
        toCurrency,
        sendAmount: numSendAmount,
        recipientId,
        recipientDetails: recipient,
      },
      {
        onSuccess: (transfer) => {
          refetchTransfers();
          const transferId = transfer.id;
          processingSteps.forEach((_, index) => {
            setTimeout(() => {
              setCurrentStep(index);
              if (index < processingSteps.length - 1) {
                updateStatus(transferId, 'processing');
              } else {
                updateStatus(transferId, 'completed');
                refetchWallet();
                refetchLedger();
                toast({
                  title: 'Transfer completed',
                  description: `${recipient.name} will receive ${toCurrency} ${receiveAmount}.`,
                });
                setTimeout(() => {
                  setIsDialogOpen(false);
                  resetDialogState();
                }, 1200);
              }
            }, index * 1500);
          });
        },
        onError: (error) => {
          setTransferError(error instanceof Error ? error.message : 'Unable to create transfer.');
          setIsProcessing(false);
        },
      },
    );
  };

  return (
    <section className="py-4 lg:py-6">
      <div className="container mx-auto px-2">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold mb-1">Currency Converter</h2>
            <p className="text-muted-foreground text-xs">
              Competitive exchange rates, instant calculations
            </p>
          </div>

          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-base">
                <Calculator className="h-4 w-4 text-primary" />
                Calculate transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="space-y-0.5">
                <label className="text-xs font-medium">You send</label>
                <div className="flex gap-1.5">
                  <Input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="flex-1 h-9"
                    placeholder="Amount"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">{currency.flag}</span>
                            <span className="text-xs">{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapCurrencies}
                  className="rounded-full p-1.5 h-8 w-8"
                  disabled={isLoadingRate}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-0.5">
                <label className="text-xs font-medium">They receive</label>
                <div className="flex gap-1.5">
                  <Input
                    type="text"
                    value={isLoadingRate ? "Loading..." : receiveAmount}
                    readOnly
                    className="flex-1 bg-muted h-9"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">{currency.flag}</span>
                            <span className="text-xs">{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted rounded-md p-2 space-y-0.5">
                <div className="flex justify-between text-xs">
                  <span>Rate:</span>
                  <span className="font-medium">
                    {isLoadingRate ? "Loading..." : `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fee:</span>
                  <span className="font-medium">${fee}</span>
                </div>
                <div className="flex justify-between text-xs font-medium pt-0.5 border-t">
                  <span>Total:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full h-9"
                onClick={handleStartTransfer}
                disabled={!isAuthenticated || numSendAmount <= 0}
              >
                {isAuthenticated ? "Send money" : "Log in to start"}
              </Button>
              {!isAuthenticated ? (
                <p className="text-[11px] text-muted-foreground text-center">
                  Sign in or create an account to begin a transfer.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!isProcessing) {
            setIsDialogOpen(open);
            if (!open) {
              resetDialogState();
            }
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5 text-primary" />
              Recipient details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide who should receive {toCurrency} {receiveAmount}. We'll guide you through the transfer in real time.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="recipient-name" className="text-xs">Recipient name</Label>
                <Input
                  id="recipient-name"
                  required
                  value={recipient.name}
                  onChange={(event) => setRecipient((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Who are you sending to?"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="recipient-email" className="text-xs">Email</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  required
                  value={recipient.email}
                  onChange={(event) => setRecipient((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Contact email"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="recipient-account" className="text-xs">Account / IBAN</Label>
                <Input
                  id="recipient-account"
                  required
                  value={recipient.accountNumber}
                  onChange={(event) => setRecipient((prev) => ({ ...prev, accountNumber: event.target.value }))}
                  placeholder="Account number"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="recipient-country" className="text-xs">Country</Label>
                  <Input
                    id="recipient-country"
                    required
                    value={recipient.country}
                    onChange={(event) => setRecipient((prev) => ({ ...prev, country: event.target.value }))}
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="recipient-bank" className="text-xs">Bank (optional)</Label>
                  <Input
                    id="recipient-bank"
                    value={recipient.bankName}
                    onChange={(event) => setRecipient((prev) => ({ ...prev, bankName: event.target.value }))}
                    placeholder="Bank name"
                  />
                </div>
              </div>
            </div>

            {transferError ? (
              <p className="text-xs text-destructive">{transferError}</p>
            ) : null}

            <DialogFooter className="flex flex-col gap-3">
              <div className="space-y-2 rounded-md border border-border/60 bg-muted/60 p-3 text-xs">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span className="font-semibold">{fromCurrency} ${sendAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="font-semibold">{toCurrency} {receiveAmount}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Fee</span>
                  <span>${fee}</span>
                </div>
              </div>

              {!isProcessing ? (
                <Button type="submit" variant="gradient" className="w-full">
                  Confirm &amp; start transfer
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending money securely...
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {processingSteps.map((step, index) => (
                      <li key={step} className="flex items-center gap-2">
                        {index < currentStep ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        ) : index === currentStep ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        ) : (
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border/70 text-[9px]">
                            {index + 1}
                          </span>
                        )}
                        <span className={index <= currentStep ? "text-foreground" : ""}>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
