'use client';

import React, { useState } from 'react';
import { useErpStore, AccountingVoucher, JournalLineItem } from '@/lib/store';
import {
  BookOpen,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit3,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RefreshCw,
  User,
  Building2,
  DollarSign,
  Zap,
  Calendar,
  FileText
} from 'lucide-react';

export default function JournalEntriesPage() {
  const {
    accountingVouchers,
    addAccountingVoucher,
    updateAccountingVoucher,
    deleteAccountingVoucher,
    customers,
    vendors,
    customLedgers,
    companyDetails
  } = useErpStore();

  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<AccountingVoucher | null>(null);

  // Print Controls
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [copyType, setCopyType] = useState<'both' | 'standard' | 'office'>('both');

  const journalsList = accountingVouchers.filter((v) => v.voucherType === 'JOURNAL');

  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherDate: new Date().toISOString().split('T')[0],
    narration: 'Month-end adjustment journal entry.',
  });

  const [lines, setLines] = useState<JournalLineItem[]>([
    { id: '1', accountLedger: 'Depreciation Expense', type: 'DEBIT', amount: 4500, narration: 'Monthly lab equipment depreciation' },
    { id: '2', accountLedger: 'Accumulated Depreciation - Cleanroom Equipment', type: 'CREDIT', amount: 4500, narration: 'Accumulated depreciation credit' }
  ]);

  const [newLine, setNewLine] = useState({
    accountLedger: '',
    type: 'DEBIT' as 'DEBIT' | 'CREDIT',
    amount: 1000,
    narration: ''
  });

  const [lineSearch, setLineSearch] = useState('');
  const [showLineDropdown, setShowLineDropdown] = useState(false);

  const totalDebitSum = lines.filter((l) => l.type === 'DEBIT').reduce((sum, l) => sum + l.amount, 0);
  const totalCreditSum = lines.filter((l) => l.type === 'CREDIT').reduce((sum, l) => sum + l.amount, 0);
  const isBalanced = totalDebitSum === totalCreditSum && totalDebitSum > 0;
  const balanceDifference = Math.abs(totalDebitSum - totalCreditSum);

  const handleAddLine = () => {
    if (!newLine.accountLedger || newLine.amount <= 0) {
      alert('Please select an Account Ledger and enter an Amount > 0.');
      return;
    }
    setLines((prev) => [...prev, { ...newLine, id: `line-${Date.now()}` }]);
    setNewLine({ accountLedger: '', type: 'DEBIT', amount: 1000, narration: '' });
    setLineSearch('');
  };

  const handleRemoveLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAutoBalance = () => {
    if (totalDebitSum === totalCreditSum) return;

    if (totalDebitSum > totalCreditSum) {
      const diff = totalDebitSum - totalCreditSum;
      setLines((prev) => [
        ...prev,
        {
          id: `line-${Date.now()}`,
          accountLedger: newLine.accountLedger || 'Accumulated Depreciation / Credit Ledger',
          type: 'CREDIT',
          amount: diff,
          narration: 'Auto-balancing credit line item',
        },
      ]);
    } else {
      const diff = totalCreditSum - totalDebitSum;
      setLines((prev) => [
        ...prev,
        {
          id: `line-${Date.now()}`,
          accountLedger: newLine.accountLedger || 'General Expense / Debit Ledger',
          type: 'DEBIT',
          amount: diff,
          narration: 'Auto-balancing debit line item',
        },
      ]);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length < 2) {
      alert('A Journal Entry requires at least 2 line items (at least one Debit and one Credit)!');
      return;
    }
    if (!isBalanced) {
      alert(`Total Debits (₹${totalDebitSum.toLocaleString()}) must equal Total Credits (₹${totalCreditSum.toLocaleString()}) before posting a Journal Entry!`);
      return;
    }

    const count = journalsList.length;
    const autoNo = formData.voucherNumber || `JRN-${1001 + count}`;
    const primaryDebit = lines.find((l) => l.type === 'DEBIT')?.accountLedger || 'Debit Ledger';
    const primaryCredit = lines.find((l) => l.type === 'CREDIT')?.accountLedger || 'Credit Ledger';

    addAccountingVoucher({
      voucherNumber: autoNo,
      voucherType: 'JOURNAL',
      voucherDate: formData.voucherDate,
      debitLedger: primaryDebit,
      creditLedger: primaryCredit,
      journalLines: lines,
      amount: totalDebitSum,
      totalAmount: totalDebitSum,
      narration: formData.narration,
    });

    setShowCreateModal(false);
  };

  const handleOpenView = (v: AccountingVoucher) => {
    setSelectedVoucher(v);
    setShowViewModal(true);
  };

  const handleOpenEdit = (v: AccountingVoucher) => {
    setSelectedVoucher(v);
    setFormData({
      voucherNumber: v.voucherNumber,
      voucherDate: v.voucherDate,
      narration: v.narration || '',
    });
    setLines(v.journalLines || []);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucher) return;
    if (lines.length < 2) {
      alert('A Journal Entry requires at least 2 line items!');
      return;
    }
    if (!isBalanced) {
      alert('Total Debits must equal Total Credits before posting a Journal Entry!');
      return;
    }

    const primaryDebit = lines.find((l) => l.type === 'DEBIT')?.accountLedger || 'Debit Ledger';
    const primaryCredit = lines.find((l) => l.type === 'CREDIT')?.accountLedger || 'Credit Ledger';

    updateAccountingVoucher(selectedVoucher.id, {
      voucherDate: formData.voucherDate,
      debitLedger: primaryDebit,
      creditLedger: primaryCredit,
      journalLines: lines,
      amount: totalDebitSum,
      totalAmount: totalDebitSum,
      narration: formData.narration,
    });

    setShowEditModal(false);
  };

  const handleDelete = (id: string, num: string) => {
    if (confirm(`Are you sure you want to delete Journal Entry ${num}?`)) {
      deleteAccountingVoucher(id);
      if (showViewModal) setShowViewModal(false);
    }
  };

  // Search results combining store custom ledgers, customers, vendors
  const lineSearchResults = (q: string) => {
    const query = q.toLowerCase().trim();

    const customLedgerNames = customLedgers.map((l) => l.accountName);
    const matchedCustomLedgers = customLedgerNames.filter((l) => !query || l.toLowerCase().includes(query));

    const matchedCustomers = customers.filter(
      (c) =>
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        (c.gstin && c.gstin.toLowerCase().includes(query))
    );

    const matchedVendors = vendors.filter(
      (v) =>
        !query ||
        (v.companyName && v.companyName.toLowerCase().includes(query)) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(query)) ||
        (v.phone && v.phone.includes(query)) ||
        (v.gstin && v.gstin.toLowerCase().includes(query))
    );

    return { customLedgers: matchedCustomLedgers, customers: matchedCustomers, vendors: matchedVendors };
  };

  const lineMatches = lineSearchResults(lineSearch);

  // Date Filtering Logic
  const filteredJournals = journalsList.filter((v) => {
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      v.voucherNumber.toLowerCase().includes(q) ||
      (v.narration && v.narration.toLowerCase().includes(q)) ||
      (v.journalLines && v.journalLines.some((l) => l.accountLedger.toLowerCase().includes(q) || (l.narration && l.narration.toLowerCase().includes(q))));

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

  const totalJournalsVolume = filteredJournals.reduce((sum, v) => sum + v.totalAmount, 0);

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
          #journal-print-target, #journal-print-target * {
            visibility: visible !important;
          }
          #journal-print-target {
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
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>JOURNAL ENTRIES (DOUBLE ENTRY ADJUSTMENTS)</span>
            <span className="text-indigo-400">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              VIEW &amp; ENTRY OPERATIONAL
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable party &amp; general ledger autocomplete for multi-line journal entries with 1-click auto-balancing.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              voucherNumber: `JRN-${1001 + journalsList.length}`,
              voucherDate: new Date().toISOString().split('T')[0],
              narration: 'Month-end adjustment journal entry.',
            });
            setLines([
              { id: '1', accountLedger: 'Depreciation Expense', type: 'DEBIT', amount: 4500, narration: 'Monthly lab equipment depreciation' },
              { id: '2', accountLedger: 'Accumulated Depreciation - Cleanroom Equipment', type: 'CREDIT', amount: 4500, narration: 'Accumulated depreciation credit' }
            ]);
            setShowCreateModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> POST NEW JOURNAL ENTRY
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Journal Vouchers</p>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{filteredJournals.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Double-Entry Volume</p>
            <h3 className="text-2xl font-black text-indigo-400 font-mono mt-1">₹{totalJournalsVolume.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accounting Standard</p>
            <h3 className="text-sm font-black text-slate-200 mt-1">Strict Double-Entry (Dr = Cr)</h3>
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
            placeholder="Search Journal #, Ledger Account, Remarks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* DATE PRESETS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-indigo-400" /> Date Filter:
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setDatePreset('all')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'all' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ALL DATES
            </button>
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'today' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              TODAY
            </button>
            <button
              onClick={() => setDatePreset('week')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'week' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              THIS WEEK
            </button>
            <button
              onClick={() => setDatePreset('month')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'month' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
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

      {/* JOURNALS TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5">Journal # / Date</th>
                <th className="p-3.5">Multi-Line Double Entry Breakdown (DR / CR)</th>
                <th className="p-3.5">Remarks / Overall Narration</th>
                <th className="p-3.5 text-right text-indigo-400">Total DR / CR (₹)</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3.5">
                      <button
                        onClick={() => handleOpenView(v)}
                        className="font-extrabold text-indigo-400 font-mono text-sm hover:underline text-left"
                      >
                        {v.voucherNumber}
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono">{v.voucherDate}</div>
                    </td>
                    <td className="p-3.5 space-y-1">
                      {v.journalLines && v.journalLines.length > 0 ? (
                        v.journalLines.map((line, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold font-mono ${line.type === 'DEBIT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                              {line.type === 'DEBIT' ? 'DR' : 'CR'}
                            </span>
                            <span className="font-bold text-white">{line.accountLedger}</span>
                            <span className="font-mono text-slate-300">₹{line.amount.toLocaleString()}</span>
                            {line.narration && <span className="text-[10px] text-slate-500 italic">({line.narration})</span>}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 italic">No entry lines</div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{v.narration || 'No remarks recorded'}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-indigo-400 text-sm">
                      ₹{v.totalAmount.toLocaleString()} <span className="text-[10px] text-slate-400">DR/CR</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenView(v)}
                          className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                          title="View Journal Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                          title="Edit / Entry Journal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVoucher(v);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                          title="Print Journal Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.voucherNumber)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Delete Journal Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No journal entries recorded matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* READ-ONLY VIEW JOURNAL VOUCHER DETAILS MODAL */}
      {showViewModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase">
                    Journal Voucher Details ({selectedVoucher.voucherNumber})
                  </h3>
                  <p className="text-[10px] text-slate-400">Posted on {selectedVoucher.voucherDate}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VOUCHER AUDIT SUMMARY BAR */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Voucher Number</span>
                <span className="font-mono font-black text-indigo-400 text-sm">{selectedVoucher.voucherNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Voucher Date</span>
                <span className="font-mono font-bold text-white text-xs">{selectedVoucher.voucherDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Status &amp; Verification</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                  BALANCED &amp; POSTED
                </span>
              </div>
            </div>

            {/* DETAILED BREAKDOWN TABLE */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Multi-Line Double-Entry Breakdown</h4>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 uppercase text-slate-400 text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Debit / Credit Party Account</th>
                      <th className="p-2.5">Line Remark</th>
                      <th className="p-2.5 text-right">Debit (DR ₹)</th>
                      <th className="p-2.5 text-right">Credit (CR ₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {selectedVoucher.journalLines?.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold ${line.type === 'DEBIT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                            {line.type === 'DEBIT' ? 'DEBIT (DR)' : 'CREDIT (CR)'}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-white">{line.accountLedger}</td>
                        <td className="p-2.5 italic text-slate-400 text-[11px]">{line.narration || '-'}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                          {line.type === 'DEBIT' ? `₹${line.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-400">
                          {line.type === 'CREDIT' ? `₹${line.amount.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* OVERALL REMARKS & TOTAL AMOUNT */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-400 block uppercase text-[10px]">Overall Journal Explanation / Narration</span>
              <p className="text-white font-medium italic">{selectedVoucher.narration}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-xs font-mono font-black">
              <span className="text-slate-400 uppercase text-[11px]">Total Double-Entry Transaction Volume:</span>
              <span className="text-indigo-400 text-base">₹{selectedVoucher.totalAmount.toLocaleString()} DR / CR</span>
            </div>

            {/* VIEW MODAL ACTION FOOTER */}
            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <button
                onClick={() => handleDelete(selectedVoucher.id, selectedVoucher.voucherNumber)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Record
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedVoucher)}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit / Modify Entry
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowPrintModal(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Printer className="w-4 h-4" /> Print Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT JOURNAL MODAL WITH SEARCHABLE LINE ITEM PARTY AUTOCOMPLETE & 1-CLICK AUTO-BALANCE */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-3xl space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                {showEditModal ? `Edit Journal Entry (${selectedVoucher?.voucherNumber})` : 'Post Multi-Line Double-Entry Journal'}
              </h2>
              <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Journal # *</label>
                  <input
                    type="text"
                    value={formData.voucherNumber}
                    onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Entry Date *</label>
                  <input
                    type="date"
                    value={formData.voucherDate}
                    onChange={(e) => setFormData({ ...formData, voucherDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* MULTI-LINE LEDGER BUILDER WITH EXPLICIT DEBIT (DR) / CREDIT (CR) PARTY ACCOUNT SEARCH AUTOCOMPLETE */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-2 gap-2">
                  <span className="font-extrabold text-indigo-400 uppercase text-xs">Journal Line Items Breakdown (DR / CR)</span>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold">
                    <span className="text-emerald-400">Total Dr: ₹{totalDebitSum.toLocaleString()}</span>
                    <span className="text-rose-400">Total Cr: ₹{totalCreditSum.toLocaleString()}</span>
                    {isBalanced ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> BALANCED
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> UNBALANCED (Diff: ₹{balanceDifference.toLocaleString()})
                        </span>

                        {/* 1-CLICK AUTO BALANCE BUTTON */}
                        <button
                          type="button"
                          onClick={handleAutoBalance}
                          className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all"
                          title="Click to automatically balance Dr and Cr amounts"
                        >
                          <Zap className="w-3 h-3 text-amber-400" /> AUTO-BALANCE
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* LINE ITEMS BREAKDOWN LIST */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {lines.map((line) => (
                    <div key={line.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold w-20 text-center shrink-0 ${line.type === 'DEBIT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                          {line.type === 'DEBIT' ? 'DEBIT (DR)' : 'CREDIT (CR)'}
                        </span>

                        {/* INLINE EDITABLE LEDGER NAME */}
                        <input
                          type="text"
                          value={line.accountLedger}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLines((prev) => prev.map((l) => (l.id === line.id ? { ...l, accountLedger: val } : l)));
                          }}
                          className="flex-1 p-1 rounded bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* INLINE PER-LINE NARRATION */}
                        <input
                          type="text"
                          placeholder="Line narration..."
                          value={line.narration || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLines((prev) => prev.map((l) => (l.id === line.id ? { ...l, narration: val } : l)));
                          }}
                          className="w-36 p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]"
                        />

                        {/* INLINE EDITABLE AMOUNT */}
                        <input
                          type="number"
                          value={line.amount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setLines((prev) => prev.map((l) => (l.id === line.id ? { ...l, amount: val } : l)));
                          }}
                          className="w-24 p-1 text-right font-mono font-bold rounded bg-slate-950 border border-slate-800 text-indigo-300 text-xs"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shrink-0"
                          title="Delete Line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADD NEW LINE ROW WITH SEARCH AUTOCOMPLETE */}
                <div className="grid grid-cols-12 gap-2 pt-3 border-t border-slate-800 items-center">
                  <div className="col-span-3">
                    <select
                      value={newLine.type}
                      onChange={(e) => setNewLine({ ...newLine, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                    >
                      <option value="DEBIT">DEBIT PARTY (DR)</option>
                      <option value="CREDIT">CREDIT PARTY (CR)</option>
                    </select>
                  </div>

                  <div className="col-span-4 relative">
                    <div className="relative">
                      <input
                        type="text"
                        value={lineSearch || newLine.accountLedger}
                        onChange={(e) => {
                          setLineSearch(e.target.value);
                          setNewLine({ ...newLine, accountLedger: e.target.value });
                          setShowLineDropdown(true);
                        }}
                        onFocus={() => setShowLineDropdown(true)}
                        placeholder="Search party, vendor, customer or bank..."
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>

                    {showLineDropdown && (lineMatches.customLedgers.length > 0 || lineMatches.customers.length > 0 || lineMatches.vendors.length > 0) && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800 text-xs">
                        {lineMatches.customLedgers.length > 0 && (
                          <div className="p-1">
                            <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3" /> Master Ledger Accounts</div>
                            {lineMatches.customLedgers.map((l, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setNewLine({ ...newLine, accountLedger: l });
                                  setLineSearch(l);
                                  setShowLineDropdown(false);
                                }}
                                className="p-2 hover:bg-slate-800 cursor-pointer font-bold text-indigo-400"
                              >
                                {l}
                              </div>
                            ))}
                          </div>
                        )}

                        {lineMatches.customers.length > 0 && (
                          <div className="p-1">
                            <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Customers</div>
                            {lineMatches.customers.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setNewLine({ ...newLine, accountLedger: `Customer A/c - ${c.name}` });
                                  setLineSearch(`Customer A/c - ${c.name}`);
                                  setShowLineDropdown(false);
                                }}
                                className="p-2 hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                              >
                                <span className="font-bold text-white">{c.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{c.mobile}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {lineMatches.vendors.length > 0 && (
                          <div className="p-1">
                            <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><Building2 className="w-3 h-3" /> Vendors</div>
                            {lineMatches.vendors.map((v) => (
                              <div
                                key={v.id}
                                onClick={() => {
                                  setNewLine({ ...newLine, accountLedger: `Vendor A/c - ${v.companyName || v.contactPerson}` });
                                  setLineSearch(`Vendor A/c - ${v.companyName || v.contactPerson}`);
                                  setShowLineDropdown(false);
                                }}
                                className="p-2 hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                              >
                                <span className="font-bold text-white">{v.companyName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{v.contactPerson}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={newLine.amount}
                      onChange={(e) => setNewLine({ ...newLine, amount: Number(e.target.value) })}
                      placeholder="Amount ₹"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      value={newLine.narration}
                      onChange={(e) => setNewLine({ ...newLine, narration: e.target.value })}
                      placeholder="Line remark..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center justify-center cursor-pointer"
                      title="Add Line Item"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* REMARKS / NARRATION FIELD */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks / Journal Explanation *</label>
                <input
                  type="text"
                  required
                  value={formData.narration}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="e.g. Month-end depreciation journal entry for lab equipment."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className={`px-6 py-2 rounded-xl font-extrabold uppercase shadow-lg transition-all ${isBalanced ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  {showEditModal ? 'Save Journal Changes' : 'Post Journal Entry'}
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
                <Printer className="w-5 h-5 text-indigo-400" /> General Journal Voucher Print Preview
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
                  <option value="both">Both Original Journal &amp; Office Copy</option>
                  <option value="standard">Original Journal Voucher Only</option>
                  <option value="office">Duplicate Audit Record Only</option>
                </select>
              </div>
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="journal-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
              {(copyType === 'both' ? ['ORIGINAL JOURNAL VOUCHER', 'AUDIT OFFICE RECORD'] : [copyType === 'standard' ? 'ORIGINAL JOURNAL VOUCHER' : 'AUDIT OFFICE RECORD']).map((copyTitle, copyIdx) => (
                <div key={copyIdx} className={`space-y-4 ${copyIdx > 0 ? 'pt-6 border-t-2 border-dashed border-slate-400' : ''}`}>
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-base font-black tracking-wider uppercase text-slate-900">{companyDetails.companyLegalName || 'ACCNO SOLUTION ERP'}</h2>
                      <p className="text-[10px] text-slate-600">{companyDetails.addressLine1}</p>
                      <p className="text-[10px] text-slate-600">{companyDetails.city}, {companyDetails.state} | Ph: {companyDetails.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase rounded">{copyTitle}</span>
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Journal #: {selectedVoucher.voucherNumber}</p>
                      <p className="text-[10px] text-slate-600">Date: {selectedVoucher.voucherDate}</p>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Type</th>
                        <th className="p-2">Debit / Credit Party Ledger</th>
                        <th className="p-2 text-right">Debit (DR) ₹</th>
                        <th className="p-2 text-right">Credit (CR) ₹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedVoucher.journalLines?.map((line, lIdx) => (
                        <tr key={lIdx}>
                          <td className="p-2 font-bold font-mono text-slate-900">{line.type === 'DEBIT' ? 'DR' : 'CR'}</td>
                          <td className="p-2 font-extrabold text-slate-900">{line.accountLedger}</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-700">
                            {line.type === 'DEBIT' ? `₹${line.amount.toLocaleString()} DR` : '-'}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-rose-700">
                            {line.type === 'CREDIT' ? `₹${line.amount.toLocaleString()} CR` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bg-slate-100 p-2.5 rounded border border-slate-300">
                    <p className="font-bold text-slate-900">Remarks / Journal Explanation:</p>
                    <p className="italic text-slate-700">{selectedVoucher.narration}</p>
                  </div>

                  <div className="flex justify-between items-end pt-8">
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Prepared By Accountant
                    </div>
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Approved By Auditor
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Cancel
              </button>
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                <Printer className="w-4 h-4" /> Print Journal Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
