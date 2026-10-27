import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import Link from 'next/link';

export default function CareersPage() {
  const jobs = [
    { title: 'Senior Apple Mac Micro-Soldering Specialist', location: 'Jammu Bench', type: 'Full-time' },
    { title: 'Forensic Data Recovery Cleanroom Engineer', location: 'Jammu Lab', type: 'Full-time' },
    { title: 'Full Stack Node.js / React Software Engineer', location: 'Jammu / Hybrid', type: 'Full-time' },
  ];

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />
      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#5ED29C] font-bold uppercase text-xs tracking-wider">Join Our Engineering Team</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase mt-2">CAREERS AT ACCNO SOLUTION<span className="text-[#5ED29C]">.</span></h1>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {jobs.map((j) => (
            <div key={j.title} className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{j.title}</h3>
                <p className="text-xs text-white/50">{j.location} • {j.type}</p>
              </div>
              <Link href="/contact" className="px-4 py-2 bg-[#5ED29C] text-[#070B0A] font-bold text-xs uppercase rounded-lg">
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
