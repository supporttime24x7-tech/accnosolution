'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette, Check, CheckCircle2, Sparkles, Laptop, Eye, Save,
  RefreshCw, Sliders, Layers, ShieldCheck, ShoppingBag, Wrench,
  ExternalLink, Zap, Monitor, Smartphone, CheckSquare
} from 'lucide-react';
import { useErpStore } from '@/lib/store';
import { WEBSITE_THEMES, WebsiteThemeItem, getThemeById, applyThemeToDocument } from '@/lib/theme-config';

export function WebsiteThemeSettingsTab() {
  const { websiteTheme, updateWebsiteTheme } = useErpStore();

  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    websiteTheme?.activeTheme || 'emerald'
  );
  const [glowIntensity, setGlowIntensity] = useState<'subtle' | 'vibrant' | 'neon'>(
    websiteTheme?.glowIntensity || 'vibrant'
  );
  const [cardGlassmorphism, setCardGlassmorphism] = useState<boolean>(
    websiteTheme?.cardGlassmorphism !== false
  );
  const [contrastMode, setContrastMode] = useState<'standard' | 'high-contrast'>(
    websiteTheme?.contrastMode || 'standard'
  );
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (websiteTheme?.activeTheme) {
      setSelectedThemeId(websiteTheme.activeTheme);
    }
    if (websiteTheme?.glowIntensity) {
      setGlowIntensity(websiteTheme.glowIntensity);
    }
    if (typeof websiteTheme?.cardGlassmorphism === 'boolean') {
      setCardGlassmorphism(websiteTheme.cardGlassmorphism);
    }
    if (websiteTheme?.contrastMode) {
      setContrastMode(websiteTheme.contrastMode);
    }
  }, [websiteTheme]);

  const activeThemeObj = getThemeById(selectedThemeId);
  const currentSavedThemeObj = getThemeById(websiteTheme?.activeTheme || 'emerald');

  const handleSelectAndPreview = (themeId: string) => {
    setSelectedThemeId(themeId);
    // Instant live preview across the current document
    applyThemeToDocument(themeId);
  };

  const handleApplyGlobally = (themeId?: string) => {
    const idToSave = themeId || selectedThemeId;
    updateWebsiteTheme({
      activeTheme: idToSave,
      glowIntensity,
      cardGlassmorphism,
      contrastMode,
    });
    applyThemeToDocument(idToSave);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetToDefault = () => {
    setSelectedThemeId('emerald');
    setGlowIntensity('vibrant');
    setCardGlassmorphism(true);
    setContrastMode('standard');
    updateWebsiteTheme({
      activeTheme: 'emerald',
      glowIntensity: 'vibrant',
      cardGlassmorphism: true,
      contrastMode: 'standard',
    });
    applyThemeToDocument('emerald');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-[#16FFC6]/20 via-[#5ED29C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#16FFC6]/15 text-[#16FFC6] border border-[#16FFC6]/30 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3 h-3 text-[#16FFC6]" /> 8 Handcrafted Cybernetic Themes
              </span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                Website &amp; ERP Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Palette className="w-6 h-6 text-[#16FFC6]" />
              Website &amp; ERP Global Theme Studio
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Select and apply an immersive visual theme across the entire public website, online hardware shop, client booking portal, and ERP management workspace. Changes take effect immediately in real-time.
            </p>
          </div>

          {/* ACTIVE STATUS & QUICK ACTIONS */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white/20 animate-pulse"
                style={{ backgroundColor: currentSavedThemeObj.colors.accent }}
              />
              <div className="text-left">
                <div className="text-[9px] uppercase font-mono text-white/40 font-bold">Active Theme</div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  {currentSavedThemeObj.name}
                  {currentSavedThemeObj.id === 'emerald' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#5ED29C]/20 text-[#5ED29C] font-mono">
                      DEFAULT
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleApplyGlobally()}
              className="px-5 py-3 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Theme Globally
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold uppercase text-xs tracking-wider border border-white/10 transition-all flex items-center gap-2"
              title="Reset to default Cyber Emerald theme"
            >
              <RefreshCw className="w-4 h-4" /> Reset Default
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#16FFC6]/15 border border-[#16FFC6]/40 text-[#16FFC6] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Theme applied and synchronized globally! Stored in local cache and pushed to Supabase Cloud.</span>
          </div>
        )}
      </div>

      {/* LIVE SANDBOX PREVIEW */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#16FFC6]" />
              Live Interactive Sandbox Mockup
            </h3>
            <p className="text-[11px] text-white/50">
              Previewing: <strong className="text-white">{activeThemeObj.name}</strong> ({activeThemeObj.tagline})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewViewport === 'desktop' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewViewport === 'mobile' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>

        {/* BROWSER CHROME SIMULATOR */}
        <div
          className={`mx-auto transition-all duration-300 rounded-2xl border overflow-hidden shadow-2xl ${
            previewViewport === 'mobile' ? 'max-w-sm' : 'w-full'
          }`}
          style={{
            backgroundColor: activeThemeObj.colors.background,
            borderColor: activeThemeObj.colors.cardBorder,
          }}
        >
          {/* Top Mock Window Bar */}
          <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[10px] font-mono text-white/40 px-3 py-0.5 rounded-md bg-white/5 border border-white/5 flex items-center gap-1">
              <span>https://accnosolution.com</span>
            </div>
            <div className="w-10" />
          </div>

          {/* Mock Website Navbar */}
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-md"
                style={{
                  backgroundColor: activeThemeObj.colors.accent,
                  color: activeThemeObj.colors.selectionText,
                }}
              >
                A
              </div>
              <span className="text-xs font-extrabold tracking-wider text-white">ACCNO SOLUTION</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold text-white/60">
              <span style={{ color: activeThemeObj.colors.accent }}>HOME</span>
              <span>REPAIRS</span>
              <span>SERVICES</span>
              <span>SHOP</span>
              <span>ERP DESK</span>
            </div>

            <div
              className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm"
              style={{
                backgroundColor: activeThemeObj.colors.accent,
                color: activeThemeObj.colors.selectionText,
              }}
            >
              Sign In
            </div>
          </div>

          {/* Mock Hero Area */}
          <div className="p-6 sm:p-8 space-y-5 text-center relative overflow-hidden">
            {/* Glow backdrop */}
            <div
              className="absolute left-1/2 -top-12 -translate-x-1/2 w-72 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: activeThemeObj.colors.accent }}
            />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border"
              style={{
                backgroundColor: `${activeThemeObj.colors.accent}15`,
                borderColor: `${activeThemeObj.colors.accent}40`,
                color: activeThemeObj.colors.accent,
              }}
            >
              <Zap className="w-3 h-3" /> Certified Computer &amp; Mac Repair Desk
            </div>

            <h4 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase max-w-lg mx-auto">
              Expert Computer &amp; <span style={{ color: activeThemeObj.colors.accent }}>Apple Mac Repair.</span>
            </h4>

            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              Chip-level logic board diagnostics, cleanroom data recovery, and custom enterprise repair shop ERP solutions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-105"
                style={{
                  backgroundColor: activeThemeObj.colors.primary,
                  color: activeThemeObj.colors.selectionText,
                }}
              >
                Book Repair Now →
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border text-white/80"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: activeThemeObj.colors.cardBorder,
                }}
              >
                Track Ticket Status
              </button>
            </div>

            {/* Mock Dual Cards (Shop Item + ERP Ticket) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {/* Product Card */}
              <div
                className="p-3.5 rounded-xl border relative space-y-2"
                style={{
                  backgroundColor: activeThemeObj.colors.card,
                  borderColor: activeThemeObj.colors.cardBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${activeThemeObj.colors.accent}20`,
                      color: activeThemeObj.colors.accent,
                    }}
                  >
                    Hardware Shop
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">PRT-1007</span>
                </div>
                <div className="text-xs font-bold text-white truncate">PowerX 128GB M.2 NVMe SSD</div>
                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-sm font-black font-mono" style={{ color: activeThemeObj.colors.accent }}>
                    ₹1,400
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                    style={{
                      backgroundColor: activeThemeObj.colors.accent,
                      color: activeThemeObj.colors.selectionText,
                    }}
                  >
                    Add to Cart
                  </span>
                </div>
              </div>

              {/* ERP Metric Card */}
              <div
                className="p-3.5 rounded-xl border relative space-y-2"
                style={{
                  backgroundColor: activeThemeObj.colors.card,
                  borderColor: activeThemeObj.colors.cardBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                    Live ERP Service Desk
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">● 100% Ready</span>
                </div>
                <div className="text-xs font-bold text-white truncate">Dell Latitude E5420 Repair</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: activeThemeObj.colors.primary }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THEME SELECTION GALLERY (8 HANDCRAFTED THEMES) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#16FFC6]" />
              Select From 8 Complete Theme Colorways
            </h3>
            <p className="text-[11px] text-white/50">
              Click any card to preview instantly on this page, or click &quot;Apply Theme&quot; to make it your active global theme.
            </p>
          </div>
          <span className="text-xs text-white/40 font-mono">1 Default + 7 Handcrafted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEBSITE_THEMES.map((theme) => {
            const isCurrentlyActive = (websiteTheme?.activeTheme || 'emerald') === theme.id;
            const isPreviewing = selectedThemeId === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => handleSelectAndPreview(theme.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 group hover:scale-[1.02] ${
                  isPreviewing
                    ? 'ring-2 shadow-2xl bg-white/[0.06]'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/10'
                }`}
                style={{
                  borderColor: isPreviewing ? theme.colors.accent : 'rgba(255, 255, 255, 0.10)',
                  boxShadow: isPreviewing ? `0 10px 30px -10px ${theme.colors.glow}` : undefined,
                }}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full font-mono border"
                    style={{
                      backgroundColor: `${theme.colors.accent}15`,
                      borderColor: `${theme.colors.accent}40`,
                      color: theme.colors.accent,
                    }}
                  >
                    {theme.badge}
                  </span>

                  {isCurrentlyActive ? (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <Check className="w-2.5 h-2.5" /> Active
                    </span>
                  ) : isPreviewing ? (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 font-mono">
                      Previewing
                    </span>
                  ) : null}
                </div>

                {/* Theme Title & Tagline */}
                <div>
                  <h4 className="text-sm font-black text-white group-hover:text-white transition-colors flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    {theme.name}
                  </h4>
                  <div className="text-[10px] text-white/50 font-mono mt-0.5">{theme.tagline}</div>
                  <p className="text-[11px] text-white/60 leading-relaxed mt-2 line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                {/* Color Swatches Palette */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-[9.5px] uppercase font-mono text-white/40 flex items-center justify-between">
                    <span>Palette Swatches</span>
                    <span className="font-bold text-white/60">{theme.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Accent Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm border border-white/20 relative group/swatch"
                      style={{ backgroundColor: theme.colors.accent }}
                      title={`Accent: ${theme.colors.accent}`}
                    />
                    {/* Primary Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm border border-white/20 relative group/swatch"
                      style={{ backgroundColor: theme.colors.primary }}
                      title={`Primary: ${theme.colors.primary}`}
                    />
                    {/* Background Canvas Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm border border-white/20 relative group/swatch"
                      style={{ backgroundColor: theme.colors.background }}
                      title={`Background Canvas: ${theme.colors.background}`}
                    />
                    {/* Surface Card Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm border border-white/20 relative group/swatch"
                      style={{ backgroundColor: theme.colors.card }}
                      title={`Surface Card: ${theme.colors.card}`}
                    />
                    {/* Border Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg shadow-sm border border-white/20 relative group/swatch"
                      style={{ backgroundColor: theme.colors.cardBorder }}
                      title={`Border Highlight`}
                    />
                  </div>
                </div>

                {/* Mini UI Strip Preview */}
                <div
                  className="p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-mono"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.cardBorder,
                  }}
                >
                  <span style={{ color: theme.colors.accent }} className="font-bold">
                    ₹9,000 INR
                  </span>
                  <div
                    className="px-2 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.selectionText,
                    }}
                  >
                    Action
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyGlobally(theme.id);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isCurrentlyActive
                      ? 'bg-white/10 text-white cursor-default'
                      : 'hover:scale-105 shadow-md'
                  }`}
                  style={{
                    backgroundColor: isCurrentlyActive ? undefined : theme.colors.primary,
                    color: isCurrentlyActive ? undefined : theme.colors.selectionText,
                  }}
                >
                  {isCurrentlyActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Theme
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Apply This Theme
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADVANCED THEME CONTROLS & GLOW ENGINE */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sliders className="w-4 h-4 text-[#16FFC6]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Theme Engine Preferences &amp; Cyber Radiance Controls
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Glow Intensity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Cyber Glow Intensity</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['subtle', 'vibrant', 'neon'] as const).map((intensity) => (
                <button
                  key={intensity}
                  type="button"
                  onClick={() => setGlowIntensity(intensity)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    glowIntensity === intensity
                      ? 'bg-[#16FFC6]/20 border-[#16FFC6] text-[#16FFC6]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/40">
              Controls shadow bloom and neon backlight on interactive cards and buttons.
            </p>
          </div>

          {/* Liquid Glassmorphism */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Liquid Glassmorphism Blur</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCardGlassmorphism(!cardGlassmorphism)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                  cardGlassmorphism
                    ? 'bg-[#5ED29C]/20 border-[#5ED29C] text-[#5ED29C]'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {cardGlassmorphism ? 'Enabled (Frosted Glass)' : 'Disabled (Flat Dark)'}
              </button>
            </div>
            <p className="text-[10px] text-white/40">
              Renders translucent backdrop blur for modern cyber cards and modals.
            </p>
          </div>

          {/* Contrast Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Display Contrast Preset</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['standard', 'high-contrast'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setContrastMode(mode)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    contrastMode === mode
                      ? 'bg-[#16FFC6]/20 border-[#16FFC6] text-[#16FFC6]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {mode === 'standard' ? 'Standard' : 'High Contrast'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/40">
              Adjusts border intensity and text vibrancy for outdoor sunlight visibility.
            </p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-white/50">
            Current configuration will be saved to your browser and pushed to Supabase Cloud for all visitors.
          </div>
          <button
            type="button"
            onClick={() => handleApplyGlobally()}
            className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black uppercase text-xs tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save Theme Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
