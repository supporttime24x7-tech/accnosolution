import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { HardDrive, ShieldAlert, Cpu, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DataRecoveryPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase mb-4">
            <HardDrive className="w-3.5 h-3.5" />
            Class-100 Cleanroom Environment
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase">
            FORENSIC DATA RECOVERY LAB<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm mt-3">
            98.6% success rate recovering data from clicking HDDs, dead SSDs, corrupted RAID arrays, and water-damaged devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#5ED29C]/20 border border-[#5ED29C] text-[#5ED29C] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              98.6%
            </div>
            <h3 className="text-lg font-bold text-white mb-2">High Recovery Success Rate</h3>
            <p className="text-xs text-white/60 leading-relaxed">Proprietary deep-read firmware tools for mechanical head swaps & NAND flash reconstruction.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#16FFC6]/20 border border-[#16FFC6] text-[#16FFC6] flex items-center justify-center mx-auto mb-4 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Confidentiality NDA</h3>
            <p className="text-xs text-white/60 leading-relaxed">Strict data privacy protocols for medical, corporate, legal, and financial records.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#5ED29C]/20 border border-[#5ED29C] text-[#5ED29C] flex items-center justify-center mx-auto mb-4 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Data, No Fee Guarantee</h3>
            <p className="text-xs text-white/60 leading-relaxed">Free initial evaluation. You only pay if your required file structure is restored.</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/book-repair"
            className="px-8 py-4 rounded-full bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#5ED29C]/25"
          >
            Submit Media for Free Evaluation
          </Link>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
