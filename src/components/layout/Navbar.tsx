'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, X, Search, ChevronDown, ChevronRight, User, Monitor, Laptop,
  Cpu, Smartphone, Printer, HardDrive, Server, Layers, ShieldCheck,
  Wifi, Gamepad2, Package, Wrench, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccnoLogo } from '@/components/common/AccnoLogo';
import { useErpStore } from '@/lib/store';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { PromotionBar } from './PromotionBar';

export const Navbar: React.FC = () => {
  const { websiteCart = [] } = useErpStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'REPAIRS' | 'PROJECTS' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});

  const cartItemsCount = websiteCart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdownMenus = {
    REPAIRS: [
      { name: 'Desktop Repair', desc: 'Motherboard recapping, SMPS power & GPU diagnostics', href: '/repairs', icon: Monitor },
      { name: 'Laptop Repair', desc: 'Screen replacement, keyboard fix & liquid damage restoration', href: '/repairs', icon: Laptop },
      { name: 'Apple Mac & MacBook Repair', desc: 'Logic board micro-soldering & M1/M2/M3 chip repair', href: '/repairs', icon: Cpu },
      { name: 'Phone & Tablet Repair', desc: 'Glass screen replacement, battery & charging port fix', href: '/repairs', icon: Smartphone },
      { name: 'Printer & Scanner Repair', desc: 'Epson/Canon head cleaning & toner roller overhaul', href: '/repairs', icon: Printer },
      { name: 'Forensic Data Recovery', desc: 'Class-100 cleanroom data extraction from dead drives', href: '/data-recovery', icon: HardDrive },
    ],
    PROJECTS: [
      { name: 'Software & ERP Systems', desc: 'Custom Marg ERP, Logic ERP & cloud repair shop ERP', href: '/services', icon: Layers },
      { name: 'Hardware Infrastructure', desc: 'Enterprise server deployment & corporate IT auditing', href: '/corporate', icon: Server },
      { name: 'Networking & Fiber Cabling', desc: 'Cat6 cabling, Cisco routers & Wi-Fi mesh setups', href: '/networking', icon: Wifi },
      { name: 'CCTV & Security Surveillance', desc: '4K IP cameras, DVR/NVR setup & mobile viewing', href: '/corporate', icon: ShieldCheck },
      { name: 'AMC Maintenance Contracts', desc: 'Quarterly preventive upkeep for corporate offices', href: '/amc', icon: Wrench },
    ],
  };

  const toggleMobileExpand = (name: string) => {
    setMobileExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#070B0A]/95 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'bg-[#070B0A]/85 backdrop-blur-sm border-b border-white/5'
        }`}
      >
        <PromotionBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Official ACCNO SOLUTION Brand Logo Image */}
          <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02]">
            <AccnoLogo height={54} showTagline={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              HOME
            </Link>

            <Link
              href="/about"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              ABOUT
            </Link>

            <Link
              href="/repairs"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              REPAIRS
            </Link>

            {/* Link: PROJECTS */}
            <Link
              href="/projects"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              PROJECTS
            </Link>

            {/* Link: SERVICES */}
            <Link
              href="/services"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              SERVICES
            </Link>

            {/* Direct Link: SHOP */}
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#16FFC6] hover:text-[#5ED29C] transition-colors"
            >
              SHOP
            </Link>

            <Link
              href="/blog"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              BLOG
            </Link>

            <Link
              href="/contact"
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#5ED29C] transition-colors"
            >
              CONTACT
            </Link>
          </nav>

          {/* Action Buttons: Shopping Cart, Track Repair & Sign In */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#16FFC6]/50 transition-all group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#16FFC6] group-hover:scale-110 transition-transform" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16FFC6] text-[#070B0A] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#070B0A]">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <Link
              href="/track-repair"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#5ED29C]" />
              <span>Track Status</span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle & Cart */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              <ShoppingBag className="w-5 h-5 text-[#16FFC6]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16FFC6] text-[#070B0A] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#5ED29C]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Fullscreen Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#070B0A] pt-28 px-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                HOME
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                ABOUT
              </Link>
              <Link
                href="/repairs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                REPAIRS
              </Link>
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                PROJECTS
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                SERVICES
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-extrabold text-[#16FFC6] border-b border-white/5 pb-2"
              >
                SHOP
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                BLOG
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white/80 border-b border-white/5 pb-2"
              >
                CONTACT
              </Link>
              <Link
                href="/track-repair"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-[#5ED29C] border-b border-white/5 pb-2 flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Track Repair Status
              </Link>

              <div className="pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-sm uppercase text-center block"
                >
                  SIGN IN TO PORTAL
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
