import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <section className="pt-36 pb-20 max-w-4xl mx-auto px-4 text-xs text-white/70 space-y-6 leading-relaxed">
        <h1 className="text-3xl font-extrabold uppercase text-white mb-6">TERMS & CONDITIONS<span className="text-[#5ED29C]">.</span></h1>
        <p>By dropping off hardware at ACCNO SOLUTION or booking an online repair ticket, you agree to our 90-Day Warranty terms, diagnostic checkup procedures, and invoice settlement policies.</p>
      </section>
      <Footer />
    </main>
  );
}
