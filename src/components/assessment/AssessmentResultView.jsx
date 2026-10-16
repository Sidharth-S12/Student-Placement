import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Cpu,
  RotateCcw,
  CheckCircle,
  Target,
  BookOpen,
  Zap,
  BarChart3
} from 'lucide-react';

export const AssessmentResultView = ({ summaryData, onReturnToDashboard }) => {
  const { setIsAptitudeModalOpen } = useStudent();
  const [showAptitudeNotice, setShowAptitudeNotice] = useState(false);

  if (!summaryData) return null;

  const {
    technicalScore = 0,
    totalQuestions = 15,
    questionsAttempted = 15,
    correctAnswers = 0,
    incorrectAnswers = 0,
    skillsAssessed = [],
    skillPerformance = {},
    topicPerformance = {},
    highestDifficulty = 'EASY',
    strengths = [],
    areasForImprovement = []
  } = summaryData;

  // Fallback map if passed via older summary format
  const effectiveCorrect = correctAnswers !== undefined ? correctAnswers : summaryData.correctCount || 0;
  const effectiveAttempted = questionsAttempted !== undefined ? questionsAttempted : summaryData.totalAttempted || 15;
  const effectiveIncorrect = incorrectAnswers !== undefined ? incorrectAnswers : (effectiveAttempted - effectiveCorrect);
  const effectiveSkillScores = Object.keys(skillPerformance).length > 0 ? skillPerformance : (summaryData.skillWiseScores || {});

  const handleAptitudeClick = () => {
    if (onReturnToDashboard) {
      onReturnToDashboard();
    }
    setIsAptitudeModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in py-2">
      
      {/* 1. TECHNICAL SCORE PROMINENTLY SHOWN FIRST */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden text-center sm:text-left border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 text-xs font-semibold backdrop-blur-sm border border-brand-500/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>TECHNICAL ASSESSMENT COMPLETED</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Your Final Technical Score</div>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                {technicalScore}<span className="text-brand-400 text-4xl sm:text-5xl">%</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-left">
              <div>
                <div className="text-xs text-slate-400 font-medium">Highest Difficulty Reached</div>
                <div className="text-lg font-black text-emerald-400 uppercase tracking-wider mt-0.5">{highestDifficulty}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Questions Attempted, Correct, Incorrect Summary */}
      <div className="grid grid-cols-3 gap-4">
        {/* Questions Attempted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-slate-900">{effectiveAttempted}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Questions Attempted</div>
        </div>

        {/* Correct Answers */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-emerald-700">{effectiveCorrect}</div>
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Correct Answers</div>
        </div>

        {/* Incorrect Answers */}
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-red-700">{effectiveIncorrect}</div>
          <div className="text-xs font-bold text-red-800 uppercase tracking-wider">Incorrect Answers</div>
        </div>
      </div>

      {/* 3. SKILLS ASSESSED */}
      {skillsAssessed && skillsAssessed.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills Assessed</div>
          <div className="flex flex-wrap gap-2">
            {skillsAssessed.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. SKILL-WISE PERFORMANCE BREAKDOWN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Skill-Wise Performance</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Profile Skills Evaluated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(effectiveSkillScores).map(skill => {
            const data = effectiveSkillScores[skill];
            const score = data.score !== undefined ? data.score : 0;
            const status = data.status || (score >= 75 ? 'Strong' : score >= 50 ? 'Average' : 'Needs Improvement');

            const statusColors = {
              'Strong': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'Average': 'bg-amber-50 text-amber-700 border-amber-200',
              'Needs Improvement': 'bg-red-50 text-red-700 border-red-200'
            };

            return (
              <div key={skill} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between space-x-3">
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {skill}
                  </div>
                  <div className="text-xs text-slate-500">
                    {data.correctAnswers || 0} / {data.questionsAttempted || 0} correct • Level: <span className="font-semibold text-slate-700">{data.currentDifficulty || 'EASY'}</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-lg font-black text-brand-700">{score}%</div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${statusColors[status] || statusColors['Average']}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TOPIC-WISE PERFORMANCE */}
      {topicPerformance && Object.keys(topicPerformance).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Topic-Wise Breakdown</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(topicPerformance).map(topic => {
              const item = topicPerformance[topic];
              return (
                <div key={topic} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{topic}</div>
                    <div className="text-[11px] text-slate-400">{item.skill} ({item.correct}/{item.attempts} correct)</div>
                  </div>
                  <span className="font-mono font-bold text-brand-700">{item.accuracy}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. STRENGTHS & AREAS FOR IMPROVEMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Identified Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific strengths identified yet.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200 space-y-3">
          <div className="flex items-center space-x-2 text-amber-800 font-extrabold text-sm">
            <Target className="w-4 h-4 text-amber-600" />
            <span>Areas for Improvement</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {areasForImprovement && areasForImprovement.length > 0 ? (
              areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{area}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Consistent performance across all tested domains.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Aptitude Module Notice Modal / Banner */}
      {showAptitudeNotice && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm space-y-1 animate-fade-in">
          <div className="font-bold flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Aptitude & Communication Modules Coming Soon!</span>
          </div>
          <p className="text-slate-600">
            Technical Assessment is active. Your technical score has been registered for Placement Readiness calculations.
          </p>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleAptitudeClick}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue to Aptitude Assessment</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onReturnToDashboard}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-105 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return to Placement Dashboard</span>
        </button>
      </div>

    </div>
  );
};
