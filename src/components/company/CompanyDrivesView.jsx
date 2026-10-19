import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';

export const CompanyDrivesView = ({
  drives = [],
  companyName,
  onOpenPostDrive
}) => {
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Upcoming' | 'Completed'

  const filteredDrives = drives.filter((dr) => {
    if (statusFilter === 'All') return true;
    return dr.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Recruitment Drives & Job Postings
            </h1>
            <Badge variant="indigo">{drives.length} Total Drives</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your company's campus recruitment drives, scheduled hiring events, and role
            criteria.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={onOpenPostDrive}
        >
          Post Recruitment Drive
        </Button>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start inline-flex shadow-subtle">
        {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === tab
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Drives Cards Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDrives.map((dr) => {
            const isOwner =
              companyName &&
              dr.companyName?.toLowerCase().includes(companyName.toLowerCase());

            return (
              <Card
                key={dr.id}
                hover
                className="p-5 sm:p-6 space-y-4 bg-slate-900/90 border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Company, Status, and Role */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                          {dr.companyName}
                        </span>
                        {isOwner && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold">
                            Your Drive
                          </span>
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

                  {/* CTC, Date, Location Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Package
                      </div>
                      <div className="font-extrabold text-emerald-400 mt-0.5 truncate">
                        {dr.packageCTC || 'Negotiable'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" /> Date
                      </div>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.driveDate || 'To be announced'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" /> Location
                      </div>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.location || 'Campus / Virtual'}
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cut-off CGPA: <strong className="text-white">{dr.minCgpa || 0}+</strong></span>
                      <span>Min Readiness: <strong className="text-emerald-400">{dr.minReadiness || 0}%</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 self-center mr-1">
                        Departments:
                      </span>
                      {(dr.eligibleDepartments || ['All']).map((dept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/80"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {dr.jobDescription && (
                    <p className="text-xs text-slate-400 line-clamp-2 pt-1">
                      {dr.jobDescription}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Campus Drive Pipeline Active</span>
                  </span>
                  <span className="text-brand-400 font-semibold">Campus Placement Cell</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-3">
          <Briefcase className="w-8 h-8 mx-auto text-slate-500" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              No recruitment drives found in "{statusFilter}".
            </p>
            <p className="text-slate-400">
              Post an upcoming recruitment drive to start receiving verified student applications.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onOpenPostDrive}
          >
            Post Recruitment Drive
          </Button>
        </Card>
      )}
    </div>
  );
};
