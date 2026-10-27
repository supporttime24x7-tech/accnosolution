'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import MargERPSection from '@/components/projects/MargERPSection';
import { Layers, CheckCircle2, ArrowLeft, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RepairShopErpPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#16FFC6] uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Projects & Services
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16FFC6]/10 border border-[#16FFC6]/30 text-[#16FFC6] text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Flagship Software Project Showcase
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            CUSTOM REPAIR SHOP ERP & POS COUNTER SYSTEM<span className="text-[#16FFC6]">.</span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            A comprehensive enterprise-grade software suite designed for multi-location repair shops, computer hardware centers, and mobile service desks. Built-in barcode job tracking, counter POS billing, GST invoicing, automated SMS customer notifications, and Marg ERP integration.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Ticket Tracking</span>
              <span className="text-sm font-extrabold text-[#16FFC6]">Barcode Scan Tag</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Billing Engine</span>
              <span className="text-sm font-extrabold text-[#16FFC6]">GST Compliant POS</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Deployment</span>
              <span className="text-sm font-extrabold text-[#16FFC6]">Cloud & Desktop</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/40 uppercase font-mono block">SLA Support</span>
              <span className="text-sm font-extrabold text-[#16FFC6]">2-Hour Response</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Pricing & Dynamic Quotation Calculator Section */}
      <section className="border-t border-white/10 pt-8">
        <MargERPSection />
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
