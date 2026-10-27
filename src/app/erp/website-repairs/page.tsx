'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench, Plus, Search, Edit3, Trash2, ExternalLink, CheckCircle2,
  Calendar, Clock, Sparkles, X, Shield, Monitor, Laptop, Cpu, Smartphone,
  Printer, HardDrive, Filter, ArrowUpRight, Layers, Eye, EyeOff, BarChart3, DollarSign, Zap, HelpCircle,
  Megaphone, Car
} from 'lucide-react';
import { useErpStore, HardwareRepairCatalogItem, RepairProcessStepItem, EnterpriseSolutionItem, DetailedServiceItem, ServiceStatItem, ServicePillarItem, ServicesFaqItem, WebsitePromotionItem } from '@/lib/store';
import { PromotionBar } from '@/components/layout/PromotionBar';

export default function WebsiteRepairsManagerPage() {
  const [mounted, setMounted] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'catalog' | 'process' | 'solutions' | 'detailed' | 'stats' | 'pillars' | 'faqs' | 'promotion'>('catalog');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State for Catalog Items
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState<HardwareRepairCatalogItem | null>(null);
  const [catCategory, setCatCategory] = useState<'desktop' | 'laptop' | 'mac' | 'phone' | 'printer' | 'datarecovery'>('desktop');
  const [catTitle, setCatTitle] = useState('');
  const [catPrice, setCatPrice] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catWarranty, setCatWarranty] = useState<number>(90);

  // Modal State for Process Steps
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingProcessStep, setEditingProcessStep] = useState<RepairProcessStepItem | null>(null);
  const [stepNumber, setStepNumber] = useState('01');
  const [stepTitle, setStepTitle] = useState('');
  const [stepDesc, setStepDesc] = useState('');

  // Modal State for Enterprise IT Solutions Grid
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState<EnterpriseSolutionItem | null>(null);
  const [solTitle, setSolTitle] = useState('');
  const [solDesc, setSolDesc] = useState('');
  const [solBadge, setSolBadge] = useState('Enterprise');
  const [solLink, setSolLink] = useState('/repairs');
  const [solIconName, setSolIconName] = useState('Wrench');

  // Modal State for Detailed Services & Specifications (Website Services Page)
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [editingDetailed, setEditingDetailed] = useState<DetailedServiceItem | null>(null);
  const [detCategory, setDetCategory] = useState<string>('hardware');
  const [detBadge, setDetBadge] = useState<string>('Micro-Soldering Repair');
  const [detIconName, setDetIconName] = useState<string>('Wrench');
  const [detTitle, setDetTitle] = useState<string>('');
  const [detShortDesc, setDetShortDesc] = useState<string>('');
  const [detWhyChoose, setDetWhyChoose] = useState<string>('');
  const [detFeatures, setDetFeatures] = useState<string>('');
  const [detIdealFor, setDetIdealFor] = useState<string>('');
  const [detTurnaround, setDetTurnaround] = useState<string>('24 - 48 Hours');
  const [detWarranty, setDetWarranty] = useState<string>('90 Days Standard Warranty');
  const [detActionLink, setDetActionLink] = useState<string>('/repairs');
  const [detActionText, setDetActionText] = useState<string>('Book Hardware Repair');
  const [detIsVisible, setDetIsVisible] = useState<boolean>(true);

  // Modal State for Service Highlights & Quick Stats
  const [showStatModal, setShowStatModal] = useState(false);
  const [editingStat, setEditingStat] = useState<ServiceStatItem | null>(null);
  const [statValue, setStatValue] = useState<string>('');
  const [statLabel, setStatLabel] = useState<string>('');
  const [statColor, setStatColor] = useState<string>('#5ED29C');
  const [statIsVisible, setStatIsVisible] = useState<boolean>(true);

  // Modal State for Service Pillars & Rationale (Why We Offer Services)
  const [showPillarModal, setShowPillarModal] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ServicePillarItem | null>(null);
  const [plrTitle, setPlrTitle] = useState<string>('');
  const [plrDesc, setPlrDesc] = useState<string>('');
  const [plrBadge, setPlrBadge] = useState<string>('Cost Savings');
  const [plrIconName, setPlrIconName] = useState<string>('DollarSign');
  const [plrIsVisible, setPlrIsVisible] = useState<boolean>(true);

  // Modal State for Services Page FAQs
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<ServicesFaqItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState<string>('');
  const [faqAnswer, setFaqAnswer] = useState<string>('');
  const [faqCategory, setFaqCategory] = useState<string>('Warranty & SLA');
  const [faqIsVisible, setFaqIsVisible] = useState<boolean>(true);

  // Modal State for Website Promotions (including Car Promotions)
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromoItem, setEditingPromoItem] = useState<WebsitePromotionItem | null>(null);
  const [promoModalTitle, setPromoModalTitle] = useState('');
  const [promoModalCategory, setPromoModalCategory] = useState('Cars & Automobile Electronics');
  const [promoModalBadge, setPromoModalBadge] = useState('CAR SPECIAL');
  const [promoModalText, setPromoModalText] = useState('');
  const [promoModalActionText, setPromoModalActionText] = useState('Book Car Service →');
  const [promoModalActionLink, setPromoModalActionLink] = useState('/book-repair');
  const [promoModalTheme, setPromoModalTheme] = useState<'emerald' | 'cyan' | 'amber' | 'purple' | 'rose'>('cyan');
  const [promoModalDismissible, setPromoModalDismissible] = useState(true);
  const [promoModalMakeActive, setPromoModalMakeActive] = useState(true);

  // Search & Filter State for Promotion Campaigns Tab
  const [promoFilterCategory, setPromoFilterCategory] = useState<string>('all');
  const [promoSearchQuery, setPromoSearchQuery] = useState<string>('');

  // Promotion Bar State
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [promoText, setPromoText] = useState('⚡ SPECIAL OFFER: Get Up to 20% OFF on Laptop & Apple Mac Chip-Level Repairs! Free Pick & Drop Across Jammu.');
  const [promoBadge, setPromoBadge] = useState('LIMITED TIME OFFER');
  const [promoActionText, setPromoActionText] = useState('Book Repair Now →');
  const [promoActionLink, setPromoActionLink] = useState('/book-repair');
  const [promoTheme, setPromoTheme] = useState<'emerald' | 'cyan' | 'amber' | 'purple' | 'rose'>('emerald');
  const [promoDismissible, setPromoDismissible] = useState(true);
  const [promoSavedToast, setPromoSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Changes Published Successfully!');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    hardwareRepairCatalog = [],
    addHardwareRepairCatalogItem,
    updateHardwareRepairCatalogItem,
    deleteHardwareRepairCatalogItem,
    repairProcessSteps = [],
    addRepairProcessStep,
    updateRepairProcessStep,
    deleteRepairProcessStep,
    enterpriseSolutions = [],
    addEnterpriseSolution,
    updateEnterpriseSolution,
    deleteEnterpriseSolution,
    detailedServices = [],
    addDetailedService,
    updateDetailedService,
    deleteDetailedService,
    toggleDetailedServiceVisibility,
    serviceStats = [],
    addServiceStat,
    updateServiceStat,
    deleteServiceStat,
    toggleServiceStatVisibility,
    servicePillars = [],
    addServicePillar,
    updateServicePillar,
    deleteServicePillar,
    toggleServicePillarVisibility,
    servicesFaqs = [],
    addServicesFaq,
    updateServicesFaq,
    deleteServicesFaq,
    toggleServicesFaqVisibility,
    websitePromotions = [],
    addWebsitePromotion,
    updateWebsitePromotion,
    deleteWebsitePromotion,
    selectActivePromotion,
    websitePromotionBar,
    updateWebsitePromotionBar,
  } = useErpStore();

  useEffect(() => {
    if (websitePromotionBar) {
      setPromoEnabled(websitePromotionBar.isEnabled ?? true);
      setPromoText(websitePromotionBar.text ?? '');
      setPromoBadge(websitePromotionBar.badgeText ?? '');
      setPromoActionText(websitePromotionBar.actionText ?? '');
      setPromoActionLink(websitePromotionBar.actionLink ?? '');
      setPromoTheme(websitePromotionBar.theme ?? 'emerald');
      setPromoDismissible(websitePromotionBar.isDismissible ?? true);
    }
  }, [websitePromotionBar]);

  if (!mounted) return null;

  // Filter Catalog Items
  const filteredCatalog = hardwareRepairCatalog.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase()) ||
      item.estPrice.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#5ED29C]" />
            WEBSITE REPAIRS MANAGER<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60">
            Core Operations hub for managing Hardware &amp; Device Repairs and Our 4-Step Repair Process displayed on the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/repairs"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#5ED29C] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#5ED29C]" />
            View Public Repairs Page Live
          </Link>

          {activeTab === 'catalog' ? (
            <button
              onClick={() => {
                setEditingCatalogItem(null);
                setCatCategory('desktop');
                setCatTitle('');
                setCatPrice('₹800 - ₹2,500');
                setCatDesc('');
                setCatWarranty(90);
                setShowCatalogModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Repair Service
            </button>
          ) : activeTab === 'process' ? (
            <button
              onClick={() => {
                setEditingProcessStep(null);
                setStepNumber(`0${repairProcessSteps.length + 1}`);
                setStepTitle('');
                setStepDesc('');
                setShowProcessModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Process Step
            </button>
          ) : activeTab === 'solutions' ? (
            <button
              onClick={() => {
                setEditingSolution(null);
                setSolTitle('');
                setSolDesc('');
                setSolBadge('New Solution');
                setSolLink('/repairs');
                setSolIconName('Wrench');
                setShowSolutionModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Enterprise Solution
            </button>
          ) : activeTab === 'detailed' ? (
            <button
              onClick={() => {
                setEditingDetailed(null);
                setDetCategory('hardware');
                setDetBadge('Micro-Soldering Repair');
                setDetIconName('Wrench');
                setDetTitle('');
                setDetShortDesc('');
                setDetWhyChoose('');
                setDetFeatures('');
                setDetIdealFor('');
                setDetTurnaround('24 - 48 Hours');
                setDetWarranty('90 Days Standard Warranty');
                setDetActionLink('/repairs');
                setDetActionText('Book Hardware Repair');
                setDetIsVisible(true);
                setShowDetailedModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Detailed Service
            </button>
          ) : activeTab === 'stats' ? (
            <button
              onClick={() => {
                setEditingStat(null);
                setStatValue('');
                setStatLabel('');
                setStatColor('#5ED29C');
                setStatIsVisible(true);
                setShowStatModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Service Highlight Stat
            </button>
          ) : activeTab === 'pillars' ? (
            <button
              onClick={() => {
                setEditingPillar(null);
                setPlrTitle('');
                setPlrDesc('');
                setPlrBadge('Cost Savings');
                setPlrIconName('DollarSign');
                setPlrIsVisible(true);
                setShowPillarModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Service Pillar
            </button>
          ) : activeTab === 'faqs' ? (
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqQuestion('');
                setFaqAnswer('');
                setFaqCategory('Warranty & SLA');
                setFaqIsVisible(true);
                setShowFaqModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> + Add Services FAQ
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEditingPromoItem(null);
                  setPromoModalTitle('Car ECM & Infotainment Repair Special');
                  setPromoModalCategory('Cars & Automobile Electronics');
                  setPromoModalBadge('CAR SPECIAL');
                  setPromoModalText('🚗 CAR ELECTRONICS: Up to 20% OFF on Car ECM/ECU Diagnostics, Touchscreen Infotainment & Dashboard Repairs!');
                  setPromoModalActionText('Book Car Service →');
                  setPromoModalActionLink('/book-repair');
                  setPromoModalTheme('cyan');
                  setPromoModalDismissible(true);
                  setPromoModalMakeActive(true);
                  setShowPromoModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              >
                <Car className="w-4 h-4" /> + Create Car Promotion
              </button>

              <button
                onClick={() => {
                  setEditingPromoItem(null);
                  setPromoModalTitle('');
                  setPromoModalCategory('Cars & Automobile Electronics');
                  setPromoModalBadge('SPECIAL OFFER');
                  setPromoModalText('');
                  setPromoModalActionText('Explore Services →');
                  setPromoModalActionLink('/services');
                  setPromoModalTheme('emerald');
                  setPromoModalDismissible(true);
                  setPromoModalMakeActive(false);
                  setShowPromoModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> + Create Promotion
              </button>

              <button
                onClick={() => {
                  const next = !promoEnabled;
                  setPromoEnabled(next);
                  updateWebsitePromotionBar({ isEnabled: next });
                  setToastMessage(next ? 'Promotion Bar enabled live on website!' : 'Promotion Bar paused on website.');
                  setPromoSavedToast(true);
                  setTimeout(() => setPromoSavedToast(false), 3000);
                }}
                className={`px-3.5 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  promoEnabled
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Megaphone className="w-4 h-4" /> {promoEnabled ? 'LIVE' : 'OFF'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">TOTAL REPAIR SERVICES</span>
            <div className="text-2xl font-extrabold font-mono text-white">{hardwareRepairCatalog.length} Services</div>
            <div className="text-[11px] text-[#5ED29C] font-semibold mt-1">Live repair catalog</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center font-extrabold text-xl">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">SOP WORKFLOW STEPS</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">{repairProcessSteps.length} Steps</div>
            <div className="text-[11px] text-white/50 mt-1">Standard repair process</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">ENTERPRISE SOLUTIONS</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">{enterpriseSolutions.length} Solutions</div>
            <div className="text-[11px] text-cyan-300/80 font-semibold mt-1">Website home grid cards</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-extrabold text-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">TOP PROMO BAR</span>
            <div className="text-2xl font-extrabold font-mono text-amber-300">{promoEnabled ? 'ACTIVE' : 'PAUSED'}</div>
            <div className="text-[11px] text-amber-400/80 font-semibold mt-1">Site-wide banner status</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-xl">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tab Switcher */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" /> Hardware &amp; Device Repairs Catalog ({hardwareRepairCatalog.length})
          </button>

          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'process'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Our 4-Step Repair Process SOP ({repairProcessSteps.length})
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'solutions'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Enterprise IT &amp; Solutions Grid ({enterpriseSolutions.length})
          </button>

          <button
            onClick={() => setActiveTab('detailed')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'detailed'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> Full Services &amp; Specifications ({detailedServices.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#16FFC6]" /> Service Stats &amp; Highlights ({serviceStats.length})
          </button>

          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pillars'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#5ED29C]" /> Service Pillars &amp; Rationale ({servicePillars.length})
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#38BDF8]" /> Services Page FAQs ({servicesFaqs.length})
          </button>

          <button
            onClick={() => setActiveTab('promotion')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'promotion'
                ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-400" /> Top Promotion Bar ({promoEnabled ? 'Active' : 'Disabled'})
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white font-bold focus:outline-none"
            >
              <option value="all">All Device Categories</option>
              <option value="desktop">Desktop &amp; Gaming PC</option>
              <option value="laptop">Laptop &amp; Notebook</option>
              <option value="mac">Apple Mac &amp; Logic Board</option>
              <option value="phone">Smartphone &amp; Tablet</option>
              <option value="printer">Printer &amp; Scanner</option>
              <option value="datarecovery">Cleanroom Data Recovery</option>
            </select>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repair services..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: HARDWARE & DEVICE REPAIRS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#5ED29C]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#16FFC6] bg-[#16FFC6]/10 px-3 py-1 rounded-full border border-[#16FFC6]/30">
                      {item.estPrice}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-[#5ED29C] font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> {item.warrantyDays || 90}-Day Warranty
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCatalogItem(item);
                        setCatCategory(item.category);
                        setCatTitle(item.title);
                        setCatPrice(item.estPrice);
                        setCatDesc(item.desc);
                        setCatWarranty(item.warrantyDays || 90);
                        setShowCatalogModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete repair catalog item "${item.title}"?`)) {
                          deleteHardwareRepairCatalogItem(item.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OUR 4-STEP REPAIR PROCESS SOP */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {repairProcessSteps.map((step, idx) => (
              <div
                key={step.id}
                className="glass-panel p-6 rounded-2xl border-l-2 border-l-[#5ED29C] border-y border-r border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="font-mono text-4xl font-extrabold text-[#5ED29C]/40 mb-3 block">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-[#5ED29C] font-semibold uppercase">
                    Verified Step {idx + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProcessStep(step);
                        setStepNumber(step.step);
                        setStepTitle(step.title);
                        setStepDesc(step.desc);
                        setShowProcessModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete process step "${step.step} - ${step.title}"?`)) {
                          deleteRepairProcessStep(step.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE IT & SOLUTIONS GRID */}
      {activeTab === 'solutions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseSolutions.map((sol) => (
              <div
                key={sol.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#5ED29C]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                      {sol.badge || 'Service'}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {sol.iconName || 'Wrench'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{sol.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{sol.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-cyan-300 font-mono flex items-center gap-1 truncate max-w-[110px]" title={sol.link}>
                    <ArrowUpRight className="w-3 h-3 flex-shrink-0" /> {sol.link}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSolution(sol);
                        setSolTitle(sol.title);
                        setSolDesc(sol.desc);
                        setSolBadge(sol.badge || 'Service');
                        setSolLink(sol.link || '/repairs');
                        setSolIconName(sol.iconName || 'Wrench');
                        setShowSolutionModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete Enterprise Solution "${sol.title}"?`)) {
                          deleteEnterpriseSolution(sol.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DETAILED SERVICES & SPECIFICATIONS HUB */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailedServices.map((srv) => (
              <div
                key={srv.id}
                className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  srv.isVisible !== false
                    ? 'border-white/10 hover:border-[#5ED29C]/40 bg-[#0D1117]'
                    : 'border-rose-500/30 bg-rose-950/10 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                        {srv.badge}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded">
                        Category: {srv.category}
                      </span>
                    </div>

                    {/* LIVE WEBSITE VISIBILITY TOGGLE */}
                    <button
                      onClick={() => toggleDetailedServiceVisibility(srv.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        srv.isVisible !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                      title={srv.isVisible !== false ? 'Click to hide from live website' : 'Click to show on live website'}
                    >
                      {srv.isVisible !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Showing Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" /> Hidden From Site
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">{srv.shortDesc}</p>

                  {srv.whyChoose && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
                      <span className="text-[10px] font-bold text-[#16FFC6] uppercase tracking-wider block mb-1">
                        Rationale / Reason Behind Service:
                      </span>
                      <p className="text-[11px] text-white/70 italic">&quot;{srv.whyChoose}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-white/50">
                    SLA: <span className="text-[#16FFC6] font-bold">{srv.turnaround}</span> | Warranty: <span className="text-[#5ED29C] font-bold">{srv.warranty}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDetailed(srv);
                        setDetCategory(srv.category || 'hardware');
                        setDetBadge(srv.badge || '');
                        setDetIconName(srv.iconName || 'Wrench');
                        setDetTitle(srv.title || '');
                        setDetShortDesc(srv.shortDesc || '');
                        setDetWhyChoose(srv.whyChoose || '');
                        setDetFeatures(Array.isArray(srv.features) ? srv.features.join('\n') : '');
                        setDetIdealFor(srv.idealFor || '');
                        setDetTurnaround(srv.turnaround || '');
                        setDetWarranty(srv.warranty || '');
                        setDetActionLink(srv.actionLink || '/repairs');
                        setDetActionText(srv.actionText || 'Book Repair');
                        setDetIsVisible(srv.isVisible !== false);
                        setShowDetailedModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete Detailed Service "${srv.title}"?`)) {
                          deleteDetailedService(srv.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE STATS & HIGHLIGHTS HUB */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceStats.map((st) => (
              <div
                key={st.id}
                className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  st.isVisible !== false
                    ? 'border-white/10 hover:border-[#5ED29C]/40 bg-[#0D1117]'
                    : 'border-rose-500/30 bg-rose-950/10 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10"
                      style={{ color: st.color || '#5ED29C' }}
                    >
                      Color: {st.color || '#5ED29C'}
                    </span>

                    {/* LIVE WEBSITE VISIBILITY TOGGLE */}
                    <button
                      onClick={() => toggleServiceStatVisibility(st.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        st.isVisible !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                      title={st.isVisible !== false ? 'Click to hide from live website' : 'Click to show on live website'}
                    >
                      {st.isVisible !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Showing Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" /> Hidden From Site
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-3xl font-extrabold font-mono mb-2" style={{ color: st.color || '#5ED29C' }}>
                    {st.value}
                  </div>
                  <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">{st.label}</h3>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingStat(st);
                      setStatValue(st.value || '');
                      setStatLabel(st.label || '');
                      setStatColor(st.color || '#5ED29C');
                      setStatIsVisible(st.isVisible !== false);
                      setShowStatModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete stat highlight "${st.value} - ${st.label}"?`)) {
                        deleteServiceStat(st.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SERVICE PILLARS & RATIONALE GRID */}
      {activeTab === 'pillars' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#5ED29C]" />
              Service Pillars &amp; Strategic Rationale Cards ({servicePillars.length})
            </h2>
            <span className="text-xs text-white/50">
              Controls &quot;WHY WE OFFER THESE SPECIFIC SERVICES&quot; section on `/services`
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePillars.map((plr) => (
              <div
                key={plr.id}
                className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  plr.isVisible !== false
                    ? 'border-white/10 hover:border-[#5ED29C]/40 bg-[#0D1117]'
                    : 'border-rose-500/30 bg-rose-950/10 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {plr.badge ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2 py-0.5 rounded-full">
                        {plr.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Pillar Item</span>
                    )}

                    {/* LIVE WEBSITE VISIBILITY TOGGLE */}
                    <button
                      onClick={() => toggleServicePillarVisibility(plr.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        plr.isVisible !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                      title={plr.isVisible !== false ? 'Click to hide from live website' : 'Click to show on live website'}
                    >
                      {plr.isVisible !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" /> Showing Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-rose-400" /> Hidden
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{plr.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{plr.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingPillar(plr);
                      setPlrTitle(plr.title || '');
                      setPlrDesc(plr.desc || '');
                      setPlrBadge(plr.badge || '');
                      setPlrIconName(plr.iconName || 'DollarSign');
                      setPlrIsVisible(plr.isVisible !== false);
                      setShowPillarModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete service pillar "${plr.title}"?`)) {
                        deleteServicePillar(plr.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SERVICES PAGE FREQUENTLY ASKED QUESTIONS (FAQS) */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
              Services Page Frequently Asked Questions ({servicesFaqs.length})
            </h2>
            <span className="text-xs text-white/50">
              Controls &quot;FREQUENTLY ASKED QUESTIONS&quot; section on `/services`
            </span>
          </div>

          <div className="space-y-4">
            {servicesFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`glass-panel p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  faq.isVisible !== false
                    ? 'border-white/10 hover:border-[#5ED29C]/40 bg-[#0D1117]'
                    : 'border-rose-500/30 bg-rose-950/10 opacity-75'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    {faq.category && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2.5 py-0.5 rounded-full">
                        {faq.category}
                      </span>
                    )}

                    {/* LIVE WEBSITE VISIBILITY TOGGLE */}
                    <button
                      onClick={() => toggleServicesFaqVisibility(faq.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        faq.isVisible !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                      title={faq.isVisible !== false ? 'Click to hide from live website' : 'Click to show on live website'}
                    >
                      {faq.isVisible !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" /> Showing Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-rose-400" /> Hidden
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#5ED29C] flex-shrink-0" />
                    {faq.question}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqQuestion(faq.question || '');
                      setFaqAnswer(faq.answer || '');
                      setFaqCategory(faq.category || 'Warranty & SLA');
                      setFaqIsVisible(faq.isVisible !== false);
                      setShowFaqModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete FAQ "${faq.question}"?`)) {
                        deleteServicesFaq(faq.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: TOP PROMOTION BAR MANAGEMENT */}
      {activeTab === 'promotion' && (
        <div className="space-y-6">
          {/* Saved Toast Alert */}
          {promoSavedToast && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-400 animate-fade-in shadow-xl shadow-emerald-500/10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm block">{toastMessage}</span>
                  <span className="text-xs text-emerald-400/80">The promotion bar configuration is updated live across all public website pages.</span>
                </div>
              </div>
              <button
                onClick={() => setPromoSavedToast(false)}
                className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Real-time Interactive Visual Preview */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5ED29C]" />
                  Live Website Banner Preview (Currently Displayed)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                  Theme: {websitePromotionBar?.theme || 'emerald'}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                  promoEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}>
                  {promoEnabled ? 'Status: LIVE' : 'Status: DISABLED'}
                </span>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#070B0A]/90 p-1">
              <PromotionBar forcePreview={true} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-white/50">
              <span className="italic">
                * Visitors on the public website see this banner fixed above the navbar. You can pick any promotion from the library below to display it live.
              </span>
              <span className="font-mono text-white/80">
                Active Campaign: <strong className="text-[#5ED29C]">{websitePromotions.find(p => p.isActive)?.title || 'Default Campaign'}</strong>
              </span>
            </div>
          </div>

          {/* Master Status & Public Visibility Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${promoEnabled ? 'bg-emerald-400 shadow-[0_0_12px_#34D399]' : 'bg-white/30'}`} />
                <h4 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Master Visibility: {promoEnabled ? 'Promotion Bar is ACTIVE & VISIBLE' : 'Promotion Bar is PAUSED & HIDDEN'}
                </h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                When active, the selected promotion appears universally across all public pages: Home, Repairs, Services, Projects, Shop, About, Contact &amp; Blog.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#5ED29C] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#5ED29C]" />
                View Website Live
              </Link>

              <button
                type="button"
                onClick={() => {
                  const next = !promoEnabled;
                  setPromoEnabled(next);
                  updateWebsitePromotionBar({ isEnabled: next });
                  setToastMessage(next ? 'Promotion Bar enabled live on website!' : 'Promotion Bar paused on website.');
                  setPromoSavedToast(true);
                  setTimeout(() => setPromoSavedToast(false), 3000);
                }}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                  promoEnabled
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white'
                    : 'bg-emerald-500 text-black hover:bg-[#16FFC6] shadow-emerald-500/20'
                }`}
              >
                {promoEnabled ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Pause &amp; Hide Bar
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Enable &amp; Show Live
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Promotion Campaigns Library & Car Promotions Manager */}
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h3 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#5ED29C]" />
                    PROMOTION CAMPAIGNS &amp; BANNER LIBRARY ({websitePromotions.length})
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Create promotions for cars, laptops, Apple devices &amp; IT services. Select which promotion should be displayed live on the website.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPromoItem(null);
                      setPromoModalTitle('Car ECM & Infotainment Repair Special');
                      setPromoModalCategory('Cars & Automobile Electronics');
                      setPromoModalBadge('CAR SPECIAL');
                      setPromoModalText('🚗 CAR ELECTRONICS: Up to 20% OFF on Car ECM/ECU Diagnostics, Touchscreen Infotainment & Dashboard Repairs!');
                      setPromoModalActionText('Book Car Service →');
                      setPromoModalActionLink('/book-repair');
                      setPromoModalTheme('cyan');
                      setPromoModalDismissible(true);
                      setPromoModalMakeActive(true);
                      setShowPromoModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-cyan-500/10"
                  >
                    <Car className="w-4 h-4" /> + Create Car Promotion
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPromoItem(null);
                      setPromoModalTitle('');
                      setPromoModalCategory('Cars & Automobile Electronics');
                      setPromoModalBadge('SPECIAL OFFER');
                      setPromoModalText('');
                      setPromoModalActionText('Explore Services →');
                      setPromoModalActionLink('/services');
                      setPromoModalTheme('emerald');
                      setPromoModalDismissible(true);
                      setPromoModalMakeActive(false);
                      setShowPromoModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" /> + Create Promotion
                  </button>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
                  {[
                    { id: 'all', label: `All Campaigns (${websitePromotions.length})` },
                    { id: 'cars', label: `🚗 Cars & Auto (${websitePromotions.filter(p => p.category?.toLowerCase().includes('car')).length})` },
                    { id: 'laptops', label: `💻 Laptops & PCs (${websitePromotions.filter(p => p.category?.toLowerCase().includes('laptop') || p.category?.toLowerCase().includes('computer')).length})` },
                    { id: 'mac', label: `🍎 Apple Mac (${websitePromotions.filter(p => p.category?.toLowerCase().includes('mac')).length})` },
                    { id: 'cctv', label: `📹 CCTV & AMC (${websitePromotions.filter(p => p.category?.toLowerCase().includes('cctv') || p.category?.toLowerCase().includes('security')).length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPromoFilterCategory(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                        promoFilterCategory === tab.id
                          ? 'bg-white text-black font-extrabold shadow-md'
                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={promoSearchQuery}
                    onChange={(e) => setPromoSearchQuery(e.target.value)}
                    placeholder="Search promotions..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
                  />
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Promotions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {websitePromotions
                .filter((p) => {
                  const matchesSearch =
                    p.title.toLowerCase().includes(promoSearchQuery.toLowerCase()) ||
                    p.text.toLowerCase().includes(promoSearchQuery.toLowerCase()) ||
                    p.badgeText.toLowerCase().includes(promoSearchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(promoSearchQuery.toLowerCase());
                  const matchesCat =
                    promoFilterCategory === 'all' ||
                    (promoFilterCategory === 'cars' && p.category?.toLowerCase().includes('car')) ||
                    (promoFilterCategory === 'laptops' && (p.category?.toLowerCase().includes('laptop') || p.category?.toLowerCase().includes('computer'))) ||
                    (promoFilterCategory === 'mac' && p.category?.toLowerCase().includes('mac')) ||
                    (promoFilterCategory === 'cctv' && (p.category?.toLowerCase().includes('cctv') || p.category?.toLowerCase().includes('security')));
                  return matchesSearch && matchesCat;
                })
                .map((promo) => {
                  const isCarPromo = promo.category?.toLowerCase().includes('car');
                  const themeGradients: Record<string, string> = {
                    emerald: 'from-[#031A11] via-[#072B1E] to-[#031A11] border-[#5ED29C]/40 text-[#5ED29C]',
                    cyan: 'from-[#031826] via-[#06283D] to-[#031826] border-cyan-400/40 text-cyan-300',
                    amber: 'from-[#241302] via-[#381F04] to-[#241302] border-amber-400/40 text-amber-300',
                    purple: 'from-[#1A0426] via-[#2D0940] to-[#1A0426] border-purple-400/40 text-purple-300',
                    rose: 'from-[#24040D] via-[#3B0715] to-[#24040D] border-rose-400/40 text-rose-300',
                  };
                  const currentThemeStyle = themeGradients[promo.theme] || themeGradients.emerald;

                  return (
                    <div
                      key={promo.id}
                      className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                        promo.isActive
                          ? 'border-[#5ED29C] bg-[#5ED29C]/5 shadow-2xl shadow-[#5ED29C]/10'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Meta Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                              isCarPromo
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                                : 'bg-white/10 border-white/20 text-white/80'
                            }`}>
                              {isCarPromo ? <Car className="w-3 h-3 text-cyan-400" /> : <Megaphone className="w-3 h-3 text-[#5ED29C]" />}
                              {promo.category}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-white/40">
                              Theme: {promo.theme}
                            </span>
                          </div>

                          {/* Live Selection Indicator */}
                          {promo.isActive ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> LIVE ON WEBSITE
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                selectActivePromotion(promo.id);
                                setToastMessage(`Switched active display to "${promo.title}"!`);
                                setPromoSavedToast(true);
                                setTimeout(() => setPromoSavedToast(false), 3000);
                              }}
                              className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#5ED29C] hover:text-black border border-white/15 text-white/70 hover:font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Select to Display
                            </button>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <h4 className="text-base font-extrabold text-white tracking-wide">
                            {promo.title}
                          </h4>
                        </div>

                        {/* Banner Visual Mini-Preview */}
                        <div className={`p-3 rounded-2xl border bg-gradient-to-r ${currentThemeStyle} shadow-inner space-y-2`}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/40 border border-white/20 text-white">
                              {promo.badgeText || 'PROMO'}
                            </span>
                            <span className="text-xs font-semibold text-white/90 line-clamp-2">
                              {promo.text}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                            <span className="text-white/60">
                              Button: <strong className="text-white">{promo.actionText}</strong>
                            </span>
                            <span className="text-white/40 font-mono">
                              Target: {promo.actionLink}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <div>
                          {promo.isActive ? (
                            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Active Banner
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                selectActivePromotion(promo.id);
                                setToastMessage(`Switched active display to "${promo.title}"!`);
                                setPromoSavedToast(true);
                                setTimeout(() => setPromoSavedToast(false), 3000);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Display This Promotion
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromoItem(promo);
                              setPromoModalTitle(promo.title);
                              setPromoModalCategory(promo.category || 'Cars & Automobile Electronics');
                              setPromoModalBadge(promo.badgeText);
                              setPromoModalText(promo.text);
                              setPromoModalActionText(promo.actionText);
                              setPromoModalActionLink(promo.actionLink);
                              setPromoModalTheme(promo.theme);
                              setPromoModalDismissible(promo.isDismissible);
                              setPromoModalMakeActive(promo.isActive);
                              setShowPromoModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete promotion "${promo.title}"?`)) {
                                deleteWebsitePromotion(promo.id);
                                setToastMessage(`Promotion "${promo.title}" deleted.`);
                                setPromoSavedToast(true);
                                setTimeout(() => setPromoSavedToast(false), 3000);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT / CREATE HARDWARE REPAIR CATALOG ITEM */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-white/20 p-6 space-y-6 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#5ED29C]" />
                  {editingCatalogItem ? 'Edit Repair Service Catalog Item' : 'Create Repair Service Catalog Item'}
                </h2>
                <p className="text-xs text-white/50">Update services shown on public /repairs page.</p>
              </div>

              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!catTitle.trim() || !catPrice.trim() || !catDesc.trim()) return;

                if (editingCatalogItem) {
                  updateHardwareRepairCatalogItem(editingCatalogItem.id, {
                    category: catCategory,
                    title: catTitle,
                    estPrice: catPrice,
                    desc: catDesc,
                    warrantyDays: Number(catWarranty),
                  });
                } else {
                  addHardwareRepairCatalogItem({
                    category: catCategory,
                    title: catTitle,
                    estPrice: catPrice,
                    desc: catDesc,
                    warrantyDays: Number(catWarranty),
                  });
                }
                setShowCatalogModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Device Category *</label>
                  <select
                    value={catCategory}
                    onChange={(e) => setCatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="desktop">Desktop &amp; Gaming PC</option>
                    <option value="laptop">Laptop &amp; Notebook</option>
                    <option value="mac">Apple Mac &amp; Logic Board</option>
                    <option value="phone">Smartphone &amp; Tablet</option>
                    <option value="printer">Printer &amp; Scanner</option>
                    <option value="datarecovery">Cleanroom Data Recovery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Estimated Price Range *</label>
                  <input
                    type="text"
                    required
                    value={catPrice}
                    onChange={(e) => setCatPrice(e.target.value)}
                    placeholder="e.g. ₹1,200 - ₹4,800"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Service Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  placeholder="e.g. Apple Mac Logic Board Micro-Soldering"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Service Capabilities Description *</label>
                <textarea
                  required
                  rows={4}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Describe micro-soldering capabilities, component replacements..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Warranty Coverage Days</label>
                <input
                  type="number"
                  value={catWarranty}
                  onChange={(e) => setCatWarranty(Number(e.target.value))}
                  placeholder="90"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingCatalogItem ? 'Update Catalog Service' : 'Save Catalog Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / CREATE REPAIR PROCESS STEP */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-white/20 p-6 space-y-6 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5ED29C]" />
                  {editingProcessStep ? 'Edit Repair Process Step' : 'Create Repair Process Step'}
                </h2>
                <p className="text-xs text-white/50">Configure SOP workflow step shown on website.</p>
              </div>

              <button
                onClick={() => setShowProcessModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!stepNumber.trim() || !stepTitle.trim() || !stepDesc.trim()) return;

                if (editingProcessStep) {
                  updateRepairProcessStep(editingProcessStep.id, {
                    step: stepNumber,
                    title: stepTitle,
                    desc: stepDesc,
                  });
                } else {
                  addRepairProcessStep({
                    step: stepNumber,
                    title: stepTitle,
                    desc: stepDesc,
                  });
                }
                setShowProcessModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Step Number / Code *</label>
                <input
                  type="text"
                  required
                  value={stepNumber}
                  onChange={(e) => setStepNumber(e.target.value)}
                  placeholder="e.g. 01, 02, 03, 04"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Step Title *</label>
                <input
                  type="text"
                  required
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  placeholder="e.g. Free Diagnostic & Job Card"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Step Process Description *</label>
                <textarea
                  required
                  rows={4}
                  value={stepDesc}
                  onChange={(e) => setStepDesc(e.target.value)}
                  placeholder="Describe the diagnostics, quote estimate, micro-repair or delivery process..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingProcessStep ? 'Update Process Step' : 'Save Process Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT / CREATE ENTERPRISE SOLUTION */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-white/20 p-6 space-y-6 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#5ED29C]" />
                  {editingSolution ? 'Edit Enterprise IT Solution' : 'Create Enterprise IT Solution'}
                </h2>
                <p className="text-xs text-white/50">Configure dynamic solution card shown on home page grid.</p>
              </div>

              <button
                onClick={() => setShowSolutionModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!solTitle.trim() || !solDesc.trim()) return;

                if (editingSolution) {
                  updateEnterpriseSolution(editingSolution.id, {
                    title: solTitle,
                    desc: solDesc,
                    badge: solBadge,
                    link: solLink,
                    iconName: solIconName,
                  });
                } else {
                  addEnterpriseSolution({
                    title: solTitle,
                    desc: solDesc,
                    badge: solBadge,
                    link: solLink,
                    iconName: solIconName,
                  });
                }
                setShowSolutionModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Badge Tag *</label>
                  <input
                    type="text"
                    required
                    value={solBadge}
                    onChange={(e) => setSolBadge(e.target.value)}
                    placeholder="e.g. Popular, Cleanroom, Enterprise, Custom"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Lucide Icon *</label>
                  <select
                    value={solIconName}
                    onChange={(e) => setSolIconName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="Laptop">Laptop (Laptop &amp; PC)</option>
                    <option value="Cpu">Cpu (Apple Mac / Processors)</option>
                    <option value="HardDrive">HardDrive (Data Recovery)</option>
                    <option value="ShieldAlert">ShieldAlert (CCTV &amp; Security)</option>
                    <option value="Wifi">Wifi (Networking / Cabling)</option>
                    <option value="Server">Server (AMC Contracts)</option>
                    <option value="Monitor">Monitor (Workstations / Gaming)</option>
                    <option value="Layers">Layers (ERP &amp; Software)</option>
                    <option value="Wrench">Wrench (General Repair)</option>
                    <option value="Sparkles">Sparkles (Special Feature)</option>
                    <option value="Building2">Building2 (Corporate Solutions)</option>
                    <option value="CreditCard">CreditCard (Billing / Accounts)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Solution Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={solTitle}
                  onChange={(e) => setSolTitle(e.target.value)}
                  placeholder="e.g. Website Repairs &amp; Maintenance"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Target Link URL *</label>
                <input
                  type="text"
                  required
                  value={solLink}
                  onChange={(e) => setSolLink(e.target.value)}
                  placeholder="e.g. /repairs or /data-recovery or /amc"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Solution Description *</label>
                <textarea
                  required
                  rows={4}
                  value={solDesc}
                  onChange={(e) => setSolDesc(e.target.value)}
                  placeholder="Describe key features, offerings, or service scope..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSolutionModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingSolution ? 'Update Enterprise Solution' : 'Save Enterprise Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT / CREATE DETAILED SERVICE & SPECIFICATIONS */}
      {showDetailedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-2xl w-full rounded-2xl border border-white/20 p-6 space-y-5 bg-[#0D1117] text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#5ED29C]" />
                  {editingDetailed ? 'Edit Detailed Service & Specs' : 'Create Detailed Service & Specs'}
                </h2>
                <p className="text-xs text-white/50">Manage options &amp; live visibility on public /services page.</p>
              </div>

              <button
                onClick={() => setShowDetailedModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!detTitle.trim() || !detShortDesc.trim()) return;

                const featureArray = detFeatures.split('\n').map((f) => f.trim()).filter(Boolean);

                if (editingDetailed) {
                  updateDetailedService(editingDetailed.id, {
                    category: detCategory,
                    badge: detBadge,
                    iconName: detIconName,
                    title: detTitle,
                    shortDesc: detShortDesc,
                    whyChoose: detWhyChoose,
                    features: featureArray,
                    idealFor: detIdealFor,
                    turnaround: detTurnaround,
                    warranty: detWarranty,
                    actionLink: detActionLink,
                    actionText: detActionText,
                    isVisible: detIsVisible,
                  });
                } else {
                  addDetailedService({
                    category: detCategory,
                    badge: detBadge,
                    iconName: detIconName,
                    title: detTitle,
                    shortDesc: detShortDesc,
                    whyChoose: detWhyChoose,
                    features: featureArray,
                    idealFor: detIdealFor,
                    turnaround: detTurnaround,
                    warranty: detWarranty,
                    actionLink: detActionLink,
                    actionText: detActionText,
                    isVisible: detIsVisible,
                  });
                }
                setShowDetailedModal(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Visibility Toggle Switch Header */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Live Website Visibility</span>
                  <span className="text-[11px] text-white/50">Toggle whether this service appears under Full Service Details on the live website.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={detIsVisible}
                    onChange={(e) => setDetIsVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  <span className="ml-2 text-xs font-bold text-white font-mono">{detIsVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Filter Category *</label>
                  <select
                    value={detCategory}
                    onChange={(e) => setDetCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="hardware">Hardware Repair</option>
                    <option value="mac">Apple Mac</option>
                    <option value="datarecovery">Data Recovery</option>
                    <option value="custompc">Custom PCs</option>
                    <option value="cctv">CCTV Security</option>
                    <option value="networking">Networking</option>
                    <option value="amc">Corporate AMC</option>
                    <option value="software">Software ERP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Badge Tag *</label>
                  <input
                    type="text"
                    required
                    value={detBadge}
                    onChange={(e) => setDetBadge(e.target.value)}
                    placeholder="e.g. Micro-Soldering Repair"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Lucide Icon *</label>
                  <select
                    value={detIconName}
                    onChange={(e) => setDetIconName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="Wrench">Wrench (Hardware Repair)</option>
                    <option value="Cpu">Cpu (Apple Mac / Chips)</option>
                    <option value="HardDrive">HardDrive (Data Recovery)</option>
                    <option value="Monitor">Monitor (Custom PCs)</option>
                    <option value="ShieldCheck">ShieldCheck (CCTV Security)</option>
                    <option value="Wifi">Wifi (Networking / Fiber)</option>
                    <option value="Server">Server (AMC Contracts)</option>
                    <option value="Layers">Layers (ERP &amp; Software)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Service Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={detTitle}
                  onChange={(e) => setDetTitle(e.target.value)}
                  placeholder="e.g. Chip-Level Motherboard & Laptop Micro-Repair"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Short Overview Description *</label>
                <textarea
                  required
                  rows={2}
                  value={detShortDesc}
                  onChange={(e) => setDetShortDesc(e.target.value)}
                  placeholder="Brief overview of service capabilities..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Rationale &amp; Reason Behind Service *</label>
                <textarea
                  required
                  rows={3}
                  value={detWhyChoose}
                  onChange={(e) => setDetWhyChoose(e.target.value)}
                  placeholder="Explain why Accno Solution offers this service and the benefit to customers..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white italic focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Key Service Capabilities (One per line) *</label>
                <textarea
                  required
                  rows={4}
                  value={detFeatures}
                  onChange={(e) => setDetFeatures(e.target.value)}
                  placeholder="BGA chip reballing & power IC replacement&#10;Liquid damage oxidation ultrasonic cleaning&#10;Thermal camera short-circuit location tracing"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Target Audience / Ideal For</label>
                  <input
                    type="text"
                    value={detIdealFor}
                    onChange={(e) => setDetIdealFor(e.target.value)}
                    placeholder="e.g. Individual laptop owners, corporate fleets"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">SLA Turnaround Time</label>
                  <input
                    type="text"
                    value={detTurnaround}
                    onChange={(e) => setDetTurnaround(e.target.value)}
                    placeholder="e.g. 24 - 48 Hours"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#16FFC6] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Warranty Coverage</label>
                  <input
                    type="text"
                    value={detWarranty}
                    onChange={(e) => setDetWarranty(e.target.value)}
                    placeholder="e.g. 90 Days Standard Warranty"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Button Link URL</label>
                  <input
                    type="text"
                    value={detActionLink}
                    onChange={(e) => setDetActionLink(e.target.value)}
                    placeholder="/repairs or /data-recovery or /shop"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Button Action Text</label>
                  <input
                    type="text"
                    value={detActionText}
                    onChange={(e) => setDetActionText(e.target.value)}
                    placeholder="e.g. Book Hardware Repair"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDetailedModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingDetailed ? 'Update Service & Specifications' : 'Save Service & Specifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT / CREATE SERVICE HIGHLIGHT STAT */}
      {showStatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-white/20 p-6 space-y-5 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#5ED29C]" />
                  {editingStat ? 'Edit Service Highlight Stat' : 'Create Service Highlight Stat'}
                </h2>
                <p className="text-xs text-white/50">Manage top stat cards shown on public /services page.</p>
              </div>

              <button
                onClick={() => setShowStatModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!statValue.trim() || !statLabel.trim()) return;

                if (editingStat) {
                  updateServiceStat(editingStat.id, {
                    value: statValue,
                    label: statLabel,
                    color: statColor,
                    isVisible: statIsVisible,
                  });
                } else {
                  addServiceStat({
                    value: statValue,
                    label: statLabel,
                    color: statColor,
                    isVisible: statIsVisible,
                  });
                }
                setShowStatModal(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Visibility Switch */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Live Website Visibility</span>
                  <span className="text-[11px] text-white/50">Display on public services page top bar.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statIsVisible}
                    onChange={(e) => setStatIsVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  <span className="ml-2 text-xs font-bold text-white font-mono">{statIsVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Stat Metric Value *</label>
                <input
                  type="text"
                  required
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="e.g. 10+ Years, 15,000+, Class-100, 90 Days"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-sm font-bold text-[#5ED29C] focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Stat Metric Label *</label>
                <input
                  type="text"
                  required
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  placeholder="e.g. Technical Experience, Devices Repaired"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Text Accent Color (Hex Code or Preset)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={statColor || '#5ED29C'}
                    onChange={(e) => setStatColor(e.target.value)}
                    className="w-10 h-9 rounded-xl bg-transparent border border-white/10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={statColor}
                    onChange={(e) => setStatColor(e.target.value)}
                    placeholder="#5ED29C"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {['#5ED29C', '#16FFC6', '#38BDF8', '#818CF8', '#F43F5E', '#F59E0B'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStatColor(preset)}
                      className="w-6 h-6 rounded-full border border-white/20 cursor-pointer"
                      style={{ backgroundColor: preset }}
                      title={`Select ${preset}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowStatModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingStat ? 'Update Stat Highlight' : 'Save Stat Highlight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT / CREATE SERVICE PILLAR */}
      {showPillarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-white/20 p-6 space-y-5 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#5ED29C]" />
                  {editingPillar ? 'Edit Service Pillar & Rationale' : 'Create Service Pillar & Rationale'}
                </h2>
                <p className="text-xs text-white/50">Manage pillar cards under &quot;WHY WE OFFER THESE SPECIFIC SERVICES&quot;</p>
              </div>

              <button
                onClick={() => setShowPillarModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!plrTitle.trim() || !plrDesc.trim()) return;

                if (editingPillar) {
                  updateServicePillar(editingPillar.id, {
                    title: plrTitle,
                    desc: plrDesc,
                    badge: plrBadge,
                    iconName: plrIconName,
                    isVisible: plrIsVisible,
                  });
                } else {
                  addServicePillar({
                    title: plrTitle,
                    desc: plrDesc,
                    badge: plrBadge,
                    iconName: plrIconName,
                    isVisible: plrIsVisible,
                    order: servicePillars.length + 1,
                  });
                }
                setShowPillarModal(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Visibility Switch */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Live Website Visibility</span>
                  <span className="text-[11px] text-white/50">Display on public services page grid.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plrIsVisible}
                    onChange={(e) => setPlrIsVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  <span className="ml-2 text-xs font-bold text-white font-mono">{plrIsVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Badge Tag</label>
                  <input
                    type="text"
                    value={plrBadge}
                    onChange={(e) => setPlrBadge(e.target.value)}
                    placeholder="e.g. Cost Savings, 100% Confidential"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Icon Name</label>
                  <select
                    value={plrIconName}
                    onChange={(e) => setPlrIconName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="DollarSign">DollarSign (Cost Savings)</option>
                    <option value="Shield">Shield (Data Privacy / Confidential)</option>
                    <option value="Zap">Zap (Rapid SLA / Performance)</option>
                    <option value="BarChart3">BarChart3 (ERP / Transparency)</option>
                    <option value="Wrench">Wrench (Hardware Micro-Repair)</option>
                    <option value="Sparkles">Sparkles (Special Capability)</option>
                    <option value="Cpu">Cpu (Mac &amp; Micro-soldering)</option>
                    <option value="HardDrive">HardDrive (Cleanroom Recovery)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Pillar Title / Headline *</label>
                <input
                  type="text"
                  required
                  value={plrTitle}
                  onChange={(e) => setPlrTitle(e.target.value)}
                  placeholder="e.g. Economic Component Repair"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-bold text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Pillar Rationale &amp; Description *</label>
                <textarea
                  required
                  rows={4}
                  value={plrDesc}
                  onChange={(e) => setPlrDesc(e.target.value)}
                  placeholder="Explain the technical and financial reason behind this service..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPillarModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingPillar ? 'Update Service Pillar' : 'Save Service Pillar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT / CREATE SERVICES FAQ */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-white/20 p-6 space-y-5 bg-[#0D1117] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#38BDF8]" />
                  {editingFaq ? 'Edit Services FAQ' : 'Create Services FAQ'}
                </h2>
                <p className="text-xs text-white/50">Manage FAQ item displayed on public /services page.</p>
              </div>

              <button
                onClick={() => setShowFaqModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!faqQuestion.trim() || !faqAnswer.trim()) return;

                if (editingFaq) {
                  updateServicesFaq(editingFaq.id, {
                    question: faqQuestion,
                    answer: faqAnswer,
                    category: faqCategory,
                    isVisible: faqIsVisible,
                  });
                } else {
                  addServicesFaq({
                    question: faqQuestion,
                    answer: faqAnswer,
                    category: faqCategory,
                    isVisible: faqIsVisible,
                    order: servicesFaqs.length + 1,
                  });
                }
                setShowFaqModal(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Visibility Switch */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Live Website Visibility</span>
                  <span className="text-[11px] text-white/50">Display on public services page FAQ list.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqIsVisible}
                    onChange={(e) => setFaqIsVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  <span className="ml-2 text-xs font-bold text-white font-mono">{faqIsVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Category / Topic Tag *</label>
                <input
                  type="text"
                  required
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  placeholder="e.g. Warranty & SLA, Data Privacy, Live Tracking, Pricing"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">FAQ Question Headline *</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. How does your 90-day repair warranty work?"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-bold text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">FAQ Answer Explanation *</label>
                <textarea
                  required
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Provide a detailed, helpful answer for customers..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 8: EDIT / CREATE WEBSITE PROMOTION (INCLUDING CAR PROMOTIONS) */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/20 p-6 space-y-5 bg-[#0D1117] text-white my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  promoModalCategory?.toLowerCase().includes('car')
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-[#5ED29C]/10 border-[#5ED29C]/30 text-[#5ED29C]'
                }`}>
                  {promoModalCategory?.toLowerCase().includes('car') ? (
                    <Car className="w-5 h-5" />
                  ) : (
                    <Megaphone className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                    {editingPromoItem
                      ? 'Edit Promotion Campaign'
                      : promoModalCategory?.toLowerCase().includes('car')
                      ? 'Create Car Promotion Campaign'
                      : 'Create Promotion Campaign'}
                  </h2>
                  <p className="text-xs text-white/50">
                    Set up announcement text, banner badge, button action, and live display status.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPromoModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Preset Templates */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-extrabold uppercase text-white/70 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick 1-Click Templates (Auto-Fill Form)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPromoModalTitle('Car ECM & Infotainment Repair Special');
                    setPromoModalCategory('Cars & Automobile Electronics');
                    setPromoModalBadge('CAR SPECIAL');
                    setPromoModalText('🚗 CAR ELECTRONICS: Up to 20% OFF on Car ECM/ECU Diagnostics, Touchscreen Infotainment & Dashboard Repairs!');
                    setPromoModalActionText('Book Car Service →');
                    setPromoModalActionLink('/book-repair');
                    setPromoModalTheme('cyan');
                  }}
                  className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left text-xs text-cyan-300 font-bold transition-all cursor-pointer"
                >
                  <div className="text-[11px] flex items-center gap-1">🚗 Car ECM / ECU</div>
                  <div className="text-[9px] text-white/50 font-normal">Motherboard &amp; Chips</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromoModalTitle('Car Audio, Stereo & Reverse Camera Overhaul');
                    setPromoModalCategory('Cars & Automobile Electronics');
                    setPromoModalBadge('CAR AUDIO LAB');
                    setPromoModalText('🚘 AUTO AUDIO & DISPLAY: Precision component diagnostics for dead car stereos, amplifiers & reverse camera modules.');
                    setPromoModalActionText('Explore Repairs →');
                    setPromoModalActionLink('/repairs');
                    setPromoModalTheme('amber');
                  }}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left text-xs text-amber-300 font-bold transition-all cursor-pointer"
                >
                  <div className="text-[11px] flex items-center gap-1">🚘 Car Audio / Stereo</div>
                  <div className="text-[9px] text-white/50 font-normal">Infotainment &amp; GPS</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromoModalTitle('Digital Speedometer & Automotive Sensor Repair');
                    setPromoModalCategory('Cars & Automobile Electronics');
                    setPromoModalBadge('AUTO SENSORS');
                    setPromoModalText('🛠️ VEHICLE ELECTRONICS: Micro-soldering & recalibration for car instrument clusters, ABS modules & sensors.');
                    setPromoModalActionText('Contact Lab →');
                    setPromoModalActionLink('/contact');
                    setPromoModalTheme('purple');
                  }}
                  className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left text-xs text-purple-300 font-bold transition-all cursor-pointer"
                >
                  <div className="text-[11px] flex items-center gap-1">🛠️ Car Cluster &amp; Sensors</div>
                  <div className="text-[9px] text-white/50 font-normal">Dashboard modules</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromoModalTitle('Laptop & Apple Mac Chip-Level Repairs (20% OFF)');
                    setPromoModalCategory('Laptops & Computers');
                    setPromoModalBadge('LIMITED TIME OFFER');
                    setPromoModalText('⚡ SPECIAL OFFER: Get Up to 20% OFF on Laptop & Apple Mac Chip-Level Repairs! Free Pick & Drop Across Jammu.');
                    setPromoModalActionText('Book Repair Now →');
                    setPromoModalActionLink('/book-repair');
                    setPromoModalTheme('emerald');
                  }}
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left text-xs text-emerald-300 font-bold transition-all cursor-pointer"
                >
                  <div className="text-[11px] flex items-center gap-1">💻 Laptop &amp; Mac</div>
                  <div className="text-[9px] text-white/50 font-normal">Chip-level 20% off</div>
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!promoModalTitle.trim() || !promoModalText.trim()) return;

                if (editingPromoItem) {
                  updateWebsitePromotion(editingPromoItem.id, {
                    title: promoModalTitle,
                    category: promoModalCategory,
                    badgeText: promoModalBadge,
                    text: promoModalText,
                    actionText: promoModalActionText,
                    actionLink: promoModalActionLink,
                    theme: promoModalTheme,
                    isDismissible: promoModalDismissible,
                    isActive: promoModalMakeActive,
                  });
                  if (promoModalMakeActive) {
                    selectActivePromotion(editingPromoItem.id);
                  }
                  setToastMessage(`Promotion "${promoModalTitle}" updated successfully!`);
                } else {
                  addWebsitePromotion({
                    title: promoModalTitle,
                    category: promoModalCategory,
                    badgeText: promoModalBadge,
                    text: promoModalText,
                    actionText: promoModalActionText,
                    actionLink: promoModalActionLink,
                    theme: promoModalTheme,
                    isDismissible: promoModalDismissible,
                    isActive: promoModalMakeActive,
                  });
                  setToastMessage(`New promotion "${promoModalTitle}" created successfully!`);
                }

                setPromoSavedToast(true);
                setTimeout(() => setPromoSavedToast(false), 3500);
                setShowPromoModal(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Category & Campaign Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/80 font-bold uppercase text-[11px]">Promotion Category *</label>
                  <select
                    value={promoModalCategory}
                    onChange={(e) => setPromoModalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/15 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="Cars & Automobile Electronics">🚗 Cars &amp; Automobile Electronics</option>
                    <option value="Laptops & Computers">💻 Laptops &amp; Computers</option>
                    <option value="Apple Mac & Logic Board">🍎 Apple Mac &amp; Logic Board</option>
                    <option value="CCTV & Security">📹 CCTV &amp; Security Surveillance</option>
                    <option value="Corporate IT & AMC">🏢 Corporate IT &amp; AMC Packages</option>
                    <option value="Data Recovery & Cleanroom">💾 Cleanroom Data Recovery</option>
                    <option value="Festival & Seasonal">🎉 Festival &amp; Seasonal Offers</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 font-bold uppercase text-[11px]">Campaign Title / Internal Name *</label>
                  <input
                    type="text"
                    required
                    value={promoModalTitle}
                    onChange={(e) => setPromoModalTitle(e.target.value)}
                    placeholder="e.g. Car ECM & Infotainment Repair Special"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-bold text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              {/* Announcement Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-white/80 font-bold uppercase text-[11px]">
                    Announcement Headline Message *
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">
                    {promoModalText.length} characters (Recommended: 60 - 140 chars)
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={promoModalText}
                  onChange={(e) => setPromoModalText(e.target.value)}
                  placeholder="e.g. 🚗 CAR ELECTRONICS: Up to 20% OFF on Car ECM/ECU Diagnostics, Touchscreen Infotainment & Dashboard Repairs!"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#5ED29C]"
                />
                <p className="text-[10px] text-white/40">
                  Tip: Include emojis like 🚗, 🚘, ⚡, 🛠️, 💻, 🔥 to make the banner eye-catching.
                </p>
              </div>

              {/* Badge Tag & Button Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-white/80 font-bold uppercase text-[11px]">Badge Tag Text</label>
                  <input
                    type="text"
                    value={promoModalBadge}
                    onChange={(e) => setPromoModalBadge(e.target.value)}
                    placeholder="e.g. CAR SPECIAL"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#5ED29C] font-bold focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 font-bold uppercase text-[11px]">CTA Button Label</label>
                  <input
                    type="text"
                    value={promoModalActionText}
                    onChange={(e) => setPromoModalActionText(e.target.value)}
                    placeholder="e.g. Book Car Service →"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 font-bold uppercase text-[11px]">Target Destination Link *</label>
                  <input
                    type="text"
                    required
                    value={promoModalActionLink}
                    onChange={(e) => setPromoModalActionLink(e.target.value)}
                    placeholder="e.g. /book-repair or /services"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              {/* Visual Color Scheme */}
              <div className="space-y-1.5">
                <label className="text-white/80 font-bold uppercase text-[11px]">Visual Color Scheme Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'emerald' as const, name: 'Emerald', sub: 'Signature Tech', dot: 'bg-[#16FFC6]', bg: 'from-[#031A11] to-[#072B1E]', border: 'border-[#5ED29C]' },
                    { id: 'cyan' as const, name: 'Cyan', sub: 'Cyber Blue', dot: 'bg-cyan-300', bg: 'from-[#031826] to-[#06283D]', border: 'border-cyan-400' },
                    { id: 'amber' as const, name: 'Amber', sub: 'Urgent Gold', dot: 'bg-amber-300', bg: 'from-[#241302] to-[#381F04]', border: 'border-amber-400' },
                    { id: 'purple' as const, name: 'Purple', sub: 'Royal Violet', dot: 'bg-purple-300', bg: 'from-[#1A0426] to-[#2D0940]', border: 'border-purple-400' },
                    { id: 'rose' as const, name: 'Rose', sub: 'Hot Deals', dot: 'bg-rose-300', bg: 'from-[#24040D] to-[#3B0715]', border: 'border-rose-400' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setPromoModalTheme(thm.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer bg-gradient-to-br ${thm.bg} ${
                        promoModalTheme === thm.id
                          ? `${thm.border} ring-2 ring-white/20 shadow-lg scale-102`
                          : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-2 h-2 rounded-full ${thm.dot}`} />
                        <span className="text-xs font-bold text-white">{thm.name}</span>
                      </div>
                      <span className="text-[9px] text-white/50 block">{thm.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options: Dismissible & Immediate Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">Allow Close (&apos;X&apos;)</span>
                    <span className="text-[10px] text-white/50">Visitors can dismiss per session.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoModalDismissible}
                      onChange={(e) => setPromoModalDismissible(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-300 text-xs block">Display on Website Now</span>
                    <span className="text-[10px] text-emerald-400/70">Set as live banner immediately.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoModalMakeActive}
                      onChange={(e) => setPromoModalMakeActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5ED29C]"></div>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingPromoItem ? 'Update Promotion' : 'Save & Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
