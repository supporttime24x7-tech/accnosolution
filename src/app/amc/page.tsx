'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { Shield, CheckCircle2, Building2, Clock, Calculator, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AmcPage() {
  const [deviceCount, setDeviceCount] = useState(10);
  const [cctvCount, setCctvCount] = useState(4);
  const [includeParts, setIncludeParts] = useState(true);

  // Estimator logic
  const perPcRate = includeParts ? 3500 : 1500;
  const perCctvRate = 600;
  const totalAnnualCost = deviceCount * perPcRate + cctvCount * perCctvRate;

  const amcPlans = [
    { name: 'Basic Office AMC', price: '₹1,500 / PC / Year', features: ['4 Preventive Visits/Year', 'Unlimited Breakdown Calls', 'OS & Virus Cleanup', 'Quarterly Dust Blow cleaning', 'Remote Desktop Support'] },
    { name: 'Comprehensive Hardware AMC', price: '₹3,500 / PC / Year', features: ['Includes Part Replacements', 'Motherboard & RAM coverage', 'Dedicated Resident Engineer', 'Same-day Onsite Replacement', 'Free Standby Systems'] },
    { name: 'Corporate Infrastructure AMC', price: 'Custom Quote', features: ['Servers + Laptops + Network', 'CCTV & EPABX Management', 'Firewall & Cloud Backups', '24/7 SLA Priority Response', 'Dedicated Service Manager'] },
  ];

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Uptime SLA
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            ANNUAL MAINTENANCE CONTRACTS (AMC)<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-3">
            Keep your business IT infrastructure operating with 99.9% uptime. Preventive maintenance & rapid field response.
          </p>
        </motion.div>

        {/* Interactive AMC Cost Estimator Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 rounded-3xl border border-[#5ED29C]/40 max-w-4xl mx-auto mb-20 shadow-2xl"
        >
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/20 border border-[#5ED29C] text-[#5ED29C] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase">INSTANT AMC COST ESTIMATOR</h3>
              <p className="text-xs text-white/50">Calculate estimated annual contract cost based on your office devices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase mb-2">Number of Computers / Laptops ({deviceCount})</label>
              <input
                type="range"
                min="3"
                max="100"
                value={deviceCount}
                onChange={(e) => setDeviceCount(Number(e.target.value))}
                className="w-full accent-[#5ED29C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase mb-2">Number of CCTV Cameras ({cctvCount})</label>
              <input
                type="range"
                min="0"
                max="50"
                value={cctvCount}
                onChange={(e) => setCctvCount(Number(e.target.value))}
                className="w-full accent-[#5ED29C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase mb-2">Hardware Spare Parts Coverage</label>
              <button
                type="button"
                onClick={() => setIncludeParts(!includeParts)}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                  includeParts
                    ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                    : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                {includeParts ? 'Comprehensive (Parts Included)' : 'Labor Only (Non-Comprehensive)'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-white/50 uppercase block">Estimated Annual Contract Total</span>
              <div className="text-3xl font-extrabold font-mono text-[#16FFC6]">
                ₹{totalAnnualCost.toLocaleString()} / Year
              </div>
            </div>

            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/25"
            >
              Request Custom Proposal
            </Link>
          </div>
        </motion.div>

        {/* AMC Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {amcPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#5ED29C]">{plan.price}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-6">{plan.name}</h3>
                <ul className="space-y-3 text-xs text-white/70">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5ED29C]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/contact"
                className="mt-8 w-full py-3.5 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider text-center"
              >
                Request AMC Proposal
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
