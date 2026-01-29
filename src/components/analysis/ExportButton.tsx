'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { mockAnalysisData, mockKeyMetrics } from '@/lib/mockData';
import { Download } from 'lucide-react';

export function ExportButton() {
    const handleExport = () => {
        const dataToExport = {
            period: 'Jan 1 - Jan 7, 2024',
            metrics: mockKeyMetrics,
            dailyData: mockAnalysisData,
            generatedAt: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `markethic-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
        </Button>
    );
}
