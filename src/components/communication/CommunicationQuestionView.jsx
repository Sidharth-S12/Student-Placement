import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flag,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  Award,
  BookOpen
} from 'lucide-react';

const CATEGORY_STYLES = {
  'Self-Introduction & Elevator Pitch': {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    border: 'border-purple-500 ring-purple-500/20'
  },
  'Project Deep-Dive & STAR Problem Solving': {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    border: 'border-indigo-500 ring-indigo-500/20'
  },
  'Technical Strengths & Self-Awareness': {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    border: 'border-emerald-500 ring-emerald-500/20'
  },
  'Team Collaboration & Conflict Resolution': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    border: 'border-blue-500 ring-blue-500/20'
  },
  'Pressure, Deadlines & Adaptability': {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    border: 'border-rose-500 ring-rose-500/20'
  },
  'Company Fit & 3-5 Year Career Vision': {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    border: 'border-amber-500 ring-amber-500/20'
  },
  'Questions for the Interview Panel': {
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    border: 'border-teal-500 ring-teal-500/20'
  }
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const CommunicationQuestionView = ({
  question,
  onSubmit,
  onNext,
  onFinishEarly,
  isSubmitted,
  submittedResult,
  isSubmitting
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef(window.speechSynthesis);

  // Reset selected option and stop speech whenever question changes
  useEffect(() => {
    setSelectedOption(null);
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
    setIsSpeaking(false);
  }, [question?.id, question?.questionIndex]);

  useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  if (!question) return null;

  const style = CATEGORY_STYLES[question.category] || CATEGORY_STYLES['Self-Introduction & Elevator Pitch'];
  const isLastQuestion = question.questionIndex >= question.totalQuestions;

  // Text-to-Speech function for listening to interviewer ask question
  const toggleSpeech = () => {
    if (!speechSynthRef.current) return;

    if (isSpeaking) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.rate = 0.95;

    const voices = speechSynthRef.current.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current.speak(utterance);
  };

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
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
            {question.category}
          </span>
          {question.topic && (
            <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {question.topic}
            </span>
          )}
          <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${
            question.difficulty === 'Hard'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : question.difficulty === 'Medium'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {question.difficulty}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Question {question.questionIndex} of {question.totalQuestions}
        </div>
      </div>

      {/* Interviewer Scenario Box */}
      <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-inner space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Company Interview Question:</span>
          </div>

          {/* TTS Listen Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
            }`}
            title="Listen to interviewer"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Question</span>
              </>
            )}
          </button>
        </div>

        {question.interviewerContext && (
          <div className="text-xs text-slate-500 font-medium italic">
            Focus: {question.interviewerContext}
          </div>
        )}

        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSubmitted && submittedResult?.lastQuestionFeedback?.correctAnswer === idx;
          const isUserWrong = isSubmitted && isSelected && !submittedResult?.lastQuestionFeedback?.isCorrect;

          let optionStyle = 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/60 bg-white text-slate-800';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-500/20 font-semibold shadow-sm';
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
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSubmitted && isCorrect
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isSubmitted && isUserWrong
                      ? 'bg-red-600 border-red-600 text-white'
                      : isSelected
                      ? 'bg-purple-600 border-purple-600 text-white'
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

      {/* Feedback & Model Answer Banner */}
      {isSubmitted && submittedResult?.lastQuestionFeedback && (
        <div className="space-y-3 animate-fade-in">
          <div
            className={`p-4 rounded-xl border ${
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
                    ? 'Excellent response! (+14.3 marks)'
                    : `Best Corporate Practice: Option ${OPTION_LABELS[submittedResult.lastQuestionFeedback.correctAnswer]}`}
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {submittedResult.lastQuestionFeedback.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Top-Tier Candidate Model Answer */}
          {(submittedResult.lastQuestionFeedback.modelAnswer || question.modelAnswer) && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs space-y-1.5 shadow-sm">
              <div className="text-[10px] font-black uppercase text-purple-300 tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exemplar Candidate Answer (Benchmark Model):</span>
              </div>
              <p className="italic text-slate-200 leading-relaxed">
                "{submittedResult.lastQuestionFeedback.modelAnswer || question.modelAnswer}"
              </p>
            </div>
          )}
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
                  ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95 shadow-purple-200'
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95 shadow-purple-200"
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
