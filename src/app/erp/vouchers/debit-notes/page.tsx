'use client';

import React, { useState } from 'react';
import { useErpStore, AccountingVoucher } from '@/lib/store';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  Filter,
  RefreshCw,
  Building2,
  User,
  BookOpen
} from 'lucide-react';

const standardLedgers = [
  'Vendor Account (Accounts Payable)',
  'Purchase Return / Defective Claims Account',
  'HDFC Bank A/c 9812',
  'ICICI Bank Current A/c 4410',
  'Cash-in-Hand',
  'Petty Cash Float',
  'Outsource Repair Expense Account',
  'Store Electricity & Utilities',
  'Office Rent Expense',
  'Capital Account'
];

export default function DebitNotesPage() {
  const {
    accountingVouchers,
    addAccountingVoucher,
    updateAccountingVoucher,
    deleteAccountingVoucher,
    vendors,
    customers,
    purchaseInvoices,
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
  const [copyType, setCopyType] = useState<'both' | 'vendor' | 'office'>('both');

  // Searchable Autocomplete States for Debit & Credit Fields
  const [debitSearch, setDebitSearch] = useState('');
  const [showDebitDropdown, setShowDebitDropdown] = useState(false);

  const [creditSearch, setCreditSearch] = useState('');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);

  const debitNotesList = accountingVouchers.filter((v) => v.voucherType === 'DEBIT_NOTE');

  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherDate: new Date().toISOString().split('T')[0],
    partyName: '',
    partyPhone: '',
    partyGst: '',
    refInvoiceNumber: '',
    debitLedger: 'Vendor Account (Accounts Payable)',
    creditLedger: 'Purchase Return / Defective Claims Account',
    amount: 1500,
    narration: 'Debit Note issued for defective purchase return.',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partyName || !formData.amount) {
      alert('Please fill out Party Name and Amount.');
      return;
    }

    const count = debitNotesList.length;
    const autoNo = formData.voucherNumber || `DBN-${1001 + count}`;

    addAccountingVoucher({
      voucherNumber: autoNo,
      voucherType: 'DEBIT_NOTE',
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
    });

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
      debitLedger: v.debitLedger || 'Vendor Account (Accounts Payable)',
      creditLedger: v.creditLedger || 'Purchase Return / Defective Claims Account',
      amount: v.amount,
      narration: v.narration || '',
    });
    setDebitSearch(v.partyName || v.debitLedger || '');
    setCreditSearch(v.creditLedger || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucher) return;

    updateAccountingVoucher(selectedVoucher.id, {
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
    });

    setShowEditModal(false);
  };

  const handleDelete = (id: string, num: string) => {
    if (confirm(`Are you sure you want to delete Debit Note ${num}?`)) {
      deleteAccountingVoucher(id);
    }
  };

  // Date Filtering Logic
  const filteredNotes = debitNotesList.filter((v) => {
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

  const totalDebitNotesAmount = filteredNotes.reduce((sum, v) => sum + v.totalAmount, 0);

  // Helper search match functions
  const searchResults = (q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) return { vendors: [], customers: [], ledgers: [] };

    const matchedVendors = vendors.filter(
      (v) =>
        (v.companyName && v.companyName.toLowerCase().includes(query)) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(query)) ||
        (v.phone && v.phone.includes(query)) ||
        (v.gstin && v.gstin.toLowerCase().includes(query))
    );

    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        (c.gstin && c.gstin.toLowerCase().includes(query))
    );

    const matchedLedgers = standardLedgers.filter((l) => l.toLowerCase().includes(query));

    return { vendors: matchedVendors, customers: matchedCustomers, ledgers: matchedLedgers };
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
          #debitnote-print-target, #debitnote-print-target * {
            visibility: visible !important;
          }
          #debitnote-print-target {
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
            <FileSpreadsheet className="w-6 h-6 text-amber-400" />
            <span>DEBIT NOTES (PURCHASE RETURNS &amp; CLAIMS)</span>
            <span className="text-amber-400">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              SEARCHABLE DEBIT &amp; CREDIT LEDGERS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable party &amp; claims ledger autocomplete for Debit Party and Credit Account fields.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              voucherNumber: `DBN-${1001 + debitNotesList.length}`,
              voucherDate: new Date().toISOString().split('T')[0],
              partyName: '',
              partyPhone: '',
              partyGst: '',
              refInvoiceNumber: '',
              debitLedger: 'Vendor Account (Accounts Payable)',
              creditLedger: 'Purchase Return / Defective Claims Account',
              amount: 1500,
              narration: 'Debit Note issued for defective purchase return.',
            });
            setDebitSearch('');
            setCreditSearch('Purchase Return / Defective Claims Account');
            setShowCreateModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> ISSUE NEW DEBIT NOTE
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Debit Notes Issued</p>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{filteredNotes.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Debit Claims Amount [DR]</p>
            <h3 className="text-2xl font-black text-amber-400 font-mono mt-1">₹{totalDebitNotesAmount.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Searchable Ledgers Engine</p>
            <h3 className="text-sm font-black text-slate-200 mt-1">Vendors, Customers &amp; Claims</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
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
            placeholder="Search Debit Note #, Vendor Name, Remarks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* DATE PRESETS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-400" /> Date Filter:
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setDatePreset('all')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'all' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              ALL DATES
            </button>
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'today' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              TODAY
            </button>
            <button
              onClick={() => setDatePreset('week')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'week' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              THIS WEEK
            </button>
            <button
              onClick={() => setDatePreset('month')}
              className={`px-3 py-1 rounded-lg transition-all ${datePreset === 'month' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
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

      {/* DEBIT NOTES TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 uppercase font-black text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5">Debit Note # / Date</th>
                <th className="p-3.5">Debit Party / Vendor [DR]</th>
                <th className="p-3.5">Credit Ledger / Reason [CR]</th>
                <th className="p-3.5">Ref Purchase Invoice #</th>
                <th className="p-3.5">Remarks / Reason</th>
                <th className="p-3.5 text-right text-amber-400">Debit Amount (CR/DR)</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3.5">
                      <div className="font-extrabold text-amber-400 font-mono text-sm">{v.voucherNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.voucherDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">DR</span>
                        <span>{v.debitLedger || v.partyName || 'Vendor Account'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.partyPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-amber-300 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold">CR</span>
                        <span>{v.creditLedger || 'Purchase Return Account'}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{v.refInvoiceNumber || 'Direct Debit Claim'}</td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{v.narration || 'No remarks recorded'}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-sm">
                      <span className="text-amber-400">₹{v.totalAmount.toLocaleString()}</span>
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">DR</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                          title="Edit Debit Note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVoucher(v);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          title="Print Debit Note"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.voucherNumber)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          title="Delete Debit Note"
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
                    No debit notes recorded matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT DEBIT NOTE MODAL WITH SEARCHABLE DEBIT & CREDIT AUTOCOMPLETE DROPDOWNS */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                {showEditModal ? `Edit Debit Note (${selectedVoucher?.voucherNumber})` : 'Issue New Debit Note to Vendor'}
              </h2>
              <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Debit Note # *</label>
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

              {/* SEARCHABLE DEBIT PARTY / VENDOR NAME FIELD */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="relative">
                  <label className="block font-extrabold mb-1 text-emerald-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono">DR</span>
                    Debit Party / Vendor Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={debitSearch || formData.partyName}
                      onChange={(e) => {
                        setDebitSearch(e.target.value);
                        setFormData({
                          ...formData,
                          partyName: e.target.value,
                          debitLedger: `Vendor Account - ${e.target.value}`,
                        });
                        setShowDebitDropdown(true);
                      }}
                      onFocus={() => setShowDebitDropdown(true)}
                      placeholder="Search vendor, party or ledger..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-white font-bold"
                    />
                    <Search className="w-4 h-4 text-emerald-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showDebitDropdown && (debitMatches.vendors.length > 0 || debitMatches.customers.length > 0 || debitMatches.ledgers.length > 0) && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                      {debitMatches.vendors.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><Building2 className="w-3 h-3" /> Vendors</div>
                          {debitMatches.vendors.map((v) => (
                            <div
                              key={v.id}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  partyName: v.companyName || v.contactPerson,
                                  partyPhone: v.phone || '',
                                  partyGst: v.gstin || '',
                                  debitLedger: `Vendor A/c - ${v.companyName || v.contactPerson}`,
                                });
                                setDebitSearch(v.companyName || v.contactPerson);
                                setShowDebitDropdown(false);
                              }}
                              className="p-2 hover:bg-slate-800 cursor-pointer flex justify-between items-center text-xs"
                            >
                              <div>
                                <div className="font-bold text-white">{v.companyName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">Contact: {v.contactPerson} ({v.phone})</div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold">Select</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {debitMatches.ledgers.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3" /> Standard Ledgers</div>
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

                {/* SEARCHABLE CREDIT ACCOUNT / CLAIM HEAD FIELD */}
                <div className="relative">
                  <label className="block font-extrabold mb-1 text-amber-300 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono">CR</span>
                    Credit Account / Claim Head *
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
                      placeholder="Search claim, return or ledger..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold"
                    />
                    <Search className="w-4 h-4 text-amber-400/60 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {showCreditDropdown && (creditMatches.ledgers.length > 0 || creditMatches.vendors.length > 0 || creditMatches.customers.length > 0) && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                      {creditMatches.ledgers.length > 0 && (
                        <div className="p-1">
                          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3" /> Standard Claim Ledgers</div>
                          {creditMatches.ledgers.map((l, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setFormData({ ...formData, creditLedger: l });
                                setCreditSearch(l);
                                setShowCreditDropdown(false);
                              }}
                              className="p-2 hover:bg-slate-800 cursor-pointer font-bold text-amber-300 text-xs"
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
                  <label className="block text-slate-300 font-bold mb-1">Ref Purchase Invoice #</label>
                  <select
                    value={formData.refInvoiceNumber}
                    onChange={(e) => {
                      const selectedInvNo = e.target.value;
                      const matchedBill = purchaseInvoices.find((bill) => bill.billNo === selectedInvNo);
                      if (matchedBill) {
                        setFormData({
                          ...formData,
                          refInvoiceNumber: selectedInvNo,
                          partyName: matchedBill.vendorName || formData.partyName,
                          partyPhone: matchedBill.vendorPhone || formData.partyPhone,
                          partyGst: matchedBill.vendorGst || formData.partyGst,
                          amount: matchedBill.grandTotal,
                        });
                        if (matchedBill.vendorName) setDebitSearch(matchedBill.vendorName);
                      } else {
                        setFormData({ ...formData, refInvoiceNumber: selectedInvNo });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold"
                  >
                    <option value="">Direct Debit Claim / Manual</option>
                    {purchaseInvoices.map((bill) => (
                      <option key={bill.id} value={bill.billNo}>
                        {bill.billNo} ({bill.vendorName} - ₹{bill.grandTotal.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* AMOUNT FIELD WITH EXPLICIT CR/DR INDICATION */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                    <span>Debit Amount (₹) *</span>
                    <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      DEBIT (DR) TO VENDOR
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-extrabold text-base"
                  />
                </div>
              </div>

              {/* REMARKS / NARRATION FIELD */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks / Reason for Debit Note *</label>
                <input
                  type="text"
                  required
                  value={formData.narration}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="e.g. Debit Note issued for defective purchase return."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase shadow-lg shadow-amber-500/20">
                  {showEditModal ? 'Save Debit Note Changes' : 'Issue Debit Note'}
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
                <Printer className="w-5 h-5 text-amber-400" /> Debit Note Voucher Print Preview
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
                  <option value="both">Both Vendor Copy &amp; Office Copy</option>
                  <option value="vendor">Vendor Copy Only</option>
                  <option value="office">Duplicate Office Record Only</option>
                </select>
              </div>
            </div>

            {/* PRINT TARGET CONTAINER */}
            <div id="debitnote-print-target" className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-6 text-xs">
              {(copyType === 'both' ? ['VENDOR DEBIT COPY', 'OFFICE RECORD COPY'] : [copyType === 'vendor' ? 'VENDOR DEBIT COPY' : 'OFFICE RECORD COPY']).map((copyTitle, copyIdx) => (
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
                      <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Debit Note #: {selectedVoucher.voucherNumber}</p>
                      <p className="text-[10px] text-slate-600">Date: {selectedVoucher.voucherDate}</p>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-3 rounded space-y-1.5 border border-slate-300">
                    <p>Debit Party Vendor (DR): <span className="font-extrabold text-emerald-800">{selectedVoucher.debitLedger || selectedVoucher.partyName}</span> {selectedVoucher.partyPhone ? `(Ph: ${selectedVoucher.partyPhone})` : ''}</p>
                    <p>Credit Account (CR): <span className="font-bold text-slate-900">{selectedVoucher.creditLedger || 'Purchase Return Account'}</span></p>
                    {selectedVoucher.partyGst && <p>Vendor GSTIN: <span className="font-mono font-bold">{selectedVoucher.partyGst}</span></p>}
                    <p>Against Ref Purchase Invoice #: <span className="font-mono font-bold text-slate-900">{selectedVoucher.refInvoiceNumber || 'Direct Purchase Reversal Claim'}</span></p>
                    <p>Reason / Claim Remarks: <span className="italic text-slate-900 font-bold">{selectedVoucher.narration}</span></p>
                  </div>

                  <div className="p-3 bg-slate-900 text-white font-mono font-black text-base rounded flex justify-between items-center">
                    <span>TOTAL DEBIT VALUE CLAIMED [DR]:</span>
                    <span className="text-amber-400">₹{selectedVoucher.totalAmount.toLocaleString()} DR</span>
                  </div>

                  <div className="flex justify-between items-end pt-8">
                    <div className="text-center border-t border-slate-400 pt-1 w-36 text-[10px]">
                      Vendor Acknowledgement
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
              <button onClick={handlePrintDocument} className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20">
                <Printer className="w-4 h-4" /> Print Debit Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
