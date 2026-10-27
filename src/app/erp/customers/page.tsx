'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Trash2, Edit3, X, Check, Building, Phone, Mail, Globe,
  Calendar, CreditCard, Shield, MapPin, UserCheck, AlertCircle, FileSpreadsheet,
  MessageSquare, Star, Award, CheckCircle2, ShieldAlert, Landmark, QrCode
} from 'lucide-react';
import { useErpStore, CustomerItem } from '@/lib/store';

export default function CustomersPage() {
  const { customers, customerRules, addCustomer, updateCustomer, deleteCustomer } = useErpStore();
  const [search, setSearch] = useState('');
  
  // Display format initialized from global customer rules
  const [viewFormat, setViewFormat] = useState<'tabular' | 'grid'>(customerRules.displayFormat);

  useEffect(() => {
    setViewFormat(customerRules.displayFormat);
  }, [customerRules.displayFormat]);

  // Modal state: null = closed, 'new' = creating new, CustomerItem = editing/viewing existing
  const [activeCustomerModal, setActiveCustomerModal] = useState<'new' | CustomerItem | null>(null);

  // Default Options with LocalStorage Persistence
  const DEFAULT_CATEGORIES = ['Sundry Debtor', 'Sundry Creditor', 'Both (Debtor & Creditor)'];
  const DEFAULT_ACCOUNT_GROUPS = ['Retail', 'Wholesale', 'Corporate / B2B', 'Healthcare / Institutional', 'Government'];
  const DEFAULT_STATES = [
    '01 - Jammu & Kashmir',
    '02 - Himachal Pradesh',
    '03 - Punjab',
    '07 - Delhi',
    '08 - Rajasthan',
  ];
  const DEFAULT_CITIES: { [key: string]: { name: string; pinCode: string }[] } = {
    '01 - Jammu & Kashmir': [
      { name: 'Jammu', pinCode: '180001' },
      { name: 'Srinagar', pinCode: '190001' },
      { name: 'Udhampur', pinCode: '182101' },
    ],
    '03 - Punjab': [
      { name: 'Ludhiana', pinCode: '141001' },
      { name: 'Amritsar', pinCode: '143001' },
    ],
  };
  const DEFAULT_ACCOUNT_STATUSES = ['Active', 'Inactive', 'Blocked', 'On Hold', 'AMC Client'];
  const DEFAULT_ACCOUNT_TYPES = ['Current Account', 'Savings Account', 'Overdraft / Cash Credit (CC)', 'Salary Account'];

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [accountGroups, setAccountGroups] = useState<string[]>(DEFAULT_ACCOUNT_GROUPS);
  const [states, setStates] = useState<string[]>(DEFAULT_STATES);
  const [cities, setCities] = useState<{ [key: string]: { name: string; pinCode: string }[] }>(DEFAULT_CITIES);
  const [accountStatuses, setAccountStatuses] = useState<string[]>(DEFAULT_ACCOUNT_STATUSES);
  const [accountTypes, setAccountTypes] = useState<string[]>(DEFAULT_ACCOUNT_TYPES);

  // In-App Modal Dialog for +ADD and REMOVE dropdown options
  const [optionModal, setOptionModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    field: 'category' | 'accountGroup' | 'state' | 'city' | 'accountType' | 'accountStatus';
    title: string;
    currentValue?: string;
    nameInput: string;
    extraInput: string;
    error?: string;
  }>({
    isOpen: false,
    type: 'add',
    field: 'category',
    title: '',
    nameInput: '',
    extraInput: '',
  });

  // Load persisted dropdown options on mount
  useEffect(() => {
    try {
      const sCat = localStorage.getItem('accno_customer_categories');
      if (sCat) setCategories(JSON.parse(sCat));
      const sGrp = localStorage.getItem('accno_customer_account_groups');
      if (sGrp) setAccountGroups(JSON.parse(sGrp));
      const sSt = localStorage.getItem('accno_customer_states');
      if (sSt) setStates(JSON.parse(sSt));
      const sCity = localStorage.getItem('accno_customer_cities');
      if (sCity) setCities(JSON.parse(sCity));
      const sStat = localStorage.getItem('accno_customer_account_statuses');
      if (sStat) setAccountStatuses(JSON.parse(sStat));
      const sTyp = localStorage.getItem('accno_customer_account_types');
      if (sTyp) setAccountTypes(JSON.parse(sTyp));
    } catch {}
  }, []);

  // Form State for 23 Fields (including Bank Details)
  const [formData, setFormData] = useState<Omit<CustomerItem, 'id' | 'code' | 'totalRepairs'>>({
    name: '',
    companyName: '',
    category: 'Sundry Debtor',
    accountGroup: 'Retail',
    mobile: '',
    alternateContact: '',
    email: '',
    website: '',
    dob: '',
    weddingAnniversary: '',
    panNumber: '',
    gstin: '',
    state: '01 - Jammu & Kashmir',
    billingAddress: '',
    shippingAddress: '',
    city: 'Jammu',
    pinCode: '180001',
    accountStatus: 'Active',
    referredBy: '',
    creditLimit: customerRules.defaultMaxCreditLimit,
    outstandingBalance: 0,
    internalNotes: '',

    // Bank Details (6 Specified Fields + UPI)
    bankAccountName: '',
    bankAccountType: 'Current Account',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankBranch: '',
    upiId: '',

    loyaltyPoints: 0,
    kycVerified: false,
    tier: 'Standard',
  });

  // Manage dynamic option inputs
  const [newOptionInput, setNewOptionInput] = useState<{ [key: string]: string }>({});

  const handleOpenNewModal = () => {
    setFormData({
      name: '',
      companyName: '',
      category: categories[0] || 'Sundry Debtor',
      accountGroup: accountGroups[0] || 'Retail',
      mobile: '',
      alternateContact: '',
      email: '',
      website: '',
      dob: '',
      weddingAnniversary: '',
      panNumber: '',
      gstin: '',
      state: states[0] || '01 - Jammu & Kashmir',
      billingAddress: '',
      shippingAddress: '',
      city: cities[states[0]]?.[0]?.name || 'Jammu',
      pinCode: cities[states[0]]?.[0]?.pinCode || '180001',
      accountStatus: accountStatuses[0] || 'Active',
      referredBy: '',
      creditLimit: customerRules.defaultMaxCreditLimit,
      outstandingBalance: 0,
      internalNotes: '',

      bankAccountName: '',
      bankAccountType: 'Current Account',
      bankAccountNumber: '',
      bankIfscCode: '',
      bankName: '',
      bankBranch: '',
      upiId: '',

      loyaltyPoints: 0,
      kycVerified: false,
      tier: 'Standard',
    });
    setActiveCustomerModal('new');
  };

  const handleOpenEditModal = (cust: CustomerItem) => {
    setFormData({
      name: cust.name,
      companyName: cust.companyName || '',
      category: cust.category || categories[0],
      accountGroup: cust.accountGroup || accountGroups[0],
      mobile: cust.mobile,
      alternateContact: cust.alternateContact || '',
      email: cust.email || '',
      website: cust.website || '',
      dob: cust.dob || '',
      weddingAnniversary: cust.weddingAnniversary || '',
      panNumber: cust.panNumber || '',
      gstin: cust.gstin || '',
      state: cust.state || states[0],
      billingAddress: cust.billingAddress || '',
      shippingAddress: cust.shippingAddress || '',
      city: cust.city || 'Jammu',
      pinCode: cust.pinCode || '180001',
      accountStatus: cust.accountStatus || 'Active',
      referredBy: cust.referredBy || '',
      creditLimit: cust.creditLimit || customerRules.defaultMaxCreditLimit,
      outstandingBalance: cust.outstandingBalance || 0,
      internalNotes: cust.internalNotes || '',

      bankAccountName: cust.bankAccountName || '',
      bankAccountType: cust.bankAccountType || 'Current Account',
      bankAccountNumber: cust.bankAccountNumber || '',
      bankIfscCode: cust.bankIfscCode || '',
      bankName: cust.bankName || '',
      bankBranch: cust.bankBranch || '',
      upiId: cust.upiId || '',

      loyaltyPoints: cust.loyaltyPoints || 0,
      kycVerified: cust.kycVerified || Boolean(cust.gstin || cust.panNumber),
      tier: cust.tier || (cust.creditLimit > 100000 ? 'Platinum VIP' : 'Standard'),
    });
    setActiveCustomerModal(cust);
  };

  const handleSaveOrModify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    if (activeCustomerModal === 'new') {
      addCustomer(formData);
    } else if (typeof activeCustomerModal === 'object' && activeCustomerModal !== null) {
      updateCustomer(activeCustomerModal.id, formData);
    }

    setActiveCustomerModal(null);
  };

  const handleDelete = () => {
    if (typeof activeCustomerModal === 'object' && activeCustomerModal !== null) {
      if (confirm(`Are you sure you want to delete customer "${activeCustomerModal.name}"?`)) {
        deleteCustomer(activeCustomerModal.id);
        setActiveCustomerModal(null);
      }
    }
  };

  // Helper to persist dropdown options
  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('accno_customer_categories', JSON.stringify(updated));
    } catch {}
  };

  const saveAccountGroups = (updated: string[]) => {
    setAccountGroups(updated);
    try {
      localStorage.setItem('accno_customer_account_groups', JSON.stringify(updated));
    } catch {}
  };

  const saveStates = (updated: string[]) => {
    setStates(updated);
    try {
      localStorage.setItem('accno_customer_states', JSON.stringify(updated));
    } catch {}
  };

  const saveCities = (updated: { [key: string]: { name: string; pinCode: string }[] }) => {
    setCities(updated);
    try {
      localStorage.setItem('accno_customer_cities', JSON.stringify(updated));
    } catch {}
  };

  const saveAccountStatuses = (updated: string[]) => {
    setAccountStatuses(updated);
    try {
      localStorage.setItem('accno_customer_account_statuses', JSON.stringify(updated));
    } catch {}
  };

  const saveAccountTypes = (updated: string[]) => {
    setAccountTypes(updated);
    try {
      localStorage.setItem('accno_customer_account_types', JSON.stringify(updated));
    } catch {}
  };

  const openAddModal = (
    field: 'category' | 'accountGroup' | 'state' | 'city' | 'accountType' | 'accountStatus',
    title: string
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      field,
      title,
      nameInput: '',
      extraInput: field === 'city' ? (formData.pinCode || '180001') : (field === 'state' ? '09' : ''),
      error: undefined,
    });
  };

  const openRemoveModal = (
    field: 'category' | 'accountGroup' | 'state' | 'city' | 'accountType' | 'accountStatus',
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
      extraInput: '',
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
    } else if (optionModal.field === 'state') {
      const code = optionModal.extraInput.trim();
      const fullState = code ? `${code} - ${val}` : val;
      if (states.some((s) => s.toLowerCase() === fullState.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This state already exists.' }));
        return;
      }
      const updated = [...states, fullState];
      saveStates(updated);
      setFormData((prev) => ({ ...prev, state: fullState }));
    } else if (optionModal.field === 'city') {
      const stKey = formData.state || states[0] || '';
      const pin = optionModal.extraInput.trim() || '180001';
      const currentList = cities[stKey] || [];
      if (currentList.some((c) => c.name.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This city already exists for the selected state.' }));
        return;
      }
      const updatedList = [...currentList, { name: val, pinCode: pin }];
      const updatedCities = { ...cities, [stKey]: updatedList };
      saveCities(updatedCities);
      setFormData((prev) => ({ ...prev, city: val, pinCode: pin }));
    } else if (optionModal.field === 'accountType') {
      if (accountTypes.some((t) => t.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This bank account type already exists.' }));
        return;
      }
      const updated = [...accountTypes, val];
      saveAccountTypes(updated);
      setFormData((prev) => ({ ...prev, bankAccountType: val }));
    } else if (optionModal.field === 'accountStatus') {
      if (accountStatuses.some((s) => s.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This account status already exists.' }));
        return;
      }
      const updated = [...accountStatuses, val];
      saveAccountStatuses(updated);
      setFormData((prev) => ({ ...prev, accountStatus: val }));
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
    } else if (optionModal.field === 'state') {
      if (states.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one state must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.state;
      const updated = states.filter((s) => s !== target);
      saveStates(updated);
      if (formData.state === target) {
        const nextState = updated[0] || '';
        const firstCity = cities[nextState]?.[0];
        setFormData((prev) => ({
          ...prev,
          state: nextState,
          city: firstCity?.name || '',
          pinCode: firstCity?.pinCode || '',
        }));
      }
    } else if (optionModal.field === 'city') {
      const stKey = formData.state || states[0] || '';
      const currentList = cities[stKey] || [];
      if (currentList.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one city must remain for this state.' }));
        return;
      }
      const target = optionModal.currentValue || formData.city;
      const updated = currentList.filter((c) => c.name !== target);
      const updatedCities = { ...cities, [stKey]: updated };
      saveCities(updatedCities);
      if (formData.city === target) {
        setFormData((prev) => ({
          ...prev,
          city: updated[0]?.name || '',
          pinCode: updated[0]?.pinCode || '',
        }));
      }
    } else if (optionModal.field === 'accountType') {
      if (accountTypes.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one account type must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.bankAccountType;
      const updated = accountTypes.filter((t) => t !== target);
      saveAccountTypes(updated);
      if (formData.bankAccountType === target) {
        setFormData((prev) => ({ ...prev, bankAccountType: updated[0] || '' }));
      }
    } else if (optionModal.field === 'accountStatus') {
      if (accountStatuses.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one account status must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.accountStatus;
      const updated = accountStatuses.filter((s) => s !== target);
      saveAccountStatuses(updated);
      if (formData.accountStatus === target) {
        setFormData((prev) => ({ ...prev, accountStatus: updated[0] || '' }));
      }
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const filteredCustomers = customers.filter(
    (c: any) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.gstin?.toLowerCase().includes(search.toLowerCase()) ||
      c.bankName?.toLowerCase().includes(search.toLowerCase()) ||
      c.bankAccountNumber?.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const vis = customerRules.fieldVisibility;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Users className="w-6 h-6 text-[#5ED29C]" />
            CUSTOMER MASTER DIRECTORY<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Complete Customer Master Records, Bank Account Details (Holder, Type, A/C No, IFSC, Bank Name, Branch), risk scoring, and credit policies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Format Toggle (Rule 2) */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewFormat('tabular')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewFormat === 'tabular' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-white/60 hover:text-white'
              }`}
              title="Single-line format (tabular list layout)"
            >
              List View
            </button>
            <button
              onClick={() => setViewFormat('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewFormat === 'grid' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-white/60 hover:text-white'
              }`}
              title="Box format (visual grid card layout)"
            >
              Box Grid
            </button>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="px-5 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Customer
          </button>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, GSTIN, Bank, A/C No..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
          />
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
        </div>

        <div className="flex items-center space-x-6 text-xs text-white/70">
          <div>
            Total Accounts: <span className="font-mono font-bold text-[#5ED29C]">{customers.length}</span>
          </div>
          <div>
            Platinum VIP: <span className="font-mono font-bold text-[#16FFC6]">
              {customers.filter((c: any) => c.tier === 'Platinum VIP' || (c.creditLimit || 0) > 100000).length}
            </span>
          </div>
          <div>
            Blocked Credit: <span className="font-mono font-bold text-rose-400">
              {customers.filter((c: any) => (c.outstandingBalance || 0) > (c.creditLimit || 0)).length}
            </span>
          </div>
        </div>
      </div>

      {/* RENDER FORMAT 1: SINGLE-LINE TABULAR LAYOUT */}
      {viewFormat === 'tabular' ? (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Customer Code</th>
                {vis.name && <th className="p-4">Name / Company</th>}
                {vis.category && <th className="p-4">Category & Tier</th>}
                {vis.mobile && <th className="p-4">Mobile & City</th>}
                {vis.bankDetails && <th className="p-4">Bank Details (Holder, A/C, IFSC, Bank, Branch)</th>}
                {vis.outstandingBalance && <th className="p-4">Credit / Outstanding</th>}
                {vis.accountStatus && <th className="p-4">Status & Risk</th>}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((c: any) => {
                const isOverCredit = (c.outstandingBalance || 0) > (c.creditLimit || 0);
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#5ED29C]">{c.code}</td>
                    
                    {vis.name && (
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {c.name}
                          {c.kycVerified && <span title="KYC Verified Account"><CheckCircle2 className="w-3.5 h-3.5 text-[#16FFC6]" /></span>}
                        </div>
                        {vis.companyName && c.companyName && <div className="text-[10px] text-white/50">{c.companyName}</div>}
                      </td>
                    )}

                    {vis.category && (
                      <td className="p-4">
                        <div className="text-white/90 font-semibold">{c.category || 'Sundry Debtor'}</div>
                        {vis.accountGroup && <div className="text-[10px] text-white/50">{c.accountGroup}</div>}
                      </td>
                    )}

                    {vis.mobile && (
                      <td className="p-4">
                        <div className="font-mono text-white/80">{c.mobile}</div>
                        {vis.city && <div className="text-[10px] text-white/50">{c.city}, {c.state?.split('-')[1]?.trim() || ''}</div>}
                      </td>
                    )}

                    {vis.bankDetails && (
                      <td className="p-4">
                        {c.bankName ? (
                          <div>
                            <div className="font-bold text-white flex items-center gap-1">
                              <Landmark className="w-3 h-3 text-[#5ED29C]" /> {c.bankName} ({c.bankAccountType || 'Current'})
                            </div>
                            <div className="text-[10px] font-mono text-white/70">Holder: {c.bankAccountName || c.name}</div>
                            <div className="text-[10px] font-mono text-white/60">A/C: {c.bankAccountNumber || 'N/A'}</div>
                            <div className="text-[10px] font-mono text-[#16FFC6]">IFSC: {c.bankIfscCode || 'N/A'} | {c.bankBranch || ''}</div>
                          </div>
                        ) : (
                          <span className="text-white/30 italic">No Bank Info</span>
                        )}
                      </td>
                    )}

                    {vis.outstandingBalance && (
                      <td className="p-4 font-mono">
                        {vis.creditLimit && <div className="text-white/60 text-[10px]">Limit: ₹{(c.creditLimit || 0).toLocaleString()}</div>}
                        <div className={`font-bold ${isOverCredit ? 'text-rose-400' : 'text-emerald-400'}`}>
                          Due: ₹{(c.outstandingBalance || 0).toLocaleString()}
                        </div>
                      </td>
                    )}

                    {vis.accountStatus && (
                      <td className="p-4">
                        {isOverCredit && customerRules.blockBillingOnCreditExceeded ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" /> Billing Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#5ED29C]/20 text-[#5ED29C] border border-[#5ED29C]/30">
                            {c.accountStatus}
                          </span>
                        )}
                      </td>
                    )}

                    <td className="p-4 text-right space-x-2">
                      {(c.outstandingBalance || 0) > 0 && (
                        <a
                          href={`https://wa.me/${c.mobile.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(c.name)},%20your%20outstanding%20balance%20with%20ACCNO%20SOLUTION%20is%20INR%20${c.outstandingBalance}.%20Please%20settle%20to%20avoid%20credit%20block.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[10px] font-bold uppercase inline-flex items-center gap-1"
                          title="Send WhatsApp Payment Reminder"
                        >
                          <MessageSquare className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#5ED29C] text-white hover:text-[#070B0A] font-bold text-[11px] uppercase transition-all"
                      >
                        View / Modify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* RENDER FORMAT 2: BOX VISUAL GRID CARD LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((c: any) => {
            const isOverCredit = (c.outstandingBalance || 0) > (c.creditLimit || 0);
            return (
              <div
                key={c.id}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                  isOverCredit && customerRules.blockBillingOnCreditExceeded
                    ? 'border-rose-500/50 bg-rose-500/[0.02]'
                    : 'border-white/10 hover:border-[#5ED29C]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2.5 py-1 rounded-full">
                      {c.code}
                    </span>
                    {vis.accountStatus && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#5ED29C]/20 text-[#5ED29C]">
                        {c.accountStatus}
                      </span>
                    )}
                  </div>

                  {vis.name && (
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      {c.name}
                      {c.kycVerified && <CheckCircle2 className="w-4 h-4 text-[#16FFC6]" />}
                    </h3>
                  )}
                  {vis.companyName && c.companyName && <div className="text-xs text-white/50">{c.companyName}</div>}

                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                    {vis.mobile && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Mobile:</span>
                        <span className="font-mono text-white">{c.mobile}</span>
                      </div>
                    )}
                    {vis.city && (
                      <div className="flex justify-between">
                        <span className="text-white/50">City / State:</span>
                        <span className="text-white">{c.city}, {c.state?.split('-')[1]?.trim() || ''}</span>
                      </div>
                    )}
                    {vis.bankDetails && c.bankName && (
                      <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
                        <span className="text-white/50">Bank Account:</span>
                        <span className="font-mono text-[#5ED29C]">{c.bankName} ({c.bankAccountType || 'Current'})</span>
                      </div>
                    )}
                    {vis.creditLimit && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Credit Limit:</span>
                        <span className="font-mono text-white/80">₹{(c.creditLimit || 0).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  {vis.outstandingBalance && (
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase">Outstanding</span>
                      <span className={`font-mono text-sm font-bold ${isOverCredit ? 'text-rose-400' : 'text-emerald-400'}`}>
                        ₹{(c.outstandingBalance || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="px-4 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase"
                  >
                    Modify / View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POP-UP WINDOW / MODAL FOR CUSTOMER INFORMATION (ALL FIELDS INCLUDING BANK DETAILS) */}
      {activeCustomerModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="glass-panel rounded-3xl border border-[#5ED29C]/40 max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden bg-[#0A0E14]">
            
            {/* FROZEN STICKY MODAL TITLE BAR */}
            <div className="sticky top-0 z-30 bg-[#0D131A] px-6 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide text-white flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-[#5ED29C]" />
                  {activeCustomerModal === 'new' ? 'CREATE NEW CUSTOMER MASTER' : `MODIFY CUSTOMER MASTER: ${activeCustomerModal.code}`}
                </h2>
                <p className="text-xs text-white/50 mt-0.5 font-medium">
                  Configure full customer profile, statutory tax numbers, bank account parameters & credit limits
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCustomerModal(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM CONTAINING ALL REARRANGED CARDS */}
            <form onSubmit={handleSaveOrModify} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
              
              {/* SECTION 1: PRIMARY IDENTITY & BUSINESS CLASSIFICATION */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5ED29C]" /> 1. Identity & Business Classification
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {vis.name && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">1. Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] focus:ring-1 focus:ring-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.companyName && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">2. Company Registered Name</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Tech Logics Pvt Ltd"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] focus:ring-1 focus:ring-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.category && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">3. Category</label>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openAddModal('category', 'Add New Customer Category')}
                            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => openRemoveModal('category', 'Remove Customer Category', formData.category)}
                            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {vis.accountGroup && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">4. Account Group</label>
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
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                      >
                        {accountGroups.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: CONTACT & DIGITAL COMMUNICATION */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  2. Contact & Digital Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {vis.mobile && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">5. Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+91 94191-00000"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.alternateContact && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">6. Alternate Contact</label>
                      <input
                        type="text"
                        value={formData.alternateContact}
                        onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                        placeholder="+91 98100-00000"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.email && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">7. Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@company.com"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.website && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">8. Website URL</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="www.company.com"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: DATES & STATUTORY TAX COMPLIANCE */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  3. Important Dates & Statutory Tax Compliance
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {vis.dob && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">9. Date of Birth (DOB)</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.weddingAnniversary && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">10. Wedding Anniversary</label>
                      <input
                        type="date"
                        value={formData.weddingAnniversary}
                        onChange={(e) => setFormData({ ...formData, weddingAnniversary: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.panNumber && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">11. PAN Card Number</label>
                      <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono uppercase focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.gstin && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">12. GSTIN Number</label>
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                        placeholder="01AAAAA0000A1Z5"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono uppercase focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: BILLING ADDRESS & SHIPPING SITE ADDRESS */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  4. Billing Address & Site Office Shipping Address
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vis.state && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">13. State + GST Code</label>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openAddModal('state', 'Add New State & GST Code')}
                            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => openRemoveModal('state', 'Remove State Option', formData.state)}
                            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <select
                        value={formData.state}
                        onChange={(e) => {
                          const st = e.target.value;
                          const firstCity = cities[st]?.[0];
                          setFormData({
                            ...formData,
                            state: st,
                            city: firstCity?.name || '',
                            pinCode: firstCity?.pinCode || '',
                          });
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      >
                        {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {vis.billingAddress && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">14. Full Billing Address</label>
                      <input
                        type="text"
                        value={formData.billingAddress}
                        onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                        placeholder="Head Office / Billing Address..."
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vis.city && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">15. City</label>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openAddModal('city', 'Add New City & Pin Code')}
                            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => openRemoveModal('city', 'Remove City Option', formData.city)}
                            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <select
                        value={formData.city}
                        onChange={(e) => {
                          const cityName = e.target.value;
                          const stKey = formData.state || states[0];
                          const found = cities[stKey]?.find((c) => c.name === cityName);
                          setFormData({ ...formData, city: cityName, pinCode: found?.pinCode || formData.pinCode });
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      >
                        {(cities[formData.state || states[0]] || [{ name: formData.city, pinCode: formData.pinCode }]).map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {vis.pinCode && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">16. Pin Code</label>
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        placeholder="180001"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.shippingAddress && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">17. Site / Branch Address (Shipping)</label>
                      <input
                        type="text"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        placeholder="Secondary site office..."
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: CUSTOMER BANK DETAILS */}
              {vis.bankDetails && (
                <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                  <span className="text-xs font-black text-[#16FFC6] uppercase tracking-wider flex items-center gap-2 border-b border-[#16FFC6]/20 pb-2">
                    <Landmark className="w-4 h-4 text-[#16FFC6]" /> 5. Customer Bank Details (Account Holder, Type, A/C No, IFSC, Bank Name, Branch)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* 1. Account Holder Name */}
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Account Holder Name</label>
                      <input
                        type="text"
                        value={formData.bankAccountName}
                        onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                        placeholder="e.g. Rajesh Kumar / Tech Logics"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>

                    {/* 2. Account Type */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">Account Type</label>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openAddModal('accountType', 'Add New Bank Account Type')}
                            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => openRemoveModal('accountType', 'Remove Bank Account Type', formData.bankAccountType)}
                            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <select
                        value={formData.bankAccountType}
                        onChange={(e) => setFormData({ ...formData, bankAccountType: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                      >
                        {accountTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Account Number */}
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Account Number</label>
                      <input
                        type="text"
                        value={formData.bankAccountNumber}
                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                        placeholder="e.g. 50100239485712"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>

                    {/* 4. IFSC Code */}
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.bankIfscCode}
                        onChange={(e) => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono uppercase focus:border-[#5ED29C] outline-none"
                      />
                    </div>

                    {/* 5. Bank Name */}
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>

                    {/* 6. Branch Name */}
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Branch Name / Location</label>
                      <input
                        type="text"
                        value={formData.bankBranch}
                        onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                        placeholder="e.g. Gandhi Nagar Branch, Jammu"
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: FINANCIAL PARAMETERS, RISK MANAGEMENT & NOTES */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  6. Financial Parameters & Risk Management
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {vis.accountStatus && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white/80 font-bold">18. Account Status</label>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openAddModal('accountStatus', 'Add New Account Status')}
                            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => openRemoveModal('accountStatus', 'Remove Account Status', formData.accountStatus)}
                            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <select
                        value={formData.accountStatus}
                        onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                      >
                        {accountStatuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {vis.referredBy && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">19. Referred By</label>
                      <input
                        type="text"
                        value={formData.referredBy}
                        onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                        placeholder="Reference contact name..."
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.creditLimit && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">20. Credit Limit (₹)</label>
                      <input
                        type="number"
                        value={formData.creditLimit}
                        onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}

                  {vis.outstandingBalance && (
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">21. Outstanding Balance (₹)</label>
                      <input
                        type="number"
                        value={formData.outstandingBalance}
                        onChange={(e) => setFormData({ ...formData, outstandingBalance: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  )}
                </div>

                {vis.internalNotes && (
                  <div>
                    <label className="block text-white/80 mb-1 font-bold">22. Internal Customer Notes</label>
                    <textarea
                      rows={3}
                      value={formData.internalNotes}
                      onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                      placeholder="Confidential credit terms, repair history notes..."
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* FROZEN STICKY MODAL FOOTER ACTION BAR */}
              <div className="sticky bottom-0 z-30 bg-[#0D131A] px-6 sm:px-8 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 mt-6">
                <div>
                  {typeof activeCustomerModal === 'object' && activeCustomerModal !== null && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-6 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Customer
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveCustomerModal(null)}
                    className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel / Close
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black uppercase tracking-wider shadow-lg shadow-[#5ED29C]/25 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    {activeCustomerModal === 'new' ? 'Save New Customer' : 'Modify Customer'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Dynamic Option Modal for +ADD / REMOVE */}
      {optionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F15] border border-white/20 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                {optionModal.type === 'add' ? (
                  <>
                    <Plus className="w-4 h-4 text-[#5ED29C]" />
                    {optionModal.title}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    {optionModal.title}
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
                {optionModal.field === 'state' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/70 text-xs font-bold mb-1">State GST Code (2 digits)</label>
                      <input
                        type="text"
                        placeholder="e.g. 09"
                        value={optionModal.extraInput}
                        onChange={(e) => setOptionModal((prev) => ({ ...prev, extraInput: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white font-mono text-xs focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-bold mb-1">State Name</label>
                      <input
                        type="text"
                        autoFocus
                        required
                        placeholder="e.g. Uttar Pradesh"
                        value={optionModal.nameInput}
                        onChange={(e) => setOptionModal((prev) => ({ ...prev, nameInput: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white text-xs focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  </div>
                ) : optionModal.field === 'city' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/50 text-xs font-medium mb-1">For Selected State</label>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/90 text-xs font-mono">
                        {formData.state || states[0] || 'No state selected'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-bold mb-1">City Name</label>
                      <input
                        type="text"
                        autoFocus
                        required
                        placeholder="e.g. Varanasi"
                        value={optionModal.nameInput}
                        onChange={(e) => setOptionModal((prev) => ({ ...prev, nameInput: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white text-xs focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-bold mb-1">Postal Pin Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 221001"
                        value={optionModal.extraInput}
                        onChange={(e) => setOptionModal((prev) => ({ ...prev, extraInput: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white font-mono text-xs focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  </div>
                ) : (
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
                )}

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
