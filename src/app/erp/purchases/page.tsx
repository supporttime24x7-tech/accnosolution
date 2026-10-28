'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingBag, Plus, Search, Filter, Printer, Trash2, Eye, DollarSign,
  Calendar, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, ChevronDown, User, Package, X, Check,
  Building, Phone, MapPin, Tag, ShieldCheck, ArrowRight, RefreshCw, CreditCard, Sparkles, Barcode, Edit2, Truck, Landmark, RotateCw
} from 'lucide-react';
import { useErpStore, PurchaseInvoiceItem, TransactionItemLine, VendorItem, InventoryItem } from '@/lib/store';
import { fetchPurchaseInvoicesFromSupabase } from '@/lib/supabase-sync';

// Searchable Product Combobox Component for Purchase Line Items
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
        className="w-full p-2.5 rounded-xl bg-[#161B22] border border-blue-500/40 text-white text-xs font-semibold text-left flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer"
      >
        <span className="truncate pr-2 font-mono">
          {selectedItem
            ? `${selectedItem.name} (Stock: ${selectedItem.currentStock} ${selectedItem.uom}) - Cost: ₹${selectedItem.costPrice.toLocaleString()}`
            : 'Select Inward Product / Inventory Item...'}
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
                placeholder="🔍 Search product name, SKU, HSN, barcode..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-blue-400"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-white/10 max-h-48">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-white/40 text-xs">No matching products found in inventory</div>
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

                  <div className="text-right font-mono font-bold text-blue-400">
                    ₹{item.costPrice?.toLocaleString()}
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

