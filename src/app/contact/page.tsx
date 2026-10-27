'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useErpStore } from '@/lib/store';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addSupportLead } = useErpStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newLeadData = {
      lead_name: formData.name,
      phone: formData.phone,
      email: formData.email || 'support@client.com',
      company: 'Website Contact Inquiry',
      subject: formData.subject || 'Website Support Inquiry',
      message: formData.message,
      service_interested: formData.subject ? `${formData.subject} - ${formData.message.slice(0, 40)}...` : formData.message,
      status: 'New Inquiry' as const,
      source: 'Website Contact Form' as const,
      formCategory: 'contact_form' as const,
      created_at: new Date().toISOString()
    };

    // 1. Save directly to global ERP Store (Local Storage)
    addSupportLead(newLeadData);

    // 2. Post to API route for backend database persistence
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: 'Website Contact Inquiry',
          service_interested: `${formData.subject}: ${formData.message}`,
          estimated_value: 0,
          status: 'new'
        })
      });
    } catch (err) {
      console.error('API lead save notice:', err);
    }

    setLoading(false);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#5ED29C] font-bold uppercase text-xs tracking-wider">Get In Touch</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase mt-2">
            CONTACT ACCNO SOLUTION<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-white/70 text-sm mt-3">
            Have a question about a repair estimate, corporate AMC, or custom ERP software demo? Speak with our engineering desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start space-x-4">
              <Phone className="w-6 h-6 text-[#5ED29C] mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Phone Numbers</h4>
                <p className="text-xs text-white/70 mt-1">+91 80900 20060 (Direct Repair Desk)</p>
                <p className="text-xs text-white/70">+91 2979 357020 (Landline Office)</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start space-x-4">
              <Mail className="w-6 h-6 text-[#16FFC6] mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Email Contact</h4>
                <p className="text-xs text-white/70 mt-1">support@accnosolution.com</p>
                <p className="text-xs text-white/70">sales@accnosolution.com</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-[#5ED29C] mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Headquarters Address</h4>
                <p className="text-xs text-white/70 mt-1 font-bold text-white">ACCNO SOLUTION</p>
                <p className="text-xs text-white/70">80, Choudhary Dharmshala, Above Vijay Laxmi Medical Agency,</p>
                <p className="text-xs text-white/70">Indira Chowk, Sanchore, Rajasthan 343041</p>
                <p className="text-[11px] text-[#5ED29C] mt-1.5 font-semibold">Open Mon - Sat: 9:30 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10">
            {sent ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#5ED29C] mx-auto" />
                <h3 className="text-2xl font-extrabold text-white uppercase">MESSAGE &amp; SUPPORT LEAD REGISTERED</h3>
                <p className="text-xs text-white/70 max-w-md mx-auto">
                  Thank you, <span className="text-[#5ED29C] font-bold">{formData.name}</span>! Your inquiry has been routed directly to our <span className="text-white font-bold">Support Leads</span> desk. An engineer will reach out to <span className="text-[#16FFC6] font-mono font-bold">{formData.phone}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#5ED29C] focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765-43210"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#5ED29C] focus:outline-none font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. vikram@techsolutions.com"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#5ED29C] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. MacBook Logic Board Repair / AMC Contract"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#5ED29C] focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Message &amp; Problem Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue or technical service requirement..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#5ED29C] focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> {loading ? 'Registering Lead...' : 'Send Message & Create Support Lead'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
