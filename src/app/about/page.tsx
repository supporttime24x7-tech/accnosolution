'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, StatsSection, CtaSection } from '@/components/home/Sections';
import { ShieldCheck, Award, Users, Wrench, CheckCircle2, Sparkles, Target, Eye, Trophy, Building2, UserCheck, ShieldAlert, Cpu, Server, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useErpStore, LeadershipTeamMember } from '@/lib/store';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { milestones: storeMilestones = [], leadershipMembers: storeLeadership = [] } = useErpStore();

  const values = [
    { icon: Wrench, title: 'Master Micro-Soldering', desc: 'Equipped with BGA reballing stations, digital microscopes, and high-frequency soldering units for board repairs.' },
    { icon: Award, title: 'Certified Engineers', desc: 'Our team holds Apple ACMT, Cisco CCNA, and Microsoft Certified System Engineer (MCSE) credentials.' },
    { icon: ShieldCheck, title: '100% Transparency', desc: 'No hidden diagnostic charges. You approve the quote before any repair work commences.' },
  ];

  // Dynamic Leadership Team fallback
  const leadershipTeam: LeadershipTeamMember[] = storeLeadership.length > 0
    ? storeLeadership
    : [
        {
          id: 'lead-1',
          name: 'Alex Devid',
          role: 'FOUNDER & CEO',
          experienceBio: '12+ years of enterprise IT repair operations management experience.',
          initials: 'AD',
          created_at: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'lead-2',
          name: 'Siddharth Mehta',
          role: 'LEAD MICRO-SOLDERING ENGINEER',
          experienceBio: 'Specializes in Apple logic boards, complex IC replacements, and board trace repairs.',
          initials: 'SM',
          created_at: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'lead-3',
          name: 'Rohan Alva',
          role: 'HEAD OF DATA RECOVERY',
          experienceBio: 'Certified HDD/SSD forensic recovery technician with a 94% recovery success rate.',
          initials: 'RA',
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ];

  // Dynamic Milestones from ERP Store sorted by year
  const activeMilestones = storeMilestones.length > 0
    ? [...storeMilestones].sort((a, b) => a.year.localeCompare(b.year))
    : [
        { year: '2015', title: 'Established in Jammu & Sanchore', description: 'Started as a precision component-level repair workshop with 2 engineers.' },
        { year: '2018', title: 'Apple Mac Micro-Soldering Desk', description: 'Expanded to logic board diagnostics for MacBook Pro, iMac & Mac Studio.' },
        { year: '2021', title: 'Class-100 Cleanroom Data Lab', description: 'Invested in forensic data extraction tools for dead HDDs, SSDs & RAID arrays.' },
        { year: '2024', title: 'ACCNO ERP Software Suite', description: 'Launched enterprise repair shop management, POS counter & inventory ERP.' },
        { year: '2025', title: '45,000+ Devices Repaired', description: 'Serving healthcare, hospitality, education, government, and power users.' },
      ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#070B0A] text-white font-sans">
      <Navbar />

      <section className="pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Our Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-extrabold uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5" /> OUR COMPANY
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            About Accno Solution<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Established in 2018, Accno Solution has grown from a local diagnostics lab into a premium, tech-driven, multi-branch repair service center. We repair consumer electronics, smart mobile devices, and complex enterprise IT hardware with certified expertise.
          </p>
        </motion.div>

        {/* Section 2: Our Mission & Our Vision (Side-by-Side Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 bg-white/5 hover:border-[#5ED29C]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Our Mission</h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              To deliver premium quality, transparent, and ultra-reliable repair services using advanced diagnostics instrumentation, certified engineers, and top-tier OEM components, returning devices to their optimal performance state quickly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 bg-white/5 hover:border-[#5ED29C]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Our Vision</h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              To become the most trusted name in electronics repair and enterprise hardware maintenance, establishing state-of-the-art diagnostic facilities and setting the gold standard for customer support and operational excellence.
            </p>
          </motion.div>
        </div>

        {/* Section 3: Meet Our Leadership Team */}
        <div className="my-20 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              Meet Our Leadership Team<span className="text-[#5ED29C]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Certified experts driving our diagnostic precision and engineering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leadershipTeam.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-between space-y-4 hover:border-[#5ED29C]/40 transition-all group"
              >
                <div className="space-y-4 flex flex-col items-center w-full">
                  {/* Photo / Avatar */}
                  <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-[#5ED29C]/40 flex items-center justify-center overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-2xl font-black text-[#5ED29C] uppercase">
                        {member.initials || member.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">{member.name}</h3>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full inline-block mt-1">
                      {member.role}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed pt-2">
                    {member.experienceBio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 4: Enterprise IT Solutions - Corporate IT & Infrastructure */}
        <div className="my-20 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-extrabold uppercase tracking-widest">
              ENTERPRISE IT SOLUTIONS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              CORPORATE IT &amp; INFRASTRUCTURE<span className="text-[#5ED29C]">.</span>
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Custom business IT consulting, server deployment, structured networking cabling, Marg ERP &amp; Logic ERP integrations for business operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#5ED29C]/40 transition-all"
            >
              <Server className="w-8 h-8 text-[#5ED29C]" />
              <h3 className="text-lg font-extrabold text-white">Server &amp; Cloud Migration</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Active Directory, Windows Server, Linux deployments, and hybrid cloud storage back-ups.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#16FFC6]/40 transition-all"
            >
              <Building2 className="w-8 h-8 text-[#16FFC6]" />
              <h3 className="text-lg font-extrabold text-white">Accounting &amp; ERP Integration</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Official Marg ERP &amp; Logic ERP implementation, POS counter sync, and custom GST modules.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#5ED29C]/40 transition-all"
            >
              <Shield className="w-8 h-8 text-[#5ED29C]" />
              <h3 className="text-lg font-extrabold text-white">Cybersecurity &amp; CCTV</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Hardware firewalls, VPN tunnels, endpoint antivirus, and 4K CCTV surveillance networks.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Section 5: Enterprise-Grade Standards & Accredited Partnerships */}
        <div className="my-16 max-w-5xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Standards */}
            <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-6 lg:border-r border-white/10">
              <h3 className="text-xl font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#5ED29C]" /> Enterprise Grade Standards
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                We run all diagnostic operations inside Electrostatic Discharge (ESD)-protected workareas using professional thermal cameras, digital microscopes, and high-frequency soldering stations.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/90">
                  <ShieldCheck className="w-4 h-4 text-[#5ED29C]" /> ESD Protection Certified
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/90">
                  <Award className="w-4 h-4 text-[#5ED29C]" /> ISO 9001:2015 Standards
                </div>
              </div>
            </div>

            {/* Right Column: Accredited Partnerships */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#5ED29C]" /> Accredited Partnerships
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                We collaborate with OEM suppliers and chip manufacturers, giving us access to schematic diagrams, board views, and authentic replacement parts.
              </p>
              <div className="pt-1">
                <span className="text-xs font-extrabold text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1.5 rounded-xl inline-block">
                  90+ Corporate clients covered under AMC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel glass-panel-hover p-8 rounded-2xl border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#5ED29C]/20 border border-[#5ED29C]/40 text-[#5ED29C] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Milestones Timeline */}
        <div className="my-20 space-y-12">
          <div className="text-center">
            <span className="text-[#5ED29C] text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4" /> Growth Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white mt-2">
              OUR MILESTONES<span className="text-[#5ED29C]">.</span>
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {activeMilestones.map((m: any, idx: number) => (
              <motion.div
                key={m.id || m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-[#5ED29C] border-y border-r border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-l-[#16FFC6] transition-all"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <span className="font-mono text-2xl font-black text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1.5 rounded-xl shrink-0">
                    {m.year}
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-white">{m.title}</h4>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                      {m.description || m.desc}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#16FFC6] shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
