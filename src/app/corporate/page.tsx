'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { Building2, Server, Shield, CheckCircle2, Cpu, ShieldCheck, Award, UserCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useErpStore, LeadershipTeamMember } from '@/lib/store';
import Link from 'next/link';

export default function CorporatePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { leadershipMembers: storeLeadership = [] } = useErpStore();

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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#070B0A] text-white font-sans">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-extrabold uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5" /> ENTERPRISE IT SOLUTIONS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            CORPORATE IT &amp; INFRASTRUCTURE<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Custom business IT consulting, server deployment, structured networking cabling, Marg ERP &amp; Logic ERP integrations for business operations.
          </p>
        </motion.div>

        {/* Corporate Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#5ED29C]/40 transition-all">
            <Server className="w-8 h-8 text-[#5ED29C]" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Server &amp; Cloud Migration</h3>
            <p className="text-xs text-white/60 leading-relaxed">Active Directory, Windows Server, Linux deployments, and hybrid cloud storage back-ups.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#16FFC6]/40 transition-all">
            <Building2 className="w-8 h-8 text-[#16FFC6]" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Accounting &amp; ERP Integration</h3>
            <p className="text-xs text-white/60 leading-relaxed">Official Marg ERP &amp; Logic ERP implementation, POS counter sync, and custom GST modules.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-3 bg-white/5 hover:border-[#5ED29C]/40 transition-all">
            <Shield className="w-8 h-8 text-[#5ED29C]" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Cybersecurity &amp; CCTV</h3>
            <p className="text-xs text-white/60 leading-relaxed">Hardware firewalls, VPN tunnels, endpoint antivirus, and 4K CCTV surveillance networks.</p>
          </div>
        </div>

        {/* Meet Our Leadership Team Section */}
        <div className="my-20 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16FFC6]/10 border border-[#16FFC6]/30 text-[#16FFC6] text-xs font-bold uppercase">
              <Users className="w-3.5 h-3.5" /> EXECUTIVE DIRECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              Meet Our Leadership Team<span className="text-[#5ED29C]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
              Certified experts driving our diagnostic precision, corporate AMC delivery, and enterprise IT engineering.
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
                className="glass-panel p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-between space-y-4 hover:border-[#5ED29C]/40 transition-all group bg-white/5"
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

        {/* Enterprise-Grade Standards & Accredited Partnerships */}
        <div className="my-16 max-w-5xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Standards */}
            <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-6 lg:border-r border-white/10">
              <h3 className="text-xl font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#5ED29C]" /> Enterprise-Grade Standards
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                We run all corporate IT diagnostic operations inside Electrostatic Discharge (ESD)-protected workareas using professional thermal cameras, digital microscopes, and high-frequency soldering stations.
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

        {/* CTA Button */}
        <div className="text-center pt-6">
          <Link
            href="/contact?subject=Schedule%20Corporate%20IT%20Audit"
            className="px-8 py-4 rounded-full bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#5ED29C]/25 transition-all inline-block"
          >
            Schedule Corporate IT Audit
          </Link>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
