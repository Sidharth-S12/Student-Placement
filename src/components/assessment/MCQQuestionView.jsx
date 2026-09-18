import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Code } from 'lucide-react';

export const MCQQuestionView = ({
  question,
  onSubmit,
  onNext,
  isSubmitted,
  submittedResult
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!question) return null;

  const handleOptionClick = (index) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    onSubmit(selectedOption);
  };

  // Helper to extract code block if question contains code
  const renderQuestionText = (text) => {
    if (!text) return null;
    const parts = text.split('\n\n');
    return (
      <div className="space-y-3">
        {parts.map((part, idx) => {
          if (part.includes('\n') && (part.includes('=') || part.includes('def') || part.includes('function') || part.includes('print') || part.includes('SELECT'))) {
            return (
              <pre key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <code>{part}</code>
              </pre>
            );
          }
          return (
            <p key={idx} className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
              {part}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Question Header & Prompt */}
      <div className="space-y-4">
        {renderQuestionText(question.question)}
      </div>

      {/* Options List */}
      <div className="space-y-2.5 pt-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === question.correctAnswer;
          
          let optionStyle = "border-slate-200 hover:border-brand-400 bg-white text-slate-700";
          
          if (isSelected && !isSubmitted) {
            optionStyle = "border-brand-600 bg-brand-50/70 text-brand-900 font-semibold ring-2 ring-brand-500/20";
          }

          if (isSubmitted) {
            if (isCorrectAnswer) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30";
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = "border-red-400 bg-red-50 text-red-900 font-medium";
            } else {
              optionStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  isSubmitted && isCorrectAnswer 
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isSubmitted && isSelected && !isCorrectAnswer
                    ? 'bg-red-500 border-red-500 text-white'
                    : isSelected
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'border-slate-300 text-slate-500 bg-slate-50'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
              </div>

              {isSubmitted && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {isSubmitted && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Area: Submit or Next */}
      {!isSubmitted ? (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
              selectedOption !== null
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Submit Answer</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 pt-2 animate-fade-in">
          {/* Post Submission Result Banner */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
            submittedResult?.isCorrect 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {submittedResult?.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-extrabold">
                {submittedResult?.isCorrect ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
              </div>
              {question.explanation && (
                <p className="text-slate-700 leading-relaxed font-normal pt-1">
                  <span className="font-semibold text-slate-900">Explanation: </span>
                  {question.explanation}
                </p>
              )}
            </div>
          </div>

          {/* Performance Snapshot */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Skill Score ({question.skill}):</span>
              <span className="font-bold text-slate-900">{submittedResult?.skillScore || 0}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Next {question.skill} Level:</span>
              <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-bold uppercase">
                {submittedResult?.currentDifficulty || 'EASY'}
              </span>
            </div>
          </div>

          {/* Action Button: Next Question or Finish & View Dashboard */}
          <div className="flex justify-end pt-2">
            {submittedResult?.isCompleted ? (
              <button
                onClick={onNext}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>Finish & View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
