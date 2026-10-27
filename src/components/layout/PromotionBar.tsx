'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErpStore, WebsitePromotionBar } from '@/lib/store';

export const PromotionBar: React.FC<{
  forcePreview?: boolean;
  overridePromo?: Partial<WebsitePromotionBar>;
}> = ({ forcePreview = false, overridePromo }) => {
  const [mounted, setMounted] = useState(false);
  const websitePromotionBar = useErpStore((state) => state.websitePromotionBar);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted && !forcePreview) {
    return null;
  }

  const basePromo = websitePromotionBar || {
    isEnabled: true,
    text: '⚡ SPECIAL OFFER: Get Up to 20% OFF on Laptop & Apple Mac Chip-Level Repairs! Free Pick & Drop Across Jammu.',
    badgeText: 'LIMITED TIME OFFER',
    actionText: 'Book Repair Now →',
    actionLink: '/book-repair',
    theme: 'emerald',
    isDismissible: false,
  };

  const promo = overridePromo ? { ...basePromo, ...overridePromo } : basePromo;

  if (!promo.isEnabled && !forcePreview) {
    return null;
  }

  const themeStyles: Record<string, { bar: string; badge: string; dot: string; text: string; button: string }> = {
    emerald: {
      bar: 'bg-gradient-to-r from-[#031A11] via-[#072B1E] to-[#031A11] border-b border-[#5ED29C]/30 shadow-[0_4px_25px_rgba(94,210,156,0.15)]',
      badge: 'bg-[#5ED29C]/15 border-[#5ED29C]/40 text-[#5ED29C]',
      dot: 'bg-[#16FFC6]',
      text: 'text-white/95',
      button: 'bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] shadow-md shadow-[#5ED29C]/20',
    },
    cyan: {
      bar: 'bg-gradient-to-r from-[#031826] via-[#06283D] to-[#031826] border-b border-cyan-400/30 shadow-[0_4px_25px_rgba(56,189,248,0.15)]',
      badge: 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300',
      dot: 'bg-cyan-300',
      text: 'text-white/95',
      button: 'bg-cyan-400 hover:bg-cyan-300 text-[#070B0A] shadow-md shadow-cyan-400/20',
    },
    amber: {
      bar: 'bg-gradient-to-r from-[#241302] via-[#381F04] to-[#241302] border-b border-amber-400/30 shadow-[0_4px_25px_rgba(251,191,36,0.15)]',
      badge: 'bg-amber-400/15 border-amber-400/40 text-amber-300',
      dot: 'bg-amber-300',
      text: 'text-white/95',
      button: 'bg-amber-400 hover:bg-amber-300 text-[#070B0A] shadow-md shadow-amber-400/20',
    },
    purple: {
      bar: 'bg-gradient-to-r from-[#1A0426] via-[#2D0940] to-[#1A0426] border-b border-purple-400/30 shadow-[0_4px_25px_rgba(192,132,252,0.15)]',
      badge: 'bg-purple-400/15 border-purple-400/40 text-purple-300',
      dot: 'bg-purple-300',
      text: 'text-white/95',
      button: 'bg-purple-400 hover:bg-purple-300 text-[#070B0A] shadow-md shadow-purple-400/20',
    },
    rose: {
      bar: 'bg-gradient-to-r from-[#24040D] via-[#3B0715] to-[#24040D] border-b border-rose-400/30 shadow-[0_4px_25px_rgba(251,113,133,0.15)]',
      badge: 'bg-rose-400/15 border-rose-400/40 text-rose-300',
      dot: 'bg-rose-300',
      text: 'text-white/95',
      button: 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20',
    },
  };

  const currentTheme = themeStyles[promo.theme] || themeStyles.emerald;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`relative w-full z-[60] overflow-hidden text-xs py-2 px-3 sm:px-6 transition-colors duration-300 ${currentTheme.bar}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          {/* Centered Content */}
          <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
            {/* Live Indicator Badge */}
            {promo.badgeText && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${currentTheme.badge}`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentTheme.dot}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentTheme.dot}`}
                  />
                </span>
                {promo.badgeText}
              </span>
            )}

            {/* Promo Announcement Text */}
            <span className={`font-semibold tracking-wide text-[11px] sm:text-xs ${currentTheme.text}`}>
              {promo.text}
            </span>

            {/* Call to Action Button */}
            {promo.actionText && promo.actionLink && (
              <Link
                href={promo.actionLink}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${currentTheme.button}`}
              >
                <span>{promo.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
