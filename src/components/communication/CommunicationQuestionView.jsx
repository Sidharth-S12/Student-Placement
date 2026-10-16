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
    badge: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    border: 'border-purple-500 ring-purple-500/20'
  },
  'Project Deep-Dive & STAR Problem Solving': {
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    border: 'border-indigo-500 ring-indigo-500/20'
  },
  'Technical Strengths & Self-Awareness': {
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    border: 'border-emerald-500 ring-emerald-500/20'
  },
  'Team Collaboration & Conflict Resolution': {
    badge: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    border: 'border-blue-500 ring-blue-500/20'
  },
  'Pressure, Deadlines & Adaptability': {
    badge: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    border: 'border-rose-500 ring-rose-500/20'
  },
  'Company Fit & 3-5 Year Career Vision': {
    badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    border: 'border-amber-500 ring-amber-500/20'
  },
  'Questions for the Interview Panel': {
    badge: 'bg-teal-950/60 text-teal-300 border-teal-800/60',
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
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
            {question.category}
          </span>
          {question.topic && (
            <span className="text-xs text-slate-300 font-semibold bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              {question.topic}
            </span>
          )}
          <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${
            question.difficulty === 'Hard'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
              : question.difficulty === 'Medium'
              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
          }`}>
            {question.difficulty}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Question {question.questionIndex} of {question.totalQuestions}
        </div>
      </div>

      {/* Interviewer Scenario Box */}
      <div className="bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3.5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Company Interview Question:</span>
          </div>

          {/* TTS Listen Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60'
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
          <div className="text-xs text-slate-400 font-medium italic">
            Focus: {question.interviewerContext}
          </div>
        )}

        <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSubmitted && submittedResult?.lastQuestionFeedback?.correctAnswer === idx;
          const isUserWrong = isSubmitted && isSelected && !submittedResult?.lastQuestionFeedback?.isCorrect;

          let optionStyle = 'border-slate-800 hover:border-slate-700 hover:bg-slate-850 bg-slate-900/80 text-slate-200';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-purple-500 bg-purple-500/20 text-white ring-2 ring-purple-500/30 font-semibold shadow-lg shadow-purple-500/10';
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
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSubmitted && isCorrect
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : isSubmitted && isUserWrong
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : isSelected
                      ? 'bg-purple-600 border-purple-500 text-white'
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

      {/* Feedback & Model Answer Banner */}
      {isSubmitted && submittedResult?.lastQuestionFeedback && (
        <div className="space-y-3 animate-fade-in">
          <div
            className={`p-4 rounded-xl border ${
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
                    ? 'Excellent response! (+14.3 marks)'
                    : `Best Corporate Practice: Option ${OPTION_LABELS[submittedResult.lastQuestionFeedback.correctAnswer]}`}
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {submittedResult.lastQuestionFeedback.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Top-Tier Candidate Model Answer */}
          {(submittedResult.lastQuestionFeedback.modelAnswer || question.modelAnswer) && (
            <div className="p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 text-xs space-y-1.5 shadow-sm">
              <div className="text-[10px] font-black uppercase text-purple-300 tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exemplar Candidate Answer (Benchmark Model):</span>
              </div>
              <p className="italic text-slate-300 leading-relaxed">
                "{submittedResult.lastQuestionFeedback.modelAnswer || question.modelAnswer}"
              </p>
            </div>
          )}
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
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95 shadow-purple-600/30'
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95 shadow-purple-600/30"
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
