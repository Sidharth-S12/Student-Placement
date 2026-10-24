import React, { useState } from 'react';
import {
  BookmarkCheck,
  Users,
  Eye,
  Download,
  Trash2,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';

const STAGES = ['Shortlisted', 'Under Review', 'Interview Scheduled', 'Selected'];

export const CompanyShortlistView = ({
  shortlist = [],
  onUpdateStage,
  onUpdateNotes,
  onRemoveFromShortlist,
  onSelectCandidate,
  onDownloadResume,
  onNavigate
}) => {
  const [filterStage, setFilterStage] = useState('All');
  const [activeNoteUid, setActiveNoteUid] = useState(null);
  const [tempNote, setTempNote] = useState('');

  const filteredItems = shortlist.filter((item) => {
    if (filterStage === 'All') return true;
    return (item.stage || 'Shortlisted') === filterStage;
  });

  const handleOpenNote = (item) => {
    setActiveNoteUid(item.uid);
    setTempNote(item.notes || '');
  };

  const handleSaveNote = (uid) => {
    if (onUpdateNotes) {
      onUpdateNotes(uid, tempNote);
    }
    setActiveNoteUid(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Shortlisted Candidates Pipeline
            </h1>
            <Badge variant="amber">{shortlist.length} Starred</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Track, evaluate, and manage candidate hiring stages from your verified campus shortlist.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Users}
          onClick={() => onNavigate('candidates')}
        >
          Discover More Talent
        </Button>
      </div>

      {/* 2. Pipeline Stage Summary & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shadow-subtle">
          {['All', ...STAGES].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStage === st
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Shortlist List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const student = item.student || {};
            const personal = student.personalInfo || {};
            const education = student.education || {};
            const scores = student.placementScores || {};
            const readiness = scores.overallReadiness || 0;
            const isEditingNote = activeNoteUid === item.uid;

            return (
              <Card
                key={item.uid}
                hover
                className="p-5 bg-slate-900/90 border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex items-start space-x-3.5 min-w-0">
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

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                          {personal.fullName || 'Candidate'}
                        </h3>
                        <Badge
                          variant={readiness >= 80 ? 'emerald' : 'neutral'}
                          size="sm"
                        >
                          {readiness}% Ready
                        </Badge>
                        <Badge variant="indigo" size="sm">
                          {student.department || education.branch || 'Engineering'}
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-400 truncate">
                        {education.degree || 'Degree'}{' '}
                        {education.college ? `• ${education.college}` : ''}
                        {education.cgpa && (
                          <span className="text-emerald-400 font-semibold">
                            {' '}
                            • CGPA: {education.cgpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage Dropdown & Actions */}
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 self-end sm:self-center">
                    {/* Stage Selector */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                        Stage:
                      </span>
                      <select
                        value={item.stage || 'Shortlisted'}
                        onChange={(e) => onUpdateStage(item.uid, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* View Profile */}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => onSelectCandidate(student)}
                    >
                      <span className="hidden sm:inline">Profile</span>
                    </Button>

                    {/* Resume */}
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Download}
                      onClick={(e) => onDownloadResume(e, student)}
                    >
                      <span className="hidden sm:inline">Resume</span>
                    </Button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => onRemoveFromShortlist(item.uid)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Score bar & Recruiter Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  {/* Scores Summary */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-850/60 border border-slate-800/80 text-slate-300">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Technical:
                      </span>{' '}
                      <strong className="text-blue-400">
                        {scores.technicalScore || student.latestTechnicalScore || 0}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Aptitude:
                      </span>{' '}
                      <strong className="text-indigo-400">{scores.aptitudeScore || 0}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Interview:
                      </span>{' '}
                      <strong className="text-purple-400">
                        {scores.communicationScore || 75}%
                      </strong>
                    </div>
                  </div>

                  {/* Recruiter Note Field */}
                  <div className="flex items-center space-x-2">
                    {isEditingNote ? (
                      <div className="flex-1 flex items-center space-x-1.5">
                        <input
                          type="text"
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="e.g. Cleared technical screening; schedule round 2..."
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote(item.uid)}
                          className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleOpenNote(item)}
                        className="flex-1 p-2 rounded-xl bg-slate-850/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer text-slate-400 flex items-center justify-between text-xs"
                      >
                        <span className="truncate">
                          {item.notes ? (
                            <span className="text-slate-200">{item.notes}</span>
                          ) : (
                            <span className="italic text-slate-500">
                              + Add recruiter note (e.g. interview feedback)...
                            </span>
                          )}
                        </span>
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500 ml-2 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-3">
          <BookmarkCheck className="w-8 h-8 mx-auto text-slate-500" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              No candidates found in "{filterStage}".
            </p>
            <p className="text-slate-400">
              Bookmark top performing students from Talent Discovery to manage your recruitment
              pipeline.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Users}
            onClick={() => onNavigate('candidates')}
          >
            Explore Talent Discovery
          </Button>
        </Card>
      )}
    </div>
  );
};
