import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { KeyMetrics } from '@/components/analysis/KeyMetrics';
import { SalesChart } from '@/components/analysis/SalesChart';
import { ExportButton } from '@/components/analysis/ExportButton';

export default async function DataAnalysisPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { shop: true },
    });

    if (!user || !user.shop) {
        redirect('/');
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Data Analysis</h1>
                    <p className="text-muted-foreground">
                        Overview of your sales performance and page views.
                    </p>
                </div>
                <ExportButton />
            </div>

            <KeyMetrics />

            <SalesChart />
        </div>
    );
}
