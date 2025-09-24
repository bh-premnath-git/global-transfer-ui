import { useState, useEffect } from "react";
import { ArrowUpDown, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransfers } from "@/hooks/useTransfers";
import { CURRENCIES, FEE_RATES } from "@/constants";

export const CurrencyConverter = () => {
  const [sendAmount, setSendAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  
  const { useExchangeRate, createTransfer, isCreatingTransfer } = useTransfers();
  
  // Get exchange rate from API
  const { data: exchangeRateData, isLoading: isLoadingRate } = useExchangeRate(fromCurrency, toCurrency);
  const exchangeRate = exchangeRateData?.rate?.rate || 0.85; // Fallback to mock rate
  
  const numSendAmount = parseFloat(sendAmount) || 0;
  const receiveAmount = (numSendAmount * exchangeRate).toFixed(2);
  const fee = (numSendAmount * FEE_RATES.STANDARD).toFixed(2);
  const totalAmount = (numSendAmount + parseFloat(fee)).toFixed(2);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleStartTransfer = () => {
    if (numSendAmount > 0) {
      createTransfer({
        fromCurrency,
        toCurrency,
        sendAmount: numSendAmount,
        recipientId: "1", // Mock recipient ID
      });
    }
  };

  return (
    <section className="py-6 lg:py-8">
      <div className="container mx-auto px-2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-1">Currency Converter</h2>
            <p className="text-muted-foreground text-sm">
              See how much you'll receive with our competitive exchange rates
            </p>
          </div>
          
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Calculate your transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Send Section */}
              <div className="space-y-1">
                <label className="text-sm font-medium">You send</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="flex-1"
                    placeholder="Amount"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapCurrencies}
                  className="rounded-full p-2 h-10 w-10"
                  disabled={isLoadingRate}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Receive Section */}
              <div className="space-y-1">
                <label className="text-sm font-medium">They receive</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={isLoadingRate ? "Loading..." : receiveAmount}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rate Info */}
              <div className="bg-muted rounded-lg p-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Exchange rate:</span>
                  <span className="font-medium">
                    {isLoadingRate ? "Loading..." : `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transfer fee:</span>
                  <span className="font-medium">${fee}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-1 border-t">
                  <span>Total amount:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={handleStartTransfer}
                disabled={isCreatingTransfer || numSendAmount <= 0}
              >
                {isCreatingTransfer ? "Creating..." : "Start this transfer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};