'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Monitor, Cloud, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, HelpCircle, FileText, X, Building2, User, Phone, Mail, MapPin, Check } from 'lucide-react';
import Link from 'next/link';
import { useErpStore } from '@/lib/store';

export default function MargERPSection() {
  const { addSupportLead } = useErpStore();

  // Product & Calculator Mode State
  const [productTab, setProductTab] = useState<'erpedition' | 'margbooks'>('erpedition');
  const [calcTab, setCalcTab] = useState<'license' | 'renewal'>('license');

  // Desktop ERP Calculator States
  const [calcEdition, setCalcEdition] = useState<'nano' | 'basic' | 'silver' | 'gold'>('silver');
  const [calcUsers, setCalcUsers] = useState(1);
  const [calcCompanies, setCalcCompanies] = useState(1);
  const [calcGstExtra, setCalcGstExtra] = useState(true);
  const [calcTotal, setCalcTotal] = useState(0);

  const [breakdown, setBreakdown] = useState({
    basePrice: 0,
    extraUserCost: 0,
    extraCoCost: 0,
    licenseSubtotal: 0,
    gstSubtotal: 0,
  });

  // ERP Renewal States
  const [renewalEdition, setRenewalEdition] = useState<'nano' | 'basic' | 'silver' | 'gold'>('silver');
  const [renewalUsers, setRenewalUsers] = useState(1);
  const [renewalCompanies, setRenewalCompanies] = useState(1);
  const [renewalQty, setRenewalQty] = useState(1);
  const [renewalTotal, setRenewalTotal] = useState(0);

  const [renewalBreakdown, setRenewalBreakdown] = useState({
    baseRenewal: 0,
    extraUsersRenewal: 0,
    extraCosRenewal: 0,
    subtotalPerLicense: 0,
    totalSubtotal: 0,
    gstSubtotal: 0,
  });

  // Cloud MargBooks States
  const [mbEdition, setMbEdition] = useState<'gold' | 'diamond' | 'platinum' | 'platinum_plus'>('gold');
  const [mbDuration, setMbDuration] = useState('1');
  const [mbTotal, setMbTotal] = useState(0);

  // Lead Generation Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');

  // Form Fields
  const [licenseNo, setLicenseNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // 1. Calculate Desktop ERP Setup Pricing
  useEffect(() => {
    let basePrice = 0;
    let extraUsersCost = 0;
    let extraCosCost = 0;

    if (calcEdition === 'nano') {
      basePrice = 5550;
    } else if (calcEdition === 'basic') {
      basePrice = 10300;
    } else if (calcEdition === 'silver') {
      basePrice = 13900;
      const extraUsers = Math.max(0, calcUsers - 2);
      const extraCos = Math.max(0, calcCompanies - 1);
      extraUsersCost = extraUsers * 3000;
      extraCosCost = extraCos * 3000;
    } else if (calcEdition === 'gold') {
      basePrice = 26000;
    }

    const subtotal = basePrice + extraUsersCost + extraCosCost;
    const gst = calcGstExtra ? Math.round(subtotal * 0.18) : 0;
    const total = subtotal + gst;

    setBreakdown({
      basePrice,
      extraUserCost: extraUsersCost,
      extraCoCost: extraCosCost,
      licenseSubtotal: subtotal,
      gstSubtotal: gst,
    });
    setCalcTotal(total);
  }, [calcEdition, calcUsers, calcCompanies, calcGstExtra]);

  // 2. Calculate Desktop ERP Renewal Pricing
  useEffect(() => {
    let baseRenewal = 0;
    let extraUsersRenewal = 0;
    let extraCosRenewal = 0;

    if (renewalEdition === 'nano') {
      baseRenewal = 2400;
    } else if (renewalEdition === 'basic') {
      baseRenewal = 3990;
    } else if (renewalEdition === 'silver') {
      baseRenewal = 4780;
      const extraUsers = Math.max(0, renewalUsers - 2);
      const extraCos = Math.max(0, renewalCompanies - 1);
      extraUsersRenewal = extraUsers * 1050;
      extraCosRenewal = extraCos * 1030;
    } else if (renewalEdition === 'gold') {
      baseRenewal = 19100;
    }

    const subtotalPerLic = baseRenewal + extraUsersRenewal + extraCosRenewal;
    const totalSub = subtotalPerLic * renewalQty;
    const gst = calcGstExtra ? Math.round(totalSub * 0.18) : 0;
    const total = totalSub + gst;

    setRenewalBreakdown({
      baseRenewal,
      extraUsersRenewal,
      extraCosRenewal,
      subtotalPerLicense: subtotalPerLic,
      totalSubtotal: totalSub,
      gstSubtotal: gst,
    });
    setRenewalTotal(total);
  }, [renewalEdition, renewalUsers, renewalCompanies, renewalQty, calcGstExtra]);

  // 3. Calculate Cloud MargBooks Pricing
  useEffect(() => {
    let annualRate = 2999;
    if (mbEdition === 'diamond') annualRate = 4999;
    if (mbEdition === 'platinum') annualRate = 7999;
    if (mbEdition === 'platinum_plus') annualRate = 11999;

    const years = parseInt(mbDuration, 10);
    const subtotal = annualRate * years;
    const gst = calcGstExtra ? Math.round(subtotal * 0.18) : 0;

    setMbTotal(subtotal + gst);
  }, [mbEdition, mbDuration, calcGstExtra]);

  interface TierItem {
    id: string;
    name: string;
    price: string;
    renewal?: string;
    users: string;
    cos?: string;
    features: string[];
    popular?: boolean;
  }

  const desktopTiers: TierItem[] = [
    {
      id: 'nano',
      name: 'Nano Edition',
      price: '₹5,550',
      renewal: '₹2,400/yr ARC',
      users: 'Max 2 Users',
      cos: 'Max 2 Companies',
      features: ['Basic Billing & Invoicing', 'GST R1 / R2 / 3B Reports', 'Barcode Label Printing', 'Single Counter Operation'],
    },
    {
      id: 'basic',
      name: 'Basic Edition',
      price: '₹10,300',
      renewal: '₹3,990/yr ARC',
      users: 'Max 2 Users',
      cos: 'Max 2 Companies',
      features: ['Advanced Inventory Tracking', 'e-Way Bill & e-Invoicing', 'WhatsApp & SMS Invoice Alert', 'Multi-Rate Tax Structure'],
    },
    {
      id: 'silver',
      name: 'Silver Edition',
      price: '₹13,900',
      renewal: '₹4,780/yr ARC',
      users: 'Covers 2 Users (+₹3,000/extra user)',
      cos: 'Covers 1 Company (+₹3,000/extra co)',
      features: ['Multi-User LAN Counter Sync', 'Batch & Expiry Date Management', 'Repair Job Card & Service Desk', 'Financial Accounting & P&L'],
      popular: true,
    },
    {
      id: 'gold',
      name: 'Gold Edition',
      price: '₹26,000',
      renewal: '₹19,100/yr ARC',
      users: 'Unlimited Users',
      cos: 'Unlimited Companies',
      features: ['Enterprise Multi-Branch ERP', 'Multi-Store Inventory Auto-Sync', 'Custom Repair Shop ERP Flow', 'Audit Trail & Role Controls'],
    },
  ];

  const cloudTiers: TierItem[] = [
    {
      id: 'gold',
      name: 'Gold Cloud Plan',
      price: '₹2,999/yr',
      users: 'Single User Access',
      features: ['Cloud Invoicing & Billing', 'Mobile App Access (Android/iOS)', 'Automated Cloud Backups', 'Basic GST Return Filing'],
    },
    {
      id: 'diamond',
      name: 'Diamond Cloud Plan',
      price: '₹4,999/yr',
      users: 'Up to 3 Users',
      features: ['Multi-User Cloud Sync', 'E-Way Bill & E-Invoice Integration', 'Bank Auto-Reconciliation', 'Inventory Stock Alerts'],
      popular: true,
    },
    {
      id: 'platinum',
      name: 'Platinum Cloud Plan',
      price: '₹7,999/yr',
      users: 'Up to 5 Users',
      features: ['Custom POS Receipt Designer', 'Barcode Thermal Label Generator', 'Multi-Branch Warehouses', '24x7 Priority Support'],
    },
    {
      id: 'platinum_plus',
      name: 'Platinum Plus Cloud Plan',
      price: '₹11,999/yr',
      users: 'Unlimited Cloud Users',
      features: ['Enterprise Cloud Accounting', 'Custom API & WhatsApp Integration', 'Dedicated Account Engineer', 'Complete Repair Shop ERP'],
    },
  ];

  const handleOpenLeadModal = () => {
    setIsSuccessSubmitted(false);
    setIsLeadModalOpen(true);
  };

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !businessName.trim()) return;

    let packageTitle = '';
    let modeText = '';
    let totalQuoted = 0;
    let scopeDetails = '';

    if (productTab === 'erpedition') {
      if (calcTab === 'license') {
        packageTitle = `Marg ERP Desktop - ${calcEdition.toUpperCase()} Edition`;
        modeText = 'New License Setup Quote';
        totalQuoted = calcTotal;
        scopeDetails = `Users: ${calcUsers}, Cos: ${calcCompanies}, Base: ₹${breakdown.basePrice.toLocaleString('en-IN')}`;
      } else {
        packageTitle = `Marg ERP Desktop - ${renewalEdition.toUpperCase()} Edition`;
        modeText = 'Annual Support Renewal (ARC)';
        totalQuoted = renewalTotal;
        scopeDetails = `Users: ${renewalUsers}, Cos: ${renewalCompanies}, Qty: ${renewalQty}, Base ARC: ₹${renewalBreakdown.baseRenewal.toLocaleString('en-IN')}`;
      }
    } else {
      packageTitle = `MargBooks Cloud - ${mbEdition.toUpperCase()} Plan`;
      modeText = 'Cloud Subscription Request';
      totalQuoted = mbTotal;
      scopeDetails = `Duration: ${mbDuration} Year(s)`;
    }

    const leadSubject = `[ERP ${modeText.toUpperCase()}] ${packageTitle} - ₹${totalQuoted.toLocaleString('en-IN')}`;
    
    const messageContent = `--- CLIENT & LICENSE DETAILS ---
License Number: ${licenseNo.trim() || 'N/A (New License Request)'}
Customer Name: ${customerName.trim()}
Business / Firm Name: ${businessName.trim()}
Address & City: ${address.trim() || 'Not Provided'}
Phone Number: ${phone.trim()}
Email Address: ${email.trim() || 'Not Provided'}

--- QUOTATION CALCULATION SUMMARY ---
Product Line: ${productTab === 'erpedition' ? 'Marg ERP Desktop Software' : 'MargBooks Cloud ERP'}
Selected Package: ${packageTitle}
Request Mode: ${modeText}
Configuration Scope: ${scopeDetails}
Grand Total Quoted: ₹${totalQuoted.toLocaleString('en-IN')} (18% GST ${calcGstExtra ? 'Included' : 'Excluded'})

Client Remarks / Requirements:
${notes.trim() || 'No additional remarks provided.'}`;

    // Submit Lead to ERP Store
    addSupportLead({
      lead_name: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'client@erp.com',
      company: businessName.trim(),
      subject: leadSubject,
      message: messageContent,
      service_interested: 'Custom Repair Shop ERP & Marg Software',
      status: 'New Inquiry',
      source: 'ERP Software Quote',
      formCategory: 'erp_quote',
      licenseNo: licenseNo.trim() || undefined,
      orderTotal: totalQuoted,
      created_at: new Date().toISOString(),
    });

    const refNo = `REF-QUOTE-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRefId(refNo);
    setIsSuccessSubmitted(true);
  };

  return (
    <div className="w-full bg-[#070B0A] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16FFC6]/10 border border-[#16FFC6]/30 text-[#16FFC6] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Interactive Pricing & Quotation Widget
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            CUSTOM REPAIR SHOP ERP & MARG SOFTWARE<span className="text-[#16FFC6]">.</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Transparent licensing, instant quotation calculation, and annual renewal breakdown for Desktop ERP & Cloud MargBooks.
          </p>
        </div>

        {/* Product Switcher (Top Pills) */}
        <div className="flex justify-center">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
            <button
              onClick={() => setProductTab('erpedition')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                productTab === 'erpedition'
                  ? 'bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#16FFC6]/25 scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-4 h-4" /> Marg ERP (Desktop License)
            </button>
            <button
              onClick={() => setProductTab('margbooks')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                productTab === 'margbooks'
                  ? 'bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#16FFC6]/25 scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cloud className="w-4 h-4" /> MargBooks (Cloud ERP)
            </button>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Tier Overview Cards - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#16FFC6]" />
                {productTab === 'erpedition' ? 'Desktop ERP License Tiers' : 'Cloud MargBooks Subscription Tiers'}
              </h3>
              <span className="text-xs text-white/50 font-mono">
                {productTab === 'erpedition' ? 'One-time setup + annual renewal' : 'Annual cloud subscription'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(productTab === 'erpedition' ? desktopTiers : cloudTiers).map((tier) => (
                <div
                  key={tier.id}
                  className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    (productTab === 'erpedition' && calcEdition === tier.id) ||
                    (productTab === 'margbooks' && mbEdition === tier.id)
                      ? 'bg-white/10 border-[#16FFC6] shadow-xl shadow-[#16FFC6]/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 right-4 bg-[#16FFC6] text-[#070B0A] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-md">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase text-white/60 mb-1">{tier.name}</div>
                    <div className="text-2xl font-black text-[#16FFC6]">{tier.price}</div>
                    {tier.renewal && <div className="text-[11px] font-mono text-white/50 mt-0.5">{tier.renewal}</div>}
                    <div className="text-xs font-bold text-white/90 mt-2 pb-3 border-b border-white/10">{tier.users}</div>

                    <ul className="mt-3 space-y-1.5 text-[11px] text-white/70">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16FFC6] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (productTab === 'erpedition') {
                        setCalcEdition(tier.id as any);
                        setRenewalEdition(tier.id as any);
                      } else {
                        setMbEdition(tier.id as any);
                      }
                    }}
                    className={`mt-5 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      (productTab === 'erpedition' && calcEdition === tier.id) ||
                      (productTab === 'margbooks' && mbEdition === tier.id)
                        ? 'bg-[#16FFC6] text-[#070B0A]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {(productTab === 'erpedition' && calcEdition === tier.id) ||
                    (productTab === 'margbooks' && mbEdition === tier.id)
                      ? 'Selected Tier'
                      : 'Select Tier'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Live Quotation Calculator - 5 cols) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#16FFC6]" />
                <h3 className="text-lg font-extrabold uppercase tracking-wider text-white">Live Quote Calculator</h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-white/70 cursor-pointer select-none">18% GST</label>
                <button
                  type="button"
                  onClick={() => setCalcGstExtra(!calcGstExtra)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${calcGstExtra ? 'bg-[#16FFC6]' : 'bg-white/20'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#070B0A] transition-transform ${calcGstExtra ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {productTab === 'erpedition' ? (
              <>
                {/* Mode Switcher: Setup vs Renewal */}
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setCalcTab('license')}
                    className={`py-2 rounded-lg transition-all ${calcTab === 'license' ? 'bg-[#16FFC6] text-[#070B0A]' : 'text-white/60 hover:text-white'}`}
                  >
                    New Setup Quote
                  </button>
                  <button
                    onClick={() => setCalcTab('renewal')}
                    className={`py-2 rounded-lg transition-all ${calcTab === 'renewal' ? 'bg-[#16FFC6] text-[#070B0A]' : 'text-white/60 hover:text-white'}`}
                  >
                    Annual Renewal (ARC)
                  </button>
                </div>

                {calcTab === 'license' ? (
                  /* New License Setup Form */
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1 uppercase">Select Edition Tier</label>
                      <select
                        value={calcEdition}
                        onChange={(e) => setCalcEdition(e.target.value as any)}
                        className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold focus:border-[#16FFC6] outline-none"
                      >
                        <option value="nano">Nano Edition (₹5,550)</option>
                        <option value="basic">Basic Edition (₹10,300)</option>
                        <option value="silver">Silver Edition (₹13,900)</option>
                        <option value="gold">Gold Edition (₹26,000)</option>
                      </select>
                    </div>

                    {calcEdition === 'silver' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 font-semibold mb-1">Total Users</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={calcUsers}
                            onChange={(e) => setCalcUsers(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2 text-white font-mono font-bold"
                          />
                          <span className="text-[10px] text-white/40 mt-0.5 block">Covers 2 (+₹3,000/extra)</span>
                        </div>
                        <div>
                          <label className="block text-white/70 font-semibold mb-1">Total Companies</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={calcCompanies}
                            onChange={(e) => setCalcCompanies(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2 text-white font-mono font-bold"
                          />
                          <span className="text-[10px] text-white/40 mt-0.5 block">Covers 1 (+₹3,000/extra)</span>
                        </div>
                      </div>
                    )}

                    {/* Breakdown Summary */}
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-white/70">
                        <span>Base Edition Price:</span>
                        <span>₹{breakdown.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      {breakdown.extraUserCost > 0 && (
                        <div className="flex justify-between text-white/70">
                          <span>Extra Users Surcharge:</span>
                          <span>+₹{breakdown.extraUserCost.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {breakdown.extraCoCost > 0 && (
                        <div className="flex justify-between text-white/70">
                          <span>Extra Companies Surcharge:</span>
                          <span>+₹{breakdown.extraCoCost.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white/70 pt-1 border-t border-white/10">
                        <span>Subtotal:</span>
                        <span>₹{breakdown.licenseSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {calcGstExtra && (
                        <div className="flex justify-between text-[#16FFC6]/80">
                          <span>GST (18%):</span>
                          <span>+₹{breakdown.gstSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-extrabold text-[#16FFC6] pt-2 border-t border-white/20 font-sans">
                        <span>Grand Total:</span>
                        <span>₹{calcTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Renewal ARC Form */
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1 uppercase">Select Renewal Edition</label>
                      <select
                        value={renewalEdition}
                        onChange={(e) => setRenewalEdition(e.target.value as any)}
                        className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold focus:border-[#16FFC6] outline-none"
                      >
                        <option value="nano">Nano Edition (₹2,400/yr)</option>
                        <option value="basic">Basic Edition (₹3,990/yr)</option>
                        <option value="silver">Silver Edition (₹4,780/yr)</option>
                        <option value="gold">Gold Edition (₹19,100/yr)</option>
                      </select>
                    </div>

                    {renewalEdition === 'silver' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 font-semibold mb-1">Users Count</label>
                          <input
                            type="number"
                            min={1}
                            value={renewalUsers}
                            onChange={(e) => setRenewalUsers(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2 text-white font-mono font-bold"
                          />
                          <span className="text-[10px] text-white/40 mt-0.5 block">+₹1,050/extra user ARC</span>
                        </div>
                        <div>
                          <label className="block text-white/70 font-semibold mb-1">Companies Count</label>
                          <input
                            type="number"
                            min={1}
                            value={renewalCompanies}
                            onChange={(e) => setRenewalCompanies(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2 text-white font-mono font-bold"
                          />
                          <span className="text-[10px] text-white/40 mt-0.5 block">+₹1,030/extra co ARC</span>
                        </div>
                      </div>
                    )}

                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-white/70">
                        <span>Base ARC Renewal:</span>
                        <span>₹{renewalBreakdown.baseRenewal.toLocaleString('en-IN')}</span>
                      </div>
                      {renewalBreakdown.extraUsersRenewal > 0 && (
                        <div className="flex justify-between text-white/70">
                          <span>Extra Users ARC:</span>
                          <span>+₹{renewalBreakdown.extraUsersRenewal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {renewalBreakdown.extraCosRenewal > 0 && (
                        <div className="flex justify-between text-white/70">
                          <span>Extra Co ARC:</span>
                          <span>+₹{renewalBreakdown.extraCosRenewal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {calcGstExtra && (
                        <div className="flex justify-between text-[#16FFC6]/80 pt-1 border-t border-white/10">
                          <span>GST (18%):</span>
                          <span>+₹{renewalBreakdown.gstSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-extrabold text-[#16FFC6] pt-2 border-t border-white/20 font-sans">
                        <span>Total Renewal Price:</span>
                        <span>₹{renewalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Cloud MargBooks Form */
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">Select Cloud Plan</label>
                  <select
                    value={mbEdition}
                    onChange={(e) => setMbEdition(e.target.value as any)}
                    className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold focus:border-[#16FFC6] outline-none"
                  >
                    <option value="gold">Gold Cloud Plan (₹2,999/yr)</option>
                    <option value="diamond">Diamond Cloud Plan (₹4,999/yr)</option>
                    <option value="platinum">Platinum Cloud Plan (₹7,999/yr)</option>
                    <option value="platinum_plus">Platinum Plus Cloud Plan (₹11,999/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">Subscription Duration</label>
                  <select
                    value={mbDuration}
                    onChange={(e) => setMbDuration(e.target.value)}
                    className="w-full bg-[#070B0A] border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold focus:border-[#16FFC6] outline-none"
                  >
                    <option value="1">1 Year Subscription</option>
                    <option value="2">2 Years Subscription</option>
                    <option value="3">3 Years Subscription</option>
                  </select>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/70">
                    <span>Cloud Plan Duration:</span>
                    <span>{mbDuration} Year(s)</span>
                  </div>
                  {calcGstExtra && (
                    <div className="flex justify-between text-[#16FFC6]/80 pt-1 border-t border-white/10">
                      <span>GST (18%):</span>
                      <span>Included / Added</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-[#16FFC6] pt-2 border-t border-white/20 font-sans">
                    <span>Total Cloud Cost:</span>
                    <span>₹{mbTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trigger Lead Modal Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenLeadModal}
                className="w-full py-3.5 bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#16FFC6]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>
                  {productTab === 'erpedition'
                    ? calcTab === 'license'
                      ? 'Request Official License Setup Quotation'
                      : 'Request Support Renewal Invoice'
                    : 'Request MargBooks Cloud Subscription'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LEAD DETAILS SUBMISSION MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#16FFC6]/40 max-w-lg w-full relative space-y-5 bg-[#070B0A] text-white shadow-2xl">
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccessSubmitted ? (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#16FFC6] bg-[#16FFC6]/10 border border-[#16FFC6]/30 px-3 py-1 rounded-full">
                    <FileText className="w-3.5 h-3.5" /> Direct Lead Registration
                  </div>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                    {productTab === 'erpedition'
                      ? calcTab === 'license'
                        ? 'Official License Setup Quotation Form'
                        : 'Support Renewal Invoice Request Form'
                      : 'MargBooks Cloud Subscription Request Form'}
                  </h3>
                  <p className="text-xs text-white/60">
                    Enter your client information to generate an official lead ticket in our ERP Software Desk.
                  </p>
                </div>

                {/* Quoted Calculation Summary Badge */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>Package Requested:</span>
                    <span className="text-[#16FFC6] font-bold">
                      {productTab === 'erpedition'
                        ? `Marg ERP ${calcTab === 'license' ? calcEdition.toUpperCase() : renewalEdition.toUpperCase()}`
                        : `MargBooks Cloud ${mbEdition.toUpperCase()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Quote Type:</span>
                    <span>{productTab === 'erpedition' ? (calcTab === 'license' ? 'New License Setup' : 'Annual Renewal (ARC)') : 'Cloud Subscription'}</span>
                  </div>
                  <div className="flex justify-between text-white font-extrabold pt-1 border-t border-white/10 text-sm font-sans">
                    <span>Calculated Total:</span>
                    <span className="text-[#16FFC6]">
                      ₹{(productTab === 'erpedition' ? (calcTab === 'license' ? calcTotal : renewalTotal) : mbTotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLeadFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      License Number / Existing Serial <span className="text-white/40 font-normal">(Optional for New Setup, Required for ARC)</span>
                    </label>
                    <input
                      type="text"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      placeholder="e.g. MARG-789012 or LIC-4451"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-[#16FFC6]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Customer Name <span className="text-[#16FFC6]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Business / Firm Name <span className="text-[#16FFC6]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Tech Logics Pvt Ltd"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Phone Number <span className="text-[#16FFC6]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765-43210"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Email Address <span className="text-[#16FFC6]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. contact@techlogics.com"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Address &amp; Location</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Main Market, Sanchore, Rajasthan"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#16FFC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Additional Requirements / Remarks</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional notes or customization requests..."
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#16FFC6]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsLeadModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#16FFC6]/20 transition-all cursor-pointer"
                    >
                      Submit Lead &amp; Request Quote
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation View */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#16FFC6]/20 border-2 border-[#16FFC6] text-[#16FFC6] flex items-center justify-center mx-auto shadow-xl shadow-[#16FFC6]/20">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Lead Ticket Recorded!</h3>
                  <p className="text-xs text-[#16FFC6] font-mono font-bold">Reference Ticket: {submittedRefId}</p>
                </div>

                <p className="text-xs text-white/70 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong className="text-white">{customerName}</strong> from <strong className="text-white">{businessName}</strong>. Your quotation request has been recorded as a lead in our ERP Software Desk. Our licensing team will contact you at <strong className="text-[#16FFC6]">{phone}</strong> shortly.
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setIsLeadModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#16FFC6]/20 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                  <Link
                    href="/contact"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    Contact Team
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
