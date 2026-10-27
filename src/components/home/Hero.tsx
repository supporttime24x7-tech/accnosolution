'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Sparkles, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useErpStore } from '@/lib/store';

export const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [ticketIndex, setTicketIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tickets = useErpStore((state) => state.tickets);
  const repairInvoices = useErpStore((state) => state.repairInvoices);

  // Filter out tickets that have already been converted into repair bills / invoices
  const unbilledTickets = tickets.filter((t) => {
    if (t.status === 'delivered') return false;
    if (t.invoiceId) return false;
    const isBilled = repairInvoices.some(
      (inv) => inv.ticketId === t.id || inv.ticketNumber === t.ticket_number
    );
    return !isBilled;
  });

  const availableTickets = unbilledTickets.length > 0 ? unbilledTickets : tickets;

  // Dynamically select active unbilled repair ticket after mount to prevent hydration mismatch
  const activeTicket = mounted && availableTickets.length > 0
    ? availableTickets[ticketIndex % availableTickets.length]
    : (tickets[0] || null);

  const activeTicketDeviceName = activeTicket
    ? (activeTicket.brand ? `${activeTicket.brand} ${activeTicket.model || activeTicket.device_type}` : activeTicket.device_type)
    : '';

  const handlePrevTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (availableTickets.length === 0) return;
    setTicketIndex((prev) => (prev > 0 ? prev - 1 : availableTickets.length - 1));
  };

  const handleNextTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (availableTickets.length === 0) return;
    setTicketIndex((prev) => (prev + 1) % availableTickets.length);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: any = null;
    const streamUrl = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

    import('hls.js')
      .then((module) => {
        const Hls = module.default;
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: false });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(() => {});
          });
        }
      })
      .catch((err) => {
        console.warn('Safe HLS video stream error suppression:', err);
      });

    return () => {
      if (hlsInstance) {
        try {
          hlsInstance.destroy();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#070B0A] overflow-hidden flex items-center pt-28 sm:pt-32 pb-16">
      {/* 1. Background Video Player */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-60 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Left Gradient Overlay: #070b0a -> Transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/75 to-transparent z-10" />
        {/* Bottom Gradient: Black -> Transparent */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
      </div>

      {/* 2. Desktop Grid Guidelines (3 Vertical Lines at 25%, 50%, 75% width, opacity 10%) */}
      <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full max-w-7xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/10" />
          <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/10" />
          <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/10" />
        </div>
      </div>

      {/* 3. SVG Glow: Center Top Large Horizontal Ellipse (Cyan + Dark Green, Blur 25px, Blend Mode Screen) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <svg
          width="800"
          height="400"
          viewBox="0 0 800 400"
          fill="none"
          className="glow-ellipse opacity-80"
        >
          <ellipse
            cx="400"
            cy="100"
            rx="350"
            ry="120"
            fill="url(#glowGradient)"
          />
          <defs>
            <radialGradient
              id="glowGradient"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(400 100) scale(350 120)"
            >
              <stop offset="0%" stopColor="#16FFC6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#5ED29C" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#070B0A" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Main Typography & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Eyebrow: Certified Computer & Mac Repair Desk (Plus Jakarta Sans Bold 11px #5ED29C) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5ED29C]" />
              <span className="font-jakarta font-bold text-[11px] text-[#5ED29C] uppercase tracking-wider">
                Certified Computer & Mac Repair Desk
              </span>
            </div>

            {/* Main Headline: EXPERT COMPUTER & MAC REPAIR. (Inter Extra Bold, 40px mobile / 72px desktop, tracking tight, green period) */}
            <h1 className="font-sans font-extrabold text-[40px] sm:text-[56px] lg:text-[72px] uppercase leading-[0.95] tracking-tight text-white">
              EXPERT COMPUTER & MAC REPAIR<span className="text-[#5ED29C]">.</span>
            </h1>

            {/* Description: Max Width 512px, 14px, 70% White text */}
            <p className="max-w-[512px] text-[14px] text-white/70 font-normal leading-relaxed">
              Empowering individuals and enterprises with state-of-the-art computer repair, Apple Mac chip-level diagnostics, forensic data recovery, and custom business ERP deployment. Engineered for maximum reliability.
            </p>

            {/* CTA Button: Rounded Full, #5ED29C background, #070B0A text, Uppercase Bold, ArrowRight icon */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/book-repair"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#5ED29C]/25 hover:scale-105"
              >
                <span>BOOK REPAIR NOW</span>
                <ArrowRight className="w-4 h-4 text-[#070B0A] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/track-repair"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-all"
              >
                <Cpu className="w-4 h-4 text-[#5ED29C]" />
                Track Ticket Status
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex items-center gap-6 border-t border-white/10 text-white/60 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5ED29C]" />
                <span>90-Day Warranty</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div>Same-Day Onsite Diagnostic</div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div>100% Data Confidentiality</div>
            </div>
          </div>

          {/* Right Column - 4. Liquid Glass Floating Card Cluster & Brand Logo */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end self-stretch pt-6 sm:pt-10 lg:pt-14">
            
            {/* Unified Centered Stack pushed to the right edge */}
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              
              {/* Card Cluster - Symmetrically Centered Directly Above Logo */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] flex flex-col items-center">
              
              {/* Floating Liquid Glass Card (Fully functional, interactive link to services) */}
              <Link
                href="/services"
                className="liquid-glass-card animate-float w-[240px] flex flex-col justify-between p-5 text-left group cursor-pointer hover:border-[#5ED29C]/50 transition-all hover:scale-[1.02] shadow-2xl block"
              >
                {/* Top Badge: [ Since 2014 ] */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-mono text-[#5ED29C] font-semibold tracking-wider uppercase group-hover:text-[#16FFC6] transition-colors">
                    [ Since 2014 ]
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono hidden sm:inline">VERIFIED</span>
                    <div className="w-2 h-2 rounded-full bg-[#16FFC6] animate-pulse" />
                  </div>
                </div>

                {/* Center Headline: Serviced by Industry Experts */}
                <div className="my-1">
                  <h3 className="text-[18px] font-sans font-medium text-white leading-tight">
                    Serviced by{' '}
                    <span className="font-serifItalic italic font-normal text-[#5ED29C] text-[22px] group-hover:text-[#16FFC6] transition-colors">
                      Industry
                    </span>{' '}
                    Experts
                  </h3>
                  <p className="text-[11px] text-white/60 leading-snug mt-1">
                    Certified hardware engineers & enterprise software architects.
                  </p>
                </div>

                {/* Bottom Action: Clickable Service Link */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#5ED29C] font-semibold border-t border-white/10 group-hover:text-[#16FFC6] transition-colors">
                  <span>Explore 14+ Repair Desks</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Secondary Glass Panel (Centered overlapping card, fully interactive with live ticket tracking) */}
              {mounted && activeTicket && (
                <div className="w-full -mt-8 sm:-mt-10 z-20">
                  <Link 
                    href={`/track-repair?ticket=${activeTicket.ticket_number}`}
                    className="block p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#5ED29C]/50 shadow-2xl transition-all hover:scale-[1.02] group bg-[#070B0A]/90 backdrop-blur-xl cursor-pointer"
                    suppressHydrationWarning
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5ED29C] animate-pulse" />
                        <span className="text-xs text-white/60 uppercase font-semibold">Active Repair Ticket</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {availableTickets.length > 1 && (
                          <div className="flex items-center gap-1 mr-1">
                            <button
                              type="button"
                              onClick={handlePrevTicket}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                              title="Previous Active Ticket"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextTicket}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                              title="Next Active Ticket"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] bg-[#5ED29C]/20 text-[#5ED29C] px-2 py-0.5 rounded font-mono font-bold group-hover:bg-[#5ED29C]/30 transition-colors" suppressHydrationWarning>
                          #{activeTicket.ticket_number}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white group-hover:text-[#5ED29C] transition-colors line-clamp-1" suppressHydrationWarning>
                        {activeTicketDeviceName}
                      </div>
                      <span className="text-[10px] text-[#5ED29C] flex items-center gap-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Track <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2.5 overflow-hidden">
                      <div
                        className="bg-[#5ED29C] h-full transition-all duration-500"
                        style={{ width: `${activeTicket.progressPercentage ?? (activeTicket.status === 'in_progress' ? 78 : 50)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/60 mt-1.5" suppressHydrationWarning>
                      <span className="line-clamp-1 max-w-[150px]">{activeTicket.problem_reported}</span>
                      <span className="text-[#5ED29C] font-semibold">{activeTicket.progressPercentage ?? (activeTicket.status === 'in_progress' ? 78 : 50)}% Complete</span>
                    </div>
                  </Link>
                </div>
              )}

            </div>

            {/* Official Brand Logo - Centered Directly Below the Card Cluster */}
            <div className="w-full flex justify-center">
              <Link
                href="/about"
                className="relative group block transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="/logo.png"
                  alt="ACCNO SOLUTION - I.T. Done Right"
                  className="h-24 sm:h-28 lg:h-32 xl:h-36 w-auto max-w-[90vw] sm:max-w-none object-contain transition-all duration-300 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] group-hover:brightness-110"
                />
              </Link>
            </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
