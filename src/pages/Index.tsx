import { Hero } from "@/components/Hero";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { TransferSteps } from "@/components/TransferSteps";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CurrencyConverter />
      <TransferSteps />
    </div>
  );
};

export default Index;