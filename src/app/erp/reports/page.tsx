'use client';

import React, { useState } from 'react';
import {
  BarChart3, Download, FileSpreadsheet, Calendar, DollarSign, TrendingUp,
  ShieldCheck, Printer, Users, Truck, Package, Receipt, Wrench, Globe,
  Search, Filter, ArrowUpRight, ArrowDownRight, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useErpStore } from '@/lib/store';

export default function ErpReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'pnl' | 'gst' | 'customers' | 'vendors' | 'inventory' | 'vouchers' | 'repairs'
  >('pnl');
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'this_month' | 'last_month' | 'quarter' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    salesInvoices = [],
    purchaseInvoices = [],
    salesReturns = [],
    purchaseReturns = [],
    quotations = [],
    tickets = [],
    outsourceVouchers = [],
    accountingVouchers = [],
    customers = [],
    vendors = [],
    inventory = [],
    companyDetails,
  } = useErpStore();

  // --- Date Range Filter State ---
  const todayStr = mounted ? new Date().toISOString().split('T')[0] : '';
  const firstDayOfMonthStr = todayStr ? `${todayStr.slice(0, 7)}-01` : '';

  if (!mounted) return null;

  const handleDatePresetChange = (preset: 'all' | 'today' | 'this_month' | 'last_month' | 'quarter' | 'custom') => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'this_month') {
      setStartDate(firstDayOfMonthStr);
      setEndDate(todayStr);
    } else if (preset === 'last_month') {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(lastMonthDate.toISOString().split('T')[0]);
      setEndDate(lastMonthEnd.toISOString().split('T')[0]);
    } else if (preset === 'quarter') {
      const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const qStart = new Date(now.getFullYear(), qStartMonth, 1);
      setStartDate(qStart.toISOString().split('T')[0]);
      setEndDate(todayStr);
    }
  };

  // Date Check Helper
  const isWithinDateRange = (itemDateStr?: string) => {
    if (!startDate && !endDate) return true;
    if (!itemDateStr) return true;
    const d = itemDateStr.slice(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  // Filtered Datasets based on Date Range
  const filteredSalesInvoices = salesInvoices.filter((s) => isWithinDateRange(s.invoiceDate));
  const filteredTickets = tickets.filter((t) => isWithinDateRange(t.entryDate));
  const filteredPurchaseInvoices = purchaseInvoices.filter((p) => isWithinDateRange(p.created_at));
  const filteredOutsourceVouchers = outsourceVouchers.filter((o) => isWithinDateRange(o.voucherDate));
  const filteredAccountingVouchers = accountingVouchers.filter((v) => isWithinDateRange(v.voucherDate));

  // --- Financial Calculations (Filtered by Date) ---
  const totalSalesRevenue = filteredSalesInvoices.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
  const totalRepairRevenue = filteredTickets.reduce((sum, t) => sum + (t.grandTotal || 0), 0);
  const grossRevenue = totalSalesRevenue + totalRepairRevenue;

  const totalPurchaseExpense = filteredPurchaseInvoices.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
  const totalOutsourceExpense = filteredOutsourceVouchers.reduce((sum, o) => sum + (o.vendorCostPrice || 0) + (o.freightCharges || 0), 0);
  const totalOperatingExpense = totalPurchaseExpense + totalOutsourceExpense;

  const totalSalesTax = filteredSalesInvoices.reduce((sum, s) => sum + (s.taxAmount || 0), 0);
  const totalRepairTax = filteredTickets.reduce((sum, t) => sum + ((t.cgstAmount || 0) + (t.sgstAmount || 0)), 0);
  const totalGstCollected = totalSalesTax + totalRepairTax;

  const netOperatingProfit = grossRevenue - totalOperatingExpense;

  // --- Export to CSV Function ---
  const exportToCsv = (filename: string, rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportTabCsv = () => {
    let rows: (string | number)[][] = [];

    if (activeTab === 'pnl') {
      rows = [
        ['ACCNO SOLUTION - PROFIT AND LOSS STATEMENT'],
        [`Date Range: ${startDate || 'All Time'} to ${endDate || 'Present'}`],
        ['Metric', 'Amount (INR)'],
        ['Gross Sales Revenue', totalSalesRevenue],
        ['Repair Desk Revenue', totalRepairRevenue],
        ['Total Combined Revenue', grossRevenue],
        ['Vendor Purchases Expense', totalPurchaseExpense],
        ['Outsourced Repairs Expense', totalOutsourceExpense],
        ['Total Operating Costs', totalOperatingExpense],
        ['Net Operating Profit', netOperatingProfit],
        ['GST Tax Collected', totalGstCollected],
      ];
    } else if (activeTab === 'customers') {
      rows = [
        ['Customer Name', 'Phone', 'GSTIN', 'Address', 'Outstanding Balance', 'Credit Limit'],
        ...customers.map((c) => [
          c.name || 'N/A',
          c.phone || c.mobile || 'N/A',
          c.gstin || 'URP',
          `"${c.address || c.billingAddress || ''}"`,
          c.outstandingBalance || 0,
          c.creditLimit || 50000,
        ]),
      ];
    } else if (activeTab === 'vendors') {
      rows = [
        ['Vendor Name', 'Contact Person', 'Phone', 'GSTIN', 'Station', 'Outstanding Payable'],
        ...vendors.map((v) => [
          v.companyName || v.name || 'N/A',
          v.contactPerson || 'Sales Desk',
          v.phone || 'N/A',
          v.gstin || 'URP Vendor',
          v.station || 'N/A',
          v.outstandingBalance || 0,
        ]),
      ];
    } else if (activeTab === 'inventory') {
      rows = [
        ['SKU Code', 'Item Name', 'Category', 'Stock Qty', 'Purchase Cost', 'Selling Price', 'Stock Valuation'],
        ...inventory.map((i) => [
          i.code,
          `"${i.name}"`,
          i.category || 'General',
          i.currentStock || 0,
          i.costPrice || 0,
          i.sellingPrice || 0,
          (i.currentStock || 0) * (i.costPrice || 0),
        ]),
      ];
    } else if (activeTab === 'vouchers') {
      rows = [
        ['Voucher #', 'Type', 'Party Name', 'Date', 'Amount', 'Payment Mode'],
        ...filteredAccountingVouchers.map((v) => [
          v.voucherNumber,
          v.voucherType,
          `"${v.partyName || 'Cash / General Ledger'}"`,
          v.voucherDate,
          v.amount,
          v.paymentMode || 'Cash',
        ]),
      ];
    } else if (activeTab === 'repairs') {
      rows = [
        ['Ticket #', 'Customer Name', 'Phone', 'Device Type', 'Brand', 'Status', 'Estimated Cost', 'Grand Total'],
        ...filteredTickets.map((t) => [
          t.ticket_number,
          `"${t.customer_name}"`,
          t.customer_phone,
          t.device_type,
          t.brand,
          t.status,
          t.estimated_cost || 0,
          t.grandTotal || 0,
        ]),
      ];
    } else if (activeTab === 'gst') {
      rows = [
        ['GST Summary Module', 'Taxable Value', 'CGST Amount', 'SGST Amount', 'Total Tax Collected'],
        ['Commercial Sales', totalSalesRevenue - totalSalesTax, totalSalesTax / 2, totalSalesTax / 2, totalSalesTax],
        ['Repair Services', totalRepairRevenue - totalRepairTax, totalRepairTax / 2, totalRepairTax / 2, totalRepairTax],
        ['Total GST Summary', grossRevenue - totalGstCollected, totalGstCollected / 2, totalGstCollected / 2, totalGstCollected],
      ];
    }

    exportToCsv(`accno_report_${activeTab}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* PRINT-ONLY HEADER BANNER */}
      <div className="hidden print:block text-black p-4 mb-4 border-b-2 border-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase">{companyDetails?.companyLegalName || 'ACCNO SOLUTION'}</h1>
            <p className="text-xs">{companyDetails?.addressLine1 || 'Indira Chowk, Sanchore, Rajasthan'}</p>
            <p className="text-xs">GSTIN: {companyDetails?.gstin || '08ABCDE1234F1Z5'} | Phone: {companyDetails?.phoneNumber || '+91 80900 20060'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase underline">OFFICIAL REPORT SCHEDULE</h2>
            <p className="text-xs">Generated Date: {new Date().toLocaleDateString('en-IN')}</p>
            <p className="text-xs font-bold">Report Period: {startDate ? `${startDate} to ${endDate || 'Today'}` : 'ALL TIME'}</p>
            <p className="text-xs">Report Type: {activeTab.toUpperCase()} STATEMENT</p>
          </div>
        </div>
      </div>

      {/* Screen Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#5ED29C]" />
            REPORTS, ANALYTICS &amp; GST HUB<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60">
            Generate Profit &amp; Loss statements, GST GSTR-1 / GSTR-3B tax summaries, and select specific dates to export report schedules.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#5ED29C] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#5ED29C]" /> Print Report Schedule
          </button>

          <button
            onClick={handleExportTabCsv}
            className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#5ED29C]/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel CSV
          </button>
        </div>
      </div>

      {/* DATE RANGE FILTERING CONTROL PANEL */}
      <div className="glass-panel p-4 rounded-2xl border border-[#5ED29C]/30 bg-[#5ED29C]/5 space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5ED29C]">
            <Calendar className="w-4 h-4" />
            <span>Select Specific Date Range For Reports</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'quarter', label: 'Quarterly (Q3)' },
              { id: 'custom', label: 'Custom Dates' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleDatePresetChange(p.id as any)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  datePreset === p.id
                    ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-sm'
                    : 'bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Input Pickers */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/60 font-bold uppercase text-[11px]">From Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('custom');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#5ED29C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/60 font-bold uppercase text-[11px]">To Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('custom');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#5ED29C]"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => handleDatePresetChange('all')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-[10px] uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear Date Filter
            </button>
          )}

          <div className="ml-auto text-[11px] text-white/50 font-mono">
            {startDate ? `Filtering from ${startDate} to ${endDate || 'Today'}` : 'Showing all historic records'}
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-white/50 uppercase font-semibold">Total Revenue (Gross)</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#5ED29C]">
            ₹{grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-white/60 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#5ED29C]" /> Sales + Repair Invoices
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-white/50 uppercase font-semibold">Operating Expenses</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">
            ₹{totalOperatingExpense.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-white/60 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3 text-rose-400" /> Purchases + Outsource
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-white/50 uppercase font-semibold">GST Tax Collected</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#16FFC6]">
            ₹{totalGstCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-white/60">
            CGST: ₹{(totalGstCollected / 2).toLocaleString('en-IN')} | SGST: ₹{(totalGstCollected / 2).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-white/50 uppercase font-semibold">Net Operating Profit</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            ₹{netOperatingProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-white/60">Net margin after expenses</div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
          {[
            { id: 'pnl', label: 'Financial & P&L Statement', icon: TrendingUp },
            { id: 'gst', label: 'GST Tax Summary', icon: ShieldCheck },
            { id: 'customers', label: 'Parties & Customers', icon: Users },
            { id: 'vendors', label: 'Vendors & Suppliers', icon: Truck },
            { id: 'inventory', label: 'Products & Stock Valuation', icon: Package },
            { id: 'vouchers', label: 'Vouchers & Payments', icon: Receipt },
            { id: 'repairs', label: 'Repair Desk Performance', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-md shadow-[#5ED29C]/20'
                    : 'bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report items..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
          />
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* TAB 1: FINANCIAL & PROFIT / LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5ED29C]" />
              PROFIT AND LOSS FINANCIAL STATEMENT {startDate ? `(${startDate} to ${endDate || 'Today'})` : ''}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5 font-bold">
                <span className="text-white/70">Gross Commercial Sales Invoices Revenue</span>
                <span className="font-mono text-white">₹{totalSalesRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 font-bold">
                <span className="text-white/70">Repair Tickets &amp; Bench Service Revenue</span>
                <span className="font-mono text-white">₹{totalRepairRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10 font-extrabold text-sm text-[#5ED29C]">
                <span>TOTAL COMBINED GROSS REVENUE</span>
                <span className="font-mono">₹{grossRevenue.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 flex justify-between py-2 border-b border-white/5 font-bold">
                <span className="text-white/70">Vendor Purchase Bills Cost</span>
                <span className="font-mono text-rose-400">₹{totalPurchaseExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 font-bold">
                <span className="text-white/70">Outsourced Repairs Service Charges</span>
                <span className="font-mono text-rose-400">₹{totalOutsourceExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10 font-extrabold text-sm text-rose-400">
                <span>TOTAL COMBINED OPERATING EXPENSES</span>
                <span className="font-mono">₹{totalOperatingExpense.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 flex justify-between py-4 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30 font-extrabold text-base text-emerald-400">
                <span>NET OPERATING PROFIT (EBITDA)</span>
                <span className="font-mono">₹{netOperatingProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GST TAX SUMMARY (GSTR-1 & GSTR-3B) */}
      {activeTab === 'gst' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16FFC6]" />
              STATUTORY GST TAX SUMMARY (GSTR-1 &amp; GSTR-3B COMPLIANCE)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Tax Category</th>
                    <th className="p-3">Taxable Value</th>
                    <th className="p-3">CGST (9%)</th>
                    <th className="p-3">SGST (9%)</th>
                    <th className="p-3">IGST (18%)</th>
                    <th className="p-3 text-right">Total Tax Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr>
                    <td className="p-3 font-bold text-white">Commercial Sales Invoices</td>
                    <td className="p-3 text-white/80">₹{(totalSalesRevenue - totalSalesTax).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/80">₹{(totalSalesTax / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/80">₹{(totalSalesTax / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/40">₹0.00</td>
                    <td className="p-3 text-right font-bold text-[#5ED29C]">₹{totalSalesTax.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Repair Desk Billing</td>
                    <td className="p-3 text-white/80">₹{(totalRepairRevenue - totalRepairTax).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/80">₹{(totalRepairTax / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/80">₹{(totalRepairTax / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/40">₹0.00</td>
                    <td className="p-3 text-right font-bold text-[#5ED29C]">₹{totalRepairTax.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white/5 font-extrabold text-sm text-white">
                    <td className="p-3 text-[#16FFC6]">TOTAL STATUTORY TAX LIABILITY</td>
                    <td className="p-3">₹{(grossRevenue - totalGstCollected).toLocaleString('en-IN')}</td>
                    <td className="p-3">₹{(totalGstCollected / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3">₹{(totalGstCollected / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-white/40">₹0.00</td>
                    <td className="p-3 text-right text-[#16FFC6]">₹{totalGstCollected.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PARTIES & CUSTOMERS LEDGER */}
      {activeTab === 'customers' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Customer Name &amp; Code</th>
                <th className="p-4">Phone / GSTIN</th>
                <th className="p-4">Outstanding Balance</th>
                <th className="p-4">Credit Limit</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers
                .filter(
                  (c) =>
                    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
                    (c.phone || c.mobile || '').includes(search) ||
                    (c.gstin || '').toLowerCase().includes(search.toLowerCase())
                )
                .map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white">{cust.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{cust.code}</div>
                    </td>
                    <td className="p-4 font-mono">
                      <div className="text-white/80">{cust.phone || cust.mobile}</div>
                      <div className="text-[10px] text-white/40">{cust.gstin || 'URP (Unregistered)'}</div>
                    </td>
                    <td className="p-4 font-mono text-[#5ED29C] font-bold">
                      ₹{(cust.outstandingBalance || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-mono text-white/70">
                      ₹{(cust.creditLimit || 50000).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Active Account
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: VENDORS & SUPPLIERS LEDGER */}
      {activeTab === 'vendors' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Vendor Name &amp; Contact</th>
                <th className="p-4">Phone / GSTIN</th>
                <th className="p-4">Outstanding Payable</th>
                <th className="p-4">Station</th>
                <th className="p-4 text-right">Account State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vendors
                .filter(
                  (v) =>
                    (v.companyName || v.name || '').toLowerCase().includes(search.toLowerCase()) ||
                    (v.phone || '').includes(search) ||
                    (v.gstin || '').toLowerCase().includes(search.toLowerCase())
                )
                .map((ven) => (
                  <tr key={ven.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white">{ven.companyName || ven.name}</div>
                      <div className="text-[10px] text-white/40">{ven.contactPerson || 'Sales Desk'}</div>
                    </td>
                    <td className="p-4 font-mono">
                      <div className="text-white/80">{ven.phone}</div>
                      <div className="text-[10px] text-white/40">{ven.gstin || 'URP (Vendor)'}</div>
                    </td>
                    <td className="p-4 font-mono text-rose-400 font-bold">
                      ₹{(ven.outstandingBalance || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-white/70">{ven.station || 'Local'}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Verified Supplier
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: PRODUCTS & STOCK VALUATION */}
      {activeTab === 'inventory' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">SKU / Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Qty</th>
                <th className="p-4">Unit Cost Price</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4 text-right">Total Stock Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory
                .filter(
                  (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) ||
                    i.code.toLowerCase().includes(search.toLowerCase()) ||
                    (i.category || '').toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white">{item.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{item.code}</div>
                    </td>
                    <td className="p-4 text-white/70">{item.category || 'General Hardware'}</td>
                    <td className="p-4 font-mono font-bold text-white">{item.currentStock || 0} Units</td>
                    <td className="p-4 font-mono text-white/70">₹{(item.costPrice || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4 font-mono text-[#5ED29C] font-bold">₹{(item.sellingPrice || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right font-mono font-extrabold text-cyan-300">
                      ₹{((item.currentStock || 0) * (item.costPrice || 0)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: VOUCHERS & PAYMENTS REGISTER */}
      {activeTab === 'vouchers' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Voucher # &amp; Date</th>
                <th className="p-4">Voucher Type</th>
                <th className="p-4">Party / Ledger Name</th>
                <th className="p-4">Payment Mode</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAccountingVouchers
                .filter(
                  (v) =>
                    v.voucherNumber.toLowerCase().includes(search.toLowerCase()) ||
                    (v.partyName || '').toLowerCase().includes(search.toLowerCase()) ||
                    v.voucherType.toLowerCase().includes(search.toLowerCase())
                )
                .map((vouch) => (
                  <tr key={vouch.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white font-mono">{vouch.voucherNumber}</div>
                      <div className="text-[10px] text-white/40">{vouch.voucherDate}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {vouch.voucherType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{vouch.partyName || 'Cash / General Ledger'}</td>
                    <td className="p-4 font-mono text-white/70">{vouch.paymentMode || 'Cash'}</td>
                    <td className="p-4 text-right font-mono font-extrabold text-[#5ED29C]">
                      ₹{vouch.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: REPAIRS PERFORMANCE REPORT */}
      {activeTab === 'repairs' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Ticket # &amp; Customer</th>
                <th className="p-4">Device &amp; Brand</th>
                <th className="p-4">Assigned Technician</th>
                <th className="p-4">Bench Status</th>
                <th className="p-4 text-right">Total Billed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets
                .filter(
                  (t) =>
                    t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
                    t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                    t.device_type.toLowerCase().includes(search.toLowerCase())
                )
                .map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-cyan-300 font-mono">{tkt.ticket_number}</div>
                      <div className="text-white font-semibold">{tkt.customer_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white/90 font-bold">{tkt.device_type}</div>
                      <div className="text-[10px] text-white/40 font-mono">{tkt.brand}</div>
                    </td>
                    <td className="p-4 text-white/70">{tkt.technician_name || 'Vikram Sharma'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-amber-500/20 text-amber-300 border-amber-500/30">
                        {tkt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-[#5ED29C]">
                      ₹{(tkt.grandTotal || tkt.estimated_cost || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRINT-ONLY FOOTER SIGNATURE BLOCK */}
      <div className="hidden print:block text-black mt-12 pt-8 border-t border-black">
        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold">Prepared By: Senior Financial Auditor</p>
            <p>ACCNO SOLUTION Engineering &amp; Accounts Desk</p>
          </div>
          <div className="text-right">
            <p className="font-bold border-t border-black pt-1 w-48 ml-auto">Authorised Signatory</p>
            <p className="text-[10px] text-gray-600">Computer Generated Official Tax Schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
}
