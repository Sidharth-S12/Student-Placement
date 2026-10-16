import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { defaultAvatarSvg } from '../data/mockStudentData';
import { fetchLatestCompletedAssessment } from '../services/assessmentService';
import { fetchLatestCompletedAptitude } from '../services/aptitudeService';
import { fetchLatestCompletedCommunication } from '../services/communicationService';
import { calculateReadinessScore } from '../services/readinessService';
import {
  fetchStudentProfile,
  saveStudentProfile,
  getCachedProfile,
  createBlankProfile as makeBlankProfile
} from '../services/studentProfileService';
import { useAuth } from './AuthContext';

const StudentContext = createContext();

const emptyStudentProfile = {
  personalInfo: {
    fullName: "",
    headline: "",
    profilePhoto: defaultAvatarSvg,
    email: "",
    phone: "",
    location: "",
    summary: ""
  },
  placementScores: {
    overallReadiness: 0,
    technicalScore: 0,
    aptitudeScore: 0,
    communicationScore: 0
  },
  education: {
    tenthPercentage: "",
    tenthBoard: "",
    tenthYear: "",
    twelfthPercentage: "",
    twelfthBoard: "",
    twelfthYear: "",
    degree: "",
    branch: "",
    college: "",
    cgpa: "",
    graduationYear: ""
  },
  professionalLinks: {
    linkedin: "",
    github: "",
    portfolio: ""
  },
  technicalSkills: {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    toolsTechnologies: []
  },
  projects: [],
  experience: [],
  certifications: [],
  achievements: []
};

