'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingCart, Plus, Search, Filter, Printer, Trash2, Eye, DollarSign,
  Calendar, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, ChevronDown, User, Package, X, Check,
  Building, Phone, MapPin, Tag, ShieldCheck, ArrowRight, RefreshCw, CreditCard, Sparkles, Barcode, Edit2, RotateCw
} from 'lucide-react';
import { useErpStore, SalesInvoiceItem, TransactionItemLine, CustomerItem, InventoryItem } from '@/lib/store';
import {
  fetchSalesInvoicesFromSupabase,
  pushSalesInvoiceToSupabase,
  deleteSalesInvoiceFromSupabase,
} from '@/lib/supabase-sync';

// Searchable Product Combobox Component for Line Items
interface SearchableLineItemSelectProps {
  selectedItemId: string;
  onSelect: (newItemId: string) => void;
  inventory: InventoryItem[];
}

function SearchableLineItemSelect({ selectedItemId, onSelect, inventory }: SearchableLineItemSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = inventory.find((i) => i.id === selectedItemId);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return inventory;
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q)) ||
        (item.hsnCode && item.hsnCode.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        ((item as any).sku && (item as any).sku.toLowerCase().includes(q))
    );
  }, [inventory, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 rounded-xl bg-[#161B22] border border-[#5ED29C]/40 text-white text-xs font-semibold text-left flex items-center justify-between hover:border-[#5ED29C] transition-colors"
      >
        <span className="truncate pr-2">
          {selectedItem
            ? `${selectedItem.name} (Stock: ${selectedItem.currentStock} ${selectedItem.uom}) - ₹${selectedItem.sellingPrice.toLocaleString()}`
            : 'Select Inventory Product Item...'}
        </span>
        <ChevronDown className="w-4 h-4 text-[#5ED29C] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#161B22] border border-[#5ED29C]/50 rounded-xl shadow-2xl overflow-hidden max-h-64 flex flex-col">
          <div className="p-2 border-b border-white/10 bg-[#0D1117]">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="🔍 Search product name, SKU, HSN..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#5ED29C]"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-white/10 max-h-48">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-white/40 text-xs">No matching products found</div>
            ) : (
              filtered.map((invItem) => (
                <div
                  key={invItem.id}
                  onClick={() => {
                    onSelect(invItem.id);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`p-2.5 hover:bg-[#5ED29C]/15 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    invItem.id === selectedItemId ? 'bg-[#5ED29C]/10 border-l-2 border-[#5ED29C]' : ''
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="font-extrabold text-white text-xs">
                      {invItem.name}{' '}
                      <span className="text-[10px] text-[#5ED29C] font-mono">
                        ({invItem.code || invItem.barcode})
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono font-semibold flex items-center gap-1.5">
                      <span>₹{invItem.sellingPrice.toLocaleString()}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-slate-200">
                        Stock: <strong className="text-white">{invItem.currentStock}</strong> {invItem.uom}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="text-slate-300">HSN: {invItem.hsnCode || '84713010'}</span>
                    </div>
                  </div>
                  {invItem.id === selectedItemId && (
                    <span className="text-[10px] font-bold text-[#5ED29C] bg-[#5ED29C]/20 px-2 py-0.5 rounded-full border border-[#5ED29C]/30 shrink-0">
                      Selected
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SalesPage() {
  const {
    salesInvoices,
    customers,
    inventory,
    companyDetails,
    saleRules,
    updateSaleRules,
    addSalesInvoice,
    updateSalesInvoice,
    deleteSalesInvoice,
    setSalesInvoices,
    addCustomer,
    updateCustomer,
  } = useErpStore();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncingCloud(true);
    setSyncStatusMsg('Syncing with Supabase Cloud...');
    try {
      const data = await fetchSalesInvoicesFromSupabase();
      if (Array.isArray(data)) {
        setSalesInvoices(data);
        setSyncStatusMsg(`Synced ${data.length} invoices from Cloud`);
      } else {
        setSyncStatusMsg('Cloud sync completed');
      }
    } catch {
      setSyncStatusMsg('Sync error occurred');
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  useEffect(() => {
    fetchSalesInvoicesFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSalesInvoices(data);
      }
    }).catch(() => {});
  }, [setSalesInvoices]);

  const [isMounted, setIsMounted] = React.useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Date Search & Range Filter States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState<string>('ALL');

  const applyDatePreset = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === 'TODAY') {
      const todayStr = now.toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'YESTERDAY') {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const yestStr = yest.toISOString().split('T')[0];
      setStartDate(yestStr);
      setEndDate(yestStr);
    } else if (preset === 'THIS_WEEK') {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      setStartDate(startOfWeek.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'THIS_MONTH') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(startOfMonth.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Modals state
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [activeInvoiceView, setActiveInvoiceView] = useState<SalesInvoiceItem | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<SalesInvoiceItem | null>(null);
  const [paymentInput, setPaymentInput] = useState<number>(0);
  const [paymentModeInput, setPaymentModeInput] = useState<string>('Bank Transfer (NEFT/RTGS)');
  const [showQuickCustModal, setShowQuickCustModal] = useState(false);

  // Customer Autocomplete Search States
  const [custSearchQuery, setCustSearchQuery] = useState('');
  const [showCustDropdown, setShowCustDropdown] = useState(false);

  // Barcode & Product Catalog Search States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Print Choice Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printTargetInvoice, setPrintTargetInvoice] = useState<SalesInvoiceItem | null>(null);
  const [printPaperFormat, setPrintPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [printCopyType, setPrintCopyType] = useState<'customer' | 'office' | 'both'>('customer');

  // Quick Customer Registration Form
  const [quickCust, setQuickCust] = useState({
    name: '',
    mobile: '',
    gstin: '',
    companyName: '',
    address: '',
  });

  // Helper to compute initial form state dynamically from Sale Rules
  const getInitialFormData = () => {
    const prefix = saleRules?.salesInvoicePrefix || 'SAL-';
    const startNo = saleRules?.salesInvoiceStartNo || 1001;
    const nextInvoiceNo = `${prefix}${startNo + salesInvoices.length}`;
    const paymentTerms = saleRules?.defaultPaymentTerms || 'Credit 15 Days';
    const supplyType = saleRules?.defaultGstSupplyType === 'Inter-State (IGST)' ? 'INTER_STATE' : 'INTRA_STATE';
    const taxRate = saleRules?.defaultTaxRate !== undefined ? saleRules.defaultTaxRate : 18;
    const gstTaxMode = `${taxRate}% GST (${taxRate / 2}% + ${taxRate / 2}%)`;

    return {
      invoiceNo: nextInvoiceNo,
      invoiceDate: new Date().toISOString().slice(0, 16),
      customerId: '',
      customerName: '',
      customerPhone: '',
      customerGst: '',
      customerAddress: '',
      supplyType: supplyType as 'INTRA_STATE' | 'INTER_STATE',
      paymentTerms,
      paymentMethod: 'Bank Transfer (NEFT/RTGS)',
      gstTaxMode,
      shippingCharges: 0,
      discount: 0,
      discountType: 'fixed' as 'fixed' | 'percent',
      showProductRemarksOnPrint: saleRules?.showProductRemarksOnPrint !== undefined ? saleRules.showProductRemarksOnPrint : true,
      showRefurbishedBadgeOnPrint: saleRules?.showRefurbishedBadgeOnPrint !== undefined ? saleRules.showRefurbishedBadgeOnPrint : true,
      initialPaid: 0,
      remarks: '',
    };
  };

  // Sales Invoice Form State (Starts Empty by default)
  const [formData, setFormData] = useState(getInitialFormData);

  // Line items state for invoice (Starts Empty by default)
  const [lineItems, setLineItems] = useState<TransactionItemLine[]>([]);

  // Open Clean / Empty Create Sales Invoice Modal
  const openCreateInvoiceModal = () => {
    setEditingInvoiceId(null);
    setFormData(getInitialFormData());
    setLineItems([]);
    setCustSearchQuery('');
    setProductSearchQuery('');
    setIsNewInvoiceOpen(true);

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 150);
  };

  // Open Edit / Modify Existing Generated Sales Invoice Modal
  const openEditModalForInvoice = (inv: SalesInvoiceItem) => {
    setEditingInvoiceId(inv.id);
    setFormData({
      invoiceNo: inv.invoiceNo,
      invoiceDate: new Date(inv.invoiceDate).toISOString().slice(0, 16),
      customerId: inv.customerId || '',
      customerName: inv.customerName || '',
      customerPhone: inv.customerPhone || '',
      customerGst: inv.customerGst || '',
      customerAddress: inv.customerAddress || '',
      supplyType: 'INTRA_STATE',
      paymentTerms: inv.paymentTerms || 'Credit 15 Days',
      paymentMethod: inv.paymentMethod || 'Bank Transfer (NEFT/RTGS)',
      gstTaxMode: '18% GST (9% + 9%)',
      shippingCharges: inv.shippingCharges || 0,
      discount: inv.discount || 0,
      discountType: inv.discountType || 'fixed',
      showProductRemarksOnPrint: inv.showProductRemarksOnPrint !== undefined ? inv.showProductRemarksOnPrint : true,
      showRefurbishedBadgeOnPrint: inv.showRefurbishedBadgeOnPrint !== undefined ? inv.showRefurbishedBadgeOnPrint : true,
      initialPaid: inv.paidAmount || 0,
      remarks: inv.remarks || '',
    });
    setLineItems(inv.items ? JSON.parse(JSON.stringify(inv.items)) : []);
    setCustSearchQuery(inv.customerName || '');
    setProductSearchQuery('');
    setIsNewInvoiceOpen(true);
  };

  // Select Customer Account from Autocomplete
  const handleSelectCustomerItem = (cust: CustomerItem) => {
    setFormData((prev) => ({
      ...prev,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone || cust.mobile || '',
      customerGst: cust.gstin || '',
      customerAddress: cust.billingAddress || cust.address || '',
    }));
    setCustSearchQuery(cust.name);
    setShowCustDropdown(false);
  };

  // Add Item to Invoice via Barcode Scan or Catalog Dropdown
  const handleAddProductItemToInvoice = (invItem: InventoryItem) => {
    // Check if item is already in lineItems
    const existingIndex = lineItems.findIndex((line) => line.itemId === invItem.id);
    if (existingIndex >= 0) {
      const updatedLines = [...lineItems];
      const currQty = updatedLines[existingIndex].quantity + 1;
      updatedLines[existingIndex].quantity = currQty;
      updatedLines[existingIndex].totalPrice = currQty * updatedLines[existingIndex].unitPrice;
      setLineItems(updatedLines);
    } else {
      const newLine: TransactionItemLine = {
        id: `sli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        itemId: invItem.id,
        name: invItem.name,
        hsnCode: invItem.hsnCode || '84713010',
        gstRate: invItem.gstRate || 18,
        quantity: 1,
        unitPrice: invItem.sellingPrice,
        discount: 0,
        discountType: 'fixed',
        totalPrice: invItem.sellingPrice,
        productCondition: invItem.productCondition || 'New',
        refurbishedDescription: invItem.refurbishedDescription || '',
        remarks: invItem.barcode ? `Barcode: ${invItem.barcode}` : '',
      };
      setLineItems((prev) => [...prev, newLine]);
    }

    setProductSearchQuery('');
    setShowProductDropdown(false);
    barcodeInputRef.current?.focus();
  };

  // Barcode Enter key or manual scanner trigger
  const handleScanBarcode = (scannedQuery: string) => {
    const q = scannedQuery.toLowerCase().trim();
    if (!q) return;

    // Search by exact barcode, code, sku, or partial name
    const match = inventory.find(
      (item) =>
        (item.barcode && item.barcode.toLowerCase() === q) ||
        (item.code && item.code.toLowerCase() === q) ||
        item.name.toLowerCase().includes(q)
    );

    if (match) {
      handleAddProductItemToInvoice(match);
    } else {
      alert(`No product found in inventory matching barcode/search "${scannedQuery}".`);
    }
  };

  // Add blank line item
  const handleAddLineItem = () => {
    const defaultPart = inventory[0];
    const newLine: TransactionItemLine = {
      id: `sli-${Date.now()}`,
      itemId: defaultPart?.id || '',
      name: defaultPart?.name || 'Custom Hardware Component / Service',
      hsnCode: defaultPart?.hsnCode || '84713010',
      gstRate: defaultPart?.gstRate || 18,
      quantity: 1,
      unitPrice: defaultPart?.sellingPrice || 0,
      discount: 0,
      discountType: 'fixed',
      totalPrice: defaultPart?.sellingPrice || 0,
      productCondition: defaultPart?.productCondition || 'New',
      refurbishedDescription: defaultPart?.refurbishedDescription || '',
      remarks: '',
    };
    setLineItems([...lineItems, newLine]);
  };

  // Update line item
  const handleUpdateLineItem = (id: string, updates: Partial<TransactionItemLine>) => {
    setLineItems(
      lineItems.map((line) => {
        if (line.id === id) {
          const updated = { ...line, ...updates };
          if ('itemId' in updates && updates.itemId) {
            const selectedInv = inventory.find((i) => i.id === updates.itemId);
            if (selectedInv) {
              updated.name = selectedInv.name;
              updated.hsnCode = selectedInv.hsnCode || '84713010';
              updated.gstRate = selectedInv.gstRate || 18;
              updated.unitPrice = selectedInv.sellingPrice;
              updated.productCondition = selectedInv.productCondition || 'New';
              updated.refurbishedDescription = selectedInv.refurbishedDescription || '';
            }
          }

          const qty = updated.quantity || 1;
          const price = updated.unitPrice || 0;
          const rawSubtotal = qty * price;
          let discVal = 0;
          if (updated.discount && updated.discount > 0) {
            if (updated.discountType === 'percent') {
              discVal = (rawSubtotal * updated.discount) / 100;
            } else {
              discVal = updated.discount;
            }
          }
          updated.totalPrice = Math.max(0, rawSubtotal - discVal);
          return updated;
        }
        return line;
      })
    );
  };

  // Remove line item
  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((l) => l.id !== id));
  };

  // Quick Customer Registration Submit
  const handleSaveQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCust.name || !quickCust.mobile) {
      alert('Please provide Customer Name and Mobile Number.');
      return;
    }
    const newId = `cust-${Date.now()}`;
    addCustomer({
      name: quickCust.name,
      mobile: quickCust.mobile,
      phone: quickCust.mobile,
      gstin: quickCust.gstin,
      companyName: quickCust.companyName,
      billingAddress: quickCust.address,
      address: quickCust.address,
      accountStatus: 'Active',
      outstandingBalance: 0,
      creditLimit: 100000,
    });

    setFormData((prev) => ({
      ...prev,
      customerId: newId,
      customerName: quickCust.name,
      customerPhone: quickCust.mobile,
      customerGst: quickCust.gstin,
      customerAddress: quickCust.address,
    }));
    setCustSearchQuery(quickCust.name);

    setQuickCust({ name: '', mobile: '', gstin: '', companyName: '', address: '' });
    setShowQuickCustModal(false);
    alert(`Customer "${quickCust.name}" registered and selected!`);
  };

  // Compute Invoice Financial Totals (Memoized)
  const totalItemsSum = useMemo(() => lineItems.reduce((acc, l) => acc + l.totalPrice, 0), [lineItems]);
  const taxSum = useMemo(() => {
    return lineItems.reduce((acc, l) => {
      const rate = formData.gstTaxMode.includes('0%') ? 0 : formData.gstTaxMode.includes('5%') ? 5 : formData.gstTaxMode.includes('12%') ? 12 : l.gstRate || 18;
      return acc + (l.totalPrice * (rate / 100));
    }, 0);
  }, [lineItems, formData.gstTaxMode]);

  const computedOverallDiscount = useMemo(() => {
    const gross = totalItemsSum + taxSum;
    const val = Number(formData.discount || 0);
    if (formData.discountType === 'percent') {
      return (gross * val) / 100;
    }
    return val;
  }, [totalItemsSum, taxSum, formData.discount, formData.discountType]);

  const grandTotalCalc = useMemo(() => {
    let rawTotal = Math.max(0, totalItemsSum + taxSum + Number(formData.shippingCharges || 0) - computedOverallDiscount);
    if (saleRules?.autoRoundOffGrandTotal) {
      return Math.round(rawTotal);
    }
    return rawTotal;
  }, [totalItemsSum, taxSum, formData.shippingCharges, computedOverallDiscount, saleRules?.autoRoundOffGrandTotal]);

  const initialBalanceDue = useMemo(() => {
    return Math.max(0, grandTotalCalc - Number(formData.initialPaid || 0));
  }, [grandTotalCalc, formData.initialPaid]);

  // Save / Submit Sales Invoice (Handles both Create New and Modify Existing)
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) {
      alert('Please enter or select a Customer Name.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one product item to the sales bill.');
      return;
    }

    // Sale Rules KYC & Policy Validations
    if (saleRules?.requireCustomerPhone && !formData.customerPhone?.trim()) {
      alert('Customer Mobile/Phone number is required under current Sale Rules policy settings.');
      return;
    }

    if (saleRules?.requireCustomerGstForB2B && formData.supplyType === 'INTER_STATE' && !formData.customerGst?.trim()) {
      alert('Customer GSTIN is required for Inter-State B2B invoices under current Sale Rules policy settings.');
      return;
    }

    if (saleRules?.enableDiscountLimits && (saleRules?.maxDiscountPercent || 0) > 0) {
      const grossSubtotal = totalItemsSum + taxSum;
      if (grossSubtotal > 0) {
        const discountPercent = (computedOverallDiscount / grossSubtotal) * 100;
        if (discountPercent > (saleRules.maxDiscountPercent || 0)) {
          alert(`Entered Discount of ₹${computedOverallDiscount.toLocaleString()} (${discountPercent.toFixed(1)}%) exceeds the maximum allowed discount limit of ${saleRules.maxDiscountPercent}% set in Sale Rules settings.`);
          return;
        }
      }
    }

    const paidVal = Number(formData.initialPaid || 0);
    const balVal = Math.max(0, grandTotalCalc - paidVal);
    const payStatus: 'Paid' | 'Partial' | 'Unpaid' = balVal === 0 ? 'Paid' : paidVal > 0 ? 'Partial' : 'Unpaid';

    if (editingInvoiceId) {
      // Modify Existing Generated Sales Invoice
      const updatedInv = {
        invoiceNo: formData.invoiceNo,
        invoiceDate: new Date(formData.invoiceDate).toISOString(),
        customerId: formData.customerId || 'c-walkin',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerGst: formData.customerGst,
        customerAddress: formData.customerAddress,
        paymentTerms: formData.paymentTerms,
        paymentMethod: formData.paymentMethod,
        items: lineItems,
        subtotal: totalItemsSum,
        discount: computedOverallDiscount,
        discountType: formData.discountType,
        taxAmount: taxSum,
        shippingCharges: Number(formData.shippingCharges || 0),
        grandTotal: grandTotalCalc,
        paidAmount: paidVal,
        balanceDue: balVal,
        paymentStatus: payStatus,
        remarks: formData.remarks,
        showProductRemarksOnPrint: formData.showProductRemarksOnPrint,
        showRefurbishedBadgeOnPrint: formData.showRefurbishedBadgeOnPrint,
      };

      updateSalesInvoice(editingInvoiceId, updatedInv);
      pushSalesInvoiceToSupabase({ id: editingInvoiceId, ...updatedInv } as any).catch(() => {});

      alert(`Sales Invoice "${formData.invoiceNo}" modified and updated successfully!`);
    } else {
      // Add New Sales Invoice
      const newInv = {
        invoiceNo: formData.invoiceNo || `${saleRules?.salesInvoicePrefix || 'SAL-'}${1001 + salesInvoices.length}`,
        invoiceDate: new Date(formData.invoiceDate).toISOString(),
        customerId: formData.customerId || 'c-walkin',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerGst: formData.customerGst,
        customerAddress: formData.customerAddress,
        paymentTerms: formData.paymentTerms,
        paymentMethod: formData.paymentMethod,
        items: lineItems,
        subtotal: totalItemsSum,
        discount: computedOverallDiscount,
        discountType: formData.discountType,
        taxAmount: taxSum,
        shippingCharges: Number(formData.shippingCharges || 0),
        grandTotal: grandTotalCalc,
        paidAmount: paidVal,
        balanceDue: balVal,
        paymentStatus: payStatus,
        remarks: formData.remarks,
        showProductRemarksOnPrint: formData.showProductRemarksOnPrint,
        showRefurbishedBadgeOnPrint: formData.showRefurbishedBadgeOnPrint,
      };

      addSalesInvoice(newInv);
      pushSalesInvoiceToSupabase(newInv as any).catch(() => {});

      // Update Customer Outstanding Ledger Balance
      if (formData.customerId && balVal > 0) {
        const matchCust = customers.find((c) => c.id === formData.customerId);
        if (matchCust) {
          updateCustomer(matchCust.id, {
            outstandingBalance: (matchCust.outstandingBalance || 0) + balVal,
          });
        }
      }

      alert(`Commercial Sales Invoice "${formData.invoiceNo}" created successfully! Balance Due: ₹${balVal.toLocaleString()}`);
    }

    setIsNewInvoiceOpen(false);
  };

  // Record Payment Submit
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    const newPaid = Math.min(paymentModalInvoice.grandTotal, paymentModalInvoice.paidAmount + Number(paymentInput));
    const newBalance = Math.max(0, paymentModalInvoice.grandTotal - newPaid);
    const newStatus: 'Paid' | 'Partial' | 'Unpaid' = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

    updateSalesInvoice(paymentModalInvoice.id, {
      paidAmount: newPaid,
      balanceDue: newBalance,
      paymentStatus: newStatus,
    });
    pushSalesInvoiceToSupabase({
      ...paymentModalInvoice,
      paidAmount: newPaid,
      balanceDue: newBalance,
      paymentStatus: newStatus,
    } as any).catch(() => {});

    // Reduce Customer Outstanding Balance
    if (paymentModalInvoice.customerId) {
      const matchCust = customers.find((c) => c.id === paymentModalInvoice.customerId);
      if (matchCust) {
        updateCustomer(matchCust.id, {
          outstandingBalance: Math.max(0, (matchCust.outstandingBalance || 0) - Number(paymentInput)),
        });
      }
    }

    alert(`Payment receipt of ₹${Number(paymentInput).toLocaleString()} recorded for Invoice ${paymentModalInvoice.invoiceNo}.`);
    setPaymentModalInvoice(null);
  };

  // Execute Invoice Printing Document Generation
  const executeInvoicePrintDoc = (inv: SalesInvoiceItem, paper: 'A4' | 'A5' | 'THERMAL', copy: 'customer' | 'office' | 'both') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Dedicated A5 Compact Invoice Renderer (Fits 100% on 1 Single A5 Sheet)
    const renderA5SingleInvoiceCopy = (copyLabel: string) => {
      const upiVpa = companyDetails.merchantUpiId || 'support.time24x7-1@okhdfcbank';
      const upiPayee = companyDetails.companyLegalName || 'ACCNO SOLUTION';
      const payableAmount = inv.balanceDue > 0 ? inv.balanceDue : inv.grandTotal;
      const upiString = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}&am=${payableAmount}&cu=INR&tn=Invoice_${inv.invoiceNo}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&margin=1&data=${encodeURIComponent(upiString)}`;
      const isInterState = inv.customerGst && companyDetails.gstin && inv.customerGst.substring(0, 2) !== companyDetails.gstin.substring(0, 2);

      return `
        <div style="min-height: 95vh; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 9.5px; color: #0f172a; box-sizing: border-box; line-height: 1.25;">
          <div>
            <!-- HEADER BAR (A5 COMPACT) -->
            <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 8px;">
              <tr>
                <td style="vertical-align: top; width: 60%;">
                  <div style="display: flex; align-items: center;">
                    ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" alt="Logo" style="max-height: 38px; max-width: 85px; object-fit: contain; margin-right: 10px; vertical-align: top;" />` : ''}
                    <div>
                      <div style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: -0.3px; line-height: 1.1; margin-bottom: 2px;">${companyDetails.companyLegalName}</div>
                      <div style="font-size: 8.5px; color: #0f172a; font-weight: 600;">${companyDetails.addressLine1}</div>
                      <div style="font-size: 8.5px; color: #0f172a; font-weight: 600;">${companyDetails.city}, ${companyDetails.state}${companyDetails.stateCode ? ` - ${companyDetails.stateCode}` : ''}</div>
                      <div style="font-size: 8.5px; color: #0f172a; margin-top: 1px; font-weight: 600;"><strong>GSTIN:</strong> ${companyDetails.gstin} | <strong>Ph:</strong> ${companyDetails.phoneNumber}</div>
                      <div style="font-size: 8.5px; color: #0f172a; font-weight: 600;"><strong>Email:</strong> ${companyDetails.email}</div>
                    </div>
                  </div>
                </td>
                <td style="vertical-align: top; text-align: right; width: 40%;">
                  <div style="font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">GST INVOICE</div>
                  <div style="font-size: 7.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; white-space: nowrap; margin-top: 1px; text-align: right;">[ ${copyLabel} ]</div>
                  <div style="font-size: 9px; margin-top: 4px; color: #0f172a;"><strong>Inv No:</strong> <span style="font-family: monospace; font-size: 10.5px; font-weight: 800;">${inv.invoiceNo}</span></div>
                  <div style="font-size: 9px; color: #0f172a;"><strong>Date:</strong> ${new Date(inv.invoiceDate).toLocaleDateString()}</div>
                  <div style="font-size: 9px; color: #0f172a;"><strong>Terms:</strong> ${inv.paymentTerms}</div>
                </td>
              </tr>
            </table>

            <!-- CUSTOMER DETAILS (A5 COMPACT) -->
            <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; margin-bottom: 8px; font-size: 9px; color: #0f172a;">
              <tr>
                <td style="padding: 6px 8px; width: 50%; border-right: 1px solid #cbd5e1; vertical-align: top;">
                  <div style="font-size: 8px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 2px;">BILLED &amp; SHIPPED TO</div>
                  <div style="font-size: 11px; font-weight: 900; color: #0f172a;">${inv.customerName}</div>
                  <div style="font-weight: 600;"><strong>Ph:</strong> ${inv.customerPhone || 'N/A'} | <strong>GSTIN:</strong> ${inv.customerGst || 'B2C / URP'}</div>
                  <div style="font-weight: 600;"><strong>Addr:</strong> ${inv.customerAddress || 'Local Address'}</div>
                </td>
                <td style="padding: 6px 8px; width: 50%; vertical-align: top;">
                  <div style="font-size: 8px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 2px;">DISPATCH DETAILS</div>
                  <div style="font-weight: 600;"><strong>Supply:</strong> ${isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</div>
                  <div style="font-weight: 600;"><strong>Transport:</strong> Hand Delivery / Direct</div>
                  <div style="font-weight: 600;"><strong>Status:</strong> <span style="font-weight: 900; color: ${inv.paymentStatus === 'Paid' ? '#16a34a' : inv.paymentStatus === 'Partial' ? '#d97706' : '#dc2626'}">${inv.paymentStatus.toUpperCase()}</span> (${inv.paymentMethod})</div>
                </td>
              </tr>
            </table>

            <!-- LINE ITEMS TABLE (A5 COMPACT) -->
            <div style="border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 9px; color: #0f172a;">
                <thead>
                  <tr style="background: #000000 !important; color: #ffffff !important; text-transform: uppercase; font-size: 8.5px; line-height: 1; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <th style="padding: 4px; border-right: 1px solid #334155; width: 20px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">S.N.</th>
                    <th style="padding: 4px 6px; border-right: 1px solid #334155; width: 56%; text-align: left; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">PRODUCT DESCRIPTION</th>
                    <th style="padding: 4px; border-right: 1px solid #334155; width: 48px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">HSN/SAC</th>
                    <th style="padding: 4px; border-right: 1px solid #334155; width: 24px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">QTY</th>
                    <th style="padding: 4px; border-right: 1px solid #334155; width: 58px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">RATE (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                    <th style="padding: 4px; border-right: 1px solid #334155; width: 36px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">GST %</th>
                    <th style="padding: 4px; width: 68px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">TOTAL (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                  </tr>
                </thead>
                <tbody>
                  ${inv.items.map((line, idx) => {
                    const isRefurbished = line.productCondition === 'Refurbished' || line.refurbishedDescription;
                    const isCompact = inv.items.length >= 8;
                    const padding = isCompact ? '2.5px 3px' : '4px 6px';
                    const fontSz = isCompact ? '8.5px' : '9.5px';
                    return `
                      <tr style="${idx % 2 === 1 ? 'background: #f8fafc;' : ''}">
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${idx + 1}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">
                          <strong style="font-size: ${fontSz}; color: #0f172a;">${line.name}</strong>
                          ${(inv.showProductRemarksOnPrint !== false && line.remarks) ? `<div style="font-size: 7.5px; color: #64748b; font-weight: 500; white-space: pre-line;">${line.remarks.replace(/\n/g, '<br/>')}</div>` : ''}
                          ${(inv.showRefurbishedBadgeOnPrint !== false && isRefurbished) ? `<div style="font-size: 7.5px; color: #d97706; font-weight: bold;">★ Refurbished</div>` : ''}
                        </td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.hsnCode || '84713010'}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: bold;">${line.quantity}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: 600;">₹${line.unitPrice.toLocaleString()}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.gstRate}%</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: bold;">₹${line.totalPrice.toLocaleString()}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- FINANCIAL TOTALS & BANK QR (A5 COMPACT) -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; color: #0f172a;">
              <tr>
                <td style="width: 55%; vertical-align: top; padding-right: 10px; height: 1px;">
                  <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;">
                    <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; background: #f8fafc; font-size: 8.5px; display: flex; align-items: center; justify-content: space-between; flex-grow: 1; margin-bottom: 4px;">
                      <div style="font-weight: 600;">
                        <strong style="text-transform: uppercase; color: #0f172a; font-size: 9px;">Bank Account &amp; NEFT Details:</strong><br/>
                        <strong>Bank:</strong> ${companyDetails.bankDetails.bankName}<br/>
                        <strong>A/C No:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.accountNumber}</span><br/>
                        <strong>IFSC:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.ifscCode}</span> | <strong>Branch:</strong> ${companyDetails.bankDetails.branchName}<br/>
                        ${companyDetails.merchantUpiId ? `<strong>UPI:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.merchantUpiId}</span>` : ''}
                      </div>
                      <div style="text-align: center; margin-left: 6px; flex-shrink: 0;">
                        <img src="${qrCodeUrl}" alt="UPI Payment QR" style="width: 52px; height: 52px; border-radius: 4px; border: 1px solid #cbd5e1; padding: 1px; background: #ffffff;" />
                        <div style="font-size: 7px; font-weight: 800; color: #1e40af; text-transform: uppercase;">SCAN &amp; PAY</div>
                      </div>
                    </div>

                    <div style="padding: 4px 6px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 8px; color: #0f172a; font-weight: 600;">
                      <strong>Remarks / Terms:</strong> ${inv.remarks ? inv.remarks.replace(/\n/g, '<br/>') : `${inv.paymentTerms || 'Standard Credit Terms'} • GST Tax Invoice`}
                    </div>
                  </div>
                </td>

                <td style="width: 45%; vertical-align: top; height: 1px;">
                  <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; background: #f8fafc; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 9px; color: #0f172a;">
                      <tr>
                        <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">Taxable Subtotal:</td>
                        <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: bold;">₹${inv.subtotal.toLocaleString()}</td>
                      </tr>
                      ${isInterState ? `
                        <tr>
                          <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">IGST Tax:</td>
                          <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${inv.taxAmount.toLocaleString()}</td>
                        </tr>
                      ` : `
                        <tr>
                          <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">CGST (9%):</td>
                          <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${(inv.taxAmount / 2).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">SGST (9%):</td>
                          <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${(inv.taxAmount / 2).toLocaleString()}</td>
                        </tr>
                      `}
                      ${inv.shippingCharges ? `
                        <tr>
                          <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">Shipping:</td>
                          <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${inv.shippingCharges.toLocaleString()}</td>
                        </tr>
                      ` : ''}
                      ${inv.discount ? `
                        <tr>
                          <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">Discount:</td>
                          <td style="padding: 2px 0; text-align: right; font-family: monospace; color: #dc2626; font-weight: 600;">-₹${inv.discount.toLocaleString()}</td>
                        </tr>
                      ` : ''}
                      <tr style="border-top: 1.5px solid #0f172a; border-bottom: 1.5px solid #0f172a; font-weight: 900; font-size: 11.5px;">
                        <td style="padding: 4px 0; color: #0f172a;">GRAND TOTAL:</td>
                        <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #16a34a;">₹${inv.grandTotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0; color: #0f172a; font-weight: 600;">Paid:</td>
                        <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: bold; color: #16a34a;">₹${inv.paidAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0; font-weight: bold; color: #dc2626;">DUE:</td>
                        <td style="padding: 2px 0; text-align: right; font-family: monospace; font-weight: 900; color: #dc2626;">₹${inv.balanceDue.toLocaleString()}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- FOOTER & SIGNATORY (A5 COMPACT AT BOTTOM) -->
          <table style="width: 100%; border-collapse: collapse; margin-top: auto; border-top: 1px solid #cbd5e1; padding-top: 6px; font-size: 8.5px; color: #0f172a;">
            <tr>
              <td style="width: 65%; vertical-align: top; color: #0f172a; line-height: 1.25; font-weight: 600;">
                <strong style="text-transform: uppercase; color: #0f172a; font-size: 9px; display: block; margin-bottom: 1px;">Terms &amp; Conditions:</strong>
                1. Goods once sold will not be taken back without original tax invoice.<br/>
                2. Hardware carries manufacturer warranty as per OEM policies.<br/>
                3. Physical, liquid, or burnt damage strictly voids warranty.<br/>
                4. Verify items &amp; serial numbers upon receipt.<br/>
                5. Subject to Sanchore Jurisdiction only.<br/>
                6. Payment due as per credit terms.
              </td>
              <td style="width: 35%; text-align: right; vertical-align: bottom;">
                <div style="font-size: 9px; font-weight: 800; color: #0f172a;">For <strong>${companyDetails.companyLegalName}</strong></div>
                <div style="height: 25px;"></div>
                <div style="border-top: 1px solid #0f172a; display: inline-block; padding-top: 2px; font-weight: bold; font-size: 8.5px; color: #0f172a;">AUTH. SIGNATORY</div>
              </td>
            </tr>
          </table>
        </div>
      `;
    };

    // Standard A4 Single Invoice Renderer (Unchanged)
    const renderSingleInvoiceCopy = (copyLabel: string) => {
      const upiVpa = companyDetails.merchantUpiId || 'support.time24x7-1@okhdfcbank';
      const upiPayee = companyDetails.companyLegalName || 'ACCNO SOLUTION';
      const payableAmount = inv.balanceDue > 0 ? inv.balanceDue : inv.grandTotal;
      const upiString = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}&am=${payableAmount}&cu=INR&tn=Invoice_${inv.invoiceNo}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${encodeURIComponent(upiString)}`;
      const isInterState = inv.customerGst && companyDetails.gstin && inv.customerGst.substring(0, 2) !== companyDetails.gstin.substring(0, 2);

      if (paper === 'THERMAL') {
        return `
          <div style="width: 280px; padding: 10px; font-family: monospace; font-size: 11px; line-height: 1.3;">
            <div style="text-align: center; font-weight: bold; font-size: 14px;">${companyDetails.companyLegalName}</div>
            <div style="text-align: center; font-size: 10px;">${companyDetails.addressLine1}, ${companyDetails.city}</div>
            <div style="text-align: center; font-size: 10px;">GSTIN: ${companyDetails.gstin} | Ph: ${companyDetails.phoneNumber}</div>
            <hr style="border-top: 1px dashed #000; margin: 8px 0;"/>
            <div style="text-align: center; font-weight: bold;">SALES TAX RECEIPT (${copyLabel})</div>
            <div>Bill #: <strong>${inv.invoiceNo}</strong></div>
            <div>Date: ${new Date(inv.invoiceDate).toLocaleString()}</div>
            <div>Customer: ${inv.customerName} (${inv.customerPhone || 'N/A'})</div>
            <hr style="border-top: 1px dashed #000; margin: 8px 0;"/>
            ${inv.items.map((item, idx) => `
              <div style="margin-bottom: 4px;">
                <div>${idx + 1}. ${item.name}</div>
                <div style="display: flex; justify-content: space-between;">
                  <span>${item.quantity} x ₹${item.unitPrice} (GST ${item.gstRate}%)</span>
                  <span>₹${item.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            `).join('')}
            <hr style="border-top: 1px dashed #000; margin: 8px 0;"/>
            <div style="display: flex; justify-content: space-between;"><span>Taxable Subtotal:</span><span>₹${inv.subtotal.toLocaleString()}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>GST Tax Amount:</span><span>₹${inv.taxAmount.toLocaleString()}</span></div>
            ${inv.shippingCharges ? `<div style="display: flex; justify-content: space-between;"><span>Freight/Shipping:</span><span>₹${inv.shippingCharges.toLocaleString()}</span></div>` : ''}
            ${inv.discount ? `<div style="display: flex; justify-content: space-between;"><span>Discount:</span><span>-₹${inv.discount.toLocaleString()}</span></div>` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; margin-top: 4px;"><span>GRAND TOTAL:</span><span>₹${inv.grandTotal.toLocaleString()}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Paid Amount:</span><span>₹${inv.paidAmount.toLocaleString()}</span></div>
            <div style="display: flex; justify-content: space-between; font-weight: bold;"><span>Balance Due:</span><span>₹${inv.balanceDue.toLocaleString()}</span></div>
            <hr style="border-top: 1px dashed #000; margin: 8px 0;"/>
            <div style="text-align: center; font-size: 10px;">Thank you for shopping with us!</div>
          </div>
        `;
      }

      return `
        <div style="min-height: 94vh; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #0f172a; box-sizing: border-box;">
          <div>
            <!-- HEADER BAR -->
            <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px;">
              <tr>
                <td style="vertical-align: top; width: 58%;">
                  <div style="display: flex; align-items: center;">
                    ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" alt="Logo" style="max-height: 52px; max-width: 110px; object-fit: contain; margin-right: 14px; vertical-align: top;" />` : ''}
                    <div>
                      <div style="font-size: 24px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 3px;">${companyDetails.companyLegalName}</div>
                      <!-- EXACT 2-LINE ADDRESS -->
                      <div style="font-size: 10px; color: #0f172a; font-weight: 600; line-height: 1.3;">${companyDetails.addressLine1}</div>
                      <div style="font-size: 10px; color: #0f172a; font-weight: 600; line-height: 1.3;">${companyDetails.city}, ${companyDetails.state}${companyDetails.stateCode ? ` - ${companyDetails.stateCode}` : ''}</div>
                      <!-- GSTIN LINE -->
                      <div style="font-size: 10px; color: #0f172a; margin-top: 2px; font-weight: 600;"><strong>GSTIN:</strong> ${companyDetails.gstin}</div>
                      <!-- SINGLE LINE PHONE & EMAIL -->
                      <div style="font-size: 10px; color: #0f172a; white-space: nowrap; font-weight: 600;"><strong>Ph:</strong> ${companyDetails.phoneNumber} | <strong>Email:</strong> ${companyDetails.email}</div>
                    </div>
                  </div>
                </td>
                <td style="vertical-align: top; text-align: right; width: 42%;">
                  <div style="font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">GST INVOICE</div>
                  <div style="font-size: 8px; font-weight: 800; color: #0f172a; text-transform: uppercase; white-space: nowrap; margin-top: 2px; text-align: right;">[ ${copyLabel} ]</div>
                  <div style="font-size: 11px; margin-top: 6px; color: #0f172a;"><strong>Invoice No:</strong> <span style="font-family: monospace; font-size: 12px; font-weight: 800;">${inv.invoiceNo}</span></div>
                  <div style="font-size: 11px; color: #0f172a;"><strong>Invoice Date:</strong> ${new Date(inv.invoiceDate).toLocaleDateString()}</div>
                  <div style="font-size: 11px; color: #0f172a;"><strong>Payment Terms:</strong> ${inv.paymentTerms}</div>
                </td>
              </tr>
            </table>

            <!-- CUSTOMER DETAILS (ROUNDED BOX) -->
            <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; margin-bottom: 12px; font-size: 11px; color: #0f172a;">
              <tr>
                <td style="padding: 10px 12px; width: 50%; border-right: 1px solid #cbd5e1; vertical-align: top;">
                  <div style="font-size: 10px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">BILLED &amp; SHIPPED TO</div>
                  <div style="font-size: 13px; font-weight: 900; color: #0f172a;">${inv.customerName}</div>
                  <div style="font-weight: 600;"><strong>Phone:</strong> ${inv.customerPhone || 'N/A'}</div>
                  <div style="font-weight: 600;"><strong>Address:</strong> ${inv.customerAddress || 'Local Customer Address'}</div>
                  <div style="font-weight: 600;"><strong>GSTIN:</strong> ${inv.customerGst || 'UNREGISTERED / B2C'}</div>
                </td>
                <td style="padding: 10px 12px; width: 50%; vertical-align: top;">
                  <div style="font-size: 10px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">DISPATCH &amp; REASON OF SUPPLY</div>
                  <div style="font-weight: 600;"><strong>Place of Supply:</strong> ${isInterState ? 'Inter-State (IGST Applicable)' : 'Intra-State (CGST + SGST)'}</div>
                  <div style="font-weight: 600;"><strong>Mode of Transport:</strong> Hand Delivery / Direct Dispatch</div>
                  <div style="font-weight: 600;"><strong>Payment Status:</strong> <span style="font-weight: 900; color: ${inv.paymentStatus === 'Paid' ? '#16a34a' : inv.paymentStatus === 'Partial' ? '#d97706' : '#dc2626'}">${inv.paymentStatus.toUpperCase()}</span></div>
                  <div style="font-weight: 600;"><strong>Payment Method:</strong> ${inv.paymentMethod}</div>
                </td>
              </tr>
            </table>

            <!-- LINE ITEMS TABLE (PRODUCT DESCRIPTION HEADER) -->
            <div style="border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; margin-bottom: 12px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11px; color: #0f172a;">
                <thead>
                  <tr style="background: #000000 !important; color: #ffffff !important; text-transform: uppercase; font-size: 9px; line-height: 1.2; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 25px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">S.N.</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 58%; text-align: left; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">PRODUCT DESCRIPTION</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 55px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">HSN/SAC</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 28px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">QTY</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 72px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">UNIT RATE (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 40px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">GST %</th>
                    <th style="padding: 5px 6px; width: 82px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">TOTAL AMOUNT (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                  </tr>
                </thead>
                <tbody>
                  ${inv.items.map((line, idx) => {
                    const isRefurbished = line.productCondition === 'Refurbished' || line.refurbishedDescription;
                    const isCompact = inv.items.length >= 10;
                    const padding = isCompact ? '4px 6px' : '8px';
                    const fontSz = isCompact ? '10.5px' : '12px';
                    return `
                      <tr style="${idx % 2 === 1 ? 'background: #f8fafc;' : ''}">
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${idx + 1}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">
                          <strong style="font-size: ${fontSz}; color: #0f172a;">${line.name}</strong>
                          ${(inv.showProductRemarksOnPrint !== false && line.remarks) ? `<div style="font-size: 9px; color: #64748b; font-weight: 500; margin-top: 1px; white-space: pre-line;">${line.remarks.replace(/\n/g, '<br/>')}</div>` : ''}
                          ${(inv.showRefurbishedBadgeOnPrint !== false && isRefurbished) ? `
                            <div style="margin-top: 2px; padding: 3px 5px; background: #fffbeb; border-left: 3px solid #d97706; border-radius: 4px; font-size: 9px; color: #78350f;">
                              <strong>★ Certified Refurbished Item:</strong> ${(line.refurbishedDescription || 'Tested and Certified Working').replace(/\n/g, '<br/>')}
                            </div>
                          ` : ''}
                        </td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.hsnCode || '84713010'}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: bold;">${line.quantity}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: 600;">₹${line.unitPrice.toLocaleString()}</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.gstRate}%</td>
                        <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: bold;">₹${line.totalPrice.toLocaleString()}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- FINANCIAL TOTALS & TAX BREAKDOWN WITH FUNCTIONAL UPI QR CODE -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; color: #0f172a;">
              <tr>
                <td style="width: 55%; vertical-align: top; padding-right: 15px; height: 1px;">
                  <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;">
                    <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; background: #f8fafc; font-size: 10px; display: flex; align-items: center; justify-content: space-between; flex-grow: 1; margin-bottom: 8px;">
                      <div style="font-weight: 600;">
                        <strong style="text-transform: uppercase; color: #0f172a; font-size: 11px;">Bank Account &amp; NEFT Details:</strong><br/>
                        <strong>Bank Name:</strong> ${companyDetails.bankDetails.bankName}<br/>
                        <strong>Account Name:</strong> ${companyDetails.bankDetails.accountHolderName}<br/>
                        <strong>A/C No:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.accountNumber}</span><br/>
                        <strong>IFSC Code:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.ifscCode}</span> | <strong>Branch:</strong> ${companyDetails.bankDetails.branchName}<br/>
                        ${companyDetails.merchantUpiId ? `<strong>UPI VPA:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.merchantUpiId}</span>` : ''}
                      </div>
                      <div style="text-align: center; margin-left: 10px; flex-shrink: 0;">
                        <img src="${qrCodeUrl}" alt="UPI Payment QR" style="width: 78px; height: 78px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 2px; background: #ffffff;" />
                        <div style="font-size: 7.5px; font-weight: 800; color: #1e40af; margin-top: 2px; text-transform: uppercase;">SCAN &amp; PAY UPI</div>
                      </div>
                    </div>

                    <div style="padding: 8px 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 10px; color: #0f172a; font-weight: 600;">
                      <strong>Remarks / Terms:</strong> ${inv.remarks ? inv.remarks.replace(/\n/g, '<br/>') : `${inv.paymentTerms || 'Standard Credit Terms'} • GST Tax Invoice`}
                    </div>
                  </div>
                </td>

                <td style="width: 45%; vertical-align: top; height: 1px;">
                  <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; background: #f8fafc; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px; color: #0f172a;">
                      <tr>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Taxable Line Items Subtotal:</td>
                        <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: bold;">₹${inv.subtotal.toLocaleString()}</td>
                      </tr>
                      ${isInterState ? `
                        <tr>
                          <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Integrated GST (IGST Rate):</td>
                          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${inv.taxAmount.toLocaleString()}</td>
                        </tr>
                      ` : `
                        <tr>
                          <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Central GST (CGST 9% Avg):</td>
                          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${(inv.taxAmount / 2).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">State GST (SGST 9% Avg):</td>
                          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${(inv.taxAmount / 2).toLocaleString()}</td>
                        </tr>
                      `}
                      ${inv.shippingCharges ? `
                        <tr>
                          <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Freight / Shipping Charges:</td>
                          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 600;">+₹${inv.shippingCharges.toLocaleString()}</td>
                        </tr>
                      ` : ''}
                      ${inv.discount ? `
                        <tr>
                          <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Overall Discount Adjustment:</td>
                          <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #dc2626; font-weight: 600;">-₹${inv.discount.toLocaleString()}</td>
                        </tr>
                      ` : ''}
                      <tr style="border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; font-weight: 900; font-size: 14px;">
                        <td style="padding: 8px 0; color: #0f172a;">INVOICE GRAND TOTAL:</td>
                        <td style="padding: 8px 0; text-align: right; font-family: monospace; color: #16a34a;">₹${inv.grandTotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Amount Paid / Collected:</td>
                        <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: bold; color: #16a34a;">₹${inv.paidAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-weight: bold; color: #dc2626;">BALANCE DUE:</td>
                        <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 900; color: #dc2626;">₹${inv.balanceDue.toLocaleString()}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- FOOTER & SIGNATORY AT ABSOLUTE BOTTOM (FORMATTED INTO EXACT 6 LINES) -->
          <table style="width: 100%; border-collapse: collapse; margin-top: auto; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 10px; color: #0f172a;">
            <tr>
              <td style="width: 60%; vertical-align: top; color: #0f172a; font-weight: 600; line-height: 1.3;">
                <strong style="text-transform: uppercase; color: #0f172a; font-size: 10.5px; display: block; margin-bottom: 3px;">Terms &amp; Conditions:</strong>
                ${(saleRules?.termsAndConditions && saleRules.termsAndConditions.length > 0)
                  ? saleRules.termsAndConditions.map((t, i) => `${t.replace(/^\d+\.\s*/, `${i + 1}. `)}`).join('<br/>')
                  : `1. Goods once sold will not be taken back without original tax invoice.<br/>
                2. Hardware items carry manufacturer warranty as per OEM policies.<br/>
                3. Physical, liquid, or burnt damage strictly voids warranty.<br/>
                4. Customers are requested to verify items &amp; serial numbers upon receipt.<br/>
                5. Subject to Sanchore Jurisdiction only.<br/>
                6. Payment due as per agreed billing credit terms.`
                }
              </td>
              <td style="width: 40%; text-align: right; vertical-align: bottom;">
                <div style="font-size: 11px; font-weight: 800; color: #0f172a;">For <strong>${companyDetails.companyLegalName}</strong></div>
                <div style="height: 45px;"></div>
                <div style="border-top: 1.5px solid #0f172a; display: inline-block; padding-top: 4px; font-weight: bold; font-size: 10px; color: #0f172a;">AUTHORIZED SIGNATORY</div>
              </td>
            </tr>
          </table>
        </div>
      `;
    };

    const getInvoiceCopyMarkup = (label: string) => {
      return paper === 'A5' ? renderA5SingleInvoiceCopy(label) : renderSingleInvoiceCopy(label);
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>TAX INVOICE - ${inv.invoiceNo}</title>
          <style>
            @font-face {
              font-family: 'RupeeSystemFallback';
              src: local('Segoe UI'), local('Arial'), local('Roboto');
              unicode-range: U+20B9;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body, table, th, td, div, span, p {
              font-family: 'RupeeSystemFallback', 'Segoe UI', Arial, sans-serif !important;
            }
            thead tr {
              background-color: #000000 !important;
              background: #000000 !important;
              color: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            th {
              background-color: #000000 !important;
              background: #000000 !important;
              color: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .rupee-symbol {
              font-family: 'Segoe UI', Arial, sans-serif !important;
              text-transform: none !important;
              display: inline-block;
              color: #ffffff !important;
            }
            @page { size: ${paper === 'A5' ? 'A5 portrait' : 'A4 portrait'}; margin: ${paper === 'A5' ? '5mm' : '10mm'}; }
            body { margin: 0; padding: 0; background: #fff; }
            .page-break { page-break-after: always; }
            @media print {
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${copy === 'both' ? `
            ${getInvoiceCopyMarkup('ORIGINAL FOR RECIPIENT (CUSTOMER COPY)')}
            <div class="page-break"></div>
            ${getInvoiceCopyMarkup('DUPLICATE FOR SUPPLIER (OFFICE COPY)')}
          ` : `
            ${getInvoiceCopyMarkup(copy === 'customer' ? 'ORIGINAL FOR RECIPIENT (CUSTOMER COPY)' : 'DUPLICATE FOR SUPPLIER (OFFICE COPY)')}
          `}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Filter Sales Invoices with Date Search & Date Range Filtering (Memoized)
  const filteredInvoices = useMemo(() => {
    const q = search.toLowerCase().trim();
    return salesInvoices.filter((inv) => {
      const invDateObj = new Date(inv.invoiceDate);
      const invDateIso = inv.invoiceDate ? inv.invoiceDate.split('T')[0] : '';
      const invDateFormatted1 = invDateObj.toLocaleDateString();
      const invDateFormatted2 = invDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const invDateFormatted3 = invDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();

      const matchesSearch =
        !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.customerPhone && inv.customerPhone.includes(q)) ||
        (inv.customerGst && inv.customerGst.toLowerCase().includes(q)) ||
        invDateIso.includes(q) ||
        invDateFormatted1.toLowerCase().includes(q) ||
        invDateFormatted2.toLowerCase().includes(q) ||
        invDateFormatted3.includes(q);

      const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus.toUpperCase() === statusFilter;

      // Date Range Filtering
      let matchesDateRange = true;
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (invDateObj < start) matchesDateRange = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (invDateObj > end) matchesDateRange = false;
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [salesInvoices, search, statusFilter, startDate, endDate]);

  // Filter Customers for Autocomplete
  // Filter Customers for Autocomplete (Only when query is provided)
  const matchingCustomers = useMemo(() => {
    const q = custSearchQuery.toLowerCase().trim();
    if (!q) return [];
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.mobile && c.mobile.includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.gstin && c.gstin.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q))
    );
  }, [customers, custSearchQuery]);

  // Filter Inventory Products for Barcode & Search Autocomplete (Only when query is provided)
  const matchingProducts = useMemo(() => {
    const q = productSearchQuery.toLowerCase().trim();
    if (!q) return [];
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q)) ||
        (item.hsnCode && item.hsnCode.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [inventory, productSearchQuery]);

  // Calculate Metrics (Memoized)
  const totalSalesVal = useMemo(() => salesInvoices.reduce((a, b) => a + b.grandTotal, 0), [salesInvoices]);
  const totalPaidVal = useMemo(() => salesInvoices.reduce((a, b) => a + b.paidAmount, 0), [salesInvoices]);
  const totalBalanceVal = useMemo(() => salesInvoices.reduce((a, b) => a + b.balanceDue, 0), [salesInvoices]);
  const totalGstVal = useMemo(() => salesInvoices.reduce((a, b) => a + b.taxAmount, 0), [salesInvoices]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070B0E] text-white p-6 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-[#5ED29C] text-sm font-bold">
          <span className="w-3 h-3 rounded-full bg-[#5ED29C] animate-ping" />
          Loading Commercial Sales Directory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#5ED29C]/20 border border-[#5ED29C]/30 text-[#5ED29C] text-[10px] font-extrabold uppercase tracking-wider">
              B2B &amp; B2C Commercial Sales Ledger
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wide mt-1 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-[#5ED29C]" />
            SALES INVOICES &amp; BILLING DIRECTORY
          </h1>
          <p className="text-xs text-white/50">
            Issue commercial GST tax invoices, search customers &amp; barcode parts, modify generated bills, and print invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncStatusMsg && (
            <span className="text-[11px] text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1.5 rounded-lg animate-fade-in font-medium">
              {syncStatusMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncingCloud}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            title="Force refresh data directly from Supabase Cloud Database"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#5ED29C] ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{isSyncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            onClick={openCreateInvoiceModal}
            className="px-6 py-3 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> + Create New Sales Invoice
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Sales Revenue</span>
          <div className="text-xl font-extrabold text-[#5ED29C] font-mono">₹{totalSalesVal.toLocaleString()}</div>
          <p className="text-[10px] text-white/40">{salesInvoices.length} Issued Commercial Invoices</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Collections Paid</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">₹{totalPaidVal.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-400/70">Received Cash, UPI &amp; Bank Transfers</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Outstanding Receivables</span>
          <div className="text-xl font-extrabold text-amber-400 font-mono">₹{totalBalanceVal.toLocaleString()}</div>
          <p className="text-[10px] text-amber-400/70">Pending Customer Debt Balances</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">GST Tax Collected</span>
          <div className="text-xl font-extrabold text-blue-400 font-mono">₹{totalGstVal.toLocaleString()}</div>
          <p className="text-[10px] text-blue-400/70">Total Output CGST / SGST / IGST</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR WITH DATE SEARCH & DATE RANGE PICKER */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Main Search Input (Supports Invoice #, Customer Name, Phone, GSTIN, and Date strings e.g. 18/8/2026, 2026-08-18) */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="🔍 Search invoice number, customer name, phone, GSTIN, or date (e.g. 18/8/2026, Aug 2026)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#5ED29C]"
            />
          </div>

          {/* Payment Status Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'PAID', 'PARTIAL', 'UNPAID'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase transition-all whitespace-nowrap border ${
                  statusFilter === st
                    ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* DATE SEARCH & RANGE FILTER BAR */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#5ED29C] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Dates' },
              { id: 'TODAY', label: 'Today' },
              { id: 'YESTERDAY', label: 'Yesterday' },
              { id: 'THIS_WEEK', label: 'This Week' },
              { id: 'THIS_MONTH', label: 'This Month' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyDatePreset(p.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  datePreset === p.id && !startDate && !endDate
                    ? 'bg-[#5ED29C] text-black border-[#5ED29C] font-extrabold'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Start Date Picker */}
            <div className="flex items-center gap-1.5 bg-[#0D1117] border border-white/10 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-[10px] text-white/40 font-semibold uppercase">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
                className="bg-transparent text-white text-xs focus:outline-none font-mono cursor-pointer [color-scheme:dark]"
              />
            </div>

            {/* End Date Picker */}
            <div className="flex items-center gap-1.5 bg-[#0D1117] border border-white/10 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-[10px] text-white/40 font-semibold uppercase">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
                className="bg-transparent text-white text-xs focus:outline-none font-mono cursor-pointer [color-scheme:dark]"
              />
            </div>

            {(startDate || endDate || search || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  applyDatePreset('ALL');
                }}
                className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-[10px] font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SALES INVOICES DATA TABLE */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/50 text-[10px] uppercase font-black border-b border-white/10">
                <th className="p-4">Invoice # &amp; Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Payment Terms</th>
                <th className="p-4 text-right">Taxable Subtotal</th>
                <th className="p-4 text-right">Grand Total (₹)</th>
                <th className="p-4 text-right">Paid Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-white/40 font-sans">
                    No commercial sales invoices found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <div className="font-bold text-[#5ED29C]">{inv.invoiceNo}</div>
                      <div className="text-[10px] text-white/40 font-sans">{new Date(inv.invoiceDate).toLocaleDateString()}</div>
                    </td>

                    <td className="p-4 font-sans">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {inv.customerName}
                        {inv.customerGst && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            B2B GST
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50 font-mono">{inv.customerPhone || 'No Phone'}</div>
                    </td>

                    <td className="p-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70">
                        {inv.paymentTerms}
                      </span>
                    </td>

                    <td className="p-4 text-right font-bold text-white/70">₹{inv.subtotal.toLocaleString()}</td>
                    <td className="p-4 text-right font-black text-[#5ED29C] text-sm">₹{inv.grandTotal.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-emerald-400">₹{inv.paidAmount.toLocaleString()}</td>

                    <td className="p-4 text-center font-sans">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : inv.paymentStatus === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Modify / Edit Invoice Button */}
                        <button
                          onClick={() => openEditModalForInvoice(inv)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/30 cursor-pointer"
                          title="Modify / Edit Generated Sales Invoice"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setActiveInvoiceView(inv)}
                          className="p-1.5 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/10 cursor-pointer"
                          title="View Full Invoice Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPaymentInput(inv.balanceDue);
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
                            title="Record Customer Payment Receipt"
                          >
                            + Record Pay
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setPrintTargetInvoice(inv);
                            if (saleRules?.defaultPrintPaperFormat) setPrintPaperFormat(saleRules.defaultPrintPaperFormat);
                            if (saleRules?.defaultPrintCopyMode) setPrintCopyType(saleRules.defaultPrintCopyMode);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30 cursor-pointer"
                          title="Print Tax Invoice (A4 / A5 / POS)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete Sales Invoice "${inv.invoiceNo}"?`)) {
                              deleteSalesInvoice(inv.id);
                              deleteSalesInvoiceFromSupabase(inv.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30 cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / MODIFY SALES TAX INVOICE */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#5ED29C]/40 w-full max-w-[1320px] max-h-[92vh] overflow-y-auto space-y-6 bg-[#0D1117] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-extrabold uppercase text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#5ED29C]" />
                  {editingInvoiceId ? `MODIFY SALES TAX INVOICE (${formData.invoiceNo})` : 'CREATE COMMERCIAL SALES TAX INVOICE'}
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  {editingInvoiceId ? 'Update invoice line items, tax details, and payment settlement' : 'Issue B2B or B2C tax invoice with HSN line breakdown & automatic tax computation'}
                </p>
              </div>
              <button onClick={() => setIsNewInvoiceOpen(false)} className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-6 text-xs">
              
              {/* PRIMARY INVOICE IDENTIFIERS */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-[#5ED29C] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Invoice Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Payment Terms *</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-bold"
                  >
                    <option value="Cash / Immediate">Cash / Immediate</option>
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 60 Days">Credit 60 Days</option>
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">GST Supply Type</label>
                  <select
                    value={formData.supplyType}
                    onChange={(e) => setFormData({ ...formData, supplyType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-[#16FFC6] font-bold"
                  >
                    <option value="INTRA_STATE">Intra-State (CGST + SGST)</option>
                    <option value="INTER_STATE">Inter-State (IGST Out-of-State)</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER BILLING INFO WITH SEARCH AUTOCOMPLETE */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5ED29C]" /> Customer &amp; Billing Account Details
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuickCustModal(true)}
                    className="text-[10px] font-bold text-[#16FFC6] hover:underline uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Register New Customer
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Autocomplete Search Field */}
                  <div className="relative">
                    <label className="block text-white/70 mb-1 font-bold">Search Existing Customer Database *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={custSearchQuery}
                        onFocus={() => setShowCustDropdown(true)}
                        onChange={(e) => {
                          setCustSearchQuery(e.target.value);
                          setShowCustDropdown(true);
                        }}
                        placeholder="🔍 Type Name, Mobile Number or Code to Autocomplete..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161B22] border border-[#5ED29C]/40 text-white text-xs font-semibold placeholder:text-white/30 focus:outline-none focus:border-[#5ED29C]"
                      />
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                    </div>

                    {showCustDropdown && custSearchQuery.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-[#161B22] border border-[#5ED29C]/50 rounded-xl shadow-2xl divide-y divide-white/10">
                        {matchingCustomers.length === 0 ? (
                          <div className="p-3 text-center text-white/50 text-xs">No matching customers found</div>
                        ) : (
                          matchingCustomers.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => handleSelectCustomerItem(c)}
                              className="p-3 hover:bg-[#5ED29C]/15 cursor-pointer flex items-center justify-between transition-colors text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-white text-xs flex items-center gap-2">
                                  <span>{c.name}</span>
                                  <span className="text-[10px] text-[#5ED29C] bg-[#5ED29C]/10 px-1.5 py-0.5 rounded font-mono border border-[#5ED29C]/20">({c.mobile || c.phone || 'No Mobile'})</span>
                                </div>
                                <div className="text-[11px] text-slate-200 font-mono">
                                  {c.gstin ? <span className="text-emerald-300 font-bold">GSTIN: {c.gstin}</span> : <span>{c.billingAddress || 'Local Walk-In Customer'}</span>}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-black bg-[#5ED29C] hover:bg-[#4ec08a] px-3 py-1 rounded-lg transition-colors shadow-sm"
                              >
                                Select
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter customer name..."
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Phone Number *</label>
                    <input
                      type="text"
                      placeholder="Enter mobile number..."
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">GSTIN Number (Optional for B2C)</label>
                    <input
                      type="text"
                      value={formData.customerGst}
                      onChange={(e) => setFormData({ ...formData, customerGst: e.target.value })}
                      placeholder="e.g. 08AAAAA0000A1Z5"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Full Postal Address</label>
                    <input
                      type="text"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      placeholder="Full billing address..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRODUCT / ITEM SPECIFICATIONS */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#5ED29C]" /> Product / Item Specification Lines
                    </span>

                    {/* PRINT DISPLAY CONTROL TOGGLES */}
                    <div className="hidden sm:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                      <span className="text-[10px] font-extrabold text-[#5ED29C] uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Print Display:
                      </span>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-white/80 hover:text-white font-semibold text-[11px]">
                        <input
                          type="checkbox"
                          checked={formData.showProductRemarksOnPrint}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormData((prev) => ({ ...prev, showProductRemarksOnPrint: val }));
                            updateSaleRules({ showProductRemarksOnPrint: val });
                          }}
                          className="w-3.5 h-3.5 rounded bg-[#161B22] border-white/20 text-[#5ED29C] focus:ring-[#5ED29C] cursor-pointer"
                        />
                        <span>Print Serial / IMEI / 3-Line Remarks</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-white/80 hover:text-white font-semibold text-[11px]">
                        <input
                          type="checkbox"
                          checked={formData.showRefurbishedBadgeOnPrint}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormData((prev) => ({ ...prev, showRefurbishedBadgeOnPrint: val }));
                            updateSaleRules({ showRefurbishedBadgeOnPrint: val });
                          }}
                          className="w-3.5 h-3.5 rounded bg-[#161B22] border-white/20 text-amber-400 focus:ring-amber-400 cursor-pointer"
                        />
                        <span>Print 'Refurbished' Remark</span>
                      </label>
                    </div>
                  </div>

                  {/* BARCODE / CATALOG QUICK SEARCH BAR */}
                  <div className="relative flex-1 max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        ref={barcodeInputRef}
                        value={productSearchQuery}
                        onFocus={() => setShowProductDropdown(true)}
                        onChange={(e) => {
                          setProductSearchQuery(e.target.value);
                          setShowProductDropdown(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleScanBarcode(productSearchQuery);
                          }
                        }}
                        placeholder="⚡ Scan Barcode or type Product Name, SKU, HSN Code..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161B22] border border-[#5ED29C]/50 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C] font-mono"
                      />
                      <Barcode className="w-4 h-4 text-[#5ED29C] absolute left-2.5 top-2.5" />
                    </div>

                    {showProductDropdown && productSearchQuery.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-[#161B22] border border-[#5ED29C]/50 rounded-xl shadow-2xl divide-y divide-white/10">
                        {matchingProducts.length === 0 ? (
                          <div className="p-3 text-center text-white/50 text-xs">No matching products in inventory</div>
                        ) : (
                          matchingProducts.map((invItem) => (
                            <div
                              key={invItem.id}
                              onClick={() => handleAddProductItemToInvoice(invItem)}
                              className="p-3 hover:bg-[#5ED29C]/15 cursor-pointer flex items-center justify-between transition-colors text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-white text-xs flex items-center gap-2">
                                  <span>{invItem.name}</span>
                                  <span className="text-[10px] text-[#5ED29C] bg-[#5ED29C]/10 px-1.5 py-0.5 rounded font-mono border border-[#5ED29C]/20">({invItem.code || invItem.barcode})</span>
                                </div>
                                <div className="text-[11px] text-emerald-300 font-mono font-semibold flex items-center gap-2">
                                  <span>₹{invItem.sellingPrice?.toLocaleString()}</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-slate-200">Stock: <strong className="text-white font-bold">{invItem.currentStock}</strong> {invItem.uom}</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-slate-300">HSN: {invItem.hsnCode || '84713010'}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-black bg-[#5ED29C] hover:bg-[#4ec08a] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                + Add
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="px-3 py-2 rounded-xl bg-[#5ED29C]/20 text-[#5ED29C] hover:bg-[#5ED29C] hover:text-black border border-[#5ED29C]/30 text-[10px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                  >
                    + Add Product Line
                  </button>
                </div>

                <div className="space-y-3">
                  {lineItems.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40 space-y-1">
                      <p className="font-bold text-white/60">No items added to sales bill yet.</p>
                      <p>Scan a product barcode or use the inventory search bar above to add products.</p>
                    </div>
                  ) : (
                    lineItems.map((line, idx) => (
                      <div key={line.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                        <div className="grid grid-cols-12 gap-3 items-center">
                          {/* Searchable Select Product Item */}
                          <div className="col-span-12 lg:col-span-4">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Select Inventory Product Item (Searchable)</label>
                            <SearchableLineItemSelect
                              selectedItemId={line.itemId || ''}
                              onSelect={(newItemId) => handleUpdateLineItem(line.id, { itemId: newItemId })}
                              inventory={inventory}
                            />
                          </div>

                          {/* HSN Code */}
                          <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">HSN Code</label>
                            <input
                              type="text"
                              value={line.hsnCode}
                              onChange={(e) => handleUpdateLineItem(line.id, { hsnCode: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono text-center"
                            />
                          </div>

                          {/* Quantity */}
                          <div className="col-span-3 sm:col-span-1 lg:col-span-1">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={line.quantity}
                              onChange={(e) => handleUpdateLineItem(line.id, { quantity: Math.max(1, Number(e.target.value)) })}
                              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold text-center"
                            />
                          </div>

                          {/* Unit Rate */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Unit Rate (<span className="normal-case font-sans font-bold">₹</span>)</label>
                            <input
                              type="number"
                              value={line.unitPrice}
                              onChange={(e) => handleUpdateLineItem(line.id, { unitPrice: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold font-mono text-right"
                            />
                          </div>

                          {/* Per-Item Part Discount Option (% or ₹) */}
                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold flex items-center justify-between">
                              <span>Part Disc</span>
                              <span className="text-[#5ED29C] text-[9px] font-mono">({line.discountType === 'percent' ? '%' : <span className="normal-case font-sans font-bold">₹</span>})</span>
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={line.discount || 0}
                                onChange={(e) => handleUpdateLineItem(line.id, { discount: Math.max(0, Number(e.target.value)) })}
                                placeholder={line.discountType === 'percent' ? '10%' : '500'}
                                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-300 text-xs font-bold font-mono text-right"
                              />
                              <select
                                value={line.discountType || 'fixed'}
                                onChange={(e) => handleUpdateLineItem(line.id, { discountType: e.target.value as 'fixed' | 'percent' })}
                                className="p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-xs text-[#5ED29C] font-bold cursor-pointer"
                              >
                                <option value="fixed">₹</option>
                                <option value="percent">%</option>
                              </select>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-1 text-right">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Subtotal</label>
                            <div className="font-extrabold text-[#5ED29C] text-xs pt-2 font-mono">₹{line.totalPrice.toLocaleString()}</div>
                          </div>

                          {/* Delete Line Item Button */}
                          <div className="col-span-1 flex items-center justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(line.id)}
                              className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Product Line Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* DYNAMIC REMARKS & REFURBISHED FIELDS (CONDITIONALLY RENDERED BASED ON CHECKBOXES) */}
                        {(formData.showProductRemarksOnPrint || (formData.showRefurbishedBadgeOnPrint && line.productCondition === 'Refurbished')) && (
                          <div className="grid grid-cols-1 gap-3 pt-2 border-t border-white/5">
                            {formData.showProductRemarksOnPrint && (
                              <div>
                                <label className="block text-[9px] text-white/40 uppercase mb-1 font-bold">
                                  Line Serial No / IMEI / Remarks (3 Lines Supported)
                                </label>
                                <textarea
                                  rows={3}
                                  placeholder="Line Serial No / IMEI / Remarks (e.g. Serial # S/N-9988273&#10;Model Variant: 8GB DDR4&#10;Warranty: 1 Year replacement)..."
                                  value={line.remarks || ''}
                                  onChange={(e) => handleUpdateLineItem(line.id, { remarks: e.target.value })}
                                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono leading-normal resize-y"
                                />
                              </div>
                            )}

                            {formData.showRefurbishedBadgeOnPrint && (line.productCondition === 'Refurbished' || line.refurbishedDescription) && (
                              <div>
                                <label className="block text-[9px] text-amber-400/80 uppercase mb-1 font-bold">
                                  Refurbished Item Warranty Description
                                </label>
                                <input
                                  type="text"
                                  placeholder="Refurbished Warranty Details (e.g. 6 Months Store Warranty Certified)..."
                                  value={line.refurbishedDescription || ''}
                                  onChange={(e) => handleUpdateLineItem(line.id, { refurbishedDescription: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CALCULATION SUMMARY & FINANCIAL SETTLEMENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Bill Remarks &amp; Internal Notes</label>
                  <textarea
                    rows={4}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="e.g. Terms of warranty, transport courier tracking numbers, payment notes..."
                    className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Taxable Items Subtotal:</span>
                    <span className="font-mono font-bold text-white">₹{totalItemsSum.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/70">
                    <span>GST Tax Mode:</span>
                    <select
                      value={formData.gstTaxMode}
                      onChange={(e) => setFormData({ ...formData, gstTaxMode: e.target.value })}
                      className="p-1 rounded-lg bg-[#161B22] border border-white/10 text-xs text-white font-bold"
                    >
                      <option value="18% GST (9% + 9%)">18% GST (9% + 9%)</option>
                      <option value="18% IGST Out-of-State">18% IGST Out-of-State</option>
                      <option value="12% GST (6% + 6%)">12% GST (6% + 6%)</option>
                      <option value="5% GST (2.5% + 2.5%)">5% GST (2.5% + 2.5%)</option>
                      <option value="0% Exempt">0% Exempt</option>
                    </select>
                  </div>

                  <div className="flex justify-between text-white/70">
                    <span>Computed Tax Amount:</span>
                    <span className="text-blue-400 font-bold">+₹{taxSum.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/70">
                    <span>Freight / Shipping Charges:</span>
                    <input
                      type="number"
                      value={formData.shippingCharges}
                      onChange={(e) => setFormData({ ...formData, shippingCharges: Number(e.target.value) })}
                      className="w-24 p-1 rounded-lg bg-white/5 border border-white/10 text-right text-xs font-bold text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center text-white/70">
                    <div className="flex items-center gap-1.5">
                      <span>Discount Adjustment:</span>
                      <select
                        value={formData.discountType || 'fixed'}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'fixed' | 'percent' })}
                        className="p-1 rounded-lg bg-[#161B22] border border-white/10 text-[11px] text-[#5ED29C] font-bold cursor-pointer"
                      >
                        <option value="fixed">Fixed (₹)</option>
                        <option value="percent">Percentage (%)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.discountType === 'percent' && (
                        <span className="text-[11px] text-amber-400 font-mono font-bold">
                          (-₹{computedOverallDiscount.toLocaleString()})
                        </span>
                      )}
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                        placeholder={formData.discountType === 'percent' ? '10%' : '0'}
                        className="w-24 p-1 rounded-lg bg-white/5 border border-white/10 text-right text-xs font-bold text-amber-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="font-extrabold text-white text-sm">Invoice Grand Total:</span>
                    <span className="font-black text-[#5ED29C] text-lg">₹{grandTotalCalc.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/70 pt-2 border-t border-white/10">
                    <span className="font-bold text-emerald-400">Initial Payment Received (<span className="normal-case font-sans font-bold">₹</span>):</span>
                    <input
                      type="number"
                      value={formData.initialPaid}
                      onChange={(e) => setFormData({ ...formData, initialPaid: Number(e.target.value) })}
                      className="w-28 p-1.5 rounded-lg bg-white/5 border border-emerald-500/40 text-right text-xs font-black text-emerald-400 font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center text-amber-400 font-bold">
                    <span>Balance Credit Due:</span>
                    <span>₹{initialBalanceDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black uppercase tracking-wider shadow-lg shadow-[#5ED29C]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> {editingInvoiceId ? 'SAVE MODIFIED INVOICE' : 'SAVE SALES INVOICE'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: VIEW FULL SALES INVOICE LIGHTBOX DETAILS */}
      {activeInvoiceView && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#5ED29C]/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6 bg-[#0D1117]">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-extrabold uppercase text-[#5ED29C] flex items-center gap-2 font-mono">
                  <FileText className="w-5 h-5 text-[#5ED29C]" /> {activeInvoiceView.invoiceNo}
                </h2>
                <p className="text-xs text-white/60">
                  Issued on <span className="font-mono text-white">{new Date(activeInvoiceView.invoiceDate).toLocaleString()}</span> | Terms: <span className="text-white font-bold">{activeInvoiceView.paymentTerms}</span>
                </p>
              </div>

              <button onClick={() => setActiveInvoiceView(null)} className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CUSTOMER & PAYMENT SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase block">Billed Customer Account</span>
                <div className="font-bold text-white text-sm mt-0.5">{activeInvoiceView.customerName}</div>
                <div className="text-white/60 font-mono">{activeInvoiceView.customerPhone || 'No Mobile Registered'}</div>
                {activeInvoiceView.customerGst && (
                  <div className="text-blue-400 font-mono text-[10px] mt-0.5">GSTIN: {activeInvoiceView.customerGst}</div>
                )}
                {activeInvoiceView.customerAddress && (
                  <div className="text-white/50 text-[10px] mt-0.5">{activeInvoiceView.customerAddress}</div>
                )}
              </div>

              <div className="space-y-1 font-mono text-right">
                <span className="text-[10px] font-bold text-white/40 uppercase block">Settlement Breakdown</span>
                <div>Grand Total: <strong className="text-[#5ED29C] text-sm">₹{activeInvoiceView.grandTotal.toLocaleString()}</strong></div>
                <div>Paid Amount: <strong className="text-emerald-400">₹{activeInvoiceView.paidAmount.toLocaleString()}</strong></div>
                <div>Balance Due: <strong className="text-rose-400">₹{activeInvoiceView.balanceDue.toLocaleString()}</strong></div>
                <div className="pt-1">
                  Status: <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white">{activeInvoiceView.paymentStatus}</span>
                </div>
              </div>
            </div>

            {/* ITEM LINES */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white/70 uppercase">Itemized Products &amp; Services ({activeInvoiceView.items.length})</div>
              <div className="divide-y divide-white/5 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {activeInvoiceView.items.map((line, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white font-sans">{line.name}</div>
                      <div className="text-[10px] text-white/40">HSN: {line.hsnCode || '84713010'} | GST: {line.gstRate}% | Qty: {line.quantity}</div>
                      {line.remarks && <div className="text-[10px] text-amber-300">Remark: {line.remarks}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#5ED29C]">₹{line.totalPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-white/40">@ ₹{line.unitPrice.toLocaleString()} / unit</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setPrintTargetInvoice(activeInvoiceView);
                  setShowPrintModal(true);
                }}
                className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
              <button
                onClick={() => setActiveInvoiceView(null)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: PRINT CHOICE & FORMAT SELECTION */}
      {showPrintModal && printTargetInvoice && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#5ED29C]/40 w-full max-w-lg space-y-6 bg-[#0D1117] text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black uppercase text-[#5ED29C] flex items-center gap-2">
                <Printer className="w-5 h-5" /> PRINT SALES TAX INVOICE ({printTargetInvoice.invoiceNo})
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paper Format Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/70 uppercase">Select Paper Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A4')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'A4'
                      ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A4 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A5')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'A5'
                      ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A5 Compact
                </button>
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('THERMAL')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'THERMAL'
                      ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  3" POS Thermal
                </button>
              </div>
            </div>

            {/* Copy Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/70 uppercase">Select Document Copy</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintCopyType('customer')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printCopyType === 'customer'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  Customer Copy
                </button>
                <button
                  type="button"
                  onClick={() => setPrintCopyType('office')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printCopyType === 'office'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  Office Copy
                </button>
                <button
                  type="button"
                  onClick={() => setPrintCopyType('both')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printCopyType === 'both'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  Both Copies
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 font-bold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executeInvoicePrintDoc(printTargetInvoice, printPaperFormat, printCopyType);
                  setShowPrintModal(false);
                }}
                className="px-7 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Document Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK REGISTER NEW CUSTOMER */}
      {showQuickCustModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-[#16FFC6]/40 w-full max-w-md space-y-4 bg-[#0D1117]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#16FFC6]" /> Register New Customer
              </h3>
              <button onClick={() => setShowQuickCustModal(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={quickCust.name}
                  onChange={(e) => setQuickCust({ ...quickCust, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Mobile / Phone Number *</label>
                <input
                  type="text"
                  required
                  value={quickCust.mobile}
                  onChange={(e) => setQuickCust({ ...quickCust, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  value={quickCust.gstin}
                  onChange={(e) => setQuickCust({ ...quickCust, gstin: e.target.value })}
                  placeholder="e.g. 08AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Company / Firm Name (Optional)</label>
                <input
                  type="text"
                  value={quickCust.companyName}
                  onChange={(e) => setQuickCust({ ...quickCust, companyName: e.target.value })}
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Full Address</label>
                <input
                  type="text"
                  value={quickCust.address}
                  onChange={(e) => setQuickCust({ ...quickCust, address: e.target.value })}
                  placeholder="City, State..."
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowQuickCustModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#16FFC6] hover:bg-[#5ED29C] text-black font-black uppercase tracking-wider cursor-pointer"
                >
                  Save &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CUSTOMER PAYMENT */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 w-full max-w-md space-y-4 bg-[#0D1117]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Record Customer Payment
              </h3>
              <button onClick={() => setPaymentModalInvoice(null)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs font-sans">
              <div className="bg-white/5 p-3.5 rounded-xl space-y-1 font-mono">
                <div className="text-white/60">Invoice No: <span className="text-[#5ED29C] font-bold">{paymentModalInvoice.invoiceNo}</span></div>
                <div className="text-white/60">Customer: <span className="text-white font-bold">{paymentModalInvoice.customerName}</span></div>
                <div className="text-white/60">Grand Total: <span className="text-white font-bold">₹{paymentModalInvoice.grandTotal.toLocaleString()}</span></div>
                <div className="text-amber-400 font-bold">Current Balance Due: ₹{paymentModalInvoice.balanceDue.toLocaleString()}</div>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Payment Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  max={paymentModalInvoice.balanceDue}
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-black text-base font-mono"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Payment Mode *</label>
                <select
                  value={paymentModeInput}
                  onChange={(e) => setPaymentModeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-bold"
                >
                  <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
