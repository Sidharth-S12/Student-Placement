import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Mic,
  Award,
  Video
} from 'lucide-react';
import {
  startCommunicationSession,
  submitCommunicationAnswer
} from '../../services/communicationService';
import { CommunicationQuestionView } from './CommunicationQuestionView';
import { CommunicationResultView } from './CommunicationResultView';
import { InterviewPracticeStudio } from './InterviewPracticeStudio';

export const CommunicationAssessmentModal = ({
  isOpen,
  onClose,
  studentData,
  onAssessmentCompleted,
  initialMode = 'assessment' // 'assessment' | 'practice'
}) => {
  const [viewMode, setViewMode] = useState(initialMode); // 'assessment' | 'practice'
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [nextQuestionCache, setNextQuestionCache] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [liveScore, setLiveScore] = useState(0);

  // Timer state (in seconds) - 10 minutes default for 7 questions
  const [remainingSeconds, setRemainingSeconds] = useState(600);
  const timerRef = useRef(null);
  const pendingSummaryRef = useRef(null);

  // Reset or initialize session when modal opens
  const initializeAssessment = async () => {
    setIsLoadingSession(true);
    setErrorMessage(null);
    setSession(null);
    setCurrentQuestion(null);
    setNextQuestionCache(null);
    setSubmittedResult(null);
    setIsSubmitted(false);
    setSummaryData(null);
    setLiveScore(0);
    setRemainingSeconds(600);
    pendingSummaryRef.current = null;

    try {
      const newSession = await startCommunicationSession(studentData);

      if (newSession.error) {
        setErrorMessage(newSession.error);
        setSession(null);
      } else {
        setSession(newSession);
        setCurrentQuestion(newSession.currentQuestion);
        if (newSession.endTime) {
          const rem = Math.max(0, Math.round((newSession.endTime - Date.now()) / 1000));
          setRemainingSeconds(rem);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start Placement Interview Assessment.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode || 'assessment');
      if (initialMode !== 'practice') {
        initializeAssessment();
      }
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, initialMode]);

  // Master countdown timer: ticks every 1 second based on backend endTime
  useEffect(() => {
    if (viewMode !== 'assessment' || !session || !session.endTime || summaryData || (isSubmitted && (session.isCompleted || pendingSummaryRef.current))) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((session.endTime - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      // Auto-submit when time reaches 00:00
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimeExpiredAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [viewMode, session?.endTime, summaryData]);

  // Auto-submit on time expiry
  const handleTimeExpiredAutoSubmit = async () => {
    if (!session || isSubmitting || summaryData) return;
    setIsSubmitting(true);
    try {
      const result = await submitCommunicationAnswer(session, null, 'finish');
      if (result.isComplete && result.assessment) {
        setSummaryData(result.assessment);
        if (onAssessmentCompleted) {
          onAssessmentCompleted(result.assessment);
        }
      }
    } catch (err) {
      console.warn('[Interview Timer] Auto-submit error:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Format MM:SS for countdown timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit Answer handler
  const handleAnswerSubmit = async (selectedOption) => {
    if (!session || !currentQuestion || isSubmitted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitCommunicationAnswer(session, selectedOption);
      setSubmittedResult(result);
      setIsSubmitted(true);
      setLiveScore(result.currentScore !== undefined ? result.currentScore : session.currentScore);

      if (result.isComplete && result.assessment) {
        pendingSummaryRef.current = result.assessment;
      } else if (result.nextQuestion) {
        setNextQuestionCache(result.nextQuestion);
      }
    } catch (err) {
      alert(`Submission error: ${err.message || 'Failed to submit answer.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance to next question or finalize
  const handleNextQuestion = () => {
    if (!session) return;

    if (pendingSummaryRef.current || session.isCompleted || (currentQuestion?.questionIndex >= (session.totalQuestions || 7))) {
      const finalRes = pendingSummaryRef.current || submittedResult?.assessment;
      if (finalRes) {
        setSummaryData(finalRes);
        if (onAssessmentCompleted) {
          onAssessmentCompleted(finalRes);
        }
      }
      return;
    }

    if (nextQuestionCache) {
      setCurrentQuestion(nextQuestionCache);
      setNextQuestionCache(null);
      setIsSubmitted(false);
      setSubmittedResult(null);
    }
  };

  // Finish early handler
  const handleFinishEarly = async () => {
    if (!session || isSubmitting) return;
    const confirm = window.confirm(
      'Are you sure you want to finish the Interview Assessment early? Your score will be calculated based on the questions answered so far.'
    );
    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const result = await submitCommunicationAnswer(session, null, 'finish');
      if (result.isComplete && result.assessment) {
        setSummaryData(result.assessment);
        if (onAssessmentCompleted) {
          onAssessmentCompleted(result.assessment);
        }
      }
    } catch (err) {
      alert(`Error finishing assessment: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToDashboard = () => {
    if (onAssessmentCompleted && summaryData) {
      onAssessmentCompleted(summaryData);
    }
    onClose();
  };

  const timerColorClass =
    remainingSeconds <= 120
      ? 'bg-rose-950/60 border-rose-800/60 text-rose-300 animate-pulse'
      : remainingSeconds <= 300
      ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
      : 'bg-slate-800 border-slate-700 text-slate-200';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[94vh] text-slate-100">

        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Placement Interview & Communication
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/60 text-purple-300 border border-purple-800/60">
                  7 Core Company Questions
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Self-Intro • STAR Projects • Strengths & Weaknesses • Conflict • Deadlines • Company Fit
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl text-xs font-bold border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setViewMode('assessment');
                if (!session && !isLoadingSession) {
                  initializeAssessment();
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                viewMode === 'assessment'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Assessment (7 Qs)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                viewMode === 'practice'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>AI Mock Studio</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Countdown Timer (only in assessment mode when not viewing results) */}
            {viewMode === 'assessment' && !summaryData && session && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm border shadow-inner ${timerColorClass}`}
                title="Strict 10-minute timer for 7 interview questions. Test auto-submits on 00:00."
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}

            {/* Live Score Badge */}
            {viewMode === 'assessment' && !summaryData && session && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span className="text-slate-400">Score:</span>
                <span className="font-mono font-bold text-purple-400">{liveScore}%</span>
              </div>
            )}

            {/* Close / Exit Button */}
            <button
              onClick={() => {
                if (viewMode === 'assessment' && !summaryData && session && !pendingSummaryRef.current) {
                  const confirmExit = window.confirm(
                    'Do you want to exit the Interview Assessment? Your current progress will be lost.'
                  );
                  if (!confirmExit) return;
                }
                if (pendingSummaryRef.current && !summaryData && onAssessmentCompleted) {
                  onAssessmentCompleted(pendingSummaryRef.current);
                }
                onClose();
              }}
              className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Only during assessment) */}
        {viewMode === 'assessment' && !summaryData && currentQuestion && (
          <div className="w-full bg-slate-800 h-1.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentQuestion.questionIndex - 1) / (session?.totalQuestions || 7)) * 100}%`
              }}
            />
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-slate-950/40">
          {/* VIEW MODE 1: Interactive AI Mock Interview Studio (Extra Feature) */}
          {viewMode === 'practice' && (
            <InterviewPracticeStudio
              onSwitchToAssessment={() => {
                setViewMode('assessment');
                if (!session) {
                  initializeAssessment();
                }
              }}
            />
          )}

          {/* VIEW MODE 2: Formal Assessment */}
          {viewMode === 'assessment' && (
            <>
              {/* 1. Loading Initial Session State */}
              {isLoadingSession && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-950/40 border-2 border-purple-800/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-white">
                      Generating 7 Core Company Interview Questions...
                    </h3>
                    <p className="text-xs text-slate-400">
                      Formulating practical placement interview scenarios asked by top corporate recruiters (Self-intro, STAR projects, strengths, conflict, deadlines).
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Error State */}
              {errorMessage && !isLoadingSession && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-white">Unable to Start Assessment</h3>
                    <p className="text-xs text-rose-400">{errorMessage}</p>
                  </div>
                  <button
                    onClick={initializeAssessment}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-lg shadow-purple-600/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}

              {/* 3. Question Answering View */}
              {!isLoadingSession && !errorMessage && !summaryData && currentQuestion && (
                <CommunicationQuestionView
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                  onNext={handleNextQuestion}
                  onFinishEarly={handleFinishEarly}
                  isSubmitted={isSubmitted}
                  submittedResult={submittedResult}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* 4. Assessment Complete Results View */}
              {!isLoadingSession && summaryData && (
                <CommunicationResultView
                  summaryData={summaryData}
                  onReturnToDashboard={handleReturnToDashboard}
                  onOpenPracticeStudio={() => setViewMode('practice')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
