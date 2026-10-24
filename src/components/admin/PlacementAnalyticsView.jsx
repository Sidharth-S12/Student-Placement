import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, PageHeader } from '../ui';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Briefcase,
  Layers,
  Award,
  Filter,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const PlacementAnalyticsView = ({
  students = [],
  departments = [],
  summary = null,
  applications = [],
  kmeansResult = null,
  officerScope = 'college',
  officerAssignedDept = null
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(() => {
    if (officerScope === 'department' && officerAssignedDept) {
      return officerAssignedDept;
    }
    return 'all';
  });

  // Calculate real department metrics
  const departmentData = useMemo(() => {
    const map = {};
    departments.forEach(dept => {
      map[dept] = {
        dept,
        totalStudents: 0,
        assessedCount: 0,
        totalTech: 0,
        totalApt: 0,
        totalComm: 0,
        totalReadiness: 0,
        appliedCount: 0,
        shortlistedCount: 0,
        selectedCount: 0,
        uniquePlacedIds: new Set()
      };
    });

    students.forEach(s => {
      const d = s.department || 'Other';
      if (!map[d]) {
        map[d] = {
          dept: d,
          totalStudents: 0,
          assessedCount: 0,
          totalTech: 0,
          totalApt: 0,
          totalComm: 0,
          totalReadiness: 0,
          appliedCount: 0,
          shortlistedCount: 0,
          selectedCount: 0,
          uniquePlacedIds: new Set()
        };
      }

      map[d].totalStudents++;
      const scores = s.placementScores || {};
      const tech = Number(scores.technicalScore || s.latestTechnicalScore || 0);
      const apt = Number(scores.aptitudeScore || 0);
      const comm = Number(scores.communicationScore || 75);
      const readiness = Number(scores.overallReadiness || 0);

      if (s.latestAssessmentId || scores.technicalScore !== undefined) {
        map[d].assessedCount++;
      }

      map[d].totalTech += tech;
      map[d].totalApt += apt;
      map[d].totalComm += comm;
      map[d].totalReadiness += readiness;
    });

    // Aggregate applications by student department
    applications.forEach(app => {
      const student = students.find(s => s.uid === app.studentId);
      const dept = student?.department || app.studentDepartment || 'Other';
      if (map[dept]) {
        map[dept].appliedCount++;
        if (app.status === 'Shortlisted') map[dept].shortlistedCount++;
        if (app.status === 'Selected') {
          map[dept].selectedCount++;
          map[dept].uniquePlacedIds.add(app.studentId);
        }
      }
    });

    return Object.values(map).map(d => {
      const placedUnique = d.uniquePlacedIds.size;
      return {
        ...d,
        avgTech: d.totalStudents > 0 ? Math.round(d.totalTech / d.totalStudents) : 0,
        avgApt: d.totalStudents > 0 ? Math.round(d.totalApt / d.totalStudents) : 0,
        avgComm: d.totalStudents > 0 ? Math.round(d.totalComm / d.totalStudents) : 0,
        avgReadiness: d.totalStudents > 0 ? Math.round(d.totalReadiness / d.totalStudents) : 0,
        completionRate: d.totalStudents > 0 ? Math.round((d.assessedCount / d.totalStudents) * 100) : 0,
        uniquePlaced: placedUnique,
        placementRate: d.totalStudents > 0 ? Math.round((placedUnique / d.totalStudents) * 100) : 0
      };
    }).sort((a, b) => b.totalStudents - a.totalStudents);
  }, [students, departments, applications]);

  // Overall application pipeline counts
  const pipelineStats = useMemo(() => {
    const filteredApps = selectedDeptFilter === 'all'
      ? applications
      : applications.filter(a => {
          const s = students.find(st => st.uid === a.studentId);
          const dept = s?.department || a.studentDepartment || '';
          return dept.toLowerCase() === selectedDeptFilter.toLowerCase();
        });

    return {
      applied: filteredApps.filter(a => a.status === 'Applied').length,
      underReview: filteredApps.filter(a => a.status === 'Under Review').length,
      shortlisted: filteredApps.filter(a => a.status === 'Shortlisted').length,
      interviewScheduled: filteredApps.filter(a => a.status === 'Interview Scheduled').length,
      selected: filteredApps.filter(a => a.status === 'Selected').length,
      rejected: filteredApps.filter(a => a.status === 'Rejected').length,
      total: filteredApps.length
    };
  }, [applications, students, selectedDeptFilter]);

  // Cluster distribution for selected department or college-wide
  const clusterDistribution = useMemo(() => {
    const targetStudents = selectedDeptFilter === 'all'
      ? students
      : students.filter(s => (s.department || '').toLowerCase() === selectedDeptFilter.toLowerCase());

    const clusterData = kmeansResult?.clusters || [];
    return clusterData.map(c => {
      const countInDept = c.students.filter(st => {
        if (selectedDeptFilter === 'all') return true;
        return (st.department || '').toLowerCase() === selectedDeptFilter.toLowerCase();
      }).length;

      const pct = targetStudents.length > 0
        ? Math.round((countInDept / targetStudents.length) * 100)
        : 0;

      return {
        id: c.id,
        name: c.name,
        color: c.color,
        dotClass: c.dotClass,
        count: countInDept,
        percentage: pct
      };
    });
  }, [kmeansResult, students, selectedDeptFilter]);

  // Selected department details
  const activeDeptData = useMemo(() => {
    if (selectedDeptFilter === 'all') return null;
    return departmentData.find(d => d.dept.toLowerCase() === selectedDeptFilter.toLowerCase()) || null;
  }, [departmentData, selectedDeptFilter]);

  const maxDeptStudents = Math.max(...departmentData.map(d => d.totalStudents), 1);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <PageHeader
        breadcrumb={['Admin Portal', 'Placement Analytics']}
        title="College-Wide & Department Analytics"
        subtitle="Real-time institutional placement trends, competency benchmarks, and recruitment funnel stages."
        actions={
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              disabled={officerScope === 'department'}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-850 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {officerScope !== 'department' && (
                <option value="all">College-Wide (All Departments)</option>
              )}
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Scope banner if department-specific */}
      {officerScope === 'department' && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Department Scope Enforced:</strong> Displaying placement analytics specifically for <strong>{officerAssignedDept}</strong>.
            </span>
          </div>
          <Badge variant="amber" size="sm">Branch Scoped</Badge>
        </div>
      )}

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1 bg-slate-850/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{selectedDeptFilter === 'all' ? 'Total Candidates' : `${selectedDeptFilter} Students`}</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {activeDeptData ? activeDeptData.totalStudents : students.length}
          </div>
          <p className="text-[11px] text-slate-400">Registered in system</p>
        </Card>

        <Card className="p-4 space-y-1 bg-slate-850/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Assessment Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {activeDeptData
              ? `${activeDeptData.completionRate}%`
              : `${students.length > 0 ? Math.round((students.filter(s => s.latestAssessmentId || s.placementScores?.technicalScore !== undefined).length / students.length) * 100) : 0}%`}
          </div>
          <p className="text-[11px] text-slate-400">Technical test completion</p>
        </Card>

        <Card className="p-4 space-y-1 bg-slate-850/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Uniquely Placed</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {activeDeptData ? activeDeptData.uniquePlaced : summary?.uniquelyPlacedStudents || 0}
          </div>
          <p className="text-[11px] text-slate-400">Distinct selected candidates</p>
        </Card>

        <Card className="p-4 space-y-1 bg-slate-850/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {activeDeptData ? `${activeDeptData.placementRate}%` : `${summary?.overallPlacementPercentage || 0}%`}
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            Placed / {activeDeptData ? activeDeptData.totalStudents : students.length} eligible
          </p>
        </Card>
      </div>

      {/* Row 1 Charts: Department Candidate Distribution & Average Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Total Students by Department (Bar Chart) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Candidates by Academic Department</h3>
              <p className="text-xs text-slate-400">Student enrollment distribution across college branches</p>
            </div>
            <BarChart3 className="w-4 h-4 text-brand-400" />
          </div>

          <div className="space-y-3 pt-1">
            {departmentData.map((d, idx) => {
              const widthPct = Math.round((d.totalStudents / maxDeptStudents) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{d.dept}</span>
                    <span className="text-slate-400 font-semibold">{d.totalStudents} students ({students.length > 0 ? Math.round((d.totalStudents / students.length) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {departmentData.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 italic">
                No department records found.
              </div>
            )}
          </div>
        </Card>

        {/* Chart 2: Average Scores by Department (Grouped Multi-Metric Bar) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Average Pillar Competencies by Department</h3>
              <p className="text-xs text-slate-400">Technical coding vs Aptitude logic vs Communication</p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-400" /><span>Tech</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /><span>Apt</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-purple-400" /><span>Comm</span></span>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {departmentData.map((d, idx) => (
              <div key={idx} className="space-y-1.5 p-2.5 rounded-xl bg-slate-850/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">{d.dept}</span>
                  <span className="text-[11px] font-bold text-emerald-400">{d.avgReadiness}% Readiness</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    <span className="text-[9px] block text-blue-400 uppercase font-bold">Tech</span>
                    <span className="font-extrabold">{d.avgTech}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    <span className="text-[9px] block text-indigo-400 uppercase font-bold">Aptitude</span>
                    <span className="font-extrabold">{d.avgApt}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    <span className="text-[9px] block text-purple-400 uppercase font-bold">Comm</span>
                    <span className="font-extrabold">{d.avgComm}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Row 2 Charts: K-Means Distribution & Recruitment Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 3: K-Means Cluster Distribution (Doughnut / Pill Visual) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Students by K-Means Cluster Cohort</h3>
              <p className="text-xs text-slate-400">
                {selectedDeptFilter === 'all' ? 'College-wide cohort distribution' : `Distribution in ${selectedDeptFilter}`}
              </p>
            </div>
            <PieChartIcon className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-3 pt-1">
            {clusterDistribution.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dotClass}`} />
                    <span className="font-bold text-white">{c.name}</span>
                  </div>
                  <span className="text-slate-300 font-semibold">{c.count} students ({c.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex items-center">
                  <div
                    className={`h-full rounded-full ${c.dotClass} transition-all duration-500`}
                    style={{ width: `${Math.max(c.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 4: Recruitment Funnel Pipeline */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Application Recruitment Pipeline</h3>
              <p className="text-xs text-slate-400">Funnel progression across interview stages</p>
            </div>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {[
              { label: 'Applied', count: pipelineStats.applied, color: 'bg-slate-500', text: 'text-slate-300' },
              { label: 'Under Review', count: pipelineStats.underReview, color: 'bg-blue-500', text: 'text-blue-300' },
              { label: 'Shortlisted', count: pipelineStats.shortlisted, color: 'bg-indigo-500', text: 'text-indigo-300' },
              { label: 'Interview Scheduled', count: pipelineStats.interviewScheduled, color: 'bg-purple-500', text: 'text-purple-300' },
              { label: 'Selected / Placed', count: pipelineStats.selected, color: 'bg-emerald-500', text: 'text-emerald-300' },
              { label: 'Rejected / Archived', count: pipelineStats.rejected, color: 'bg-rose-500', text: 'text-rose-300' },
            ].map((stage, idx) => {
              const maxCount = Math.max(pipelineStats.total, 1);
              const pct = Math.round((stage.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-semibold ${stage.text}`}>{stage.label}</span>
                    <span className="font-extrabold text-white">{stage.count} candidates ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${Math.max(pct, stage.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* Row 3: Department Placement Percentage Table */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-white">Department-Wise Placement Performance Summary</h3>
            <p className="text-xs text-slate-400">Strictly computed from verified selection records without duplication</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-brand-400" />
            <span>Formula: Uniquely Placed / Total Registered</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Candidates</th>
                <th className="py-2.5 px-3">Test Completion</th>
                <th className="py-2.5 px-3">Avg Readiness</th>
                <th className="py-2.5 px-3">Applications</th>
                <th className="py-2.5 px-3">Shortlisted</th>
                <th className="py-2.5 px-3">Selected (Placed)</th>
                <th className="py-2.5 px-3 text-right">Placement %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {departmentData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{d.dept}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{d.totalStudents}</td>
                  <td className="py-3 px-3 text-slate-300">{d.completionRate}%</td>
                  <td className="py-3 px-3 font-bold text-blue-400">{d.avgReadiness}%</td>
                  <td className="py-3 px-3 text-slate-300">{d.appliedCount}</td>
                  <td className="py-3 px-3 text-indigo-400 font-semibold">{d.shortlistedCount}</td>
                  <td className="py-3 px-3 text-emerald-400 font-extrabold">{d.uniquePlaced}</td>
                  <td className="py-3 px-3 text-right">
                    <Badge variant={d.placementRate >= 50 ? "emerald" : "neutral"} size="sm">
                      {d.placementRate}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
