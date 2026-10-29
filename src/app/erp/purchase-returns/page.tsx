'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  RotateCcw, Plus, Search, Filter, Printer, Trash2, CheckCircle,
  Clock, AlertTriangle, FileText, Package, X, Check, Truck, Building, User, Phone, MapPin, Tag, ShieldCheck,
  ChevronDown, DollarSign, Calendar, Edit2, Eye, Landmark, Barcode, RefreshCw, CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useErpStore, PurchaseReturnItem, TransactionItemLine, InventoryItem, VendorItem } from '@/lib/store';
import {
  fetchPurchaseReturnsFromSupabase,
  pushPurchaseReturnToSupabase,
  deletePurchaseReturnFromSupabase,
} from '@/lib/supabase-sync';

// Searchable Product Combobox Component for Purchase Return Line Items
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
        className="w-full p-2.5 rounded-xl bg-[#161B22] border border-blue-500/40 text-white text-xs font-semibold text-left flex items-center justify-between hover:border-blue-400 transition-colors"
      >
        <span className="truncate pr-2">
          {selectedItem
            ? `${selectedItem.name} (Stock: ${selectedItem.currentStock} ${selectedItem.uom}) - Cost: ₹${selectedItem.costPrice?.toLocaleString() || selectedItem.sellingPrice.toLocaleString()}`
            : 'Select Inventory Product Item (Searchable)...'}
        </span>
        <ChevronDown className="w-4 h-4 text-blue-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#161B22] border border-blue-500/50 rounded-xl shadow-2xl overflow-hidden max-h-64 flex flex-col">
          <div className="p-2 border-b border-white/10 bg-[#0D1117]">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="🔍 Search product name, SKU, HSN..."
                className="w-full pl-3 pr-3 py-1.5 rounded-lg bg-black/50 border border-blue-500/30 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-48 divide-y divide-white/5 font-sans">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-white/40 text-xs">No matching products found.</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`p-2.5 hover:bg-blue-500/15 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                    item.id === selectedItemId ? 'bg-blue-500/20 text-blue-300' : 'text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-extrabold flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-[10px] text-white/40 font-mono">({item.code || item.barcode})</span>
                    </div>
                    <div className="text-[10px] text-white/50 font-mono flex items-center gap-2">
                      <span>HSN: {item.hsnCode || '84713010'}</span>
                      <span>•</span>
                      <span>Stock: <strong className="text-white">{item.currentStock}</strong> {item.uom}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-blue-300">
                    ₹{item.costPrice?.toLocaleString() || item.sellingPrice?.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PurchaseReturnsPage() {
  const router = useRouter();
  const {
    purchaseReturns,
    purchaseInvoices,
    vendors,
    inventory,
    companyDetails,
    purchaseReturnRules,
    addPurchaseReturn,
    updatePurchaseReturn,
    deletePurchaseReturn,
    addVendor,
  } = useErpStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Date Filter States (Matches Sales & Quotation Pages)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState<string>('ALL');

  const applyDatePreset = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === 'TODAY') {
      const todayStr = now.toISOString().slice(0, 10);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'YESTERDAY') {
      const yest = new Date(now);
      yest.setDate(now.getDate() - 1);
      const yestStr = yest.toISOString().slice(0, 10);
      setStartDate(yestStr);
      setEndDate(yestStr);
    } else if (preset === 'THIS_WEEK') {
      const first = now.getDate() - now.getDay();
      const firstDay = new Date(now.setDate(first)).toISOString().slice(0, 10);
      const todayStr = new Date().toISOString().slice(0, 10);
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === 'THIS_MONTH') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const todayStr = new Date().toISOString().slice(0, 10);
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  // Modal State
  const [isNewReturnOpen, setIsNewReturnOpen] = useState(false);
  const [editingReturnId, setEditingReturnId] = useState<string | null>(null);
  const [viewModalReturn, setViewModalReturn] = useState<PurchaseReturnItem | null>(null);

  // Dedicated Print Options Modal State
  const [printModalTarget, setPrintModalTarget] = useState<PurchaseReturnItem | null>(null);
  const [printPaperFormat, setPrintPaperFormat] = useState<'A4' | 'A5' | 'THERMAL'>('A4');
  const [printCopyType, setPrintCopyType] = useState<'customer' | 'office' | 'both'>('customer');

  // Vendor Autocomplete Search State
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showQuickVendorModal, setShowQuickVendorModal] = useState(false);
  const [quickVendor, setQuickVendor] = useState({ companyName: '', contactPerson: '', phone: '', gstin: '', address: '' });

  // Product Autocomplete Search & Barcode Scan State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Form Helper Initializer
  const getInitialFormData = () => {
    const defaultVendor = vendors[0];
    const prefix = purchaseReturnRules?.purchaseReturnPrefix || 'PCR-';
    const startNo = purchaseReturnRules?.purchaseReturnStartNo || 1001;
    const nextReturnNo = `${prefix}${startNo + purchaseReturns.length}`;

    return {
      returnNo: nextReturnNo,
      returnDate: new Date().toISOString().slice(0, 16),
      originalBillNo: purchaseInvoices[0]?.billNo || 'PUR-2026-088',
      vendorId: defaultVendor?.id || '',
      vendorName: defaultVendor?.companyName || defaultVendor?.name || '',
      vendorPhone: defaultVendor?.phone || '',
      vendorGst: defaultVendor?.gstin || '',
      vendorAddress: defaultVendor?.fullAddress || defaultVendor?.address || '',
      supplyType: 'INTRA_STATE' as 'INTRA_STATE' | 'INTER_STATE',
      gstTaxMode: '18% GST (9% + 9%)',
      shippingCharges: 0,
      discount: 0,
      discountType: 'fixed' as 'fixed' | 'percent',
      returnReason: 'Dead On Arrival (DOA) / NAND Controller Failure',
      rmaStatus: (purchaseReturnRules?.defaultRmaStatus as any) || 'Completed',
      deductFromStock: purchaseReturnRules?.autoDeductInventory !== false,
      showProductRemarksOnPrint: true,
      showRefurbishedBadgeOnPrint: true,
      termsAndConditions: (purchaseReturnRules?.termsAndConditions || [
        '1. Goods returned under vendor RMA warranty claim.',
        '2. Subject to vendor inspection and credit note reversal settlement.',
        '3. Defective components deducted from active store stock.',
        '4. Subject to Sanchore Jurisdiction only.',
      ]).join('\n'),
      remarks: 'Vendor RMA Defective Return & Debit Reversal Claim',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [lineItems, setLineItems] = useState<TransactionItemLine[]>([]);

  // Matching Vendors Filter
  const matchingVendors = useMemo(() => {
    const q = vendorSearchQuery.toLowerCase().trim();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        (v.companyName && v.companyName.toLowerCase().includes(q)) ||
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.phone && v.phone.includes(q)) ||
        (v.gstin && v.gstin.toLowerCase().includes(q))
    );
  }, [vendors, vendorSearchQuery]);

  // Matching Inventory Products Filter
  const matchingProducts = useMemo(() => {
    const q = productSearchQuery.toLowerCase().trim();
    if (!q) return inventory;
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q)) ||
        (item.hsnCode && item.hsnCode.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [inventory, productSearchQuery]);

  // Open Create Debit Note Modal
  const openCreateModal = () => {
    setEditingReturnId(null);
    setFormData(getInitialFormData());
    setLineItems([]);
    setVendorSearchQuery('');
    setProductSearchQuery('');
    setIsNewReturnOpen(true);

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 150);
  };

  // Open Edit Existing Purchase Return Modal
  const openEditModal = (ret: PurchaseReturnItem) => {
    setEditingReturnId(ret.id);
    setFormData({
      returnNo: ret.returnNo,
      returnDate: new Date(ret.returnDate).toISOString().slice(0, 16),
      originalBillNo: ret.originalBillNo || 'PUR-2026-088',
      vendorId: ret.vendorId || '',
      vendorName: ret.vendorName || '',
      vendorPhone: ret.vendorPhone || '',
      vendorGst: (ret as any).vendorGst || '',
      vendorAddress: (ret as any).vendorAddress || '',
      supplyType: 'INTRA_STATE',
      gstTaxMode: '18% GST (9% + 9%)',
      shippingCharges: 0,
      discount: 0,
      discountType: 'fixed',
      returnReason: ret.returnReason || 'Dead On Arrival (DOA)',
      rmaStatus: ret.rmaStatus || 'Completed',
      deductFromStock: ret.deductFromStock !== undefined ? ret.deductFromStock : true,
      showProductRemarksOnPrint: true,
      showRefurbishedBadgeOnPrint: true,
      termsAndConditions: (purchaseReturnRules?.termsAndConditions || []).join('\n'),
      remarks: ret.remarks || '',
    });
    setLineItems(ret.items ? JSON.parse(JSON.stringify(ret.items)) : []);
    setIsNewReturnOpen(true);
  };

  // Select Vendor Item from Autocomplete
  const handleSelectVendorItem = (v: VendorItem) => {
    setFormData((prev) => ({
      ...prev,
      vendorId: v.id,
      vendorName: v.companyName || v.name || '',
      vendorPhone: v.phone || '',
      vendorGst: v.gstin || '',
      vendorAddress: v.fullAddress || v.address || '',
    }));
    setVendorSearchQuery(v.companyName || v.name || '');
    setShowVendorDropdown(false);
  };

  // Quick Vendor Registration Submit
  const handleSaveQuickVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVendor.companyName || !quickVendor.phone) {
      alert('Please enter Vendor Company Name and Mobile Number.');
      return;
    }
    const newId = `ven-${Date.now()}`;
    addVendor({
      vendorType: 'Standard Vendor',
      companyName: quickVendor.companyName,
      name: quickVendor.contactPerson || quickVendor.companyName,
      contactPerson: quickVendor.contactPerson || 'Sales Manager',
      phone: quickVendor.phone,
      gstin: quickVendor.gstin,
      address: quickVendor.address,
      fullAddress: quickVendor.address,
      activeStatus: 'Active',
      openingBalance: 0,
      outstandingBalance: 0,
      maxCreditLimit: 500000,
    });

    setFormData((prev) => ({
      ...prev,
      vendorId: newId,
      vendorName: quickVendor.companyName,
      vendorPhone: quickVendor.phone,
      vendorGst: quickVendor.gstin,
      vendorAddress: quickVendor.address,
    }));
    setVendorSearchQuery(quickVendor.companyName);
    setQuickVendor({ companyName: '', contactPerson: '', phone: '', gstin: '', address: '' });
    setShowQuickVendorModal(false);
    alert(`Supplier Vendor "${quickVendor.companyName}" registered and selected!`);
  };

  // Add Product Item via Barcode Scan or Catalog Dropdown
  const handleAddProductItemToReturn = (invItem: InventoryItem) => {
    const existingIndex = lineItems.findIndex((line) => line.itemId === invItem.id);
    if (existingIndex >= 0) {
      const updatedLines = [...lineItems];
      const currQty = updatedLines[existingIndex].quantity + 1;
      updatedLines[existingIndex].quantity = currQty;
      const raw = currQty * updatedLines[existingIndex].unitPrice;
      let discVal = 0;
      if (updatedLines[existingIndex].discount && updatedLines[existingIndex].discount! > 0) {
        discVal = updatedLines[existingIndex].discountType === 'percent'
          ? (raw * updatedLines[existingIndex].discount!) / 100
          : updatedLines[existingIndex].discount!;
      }
      updatedLines[existingIndex].totalPrice = Math.max(0, raw - discVal);
      setLineItems(updatedLines);
    } else {
      const newLine: TransactionItemLine = {
        id: `pri-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        itemId: invItem.id,
        name: invItem.name,
        hsnCode: invItem.hsnCode || '84713010',
        gstRate: invItem.gstRate || 18,
        quantity: 1,
        unitPrice: invItem.costPrice || 0,
        discount: 0,
        discountType: 'fixed',
        totalPrice: invItem.costPrice || 0,
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

    const match = inventory.find(
      (item) =>
        (item.barcode && item.barcode.toLowerCase() === q) ||
        (item.code && item.code.toLowerCase() === q) ||
        item.name.toLowerCase().includes(q)
    );

    if (match) {
      handleAddProductItemToReturn(match);
    } else {
      alert(`No product found in inventory matching barcode/search "${scannedQuery}".`);
    }
  };

  // Add blank line item
  const handleAddLineItem = () => {
    const newLine: TransactionItemLine = {
      id: `pri-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemId: '',
      name: '',
      hsnCode: '84713010',
      gstRate: 18,
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'fixed',
      totalPrice: 0,
      productCondition: 'New',
      refurbishedDescription: '',
      remarks: '',
    };
    setLineItems((prev) => [...prev, newLine]);
  };

  // Update line item
  const handleUpdateLineItem = (id: string, updates: Partial<TransactionItemLine>) => {
    setLineItems((prev) =>
      prev.map((line) => {
        if (line.id === id) {
          const updated = { ...line, ...updates };
          if ('itemId' in updates && updates.itemId) {
            const selectedInv = inventory.find((i) => i.id === updates.itemId);
            if (selectedInv) {
              updated.name = selectedInv.name;
              updated.hsnCode = selectedInv.hsnCode || '84713010';
              updated.gstRate = selectedInv.gstRate || 18;
              updated.unitPrice = selectedInv.costPrice || 0;
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

  // Remove line item explicitly
  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((l) => l.id !== id));
  };

  // Compute Totals
  const totalItemsSum = useMemo(() => {
    return lineItems.reduce((acc, l) => acc + l.totalPrice, 0);
  }, [lineItems]);

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
    return Math.round(Math.max(0, totalItemsSum + taxSum + Number(formData.shippingCharges || 0) - computedOverallDiscount));
  }, [totalItemsSum, taxSum, formData.shippingCharges, computedOverallDiscount]);

  // Save or Update Purchase Return Debit Note
  const handleSaveReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorName) {
      alert('Please enter or select Supplier Vendor Name.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one component line item to the purchase return debit note.');
      return;
    }

    if (editingReturnId) {
      const updatedReturn = {
        returnNo: formData.returnNo,
        returnDate: new Date(formData.returnDate).toISOString(),
        originalBillNo: formData.originalBillNo,
        vendorId: formData.vendorId || 'v-1001',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        vendorGst: formData.vendorGst,
        vendorAddress: formData.vendorAddress,
        items: lineItems,
        subtotal: totalItemsSum,
        taxAmount: taxSum,
        grandTotal: grandTotalCalc,
        returnReason: formData.returnReason,
        deductFromStock: formData.deductFromStock,
        rmaStatus: formData.rmaStatus as any,
        remarks: formData.remarks,
      };

      updatePurchaseReturn(editingReturnId, updatedReturn);
      pushPurchaseReturnToSupabase({ id: editingReturnId, ...updatedReturn } as any).catch(() => {});

      alert(`Purchase Return Debit Note "${formData.returnNo}" updated successfully!`);
    } else {
      const newReturn = {
        returnNo: formData.returnNo || `PCR-${Date.now()}`,
        returnDate: new Date(formData.returnDate).toISOString(),
        originalBillNo: formData.originalBillNo,
        vendorId: formData.vendorId || 'v-1001',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        vendorGst: formData.vendorGst,
        vendorAddress: formData.vendorAddress,
        items: lineItems,
        subtotal: totalItemsSum,
        taxAmount: taxSum,
        grandTotal: grandTotalCalc,
        returnReason: formData.returnReason,
        deductFromStock: formData.deductFromStock,
        rmaStatus: formData.rmaStatus as any,
        remarks: formData.remarks,
      };

      addPurchaseReturn(newReturn);
      pushPurchaseReturnToSupabase(newReturn as any).catch(() => {});

      alert(`Purchase Return Debit Note "${formData.returnNo}" created & registered successfully!`);
    }

    setIsNewReturnOpen(false);
  };

  // Execute Branded Debit Note Voucher Printing (Matches Sales Bill Print Engine)
  const executePurchaseReturnPrintDoc = (ret: PurchaseReturnItem, paperFormat: 'A4' | 'A5' | 'THERMAL', copyType: 'customer' | 'office' | 'both') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const paper = paperFormat || (purchaseReturnRules?.defaultPrintPaperFormat as 'A4' | 'A5') || 'A4';
    const isInterState = (ret as any).vendorGst && companyDetails.gstin && (ret as any).vendorGst.substring(0, 2) !== companyDetails.gstin.substring(0, 2);
    const upiVpa = companyDetails.merchantUpiId || 'support.time24x7-1@okhdfcbank';
    const upiPayee = companyDetails.companyLegalName || 'ACCNO SOLUTION';
    const upiString = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}&am=${ret.grandTotal}&cu=INR&tn=DebitNote_${ret.returnNo}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${encodeURIComponent(upiString)}`;

    const padding = paper === 'A5' ? '4px 6px' : '6px 8px';
    const fontSz = paper === 'A5' ? '9.5px' : '11px';

    const copyLabels = copyType === 'both' ? ['SUPPLIER / VENDOR COPY', 'OFFICE RECORD COPY'] : [copyType === 'office' ? 'OFFICE RECORD COPY' : 'SUPPLIER / VENDOR COPY'];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PURCHASE RETURN DEBIT NOTE - ${ret.returnNo}</title>
          <style>
            @page {
              size: ${paper} portrait;
              margin: 10mm;
            }
            body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
              background: #fff;
              font-size: ${fontSz};
              line-height: 1.35;
            }
            .voucher-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto 20px auto;
              page-break-after: always;
            }
            .voucher-container:last-child {
              page-break-after: avoid;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 8px;
            }
            .header-logo {
              max-height: 60px;
              width: auto;
            }
            .header-title {
              font-size: 20px;
              font-weight: 900;
              color: #2563eb;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              text-align: right;
            }
            .header-subtag {
              font-size: 9px;
              font-weight: 800;
              color: #1d4ed8;
              text-transform: uppercase;
              text-align: right;
            }
            .company-name {
              font-size: 16px;
              font-weight: 900;
              color: #0f172a;
              text-transform: uppercase;
            }
            .company-address {
              font-size: 10px;
              color: #475569;
              line-height: 1.3;
            }
            .info-cards-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 10px 0;
              margin-bottom: 12px;
            }
            .info-card {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 8px;
              padding: 8px 10px;
              vertical-align: top;
            }
            .card-title {
              font-size: 9.5px;
              font-weight: 900;
              color: #1e40af;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #93c5fd;
              padding-bottom: 3px;
              margin-bottom: 4px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
            }
            .items-table th {
              background: #000000 !important;
              color: #ffffff !important;
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 6px 8px;
              border: 1px solid #000000;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .items-table td {
              padding: ${padding};
              border-bottom: 1px solid #cbd5e1;
              border-left: 1px solid #cbd5e1;
              border-right: 1px solid #cbd5e1;
              font-size: 10px;
            }
            .summary-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 12px;
              margin-top: 10px;
            }
            .left-summary {
              width: 58%;
            }
            .totals-card {
              width: 38%;
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 8px;
              padding: 8px 10px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              font-size: 10px;
            }
            .totals-grand {
              border-top: 2px solid #2563eb;
              padding-top: 5px;
              margin-top: 4px;
              font-size: 13px;
              font-weight: 900;
              color: #2563eb;
            }
            .bank-box {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 8px 10px;
              font-size: 9px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .sig-section {
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid #cbd5e1;
              padding-top: 10px;
              font-size: 9px;
            }
            .sig-box {
              text-align: center;
              width: 200px;
            }
            .sig-line {
              border-top: 1px solid #0f172a;
              margin-top: 35px;
              font-weight: 800;
              text-transform: uppercase;
              font-size: 9px;
            }
          </style>
        </head>
        <body>
          ${copyLabels.map((copyTag) => `
            <div class="voucher-container">
              <!-- HEADER -->
              <table class="header-table">
                <tr>
                  <td style="width: 50%;">
                    ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" class="header-logo" alt="Logo" /><br/>` : ''}
                    <span class="company-name">${companyDetails.companyLegalName}</span><br/>
                    <span class="company-address">
                      ${companyDetails.addressLine1}, ${companyDetails.city}, ${companyDetails.state}<br/>
                      <strong>GSTIN:</strong> ${companyDetails.gstin} | <strong>Ph:</strong> ${companyDetails.phoneNumber}<br/>
                      <strong>Email:</strong> ${companyDetails.email}
                    </span>
                  </td>
                  <td style="width: 50%; vertical-align: top;">
                    <div class="header-title">PURCHASE RETURN DEBIT NOTE</div>
                    <div class="header-subtag">[ ${copyTag} ]</div>
                    <div style="text-align: right; margin-top: 6px; font-size: 10.5px; font-family: monospace;">
                      <strong>DEBIT NOTE NO:</strong> ${ret.returnNo}<br/>
                      <strong>RETURN DATE:</strong> ${new Date(ret.returnDate).toLocaleDateString()}<br/>
                      <strong>ORIGINAL BILL NO:</strong> ${ret.originalBillNo || 'PUR-2026-088'}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- SIDE-BY-SIDE INFO CARDS -->
              <table class="info-cards-table">
                <tr>
                  <td class="info-card" style="width: 50%;">
                    <div class="card-title">SUPPLIER VENDOR DETAILS:</div>
                    <strong>${ret.vendorName}</strong><br/>
                    ${(ret as any).vendorAddress ? `${(ret as any).vendorAddress}<br/>` : ''}
                    Phone: ${ret.vendorPhone || 'N/A'}<br/>
                    GSTIN: ${(ret as any).vendorGst || 'REGISTERED VENDOR'}
                  </td>
                  <td class="info-card" style="width: 50%;">
                    <div class="card-title">RMA CLAIM SPECIFICATION SUMMARY:</div>
                    <strong>RMA Claim Status:</strong> ${ret.rmaStatus}<br/>
                    <strong>Return Reason:</strong> ${ret.returnReason}<br/>
                    <strong>Stock Deduction:</strong> ${ret.deductFromStock ? 'Deducted from Inventory Stock' : 'No Stock Adjustment'}
                  </td>
                </tr>
              </table>

              <!-- TABLE OF RETURNED COMPONENT ITEMS -->
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 25px; text-align: center;">S.N.</th>
                    <th style="width: 58%; text-align: left;">RETURNED HARDWARE COMPONENT DESCRIPTION</th>
                    <th style="width: 55px; text-align: center;">HSN/SAC</th>
                    <th style="width: 28px; text-align: center;">QTY</th>
                    <th style="width: 72px; text-align: right;">UNIT COST (₹)</th>
                    <th style="width: 40px; text-align: center;">GST %</th>
                    <th style="width: 82px; text-align: right;">TOTAL AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${ret.items.map((line, idx) => `
                    <tr>
                      <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
                      <td>
                        <div style="font-weight: bold;">${line.name}</div>
                        ${line.productCondition === 'Refurbished' ? `<div style="font-size: 8px; color: #b45309; font-weight: bold;">★ REFURBISHED PART: ${line.refurbishedDescription || 'Defective Reversal'}</div>` : ''}
                        ${line.remarks ? `<div style="font-size: 8px; color: #475569; font-family: monospace;">S/N: ${line.remarks}</div>` : ''}
                      </td>
                      <td style="text-align: center; font-family: monospace;">${line.hsnCode || '84713010'}</td>
                      <td style="text-align: center; font-family: monospace; font-weight: bold;">${line.quantity}</td>
                      <td style="text-align: right; font-family: monospace;">₹${line.unitPrice.toLocaleString()}</td>
                      <td style="text-align: center; font-family: monospace;">${line.gstRate}%</td>
                      <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${(line.totalPrice * (1 + line.gstRate / 100)).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- SUMMARY SECTION -->
              <div class="summary-section">
                <div class="left-summary">
                  <div class="bank-box">
                    <div>
                      <div style="font-weight: 800; color: #1e40af; margin-bottom: 2px;">COMPANY BANK &amp; ACCOUNT REVERSAL DETAILS:</div>
                      <div><strong>Bank:</strong> ${companyDetails.bankDetails.bankName} | <strong>A/C:</strong> ${companyDetails.bankDetails.accountNumber}</div>
                      <div><strong>IFSC:</strong> ${companyDetails.bankDetails.ifscCode} | <strong>Branch:</strong> ${companyDetails.bankDetails.branchName || 'Sanchore'}</div>
                    </div>
                    <div style="text-align: center; flex-shrink: 0; margin-left: 8px;">
                      <img src="${qrCodeUrl}" alt="UPI QR" style="width: 55px; height: 55px; border-radius: 4px; border: 1px solid #cbd5e1;" />
                      <div style="font-size: 7px; font-weight: 800; color: #1e40af;">SCAN &amp; PAY UPI</div>
                    </div>
                  </div>

                  <div style="padding: 6px 8px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 9.5px; color: #1e3a8a; font-weight: 600;">
                    <strong>Debit Reversal Remarks:</strong> ${ret.remarks ? ret.remarks.replace(/\n/g, '<br/>') : 'Purchase Return Debit Reversal Voucher.'}
                  </div>
                </div>

                <div class="totals-card">
                  <div class="totals-row">
                    <span>Taxable Items Subtotal:</span>
                    <span style="font-family: monospace; font-weight: bold;">₹${ret.subtotal.toLocaleString()}</span>
                  </div>
                  ${isInterState ? `
                    <div class="totals-row">
                      <span>IGST Input Tax Reversal:</span>
                      <span style="font-family: monospace; font-weight: bold;">₹${ret.taxAmount.toLocaleString()}</span>
                    </div>
                  ` : `
                    <div class="totals-row">
                      <span>CGST Input Tax Reversal:</span>
                      <span style="font-family: monospace; font-weight: bold;">₹${(ret.taxAmount / 2).toLocaleString()}</span>
                    </div>
                    <div class="totals-row">
                      <span>SGST Input Tax Reversal:</span>
                      <span style="font-family: monospace; font-weight: bold;">₹${(ret.taxAmount / 2).toLocaleString()}</span>
                    </div>
                  `}
                  <div class="totals-row totals-grand">
                    <span>DEBIT NOTE GRAND TOTAL:</span>
                    <span style="font-family: monospace;">₹${ret.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <!-- FOOTER & SIGNATORY -->
              <div class="sig-section">
                <div style="width: 60%; color: #0f172a; font-weight: 600; line-height: 1.3;">
                  <strong style="text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 2px; color: #1e40af;">Debit Note Policy:</strong>
                  ${(purchaseReturnRules?.termsAndConditions || [
                    '1. Goods returned under vendor RMA warranty claim.',
                    '2. Subject to vendor inspection and credit note reversal settlement.',
                    '3. Defective components deducted from active store stock.',
                    '4. Subject to Sanchore Jurisdiction only.',
                  ]).join('<br/>')}
                </div>
                <div class="sig-box">
                  <div style="font-size: 11px; font-weight: 800; color: #0f172a;">For <strong>${companyDetails.companyLegalName}</strong></div>
                  <div class="sig-line">AUTHORIZED RECEIVING SIGNATORY</div>
                </div>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Filter Purchase Returns by Search, RMA Status & Date Range (Matches Sales Page 100%)
  const filteredReturns = useMemo(() => {
    return purchaseReturns.filter((ret) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        ret.returnNo.toLowerCase().includes(q) ||
        (ret.originalBillNo && ret.originalBillNo.toLowerCase().includes(q)) ||
        ret.vendorName.toLowerCase().includes(q) ||
        (ret.vendorPhone && ret.vendorPhone.includes(q)) ||
        ((ret as any).vendorGst && (ret as any).vendorGst.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'ALL' || ret.rmaStatus === statusFilter;

      const rDateStr = new Date(ret.returnDate).toISOString().slice(0, 10);
      let matchDate = true;
      if (startDate) {
        matchDate = matchDate && rDateStr >= startDate;
      }
      if (endDate) {
        matchDate = matchDate && rDateStr <= endDate;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [purchaseReturns, search, statusFilter, startDate, endDate]);

  const totalReturnValue = purchaseReturns.reduce((a, b) => a + b.grandTotal, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
              Vendor Reversal &amp; RMA Claim Directory
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wide mt-1 flex items-center gap-2">
            <RotateCcw className="w-7 h-7 text-blue-400" />
            PURCHASE RETURNS &amp; DEBIT NOTES DIRECTORY
          </h1>
          <p className="text-xs text-white/50">
            Record supplier vendor RMA returns, issue branded Debit Note vouchers, deduct defective inventory, and track vendor credit claims.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> + Issue New Purchase Return Debit Note
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Return Claims Value</span>
          <div className="text-xl font-extrabold text-blue-400 font-mono">₹{totalReturnValue.toLocaleString()}</div>
          <p className="text-[10px] text-white/40">{purchaseReturns.length} Registered Debit Notes</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Completed RMA Claims</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            {purchaseReturns.filter((r) => r.rmaStatus === 'Completed').length} Settled
          </div>
          <p className="text-[10px] text-emerald-400/70">Vendor Credit Notes Received</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Pending Vendor Claims</span>
          <div className="text-xl font-extrabold text-amber-400 font-mono">
            {purchaseReturns.filter((r) => r.rmaStatus === 'Pending').length} In Transit / Testing
          </div>
          <p className="text-[10px] text-amber-400/70">Awaiting Vendor Replacement</p>
        </div>
      </div>

      {/* SEARCH & DATE FILTER BAR (MATCHES SALES INVOICES PAGE 100%) */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="🔍 Search debit note number, original bill #, vendor name, phone, GSTIN, or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'Completed', 'Pending', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase transition-all whitespace-nowrap cursor-pointer border ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
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
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
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
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                  datePreset === p.id && !startDate && !endDate
                    ? 'bg-blue-600 text-white border-blue-600 font-extrabold'
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

      {/* DATA TABLE (MATCHES SALES INVOICES TABLE PARITY) */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/50 text-[10px] uppercase font-black border-b border-white/10">
                <th className="p-4">Return Debit # &amp; Date</th>
                <th className="p-4">Original Bill #</th>
                <th className="p-4">Supplier Vendor</th>
                <th className="p-4">Items</th>
                <th className="p-4 text-right">Taxable Subtotal</th>
                <th className="p-4 text-right">Grand Total (₹)</th>
                <th className="p-4 text-center">RMA Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-white/40 font-sans">
                    No purchase return debit notes found.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <div className="font-bold text-blue-400">{ret.returnNo}</div>
                      <div className="text-[10px] text-white/40 font-sans">{new Date(ret.returnDate).toLocaleDateString()}</div>
                    </td>

                    <td className="p-4 font-sans text-white/70">{ret.originalBillNo || 'PUR-2026-088'}</td>

                    <td className="p-4 font-sans">
                      <div className="font-bold text-white">{ret.vendorName}</div>
                      <div className="text-[10px] text-white/50">{ret.vendorPhone}</div>
                    </td>

                    <td className="p-4 font-sans text-white/60">{ret.items.length} Parts</td>

                    <td className="p-4 text-right font-semibold text-white/80">₹{ret.subtotal.toLocaleString()}</td>

                    <td className="p-4 text-right font-black text-blue-300 text-sm">₹{ret.grandTotal.toLocaleString()}</td>

                    <td className="p-4 text-center font-sans">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        ret.rmaStatus === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        ret.rmaStatus === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {ret.rmaStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewModalReturn(ret)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30 cursor-pointer"
                          title="View Debit Note Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(ret)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/30 cursor-pointer"
                          title="Edit Debit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPrintModalTarget(ret)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30 cursor-pointer"
                          title="Print Debit Note Options"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete Purchase Return Debit Note "${ret.returnNo}"?`)) {
                              deletePurchaseReturn(ret.id);
                              deletePurchaseReturnFromSupabase(ret.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30 cursor-pointer"
                          title="Delete Purchase Return"
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

      {/* DEDICATED PRINT OPTIONS MODAL (PARITY WITH SALES PAGE PRINT MODAL) */}
      {printModalTarget && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
          <div className="glass-panel p-6 rounded-3xl border border-blue-500/40 w-full max-w-md space-y-5 bg-[#0D1117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-400" /> Print Debit Note ({printModalTarget.returnNo})
              </h3>
              <button onClick={() => setPrintModalTarget(null)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paper Format Selection */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-white/70 uppercase">Select Paper Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A4')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'A4'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  A4 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A5')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'A5'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  A5 Compact
                </button>
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('THERMAL')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printPaperFormat === 'THERMAL'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  3" POS Thermal
                </button>
              </div>
            </div>

            {/* Copy Type Selection */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-white/70 uppercase">Select Document Copy</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintCopyType('customer')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printCopyType === 'customer'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Vendor Copy
                </button>
                <button
                  type="button"
                  onClick={() => setPrintCopyType('office')}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    printCopyType === 'office'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
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
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Both Copies
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setPrintModalTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 font-bold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executePurchaseReturnPrintDoc(printModalTarget, printPaperFormat, printCopyType);
                  setPrintModalTarget(null);
                }}
                className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Printer className="w-4 h-4" /> Print Document Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW / PREVIEW DEBIT NOTE MODAL */}
      {viewModalReturn && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/40 w-full max-w-3xl max-h-[92vh] overflow-y-auto space-y-6 bg-[#0D1117]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-extrabold uppercase">
                  Debit Note Reversal Preview
                </span>
                <h2 className="text-xl font-extrabold uppercase text-white mt-1 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-400" />
                  {viewModalReturn.returnNo}
                </h2>
              </div>
              <button onClick={() => setViewModalReturn(null)} className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-[10px] text-white/40 uppercase block font-bold">Supplier Vendor</span>
                  <div className="font-extrabold text-white text-sm">{viewModalReturn.vendorName}</div>
                  <div className="text-white/60 font-mono">{viewModalReturn.vendorPhone}</div>
                  <div className="text-white/50 font-mono text-[11px]">Bill Ref: {viewModalReturn.originalBillNo || 'PUR-2026-088'}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-white/40 uppercase block font-bold">RMA Status &amp; Reason</span>
                  <div className="font-mono text-blue-300 font-bold">Reason: {viewModalReturn.returnReason}</div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-1 inline-block">
                    {viewModalReturn.rmaStatus}
                  </span>
                </div>
              </div>

              {/* SPECIFICATION LINES TABLE */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-white/50 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Returned Component</th>
                      <th className="p-3 text-center">HSN</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Cost (₹)</th>
                      <th className="p-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {viewModalReturn.items.map((line, idx) => (
                      <tr key={idx}>
                        <td className="p-3 text-white/40">{idx + 1}</td>
                        <td className="p-3 font-sans text-white font-bold">{line.name}</td>
                        <td className="p-3 text-center text-white/60">{line.hsnCode || '84713010'}</td>
                        <td className="p-3 text-center text-white font-bold">{line.quantity}</td>
                        <td className="p-3 text-right text-white">₹{line.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right text-blue-300 font-bold">₹{line.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* GRAND TOTAL */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex justify-between items-center font-mono">
                <span className="text-white/70 font-bold">Total Debit Note Reversal:</span>
                <span className="text-xl font-black text-blue-300">₹{viewModalReturn.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  const target = viewModalReturn;
                  setViewModalReturn(null);
                  setPrintModalTarget(target);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer text-xs"
              >
                <Printer className="w-4 h-4" /> Print Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / MODIFY PURCHASE RETURN DEBIT NOTE (MATCHES SALES INVOICE MODAL LAYOUT 100%) */}
      {isNewReturnOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/40 w-full max-w-[1320px] max-h-[92vh] overflow-y-auto space-y-6 bg-[#0D1117] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-extrabold uppercase text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-400" />
                  {editingReturnId ? `MODIFY PURCHASE RETURN DEBIT NOTE (${formData.returnNo})` : 'ISSUE VENDOR PURCHASE RETURN DEBIT NOTE'}
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Record vendor RMA returns, auto-deduct defective inventory, and issue branded Debit Note vouchers
                </p>
              </div>
              <button onClick={() => setIsNewReturnOpen(false)} className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReturn} className="space-y-6 text-xs">
              
              {/* PRIMARY RETURN IDENTIFIERS */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Debit Note Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.returnNo}
                    onChange={(e) => setFormData({ ...formData, returnNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Return Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Original Inward Bill #</label>
                  <input
                    type="text"
                    value={formData.originalBillNo}
                    onChange={(e) => setFormData({ ...formData, originalBillNo: e.target.value })}
                    placeholder="e.g. PUR-2026-088"
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">RMA Return Reason</label>
                  <select
                    value={formData.returnReason}
                    onChange={(e) => setFormData({ ...formData, returnReason: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-bold"
                  >
                    <option value="Dead On Arrival (DOA) / NAND Controller Failure">Dead On Arrival (DOA)</option>
                    <option value="Defective / Faulty Component">Defective / Faulty Component</option>
                    <option value="Wrong Item Supplied">Wrong Item Supplied</option>
                    <option value="Overstock / Excess Order Reversal">Overstock / Excess Reversal</option>
                    <option value="Warranty Replacement Claim">Warranty Replacement Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">RMA Claim Status</label>
                  <select
                    value={formData.rmaStatus}
                    onChange={(e) => setFormData({ ...formData, rmaStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-300 font-bold"
                  >
                    <option value="Completed">Completed (Settled)</option>
                    <option value="Pending">Pending (In Transit / Testing)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* SUPPLIER VENDOR INFO WITH SEARCH AUTOCOMPLETE */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" /> Supplier Vendor Details
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuickVendorModal(true)}
                    className="text-[10px] font-bold text-blue-300 hover:underline uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Register New Vendor
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vendor Autocomplete Search Field */}
                  <div className="relative">
                    <label className="block text-white/70 mb-1 font-bold">Search Existing Vendor Database *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={vendorSearchQuery}
                        onFocus={() => setShowVendorDropdown(true)}
                        onChange={(e) => {
                          setVendorSearchQuery(e.target.value);
                          setShowVendorDropdown(true);
                        }}
                        placeholder="🔍 Type Vendor Company, Contact or Phone to Autocomplete..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161B22] border border-blue-500/40 text-white text-xs font-semibold placeholder:text-white/30 focus:outline-none focus:border-blue-400"
                      />
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                    </div>

                    {showVendorDropdown && vendorSearchQuery.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-[#161B22] border border-blue-500/50 rounded-xl shadow-2xl divide-y divide-white/10">
                        {matchingVendors.length === 0 ? (
                          <div className="p-3 text-center text-white/50 text-xs">No matching vendors found</div>
                        ) : (
                          matchingVendors.map((v) => (
                            <div
                              key={v.id}
                              onClick={() => handleSelectVendorItem(v)}
                              className="p-3 hover:bg-blue-500/15 cursor-pointer flex items-center justify-between transition-colors text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-white text-xs flex items-center gap-2">
                                  <span>{v.companyName || v.name}</span>
                                  <span className="text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">({v.phone || 'No Mobile'})</span>
                                </div>
                                <div className="text-[11px] text-slate-200 font-mono">
                                  {v.gstin ? <span className="text-[#16FFC6] font-bold">GSTIN: {v.gstin}</span> : <span>{v.fullAddress || v.address || 'Local Supplier'}</span>}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors shadow-sm"
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
                    <label className="block text-white/70 mb-1 font-bold">Vendor Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      placeholder="Enter supplier vendor name..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.vendorPhone}
                      onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                      placeholder="Enter phone number..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      value={formData.vendorGst}
                      onChange={(e) => setFormData({ ...formData, vendorGst: e.target.value.toUpperCase() })}
                      placeholder="e.g. 08AAAAA0000A1Z5"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Full Postal Address</label>
                    <input
                      type="text"
                      value={formData.vendorAddress}
                      onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                      placeholder="Full vendor address..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* INWARD COMPONENT LINES (AUTO STOCK DEDUCTION) */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-400" /> Returned Component Specification Lines
                    </span>

                    {/* PRINT DISPLAY CONTROL TOGGLES */}
                    <div className="hidden sm:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                      <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Print Display:
                      </span>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-white/80 hover:text-white font-semibold text-[11px]">
                        <input
                          type="checkbox"
                          checked={formData.showProductRemarksOnPrint}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormData((prev) => ({ ...prev, showProductRemarksOnPrint: val }));
                          }}
                          className="w-3.5 h-3.5 rounded bg-[#161B22] border-white/20 text-blue-500 focus:ring-blue-500 cursor-pointer"
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
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161B22] border border-blue-500/50 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-400 font-mono"
                      />
                      <Barcode className="w-4 h-4 text-blue-400 absolute left-2.5 top-2.5" />
                    </div>

                    {showProductDropdown && productSearchQuery.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-[#161B22] border border-blue-500/50 rounded-xl shadow-2xl divide-y divide-white/10">
                        {matchingProducts.length === 0 ? (
                          <div className="p-3 text-center text-white/50 text-xs">No matching products in inventory</div>
                        ) : (
                          matchingProducts.map((invItem) => (
                            <div
                              key={invItem.id}
                              onClick={() => handleAddProductItemToReturn(invItem)}
                              className="p-3 hover:bg-blue-500/15 cursor-pointer flex items-center justify-between transition-colors text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-white text-xs flex items-center gap-2">
                                  <span>{invItem.name}</span>
                                  <span className="text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">({invItem.code || invItem.barcode})</span>
                                </div>
                                <div className="text-[11px] text-blue-300 font-mono font-semibold flex items-center gap-2">
                                  <span>Cost: ₹{invItem.costPrice?.toLocaleString()}</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-slate-200">Stock: <strong className="text-white font-bold">{invItem.currentStock}</strong> {invItem.uom}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
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
                    className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                  >
                    + Add Component Line
                  </button>
                </div>

                <div className="space-y-3">
                  {lineItems.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40 space-y-1">
                      <p className="font-bold text-white/60">No returned items added to purchase return bill yet.</p>
                      <p>Scan a product barcode or use the Inventory search bar above to add products.</p>
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
                              value={line.hsnCode || '84713010'}
                              onChange={(e) => handleUpdateLineItem(line.id, { hsnCode: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono text-center text-xs"
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
                              className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white text-xs font-bold text-center"
                            />
                          </div>

                          {/* Unit Rate (₹) */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Unit Cost (<span className="normal-case font-sans font-bold">₹</span>)</label>
                            <input
                              type="number"
                              value={line.unitPrice}
                              onChange={(e) => handleUpdateLineItem(line.id, { unitPrice: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-300 text-xs font-bold font-mono text-right"
                            />
                          </div>

                          {/* Per-Item Part Discount Option (% or ₹) */}
                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold flex items-center justify-between">
                              <span>Part Disc</span>
                              <span className="text-blue-300 text-[9px] font-mono">({line.discountType === 'percent' ? '%' : <span className="normal-case font-sans font-bold">₹</span>})</span>
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={line.discount || 0}
                                onChange={(e) => handleUpdateLineItem(line.id, { discount: Math.max(0, Number(e.target.value)) })}
                                placeholder={line.discountType === 'percent' ? '10%' : '500'}
                                className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-amber-300 text-xs font-bold font-mono text-right"
                              />
                              <select
                                value={line.discountType || 'fixed'}
                                onChange={(e) => handleUpdateLineItem(line.id, { discountType: e.target.value as 'fixed' | 'percent' })}
                                className="p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-xs text-blue-300 font-bold cursor-pointer"
                              >
                                <option value="fixed">₹</option>
                                <option value="percent">%</option>
                              </select>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-1 text-right">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Subtotal</label>
                            <div className="font-extrabold text-blue-300 text-xs pt-2 font-mono">₹{line.totalPrice?.toLocaleString()}</div>
                          </div>

                          {/* Delete Component Line Item Button */}
                          <div className="col-span-1 flex items-center justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(line.id)}
                              className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Component Line Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* DYNAMIC REMARKS & REFURBISHED FIELDS */}
                        {(formData.showProductRemarksOnPrint || (formData.showRefurbishedBadgeOnPrint && line.productCondition === 'Refurbished')) && (
                          <div className="grid grid-cols-1 gap-3 pt-2 border-t border-white/5">
                            {formData.showProductRemarksOnPrint && (
                              <div>
                                <label className="block text-[9px] text-white/40 uppercase mb-1 font-bold">
                                  Line Serial No / IMEI / Remarks (3 Lines Supported)
                                </label>
                                <textarea
                                  rows={3}
                                  placeholder="Line Serial No / IMEI / Remarks (e.g. Serial # S/N-9988273&#10;Model Variant: 8GB DDR4&#10;Warranty: DOA Reversal)..."
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
                                  placeholder="Refurbished Warranty Details (e.g. Returned for Vendor Replacement)..."
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
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Debit Reversal Remarks &amp; Internal Notes</label>
                    <textarea
                      rows={3}
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="e.g. Vendor RMA Defective Return & Debit Reversal Claim..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Debit Note Terms &amp; Conditions Clauses</label>
                    <textarea
                      rows={4}
                      value={formData.termsAndConditions}
                      onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                      placeholder="Enter debit note terms and conditions line by line..."
                      className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-mono leading-relaxed"
                    />
                  </div>
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
                    <span>Computed Tax Reversal:</span>
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
                        className="p-1 rounded-lg bg-[#161B22] border border-white/10 text-[11px] text-blue-300 font-bold cursor-pointer"
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
                        className="w-24 p-1 rounded-lg bg-white/5 border border-white/10 text-right text-xs font-bold text-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm">
                    <span className="font-extrabold text-white">Debit Note Grand Total:</span>
                    <span className="font-mono font-black text-xl text-blue-400">₹{grandTotalCalc.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewReturnOpen(false)}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {editingReturnId ? 'Update Debit Note' : 'Issue Debit Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK VENDOR REGISTRATION MODAL */}
      {showQuickVendorModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4 font-sans">
          <div className="glass-panel p-6 rounded-3xl border border-blue-500/40 w-full max-w-md bg-[#0D1117] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" /> Register Supplier Vendor
              </h3>
              <button onClick={() => setShowQuickVendorModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickVendor} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Vendor Company Name *</label>
                <input
                  type="text"
                  required
                  value={quickVendor.companyName}
                  onChange={(e) => setQuickVendor({ ...quickVendor, companyName: e.target.value })}
                  placeholder="Enter vendor firm / distributor name..."
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Contact Person</label>
                <input
                  type="text"
                  value={quickVendor.contactPerson}
                  onChange={(e) => setQuickVendor({ ...quickVendor, contactPerson: e.target.value })}
                  placeholder="Sales / Account manager..."
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Mobile / Phone *</label>
                <input
                  type="text"
                  required
                  value={quickVendor.phone}
                  onChange={(e) => setQuickVendor({ ...quickVendor, phone: e.target.value })}
                  placeholder="10-digit phone number..."
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  value={quickVendor.gstin}
                  onChange={(e) => setQuickVendor({ ...quickVendor, gstin: e.target.value.toUpperCase() })}
                  placeholder="08AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Address (Optional)</label>
                <input
                  type="text"
                  value={quickVendor.address}
                  onChange={(e) => setQuickVendor({ ...quickVendor, address: e.target.value })}
                  placeholder="City, station address..."
                  className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowQuickVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase shadow-lg shadow-blue-600/30"
                >
                  Register &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
