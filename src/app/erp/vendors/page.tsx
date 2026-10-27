'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Trash2, Edit3, X, Check, Phone, Mail, Globe,
  Shield, MapPin, UserCheck, AlertCircle, MessageSquare, CheckCircle2, ShieldAlert, Truck, Wrench, Landmark, QrCode,
  List, LayoutGrid, BookOpen, CreditCard, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCcw, Printer, Filter, Calendar
} from 'lucide-react';
import { useErpStore, VendorItem, AccountLedgerItem, AccountingVoucher } from '@/lib/store';

const DEFAULT_VENDOR_CATEGORIES = [
  'Hardware & Components Supplier',
  'Outsourced BGA Repair & Data Lab',
  'CCTV & Security Equipment Supplier',
  'Networking Hardware Vendor',
  'Software Licensing Partner',
];
const DEFAULT_VENDOR_ACCOUNT_GROUPS = [
  'Sundry Creditor',
  'Outsource Service Partner',
  'OEM Spare Parts Vendor',
  'Logistics & Freight Supplier',
];

export default function VendorsPage() {
  const {
    vendors,
    vendorRules,
    addVendor,
    updateVendor,
    deleteVendor,
    customLedgers,
    addAccountLedger,
    updateAccountLedger,
    deleteAccountLedger,
    accountingVouchers,
    companyDetails
  } = useErpStore();

  const [activeMainTab, setActiveMainTab] = useState<'VENDORS' | 'LEDGERS'>('VENDORS');
  const [search, setSearch] = useState('');
  const [activeVendorTypeFilter, setActiveVendorTypeFilter] = useState<'All' | 'Standard Vendor' | 'Outsource Vendor'>('All');

  // Display Format State: List View vs Box Grid View
  const [viewMode, setViewMode] = useState<'tabular' | 'grid'>(vendorRules.displayFormat || 'tabular');

  // Modal state: null = closed, 'new' = creating, VendorItem = editing
  const [activeVendorModal, setActiveVendorModal] = useState<'new' | VendorItem | null>(null);

  // General Ledger Modal State
  const [activeLedgerModal, setActiveLedgerModal] = useState<'new' | AccountLedgerItem | null>(null);
  const [ledgerGroupFilter, setLedgerGroupFilter] = useState<string>('ALL');

  // Printable Date-Wise Voucher Ledger Modal Controls
  const [showLedgerPrintModal, setShowLedgerPrintModal] = useState(false);
  const [selectedLedgerForPrint, setSelectedLedgerForPrint] = useState<string>('ALL');
  const [selectedVoucherTypeForPrint, setSelectedVoucherTypeForPrint] = useState<string>('ALL');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [copyType, setCopyType] = useState<'both' | 'standard' | 'office'>('both');

  // Dynamic Options with In-App Modal and LocalStorage Persistence
  const [categories, setCategories] = useState<string[]>(DEFAULT_VENDOR_CATEGORIES);
  const [accountGroups, setAccountGroups] = useState<string[]>(DEFAULT_VENDOR_ACCOUNT_GROUPS);
  const [designations, setDesignations] = useState<string[]>([
    'Area Sales Manager',
    'Technical Director',
    'Key Account Representative',
    'Proprietor / Owner',
    'Service Rework Lead',
  ]);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([
    'Active',
    'Inactive',
    'On Hold',
    'Blacklisted',
  ]);
  const [states, setStates] = useState<string[]>([
    '01 - Jammu & Kashmir',
    '02 - Himachal Pradesh',
    '03 - Punjab',
    '07 - Delhi',
    '08 - Rajasthan',
    '27 - Maharashtra',
  ]);

  // In-App Modal Dialog for +ADD and REMOVE dropdown options
  const [optionModal, setOptionModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    field: 'category' | 'accountGroup';
    title: string;
    currentValue?: string;
    nameInput: string;
    error?: string;
  }>({
    isOpen: false,
    type: 'add',
    field: 'category',
    title: '',
    nameInput: '',
  });

  // Load persisted dropdown options on mount
  useEffect(() => {
    try {
      const c = localStorage.getItem('accno_vendor_categories');
      if (c) setCategories(JSON.parse(c));
      const g = localStorage.getItem('accno_vendor_account_groups');
      if (g) setAccountGroups(JSON.parse(g));
    } catch {}
  }, []);

  // Vendor Form State
  const defaultFormData = {
    vendorType: 'Standard Vendor' as 'Standard Vendor' | 'Outsource Vendor',
    companyName: '',
    contactPerson: '',
    category: 'Hardware & Components Supplier',
    accountGroup: 'Sundry Creditor',
    designation: 'Area Sales Manager',
    activeStatus: 'Active',
    phone: '',
    alternatePhone: '',
    email: '',
    website: '',
    station: 'Jammu',
    state: '01 - Jammu & Kashmir',
    fullAddress: '',
    gstin: '',
    pan: '',
    openingBalance: 0,
    outstandingBalance: 0,
    maxCreditLimit: vendorRules.defaultMaxCreditLimit || 500000,
    internalNotes: '',

    // Bank Account Details
    bankAccountName: '',
    bankAccountType: 'Current Account',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankBranch: '',
    upiId: '',
  };

  const [formData, setFormData] = useState<Omit<VendorItem, 'id' | 'code'>>(defaultFormData);

  // Ledger Account Form State
  const defaultLedgerFormData = {
    accountName: '',
    groupType: 'Bank' as AccountLedgerItem['groupType'],
    openingBalance: 0,
    balanceType: 'Dr' as 'Dr' | 'Cr',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    remarks: '',
    activeStatus: 'Active' as 'Active' | 'Inactive',
  };

  const [ledgerFormData, setLedgerFormData] = useState<Omit<AccountLedgerItem, 'id' | 'created_at'>>(defaultLedgerFormData);

  // Dynamic option add inputs
  const [newOptionInput, setNewOptionInput] = useState<{ [key: string]: string }>({});

  const handleOpenNewModal = (type: 'Standard Vendor' | 'Outsource Vendor' = 'Standard Vendor') => {
    setFormData({
      ...defaultFormData,
      vendorType: type,
      category: type === 'Outsource Vendor' ? 'Outsourced BGA Repair & Data Lab' : categories[0],
      accountGroup: type === 'Outsource Vendor' ? 'Outsource Service Partner' : accountGroups[0],
    });
    setActiveVendorModal('new');
  };

  const handleOpenEditModal = (v: VendorItem) => {
    setFormData({
      vendorType: v.vendorType,
      companyName: v.companyName,
      contactPerson: v.contactPerson,
      category: v.category || categories[0],
      accountGroup: v.accountGroup || accountGroups[0],
      designation: v.designation || designations[0],
      activeStatus: v.activeStatus || 'Active',
      phone: v.phone,
      alternatePhone: v.alternatePhone || '',
      email: v.email || '',
      website: v.website || '',
      station: v.station || 'Jammu',
      state: v.state || states[0],
      fullAddress: v.fullAddress || '',
      gstin: v.gstin || '',
      pan: v.pan || '',
      openingBalance: v.openingBalance || 0,
      outstandingBalance: v.outstandingBalance || 0,
      maxCreditLimit: v.maxCreditLimit || vendorRules.defaultMaxCreditLimit || 500000,
      internalNotes: v.internalNotes || '',

      bankAccountName: v.bankAccountName || '',
      bankAccountType: v.bankAccountType || 'Current Account',
      bankAccountNumber: v.bankAccountNumber || '',
      bankIfscCode: v.bankIfscCode || '',
      bankName: v.bankName || '',
      bankBranch: v.bankBranch || '',
      upiId: v.upiId || '',
    });
    setActiveVendorModal(v);
  };

  const handleSaveOrModify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.phone) {
      alert('Please fill out Company Name and Mobile Number.');
      return;
    }

    if (activeVendorModal === 'new') {
      addVendor(formData);
    } else if (activeVendorModal && typeof activeVendorModal === 'object') {
      updateVendor(activeVendorModal.id, formData);
    }

    setActiveVendorModal(null);
  };

  const handleDeleteVendor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete vendor "${name}"?`)) {
      deleteVendor(id);
    }
  };

  // LEDGER HANDLERS
  const handleOpenNewLedgerModal = () => {
    setLedgerFormData(defaultLedgerFormData);
    setActiveLedgerModal('new');
  };

  const handleOpenEditLedgerModal = (l: AccountLedgerItem) => {
    setLedgerFormData({
      accountName: l.accountName,
      groupType: l.groupType,
      openingBalance: l.openingBalance,
      balanceType: l.balanceType,
      bankName: l.bankName || '',
      accountNumber: l.accountNumber || '',
      ifscCode: l.ifscCode || '',
      branchName: l.branchName || '',
      remarks: l.remarks || '',
      activeStatus: l.activeStatus,
    });
    setActiveLedgerModal(l);
  };

  const handleSaveOrModifyLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerFormData.accountName) {
      alert('Please enter Account Ledger Name.');
      return;
    }

    if (activeLedgerModal === 'new') {
      addAccountLedger(ledgerFormData);
    } else if (activeLedgerModal && typeof activeLedgerModal === 'object') {
      updateAccountLedger(activeLedgerModal.id, ledgerFormData);
    }

    setActiveLedgerModal(null);
  };

  const handleDeleteLedgerAccount = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete General Ledger Account "${name}"?`)) {
      deleteAccountLedger(id);
    }
  };

  // Helper to persist dropdown options
  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('accno_vendor_categories', JSON.stringify(updated));
    } catch {}
  };

  const saveAccountGroups = (updated: string[]) => {
    setAccountGroups(updated);
    try {
      localStorage.setItem('accno_vendor_account_groups', JSON.stringify(updated));
    } catch {}
  };

  const openAddModal = (field: 'category' | 'accountGroup', title: string) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      field,
      title,
      nameInput: '',
      error: undefined,
    });
  };

  const openRemoveModal = (
    field: 'category' | 'accountGroup',
    title: string,
    currentValue?: string
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'remove',
      field,
      title,
      currentValue: currentValue || 'Current Selection',
      nameInput: '',
      error: undefined,
    });
  };

  const handleConfirmAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const val = optionModal.nameInput.trim();
    if (!val) {
      setOptionModal((prev) => ({ ...prev, error: 'Option value cannot be empty' }));
      return;
    }

    if (optionModal.field === 'category') {
      if (categories.some((c) => c.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This category already exists.' }));
        return;
      }
      const updated = [...categories, val];
      saveCategories(updated);
      setFormData((prev) => ({ ...prev, category: val }));
    } else if (optionModal.field === 'accountGroup') {
      if (accountGroups.some((g) => g.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This account group already exists.' }));
        return;
      }
      const updated = [...accountGroups, val];
      saveAccountGroups(updated);
      setFormData((prev) => ({ ...prev, accountGroup: val }));
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmRemoveOption = () => {
    if (optionModal.field === 'category') {
      if (categories.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one category must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.category;
      const updated = categories.filter((c) => c !== target);
      saveCategories(updated);
      if (formData.category === target) {
        setFormData((prev) => ({ ...prev, category: updated[0] || '' }));
      }
    } else if (optionModal.field === 'accountGroup') {
      if (accountGroups.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one account group must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.accountGroup;
      const updated = accountGroups.filter((g) => g !== target);
      saveAccountGroups(updated);
      if (formData.accountGroup === target) {
        setFormData((prev) => ({ ...prev, accountGroup: updated[0] || '' }));
      }
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Filtered Vendors
  const filteredVendors = vendors.filter((v) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.companyName.toLowerCase().includes(q) ||
      v.contactPerson.toLowerCase().includes(q) ||
      v.code.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      (v.gstin && v.gstin.toLowerCase().includes(q)) ||
      (v.bankName && v.bankName.toLowerCase().includes(q)) ||
      (v.bankAccountNumber && v.bankAccountNumber.includes(q));

    const matchesType =
      activeVendorTypeFilter === 'All' ||
      (activeVendorTypeFilter === 'Standard Vendor' && v.vendorType === 'Standard Vendor') ||
      (activeVendorTypeFilter === 'Outsource Vendor' && v.vendorType === 'Outsource Vendor');

    return matchesSearch && matchesType;
  });

  const filteredLedgers = customLedgers.filter((l) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      l.accountName.toLowerCase().includes(q) ||
      l.groupType.toLowerCase().includes(q) ||
      (l.bankName && l.bankName.toLowerCase().includes(q)) ||
      (l.accountNumber && l.accountNumber.includes(q)) ||
      (l.remarks && l.remarks.toLowerCase().includes(q));

    const matchesGroup =
      ledgerGroupFilter === 'ALL' ||
      (ledgerGroupFilter === 'Bank' && l.groupType === 'Bank') ||
      (ledgerGroupFilter === 'Cash' && l.groupType === 'Cash') ||
      (ledgerGroupFilter === 'Expense' && l.groupType === 'Expense') ||
      (ledgerGroupFilter === 'Credit / Party' && l.groupType === 'Credit / Party') ||
      (ledgerGroupFilter === 'Others' && !['Bank', 'Cash', 'Expense', 'Credit / Party'].includes(l.groupType));

    return matchesSearch && matchesGroup;
  });

  // DATE-WISE VOUCHER LEDGER STATEMENT CALCULATION
  const printableVoucherEntries = accountingVouchers.filter((v) => {
    // 1. Voucher Type Filter
    if (selectedVoucherTypeForPrint !== 'ALL' && v.voucherType !== selectedVoucherTypeForPrint) {
      return false;
    }

    // 2. Specific Ledger Account Filter
    if (selectedLedgerForPrint !== 'ALL') {
      const matchDebit = v.debitLedger && v.debitLedger.toLowerCase().includes(selectedLedgerForPrint.toLowerCase());
      const matchCredit = v.creditLedger && v.creditLedger.toLowerCase().includes(selectedLedgerForPrint.toLowerCase());
      const matchParty = v.partyName && v.partyName.toLowerCase().includes(selectedLedgerForPrint.toLowerCase());
      const matchJournalLines = v.journalLines && v.journalLines.some((line) => line.accountLedger.toLowerCase().includes(selectedLedgerForPrint.toLowerCase()));

      if (!matchDebit && !matchCredit && !matchParty && !matchJournalLines) {
        return false;
      }
    }

    // 3. Date Preset & Custom Range Filter
    if (datePreset === 'all') return true;

    const vDate = new Date(v.voucherDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (datePreset === 'today') return vDate >= today;
    if (datePreset === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return vDate >= weekAgo;
    }
    if (datePreset === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      return vDate >= monthAgo;
    }
    if (datePreset === 'custom') {
      if (fromDate && new Date(v.voucherDate) < new Date(fromDate)) return false;
      if (toDate && new Date(v.voucherDate) > new Date(toDate + 'T23:59:59')) return false;
      return true;
    }

    return true;
  }).sort((a, b) => new Date(a.voucherDate).getTime() - new Date(b.voucherDate).getTime());

  // Totals Calculation for Printed Voucher Report
  const totalPrintDebitSum = printableVoucherEntries.reduce((sum, v) => {
    if (['RECEIPT', 'CREDIT_NOTE'].includes(v.voucherType)) return sum + v.totalAmount;
    if (v.voucherType === 'JOURNAL' && v.journalLines) {
      return sum + v.journalLines.filter((l) => l.type === 'DEBIT').reduce((s, l) => s + l.amount, 0);
    }
    return sum;
  }, 0);

  const totalPrintCreditSum = printableVoucherEntries.reduce((sum, v) => {
    if (['PAYMENT', 'DEBIT_NOTE'].includes(v.voucherType)) return sum + v.totalAmount;
    if (v.voucherType === 'JOURNAL' && v.journalLines) {
      return sum + v.journalLines.filter((l) => l.type === 'CREDIT').reduce((s, l) => s + l.amount, 0);
    }
    return sum;
  }, 0);

  const netPrintBalance = totalPrintDebitSum - totalPrintCreditSum;

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full text-slate-100">
      {/* PRINT ENGINE CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #ledger-statement-print-target, #ledger-statement-print-target * {
            visibility: visible !important;
          }
          #ledger-statement-print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          th {
            background-color: #000000 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* HEADER BAR & MAIN MODULE TAB SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl bg-slate-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase flex flex-wrap items-center gap-2">
            <Building2 className="w-6 h-6 text-[#5ED29C]" />
            <span>VENDOR &amp; GENERAL LEDGER MASTER DIRECTORY</span>
            <span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Standard Hardware Vendors, Outsource Repair Labs, and General Ledger Voucher Accounts (Bank, Cash, Expenses &amp; Credit).
          </p>
        </div>

        {/* MAIN TAB TOGGLE: VENDORS VS GENERAL LEDGER MASTER */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveMainTab('VENDORS')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeMainTab === 'VENDORS'
                ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> VENDORS ({vendors.length})
          </button>
          <button
            onClick={() => setActiveMainTab('LEDGERS')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeMainTab === 'LEDGERS'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> VOUCHER LEDGERS ({customLedgers.length})
          </button>
        </div>
      </div>

      {/* VENDORS TAB CONTENT */}
      {activeMainTab === 'VENDORS' && (
        <div className="space-y-6">
          {/* VENDOR ACTION BUTTONS & FILTER BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10 bg-slate-900/50">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveVendorTypeFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  activeVendorTypeFilter === 'All' ? 'bg-[#5ED29C] text-[#070B0A]' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                ALL VENDORS ({vendors.length})
              </button>
              <button
                onClick={() => setActiveVendorTypeFilter('Standard Vendor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  activeVendorTypeFilter === 'Standard Vendor' ? 'bg-[#5ED29C] text-[#070B0A]' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                STANDARD VENDORS
              </button>
              <button
                onClick={() => setActiveVendorTypeFilter('Outsource Vendor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  activeVendorTypeFilter === 'Outsource Vendor' ? 'bg-purple-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                OUTSOURCE LABS
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendor name, code, GST, bank..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-[#5ED29C] placeholder-slate-500 focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('tabular')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'tabular' ? 'bg-slate-800 text-[#5ED29C]' : 'text-slate-400'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-[#5ED29C]' : 'text-slate-400'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleOpenNewModal('Standard Vendor')}
                className="px-4 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> NEW VENDOR
              </button>
              <button
                onClick={() => handleOpenNewModal('Outsource Vendor')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-4 h-4" /> NEW OUTSOURCE LAB
              </button>
            </div>
          </div>

          {/* VENDORS TABLE OR GRID VIEW */}
          {viewMode === 'tabular' ? (
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
                    <tr>
                      <th className="p-3.5">Vendor Code &amp; Type</th>
                      <th className="p-3.5">Company &amp; Contact Person</th>
                      <th className="p-3.5">Category &amp; Designation</th>
                      <th className="p-3.5">Phone &amp; Station</th>
                      <th className="p-3.5">Vendor Bank Details</th>
                      <th className="p-3.5 text-right text-emerald-400">Payable Outstanding</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                          <td className="p-3.5">
                            <span className="font-extrabold text-[#5ED29C] font-mono text-xs">{v.code}</span>
                            <div className="mt-0.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${v.vendorType === 'Outsource Vendor' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                                {v.vendorType}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-extrabold text-white text-sm">{v.companyName}</div>
                            <div className="text-[10px] text-slate-400">Contact: {v.contactPerson}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-200">{v.category || 'Hardware Supplier'}</div>
                            <div className="text-[10px] text-slate-400">{v.designation || 'Sales Rep'}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono font-bold text-white">{v.phone}</div>
                            <div className="text-[10px] text-slate-400">{v.station}, {v.state}</div>
                          </td>
                          <td className="p-3.5">
                            {v.bankName ? (
                              <div>
                                <div className="font-bold text-slate-200 flex items-center gap-1">
                                  <Landmark className="w-3 h-3 text-[#5ED29C]" /> {v.bankName} ({v.bankAccountType})
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">A/C: {v.bankAccountNumber || 'N/A'}</div>
                                <div className="text-[10px] text-slate-400 font-mono">IFSC: {v.bankIfscCode || 'N/A'}</div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">No bank recorded</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right font-mono font-extrabold text-sm">
                            <span className="text-emerald-400">₹{(v.outstandingBalance || 0).toLocaleString()}</span>
                            <div className="text-[10px] text-slate-400">Credit Limit: ₹{(v.maxCreditLimit || 0).toLocaleString()}</div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(v)}
                                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                                title="Edit Vendor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVendor(v.id, v.companyName)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                                title="Delete Vendor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No vendors found matching your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((v) => (
                <div key={v.id} className="glass-panel p-5 rounded-3xl border border-white/10 bg-slate-900/60 flex flex-col justify-between space-y-4 shadow-xl">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-[#5ED29C] font-mono text-xs">{v.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${v.vendorType === 'Outsource Vendor' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                        {v.vendorType}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">{v.companyName}</h3>
                    <p className="text-xs text-slate-400">Contact: {v.contactPerson} ({v.designation})</p>
                    <p className="text-xs text-[#5ED29C] font-bold mt-1">{v.category}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                    <p className="font-mono">Phone: <span className="text-white font-bold">{v.phone}</span></p>
                    <p>Station: <span className="text-white">{v.station}, {v.state}</span></p>
                    {v.gstin && <p className="font-mono">GSTIN: <span className="text-emerald-400 font-bold">{v.gstin}</span></p>}
                    {v.bankName && <p className="font-mono text-[11px] text-cyan-400">Bank: {v.bankName} ({v.bankAccountNumber})</p>}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Outstanding</p>
                      <p className="font-mono font-black text-sm text-emerald-400">₹{(v.outstandingBalance || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleOpenEditModal(v)} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/30 hover:bg-amber-500/20">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteVendor(v.id, v.companyName)} className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GENERAL LEDGER MASTER TAB CONTENT */}
      {activeMainTab === 'LEDGERS' && (
        <div className="space-y-6">
          {/* SUMMARY METRIC CARDS FOR GENERAL LEDGER ACCOUNTS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ledger Accounts</p>
                <h3 className="text-2xl font-black text-white font-mono mt-1">{customLedgers.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bank Accounts</p>
                <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {customLedgers.filter((l) => l.groupType === 'Bank').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cash &amp; Petty Cash</p>
                <h3 className="text-2xl font-black text-amber-400 font-mono mt-1">
                  {customLedgers.filter((l) => l.groupType === 'Cash').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expense &amp; Claim Ledgers</p>
                <h3 className="text-2xl font-black text-purple-400 font-mono mt-1">
                  {customLedgers.filter((l) => l.groupType === 'Expense' || l.groupType === 'Income').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* LEDGER ACTION BUTTONS, GROUP FILTERS & PRINT DATE-WISE VOUCHER LEDGER STATEMENT BUTTON */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10 bg-slate-900/50">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setLedgerGroupFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  ledgerGroupFilter === 'ALL' ? 'bg-cyan-500 text-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                ALL GROUPS ({customLedgers.length})
              </button>
              <button
                onClick={() => setLedgerGroupFilter('Bank')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  ledgerGroupFilter === 'Bank' ? 'bg-emerald-500 text-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                BANK ACCOUNTS
              </button>
              <button
                onClick={() => setLedgerGroupFilter('Cash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  ledgerGroupFilter === 'Cash' ? 'bg-amber-500 text-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                CASH &amp; PETTY CASH
              </button>
              <button
                onClick={() => setLedgerGroupFilter('Expense')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  ledgerGroupFilter === 'Expense' ? 'bg-purple-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                EXPENSES &amp; REBATES
              </button>
              <button
                onClick={() => setLedgerGroupFilter('Credit / Party')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  ledgerGroupFilter === 'Credit / Party' ? 'bg-blue-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                CREDIT / PARTY
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ledger name, bank..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* DATE-WISE PRINT FUNCTIONALITY BUTTON */}
              <button
                onClick={() => setShowLedgerPrintModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" /> PRINT DATE-WISE VOUCHERS STATEMENT
              </button>

              <button
                onClick={handleOpenNewLedgerModal}
                className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> NEW LEDGER
              </button>
            </div>
          </div>

          {/* LEDGERS MASTER TABLE */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
                  <tr>
                    <th className="p-3.5">Account Ledger Name</th>
                    <th className="p-3.5">Group Type</th>
                    <th className="p-3.5">Bank / Account Details</th>
                    <th className="p-3.5">Remarks / Purpose</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right text-cyan-400">Opening Balance (Dr/Cr)</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
                  {filteredLedgers.length > 0 ? (
                    filteredLedgers.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition-all">
                        <td className="p-3.5">
                          <div className="font-extrabold text-white text-sm flex items-center gap-2">
                            {l.groupType === 'Bank' && <Landmark className="w-4 h-4 text-emerald-400" />}
                            {l.groupType === 'Cash' && <Wallet className="w-4 h-4 text-amber-400" />}
                            {l.groupType === 'Expense' && <DollarSign className="w-4 h-4 text-purple-400" />}
                            {l.groupType === 'Credit / Party' && <UserCheck className="w-4 h-4 text-blue-400" />}
                            <span>{l.accountName}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${
                            l.groupType === 'Bank' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            l.groupType === 'Cash' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            l.groupType === 'Expense' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          }`}>
                            {l.groupType}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {l.bankName ? (
                            <div>
                              <div className="font-bold text-slate-200">{l.bankName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">A/C: {l.accountNumber || 'N/A'} | IFSC: {l.ifscCode || 'N/A'}</div>
                              {l.branchName && <div className="text-[10px] text-slate-500">Branch: {l.branchName}</div>}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">N/A (Standard Ledger)</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">{l.remarks || 'Standard voucher ledger account'}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${l.activeStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                            {l.activeStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-extrabold text-sm">
                          <span className="text-cyan-400">₹{(l.openingBalance || 0).toLocaleString()}</span>
                          <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold ${l.balanceType === 'Dr' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                            {l.balanceType}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedLedgerForPrint(l.accountName);
                                setShowLedgerPrintModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                              title="Print Date-Wise Ledger Statement"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditLedgerModal(l)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                              title="Edit Ledger Account"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLedgerAccount(l.id, l.accountName)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                              title="Delete Ledger Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No General Ledger accounts found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT VENDOR MODAL */}
      {activeVendorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-3xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5ED29C]" />
                {activeVendorModal === 'new' ? 'Create New Hardware Vendor / Outsource Lab' : `Edit Vendor Details (${formData.companyName})`}
              </h2>
              <button onClick={() => setActiveVendorModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrModify} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Vendor Type *</label>
                  <select
                    value={formData.vendorType}
                    onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="Standard Vendor">Standard Hardware Vendor</option>
                    <option value="Outsource Vendor">Outsourced Repair / Data Recovery Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Hardware Supplies Pvt Ltd"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Rajiv Sharma"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mobile / Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98123-45678"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* DYNAMIC SELECT FIELDS WITH ADD/REMOVE CAPABILITY */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Category &amp; Industry</label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => openAddModal('category', 'Add New Vendor Category')}
                        className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                      >
                        + Add
                      </button>
                      <span className="text-white/20">|</span>
                      <button
                        type="button"
                        onClick={() => openRemoveModal('category', 'Remove Vendor Category', formData.category)}
                        className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Account Group</label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => openAddModal('accountGroup', 'Add New Account Group')}
                        className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                      >
                        + Add
                      </button>
                      <span className="text-white/20">|</span>
                      <button
                        type="button"
                        onClick={() => openRemoveModal('accountGroup', 'Remove Account Group', formData.accountGroup)}
                        className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <select
                    value={formData.accountGroup}
                    onChange={(e) => setFormData({ ...formData, accountGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    {accountGroups.map((g, i) => (
                      <option key={i} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="01AAAAA0000A1Z5"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Station / City</label>
                  <input
                    type="text"
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    placeholder="e.g. Jammu NCR"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* VENDOR BANK ACCOUNT SPECIFICATIONS */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-extrabold text-[#5ED29C] uppercase text-xs flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" /> Vendor Bank Account Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      placeholder="50200012345678"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankIfscCode}
                      onChange={(e) => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase() })}
                      placeholder="HDFC0003430"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Branch Location</label>
                    <input
                      type="text"
                      value={formData.bankBranch}
                      onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                      placeholder="Okhla Phase 3, Delhi"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setActiveVendorModal(null)} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase shadow-lg shadow-[#5ED29C]/20">
                  {activeVendorModal === 'new' ? 'Save Vendor Record' : 'Save Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE & EDIT GENERAL LEDGER ACCOUNT MODAL */}
      {activeLedgerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                {activeLedgerModal === 'new' ? 'Create New General Ledger Account' : `Modify Ledger (${ledgerFormData.accountName})`}
              </h2>
              <button onClick={() => setActiveLedgerModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrModifyLedger} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Account Ledger Name *</label>
                  <input
                    type="text"
                    required
                    value={ledgerFormData.accountName}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, accountName: e.target.value })}
                    placeholder="e.g. Axis Bank Current A/c 5510, Rent Expense"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Account Group Type *</label>
                  <select
                    value={ledgerFormData.groupType}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, groupType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-bold"
                  >
                    <option value="Bank">Bank Account</option>
                    <option value="Cash">Cash-in-Hand / Petty Cash</option>
                    <option value="Expense">Expense Account</option>
                    <option value="Income">Income / Claim Account</option>
                    <option value="Credit / Party">Credit / Party Account</option>
                    <option value="Capital">Capital Account</option>
                    <option value="Asset">Asset Account</option>
                    <option value="Liability">Liability Account</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    value={ledgerFormData.openingBalance}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, openingBalance: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Balance Indication (Dr/Cr)</label>
                  <select
                    value={ledgerFormData.balanceType}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, balanceType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    <option value="Dr">Debit (DR) - Assets, Cash, Bank, Expenses</option>
                    <option value="Cr">Credit (CR) - Liabilities, Capital, Income</option>
                  </select>
                </div>
              </div>

              {/* CONDITIONAL BANK DETAILS */}
              {ledgerFormData.groupType === 'Bank' && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="font-extrabold text-emerald-400 uppercase text-xs flex items-center gap-1.5">
                    <Landmark className="w-4 h-4" /> Bank Account Specifications
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={ledgerFormData.bankName}
                        onChange={(e) => setLedgerFormData({ ...ledgerFormData, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Account Number</label>
                      <input
                        type="text"
                        value={ledgerFormData.accountNumber}
                        onChange={(e) => setLedgerFormData({ ...ledgerFormData, accountNumber: e.target.value })}
                        placeholder="50200012345678"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={ledgerFormData.ifscCode}
                        onChange={(e) => setLedgerFormData({ ...ledgerFormData, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="HDFC0003430"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Branch Name</label>
                      <input
                        type="text"
                        value={ledgerFormData.branchName}
                        onChange={(e) => setLedgerFormData({ ...ledgerFormData, branchName: e.target.value })}
                        placeholder="Okhla Phase 3, Delhi"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* REMARKS & STATUS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Remarks / Purpose</label>
                  <input
                    type="text"
                    value={ledgerFormData.remarks}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, remarks: e.target.value })}
                    placeholder="e.g. Primary operating current account"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Active Status</label>
                  <select
                    value={ledgerFormData.activeStatus}
                    onChange={(e) => setLedgerFormData({ ...ledgerFormData, activeStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setActiveLedgerModal(null)} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase shadow-lg shadow-cyan-500/20">
                  {activeLedgerModal === 'new' ? 'Create Ledger Account' : 'Save Ledger Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED DATE-WISE VOUCHER LEDGERS PRINT STATEMENT MODAL */}
      {showLedgerPrintModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" /> Printable Date-Wise Voucher Ledger Statement
              </h3>
              <button onClick={() => setShowLedgerPrintModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINT FILTER & PARAMETER CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Target Voucher Ledger</label>
                <select
                  value={selectedLedgerForPrint}
                  onChange={(e) => setSelectedLedgerForPrint(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                >
                  <option value="ALL">All Voucher Ledgers Combined</option>
                  {customLedgers.map((l) => (
                    <option key={l.id} value={l.accountName}>
                      {l.accountName} ({l.groupType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Specific Voucher Type</label>
                <select
                  value={selectedVoucherTypeForPrint}
                  onChange={(e) => setSelectedVoucherTypeForPrint(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                >
                  <option value="ALL">All Vouchers (Receipts, Payments, Notes, Contra, Journals)</option>
                  <option value="RECEIPT">Receipts Only (Money In)</option>
                  <option value="PAYMENT">Payments Only (Money Out)</option>
                  <option value="DEBIT_NOTE">Debit Notes Only (Purchase Returns)</option>
                  <option value="CREDIT_NOTE">Credit Notes Only (Sales Returns)</option>
                  <option value="CONTRA">Contra Only (Bank/Cash Transfers)</option>
                  <option value="JOURNAL">Journals Only (Double Entry Adjustments)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date Period Filter</label>
                <select
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-xs"
                >
                  <option value="all">All Dates History</option>
                  <option value="today">Today Only</option>
                  <option value="week">This Week (Last 7 Days)</option>
                  <option value="month">This Month (Last 30 Days)</option>
                  <option value="custom">Custom Date Range...</option>
                </select>
              </div>

              {datePreset === 'custom' && (
                <div className="md:col-span-3 grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="ledger-statement-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
              {(copyType === 'both' ? ['ORIGINAL VOUCHER STATEMENT', 'AUDIT OFFICE RECORD'] : [copyType === 'standard' ? 'ORIGINAL VOUCHER STATEMENT' : 'AUDIT OFFICE RECORD']).map((copyTitle, copyIdx) => (
                <div key={copyIdx} className={`space-y-4 ${copyIdx > 0 ? 'pt-6 border-t-2 border-dashed border-slate-400' : ''}`}>
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-base font-black tracking-wider uppercase text-slate-900">{companyDetails.companyLegalName || 'ACCNO SOLUTION ERP'}</h2>
                      <p className="text-[10px] text-slate-600">{companyDetails.addressLine1}</p>
                      <p className="text-[10px] text-slate-600">{companyDetails.city}, {companyDetails.state} | Ph: {companyDetails.phoneNumber}</p>
                      {companyDetails.gstin && <p className="text-[10px] font-mono font-bold text-slate-800">GSTIN: {companyDetails.gstin}</p>}
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase rounded">{copyTitle}</span>
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Target Ledger: {selectedLedgerForPrint === 'ALL' ? 'All Voucher Ledgers' : selectedLedgerForPrint}</p>
                      <p className="text-[10px] text-slate-600">Voucher Type: {selectedVoucherTypeForPrint}</p>
                    </div>
                  </div>

                  {/* DATE-WISE VOUCHERS TABLE */}
                  <table className="w-full text-left text-[11px] border border-slate-300">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border border-slate-700">Date</th>
                        <th className="p-2 border border-slate-700">Voucher # &amp; Type</th>
                        <th className="p-2 border border-slate-700">Debit Ledger (DR)</th>
                        <th className="p-2 border border-slate-700">Credit Source (CR)</th>
                        <th className="p-2 border border-slate-700">Remarks / Narration</th>
                        <th className="p-2 border border-slate-700 text-right">Debit (Dr ₹)</th>
                        <th className="p-2 border border-slate-700 text-right">Credit (Cr ₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {printableVoucherEntries.length > 0 ? (
                        printableVoucherEntries.map((v, vIdx) => {
                          const isDr = ['RECEIPT', 'CREDIT_NOTE'].includes(v.voucherType);
                          const isCr = ['PAYMENT', 'DEBIT_NOTE'].includes(v.voucherType);
                          return (
                            <tr key={vIdx} className="hover:bg-slate-100">
                              <td className="p-2 font-mono text-slate-700 border border-slate-200">{v.voucherDate}</td>
                              <td className="p-2 border border-slate-200 font-mono">
                                <div className="font-extrabold text-slate-900">{v.voucherNumber}</div>
                                <span className="text-[9px] px-1 bg-slate-200 text-slate-800 font-bold rounded">{v.voucherType}</span>
                              </td>
                              <td className="p-2 border border-slate-200 font-bold text-emerald-800">{v.debitLedger || v.partyName || 'Vendor/Expense A/c'}</td>
                              <td className="p-2 border border-slate-200 font-bold text-rose-800">{v.creditLedger || v.partyName || 'Bank/Customer A/c'}</td>
                              <td className="p-2 border border-slate-200 italic text-slate-700 max-w-xs">{v.narration}</td>
                              <td className="p-2 border border-slate-200 text-right font-mono font-bold text-emerald-800">
                                {isDr ? `₹${v.totalAmount.toLocaleString()}` : '-'}
                              </td>
                              <td className="p-2 border border-slate-200 text-right font-mono font-bold text-rose-800">
                                {isCr ? `₹${v.totalAmount.toLocaleString()}` : '-'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-slate-500 italic">
                            No voucher entries found for the selected ledger, voucher type, and date range.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* SUMMARY TOTALS FOOTER CARD */}
                  <div className="p-3 bg-slate-900 text-white font-mono font-black text-xs rounded flex justify-between items-center">
                    <div>TOTAL DEBIT RECEIPTS: <span className="text-emerald-400">₹{totalPrintDebitSum.toLocaleString()} DR</span></div>
                    <div>TOTAL CREDIT PAYOUTS: <span className="text-rose-400">₹{totalPrintCreditSum.toLocaleString()} CR</span></div>
                    <div>NET CLOSING: <span className={netPrintBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}>₹{Math.abs(netPrintBalance).toLocaleString()} {netPrintBalance >= 0 ? 'DR' : 'CR'}</span></div>
                  </div>

                  <div className="flex justify-between items-end pt-8">
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Prepared By Accountant
                    </div>
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Approved By Auditor / Management
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button onClick={() => setShowLedgerPrintModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Cancel
              </button>
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                <Printer className="w-4 h-4" /> Print Date-Wise Voucher Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP MODAL FOR +ADD AND REMOVE OPTION */}
      {optionModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F15] border border-white/20 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                {optionModal.type === 'add' ? (
                  <>
                    <Plus className="w-4 h-4 text-[#5ED29C]" /> {optionModal.title}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-rose-400" /> {optionModal.title}
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {optionModal.error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{optionModal.error}</span>
              </div>
            )}

            {optionModal.type === 'add' ? (
              <form onSubmit={handleConfirmAddOption} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-bold mb-1">Option Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="Enter new option value..."
                    value={optionModal.nameInput}
                    onChange={(e) => setOptionModal((prev) => ({ ...prev, nameInput: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white text-xs focus:border-[#5ED29C] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5ED29C]/20"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Option
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-white/80 leading-relaxed">
                  Are you sure you want to remove the option:
                </p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-rose-400 font-mono break-all">
                  &ldquo;{optionModal.currentValue || 'Selected Option'}&rdquo;
                </div>
                <p className="text-[11px] text-white/50">
                  This option will be removed from future selection dropdowns.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRemoveOption}
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
