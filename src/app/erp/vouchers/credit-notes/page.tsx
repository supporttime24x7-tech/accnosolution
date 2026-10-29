'use client';

import React, { useState } from 'react';
import { useErpStore, AccountingVoucher } from '@/lib/store';
import {
  pushAccountingVoucherToSupabase,
  deleteAccountingVoucherFromSupabase,
} from '@/lib/supabase-sync';
import {
  FileCode,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit3,
  X,
  Filter,
  RefreshCw,
  User,
  CheckCircle2,
  BookOpen,
  Building2
} from 'lucide-react';

const standardLedgers = [
  'Sales Return / Customer Rebate Account',
  'Customer Account (Accounts Receivable)',
  'HDFC Bank A/c 9812',
  'ICICI Bank Current A/c 4410',
  'Cash-in-Hand',
  'Petty Cash Float',
  'Discount Allowed Account',
  'Goodwill & Service Guarantee Account'
];

export default function CreditNotesPage() {
  const {
    accountingVouchers,
    addAccountingVoucher,
    updateAccountingVoucher,
    deleteAccountingVoucher,
    customers,
    vendors,
    salesInvoices,
    companyDetails
  } = useErpStore();

  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<AccountingVoucher | null>(null);

  // Print Controls
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [copyType, setCopyType] = useState<'both' | 'customer' | 'office'>('both');

  // Searchable Autocomplete States for Debit & Credit Fields
  const [debitSearch, setDebitSearch] = useState('');
  const [showDebitDropdown, setShowDebitDropdown] = useState(false);

  const [creditSearch, setCreditSearch] = useState('');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);

  const creditNotesList = accountingVouchers.filter((v) => v.voucherType === 'CREDIT_NOTE');

  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherDate: new Date().toISOString().split('T')[0],
    partyName: '',
    partyPhone: '',
    partyGst: '',
    refInvoiceNumber: '',
    debitLedger: 'Sales Return / Customer Rebate Account',
    creditLedger: 'Customer Account (Accounts Receivable)',
    amount: 1000,
    narration: 'Credit Note issued to customer for sales return / goodwill rebate.',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partyName || !formData.amount) {
      alert('Please fill out Customer Name and Amount.');
      return;
    }

    const count = creditNotesList.length;
    const autoNo = formData.voucherNumber || `CRN-${1001 + count}`;

    const vPayload = {
      voucherNumber: autoNo,
      voucherType: 'CREDIT_NOTE' as const,
      voucherDate: formData.voucherDate,
      partyName: formData.partyName,
      partyPhone: formData.partyPhone,
      partyGst: formData.partyGst,
      refInvoiceNumber: formData.refInvoiceNumber,
      debitLedger: formData.debitLedger,
      creditLedger: formData.creditLedger,
      amount: formData.amount,
      totalAmount: formData.amount,
      narration: formData.narration,
    };

    addAccountingVoucher(vPayload);
    pushAccountingVoucherToSupabase(vPayload as any).catch(() => {});

    setShowCreateModal(false);
  };

  const handleOpenEdit = (v: AccountingVoucher) => {
    setSelectedVoucher(v);
    setFormData({
      voucherNumber: v.voucherNumber,
      voucherDate: v.voucherDate,
      partyName: v.partyName || '',
      partyPhone: v.partyPhone || '',
      partyGst: v.partyGst || '',
      refInvoiceNumber: v.refInvoiceNumber || '',
      debitLedger: v.debitLedger || 'Sales Return / Customer Rebate Account',
      creditLedger: v.creditLedger || 'Customer Account (Accounts Receivable)',
      amount: v.amount,
      narration: v.narration || '',
    });
    setDebitSearch(v.debitLedger || '');
    setCreditSearch(v.partyName || v.creditLedger || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucher) return;

    const updatedPayload = {
      voucherDate: formData.voucherDate,
      partyName: formData.partyName,
      partyPhone: formData.partyPhone,
      partyGst: formData.partyGst,
      refInvoiceNumber: formData.refInvoiceNumber,
      debitLedger: formData.debitLedger,
      creditLedger: formData.creditLedger,
      amount: formData.amount,
      totalAmount: formData.amount,
      narration: formData.narration,
    };

    updateAccountingVoucher(selectedVoucher.id, updatedPayload);
    pushAccountingVoucherToSupabase({ ...selectedVoucher, ...updatedPayload } as any).catch(() => {});

    setShowEditModal(false);
  };

  const handleDelete = (id: string, num: string) => {
    if (confirm(`Are you sure you want to delete Credit Note ${num}?`)) {
      deleteAccountingVoucher(id);
      deleteAccountingVoucherFromSupabase(id).catch(() => {});
    }
  };

  // Date Filtering Logic
  const filteredNotes = creditNotesList.filter((v) => {
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      v.voucherNumber.toLowerCase().includes(q) ||
      (v.partyName && v.partyName.toLowerCase().includes(q)) ||
      (v.refInvoiceNumber && v.refInvoiceNumber.toLowerCase().includes(q)) ||
      (v.narration && v.narration.toLowerCase().includes(q)) ||
      (v.debitLedger && v.debitLedger.toLowerCase().includes(q)) ||
      (v.creditLedger && v.creditLedger.toLowerCase().includes(q));

    if (!matchesQuery) return false;

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
  });

  const totalCreditNotesAmount = filteredNotes.reduce((sum, v) => sum + v.totalAmount, 0);

  // Helper search match functions
  const searchResults = (q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) return { customers: [], vendors: [], ledgers: [] };

    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        (c.gstin && c.gstin.toLowerCase().includes(query))
    );

    const matchedVendors = vendors.filter(
      (v) =>
        (v.companyName && v.companyName.toLowerCase().includes(query)) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(query)) ||
        (v.phone && v.phone.includes(query)) ||
        (v.gstin && v.gstin.toLowerCase().includes(query))
    );

    const matchedLedgers = standardLedgers.filter((l) => l.toLowerCase().includes(query));

    return { customers: matchedCustomers, vendors: matchedVendors, ledgers: matchedLedgers };
  };

  const debitMatches = searchResults(debitSearch);
  const creditMatches = searchResults(creditSearch);

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
          #creditnote-print-target, #creditnote-print-target * {
            visibility: visible !important;
          }
          #creditnote-print-target {
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

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl bg-slate-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase flex flex-wrap items-center gap-2">
            <FileCode className="w-6 h-6 text-purple-400" />
            <span>CREDIT NOTES (SALES RETURNS &amp; REBATES)</span>
            <span className="text-purple-400">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
              SEARCHABLE DEBIT &amp; CREDIT LEDGERS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable party &amp; rebate ledger autocomplete for Debit Account and Credit Party fields.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              voucherNumber: `CRN-${1001 + creditNotesList.length}`,
              voucherDate: new Date().toISOString().split('T')[0],
              partyName: '',
              partyPhone: '',
              partyGst: '',
              refInvoiceNumber: '',
              debitLedger: 'Sales Return / Customer Rebate Account',
              creditLedger: 'Customer Account (Accounts Receivable)',
              amount: 1000,
              narration: 'Credit Note issued to customer for sales return / goodwill rebate.',
            });
            setDebitSearch('Sales Return / Customer Rebate Account');
            setCreditSearch('');
            setShowCreateModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> ISSUE NEW CREDIT NOTE
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Credit Notes Issued</p>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{filteredNotes.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Credit Reversal Amount [CR]</p>
            <h3 className="text-2xl font-black text-purple-400 font-mono mt-1">₹{totalCreditNotesAmount.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Searchable Ledgers Engine</p>
            <h3 className="text-sm font-black text-slate-200 mt-1">Customers, Vendors &amp; Rebates</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Credit Note #, Customer Name, Remarks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* DATE PRESETS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-purple-400" /> Date Filter:
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setDatePreset('all')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'all' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ALL DATES
            </button>
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'today' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              TODAY
            </button>
            <button
              onClick={() => setDatePreset('week')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'week' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              THIS WEEK
            </button>
            <button
              onClick={() => setDatePreset('month')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'month' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              THIS MONTH
            </button>
          </div>

          {datePreset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <span className="text-slate-500 text-xs">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          )}

          {datePreset !== 'all' && (
            <button
              onClick={() => {
                setDatePreset('all');
                setFromDate('');
                setToDate('');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CREDIT NOTES TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5">Credit Note # / Date</th>
                <th className="p-3.5">Debit Account / Rebate Head [DR]</th>
                <th className="p-3.5">Credit Party / Customer [CR]</th>
                <th className="p-3.5">Ref Sales Invoice #</th>
                <th className="p-3.5">Remarks / Reason</th>
                <th className="p-3.5 text-right text-purple-400">Credit Amount (CR/DR)</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3.5">
                      <div className="font-extrabold text-purple-400 font-mono text-sm">{v.voucherNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.voucherDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">DR</span>
                        <span>{v.debitLedger || 'Sales Return / Rebate Account'}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-purple-300 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold">CR</span>
                        <span>{v.creditLedger || v.partyName || 'Customer Account'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.partyPhone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{v.refInvoiceNumber || 'Direct Credit Rebate'}</td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{v.narration || 'No remarks recorded'}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-sm">
                      <span className="text-purple-400">₹{v.totalAmount.toLocaleString()}</span>
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">CR</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                          title="Edit Credit Note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVoucher(v);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                          title="Print Credit Note"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.voucherNumber)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Delete Credit Note"
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
                    No credit notes recorded matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT CREDIT NOTE MODAL WITH SEARCHABLE DEBIT & CREDIT AUTOCOMPLETE DROPDOWNS */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                {showEditModal ? `Edit Credit Note (${selectedVoucher?.voucherNumber})` : 'Issue New Credit Note to Customer'}
              </h2>
              <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Credit Note # *</label>
                  <input
                    type="text"
                    value={formData.voucherNumber}
                    onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => setFormData({ ...formData, voucherDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* SEARCHABLE DEBIT ACCOUNT & CREDIT PARTY FIELDS */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="relative">
                  <label className="block font-extrabold mb-1 text-emerald-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono">DR</span>
                    Debit Account / Rebate Head *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={debitSearch || formData.debitLedger}
                      onChange={(e) => {
                        setDebitSearch(e.target.value);
                        setFormData({ ...formData, debitLedger: e.target.value });
                        setShowDebitDropdown(true);
                      }}
                      onFocus={() => setShowDebitDropdown(true)}
                      placeholder="Search rebate, return or ledger..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold"
                    />
                    <Search className="w-4 h-4 text-emerald-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showDebitDropdown && (debitMatches.ledgers.length > 0 || debitMatches.customers.length > 0 || debitMatches.vendors.length > 0) && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                      {debitMatches.ledgers.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3" /> Rebate &amp; Return Ledgers</div>
                          {debitMatches.ledgers.map((l, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setFormData({ ...formData, debitLedger: l });
                                setDebitSearch(l);
                                setShowDebitDropdown(false);
                              }}
                              className="p-2 hover:bg-slate-800 cursor-pointer font-bold text-emerald-400 text-xs"
                            >
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* SEARCHABLE CREDIT PARTY / CUSTOMER NAME FIELD */}
                <div className="relative">
                  <label className="block font-extrabold mb-1 text-purple-300 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono">CR</span>
                    Credit Party / Customer Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={creditSearch || formData.partyName}
                      onChange={(e) => {
                        setCreditSearch(e.target.value);
                        setFormData({
                          ...formData,
                          partyName: e.target.value,
                          creditLedger: `Customer Account - ${e.target.value}`,
                        });
                        setShowCreditDropdown(true);
                      }}
                      onFocus={() => setShowCreditDropdown(true)}
                      placeholder="Search customer, party or ledger..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-white font-bold"
                    />
                    <Search className="w-4 h-4 text-purple-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showCreditDropdown && (creditMatches.customers.length > 0 || creditMatches.vendors.length > 0 || creditMatches.ledgers.length > 0) && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                      {creditMatches.customers.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Customers</div>
                          {creditMatches.customers.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  partyName: c.name,
                                  partyPhone: c.mobile,
                                  partyGst: c.gstin || '',
                                  creditLedger: `Customer Account - ${c.name}`,
                                });
                                setCreditSearch(c.name);
                                setShowCreditDropdown(false);
                              }}
                              className="p-2 hover:bg-slate-800 cursor-pointer flex justify-between items-center text-xs"
                            >
                              <div>
                                <div className="font-bold text-white">{c.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{c.mobile} {c.gstin ? `| GST: ${c.gstin}` : ''}</div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono font-bold">Select</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {creditMatches.ledgers.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3" /> Standard Ledgers</div>
                          {creditMatches.ledgers.map((l, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setFormData({ ...formData, creditLedger: l });
                                setCreditSearch(l);
                                setShowCreditDropdown(false);
                              }}
                              className="p-2 hover:bg-slate-800 cursor-pointer font-bold text-purple-300 text-xs"
                            >
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ref Sales Invoice #</label>
                  <select
                    value={formData.refInvoiceNumber}
                    onChange={(e) => {
                      const selectedInvNo = e.target.value;
                      const matchedInv = salesInvoices.find((inv) => inv.invoiceNo === selectedInvNo);
                      if (matchedInv) {
                        setFormData({
                          ...formData,
                          refInvoiceNumber: selectedInvNo,
                          partyName: matchedInv.customerName || formData.partyName,
                          partyPhone: matchedInv.customerPhone || formData.partyPhone,
                          partyGst: matchedInv.customerGst || formData.partyGst,
                          amount: matchedInv.grandTotal,
                        });
                        if (matchedInv.customerName) setCreditSearch(matchedInv.customerName);
                      } else {
                        setFormData({ ...formData, refInvoiceNumber: selectedInvNo });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold"
                  >
                    <option value="">Direct Credit Rebate / Manual</option>
                    {salesInvoices.map((inv) => (
                      <option key={inv.id} value={inv.invoiceNo}>
                        {inv.invoiceNo} ({inv.customerName} - ₹{inv.grandTotal.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* AMOUNT FIELD WITH EXPLICIT CR/DR INDICATION */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                    <span>Credit Amount (₹) *</span>
                    <span className="text-xs font-mono font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                      CREDIT (CR) TO CUSTOMER
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-purple-400 font-mono font-extrabold text-base"
                  />
                </div>
              </div>

              {/* REMARKS / NARRATION FIELD */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks / Rebate Reason *</label>
                <input
                  type="text"
                  required
                  value={formData.narration}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="e.g. Credit Note Issued to customer for sales return / goodwill rebate."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold uppercase shadow-lg shadow-purple-600/20">
                  {showEditModal ? 'Save Credit Note Changes' : 'Issue Credit Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MULTI-FORMAT DEDICATED PRINT MODAL */}
      {showPrintModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <Printer className="w-5 h-5 text-purple-400" /> Credit Note Voucher Print Preview
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINT FORMAT & COPY SELECTION BAR */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Paper Size Format</label>
                <select
                  value={paperFormat}
                  onChange={(e) => setPaperFormat(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                >
                  <option value="A4">A4 Full Sheet Standard</option>
                  <option value="A5">A5 Compact Slip</option>
                  <option value="THERMAL">3" POS Thermal Roll</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Voucher Copy Type</label>
                <select
                  value={copyType}
                  onChange={(e) => setCopyType(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                >
                  <option value="both">Both Customer Copy &amp; Office Copy</option>
                  <option value="customer">Customer Copy Only</option>
                  <option value="office">Duplicate Office Record Only</option>
                </select>
              </div>
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="creditnote-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
              {(copyType === 'both' ? ['CUSTOMER CREDIT COPY', 'OFFICE RECORD COPY'] : [copyType === 'customer' ? 'CUSTOMER CREDIT COPY' : 'OFFICE RECORD COPY']).map((copyTitle, copyIdx) => (
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
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Credit Note #: {selectedVoucher.voucherNumber}</p>
                      <p className="text-[10px] text-slate-600">Date: {selectedVoucher.voucherDate}</p>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-3 rounded space-y-1.5 border border-slate-300">
                    <p>Debit Rebate Account (DR): <span className="font-extrabold text-emerald-800">{selectedVoucher.debitLedger || 'Sales Return / Rebate Account'}</span></p>
                    <p>Credit Customer Party (CR): <span className="font-extrabold text-slate-900">{selectedVoucher.creditLedger || selectedVoucher.partyName}</span> {selectedVoucher.partyPhone ? `(Ph: ${selectedVoucher.partyPhone})` : ''}</p>
                    {selectedVoucher.partyGst && <p>Customer GSTIN: <span className="font-mono font-bold">{selectedVoucher.partyGst}</span></p>}
                    <p>Against Ref Sales Invoice #: <span className="font-mono font-bold text-slate-900">{selectedVoucher.refInvoiceNumber || 'Direct Credit Reversal'}</span></p>
                    <p>Remarks / Rebate Reason: <span className="italic text-slate-900 font-bold">{selectedVoucher.narration}</span></p>
                  </div>

                  <div className="p-3 bg-slate-900 text-white font-mono font-black text-base rounded flex justify-between items-center">
                    <span>TOTAL CREDIT VALUE ISSUED [CR]:</span>
                    <span className="text-purple-400">₹{selectedVoucher.totalAmount.toLocaleString()} CR</span>
                  </div>

                  <div className="flex justify-between items-end pt-8">
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Customer Signature
                    </div>
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Authorized Manager Signature
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Cancel
              </button>
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20">
                <Printer className="w-4 h-4" /> Print Credit Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
