import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, FaqAccordionSection } from '@/components/home/Sections';

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <div className="pt-32">
        <FaqAccordionSection />
      </div>
      <Footer />
    </main>
  );
}
