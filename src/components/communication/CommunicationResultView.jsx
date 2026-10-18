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
  MessageSquare,
  Zap,
  Mic
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Self-Introduction & Elevator Pitch': '🎤',
  'Project Deep-Dive & STAR Problem Solving': '💻',
  'Technical Strengths & Self-Awareness': '🌱',
  'Team Collaboration & Conflict Resolution': '🤝',
  'Pressure, Deadlines & Adaptability': '⚡',
  'Company Fit & 3-5 Year Career Vision': '🎯',
  'Questions for the Interview Panel': '❓',
  // Backward compatibility
  'Workplace & Email Etiquette': '✉️',
  'Business English & Grammar': '✍️',
  'Situational Judgment & Collaboration': '🤝',
  'Interview & Presentation Scenarios': '🎤'
};

export const CommunicationResultView = ({ summaryData, onReturnToDashboard, onOpenPracticeStudio }) => {
  if (!summaryData) return null;

  const {
    finalScore = 0,
    score = finalScore,
    totalQuestions = 7,
    correctAnswers = 0,
    answeredQuestions = totalQuestions,
    totalTimeSpentSeconds = 0,
    categoryBreakdown = {},
    strengths = [],
    improvements = [],
    summaryFeedback = ''
  } = summaryData;

  const displayScore = Math.round(score !== undefined ? score : finalScore);

  const formatTime = () => {
    if (totalTimeSpentSeconds) {
      const m = Math.floor(totalTimeSpentSeconds / 60);
      const s = totalTimeSpentSeconds % 60;
      return `${m}m ${s}s`;
    }
    return '< 10m';
  };

  const getStatusBadge = (s) => {
    if (s >= 80) return { label: 'Outstanding Placement Readiness', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' };
    if (s >= 60) return { label: 'Proficient Interview Readiness', color: 'bg-blue-950/60 text-blue-300 border-blue-800/60' };
    return { label: 'Developing Interview Readiness', color: 'bg-amber-950/60 text-amber-300 border-amber-800/60' };
  };

  const status = getStatusBadge(displayScore);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto py-2">
      {/* Top Completion Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-800/60">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Placement Interview Assessment Completed</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Placement Interview Scorecard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Comprehensive evaluation of the 7 core questions top companies ask: elevator pitch, STAR project architecture, adaptability, and teamwork.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
              {status.label}
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline justify-center sm:justify-start gap-1">
              <span>{displayScore}%</span>
              <span className="text-base sm:text-lg font-normal text-purple-200">Overall</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-sm">
              {summaryFeedback || 'Strong corporate readiness demonstrated across essential company interview rounds.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto text-center">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/70">
              <div className="text-2xl font-black text-emerald-400">{correctAnswers} / {totalQuestions}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Correct Answers</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/70">
              <div className="text-2xl font-black text-purple-300">{formatTime()}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Time Spent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 backdrop-blur-sm">
        <div className="flex items-center space-x-2 text-white font-bold text-sm sm:text-base border-b pb-3 border-slate-800">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>7 Interview Rounds Performance Breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Object.entries(categoryBreakdown).map(([category, stats]) => (
            <div key={category} className="p-3.5 rounded-xl border border-slate-800 bg-slate-850/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center space-x-1.5 truncate mr-2" title={category}>
                  <span>{CATEGORY_ICONS[category] || '💬'}</span>
                  <span className="truncate">{category}</span>
                </span>
                <span className="font-extrabold text-purple-400 flex-shrink-0">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.percentage >= 70
                      ? 'bg-emerald-500'
                      : stats.percentage >= 50
                      ? 'bg-purple-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{stats.correct} of {stats.attempted} correct</span>
                <span className="font-medium text-slate-300">{stats.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Focus Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-950/20 rounded-2xl p-4 border border-emerald-800/40 space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Demonstrated Strengths</span>
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
            {improvements && improvements.length > 0 ? (
              improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Keep up consistent corporate interview practice.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Placement Readiness Weight Info Card */}
      <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>
            <strong>Placement Readiness Calculation:</strong> Interview & Communication Assessment carries <strong>20% weight</strong> toward your overall campus readiness index ($40\% \text{ Tech} + 40\% \text{ Apt} + 20\% \text{ Comm}$).
          </span>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        {onOpenPracticeStudio && (
          <button
            type="button"
            onClick={onOpenPracticeStudio}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Open Mock Interview Practice Studio</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReturnToDashboard}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Return to Placement Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
