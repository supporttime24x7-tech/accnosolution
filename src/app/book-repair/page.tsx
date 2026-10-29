'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import { Wrench, CheckCircle2, Send, Phone, User, Laptop, MapPin } from 'lucide-react';

import { useErpStore } from '@/lib/store';
import { pushBookRepairLeadToSupabase, pushTicketToSupabase } from '@/lib/supabase-sync';

export default function BookRepairPage() {
  const { addTicket, addBookRepairLead } = useErpStore();
  const [submitted, setSubmitted] = useState(false);
  const [bookingTicketNo, setBookingTicketNo] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deviceType: 'Laptop',
    brand: '',
    model: '',
    problem: '',
    serviceType: 'In-Store Drop Off (Gandhi Nagar)',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bkNo = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingTicketNo(bkNo);

    // 1. Save directly under "Book Repair Online" Leads Section & Supabase Cloud
    const bookLeadData = {
      bookingNo: bkNo,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'customer@repairdesk.com',
      deviceType: formData.deviceType,
      brand: formData.brand || 'Generic Brand',
      model: formData.model || 'Standard Model',
      serviceMode: formData.serviceType,
      problemDescription: formData.problem,
      address: formData.address || 'In-Store Drop Off',
      status: 'New Booking' as const,
      created_at: new Date().toISOString(),
    };
    addBookRepairLead(bookLeadData);
    pushBookRepairLeadToSupabase(bookLeadData as any).catch(() => {});

    // 2. Also register Repair Ticket for bench processing & Supabase Cloud
    const ticketData = {
      ticket_number: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customerEmail: formData.email,
      customerAddress: formData.address || 'Online Booking Registration',
      customerType: 'RETAIL' as const,
      device_type: formData.deviceType,
      brand: formData.brand || 'Generic Brand',
      model: formData.model || 'Standard Model',
      serial_or_imei: 'REG-ONLINE-' + Date.now().toString().slice(-4),
      rackLocation: 'Online Desk Bin 01',
      problem_reported: formData.problem || 'Online Service Registration Request',
      physicalCondition: 'Customer Reported intake via Website',
      status: 'received' as const,
      priority: 'normal' as const,
      lineItems: [],
      outsourceCharges: 0,
      freightCharges: 0,
      estimated_cost: 1500,
      advance_paid: 0,
      discountAmount: 0,
      gstTaxRate: 18,
      subtotal: 1500,
      taxableAmount: 1271.19,
      cgstAmount: 114.40,
      sgstAmount: 114.40,
      roundOffAdjustment: 0,
      grandTotal: 1500,
      netDueBalance: 1500,
      paymentMethod: 'CASH' as const,
      paymentStatus: 'UNPAID' as const,
      warrantyStatement: '30 Days Parts & Labor Warranty',
      deliveryStatus: 'IN REPAIR LAB',
      technician_name: 'Deepak Kumar',
      entryDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    addTicket(ticketData as any);
    pushTicketToSupabase(ticketData as any).catch(() => {});

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-bold uppercase tracking-wider mb-4">
              <Wrench className="w-3.5 h-3.5" />
              Online Repair Desk Registration
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
              BOOK A REPAIR SERVICE<span className="text-[#5ED29C]">.</span>
            </h1>
            <p className="mt-4 text-white/70 text-sm">
              Fill in your device details below to reserve a priority bench slot or schedule an onsite field engineer visit.
            </p>
          </div>

          {submitted ? (
            <div className="glass-panel p-10 rounded-3xl text-center border border-[#5ED29C]/40">
              <div className="w-16 h-16 rounded-full bg-[#5ED29C]/20 border border-[#5ED29C] flex items-center justify-center text-[#5ED29C] mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white uppercase">REPAIR BOOKING CONFIRMED!</h2>
              <p className="text-xs text-white/70 mt-3 max-w-md mx-auto">
                Thank you <span className="text-[#5ED29C] font-bold">{formData.name}</span>. Your registered repair ticket number is <span className="font-mono font-bold text-[#16FFC6] px-2 py-0.5 rounded bg-white/10">{bookingTicketNo}</span>. Our service manager will call you within 15 minutes at {formData.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765-43210"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Device Type *</label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] text-xs"
                  >
                    <option>Laptop</option>
                    <option>Desktop / Custom PC</option>
                    <option>Apple MacBook / iMac</option>
                    <option>Hard Drive / SSD Data Recovery</option>
                    <option>Printer / Scanner</option>
                    <option>CCTV / Networking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple / Dell / HP / Lenovo"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">Service Mode</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] text-xs"
                  >
                    <option>In-Store Drop Off (Gandhi Nagar)</option>
                    <option>Onsite Doorstep Pickup</option>
                    <option>Corporate AMC Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">Problem Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="Describe the issue (e.g. Liquid spill, screen flickering, dead power, noisy fan, data loss...)"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#5ED29C]/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Repair Ticket Registration
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
