'use client';

import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, CreditCard, Building2, User, Phone, Mail, MapPin, Package, QrCode, Copy, Check, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErpStore, CartItem } from '@/lib/store';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { websiteCart = [], removeFromWebsiteCart, updateWebsiteCartQty, clearWebsiteCart, addSupportLead } = useErpStore();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderRefId, setOrderRefId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'qr' | 'bank'>('qr');

  // Checkout Form Inputs
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'UPI_BANK'>('UPI_BANK');
  const [notes, setNotes] = useState('');

  // Payment Verification Inputs
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentReceiptImage, setPaymentReceiptImage] = useState('');

  const totalItemsCount = websiteCart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = websiteCart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  const officialUpiId = 'accnosolution@upi';
  const bankDetails = {
    accountName: 'ACCNO SOLUTION IT CARE',
    bankName: 'HDFC Bank',
    accountNumber: '50200089201458',
    ifscCode: 'HDFC0004921',
    branch: 'Sanchore Main Branch, Rajasthan',
  };

  const handleOpenCheckout = () => {
    setIsOrderSubmitted(false);
    setIsPaymentStep(false);
    setIsCheckoutStep(true);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const compressed = canvas.toDataURL('image/jpeg', 0.6);
            setPaymentReceiptImage(compressed);
          } else {
            setPaymentReceiptImage(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyText = (text: string, type: 'upi' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleCheckoutNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    if (paymentMode === 'UPI_BANK') {
      setIsPaymentStep(true);
    } else {
      executeFinalOrderSubmit();
    }
  };

  const executeFinalOrderSubmit = () => {
    const refNo = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const itemsSummary = websiteCart
      .map(
        (c) =>
          `• [${c.product.code}] ${c.product.name} (Qty: ${c.quantity}) @ ₹${c.product.sellingPrice.toLocaleString('en-IN')}/unit = ₹${(
            c.product.sellingPrice * c.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const leadSubject = `[SHOP ORDER ${refNo}] ${customerName} - ${totalItemsCount} Item(s) (₹${subtotal.toLocaleString('en-IN')})`;

    let paymentDetailsString = `Selected Payment Method: ${paymentMode === 'COD' ? 'Cash on Delivery / In-Store Pickup' : 'Direct UPI / Bank Transfer'}`;

    if (paymentMode === 'UPI_BANK') {
      paymentDetailsString += `\nTransaction Reference (UTR / UPI Ref): ${utrNumber.trim() || 'Not Provided'}`;
      if (paymentReceiptImage) {
        paymentDetailsString += `\nPayment Receipt Screenshot: Attached (Base64 Proof Recorded)`;
      }
    }

    const messageContent = `--- CLIENT & SHIPPING DETAILS ---
Order Reference ID: ${refNo}
Customer Name: ${customerName.trim()}
Business / Firm Name: ${businessName.trim() || 'Individual Client'}
Delivery Address & City: ${address.trim()}
Phone Number: ${phone.trim()}
Email Address: ${email.trim() || 'Not Provided'}
${paymentDetailsString}

--- ORDERED ITEMS BREAKDOWN ---
${itemsSummary}

Subtotal Order Amount: ₹${subtotal.toLocaleString('en-IN')} (Inclusive of GST)

Delivery Remarks / Notes:
${notes.trim() || 'No special delivery instructions.'}`;

    // Register Order Lead in ERP Store
    addSupportLead({
      lead_name: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'client@shop.com',
      company: businessName.trim() || 'Retail Hardware Client',
      subject: leadSubject,
      message: messageContent,
      service_interested: 'Hardware Store Online Order',
      status: 'New Inquiry',
      source: 'Online Shop Order',
      formCategory: 'shop_order',
      paymentProofImage: paymentReceiptImage || undefined,
      utrNumber: utrNumber.trim() || undefined,
      orderTotal: subtotal,
      created_at: new Date().toISOString(),
    });

    setOrderRefId(refNo);
    setIsOrderSubmitted(true);
    clearWebsiteCart();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-[#070B0A] text-white border-l border-white/10 h-full flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#16FFC6]" />
              <h2 className="text-lg font-black uppercase tracking-tight">Shopping Cart</h2>
              {totalItemsCount > 0 && (
                <span className="text-xs font-mono font-bold bg-[#16FFC6] text-[#070B0A] px-2 py-0.5 rounded-full">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!isCheckoutStep ? (
              /* Step 1: Cart Items List */
              <>
                {websiteCart.length > 0 ? (
                  <div className="space-y-4">
                    {websiteCart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-center justify-between hover:border-white/20 transition-all"
                      >
                        {/* Square Thumbnail */}
                        <div className="w-16 h-16 rounded-xl aspect-square bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.productImage ? (
                            <img src={product.productImage} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-white/20" />
                          )}
                        </div>

                        {/* Title & Price */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-[#16FFC6] font-bold block">{product.code}</span>
                          <h4 className="text-xs font-bold text-white truncate leading-snug">{product.name}</h4>
                          <div className="text-xs font-mono font-extrabold text-[#16FFC6] mt-1">
                            ₹{(product.sellingPrice * quantity).toLocaleString('en-IN')}
                            <span className="text-[10px] text-white/40 font-normal ml-1">(₹{product.sellingPrice.toLocaleString('en-IN')}/ea)</span>
                          </div>
                        </div>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => updateWebsiteCartQty(product.id, quantity - 1)}
                            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2">{quantity}</span>
                          <button
                            onClick={() => updateWebsiteCartQty(product.id, quantity + 1)}
                            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => removeFromWebsiteCart(product.id)}
                          className="text-white/30 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="w-16 h-16 text-white/20 mx-auto" />
                    <h3 className="text-lg font-bold text-white uppercase">Your Cart is Empty</h3>
                    <p className="text-xs text-white/60 max-w-xs mx-auto">
                      Explore our online hardware store and add components or assembled PCs to your cart.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase shadow-lg shadow-[#16FFC6]/20 transition-all cursor-pointer"
                    >
                      Browse Shop
                    </button>
                  </div>
                )}
              </>
            ) : !isPaymentStep && !isOrderSubmitted ? (
              /* Step 2: Client Info & Address Form */
              <form id="checkout-form" onSubmit={handleCheckoutNext} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-[#16FFC6] uppercase">Delivery &amp; Client Information</span>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutStep(false)}
                    className="text-[11px] text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Back to Cart
                  </button>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Customer Name <span className="text-[#16FFC6]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Business / Firm Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Tech Logics Pvt Ltd"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      Phone Number <span className="text-[#16FFC6]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765-43210"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@techlogics.com"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#16FFC6]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Delivery Address &amp; Location <span className="text-[#16FFC6]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 42, Main Market, Sanchore, Rajasthan"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#16FFC6]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-2">Preferred Payment Mode</label>
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('COD')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMode === 'COD'
                          ? 'bg-[#16FFC6]/10 border-[#16FFC6] text-[#16FFC6] font-bold'
                          : 'bg-white/5 border-white/10 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans">Cash / Store Pickup</div>
                      <div className="text-[10px] opacity-70">Pay on pickup or COD</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI_BANK')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMode === 'UPI_BANK'
                          ? 'bg-[#16FFC6]/10 border-[#16FFC6] text-[#16FFC6] font-bold'
                          : 'bg-white/5 border-white/10 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans">UPI / Bank Transfer</div>
                      <div className="text-[10px] opacity-70">Instant QR / Bank Details</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Special Delivery Remarks</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Require urgent delivery, call before arrival..."
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#16FFC6]"
                  />
                </div>
              </form>
            ) : isPaymentStep && !isOrderSubmitted ? (
              /* Step 3: UPI & Bank Transfer Payment Verification View */
              <div className="space-y-5 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[#16FFC6]">
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">UPI &amp; Bank Transfer Payment</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaymentStep(false)}
                    className="text-[11px] text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Back to Address
                  </button>
                </div>

                {/* Payable Amount Badge */}
                <div className="bg-[#16FFC6]/10 border border-[#16FFC6]/30 p-3.5 rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-white/80">Payable Amount:</span>
                  <span className="text-lg font-black font-mono text-[#16FFC6]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Payment Option Switcher Pills */}
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold font-mono">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('qr')}
                    className={`py-2 rounded-lg transition-all ${paymentTab === 'qr' ? 'bg-[#16FFC6] text-[#070B0A]' : 'text-white/60 hover:text-white'}`}
                  >
                    Scan UPI QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('bank')}
                    className={`py-2 rounded-lg transition-all ${paymentTab === 'bank' ? 'bg-[#16FFC6] text-[#070B0A]' : 'text-white/60 hover:text-white'}`}
                  >
                    Bank Details
                  </button>
                </div>

                {paymentTab === 'qr' ? (
                  /* UPI QR Code View */
                  <div className="space-y-4 text-center bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <div className="w-44 h-44 mx-auto rounded-2xl bg-white p-2.5 shadow-xl flex items-center justify-center border-2 border-[#16FFC6]/50">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          `upi://pay?pa=${officialUpiId}&pn=${encodeURIComponent(bankDetails.accountName)}&am=${subtotal}&cu=INR`
                        )}`}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-white/60 font-mono">Scan using Google Pay, PhonePe, Paytm, or BHIM</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#16FFC6] bg-black/50 border border-[#16FFC6]/30 px-3 py-1 rounded-full">
                          {officialUpiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(officialUpiId, 'upi')}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#16FFC6]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Bank Details View */
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between text-white/70">
                      <span>Account Name:</span>
                      <span className="text-white font-bold">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Bank Name:</span>
                      <span className="text-[#16FFC6] font-bold">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/70">
                      <span>Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">{bankDetails.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(bankDetails.accountNumber, 'account')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-[#16FFC6]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>IFSC Code:</span>
                      <span className="text-[#16FFC6] font-bold">{bankDetails.ifscCode}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Branch:</span>
                      <span className="text-white">{bankDetails.branch}</span>
                    </div>
                  </div>
                )}

                {/* Upload Payment Receipt Screenshot & UTR Form */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <span className="text-xs font-extrabold text-[#16FFC6] uppercase tracking-wider block border-b border-white/10 pb-2">
                    Payment Verification Details
                  </span>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">
                      Upload Transaction Screenshot / Receipt Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#16FFC6]/20 file:text-[#16FFC6] hover:file:bg-[#16FFC6] hover:file:text-[#070B0A] file:cursor-pointer transition-all"
                    />

                    {paymentReceiptImage && (
                      <div className="mt-3 relative w-32 h-32 rounded-xl border-2 border-[#16FFC6]/50 overflow-hidden bg-black shadow-md">
                        <img src={paymentReceiptImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPaymentReceiptImage('')}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">
                      Transaction UTR / UPI Reference Number <span className="text-white/40 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 123456789012 (12-digit UTR/Ref)"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs outline-none focus:border-[#16FFC6]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Step 4: Order Confirmation Screen */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#16FFC6]/20 border-2 border-[#16FFC6] text-[#16FFC6] flex items-center justify-center mx-auto shadow-xl shadow-[#16FFC6]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Order &amp; Payment Submitted!</h3>
                  <p className="text-xs text-[#16FFC6] font-mono font-bold">Order Reference: {orderRefId}</p>
                </div>

                <p className="text-xs text-white/70 leading-relaxed max-w-sm mx-auto">
                  Thank you <strong className="text-white">{customerName}</strong>! Your order request and payment receipt have been logged. Our accounts team will verify the transaction and contact you at <strong className="text-[#16FFC6]">{phone}</strong> for dispatch.
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsCheckoutStep(false);
                      setIsPaymentStep(false);
                      setIsOrderSubmitted(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#16FFC6]/20 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                  <Link
                    href="/track-repair"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    Track Status
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {websiteCart.length > 0 && !isOrderSubmitted && (
            <div className="p-6 border-t border-white/10 space-y-4 bg-black/40">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-white/70">
                  <span>Cart Subtotal ({totalItemsCount} items):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>GST Tax:</span>
                  <span className="text-[#16FFC6]">Included</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#16FFC6] pt-2 border-t border-white/10 font-sans">
                  <span>Total Order Amount:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!isCheckoutStep ? (
                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="w-full py-3.5 bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#16FFC6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : !isPaymentStep ? (
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3.5 bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#16FFC6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{paymentMode === 'UPI_BANK' ? 'Proceed to UPI / Bank Payment' : 'Place Final Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={executeFinalOrderSubmit}
                  className="w-full py-3.5 bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#16FFC6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Payment Proof &amp; Confirm Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
