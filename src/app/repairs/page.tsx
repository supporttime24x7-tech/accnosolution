'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, RepairProcessSection, BrandsWeRepairSection, CtaSection } from '@/components/home/Sections';
import { Monitor, Laptop, Cpu, Smartphone, Printer, HardDrive, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useErpStore } from '@/lib/store';

const iconCategoryMap: Record<string, any> = {
  desktop: Monitor,
  laptop: Laptop,
  mac: Cpu,
  phone: Smartphone,
  printer: Printer,
  datarecovery: HardDrive,
};

export default function RepairsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'desktop' | 'laptop' | 'mac' | 'phone' | 'printer' | 'datarecovery'>('all');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { hardwareRepairCatalog = [] } = useErpStore();

  const defaultRepairServices = [
    { id: 'rep-1', category: 'desktop', title: 'Desktop & Gaming PC Circuit Repair', estPrice: '₹800 - ₹2,500', desc: 'Motherboard recapping, SMPS power supply fix, GPU reballing, BIOS chip flashing.', warrantyDays: 90 },
    { id: 'rep-2', category: 'laptop', title: 'Laptop Screen & Keyboard Overhaul', estPrice: '₹1,200 - ₹4,800', desc: 'FHD/4K display panel replacement, keyboard key fixing, battery swap, thermal repasting.', warrantyDays: 90 },
    { id: 'rep-3', category: 'mac', title: 'Apple Mac Logic Board Micro-Soldering', estPrice: '₹2,500 - ₹9,500', desc: 'M1/M2/M3 chip repair, liquid spill short-circuit restoration, SMC/T2 power rail diagnostics.', warrantyDays: 90 },
    { id: 'rep-4', category: 'phone', title: 'Smartphone Glass & Charging Port Fix', estPrice: '₹600 - ₹3,500', desc: 'OLED screen glass replacement, battery swap, charging port soldering for iPhone & Android.', warrantyDays: 90 },
    { id: 'rep-5', category: 'printer', title: 'Epson & Canon Head Cleaning & Roller Fix', estPrice: '₹500 - ₹1,800', desc: 'Continuous ink head unclogging, paper feed roller replacement, power card fix.', warrantyDays: 90 },
    { id: 'rep-6', category: 'datarecovery', title: 'Cleanroom Forensic Data Extraction', estPrice: '₹3,500 - ₹14,000', desc: 'Class-100 cleanroom head swap for clicking HDDs, dead NVMe SSDs, corrupted RAID arrays.', warrantyDays: 90 },
  ];

  const activeCatalog = mounted && hardwareRepairCatalog.length > 0 ? hardwareRepairCatalog : defaultRepairServices;

  const filteredRepairs = selectedCategory === 'all'
    ? activeCatalog
    : activeCatalog.filter((r: any) => r.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Micro-Soldering & Diagnostics Lab
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            HARDWARE & DEVICE REPAIRS<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-3">
            Select your device category below to view estimated diagnostic turnarounds, micro-soldering capabilities, and 90-day warranty coverage.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {(['all', 'desktop', 'laptop', 'mac', 'phone', 'printer', 'datarecovery'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Devices' : cat}
            </button>
          ))}
        </div>

        {/* Repair Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredRepairs.map((r: any, idx: number) => {
            const Icon = iconCategoryMap[r.category] || Monitor;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/20 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#16FFC6] bg-[#16FFC6]/10 px-3 py-1 rounded-full border border-[#16FFC6]/30">
                      {r.estPrice}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-6">{r.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-[#5ED29C] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 90-Day Warranty
                  </span>
                  <Link
                    href="/book-repair"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ED29C] hover:text-[#16FFC6] uppercase tracking-wider"
                  >
                    Book Slot <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <RepairProcessSection />
      <BrandsWeRepairSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
