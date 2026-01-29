import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockKeyMetrics } from '@/lib/mockData';
import { CreditCard, Eye, TrendingUp, ShoppingBag } from 'lucide-react';

export function KeyMetrics() {
    const metrics = [
        {
            title: 'Total Sales',
            value: `€${mockKeyMetrics.totalSales}`,
            icon: CreditCard,
            description: '+20.1% from last month',
        },
        {
            title: 'Total Views',
            value: mockKeyMetrics.totalViews,
            icon: Eye,
            description: '+15.2% from last month',
        },
        {
            title: 'Conversion Rate',
            value: mockKeyMetrics.conversionRate,
            icon: TrendingUp,
            description: '+4.5% from last month',
        },
        {
            title: 'Avg. Order Value',
            value: mockKeyMetrics.avgOrderValue,
            icon: ShoppingBag,
            description: '+2.1% from last month',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {metric.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
