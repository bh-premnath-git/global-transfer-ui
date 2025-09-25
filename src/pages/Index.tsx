import { Hero } from "@/components/Hero";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { TransferSteps } from "@/components/TransferSteps";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-8 pb-8">
      {!isAuthenticated ? <Hero /> : null}
      <CurrencyConverter />
      <TransferSteps />
    </div>
  );
};

export default Index;