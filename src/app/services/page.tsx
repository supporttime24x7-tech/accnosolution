'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import {
  Wrench, Cpu, HardDrive, ShieldCheck, Wifi, Server, Monitor, Layers,
  Sparkles, CheckCircle2, ArrowRight, Clock, Shield, Headphones, DollarSign,
  Award, Zap, ChevronRight, Info, Search, Filter, PhoneCall, ExternalLink,
  Lock, RefreshCw, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useErpStore } from '@/lib/store';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Wrench,
  Cpu,
  HardDrive,
  Monitor,
  ShieldCheck,
  Wifi,
  Server,
  Layers,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  DollarSign,
};

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { detailedServices = [], serviceStats = [], servicePillars = [], servicesFaqs = [] } = useErpStore();

  if (!mounted) return null;

  const visibleStats = serviceStats.filter((s) => s.isVisible !== false);
  const visibleServices = detailedServices.filter((s) => s.isVisible !== false);
  const visiblePillars = servicePillars.filter((p) => p.isVisible !== false);
  const visibleFaqs = servicesFaqs.filter((f) => f.isVisible !== false);

  const servicesList = visibleServices.map((s) => ({
    ...s,
    icon: (s.iconName && ICON_MAP[s.iconName]) ? ICON_MAP[s.iconName] : Wrench,
    features: Array.isArray(s.features) ? s.features : (typeof s.features === 'string' ? (s.features as string).split('\n').filter(Boolean) : []),
  }));

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'hardware', name: 'Hardware Repair' },
    { id: 'mac', name: 'Apple Mac' },
    { id: 'datarecovery', name: 'Data Recovery' },
    { id: 'custompc', name: 'Custom PCs' },
    { id: 'cctv', name: 'CCTV Security' },
    { id: 'networking', name: 'Networking' },
    { id: 'amc', name: 'Corporate AMC' },
    { id: 'software', name: 'Software ERP' },
  ];

  const filteredServices = activeTab === 'all'
    ? servicesList
    : servicesList.filter((s) => s.category === activeTab);

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-gradient-to-b from-[#070B0A] via-[#0D1117] to-[#070B0A]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5ED29C]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#16FFC6]" />
              TECHNICAL SERVICES & ENGINEERING HUB
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-tight">
              OUR SERVICES & THE REASONS BEHIND THEM<span className="text-[#5ED29C]">.</span>
            </h1>

            <p className="mt-6 text-white/70 text-base sm:text-lg leading-relaxed">
              From component-level micro-soldering to enterprise network deployment and cleanroom data recovery — explore our complete technical service portfolio engineered for maximum reliability, speed, and cost efficiency.
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {visibleStats.map((st) => (
              <div key={st.id} className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                <div className="text-3xl font-extrabold font-mono" style={{ color: st.color || '#5ED29C' }}>
                  {st.value}
                </div>
                <div className="text-xs text-white/60 uppercase font-semibold mt-1">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Navigation */}
      <section className="py-8 bg-[#070B0A] border-y border-white/10 sticky top-16 z-30 backdrop-blur-md bg-[#070B0A]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/25 scale-105'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            FULL SERVICE DETAILS & TECHNICAL SPECIFICATIONS<span className="text-[#5ED29C]">.</span>
          </h2>
          <p className="text-white/60 text-sm mt-3">
            Select any service to view key capabilities, target applications, SLA turnaround, and the rationale behind our engineering standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service, index) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-6 right-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5ED29C]/20 to-[#16FFC6]/10 border border-[#5ED29C]/30 flex items-center justify-center text-[#5ED29C] mb-6">
                    <IconComp className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">{service.shortDesc}</p>

                  {/* Why Choose This Service Callout */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-[#16FFC6] text-xs font-bold uppercase tracking-wider">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      The Rationale &amp; Reason Behind This Service
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed italic">
                      &quot;{service.whyChoose}&quot;
                    </p>
                  </div>

                  {/* Core Features List */}
                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Key Service Capabilities:</div>
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-white/90">
                        <CheckCircle2 className="w-4 h-4 text-[#5ED29C] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-white/40 block font-semibold uppercase text-[9px]">SLA Turnaround</span>
                      <span className="text-[#16FFC6] font-bold font-mono">{service.turnaround}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-white/40 block font-semibold uppercase text-[9px]">Warranty Coverage</span>
                      <span className="text-[#5ED29C] font-bold font-mono">{service.warranty}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-white/50 truncate max-w-[200px]" title={service.idealFor}>
                      <span className="text-white/30 font-bold uppercase text-[9px] block">Target Audience</span>
                      {service.idealFor}
                    </span>

                    <Link
                      href={service.actionLink}
                      className="px-4 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#5ED29C]/20 transition-all"
                    >
                      {service.actionText} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE ACCNO SOLUTION SECTION */}
      <section className="py-24 bg-[#0D1117] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              THE ACCNO SOLUTION DIFFERENCE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              WHY WE OFFER THESE SPECIFIC SERVICES<span className="text-[#5ED29C]">.</span>
            </h2>
            <p className="mt-4 text-white/70 text-sm sm:text-base">
              Our service catalog is engineered around solving real hardware, data, and software bottlenecks that traditional repair centers overlook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visiblePillars.map((plr) => {
              const IconComp = (plr.iconName && ICON_MAP[plr.iconName]) ? ICON_MAP[plr.iconName] : DollarSign;
              return (
                <div key={plr.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center">
                        <IconComp className="w-6 h-6" />
                      </div>
                      {plr.badge && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2.5 py-1 rounded-full">
                          {plr.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{plr.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {plr.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            FREQUENTLY ASKED QUESTIONS<span className="text-[#5ED29C]">.</span>
          </h2>
          <p className="text-white/60 text-xs mt-2">Transparent answers regarding our service SLAs, warranties, and repair processes.</p>
        </div>

        <div className="space-y-4">
          {visibleFaqs.map((faq) => (
            <div key={faq.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#5ED29C] flex-shrink-0" /> {faq.question}
                </h3>
                {faq.category && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2.5 py-0.5 rounded-full flex-shrink-0">
                    {faq.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
