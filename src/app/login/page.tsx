'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, User, ArrowRight, Wrench, Package,
  CreditCard, BarChart3, Mouse, Keyboard, Monitor, Cpu, Printer,
  Camera, HardDrive, Wifi, Smartphone, Laptop, ShieldCheck, Sparkles,
  AlertTriangle, ShieldAlert, KeyRound, Info, CheckCircle2
} from 'lucide-react';
import { useErpStore } from '@/lib/store';
import { AccnoLogo } from '@/components/common/AccnoLogo';

// Expanded Background Floating Tech Icons Configuration (36 Icons)
const floatingTechIcons = [
  // Mice
  { Icon: Mouse, left: '5%', top: '12%', size: 22, duration: 18, delay: 0 },
  { Icon: Mouse, left: '48%', top: '18%', size: 20, duration: 21, delay: 2 },
  { Icon: Mouse, left: '88%', top: '72%', size: 24, duration: 19, delay: 1 },

  // Keyboards
  { Icon: Keyboard, left: '82%', top: '8%', size: 24, duration: 22, delay: 2 },
  { Icon: Keyboard, left: '28%', top: '85%', size: 22, duration: 20, delay: 4 },
  { Icon: Keyboard, left: '65%', top: '92%', size: 22, duration: 23, delay: 1.5 },

  // Monitors
  { Icon: Monitor, left: '12%', top: '72%', size: 26, duration: 20, delay: 1 },
  { Icon: Monitor, left: '92%', top: '25%', size: 24, duration: 19, delay: 3 },
  { Icon: Monitor, left: '38%', top: '6%', size: 22, duration: 24, delay: 0.5 },

  // Processors / CPUs
  { Icon: Cpu, left: '76%', top: '78%', size: 26, duration: 19, delay: 3 },
  { Icon: Cpu, left: '18%', top: '38%', size: 22, duration: 21, delay: 1.2 },
  { Icon: Cpu, left: '52%', top: '82%', size: 24, duration: 18, delay: 2.5 },

  // Printers
  { Icon: Printer, left: '42%', top: '92%', size: 22, duration: 24, delay: 4 },
  { Icon: Printer, left: '85%', top: '40%', size: 24, duration: 22, delay: 2.8 },
  { Icon: Printer, left: '8%', top: '88%', size: 20, duration: 20, delay: 1.7 },

  // CCTV / Cameras
  { Icon: Camera, left: '88%', top: '55%', size: 22, duration: 21, delay: 2 },
  { Icon: Camera, left: '22%', top: '8%', size: 20, duration: 23, delay: 0.8 },
  { Icon: Camera, left: '62%', top: '75%', size: 24, duration: 19, delay: 3.2 },

  // Hard Drives
  { Icon: HardDrive, left: '3%', top: '48%', size: 22, duration: 23, delay: 5 },
  { Icon: HardDrive, left: '72%', top: '32%', size: 22, duration: 20, delay: 1.1 },
  { Icon: HardDrive, left: '45%', top: '68%', size: 20, duration: 25, delay: 3.5 },

  // WiFi
  { Icon: Wifi, left: '62%', top: '6%', size: 20, duration: 17, delay: 1.5 },
  { Icon: Wifi, left: '15%', top: '55%', size: 22, duration: 19, delay: 4.2 },
  { Icon: Wifi, left: '78%', top: '62%', size: 20, duration: 21, delay: 2.1 },

  // Smartphones
  { Icon: Smartphone, left: '32%', top: '12%', size: 20, duration: 25, delay: 3 },
  { Icon: Smartphone, left: '95%', top: '90%', size: 18, duration: 22, delay: 1.4 },
  { Icon: Smartphone, left: '2%', top: '28%', size: 20, duration: 20, delay: 2.9 },

  // Laptops
  { Icon: Laptop, left: '94%', top: '78%', size: 24, duration: 19, delay: 0.5 },
  { Icon: Laptop, left: '25%', top: '65%', size: 22, duration: 23, delay: 3.8 },
  { Icon: Laptop, left: '70%', top: '15%', size: 22, duration: 21, delay: 1.9 },

  // Security Shields & Extras
  { Icon: ShieldCheck, left: '22%', top: '95%', size: 22, duration: 21, delay: 2.5 },
  { Icon: ShieldCheck, left: '58%', top: '45%', size: 20, duration: 24, delay: 0.7 },
  { Icon: Wrench, left: '10%', top: '22%', size: 20, duration: 18, delay: 3.1 },
  { Icon: Package, left: '80%', top: '22%', size: 22, duration: 22, delay: 2.4 },
  { Icon: CreditCard, left: '35%', top: '75%', size: 20, duration: 20, delay: 1.8 },
  { Icon: BarChart3, left: '90%', top: '6%', size: 22, duration: 23, delay: 4.0 },
];

