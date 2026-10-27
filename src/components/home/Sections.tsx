'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Laptop, HardDrive, ShieldAlert, Cpu, Wrench, Wifi, Server, Monitor,
  Sparkles, CheckCircle2, ChevronDown, ArrowRight, Star, Clock, UserCheck,
  Building2, Phone, Mail, MapPin, Award, Layers, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AccnoLogo } from '@/components/common/AccnoLogo';
import { useErpStore } from '@/lib/store';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Laptop,
  Cpu,
  HardDrive,
  ShieldAlert,
  Wifi,
  Server,
  Monitor,
  Layers,
  Wrench,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  Building2,
  CreditCard,
};

// ============================================================================
// 1. SERVICES GRID SECTION
// ============================================================================
export const ServicesGridSection: React.FC = () => {
  const { enterpriseSolutions = [] } = useErpStore();

  const services = enterpriseSolutions.map((item) => ({
    icon: (item.iconName && ICON_MAP[item.iconName]) ? ICON_MAP[item.iconName] : Wrench,
    title: item.title,
    desc: item.desc,
    link: item.link || '/repairs',
    badge: item.badge || 'Service',
  }));

  return (
    <section className="py-24 bg-[#070B0A] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5" />
            Complete Service Portfolio
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            ENTERPRISE IT & REPAIR SOLUTIONS<span className="text-[#5ED29C]">.</span>
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base">
            From precision micro-soldering to enterprise server architecture, ACCNO SOLUTION delivers unparalleled technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/20 px-2.5 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5ED29C]/20 to-[#16FFC6]/10 border border-[#5ED29C]/30 flex items-center justify-center text-[#5ED29C] mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#5ED29C] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#5ED29C] hover:text-[#16FFC6] transition-colors uppercase tracking-wider"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 2. REPAIR PROCESS SECTION (4 STEPS)
// ============================================================================
export const RepairProcessSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { repairProcessSteps = [] } = useErpStore();

  const defaultSteps = [
    { id: '1', step: '01', title: 'Free Diagnostic & Job Card', desc: 'Bring your device or request onsite pick-up. We issue a digital job card with barcode & transparent initial checkup.' },
    { id: '2', step: '02', title: 'Engineer Diagnosis & Quote', desc: 'Our certified engineers inspect hardware circuits and provide an exact cost estimate & turnaround timeline for approval.' },
    { id: '3', step: '03', title: 'Precision Micro-Repair', desc: 'Components are repaired using cleanroom ESD workstations, genuine spare parts, and strict QA bench testing.' },
    { id: '4', step: '04', title: 'Delivery & 90-Day Warranty', desc: 'Receive instant WhatsApp/SMS notification, inspect your device live, download GST invoice, and enjoy 90 days warranty.' },
  ];

  const activeSteps = mounted && repairProcessSteps.length > 0 ? repairProcessSteps : defaultSteps;

  return (
    <section className="py-24 bg-[#0D1117] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[#5ED29C] text-xs font-bold uppercase tracking-widest">
              Standard Operating Procedure
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white mt-2">
              OUR 4-STEP REPAIR PROCESS<span className="text-[#5ED29C]">.</span>
            </h2>
          </div>
          <p className="text-white/60 text-sm max-w-md mt-4 md:mt-0">
            Streamlined workflow backed by real-time customer tracking and automated status updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeSteps.map((step: any, idx: number) => (
            <div
              key={step.id || step.step}
              className="glass-panel p-6 rounded-2xl relative border-l-2 border-l-[#5ED29C] flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-4xl font-extrabold text-[#5ED29C]/30 mb-4 block">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[10px] text-[#5ED29C] font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Step {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 3. STATS SECTION
// ============================================================================
export const StatsSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { achievementStats = [] } = useErpStore();

  const defaultStats = [
    { id: '1', label: 'Repairs Completed', value: '45,000+' },
    { id: '2', label: 'Data Recovery Success', value: '98.6%' },
    { id: '3', label: 'Corporate AMC Clients', value: '180+' },
    { id: '4', label: 'Certified Engineers', value: '15+' },
  ];

  const activeStats = mounted && achievementStats.length > 0 ? achievementStats : defaultStats;

  return (
    <section className="py-16 bg-[#070B0A] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {activeStats.map((stat: any) => (
            <div
              key={stat.id || stat.label}
              className="glass-panel p-8 rounded-2xl text-center border border-white/10 hover:border-[#5ED29C]/40 transition-all"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-[#5ED29C] font-mono mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase text-white/70 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 4. BRANDS WE REPAIR
// ============================================================================
export const BrandsWeRepairSection: React.FC = () => {
  const brands = [
    'Apple (MacBook / iMac)', 'Dell Enterprise', 'HP Pavilion & EliteBook',
    'Lenovo ThinkPad', 'ASUS ROG & ZenBook', 'Acer Predator', 'Epson Printers',
    'Seagate / Western Digital', 'Hikvision CCTV', 'Cisco Systems'
  ];

  return (
    <section className="py-16 bg-[#070B0A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-8">
          Authorized Out-of-Warranty Repair Facility For Major OEM Brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {brands.map((b) => (
            <span
              key={b}
              className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm font-semibold text-white/80 hover:text-[#5ED29C] hover:border-[#5ED29C]/30 transition-all"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 5. FAQ ACCORDION SECTION
// ============================================================================
export const FaqAccordionSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I track my repair ticket status live?',
      a: 'You can enter your Ticket Number (e.g. ACC-2025-8801) or Mobile Number on our "Track Repair" page or Customer Portal. You will see real-time technician notes, diagnosis results, and estimated delivery dates.',
    },
    {
      q: 'What warranty is provided on hardware repairs & replaced parts?',
      a: 'ACCNO SOLUTION provides a standard 90-Day Warranty on chip-level repair work and up to 1-Year replacement warranty on OEM spare parts (screens, batteries, SSDs, keyboards).',
    },
    {
      q: 'How does the Forensic Data Recovery process work?',
      a: 'Dead or corrupted drives are inspected under cleanroom protocol. We provide a file list preview before you pay. You only pay if your critical files are successfully recovered.',
    },
    {
      q: 'Do you offer onsite laptop & computer repair for businesses?',
      a: 'Yes, our certified field technicians provide same-day onsite troubleshooting for corporate offices, AMC clients, and home users across the region.',
    },
    {
      q: 'What is included in the ACCNO Business ERP software?',
      a: 'Our ERP system includes Repair Ticket barcode tracking, Job Card generation, Inventory management with IMEI/Serial tracking, POS counter billing, Vendor Purchases, GST compliance, and Customer Portals.',
    },
  ];

  return (
    <section className="py-24 bg-[#0D1117] border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#5ED29C] text-xs font-bold uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white mt-2">
            FREQUENTLY ASKED QUESTIONS<span className="text-[#5ED29C]">.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold text-sm sm:text-base hover:text-[#5ED29C] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#5ED29C] transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 6. CALL TO ACTION (CTA) SECTION
// ============================================================================
export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#070B0A] via-[#0D1117] to-[#070B0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-[#5ED29C]/30 relative shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            READY TO REPAIR OR UPGRADE YOUR IT INFRASTRUCTURE<span className="text-[#5ED29C]">?</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            Contact our engineering desk today for an instant estimate, or launch our Business ERP system to streamline your own repair center.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book-repair"
              className="px-8 py-4 rounded-full bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#5ED29C]/30 hover:scale-105"
            >
              Book Repair Online
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Contact Sales & Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 7. FOOTER COMPONENT
// ============================================================================
export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070B0A] border-t border-white/10 pt-16 pb-12 text-white/70 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <AccnoLogo height={48} showTagline={true} />
            </Link>
            <p className="text-white/60 leading-relaxed">
              Sanchore’s premier computer repair, Apple Mac micro-soldering, cleanroom data recovery, and custom ERP solution provider.
            </p>
            <div className="flex items-center space-x-3 text-white/50">
              <Phone className="w-4 h-4 text-[#5ED29C]" />
              <span>+91 80900 20060 / +91 2979 357020</span>
            </div>
            <div className="flex items-center space-x-3 text-white/50">
              <Mail className="w-4 h-4 text-[#5ED29C]" />
              <span>support@accnosolution.com</span>
            </div>
            <div className="flex items-start space-x-3 text-white/50">
              <MapPin className="w-4 h-4 text-[#5ED29C] shrink-0 mt-0.5" />
              <span>80, Choudhary Dharmshala, Above Vijay Laxmi Medical Agency, Indira Chowk, Sanchore, Rajasthan 343041</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Repair Services</h4>
            <ul className="space-y-2.5">
              <li><Link href="/repairs" className="hover:text-[#5ED29C] transition-colors">Laptop & Desktop Repair</Link></li>
              <li><Link href="/repairs" className="hover:text-[#5ED29C] transition-colors">MacBook Logic Board Repair</Link></li>
              <li><Link href="/data-recovery" className="hover:text-[#5ED29C] transition-colors">Cleanroom Data Recovery</Link></li>
              <li><Link href="/repairs" className="hover:text-[#5ED29C] transition-colors">Printer & Scanner Repair</Link></li>
              <li><Link href="/corporate" className="hover:text-[#5ED29C] transition-colors">CCTV & DVR Networking</Link></li>
              <li><Link href="/products" className="hover:text-[#5ED29C] transition-colors">Custom Gaming PC Assembly</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Corporate & ERP</h4>
            <ul className="space-y-2.5">
              <li><Link href="/amc" className="hover:text-[#5ED29C] transition-colors">Annual Maintenance Contract (AMC)</Link></li>
              <li><Link href="/corporate" className="hover:text-[#5ED29C] transition-colors">Business ERP Solutions</Link></li>
              <li><Link href="/services" className="hover:text-[#5ED29C] transition-colors">POS & Billing Counter Solutions</Link></li>
              <li><Link href="/corporate" className="hover:text-[#5ED29C] transition-colors">IT Consulting & Software Setup</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="hover:text-[#5ED29C] transition-colors">About ACCNO SOLUTION</Link></li>
              <li><Link href="/track-repair" className="hover:text-[#5ED29C] transition-colors">Track Repair Ticket Status</Link></li>
              <li><Link href="/book-repair" className="hover:text-[#5ED29C] transition-colors">Book Repair Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#5ED29C] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#5ED29C] transition-colors">Terms of Service</Link></li>
              <li><Link href="/careers" className="hover:text-[#5ED29C] transition-colors">Careers & Hiring</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-white/50 text-[11px]">
          <p>© 2026 ACCNO SOLUTION. Built with Next.js & React 19.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-[#5ED29C] font-semibold">GSTIN: 08CAUPK8462J2ZT</span>
            <span>|</span>
            <span>All rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
