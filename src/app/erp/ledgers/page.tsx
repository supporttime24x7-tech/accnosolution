'use client';

import React, { useState } from 'react';
import { useErpStore } from '@/lib/store';
import {
  BookOpen,
  Search,
  Printer,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  RefreshCw,
  Landmark,
  Wallet
} from 'lucide-react';

export default function AllLedgersPage() {
  const { accountingVouchers, customers, vendors, companyDetails, customLedgers } = useErpStore();

  const [selectedLedger, setSelectedLedger] = useState('All Ledgers');
  const [selectedVoucherType, setSelectedVoucherType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [copyType, setCopyType] = useState<'both' | 'standard' | 'office'>('both');

  // Chart of Accounts List combining static & user-created ledgers
  const chartOfAccounts = [
    { name: 'All Ledgers', category: 'ALL' },
    ...customLedgers.map((l) => ({
      name: l.accountName,
      category: l.groupType === 'Bank' || l.groupType === 'Cash' || l.groupType === 'Asset'
        ? 'ASSET'
        : l.groupType === 'Expense'
        ? 'EXPENSE'
        : l.groupType === 'Income'
        ? 'INCOME'
        : l.groupType === 'Capital' || l.groupType === 'Liability'
        ? 'LIABILITY'
        : 'OTHER'
    }))
  ];

  // Derive Ledger Transactions with Date & Voucher Type Filters
  const ledgerEntries = accountingVouchers.filter((v) => {
    // 1. Voucher Type Filter
    if (selectedVoucherType !== 'ALL' && v.voucherType !== selectedVoucherType) {
      return false;
    }

    // 2. Specific Ledger Account Filter
    if (selectedLedger !== 'All Ledgers') {
      const matchDebit = v.debitLedger && v.debitLedger.toLowerCase().includes(selectedLedger.toLowerCase());
      const matchCredit = v.creditLedger && v.creditLedger.toLowerCase().includes(selectedLedger.toLowerCase());
      const matchParty = v.partyName && v.partyName.toLowerCase().includes(selectedLedger.toLowerCase());
      const matchJournalLines = v.journalLines && v.journalLines.some((line) => line.accountLedger.toLowerCase().includes(selectedLedger.toLowerCase()));

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
  }).sort((a, b) => new Date(a.voucherDate).getTime() - new Date(b.voucherDate).getTime())
  .map((v) => {
    let debit = 0;
    let credit = 0;
    if (['RECEIPT', 'CREDIT_NOTE'].includes(v.voucherType)) {
      debit = v.totalAmount;
    } else if (['PAYMENT', 'DEBIT_NOTE'].includes(v.voucherType)) {
      credit = v.totalAmount;
    } else if (v.voucherType === 'JOURNAL' && v.journalLines) {
      debit = v.journalLines.filter((l) => l.type === 'DEBIT').reduce((sum, l) => sum + l.amount, 0);
      credit = v.journalLines.filter((l) => l.type === 'CREDIT').reduce((sum, l) => sum + l.amount, 0);
    } else {
      debit = v.totalAmount;
    }

    return {
      id: v.id,
      date: v.voucherDate,
      voucherNumber: v.voucherNumber,
      voucherType: v.voucherType,
      particulars: v.partyName ? `${v.partyName} - ${v.narration}` : v.narration,
      debitLedger: v.debitLedger || 'HDFC Bank / Cash',
      creditLedger: v.creditLedger || v.partyName || 'Service Revenue',
      debitAmount: debit,
      creditAmount: credit,
    };
  });

  const filteredEntries = ledgerEntries.filter((item) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      item.voucherNumber.toLowerCase().includes(q) ||
      item.particulars.toLowerCase().includes(q) ||
      item.debitLedger.toLowerCase().includes(q) ||
      item.creditLedger.toLowerCase().includes(q)
    );
  });

  const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debitAmount, 0);
  const totalCredit = filteredEntries.reduce((sum, e) => sum + e.creditAmount, 0);
  const netBalance = totalDebit - totalCredit;

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
          #all-ledgers-print-target, #all-ledgers-print-target * {
            visibility: visible !important;
          }
          #all-ledgers-print-target {
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
            <BookOpen className="w-6 h-6 text-[#5ED29C]" />
            <span>GENERAL LEDGER &amp; CHART OF ACCOUNTS</span>
            <span className="text-[#5ED29C]">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/30 uppercase tracking-wider">
              DATE-WISE VOUCHER REPORT ENGINE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time running balances, date-wise voucher entry statements, debit/credit audit trials, and official financial reports.
          </p>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4 stroke-[2.5]" /> PRINT DATE-WISE VOUCHER STATEMENT
        </button>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Debit Receipts</p>
            <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{totalDebit.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Credit Payouts</p>
            <h3 className="text-2xl font-black text-rose-400 font-mono mt-1">₹{totalCredit.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Closing Balance</p>
            <h3 className={`text-2xl font-black font-mono mt-1 ${netBalance >= 0 ? 'text-[#5ED29C]' : 'text-rose-400'}`}>
              ₹{netBalance.toLocaleString()} {netBalance >= 0 ? 'Dr' : 'Cr'}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Voucher #, Ledger, Party..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5ED29C]"
            />
          </div>

          <select
            value={selectedLedger}
            onChange={(e) => setSelectedLedger(e.target.value)}
            className="w-full sm:w-56 p-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-[#5ED29C] font-bold"
          >
            {chartOfAccounts.map((acc) => (
              <option key={acc.name} value={acc.name}>
                {acc.name} ({acc.category})
              </option>
            ))}
          </select>

          <select
            value={selectedVoucherType}
            onChange={(e) => setSelectedVoucherType(e.target.value)}
            className="w-full sm:w-48 p-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-cyan-400 font-bold"
          >
            <option value="ALL">All Voucher Types</option>
            <option value="RECEIPT">Receipts Only</option>
            <option value="PAYMENT">Payments Only</option>
            <option value="DEBIT_NOTE">Debit Notes Only</option>
            <option value="CREDIT_NOTE">Credit Notes Only</option>
            <option value="CONTRA">Contra Only</option>
            <option value="JOURNAL">Journals Only</option>
          </select>
        </div>

        {/* DATE PRESET SELECTOR */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#5ED29C]" /> Period:
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setDatePreset('all')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'all' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-slate-400 hover:text-white'}`}
            >
              ALL DATES
            </button>
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'today' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-slate-400 hover:text-white'}`}
            >
              TODAY
            </button>
            <button
              onClick={() => setDatePreset('week')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'week' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-slate-400 hover:text-white'}`}
            >
              THIS WEEK
            </button>
            <button
              onClick={() => setDatePreset('month')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'month' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-slate-400 hover:text-white'}`}
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

      {/* LEDGER STATEMENT TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Voucher # / Type</th>
                <th className="p-3.5">Debit Ledger Account [DR]</th>
                <th className="p-3.5">Credit Ledger Account [CR]</th>
                <th className="p-3.5">Particulars &amp; Narration</th>
                <th className="p-3.5 text-right text-emerald-400">Debit (Dr ₹)</th>
                <th className="p-3.5 text-right text-rose-400">Credit (Cr ₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3.5 font-mono text-slate-400">{item.date}</td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-[#5ED29C] font-mono">{item.voucherNumber}</div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                        {item.voucherType}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">{item.debitLedger}</td>
                    <td className="p-3.5 text-rose-400 font-bold">{item.creditLedger}</td>
                    <td className="p-3.5 text-slate-300 max-w-[280px] truncate">{item.particulars}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-emerald-400">
                      {item.debitAmount > 0 ? `₹${item.debitAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-rose-400">
                      {item.creditAmount > 0 ? `₹${item.creditAmount.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No ledger transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-950 font-black border-t border-slate-800">
              <tr>
                <td colSpan={5} className="p-3.5 text-right uppercase text-slate-400">Total Period Movements:</td>
                <td className="p-3.5 text-right font-mono text-emerald-400 text-sm">₹{totalDebit.toLocaleString()}</td>
                <td className="p-3.5 text-right font-mono text-rose-400 text-sm">₹{totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PRINT MODAL WITH COMPREHENSIVE DATE-WISE VOUCHER LEDGER STATEMENT CONTROLS */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#5ED29C]" /> Printable Date-Wise Voucher Ledger Statement
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
                  <option value="both">Both Original Statement &amp; Office Copy</option>
                  <option value="standard">Original Voucher Statement Only</option>
                  <option value="office">Duplicate Audit Record Only</option>
                </select>
              </div>
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="all-ledgers-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
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
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Target Account: {selectedLedger}</p>
                      <p className="text-[10px] text-slate-600">Voucher Filter: {selectedVoucherType}</p>
                    </div>
                  </div>

                  <table className="w-full text-left text-[11px] border border-slate-300">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border border-slate-700">Date</th>
                        <th className="p-2 border border-slate-700">Voucher # &amp; Type</th>
                        <th className="p-2 border border-slate-700">Particulars &amp; Narration</th>
                        <th className="p-2 border border-slate-700 text-right">Debit (Dr ₹)</th>
                        <th className="p-2 border border-slate-700 text-right">Credit (Cr ₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredEntries.length > 0 ? (
                        filteredEntries.map((e, idx) => (
                          <tr key={idx} className="hover:bg-slate-100">
                            <td className="p-2 font-mono text-slate-700 border border-slate-200">{e.date}</td>
                            <td className="p-2 border border-slate-200 font-mono">
                              <div className="font-extrabold text-slate-900">{e.voucherNumber}</div>
                              <span className="text-[9px] px-1 bg-slate-200 text-slate-800 font-bold rounded">{e.voucherType}</span>
                            </td>
                            <td className="p-2 border border-slate-200 text-slate-800">{e.particulars}</td>
                            <td className="p-2 border border-slate-200 text-right font-mono font-bold text-emerald-800">
                              {e.debitAmount > 0 ? `₹${e.debitAmount.toLocaleString()}` : '-'}
                            </td>
                            <td className="p-2 border border-slate-200 text-right font-mono font-bold text-rose-800">
                              {e.creditAmount > 0 ? `₹${e.creditAmount.toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                            No ledger entries found matching your search and filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="p-3 bg-slate-900 text-white font-mono font-black text-xs rounded flex justify-between items-center">
                    <div>TOTAL DEBIT: <span className="text-emerald-400">₹{totalDebit.toLocaleString()} DR</span></div>
                    <div>TOTAL CREDIT: <span className="text-rose-400">₹{totalCredit.toLocaleString()} CR</span></div>
                    <div>NET CLOSING: <span className={netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}>₹{Math.abs(netBalance).toLocaleString()} {netBalance >= 0 ? 'DR' : 'CR'}</span></div>
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
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-[#5ED29C]/20">
                <Printer className="w-4 h-4" /> Print Date-Wise Voucher Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
