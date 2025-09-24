import { Hero } from "@/components/Hero";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { TransferSteps } from "@/components/TransferSteps";

const Index = () => {
  return (
    <div className="space-y-8 pb-8">
      <Hero />
      <CurrencyConverter />
      <TransferSteps />
    </div>
  );
};

export default Index;