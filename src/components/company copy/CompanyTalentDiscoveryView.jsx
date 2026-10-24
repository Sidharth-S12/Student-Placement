import React from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  Loader2,
  Building2,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Users,
  Filter
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';

const COMMON_SKILLS = [
  'Python',
  'React',
  'JavaScript',
  'Java',
  'SQL',
  'Machine Learning',
  'Node.js',
  'MongoDB',
  'Go',
  'C++',
  'Git'
];

export const CompanyTalentDiscoveryView = ({
  skillQuery,
  setSkillQuery,
  departmentFilter,
  setDepartmentFilter,
  minReadiness,
  setMinReadiness,
  viewMode,
  setViewMode,
  departments = [],
  filteredCandidates = [],
  loading = false,
  shortlist = [],
  onToggleShortlist,
  onSelectCandidate,
  onDownloadResume
}) => {
  const shortlistedUids = new Set(shortlist.map((item) => item.uid));

  const handleQuickSkillClick = (skill) => {
    if (skillQuery.toLowerCase().includes(skill.toLowerCase())) {
      const cleaned = skillQuery
        .split(/\s+/)
        .filter((tok) => tok.toLowerCase() !== skill.toLowerCase())
        .join(' ');
      setSkillQuery(cleaned);
    } else {
      setSkillQuery((prev) => (prev.trim() ? `${prev.trim()} ${skill}` : skill));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header with Stats & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Campus Talent Discovery
            </h1>
            <Badge variant="neutral">
              {filteredCandidates.length} Candidates Available
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Search, filter, and evaluate verified campus talent based on live technical assessments,
            aptitude metrics, and placement readiness.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto shadow-subtle">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="List / Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Workspace Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search skills (e.g. Python, React, Java, SQL, Machine Learning)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
            {skillQuery && (
              <button
                type="button"
                onClick={() => setSkillQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500 transition-all"
            >
              <option value="all">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Min Readiness Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={minReadiness}
              onChange={(e) => setMinReadiness(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500 transition-all"
            >
              <option value={0}>Any Readiness</option>
              <option value={50}>&ge; 50% Readiness</option>
              <option value={70}>&ge; 70% Readiness</option>
              <option value={80}>&ge; 80% (Day-1 Ready)</option>
            </select>
          </div>
        </div>

        {/* Quick Skill Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-brand-400" /> Popular:
          </span>
          {COMMON_SKILLS.map((sk) => {
            const isSelected = skillQuery.toLowerCase().includes(sk.toLowerCase());
            return (
              <button
                key={sk}
                type="button"
                onClick={() => handleQuickSkillClick(sk)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80'
                }`}
              >
                {sk}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Results Section */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-card">
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          <span>Evaluating candidate profiles...</span>
        </div>
      ) : filteredCandidates.length > 0 ? (
        viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.map((student) => {
              const personal = student.personalInfo || {};
              const education = student.education || {};
              const scores = student.placementScores || {};
              const readiness = scores.overallReadiness || 0;
              const isShortlisted = shortlistedUids.has(student.uid);

              return (
                <Card
                  key={student.uid}
                  hover
                  className="p-5 flex flex-col justify-between space-y-4 bg-slate-900/90 border-slate-800"
                >
                  <div className="space-y-3.5">
                    {/* Top: Avatar & Information */}
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {personal.profilePhoto ? (
                          <img
                            src={personal.profilePhoto}
                            alt={personal.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-extrabold text-base text-brand-400">
                            {(personal.fullName || 'C').charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-white truncate">
                            {personal.fullName || 'Anonymous Candidate'}
                          </h4>
                          <Badge
                            variant={readiness >= 80 ? 'emerald' : 'neutral'}
                            size="sm"
                          >
                            {readiness >= 80 ? 'Day-1 Ready' : `${readiness}% Ready`}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {education.degree || 'Degree'}{' '}
                          {education.branch ? `• ${education.branch}` : ''}
                          {education.cgpa && <span> • CGPA: {education.cgpa}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {(student.normalizedSkills || []).slice(0, 6).map((sk, idx) => {
                          const isMatch =
                            skillQuery &&
                            skillQuery.toLowerCase().includes(sk.toLowerCase());
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                                isMatch
                                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-semibold'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                              }`}
                            >
                              {sk}
                            </span>
                          );
                        })}
                        {(student.normalizedSkills || []).length > 6 && (
                          <span className="text-[10px] text-slate-500 font-semibold self-center">
                            +{student.normalizedSkills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score Metrics Strip */}
                    <div className="p-2.5 bg-slate-850/80 rounded-xl border border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">
                          Readiness
                        </div>
                        <div className="font-extrabold text-emerald-400">{readiness}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">
                          Technical
                        </div>
                        <div className="font-extrabold text-blue-400">
                          {scores.technicalScore || student.latestTechnicalScore || 0}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">
                          Aptitude
                        </div>
                        <div className="font-extrabold text-indigo-400">
                          {scores.aptitudeScore || 0}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">
                          Interview
                        </div>
                        <div className="font-extrabold text-purple-400">
                          {scores.communicationScore || 75}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(student)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        isShortlisted
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                      }`}
                      title={isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    >
                      {isShortlisted ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => onSelectCandidate(student)}
                      >
                        Profile
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={Download}
                        onClick={(e) => onDownloadResume(e, student)}
                      >
                        Resume
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Key Skills</th>
                    <th className="py-3 px-4 text-center">Tech Score</th>
                    <th className="py-3 px-4 text-center">Readiness</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCandidates.map((student) => {
                    const personal = student.personalInfo || {};
                    const education = student.education || {};
                    const scores = student.placementScores || {};
                    const readiness = scores.overallReadiness || 0;
                    const isShortlisted = shortlistedUids.has(student.uid);

                    return (
                      <tr
                        key={student.uid}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {personal.fullName || 'Candidate'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {education.degree || 'Degree'}{' '}
                            {education.cgpa ? `• CGPA: ${education.cgpa}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {student.department || education.branch || 'General'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(student.normalizedSkills || []).slice(0, 3).map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-blue-400">
                          {scores.technicalScore || student.latestTechnicalScore || 0}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={readiness >= 80 ? 'emerald' : 'neutral'}
                            size="sm"
                          >
                            {readiness}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleShortlist(student)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                isShortlisted
                                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                              title={isShortlisted ? 'Shortlisted' : 'Shortlist'}
                            >
                              {isShortlisted ? (
                                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Eye}
                              onClick={() => onSelectCandidate(student)}
                            >
                              View
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              icon={Download}
                              onClick={(e) => onDownloadResume(e, student)}
                            >
                              Resume
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-2">
          <Building2 className="w-8 h-8 mx-auto text-slate-500" />
          <p className="font-semibold text-slate-200">No candidates match your search filters.</p>
          <p className="text-slate-400">
            Try adjusting your skill keywords or selecting another department filter.
          </p>
        </Card>
      )}
    </div>
  );
};
