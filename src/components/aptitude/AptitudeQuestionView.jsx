import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Flag, HelpCircle, Check, BookOpen, ShieldCheck } from 'lucide-react';

const CATEGORY_COLORS = {
  'Quantitative Aptitude': {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconText: 'text-indigo-600',
    accent: 'border-indigo-500 ring-indigo-500/20'
  },
  'Logical Reasoning': {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    iconText: 'text-purple-600',
    accent: 'border-purple-500 ring-purple-500/20'
  },
  'Verbal Ability': {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconText: 'text-emerald-600',
    accent: 'border-emerald-500 ring-emerald-500/20'
  },
  'Basic Technical Aptitude': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    iconText: 'text-blue-600',
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
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle.badge}`}>
            {question.category}
          </span>
          {question.subtopic && (
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
              {question.subtopic}
            </span>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Question {question.questionIndex} of {question.totalQuestions}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
        <p className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line">
          {question.question}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSubmitted && submittedResult?.lastQuestionFeedback?.correctAnswer === idx;
          const isUserWrong = isSubmitted && isSelected && !submittedResult?.lastQuestionFeedback?.isCorrect;

          let optionStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 bg-white text-slate-800';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 font-semibold shadow-sm';
          }

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
            } else if (isUserWrong) {
              optionStyle = 'border-red-400 bg-red-50 text-red-950 font-medium';
            } else {
              optionStyle = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60';
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
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isSubmitted && isUserWrong
                      ? 'bg-red-600 border-red-600 text-white'
                      : isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-600'
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </div>
                <span className="leading-snug">{optionText}</span>
              </div>

              {isSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {isSubmitted && isUserWrong && (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
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
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start space-x-3">
            {submittedResult.lastQuestionFeedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold">
                {submittedResult.lastQuestionFeedback.isCorrect
                  ? 'Correct! (+5 marks)'
                  : `Incorrect. Correct Answer: Option ${OPTION_LABELS[submittedResult.lastQuestionFeedback.correctAnswer]}`}
              </div>
              <p className="text-slate-700 leading-relaxed font-normal">
                {submittedResult.lastQuestionFeedback.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onFinishEarly}
          disabled={isSubmitting}
          className="text-xs text-slate-500 hover:text-red-600 transition-colors flex items-center space-x-1.5 py-1 px-2.5 rounded-lg hover:bg-red-50"
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
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 ${
                selectedOption !== null && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95 shadow-indigo-200"
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
