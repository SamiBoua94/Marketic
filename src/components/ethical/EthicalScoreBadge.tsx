"use client";

import { EthicalScore } from '@/types/ethical-score';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  MapPin, 
  Hand, 
  Shield, 
  Eye, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface EthicalScoreBadgeProps {
  score: EthicalScore;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function EthicalScoreBadge({ 
  score, 
  size = 'md', 
  showDetails = false 
}: EthicalScoreBadgeProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500 text-white';
      case 'B': return 'bg-green-400 text-white';
      case 'C': return 'bg-yellow-400 text-white';
      case 'D': return 'bg-orange-400 text-white';
      case 'E': return 'bg-red-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'B':
        return <CheckCircle className="w-4 h-4" />;
      case 'C':
        return <AlertTriangle className="w-4 h-4" />;
      case 'D':
      case 'E':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    if (score >= 20) return 'Faible';
    return 'Très faible';
  };

  return (
    <div className="space-y-2">
      {/* Badge principal */}
      <div className="flex items-center gap-2">
        <Badge className={`${getGradeColor(score.grade)} ${sizeClasses[size]} flex items-center gap-1`}>
          {getGradeIcon(score.grade)}
          <span className="font-semibold">{score.grade}</span>
          <span>{score.totalScore}/100</span>
        </Badge>
        
        {size !== 'sm' && (
          <span className="text-sm text-foreground/70">
            {getScoreLabel(score.totalScore)}
          </span>
        )}
      </div>

      {/* Détails du score */}
      {showDetails && size !== 'sm' && (
        <div className="space-y-2 mt-3">
          {/* Matériaux */}
          <div className="flex items-center gap-2 text-sm">
            <Leaf className={`${iconSize.md} ${score.criteria.materials.score >= 15 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-foreground/70">Matériaux:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.criteria.materials.score / 20) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{score.criteria.materials.score}/20</span>
          </div>

          {/* Origine */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className={`${iconSize.md} ${score.criteria.origin.score >= 20 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-foreground/70">Origine:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.criteria.origin.score / 25) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{score.criteria.origin.score}/25</span>
          </div>

          {/* Production */}
          <div className="flex items-center gap-2 text-sm">
            <Hand className={`${iconSize.md} ${score.criteria.production.score >= 15 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-foreground/70">Production:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.criteria.production.score / 20) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{score.criteria.production.score}/20</span>
          </div>

          {/* Éthique */}
          <div className="flex items-center gap-2 text-sm">
            <Shield className={`${iconSize.md} ${score.criteria.ethics.score >= 15 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-foreground/70">Éthique:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.criteria.ethics.score / 20) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{score.criteria.ethics.score}/20</span>
          </div>

          {/* Transparence */}
          <div className="flex items-center gap-2 text-sm">
            <Eye className={`${iconSize.md} ${score.criteria.transparency.score >= 10 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-foreground/70">Transparence:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(score.criteria.transparency.score / 15) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{score.criteria.transparency.score}/15</span>
          </div>
        </div>
      )}

      {/* Recommandations */}
      {showDetails && score.recommendations.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Recommandations</span>
          </div>
          <ul className="text-xs text-blue-800 space-y-1">
            {score.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
