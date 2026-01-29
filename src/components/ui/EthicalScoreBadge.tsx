'use client';

import { Leaf } from 'lucide-react';

interface EthicalScoreBadgeProps {
    score?: number | null;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * Retourne la couleur et le label associés au score éthique
 * Score en µPts - plus le score est bas, meilleur est l'impact
 */
function getScoreColorAndLabel(score: number | null | undefined): {
    bgColor: string;
    textColor: string;
    borderColor: string;
    label: string;
} {
    if (score === null || score === undefined) {
        return {
            bgColor: 'bg-zinc-100',
            textColor: 'text-zinc-500',
            borderColor: 'border-zinc-200',
            label: 'Non évalué'
        };
    }

    if (score < 400) {
        return {
            bgColor: 'bg-green-600',
            textColor: 'text-white',
            borderColor: 'border-green-700',
            label: 'Excellent'
        };
    }

    if (score < 700) {
        return {
            bgColor: 'bg-lime-500',
            textColor: 'text-white',
            borderColor: 'border-lime-600',
            label: 'Bon'
        };
    }

    if (score < 1000) {
        return {
            bgColor: 'bg-yellow-400',
            textColor: 'text-yellow-900',
            borderColor: 'border-yellow-500',
            label: 'Moyen'
        };
    }

    if (score < 1400) {
        return {
            bgColor: 'bg-orange-500',
            textColor: 'text-white',
            borderColor: 'border-orange-600',
            label: 'À améliorer'
        };
    }

    if (score < 2000) {
        return {
            bgColor: 'bg-red-600',
            textColor: 'text-white',
            borderColor: 'border-red-700',
            label: 'Mauvais'
        };
    }

    // >= 2000
    return {
        bgColor: 'bg-zinc-900',
        textColor: 'text-white',
        borderColor: 'border-zinc-950',
        label: 'Critique'
    };
}

/**
 * Badge affichant le score éthique avec un code couleur
 */
export function EthicalScoreBadge({ score, size = 'md', showLabel = false }: EthicalScoreBadgeProps) {
    const { bgColor, textColor, borderColor, label } = getScoreColorAndLabel(score);

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[10px] gap-0.5',
        md: 'px-2 py-1 text-xs gap-1',
        lg: 'px-3 py-1.5 text-sm gap-1.5'
    };

    const iconSizes = {
        sm: 10,
        md: 12,
        lg: 14
    };

    return (
        <div
            className={`inline-flex items-center ${sizeClasses[size]} ${bgColor} ${textColor} rounded-full font-medium border ${borderColor} shadow-sm`}
            title={`Score éthique: ${score !== null && score !== undefined ? `${Math.round(score)} µPts - ${label}` : 'Non évalué'}`}
        >
            <Leaf size={iconSizes[size]} />
            {score !== null && score !== undefined ? (
                <span>{Math.round(score)}</span>
            ) : (
                <span>—</span>
            )}
            {showLabel && <span className="ml-0.5">{label}</span>}
        </div>
    );
}

export default EthicalScoreBadge;
