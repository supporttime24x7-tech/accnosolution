'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  CreditCard, Search, Plus, Minus, Trash2, Printer, QrCode, DollarSign,
  User, CheckCircle2, ShoppingCart, Percent, ArrowRight, X, ShieldCheck, Tag, Package, Cpu,
  Clock, PauseCircle, PlayCircle, FileText, Sparkles, Calculator, Award, Phone, MapPin, Building2,
  RefreshCw, Filter, Layers, Edit2, Calendar, RotateCw
} from 'lucide-react';
import { useErpStore, PosCartItem, CustomerItem, SalesInvoiceItem } from '@/lib/store';
import { fetchInventoryFromSupabase, fetchCustomersFromSupabase } from '@/lib/supabase-sync';

export default function ErpPosPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateUnitPrice,
    clearCart,
    inventory,
    setInventory,
    updateInventoryItem,
    companyDetails,
    customers,
    setCustomers,
    addCustomer,
    selectedCustomer,
    setSelectedCustomer,
    salesInvoices,
    addSalesInvoice,
    posRules,
    currentUser,
  } = useErpStore();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncingCloud(true);
    setSyncStatusMsg('Syncing products & customers with Cloud...');
    try {
      const [freshInv, freshCust] = await Promise.all([
        fetchInventoryFromSupabase(),
        fetchCustomersFromSupabase(),
      ]);
      if (Array.isArray(freshInv)) setInventory(freshInv);
      if (Array.isArray(freshCust)) setCustomers(freshCust);
      setSyncStatusMsg('POS Cloud Catalog Synced');
    } catch {
      setSyncStatusMsg('Sync error occurred');
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const [isMounted, setIsMounted] = React.useState(false);
  const barcodeInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 150);
  }, []);

  // Search & Filters
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  // Custom Bill / Invoice Number & Backdated Entry Date States
  const prefixPattern = posRules?.posPrefix || 'POS-';
  const startCounter = posRules?.posStartWithNo || 1001;
  const [customBillNo, setCustomBillNo] = useState<string>(`${prefixPattern}${startCounter}`);

  // Auto-generate POS Bill Sequence starting at configured prefix and startNo
  const handleAutoGenerateBillNo = () => {
    const posInvs = (salesInvoices || []).filter((inv) => inv.invoiceNo && inv.invoiceNo.startsWith(prefixPattern));
    const nextSeq = startCounter + posInvs.length;
    setCustomBillNo(`${prefixPattern}${nextSeq}`);
  };

  React.useEffect(() => {
    if (isMounted && salesInvoices) {
      const posInvs = salesInvoices.filter((inv) => inv.invoiceNo && inv.invoiceNo.startsWith(prefixPattern));
      setCustomBillNo(`${prefixPattern}${startCounter + posInvs.length}`);
    }
  }, [isMounted, salesInvoices?.length, prefixPattern, startCounter]);

  const [customBillDate, setCustomBillDate] = useState<string>(
    () => new Date().toISOString().slice(0, 16) // format YYYY-MM-DDTHH:mm
  );

  // POS Rules Active Configuration Flags
  const isDiscountEnabled = posRules?.enableDiscountControl ?? true;
  const maxDiscountLimit = posRules?.maxDiscountPercent ?? 20;
  const isLoyaltyEnabled = posRules?.enableLoyaltyRedemption ?? true;
  const isHoldParkEnabled = posRules?.enableHoldParkBills ?? true;
  const isMerchantQrEnabled = posRules?.showMerchantQr ?? true;

  // Handle Add to Cart with Stock Verification Rule & Auto Quantity Increments
  const handleAddToCartWithStockCheck = (item: PosCartItem) => {
    const allowNegative = posRules?.allowNegativeStock ?? false;
    const invItem = inventory.find((i) => i.id === item.id || i.code === item.sku || i.barcode === item.sku);
    const existingInCart = cart.find((c) => c.id === item.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    const availableStock = invItem ? (invItem.currentStock || 0) : 999;

    if (!allowNegative && invItem && availableStock <= currentQtyInCart) {
      alert(`⚠️ OUT OF STOCK ALERT\n\n"${item.name}" has only ${availableStock} in stock.\nNegative Stock Billing is disabled in POS Rules.`);
      setTimeout(() => barcodeInputRef.current?.focus(), 50);
      return;
    }

    addToCart(item);
    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 50);
  };

  // Payment & Modal States
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'split'>(
    () => posRules?.defaultPaymentMethod || 'upi'
  );
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [cardApprovalCode, setCardApprovalCode] = useState<string>('');
  const [upiRefNo, setUpiRefNo] = useState<string>('');
  const [showUpiModal, setShowUpiModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [lastPrintedInvoiceNo, setLastPrintedInvoiceNo] = useState<string>('');

  // Discount & Loyalty States (Supports Fixed ₹ or Percent %)
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);

  // Quick Customer Creation Modal State
  const [showNewCustModal, setShowNewCustModal] = useState<boolean>(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    mobile: '',
    gstin: '',
    billingAddress: '',
    companyName: '',
  });

  // Hold / Resume Cart (Parked Bills) State
  const [parkedCarts, setParkedCarts] = useState<{
    id: string;
    customer: any;
    cart: PosCartItem[];
    timestamp: string;
    total: number;
  }[]>([]);
  const [showParkedModal, setShowParkedModal] = useState<boolean>(false);

  // Per Item Serial Number / Note Editing State
  const [serialInputs, setSerialInputs] = useState<{ [itemId: string]: string }>({});

  // Convert Store Inventory items to POS catalog items (Memoized)
  const storeCatalogItems: PosCartItem[] = useMemo(() => {
    return inventory.map((inv) => ({
      id: inv.id,
      name: inv.name,
      sku: inv.code || inv.barcode || '',
      code: inv.code || '',
      barcode: inv.barcode || '',
      unit_price: inv.sellingPrice,
      quantity: 1,
      gst_rate: inv.gstRate || 18,
      type: inv.itemType === 'Retail Part' ? 'part' : 'service',
      description: inv.description,
      remarks: inv.comfortabilityFeatures || inv.description,
      productImage: inv.productImage || '',
      category: inv.category || 'Retail Part',
      productGroup: inv.productGroup || 'General Inventory',
      productCondition: inv.productCondition || 'New',
      refurbishedDescription: inv.refurbishedDescription || '',
    }));
  }, [inventory]);

  // Filter Categories & Product Groups Lists (Memoized)
  const categoriesList = useMemo(() => {
    return ['All', ...Array.from(new Set(inventory.map((i) => i.category).filter(Boolean)))];
  }, [inventory]);

  const productGroupsList = useMemo(() => {
    return ['All', ...Array.from(new Set(inventory.map((i) => i.productGroup).filter(Boolean)))];
  }, [inventory]);

  // Filtered Catalog by Category, Product Group & Search Barcode (Memoized)
  const filteredCatalog = useMemo(() => {
    const q = barcodeInput.toLowerCase().trim();
    return storeCatalogItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesGroup = selectedGroup === 'All' || item.productGroup === selectedGroup;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.productGroup && item.productGroup.toLowerCase().includes(q));
      return matchesCategory && matchesGroup && matchesSearch;
    });
  }, [storeCatalogItems, selectedCategory, selectedGroup, barcodeInput]);

  // Extract included PC parts list for custom assembled PCs
  const getPcPartsRemarks = (item: PosCartItem) => {
    const desc = item.description || item.remarks || '';
    if (
      desc.includes('Assembled Desktop PC comprising:') ||
      desc.includes('Assembled Parts:') ||
      desc.includes('Included Parts:') ||
      item.name.toLowerCase().includes('custom') ||
      item.name.toLowerCase().includes('desktop pc') ||
      item.name.toLowerCase().includes('workstation')
    ) {
      let partsStr = desc;
      if (partsStr.includes('Assembled Desktop PC comprising:')) {
        partsStr = partsStr.split('Assembled Desktop PC comprising:')[1]?.split('\n')[0] || partsStr;
      } else if (partsStr.includes('Assembled Parts:')) {
        partsStr = partsStr.split('Assembled Parts:')[1]?.split('\n')[0] || partsStr;
      } else if (partsStr.includes('Included Parts:')) {
        partsStr = partsStr.split('Included Parts:')[1]?.split('\n')[0] || partsStr;
      }
      return partsStr.trim();
    }
    return item.remarks || null;
  };

  // Financial Calculations Enforced by POS Rules
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  // Computed Bill Discount (Fixed ₹ or Percent %) Enforced by POS Rules
  const computedDiscount = !isDiscountEnabled
    ? 0
    : discountType === 'percent'
    ? (cartSubtotal * Math.min(maxDiscountLimit, Math.max(0, discountValue))) / 100
    : Math.min(cartSubtotal, Math.max(0, discountValue));

  const custPoints = (selectedCustomer as any)?.loyaltyPoints || 0;
  const loyaltyDiscount = isLoyaltyEnabled && useLoyaltyPoints && custPoints ? Math.min(cartSubtotal, custPoints) : 0;

  const netSubtotal = Math.max(0, cartSubtotal - computedDiscount - loyaltyDiscount);
  const totalGst = netSubtotal * 0.18;
  const grandTotal = netSubtotal + totalGst;
  const changeReturn = paymentMethod === 'cash' && cashTendered > grandTotal ? cashTendered - grandTotal : 0;

  // Handle Barcode Scan / Fast Add with Multi-Field Matching & Auto Refocus
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawQuery = barcodeInput.trim();
    if (!rawQuery) return;

    const query = rawQuery.toLowerCase();
    const digitsOnlyQuery = rawQuery.replace(/\D/g, '');

    // 1. Check exact match on barcode / code / sku / id
    let found = storeCatalogItems.find(
      (item) =>
        (item.barcode && item.barcode.toLowerCase() === query) ||
        (item.code && item.code.toLowerCase() === query) ||
        (item.sku && item.sku.toLowerCase() === query) ||
        item.id.toLowerCase() === query
    );

    // 2. If digits only query (e.g. 5032037278776), check matching barcode digits
    if (!found && digitsOnlyQuery.length >= 4) {
      found = storeCatalogItems.find((item) => {
        const itemBarcodeDigits = (item.barcode || '').replace(/\D/g, '');
        const itemCodeDigits = (item.code || '').replace(/\D/g, '');
        const itemSkuDigits = (item.sku || '').replace(/\D/g, '');
        return (
          (itemBarcodeDigits && itemBarcodeDigits === digitsOnlyQuery) ||
          (itemCodeDigits && itemCodeDigits === digitsOnlyQuery) ||
          (itemSkuDigits && itemSkuDigits === digitsOnlyQuery)
        );
      });
    }

    // 3. Partial match if no exact barcode match
    if (!found && filteredCatalog.length > 0) {
      found = filteredCatalog[0];
    }

    if (found) {
      handleAddToCartWithStockCheck(found);
      setBarcodeInput('');
    } else {
      alert(`No product found matching barcode or search query "${rawQuery}".`);
      setBarcodeInput('');
    }

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 50);
  };

  // On-the-fly Customer Creation
  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.name || !newCustForm.mobile) {
      alert('Please fill in Customer Name and Mobile Number.');
      return;
    }

    addCustomer({
      name: newCustForm.name,
      mobile: newCustForm.mobile,
      companyName: newCustForm.companyName,
      gstin: newCustForm.gstin,
      billingAddress: newCustForm.billingAddress || 'Sanchore, Rajasthan',
      category: newCustForm.gstin ? 'Sundry Debtor (B2B)' : 'Sundry Debtor',
      accountGroup: 'Retail / Walk-In',
      accountStatus: 'Active',
      creditLimit: newCustForm.gstin ? 100000 : 25000,
      outstandingBalance: 0,
      loyaltyPoints: 50,
    });

    const newlyCreated = customers[0] || {
      id: `c-${Date.now()}`,
      name: newCustForm.name,
      mobile: newCustForm.mobile,
      gstin: newCustForm.gstin,
      billingAddress: newCustForm.billingAddress,
    };
    setSelectedCustomer(newlyCreated as any);
    setShowNewCustModal(false);
    setNewCustForm({ name: '', mobile: '', gstin: '', billingAddress: '', companyName: '' });
  };

  // Hold / Park Cart
  const handleParkCart = () => {
    if (cart.length === 0) return;
    const parkId = `PARK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newParked = {
      id: parkId,
      customer: selectedCustomer || { id: 'c-walkin', name: 'Walk-in Retail Customer', mobile: '' },
      cart: [...cart],
      timestamp: customBillDate ? new Date(customBillDate).toLocaleString() : new Date().toLocaleTimeString(),
      total: grandTotal,
    };
    setParkedCarts((prev) => [newParked, ...prev]);
    clearCart();
    alert(`Current bill parked successfully as #${parkId}! Ready for next customer.`);
  };

  // Resume Parked Cart
  const handleResumeParkedCart = (parkId: string) => {
    const parked = parkedCarts.find((p) => p.id === parkId);
    if (parked) {
      clearCart();
      parked.cart.forEach((item) => addToCart(item));
      setSelectedCustomer(parked.customer);
      setParkedCarts((prev) => prev.filter((p) => p.id !== parkId));
      setShowParkedModal(false);
    }
  };

  // Indian Currency Number to Words Converter
  const numberToWordsIndian = (num: number): string => {
    if (!num || num === 0) return 'Rupees Zero Only';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
    };
    return `Rupees ${inWords(Math.floor(num))} Only`;
  };

  // Print Bill / Invoice Handler (Supports Thermal Roll 80mm, A5 Compact, or Full A4 Tax Invoice with Backdated Entry)
  const handlePrintInvoice = (printType: 'thermal' | 'a4' | 'a5') => {
    if (cart.length === 0) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceNo = customBillNo || `POS-${1001 + (salesInvoices || []).filter((inv) => inv.invoiceNo?.startsWith('POS-')).length}`;
    setLastPrintedInvoiceNo(invoiceNo);

    // Save POS bill into Sales Invoices store if not already saved
    const newSalesInvoice: SalesInvoiceItem = {
      id: `sal-pos-${Date.now()}`,
      invoiceNo: invoiceNo,
      invoiceDate: customBillDate ? new Date(customBillDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      customerId: selectedCustomer?.id || 'c-walkin',
      customerName: selectedCustomer?.name || 'Walk-in Retail Customer',
      customerPhone: (selectedCustomer as any)?.mobile || (selectedCustomer as any)?.phone || '',
      customerGst: (selectedCustomer as any)?.gstin || (selectedCustomer as any)?.gst || '',
      customerAddress: (selectedCustomer as any)?.billingAddress || (selectedCustomer as any)?.address || '',
      paymentTerms: 'Immediate POS Cash/Terminal',
      paymentMethod: paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'upi' ? 'UPI / Online' : 'Credit / Debit Card',
      items: cart.map((item) => ({
        id: `sli-${item.id}-${Date.now()}`,
        itemId: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        hsnCode: '84713010',
        gstRate: item.gst_rate || 18,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.unit_price * item.quantity,
        serialNumber: serialInputs[item.id] || '',
        remarks: getPcPartsRemarks(item) || item.remarks || '',
        productCondition: item.productCondition,
        refurbishedDescription: item.refurbishedDescription,
      })),
      subtotal: cartSubtotal,
      discount: computedDiscount + loyaltyDiscount,
      discountType: discountType,
      taxAmount: totalGst,
      shippingCharges: 0,
      grandTotal: grandTotal,
      paidAmount: grandTotal,
      balanceDue: 0,
      paymentStatus: 'Paid',
      remarks: `POS Counter Bill ${invoiceNo}. Payment Mode: ${paymentMethod.toUpperCase()}${upiRefNo ? ` (Ref: ${upiRefNo})` : ''}`,
      created_at: new Date().toISOString(),
    };

    if (!salesInvoices.some((inv) => inv.invoiceNo === invoiceNo)) {
      addSalesInvoice(newSalesInvoice);

      const shouldDeductStock = posRules?.autoDeductInventory ?? true;
      if (shouldDeductStock) {
        // Automatically deduct item stock in Inventory store
        cart.forEach((item) => {
          const invItem = inventory.find((i) => i.id === item.id || i.code === item.sku || i.barcode === item.sku);
          if (invItem) {
            const updatedStock = Math.max(0, (invItem.currentStock || 0) - item.quantity);
            updateInventoryItem(invItem.id, { currentStock: updatedStock });
          }
        });
      }
    }

    const invoiceDateFormatted = customBillDate
      ? new Date(customBillDate).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : new Date().toLocaleString();

    const custName = selectedCustomer?.name || 'Walk-in Retail Customer';
    const custPhone = (selectedCustomer as any)?.mobile || (selectedCustomer as any)?.phone || 'N/A';
    const custGstin = (selectedCustomer as any)?.gstin || (selectedCustomer as any)?.gst || '';

    if (printType === 'thermal') {
      // 80mm Thermal Receipt Layout
      printWindow.document.write(`
        <html>
          <head>
            <title>POS RECEIPT - ${invoiceNo}</title>
            <style>
              body { font-family: monospace; width: 280px; padding: 10px; margin: 0 auto; color: #000; font-size: 11px; }
              .center { text-align: center; }
              .right { text-align: right; }
              .bold { font-weight: bold; }
              .border { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0; margin: 6px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 5px; }
              td, th { font-size: 10px; text-align: left; padding: 2px 0; vertical-align: top; }
              .remarks-box { font-size: 9px; padding-left: 6px; color: #222; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="center bold" style="font-size: 14px;">${companyDetails.companyLegalName}</div>
            <div class="center" style="font-size: 10px;">${companyDetails.addressLine1}, ${companyDetails.city}</div>
            <div class="center" style="font-size: 10px;">GSTIN: ${companyDetails.gstin} | Ph: ${companyDetails.phoneNumber}</div>
            
            <div class="border">
              <div>INV #: <strong>${invoiceNo}</strong></div>
              <div>DATE: ${invoiceDateFormatted}</div>
              <div>CUST: ${custName} (${custPhone})</div>
              <div>MODE: ${paymentMethod.toUpperCase()} ${upiRefNo ? `(Ref: ${upiRefNo})` : ''}</div>
            </div>

            <table>
              <thead>
                <tr style="border-bottom: 1px solid #000;">
                  <th>ITEM</th>
                  <th style="text-align: center;">QTY</th>
                  <th style="text-align: right;">AMT (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map((item) => {
                  const pcParts = getPcPartsRemarks(item);
                  const itemSerial = serialInputs[item.id];
                  const isRefurbished = item.productCondition === 'Refurbished' || item.refurbishedDescription;
                  return `
                    <tr>
                      <td style="font-weight: bold;">
                        ${item.name}
                        ${isRefurbished ? `<div class="remarks-box">[REFURBISHED]: ${item.refurbishedDescription || 'Refurbished Product'}</div>` : ''}
                        ${itemSerial ? `<div class="remarks-box">S/N: ${itemSerial}</div>` : ''}
                        ${pcParts ? `<div class="remarks-box">Parts: ${pcParts}</div>` : ''}
                      </td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="text-align: right; font-weight: bold;">${(item.unit_price * item.quantity).toLocaleString()}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="border">
              <div style="display: flex; justify-content: space-between;"><span>SUBTOTAL:</span><span>₹${cartSubtotal.toLocaleString()}</span></div>
              ${computedDiscount > 0 ? `<div style="display: flex; justify-content: space-between;"><span>DISCOUNT:</span><span>-₹${computedDiscount.toLocaleString()}</span></div>` : ''}
              ${loyaltyDiscount > 0 ? `<div style="display: flex; justify-content: space-between;"><span>LOYALTY PTS:</span><span>-₹${loyaltyDiscount.toLocaleString()}</span></div>` : ''}
              <div style="display: flex; justify-content: space-between;"><span>GST TAX (18%):</span><span>₹${totalGst.toLocaleString()}</span></div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-top: 4px;">
                <span>NET TOTAL:</span><span>₹${grandTotal.toLocaleString()}</span>
              </div>
              ${paymentMethod === 'cash' && cashTendered > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-top: 4px;"><span>CASH TENDERED:</span><span>₹${cashTendered.toLocaleString()}</span></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold;"><span>CHANGE RETURN:</span><span>₹${changeReturn.toLocaleString()}</span></div>
              ` : ''}
            </div>

            ${(posRules?.showTermsOnPosReceipt ?? true) ? `
              <div class="border" style="font-size: 8px; line-height: 1.3; text-align: left; padding: 4px 0;">
                <div style="font-weight: bold; text-align: center; margin-bottom: 2px;">TERMS &amp; CONDITIONS:</div>
                ${(posRules?.posTermsAndConditions || [
                  'Goods once sold will not be accepted back or exchanged without a valid GST tax invoice.',
                  'Hardware items carry manufacturer warranty. Physical, burnt, or liquid damage voids warranty.',
                  'Customers are advised to inspect products and verify serial numbers at the time of delivery.',
                  'Full payment is due upon counter delivery. Subject to Sanchore jurisdiction.',
                ]).map((term, i) => `<div>${i + 1}. ${term}</div>`).join('')}
              </div>
            ` : ''}

            <div class="center" style="margin-top: 10px; font-size: 10px;">
              *** THANK YOU FOR YOUR VISIT ***<br/>
              Hardware Warranty as per manufacturer terms.
            </div>
          </body>
        </html>
      `);
    } else {
      // Construct POS UPI QR String & Image URL
      const upiVpa = companyDetails.merchantUpiId || 'support.time24x7-1@okhdfcbank';
      const upiPayee = companyDetails.companyLegalName || 'ACCNO SOLUTION';
      const posUpiString = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}&am=${grandTotal}&cu=INR&tn=Invoice_${invoiceNo}`;
      const posQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${encodeURIComponent(posUpiString)}`;

      // Full A4 Tax Invoice Layout (Matching Repair Bills & Professional GST Standards)
      const custAddress = (selectedCustomer as any)?.billingAddress || (selectedCustomer as any)?.address || '';
      const baseTaxableTotal = netSubtotal / 1.18;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TAX INVOICE - ${invoiceNo}</title>
            <style>
              @font-face {
                font-family: 'RupeeSystemFallback';
                src: local('Segoe UI'), local('Arial'), local('Roboto');
                unicode-range: U+20B9;
              }
              body, table, th, td, div, span, p {
                font-family: 'RupeeSystemFallback', 'Segoe UI', Arial, sans-serif !important;
              }
              .rupee-symbol {
                font-family: 'Segoe UI', Arial, sans-serif !important;
                text-transform: none !important;
                display: inline-block;
              }
              @page { size: ${printType === 'a5' ? 'A5 portrait' : 'A4 portrait'}; margin: ${printType === 'a5' ? '5mm' : '10mm'}; }
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 15px; color: #0f172a; max-width: 850px; margin: 0 auto; line-height: 1.4; background: #fff; min-height: 94vh; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; }
              .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
              .company { font-size: 22px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
              .tagline { font-size: 10px; color: #475569; font-weight: 700; text-transform: uppercase; margin-top: 1px; }
              .meta { font-size: 10.5px; color: #334155; margin-top: 1px; }
              .doc-title { font-size: 18px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; text-align: right; }
              
              .info-grid { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
              .info-card { flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 11px; overflow: hidden; }
              .info-card-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 5px; }

              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              table.bill-table th, table.bill-table td { border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; padding: 4.5px 6.5px; text-align: left; font-size: 11px; }
              table.bill-table th { background-color: #000000 !important; background: #000000 !important; color: #ffffff !important; text-transform: uppercase; font-size: 9px; letter-spacing: 0.4px; font-weight: 800; white-space: nowrap; padding: 4px 6px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              
              .remarks-container { margin-top: 4px; padding: 4px 6px; background: #f8fafc; border-left: 3px solid #8b5cf6; border-radius: 6px; }
              .remarks-label { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #6b21a8; display: block; margin-bottom: 2px; }
              .remarks-content { font-size: 9.5px; color: #334155; font-family: monospace; font-weight: 600; }

              .summary-section { display: flex; justify-content: space-between; align-items: stretch; gap: 12px; margin-top: 12px; }
              .left-summary { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
              .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 8px 10px; font-size: 10px; overflow: hidden; display: flex; align-items: center; justify-content: space-between; flex-grow: 1; margin-bottom: 6px; }
              .bank-title { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
              .words-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px 10px; font-size: 10.5px; color: #1e40af; font-weight: 700; margin-bottom: 8px; overflow: hidden; }

              .totals-card { width: 330px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 11px; overflow: hidden; }
              .totals-row { display: flex; justify-content: space-between; padding: 2.5px 0; border-bottom: 1px dashed #e2e8f0; }
              .grand-total-row { display: flex; justify-content: space-between; font-size: 14.5px; font-weight: 900; color: #059669; border-top: 2px solid #0f172a; padding-top: 5px; margin-top: 3px; }

              .sig-section { display: flex; justify-content: space-between; margin-top: 25px; pt: 10px; font-size: 10.5px; }
              .sig-box { text-align: center; width: 220px; }
              .sig-line { border-top: 1px solid #0f172a; margin-top: 35px; pt: 3px; font-weight: 700; color: #0f172a; }

              .footer-legal { font-size: 9px; text-align: center; color: #64748b; margin-top: 12px; border-top: 1px dashed #cbd5e1; padding-top: 6px; }
            </style>
          </head>
          <body>
            <div>
              <table class="header-table">
                <tr>
                  <td style="vertical-align: top; width: 58%;">
                    <div style="display: flex; align-items: center;">
                      ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" alt="Logo" style="max-height: 52px; max-width: 110px; object-fit: contain; margin-right: 14px; vertical-align: top;" />` : ''}
                      <div>
                        <div class="company" style="font-size: 24px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 3px;">${companyDetails.companyLegalName}</div>
                        <!-- EXACT 2-LINE ADDRESS -->
                        <div class="meta" style="font-size: 10px; color: #0f172a; font-weight: 600; line-height: 1.3;">${companyDetails.addressLine1}</div>
                        <div class="meta" style="font-size: 10px; color: #0f172a; font-weight: 600; line-height: 1.3;">${companyDetails.city}, ${companyDetails.state}${companyDetails.stateCode ? ` - ${companyDetails.stateCode}` : ''}</div>
                        <!-- GSTIN LINE -->
                        <div class="meta" style="font-size: 10px; color: #0f172a; margin-top: 2px; font-weight: 600;"><strong>GSTIN:</strong> ${companyDetails.gstin}</div>
                        <!-- SINGLE LINE PHONE & EMAIL -->
                        <div class="meta" style="font-size: 10px; color: #0f172a; white-space: nowrap; font-weight: 600;"><strong>Ph:</strong> ${companyDetails.phoneNumber} | <strong>Email:</strong> ${companyDetails.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: top; width: 42%;">
                    <div class="doc-title" style="font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">GST INVOICE</div>
                    <div style="font-size: 8px; font-weight: 800; color: #0f172a; text-transform: uppercase; white-space: nowrap; margin-top: 2px; text-align: right;">[ ORIGINAL FOR RECIPIENT (CUSTOMER COPY) ]</div>
                    <div class="meta" style="margin-top: 6px; color: #0f172a; font-weight: 600;">Invoice No: <strong style="font-size: 13px; color: #0f172a;">${invoiceNo}</strong></div>
                    <div class="meta" style="color: #0f172a; font-weight: 600;">Invoice Date: <strong>${invoiceDateFormatted}</strong></div>
                    <div class="meta" style="color: #0f172a; font-weight: 600;">Terminal Station: <strong>${posRules?.terminalId || 'TERMINAL #01'}</strong></div>
                    <div class="meta" style="color: #0f172a; font-weight: 600;">Billed By: <strong>${currentUser?.name || 'Admin'}</strong></div>
                  </td>
                </tr>
              </table>

              <div class="info-grid">
                <div class="info-card" style="color: #0f172a;">
                  <div class="info-card-title">BILLED TO (CUSTOMER DETAILS):</div>
                  <div style="font-weight: 900; font-size: 12.5px; color: #0f172a;">${custName}</div>
                  ${(selectedCustomer as any)?.companyName ? `<div style="font-weight: 600; color: #0f172a;">${(selectedCustomer as any).companyName}</div>` : ''}
                  <div style="font-weight: 600;">Phone: <strong>${custPhone}</strong></div>
                  <div style="font-weight: 600;">Address: ${custAddress || 'Counter Walk-In Retail Sale'}</div>
                  <div style="font-weight: 600;">GSTIN / UIN: <strong>${custGstin || 'URP (Unregistered Person)'}</strong></div>
                </div>

                <div class="info-card" style="color: #0f172a;">
                  <div class="info-card-title">PAYMENT &amp; SETTLEMENT DETAILS:</div>
                  <div style="font-weight: 600;">Payment Mode: <strong style="text-transform: uppercase; color: #1e40af;">${paymentMethod.toUpperCase()}</strong></div>
                  <div style="font-weight: 600;">Payment Status: <span style="color: #059669; font-weight: 800;">PAID FULLY (₹${grandTotal.toLocaleString()})</span></div>
                  ${upiRefNo ? `<div style="font-weight: 600;">UPI Ref #: <strong style="font-family: monospace;">${upiRefNo}</strong></div>` : ''}
                  ${cardApprovalCode ? `<div style="font-weight: 600;">Approval Code: <strong style="font-family: monospace;">${cardApprovalCode}</strong></div>` : ''}
                  ${paymentMethod === 'cash' && cashTendered > 0 ? `
                    <div style="font-weight: 600;">Cash Received: <strong>₹${cashTendered.toLocaleString()}</strong> | Change Returned: <strong>₹${changeReturn.toLocaleString()}</strong></div>
                  ` : ''}
                  <div style="font-weight: 600;">Counter Delivery: <strong>Immediate Delivery</strong></div>
                </div>
              </div>

              <div class="bill-table-container">
                <table class="bill-table">
                  <thead>
                    <tr>
                      <th style="width: 20px; text-align: center;">#</th>
                      <th style="width: 54%;">PRODUCT DESCRIPTION</th>
                      <th style="width: 52px; text-align: center;">HSN/SAC</th>
                      <th style="width: 55px; text-align: center;">SKU Code</th>
                      <th style="width: 26px; text-align: center;">Qty</th>
                      <th style="width: 58px; text-align: right;">Rate (<span class="rupee-symbol">₹</span>)</th>
                      <th style="width: 60px; text-align: right;">Taxable (<span class="rupee-symbol">₹</span>)</th>
                      <th style="width: 32px; text-align: center;">GST</th>
                      <th style="width: 65px; text-align: right;">Total (<span class="rupee-symbol">₹</span>)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cart.map((item, idx) => {
                      const pcPartsRemarks = getPcPartsRemarks(item);
                      const serialNo = serialInputs[item.id];
                      const isRefurbished = item.productCondition === 'Refurbished' || item.refurbishedDescription;
                      const lineTotal = item.unit_price * item.quantity;
                      const taxableVal = (lineTotal / 1.18).toFixed(2);
                      return `
                        <tr style="${idx % 2 === 1 ? 'background: #f8fafc;' : ''}">
                          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                          <td>
                            <div style="font-weight: 800; font-size: 11.5px; color: #0f172a;">${item.name}</div>
                            <div style="font-size: 9px; color: #64748b; font-weight: 600;">[${item.type === 'service' ? 'Service Part' : 'Retail Part'} • ${item.category || 'Hardware'}]</div>
                            ${isRefurbished ? `
                              <div class="remarks-container" style="border-left-color: #d97706; background: #fffbeb;">
                                <span class="remarks-label" style="color: #b45309;">★ REFURBISHED PRODUCT DETAILS:</span>
                                <div class="remarks-content" style="color: #78350f;">${(item.refurbishedDescription || 'Refurbished - Tested & Certified Working with Store Warranty').replace(/\n/g, '<br/>')}</div>
                              </div>
                            ` : ''}
                            ${serialNo ? `<div style="font-size: 9.5px; color: #2563eb; font-weight: bold; margin-top: 2px;">Serial / IMEI #: ${serialNo}</div>` : ''}
                            ${pcPartsRemarks ? `
                              <div class="remarks-container">
                                <span class="remarks-label">Remarks (Assembled PC Specifications):</span>
                                <div class="remarks-content">${pcPartsRemarks}</div>
                              </div>
                            ` : ''}
                          </td>
                          <td style="text-align: center; font-family: monospace;">84713010</td>
                          <td style="text-align: center; font-family: monospace;">${item.sku}</td>
                          <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                          <td style="text-align: right; font-family: monospace;">₹${item.unit_price.toLocaleString()}</td>
                          <td style="text-align: right; font-family: monospace;">₹${Number(taxableVal).toLocaleString()}</td>
                          <td style="text-align: center; font-family: monospace;">18%</td>
                          <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${lineTotal.toLocaleString()}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <div class="summary-section">
                <div class="left-summary">
                  <div class="words-box">
                    Amount Chargeable (in words):<br/>
                    <strong style="font-size: 11px; text-transform: uppercase;">${numberToWordsIndian(grandTotal)}</strong>
                  </div>

                  <div class="bank-box">
                    <div>
                      <div class="bank-title">COMPANY BANK SETTLEMENT &amp; ELECTRONIC PAYMENT DETAILS:</div>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px;">
                        <div>Bank Name: <strong>${companyDetails.bankDetails.bankName}</strong></div>
                        <div>Account Holder: <strong>${companyDetails.bankDetails.accountHolderName}</strong></div>
                        <div>A/C Number: <strong style="font-family: monospace;">${companyDetails.bankDetails.accountNumber}</strong></div>
                        <div>IFSC Code: <strong style="font-family: monospace;">${companyDetails.bankDetails.ifscCode}</strong></div>
                        <div>Branch: <strong>${companyDetails.bankDetails.branchName}</strong></div>
                        <div>UPI VPA: <strong style="font-family: monospace;">${upiVpa}</strong></div>
                      </div>
                    </div>
                    <div style="text-align: center; margin-left: 10px; flex-shrink: 0;">
                      <img src="${posQrCodeUrl}" alt="UPI Payment QR" style="width: 80px; height: 80px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 2px; background: #ffffff;" />
                      <div style="font-size: 7.5px; font-weight: 800; color: #1e40af; margin-top: 2px; text-transform: uppercase;">SCAN &amp; PAY UPI</div>
                    </div>
                  </div>
                </div>

                <div class="totals-card">
                  <div class="totals-row">
                    <span>Total Taxable Amount (Base):</span>
                    <span style="font-family: monospace;">₹${baseTaxableTotal.toFixed(2)}</span>
                  </div>
                  <div class="totals-row">
                    <span>CGST (Central Tax @ 9%):</span>
                    <span style="font-family: monospace;">₹${(totalGst / 2).toFixed(2)}</span>
                  </div>
                  <div class="totals-row">
                    <span>SGST (State Tax @ 9%):</span>
                    <span style="font-family: monospace;">₹${(totalGst / 2).toFixed(2)}</span>
                  </div>
                  ${computedDiscount > 0 ? `
                    <div class="totals-row" style="color: #2563eb;">
                      <span>Cashier Discount (${discountType === 'percent' ? `${discountValue}%` : 'Fixed ₹'}):</span>
                      <span style="font-family: monospace;">-₹${computedDiscount.toLocaleString()}</span>
                    </div>
                  ` : ''}
                  ${loyaltyDiscount > 0 ? `
                    <div class="totals-row" style="color: #b45309;">
                      <span>Loyalty Points Redeemed:</span>
                      <span style="font-family: monospace;">-₹${loyaltyDiscount.toLocaleString()}</span>
                    </div>
                  ` : ''}
                  <div class="totals-row">
                    <span>Total GST Tax Amount (18%):</span>
                    <span style="font-family: monospace;">₹${totalGst.toFixed(2)}</span>
                  </div>
                  <div class="grand-total-row">
                    <span>GRAND TOTAL (INCL. TAX):</span>
                    <span style="font-family: monospace;">₹${grandTotal.toLocaleString()}</span>
                  </div>
                  <div class="totals-row" style="margin-top: 3px; font-weight: bold;">
                    <span>Total Amount Paid:</span>
                    <span style="font-family: monospace; color: #059669;">₹${grandTotal.toLocaleString()}</span>
                  </div>
                  <div class="totals-row" style="font-weight: bold;">
                    <span>Net Balance Due:</span>
                    <span style="font-family: monospace;">₹0.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: auto; padding-top: 15px;">
              ${(posRules?.showTermsOnPosReceipt ?? true) ? `
                <div style="padding: 8px 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 9.5px; color: #334155; margin-bottom: 12px;">
                  <strong style="color: #0f172a; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 3px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
                    TERMS &amp; CONDITIONS / WARRANTY &amp; RETURN POLICY:
                  </strong>
                  <ol style="margin: 0; padding-left: 14px; line-height: 1.3;">
                    <li style="margin-bottom: 1px;">Goods once sold will not be taken back without original tax invoice.</li>
                    <li style="margin-bottom: 1px;">Hardware items carry manufacturer warranty as per OEM policies.</li>
                    <li style="margin-bottom: 1px;">Physical, liquid, or burnt damage strictly voids warranty.</li>
                    <li style="margin-bottom: 1px;">Customers are requested to verify items &amp; serial numbers upon receipt.</li>
                    <li style="margin-bottom: 1px;">Subject to Sanchore Jurisdiction only.</li>
                    <li style="margin-bottom: 1px;">Payment due as per agreed billing credit terms.</li>
                  </ol>
                </div>
              ` : ''}

              <div class="sig-section">
                <div class="sig-box">
                  <div class="sig-line">Customer / Receiver Signature</div>
                  <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">(Received in Good Physical Condition)</div>
                </div>
                <div class="sig-box">
                  <div style="font-weight: bold; font-size: 9.5px; color: #0f172a;">For ${companyDetails.companyLegalName}</div>
                  <div class="sig-line" style="margin-top: 25px;">Authorized Signatory</div>
                </div>
              </div>

              <div class="footer-legal">
                This is a Computer Generated Tax Invoice. All computer hardware, components &amp; custom PC assemblies carry statutory warranty as per manufacturer terms.<br/>
                Thank you for your business! Visit again: <strong>${companyDetails.website}</strong>
              </div>
            </div>
          </body>
        </html>
      `);
    }

    printWindow.document.close();
    printWindow.print();
    setPaymentSuccess(true);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070B0E] text-white p-6 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-[#5ED29C] text-sm font-bold">
          <span className="w-3 h-3 rounded-full bg-[#5ED29C] animate-ping" />
          Loading POS Terminal...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: CATALOG, DUAL FILTERS & CUSTOMER BAR */}
      <div className="flex-1 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between overflow-y-auto space-y-5">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl font-extrabold uppercase text-white flex items-center gap-2 tracking-wider">
              <CreditCard className="w-5 h-5 text-[#5ED29C]" />
              POS COUNTER TERMINAL<span className="text-[#5ED29C]">.</span>
            </h1>
            <p className="text-xs text-white/50">Instant barcode scanning, rate adjustments, backdated entries &amp; GST counter invoices</p>
          </div>

          <div className="flex items-center gap-2">
            {syncStatusMsg && (
              <span className="text-[11px] text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-3 py-1 rounded-lg animate-fade-in font-medium">
                {syncStatusMsg}
              </span>
            )}

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncingCloud}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Force refresh catalog & customers directly from Supabase Cloud"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#5ED29C] ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            {/* PARKED CARTS BADGE BUTTON */}
            {isHoldParkEnabled && (
              <button
                onClick={() => setShowParkedModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <PauseCircle className="w-4 h-4 text-amber-400" />
                Parked Bills ({parkedCarts.length})
              </button>
            )}

            <div className="px-3 py-1.5 rounded-full bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5ED29C] animate-pulse" /> {posRules?.terminalId || 'TERMINAL #01 (ACTIVE)'}
            </div>
          </div>
        </div>

        {/* CUSTOMER SELECTION BAR */}
        <div className="p-3.5 rounded-2xl bg-[#121820] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <User className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/40 font-bold uppercase">Customer Account:</span>
                {selectedCustomer && (
                  <span className="text-emerald-400 font-bold font-mono text-[10px]">
                    Points: {(selectedCustomer as any).loyaltyPoints || 0} Pts • Credit Limit: ₹{((selectedCustomer as any).creditLimit || 0).toLocaleString()}
                  </span>
                )}
              </div>

              <select
                value={selectedCustomer?.id || 'c-walkin'}
                onChange={(e) => {
                  const found = customers.find((c) => c.id === e.target.value);
                  if (found) setSelectedCustomer(found as any);
                }}
                className="w-full bg-[#0B0F14] border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold text-xs focus:outline-none focus:border-blue-400"
              >
                <option value="c-walkin">-- Walk-in Retail Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''} • {(c as any).mobile || (c as any).phone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewCustModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> + New Customer
          </button>
        </div>

        {/* SEARCH & BARCODE SCANNER INPUT */}
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <input
            ref={barcodeInputRef}
            type="text"
            autoFocus
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                handleBarcodeSubmit();
              }
            }}
            placeholder="Scan Barcode / SKU (e.g. DESK-1001, PRT-1001, 5032037278776) or Type Product Title &amp; Press Enter..."
            className="w-full pl-10 pr-28 py-3.5 rounded-2xl bg-white/5 border border-[#5ED29C]/40 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#16FFC6] font-mono shadow-inner"
          />
          <Search className="w-4 h-4 text-[#5ED29C] absolute left-3.5 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider transition-all"
          >
            Scan Item
          </button>
        </form>

        {/* DUAL FILTER CONTROLS: CATEGORY PILLS & PRODUCT GROUP SELECTOR */}
        <div className="space-y-2.5">
          {/* CATEGORY PILLS BAR */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-white/40 font-bold uppercase text-[10px] shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-purple-400" /> Category:
            </span>
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* PRODUCT GROUP SELECTOR BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#121820] border border-white/10 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <span className="text-white/40 font-bold uppercase text-[10px] shrink-0 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-400" /> Product Group:
              </span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-[#0B0F14] border border-white/20 rounded-xl px-3 py-1.5 text-blue-300 font-bold text-xs focus:outline-none focus:border-blue-400 w-full"
              >
                <option value="All">-- All Product Groups --</option>
                {productGroupsList.filter((g) => g !== 'All').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCategory !== 'All' || selectedGroup !== 'All' || barcodeInput) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedGroup('All');
                  setBarcodeInput('');
                }}
                className="text-[10px] text-rose-400 hover:text-white font-bold underline shrink-0 px-2 py-1 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT CATALOG GRID WITH LARGE TOP SQUARE IMAGES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-white/50 block tracking-wider">
              Store Products &amp; Custom Assembled PCs ({filteredCatalog.length})
            </span>
            {(selectedCategory !== 'All' || selectedGroup !== 'All') && (
              <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                Filtered: {selectedCategory} • {selectedGroup}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => {
              const partsRemarks = getPcPartsRemarks(item);
              return (
                <div
                  key={item.id}
                  onClick={() => handleAddToCartWithStockCheck(item)}
                  className="p-3.5 rounded-2xl bg-[#121820] border border-white/10 hover:border-[#5ED29C]/60 cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.01] space-y-3 group shadow-md"
                >
                  {/* LARGE TOP SQUARE PRODUCT IMAGE BANNER */}
                  <div className="w-full aspect-square rounded-xl bg-slate-950 border border-white/10 overflow-hidden relative group-hover:border-[#5ED29C]/40 transition-colors flex items-center justify-center">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.name}
                        className="w-full h-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-full h-full aspect-square flex flex-col items-center justify-center text-white/30 bg-gradient-to-b from-white/5 to-transparent">
                        <Package className="w-12 h-12 text-white/30" />
                        <span className="text-[9px] font-mono font-bold text-white/30 uppercase mt-1">PRODUCT IMAGE</span>
                      </div>
                    )}

                    {/* OVERLAY BADGES: SKU & TYPE */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-mono font-extrabold text-black bg-[#5ED29C] px-2 py-0.5 rounded-md shadow-md">
                        {item.sku}
                      </span>
                      <span className="text-[9px] bg-purple-600/90 text-white px-2 py-0.5 rounded-md font-extrabold uppercase shadow-md backdrop-blur-sm">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* CARD DETAILS */}
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-[#16FFC6] transition-colors">
                      {item.name}
                    </h4>

                    {item.productGroup && (
                      <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold truncate max-w-full">
                        {item.productGroup}
                      </span>
                    )}

                    {/* PRINTED REMARKS SUB-SECTION BENEATH PRODUCT NAME */}
                    {partsRemarks && (
                      <div className="mt-1.5 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[10px] text-purple-200 leading-tight space-y-0.5">
                        <span className="font-extrabold uppercase text-[9px] text-purple-400 block flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-purple-400" /> Remarks (Included PC Parts):
                        </span>
                        <p className="line-clamp-2 font-mono text-[9px] text-purple-200/90">{partsRemarks}</p>
                      </div>
                    )}
                  </div>

                  {/* PRICE & ADD ACTION */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <span className="text-sm font-mono font-extrabold text-[#16FFC6]">₹{item.unit_price.toLocaleString()}</span>
                    <span className="text-xs bg-[#5ED29C]/10 text-[#5ED29C] group-hover:bg-[#5ED29C] group-hover:text-[#070B0A] px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1">
                      + Add to Cart
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE ORDER CART, BILL NO, BACKDATED DATE, RATES, DISCOUNTS & CHECKOUT */}
      <div className="w-full lg:w-[440px] glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between bg-[#0D1117] space-y-4">
        
        <div className="space-y-4">
          {/* CART HEADER */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-extrabold uppercase text-white flex items-center gap-2 tracking-wider">
              <ShoppingCart className="w-4 h-4 text-[#5ED29C]" />
              Current Cart ({cart.length})
            </h2>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <>
                  <button
                    onClick={handleParkCart}
                    className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/30 font-bold flex items-center gap-1 transition-all"
                    title="Park Current Bill"
                  >
                    <PauseCircle className="w-3 h-3" /> Hold Bill
                  </button>

                  <button
                    onClick={clearCart}
                    className="text-[10px] text-rose-400 hover:text-white font-bold underline"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* BILL NUMBER & BACKDATED ENTRY DATE CONTROLS */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-bold uppercase text-[10px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Bill Meta &amp; Backdated Entry
              </span>
              <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Backdate Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* BILL / INVOICE NUMBER */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <label className="text-white/70 font-bold">Bill No:</label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateBillNo}
                    className="text-[#5ED29C] hover:underline font-mono text-[9px] font-bold"
                  >
                    + Auto Gen
                  </button>
                </div>
                <input
                  type="text"
                  value={customBillNo}
                  onChange={(e) => setCustomBillNo(e.target.value)}
                  placeholder="POS-1001"
                  className="w-full bg-[#0B0F14] border border-white/20 rounded-xl px-2.5 py-1.5 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* BILL DATE & TIME (BACKDATED ENTRY) */}
              <div className="space-y-1">
                <label className="block text-white/70 font-bold text-[10px]">Bill Date &amp; Time:</label>
                <input
                  type="datetime-local"
                  value={customBillDate}
                  onChange={(e) => setCustomBillDate(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/20 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* CART ITEM LIST WITH EDITABLE UNIT RATES & SQUARE THUMBNAILS */}
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-xs text-white/40 space-y-2">
                <ShoppingCart className="w-8 h-8 text-white/20 mx-auto" />
                <p>Cart is empty. Scan barcode or click catalog items to add.</p>
              </div>
            ) : (
              cart.map((c) => {
                const pcPartsRemarks = getPcPartsRemarks(c);
                const currentSerial = serialInputs[c.id] || '';

                return (
                  <div key={c.id} className="p-3 rounded-2xl bg-[#121820] border border-white/10 space-y-2.5 text-xs shadow-md">
                    <div className="flex items-start gap-2.5">
                      {/* CART ITEM SQUARE THUMBNAIL */}
                      {c.productImage ? (
                        <img
                          src={c.productImage}
                          alt={c.name}
                          className="w-12 h-12 aspect-square rounded-xl object-cover border border-white/15 shrink-0 bg-slate-950 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 aspect-square rounded-xl bg-white/5 border border-white/15 flex flex-col items-center justify-center text-white/30 shrink-0 shadow-sm">
                          <Package className="w-5 h-5 text-white/40" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 pr-1">
                        <div className="font-bold text-white text-xs leading-snug line-clamp-2">{c.name}</div>
                        <span className="text-[9px] font-mono text-white/40">SKU: {c.sku}</span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button onClick={() => updateQuantity(c.id, -1)} className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold font-mono text-white text-xs px-1">{c.quantity}</span>
                        <button onClick={() => updateQuantity(c.id, 1)} className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(c.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 ml-0.5">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* EDITABLE UNIT RATE / PRICE & ITEM TOTAL */}
                    <div className="flex items-center justify-between text-[11px] font-mono border-t border-b border-white/5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/60 text-[10px] uppercase font-bold flex items-center gap-1">
                          <Edit2 className="w-2.5 h-2.5 text-blue-400" /> Unit Rate (₹):
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={c.unit_price}
                          onChange={(e) => updateUnitPrice(c.id, Number(e.target.value))}
                          className="w-24 px-1.5 py-0.5 rounded-md bg-[#0B0F14] border border-white/20 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-400 text-right"
                        />
                      </div>
                      <span className="text-[#5ED29C] font-bold">Total: ₹{(c.unit_price * c.quantity).toLocaleString()}</span>
                    </div>

                    {/* SERIAL NUMBER / IMEI INPUT FOR HARDWARE */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-white/40 font-bold uppercase shrink-0">S/N:</span>
                      <input
                        type="text"
                        placeholder="Tag Serial / IMEI No..."
                        value={currentSerial}
                        onChange={(e) => setSerialInputs({ ...serialInputs, [c.id]: e.target.value })}
                        className="bg-[#0B0F14] border border-white/15 rounded-lg px-2 py-0.5 text-blue-300 font-mono text-[10px] w-full focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    {/* REMARKS SECTION BENEATH PRODUCT NAME */}
                    {pcPartsRemarks && (
                      <div className="p-2 rounded-xl bg-purple-950/50 border border-purple-500/30 text-[10px] text-purple-200 font-mono space-y-0.5">
                        <span className="font-extrabold uppercase text-[9px] text-purple-400 block flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Remarks (Included PC Parts):
                        </span>
                        <p className="text-[10px] leading-tight text-purple-200">{pcPartsRemarks}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* BILL DISCOUNTS WITH FIXED ₹ AND PERCENT % TOGGLE */}
          {cart.length > 0 && (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
              {!isDiscountEnabled ? (
                <div className="text-[10px] text-amber-300 font-bold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-center">
                  Cashier discounts are disabled as per POS Rules settings.
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/80 font-bold uppercase text-[11px]">
                      <Percent className="w-3.5 h-3.5 text-emerald-400" /> Bill Discount:
                    </div>

                    {/* DISCOUNT TYPE TOGGLE: FIXED (₹) VS PERCENT (%) */}
                    <div className="flex items-center bg-[#0B0F14] p-0.5 rounded-lg border border-white/15">
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all ${
                          discountType === 'fixed'
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Fixed (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('percent')}
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all ${
                          discountType === 'percent'
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Percent (%)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/50">
                      {discountType === 'fixed' ? 'Enter Amount in ₹' : `Enter % (Max ${maxDiscountLimit}%)`}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={discountType === 'percent' ? maxDiscountLimit : cartSubtotal}
                        value={discountValue || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (discountType === 'percent' && val > maxDiscountLimit) {
                            alert(`Maximum allowed discount limit is ${maxDiscountLimit}% as per POS Rules.`);
                            setDiscountValue(maxDiscountLimit);
                          } else {
                            setDiscountValue(val);
                          }
                        }}
                        placeholder={discountType === 'fixed' ? 'e.g. 500' : `Max ${maxDiscountLimit}%`}
                        className="w-24 p-1.5 rounded-lg bg-[#0B0F14] border border-white/20 text-emerald-400 font-mono font-bold text-xs text-right focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-emerald-400 font-mono font-bold text-xs">
                        {discountType === 'fixed' ? '₹' : '%'}
                      </span>
                    </div>
                  </div>

                  {computedDiscount > 0 && (
                    <div className="text-[10px] text-emerald-400 font-mono font-bold text-right pt-1 border-t border-white/5">
                      Calculated Discount: -₹{computedDiscount.toLocaleString()}
                    </div>
                  )}
                </>
              )}

              {selectedCustomer && (selectedCustomer as any).loyaltyPoints && (selectedCustomer as any).loyaltyPoints > 0 ? (
                <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                  <label className="flex items-center gap-2 text-amber-300 font-bold text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      className="accent-amber-400 w-3.5 h-3.5"
                    />
                    Redeem {(selectedCustomer as any).loyaltyPoints} Loyalty Pts (₹{(selectedCustomer as any).loyaltyPoints} Off)
                  </label>
                </div>
              ) : null}
            </div>
          )}

          {/* PAYMENT METHOD SELECTOR */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-white/50 block">Select Payment Mode:</span>
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold text-center">
              {(['upi', 'cash', 'card', 'split'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMethod(mode)}
                  className={`py-2 rounded-xl uppercase transition-all ${
                    paymentMethod === mode
                      ? 'bg-[#5ED29C] text-[#070B0A] shadow-md shadow-[#5ED29C]/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* CASH TENDERED INPUT & CHANGE RETURN CALCULATOR */}
            {paymentMethod === 'cash' && (
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">Cash Received (₹):</span>
                  <input
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    placeholder="Enter Tendered Cash..."
                    className="w-28 p-1.5 rounded-xl bg-[#0B0F14] border border-emerald-500/40 text-emerald-400 font-mono font-bold text-xs text-right focus:outline-none"
                  />
                </div>

                {cashTendered > grandTotal && (
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 font-bold text-xs">
                    <span className="text-white">Change Return to Client:</span>
                    <span className="text-emerald-300 font-mono text-sm">₹{changeReturn.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FINANCIAL SUMMARY & CHECKOUT ACTIONS */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{cartSubtotal.toLocaleString()}</span>
            </div>
            {computedDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({discountType === 'percent' ? `${discountValue}%` : 'Fixed ₹'})</span>
                <span className="font-mono">-₹{computedDiscount.toLocaleString()}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>Loyalty Points</span>
                <span className="font-mono">-₹{loyaltyDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white/60">
              <span>Statutory GST Tax (18%)</span>
              <span className="font-mono text-white">₹{totalGst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
              <span>Grand Total</span>
              <span className="font-mono text-[#16FFC6] text-base">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {paymentSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-center space-y-3 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div>
                <div className="text-xs font-extrabold text-white uppercase">INVOICE #{lastPrintedInvoiceNo} PAID &amp; PRINTED</div>
                <p className="text-[11px] text-white/70 mt-0.5">Counter sale completed successfully.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice('thermal')}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Thermal Roll
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintInvoice('a4')}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> A4 Tax Invoice
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPaymentSuccess(false);
                  clearCart();
                  setCashTendered(0);
                  handleAutoGenerateBillNo();
                  setTimeout(() => barcodeInputRef.current?.focus(), 100);
                }}
                className="w-full py-2.5 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase rounded-xl shadow-md"
              >
                Start Next Counter Sale
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => handlePrintInvoice('thermal')}
                  className={`w-1/2 py-3 rounded-xl disabled:opacity-50 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    posRules?.defaultPrintMode === 'thermal'
                      ? 'bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300'
                  }`}
                >
                  <Printer className="w-4 h-4" /> Thermal Print
                </button>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => handlePrintInvoice('a4')}
                  className={`w-1/2 py-3 rounded-xl disabled:opacity-50 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    posRules?.defaultPrintMode === 'a4' || !posRules?.defaultPrintMode
                      ? 'bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300'
                  }`}
                >
                  <FileText className="w-4 h-4" /> A4 Tax Invoice
                </button>
              </div>

              {paymentMethod === 'upi' && isMerchantQrEnabled && (
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => setShowUpiModal(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-extrabold text-xs uppercase flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-blue-400" /> Display Merchant UPI QR Code
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* QUICK CUSTOMER CREATION MODAL */}
      {showNewCustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121820] text-white p-6 rounded-3xl max-w-md w-full border border-blue-500/30 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowNewCustModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-extrabold uppercase text-blue-300 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" /> Quick Add New Customer Account
            </h3>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={newCustForm.mobile}
                  onChange={(e) => setNewCustForm({ ...newCustForm, mobile: e.target.value })}
                  placeholder="+91 98123-45678"
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Company / Firm Name (Optional)</label>
                <input
                  type="text"
                  value={newCustForm.companyName}
                  onChange={(e) => setNewCustForm({ ...newCustForm, companyName: e.target.value })}
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  value={newCustForm.gstin}
                  onChange={(e) => setNewCustForm({ ...newCustForm, gstin: e.target.value })}
                  placeholder="08AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white font-mono uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Billing Address</label>
                <input
                  type="text"
                  value={newCustForm.billingAddress}
                  onChange={(e) => setNewCustForm({ ...newCustForm, billingAddress: e.target.value })}
                  placeholder="Street Address, City, Pin Code..."
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCustModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-white/10 text-white font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase shadow-lg shadow-blue-600/30"
                >
                  Save &amp; Select Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARKED CARTS MODAL */}
      {showParkedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121820] text-white p-6 rounded-3xl max-w-lg w-full border border-amber-500/30 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowParkedModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold uppercase text-amber-300 flex items-center gap-2">
              <PauseCircle className="w-5 h-5 text-amber-400" /> Parked Counter Bills ({parkedCarts.length})
            </h3>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs">
              {parkedCarts.length === 0 ? (
                <div className="text-center py-8 text-white/40">No parked bills in queue.</div>
              ) : (
                parkedCarts.map((park) => (
                  <div key={park.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-amber-300 font-mono text-xs">{park.id} • {park.timestamp}</div>
                      <div className="font-bold text-white text-xs mt-0.5">{park.customer.name}</div>
                      <div className="text-[10px] text-white/60">{park.cart.length} Items • Total: ₹{park.total.toLocaleString()}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResumeParkedCart(park.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase flex items-center gap-1 transition-all"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Resume Bill
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MERCHANDISE UPI QR MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121820] text-white p-8 rounded-3xl max-w-sm w-full text-center space-y-4 relative border border-white/20 shadow-2xl">
            <button onClick={() => setShowUpiModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold uppercase text-white">SCAN MERCHANT UPI QR</h3>
            <p className="text-xs text-white/60">Scan with PhonePe, Google Pay, Paytm, or BHIM</p>
            
            <div className="w-48 h-48 bg-white mx-auto rounded-2xl border-4 border-emerald-500 p-3 flex flex-col items-center justify-center text-gray-900 font-bold font-mono text-xs shadow-inner">
              <QrCode className="w-28 h-28 text-slate-900" />
              <span className="text-[9px] text-slate-600 mt-1">{companyDetails.merchantUpiId || 'support.time24x7-3@okhdfcbank'}</span>
            </div>

            <div className="text-2xl font-extrabold text-[#16FFC6] font-mono">₹{grandTotal.toLocaleString()}</div>

            <div>
              <label className="block text-left text-white/70 font-bold text-[10px] mb-1">UPI Transaction Reference # (Optional):</label>
              <input
                type="text"
                placeholder="Enter 12-digit UTR No..."
                value={upiRefNo}
                onChange={(e) => setUpiRefNo(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setShowUpiModal(false);
                handlePrintInvoice('a4');
              }}
              className="w-full py-3 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase rounded-xl shadow-lg shadow-[#5ED29C]/20"
            >
              Confirm Received Payment &amp; Print Bill
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
