import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, ArrowRight, Code, Terminal, RotateCcw } from 'lucide-react';
import { evaluateCodingSubmission } from '../../services/assessmentService';

export const CodingQuestionView = ({
  question,
  onSubmit,
  onNext,
  isSubmitted,
  submittedResult,
  isGeneratingNext = false
}) => {
  const [code, setCode] = useState(question?.starterCode || '');
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'testcases'

  useEffect(() => {
    if (question?.starterCode) {
      setCode(question.starterCode);
    }
    setTestResults(null);
    setActiveTab('editor');
  }, [question?.id, question?.starterCode]);

  if (!question) return null;

  const handleRunCode = () => {
    const evalData = evaluateCodingSubmission(code, question.testCases);
    setTestResults(evalData);
    setActiveTab('testcases');
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    onSubmit(code);
  };

  const handleResetCode = () => {
    if (isSubmitted) return;
    setCode(question.starterCode || '');
    setTestResults(null);
  };

  const isCorrect = Boolean(submittedResult?.correct ?? submittedResult?.isCorrect);
  const evalData = submittedResult?.evalDetails || testResults;
  const passedCount = evalData?.passedCount ?? 0;
  const totalCases = evalData?.total ?? (question.testCases?.length || 0);

  return (
    <div className="space-y-6">
      {/* Problem Description */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2 text-brand-400 font-semibold text-xs">
          <Terminal className="w-4 h-4" />
          <span>{question.skill} Coding Challenge</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {question.question}
        </p>
      </div>

      {/* Editor & Test Cases Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'editor'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'testcases'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Test Cases ({evalData ? `${passedCount}/${totalCases}` : question.testCases?.length || 0})</span>
          </button>
        </div>

        {!isSubmitted && (
          <button
            type="button"
            onClick={handleResetCode}
            title="Reset code to starter code"
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'editor' ? (
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          {/* Code Textarea with line styling */}
          <div className="flex font-mono text-xs leading-relaxed">
            <div className="bg-slate-900 text-slate-600 select-none py-3 px-3.5 text-right font-mono border-r border-slate-800 min-w-[40px]">
              {code.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => !isSubmitted && setCode(e.target.value)}
              readOnly={isSubmitted}
              spellCheck="false"
              rows={12}
              className="w-full bg-slate-950 text-emerald-400 p-3 outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed focus:ring-0 border-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 min-h-[220px]">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Test Case Results
          </div>

          {!evalData || !evalData.results ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Click <span className="font-bold text-slate-700">"Run Code"</span> to evaluate your code against sample test cases.
            </div>
          ) : (
            <div className="space-y-2">
              {evalData.results.map((res) => (
                <div
                  key={res.id}
                  className={`p-3 rounded-xl border flex items-start justify-between text-xs ${
                    res.passed
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-red-50/80 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{res.description}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">
                        Expected: <code className="font-mono bg-white/60 px-1 py-0.5 rounded">{res.expected}</code> |
                        Received: <code className="font-mono bg-white/60 px-1 py-0.5 rounded">{res.actual}</code>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-extrabold text-[11px] px-2 py-0.5 rounded ${
                      res.passed ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
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

      {/* Action Controls before Submission */}
      {!isSubmitted ? (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleRunCode}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-slate-100 font-semibold text-xs transition-all flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Run Code</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all active:scale-95"
          >
            <span>Submit Answer</span>
          </button>
        </div>
      ) : (
        /* Post-Submission Result Card */
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-fade-in">
          <div
            className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-red-50/70 border-red-200'
            }`}
          >
            {/* Header: Result Status */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/80">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                Coding Evaluation Result
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
              <div className="p-3.5 rounded-xl border bg-white/90 border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Test Cases Passed:
                </div>
                <div className="font-extrabold text-slate-900 text-base">
                  {passedCount} / {totalCases} ({totalCases > 0 ? Math.round((passedCount / totalCases) * 100) : 0}%)
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-white/90 border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Correct Solution Approach:
                </div>
                <div className="font-semibold text-slate-800 text-xs line-clamp-2">
                  {submittedResult?.correctAnswer || question.topic || 'Optimal algorithm solution'}
                </div>
              </div>
            </div>

            {/* Test Case Breakdown if available */}
            {submittedResult?.evalDetails?.results && (
              <div className="bg-white/95 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Execution Details:
                </div>
                <div className="space-y-1.5">
                  {submittedResult.evalDetails.results.map((tc) => (
                    <div
                      key={tc.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center space-x-2">
                        {tc.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        )}
                        <span className="font-medium text-slate-700">{tc.description}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        Expected: {tc.expected} | Actual: {tc.actual}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation Section */}
            {submittedResult?.explanation && (
              <div className="bg-white/95 rounded-xl p-4 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Explanation & Complexity:
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

          {/* Action Button: Next Question or Finish */}
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