export default function PurchasesPage() {
  const {
    purchaseInvoices,
    vendors,
    inventory,
    vendorRules,
    purchaseRules,
    companyDetails,
    addPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    setPurchaseInvoices,
    addVendor,
    updateVendorRules,
  } = useErpStore();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncingCloud(true);
    setSyncStatusMsg('Syncing with Supabase Cloud...');
    try {
      const data = await fetchPurchaseInvoicesFromSupabase();
      if (Array.isArray(data)) {
        setPurchaseInvoices(data);
        setSyncStatusMsg(`Synced ${data.length} bills from Cloud`);
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
    fetchPurchaseInvoicesFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPurchaseInvoices(data);
      }
    }).catch(() => {});
  }, [setPurchaseInvoices]);

  const [isMounted, setIsMounted] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [activePurchaseView, setActivePurchaseView] = useState<PurchaseInvoiceItem | null>(null);
  const [paymentModalBill, setPaymentModalBill] = useState<PurchaseInvoiceItem | null>(null);
  const [paymentInput, setPaymentInput] = useState<number>(0);
  const [paymentModeInput, setPaymentModeInput] = useState<string>('Bank Transfer (NEFT/RTGS)');
  const [showQuickVendorModal, setShowQuickVendorModal] = useState(false);

  // Vendor Autocomplete Search States
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  // Barcode & Product Catalog Search States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Print Choice Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printTargetBill, setPrintTargetBill] = useState<PurchaseInvoiceItem | null>(null);
  const [printPaperFormat, setPrintPaperFormat] = useState<'A4' | 'A5'>('A4');

  // Quick Vendor Registration Form State
  const [quickVendor, setQuickVendor] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    gstin: '',
    address: '',
  });

  // Helper to compute initial form state dynamically
  const getInitialFormData = () => {
    const defaultVendor = vendors[0];
    const prefix = purchaseRules?.purchaseBillPrefix || vendorRules?.standardPrefix || 'PUR-';
    const startNo = purchaseRules?.purchaseBillStartNo || vendorRules?.standardStartWithNo || 1001;
    const nextBillNo = `${prefix}${startNo + purchaseInvoices.length}`;

    const defaultSupplyType: 'INTRA_STATE' | 'INTER_STATE' = 
      (purchaseRules?.defaultGstSupplyType?.includes('Inter-State') || purchaseRules?.defaultGstSupplyType?.includes('IGST')) 
        ? 'INTER_STATE' : 'INTRA_STATE';

    return {
      billNo: nextBillNo,
      billDate: new Date().toISOString().slice(0, 16),
      vendorId: defaultVendor?.id || '',
      vendorName: defaultVendor?.companyName || defaultVendor?.name || '',
      vendorPhone: defaultVendor?.phone || '',
      vendorGst: defaultVendor?.gstin || '',
      vendorAddress: defaultVendor?.fullAddress || defaultVendor?.address || '',
      supplyType: defaultSupplyType,
      paymentTerms: purchaseRules?.defaultPaymentTerms || 'Credit 30 Days',
      paymentMethod: 'Bank Transfer (NEFT/RTGS)',
      gstTaxMode: `${purchaseRules?.defaultTaxRate || 18}% GST`,
      poRefNo: '',
      freightCharges: 0,
      discount: 0,
      discountType: 'fixed' as 'fixed' | 'percent',
      initialPaid: 0,
      showProductRemarksOnPrint: purchaseRules?.showProductRemarksOnPrint ?? true,
      showRefurbishedBadgeOnPrint: purchaseRules?.showRefurbishedBadgeOnPrint ?? true,
      remarks: '',
    };
  };

  // Purchase Bill Form State
  const [formData, setFormData] = useState(getInitialFormData);

  // Line items state for inward purchase
  const [lineItems, setLineItems] = useState<TransactionItemLine[]>([]);

  // Open Clean / Empty Create Purchase Bill Modal
  const openCreatePurchaseModal = () => {
    setEditingBillId(null);
    const initial = getInitialFormData();
    setFormData(initial);
    setLineItems([]);
    setVendorSearchQuery('');
    setProductSearchQuery('');
    setIsNewBillOpen(true);

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 150);
  };

  // Open Edit / Modify Existing Generated Purchase Invoice Modal
  const openEditModalForPurchase = (bill: PurchaseInvoiceItem) => {
    setEditingBillId(bill.id);
    setFormData({
      billNo: bill.billNo,
      billDate: new Date(bill.billDate).toISOString().slice(0, 16),
      vendorId: bill.vendorId || '',
      vendorName: bill.vendorName || '',
      vendorPhone: bill.vendorPhone || '',
      vendorGst: bill.vendorGst || '',
      vendorAddress: bill.vendorAddress || '',
      supplyType: bill.supplyType || 'INTRA_STATE',
      paymentTerms: bill.paymentTerms || 'Credit 30 Days',
      paymentMethod: bill.paymentMethod || 'Bank Transfer (NEFT/RTGS)',
      gstTaxMode: '18% GST (9% + 9%)',
      poRefNo: bill.poRefNo || '',
      freightCharges: bill.freightCharges || 0,
      discount: bill.discount || 0,
      discountType: bill.discountType || 'fixed',
      initialPaid: bill.paidAmount || 0,
      showProductRemarksOnPrint: bill.showProductRemarksOnPrint !== undefined ? bill.showProductRemarksOnPrint : true,
      showRefurbishedBadgeOnPrint: bill.showRefurbishedBadgeOnPrint !== undefined ? bill.showRefurbishedBadgeOnPrint : true,
      remarks: bill.remarks || '',
    });
    setLineItems(bill.items ? JSON.parse(JSON.stringify(bill.items)) : []);
    setVendorSearchQuery(bill.vendorName || '');
    setProductSearchQuery('');
    setIsNewBillOpen(true);
  };

  // Select Vendor Account from Autocomplete
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

  // Add Item to Purchase via Barcode Scan or Catalog Dropdown
  const handleAddProductItemToPurchase = (invItem: InventoryItem) => {
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
        id: `pli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
      handleAddProductItemToPurchase(match);
    } else {
      alert(`No product found in inventory matching barcode/search "${scannedQuery}".`);
    }
  };

  // Add blank line item
  const handleAddLineItem = () => {
    const newLine: TransactionItemLine = {
      id: `pli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  // Remove line item
  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((l) => l.id !== id));
  };

  // Quick Vendor Registration Submit
  const handleSaveQuickVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVendor.companyName || !quickVendor.phone) {
      alert('Please provide Vendor Company Name and Mobile/Phone Number.');
      return;
    }
    const newId = `ven-${Date.now()}`;
    addVendor({
      vendorType: 'Standard Vendor',
      companyName: quickVendor.companyName,
      name: quickVendor.contactPerson || quickVendor.companyName,
      contactPerson: quickVendor.contactPerson || 'Purchasing Manager',
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
    alert(`Vendor Supplier "${quickVendor.companyName}" registered and selected!`);
  };

  // Compute Purchase Financial Totals (Memoized)
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
    return Math.round(Math.max(0, totalItemsSum + taxSum + Number(formData.freightCharges || 0) - computedOverallDiscount));
  }, [totalItemsSum, taxSum, formData.freightCharges, computedOverallDiscount]);

  const initialBalanceDue = useMemo(() => {
    return Math.max(0, grandTotalCalc - Number(formData.initialPaid || 0));
  }, [grandTotalCalc, formData.initialPaid]);

  // Save / Submit Purchase Bill
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorName) {
      alert('Please enter or select a Supplier Vendor Name.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one inward component line to the purchase bill.');
      return;
    }

    const paidVal = Number(formData.initialPaid || 0);
    const balVal = Math.max(0, grandTotalCalc - paidVal);
    const payStatus: 'Paid' | 'Partial' | 'Unpaid' = balVal === 0 ? 'Paid' : paidVal > 0 ? 'Partial' : 'Unpaid';

    if (editingBillId) {
      updatePurchaseInvoice(editingBillId, {
        billNo: formData.billNo,
        billDate: new Date(formData.billDate).toISOString(),
        vendorId: formData.vendorId || 'v-gen',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        vendorGst: formData.vendorGst,
        vendorAddress: formData.vendorAddress,
        supplyType: formData.supplyType,
        paymentTerms: formData.paymentTerms,
        paymentMethod: formData.paymentMethod,
        poRefNo: formData.poRefNo,
        items: lineItems,
        subtotal: totalItemsSum,
        discount: computedOverallDiscount,
        discountType: formData.discountType,
        taxAmount: taxSum,
        freightCharges: Number(formData.freightCharges || 0),
        grandTotal: grandTotalCalc,
        paidAmount: paidVal,
        balanceDue: balVal,
        paymentStatus: payStatus,
        showProductRemarksOnPrint: formData.showProductRemarksOnPrint,
        showRefurbishedBadgeOnPrint: formData.showRefurbishedBadgeOnPrint,
        remarks: formData.remarks,
      });

      alert(`Purchase Entry "${formData.billNo}" updated successfully!`);
    } else {
      addPurchaseInvoice({
        billNo: formData.billNo || `PUR-${Date.now()}`,
        billDate: new Date(formData.billDate).toISOString(),
        vendorId: formData.vendorId || 'v-gen',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        vendorGst: formData.vendorGst,
        vendorAddress: formData.vendorAddress,
        supplyType: formData.supplyType,
        paymentTerms: formData.paymentTerms,
        paymentMethod: formData.paymentMethod,
        poRefNo: formData.poRefNo,
        items: lineItems,
        subtotal: totalItemsSum,
        discount: computedOverallDiscount,
        discountType: formData.discountType,
        taxAmount: taxSum,
        freightCharges: Number(formData.freightCharges || 0),
        grandTotal: grandTotalCalc,
        paidAmount: paidVal,
        balanceDue: balVal,
        paymentStatus: payStatus,
        showProductRemarksOnPrint: formData.showProductRemarksOnPrint,
        showRefurbishedBadgeOnPrint: formData.showRefurbishedBadgeOnPrint,
        remarks: formData.remarks,
      });

      alert(`Purchase Entry "${formData.billNo}" saved successfully!\nStock automatically updated for all inward items.`);
    }

    setIsNewBillOpen(false);
  };

  // Record Vendor Payment Submit
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBill) return;
    const newPaid = Math.min(paymentModalBill.grandTotal, paymentModalBill.paidAmount + Number(paymentInput));
    const newBalance = Math.max(0, paymentModalBill.grandTotal - newPaid);
    const newStatus = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

    updatePurchaseInvoice(paymentModalBill.id, {
      paidAmount: newPaid,
      balanceDue: newBalance,
      paymentStatus: newStatus,
    });

    alert(`Vendor Payment of ₹${paymentInput.toLocaleString()} recorded for Bill ${paymentModalBill.billNo}.`);
    setPaymentModalBill(null);
  };

  // Print Vendor Inward Voucher (A4 or A5 Sheet)
  const handlePrintVoucher = (bill: PurchaseInvoiceItem, paperFormat?: 'A4' | 'A5' | 'THERMAL') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const paper = paperFormat || (purchaseRules?.defaultPrintPaperFormat as 'A4' | 'A5') || 'A4';
    const isInterState = bill.vendorGst && companyDetails.gstin && bill.vendorGst.substring(0, 2) !== companyDetails.gstin.substring(0, 2);
    const upiVpa = companyDetails.merchantUpiId || 'support.time24x7-1@okhdfcbank';
    const upiPayee = companyDetails.companyLegalName || 'ACCNO SOLUTION';
    const payableAmount = bill.balanceDue > 0 ? bill.balanceDue : bill.grandTotal;
    const upiString = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}&am=${payableAmount}&cu=INR&tn=Bill_${bill.billNo}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${encodeURIComponent(upiString)}`;

    const padding = paper === 'A5' ? '4px 6px' : '6px 8px';
    const fontSz = paper === 'A5' ? '9.5px' : '11px';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PURCHASE TAX INVOICE - ${bill.billNo}</title>
          <style>
            @font-face {
              font-family: 'RupeeSystemFallback';
              src: local('Segoe UI'), local('Arial'), local('Roboto');
              unicode-range: U+20B9;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            @page { size: ${paper === 'A5' ? 'A5 portrait' : 'A4 portrait'}; margin: ${paper === 'A5' ? '5mm' : '10mm'}; }
            body { font-family: 'RupeeSystemFallback', 'Segoe UI', Arial, sans-serif !important; padding: 15px; color: #0f172a; max-width: 850px; margin: 0 auto; line-height: 1.3; background: #fff; min-height: 94vh; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; }
            .rupee-symbol { font-family: 'Segoe UI', Arial, sans-serif !important; text-transform: none !important; display: inline-block; color: #ffffff !important; }
            .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; border-collapse: collapse; }
            .company { font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.1; }
            .meta { font-size: 10px; color: #0f172a; font-weight: 600; line-height: 1.3; }
            .doc-title { font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; text-align: right; }
            
            .info-grid { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
            .info-card { flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 11px; overflow: hidden; }
            .info-card-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 5px; }

            .bill-table-container { border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; margin-top: 8px; margin-bottom: 12px; }
            table.bill-table { width: 100%; border-collapse: collapse; font-size: 11px; color: #0f172a; }
            table.bill-table th, table.bill-table td { border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; padding: ${padding}; text-align: left; }
            table.bill-table th { background-color: #000000 !important; background: #000000 !important; color: #ffffff !important; text-transform: uppercase; font-size: 9px; letter-spacing: 0.4px; font-weight: 800; white-space: nowrap; }

            .summary-section { display: flex; justify-content: space-between; align-items: stretch; gap: 12px; margin-top: 12px; }
            .left-summary { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
            .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 8px 10px; font-size: 10px; overflow: hidden; display: flex; align-items: center; justify-content: space-between; flex-grow: 1; margin-bottom: 6px; }
            .bank-title { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
            
            .totals-card { width: 330px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 11px; overflow: hidden; }
            .totals-row { display: flex; justify-content: space-between; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0; }
            .grand-total-row { display: flex; justify-content: space-between; font-size: 14.5px; font-weight: 900; color: #059669; border-top: 2px solid #0f172a; padding-top: 5px; margin-top: 3px; }

            .sig-section { display: flex; justify-content: space-between; margin-top: 25px; pt: 10px; font-size: 10.5px; }
            .sig-box { text-align: center; width: 220px; }
            .sig-line { border-top: 1px solid #0f172a; margin-top: 35px; pt: 3px; font-weight: 700; color: #0f172a; }
          </style>
        </head>
        <body>
          <div>
            <!-- HEADER BAR -->
            <table class="header-table">
              <tr>
                <td style="vertical-align: top; width: 58%; border: none;">
                  <div style="display: flex; align-items: center;">
                    ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" alt="Logo" style="max-height: 52px; max-width: 110px; object-fit: contain; margin-right: 14px; vertical-align: top;" />` : ''}
                    <div>
                      <div class="company">${companyDetails.companyLegalName}</div>
                      <div class="meta">${companyDetails.addressLine1}</div>
                      <div class="meta">${companyDetails.city}, ${companyDetails.state}${companyDetails.stateCode ? ` - ${companyDetails.stateCode}` : ''}</div>
                      <div class="meta" style="margin-top: 2px;"><strong>GSTIN:</strong> ${companyDetails.gstin}</div>
                      <div class="meta" style="white-space: nowrap;"><strong>Ph:</strong> ${companyDetails.phoneNumber} | <strong>Email:</strong> ${companyDetails.email}</div>
                    </div>
                  </div>
                </td>
                <td style="text-align: right; vertical-align: top; width: 42%; border: none;">
                  <div class="doc-title">PURCHASE TAX INVOICE</div>
                  <div style="font-size: 8px; font-weight: 800; color: #0f172a; text-transform: uppercase; white-space: nowrap; margin-top: 2px; text-align: right;">[ ORIGINAL FOR SUPPLIER / INWARD ENTRY ]</div>
                  <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 6px;">BILL NO: <span style="font-family: monospace;">${bill.billNo}</span></div>
                  <div style="font-size: 10px; font-weight: 600;">Bill Date: <strong>${new Date(bill.billDate).toLocaleDateString()}</strong></div>
                  <div style="font-size: 10px; font-weight: 600;">Payment Terms: <strong>${bill.paymentTerms || 'Credit 30 Days'}</strong></div>
                  ${bill.poRefNo ? `<div style="font-size: 10px; font-weight: 600;">PO / Inward Ref #: <strong style="font-family: monospace;">${bill.poRefNo}</strong></div>` : ''}
                </td>
              </tr>
            </table>

            <!-- VENDOR & SUMMARY INFO GRID -->
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-title">SUPPLIER VENDOR DETAILS:</div>
                <div style="font-weight: 900; font-size: 12.5px; color: #0f172a;">${bill.vendorName}</div>
                <div style="font-weight: 600;">Phone: <strong>${bill.vendorPhone || 'N/A'}</strong></div>
                <div style="font-weight: 600;">Address: ${bill.vendorAddress || 'Vendor Address'}</div>
                <div style="font-weight: 600;">GSTIN / UIN: <strong>${bill.vendorGst || 'URP (Unregistered Person)'}</strong></div>
              </div>

              <div class="info-card">
                <div class="info-card-title">PROCUREMENT &amp; TAX SUMMARY:</div>
                <div style="font-weight: 600;">GST Supply Type: <strong style="color: #1e40af;">${bill.supplyType === 'INTER_STATE' || isInterState ? 'Inter-State (IGST Input Credit)' : 'Intra-State (CGST + SGST Input Credit)'}</strong></div>
                <div style="font-weight: 600;">Payment Status: <span style="font-weight: 900; color: ${bill.paymentStatus === 'Paid' ? '#16a34a' : bill.paymentStatus === 'Partial' ? '#d97706' : '#dc2626'}">${bill.paymentStatus.toUpperCase()}</span></div>
                <div style="font-weight: 600;">Payment Method: <strong>${bill.paymentMethod || 'Bank Transfer / NEFT'}</strong></div>
                <div style="font-weight: 600;">ITC Eligibility: <strong style="color: #16a34a;">Eligible for Full Input Tax Credit</strong></div>
              </div>
            </div>

            <!-- LINE ITEMS TABLE -->
            <div class="bill-table-container">
              <table class="bill-table">
                <thead>
                  <tr style="background: #000000 !important; color: #ffffff !important; text-transform: uppercase; font-size: 9px; line-height: 1.2; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 25px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">S.N.</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 58%; text-align: left; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">INWARD ITEM DESCRIPTION</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 55px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">HSN/SAC</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 28px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">QTY</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 72px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">COST RATE (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                    <th style="padding: 5px 6px; border-right: 1px solid #334155; width: 40px; text-align: center; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">GST %</th>
                    <th style="padding: 5px 6px; width: 82px; text-align: right; white-space: nowrap; background: #000000 !important; color: #ffffff !important;">TOTAL AMOUNT (<span class="rupee-symbol" style="color: #ffffff !important;">₹</span>)</th>
                  </tr>
                </thead>
                <tbody>
                  ${bill.items.map((line, idx) => `
                    <tr style="${idx % 2 === 1 ? 'background: #f8fafc;' : ''}">
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${idx + 1}</td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">
                        <strong style="font-size: ${fontSz}; color: #0f172a;">${line.name}</strong>
                        ${(bill.showProductRemarksOnPrint !== false && line.remarks) ? `<div style="font-size: 9px; color: #64748b; font-weight: 500; margin-top: 1px; white-space: pre-line;">${line.remarks.replace(/\n/g, '<br/>')}</div>` : ''}
                        ${(bill.showRefurbishedBadgeOnPrint !== false && (line.productCondition === 'Refurbished' || line.refurbishedDescription)) ? `
                          <div style="margin-top: 2px; padding: 3px 5px; background: #fffbeb; border-left: 3px solid #d97706; border-radius: 4px; font-size: 9px; color: #78350f;">
                            <strong>★ Refurbished Item:</strong> ${(line.refurbishedDescription || 'Certified').replace(/\n/g, '<br/>')}
                          </div>
                        ` : ''}
                      </td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.hsnCode || '84713010'}</td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: bold;">${line.quantity}</td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: 600;">₹${line.unitPrice.toLocaleString()}</td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: 600;">${line.gstRate}%</td>
                      <td style="padding: ${padding}; border-top: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: bold;">₹${line.totalPrice.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- SUMMARY SECTION -->
            <div class="summary-section">
              <div class="left-summary">
                ${purchaseRules?.showBankDetailsOnVoucher !== false ? `
                  <div class="bank-box">
                    <div>
                      <div class="bank-title">BANK ACCOUNT &amp; NEFT DETAILS:</div>
                      <div><strong>Bank Name:</strong> ${companyDetails.bankDetails.bankName}</div>
                      <div><strong>Account Name:</strong> ${companyDetails.companyLegalName}</div>
                      <div><strong>A/C No:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.accountNumber}</span></div>
                      <div><strong>IFSC Code:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.bankDetails.ifscCode}</span> | <strong>Branch:</strong> ${companyDetails.bankDetails.branchName || 'Sanchore Main'}</div>
                      ${companyDetails.merchantUpiId ? `<div><strong>UPI VPA:</strong> <span style="font-family: monospace; font-weight: bold;">${companyDetails.merchantUpiId}</span></div>` : ''}
                    </div>
                    <div style="text-align: center; margin-left: 10px; flex-shrink: 0;">
                      <img src="${qrCodeUrl}" alt="UPI QR" style="width: 65px; height: 65px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 2px; background: #fff;" />
                      <div style="font-size: 7.5px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-top: 2px;">SCAN &amp; PAY UPI</div>
                    </div>
                  </div>
                ` : ''}

                ${purchaseRules?.showInwardLogisticsNotes !== false ? `
                  <div style="padding: 6px 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 9.5px; color: #0f172a; font-weight: 600;">
                    <strong>Remarks / Logistics Notes:</strong> ${bill.remarks ? bill.remarks.replace(/\n/g, '<br/>') : 'Direct Factory Distribution Batch Procurement. Eligible for Input Tax Credit (ITC) under GST Act.'}
                  </div>
                ` : ''}
              </div>

              <div class="totals-card">
                <div class="totals-row">
                  <span>Taxable Items Subtotal:</span>
                  <span style="font-family: monospace; font-weight: bold;">₹${bill.subtotal.toLocaleString()}</span>
                </div>
                ${isInterState ? `
                  <div class="totals-row">
                    <span>Integrated GST (IGST Input):</span>
                    <span style="font-family: monospace; font-weight: bold; color: #1d4ed8;">+₹${bill.taxAmount.toLocaleString()}</span>
                  </div>
                ` : `
                  <div class="totals-row">
                    <span>Central GST (CGST 9% Avg):</span>
                    <span style="font-family: monospace; font-weight: bold; color: #1d4ed8;">+₹${(bill.taxAmount / 2).toLocaleString()}</span>
                  </div>
                  <div class="totals-row">
                    <span>State GST (SGST 9% Avg):</span>
                    <span style="font-family: monospace; font-weight: bold; color: #1d4ed8;">+₹${(bill.taxAmount / 2).toLocaleString()}</span>
                  </div>
                `}
                ${bill.freightCharges ? `
                  <div class="totals-row">
                    <span>Freight / Inward Transport:</span>
                    <span style="font-family: monospace; font-weight: bold;">+₹${bill.freightCharges.toLocaleString()}</span>
                  </div>
                ` : ''}
                ${bill.discount ? `
                  <div class="totals-row">
                    <span>Purchase Discount:</span>
                    <span style="font-family: monospace; font-weight: bold; color: #dc2626;">-₹${bill.discount.toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="grand-total-row">
                  <span>PURCHASE GRAND TOTAL:</span>
                  <span style="font-family: monospace;">₹${bill.grandTotal.toLocaleString()}</span>
                </div>
                <div class="totals-row" style="margin-top: 3px;">
                  <span>Amount Cleared / Paid:</span>
                  <span style="font-family: monospace; font-weight: bold; color: #16a34a;">₹${bill.paidAmount.toLocaleString()}</span>
                </div>
                <div class="totals-row" style="font-weight: 900; color: #dc2626;">
                  <span>BALANCE PAYABLE DUE:</span>
                  <span style="font-family: monospace;">₹${bill.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER & SIGNATORY -->
          <div class="sig-section">
            <div style="width: 60%; color: #0f172a; font-weight: 600; line-height: 1.3;">
              <strong style="text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 2px;">Inward Procurement Terms:</strong>
              ${(purchaseRules?.termsAndConditions || [
                '1. Inward stock verified & added into system inventory store.',
                '2. Goods received in good physical condition with OEM serial numbers.',
                '3. Input Tax Credit (ITC) claimed as per GST Act Section 16 provisions.',
                '4. Subject to Sanchore Jurisdiction only.',
              ]).join('<br/>')}
            </div>
            <div class="sig-box">
              <div style="font-size: 11px; font-weight: 800; color: #0f172a;">For <strong>${companyDetails.companyLegalName}</strong></div>
              <div class="sig-line">AUTHORIZED RECEIVING SIGNATORY</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Filter Purchase Invoices (Memoized)
  const filteredPurchases = useMemo(() => {
    const q = search.toLowerCase().trim();
    return purchaseInvoices.filter((p) => {
      const pDateObj = new Date(p.billDate);
      const pDateIso = p.billDate ? p.billDate.split('T')[0] : '';
      const pDateFormatted1 = pDateObj.toLocaleDateString();
      const pDateFormatted2 = pDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const pDateFormatted3 = pDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();

      const matchesSearch =
        !q ||
        p.billNo.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        (p.vendorPhone && p.vendorPhone.includes(q)) ||
        (p.vendorGst && p.vendorGst.toLowerCase().includes(q)) ||
        pDateIso.includes(q) ||
        pDateFormatted1.toLowerCase().includes(q) ||
        pDateFormatted2.toLowerCase().includes(q) ||
        pDateFormatted3.includes(q);

      const matchesStatus = statusFilter === 'ALL' || p.paymentStatus.toUpperCase() === statusFilter;

      // Date Range Filtering
      let matchesDateRange = true;
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (pDateObj < start) matchesDateRange = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (pDateObj > end) matchesDateRange = false;
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [purchaseInvoices, search, statusFilter, startDate, endDate]);

  // Filter Vendors for Autocomplete
  const matchingVendors = useMemo(() => {
    const q = vendorSearchQuery.toLowerCase().trim();
    if (!q) return [];
    return vendors.filter(
      (v) =>
        (v.companyName && v.companyName.toLowerCase().includes(q)) ||
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.phone && v.phone.includes(q)) ||
        (v.gstin && v.gstin.toLowerCase().includes(q)) ||
        (v.code && v.code.toLowerCase().includes(q))
    );
  }, [vendors, vendorSearchQuery]);

  // Filter Inventory Products for Barcode & Search Autocomplete
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
  const totalProcurement = useMemo(() => purchaseInvoices.reduce((a, b) => a + b.grandTotal, 0), [purchaseInvoices]);
  const totalPaidVendor = useMemo(() => purchaseInvoices.reduce((a, b) => a + b.paidAmount, 0), [purchaseInvoices]);
  const totalPayableVendor = useMemo(() => purchaseInvoices.reduce((a, b) => a + b.balanceDue, 0), [purchaseInvoices]);
  const totalItc = useMemo(() => purchaseInvoices.reduce((a, b) => a + b.taxAmount, 0), [purchaseInvoices]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070B0E] text-white p-6 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-blue-400 text-sm font-bold">
          <span className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
          Loading Inward Procurement Directory...
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
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
              Vendor Inward Procurement Ledger
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wide mt-1 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-blue-400" />
            PURCHASE BILLS &amp; INWARD PROCUREMENT
          </h1>
          <p className="text-xs text-white/50">
            Record inward inventory stock supplies from vendors, calculate Input Tax Credit (ITC), and manage Accounts Payable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncStatusMsg && (
            <span className="text-[11px] text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-lg animate-fade-in font-medium">
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
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{isSyncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            onClick={openCreatePurchaseModal}
            className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> + Record New Purchase Bill
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Procurement Expense</span>
          <div className="text-xl font-extrabold text-blue-400 font-mono">₹{totalProcurement.toLocaleString()}</div>
          <p className="text-[10px] text-white/40">{purchaseInvoices.length} Inward Vendor Bills</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Vendor Payments Cleared</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">₹{totalPaidVendor.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-400/70">Cleared Vendor Bills</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Accounts Payable Outstanding</span>
          <div className="text-xl font-extrabold text-amber-400 font-mono">₹{totalPayableVendor.toLocaleString()}</div>
          <p className="text-[10px] text-amber-400/70">Pending Vendor Credit Liabilities</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Input Tax Credit (ITC)</span>
          <div className="text-xl font-extrabold text-[#5ED29C] font-mono">₹{totalItc.toLocaleString()}</div>
          <p className="text-[10px] text-[#5ED29C]/70">Eligible GST Input Reclaim</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR WITH DATE SEARCH & DATE RANGE PICKER */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="🔍 Search vendor bill number, supplier name, phone, GSTIN, or date (e.g. 18/8/2026, Aug 2026)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-blue-500"
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
                    ? 'bg-blue-500 text-white border-blue-500'
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
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  datePreset === p.id && !startDate && !endDate
                    ? 'bg-blue-500 text-white border-blue-500 font-extrabold'
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

      {/* PURCHASE BILLS DATA TABLE */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/50 text-[10px] uppercase font-black border-b border-white/10">
                <th className="p-4">Vendor Bill # &amp; Inward Date</th>
                <th className="p-4">Supplier Vendor</th>
                <th className="p-4 text-center">Terms</th>
                <th className="p-4 text-right">Taxable Cost</th>
                <th className="p-4 text-right">Grand Total (₹)</th>
                <th className="p-4 text-right">Paid Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-white/40 font-mono">
                    No purchase bills found matching your search or date criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-extrabold text-blue-400 text-xs">{bill.billNo}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">
                        {new Date(bill.billDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{bill.vendorName}</div>
                      {bill.vendorGst && (
                        <div className="text-[10px] text-[#5ED29C] font-mono font-semibold">
                          GST: {bill.vendorGst}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span className="px-2 py-1 rounded bg-white/5 text-white/60 text-[10px] font-mono border border-white/10">
                        {bill.paymentTerms || 'Credit 30 Days'}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-semibold text-white/80">
                      ₹{bill.subtotal?.toLocaleString()}
                    </td>

                    <td className="p-4 text-right font-mono font-extrabold text-white text-sm">
                      ₹{bill.grandTotal?.toLocaleString()}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      ₹{bill.paidAmount?.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border ${
                        bill.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : bill.paymentStatus === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Modify / Edit Purchase Button */}
                        <button
                          onClick={() => openEditModalForPurchase(bill)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/30 cursor-pointer"
                          title="Modify / Edit Purchase Invoice"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* View Purchase Details Button */}
                        <button
                          onClick={() => setActivePurchaseView(bill)}
                          className="p-1.5 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/10 cursor-pointer"
                          title="View Full Purchase Invoice Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Record Vendor Payment Button */}
                        {bill.balanceDue > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalBill(bill);
                              setPaymentInput(bill.balanceDue);
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
                            title="Record Vendor Payment Receipt"
                          >
                            + Record Pay
                          </button>
                        )}

                        {/* Print Purchase Voucher Button */}
                        <button
                          onClick={() => {
                            setPrintTargetBill(bill);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30 cursor-pointer"
                          title="Print Vendor Inward Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Purchase Bill Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete Purchase Bill "${bill.billNo}"?`)) {
                              deletePurchaseInvoice(bill.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 cursor-pointer"
                          title="Delete Purchase Bill"
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

      {/* MODAL 1: CREATE / EDIT PURCHASE BILL (CONFIGURED TO MATCH COMMERCIAL SALES INVOICE LAYOUT & WIDTH) */}
      {isNewBillOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/40 w-full max-w-[1320px] max-h-[92vh] overflow-y-auto space-y-6 bg-[#0D1117] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {editingBillId ? `MODIFY VENDOR PURCHASE BILL (${formData.billNo})` : 'RECORD VENDOR INWARD PURCHASE BILL'}
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    {editingBillId ? 'Update inward stock supply parameters, tax breakdown, and vendor payable details.' : 'Inward stock supply entry with automatic inventory stock addition & Input Tax Credit (ITC) calculation.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewBillOpen(false)}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSavePurchase} className="space-y-6 text-xs">
              {/* PRIMARY PURCHASE IDENTIFIERS (4 COLUMNS) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Vendor Bill / Inward No *</label>
                  <input
                    type="text"
                    required
                    value={formData.billNo}
                    onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Inward Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.billDate}
                    onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Payment Terms *</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-bold"
                  >
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Immediate Cash">Immediate Cash / Spot Pay</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">GST Supply Type</label>
                  <select
                    value={formData.supplyType}
                    onChange={(e) => setFormData({ ...formData, supplyType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-400 font-bold"
                  >
                    <option value="INTRA_STATE">Intra-State (CGST + SGST)</option>
                    <option value="INTER_STATE">Inter-State (IGST Out-of-State)</option>
                  </select>
                </div>
              </div>

              {/* SUPPLIER VENDOR INFORMATION WITH AUTOCOMPLETE */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" /> Supplier Vendor Information
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuickVendorModal(true)}
                    className="text-[10px] font-bold text-[#5ED29C] hover:underline uppercase flex items-center gap-1 cursor-pointer"
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
                        placeholder="🔍 Type Vendor Name, Mobile, or Code to Autocomplete..."
                        value={vendorSearchQuery}
                        onFocus={() => setShowVendorDropdown(true)}
                        onChange={(e) => {
                          setVendorSearchQuery(e.target.value);
                          setShowVendorDropdown(true);
                        }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161B22] border border-blue-500/40 text-white text-xs font-semibold placeholder:text-white/30 focus:outline-none focus:border-blue-400"
                      />
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                    </div>

                    {showVendorDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-[#161B22] border border-blue-500/50 rounded-xl shadow-2xl divide-y divide-white/10">
                        {matchingVendors.length === 0 ? (
                          <div className="p-3 text-center text-white/40 text-xs">No matching vendors in directory</div>
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
                                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">({v.phone || 'No Phone'})</span>
                                </div>
                                <div className="text-[11px] text-slate-200 font-mono">
                                  {v.gstin ? <span className="text-[#5ED29C] font-bold">GSTIN: {v.gstin}</span> : <span>{v.address || 'Local Vendor'}</span>}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-lg transition-colors shadow-sm"
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
                    <label className="block text-white/70 mb-1 font-bold">Phone Number</label>
                    <input
                      type="text"
                      value={formData.vendorPhone}
                      onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                      placeholder="Vendor mobile number..."
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
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Full Postal Address</label>
                    <input
                      type="text"
                      value={formData.vendorAddress}
                      onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                      placeholder="Full vendor station address..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* INWARD COMPONENT LINES & PRINT CONTROLS */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-400" /> Inward Component Lines (Auto Stock Addition)
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
                        <span>Print Serial / Batch / 3-Line Remarks</span>
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
                              onClick={() => handleAddProductItemToPurchase(invItem)}
                              className="p-3 hover:bg-blue-500/15 cursor-pointer flex items-center justify-between transition-colors text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-white text-xs flex items-center gap-2">
                                  <span>{invItem.name}</span>
                                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">({invItem.code || invItem.barcode})</span>
                                </div>
                                <div className="text-[11px] text-blue-300 font-mono font-semibold flex items-center gap-2">
                                  <span>Cost: ₹{invItem.costPrice?.toLocaleString()}</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-slate-200">Stock: <strong className="text-white font-bold">{invItem.currentStock}</strong> {invItem.uom}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors shadow-sm"
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
                    className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                  >
                    + Add Component Line
                  </button>
                </div>

                <div className="space-y-3">
                  {lineItems.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40 space-y-1">
                      <p className="font-bold text-white/60">No items added to purchase bill yet.</p>
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
                              value={line.hsnCode || '84713010'}
                              onChange={(e) => handleUpdateLineItem(line.id, { hsnCode: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-white font-mono text-center text-xs"
                            />
                          </div>

                          {/* Inward Quantity */}
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

                          {/* Cost Rate (₹) */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Cost Rate (<span className="normal-case font-sans font-bold">₹</span>)</label>
                            <input
                              type="number"
                              value={line.unitPrice}
                              onChange={(e) => handleUpdateLineItem(line.id, { unitPrice: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-blue-400 text-xs font-bold font-mono text-right"
                            />
                          </div>

                          {/* Per-Item Part Discount Option (% or ₹) */}
                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold flex items-center justify-between">
                              <span>Part Disc</span>
                              <span className="text-blue-400 text-[9px] font-mono">({line.discountType === 'percent' ? '%' : <span className="normal-case font-sans font-bold">₹</span>})</span>
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
                                className="p-2.5 rounded-xl bg-[#161B22] border border-white/10 text-xs text-blue-400 font-bold cursor-pointer"
                              >
                                <option value="fixed">₹</option>
                                <option value="percent">%</option>
                              </select>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-5 sm:col-span-2 lg:col-span-1 text-right">
                            <label className="block text-[9px] text-white/40 uppercase mb-0.5 font-bold">Subtotal</label>
                            <div className="font-extrabold text-blue-400 text-xs pt-2 font-mono">₹{line.totalPrice?.toLocaleString()}</div>
                          </div>

                          {/* Delete Item Line Button */}
                          <div className="col-span-1 flex items-center justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(line.id)}
                              className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Item Line"
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
                                  Line Serial No / Batch NO / IMEI / Remarks (3 Lines Supported)
                                </label>
                                <textarea
                                  rows={3}
                                  placeholder="Line item remarks (e.g. Serial # S/N-9988273&#10;Batch NO: B-2026-99&#10;Warranty terms: 3 Years Manufacturer Warranty)..."
                                  value={line.remarks || ''}
                                  onChange={(e) => handleUpdateLineItem(line.id, { remarks: e.target.value })}
                                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs font-mono leading-normal resize-y"
                                />
                              </div>
                            )}

                            {formData.showRefurbishedBadgeOnPrint && (line.productCondition === 'Refurbished' || line.refurbishedDescription) && (
                              <div>
                                <label className="block text-[9px] text-amber-400/80 uppercase mb-1 font-bold">
                                  Refurbished Component Description &amp; Warranty
                                </label>
                                <input
                                  type="text"
                                  placeholder="Refurbished Warranty Details (e.g. Certified Vendor Refurbished)..."
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

              {/* FINANCIAL BREAKDOWN & LOGISTICS NOTES (MATCHES SALES INVOICE LAYOUT) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">PO / Inward E-Way Bill / LR Tracking Ref #</label>
                    <input
                      type="text"
                      value={formData.poRefNo}
                      onChange={(e) => setFormData({ ...formData, poRefNo: e.target.value })}
                      placeholder="e.g. PO-9988, E-Way Bill # 88273, Courier tracking #..."
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Remarks &amp; Internal Logistics Notes</label>
                    <textarea
                      rows={4}
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="e.g. Carrier details, warehouse shelf location, freight invoice numbers..."
                      className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-mono"
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
                    <span>Input GST (ITC Amount):</span>
                    <span className="text-blue-400 font-bold">+₹{taxSum.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/70">
                    <span>Inward Freight / Transport:</span>
                    <input
                      type="number"
                      value={formData.freightCharges}
                      onChange={(e) => setFormData({ ...formData, freightCharges: Number(e.target.value) })}
                      className="w-24 p-1 rounded-lg bg-white/5 border border-white/10 text-right text-xs font-bold text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center text-white/70">
                    <div className="flex items-center gap-1.5">
                      <span>Discount Adjustment:</span>
                      <select
                        value={formData.discountType || 'fixed'}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'fixed' | 'percent' })}
                        className="p-1 rounded-lg bg-[#161B22] border border-white/10 text-[11px] text-blue-400 font-bold cursor-pointer"
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
                    <span className="font-extrabold text-white text-sm">Purchase Bill Grand Total:</span>
                    <span className="font-black text-blue-400 text-lg">₹{grandTotalCalc.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/70 pt-2 border-t border-white/10">
                    <span className="font-bold text-emerald-400">Initial Vendor Payment Cleared (<span className="normal-case font-sans font-bold">₹</span>):</span>
                    <input
                      type="number"
                      value={formData.initialPaid}
                      onChange={(e) => setFormData({ ...formData, initialPaid: Number(e.target.value) })}
                      className="w-28 p-1.5 rounded-lg bg-white/5 border border-emerald-500/40 text-right text-xs font-black text-emerald-400 font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1 font-mono text-xs">
                    <span className="font-bold text-amber-400">Balance Accounts Payable Credit Due:</span>
                    <span className="font-black text-amber-400">₹{initialBalanceDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* HIGH-CONTRAST ACTION FOOTER BAR */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBillOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> {editingBillId ? 'Update Purchase Entry' : 'Save Purchase Entry &amp; Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK REGISTER NEW VENDOR */}
      {showQuickVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" /> Register Supplier Vendor
              </h3>
              <button onClick={() => setShowQuickVendorModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickVendor} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Company Name *</label>
                <input
                  type="text"
                  required
                  value={quickVendor.companyName}
                  onChange={(e) => setQuickVendor({ ...quickVendor, companyName: e.target.value })}
                  placeholder="Supertron Electronics Pvt Ltd"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Contact Person</label>
                <input
                  type="text"
                  value={quickVendor.contactPerson}
                  onChange={(e) => setQuickVendor({ ...quickVendor, contactPerson: e.target.value })}
                  placeholder="Account Manager Name"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Mobile/Phone Number *</label>
                <input
                  type="text"
                  required
                  value={quickVendor.phone}
                  onChange={(e) => setQuickVendor({ ...quickVendor, phone: e.target.value })}
                  placeholder="+91 98290-00000"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">GSTIN Number</label>
                <input
                  type="text"
                  value={quickVendor.gstin}
                  onChange={(e) => setQuickVendor({ ...quickVendor, gstin: e.target.value.toUpperCase() })}
                  placeholder="08AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Vendor Full Address</label>
                <input
                  type="text"
                  value={quickVendor.address}
                  onChange={(e) => setQuickVendor({ ...quickVendor, address: e.target.value })}
                  placeholder="Full supplier station address..."
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold uppercase"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD VENDOR PAYMENT */}
      {paymentModalBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Record Vendor Payment
                </h3>
                <p className="text-[10px] text-white/50">Bill: <span className="font-mono text-blue-400 font-bold">{paymentModalBill.billNo}</span></p>
              </div>
              <button onClick={() => setPaymentModalBill(null)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1 font-mono">
                <div className="flex justify-between text-white/60"><span>Bill Grand Total:</span><span className="text-white font-bold">₹{paymentModalBill.grandTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-white/60"><span>Previously Paid:</span><span className="text-emerald-400 font-bold">₹{paymentModalBill.paidAmount.toLocaleString()}</span></div>
                <div className="flex justify-between text-white/60"><span>Accounts Payable Due:</span><span className="text-amber-400 font-bold">₹{paymentModalBill.balanceDue.toLocaleString()}</span></div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Payment Amount to Record (₹) *</label>
                <input
                  type="number"
                  required
                  max={paymentModalBill.balanceDue}
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Payment Mode</label>
                <select
                  value={paymentModeInput}
                  onChange={(e) => setPaymentModeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                >
                  <option value="Bank Transfer (NEFT/RTGS)">HDFC Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI / Online">UPI / GPay Business</option>
                  <option value="Cash">Cash Tendered</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalBill(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase"
                >
                  Save Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW FULL PURCHASE DETAILS MODAL */}
      {activePurchaseView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl w-full max-w-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Vendor Purchase Inward Summary
                </span>
                <h2 className="text-lg font-black text-white uppercase tracking-wide mt-1">
                  PURCHASE BILL: <span className="text-blue-400 font-mono">{activePurchaseView.billNo}</span>
                </h2>
              </div>
              <button onClick={() => setActivePurchaseView(null)} className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Supplier Vendor Info</span>
                <div className="font-extrabold text-white text-sm">{activePurchaseView.vendorName}</div>
                <div className="text-white/60">Phone: {activePurchaseView.vendorPhone || 'N/A'}</div>
                <div className="text-[#5ED29C] font-mono">GSTIN: {activePurchaseView.vendorGst || 'URP / Unregistered'}</div>
                <div className="text-white/60">Address: {activePurchaseView.vendorAddress || 'Local Supplier Station'}</div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5 font-mono">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Inward Procurement Summary</span>
                <div className="text-white">Inward Date: {new Date(activePurchaseView.billDate).toLocaleString()}</div>
                <div className="text-white">Payment Terms: {activePurchaseView.paymentTerms || 'Credit 30 Days'}</div>
                {activePurchaseView.poRefNo && <div className="text-white font-bold">PO / Ref #: {activePurchaseView.poRefNo}</div>}
                <div className="text-white">Payment Status: <strong className="text-emerald-400">{activePurchaseView.paymentStatus}</strong></div>
                <div className="text-white">Payment Method: {activePurchaseView.paymentMethod || 'Bank Transfer'}</div>
              </div>
            </div>

            {/* Inward Items Table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white/50 text-[10px] uppercase font-black border-b border-white/10">
                    <th className="p-3">#</th>
                    <th className="p-3">Inward Component Item</th>
                    <th className="p-3 text-center">HSN</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Cost Rate (₹)</th>
                    <th className="p-3 text-right">Subtotal (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {activePurchaseView.items.map((line, idx) => (
                    <tr key={line.id}>
                      <td className="p-3 text-white/40">{idx + 1}</td>
                      <td className="p-3 font-sans">
                        <strong className="text-white font-bold">{line.name}</strong>
                        {line.remarks && <div className="text-[10px] text-white/40">{line.remarks}</div>}
                      </td>
                      <td className="p-3 text-center text-white/70">{line.hsnCode || '84713010'}</td>
                      <td className="p-3 text-center font-bold text-white">{line.quantity}</td>
                      <td className="p-3 text-right text-blue-400">₹{line.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-white">₹{line.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Card */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white/40 uppercase">Internal Logistics Notes:</span>
                <p className="text-white/80 font-sans">{activePurchaseView.remarks || 'No internal logistics notes recorded.'}</p>
              </div>

              <div className="space-y-1.5 text-right shrink-0">
                <div className="text-white/60">Items Taxable Cost: ₹{activePurchaseView.subtotal?.toLocaleString()}</div>
                <div className="text-blue-400">Input Tax Credit (ITC): +₹{activePurchaseView.taxAmount?.toLocaleString()}</div>
                {activePurchaseView.discount ? <div className="text-rose-400">Purchase Discount: -₹{activePurchaseView.discount?.toLocaleString()}</div> : null}
                <div className="text-white font-black text-sm border-t border-white/10 pt-1">Grand Total: ₹{activePurchaseView.grandTotal?.toLocaleString()}</div>
                <div className="text-emerald-400 font-bold">Paid: ₹{activePurchaseView.paidAmount?.toLocaleString()}</div>
                <div className="text-amber-400 font-bold">Payable Due: ₹{activePurchaseView.balanceDue?.toLocaleString()}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setPrintTargetBill(activePurchaseView);
                  setShowPrintModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Printer className="w-4 h-4" /> Print Inward Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINT PAPER FORMAT CHOICE MODAL */}
      {showPrintModal && printTargetBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                  <Printer className="w-4 h-4 text-blue-400" /> Print Vendor Inward Voucher
                </h3>
                <p className="text-[10px] text-white/50">Select Paper Format for Voucher: <span className="font-mono text-blue-400 font-bold">{printTargetBill.billNo}</span></p>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-white/70">Select Paper Sheet Size:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A4')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    printPaperFormat === 'A4'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="font-extrabold text-xs">A4 Standard Sheet</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Full sheet with comprehensive ITC &amp; vendor details</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintPaperFormat('A5')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    printPaperFormat === 'A5'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="font-extrabold text-xs">A5 Compact Sheet</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Single-page compact receiving voucher</div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrintModal(false);
                  handlePrintVoucher(printTargetBill, printPaperFormat);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Voucher Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
