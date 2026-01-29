import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Leaf, ShieldCheck } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-16 pb-32 md:pt-24 lg:pb-40">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-foreground text-sm font-medium mb-8 animate-fade-in-up">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span>La marketplace éco-responsable</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground tracking-tight mb-6 max-w-4xl">
                    Soutenez le commerce <span className="text-primary">local</span> et <span className="text-accent">durable</span>.
                </h1>

                <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed">
                    Markethic connecte directement les créateurs de talents, artisans et producteurs de votre région avec des consommateurs engagés.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link href="/boutiques">
                        <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Découvrir les créateurs  <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Vendre mes créations
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
