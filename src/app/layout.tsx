import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { HeaderSwitcher } from "@/components/layout/header-switcher";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Markethic - Local & Ecological Marketplace",
    description: "Marketplace écologique pour artistes et artisans locaux.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body
                className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col font-sans`}
            >
                <AuthProvider>
                    <HeaderSwitcher />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
