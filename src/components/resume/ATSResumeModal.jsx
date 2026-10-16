import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { ATSResume } from './ATSResume';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import { X, Download, Printer, Edit3, Loader2 } from 'lucide-react';

export const ATSResumeModal = () => {
  const { studentData, isResumeModalOpen, setIsResumeModalOpen, setIsEditModalOpen, showToast } = useStudent();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isResumeModalOpen) return null;

  const handleDownloadPDF = () => {
    try {
      setIsGenerating(true);
      showToast("Generating native vector ATS PDF Resume...");

      generateATSResumePDF(studentData);

      showToast("ATS PDF Resume downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate vector PDF", err);
      showToast("Error generating PDF. Opening print dialog...");
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">ATS-Friendly Resume Preview</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                Native Vector PDF • Selectable Text
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              100% ATS parser compliant single-column Times New Roman format.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsResumeModalOpen(false);
                setIsEditModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ATS PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsResumeModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/80 flex justify-center">
          <ATSResume studentData={studentData} />
        </div>
      </div>
    </div>
  );
};
