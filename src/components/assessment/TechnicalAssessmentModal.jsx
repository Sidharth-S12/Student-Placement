import React, { useState, useEffect, useRef } from 'react';
import { X, Cpu, Loader2, Sparkles, Target, AlertCircle, RefreshCw } from 'lucide-react';
import {
  startAssessmentSession,
  submitQuestionAnswer,
  fetchNextQuestion
} from '../../services/assessmentService';
import { MCQQuestionView } from './MCQQuestionView';
import { CodingQuestionView } from './CodingQuestionView';
import { AssessmentResultView } from './AssessmentResultView';

export const TechnicalAssessmentModal = ({
  isOpen,
  onClose,
  studentData,
  onAssessmentCompleted
}) => {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nextQuestionError, setNextQuestionError] = useState(null);
  const [liveScore, setLiveScore] = useState(0);

  const questionStartTimeRef = useRef(Date.now());
  const isGeneratingNextRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const initializedSessionIdRef = useRef(null);
  const pendingSummaryRef = useRef(null);

  // Initialize assessment session when modal opens
  const initializeAssessment = async () => {
    if (!studentData) return;

    setIsLoadingSession(true);
    setErrorMessage(null);
    setNextQuestionError(null);
    setSession(null);
    setCurrentQuestion(null);
    setSubmittedResult(null);
    setIsSubmitted(false);
    setSummaryData(null);
    setLiveScore(0);
    isGeneratingNextRef.current = false;
    isSubmittingRef.current = false;
    pendingSummaryRef.current = null;

    try {
      const newSession = await startAssessmentSession(studentData);

      if (newSession.error) {
        setErrorMessage(newSession.error);
        setSession(null);
      } else {
        setSession(newSession);
        setCurrentQuestion(newSession.currentQuestion);
        initializedSessionIdRef.current = newSession.assessmentId;
        questionStartTimeRef.current = Date.now();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start technical assessment.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    if (isOpen && studentData) {
      initializeAssessment();
    } else {
      initializedSessionIdRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle student answer submission (instant backend evaluation)
  const handleAnswerSubmit = async (studentAnswer) => {
    if (!session || !currentQuestion || isSubmitted || isSubmittingRef.current) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setNextQuestionError(null);

    try {
      const result = await submitQuestionAnswer(session, studentAnswer, responseTimeMs);
      setSubmittedResult(result);
      setIsSubmitted(true);
      setLiveScore(result.score !== undefined ? result.score : (result.liveScore ?? session.technicalScore));

      if (result.isCompleted && result.finalResult) {
        pendingSummaryRef.current = result.finalResult;
        // Keep summaryData null so student can review final question answer/explanation
      }
    } catch (err) {
      alert(`Submission error: ${err.message || 'Failed to evaluate answer.'}`);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Move to next question after viewing answer explanation
  const handleNextQuestion = async () => {
    if (!session || isGeneratingNextRef.current) return;

    // If assessment finished at Question 15, switch to final results view
    if (pendingSummaryRef.current || session.isCompleted || submittedResult?.isCompleted) {
      const finalRes = pendingSummaryRef.current || submittedResult?.finalResult;
      if (finalRes) {
        setSummaryData(finalRes);
        if (onAssessmentCompleted) {
          onAssessmentCompleted(finalRes);
        }
      }
      return;
    }

    // Generate Question N+1 on-demand via Groq AI
    isGeneratingNextRef.current = true;
    setIsGeneratingNext(true);
    setNextQuestionError(null);

    try {
      const nextData = await fetchNextQuestion(session);

      if (nextData && nextData.question) {
        setCurrentQuestion(nextData.question);
        setSubmittedResult(null);
        setIsSubmitted(false);
        questionStartTimeRef.current = Date.now();
      } else {
        throw new Error('No question returned from server.');
      }
    } catch (err) {
      console.error('[TechnicalAssessmentModal] Error loading next question:', err);
      setNextQuestionError(err.message || 'Unable to generate the next question. Please try again.');
    } finally {
      isGeneratingNextRef.current = false;
      setIsGeneratingNext(false);
    }
  };

  const handleClose = () => {
    if (session && !session.isCompleted && !pendingSummaryRef.current && session.attemptedQuestions > 0 && !summaryData) {
      if (!window.confirm("Are you sure you want to exit the assessment midway? Your completed progress will be saved.")) {
        return;
      }
    }
    if (pendingSummaryRef.current && !summaryData && onAssessmentCompleted) {
      onAssessmentCompleted(pendingSummaryRef.current);
    }
    onClose();
  };

  const currentQNum = currentQuestion?.questionIndex || session?.currentQuestionNumber || (session?.attemptedQuestions ? session.attemptedQuestions + 1 : 1);
  const totalQ = session?.totalQuestions || 15;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Assessment Header */}
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-none">TECHNICAL SKILL ASSESSMENT</h2>
              <p className="text-[11px] text-slate-400 mt-1">Real-Time Groq AI & ML Adaptive Difficulty</p>
            </div>
          </div>

          {/* Live Score Display */}
          {session && !summaryData && (
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <Target className="w-4 h-4 text-brand-400" />
              <span className="text-xs text-slate-300 font-medium">Technical Score:</span>
              <span className="text-sm font-black text-white">{liveScore}%</span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* Error View on Session Initialization */}
          {errorMessage && (
            <div className="max-w-xl mx-auto py-10 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Assessment Initialization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {errorMessage}
              </p>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={initializeAssessment}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Initial Session Loading State */}
          {isLoadingSession && !errorMessage && (
            <div className="max-w-lg mx-auto py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner border border-brand-100 animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Generating Question 1...
                </h3>
                <p className="text-xs text-slate-500">
                  Groq AI is dynamically generating a personalized question based on your verified skills and EASY difficulty target.
                </p>
              </div>
            </div>
          )}

          {/* Generating Next Question Loading State */}
          {isGeneratingNext && !errorMessage && (
            <div className="max-w-lg mx-auto py-16 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner border border-indigo-100 animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Generating your next question...
                </h3>
                <p className="text-xs text-slate-500">
                  Preparing a question based on your skills and performance.
                </p>
              </div>
            </div>
          )}

          {/* Active Question Flow */}
          {!isLoadingSession && !isGeneratingNext && session && !summaryData && currentQuestion && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Progress Indicator & Badges */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center space-x-2">
                    <span>Question {currentQNum} of {totalQ}</span>
                    <span className="sm:hidden font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      Score: {liveScore}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Skill Badge */}
                    <span className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 font-bold border border-brand-200">
                      Skill: {currentQuestion.skill}
                    </span>

                    {/* Topic Badge */}
                    {currentQuestion.topic && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        Topic: {currentQuestion.topic}
                      </span>
                    )}

                    {/* Difficulty Badge */}
                    <span className={`px-2.5 py-1 rounded-lg font-bold uppercase border ${
                      currentQuestion.difficulty === 'HARD'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : currentQuestion.difficulty === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                    style={{
                      width: `${(currentQNum / totalQ) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Next Question Generation Error Banner (preserves session & score) */}
              {nextQuestionError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 animate-fade-in">
                  <div className="flex items-center space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>{nextQuestionError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Question View (MCQ / Coding) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
                {currentQuestion.type === 'mcq' ? (
                  <MCQQuestionView
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    onNext={handleNextQuestion}
                    isSubmitted={isSubmitted}
                    submittedResult={submittedResult}
                    isGeneratingNext={isGeneratingNext}
                  />
                ) : (
                  <CodingQuestionView
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    onNext={handleNextQuestion}
                    isSubmitted={isSubmitted}
                    submittedResult={submittedResult}
                    isGeneratingNext={isGeneratingNext}
                  />
                )}
              </div>

            </div>
          )}

          {/* Assessment Completed Result View */}
          {summaryData && (
            <AssessmentResultView
              summaryData={summaryData}
              onReturnToDashboard={onClose}
            />
          )}

        </div>
      </div>
    </div>
  );
};

