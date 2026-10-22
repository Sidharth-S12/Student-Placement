import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code,
  Terminal,
  RotateCcw,
  Loader2,
  Edit3,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { runCodeOnServer } from '../../services/assessmentService';

export const CodingQuestionView = ({
  question,
  assessmentId,
  onSubmit,
  onNext,
  onRetry,
  isSubmitted,
  submittedResult,
  isGeneratingNext = false
}) => {
  const [code, setCode] = useState(question?.starterCode || '');
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'testcases'
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [hasModifiedSinceSubmit, setHasModifiedSinceSubmit] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (question?.starterCode) {
      setCode(question.starterCode);
    }
    setTestResults(null);
    setActiveTab('editor');
    setHasModifiedSinceSubmit(false);
  }, [question?.id, question?.starterCode]);

  useEffect(() => {
    if (submittedResult?.evalDetails) {
      setTestResults(submittedResult.evalDetails);
    }
  }, [submittedResult]);

  if (!question) return null;

  // Handles Tab key inside textarea to insert 4 spaces without losing focus
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const indent = '    '; // 4 spaces for standard code indentation
      const newCode = code.substring(0, start) + indent + code.substring(end);
      setCode(newCode);
      if (isSubmitted) {
        setHasModifiedSinceSubmit(true);
      }
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + indent.length;
          textareaRef.current.selectionEnd = start + indent.length;
        }
      });
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setTestResults(null);
    if (isSubmitted) {
      setHasModifiedSinceSubmit(true);
    }
  };

  // Run code against sample test cases
  const handleRunCode = async () => {
    setIsRunningCode(true);
    try {
      const evalData = await runCodeOnServer(code, question.testCases, question.skill, assessmentId);
      setTestResults(evalData);
      setActiveTab('testcases');
    } catch (err) {
      console.warn('[CodingQuestionView] Run code failed:', err);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleSubmit = () => {
    onSubmit(code);
    setHasModifiedSinceSubmit(false);
  };

  const handleResetCode = () => {
    setCode(question.starterCode || '');
    setTestResults(null);
    setHasModifiedSinceSubmit(false);
    if (onRetry && isSubmitted) {
      onRetry();
    }
  };

  const handleEditAndRetry = () => {
    if (onRetry) {
      onRetry();
    }
    setHasModifiedSinceSubmit(true);
    setActiveTab('editor');
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    });
  };

  const isCorrect = Boolean(submittedResult?.correct ?? submittedResult?.isCorrect);
  const evalData = testResults || submittedResult?.evalDetails;
  const passedCount = evalData?.passedCount ?? 0;
  const totalCases = evalData?.total ?? (question.testCases?.length || 0);

  return (
    <div className="space-y-6">
      {/* Problem Description Header */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brand-400 font-semibold text-xs">
            <Terminal className="w-4 h-4" />
            <span>{question.skill || 'Code'} Challenge</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase">
            {question.difficulty || 'MEDIUM'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {question.question}
        </p>
      </div>

      {/* Editor & Test Cases Tabs Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'editor'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'testcases'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>
              Test Cases ({evalData ? `${passedCount}/${totalCases}` : question.testCases?.length || 0})
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetCode}
          title="Reset code to starter template"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Code</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'editor' ? (
        <div className="space-y-2">
          {isSubmitted && !isCorrect && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>You can edit your code below and re-test or re-submit your solution.</span>
              </div>
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold transition-colors"
              >
                Run Code Now
              </button>
            </div>
          )}

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg focus-within:border-brand-500/80 focus-within:ring-1 focus-within:ring-brand-500/40 transition-all">
            {/* Code Textarea with Line Numbers */}
            <div className="flex font-mono text-xs leading-relaxed">
              <div className="bg-slate-900/90 text-slate-500 select-none py-3 px-3 text-right font-mono border-r border-slate-800 min-w-[38px]">
                {code.split('\n').map((_, idx) => (
                  <div key={idx} className="leading-6">
                    {idx + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                rows={Math.max(10, Math.min(22, code.split('\n').length + 2))}
                placeholder="Write your solution here..."
                className="w-full bg-slate-950 text-emerald-400 p-3 outline-none resize-none font-mono text-xs sm:text-sm leading-6 focus:ring-0 border-none whitespace-pre overflow-x-auto selection:bg-brand-600 selection:text-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Tab</kbd> to indent</span>
            <span>{code.split('\n').length} lines</span>
          </div>
        </div>
      ) : (
        /* Test Cases View */
        <div className="space-y-3 min-h-[200px]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Evaluation Test Cases</span>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              ← Back to Code Editor
            </button>
          </div>

          {!evalData || !evalData.results ? (
            <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                Click <strong className="text-slate-200">"Run Code"</strong> to execute your code against test cases.
              </p>
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
              >
                {isRunningCode ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-xs font-bold text-slate-300">
                  {passedCount} of {totalCases} Test Cases Passed ({totalCases > 0 ? Math.round((passedCount / totalCases) * 100) : 0}%)
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                  passedCount === totalCases && totalCases > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {passedCount === totalCases && totalCases > 0 ? 'All Tests Passed' : 'Tests Incomplete'}
                </span>
              </div>
              {evalData.results.map((res) => (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                    res.passed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-white">{res.description}</div>
                      <div className="text-[11px] opacity-90 mt-1 font-mono">
                        <span className="text-slate-400">Expected:</span>{' '}
                        <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-200 border border-slate-800">
                          {res.expected}
                        </code>{' '}
                        | <span className="text-slate-400">Actual:</span>{' '}
                        <code className={`px-1.5 py-0.5 rounded border ${
                          res.passed
                            ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
                            : 'bg-rose-900/40 text-rose-300 border-rose-800'
                        }`}>
                          {res.actual}
                        </code>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded self-start sm:self-auto ${
                      res.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Controls: Run Code & Submit Answer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunningCode}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center space-x-2 border border-slate-700"
          >
            {isRunningCode ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Code</span>
              </>
            )}
          </button>

          {isSubmitted && !isCorrect && (
            <button
              type="button"
              onClick={handleEditAndRetry}
              className="px-4 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Code & Retry</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {(!isSubmitted || hasModifiedSinceSubmit || !isCorrect) && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <span>{isSubmitted && hasModifiedSinceSubmit ? 'Re-Submit Answer' : 'Submit Answer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post-Submission Result Card */}
      {isSubmitted && (
        <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
          <div
            className={`p-5 rounded-2xl border shadow-lg space-y-4 ${
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-800/40'
                : 'bg-rose-950/20 border-rose-800/40'
            }`}
          >
            {/* Header: Result Status */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center space-x-2">
                <span>Coding Evaluation Result</span>
              </h4>
              <div
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCorrect
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Challenge Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>✗ Test Cases Failed</span>
                  </>
                )}
              </div>
            </div>

            {/* Test Cases Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border bg-slate-900 border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Test Cases Passed:
                </div>
                <div className="font-extrabold text-white text-base">
                  {passedCount} / {totalCases} ({totalCases > 0 ? Math.round((passedCount / totalCases) * 100) : 0}%)
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-slate-900 border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Optimal Solution Approach:
                </div>
                <div className="font-mono text-slate-300 text-xs truncate">
                  {submittedResult?.correctAnswer || question.starterCode || 'Correct implementation satisfying all test cases'}
                </div>
              </div>
            </div>

            {/* Test Case Breakdown */}
            {submittedResult?.evalDetails?.results && (
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Execution Details:
                </div>
                <div className="space-y-1.5">
                  {submittedResult.evalDetails.results.map((tc) => (
                    <div
                      key={tc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs p-2 rounded-lg bg-slate-950 border border-slate-800"
                    >
                      <div className="flex items-center space-x-2">
                        {tc.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="font-medium text-slate-200">{tc.description}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Expected: <span className="text-slate-300">{tc.expected}</span> | Actual: <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actual}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation Section */}
            {submittedResult?.explanation && (
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Explanation & Complexity:
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {submittedResult.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Performance Snapshot */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Technical Score:</span>
              <span className="font-bold text-white">
                {submittedResult?.score ?? submittedResult?.liveScore ?? 0}%
              </span>
            </div>
            {submittedResult?.mlInsights?.predictedDifficulty && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Adaptive Level:</span>
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold uppercase">
                  {submittedResult.mlInsights.predictedDifficulty}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: Edit & Retry or Next Question */}
          <div className="flex items-center justify-between pt-2">
            {!isCorrect ? (
              <button
                type="button"
                onClick={handleEditAndRetry}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-amber-600/30"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Code & Try Again</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Challenge Completed Successfully</span>
              </div>
            )}

            <div>
              {submittedResult?.isCompleted ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Finish & View Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  disabled={isGeneratingNext}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all ${
                    isGeneratingNext
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 hover:scale-105 active:scale-95'
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
        </div>
      )}
    </div>
  );
};
