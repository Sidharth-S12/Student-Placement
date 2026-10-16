import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Award,
  Clock,
  Eye,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { CORE_INTERVIEW_QUESTIONS, evaluatePracticeInterviewAnswer } from '../../services/communicationService';

export const InterviewPracticeStudio = ({ onSwitchToAssessment }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeGuideTab, setActiveGuideTab] = useState('star'); // 'star' | 'tips' | 'model'
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(window.speechSynthesis);

  const currentQuestion = CORE_INTERVIEW_QUESTIONS[selectedQuestionIndex];

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Reset answer & feedback when switching questions
  useEffect(() => {
    setAnswerText('');
    setFeedback(null);
    setShowModelAnswer(false);
    stopSpeaking();
    stopListening();
  }, [selectedQuestionIndex]);

  // Webcam Controls
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('[InterviewStudio] Camera permission error:', err);
      setCameraError('Camera access unavailable or declined. You can still practice speaking or typing.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Text-to-Speech (Interviewer Voice)
  const speakQuestion = () => {
    if (!speechSynthRef.current) return;

    if (isSpeaking) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    speechSynthRef.current.cancel(); // cancel any active speech

    const textToSpeak = currentQuestion.interviewPrompt || currentQuestion.question;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // realistic professional pacing
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = speechSynthRef.current.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  // Speech-to-Text Microphone Input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser. You can type your answer directly in the text box!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setAnswerText(prev => (prev ? prev + ' ' : '') + event.results[i][0].transcript);
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('[Speech Recognition] Error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('[Speech Recognition] Start failure:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // AI Evaluation of student's spoken / typed response
  const handleEvaluate = async () => {
    if (!answerText.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setFeedback(null);

    try {
      const result = await evaluatePracticeInterviewAnswer({
        question: currentQuestion.interviewPrompt || currentQuestion.question,
        answerText: answerText.trim(),
        category: currentQuestion.category
      });
      setFeedback(result);
    } catch (err) {
      alert(`Could not evaluate response: ${err.message || 'Please verify backend is active.'}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Question Navigation Bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-400/20 text-purple-300 border border-purple-400/30">
              Interactive Interview Simulator
            </span>
            <span className="text-xs text-purple-200">
              Realistic Campus Placement Practice
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How Top Companies Conduct Interviews
          </h2>
          <p className="text-xs text-purple-100/80 max-w-xl">
            Practice answering the 7 most common interview questions. Hear the interviewer speak, inspect your webcam posture, practice with speech-to-text, and master the STAR methodology.
          </p>
        </div>

        {onSwitchToAssessment && (
          <button
            type="button"
            onClick={onSwitchToAssessment}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-900 transition-all active:scale-95 flex items-center space-x-1.5 flex-shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Take 7-Question Graded Test</span>
          </button>
        )}
      </div>

      {/* 7 Questions Quick Tab Switcher */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>SELECT INTERVIEW QUESTION (7 CORE ROUNDS)</span>
          <span className="font-bold text-purple-700">Question {selectedQuestionIndex + 1} of 7</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {CORE_INTERVIEW_QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelectedQuestionIndex(idx)}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                selectedQuestionIndex === idx
                  ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-md shadow-purple-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                  selectedQuestionIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  Q{idx + 1}
                </span>
                <span className={`text-[10px] ${selectedQuestionIndex === idx ? 'text-purple-200' : 'text-slate-400'}`}>
                  {q.difficulty}
                </span>
              </div>
              <div className="font-medium truncate mt-1 text-[11px]" title={q.topic}>
                {q.topic}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Practice Simulation Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interviewer Prompt & Video Presence (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* AI Interviewer Audio Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none">
                    Lead Technical Interviewer
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {currentQuestion.interviewerContext}
                  </span>
                </div>
              </div>

              {/* Text-to-Speech Button */}
              <button
                type="button"
                onClick={speakQuestion}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
                  isSpeaking
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen to interviewer ask question'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Speaking equalizer animation if playing */}
            {isSpeaking && (
              <div className="flex items-center justify-center space-x-1 py-1 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wide mr-2">Speaking Question:</span>
                <span className="w-1 h-3 bg-purple-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-4 bg-purple-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1 h-6 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* Spoken Prompt */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                Question Prompt:
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                "{currentQuestion.interviewPrompt || currentQuestion.question}"
              </p>
            </div>
          </div>

          {/* Student Video Mirror / Camera Presence Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Webcam & Body Language Mirror</span>
              </div>
              <button
                type="button"
                onClick={toggleCamera}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  isCameraActive
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isCameraActive ? (
                  <>
                    <VideoOff className="w-3.5 h-3.5 text-rose-600" />
                    <span>Turn Off Camera</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>Enable Webcam Mirror</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Viewport or Placeholder */}
            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {!isCameraActive && (
                <div className="text-center p-4 space-y-2 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <VideoOff className="w-6 h-6" />
                  </div>
                  <p className="text-xs max-w-xs mx-auto">
                    Camera is currently off. Turn it on to practice looking at the camera, eye contact, and professional virtual posture.
                  </p>
                </div>
              )}

              {/* Live Status Overlay */}
              {isCameraActive && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold flex items-center space-x-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Live Video Mirror Active</span>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                {cameraError}
              </p>
            )}

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Video stream is processed entirely local inside your browser. No video is recorded or sent to any server.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Answer Input & STAR Coaching (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Answer Recording Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Your Spoken / Written Response
                </span>
                <span className="text-xs text-slate-400">
                  ({wordCount} words)
                </span>
              </div>

              {/* Microphone Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-red-200'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                }`}
                title="Speak using your microphone"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Speak Answer (Speech-to-Text)</span>
                  </>
                )}
              </button>
            </div>

            {/* Answer Text Area */}
            <div className="relative">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Click 'Speak Answer' to speak using your microphone, or type your response here... (Aim for 60-120 words using the STAR method)"
                rows={5}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 text-slate-800 text-xs sm:text-sm font-normal resize-none leading-relaxed transition-all"
              />

              {isListening && (
                <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-2 py-1 rounded bg-red-50 text-red-700 text-[11px] font-bold border border-red-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>Listening to your voice...</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Clear & Analyze */}
            <div className="flex items-center justify-between pt-1">
              {answerText && (
                <button
                  type="button"
                  onClick={() => setAnswerText('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear response
                </button>
              )}

              <div className="flex items-center space-x-2 ml-auto">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={wordCount < 5 || isEvaluating}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-sm ${
                    wordCount >= 5 && !isEvaluating
                      ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95 shadow-purple-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing with AI Coach...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze My Answer with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Feedback Card (When evaluated) */}
          {feedback && (
            <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-200 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-900 text-sm">
                    AI Interviewer Feedback & Evaluation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-purple-700 font-medium">Readiness Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-700 text-white font-mono font-bold text-sm">
                    {feedback.score}%
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {feedback.feedback}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Strengths */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>What You Did Well:</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-700 list-disc list-inside">
                    {feedback.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>How to Strengthen Answer:</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-700 list-disc list-inside">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Coaching & STAR Methodology Guide Tabs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setActiveGuideTab('star')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  activeGuideTab === 'star'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                STAR Method Framework
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('tips')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  activeGuideTab === 'tips'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hiring Manager Tips & Traps
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('model')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  activeGuideTab === 'model'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Model / Exemplar Answer
              </button>
            </div>

            {/* Tab 1: STAR Breakdown */}
            {activeGuideTab === 'star' && currentQuestion.starGuide && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-black text-purple-700 uppercase text-[10px] block">
                    [S] Situation
                  </span>
                  <p className="text-slate-700 leading-snug">{currentQuestion.starGuide.situation}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-black text-indigo-700 uppercase text-[10px] block">
                    [T] Task
                  </span>
                  <p className="text-slate-700 leading-snug">{currentQuestion.starGuide.task}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-black text-teal-700 uppercase text-[10px] block">
                    [A] Action
                  </span>
                  <p className="text-slate-700 leading-snug">{currentQuestion.starGuide.action}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-black text-emerald-700 uppercase text-[10px] block">
                    [R] Result
                  </span>
                  <p className="text-slate-700 leading-snug">{currentQuestion.starGuide.result}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Recruiter Tips & Traps */}
            {activeGuideTab === 'tips' && (
              <div className="space-y-2.5 text-xs animate-fade-in">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    What Recruiters Value Most:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">
                    Common Mistakes to Avoid:
                  </span>
                  <ul className="text-slate-700 list-disc list-inside space-y-0.5">
                    <li>Rambling without clear bullet points or structure.</li>
                    <li>Speaking about general theory rather than specific projects you personally touched.</li>
                    <li>Blaming previous teammates or college professors.</li>
                    <li>Giving fake weaknesses (e.g. "I work too hard").</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Model Answer */}
            {activeGuideTab === 'model' && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-purple-300 font-bold uppercase text-[10px]">
                  <span>Top-Tier Candidate Exemplar Answer</span>
                  <span>Benchmark</span>
                </div>
                <p className="italic leading-relaxed text-slate-200">
                  "{currentQuestion.modelAnswer}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
