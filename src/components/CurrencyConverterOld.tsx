import { useState } from "react";
import { ArrowUpDown, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
];

export const CurrencyConverter = () => {
  const [sendAmount, setSendAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  
  // Mock exchange rate calculation
  const exchangeRate = 0.85;
  const receiveAmount = (parseFloat(sendAmount) * exchangeRate).toFixed(2);
  const fee = (parseFloat(sendAmount) * 0.005).toFixed(2);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
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
                      {currencies.map((currency) => (
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
                    value={receiveAmount}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
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
                  <span className="font-medium">1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transfer fee:</span>
                  <span className="font-medium">${fee}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-1 border-t">
                  <span>Total amount:</span>
                  <span>${(parseFloat(sendAmount) + parseFloat(fee)).toFixed(2)}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button variant="gradient" className="w-full">
                Start this transfer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};