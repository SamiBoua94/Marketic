"use client";

import { Hero } from "@/components/home/hero";
import { SearchResults } from "@/components/search/SearchResults";
import { useState, useEffect } from "react";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleSearch = (e: any) => {
            setSearchQuery(e.detail);
        };
        window.addEventListener('app-search', handleSearch);
        return () => window.removeEventListener('app-search', handleSearch);
    }, []);

    return (
        <>
            {!searchQuery && <Hero />}
            {searchQuery && <SearchResults query={searchQuery} />}
        </>
    );
}
