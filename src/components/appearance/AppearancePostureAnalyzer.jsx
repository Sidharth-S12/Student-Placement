import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Eye,
  EyeOff,
  ChevronRight,
  Info,
  Sliders,
  Award,
  Video,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { analyzeImagePosture, drawPostureOverlay } from '../../utils/postureAnalyzer';
import { analyzeDressCode } from '../../services/appearanceService';
import { useAuth } from '../../context/AuthContext';

export const AppearancePostureAnalyzer = ({ onOpenEditProfile }) => {
  const { currentUser } = useAuth();
  const studentId = currentUser?.uid || 'default_student';

  // Upload & Preview states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [interviewContext, setInterviewContext] = useState('formal'); // 'formal' | 'business_casual' | 'online'
  const [showLandmarkOverlay, setShowLandmarkOverlay] = useState(true);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(''); // 'Detecting Posture Landmarks...', 'Evaluating Dress Code...'
  const [postureResult, setPostureResult] = useState(null);
  const [dressResult, setDressResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [setupGuide, setSetupGuide] = useState(null);

  const fileInputRef = useRef(null);
  const imageElementRef = useRef(null);
  const canvasRef = useRef(null);

  // Redraw overlay when posture result or toggle changes
  useEffect(() => {
    if (canvasRef.current && postureResult?.landmarks) {
      drawPostureOverlay(canvasRef.current, postureResult.landmarks, showLandmarkOverlay);
    }
  }, [postureResult, showLandmarkOverlay, imagePreview]);

  // Handle file selection from local device
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setPostureResult(null);
    setDressResult(null);
    setSetupGuide(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded photo
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPostureResult(null);
    setDressResult(null);
    setErrorMessage('');
    setSetupGuide(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Run comprehensive Appearance & Posture Analysis
  const handleRunAnalysis = async () => {
    if (!imagePreview) {
      setErrorMessage('Please upload a photo from your device first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setSetupGuide(null);

    try {
      // Step 1: Client-side Pose Landmark & Posture Analysis
      setAnalysisStep('Detecting body landmarks & measuring alignment...');
      const img = imageElementRef.current || new Image();
      if (!imageElementRef.current) {
        img.src = imagePreview;
        await new Promise((res) => { img.onload = res; });
      }

      const pResult = await analyzeImagePosture(img);
      setPostureResult(pResult);

      // Step 2: Backend Vision AI Dress Code Analysis
      setAnalysisStep('Evaluating professional attire with AI Vision model...');
      const dResult = await analyzeDressCode({
        imageDataUrl: imagePreview,
        interviewContext,
        studentId
      });

      if (dResult.isSetupRequired) {
        setSetupGuide(dResult.setupGuide);
        setDressResult(null);
      } else if (dResult.success && dResult.dressAnalysis) {
        setDressResult(dResult.dressAnalysis);
      } else if (dResult.error) {
        setErrorMessage(dResult.error);
      }

    } catch (err) {
      console.error('[AppearanceAnalysis Error]', err);
      setErrorMessage(err.message || 'An error occurred during analysis. Please check your image and try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Context metadata options
  const contextOptions = [
    {
      id: 'formal',
      title: 'Formal Corporate',
      badge: 'Traditional & MNCs',
      desc: 'Suits, blazers, dress shirts, formal trousers, formal sarees, or kurtas with neat collars.',
      icon: Briefcase
    },
    {
      id: 'business_casual',
      title: 'Business Casual',
      badge: 'Tech & Startups',
      desc: 'Collared button-down shirts, professional blouses, tailored sweaters, and chinos.',
      icon: UserCheck
    },
    {
      id: 'online',
      title: 'Online Video Call',
      badge: 'Zoom / Teams',
      desc: 'High collar contrast, solid colors, clean webcam framing, and minimal background distraction.',
      icon: Video
    }
  ];

  // Optional: Calculated Alignment Index (Separate from academic placement score)
  const computeAlignmentIndex = () => {
    if (!postureResult || postureResult.status === 'No Person Detected' || postureResult.shoulderAngleDeg === null) return null;
    let score = 50; // base

    // Posture symmetry contribution (max 25 pts)
    const angle = postureResult.shoulderAngleDeg || 0;
    if (angle <= 2.0) score += 25;
    else if (angle <= 4.0) score += 18;
    else if (angle <= 6.0) score += 10;
    else score += 5;

    // Head plumb alignment (max 15 pts)
    const hAngle = postureResult.headAngleDeg || 0;
    if (hAngle <= 2.0) score += 15;
    else if (hAngle <= 5.0) score += 10;
    else score += 5;

    // Visibility contribution (max 10 pts)
    if (postureResult.isSufficientlyVisible) score += 10;

    return Math.min(100, Math.max(40, score));
  };

  const alignmentIndex = computeAlignmentIndex();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-500/10 via-indigo-500/10 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Placement Preparation AI Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Professional Appearance & Posture Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify your interview attire and camera posture before corporate placement rounds. Evaluates visible clothing appropriateness and geometric shoulder & head alignment with zero bias.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60 backdrop-blur-sm flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>In-Memory Privacy • Photos Never Stored</span>
          </div>
        </div>
      </div>

      {/* 2. Upload, Settings & Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Controls & Interview Context (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Target Interview Context Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Select Interview Context
            </label>

            <div className="space-y-2">
              {contextOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = interviewContext === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setInterviewContext(opt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/80 text-slate-500 font-semibold border border-slate-200">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Upload Candidate Photo
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="appearance-file-input"
            />

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-brand-50/20 group space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-brand-600 group-hover:border-brand-300 flex items-center justify-center mx-auto shadow-xs transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to browse or drop interview photo
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    JPEG, PNG, or WebP • Max 5MB
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-medium truncate max-w-[180px]">
                    {selectedFile?.name || 'interview_photo.jpg'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Overlay Toggle Switch (Only if landmarks were detected) */}
                {postureResult?.landmarks && (
                  <button
                    type="button"
                    onClick={() => setShowLandmarkOverlay(!showLandmarkOverlay)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-900 text-xs font-semibold hover:bg-indigo-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {showLandmarkOverlay ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Show Alignment Landmarks</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-indigo-700 font-bold">
                      {showLandmarkOverlay ? 'Visible' : 'Hidden'}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Analyze Action Button */}
            <button
              type="button"
              disabled={!imagePreview || isAnalyzing}
              onClick={handleRunAnalysis}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                !imagePreview
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAnalyzing
                  ? 'bg-slate-800 text-white cursor-wait'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-brand-600/25 hover:scale-[1.02]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{analysisStep || 'Analyzing Appearance & Posture...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Attire & Posture</span>
                </>
              )}
            </button>
          </div>

          {/* Ethical & Privacy Transparency Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-700 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-brand-600" />
              <span>Ethical Standards & Guardrails</span>
            </div>
            <p>
              This tool focuses strictly on visible garment formality and camera alignment. It never assesses physical appearance, body shape, skin tone, gender, or cultural attire. Traditional formal garments (e.g. sarees, kurtas) are treated as fully valid professional attire.
            </p>
          </div>
        </div>

        {/* Right Column: Live Image Preview with Landmark Canvas Overlay (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900">Image & Landmark Inspection</span>
              {imagePreview && (
                <span className="text-[11px] text-emerald-600 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready for Analysis
                </span>
              )}
            </div>

            <div className="relative flex-1 min-h-[340px] max-h-[460px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              {imagePreview ? (
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  {/* Base Image */}
                  <img
                    ref={imageElementRef}
                    src={imagePreview}
                    alt="Candidate Interview Preview"
                    className="max-w-full max-h-[440px] object-contain select-none"
                    onLoad={() => {
                      if (canvasRef.current && imageElementRef.current) {
                        canvasRef.current.width = imageElementRef.current.clientWidth;
                        canvasRef.current.height = imageElementRef.current.clientHeight;
                        if (postureResult?.landmarks) {
                          drawPostureOverlay(canvasRef.current, postureResult.landmarks, showLandmarkOverlay);
                        }
                      }
                    }}
                  />

                  {/* Overlaid Landmark Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-500 space-y-2">
                  <Camera className="w-10 h-10 text-slate-600 mx-auto stroke-[1.5]" />
                  <p className="text-xs">No photograph selected yet.</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Upload an interview photo facing the camera to view live posture alignment guides.
                  </p>
                </div>
              )}
            </div>

            {/* Helper tips under preview */}
            <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Shoulder Level Guide</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <span>Plumb Line & Head Axis</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Combined Alignment Index (Only if posture analyzed) */}
      {alignmentIndex !== null && (
        <div className="bg-gradient-to-r from-indigo-50 via-brand-50 to-purple-50 p-5 rounded-2xl border border-indigo-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                Alignment & Presentation Index
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                Framing Check Only
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              Calculated from geometric shoulder level ({postureResult?.shoulderAngleDeg}° tilt), head vertical alignment ({postureResult?.headAngleDeg}°), and upper-torso camera visibility.
              <span className="block text-[11px] text-slate-500 font-medium italic mt-0.5">
                Note: Kept completely separate from your academic placement-readiness score.
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-indigo-100 shadow-xs flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-950">{alignmentIndex}/100</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase">
                {alignmentIndex >= 85 ? 'Excellent Alignment' : alignmentIndex >= 70 ? 'Good Composure' : 'Needs Minor Adjustment'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESULTS SECTION: Dress Analysis & Posture Analysis */}
      {(postureResult || dressResult || setupGuide) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* ========================================================= */}
          {/* A. DRESS CODE ANALYSIS SECTION */}
          {/* ========================================================= */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    👔
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm leading-tight">
                      Dress Code Analysis
                    </h2>
                    <span className="text-[11px] text-slate-400 capitalize">
                      Context: {interviewContext.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {dressResult && (
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    dressResult.suitability === 'Highly Suitable'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : dressResult.suitability === 'Moderately Suitable'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : dressResult.suitability === 'Unable to Determine' || dressResult.status === 'Unable to Assess'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {dressResult.suitability}
                  </span>
                )}
              </div>

              {/* Setup Guide Banner (If Vision AI Key is unavailable) */}
              {setupGuide && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Vision AI Model Setup Required</span>
                  </div>
                  <p className="text-amber-800/90 leading-relaxed text-[11px]">
                    {setupGuide.message}
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-amber-900 font-medium space-y-0.5 pt-1">
                    {setupGuide.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                  <div className="pt-1 text-[10px] text-slate-500">
                    * Posture Analysis runs locally in your browser and is fully functional above!
                  </div>
                </div>
              )}

              {/* Dress Results Content */}
              {dressResult && (
                <div className="space-y-4 text-xs">
                  
                  {/* Category & Assessment */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Suggested Dress Category:</span>
                      <span className="font-bold text-slate-900">{dressResult.suggestedCategory}</span>
                    </div>
                    {dressResult.suitabilityExplanation && (
                      <p className="text-slate-700 text-[11px] pt-1 leading-relaxed">
                        {dressResult.suitabilityExplanation}
                      </p>
                    )}
                  </div>

                  {/* Observations */}
                  {dressResult.observations?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                        Observable Attire Features
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-slate-700 text-xs">
                        {dressResult.observations.map((obs, i) => (
                          <li key={i} className="leading-snug">{obs}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Observable Strengths */}
                  {dressResult.strengths?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <div className="font-bold text-emerald-900 flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Observable Strengths</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                        {dressResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvement Suggestions with Explanations */}
                  {dressResult.improvements?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                      <div className="font-bold text-amber-900 flex items-center space-x-1.5 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Specific Improvement Suggestions</span>
                      </div>
                      <div className="space-y-2">
                        {dressResult.improvements.map((imp, i) => (
                          <div key={i} className="space-y-0.5">
                            <div className="font-bold text-slate-900 text-xs">
                              • {imp.suggestion}
                            </div>
                            {imp.explanation && (
                              <div className="text-[11px] text-slate-600 pl-3">
                                {imp.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Dress Confidence & Limitations Footer */}
            {dressResult && (
              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Assessment Confidence: <strong className="text-slate-600">{dressResult.confidence}</strong></span>
                  <span>Model: <strong className="text-slate-600">Vision AI</strong></span>
                </div>
                {dressResult.limitations && (
                  <div>
                    <span className="font-semibold text-slate-500">Framing Limitations: </span>
                    <span>{dressResult.limitations}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* B. POSTURE ANALYSIS SECTION */}
          {/* ========================================================= */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    📐
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm leading-tight">
                      Posture & Alignment Analysis
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      Geometric Landmark Engine
                    </span>
                  </div>
                </div>

                {postureResult && (
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    postureResult.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : postureResult.status === 'No Person Detected'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {postureResult.status}
                  </span>
                )}
              </div>

              {/* Posture Metrics Breakdown */}
              {postureResult && (
                <div className="space-y-4 text-xs">
                  
                  {/* Metric Chips if subject detected, else info box */}
                  {postureResult.shoulderAngleDeg !== null ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Shoulder Level</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">
                          {postureResult.shoulderAngleDeg}°
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium">
                          {postureResult.shoulderAngleDeg <= 2.5 ? 'Balanced' : 'Mild Tilt'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Head Angle</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">
                          {postureResult.headAngleDeg}°
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium">
                          {postureResult.headAngleDeg <= 2.5 ? 'Vertical' : 'Tilted'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Framing Mode</div>
                        <div className="text-[11px] font-bold text-indigo-700 mt-1 truncate">
                          {postureResult.postureFraming?.split(' ')[0] || 'Framing'}
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium">
                          {postureResult.isSufficientlyVisible ? 'Sufficient' : 'Partial'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-amber-950">No Human Landmarks Detected</div>
                        <div className="text-[11px] text-amber-800 leading-snug">
                          Camera alignment and posture angles require a portrait showing your head and shoulders.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {postureResult.observations?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                        Observable Geometric Features
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-slate-700 text-xs">
                        {postureResult.observations.map((obs, i) => (
                          <li key={i} className="leading-snug">{obs}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {postureResult.strengths?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <div className="font-bold text-emerald-900 flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Posture Strengths</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                        {postureResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specific Improvement Suggestions with Explanations */}
                  {postureResult.improvements?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                      <div className="font-bold text-indigo-900 flex items-center space-x-1.5 text-[11px]">
                        <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Practical Posture Improvements</span>
                      </div>
                      <div className="space-y-2">
                        {postureResult.improvements.map((imp, i) => (
                          <div key={i} className="space-y-0.5">
                            <div className="font-bold text-slate-900 text-xs">
                              • {imp.suggestion}
                            </div>
                            {imp.explanation && (
                              <div className="text-[11px] text-slate-600 pl-3">
                                {imp.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Posture Confidence & Limitations Footer */}
            {postureResult && (
              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Confidence: <strong className="text-slate-600">{postureResult.confidence}</strong></span>
                  <span>Reliability: <strong className="text-slate-600">{postureResult.isSufficientlyVisible ? 'Sufficient Body Visibility' : 'Framing Warning'}</strong></span>
                </div>
                {postureResult.limitations && (
                  <div>
                    <span className="font-semibold text-slate-500">Limitations: </span>
                    <span>{postureResult.limitations}</span>
                  </div>
                )}
                <div className="pt-1 text-[9px] text-slate-400 italic">
                  {postureResult.ethicalDisclaimer}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
