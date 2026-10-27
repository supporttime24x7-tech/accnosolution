import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import {
  ServicesGridSection,
  RepairProcessSection,
  StatsSection,
  BrandsWeRepairSection,
  FaqAccordionSection,
  CtaSection,
  Footer,
} from '@/components/home/Sections';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <Hero />
      <StatsSection />
      <ServicesGridSection />
      <RepairProcessSection />
      <BrandsWeRepairSection />
      <FaqAccordionSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
