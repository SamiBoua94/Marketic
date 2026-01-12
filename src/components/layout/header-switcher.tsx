"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { AdminHeader } from "./admin-header";

export function HeaderSwitcher() {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAdminPage) {
        return <AdminHeader />;
    }

    return <Header />;
}
