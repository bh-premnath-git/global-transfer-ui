import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.9)), url(${heroImage})`,
      }}
    >
      <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/40 bg-background/80 p-8 text-center shadow-xl backdrop-blur-sm sm:p-10 lg:p-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-primary">
            <Globe className="h-4 w-4" />
            Send money worldwide
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Fast, secure money transfers
            <span className="mt-1 block text-primary">at the best rates</span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Send money to over 200 countries and territories with our award-winning service. Save up to 90% on transfer fees compared to traditional banks.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="gradient" className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/30">
              Start transfer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-border/60 bg-card/80 px-8 text-base transition-all duration-300 hover:shadow-md"
            >
              View rates
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 text-center sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4 shadow-sm">
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Countries</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4 shadow-sm">
              <div className="text-2xl font-bold text-primary">15M+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Customers</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4 shadow-sm">
              <div className="text-2xl font-bold text-primary">$50B+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Transferred</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4 shadow-sm">
              <div className="text-2xl font-bold text-primary">4.8★</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">App Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
