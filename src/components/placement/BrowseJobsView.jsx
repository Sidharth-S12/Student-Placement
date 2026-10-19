import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Send,
  Loader2,
  RefreshCw,
  Award
} from 'lucide-react';
import { fetchActiveDrives } from '../../services/applicationService';
import { ApplyJobModal } from './ApplyJobModal';
import { Card, Button, Badge } from '../ui';

export const BrowseJobsView = ({
  studentData,
  applications = [],
  nominations = [],
  onApplicationCreated,
  onNavigateToApplications
}) => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [eligibilityFilter, setEligibilityFilter] = useState('All'); // 'All' | 'Eligible'

  // Selected drive for modal
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const {
    education = {},
    placementScores = {}
  } = studentData || {};

  const studentCgpa = parseFloat(education.cgpa || '0') || 0;
  const studentReadiness = placementScores.overallReadiness || 0;
  const studentBranch = studentData?.department || education.branch || 'Engineering';

  const loadDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActiveDrives();
      setDrives(data || []);
    } catch (err) {
      console.error('Failed to load active drives:', err);
      setError('Unable to load campus recruitment drives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  // Compute application & nomination lookup sets
  const appliedJobIds = useMemo(() => {
    return new Set(
      applications
        .filter(a => a.hasDirectApplication && a.status !== 'Withdrawn')
        .map(a => a.jobId)
    );
  }, [applications]);

  const nominatedJobIds = useMemo(() => {
    return new Set(
      nominations
        .filter(n => n.hasNomination)
        .map(n => n.jobId)
    );
  }, [nominations]);

  // Check eligibility for a specific drive
  const checkEligibility = (dr) => {
    const cgpaOk = !dr.minCgpa || studentCgpa >= dr.minCgpa;
    const readinessOk = !dr.minReadiness || studentReadiness >= dr.minReadiness;
    
    let deptOk = true;
    if (dr.eligibleDepartments && dr.eligibleDepartments.length > 0 && !dr.eligibleDepartments.includes('All')) {
      deptOk = dr.eligibleDepartments.some(d =>
        studentBranch.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(studentBranch.toLowerCase())
      );
    }

    const isEligible = cgpaOk && readinessOk && deptOk;
    return {
      isEligible,
      cgpaOk,
      readinessOk,
      deptOk
    };
  };

  // Filter drives
  const filteredDrives = useMemo(() => {
    return drives.filter(dr => {
      // Keyword search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        dr.companyName?.toLowerCase().includes(q) ||
        dr.jobRole?.toLowerCase().includes(q) ||
        dr.location?.toLowerCase().includes(q) ||
        dr.jobDescription?.toLowerCase().includes(q);

      // Department filter
      let matchesDept = true;
      if (departmentFilter !== 'All') {
        matchesDept = dr.eligibleDepartments?.includes('All') || dr.eligibleDepartments?.includes(departmentFilter);
      }

      // Eligibility filter
      let matchesElig = true;
      if (eligibilityFilter === 'Eligible') {
        const { isEligible } = checkEligibility(dr);
        matchesElig = isEligible;
      }

      return matchesSearch && matchesDept && matchesElig;
    });
  }, [drives, searchQuery, departmentFilter, eligibilityFilter, studentCgpa, studentReadiness, studentBranch]);

  const handleOpenApply = (dr) => {
    setSelectedDrive(dr);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Campus Placement Drives & Jobs
            </h1>
            <Badge variant="indigo">{drives.length} Active Drives</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse verified campus recruitment opportunities, verify your eligibility criteria, and submit direct applications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadDrives}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="gradient"
            size="sm"
            icon={Send}
            onClick={onNavigateToApplications}
          >
            My Applications ({applications.length})
          </Button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card className="p-4 bg-slate-900 border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, job role, or skills..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-850 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-850 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Departments</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="AI & DS">Artificial Intelligence (AI & DS)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="ME">Mechanical (ME)</option>
            </select>
          </div>

          {/* Eligibility Filter */}
          <div>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-850 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Available Jobs</option>
              <option value="Eligible">Only Jobs I Am Eligible For</option>
            </select>
          </div>
        </div>

        {/* Student Quick Profile Strip */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span>Your Credentials:</span>
            <span className="font-semibold text-white">{studentBranch}</span>
            <span>•</span>
            <span>CGPA: <strong className="text-white">{education.cgpa || 'Not set'}</strong></span>
            <span>•</span>
            <span>Readiness: <strong className="text-emerald-400">{studentReadiness}%</strong></span>
          </div>
          <span className="text-[11px] text-slate-500">
            Eligibility dynamically evaluated against minimum cut-offs
          </span>
        </div>
      </Card>

      {/* 3. Job Listings Grid */}
      {loading ? (
        <Card className="p-16 text-center text-xs text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p>Loading active campus drives...</p>
        </Card>
      ) : error ? (
        <Card className="p-10 text-center text-xs text-rose-300 border-rose-500/20 bg-rose-500/5 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p>{error}</p>
          <Button variant="secondary" size="sm" onClick={loadDrives}>Retry</Button>
        </Card>
      ) : filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDrives.map((dr) => {
            const hasApplied = appliedJobIds.has(dr.id);
            const isNominated = nominatedJobIds.has(dr.id);
            const { isEligible, cgpaOk, readinessOk, deptOk } = checkEligibility(dr);

            return (
              <Card
                key={dr.id}
                hover
                className="p-5 sm:p-6 bg-slate-900 border-slate-800 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                          {dr.companyName}
                        </span>
                        {hasApplied && (
                          <Badge variant="emerald" size="sm" dot>
                            Applied
                          </Badge>
                        )}
                        {isNominated && (
                          <Badge variant="purple" size="sm">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Officer Nominated
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-white truncate">
                        {dr.jobRole}
                      </h3>
                    </div>

                    <Badge
                      variant={
                        dr.status === 'Active'
                          ? 'emerald'
                          : dr.status === 'Upcoming'
                          ? 'indigo'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {dr.status}
                    </Badge>
                  </div>

                  {/* Compensation & Metadata Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Package
                      </span>
                      <div className="font-extrabold text-emerald-400 mt-0.5 truncate">
                        {dr.packageCTC || 'Competitive'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" /> Drive Date
                      </span>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.driveDate || 'TBA'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" /> Location
                      </span>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.location || 'Campus'}
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Criteria Breakdown */}
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Eligibility Evaluation
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      <div className="flex items-center space-x-1.5">
                        {cgpaOk ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span className={`text-[11px] truncate ${cgpaOk ? 'text-slate-300' : 'text-rose-300'}`}>
                          CGPA: {dr.minCgpa || 0}+
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {readinessOk ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span className={`text-[11px] truncate ${readinessOk ? 'text-slate-300' : 'text-rose-300'}`}>
                          Readiness: {dr.minReadiness || 0}%+
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {deptOk ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span className={`text-[11px] truncate ${deptOk ? 'text-slate-300' : 'text-rose-300'}`}>
                          Branch Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {dr.jobDescription && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {dr.jobDescription}
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    {hasApplied ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Application Submitted
                      </span>
                    ) : isNominated ? (
                      <span className="text-purple-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Nominated by Placement Cell
                      </span>
                    ) : isEligible ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        You meet all criteria
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium text-[11px]">
                        Criteria not met
                      </span>
                    )}
                  </div>

                  {hasApplied ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onNavigateToApplications}
                    >
                      View Status
                    </Button>
                  ) : (
                    <Button
                      variant={isEligible ? 'gradient' : 'secondary'}
                      size="sm"
                      icon={PlusCircle}
                      disabled={!isEligible}
                      onClick={() => handleOpenApply(dr)}
                    >
                      {isEligible ? 'Apply Now' : 'Ineligible'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="font-semibold text-slate-300">No recruitment drives found matching your filters.</p>
          <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setDepartmentFilter('All'); setEligibilityFilter('All'); }}>
            Reset Filters
          </Button>
        </Card>
      )}

      {/* Apply Job Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        drive={selectedDrive}
        studentData={studentData}
        onApplicationSubmitted={(app) => {
          if (onApplicationCreated) onApplicationCreated(app);
        }}
      />
    </div>
  );
};
