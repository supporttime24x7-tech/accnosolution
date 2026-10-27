import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { Wifi, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NetworkingPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4 text-center">
        <span className="text-[#5ED29C] font-bold uppercase text-xs tracking-wider">Enterprise Cabling & Wi-Fi</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase mt-2">
          NETWORKING & STRUCTURED CABLING<span className="text-[#5ED29C]">.</span>
        </h1>
        <p className="text-white/70 text-sm mt-3 max-w-2xl mx-auto">
          Cat6/Fiber optic network layout, Cisco/MikroTik router configuration, enterprise Wi-Fi mesh networks, and firewall security.
        </p>
      </section>
      <CtaSection />
      <Footer />
    </main>
  );
}
