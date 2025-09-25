import { CreditCard, Users, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransfers } from "@/hooks/useTransfers";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: CreditCard,
    title: "Enter transfer details",
    description: "Tell us how much you want to send and where it's going"
  },
  {
    icon: Users,
    title: "Add recipient info",
    description: "Enter your recipient's details so we know where to send the money"
  },
  {
    icon: CheckCircle,
    title: "Pay and track",
    description: "Pay for your transfer and track it every step of the way"
  }
];

export const TransferSteps = () => {
  const { transfers, isLoading } = useTransfers();
  const completedTransfers = Array.isArray(transfers) ? transfers.filter(t => t.status === 'completed').length : 0;

  return (
    <section className="py-4 lg:py-6 bg-muted/20">
      <div className="container mx-auto px-2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold">How it works</h2>
              {!isLoading && completedTransfers > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {completedTransfers} done
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              3 simple steps to send money
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-2.5">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-3 text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-0.5 text-xs font-medium text-primary">
                    Step {index + 1}
                  </div>
                  <h3 className="mb-1 text-base font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Live transfer stats */}
          {!isLoading && Array.isArray(transfers) && transfers.length > 0 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                {transfers.length} total •
                {transfers.filter(t => t.status === 'pending').length} pending •
                {completedTransfers} done
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};