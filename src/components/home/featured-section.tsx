import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Mock data (temporary)
const FEATURED_ITEMS = [
    {
        id: 1,
        artist: "L'Atelier de Sophie",
        product: "Vase en Céramique Artisanale",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
        location: "Lyon, FR",
        price: "45€",
        category: "Céramique"
    },
    {
        id: 2,
        artist: "Bois & Nature",
        product: "Planche à découper Olivier",
        image: "https://images.unsplash.com/photo-1622396112674-3255dc7a22d7?q=80&w=2670&auto=format&fit=crop",
        location: "Annecy, FR",
        price: "32€",
        category: "Menuiserie"
    },
    {
        id: 3,
        artist: "Coton Bio",
        product: "Tote Bag Brodé Main",
        image: "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?q=80&w=2574&auto=format&fit=crop",
        location: "Paris, FR",
        price: "24€",
        category: "Textile"
    }
];

export function FeaturedSection() {
    return (
        <section className="py-20 bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
                            Créations à la Une
                        </h2>
                        <p className="text-foreground/70 max-w-xl">
                            Découvrez une sélection unique de pièces faites main par des artisans passionnés de votre région.
                        </p>
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 group">
                        Voir tout le catalogue
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURED_ITEMS.map((item) => (
                        <div key={item.id} className="group bg-background rounded-2xl overflow-hidden border border-secondary/20 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-foreground">
                                    {item.category}
                                </div>
                                {/* Note: In production use local images or optimized next/image with domains config */}
                                <img
                                    src={item.image}
                                    alt={item.product}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{item.product}</h3>
                                        <p className="text-sm text-foreground/60">{item.artist}</p>
                                    </div>
                                    <span className="font-bold text-lg text-accent">{item.price}</span>
                                </div>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-secondary/20 text-sm text-foreground/60">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1 ml-auto">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        4.9
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
