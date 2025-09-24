import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/Header";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section 
      className="relative overflow-hidden py-8 lg:py-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url(${heroImage})` }}
    >
      <Header />
      <div className="container mx-auto px-2 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Globe className="h-4 w-4" />
            Send money worldwide
          </div>
          
          <h1 className="mb-2 text-4xl font-bold tracking-tight lg:text-5xl">
            Fast, secure money transfers
            <span className="block text-primary">at the best rates</span>
          </h1>
          
          <p className="mb-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Send money to over 200 countries and territories with our award-winning service. 
            Save up to 90% on transfer fees compared to traditional banks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button size="lg" variant="gradient">
              Start transfer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="bg-card hover:shadow-card transition-all duration-300">
              View rates
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-primary">200+</div>
              <div className="text-xs text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">15M+</div>
              <div className="text-xs text-muted-foreground">Customers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">$50B+</div>
              <div className="text-xs text-muted-foreground">Transferred</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">4.8★</div>
              <div className="text-xs text-muted-foreground">App Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};