export const StudentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const currentUid = currentUser?.uid;

  // Initialize strictly with UID-cached profile, never falling back to Aarav Sharma
  const [studentData, setStudentData] = useState(() => {
    if (currentUid) {
      return getCachedProfile(currentUid);
    }
    return null;
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAptitudeModalOpen, setIsAptitudeModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  const [communicationModalMode, setCommunicationModalMode] = useState('assessment');
  const [toastMessage, setToastMessage] = useState(null);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [latestAptitudeAssessment, setLatestAptitudeAssessment] = useState(null);
  const [latestCommunicationAssessment, setLatestCommunicationAssessment] = useState(null);

  const openCommunicationModal = (mode = 'assessment') => {
    setCommunicationModalMode(mode);
    setIsCommunicationModalOpen(true);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Profile existence check: Must have full name and at least college or contact info
  const hasProfile = useMemo(() => {
    return Boolean(studentData?.personalInfo?.fullName && (studentData?.education?.college || studentData?.personalInfo?.email));
  }, [studentData]);

  // Load and sync authenticated student profile from Firestore / Backend strictly by UID
  useEffect(() => {
    let isMounted = true;

    if (!currentUid) {
      setStudentData(null);
      setLatestAssessment(null);
      setLatestAptitudeAssessment(null);
      setLatestCommunicationAssessment(null);
      setProfileLoading(false);
      return;
    }

    const loadProfileAndAssessments = async () => {
      setProfileLoading(true);
      try {
        // 1. Fetch or create UID-anchored student profile
        const profile = await fetchStudentProfile(currentUid, currentUser);

        if (!isMounted) return;

        if (profile) {
          setStudentData(profile);
        } else {
          showToast("Unable to load your profile. Please try again.");
        }

        // 2. Fetch latest assessments strictly filtered by this user's UID
        try {
          const [assessment, aptitude, communication] = await Promise.all([
            fetchLatestCompletedAssessment(currentUid),
            fetchLatestCompletedAptitude(currentUid),
            fetchLatestCompletedCommunication(currentUid)
          ]);

          if (isMounted) {
            if (assessment) setLatestAssessment(assessment);
            if (aptitude) setLatestAptitudeAssessment(aptitude);
            if (communication) setLatestCommunicationAssessment(communication);

            if (assessment || aptitude || communication) {
              setStudentData((prev) => {
                if (!prev) return prev;
                const techScore = assessment?.technicalScore ?? prev.placementScores?.technicalScore ?? 0;
                const aptScore = aptitude?.finalScore ?? aptitude?.score ?? prev.placementScores?.aptitudeScore ?? 0;
                const commScore = communication?.finalScore ?? communication?.score ?? prev.placementScores?.communicationScore ?? 0;

                const newReadiness = calculateReadinessScore({
                  technicalScore: techScore,
                  aptitudeScore: aptScore,
                  communicationScore: commScore
                });

                return {
                  ...prev,
                  placementScores: {
                    ...prev.placementScores,
                    technicalScore: techScore,
                    aptitudeScore: aptScore,
                    communicationScore: commScore,
                    overallReadiness: newReadiness
                  }
                };
              });
            }
          }
        } catch (assessErr) {
          console.warn('[StudentContext] Failed to load assessments for UID:', assessErr.message);
        }
      } catch (err) {
        console.error('[StudentContext] Profile loading error:', err);
        if (isMounted) {
          showToast("Unable to load your profile. Please try again.");
        }
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    };

    loadProfileAndAssessments();

    return () => {
      isMounted = false;
    };
  }, [currentUid]);

  // Persist student data to UID-keyed storage & Firestore/backend
  const saveStudentData = async (newData) => {
    setStudentData(newData);
    if (currentUid) {
      try {
        await saveStudentProfile(currentUid, newData);
      } catch (err) {
        console.error('[StudentContext] Failed to persist profile:', err);
      }
    }
  };

  const updateStudentData = (section, data) => {
    if (!studentData) return;
    const updated = {
      ...studentData,
      [section]: data
    };
    saveStudentData(updated);
    showToast("Profile updated successfully!");
  };

  const setFullStudentData = (newProfile) => {
    saveStudentData(newProfile);
    showToast("Placement profile saved successfully!");
  };

  const createBlankProfile = () => {
    if (!currentUid) return;
    const fresh = makeBlankProfile(currentUid, currentUser);
    saveStudentData(fresh);
    setIsEditModalOpen(true);
    showToast("Create your new placement profile!");
  };

  // Handler when technical assessment finishes
  const handleAssessmentCompleted = (summary) => {
    if (!summary || !studentData) return;
    
    setLatestAssessment(summary);
    const techScore = summary.technicalScore;
    const aptScore = studentData.placementScores?.aptitudeScore ?? 0;
    const commScore = studentData.placementScores?.communicationScore ?? 0;

    const newReadiness = calculateReadinessScore({
      technicalScore: techScore,
      aptitudeScore: aptScore,
      communicationScore: commScore
    });

    const updatedScores = {
      ...studentData.placementScores,
      technicalScore: techScore,
      overallReadiness: newReadiness
    };

    const updatedStudent = {
      ...studentData,
      placementScores: updatedScores
    };

    saveStudentData(updatedStudent);
    showToast(`Technical Score updated to ${techScore}%! Overall Readiness: ${newReadiness}%`);
  };

  // Handler when aptitude assessment finishes
  const handleAptitudeCompleted = (summary) => {
    if (!summary || !studentData) return;

    setLatestAptitudeAssessment(summary);
    const aptScore = summary.finalScore ?? summary.score ?? 0;
    const techScore = studentData.placementScores?.technicalScore ?? 0;
    const commScore = studentData.placementScores?.communicationScore ?? 0;

    const newReadiness = calculateReadinessScore({
      technicalScore: techScore,
      aptitudeScore: aptScore,
      communicationScore: commScore
    });

    const updatedScores = {
      ...studentData.placementScores,
      aptitudeScore: aptScore,
      overallReadiness: newReadiness
    };

    const updatedStudent = {
      ...studentData,
      placementScores: updatedScores
    };

    saveStudentData(updatedStudent);
    showToast(`Aptitude Score updated to ${aptScore}%! Overall Readiness: ${newReadiness}%`);
  };

  // Handler when communication assessment finishes
  const handleCommunicationCompleted = (summary) => {
    if (!summary || !studentData) return;

    setLatestCommunicationAssessment(summary);
    const commScore = summary.finalScore ?? summary.score ?? 0;
    const techScore = studentData.placementScores?.technicalScore ?? 0;
    const aptScore = studentData.placementScores?.aptitudeScore ?? 0;

    const newReadiness = calculateReadinessScore({
      technicalScore: techScore,
      aptitudeScore: aptScore,
      communicationScore: commScore
    });

    const updatedScores = {
      ...studentData.placementScores,
      communicationScore: commScore,
      overallReadiness: newReadiness
    };

    const updatedStudent = {
      ...studentData,
      placementScores: updatedScores
    };

    saveStudentData(updatedStudent);
    showToast(`Communication Score updated to ${commScore}%! Overall Readiness: ${newReadiness}%`);
  };

  // Device file upload for profile photo
  const handlePhotoFileUpload = (file) => {
    if (!file || !studentData) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Photo = e.target.result;
      const updated = {
        ...studentData,
        personalInfo: {
          ...studentData.personalInfo,
          profilePhoto: base64Photo
        }
      };
      saveStudentData(updated);
      showToast("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePhoto = () => {
    if (!studentData) return;
    const updated = {
      ...studentData,
      personalInfo: {
        ...studentData.personalInfo,
        profilePhoto: defaultAvatarSvg
      }
    };
    saveStudentData(updated);
    showToast("Profile photo removed!");
  };

  // Placement readiness score calculation
  const readinessScore = useMemo(() => {
    if (studentData?.placementScores?.overallReadiness) {
      return studentData.placementScores.overallReadiness;
    }
    let score = 0;
    if (!studentData) return 0;

    if (studentData.personalInfo?.fullName) score += 10;
    if (studentData.personalInfo?.summary) score += 10;
    if (studentData.education?.cgpa) score += 15;
    if (studentData.education?.degree && studentData.education?.college) score += 15;
    if (studentData.professionalLinks?.linkedin) score += 5;
    if (studentData.professionalLinks?.github) score += 5;
    if ((studentData.technicalSkills?.programmingLanguages?.length || 0) >= 2) score += 15;
    if ((studentData.projects?.length || 0) >= 1) score += 15;
    if ((studentData.experience?.length || 0) >= 1) score += 10;

    return Math.min(100, score);
  }, [studentData]);

  return (
    <StudentContext.Provider
      value={{
        studentData,
        currentUid,
        profileLoading,
        hasProfile,
        updateStudentData,
        setFullStudentData,
        createBlankProfile,
        handlePhotoFileUpload,
        removeProfilePhoto,
        readinessScore,
        isEditModalOpen,
        setIsEditModalOpen,
        isResumeModalOpen,
        setIsResumeModalOpen,
        isAssessmentModalOpen,
        setIsAssessmentModalOpen,
        handleAssessmentCompleted,
        latestAssessment,
        isAptitudeModalOpen,
        setIsAptitudeModalOpen,
        handleAptitudeCompleted,
        latestAptitudeAssessment,
        isCommunicationModalOpen,
        setIsCommunicationModalOpen,
        communicationModalMode,
        setCommunicationModalMode,
        openCommunicationModal,
        handleCommunicationCompleted,
        latestCommunicationAssessment,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
