"use client";

import { useEffect } from "react";

// Cette page redirige vers /boutiques qui liste déjà tous les artisans
export default function ArtisansPage() {
    useEffect(() => {
        // Redirect on client side
        window.location.href = "/boutiques";
    }, []);

    // Fallback content while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <p className="text-foreground/60">Redirection vers nos artisans...</p>
            </div>
        </div>
    );
}
