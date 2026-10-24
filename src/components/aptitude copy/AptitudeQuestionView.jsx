import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Flag, HelpCircle, Check, BookOpen, ShieldCheck } from 'lucide-react';

const CATEGORY_COLORS = {
  'Quantitative Aptitude': {
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    iconText: 'text-indigo-400',
    accent: 'border-indigo-500 ring-indigo-500/20'
  },
  'Logical Reasoning': {
    badge: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    iconText: 'text-purple-400',
    accent: 'border-purple-500 ring-purple-500/20'
  },
  'Verbal Ability': {
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    iconText: 'text-emerald-400',
    accent: 'border-emerald-500 ring-emerald-500/20'
  },
  'Basic Technical Aptitude': {
    badge: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    iconText: 'text-blue-400',
    accent: 'border-blue-500 ring-blue-500/20'
  }
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const AptitudeQuestionView = ({
  question,
  onSubmit,
  onNext,
  onFinishEarly,
  isSubmitted,
  submittedResult,
  isSubmitting
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selected option whenever question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id, question?.questionIndex]);

  if (!question) return null;

  const categoryStyle = CATEGORY_COLORS[question.category] || CATEGORY_COLORS['Quantitative Aptitude'];
  const isLastQuestion = question.questionIndex >= question.totalQuestions;

  const handleOptionClick = (idx) => {
    if (isSubmitted || isSubmitting) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted || isSubmitting) return;
    onSubmit(selectedOption);
  };

  return (
    <div className="space-y-6">
      {/* Category & Topic Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle.badge}`}>
            {question.category}
          </span>
          {question.subtopic && (
            <span className="text-xs text-slate-300 font-medium bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              {question.subtopic}
            </span>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Question {question.questionIndex} of {question.totalQuestions}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line">
          {question.question}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSubmitted && submittedResult?.lastQuestionFeedback?.correctAnswer === idx;
          const isUserWrong = isSubmitted && isSelected && !submittedResult?.lastQuestionFeedback?.isCorrect;

          let optionStyle = 'border-slate-800 hover:border-slate-700 hover:bg-slate-850 bg-slate-900/80 text-slate-200';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-indigo-500 bg-indigo-500/20 text-white ring-2 ring-indigo-500/30 font-semibold shadow-lg shadow-indigo-500/10';
          }

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500/80 bg-emerald-950/50 text-emerald-200 font-bold ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10';
            } else if (isUserWrong) {
              optionStyle = 'border-rose-500/80 bg-rose-950/50 text-rose-200 font-medium ring-1 ring-rose-500/30';
            } else {
              optionStyle = 'border-slate-800/60 bg-slate-900/40 text-slate-500 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleOptionClick(idx)}
              disabled={isSubmitted || isSubmitting}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${optionStyle}`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSubmitted && isCorrect
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : isSubmitted && isUserWrong
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </div>
                <span className="leading-snug">{optionText}</span>
              </div>

              {isSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
              {isSubmitted && isUserWrong && (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation Banner */}
      {isSubmitted && submittedResult?.lastQuestionFeedback && (
        <div
          className={`p-4 rounded-xl border animate-fade-in ${
            submittedResult.lastQuestionFeedback.isCorrect
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            {submittedResult.lastQuestionFeedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold">
                {submittedResult.lastQuestionFeedback.isCorrect
                  ? 'Correct! (+5 marks)'
                  : `Incorrect. Correct Answer: Option ${OPTION_LABELS[submittedResult.lastQuestionFeedback.correctAnswer]}`}
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {submittedResult.lastQuestionFeedback.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onFinishEarly}
          disabled={isSubmitting}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center space-x-1.5 py-1 px-2.5 rounded-lg hover:bg-rose-950/30"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Submit & Finish Test Early</span>
        </button>

        <div className="w-full sm:w-auto flex items-center justify-end space-x-3">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
                selectedOption !== null && !isSubmitting
                  ? 'bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white active:scale-95 shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95 shadow-indigo-600/30"
            >
              <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
