import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <section className="pt-36 pb-20 max-w-4xl mx-auto px-4 text-xs text-white/70 space-y-6 leading-relaxed">
        <h1 className="text-3xl font-extrabold uppercase text-white mb-6">PRIVACY POLICY<span className="text-[#5ED29C]">.</span></h1>
        <p>ACCNO SOLUTION is committed to protecting customer data privacy. All drive backups, customer phone records, and diagnostic files are strictly confidential and encrypted under NDA protocol.</p>
        <h3 className="text-sm font-bold text-white uppercase pt-4">Data Collection & Storage</h3>
        <p>We collect device specifications, contact details, and serial numbers strictly for generating repair tickets, GST invoices, and tracking warranty timelines.</p>
      </section>
      <Footer />
    </main>
  );
}
