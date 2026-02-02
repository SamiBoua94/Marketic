"use client";

import { Leaf, Sparkles, Heart, Star } from "lucide-react";

interface FloatingElement {
    icon: "leaf" | "sparkle" | "heart" | "star" | "circle";
    size: number;
    x: string;
    y: string;
    delay: number;
    duration: number;
    opacity: number;
    color: string;
}

const defaultElements: FloatingElement[] = [
    { icon: "leaf", size: 24, x: "10%", y: "20%", delay: 0, duration: 8, opacity: 0.15, color: "text-primary" },
    { icon: "circle", size: 80, x: "85%", y: "15%", delay: 1, duration: 10, opacity: 0.08, color: "bg-secondary" },
    { icon: "sparkle", size: 16, x: "75%", y: "60%", delay: 2, duration: 7, opacity: 0.2, color: "text-accent" },
    { icon: "leaf", size: 32, x: "5%", y: "70%", delay: 0.5, duration: 9, opacity: 0.12, color: "text-primary" },
    { icon: "circle", size: 120, x: "90%", y: "75%", delay: 3, duration: 12, opacity: 0.05, color: "bg-primary" },
    { icon: "heart", size: 20, x: "25%", y: "85%", delay: 1.5, duration: 8, opacity: 0.1, color: "text-accent" },
    { icon: "star", size: 18, x: "60%", y: "10%", delay: 2.5, duration: 6, opacity: 0.15, color: "text-secondary" },
    { icon: "circle", size: 60, x: "15%", y: "45%", delay: 0, duration: 11, opacity: 0.06, color: "bg-accent" },
    { icon: "leaf", size: 28, x: "70%", y: "35%", delay: 4, duration: 9, opacity: 0.1, color: "text-secondary" },
    { icon: "sparkle", size: 14, x: "40%", y: "75%", delay: 1, duration: 7, opacity: 0.18, color: "text-primary" },
];

function getIcon(icon: FloatingElement["icon"], size: number, className: string) {
    switch (icon) {
        case "leaf":
            return <Leaf className={className} style={{ width: size, height: size }} />;
        case "sparkle":
            return <Sparkles className={className} style={{ width: size, height: size }} />;
        case "heart":
            return <Heart className={className} style={{ width: size, height: size }} />;
        case "star":
            return <Star className={className} style={{ width: size, height: size }} />;
        case "circle":
            return (
                <div
                    className={`rounded-full ${className} blur-xl`}
                    style={{ width: size, height: size }}
                />
            );
    }
}

interface AnimatedBackgroundProps {
    variant?: "default" | "subtle" | "hero";
    showPattern?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export function AnimatedBackground({
    variant = "default",
    showPattern = true,
    children,
    className = ""
}: AnimatedBackgroundProps) {
    const elements = variant === "subtle"
        ? defaultElements.slice(0, 5)
        : defaultElements;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Pattern Background */}
            {showPattern && (
                <div className="absolute inset-0 bg-pattern-organic opacity-50 pointer-events-none" />
            )}

            {/* Gradient Overlay for Hero */}
            {variant === "hero" && (
                <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
            )}

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {elements.map((el, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: el.x,
                            top: el.y,
                            opacity: el.opacity,
                            animation: `float ${el.duration}s ease-in-out infinite`,
                            animationDelay: `${el.delay}s`,
                        }}
                    >
                        {getIcon(
                            el.icon,
                            el.size,
                            el.icon === "circle" ? el.color : el.color
                        )}
                    </div>
                ))}
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

// Simplified floating leaves for specific sections
export function FloatingLeaves() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <Leaf
                    key={i}
                    className="absolute text-primary/10 animate-float"
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${5 + (i % 3) * 30}%`,
                        width: 20 + (i % 3) * 8,
                        height: 20 + (i % 3) * 8,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${6 + i}s`,
                    }}
                />
            ))}
        </div>
    );
}

// Decorative blob shapes
export function DecorativeBlobs({ variant = "primary" }: { variant?: "primary" | "accent" | "mixed" }) {
    const colors = {
        primary: ["bg-primary/10", "bg-primary/5", "bg-secondary/10"],
        accent: ["bg-accent/10", "bg-accent/5", "bg-secondary/10"],
        mixed: ["bg-primary/10", "bg-accent/5", "bg-secondary/10"],
    };

    const selectedColors = colors[variant];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className={`absolute -top-20 -right-20 w-64 h-64 ${selectedColors[0]} blob-1 blur-2xl animate-float`}
            />
            <div
                className={`absolute -bottom-32 -left-32 w-80 h-80 ${selectedColors[1]} blob-2 blur-3xl animate-float-reverse`}
            />
            <div
                className={`absolute top-1/2 right-1/4 w-48 h-48 ${selectedColors[2]} blob-3 blur-2xl animate-float-slow`}
            />
        </div>
    );
}