// High-density Stardust particles array (120 particles)
const stardustParticles = Array.from({ length: 120 }).map((_, i) => ({
  id: i,
  left: `${(i * 79.3) % 100}%`,
  top: `${(i * 47.7) % 100}%`,
  size: (i % 4) + 1.2,
  duration: 3 + (i % 6),
  delay: (i % 8) * 0.4,
}));


export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectTarget, setRedirectTarget] = useState<string>('/erp/dashboard');
  const [showStaffGuide, setShowStaffGuide] = useState(false);
  
  const { setCurrentUser, employees } = useErpStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      const err = params.get('error');
      if (redirect && redirect.startsWith('/erp')) {
        setRedirectTarget(redirect);
      }
      if (err === 'session_required') {
        setErrorMessage('Authentication Required: Backend access is restricted. Please sign in with your verified Employee ID and password.');
      }
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanId = employeeId.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setErrorMessage('Please enter both your Employee ID (e.g. EMP-1001) and Password to sign in.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: cleanId,
          password: cleanPass,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.user) {
        const loggedUser = {
          name: data.data.user.name,
          role: data.data.user.role,
          email: data.data.user.email,
          department: data.data.user.department,
          designation: data.data.user.designation,
          empCode: data.data.user.empCode,
        };

        setCurrentUser(loggedUser);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('accno_erp_current_user', JSON.stringify(loggedUser));
          } catch (err) {
            console.error('Storage error:', err);
          }
          const destination = redirectTarget || data.data.redirectTo || '/erp/dashboard';
          window.location.href = destination;
        }
        return;
      }

      // Explicit authentication failure - strictly do NOT grant access
      setErrorMessage(data.error || 'Access Denied: Invalid Employee ID or Password. Verification failed.');
    } catch (err: any) {
      console.error('Authentication network error:', err);
      setErrorMessage('Security Network Error: Unable to verify credentials with server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050C0A] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden overflow-y-auto select-none">
      {/* 1. Ambient Animated Background Sweep Ribbons, Stars, Stardust & Floating Hardware Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Stardust Particles Layer */}
        {stardustParticles.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.9, 0.2, 0.8, 0.1],
              scale: [0.8, 1.4, 0.9, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
            className="absolute rounded-full bg-[#28D08B] shadow-[0_0_8px_rgba(40,208,139,0.8)]"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}

        {/* Floating Twinkling Stars */}
        {[
          { left: '18%', top: '22%', delay: 0 },
          { left: '72%', top: '18%', delay: 1.2 },
          { left: '85%', top: '65%', delay: 0.7 },
          { left: '35%', top: '82%', delay: 2.1 },
          { left: '55%', top: '25%', delay: 1.8 },
        ].map((sparkle, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: [0.6, 1.2, 0.6],
              opacity: [0.2, 1, 0.2],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: sparkle.delay,
            }}
            className="absolute text-[#16FFC6]/60"
            style={{ left: sparkle.left, top: sparkle.top }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ))}

        {/* Floating Hardware Icons (Mouse, Keyboard, Monitor, Processor, Printer, CCTV, etc.) */}
        {floatingTechIcons.map((item, idx) => {
          const IconComp = item.Icon;
          return (
            <motion.div
              key={idx}
              initial={{ y: 0, opacity: 0.15 }}
              animate={{
                y: [-12, 12, -12],
                rotate: [-8, 8, -8],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: item.delay,
              }}
              className="absolute text-[#28D08B]/30 hover:text-[#28D08B]/60 transition-colors pointer-events-none"
              style={{ left: item.left, top: item.top }}
            >
              <IconComp style={{ width: `${item.size}px`, height: `${item.size}px` }} />
            </motion.div>
          );
        })}

        {/* Top-Left Deep Emerald Corner Ribbon & Pulsing Glow */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-[radial-gradient(circle_at_top_left,rgba(40,208,139,0.25),transparent_65%)] blur-3xl"
        />
        <svg className="absolute -top-10 -left-10 w-[750px] h-[750px] opacity-45" viewBox="0 0 750 750" fill="none">
          <path d="M-100 280 C150 20, 420 300, 750 -80" stroke="url(#gradTop1)" strokeWidth="3.5" fill="none" />
          <path d="M-120 400 C180 100, 500 420, 750 60" stroke="url(#gradTop2)" strokeWidth="1.5" strokeDasharray="8 8" fill="none" />
          <defs>
            <linearGradient id="gradTop1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#28D08B" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#16FFC6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#28D08B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradTop2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16FFC6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#28D08B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom-Right Deep Emerald Corner Ribbon & Pulsing Glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-32 -right-32 w-[750px] h-[750px] bg-[radial-gradient(circle_at_bottom_right,rgba(40,208,139,0.22),transparent_65%)] blur-3xl"
        />
        <svg className="absolute -bottom-10 -right-10 w-[850px] h-[850px] opacity-40" viewBox="0 0 850 850" fill="none">
          <path d="M120 900 C450 600, 780 750, 900 350" stroke="url(#gradBot1)" strokeWidth="4" fill="none" />
          <path d="M-20 800 C350 480, 700 600, 900 200" stroke="url(#gradTop1)" strokeWidth="1.5" fill="none" />
          <defs>
            <linearGradient id="gradBot1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#28D08B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#16FFC6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle Micro-Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>


      {/* Main Grid Wrapper: Split 2-Columns */}
      <div className="relative z-20 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto">
        
        {/* LEFT COLUMN: Brand Showcase & Floating Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6 flex flex-col justify-center"
        >
          {/* Official ACCNO Logo Header */}
          <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
            <AccnoLogo height={54} showTagline={true} />
          </Link>

          {/* Headline & Subtext */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-none text-white">
              Welcome <span className="text-[#28D08B]">Back!</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-md leading-relaxed font-normal">
              Access your business portal and manage your operations with ease.
            </p>
          </div>

          {/* 4 Feature Items with Vertical Divider Lines */}
          <div className="flex items-center justify-between pt-1 max-w-lg">
            {/* Item 1: Repair Tickets */}
            <motion.div
              whileHover={{ y: -3 }}
              className="flex-1 flex flex-col items-center text-center px-1.5 space-y-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl border border-[#28D08B]/40 bg-[#28D08B]/10 text-[#28D08B] flex items-center justify-center shadow-[0_0_15px_rgba(40,208,139,0.15)]">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">Repair<br/>Tickets</span>
            </motion.div>

            <div className="w-[1px] h-9 bg-slate-700/50 shrink-0" />

            {/* Item 2: Inventory Management */}
            <motion.div
              whileHover={{ y: -3 }}
              className="flex-1 flex flex-col items-center text-center px-1.5 space-y-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl border border-[#28D08B]/40 bg-[#28D08B]/10 text-[#28D08B] flex items-center justify-center shadow-[0_0_15px_rgba(40,208,139,0.15)]">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">Inventory<br/>Management</span>
            </motion.div>

            <div className="w-[1px] h-9 bg-slate-700/50 shrink-0" />

            {/* Item 3: Billing & POS */}
            <motion.div
              whileHover={{ y: -3 }}
              className="flex-1 flex flex-col items-center text-center px-1.5 space-y-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl border border-[#28D08B]/40 bg-[#28D08B]/10 text-[#28D08B] flex items-center justify-center shadow-[0_0_15px_rgba(40,208,139,0.15)]">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">Billing &amp;<br/>POS</span>
            </motion.div>

            <div className="w-[1px] h-9 bg-slate-700/50 shrink-0" />

            {/* Item 4: Reports & Analytics */}
            <motion.div
              whileHover={{ y: -3 }}
              className="flex-1 flex flex-col items-center text-center px-1.5 space-y-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl border border-[#28D08B]/40 bg-[#28D08B]/10 text-[#28D08B] flex items-center justify-center shadow-[0_0_15px_rgba(40,208,139,0.15)]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">Reports &amp;<br/>Analytics</span>
            </motion.div>
          </div>

          {/* Floating High-Tech Hardware Bench Hero Image */}
          <div className="relative pt-2 flex flex-col items-start space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-lg relative group"
            >
              <img
                src="/images/login-tech-hero.png"
                alt="Accno Hardware & Micro-Soldering Bench Workstation"
                className="w-full h-auto object-contain transform group-hover:scale-102 transition-transform duration-700 drop-shadow-[0_12px_35px_rgba(40,208,139,0.3)]"
              />
            </motion.div>

            {/* Neat Cursive Handwriting Tagline Accent */}
            <div className="pl-1 pt-1">
              <span className="font-cursive text-3xl sm:text-[32px] text-white/90 tracking-wide block font-semibold">
                Your <span className="text-[#28D08B] relative inline-block font-bold">
                  Technology Partner
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-[#FF3B30]"
                    viewBox="0 0 170 10"
                    fill="none"
                  >
                    <path d="M2 7 C 45 2, 125 2, 168 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </motion.svg>
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Glassmorphism Login Card with Entrance & Glow Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="w-full max-w-[440px] bg-[#081512]/90 p-8 sm:p-10 rounded-[28px] border border-[#28D08B]/35 shadow-[0_0_50px_rgba(40,208,139,0.15)] space-y-6 backdrop-blur-2xl relative overflow-hidden">
            
            {/* Centered ACCNO Logo Inside Card */}
            <div className="text-center space-y-3 flex flex-col items-center">
              <Link href="/" className="inline-flex items-center justify-center hover:opacity-90 transition-opacity mb-1">
                <AccnoLogo height={48} showTagline={true} />
              </Link>

              {/* Login Title with Pulsing Lock Icon */}
              <div className="flex items-center justify-center gap-2.5 pt-1">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-xl bg-[#28D08B]/15 border border-[#28D08B]/40 text-[#28D08B] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(40,208,139,0.2)]"
                >
                  <Lock className="w-4 h-4" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                  Login to <span className="text-[#28D08B]">Account</span>
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-normal">Enter your credentials to continue to your dashboard</p>
            </div>

            {/* Error Notification Alert Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-2.5 text-xs shadow-lg shadow-rose-950/30 overflow-hidden"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <p className="font-semibold text-rose-200">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Employee ID or Work Email Input */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
                  <KeyRound className="w-3.5 h-3.5 text-[#28D08B]" /> Employee ID or Work Email *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your Employee ID or Work Email"
                  className="w-full p-3.5 rounded-xl bg-[#06120E] border border-slate-700/80 focus:border-[#28D08B] text-white text-xs placeholder-slate-500 focus:outline-none transition-all font-sans"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
                  <Lock className="w-3.5 h-3.5 text-[#28D08B]" /> Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter employee account password"
                    className="w-full p-3.5 pr-10 rounded-xl bg-[#06120E] border border-slate-700/80 focus:border-[#28D08B] text-white text-xs placeholder-slate-500 focus:outline-none transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-[#06120E] text-[#28D08B] focus:ring-0 cursor-pointer accent-[#28D08B]"
                  />
                  <span>Remember session</span>
                </label>

                <Link
                  href="/contact"
                  className="text-xs text-[#28D08B] hover:underline font-semibold flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Forgot Password?</span>
                </Link>
              </div>

              {/* Animated Submit Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#28D08B] via-[#32E89F] to-[#16FFC6] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(40,208,139,0.35)] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Authorize & Sign In</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Separator OR */}
            <div className="relative flex items-center justify-center pt-1">
              <div className="w-full border-t border-slate-700/50" />
              <span className="absolute bg-[#081512] px-3 text-[11px] text-slate-400 font-medium">
                OR
              </span>
            </div>

            {/* Contact Administrator Secondary Button */}
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link
                href="/contact"
                className="w-full py-3 rounded-full border border-slate-700/80 hover:border-[#28D08B]/60 bg-slate-900/40 hover:bg-slate-800/50 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-[#28D08B]" />
                <span>Contact Administrator</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
