import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

export const MCQQuestionView = ({
  question,
  onSubmit,
  onNext,
  isSubmitted,
  submittedResult,
  isGeneratingNext = false
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selected option when a new question arrives
  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id, question?.questionIndex]);

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
          if (
            part.includes('\n') &&
            (part.includes('=') ||
              part.includes('def ') ||
              part.includes('function ') ||
              part.includes('print(') ||
              part.includes('SELECT ') ||
              part.includes('console.log'))
          ) {
            return (
              <pre
                key={idx}
                className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner"
              >
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

  const isCorrect = Boolean(submittedResult?.correct ?? submittedResult?.isCorrect);
  const correctIdx = submittedResult?.correctAnswerIndex;
  const qNum = submittedResult?.questionNumber || question.questionIndex || 1;

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
          const isThisCorrect = isSubmitted && correctIdx !== undefined && idx === correctIdx;

          let optionStyle = 'border-slate-200 hover:border-brand-400 bg-white text-slate-700';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-brand-600 bg-brand-50/70 text-brand-900 font-semibold ring-2 ring-brand-500/20';
          }

          if (isSubmitted) {
            if (isThisCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
            } else if (isSelected && !isThisCorrect) {
              optionStyle = 'border-red-400 bg-red-50 text-red-950 font-medium';
            } else {
              optionStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleOptionClick(idx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isSubmitted && isThisCorrect
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isSubmitted && isSelected && !isThisCorrect
                      ? 'bg-red-500 border-red-500 text-white'
                      : isSelected
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 text-slate-500 bg-slate-50'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
              </div>

              {isSubmitted && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {isSubmitted && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Area: Submit (before submission) */}
      {!isSubmitted ? (
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
              selectedOption !== null
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Submit Answer</span>
          </button>
        </div>
      ) : (
        /* Post-Submission Result Card: Explicitly displays Result, Your Answer, Correct Answer, Explanation */
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-fade-in">
          <div
            className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-red-50/70 border-red-200'
            }`}
          >
            {/* Header: Question Number Result + Badge */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/80">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                Question {qNum} Result
              </h4>
              <div
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCorrect
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-red-600 text-white shadow-xs'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Correct</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>✗ Incorrect</span>
                  </>
                )}
              </div>
            </div>

            {/* Answers Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {/* Your Answer */}
              <div
                className={`p-3.5 rounded-xl border ${
                  isCorrect
                    ? 'bg-white/90 border-emerald-200 text-emerald-950'
                    : 'bg-white/90 border-red-200 text-red-950'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Your Answer:
                </div>
                <div className="font-extrabold flex items-center space-x-1.5">
                  <span className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                    {submittedResult?.yourAnswer ||
                      (selectedOption !== null
                        ? `${String.fromCharCode(65 + selectedOption)}. ${question.options[selectedOption]}`
                        : 'No answer selected')}
                  </span>
                </div>
              </div>

              {/* Correct Answer */}
              <div className="p-3.5 rounded-xl border bg-white/90 border-emerald-200 text-emerald-950">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Correct Answer:
                </div>
                <div className="font-extrabold text-emerald-700 flex items-center space-x-1.5">
                  <span>
                    {submittedResult?.correctAnswer ||
                      (correctIdx !== undefined
                        ? `${String.fromCharCode(65 + correctIdx)}. ${question.options[correctIdx]}`
                        : 'Correct answer')}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            {submittedResult?.explanation && (
              <div className="bg-white/95 rounded-xl p-4 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <span>Explanation:</span>
                </div>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-normal">
                  {submittedResult.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Performance Snapshot */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Technical Score:</span>
              <span className="font-bold text-slate-900">
                {submittedResult?.score ?? submittedResult?.liveScore ?? 0}%
              </span>
            </div>
            {submittedResult?.mlInsights?.predictedDifficulty && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-medium">Adaptive Level:</span>
                <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-bold uppercase">
                  {submittedResult.mlInsights.predictedDifficulty}
                </span>
              </div>
            )}
          </div>

          {/* Action Button: Next Question or View Results */}
          <div className="flex justify-end pt-2">
            {submittedResult?.isCompleted ? (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Finish & View Assessment Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={isGeneratingNext}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all ${
                  isGeneratingNext
                    ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 hover:scale-105 active:scale-95'
                }`}
              >
                {isGeneratingNext ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Next Question...</span>
                  </>
                ) : (
                  <>
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
