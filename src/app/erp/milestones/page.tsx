'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy, Plus, Search, Edit3, Trash2, ExternalLink, CheckCircle2,
  Calendar, Clock, Sparkles, X, ArrowUpRight, Award, Flag, BarChart2,
  Hash, Layers, UserCheck, Users, Upload, Image as ImageIcon
} from 'lucide-react';
import { useErpStore, MilestoneItem, AchievementStatItem, LeadershipTeamMember } from '@/lib/store';

export default function ErpMilestonesPage() {
  const [mounted, setMounted] = useState(false);

  // Tab switcher state: 'timeline' | 'stats' | 'leadership'
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'leadership'>('timeline');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal State for Milestones
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Upcoming'>('Completed');

  // Modal State for Key Achievement Counter Metrics
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<AchievementStatItem | null>(null);
  const [statLabel, setStatLabel] = useState('');
  const [statValue, setStatValue] = useState('');
  const [statDesc, setStatDesc] = useState('');

  // Modal State for Leadership Team Members
  const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
  const [editingLeadership, setEditingLeadership] = useState<LeadershipTeamMember | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadRole, setLeadRole] = useState('');
  const [leadBio, setLeadBio] = useState('');
  const [leadPhotoUrl, setLeadPhotoUrl] = useState('');
  const [leadInitials, setLeadInitials] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    milestones = [],
    addMilestone,
    updateMilestone,
    deleteMilestone,
    achievementStats = [],
    addAchievementStat,
    updateAchievementStat,
    deleteAchievementStat,
    leadershipMembers = [],
    addLeadershipMember,
    updateLeadershipMember,
    deleteLeadershipMember,
  } = useErpStore();

  if (!mounted) return null;

  // --- MILESTONE HANDLERS ---
  const handleOpenCreateMilestone = () => {
    setEditingMilestone(null);
    setYear(new Date().getFullYear().toString());
    setTitle('');
    setDescription('');
    setStatus('Completed');
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: MilestoneItem) => {
    setEditingMilestone(m);
    setYear(m.year);
    setTitle(m.title);
    setDescription(m.description);
    setStatus(m.status);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !title.trim() || !description.trim()) return;

    if (editingMilestone) {
      updateMilestone(editingMilestone.id, {
        year,
        title,
        description,
        status,
      });
    } else {
      addMilestone({
        year,
        title,
        description,
        status,
      });
    }

    setIsMilestoneModalOpen(false);
  };

  const handleDeleteMilestone = (id: string, milestoneYear: string, milestoneTitle: string) => {
    if (confirm(`Are you sure you want to delete milestone "${milestoneYear} - ${milestoneTitle}"?`)) {
      deleteMilestone(id);
    }
  };

  // --- ACHIEVEMENT STAT METRICS HANDLERS ---
  const handleOpenCreateStat = () => {
    setEditingStat(null);
    setStatLabel('');
    setStatValue('');
    setStatDesc('');
    setIsStatModalOpen(true);
  };

  const handleOpenEditStat = (s: AchievementStatItem) => {
    setEditingStat(s);
    setStatLabel(s.label);
    setStatValue(s.value);
    setStatDesc(s.description || '');
    setIsStatModalOpen(true);
  };

  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statLabel.trim() || !statValue.trim()) return;

    if (editingStat) {
      updateAchievementStat(editingStat.id, {
        label: statLabel,
        value: statValue,
        description: statDesc,
      });
    } else {
      addAchievementStat({
        label: statLabel,
        value: statValue,
        description: statDesc,
      });
    }

    setIsStatModalOpen(false);
  };

  const handleDeleteStat = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete Key Metric Card "${label}"?`)) {
      deleteAchievementStat(id);
    }
  };

  // --- LEADERSHIP TEAM HANDLERS ---
  const handleOpenCreateLeadership = () => {
    setEditingLeadership(null);
    setLeadName('');
    setLeadRole('');
    setLeadBio('');
    setLeadPhotoUrl('');
    setLeadInitials('');
    setIsLeadershipModalOpen(true);
  };

  const handleOpenEditLeadership = (m: LeadershipTeamMember) => {
    setEditingLeadership(m);
    setLeadName(m.name);
    setLeadRole(m.role);
    setLeadBio(m.experienceBio);
    setLeadPhotoUrl(m.photoUrl || '');
    setLeadInitials(m.initials || m.name.substring(0, 2).toUpperCase());
    setIsLeadershipModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setLeadPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLeadership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadRole.trim() || !leadBio.trim()) return;

    const computedInitials = leadInitials.trim() || leadName.trim().substring(0, 2).toUpperCase();

    if (editingLeadership) {
      updateLeadershipMember(editingLeadership.id, {
        name: leadName,
        role: leadRole,
        experienceBio: leadBio,
        photoUrl: leadPhotoUrl,
        initials: computedInitials,
      });
    } else {
      addLeadershipMember({
        name: leadName,
        role: leadRole,
        experienceBio: leadBio,
        photoUrl: leadPhotoUrl,
        initials: computedInitials,
      });
    }

    setIsLeadershipModalOpen(false);
  };

  const handleDeleteLeadership = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove team member "${name}" from Leadership Team?`)) {
      deleteLeadershipMember(id);
    }
  };

  // Sorted Lists
  const sortedMilestones = [...milestones].sort((a, b) => a.year.localeCompare(b.year));
  const filteredMilestones = sortedMilestones.filter((m) => {
    const matchesSearch =
      m.year.includes(search) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const earliestYear = sortedMilestones.length > 0 ? sortedMilestones[0].year : '2015';

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#5ED29C]" />
            OUR MILESTONES &amp; LEADERSHIP TEAM MANAGEMENT<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60">
            Configure company growth timeline, leadership team members, and key achievement counter metrics displayed on the website's About page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#5ED29C] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#5ED29C]" />
            View About Page Live
          </Link>

          {activeTab === 'timeline' && (
            <button
              onClick={handleOpenCreateMilestone}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add New Milestone
            </button>
          )}

          {activeTab === 'stats' && (
            <button
              onClick={handleOpenCreateStat}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Metric Card
            </button>
          )}

          {activeTab === 'leadership' && (
            <button
              onClick={handleOpenCreateLeadership}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Team Member
            </button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">TOTAL MILESTONES</span>
            <div className="text-2xl font-extrabold font-mono text-white">{milestones.length}</div>
            <div className="text-[11px] text-[#5ED29C] font-semibold mt-1">Growth achievements</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center font-extrabold text-xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">LEADERSHIP TEAM</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">{leadershipMembers.length} Members</div>
            <div className="text-[11px] text-white/50 mt-1">Engineers &amp; Executives</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">COUNTER STAT CARDS</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">{achievementStats.length} Cards</div>
            <div className="text-[11px] text-cyan-300/80 font-semibold mt-1">Live website counters</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-extrabold text-xl">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">JOURNEY TIMELINE</span>
            <div className="text-2xl font-extrabold font-mono text-indigo-300">{earliestYear} - {new Date().getFullYear()}</div>
            <div className="text-[11px] text-white/50 mt-1">12+ years excellence</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tab Switcher */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> Growth Journey Timeline ({milestones.length})
          </button>

          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'leadership'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Meet Our Leadership Team ({leadershipMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Achievement Counter Metrics ({achievementStats.length})
          </button>
        </div>

        {activeTab === 'timeline' && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search milestones..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
          </div>
        )}
      </div>

      {/* TAB 1: GROWTH JOURNEY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#5ED29C]" />
              COMPANY MILESTONES CATALOG ({filteredMilestones.length})
            </h3>
            <span className="text-[10px] text-white/40 font-mono">Sorted chronologically by year</span>
          </div>

          {filteredMilestones.length === 0 ? (
            <div className="p-12 text-center text-white/40 space-y-2">
              <Trophy className="w-12 h-12 mx-auto text-white/20" />
              <p className="text-sm font-bold">No company milestones found.</p>
              <button
                onClick={handleOpenCreateMilestone}
                className="px-4 py-2 rounded-xl bg-[#5ED29C]/20 text-[#5ED29C] hover:bg-[#5ED29C] hover:text-[#070B0A] font-extrabold text-xs transition-all cursor-pointer"
              >
                + Add First Milestone
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredMilestones.map((item) => (
                <div key={item.id} className="p-5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="font-mono text-2xl font-black text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1.5 rounded-xl shrink-0">
                      {item.year}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-extrabold text-white">{item.title}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            item.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : item.status === 'In Progress'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 max-w-2xl leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditMilestone(item)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteMilestone(item.id, item.year, item.title)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEET OUR LEADERSHIP TEAM */}
      {activeTab === 'leadership' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5ED29C]" />
              LEADERSHIP TEAM MEMBERS ({leadershipMembers.length})
            </h3>
            <span className="text-[10px] text-white/40 font-mono">Live on website About page</span>
          </div>

          {leadershipMembers.length === 0 ? (
            <div className="p-12 text-center text-white/40 space-y-2">
              <Users className="w-12 h-12 mx-auto text-white/20" />
              <p className="text-sm font-bold">No leadership members configured.</p>
              <button
                onClick={handleOpenCreateLeadership}
                className="px-4 py-2 rounded-xl bg-[#5ED29C]/20 text-[#5ED29C] hover:bg-[#5ED29C] hover:text-[#070B0A] font-extrabold text-xs transition-all cursor-pointer"
              >
                + Add First Team Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {leadershipMembers.map((member) => (
                <div key={member.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 relative group">
                  <div className="space-y-3 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#5ED29C]/40 flex items-center justify-center overflow-hidden shadow-lg">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-xl font-black text-[#5ED29C] uppercase">
                          {member.initials || member.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white">{member.name}</h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {member.role}
                      </span>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed pt-1">
                      {member.experienceBio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenEditLeadership(member)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLeadership(member.id, member.name)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KEY ACHIEVEMENT COUNTER METRICS */}
      {activeTab === 'stats' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-300" />
              KEY ACHIEVEMENT COUNTER METRICS ({achievementStats.length})
            </h3>
            <span className="text-[10px] text-white/40 font-mono">Real-time website counter cards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {achievementStats.map((stat) => (
              <div key={stat.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">{stat.label}</span>
                  <div className="text-3xl font-black font-mono text-[#5ED29C]">{stat.value}</div>
                  {stat.description && (
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">{stat.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditStat(stat)}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStat(stat.id, stat.label)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: MILESTONE FORM */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full relative space-y-4 bg-[#070B0A]">
            <button
              onClick={() => setIsMilestoneModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#5ED29C]" />
              {editingMilestone ? 'Edit Company Milestone' : 'Add New Milestone'}
            </h2>

            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono font-bold outline-none focus:border-[#5ED29C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#5ED29C]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Headquarters & Dual Tracker Portal Expansion"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Milestone Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed achievement description..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LEADERSHIP TEAM FORM (WITH PHOTO UPLOAD) */}
      {isLeadershipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full relative space-y-4 bg-[#070B0A]">
            <button
              onClick={() => setIsLeadershipModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5ED29C]" />
              {editingLeadership ? 'Edit Leadership Member' : 'Add Leadership Member'}
            </h2>

            <form onSubmit={handleSaveLeadership} className="space-y-4 text-xs">
              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="block text-white/70 font-semibold uppercase">Team Member Photo / Avatar</label>
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-[#5ED29C]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {leadPhotoUrl ? (
                      <img src={leadPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-lg font-bold text-[#5ED29C]">
                        {leadInitials || leadName.substring(0, 2).toUpperCase() || 'AD'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] hover:bg-[#5ED29C] hover:text-[#070B0A] text-[11px] font-bold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo File
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                    {leadPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setLeadPhotoUrl('')}
                        className="text-[10px] text-red-400 hover:underline block"
                      >
                        Remove Photo (Use Initials)
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    type="text"
                    value={leadPhotoUrl}
                    onChange={(e) => setLeadPhotoUrl(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Alex Devid"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#5ED29C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={leadRole}
                    onChange={(e) => setLeadRole(e.target.value)}
                    placeholder="e.g. FOUNDER & CEO"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Experience / Bio Details</label>
                <textarea
                  rows={3}
                  required
                  value={leadBio}
                  onChange={(e) => setLeadBio(e.target.value)}
                  placeholder="e.g. 12+ years of enterprise IT repair operations management..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Initials Fallback (Optional)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={leadInitials}
                  onChange={(e) => setLeadInitials(e.target.value.toUpperCase())}
                  placeholder="e.g. AD, SM, RA"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white font-mono uppercase font-bold outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeadershipModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ACHIEVEMENT STAT METRIC FORM */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full relative space-y-4 bg-[#070B0A]">
            <button
              onClick={() => setIsStatModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-300" />
              {editingStat ? 'Edit Key Metric Card' : 'Add Metric Card'}
            </h2>

            <form onSubmit={handleSaveStat} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1">Metric Title / Label</label>
                <input
                  type="text"
                  required
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  placeholder="e.g. Repairs Completed"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Display Value</label>
                <input
                  type="text"
                  required
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="e.g. 45,000+ or 98.6%"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono font-bold outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Metric Description</label>
                <textarea
                  rows={2}
                  value={statDesc}
                  onChange={(e) => setStatDesc(e.target.value)}
                  placeholder="Short description of this achievement..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase"
                >
                  Save Metric Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
