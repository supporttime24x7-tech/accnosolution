'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, FileText, CheckCircle2, Clock, ShieldCheck, Download,
  MessageSquare, Star, ArrowRight, LogOut, ChevronRight, User, AlertCircle
} from 'lucide-react';
import { useErpStore } from '@/lib/store';
import { AccnoLogo } from '@/components/common/AccnoLogo';

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<'repairs' | 'invoices' | 'amc' | 'tickets'>('repairs');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const { tickets, repairInvoices, amcContracts, updateTicketStatus } = useErpStore();

  const customerInvoices = [
    { id: 'INV-8801', date: '2025-05-10', device: 'MacBook Pro M2', amount: 18500, status: 'Paid', method: 'UPI' },
    { id: 'INV-8752', date: '2025-03-22', device: 'Dell XPS 15 Battery', amount: 4800, status: 'Paid', method: 'Card' },
  ];

  const amcDetails = {
    contractNo: 'AMC-2025-004',
    type: 'Comprehensive Hardware & CCTV AMC',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    coveredDevices: '12 Laptops + 8 Hikvision CCTV Cameras',
    status: 'Active',
    visitsCompleted: 2,
    totalVisits: 4,
  };

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      {/* Top Navbar for Customer Portal */}
      <header className="border-b border-white/10 bg-[#0D1117]/80 backdrop-blur-md sticky top-0 z-40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <AccnoLogo height={42} showTagline={true} />
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <User className="w-3.5 h-3.5 text-[#5ED29C]" />
              <span>Rajesh Kumar (Tech Logics Pvt Ltd)</span>
            </div>
            <Link
              href="/"
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 border border-white/10 px-3 py-1.5 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portal Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Greeting & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-[#5ED29C]/30 flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#5ED29C] font-mono uppercase font-bold tracking-wider">Welcome Back</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Rajesh Kumar</h1>
              <p className="text-xs text-white/60 mt-1">Customer ID: <span className="text-white font-mono">CUST-1001</span> | GST: 01AAAAA0000A1Z5</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-white/70">
              <span>Active Repair Tickets: <strong className="text-[#5ED29C]">1</strong></span>
              <span>•</span>
              <span>Active AMC Contracts: <strong className="text-[#16FFC6]">1</strong></span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/50 uppercase font-semibold">Outstanding Balance</span>
            <div className="text-3xl font-extrabold font-mono text-white">₹0.00</div>
            <div className="text-[10px] text-[#5ED29C] font-semibold flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-3 h-3" /> All invoices settled
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/50 uppercase font-semibold">AMC Service Visit</span>
            <div className="text-sm font-bold text-[#5ED29C]">Next: Q3 Preventive Check</div>
            <div className="text-[10px] text-white/60 mt-2">Scheduled: Sept 15, 2025</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 space-x-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('repairs')}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'repairs' ? 'border-[#5ED29C] text-[#5ED29C]' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            My Repair Tickets
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'invoices' ? 'border-[#5ED29C] text-[#5ED29C]' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices & Payments
          </button>
          <button
            onClick={() => setActiveTab('amc')}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'amc' ? 'border-[#5ED29C] text-[#5ED29C]' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            AMC Contracts
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'tickets' ? 'border-[#5ED29C] text-[#5ED29C]' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Support & Feedback
          </button>
        </div>

        {/* Tab 1: Repair Tickets */}
        {activeTab === 'repairs' && (
          <div className="space-y-6">
            {tickets.map((t) => (
              <div key={t.id} className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                        {t.ticket_number}
                      </span>
                      <span className="text-xs text-white/50">Booked: {t.created_at}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-2">{t.device_type} ({t.brand} {t.model})</h3>
                    <p className="text-xs text-white/60 mt-1">Issue: {t.problem_reported}</p>
                  </div>

                  <div className="flex flex-col lg:items-end">
                    <span className="text-[10px] text-white/50 uppercase">Current Repair Stage</span>
                    <span className="text-xs font-extrabold uppercase text-[#16FFC6] bg-[#16FFC6]/10 px-3 py-1 rounded-lg border border-[#16FFC6]/30 mt-1">
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Estimate Approval Banner */}
                {t.status === 'waiting_approval' && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-white">Quotation Pending Approval</span>
                        <p className="text-[11px] text-white/70">Estimated Cost: ₹{t.estimated_cost} for logic board repair & part replacement.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        updateTicketStatus(t.id, 'approved');
                        alert(`Quotation estimate for ${t.ticket_number} approved! Service manager notified.`);
                      }}
                      className="px-4 py-2 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-bold text-xs rounded-lg uppercase cursor-pointer transition-colors shadow-md"
                    >
                      Approve Quote
                    </button>
                  </div>
                )}

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-2 text-xs">
                  <div>
                    <span className="text-white/50 block">Assigned Engineer</span>
                    <span className="text-white font-medium">{t.technician_name}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Estimated Cost</span>
                    <span className="text-[#5ED29C] font-semibold">₹{t.estimated_cost}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Advance Deposit</span>
                    <span className="text-white font-semibold">₹{t.advance_paid}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Warranty Period</span>
                    <span className="text-white font-semibold">90 Days Warranty</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Invoices */}
        {activeTab === 'invoices' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Device / Service</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#5ED29C]">{inv.id}</td>
                    <td className="p-4 text-white/70">{inv.date}</td>
                    <td className="p-4 font-medium text-white">{inv.device}</td>
                    <td className="p-4 font-bold text-white font-mono">₹{inv.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        {inv.method} ({inv.status})
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-xs text-[#5ED29C] hover:text-[#16FFC6] font-bold border border-[#5ED29C]/30 px-3 py-1.5 rounded-lg">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: AMC Details */}
        {activeTab === 'amc' && (
          <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full">
                  {amcDetails.contractNo}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{amcDetails.type}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase border border-emerald-500/30">
                {amcDetails.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 text-xs">
              <div>
                <span className="text-white/50 block">Contract Coverage</span>
                <span className="text-white font-medium">{amcDetails.coveredDevices}</span>
              </div>
              <div>
                <span className="text-white/50 block">Validity Period</span>
                <span className="text-white font-medium">{amcDetails.startDate} to {amcDetails.endDate}</span>
              </div>
              <div>
                <span className="text-white/50 block">Preventive Maintenance Visits</span>
                <span className="text-[#5ED29C] font-bold">{amcDetails.visitsCompleted} of {amcDetails.totalVisits} Visits Completed</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Support & Feedback */}
        {activeTab === 'tickets' && (
          <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Submit Service Feedback & Rating</h3>
            {feedbackSent ? (
              <div className="p-4 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C] text-[#5ED29C] text-xs font-bold">
                Thank you for your valuable feedback! Your response has been submitted to the QA manager.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setFeedbackSent(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Rate Our Service (1 to 5 Stars)</label>
                  <div className="flex gap-2 text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setRating(star)}
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Comments / Suggestions</label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <button type="submit" className="px-6 py-3 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase">
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
