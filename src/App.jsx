import React from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import { SinglePageDashboard } from './components/SinglePageDashboard';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { ATSResumeModal } from './components/resume/ATSResumeModal';
import { TechnicalAssessmentModal } from './components/assessment/TechnicalAssessmentModal';
import { AptitudeAssessmentModal } from './components/aptitude/AptitudeAssessmentModal';
import { CheckCircle } from 'lucide-react';

const DashboardContent = () => {
  const {
    toastMessage,
    isAssessmentModalOpen,
    setIsAssessmentModalOpen,
    isAptitudeModalOpen,
    setIsAptitudeModalOpen,
    studentData,
    handleAssessmentCompleted,
    handleAptitudeCompleted
  } = useStudent();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased relative">
      {/* Single Page Placement Profile Dashboard */}
      <SinglePageDashboard />

      {/* Profile Edit Modal */}
      <EditProfileModal />

      {/* ATS Resume Generation Modal */}
      <ATSResumeModal />

      {/* Technical Skill Assessment Module */}
      <TechnicalAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        studentData={studentData}
        onAssessmentCompleted={handleAssessmentCompleted}
      />

      {/* Aptitude Assessment Module */}
      <AptitudeAssessmentModal
        isOpen={isAptitudeModalOpen}
        onClose={() => setIsAptitudeModalOpen(false)}
        studentData={studentData}
        onAssessmentCompleted={handleAptitudeCompleted}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 animate-fade-in text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudentProvider>
      <DashboardContent />
    </StudentProvider>
  );
}
