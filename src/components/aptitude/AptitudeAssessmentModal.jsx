import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Award,
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  startAptitudeSession,
  submitAptitudeAnswer
} from '../../services/aptitudeService';
import { AptitudeQuestionView } from './AptitudeQuestionView';
import { AptitudeResultView } from './AptitudeResultView';

export const AptitudeAssessmentModal = ({
  isOpen,
  onClose,
  studentData,
  onAssessmentCompleted
}) => {
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

  // Timer state (in seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(1200); // 20:00 default
  const timerRef = useRef(null);
  const pendingSummaryRef = useRef(null);

  // Initialize new session when modal opens
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
    setRemainingSeconds(1200);
    pendingSummaryRef.current = null;

    try {
      const newSession = await startAptitudeSession(studentData);

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
      setErrorMessage(err.message || 'Failed to start Aptitude Assessment.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeAssessment();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  // Master countdown timer: ticks every 1 second based on backend endTime
  useEffect(() => {
    if (!session || !session.endTime || summaryData || (isSubmitted && (session.isCompleted || pendingSummaryRef.current))) {
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
  }, [session?.endTime, summaryData]);

  // Auto-submit on time expiry
  const handleTimeExpiredAutoSubmit = async () => {
    if (!session || isSubmitting || summaryData) return;
    setIsSubmitting(true);
    try {
      const result = await submitAptitudeAnswer(session, null, 'finish');
      if (result.isComplete && result.assessment) {
        setSummaryData(result.assessment);
        if (onAssessmentCompleted) {
          onAssessmentCompleted(result.assessment);
        }
      }
    } catch (err) {
      console.warn('[Aptitude Timer] Auto-submit error:', err.message);
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
      const result = await submitAptitudeAnswer(session, selectedOption);
      setSubmittedResult(result);
      setIsSubmitted(true);
      setLiveScore(result.currentScore !== undefined ? result.currentScore : session.currentScore);

      if (result.isComplete && result.assessment) {
        pendingSummaryRef.current = result.assessment;
        // Keep summaryData null so student can review final question answer/explanation
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

    if (pendingSummaryRef.current || session.isCompleted || (currentQuestion?.questionIndex >= 20)) {
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
      'Are you sure you want to finish the Aptitude Test early? Your final score will be calculated based on the questions answered so far.'
    );
    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const result = await submitAptitudeAnswer(session, null, 'finish');
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

  // Final return to dashboard: closes modal so test box is gone!
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
      <div className="relative bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Placement Aptitude Assessment
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
                  Groq Dynamic AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                20 Questions • 4 Mixed Domains • 5 Marks per Question
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live 20-min Countdown Timer */}
            {!summaryData && session && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm border shadow-inner ${timerColorClass}`}
                title="Strict 20-minute countdown timer. Test auto-submits on 00:00."
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}

            {/* Live Score Badge */}
            {!summaryData && session && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span className="text-slate-400">Score:</span>
                <span className="font-mono font-bold text-indigo-400">{liveScore}%</span>
              </div>
            )}

            {/* Close / Exit Button */}
            <button
              onClick={() => {
                if (!summaryData && session && !pendingSummaryRef.current) {
                  const confirmExit = window.confirm(
                    'Do you want to exit the Aptitude Test? Your current progress will be lost.'
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

        {/* Progress Bar */}
        {!summaryData && currentQuestion && (
          <div className="w-full bg-slate-800 h-1.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-brand-500 h-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentQuestion.questionIndex - 1) / 20) * 100}%`
              }}
            />
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-slate-950/40">
          {/* 1. Loading Initial Question State */}
          {isLoadingSession && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-indigo-950/40 border-2 border-indigo-800/60 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">
                  Generating Aptitude Test dynamically...
                </h3>
                <p className="text-xs text-slate-400">
                  Connecting to Groq AI to formulate original questions across Quantitative, Logical, Verbal, and Technical aptitude.
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* 3. Question Answering View */}
          {!isLoadingSession && !errorMessage && !summaryData && currentQuestion && (
            <AptitudeQuestionView
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
            <AptitudeResultView
              summaryData={summaryData}
              onReturnToDashboard={handleReturnToDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};
