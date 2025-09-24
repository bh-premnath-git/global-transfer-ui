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
              {/* Send Section */}
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

              {/* Swap Button */}
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

              {/* Receive Section */}
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

              {/* Rate Info */}
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

              {/* CTA Button */}
              <Button
                variant="gradient"
                className="w-full h-9"
                onClick={handleStartTransfer}
                disabled={isCreatingTransfer || numSendAmount <= 0}
              >
                {isCreatingTransfer ? "Creating..." : "Start transfer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};