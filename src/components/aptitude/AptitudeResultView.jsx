import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  CheckCircle,
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Quantitative Aptitude': '🔢',
  'Logical Reasoning': '🧩',
  'Verbal Ability': '📖',
  'Basic Technical Aptitude': '💻'
};

export const AptitudeResultView = ({ summaryData, onReturnToDashboard, onRetake }) => {
  if (!summaryData) return null;

  const {
    finalScore = 0,
    score = finalScore,
    totalQuestions = 20,
    correctAnswers = 0,
    incorrectAnswers = 0,
    questionsAttempted = 20,
    timeTakenFormatted = 'N/A',
    timeTakenSeconds = 0,
    categoryBreakdown = {},
    categoryPerformance = categoryBreakdown,
    strengths = [],
    improvements = [],
    areasForImprovement = improvements,
    summaryFeedback = ''
  } = summaryData;

  const displayScore = Math.round(score !== undefined ? score : finalScore);
  const totalMarks = correctAnswers * 5;

  // Format time taken if not already formatted
  const formatTime = () => {
    if (timeTakenFormatted && timeTakenFormatted !== 'N/A') return timeTakenFormatted;
    if (timeTakenSeconds) {
      const m = Math.floor(timeTakenSeconds / 60);
      const s = timeTakenSeconds % 60;
      return `${m}m ${s}s`;
    }
    return '< 20m';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'Good':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      case 'Average':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      default:
        return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
    }
  };

  const getScoreColor = (sc) => {
    if (sc >= 80) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    if (sc >= 60) return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
    if (sc >= 40) return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 text-xs font-bold border border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aptitude Assessment Completed</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Performance & Diagnostics Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Your analytical score has been synchronized to your Placement Readiness Profile.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Overall Aptitude Score</span>
            </div>
            <div className="flex items-baseline justify-center md:justify-start space-x-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                {displayScore}%
              </span>
              <span className="text-sm font-medium text-slate-400">
                ({totalMarks} / 100 marks)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {summaryFeedback || `You correctly answered ${correctAnswers} of ${totalQuestions} dynamic aptitude questions across 4 core domains.`}
            </p>
          </div>

          {/* Quick Metrics Badge Grid */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/70 text-center min-w-[120px]">
              <div className="text-[11px] text-slate-400 font-medium">Correct</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/70 text-center min-w-[120px]">
              <div className="text-[11px] text-slate-400 font-medium">Time Taken</div>
              <div className="text-2xl font-extrabold text-indigo-300 font-mono mt-0.5">
                {formatTime()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category-wise Breakdown (4 Categories) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Section Performance Breakdown (5 Marks per Question)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Object.entries(categoryPerformance).map(([catName, perf]) => {
            const icon = CATEGORY_ICONS[catName] || '📊';
            const correct = perf.correct || 0;
            const total = perf.total || 5;
            const accuracy = perf.accuracy !== undefined ? perf.accuracy : Math.round((correct / total) * 100);
            const status = perf.status || (accuracy >= 80 ? 'Strong' : accuracy >= 60 ? 'Good' : accuracy >= 40 ? 'Average' : 'Needs Improvement');

            return (
              <div
                key={catName}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-2.5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold text-slate-200 text-xs sm:text-sm">{catName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs pt-1">
                  <span className="text-slate-400">Score</span>
                  <span className="font-mono font-bold text-slate-200">
                    {correct}/{total} correct ({correct * 5} marks)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 60 ? 'bg-indigo-500' : accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-950/20 rounded-2xl p-4 border border-emerald-800/40 space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs sm:text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Key Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No specific strengths recorded.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-amber-950/20 rounded-2xl p-4 border border-amber-800/40 space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs sm:text-sm">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Recommended Focus Areas</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {areasForImprovement && areasForImprovement.length > 0 ? (
              areasForImprovement.map((imp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Keep up the consistent practice.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Placement Readiness Weight Info Card */}
      <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            <strong>Placement Readiness Calculation:</strong> Aptitude Assessment carries <strong>30% weight</strong> toward your overall campus readiness index.
          </span>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onReturnToDashboard}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Return to Placement Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
