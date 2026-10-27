'use client';

import React, { useState } from 'react';
import {
  PhoneCall, Plus, Search, Mail, Phone, Calendar, Globe, Trash2,
  CheckCircle2, MessageSquare, Tag, X, Wrench, Laptop, ArrowRight, Sparkles,
  ShoppingBag, ShieldCheck, FileText, QrCode, CreditCard, Building2, Eye, Download, User, ExternalLink, Edit2, Upload, ImageIcon
} from 'lucide-react';
import { useErpStore, SupportLeadItem, BookRepairLeadItem } from '@/lib/store';

export default function ErpLeadsPage() {
  const {
    supportLeads, updateSupportLead, deleteSupportLead, addSupportLead,
    bookRepairLeads, updateBookRepairLead, deleteBookRepairLead, addBookRepairLead,
    addTicket, employees
  } = useErpStore();

  type TabCategory = 'all' | 'shop_order' | 'erp_quote' | 'book_repair' | 'contact_form' | 'data_recovery' | 'corporate_amc';
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Lead Detail Inspector & Lightbox Modals
  const [selectedSupportLead, setSelectedSupportLead] = useState<SupportLeadItem | null>(null);
  const [receiptModalImage, setReceiptModalImage] = useState<string | null>(null);

  // Edit / Modify Lead Modals State
  const [editingSupportLead, setEditingSupportLead] = useState<SupportLeadItem | null>(null);
  const [editingBookLead, setEditingBookLead] = useState<BookRepairLeadItem | null>(null);

  // Quick Add Modals State
  const [showAddSupportModal, setShowAddSupportModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  const [newSupportInput, setNewSupportInput] = useState<Partial<SupportLeadItem>>({
    lead_name: '',
    phone: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    status: 'New Inquiry',
    source: 'Direct Call',
    formCategory: 'general',
  });

  const [newBookInput, setNewBookInput] = useState<Partial<BookRepairLeadItem>>({
    name: '',
    phone: '',
    email: '',
    deviceType: 'Laptop',
    brand: '',
    serviceMode: 'In-Store Drop Off (Gandhi Nagar)',
    problemDescription: '',
    status: 'New Booking',
  });

  // Dynamic Helper to extract Order Total ₹ if missing in initial object
  const getLeadOrderTotal = (lead: SupportLeadItem): number => {
    if (lead.orderTotal && lead.orderTotal > 0) return lead.orderTotal;
    const match = (lead.subject + ' ' + lead.message).match(/₹\s*([\d,]+)/);
    if (match && match[1]) {
      const val = parseInt(match[1].replace(/,/g, ''), 10);
      if (!isNaN(val) && val > 0) return val;
    }
    return 0;
  };

  // Dynamic Helper to extract UTR Number if missing in initial object
  const getLeadUtrNumber = (lead: SupportLeadItem): string => {
    if (lead.utrNumber) return lead.utrNumber;
    const match = lead.message.match(/Transaction Reference \(UTR \/ UPI Ref\):\s*([^\n]+)/i);
    if (match && match[1] && match[1].trim() !== 'Not Provided') {
      return match[1].trim();
    }
    return '';
  };

  // Categorize Support Leads
  const getLeadCategory = (lead: SupportLeadItem): string => {
    if (lead.formCategory) return lead.formCategory;
    const subj = (lead.subject || '').toLowerCase();
    const msg = (lead.message || '').toLowerCase();
    const src = (lead.source || '').toLowerCase();

    if (src.includes('shop') || subj.includes('shop order') || subj.includes('ord-')) return 'shop_order';
    if (src.includes('erp') || subj.includes('erp') || subj.includes('license') || subj.includes('marg')) return 'erp_quote';
    if (subj.includes('data recovery') || msg.includes('cleanroom')) return 'data_recovery';
    if (subj.includes('amc') || subj.includes('corporate') || msg.includes('cctv')) return 'corporate_amc';
    return 'contact_form';
  };

  // Tab counts
  const shopOrdersCount = supportLeads.filter((l) => getLeadCategory(l) === 'shop_order').length;
  const erpQuotesCount = supportLeads.filter((l) => getLeadCategory(l) === 'erp_quote').length;
  const contactFormCount = supportLeads.filter((l) => getLeadCategory(l) === 'contact_form').length;
  const dataRecoveryCount = supportLeads.filter((l) => getLeadCategory(l) === 'data_recovery').length;
  const corporateAmcCount = supportLeads.filter((l) => getLeadCategory(l) === 'corporate_amc').length;
  const bookRepairCount = bookRepairLeads.length;

  const totalAllLeads = supportLeads.length + bookRepairLeads.length;

  // Filtered Support Leads
  const filteredSupportLeads = supportLeads.filter((lead) => {
    const category = getLeadCategory(lead);
    const matchesTab = activeTab === 'all' || activeTab === category;

    const matchesSearch =
      lead.lead_name.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      (lead.email || '').toLowerCase().includes(search.toLowerCase()) ||
      lead.subject.toLowerCase().includes(search.toLowerCase()) ||
      lead.message.toLowerCase().includes(search.toLowerCase()) ||
      getLeadUtrNumber(lead).toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  // Filtered Book Repair Leads
  const filteredBookLeads = bookRepairLeads.filter((lead) => {
    const matchesTab = activeTab === 'all' || activeTab === 'book_repair';

    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.bookingNo.toLowerCase().includes(search.toLowerCase()) ||
      lead.deviceType.toLowerCase().includes(search.toLowerCase()) ||
      lead.brand.toLowerCase().includes(search.toLowerCase()) ||
      lead.problemDescription.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleCreateSupportLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupportInput.lead_name || !newSupportInput.phone) return;

    addSupportLead({
      lead_name: newSupportInput.lead_name,
      phone: newSupportInput.phone,
      email: newSupportInput.email || 'support@client.com',
      company: newSupportInput.company || 'Individual Client',
      subject: newSupportInput.subject || 'Direct Service Inquiry',
      message: newSupportInput.message || 'Direct customer phone inquiry logged by team.',
      service_interested: newSupportInput.subject || 'Technical Support Request',
      status: (newSupportInput.status as any) || 'New Inquiry',
      source: (newSupportInput.source as any) || 'Direct Call',
      formCategory: (newSupportInput.formCategory as any) || 'contact_form',
      created_at: new Date().toISOString(),
    });

    setShowAddSupportModal(false);
  };

  const handleOpenEditSupportLead = (lead: SupportLeadItem) => {
    setEditingSupportLead({
      ...lead,
      orderTotal: getLeadOrderTotal(lead),
      utrNumber: getLeadUtrNumber(lead),
    });
  };

  const handleReceiptUploadInEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingSupportLead) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const compressed = canvas.toDataURL('image/jpeg', 0.6);
            setEditingSupportLead({ ...editingSupportLead, paymentProofImage: compressed });
          } else {
            setEditingSupportLead({ ...editingSupportLead, paymentProofImage: event.target?.result as string });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSupportLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupportLead) return;

    updateSupportLead(editingSupportLead.id, { ...editingSupportLead });
    setEditingSupportLead(null);
  };

  const handleUpdateBookLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookLead) return;

    updateBookRepairLead(editingBookLead.id, { ...editingBookLead });
    setEditingBookLead(null);
  };

  const handleCreateBookLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookInput.name || !newBookInput.phone) return;

    const bkNo = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    addBookRepairLead({
      bookingNo: bkNo,
      name: newBookInput.name,
      phone: newBookInput.phone,
      email: newBookInput.email || 'customer@repairdesk.com',
      deviceType: newBookInput.deviceType || 'Laptop',
      brand: newBookInput.brand || 'Generic Brand',
      serviceMode: newBookInput.serviceMode || 'In-Store Drop Off (Gandhi Nagar)',
      problemDescription: newBookInput.problemDescription || 'Customer submitted repair request.',
      status: (newBookInput.status as any) || 'New Booking',
      created_at: new Date().toISOString(),
    });

    setShowAddBookModal(false);
  };

  const handleConvertToTicket = (lead: BookRepairLeadItem) => {
    const tNo = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    addTicket({
      ticket_number: tNo,
      customer_name: lead.name,
      customer_phone: lead.phone,
      customerEmail: lead.email,
      customerAddress: lead.address || lead.serviceMode,
      customerType: 'RETAIL',
      device_type: lead.deviceType,
      brand: lead.brand,
      model: lead.model || 'Standard Model',
      serial_or_imei: 'REG-ONLINE-' + Date.now().toString().slice(-4),
      rackLocation: 'Online Desk Bin 01',
      problem_reported: lead.problemDescription,
      physicalCondition: 'Customer Intake via Online Booking',
      status: 'received',
      priority: 'normal',
      lineItems: [],
      outsourceCharges: 0,
      freightCharges: 0,
      estimated_cost: 1500,
      advance_paid: 0,
      discountAmount: 0,
      gstTaxRate: 18,
      subtotal: 1500,
      taxableAmount: 1271.19,
      cgstAmount: 114.40,
      sgstAmount: 114.40,
      roundOffAdjustment: 0,
      grandTotal: 1500,
      netDueBalance: 1500,
      paymentMethod: 'CASH',
      paymentStatus: 'UNPAID',
      warrantyStatement: '30 Days Parts & Labor Warranty',
      deliveryStatus: 'IN REPAIR LAB',
      technician_name: employees?.[0]?.name || 'Deepak Kumar',
      entryDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    updateBookRepairLead(lead.id, { status: 'Job Card Converted' });
    alert(`⚡ Successfully converted Online Booking "${lead.bookingNo}" into Repair Ticket "${tNo}"!`);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-[#16FFC6]" />
            LEADS MANAGEMENT HUB<span className="text-[#16FFC6]">.</span>
          </h1>
          <p className="text-xs text-white/60">
            Centralized portal capturing inquiries &amp; online orders across all website forms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddSupportModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#16FFC6]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Log General Support Lead
          </button>
          <button
            onClick={() => setShowAddBookModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
          >
            <Wrench className="w-4 h-4 stroke-[3]" /> Add Repair Booking
          </button>
        </div>
      </div>

      {/* Form-Specific Filter Tabs Header Bar */}
      <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-wrap gap-2 text-xs font-bold uppercase overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#16FFC6] text-[#070B0A] font-extrabold shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>All Website Leads</span>
          <span className="bg-black/30 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">{totalAllLeads}</span>
        </button>

        <button
          onClick={() => setActiveTab('shop_order')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'shop_order'
              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
              : 'bg-white/5 text-emerald-400/80 hover:text-emerald-400 hover:bg-white/10'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>1. Shop Orders</span>
          <span className="bg-black/40 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono">{shopOrdersCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('erp_quote')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'erp_quote'
              ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-md'
              : 'bg-white/5 text-cyan-300/80 hover:text-cyan-300 hover:bg-white/10'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>2. Marg ERP Quotes</span>
          <span className="bg-black/40 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-mono">{erpQuotesCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('book_repair')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'book_repair'
              ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
              : 'bg-white/5 text-amber-300/80 hover:text-amber-300 hover:bg-white/10'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>3. Repair Bookings</span>
          <span className="bg-black/40 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono">{bookRepairCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('contact_form')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'contact_form'
              ? 'bg-indigo-500 text-white font-extrabold shadow-md'
              : 'bg-white/5 text-indigo-300/80 hover:text-indigo-300 hover:bg-white/10'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>4. Contact Us Form</span>
          <span className="bg-black/40 text-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-mono">{contactFormCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('data_recovery')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'data_recovery'
              ? 'bg-purple-500 text-white font-extrabold shadow-md'
              : 'bg-white/5 text-purple-300/80 hover:text-purple-300 hover:bg-white/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>5. Data Recovery Lab</span>
          <span className="bg-black/40 text-purple-200 px-2 py-0.5 rounded-full text-[10px] font-mono">{dataRecoveryCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('corporate_amc')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'corporate_amc'
              ? 'bg-rose-500 text-white font-extrabold shadow-md'
              : 'bg-white/5 text-rose-300/80 hover:text-rose-300 hover:bg-white/10'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>6. Corporate &amp; AMC</span>
          <span className="bg-black/40 text-rose-200 px-2 py-0.5 rounded-full text-[10px] font-mono">{corporateAmcCount}</span>
        </button>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, phone, order ref, UTR #..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#16FFC6]"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold uppercase">
          <span className="text-[10px] text-white/40 shrink-0">Stage Filter:</span>
          {['all', 'New Inquiry', 'Contacted', 'Quotation Sent', 'Closed Won', 'Archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                statusFilter === st ? 'bg-white/20 text-white font-extrabold border border-white/30' : 'bg-white/5 text-white/60'
              }`}
            >
              {st === 'all' ? 'All Stages' : st}
            </button>
          ))}
        </div>
      </div>

      {/* LEADS LIST / TABLE VIEW */}
      <div className="space-y-4">
        {/* SUPPORT LEADS & FORM INQUIRIES TABLE */}
        {activeTab !== 'book_repair' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                <tr>
                  <th className="p-4">Category &amp; Source</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Subject &amp; Message Summary</th>
                  <th className="p-4">Value / Ref Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSupportLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/40">
                      No matching inquiries found for this form category.
                    </td>
                  </tr>
                ) : (
                  filteredSupportLeads.map((lead) => {
                    const category = getLeadCategory(lead);
                    const orderTotal = getLeadOrderTotal(lead);
                    const utrNo = getLeadUtrNumber(lead);

                    return (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        {/* Category & Source */}
                        <td className="p-4">
                          <div className="space-y-1">
                            {category === 'shop_order' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 inline-flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" /> Shop Order
                              </span>
                            )}
                            {category === 'erp_quote' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-cyan-400/20 text-cyan-300 border-cyan-400/40 inline-flex items-center gap-1">
                                <Laptop className="w-3 h-3" /> ERP Quote
                              </span>
                            )}
                            {category === 'contact_form' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-indigo-500/20 text-indigo-300 border-indigo-500/40 inline-flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Contact Form
                              </span>
                            )}
                            {category === 'data_recovery' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-purple-500/20 text-purple-300 border-purple-500/40 inline-flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Data Recovery
                              </span>
                            )}
                            {category === 'corporate_amc' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-rose-500/20 text-rose-300 border-rose-500/40 inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> Corporate AMC
                              </span>
                            )}
                            <div className="text-[10px] text-white/50 font-mono">{lead.source}</div>
                          </div>
                        </td>

                        {/* Customer Details */}
                        <td className="p-4">
                          <div className="font-extrabold text-white text-sm">{lead.lead_name}</div>
                          {lead.company && <div className="text-[10px] text-white/50 font-medium">{lead.company}</div>}
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[#16FFC6]">
                            <Phone className="w-3 h-3 text-[#16FFC6]" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                        </td>

                        {/* Subject & Message Summary */}
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-[#16FFC6] shrink-0" />
                            <span className="truncate">{lead.subject}</span>
                          </div>
                          <p className="text-xs text-white/80 mt-1 leading-relaxed line-clamp-2 bg-black/30 p-2 rounded-lg border border-white/5 font-sans">
                            {lead.message}
                          </p>
                        </td>

                        {/* Value / Ref Details */}
                        <td className="p-4 font-mono text-xs">
                          {orderTotal > 0 ? (
                            <div className="text-emerald-400 font-extrabold text-sm">
                              ₹{orderTotal.toLocaleString('en-IN')}
                            </div>
                          ) : (
                            <div className="text-white/40 text-[11px]">Quote / Consultation</div>
                          )}

                          {utrNo && (
                            <div className="text-[10px] text-amber-300 font-bold mt-1">
                              UTR: {utrNo}
                            </div>
                          )}

                          {lead.paymentProofImage && (
                            <button
                              onClick={() => setReceiptModalImage(lead.paymentProofImage || null)}
                              className="mt-1.5 px-2 py-0.5 rounded bg-[#16FFC6]/20 text-[#16FFC6] border border-[#16FFC6]/40 text-[10px] font-bold uppercase hover:bg-[#16FFC6] hover:text-[#070B0A] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> View Receipt Screenshot
                            </button>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateSupportLead(lead.id, { status: e.target.value as any })}
                            className="p-1.5 rounded-lg border bg-[#0D1117] text-white text-[11px] font-bold uppercase cursor-pointer"
                          >
                            <option value="New Inquiry">New Inquiry</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quotation Sent">Quotation Sent</option>
                            <option value="Closed Won">Closed Won</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setSelectedSupportLead(lead)}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                              title="Inspect Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditSupportLead(lead)}
                              className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 font-bold cursor-pointer"
                              title="Modify / Edit Lead"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.lead_name)},%20thank%20you%20for%20contacting%20ACCNO%20SOLUTION.%20Regarding%20your%20inquiry:%20${encodeURIComponent(lead.subject)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-slate-950 font-bold text-[10px]"
                            >
                              WA
                            </a>
                            <button
                              onClick={() => deleteSupportLead(lead.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ONLINE REPAIR BOOKINGS TABLE */}
        {(activeTab === 'all' || activeTab === 'book_repair') && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-amber-500/30">
            <div className="p-4 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between text-amber-300 font-extrabold uppercase text-xs">
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4" /> ONLINE DEVICE REPAIR BOOKINGS ({filteredBookLeads.length})
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                <tr>
                  <th className="p-4">Booking # &amp; Customer</th>
                  <th className="p-4">Device &amp; Brand</th>
                  <th className="p-4">Service Mode</th>
                  <th className="p-4">Problem Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/40">
                      No repair bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold text-[11px]">
                          {lead.bookingNo}
                        </span>
                        <div className="font-extrabold text-white text-sm mt-1">{lead.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[#16FFC6]">
                          <Phone className="w-3 h-3 text-[#16FFC6]" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Laptop className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{lead.deviceType}</span>
                        </div>
                        <div className="text-[11px] text-white/60 font-mono mt-0.5">{lead.brand}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                          {lead.serviceMode}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="text-xs text-white/80 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5 line-clamp-2 font-sans">
                          {lead.problemDescription}
                        </p>
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateBookRepairLead(lead.id, { status: e.target.value as any })}
                          className="p-1.5 rounded-lg border bg-[#0D1117] text-white text-[11px] font-bold uppercase cursor-pointer"
                        >
                          <option value="New Booking">New Booking</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Job Card Converted">Job Card Converted</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setEditingBookLead({ ...lead })}
                            className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 font-bold cursor-pointer"
                            title="Modify / Edit Booking"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleConvertToTicket(lead)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] uppercase flex items-center gap-1 shadow cursor-pointer"
                          >
                            <Wrench className="w-3 h-3" /> Convert to Ticket
                          </button>
                          <button
                            onClick={() => deleteBookRepairLead(lead.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODIFY / EDIT SUPPORT LEAD MODAL */}
      {editingSupportLead && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-400/40 max-w-xl w-full relative bg-[#070B0A] text-white shadow-2xl my-auto">
            <button
              onClick={() => setEditingSupportLead(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Edit2 className="w-5 h-5 text-cyan-400" /> Modify Website Support Lead / Order
            </h3>

            <form onSubmit={handleUpdateSupportLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingSupportLead.lead_name}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, lead_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editingSupportLead.phone}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingSupportLead.email || ''}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Business / Firm Name</label>
                  <input
                    type="text"
                    value={editingSupportLead.company || ''}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Subject / Requirement Heading</label>
                <input
                  type="text"
                  required
                  value={editingSupportLead.subject}
                  onChange={(e) => setEditingSupportLead({ ...editingSupportLead, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Message Content &amp; Item Breakdown</label>
                <textarea
                  rows={3}
                  value={editingSupportLead.message}
                  onChange={(e) => setEditingSupportLead({ ...editingSupportLead, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Stage Status</label>
                  <select
                    value={editingSupportLead.status}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, status: e.target.value as any })}
                    className="w-full bg-[#0D1117] border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  >
                    <option value="New Inquiry">New Inquiry</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Quoted Total ₹</label>
                  <input
                    type="number"
                    value={editingSupportLead.orderTotal || ''}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, orderTotal: Number(e.target.value) })}
                    placeholder="e.g. 5300"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">UTR / Ref #</label>
                  <input
                    type="text"
                    value={editingSupportLead.utrNumber || ''}
                    onChange={(e) => setEditingSupportLead({ ...editingSupportLead, utrNumber: e.target.value })}
                    placeholder="e.g. 123456789012"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Transaction Receipt Screenshot Upload / Preview */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <label className="block text-xs font-extrabold text-[#16FFC6] uppercase tracking-wider">
                  Transaction Receipt / Screenshot Proof
                </label>

                {editingSupportLead.paymentProofImage ? (
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20 rounded-xl border border-[#16FFC6] overflow-hidden bg-black shrink-0">
                      <img src={editingSupportLead.paymentProofImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-emerald-400 font-bold block">✓ Screenshot Receipt Attached</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setReceiptModalImage(editingSupportLead.paymentProofImage || null)}
                          className="px-2.5 py-1 rounded bg-[#16FFC6]/20 text-[#16FFC6] font-bold text-[10px] uppercase hover:bg-[#16FFC6] hover:text-[#070B0A] cursor-pointer"
                        >
                          Enlarge Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSupportLead({ ...editingSupportLead, paymentProofImage: undefined })}
                          className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase hover:bg-rose-500 hover:text-white cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUploadInEdit}
                      className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#16FFC6]/20 file:text-[#16FFC6] hover:file:bg-[#16FFC6] hover:file:text-[#070B0A] file:cursor-pointer transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSupportLead(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold uppercase shadow-lg shadow-cyan-400/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODIFY / EDIT BOOK REPAIR ONLINE LEAD MODAL */}
      {editingBookLead && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-amber-400/40 max-w-xl w-full relative bg-[#070B0A] text-white shadow-2xl my-auto">
            <button
              onClick={() => setEditingBookLead(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Edit2 className="w-5 h-5 text-amber-400" /> Modify Online Repair Booking ({editingBookLead.bookingNo})
            </h3>

            <form onSubmit={handleUpdateBookLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBookLead.name}
                    onChange={(e) => setEditingBookLead({ ...editingBookLead, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editingBookLead.phone}
                    onChange={(e) => setEditingBookLead({ ...editingBookLead, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Device Type</label>
                  <input
                    type="text"
                    value={editingBookLead.deviceType}
                    onChange={(e) => setEditingBookLead({ ...editingBookLead, deviceType: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Brand &amp; Model</label>
                  <input
                    type="text"
                    value={editingBookLead.brand}
                    onChange={(e) => setEditingBookLead({ ...editingBookLead, brand: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Service Mode</label>
                <input
                  type="text"
                  value={editingBookLead.serviceMode}
                  onChange={(e) => setEditingBookLead({ ...editingBookLead, serviceMode: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  value={editingBookLead.problemDescription}
                  onChange={(e) => setEditingBookLead({ ...editingBookLead, problemDescription: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Booking Status</label>
                <select
                  value={editingBookLead.status}
                  onChange={(e) => setEditingBookLead({ ...editingBookLead, status: e.target.value as any })}
                  className="w-full bg-[#0D1117] border border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none"
                >
                  <option value="New Booking">New Booking</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Job Card Converted">Job Card Converted</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingBookLead(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold uppercase shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL LEAD INSPECT MODAL */}
      {selectedSupportLead && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-[#16FFC6]/40 max-w-2xl w-full relative bg-[#070B0A] text-white shadow-2xl space-y-4 my-auto">
            <button
              onClick={() => setSelectedSupportLead(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#16FFC6] uppercase bg-[#16FFC6]/10 px-3 py-1 rounded-full">
                {selectedSupportLead.source}
              </span>
              <h2 className="text-xl font-black text-white leading-snug">{selectedSupportLead.subject}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs font-mono">
              <div>
                <span className="text-white/50 block">Customer Name:</span>
                <span className="text-white font-bold">{selectedSupportLead.lead_name}</span>
              </div>
              <div>
                <span className="text-white/50 block">Phone Number:</span>
                <span className="text-[#16FFC6] font-bold">{selectedSupportLead.phone}</span>
              </div>
              <div>
                <span className="text-white/50 block">Email Address:</span>
                <span className="text-white">{selectedSupportLead.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-white/50 block">Company / Firm:</span>
                <span className="text-white">{selectedSupportLead.company || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-white/70 uppercase">Complete Submitted Message &amp; Breakdown:</span>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-xs font-mono text-white/90 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedSupportLead.message}
              </div>
            </div>

            {selectedSupportLead.paymentProofImage && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Payment Transaction Screenshot Attached:
                </span>
                <div
                  onClick={() => setReceiptModalImage(selectedSupportLead.paymentProofImage || null)}
                  className="relative w-40 h-40 rounded-2xl border-2 border-[#16FFC6] overflow-hidden bg-black cursor-pointer group shadow-lg"
                >
                  <img src={selectedSupportLead.paymentProofImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-bold">
                    Click to Enlarge
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleOpenEditSupportLead(selectedSupportLead);
                  setSelectedSupportLead(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" /> Edit Lead
              </button>
              <button
                onClick={() => setSelectedSupportLead(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT LIGHTBOX MODAL */}
      {receiptModalImage && (
        <div
          onClick={() => setReceiptModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-xl w-full bg-black border-2 border-[#16FFC6] rounded-3xl p-4 shadow-2xl">
            <button
              onClick={() => setReceiptModalImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-rose-500 text-white font-bold shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-xs font-mono font-bold text-[#16FFC6] mb-3 uppercase">Payment Receipt Proof Lightbox</h4>
            <img src={receiptModalImage} alt="Payment Receipt Screenshot" className="w-full h-auto max-h-[75vh] object-contain rounded-2xl border border-white/20" />
          </div>
        </div>
      )}

      {/* QUICK LOG SUPPORT LEAD MODAL */}
      {showAddSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-md w-full relative bg-[#070B0A] text-white">
            <button
              onClick={() => setShowAddSupportModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase mb-4">+ Log Support Lead</h3>

            <form onSubmit={handleCreateSupportLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newSupportInput.lead_name}
                  onChange={(e) => setNewSupportInput({ ...newSupportInput, lead_name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newSupportInput.phone}
                  onChange={(e) => setNewSupportInput({ ...newSupportInput, phone: e.target.value })}
                  placeholder="e.g. +91 94140-00000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Subject / Requirement</label>
                <input
                  type="text"
                  value={newSupportInput.subject}
                  onChange={(e) => setNewSupportInput({ ...newSupportInput, subject: e.target.value })}
                  placeholder="e.g. Laptop Motherboard Repair Estimate"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Message / Notes</label>
                <textarea
                  rows={2}
                  value={newSupportInput.message}
                  onChange={(e) => setNewSupportInput({ ...newSupportInput, message: e.target.value })}
                  placeholder="Inquiry notes..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupportModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD REPAIR BOOKING MODAL */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-md w-full relative bg-[#070B0A] text-white">
            <button
              onClick={() => setShowAddBookModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase mb-4">+ Add Repair Booking</h3>

            <form onSubmit={handleCreateBookLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newBookInput.name}
                  onChange={(e) => setNewBookInput({ ...newBookInput, name: e.target.value })}
                  placeholder="e.g. Suresh Shah"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newBookInput.phone}
                  onChange={(e) => setNewBookInput({ ...newBookInput, phone: e.target.value })}
                  placeholder="e.g. +91 98290-11111"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Device Type &amp; Brand</label>
                <input
                  type="text"
                  value={newBookInput.deviceType}
                  onChange={(e) => setNewBookInput({ ...newBookInput, deviceType: e.target.value })}
                  placeholder="e.g. Laptop - Dell Inspiron 15"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Problem Reported</label>
                <textarea
                  rows={2}
                  value={newBookInput.problemDescription}
                  onChange={(e) => setNewBookInput({ ...newBookInput, problemDescription: e.target.value })}
                  placeholder="Fault details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold uppercase"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
