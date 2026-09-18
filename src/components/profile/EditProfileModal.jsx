import React, { useState, useRef, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import {
  X,
  User,
  GraduationCap,
  Link,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  Plus,
  Trash2,
  Save,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const EditProfileModal = () => {
  const {
    studentData,
    hasProfile,
    setFullStudentData,
    isEditModalOpen,
    setIsEditModalOpen,
    handlePhotoFileUpload,
    removeProfilePhoto
  } = useStudent();

  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [formData, setFormData] = useState(studentData);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditModalOpen) {
      setFormData(studentData || {});
    }
  }, [isEditModalOpen, studentData]);

  if (!isEditModalOpen) return null;

  // Handlers for profile photo file upload
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoFileUpload(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profilePhoto: uploadEvent.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [name]: value }
    });
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      education: { ...formData.education, [name]: value }
    });
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      professionalLinks: { ...formData.professionalLinks, [name]: value }
    });
  };

  const handleSkillsCommaChange = (categoryKey, rawText) => {
    const arr = rawText.split(',').map((s) => s.trim()).filter(Boolean);
    const formatted = arr.map(item => typeof item === 'string' ? { name: item, level: 'Proficient' } : item);
    setFormData({
      ...formData,
      technicalSkills: { ...formData.technicalSkills, [categoryKey]: formatted }
    });
  };

  // Projects handlers
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...(formData.projects || [])];
    if (field === 'technologies') {
      newProjects[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else if (field === 'highlights') {
      newProjects[index][field] = value.split('\n').filter(Boolean);
    } else {
      newProjects[index][field] = value;
    }
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: "Software Project",
      description: "Project description and key features...",
      technologies: ["React", "Node.js"],
      projectLink: "",
      githubLink: "",
      highlights: ["Implemented core feature"]
    };
    setFormData({ ...formData, projects: [...(formData.projects || []), newProj] });
  };

  const removeProject = (index) => {
    const filtered = (formData.projects || []).filter((_, i) => i !== index);
    setFormData({ ...formData, projects: filtered });
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const newExp = [...(formData.experience || [])];
    if (field === 'responsibilities') {
      newExp[index][field] = value.split('\n').filter(Boolean);
    } else {
      newExp[index][field] = value;
    }
    setFormData({ ...formData, experience: newExp });
  };

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: "Software Intern",
      organization: "Company Name",
      duration: "3 Months",
      location: "Location",
      description: "Role overview...",
      responsibilities: ["Developed user dashboard features."]
    };
    setFormData({ ...formData, experience: [...(formData.experience || []), newExp] });
  };

  const removeExperience = (index) => {
    const filtered = (formData.experience || []).filter((_, i) => i !== index);
    setFormData({ ...formData, experience: filtered });
  };

  // Certifications Handlers
  const handleCertChange = (index, field, value) => {
    const newCerts = [...(formData.certifications || [])];
    newCerts[index][field] = value;
    setFormData({ ...formData, certifications: newCerts });
  };

  const addCert = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: "Certification Name",
      organization: "Issuing Organization",
      date: "2024",
      certificateLink: ""
    };
    setFormData({ ...formData, certifications: [...(formData.certifications || []), newCert] });
  };

  const removeCert = (index) => {
    const filtered = (formData.certifications || []).filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: filtered });
  };

  // Achievements Handlers
  const handleAchChange = (index, field, value) => {
    const newAchs = [...(formData.achievements || [])];
    newAchs[index][field] = value;
    setFormData({ ...formData, achievements: newAchs });
  };

  const addAch = () => {
    const newAch = {
      id: `ach-${Date.now()}`,
      title: "Achievement Title",
      organization: "Organization / Event",
      date: "2024",
      category: "Hackathon",
      description: "Award description..."
    };
    setFormData({ ...formData, achievements: [...(formData.achievements || []), newAch] });
  };

  const removeAch = (index) => {
    const filtered = (formData.achievements || []).filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: filtered });
  };

  // Save changes
  const handleSaveAll = (e) => {
    e.preventDefault();
    setFullStudentData(formData);
    setIsEditModalOpen(false);
  };

  const subTabs = [
    { id: 'personal', label: 'Personal & Photo', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'links', label: 'Links', icon: Link },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {hasProfile ? 'Edit Placement Profile' : 'Create Your Placement Profile'}
            </h2>
          </div>

          <button
            onClick={() => setIsEditModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Subtabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 overflow-x-auto px-4 pt-2 gap-1 scrollbar-none">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-brand-600 border-t-2 border-brand-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSaveAll} className="space-y-6">

            {/* TAB 1: Personal Info & Photo Upload */}
            {activeSubTab === 'personal' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={formData.personalInfo?.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md border border-slate-200"
                  />

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="text-xs font-bold text-slate-900">Student Profile Photo</h4>
                    <p className="text-[11px] text-slate-500">
                      Upload an image file directly from your device (JPG, PNG, WEBP).
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
                      >
                        <span>Change Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removeProfilePhoto();
                          setFormData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              profilePhoto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"
                            }
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium border border-red-200"
                      >
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.personalInfo?.fullName || ''}
                      onChange={handlePersonalChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Role</label>
                    <input
                      type="text"
                      name="headline"
                      placeholder="e.g. B.Tech Computer Science Student"
                      value={formData.personalInfo?.headline || ''}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="student@college.edu"
                      value={formData.personalInfo?.email || ''}
                      onChange={handlePersonalChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.personalInfo?.phone || ''}
                      onChange={handlePersonalChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Bengaluru, India"
                      value={formData.personalInfo?.location || ''}
                      onChange={handlePersonalChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary</label>
                  <textarea
                    name="summary"
                    rows={4}
                    placeholder="Brief career objective and key technical achievements..."
                    value={formData.personalInfo?.summary || ''}
                    onChange={handlePersonalChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Education */}
            {activeSubTab === 'education' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University Name</label>
                  <input
                    type="text"
                    name="college"
                    placeholder="National Institute of Technology"
                    value={formData.education?.college || ''}
                    onChange={handleEducationChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    name="degree"
                    placeholder="B.Tech"
                    value={formData.education?.degree || ''}
                    onChange={handleEducationChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Specialization</label>
                  <input
                    type="text"
                    name="branch"
                    placeholder="Computer Science & Engineering"
                    value={formData.education?.branch || ''}
                    onChange={handleEducationChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA / Grade</label>
                  <input
                    type="text"
                    name="cgpa"
                    placeholder="8.92 / 10.0"
                    value={formData.education?.cgpa || ''}
                    onChange={handleEducationChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    name="graduationYear"
                    placeholder="2025"
                    value={formData.education?.graduationYear || ''}
                    onChange={handleEducationChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">12th Grade % / Board</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="twelfthPercentage"
                      placeholder="93.8%"
                      value={formData.education?.twelfthPercentage || ''}
                      onChange={handleEducationChange}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                    <input
                      type="text"
                      name="twelfthBoard"
                      placeholder="CBSE"
                      value={formData.education?.twelfthBoard || ''}
                      onChange={handleEducationChange}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">10th Grade % / Board</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="tenthPercentage"
                      placeholder="95.4%"
                      value={formData.education?.tenthPercentage || ''}
                      onChange={handleEducationChange}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                    <input
                      type="text"
                      name="tenthBoard"
                      placeholder="CBSE"
                      value={formData.education?.tenthBoard || ''}
                      onChange={handleEducationChange}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Links */}
            {activeSubTab === 'links' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.professionalLinks?.linkedin || ''}
                    onChange={handleLinksChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/username"
                    value={formData.professionalLinks?.github || ''}
                    onChange={handleLinksChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Website URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    placeholder="https://myportfolio.dev"
                    value={formData.professionalLinks?.portfolio || ''}
                    onChange={handleLinksChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Skills */}
            {activeSubTab === 'skills' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Programming Languages (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Java, JavaScript, Python, C++, SQL"
                    value={(formData.technicalSkills?.programmingLanguages || []).map(s => typeof s === 'string' ? s : s.name).join(', ')}
                    onChange={(e) => handleSkillsCommaChange('programmingLanguages', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frameworks & Libraries (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React.js, Next.js, Node.js, Express, Tailwind CSS"
                    value={(formData.technicalSkills?.frameworks || []).map(s => typeof s === 'string' ? s : s.name).join(', ')}
                    onChange={(e) => handleSkillsCommaChange('frameworks', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Databases (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="PostgreSQL, MongoDB, Redis, MySQL"
                    value={(formData.technicalSkills?.databases || []).map(s => typeof s === 'string' ? s : s.name).join(', ')}
                    onChange={(e) => handleSkillsCommaChange('databases', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tools & Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Git, GitHub, Docker, AWS, Postman"
                    value={(formData.technicalSkills?.toolsTechnologies || []).map(s => typeof s === 'string' ? s : s.name).join(', ')}
                    onChange={(e) => handleSkillsCommaChange('toolsTechnologies', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: Projects */}
            {activeSubTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Projects ({(formData.projects || []).length})</span>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs flex items-center space-x-1 border border-brand-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {(formData.projects || []).map((proj, index) => (
                  <div key={proj.id || index} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Project #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name || ''}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma-separated)"
                        value={(proj.technologies || []).join(', ')}
                        onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="url"
                        placeholder="GitHub Link"
                        value={proj.githubLink || ''}
                        onChange={(e) => handleProjectChange(index, 'githubLink', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="url"
                        placeholder="Live Demo URL"
                        value={proj.projectLink || ''}
                        onChange={(e) => handleProjectChange(index, 'projectLink', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <textarea
                      placeholder="Project Description"
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Highlights (One bullet per line)
                      </label>
                      <textarea
                        rows={2}
                        value={(proj.highlights || []).join('\n')}
                        onChange={(e) => handleProjectChange(index, 'highlights', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: Experience */}
            {activeSubTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Work Experience ({(formData.experience || []).length})</span>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs flex items-center space-x-1 border border-brand-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {(formData.experience || []).map((exp, index) => (
                  <div key={exp.id || index} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Experience #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Role"
                        value={exp.role || ''}
                        onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Organization"
                        value={exp.organization || ''}
                        onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration || ''}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <textarea
                      placeholder="Responsibilities & Achievements (One bullet per line)"
                      rows={3}
                      value={(exp.responsibilities || []).join('\n')}
                      onChange={(e) => handleExperienceChange(index, 'responsibilities', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 7: Certifications */}
            {activeSubTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Certifications ({(formData.certifications || []).length})</span>
                  <button
                    type="button"
                    onClick={addCert}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs flex items-center space-x-1 border border-brand-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Cert</span>
                  </button>
                </div>

                {(formData.certifications || []).map((cert, index) => (
                  <div key={cert.id || index} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Cert #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={cert.name || ''}
                        onChange={(e) => handleCertChange(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={cert.organization || ''}
                        onChange={(e) => handleCertChange(index, 'organization', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={cert.date || ''}
                        onChange={(e) => handleCertChange(index, 'date', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="url"
                        placeholder="Certificate Link"
                        value={cert.certificateLink || ''}
                        onChange={(e) => handleCertChange(index, 'certificateLink', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 8: Achievements */}
            {activeSubTab === 'achievements' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Achievements ({(formData.achievements || []).length})</span>
                  <button
                    type="button"
                    onClick={addAch}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs flex items-center space-x-1 border border-brand-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Achievement</span>
                  </button>
                </div>

                {(formData.achievements || []).map((ach, index) => (
                  <div key={ach.id || index} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Achievement #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAch(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Achievement Title"
                        value={ach.title || ''}
                        onChange={(e) => handleAchChange(index, 'title', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Organization / Event"
                        value={ach.organization || ''}
                        onChange={(e) => handleAchChange(index, 'organization', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={ach.date || ''}
                        onChange={(e) => handleAchChange(index, 'date', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Category (e.g. Hackathon, Academic)"
                        value={ach.category || ''}
                        onChange={(e) => handleAchChange(index, 'category', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <textarea
                      placeholder="Description"
                      rows={2}
                      value={ach.description || ''}
                      onChange={(e) => handleAchChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Save Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Placement Profile</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
