export type DailyStats = {
    date: string;
    sales: number;
    views: number;
};

export const mockAnalysisData: DailyStats[] = [
    { date: '2024-01-01', sales: 120, views: 800 },
    { date: '2024-01-02', sales: 150, views: 950 },
    { date: '2024-01-03', sales: 180, views: 1100 },
    { date: '2024-01-04', sales: 200, views: 1200 },
    { date: '2024-01-05', sales: 160, views: 1000 },
    { date: '2024-01-06', sales: 250, views: 1500 },
    { date: '2024-01-07', sales: 300, views: 1800 },
];

export const mockKeyMetrics = {
    totalSales: 1360,
    totalViews: 8350,
    conversionRate: '16.3%',
    avgOrderValue: '€45.00',
};
