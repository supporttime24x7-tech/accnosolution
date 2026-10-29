'use client';

import React, { useState } from 'react';
import { useErpStore, AccountingVoucher } from '@/lib/store';
import {
  pushAccountingVoucherToSupabase,
  deleteAccountingVoucherFromSupabase,
} from '@/lib/supabase-sync';
import {
  RefreshCcw,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit3,
  X,
  ArrowRightLeft,
  Filter,
  RefreshCw,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

const standardLedgers = [
  'HDFC Bank A/c 9812',
  'ICICI Bank Current A/c 4410',
  'SBI Savings A/c 1029',
  'Cash-in-Hand',
  'Petty Cash Float',
  'Inter-Branch Cash Account',
  'Reserve Bank Deposit A/c'
];

export default function ContraVouchersPage() {
  const {
    accountingVouchers,
    addAccountingVoucher,
    updateAccountingVoucher,
    deleteAccountingVoucher,
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
  const [copyType, setCopyType] = useState<'both' | 'standard' | 'office'>('both');

  // Searchable Autocomplete States for Debit & Credit Fields
  const [debitSearch, setDebitSearch] = useState('');
  const [showDebitDropdown, setShowDebitDropdown] = useState(false);

  const [creditSearch, setCreditSearch] = useState('');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);

  const contraList = accountingVouchers.filter((v) => v.voucherType === 'CONTRA');

  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherDate: new Date().toISOString().split('T')[0],
    debitLedger: 'HDFC Bank A/c 9812',
    creditLedger: 'Cash-in-Hand',
    paymentMode: 'Cash Deposit' as AccountingVoucher['paymentMode'],
    instrumentRefNo: '',
    amount: 15000,
    narration: 'Cash deposited into HDFC Bank Account.',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.debitLedger === formData.creditLedger) {
      alert('Target Account (Debit) and Source Account (Credit) cannot be the same!');
      return;
    }
    if (formData.amount <= 0) {
      alert('Please enter a valid Transfer Amount.');
      return;
    }

    const count = contraList.length;
    const autoNo = formData.voucherNumber || `CNT-${1001 + count}`;

    const vPayload = {
      voucherNumber: autoNo,
      voucherType: 'CONTRA' as const,
      voucherDate: formData.voucherDate,
      debitLedger: formData.debitLedger,
      creditLedger: formData.creditLedger,
      paymentMode: formData.paymentMode,
      instrumentRefNo: formData.instrumentRefNo,
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
      debitLedger: v.debitLedger || 'HDFC Bank A/c 9812',
      creditLedger: v.creditLedger || 'Cash-in-Hand',
      paymentMode: v.paymentMode || 'Cash Deposit',
      instrumentRefNo: v.instrumentRefNo || '',
      amount: v.amount,
      narration: v.narration || '',
    });
    setDebitSearch(v.debitLedger || '');
    setCreditSearch(v.creditLedger || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucher) return;
    if (formData.debitLedger === formData.creditLedger) {
      alert('Target Account (Debit) and Source Account (Credit) cannot be the same!');
      return;
    }

    const updatedPayload = {
      voucherDate: formData.voucherDate,
      debitLedger: formData.debitLedger,
      creditLedger: formData.creditLedger,
      paymentMode: formData.paymentMode,
      instrumentRefNo: formData.instrumentRefNo,
      amount: formData.amount,
      totalAmount: formData.amount,
      narration: formData.narration,
    };

    updateAccountingVoucher(selectedVoucher.id, updatedPayload);
    pushAccountingVoucherToSupabase({ ...selectedVoucher, ...updatedPayload } as any).catch(() => {});

    setShowEditModal(false);
  };

  const handleDelete = (id: string, num: string) => {
    if (confirm(`Are you sure you want to delete Contra Entry ${num}?`)) {
      deleteAccountingVoucher(id);
      deleteAccountingVoucherFromSupabase(id).catch(() => {});
    }
  };

  // Date Filtering Logic
  const filteredContra = contraList.filter((v) => {
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      v.voucherNumber.toLowerCase().includes(q) ||
      (v.debitLedger && v.debitLedger.toLowerCase().includes(q)) ||
      (v.creditLedger && v.creditLedger.toLowerCase().includes(q)) ||
      (v.narration && v.narration.toLowerCase().includes(q));

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

  const totalContraAmount = filteredContra.reduce((sum, v) => sum + v.totalAmount, 0);

  // Helper search match functions
  const searchResults = (q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) return standardLedgers;
    return standardLedgers.filter((l) => l.toLowerCase().includes(query));
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
          #contra-print-target, #contra-print-target * {
            visibility: visible !important;
          }
          #contra-print-target {
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
            <RefreshCcw className="w-6 h-6 text-cyan-400" />
            <span>CONTRA ENTRIES (INTERNAL BANK &amp; CASH TRANSFERS)</span>
            <span className="text-cyan-400">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
              SEARCHABLE BANK &amp; CASH LEDGERS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable bank &amp; cash account autocomplete for Target Debit and Source Credit fields.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              voucherNumber: `CNT-${1001 + contraList.length}`,
              voucherDate: new Date().toISOString().split('T')[0],
              debitLedger: 'HDFC Bank A/c 9812',
              creditLedger: 'Cash-in-Hand',
              paymentMode: 'Cash Deposit',
              instrumentRefNo: '',
              amount: 15000,
              narration: 'Cash deposited into HDFC Bank Account.',
            });
            setDebitSearch('HDFC Bank A/c 9812');
            setCreditSearch('Cash-in-Hand');
            setShowCreateModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> RECORD CONTRA ENTRY
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contra Transfers</p>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{filteredContra.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <RefreshCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume Transferred</p>
            <h3 className="text-2xl font-black text-cyan-400 font-mono mt-1">₹{totalContraAmount.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Internal Transfer Status</p>
            <h3 className="text-sm font-black text-slate-200 mt-1">Zero Tax &amp; Balanced Cashflow</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
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
            placeholder="Search Contra #, Debit/Credit Account, Remarks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* DATE PRESETS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Date Filter:
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setDatePreset('all')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'all' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              ALL DATES
            </button>
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'today' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              TODAY
            </button>
            <button
              onClick={() => setDatePreset('week')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'week' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              THIS WEEK
            </button>
            <button
              onClick={() => setDatePreset('month')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'month' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
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

      {/* CONTRA TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5">Contra # / Date</th>
                <th className="p-3.5">Target Debit Account [DR]</th>
                <th className="p-3.5">Source Credit Account [CR]</th>
                <th className="p-3.5">Transfer Mode &amp; Ref</th>
                <th className="p-3.5">Remarks / Purpose</th>
                <th className="p-3.5 text-right text-cyan-400">Transfer Amount (CR/DR)</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filteredContra.length > 0 ? (
                filteredContra.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3.5">
                      <div className="font-extrabold text-cyan-400 font-mono text-sm">{v.voucherNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.voucherDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">DR</span>
                        <span>{v.debitLedger}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-rose-400 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[9px] font-mono font-bold">CR</span>
                        <span>{v.creditLedger}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        {v.paymentMode || 'Transfer'}
                      </span>
                      {v.instrumentRefNo && <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {v.instrumentRefNo}</div>}
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{v.narration || 'No remarks recorded'}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-sm">
                      <span className="text-cyan-400">₹{v.totalAmount.toLocaleString()}</span>
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">DR/CR</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                          title="Edit Contra Entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVoucher(v);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                          title="Print Contra Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.voucherNumber)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Delete Contra Entry"
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
                    No contra entries recorded matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT CONTRA MODAL WITH SEARCHABLE DEBIT & CREDIT AUTOCOMPLETE DROPDOWNS */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-cyan-400" />
                {showEditModal ? `Edit Contra Entry (${selectedVoucher?.voucherNumber})` : 'Record Cash/Bank Contra Transfer'}
              </h2>
              <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contra # *</label>
                  <input
                    type="text"
                    value={formData.voucherNumber}
                    onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Transfer Date *</label>
                  <input
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => setFormData({ ...formData, voucherDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* SEARCHABLE TARGET DEBIT & SOURCE CREDIT ACCOUNT FIELDS */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="relative">
                  <label className="block font-extrabold mb-1 text-emerald-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono">DR</span>
                    Target Debit Account (Money In) *
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
                      placeholder="Search bank or cash account..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold"
                    />
                    <Search className="w-4 h-4 text-emerald-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showDebitDropdown && debitMatches.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-800">
                      {debitMatches.map((acc, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setFormData({ ...formData, debitLedger: acc });
                            setDebitSearch(acc);
                            setShowDebitDropdown(false);
                          }}
                          className="p-2.5 hover:bg-slate-800 cursor-pointer font-bold text-emerald-400 text-xs flex justify-between items-center"
                        >
                          <span>{acc}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Bank/Cash</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block font-extrabold mb-1 text-rose-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono">CR</span>
                    Source Credit Account (Money Out) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={creditSearch || formData.creditLedger}
                      onChange={(e) => {
                        setCreditSearch(e.target.value);
                        setFormData({ ...formData, creditLedger: e.target.value });
                        setShowCreditDropdown(true);
                      }}
                      onFocus={() => setShowCreditDropdown(true)}
                      placeholder="Search bank or cash account..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-400 font-bold"
                    />
                    <Search className="w-4 h-4 text-rose-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showCreditDropdown && creditMatches.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-800">
                      {creditMatches.map((acc, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setFormData({ ...formData, creditLedger: acc });
                            setCreditSearch(acc);
                            setShowCreditDropdown(false);
                          }}
                          className="p-2.5 hover:bg-slate-800 cursor-pointer font-bold text-rose-400 text-xs flex justify-between items-center"
                        >
                          <span>{acc}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Bank/Cash</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Transfer Mode *</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="Cash Deposit">Cash Deposit into Bank</option>
                    <option value="Cash Withdrawal">Cash Withdrawal from ATM/Bank</option>
                    <option value="Inter-Bank Transfer">Inter-Bank Account Transfer</option>
                    <option value="Petty Cash Transfer">Petty Cash Replenishment</option>
                  </select>
                </div>

                {/* AMOUNT FIELD WITH EXPLICIT CR/DR INDICATION */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                    <span>Transfer Amount (₹) *</span>
                    <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      DR TO TARGET / CR FROM SOURCE
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-mono font-extrabold text-base"
                  />
                </div>
              </div>

              {/* REMARKS / NARRATION FIELD */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks / Transfer Purpose *</label>
                <input
                  type="text"
                  required
                  value={formData.narration}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="e.g. Cash deposited into HDFC Bank Account."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase shadow-lg shadow-cyan-500/20">
                  {showEditModal ? 'Save Contra Changes' : 'Record Contra Entry'}
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
                <Printer className="w-5 h-5 text-cyan-400" /> Contra Transfer Voucher Print Preview
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
                  <option value="both">Both Original Voucher &amp; Office Copy</option>
                  <option value="standard">Original Contra Voucher Only</option>
                  <option value="office">Duplicate Office Record Only</option>
                </select>
              </div>
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="contra-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
              {(copyType === 'both' ? ['ORIGINAL CONTRA VOUCHER', 'OFFICE RECORD COPY'] : [copyType === 'standard' ? 'ORIGINAL CONTRA VOUCHER' : 'OFFICE RECORD COPY']).map((copyTitle, copyIdx) => (
                <div key={copyIdx} className={`space-y-4 ${copyIdx > 0 ? 'pt-6 border-t-2 border-dashed border-slate-400' : ''}`}>
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-base font-black tracking-wider uppercase text-slate-900">{companyDetails.companyLegalName || 'ACCNO SOLUTION ERP'}</h2>
                      <p className="text-[10px] text-slate-600">{companyDetails.addressLine1}</p>
                      <p className="text-[10px] text-slate-600">{companyDetails.city}, {companyDetails.state} | Ph: {companyDetails.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase rounded">{copyTitle}</span>
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Contra #: {selectedVoucher.voucherNumber}</p>
                      <p className="text-[10px] text-slate-600">Date: {selectedVoucher.voucherDate}</p>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-3 rounded space-y-1.5 border border-slate-300">
                    <p>Target Account (Debit In - DR): <span className="font-extrabold text-emerald-700">{selectedVoucher.debitLedger}</span></p>
                    <p>Source Account (Credit Out - CR): <span className="font-extrabold text-rose-700">{selectedVoucher.creditLedger}</span></p>
                    <p>Transfer Mode: <span className="font-bold">{selectedVoucher.paymentMode}</span> {selectedVoucher.instrumentRefNo ? `(Ref: ${selectedVoucher.instrumentRefNo})` : ''}</p>
                    <p>Remarks / Transfer Purpose: <span className="italic text-slate-900 font-bold">{selectedVoucher.narration}</span></p>
                  </div>

                  <div className="p-3 bg-slate-900 text-white font-mono font-black text-base rounded flex justify-between items-center">
                    <span>AMOUNT TRANSFERRED:</span>
                    <span className="text-cyan-400">₹{selectedVoucher.totalAmount.toLocaleString()} (DR/CR)</span>
                  </div>

                  <div className="flex justify-between items-end pt-8">
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Accountant / Cashier Signature
                    </div>
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Authorized Signatory
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Cancel
              </button>
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                <Printer className="w-4 h-4" /> Print Contra Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
