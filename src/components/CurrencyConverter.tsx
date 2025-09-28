import { FormEvent, useMemo, useState } from "react";
import { ArrowUpDown, Calculator, CheckCircle, Loader2, UserRound, CreditCard, Building2, Banknote, Shield, Clock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  pickupLocation: "",
  idNumber: ""
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
  const [transferMethod, setTransferMethod] = useState("bank");

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
    setTransferMethod("bank");
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

    // Dynamic validation based on transfer method
    const requiredFields = ["name", "email", "country"];
    if (transferMethod === "bank") {
      requiredFields.push("accountNumber");
    } else if (transferMethod === "card") {
      requiredFields.push("cardNumber", "expiryDate", "cvv");
    } else if (transferMethod === "cash") {
      requiredFields.push("pickupLocation", "idNumber");
    }

    const missingFields = requiredFields.filter(field => !recipient[field as keyof RecipientFormState]);
    if (missingFields.length > 0) {
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

  const transferMethods = [
    { id: "bank", label: "Bank", icon: Building2, desc: "1-2 days", fee: fee },
    { id: "card", label: "Card", icon: CreditCard, desc: "Instant", fee: (parseFloat(fee) + 2).toFixed(2) },
    { id: "cash", label: "Cash", icon: Banknote, desc: "30 mins", fee: fee }
  ];

  // Processing state overlay
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-card dark:bg-card/90 rounded-2xl p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Sending money</h3>
            <p className="text-sm text-muted-foreground mb-4">Processing securely</p>
          </div>

          <div className="bg-muted rounded-lg p-3 mb-4 dark:bg-muted/60">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{fromCurrency} ${sendAmount}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{toCurrency} {receiveAmount}</span>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              {recipient.name} • {transferMethods.find(m => m.id === transferMethod)?.label}
            </div>
          </div>

          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                ) : index === currentStep ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0" />
                )}
                <span className={`text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 bg-muted rounded-lg p-2 text-xs text-foreground dark:bg-muted/60">
            <Clock className="h-3 w-3 text-primary" />
            <span>
              {transferMethod === "card" ? "Instant" :
               transferMethod === "cash" ? "30 minutes" : "1-2 days"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-3 lg:py-4">
      <div className="container mx-auto px-2">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold">Send Money</h2>
            <p className="text-muted-foreground text-xs">Fast • Secure • Affordable</p>
          </div>

          <Card className="overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <CardTitle className="flex items-center gap-2 text-sm font-medium mb-3">
                <Calculator className="h-4 w-4" />
                Currency Exchange
              </CardTitle>
              
              <CardContent className="p-0 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs opacity-90">You send</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="flex-1 h-8 px-3 bg-white/20 backdrop-blur border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                      placeholder="Amount"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-20 h-8 bg-white/20 backdrop-blur border-white/30 text-white focus:ring-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <span className="flex items-center gap-1">
                              <span className="text-xs">{currency.flag}</span>
                              <span className="text-xs">{currency.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwapCurrencies}
                    className="p-1 h-6 w-6 bg-white/20 backdrop-blur border-white/30 hover:bg-white/30"
                    disabled={isLoadingRate}
                  >
                    <ArrowUpDown className="h-3 w-3 text-white" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs opacity-90">They receive</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={isLoadingRate ? "Loading..." : receiveAmount}
                      readOnly
                      className="flex-1 h-8 px-3 bg-white/20 backdrop-blur border-white/30 text-white"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-20 h-8 bg-white/20 backdrop-blur border-white/30 text-white focus:ring-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <span className="flex items-center gap-1">
                              <span className="text-xs">{currency.flag}</span>
                              <span className="text-xs">{currency.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="text-center">
                  <div className="text-muted-foreground">Rate</div>
                  <div className="font-medium">{isLoadingRate ? "..." : exchangeRate}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Fee</div>
                  <div className="font-medium">${fee}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-medium">${totalAmount}</div>
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
              {!isAuthenticated && (
                <p className="text-[10px] text-muted-foreground text-center mt-1">
                  Sign in or create an account to begin a transfer.
                </p>
              )}
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
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-base">
                <UserRound className="h-4 w-4 text-primary" />
                Send {toCurrency} {receiveAmount}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Choose delivery method and enter recipient details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Transfer Methods */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Delivery method</Label>
              <div className="grid grid-cols-3 gap-1">
                {transferMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setTransferMethod(method.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        transferMethod === method.id
                          ? 'border-primary bg-muted text-foreground dark:bg-muted/60'
                          : 'border-border hover:border-primary/40 dark:hover:border-primary/60'
                      }`}
                    >
                      <Icon className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.desc}</div>
                      <div className="text-xs font-medium">${method.fee}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Full name *"
                  value={recipient.name}
                  onChange={(e) => setRecipient(prev => ({ ...prev, name: e.target.value }))}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Country *"
                  value={recipient.country}
                  onChange={(e) => setRecipient(prev => ({ ...prev, country: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>

              <Input
                type="email"
                placeholder="Email address *"
                value={recipient.email}
                onChange={(e) => setRecipient(prev => ({ ...prev, email: e.target.value }))}
                className="h-8 text-xs"
              />

              {/* Method-specific fields */}
              {transferMethod === "bank" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Account number / IBAN *"
                    value={recipient.accountNumber}
                    onChange={(e) => setRecipient(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Bank name (optional)"
                    value={recipient.bankName}
                    onChange={(e) => setRecipient(prev => ({ ...prev, bankName: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
              )}

              {transferMethod === "card" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Card number *"
                    value={recipient.cardNumber}
                    onChange={(e) => setRecipient(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="h-8 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="MM/YY *"
                      value={recipient.expiryDate}
                      onChange={(e) => setRecipient(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="h-8 text-xs"
                    />
                    <Input
                      placeholder="CVV *"
                      value={recipient.cvv}
                      onChange={(e) => setRecipient(prev => ({ ...prev, cvv: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}

              {transferMethod === "cash" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Pickup location *"
                    value={recipient.pickupLocation}
                    onChange={(e) => setRecipient(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Government ID number *"
                    value={recipient.idNumber}
                    onChange={(e) => setRecipient(prev => ({ ...prev, idNumber: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
              )}

              {transferError && (
                <p className="text-xs text-destructive bg-destructive/10 dark:bg-destructive/20 p-2 rounded">{transferError}</p>
              )}

              {/* Summary */}
              <div className="bg-muted rounded-lg p-2 text-xs">
                <div className="flex justify-between">
                  <span>You pay:</span>
                  <span className="font-semibold">{fromCurrency} ${totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>They get:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{toCurrency} {receiveAmount}</span>
              </div>
              </div>

              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any);
                }} 
                variant="gradient" 
                className="w-full h-8 text-xs"
              >
                Send Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};