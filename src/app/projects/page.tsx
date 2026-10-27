'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { Layers, Server, Wifi, ShieldCheck, Wrench, ArrowRight, CheckCircle2, Sparkles, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'software' | 'hardware' | 'networking' | 'cctv' | 'amc'>('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projectsList = [
    {
      id: 'p-1',
      category: 'software',
      badge: 'Software ERP',
      title: 'Custom Repair Shop ERP & POS Counter System',
      desc: 'Complete repair ticket barcode tracking, POS counter billing, GST calculation, and inventory management software.',
      tech: 'Next.js, Node.js, Supabase PostgreSQL, JWT',
      client: 'Multi-location Repair Centers & Retailers',
    },
    {
      id: 'p-2',
      category: 'hardware',
      badge: 'Hardware',
      title: 'Our own trusted store where you can make purchases.',
      desc: 'You can also make purchases from our store; we also build custom PCs and gaming PCs.',
      tech: 'BGA Reballing Station, Thermal Imager, Oscilloscope',
      client: 'Enterprise & Individual Mac Owners',
    },
    {
      id: 'p-3',
      category: 'networking',
      badge: 'Networking',
      title: 'Cat6 Fiber Optic & Cisco Network Infrastructure',
      desc: 'Structured Gigabit cabling, Cisco switch VLAN layout, MikroTik load balancing, and mesh Wi-Fi.',
      tech: 'Cat6 Fiber, Cisco Catalyst, MikroTik RouterOS',
      client: 'Hotels, Hospitals & Corporate Offices',
    },
    {
      id: 'p-4',
      category: 'cctv',
      badge: 'CCTV Security',
      title: '4K IP Camera & 32-Channel NVR Security Network',
      desc: 'Night-vision 4K IP cameras, 30-day continuous DVR recording, and secure mobile view setup.',
      tech: 'Hikvision 4K IP, PoE Switches, RAID NVR',
      client: 'Hospitality & Commercial Establishments',
    },
    {
      id: 'p-5',
      category: 'amc',
      badge: 'AMC Contract',
      title: 'Corporate Office Hardware Maintenance AMC',
      desc: 'Quarterly preventive maintenance visits, standby PCs, OS cleanup, and 2-hour SLA response.',
      tech: 'Resident Engineers, Remote Desktop Support',
      client: 'Schools, Financial Institutions & Call Centers',
    },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projectsList
    : projectsList.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Service Portfolio & Projects
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            OUR PROJECTS & SERVICES<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-4">
            From precision micro-soldering to enterprise server deployment & repair ERP software. Explore our flagship projects.
          </p>
        </motion.div>

        {/* Filter Category Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {(['all', 'software', 'hardware', 'networking', 'cctv', 'amc'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{p.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-6">{p.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-[10px] text-white/40 font-mono mb-3">Tech: {p.tech}</div>
                  {p.id === 'p-1' ? (
                    <Link
                      href="/services/repair-shop-erp"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#16FFC6] hover:text-[#5ED29C] uppercase tracking-wider"
                    >
                      View Project Details & Live Calculator <Eye className="w-3.5 h-3.5" />
                    </Link>
                  ) : p.id === 'p-2' ? (
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#5ED29C] hover:text-[#16FFC6] uppercase tracking-wider"
                    >
                      Our Trusted Store <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : p.id === 'p-3' ? (
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#5ED29C] hover:text-[#16FFC6] uppercase tracking-wider"
                    >
                      View Project Details <Eye className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#5ED29C] hover:text-[#16FFC6] uppercase tracking-wider"
                    >
                      View Project Details <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal: Project Details */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-3xl border border-[#5ED29C]/40 max-w-lg w-full relative space-y-4"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs font-mono text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                {selectedProject.badge}
              </span>
              <h2 className="text-xl font-extrabold text-white">{selectedProject.title}</h2>
              <p className="text-xs text-white/70 leading-relaxed">{selectedProject.desc}</p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div>
                  <span className="text-white/50 block">Target Client Base</span>
                  <span className="text-white font-medium">{selectedProject.client}</span>
                </div>
                <div>
                  <span className="text-white/50 block">Stack & Hardware Used</span>
                  <span className="text-[#5ED29C] font-mono">{selectedProject.tech}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                {selectedProject.id === 'p-1' && (
                  <Link
                    href="/services/repair-shop-erp"
                    className="px-4 py-2.5 rounded-xl bg-[#16FFC6]/10 border border-[#16FFC6]/40 text-[#16FFC6] font-bold text-xs uppercase"
                  >
                    Open Live Quote Calculator
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase"
                >
                  Inquire For Your Business
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
}
