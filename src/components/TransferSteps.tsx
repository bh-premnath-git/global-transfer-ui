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
  const completedTransfers = transfers?.filter(t => t.status === 'completed').length || 0;

  return (
    <section className="py-6 lg:py-8 bg-muted/30">
      <div className="container mx-auto px-2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">How it works</h2>
              {!isLoading && completedTransfers > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {completedTransfers} completed
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Send money in 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-3">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card hover:shadow-card transition-all duration-300">
                <CardContent className="p-3 text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="mb-1 text-sm font-medium text-primary">
                    Step {index + 1}
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Live transfer stats */}
          {!isLoading && transfers && transfers.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                You have {transfers.length} transfer{transfers.length !== 1 ? 's' : ''} • 
                {transfers.filter(t => t.status === 'pending').length} pending • 
                {completedTransfers} completed
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};