import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider, useStudent } from './context/StudentContext';
import { SinglePageDashboard } from './components/SinglePageDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { CompanyPendingApprovalView } from './components/company/CompanyPendingApprovalView';
import { CompanyRejectedView } from './components/company/CompanyRejectedView';
import { fetchCompanyProfile } from './services/companyService';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/landing/LandingPage';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { ATSResumeModal } from './components/resume/ATSResumeModal';
import { TechnicalAssessmentModal } from './components/assessment/TechnicalAssessmentModal';
import { AptitudeAssessmentModal } from './components/aptitude/AptitudeAssessmentModal';
import { CommunicationAssessmentModal } from './components/communication/CommunicationAssessmentModal';
import { CheckCircle, Loader2, GraduationCap } from 'lucide-react';
import ResumeAnalyzer from "./components/ResumeAnalyzer";

const StudentDashboardContent = () => {
  const {
    toastMessage,
    isAssessmentModalOpen,
    setIsAssessmentModalOpen,
    isAptitudeModalOpen,
    setIsAptitudeModalOpen,
    isCommunicationModalOpen,
    setIsCommunicationModalOpen,
    communicationModalMode,
    studentData,
    handleAssessmentCompleted,
    handleAptitudeCompleted,
    handleCommunicationCompleted
  } = useStudent();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased relative selection:bg-brand-500 selection:text-white">
      {/* Single Page Placement Profile Dashboard with Left Navigation Sidebar */}
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

      {/* Communication & Interview Assessment Module */}
      <CommunicationAssessmentModal
        isOpen={isCommunicationModalOpen}
        onClose={() => setIsCommunicationModalOpen(false)}
        studentData={studentData}
        onAssessmentCompleted={handleCommunicationCompleted}
        initialMode={communicationModalMode}
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

const DevRoleBadge = ({ user, role }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  if (!import.meta.env.DEV || !user) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 text-xs font-mono">
      {isExpanded ? (
        <div className="bg-slate-900/95 text-slate-100 border border-slate-700 p-3 rounded-2xl shadow-2xl space-y-1.5 backdrop-blur max-w-xs animate-fade-in">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-bold text-[10px] uppercase text-emerald-400">Dev Role Diagnostic</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white text-[10px] px-1 rounded"
            >
              ✕
            </button>
          </div>
          <div><span className="text-slate-400">Email: </span><span className="text-slate-200 break-all">{user.email}</span></div>
          <div><span className="text-slate-400">UID: </span><span className="text-slate-300 break-all block text-[10px]">{user.uid}</span></div>
          <div>
            <span className="text-slate-400">Role: </span>
            <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
              role === 'admin' ? 'bg-amber-900/60 text-amber-300 border border-amber-600/40' :
              role === 'company' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-600/40' :
              'bg-blue-900/60 text-blue-300 border border-blue-600/40'
            }`}>
              {role}
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900/90 hover:bg-slate-900 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1.5 backdrop-blur transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold uppercase">{role}</span>
        </button>
      )}
    </div>
  );
};

const AccessDeniedBarrier = ({ requiredRole, actualRole, onReturn }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-100">
    <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur">
      <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto text-2xl">
        🛡️
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white tracking-tight">Access Denied</h2>
        <p className="text-xs text-slate-400">
          This route requires <span className="text-amber-400 font-bold uppercase">{requiredRole}</span> privileges.
        </p>
      </div>
      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-700/60 text-xs text-slate-300 text-left space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Your Account Role:</span>
          <span className="font-bold text-white uppercase">{actualRole}</span>
        </div>
        <p className="text-[11px] text-slate-400 pt-1">
          This account does not have administrator access. Administrator routes are restricted to authorized placement officers.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={onReturn}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 transition-all"
        >
          Return to Your Dashboard
        </button>
      </div>
    </div>
  </div>
);

const RoleResolutionErrorScreen = ({ error, onSignOut }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-100">
    <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
        ⚠️
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white tracking-tight">Role Resolution Error</h2>
        <p className="text-xs text-slate-400">
          {error || 'Unable to determine your account role. Please try again or contact administrator support.'}
        </p>
      </div>
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs text-slate-400 text-left">
        <p>
          For your security, access is held until your verified role can be determined. Silent default to student access is blocked.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={onSignOut}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          Sign Out & Return to Login
        </button>
      </div>
    </div>
  </div>
);

const MainAppContent = () => {
  const { currentUser, userRole, authLoading, authError, logout, setSelectedRole } = useAuth();
  const [currentPath, setCurrentPath] = React.useState(() => {
    return (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/');
  });

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleReturnToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/');
      window.location.hash = '';
      setCurrentPath('/');
    }
  };

  const isAdminPath = currentPath.startsWith('/admin') || currentPath.includes('#/admin');

  React.useEffect(() => {
    if (!currentUser && isAdminPath) {
      setSelectedRole('admin');
    }
  }, [currentUser, isAdminPath]);

  const [showAuth, setShowAuth] = React.useState(false);
  const [authRolePref, setAuthRolePref] = React.useState(null);
  const [authModePref, setAuthModePref] = React.useState('login');

  // 1. Initial Authentication Restoration Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-extrabold text-base text-white">Placement Genie</h2>
            <p className="text-xs text-slate-400">Restoring authentication session...</p>
          </div>
          <div className="pt-2">
            <Loader2 className="w-5 h-5 text-brand-400 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthenticated -> Landing Page with Seamless Auth Transition
  if (!currentUser) {
    if (!showAuth && !isAdminPath) {
      return (
        <LandingPage
          onGetStarted={(role = 'student') => {
            setAuthRolePref(role);
            setAuthModePref('register');
            setShowAuth(true);
          }}
          onSignIn={(role = 'student') => {
            setAuthRolePref(role);
            setAuthModePref('login');
            setShowAuth(true);
          }}
        />
      );
    }

    return (
      <AuthPage
        onBackToHome={() => setShowAuth(false)}
        initialRole={authRolePref}
        initialMode={authModePref}
      />
    );
  }

  // 4. Role Resolution Error -> Render Error Screen (NEVER fallback to Student)
  if (authError || !userRole) {
    return (
      <>
        <RoleResolutionErrorScreen
          error={authError}
          onSignOut={logout}
        />
        <DevRoleBadge user={currentUser} role={userRole || 'UNKNOWN'} />
      </>
    );
  }

  // 5. Authenticated Route Guard: Deny unauthorized users from accessing Admin routes
  if (isAdminPath && userRole !== 'admin') {
    return (
      <>
        <AccessDeniedBarrier
          requiredRole="admin"
          actualRole={userRole}
          onReturn={handleReturnToDashboard}
        />
        <DevRoleBadge user={currentUser} role={userRole} />
      </>
    );
  }

const CompanyPortalRouter = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const p = await fetchCompanyProfile();
      setProfile(p);
    } catch (err) {
      console.warn('Failed to fetch company profile status:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadStatus();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-100">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400 mb-2" />
        <p className="text-xs text-slate-400 font-medium">Verifying company recruitment authorization...</p>
      </div>
    );
  }

  const approvalStatus = profile?.approvalStatus || 'pending';

  if (approvalStatus === 'pending') {
    return (
      <CompanyPendingApprovalView
        companyProfile={profile}
        currentUser={currentUser}
        onRefreshStatus={loadStatus}
        onSignOut={logout}
      />
    );
  }

  if (approvalStatus === 'rejected' || approvalStatus === 'suspended') {
    return (
      <CompanyRejectedView
        companyProfile={profile}
        currentUser={currentUser}
        onRefreshStatus={loadStatus}
        onSignOut={logout}
      />
    );
  }

  return <CompanyDashboard companyProfile={profile} />;
};

// 6. Authenticated -> Role-Based Dashboard Redirection
  if (userRole === 'company') {
    return (
      <>
        <CompanyPortalRouter />
        <DevRoleBadge user={currentUser} role={userRole} />
      </>
    );
  }

  if (userRole === 'admin') {
    return (
      <>
        <AdminDashboard />
        <DevRoleBadge user={currentUser} role={userRole} />
      </>
    );
  }

  if (userRole === 'student') {
    return (
      <StudentProvider>
        <StudentDashboardContent />
        <DevRoleBadge user={currentUser} role={userRole} />
      </StudentProvider>
    );
  }

  // Any other unrecognized role -> Error Barrier
  return (
    <RoleResolutionErrorScreen
      error={`Unrecognized account role '${userRole}'.`}
      onSignOut={logout}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
