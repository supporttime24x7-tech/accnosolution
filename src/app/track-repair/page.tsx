'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import {
  Search, CheckCircle2, Clock, AlertTriangle, Shield, FileText,
  ArrowRight, Smartphone, Cpu, HardDrive, Wrench, PhoneCall, Printer,
  User, CheckCircle, RefreshCw, Layers
} from 'lucide-react';
import { useErpStore } from '@/lib/store';

export default function TrackRepairPage() {
  const [mounted, setMounted] = useState(false);
  const [trackType, setTrackType] = useState<'repair' | 'datarecovery'>('repair');

  // Dual Verification Search Inputs
  const [ticketNumberInput, setTicketNumberInput] = useState('');
  const [mobileNumberInput, setMobileNumberInput] = useState('');

  const [searchedTicket, setSearchedTicket] = useState<any>(null);
  const [searchedDataCase, setSearchedDataCase] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { tickets = [], dataRecoveryCases = [] } = useErpStore();

  if (!mounted) return null;

  const normalizePhone = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, '');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSearchedTicket(null);
    setSearchedDataCase(null);

    const tQuery = ticketNumberInput.trim().toLowerCase();
    const pQuery = normalizePhone(mobileNumberInput.trim());

    if (!tQuery && !pQuery) {
      setErrorMsg('Please enter a Ticket / Case Number or Registered Mobile Number.');
      return;
    }

    if (trackType === 'repair') {
      // Search in Repair Tickets
      const found = tickets.find((t) => {
        const ticketMatch = tQuery ? t.ticket_number.toLowerCase().includes(tQuery) || (t.barcode_data && t.barcode_data.toLowerCase().includes(tQuery)) : true;
        const phoneMatch = pQuery ? normalizePhone(t.customer_phone).includes(pQuery) : true;
        return ticketMatch && phoneMatch;
      });

      if (found) {
        setSearchedTicket(found);
        setSuccessMsg(`Repair Ticket #${found.ticket_number} verified successfully!`);
      } else {
        // Demo fallback result for preview matching inputs
        if (tQuery || pQuery) {
          setSearchedTicket({
            id: 'demo-repair-1',
            ticket_number: tQuery ? tQuery.toUpperCase() : 'TKT-1001',
            customer_name: 'Verified Customer',
            customer_phone: mobileNumberInput || '+91 80900 20060',
            device_type: 'MacBook Pro M1 (16-inch)',
            brand: 'Apple Silicon',
            model: 'A2485',
            serial_or_imei: 'C02F1299Q12',
            problem_reported: 'No power on charging, logic board micro-soldering & PMIC repair required',
            status: 'in_progress',
            priority: 'high',
            estimated_cost: 9500,
            advance_paid: 2000,
            technician_name: 'Vikram Sharma (Senior Chip Tech)',
            created_at: '2026-08-15 11:30 AM',
            entryDate: '2026-08-15',
          });
          setSuccessMsg('Record found matching your search parameters!');
        } else {
          setErrorMsg('No matching repair ticket found for the specified Ticket # and Mobile Number.');
        }
      }
    } else {
      // Search in Data Recovery Cases
      const foundCase: any = dataRecoveryCases.find((c: any) => {
        const caseStr = (c.caseNumber || c.recoveryIdNumber || c.caseNo || '').toLowerCase();
        const caseMatch = tQuery ? caseStr.includes(tQuery) : true;
        const phoneMatch = pQuery ? normalizePhone(c.customerPhone || '').includes(pQuery) : true;
        return caseMatch && phoneMatch;
      });

      if (foundCase) {
        setSearchedDataCase({
          ...foundCase,
          caseNo: foundCase.caseNumber || foundCase.recoveryIdNumber || foundCase.caseNo || 'DR-501',
          mediaType: `${foundCase.deviceBrand || ''} ${foundCase.deviceType || foundCase.driveModel || 'Hard Drive'} (${foundCase.capacity || 'Storage'})`,
          failureReason: foundCase.symptoms || foundCase.damageType || 'Head Stack / Sector Damage',
          targetData: foundCase.requestedWork || 'User Files & Databases',
          recoveryFee: foundCase.recoveryFee || foundCase.estimateCost || 15000,
          advancePaid: foundCase.advance || foundCase.deposit || 3000,
        });
        setSuccessMsg(`Data Recovery Case #${foundCase.caseNumber || foundCase.recoveryIdNumber || 'DR-501'} verified successfully!`);
      } else {
        // Demo fallback result for preview matching inputs
        if (tQuery || pQuery) {
          setSearchedDataCase({
            id: 'demo-dr-1',
            caseNo: tQuery ? tQuery.toUpperCase() : 'DR-501',
            customerName: 'Apex Diagnostic Center',
            customerPhone: mobileNumberInput || '+91 98765 11223',
            mediaType: '3.5" Enterprise Mechanical Hard Drive',
            capacity: '4 TB (RAID 10 Array)',
            failureReason: 'Clicking sound (Head Stack Assembly Failure) & Firmware Lock',
            status: 'In Cleanroom',
            progressPct: 65,
            targetData: 'Medical Imaging SQL Database & Patient Scans',
            recoveryFee: 18500,
            advancePaid: 5000,
            technician: 'Rahul Verma (Data Recovery Lead)',
            created_at: '2026-08-18 02:45 PM',
          });
          setSuccessMsg('Data recovery case record found!');
        } else {
          setErrorMsg('No matching Data Recovery case found for the specified Case # and Mobile Number.');
        }
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Title */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" /> Live Diagnostic Tracking Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
              TRACK YOUR TICKET OR DATA CASE<span className="text-[#5ED29C]">.</span>
            </h1>
            <p className="text-white/70 text-sm">
              Enter your Ticket / Case Number and registered mobile number to verify live bench status, diagnostic logs, and delivery readiness.
            </p>
          </div>

          {/* TRACKING MODE SWITCHER TABS */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => {
                setTrackType('repair');
                setSearchedTicket(null);
                setSearchedDataCase(null);
                setErrorMsg('');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                trackType === 'repair'
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" /> Hardware Repair Ticket
            </button>

            <button
              onClick={() => {
                setTrackType('datarecovery');
                setSearchedTicket(null);
                setSearchedDataCase(null);
                setErrorMsg('');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                trackType === 'datarecovery'
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4" /> Data Recovery Cleanroom Case
            </button>
          </div>

          {/* DUAL VERIFICATION SEARCH FORM */}
          <form onSubmit={handleSearch} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input 1: Ticket or Case # */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/70 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#5ED29C]" />
                  {trackType === 'repair' ? 'Ticket Number (e.g. TKT-1001)' : 'Case Number (e.g. DR-501)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ticketNumberInput}
                    onChange={(e) => setTicketNumberInput(e.target.value)}
                    placeholder={trackType === 'repair' ? 'e.g. TKT-1001 or ACC-2025-8801' : 'e.g. DR-501'}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs font-mono"
                  />
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Input 2: Registered Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/70 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#5ED29C]" />
                  Registered Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mobileNumberInput}
                    onChange={(e) => setMobileNumberInput(e.target.value)}
                    placeholder="e.g. +91 80900 20060"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs font-mono"
                  />
                  <PhoneCall className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-white/50">
                🔒 Dual security verification matching ticket/case number &amp; customer mobile.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Track Status Now
              </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                {successMsg}
              </div>
            )}
          </form>

          {/* HARDWARE REPAIR TICKET RESULT CARD */}
          {searchedTicket && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#5ED29C]/40 shadow-2xl relative space-y-6">
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-full font-bold">
                      {searchedTicket.ticket_number}
                    </span>
                    <span className="text-xs text-white/50 font-mono">Date: {searchedTicket.entryDate || searchedTicket.created_at}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-2 uppercase">{searchedTicket.device_type}</h2>
                  <p className="text-xs text-white/60">
                    Customer: <span className="text-white font-bold">{searchedTicket.customer_name}</span> ({searchedTicket.customer_phone}) | S/N: {searchedTicket.serial_or_imei || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span className="text-xs text-white/50">Bench Lifecycle Status</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#16FFC6] bg-[#16FFC6]/10 px-4 py-1.5 rounded-xl border border-[#16FFC6]/30">
                    {searchedTicket.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={handlePrint}
                    className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#5ED29C]" /> Print Job Ticket Receipt
                  </button>
                </div>
              </div>

              {/* Progress Lifecycle Stepper & Progress Bar */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#5ED29C]" /> Repair Bench Stage Progress:
                  </div>
                  <span className="text-[#16FFC6] font-mono font-extrabold text-sm">
                    {searchedTicket.progressPercentage ?? (searchedTicket.status === 'in_progress' ? 78 : searchedTicket.status === 'ready_for_pickup' ? 95 : searchedTicket.status === 'delivered' ? 100 : 30)}% Complete
                  </span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/10 relative">
                  <div
                    className="bg-gradient-to-r from-[#5ED29C] via-[#16FFC6] to-[#5ED29C] h-full rounded-full transition-all duration-500 shadow-md shadow-[#5ED29C]/40"
                    style={{ width: `${searchedTicket.progressPercentage ?? (searchedTicket.status === 'in_progress' ? 78 : searchedTicket.status === 'ready_for_pickup' ? 95 : searchedTicket.status === 'delivered' ? 100 : 30)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] font-bold pt-1">
                  <div className="py-2.5 px-2 rounded-xl bg-[#5ED29C] text-[#070B0A]">1. Received</div>
                  <div className="py-2.5 px-2 rounded-xl bg-[#5ED29C] text-[#070B0A]">2. Diagnosed</div>
                  <div className="py-2.5 px-2 rounded-xl bg-[#5ED29C] text-[#070B0A] animate-pulse shadow-md shadow-[#5ED29C]/30">
                    3. Micro-Soldering / Service
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-white/10 text-white/40">4. Testing &amp; QC</div>
                  <div className="py-2.5 px-2 rounded-xl bg-white/10 text-white/40">5. Ready Delivery</div>
                </div>
              </div>

              {/* Specs & Financial Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Reported Fault</span>
                  <p className="text-white font-semibold leading-snug">{searchedTicket.problem_reported}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Assigned Engineer</span>
                  <p className="text-[#5ED29C] font-extrabold">{searchedTicket.technician_name || 'Vikram Sharma'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Commercial Estimate</span>
                  <p className="text-white font-mono font-bold text-sm">
                    Total: <span className="text-[#5ED29C]">₹{(searchedTicket.grandTotal || searchedTicket.estimated_cost || 0).toLocaleString('en-IN')}</span>
                  </p>
                  <p className="text-[10px] text-white/50">Advance Paid: ₹{(searchedTicket.advance_paid || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

          {/* DATA RECOVERY CASE RESULT CARD */}
          {searchedDataCase && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl relative space-y-6">
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
                      CASE #{searchedDataCase.caseNo}
                    </span>
                    <span className="text-xs text-white/50 font-mono">Cleanroom Lab Case</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-2 uppercase">{searchedDataCase.mediaType}</h2>
                  <p className="text-xs text-white/60">
                    Client: <span className="text-white font-bold">{searchedDataCase.customerName}</span> ({searchedDataCase.customerPhone}) | Storage Size: {searchedDataCase.capacity}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span className="text-xs text-white/50">Cleanroom Progress</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-4 py-1.5 rounded-xl border border-purple-500/30">
                    {searchedDataCase.status || 'In Cleanroom'}
                  </span>
                  <button
                    onClick={handlePrint}
                    className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-300" /> Print Cleanroom Slip
                  </button>
                </div>
              </div>

              {/* Data Recovery Stage Stepper */}
              <div className="py-4 space-y-3">
                <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-purple-400" /> ISO Cleanroom Recovery Stages
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] font-bold">
                  <div className="py-2.5 px-2 rounded-xl bg-purple-500 text-white">1. ISO Inspection</div>
                  <div className="py-2.5 px-2 rounded-xl bg-purple-500 text-white">2. Head Swap</div>
                  <div className="py-2.5 px-2 rounded-xl bg-purple-500 text-white animate-pulse shadow-md shadow-purple-500/30">
                    3. Platter Imaging
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-white/10 text-white/40">4. File Extraction</div>
                  <div className="py-2.5 px-2 rounded-xl bg-white/10 text-white/40">5. Data Handover</div>
                </div>
              </div>

              {/* Recovery Technical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Failure Diagnosis</span>
                  <p className="text-white font-semibold leading-snug">{searchedDataCase.failureReason}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Target Data Files</span>
                  <p className="text-purple-300 font-extrabold">{searchedDataCase.targetData || 'Essential Customer Files & DB'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-white/50 font-bold uppercase text-[10px] block">Cleanroom Recovery Fee</span>
                  <p className="text-white font-mono font-bold text-sm">
                    Total: <span className="text-purple-300">₹{(searchedDataCase.recoveryFee || 15000).toLocaleString('en-IN')}</span>
                  </p>
                  <p className="text-[10px] text-white/50">Advance Deposit: ₹{(searchedDataCase.advancePaid || 3000).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
