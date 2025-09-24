import { ArrowRight, Globe, Star, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-bg.jpg";

const promotionalOffers = [
  {
    icon: Star,
    title: "0% fees on first transfer",
    description: "New users only",
    color: "text-yellow-500"
  },
  {
    icon: Zap,
    title: "Instant transfers",
    description: "To 50+ countries",
    color: "text-blue-500"
  },
  {
    icon: Shield,
    title: "Bank-level security",
    description: "Your money is safe",
    color: "text-green-500"
  }
];

export const Hero = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.9)), url(${heroImage})`,
      }}
    >
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border/40 bg-background/80 p-4 text-center shadow-xl backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <Globe className="h-3.5 w-3.5" />
            Global transfers
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Send money worldwide
          </h1>

          <div
            className="mb-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Carousel
              className="w-full max-w-sm mx-auto"
              opts={{ align: "start", loop: true }}
              plugins={[autoplayRef.current]}
              setApi={setApi}
            >
              <CarouselContent>
                {promotionalOffers.map((offer, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center text-center p-2 cursor-pointer transition-transform hover:scale-105">
                      <div className="flex items-center gap-1.5 mb-1">
                        <offer.icon className={`h-4 w-4 ${offer.color} transition-colors`} />
                        <span className="text-sm font-medium text-foreground">{offer.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{offer.description}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-8 h-7 w-7 hover:bg-primary hover:text-primary-foreground transition-colors" />
              <CarouselNext className="hidden sm:flex -right-8 h-7 w-7 hover:bg-primary hover:text-primary-foreground transition-colors" />
            </Carousel>

            {/* Carousel indicators */}
            <div className="flex justify-center gap-1.5 mt-2">
              {promotionalOffers.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    index === current
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-primary/60"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2.5 sm:flex-row sm:gap-3">
            <Button size="default" variant="gradient" className="h-10 rounded-full px-6 text-sm font-medium shadow-lg shadow-primary/30">
              Start transfer
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="default"
              className="h-10 rounded-full border-border/60 bg-card/80 px-6 text-sm font-medium transition-all duration-300 hover:shadow-md"
            >
              View rates
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 text-center sm:gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-border/40 bg-card/70 p-2.5 shadow-sm">
              <div className="text-lg font-bold text-primary">200+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Countries</div>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/70 p-2.5 shadow-sm">
              <div className="text-lg font-bold text-primary">15M+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Customers</div>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/70 p-2.5 shadow-sm">
              <div className="text-lg font-bold text-primary">$50B+</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Transferred</div>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/70 p-2.5 shadow-sm">
              <div className="text-lg font-bold text-primary">4.8★</div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
