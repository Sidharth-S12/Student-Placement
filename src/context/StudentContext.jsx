import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { initialStudentData, defaultAvatarSvg } from '../data/mockStudentData';
import { fetchLatestCompletedAssessment } from '../services/assessmentService';
import { fetchLatestCompletedAptitude } from '../services/aptitudeService';
import { calculateReadinessScore } from '../services/readinessService';

const StudentContext = createContext();

export const emptyStudentProfile = {
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
    overallReadiness: 75,
    technicalScore: 70,
    aptitudeScore: 75,
    communicationScore: 80
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
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('placement_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved student data", e);
      }
    }
    return initialStudentData;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAptitudeModalOpen, setIsAptitudeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Check if student profile exists and has basic details
  const hasProfile = useMemo(() => {
    return Boolean(studentData?.personalInfo?.fullName && studentData?.education?.college);
  }, [studentData]);

  // Auto-save to localStorage
  const saveStudentData = (newData) => {
    setStudentData(newData);
    localStorage.setItem('placement_student_profile', JSON.stringify(newData));
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateStudentData = (section, data) => {
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
    saveStudentData(emptyStudentProfile);
    setIsEditModalOpen(true);
    showToast("Create your new placement profile!");
  };

  const resetDemoData = () => {
    saveStudentData(initialStudentData);
    showToast("Demo profile loaded!");
  };

  const [latestAssessment, setLatestAssessment] = useState(null);
  const [latestAptitudeAssessment, setLatestAptitudeAssessment] = useState(null);

  // Sync latest completed technical & aptitude assessments from Firebase / Backend on load
  useEffect(() => {
    let isMounted = true;
    const loadFromFirebase = async () => {
      const studentId = studentData?.personalInfo?.email || 'default_student';
      try {
        const [assessment, aptitude] = await Promise.all([
          fetchLatestCompletedAssessment(studentId),
          fetchLatestCompletedAptitude(studentId)
        ]);

        if (isMounted) {
          if (assessment) {
            setLatestAssessment(assessment);
          }
          if (aptitude) {
            setLatestAptitudeAssessment(aptitude);
          }

          if (assessment || aptitude) {
            setStudentData(prev => {
              const techScore = assessment?.technicalScore ?? prev.placementScores?.technicalScore ?? 70;
              const aptScore = aptitude?.finalScore ?? aptitude?.score ?? prev.placementScores?.aptitudeScore ?? 75;
              const commScore = prev.placementScores?.communicationScore ?? 80;

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
                  overallReadiness: newReadiness
                }
              };
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load assessments from backend/Firebase:', err);
      }
    };
    loadFromFirebase();
    return () => { isMounted = false; };
  }, [studentData?.personalInfo?.email]);

  // Handler when technical assessment finishes
  const handleAssessmentCompleted = (summary) => {
    if (!summary) return;
    
    setLatestAssessment(summary);
    const techScore = summary.technicalScore;
    const aptScore = studentData.placementScores?.aptitudeScore ?? 75;
    const commScore = studentData.placementScores?.communicationScore ?? 80;

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
    if (!summary) return;

    setLatestAptitudeAssessment(summary);
    const aptScore = summary.finalScore ?? summary.score ?? 0;
    const techScore = studentData.placementScores?.technicalScore ?? 70;
    const commScore = studentData.placementScores?.communicationScore ?? 80;

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

  // Device file upload for profile photo
  const handlePhotoFileUpload = (file) => {
    if (!file) return;

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
      showToast("Profile photo uploaded from device!");
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePhoto = () => {
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
        hasProfile,
        updateStudentData,
        setFullStudentData,
        createBlankProfile,
        resetDemoData,
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
