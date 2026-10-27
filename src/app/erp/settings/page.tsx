'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings, Building2, Key, ShieldCheck, Save, Users, Hash, LayoutGrid, List,
  DollarSign, AlertOctagon, Calendar, CheckSquare, Gift, Eye, CheckCircle2, Sparkles, Award, LandPlot, RefreshCw, Sliders,
  Percent, BellRing, FileText, Lock, Landmark, Truck, Wrench, ShieldAlert, Plus, Trash2, Edit3, MessageSquare, Package, Tag, Layers, AlertTriangle,
  Upload, Image as ImageIcon, CreditCard, MapPin, Globe, Mail, Phone, UserCheck, Briefcase, FileCheck, Landmark as BankIcon, FileCode, Printer, Boxes, Flame, X, Shield, ShoppingCart, BookOpen
} from 'lucide-react';
import {
  useErpStore, VendorRulesConfig, HsnMasterItem, SaleRulesConfig, PurchaseRulesConfig,
  SalesReturnRulesConfig, PurchaseReturnRulesConfig, QuotationRulesConfig, VoucherRulesConfig,
  EmployeeRulesConfig
} from '@/lib/store';

export default function ErpSettingsPage() {
  const {
    customerRules, updateCustomerRules,
    vendorRules, updateVendorRules,
    inventoryRules, updateInventoryRules,
    employeeRules, updateEmployeeRules,
    addDepartmentOption, removeDepartmentOption,
    addDesignationOption, removeDesignationOption,
    addGovtIdTypeOption, removeGovtIdTypeOption,
    repairBillingRules, updateRepairBillingRules,
    outsourceRules, updateOutsourceRules,
    posRules, updatePosRules,
    saleRules, updateSaleRules,
    purchaseRules, updatePurchaseRules,
    salesReturnRules, updateSalesReturnRules,
    purchaseReturnRules, updatePurchaseReturnRules,
    quotationRules, updateQuotationRules,
    voucherRules, updateVoucherRules,
    hsnCodes, addHsnCode, updateHsnCode, deleteHsnCode,
    companyDetails, updateCompanyDetails,
    vendors
  } = useErpStore();

  const [activeTab, setActiveTab] = useState<'customer_rules' | 'vendor_rules' | 'inventory_rules' | 'employee_rules' | 'repair_billing_rules' | 'outsource_rules' | 'pos_rules' | 'sale_rules' | 'purchase_rules' | 'sales_return_rules' | 'purchase_return_rules' | 'quotation_rules' | 'voucher_rules' | 'hsn_settings' | 'general'>('customer_rules');
  
  const [localCustomerRules, setLocalCustomerRules] = useState(customerRules);
  const [localVendorRules, setLocalVendorRules] = useState(vendorRules);
  const [localInventoryRules, setLocalInventoryRules] = useState(inventoryRules);
  const [localEmployeeRules, setLocalEmployeeRules] = useState(employeeRules);
  const [newEmpDeptInput, setNewEmpDeptInput] = useState('');
  const [newEmpDesigInput, setNewEmpDesigInput] = useState('');
  const [newEmpGovtIdInput, setNewEmpGovtIdInput] = useState('');
  const [localRepairBillingRules, setLocalRepairBillingRules] = useState(repairBillingRules);
  const [localOutsourceRules, setLocalOutsourceRules] = useState(outsourceRules);
  const [localPosRules, setLocalPosRules] = useState(posRules);
  const [localSaleRules, setLocalSaleRules] = useState(saleRules);
  const [localPurchaseRules, setLocalPurchaseRules] = useState(purchaseRules);
  const [localSalesReturnRules, setLocalSalesReturnRules] = useState(salesReturnRules);
  const [localPurchaseReturnRules, setLocalPurchaseReturnRules] = useState(purchaseReturnRules);
  const [localQuotationRules, setLocalQuotationRules] = useState(quotationRules);
  const [localVoucherRules, setLocalVoucherRules] = useState(voucherRules);
  const [localCompanyDetails, setLocalCompanyDetails] = useState(companyDetails);

  useEffect(() => {
    if (saleRules) setLocalSaleRules(saleRules);
  }, [saleRules]);

  useEffect(() => {
    if (purchaseRules) setLocalPurchaseRules(purchaseRules);
  }, [purchaseRules]);

  useEffect(() => {
    if (salesReturnRules) setLocalSalesReturnRules(salesReturnRules);
  }, [salesReturnRules]);

  useEffect(() => {
    if (purchaseReturnRules) setLocalPurchaseReturnRules(purchaseReturnRules);
  }, [purchaseReturnRules]);

  useEffect(() => {
    if (quotationRules) setLocalQuotationRules(quotationRules);
  }, [quotationRules]);

  useEffect(() => {
    if (voucherRules) setLocalVoucherRules(voucherRules);
  }, [voucherRules]);

  useEffect(() => {
    if (companyDetails) setLocalCompanyDetails(companyDetails);
  }, [companyDetails]);

  useEffect(() => {
    if (posRules) setLocalPosRules(posRules);
  }, [posRules]);

  useEffect(() => {
    if (repairBillingRules) setLocalRepairBillingRules(repairBillingRules);
  }, [repairBillingRules]);

  useEffect(() => {
    if (customerRules) setLocalCustomerRules(customerRules);
  }, [customerRules]);

  useEffect(() => {
    if (vendorRules) setLocalVendorRules(vendorRules);
  }, [vendorRules]);

  useEffect(() => {
    if (inventoryRules) setLocalInventoryRules(inventoryRules);
  }, [inventoryRules]);

  useEffect(() => {
    if (employeeRules) setLocalEmployeeRules(employeeRules);
  }, [employeeRules]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'employee_rules') {
        setActiveTab('employee_rules');
      }
    }
  }, []);

  const handleSaveEmployeeSettings = () => {
    updateEmployeeRules(localEmployeeRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  useEffect(() => {
    if (outsourceRules) setLocalOutsourceRules(outsourceRules);
  }, [outsourceRules]);

  const [newDesignationInput, setNewDesignationInput] = useState('');
  const [showAddDesignationInput, setShowAddDesignationInput] = useState(false);

  const [newTermInput, setNewTermInput] = useState('');
  const [newRackInput, setNewRackInput] = useState('');
  const [newPriorityInput, setNewPriorityInput] = useState('');
  const [newOutsourceServiceInput, setNewOutsourceServiceInput] = useState('');

  const handleAddOutsourceServiceType = () => {
    if (!newOutsourceServiceInput.trim()) return;
    const trimmed = newOutsourceServiceInput.trim();
    const currentTypes = localOutsourceRules.outsource_service_types || [];
    if (!currentTypes.includes(trimmed)) {
      const updated = [...currentTypes, trimmed];
      setLocalOutsourceRules({ ...localOutsourceRules, outsource_service_types: updated });
    }
    setNewOutsourceServiceInput('');
  };

  const handleDeleteOutsourceServiceType = (st: string) => {
    const updated = (localOutsourceRules.outsource_service_types || []).filter((item) => item !== st);
    setLocalOutsourceRules({ ...localOutsourceRules, outsource_service_types: updated });
  };

  const [savedSuccess, setSavedSuccess] = useState(false);

  // HSN Settings Form State
  const [newHsnInput, setNewHsnInput] = useState({ hsnCode: '', gstRate: 18, description: '' });
  const [editingHsnCode, setEditingHsnCode] = useState<string | null>(null);

  const handleSaveCustomerSettings = () => {
    updateCustomerRules(localCustomerRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveVendorSettings = () => {
    updateVendorRules(localVendorRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveInventorySettings = () => {
    updateInventoryRules(localInventoryRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveRepairBillingSettings = () => {
    updateRepairBillingRules(localRepairBillingRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveOutsourceSettings = () => {
    updateOutsourceRules(localOutsourceRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSavePosSettings = () => {
    updatePosRules(localPosRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveSaleSettings = () => {
    updateSaleRules(localSaleRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSavePurchaseSettings = () => {
    updatePurchaseRules(localPurchaseRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const [newPurchaseTermInput, setNewPurchaseTermInput] = useState('');

  const handleAddPurchaseTerm = () => {
    if (!newPurchaseTermInput.trim()) return;
    const current = localPurchaseRules.termsAndConditions || [];
    const updated = [...current, newPurchaseTermInput.trim()];
    setLocalPurchaseRules({ ...localPurchaseRules, termsAndConditions: updated });
    setNewPurchaseTermInput('');
  };

  const handleUpdatePurchaseTerm = (index: number, value: string) => {
    const current = [...(localPurchaseRules.termsAndConditions || [])];
    current[index] = value;
    setLocalPurchaseRules({ ...localPurchaseRules, termsAndConditions: current });
  };

  const handleDeletePurchaseTerm = (index: number) => {
    const current = localPurchaseRules.termsAndConditions || [];
    const updated = current.filter((_, i) => i !== index);
    setLocalPurchaseRules({ ...localPurchaseRules, termsAndConditions: updated });
  };

  const applyPurchasePreset = (preset: 'strict_b2b' | 'lab_procurement') => {
    if (preset === 'strict_b2b') {
      setLocalPurchaseRules({
        ...localPurchaseRules,
        purchaseBillPrefix: 'PUR-',
        purchaseBillStartNo: 1001,
        defaultPaymentTerms: 'Credit 30 Days',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        autoAddInventoryStock: true,
        requireVendorGst: true,
        requireVendorInvoiceNo: true,
        defaultPrintPaperFormat: 'A4',
        showInwardLogisticsNotes: true,
        showProductRemarksOnPrint: true,
        showRefurbishedBadgeOnPrint: true,
        showBankDetailsOnVoucher: true,
      });
    } else {
      setLocalPurchaseRules({
        ...localPurchaseRules,
        purchaseBillPrefix: 'VOU-',
        purchaseBillStartNo: 2001,
        defaultPaymentTerms: 'Immediate Bank Transfer',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        autoAddInventoryStock: true,
        requireVendorGst: false,
        requireVendorInvoiceNo: false,
        defaultPrintPaperFormat: 'A5',
        showInwardLogisticsNotes: true,
        showProductRemarksOnPrint: true,
        showRefurbishedBadgeOnPrint: false,
        showBankDetailsOnVoucher: true,
      });
    }
  };

  const handleSaveSalesReturnSettings = () => {
    updateSalesReturnRules(localSalesReturnRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSavePurchaseReturnSettings = () => {
    updatePurchaseReturnRules(localPurchaseReturnRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveQuotationSettings = () => {
    updateQuotationRules(localQuotationRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveVoucherSettings = () => {
    updateVoucherRules(localVoucherRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const [newSalesReturnTermInput, setNewSalesReturnTermInput] = useState('');
  const [newPurchaseReturnTermInput, setNewPurchaseReturnTermInput] = useState('');
  const [newQuotationTermInput, setNewQuotationTermInput] = useState('');
  const [newVoucherTermInput, setNewVoucherTermInput] = useState('');

  const handleAddSalesReturnTerm = () => {
    if (!newSalesReturnTermInput.trim()) return;
    const current = localSalesReturnRules.termsAndConditions || [];
    setLocalSalesReturnRules({ ...localSalesReturnRules, termsAndConditions: [...current, newSalesReturnTermInput.trim()] });
    setNewSalesReturnTermInput('');
  };

  const handleDeleteSalesReturnTerm = (index: number) => {
    const current = localSalesReturnRules.termsAndConditions || [];
    setLocalSalesReturnRules({ ...localSalesReturnRules, termsAndConditions: current.filter((_, i) => i !== index) });
  };

  const handleAddPurchaseReturnTerm = () => {
    if (!newPurchaseReturnTermInput.trim()) return;
    const current = localPurchaseReturnRules.termsAndConditions || [];
    setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, termsAndConditions: [...current, newPurchaseReturnTermInput.trim()] });
    setNewPurchaseReturnTermInput('');
  };

  const handleDeletePurchaseReturnTerm = (index: number) => {
    const current = localPurchaseReturnRules.termsAndConditions || [];
    setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, termsAndConditions: current.filter((_, i) => i !== index) });
  };

  const handleAddQuotationTerm = () => {
    if (!newQuotationTermInput.trim()) return;
    const current = localQuotationRules.termsAndConditions || [];
    setLocalQuotationRules({ ...localQuotationRules, termsAndConditions: [...current, newQuotationTermInput.trim()] });
    setNewQuotationTermInput('');
  };

  const handleDeleteQuotationTerm = (index: number) => {
    const current = localQuotationRules.termsAndConditions || [];
    setLocalQuotationRules({ ...localQuotationRules, termsAndConditions: current.filter((_, i) => i !== index) });
  };

  const handleAddVoucherTerm = () => {
    if (!newVoucherTermInput.trim()) return;
    const current = localVoucherRules.termsAndConditions || [];
    setLocalVoucherRules({ ...localVoucherRules, termsAndConditions: [...current, newVoucherTermInput.trim()] });
    setNewVoucherTermInput('');
  };

  const handleDeleteVoucherTerm = (index: number) => {
    const current = localVoucherRules.termsAndConditions || [];
    setLocalVoucherRules({ ...localVoucherRules, termsAndConditions: current.filter((_, i) => i !== index) });
  };

  const [newSaleTermInput, setNewSaleTermInput] = useState('');

  const handleAddSaleTerm = () => {
    if (!newSaleTermInput.trim()) return;
    const current = localSaleRules.termsAndConditions || [];
    const updated = [...current, newSaleTermInput.trim()];
    setLocalSaleRules({ ...localSaleRules, termsAndConditions: updated });
    setNewSaleTermInput('');
  };

  const handleUpdateSaleTerm = (index: number, value: string) => {
    const current = [...(localSaleRules.termsAndConditions || [])];
    current[index] = value;
    setLocalSaleRules({ ...localSaleRules, termsAndConditions: current });
  };

  const handleDeleteSaleTerm = (index: number) => {
    const current = localSaleRules.termsAndConditions || [];
    const updated = current.filter((_, i) => i !== index);
    setLocalSaleRules({ ...localSaleRules, termsAndConditions: updated });
  };

  const applySalePreset = (preset: 'b2b' | 'retail') => {
    if (preset === 'b2b') {
      setLocalSaleRules({
        ...localSaleRules,
        salesInvoicePrefix: 'SAL-',
        salesInvoiceStartNo: 1001,
        defaultPaymentTerms: 'Credit 15 Days',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        enableDiscountLimits: true,
        maxDiscountPercent: 15,
        autoBarcodeScanAddItem: true,
        requireCustomerPhone: true,
        requireCustomerGstForB2B: true,
        defaultPrintPaperFormat: 'A4',
        defaultPrintCopyMode: 'both',
        showTermsBoxOnInvoice: true,
      });
    } else {
      setLocalSaleRules({
        ...localSaleRules,
        salesInvoicePrefix: 'INV-',
        salesInvoiceStartNo: 5001,
        defaultPaymentTerms: 'Immediate POS Cash/Terminal',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        enableDiscountLimits: true,
        maxDiscountPercent: 25,
        autoBarcodeScanAddItem: true,
        requireCustomerPhone: false,
        requireCustomerGstForB2B: false,
        defaultPrintPaperFormat: 'A5',
        defaultPrintCopyMode: 'customer',
        showTermsBoxOnInvoice: true,
      });
    }
  };

  const applyQuotationPreset = (preset: 'corporate' | 'retail') => {
    if (preset === 'corporate') {
      setLocalQuotationRules({
        ...localQuotationRules,
        quotationPrefix: 'QTN-',
        quotationStartNo: 1001,
        defaultValidityDays: 15,
        defaultPaymentTerms: '50% Advance & 50% Delivery',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        enableDiscountLimits: true,
        maxDiscountPercent: 15,
        autoBarcodeScanAddItem: true,
        requireCustomerPhone: true,
        requireCustomerGstForB2B: true,
        defaultPrintPaperFormat: 'A4',
        defaultPrintCopyMode: 'both',
        showTermsBoxOnQuotation: true,
        showProductRemarksOnPrint: true,
        showRefurbishedBadgeOnPrint: true,
        showBankQrOnQuotation: true,
      });
    } else {
      setLocalQuotationRules({
        ...localQuotationRules,
        quotationPrefix: 'EST-',
        quotationStartNo: 2001,
        defaultValidityDays: 7,
        defaultPaymentTerms: '100% Cash / Spot Payment',
        defaultGstSupplyType: 'Intra-State (CGST + SGST)',
        defaultTaxRate: 18,
        autoRoundOffGrandTotal: true,
        enableDiscountLimits: true,
        maxDiscountPercent: 20,
        autoBarcodeScanAddItem: true,
        requireCustomerPhone: false,
        requireCustomerGstForB2B: false,
        defaultPrintPaperFormat: 'A5',
        defaultPrintCopyMode: 'customer',
        showTermsBoxOnQuotation: true,
        showProductRemarksOnPrint: true,
        showRefurbishedBadgeOnPrint: false,
        showBankQrOnQuotation: true,
      });
    }
  };

  const handleSaveHsnCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHsnInput.hsnCode) return;

    if (editingHsnCode) {
      updateHsnCode(editingHsnCode, newHsnInput);
      setEditingHsnCode(null);
    } else {
      addHsnCode(newHsnInput);
    }
    setNewHsnInput({ hsnCode: '', gstRate: 18, description: '' });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveCompanyDetails = () => {
    updateCompanyDetails(localCompanyDetails);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddDesignation = () => {
    if (!newDesignationInput.trim()) return;
    const trimmed = newDesignationInput.trim();
    if (localCompanyDetails.designationOptions.includes(trimmed)) {
      setLocalCompanyDetails({ ...localCompanyDetails, designation: trimmed });
    } else {
      const updatedOptions = [...localCompanyDetails.designationOptions, trimmed];
      setLocalCompanyDetails({
        ...localCompanyDetails,
        designationOptions: updatedOptions,
        designation: trimmed,
      });
    }
    setNewDesignationInput('');
    setShowAddDesignationInput(false);
  };

  const handleRemoveDesignation = () => {
    const current = localCompanyDetails.designation;
    if (!current) return;
    if (localCompanyDetails.designationOptions.length <= 1) {
      alert('Cannot remove the last designation option.');
      return;
    }
    if (confirm(`Remove designation "${current}" from selectable list?`)) {
      const updatedOptions = localCompanyDetails.designationOptions.filter((d) => d !== current);
      setLocalCompanyDetails({
        ...localCompanyDetails,
        designationOptions: updatedOptions,
        designation: updatedOptions[0] || '',
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setLocalCompanyDetails({ ...localCompanyDetails, companyLogo: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [newTicketTermInput, setNewTicketTermInput] = useState('');
  const [newBillingTermInput, setNewBillingTermInput] = useState('');
  const [newPosTermInput, setNewPosTermInput] = useState('');

  // POS Counter Terms Helpers
  const handleAddPosTerm = () => {
    if (!newPosTermInput.trim()) return;
    const current = localPosRules.posTermsAndConditions || [
      'Goods once sold will not be accepted back or exchanged without a valid GST tax invoice.',
      'Hardware items carry manufacturer warranty. Physical, burnt, or liquid damage voids warranty.',
      'Customers are advised to inspect products and verify serial numbers at the time of delivery.',
      'Full payment is due upon counter delivery. Subject to Sanchore jurisdiction.',
    ];
    const updated = [...current, newPosTermInput.trim()];
    setLocalPosRules({ ...localPosRules, posTermsAndConditions: updated });
    setNewPosTermInput('');
  };

  const handleUpdatePosTerm = (index: number, value: string) => {
    const current = [...(localPosRules.posTermsAndConditions || [])];
    current[index] = value;
    setLocalPosRules({ ...localPosRules, posTermsAndConditions: current });
  };

  const handleDeletePosTerm = (index: number) => {
    const current = localPosRules.posTermsAndConditions || [];
    const updated = current.filter((_, i) => i !== index);
    setLocalPosRules({ ...localPosRules, posTermsAndConditions: updated });
  };

  // Ticket Terms Helpers
  const handleAddTicketTerm = () => {
    if (!newTicketTermInput.trim()) return;
    const current = localRepairBillingRules.ticketTermsAndConditions || localRepairBillingRules.termsAndConditions || [];
    const updated = [...current, newTicketTermInput.trim()];
    setLocalRepairBillingRules({ ...localRepairBillingRules, ticketTermsAndConditions: updated });
    setNewTicketTermInput('');
  };

  const handleUpdateTicketTerm = (index: number, value: string) => {
    const current = [...(localRepairBillingRules.ticketTermsAndConditions || localRepairBillingRules.termsAndConditions || [])];
    current[index] = value;
    setLocalRepairBillingRules({ ...localRepairBillingRules, ticketTermsAndConditions: current });
  };

  const handleDeleteTicketTerm = (index: number) => {
    const current = localRepairBillingRules.ticketTermsAndConditions || localRepairBillingRules.termsAndConditions || [];
    const updated = current.filter((_, i) => i !== index);
    setLocalRepairBillingRules({ ...localRepairBillingRules, ticketTermsAndConditions: updated });
  };

  // Billing Terms Helpers
  const handleAddBillingTerm = () => {
    if (!newBillingTermInput.trim()) return;
    const current = localRepairBillingRules.billingTermsAndConditions || [
      '30 Days Parts & Labor Warranty.',
      'Warranty void with physical damage, liquid exposure, or open warranty seal.',
      'Backup data prior to servicing; Accno Solution is not liable for data loss.',
    ];
    const updated = [...current, newBillingTermInput.trim()];
    setLocalRepairBillingRules({ ...localRepairBillingRules, billingTermsAndConditions: updated });
    setNewBillingTermInput('');
  };

  const handleUpdateBillingTerm = (index: number, value: string) => {
    const current = [...(localRepairBillingRules.billingTermsAndConditions || [])];
    current[index] = value;
    setLocalRepairBillingRules({ ...localRepairBillingRules, billingTermsAndConditions: current });
  };

  const handleDeleteBillingTerm = (index: number) => {
    const current = localRepairBillingRules.billingTermsAndConditions || [];
    const updated = current.filter((_, i) => i !== index);
    setLocalRepairBillingRules({ ...localRepairBillingRules, billingTermsAndConditions: updated });
  };

  // Repair Ticket Terms & Options Helpers
  const handleAddTermCondition = () => {
    if (!newTermInput.trim()) return;
    const updated = [...(localRepairBillingRules.termsAndConditions || []), newTermInput.trim()];
    setLocalRepairBillingRules({ ...localRepairBillingRules, termsAndConditions: updated });
    setNewTermInput('');
  };

  const handleUpdateTermCondition = (index: number, value: string) => {
    const updated = [...(localRepairBillingRules.termsAndConditions || [])];
    updated[index] = value;
    setLocalRepairBillingRules({ ...localRepairBillingRules, termsAndConditions: updated });
  };

  const handleDeleteTermCondition = (index: number) => {
    const updated = (localRepairBillingRules.termsAndConditions || []).filter((_, i) => i !== index);
    setLocalRepairBillingRules({ ...localRepairBillingRules, termsAndConditions: updated });
  };

  const handleAddRackOption = () => {
    if (!newRackInput.trim()) return;
    const trimmed = newRackInput.trim();
    if (!(localRepairBillingRules.rackLocationOptions || []).includes(trimmed)) {
      const updated = [...(localRepairBillingRules.rackLocationOptions || []), trimmed];
      setLocalRepairBillingRules({ ...localRepairBillingRules, rackLocationOptions: updated });
    }
    setNewRackInput('');
  };

  const handleDeleteRackOption = (rack: string) => {
    const updated = (localRepairBillingRules.rackLocationOptions || []).filter((r) => r !== rack);
    setLocalRepairBillingRules({ ...localRepairBillingRules, rackLocationOptions: updated });
  };

  const handleAddPriorityOption = () => {
    if (!newPriorityInput.trim()) return;
    const trimmed = newPriorityInput.trim().toUpperCase();
    if (!(localRepairBillingRules.priorityOptions || []).includes(trimmed)) {
      const updated = [...(localRepairBillingRules.priorityOptions || []), trimmed];
      setLocalRepairBillingRules({ ...localRepairBillingRules, priorityOptions: updated });
    }
    setNewPriorityInput('');
  };

  const handleDeletePriorityOption = (prio: string) => {
    const updated = (localRepairBillingRules.priorityOptions || []).filter((p) => p !== prio);
    setLocalRepairBillingRules({ ...localRepairBillingRules, priorityOptions: updated });
  };

  const customerFieldLabels: { [key: string]: string } = {
    name: '1. Customer Name',
    companyName: '2. Company Registered Name',
    category: '3. Category (Sundry Creditor/Debtor)',
    accountGroup: '4. Account Group (Retail/Wholesale)',
    mobile: '5. Mobile Number',
    alternateContact: '6. Alternate Contact Number',
    email: '7. Email Address',
    website: '8. Website URL',
    dob: '9. Date of Birth (DOB)',
    weddingAnniversary: '10. Wedding Anniversary',
    panNumber: '11. PAN Card Number',
    gstin: '12. GSTIN Tax ID',
    state: '13. State + GST Code',
    billingAddress: '14. Full Billing Address',
    shippingAddress: '15. Site / Shipping Address',
    city: '16. City',
    pinCode: '17. Pin Code',
    accountStatus: '18. Account Status',
    referredBy: '19. Referred By',
    creditLimit: '20. Credit Limit (₹)',
    outstandingBalance: '21. Outstanding Balance (₹)',
    internalNotes: '22. Internal Customer Notes',
    bankDetails: '23. Bank Account & UPI Payment Details',
  };

  const vendorFieldLabels: { [key: string]: string } = {
    vendorType: '1. Vendor Type (Standard / Outsource)',
    companyName: '2. Company Name',
    contactPerson: '3. Contact Person',
    category: '4. Category (Hardware / Outsource Rework)',
    accountGroup: '5. Account Group',
    designation: '6. Designation',
    activeStatus: '7. Active Status',
    phone: '8. Phone Number',
    alternatePhone: '9. Alternate Number',
    email: '10. Email Address',
    website: '11. Website',
    station: '12. Station (City / Location)',
    state: '13. State with State Code',
    fullAddress: '14. Full Address',
    gstin: '15. GSTIN',
    pan: '16. PAN',
    openingBalance: '17. Opening Balance (₹)',
    outstandingBalance: '18. Outstanding Balance (₹)',
    maxCreditLimit: '19. Max Credit Limit (₹)',
    internalNotes: '20. Internal Notes & Description',
    bankDetails: '21. Bank Account & UPI Payment Details',
  };

  const inventoryFieldLabels: { [key: string]: string } = {
    productImage: '1. Product Picture / Image Upload',
    hsnCode: '2. HSN / SAC Code',
    gstRate: '3. GST Rate (%) Linker',
    barcode: '4. Product Barcode / SKU',
    storageLocation: '5. Storage Location / Bin Rack',
    compatibleModels: '6. Compatible Device Models',
    comfortabilityFeatures: '7. Comfortability Features',
    supplierVendor: '8. Preferred Supplier / Vendor',
    conversionFactor: '9. Box Conversion Factor (pcs/box)',
    openingBalance: '10. Opening Stock Balance',
  };

  const setAllCustomerVisibility = (visible: boolean) => {
    const updated: { [key: string]: boolean } = {};
    Object.keys(customerFieldLabels).forEach((k) => (updated[k] = visible));
    setLocalCustomerRules({
      ...localCustomerRules,
      fieldVisibility: updated as any,
    });
  };

  const setAllVendorVisibility = (visible: boolean) => {
    const updated: { [key: string]: boolean } = {};
    Object.keys(vendorFieldLabels).forEach((k) => (updated[k] = visible));
    setLocalVendorRules({
      ...localVendorRules,
      fieldVisibility: updated as any,
    });
  };

  const setAllInventoryVisibility = (visible: boolean) => {
    const updated: { [key: string]: boolean } = {};
    Object.keys(inventoryFieldLabels).forEach((k) => (updated[k] = visible));
    setLocalInventoryRules({
      ...localInventoryRules,
      fieldVisibility: updated as any,
    });
  };

  const applyCustomerPreset = (preset: 'b2b' | 'retail') => {
    if (preset === 'b2b') {
      setLocalCustomerRules({
        ...localCustomerRules,
        paymentDueTerms: 'net15',
        defaultMaxCreditLimit: 150000,
        blockBillingOnCreditExceeded: true,
        requiredFields: {
          gstinForB2B: true,
          panNumber: true,
          billingAddress: true,
          alternatePhone: true,
        },
        creditRiskAndLateFees: {
          enableGracePeriod: true,
          gracePeriodDays: 5,
          lateFeePercentPerMonth: 1.5,
          autoCalculateRiskScore: true,
        },
      });
    } else {
      setLocalCustomerRules({
        ...localCustomerRules,
        paymentDueTerms: 'immediate',
        defaultMaxCreditLimit: 25000,
        blockBillingOnCreditExceeded: false,
        requiredFields: {
          gstinForB2B: false,
          panNumber: false,
          billingAddress: false,
          alternatePhone: false,
        },
        loyaltyAndGreetings: {
          ...localCustomerRules.loyaltyAndGreetings,
          enableLoyaltyPoints: true,
          vipMultiplier: 2.0,
          signupBonusPoints: 100,
        },
      });
    }
  };

  const applyVendorPreset = (preset: 'strict' | 'outsource') => {
    if (preset === 'strict') {
      setLocalVendorRules({
        ...localVendorRules,
        paymentDueTerms: 'net30',
        requireGstin: true,
        requirePan: true,
        blockPoOnCreditExceeded: true,
        defaultMaxCreditLimit: 500000,
      });
    } else {
      setLocalVendorRules({
        ...localVendorRules,
        paymentDueTerms: 'net15',
        requireGstin: false,
        requirePan: false,
        blockPoOnCreditExceeded: false,
        defaultMaxCreditLimit: 150000,
      });
    }
  };

  const applyInventoryPreset = (preset: 'warehouse' | 'service_lab') => {
    if (preset === 'warehouse') {
      setLocalInventoryRules({
        ...localInventoryRules,
        displayFormat: 'tabular',
        defaultLowStockAlert: 5,
        fieldVisibility: {
          productImage: true,
          hsnCode: true,
          gstRate: true,
          barcode: true,
          storageLocation: true,
          compatibleModels: true,
          comfortabilityFeatures: true,
          supplierVendor: true,
          conversionFactor: true,
          openingBalance: true,
        },
      });
    } else {
      setLocalInventoryRules({
        ...localInventoryRules,
        displayFormat: 'grid',
        defaultLowStockAlert: 2,
        fieldVisibility: {
          productImage: true,
          hsnCode: true,
          gstRate: true,
          barcode: true,
          storageLocation: true,
          compatibleModels: true,
          comfortabilityFeatures: false,
          supplierVendor: true,
          conversionFactor: false,
          openingBalance: false,
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#5ED29C]" />
            ERP SYSTEM SETTINGS & MODULE RULES<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Configure Customer Rules, Vendor Rules, Inventory Rules, Repair Billing Rules, Outsource Rules, and HSN Linker.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('customer_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'customer_rules'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Customer Rules
        </button>

        <button
          onClick={() => setActiveTab('vendor_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'vendor_rules'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" /> Vendor Rules
        </button>

        <button
          onClick={() => setActiveTab('inventory_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'inventory_rules'
              ? 'bg-emerald-400 text-[#070B0A] shadow-lg shadow-emerald-400/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" /> Inventory Rules
        </button>

        <button
          onClick={() => setActiveTab('employee_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'employee_rules'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Employee Rules
        </button>

        <button
          onClick={() => setActiveTab('repair_billing_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'repair_billing_rules'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" /> Repair Ticket Rules
        </button>

        <button
          onClick={() => setActiveTab('outsource_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'outsource_rules'
              ? 'bg-purple-400 text-[#070B0A] shadow-lg shadow-purple-400/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" /> Outsource Rules
        </button>

        <button
          onClick={() => setActiveTab('pos_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'pos_rules'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" /> POS Rules
        </button>

        <button
          onClick={() => setActiveTab('sale_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'sale_rules'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> Sale Rules
        </button>

        <button
          onClick={() => setActiveTab('purchase_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'purchase_rules'
              ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Purchase Rules
        </button>

        <button
          onClick={() => setActiveTab('sales_return_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'sales_return_rules'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" /> Sales Return Rules
        </button>

        <button
          onClick={() => setActiveTab('purchase_return_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'purchase_return_rules'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-4 h-4" /> Purchase Return Rules
        </button>

        <button
          onClick={() => setActiveTab('quotation_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'quotation_rules'
              ? 'bg-purple-400 text-slate-950 shadow-lg shadow-purple-400/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Quotation Rules
        </button>

        <button
          onClick={() => setActiveTab('voucher_rules')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'voucher_rules'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> All Vouchers Rules
        </button>

        <button
          onClick={() => setActiveTab('hsn_settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'hsn_settings'
              ? 'bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#16FFC6]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" /> HSN Linker
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company Details
        </button>
      </div>

      {/* TAB 1: FULL CUSTOMER RULES CONFIGURATION */}
      {activeTab === 'customer_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-8 text-xs">
          
          {/* HEADER PRESETS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5ED29C]" />
                CUSTOMER RULES & POLICY SETTINGS<span className="text-[#5ED29C]">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">Configure credit limits, loyalty rewards, WhatsApp greetings, payment terms & 23 field visibility controls.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyCustomerPreset('b2b')}
                className="px-3 py-1.5 rounded-xl bg-[#5ED29C]/20 hover:bg-[#5ED29C] text-[#5ED29C] hover:text-[#070B0A] border border-[#5ED29C]/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Preset: Strict B2B Policy
              </button>
              <button
                type="button"
                onClick={() => applyCustomerPreset('retail')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" /> Preset: Retail Rewards Policy
              </button>
            </div>
          </div>

          {/* RULE 1: ID AUTO-NUMBERING */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Hash className="w-4 h-4 text-[#5ED29C]" />
              1. Customer ID Auto-Numbering Rule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Auto-Prefix Pattern</label>
                <input
                  type="text"
                  value={localCustomerRules.autoPrefixPattern}
                  onChange={(e) => setLocalCustomerRules({ ...localCustomerRules, autoPrefixPattern: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  placeholder="CUST-"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                <input
                  type="number"
                  value={localCustomerRules.startWithNo}
                  onChange={(e) => setLocalCustomerRules({ ...localCustomerRules, startWithNo: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  placeholder="1001"
                />
              </div>
            </div>
            <p className="text-[10px] text-white/40">Sample: <span className="font-mono text-[#5ED29C] font-bold">{localCustomerRules.autoPrefixPattern}{localCustomerRules.startWithNo}</span></p>
          </div>

          {/* RULE 2: DEFAULT DISPLAY FORMAT */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <LayoutGrid className="w-4 h-4 text-[#5ED29C]" />
              2. Default Customer Display Format (List View vs Box Grid View)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocalCustomerRules({ ...localCustomerRules, displayFormat: 'tabular' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localCustomerRules.displayFormat === 'tabular'
                    ? 'bg-[#5ED29C]/10 border-[#5ED29C] text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <List className="w-5 h-5 text-[#5ED29C]" />
                <div>
                  <div className="font-bold text-white">Single-line format (List View)</div>
                  <div className="text-[10px]">Dense tabular list layout with search & quick actions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalCustomerRules({ ...localCustomerRules, displayFormat: 'grid' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localCustomerRules.displayFormat === 'grid'
                    ? 'bg-[#5ED29C]/10 border-[#5ED29C] text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-[#5ED29C]" />
                <div>
                  <div className="font-bold text-white">Box format (Box Grid View)</div>
                  <div className="text-[10px]">Visual grid card layout displaying customer avatars & stats</div>
                </div>
              </button>
            </div>
          </div>

          {/* RULE 3 & 4: CREDIT LIMITS & BLOCKING */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <DollarSign className="w-4 h-4 text-[#5ED29C]" />
              3 & 4. Default Max Credit Limit & Billing Block Rule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Max Credit Limit (₹)</label>
                <input
                  type="number"
                  value={localCustomerRules.defaultMaxCreditLimit}
                  onChange={(e) => setLocalCustomerRules({ ...localCustomerRules, defaultMaxCreditLimit: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Standard Payment Due Terms</label>
                <select
                  value={localCustomerRules.paymentDueTerms}
                  onChange={(e) => setLocalCustomerRules({ ...localCustomerRules, paymentDueTerms: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value="immediate">Immediate / Cash On Delivery</option>
                  <option value="net15">Net 15 Days</option>
                  <option value="net30">Net 30 Days</option>
                  <option value="net60">Net 60 Days</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <input
                type="checkbox"
                id="blockBilling"
                checked={localCustomerRules.blockBillingOnCreditExceeded}
                onChange={(e) => setLocalCustomerRules({ ...localCustomerRules, blockBillingOnCreditExceeded: e.target.checked })}
                className="w-4 h-4 accent-[#5ED29C]"
              />
              <label htmlFor="blockBilling" className="text-white font-bold text-xs cursor-pointer">
                Block POS Checkout & Repair Delivery when Customer Unpaid Balance exceeds Credit Limit
              </label>
            </div>
          </div>

          {/* RULE 6: REQUIRED FIELD VALIDATIONS & KYC */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <CheckSquare className="w-4 h-4 text-[#5ED29C]" />
              6. Required Field Validation Rules & Document KYC
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localCustomerRules.requiredFields.gstinForB2B}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    requiredFields: { ...localCustomerRules.requiredFields, gstinForB2B: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <span className="font-bold text-white">GSTIN for B2B Clients</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localCustomerRules.requiredFields.panNumber}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    requiredFields: { ...localCustomerRules.requiredFields, panNumber: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <span className="font-bold text-white">PAN Card Number</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localCustomerRules.requiredFields.billingAddress}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    requiredFields: { ...localCustomerRules.requiredFields, billingAddress: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <span className="font-bold text-white">Full Billing Address</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localCustomerRules.requiredFields.alternatePhone}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    requiredFields: { ...localCustomerRules.requiredFields, alternatePhone: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <span className="font-bold text-white">Alternate Contact</span>
              </label>
            </div>
          </div>

          {/* RULE 7: LOYALTY REWARDS & AUTOMATED GREETINGS */}
          <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-[#5ED29C]/30">
            <h3 className="text-sm font-bold text-[#16FFC6] uppercase flex items-center gap-2 border-b border-[#16FFC6]/20 pb-2">
              <Gift className="w-4 h-4 text-[#16FFC6]" />
              7. Loyalty Rewards System & Automated WhatsApp Greetings Engine
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Points Earning Ratio</label>
                <input
                  type="number"
                  value={localCustomerRules.loyaltyAndGreetings?.pointsPerHundred ?? 1}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, pointsPerHundred: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                  placeholder="1 pt per ₹100"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Redemption Value (₹/pt)</label>
                <input
                  type="number"
                  step="0.1"
                  value={localCustomerRules.loyaltyAndGreetings?.pointValueInRupees ?? 1.0}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, pointValueInRupees: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                  placeholder="₹1 per point"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Welcome Signup Bonus</label>
                <input
                  type="number"
                  value={localCustomerRules.loyaltyAndGreetings?.signupBonusPoints ?? 100}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, signupBonusPoints: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">VIP Points Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={localCustomerRules.loyaltyAndGreetings?.vipMultiplier ?? 2.0}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, vipMultiplier: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="smsBday"
                  checked={localCustomerRules.loyaltyAndGreetings?.autoSmsBirthdayGreeting ?? true}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, autoSmsBirthdayGreeting: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#16FFC6]"
                />
                <label htmlFor="smsBday" className="text-white font-bold text-xs cursor-pointer flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#16FFC6]" />
                  Auto WhatsApp Birthday Greetings + 250 PTS Bonus
                </label>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="smsAnni"
                  checked={localCustomerRules.loyaltyAndGreetings?.autoSmsAnniversaryGreeting ?? true}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    loyaltyAndGreetings: { ...localCustomerRules.loyaltyAndGreetings, autoSmsAnniversaryGreeting: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#16FFC6]"
                />
                <label htmlFor="smsAnni" className="text-white font-bold text-xs cursor-pointer flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#16FFC6]" />
                  Auto WhatsApp Wedding Anniversary Wishes + 300 PTS Bonus
                </label>
              </div>
            </div>
          </div>

          {/* CREDIT RISK & LATE FEES */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Percent className="w-4 h-4 text-[#5ED29C]" />
              Credit Risk Grace Period & Overdue Interest Rates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Grace Period (Days before Lockout)</label>
                <input
                  type="number"
                  value={localCustomerRules.creditRiskAndLateFees?.gracePeriodDays ?? 5}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    creditRiskAndLateFees: { ...localCustomerRules.creditRiskAndLateFees, gracePeriodDays: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Late Payment Penalty Rate (% / month)</label>
                <input
                  type="number"
                  step="0.1"
                  value={localCustomerRules.creditRiskAndLateFees?.lateFeePercentPerMonth ?? 1.5}
                  onChange={(e) => setLocalCustomerRules({
                    ...localCustomerRules,
                    creditRiskAndLateFees: { ...localCustomerRules.creditRiskAndLateFees, lateFeePercentPerMonth: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* RULE 8: CONFIGURATION OF VISIBLE VS. HIDDEN CUSTOMER FIELDS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#5ED29C]" />
                8. Configuration of Visible vs. Hidden Customer Fields (23 Fields + Bank Details)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAllCustomerVisibility(true)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setAllCustomerVisibility(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10">
              {Object.keys(customerFieldLabels).map((fieldKey) => (
                <label key={fieldKey} className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean((localCustomerRules.fieldVisibility as any)[fieldKey])}
                    onChange={(e) => setLocalCustomerRules({
                      ...localCustomerRules,
                      fieldVisibility: { ...localCustomerRules.fieldVisibility, [fieldKey]: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#5ED29C]"
                  />
                  <span className="font-semibold text-xs text-white">
                    {customerFieldLabels[fieldKey]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={handleSaveCustomerSettings}
              className="px-8 py-3.5 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#5ED29C]/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Customer Rules & Policy Settings
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Customer Rules Saved Globally!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR RULES & POLICY SETTINGS */}
      {activeTab === 'vendor_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-purple-500/30 space-y-8 text-xs">
          
          {/* HEADER PRESETS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-400" />
                VENDOR RULES & POLICY SETTINGS<span className="text-purple-400">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">Configure auto-prefix rules, payment terms, GST/PAN validation, bank details & field visibility controls.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyVendorPreset('strict')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Preset: Strict OEM Hardware
              </button>
              <button
                type="button"
                onClick={() => applyVendorPreset('outsource')}
                className="px-3 py-1.5 rounded-xl bg-[#5ED29C]/20 hover:bg-[#5ED29C] text-[#5ED29C] hover:text-[#070B0A] border border-[#5ED29C]/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" /> Preset: Outsource Repair Lab
              </button>
            </div>
          </div>

          {/* VENDOR RULE 1: AUTO-NUMBERING RULES */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Hash className="w-4 h-4 text-purple-400" />
              1. Vendor ID Auto-Numbering Rules (Dual Prefix)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5ED29C]" /> Standard Vendor Rule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Prefix Pattern</label>
                    <input
                      type="text"
                      value={localVendorRules.standardPrefix}
                      onChange={(e) => setLocalVendorRules({ ...localVendorRules, standardPrefix: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                    <input
                      type="number"
                      value={localVendorRules.standardStartWithNo}
                      onChange={(e) => setLocalVendorRules({ ...localVendorRules, standardStartWithNo: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample: <span className="font-mono text-[#5ED29C] font-bold">{localVendorRules.standardPrefix}{localVendorRules.standardStartWithNo}</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-purple-400" /> Outsource Vendor Rule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Prefix Pattern</label>
                    <input
                      type="text"
                      value={localVendorRules.outsourcePrefix}
                      onChange={(e) => setLocalVendorRules({ ...localVendorRules, outsourcePrefix: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                    <input
                      type="number"
                      value={localVendorRules.outsourceStartWithNo}
                      onChange={(e) => setLocalVendorRules({ ...localVendorRules, outsourceStartWithNo: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample: <span className="font-mono text-purple-400 font-bold">{localVendorRules.outsourcePrefix}{localVendorRules.outsourceStartWithNo}</span></p>
              </div>
            </div>
          </div>

          {/* VENDOR RULE 2: DEFAULT VENDOR DISPLAY FORMAT */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
              2. Default Vendor Display Format (List View vs Box Grid View)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocalVendorRules({ ...localVendorRules, displayFormat: 'tabular' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localVendorRules.displayFormat === 'tabular'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <List className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Single-line format (List View)</div>
                  <div className="text-[10px]">Dense tabular list layout showing vendor codes & payables</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalVendorRules({ ...localVendorRules, displayFormat: 'grid' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localVendorRules.displayFormat === 'grid'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Box format (Box Grid View)</div>
                  <div className="text-[10px]">Visual grid card layout showing vendor badges & bank cards</div>
                </div>
              </button>
            </div>
          </div>

          {/* VENDOR RULE 3: CREDIT LIMITS & PO BLOCKING */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              3. Credit Limits & Purchase Order Overrun Block
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Max Credit Limit (₹)</label>
                <input
                  type="number"
                  value={localVendorRules.defaultMaxCreditLimit}
                  onChange={(e) => setLocalVendorRules({ ...localVendorRules, defaultMaxCreditLimit: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Standard Payment Terms</label>
                <select
                  value={localVendorRules.paymentDueTerms}
                  onChange={(e) => setLocalVendorRules({ ...localVendorRules, paymentDueTerms: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value="immediate">Immediate / Cash Advance</option>
                  <option value="net15">Net 15 Days</option>
                  <option value="net30">Net 30 Days</option>
                  <option value="net60">Net 60 Days</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <input
                type="checkbox"
                id="blockPo"
                checked={localVendorRules.blockPoOnCreditExceeded}
                onChange={(e) => setLocalVendorRules({ ...localVendorRules, blockPoOnCreditExceeded: e.target.checked })}
                className="w-4 h-4 accent-purple-500"
              />
              <label htmlFor="blockPo" className="text-white font-bold text-xs cursor-pointer">
                Block Purchase Orders & Repair Dispatches when Vendor Payable Outstanding exceeds Max Credit Limit
              </label>
            </div>
          </div>

          {/* VENDOR RULE 4: STATUTORY TAX & KYC VALIDATION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              4. Statutory Tax & KYC Validation Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="reqGstin"
                  checked={localVendorRules.requireGstin}
                  onChange={(e) => setLocalVendorRules({ ...localVendorRules, requireGstin: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="reqGstin" className="text-white font-bold text-xs cursor-pointer">
                  Mandatory GSTIN Validation for Standard B2B Vendors
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="reqPan"
                  checked={localVendorRules.requirePan}
                  onChange={(e) => setLocalVendorRules({ ...localVendorRules, requirePan: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="reqPan" className="text-white font-bold text-xs cursor-pointer">
                  Mandatory PAN Validation for Outsource Repair Service TDS
                </label>
              </div>
            </div>
          </div>

          {/* VENDOR RULE 5: VISIBLE VS. HIDDEN VENDOR FIELDS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#16FFC6]" />
                5. Configuration of Visible vs. Hidden Vendor Fields (21 Fields + Bank Details)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAllVendorVisibility(true)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setAllVendorVisibility(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10">
              {Object.keys(vendorFieldLabels).map((fieldKey) => (
                <label key={fieldKey} className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean((localVendorRules.fieldVisibility as any)[fieldKey])}
                    onChange={(e) => setLocalVendorRules({
                      ...localVendorRules,
                      fieldVisibility: { ...localVendorRules.fieldVisibility, [fieldKey]: e.target.checked }
                    })}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="font-semibold text-xs text-white">
                    {vendorFieldLabels[fieldKey]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={handleSaveVendorSettings}
              className="px-8 py-3.5 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Vendor Rules & Policy Settings
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Vendor Policy Settings Saved Globally!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY RULES & POLICY SETTINGS */}
      {activeTab === 'inventory_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-emerald-400/30 space-y-8 text-xs">
          
          {/* HEADER PRESETS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-400/20 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                INVENTORY RULES & POLICY SETTINGS<span className="text-emerald-400">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">Configure auto-prefix rules for Retail Parts (PRT-1001) & Service Parts (SRV-1001), low stock alerts & view formats.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyInventoryPreset('warehouse')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-400 text-emerald-300 hover:text-[#070B0A] border border-emerald-500/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" /> Preset: Hardware Warehouse
              </button>
              <button
                type="button"
                onClick={() => applyInventoryPreset('service_lab')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" /> Preset: Service Rework Lab
              </button>
            </div>
          </div>

          {/* RULE 1: INVENTORY AUTO-PREFIX RULES */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              1. Inventory Auto-Numbering Rules (Dual Prefix PRT- / SRV-)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5ED29C]" /> Retail Part Prefix Rule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Prefix Pattern</label>
                    <input
                      type="text"
                      value={localInventoryRules.retailPrefix}
                      onChange={(e) => setLocalInventoryRules({ ...localInventoryRules, retailPrefix: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                    <input
                      type="number"
                      value={localInventoryRules.retailStartWithNo}
                      onChange={(e) => setLocalInventoryRules({ ...localInventoryRules, retailStartWithNo: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample: <span className="font-mono text-[#5ED29C] font-bold">{localInventoryRules.retailPrefix}{localInventoryRules.retailStartWithNo}</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" /> Service Part Prefix Rule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Prefix Pattern</label>
                    <input
                      type="text"
                      value={localInventoryRules.servicePrefix}
                      onChange={(e) => setLocalInventoryRules({ ...localInventoryRules, servicePrefix: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                    <input
                      type="number"
                      value={localInventoryRules.serviceStartWithNo}
                      onChange={(e) => setLocalInventoryRules({ ...localInventoryRules, serviceStartWithNo: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample: <span className="font-mono text-purple-400 font-bold">{localInventoryRules.servicePrefix}{localInventoryRules.serviceStartWithNo}</span></p>
              </div>
            </div>
          </div>

          {/* RULE 2: INVENTORY DISPLAY FORMAT */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
              2. Default Inventory Display Format (List View vs Box Grid View)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocalInventoryRules({ ...localInventoryRules, displayFormat: 'tabular' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localInventoryRules.displayFormat === 'tabular'
                    ? 'bg-emerald-400/20 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <List className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Single-line format (List View)</div>
                  <div className="text-[10px]">Dense tabular list layout with HSN codes & pricing</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalInventoryRules({ ...localInventoryRules, displayFormat: 'grid' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localInventoryRules.displayFormat === 'grid'
                    ? 'bg-emerald-400/20 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Box format (Box Grid View)</div>
                  <div className="text-[10px]">Visual grid card layout showing product pictures & stock alerts</div>
                </div>
              </button>
            </div>
          </div>

          {/* RULE 3: LOW STOCK THRESHOLD */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              3. Stock Threshold & Low Stock Reorder Alert Rules
            </h3>
            <div className="max-w-xs">
              <label className="block text-white/70 mb-1 font-bold">Default Low Stock Alert Quantity</label>
              <input
                type="number"
                value={localInventoryRules.defaultLowStockAlert}
                onChange={(e) => setLocalInventoryRules({ ...localInventoryRules, defaultLowStockAlert: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          {/* RULE 4: VISIBLE VS HIDDEN INVENTORY FIELDS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                4. Configuration of Visible vs. Hidden Inventory Fields
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAllInventoryVisibility(true)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setAllInventoryVisibility(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase border border-white/10"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10">
              {Object.keys(inventoryFieldLabels).map((fieldKey) => (
                <label key={fieldKey} className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean((localInventoryRules.fieldVisibility as any)[fieldKey])}
                    onChange={(e) => setLocalInventoryRules({
                      ...localInventoryRules,
                      fieldVisibility: { ...localInventoryRules.fieldVisibility, [fieldKey]: e.target.checked }
                    })}
                    className="w-4 h-4 accent-emerald-400"
                  />
                  <span className="font-semibold text-xs text-white">
                    {inventoryFieldLabels[fieldKey]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={handleSaveInventorySettings}
              className="px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-[#070B0A] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-400/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Inventory Rules & Policy Settings
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Inventory Policy Settings Saved Globally!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB: EMPLOYEE RULES & POLICY SETTINGS */}
      {activeTab === 'employee_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-8 text-xs">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5ED29C]" />
                EMPLOYEE RULES &amp; POLICY SETTINGS<span className="text-[#5ED29C]">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Configure auto-prefix, managed departments, designation titles, government ID types, display format &amp; field visibility controls.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveEmployeeSettings}
              className="px-5 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Save className="w-4 h-4" /> Save Employee Settings
            </button>
          </div>

          {/* RULE 1: ID AUTO-NUMBERING */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Hash className="w-4 h-4 text-[#5ED29C]" />
              1. Employee ID Auto-Prefix &amp; Starting Sequence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Auto-Prefix Pattern</label>
                <input
                  type="text"
                  value={localEmployeeRules.employeePrefix}
                  onChange={(e) => setLocalEmployeeRules({ ...localEmployeeRules, employeePrefix: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  placeholder="EMP-"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                <input
                  type="number"
                  value={localEmployeeRules.employeeStartWithNo}
                  onChange={(e) => setLocalEmployeeRules({ ...localEmployeeRules, employeeStartWithNo: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  placeholder="1001"
                />
              </div>
            </div>
            <p className="text-[10px] text-white/40">
              Sample Code Preview: <span className="font-mono text-[#5ED29C] font-bold">{localEmployeeRules.employeePrefix}{localEmployeeRules.employeeStartWithNo}</span>
            </p>
          </div>

          {/* RULE 2: DEFAULT DISPLAY FORMAT */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <LayoutGrid className="w-4 h-4 text-[#5ED29C]" />
              2. Default Roster View Format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocalEmployeeRules({ ...localEmployeeRules, displayFormat: 'tabular' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localEmployeeRules.displayFormat === 'tabular'
                    ? 'bg-[#5ED29C]/10 border-[#5ED29C] text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <List className="w-5 h-5 text-[#5ED29C]" />
                <div>
                  <div className="font-bold text-white">Data Table View (Tabular)</div>
                  <div className="text-[10px]">Dense data grid with quick column sorting &amp; actions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalEmployeeRules({ ...localEmployeeRules, displayFormat: 'grid' })}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 ${
                  localEmployeeRules.displayFormat === 'grid'
                    ? 'bg-[#5ED29C]/10 border-[#5ED29C] text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-[#5ED29C]" />
                <div>
                  <div className="font-bold text-white">Grid Cards View</div>
                  <div className="text-[10px]">Visual profile cards with staff avatars &amp; quick badges</div>
                </div>
              </button>
            </div>
          </div>

          {/* RULE 3: MANAGED DEPARTMENTS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Building2 className="w-4 h-4 text-[#5ED29C]" />
              3. Managed Departments (Selectable Dropdown Options)
            </h3>
            <div className="flex flex-wrap gap-2">
              {(localEmployeeRules.departmentOptions || []).map((dept) => (
                <span
                  key={dept}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs flex items-center gap-2"
                >
                  {dept}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (localEmployeeRules.departmentOptions || []).filter((d) => d !== dept);
                      setLocalEmployeeRules({ ...localEmployeeRules, departmentOptions: updated });
                    }}
                    className="text-white/40 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="text"
                value={newEmpDeptInput}
                onChange={(e) => setNewEmpDeptInput(e.target.value)}
                placeholder="Enter new Department (e.g. Accounts & Finance)"
                className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newEmpDeptInput.trim()) return;
                  const trimmed = newEmpDeptInput.trim();
                  if (!localEmployeeRules.departmentOptions.includes(trimmed)) {
                    setLocalEmployeeRules({
                      ...localEmployeeRules,
                      departmentOptions: [...localEmployeeRules.departmentOptions, trimmed],
                    });
                  }
                  setNewEmpDeptInput('');
                }}
                className="px-3 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-bold text-xs cursor-pointer"
              >
                + Add Dept
              </button>
            </div>
          </div>

          {/* RULE 4: MANAGED DESIGNATIONS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <Briefcase className="w-4 h-4 text-cyan-300" />
              4. Managed Designations / Role Titles
            </h3>
            <div className="flex flex-wrap gap-2">
              {(localEmployeeRules.designationOptions || []).map((desig) => (
                <span
                  key={desig}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 font-semibold text-xs flex items-center gap-2"
                >
                  {desig}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (localEmployeeRules.designationOptions || []).filter((d) => d !== desig);
                      setLocalEmployeeRules({ ...localEmployeeRules, designationOptions: updated });
                    }}
                    className="text-white/40 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="text"
                value={newEmpDesigInput}
                onChange={(e) => setNewEmpDesigInput(e.target.value)}
                placeholder="Enter new Designation (e.g. Cleanroom Specialist)"
                className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newEmpDesigInput.trim()) return;
                  const trimmed = newEmpDesigInput.trim();
                  if (!localEmployeeRules.designationOptions.includes(trimmed)) {
                    setLocalEmployeeRules({
                      ...localEmployeeRules,
                      designationOptions: [...localEmployeeRules.designationOptions, trimmed],
                    });
                  }
                  setNewEmpDesigInput('');
                }}
                className="px-3 py-2 rounded-xl bg-cyan-400 text-[#070B0A] font-bold text-xs cursor-pointer"
              >
                + Add Title
              </button>
            </div>
          </div>

          {/* RULE 5: MANAGED GOVT ID TYPES */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              5. Managed Government ID Document Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {(localEmployeeRules.govtIdTypeOptions || []).map((gid) => (
                <span
                  key={gid}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-amber-300 font-semibold text-xs flex items-center gap-2"
                >
                  {gid}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (localEmployeeRules.govtIdTypeOptions || []).filter((g) => g !== gid);
                      setLocalEmployeeRules({ ...localEmployeeRules, govtIdTypeOptions: updated });
                    }}
                    className="text-white/40 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="text"
                value={newEmpGovtIdInput}
                onChange={(e) => setNewEmpGovtIdInput(e.target.value)}
                placeholder="Enter new Govt ID Type (e.g. Passport)"
                className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newEmpGovtIdInput.trim()) return;
                  const trimmed = newEmpGovtIdInput.trim();
                  if (!localEmployeeRules.govtIdTypeOptions.includes(trimmed)) {
                    setLocalEmployeeRules({
                      ...localEmployeeRules,
                      govtIdTypeOptions: [...localEmployeeRules.govtIdTypeOptions, trimmed],
                    });
                  }
                  setNewEmpGovtIdInput('');
                }}
                className="px-3 py-2 rounded-xl bg-amber-400 text-[#070B0A] font-bold text-xs cursor-pointer"
              >
                + Add ID Type
              </button>
            </div>
          </div>

          {/* RULE 6: FIELD VISIBILITY CONTROLS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#5ED29C]" />
                6. Employee Form &amp; Roster Field Visibility Controls
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allTrue: any = {};
                    Object.keys(localEmployeeRules.fieldVisibility || {}).forEach((k) => (allTrue[k] = true));
                    setLocalEmployeeRules({ ...localEmployeeRules, fieldVisibility: allTrue });
                  }}
                  className="text-[10px] text-[#5ED29C] hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-white/30">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const allFalse: any = {};
                    Object.keys(localEmployeeRules.fieldVisibility || {}).forEach((k) => (allFalse[k] = false));
                    setLocalEmployeeRules({ ...localEmployeeRules, fieldVisibility: allFalse });
                  }}
                  className="text-[10px] text-rose-400 hover:underline font-bold cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'empCode', label: '1. Employee ID' },
                { key: 'name', label: '2. Employee Name' },
                { key: 'phone', label: '3. Contact Number' },
                { key: 'alternatePhone', label: '4. Alternate Number' },
                { key: 'email', label: '5. Email Address' },
                { key: 'address', label: '6. Address' },
                { key: 'department', label: '8. Department' },
                { key: 'designation', label: '9. Designation / Title' },
                { key: 'baseSalary', label: '10. Base Monthly Salary' },
                { key: 'joiningDate', label: '11. Joining Date' },
                { key: 'emergencyContact', label: '12-13. Emergency Contact' },
                { key: 'govtId', label: '14-15. Government ID' },
                { key: 'idAttachment', label: '16. ID Attachment Link' },
                { key: 'activeStatus', label: '17. Active Status' },
                { key: 'bankDetails', label: '19. Bank Details (6 fields)' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={Boolean((localEmployeeRules.fieldVisibility as any)?.[key])}
                    onChange={(e) => {
                      const updated = { ...localEmployeeRules.fieldVisibility, [key]: e.target.checked };
                      setLocalEmployeeRules({ ...localEmployeeRules, fieldVisibility: updated as any });
                    }}
                    className="w-4 h-4 accent-[#5ED29C] rounded cursor-pointer"
                  />
                  <span className="font-semibold text-xs">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={handleSaveEmployeeSettings}
              className="px-8 py-3.5 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#5ED29C]/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Employee Rules &amp; Policy Settings
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Employee Policy Settings Saved Globally!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REPAIR TICKET RULES & POLICY SETTINGS */}
      {activeTab === 'repair_billing_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-[#5ED29C]/30 space-y-8 text-xs">
          <div className="border-b border-[#5ED29C]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#5ED29C]" />
                REPAIR TICKET RULES &amp; CONTRACT TERMS CONFIGURATION<span className="text-[#5ED29C]">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">Manage Repair Ticket numbering, customizable terms &amp; conditions, data liability warnings, rack locations, and print layout controls.</p>
            </div>

            <button
              onClick={handleSaveRepairBillingSettings}
              className="px-6 py-3 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#5ED29C]/25 transition-all self-start sm:self-auto"
            >
              <Save className="w-4 h-4" /> Save Repair Ticket Rules
            </button>
          </div>

          {/* 1. SEPARATE TICKET & INVOICE AUTO-NUMBERING RULES */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
              <Hash className="w-4 h-4" /> 1. Separate Auto-Numbering Rules (Repair Tickets vs Repair Billing)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card A: Repair Ticket Auto-Numbering (TKT-1001) */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-extrabold text-[#5ED29C] text-xs uppercase flex items-center justify-between">
                  <span>Repair Ticket Auto-Numbering</span>
                  <span className="font-mono text-[10px] bg-[#5ED29C]/10 text-[#5ED29C] px-2 py-0.5 rounded border border-[#5ED29C]/30">JOB CARDS</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Ticket Prefix</label>
                    <input
                      type="text"
                      value={localRepairBillingRules.repair_ticket_prefix || localRepairBillingRules.repair_bill_prefix || 'TKT-'}
                      onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_ticket_prefix: e.target.value, repair_bill_prefix: e.target.value })}
                      placeholder="TKT-"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start Sequence No.</label>
                    <input
                      type="number"
                      value={localRepairBillingRules.repair_ticket_start_no || localRepairBillingRules.repair_bill_start_no || 1001}
                      onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_ticket_start_no: Number(e.target.value), repair_bill_start_no: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample Repair Ticket ID: <span className="font-mono text-[#16FFC6] font-bold">{(localRepairBillingRules.repair_ticket_prefix || 'TKT-')}{(localRepairBillingRules.repair_ticket_start_no || 1001)}</span></p>
              </div>

              {/* Card B: Repair Billing Auto-Numbering (RBN-1001) */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-extrabold text-amber-300 text-xs uppercase flex items-center justify-between">
                  <span>Repair Billing Auto-Numbering</span>
                  <span className="font-mono text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">TAX INVOICES</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Invoice Prefix</label>
                    <input
                      type="text"
                      value={localRepairBillingRules.repair_invoice_prefix || 'RBN-'}
                      onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_invoice_prefix: e.target.value })}
                      placeholder="RBN-"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-amber-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Start Sequence No.</label>
                    <input
                      type="number"
                      value={localRepairBillingRules.repair_invoice_start_no || 1001}
                      onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_invoice_start_no: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/40">Sample Tax Invoice Bill ID: <span className="font-mono text-amber-300 font-bold">{(localRepairBillingRules.repair_invoice_prefix || 'RBN-')}{(localRepairBillingRules.repair_invoice_start_no || 1001)}</span></p>
              </div>
            </div>

            {/* Default GST & Default Print Copy Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default GST Tax Rate (%)</label>
                <select
                  value={localRepairBillingRules.repair_bill_default_tax}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_bill_default_tax: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value={18}>18% GST (Standard Hardware &amp; Labor)</option>
                  <option value={12}>12% GST</option>
                  <option value={5}>5% GST</option>
                  <option value={0}>0% Exempted</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Print Copy Mode</label>
                <select
                  value={localRepairBillingRules.defaultPrintCopyMode || 'both'}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, defaultPrintCopyMode: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-bold"
                >
                  <option value="both">Both Copies (Customer + Office)</option>
                  <option value="customer">Customer Copy Only</option>
                  <option value="office">Office Copy Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/40">Tickets and invoices will maintain independent sequential numbers.</span>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localRepairBillingRules.repair_bill_auto_roundoff ?? true}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, repair_bill_auto_roundoff: e.target.checked })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <span className="text-white font-bold text-xs">Auto-Roundoff Payable Net Due Balance</span>
              </label>
            </div>
          </div>

          {/* 2. SEPARATE CONTRACT TERMS & CONDITIONS (TICKETS VS BILLING) */}
          <div className="space-y-6">
            {/* Card 2A: REPAIR TICKET CONTRACT TERMS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#5ED29C]" /> 2A. Repair Ticket Contract Terms (Printed on Job Cards / Intake Sheets)
                </h3>
                <span className="text-[10px] font-mono text-[#5ED29C] font-bold bg-[#5ED29C]/10 px-2 py-0.5 rounded border border-[#5ED29C]/30">JOB CARDS</span>
              </div>

              <div className="space-y-3">
                {(localRepairBillingRules.ticketTermsAndConditions || localRepairBillingRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#5ED29C]/10 text-[#5ED29C] font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleUpdateTicketTerm(index, e.target.value)}
                      placeholder="Enter repair ticket condition statement..."
                      className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTicketTerm(index)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={newTicketTermInput}
                  onChange={(e) => setNewTicketTermInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTicketTerm())}
                  placeholder="Type new repair ticket terms bullet point..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-[#5ED29C]/30 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTicketTerm}
                  className="px-5 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shrink-0"
                >
                  + Add Ticket Condition
                </button>
              </div>
            </div>

            {/* Card 2B: REPAIR BILLING CONTRACT TERMS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-300" /> 2B. Repair Billing Contract Terms (Printed on Tax Invoices / Receipts)
                </h3>
                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">TAX INVOICES</span>
              </div>

              <div className="space-y-3">
                {(localRepairBillingRules.billingTermsAndConditions || [
                  '30 Days Parts & Labor Warranty.',
                  'Warranty void with physical damage, liquid exposure, or open warranty seal.',
                  'Backup data prior to servicing; Accno Solution is not liable for data loss.',
                ]).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-400/10 text-amber-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleUpdateBillingTerm(index, e.target.value)}
                      placeholder="Enter repair bill condition statement..."
                      className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteBillingTerm(index)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={newBillingTermInput}
                  onChange={(e) => setNewBillingTermInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBillingTerm())}
                  placeholder="Type new repair billing terms bullet point..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-amber-500/30 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBillingTerm}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shrink-0"
                >
                  + Add Billing Condition
                </button>
              </div>
            </div>
          </div>

          {/* 3. DATA LIABILITY WARNING BANNER */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> 3. Data Liability Notice Warning Banner
            </h3>
            <p className="text-[10px] text-white/50">Highlighted in red/pink banner on printed tickets to safeguard against customer data loss claims.</p>

            <textarea
              rows={2}
              value={localRepairBillingRules.dataLiabilityNotice}
              onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, dataLiabilityNotice: e.target.value })}
              placeholder="DATA LIABILITY NOTICE: Customers are requested to back up all data before submitting devices..."
              className="w-full p-3 rounded-xl bg-[#0D1117] border border-rose-500/30 text-rose-200 text-xs font-medium"
            />
          </div>

          {/* 4. DEFAULT WARRANTY STATEMENT */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 4. Default Service &amp; Spare Parts Warranty Declaration
            </h3>

            <input
              type="text"
              value={localRepairBillingRules.defaultWarrantyStatement}
              onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, defaultWarrantyStatement: e.target.value })}
              placeholder="30 Days Parts & Labor Warranty"
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs"
            />
          </div>

          {/* 5. PRINTED FOOTER LEGAL JURISDICTION NOTICE & DOCUMENT TAGLINE */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5ED29C]" /> 5. Printed Footer Legal Jurisdiction &amp; Receipt Tagline
              </h3>
              <span className="text-[10px] text-white/50">Printed at bottom-left of every Repair Bill &amp; Job Card</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Legal Jurisdiction &amp; Thank You Message</label>
                <input
                  type="text"
                  value={localRepairBillingRules.printFooterLegalNotice ?? 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.'}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, printFooterLegalNotice: e.target.value })}
                  placeholder="THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION."
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold text-xs"
                />
                <span className="text-[10px] text-white/40 block mt-1">First line of bottom footer message</span>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Document Sub-Footer Tagline / Receipt Label</label>
                <input
                  type="text"
                  value={localRepairBillingRules.printFooterDocTypeLabel ?? 'Computer Generated Official Repair Receipt.'}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, printFooterDocTypeLabel: e.target.value })}
                  placeholder="Computer Generated Official Repair Receipt."
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold text-xs"
                />
                <span className="text-[10px] text-white/40 block mt-1">Second line of bottom footer tagline</span>
              </div>
            </div>
          </div>

          {/* 5. PRINTED JOB CARD LAYOUT & PAGE FIT CONTROLS */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4" /> 5. Printed Job Card Display Controls &amp; 1-Page A4 Height Optimization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={localRepairBillingRules.showPatternLockGrid}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, showPatternLockGrid: e.target.checked })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <div>
                  <span className="text-white font-bold block">Show 3x3 Smartphone Pattern Lock Grid</span>
                  <span className="text-[10px] text-white/50">Prints visual pattern sequence on ticket</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={localRepairBillingRules.showUpiQrCode}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, showUpiQrCode: e.target.checked })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <div>
                  <span className="text-white font-bold block">Show Merchant UPI Payment QR Code</span>
                  <span className="text-[10px] text-white/50">Prints scannable UPI barcode box</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={localRepairBillingRules.showSignatureBlock}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, showSignatureBlock: e.target.checked })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <div>
                  <span className="text-white font-bold block">Show Authorized Customer &amp; Officer Signatures</span>
                  <span className="text-[10px] text-white/50">Prints dual signature signoff lines</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={localRepairBillingRules.fitToOnePage}
                  onChange={(e) => setLocalRepairBillingRules({ ...localRepairBillingRules, fitToOnePage: e.target.checked })}
                  className="w-4 h-4 accent-[#5ED29C]"
                />
                <div>
                  <span className="text-[#16FFC6] font-bold block">Enforce 1-Page A4 Height Fit</span>
                  <span className="text-[10px] text-white/50">Prevents overflow spilling onto 2 sheets</span>
                </div>
              </label>
            </div>
          </div>

          {/* 6. STORAGE RACK & PRIORITY LIST REGISTRIES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Storage Locker Locations */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4" /> 6. Storage Rack / Shelf Location Options
              </h3>

              <div className="flex flex-wrap gap-2">
                {(localRepairBillingRules.rackLocationOptions || []).map((rack) => (
                  <span key={rack} className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs flex items-center gap-2">
                    {rack}
                    <button
                      type="button"
                      onClick={() => handleDeleteRackOption(rack)}
                      className="text-rose-400 hover:text-rose-300 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newRackInput}
                  onChange={(e) => setNewRackInput(e.target.value)}
                  placeholder="e.g. Rack 05, Bin 12..."
                  className="flex-1 p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddRackOption}
                  className="px-3 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-[10px] uppercase shrink-0"
                >
                  + Add Rack
                </button>
              </div>
            </div>

            {/* SLA Priority Levels */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> 7. Repair Priority &amp; SLA Levels
              </h3>

              <div className="flex flex-wrap gap-2">
                {(localRepairBillingRules.priorityOptions || []).map((prio) => (
                  <span key={prio} className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center gap-2">
                    {prio}
                    <button
                      type="button"
                      onClick={() => handleDeletePriorityOption(prio)}
                      className="text-rose-400 hover:text-rose-300 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newPriorityInput}
                  onChange={(e) => setNewPriorityInput(e.target.value)}
                  placeholder="e.g. CRITICAL, SAME-DAY..."
                  className="flex-1 p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs uppercase"
                />
                <button
                  type="button"
                  onClick={handleAddPriorityOption}
                  className="px-3 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-[10px] uppercase shrink-0"
                >
                  + Add Priority
                </button>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Repair Ticket Rules &amp; Terms Saved Globally across ERP!
              </span>
            ) : (
              <span className="text-[11px] text-white/40">Configured terms, notices, and priority levels will automatically populate ticket intake and print job cards.</span>
            )}

            <button
              onClick={handleSaveRepairBillingSettings}
              className="px-8 py-3.5 bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#5ED29C]/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Repair Ticket Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: OUTSOURCE RULES & POLICY SETTINGS */}
      {activeTab === 'outsource_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-purple-500/30 space-y-8 text-xs">
          <div className="border-b border-purple-500/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-400" />
                OUTSOURCED SERVICE &amp; REPAIR RULES<span className="text-purple-400">.</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">Configure Outsource Voucher prefix (OUT-1001), dynamic service type registries, default freight charges, preferred labs, and label formats.</p>
            </div>

            <button
              onClick={handleSaveOutsourceSettings}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all self-start sm:self-auto"
            >
              <Save className="w-4 h-4" /> Save Outsource Rules
            </button>
          </div>

          {/* 1. OUTSOURCE VOUCHER AUTO-NUMBERING RULE */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4" /> 1. Outsource Voucher Auto-Numbering &amp; Freight Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Voucher Prefix (Default: OUT-)</label>
                <input
                  type="text"
                  value={localOutsourceRules.outsource_ticket_prefix}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_ticket_prefix: e.target.value })}
                  placeholder="OUT-"
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-purple-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-bold">Start Sequence No.</label>
                <input
                  type="number"
                  value={localOutsourceRules.outsource_ticket_start_no}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_ticket_start_no: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Courier / Freight Charge (₹)</label>
                <input
                  type="number"
                  value={localOutsourceRules.outsource_default_freight}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_default_freight: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold"
                />
              </div>
            </div>
            <p className="text-[10px] text-white/40">Sample Voucher ID generated: <span className="font-mono text-purple-300 font-bold">{localOutsourceRules.outsource_ticket_prefix}{localOutsourceRules.outsource_ticket_start_no}</span></p>
          </div>

          {/* 2. DYNAMIC SERVICE TYPES REGISTRY */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4" /> 2. Dynamic Service Types Registry
            </h3>

            {/* Input to add new service type */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newOutsourceServiceInput}
                onChange={(e) => setNewOutsourceServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutsourceServiceType())}
                placeholder="e.g. Cleanroom Platter Rework"
                className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold text-xs"
              />
              <button
                type="button"
                onClick={handleAddOutsourceServiceType}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold uppercase text-xs tracking-wider transition-all shrink-0"
              >
                + Add Service Type
              </button>
            </div>

            {/* Badges with X button */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {(localOutsourceRules.outsource_service_types || []).map((st, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold text-xs flex items-center gap-2 group hover:border-purple-400 transition-all"
                >
                  <span>{st}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOutsourceServiceType(st)}
                    className="p-0.5 rounded hover:bg-rose-500/30 text-purple-300 hover:text-rose-300 transition-colors"
                    title={`Delete "${st}"`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 3. DEFAULT PREFERRED OUTSOURCE LAB / VENDOR & SYSTEM RULES */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> 3. Preferred Vendor &amp; Automated System Safeguards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Preferred Outsource Rework Lab</label>
                <select
                  value={localOutsourceRules.outsource_default_vendor_id || ''}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_default_vendor_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value="">-- Select Default Vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.companyName} ({v.station || 'Local Lab'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Thermal Shipping Label Format</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalOutsourceRules({ ...localOutsourceRules, outsource_default_label_size: '70x35' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                      (localOutsourceRules.outsource_default_label_size || '70x35') === '70x35'
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    70x35mm Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalOutsourceRules({ ...localOutsourceRules, outsource_default_label_size: '50x30' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                      localOutsourceRules.outsource_default_label_size === '50x30'
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    50x30mm Compact
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localOutsourceRules.outsource_auto_lock_ticket ?? true}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_auto_lock_ticket: e.target.checked })}
                  className="w-4 h-4 accent-purple-400"
                />
                <div>
                  <span className="font-bold text-white">Automatically Lock Repair Ticket Status on Outsource Dispatch</span>
                  <p className="text-[10px] text-white/50">Prevents local technician edits while the device is in an outsourced 3rd-party lab.</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(localOutsourceRules.outsource_require_tracking_ref)}
                  onChange={(e) => setLocalOutsourceRules({ ...localOutsourceRules, outsource_require_tracking_ref: e.target.checked })}
                  className="w-4 h-4 accent-purple-400"
                />
                <div>
                  <span className="font-bold text-white">Require Courier Tracking Docket Reference before Dispatch</span>
                  <p className="text-[10px] text-white/50">Mandates entering courier AWB/docket reference when marking voucher as SHIPPED.</p>
                </div>
              </label>
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> Outsource Rules &amp; Policy Settings Saved Globally across ERP!
              </span>
            ) : (
              <span className="text-[11px] text-white/40">Configured prefix, service types, and default labs will automatically apply to all Outsource Vouchers.</span>
            )}

            <button
              onClick={handleSaveOutsourceSettings}
              className="px-8 py-3.5 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Outsource Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB: POS RULES & COUNTER TERMINAL CONFIGURATION */}
      {activeTab === 'pos_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-blue-500/30 space-y-6 text-xs">
          <div className="border-b border-blue-500/30 pb-3">
            <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              POS RULES &amp; COUNTER TERMINAL CONFIGURATION<span className="text-blue-400">.</span>
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Configure counter POS bill prefixes, receipt printing defaults, merchant UPI QR options, discount limits, and inventory deduction policies.
            </p>
          </div>

          {/* 1. BILL NUMBERING & TERMINAL IDENTITY */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4" /> 1. Bill Sequence Numbering &amp; Terminal Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-white/70 mb-1 font-bold">POS Bill Auto Prefix Pattern *</label>
                <input
                  type="text"
                  required
                  value={localPosRules.posPrefix}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, posPrefix: e.target.value })}
                  placeholder="POS-"
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Starting Sequence Counter *</label>
                <input
                  type="number"
                  required
                  value={localPosRules.posStartWithNo}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, posStartWithNo: Number(e.target.value) })}
                  placeholder="1001"
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Terminal Station ID / Name</label>
                <input
                  type="text"
                  value={localPosRules.terminalId}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, terminalId: e.target.value })}
                  placeholder="TERMINAL #01 (ACTIVE)"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Walk-in Account Name</label>
                <input
                  type="text"
                  value={localPosRules.defaultCustomerName}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, defaultCustomerName: e.target.value })}
                  placeholder="Walk-in Retail Customer"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. RECEIPT PRINTING & AUTOMATION */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4" /> 2. Receipt Printing Layout &amp; Checkout Automation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Print Format</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalPosRules({ ...localPosRules, defaultPrintMode: 'a4' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                      localPosRules.defaultPrintMode === 'a4'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Full A4 Tax Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalPosRules({ ...localPosRules, defaultPrintMode: 'thermal' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                      localPosRules.defaultPrintMode === 'thermal'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    80mm Thermal Receipt Roll
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Default Payment Method</label>
                <select
                  value={localPosRules.defaultPaymentMethod}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, defaultPaymentMethod: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value="upi">UPI / Online QR Payment</option>
                  <option value="cash">Cash Tendered</option>
                  <option value="card">Credit / Debit Card</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPosRules.autoPrintInvoiceOnPayment}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, autoPrintInvoiceOnPayment: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-bold text-white">Auto-Trigger Print Dialog on Payment Confirmation</span>
                  <p className="text-[10px] text-white/50">Automatically opens print dialog when a payment is processed at POS counter.</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPosRules.showMerchantQr}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, showMerchantQr: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-bold text-white">Display Merchant UPI QR Modal at Checkout</span>
                  <p className="text-[10px] text-white/50">Enables one-click Merchant UPI QR code popup for customer payment scanning.</p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. DISCOUNT & LOYALTY CONTROLS */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4" /> 3. Discount Limits &amp; Loyalty Points Policy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Maximum Allowed Discount Limit (%)</label>
                <input
                  type="number"
                  value={localPosRules.maxDiscountPercent}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, maxDiscountPercent: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPosRules.enableDiscountControl}
                    onChange={(e) => setLocalPosRules({ ...localPosRules, enableDiscountControl: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="font-bold text-white">Allow Cashier Discount Adjustments (Fixed ₹ / %)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPosRules.enableLoyaltyRedemption}
                    onChange={(e) => setLocalPosRules({ ...localPosRules, enableLoyaltyRedemption: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="font-bold text-white">Allow Loyalty Points Redemption at POS Counter</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. INVENTORY & CHECKOUT POLICIES */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4" /> 4. Stock &amp; Counter Checkout Policies
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPosRules.autoDeductInventory}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, autoDeductInventory: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-bold text-white">Automatically Deduct Inventory Stock on POS Sale</span>
                  <p className="text-[10px] text-white/50">Deducts stock quantities from Inventory Directory when counter bill is generated.</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPosRules.enableHoldParkBills}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, enableHoldParkBills: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-bold text-white">Enable Bill Parking / Hold Queue</span>
                  <p className="text-[10px] text-white/50">Allows cashiers to temporarily hold customer carts and resume them later.</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPosRules.allowNegativeStock}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, allowNegativeStock: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-bold text-white">Allow Billing Items with Zero or Negative Stock</span>
                  <p className="text-[10px] text-white/50">Permits POS checkout even if the item is currently marked out of stock.</p>
                </div>
              </label>
            </div>
          </div>

          {/* 5. POS TERMS & CONDITIONS MANAGER */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 5. POS Receipt Terms &amp; Conditions Clauses
                </h3>
                <p className="text-[10px] text-white/50">Manage printed terms, warranty disclaimer clauses, and jurisdiction statements on receipts.</p>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                <input
                  type="checkbox"
                  checked={localPosRules.showTermsOnPosReceipt ?? true}
                  onChange={(e) => setLocalPosRules({ ...localPosRules, showTermsOnPosReceipt: e.target.checked })}
                  className="w-3.5 h-3.5 accent-blue-500"
                />
                <span className="font-bold text-blue-300 text-[11px]">Print Terms Box on POS Receipts</span>
              </label>
            </div>

            <div className="space-y-2">
              {(localPosRules.posTermsAndConditions || [
                'Goods once sold will not be accepted back or exchanged without a valid GST tax invoice.',
                'Hardware items carry manufacturer warranty. Physical, burnt, or liquid damage voids warranty.',
                'Customers are advised to inspect products and verify serial numbers at the time of delivery.',
                'Full payment is due upon counter delivery. Subject to Sanchore jurisdiction.',
              ]).map((term, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-blue-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleUpdatePosTerm(index, e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePosTerm(index)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD NEW POS TERM INPUT */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={newPosTermInput}
                onChange={(e) => setNewPosTermInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPosTerm();
                  }
                }}
                placeholder="Type new POS billing term / warranty clause & press Enter or click Add..."
                className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-blue-500/30 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={handleAddPosTerm}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/30"
              >
                <Plus className="w-4 h-4" /> Add Term
              </button>
            </div>
          </div>

          {/* SAVE BUTTON & TOAST */}
          <div className="pt-4 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                <CheckCircle2 className="w-4 h-4" /> POS Rules &amp; Terminal Settings Saved Globally across ERP!
              </span>
            ) : (
              <span className="text-[11px] text-white/40">POS bill prefix, print defaults, and discount rules will automatically apply across POS Terminal.</span>
            )}

            <button
              onClick={handleSavePosSettings}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Save className="w-4 h-4" /> Save POS Rules
            </button>
          </div>
        </div>
      )}

      {/* SALE RULES TAB CONTENT */}
      {activeTab === 'sale_rules' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            
            {/* TAB TITLE & PRESETS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" /> COMMERCIAL SALE RULES &amp; POLICY SETTINGS
                </h2>
                <p className="text-xs text-white/50">
                  Configure default invoice prefixes, auto-numbering, GST tax modes, payment due terms, discount limits, and printout terms &amp; conditions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applySalePreset('b2b')}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-extrabold text-[10px] uppercase tracking-wider transition-all border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Preset: Strict B2B Policy
                </button>
                <button
                  type="button"
                  onClick={() => applySalePreset('retail')}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Preset: Retail Counter Policy
                </button>
              </div>
            </div>

            {/* 1. SALES INVOICE AUTO-NUMBERING RULE */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> # 1. Sales Invoice Prefix &amp; Auto-Numbering Rule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Auto-Prefix Pattern</label>
                  <input
                    type="text"
                    value={localSaleRules.salesInvoicePrefix}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, salesInvoicePrefix: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAL-"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Sample: <span className="text-[#5ED29C] font-mono font-bold">{localSaleRules.salesInvoicePrefix}{localSaleRules.salesInvoiceStartNo}</span></p>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                  <input
                    type="number"
                    value={localSaleRules.salesInvoiceStartNo}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, salesInvoiceStartNo: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. DEFAULT PAYMENT TERMS & GST TAX SUPPLY TYPE */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4" /> 2. Default Billing Payment Terms &amp; GST Tax Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Standard Payment Terms</label>
                  <select
                    value={localSaleRules.defaultPaymentTerms}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, defaultPaymentTerms: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 45 Days">Credit 45 Days</option>
                    <option value="Immediate POS Cash/Terminal">Immediate Cash / Spot Pay</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default GST Supply Mode</label>
                  <select
                    value={localSaleRules.defaultGstSupplyType}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, defaultGstSupplyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Intra-State (CGST + SGST)">Intra-State (CGST + SGST)</option>
                    <option value="Inter-State (IGST)">Inter-State (IGST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Product GST Rate (%)</label>
                  <select
                    value={localSaleRules.defaultTaxRate}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, defaultTaxRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#5ED29C] font-mono font-bold"
                  >
                    <option value={18}>18% Standard Tax</option>
                    <option value={28}>28% High GST</option>
                    <option value={12}>12% IT Accessories</option>
                    <option value={5}>5% Low Tax</option>
                    <option value={0}>0% Tax Exempted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. DISCOUNT & ROUNDING RULES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-4 h-4" /> 3. Discount Controls &amp; Grand Total Rounding Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Max Allowed Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={localSaleRules.maxDiscountPercent}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, maxDiscountPercent: Number(e.target.value) })}
                    className="w-[#0D1117] w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-amber-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSaleRules.autoRoundOffGrandTotal}
                      onChange={(e) => setLocalSaleRules({ ...localSaleRules, autoRoundOffGrandTotal: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="font-bold text-white text-xs">Auto-Round Off Grand Total to Nearest Rupee (₹)</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSaleRules.enableDiscountLimits}
                      onChange={(e) => setLocalSaleRules({ ...localSaleRules, enableDiscountLimits: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="font-bold text-white text-xs">Enforce Maximum Discount Cap Limit</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSaleRules.autoBarcodeScanAddItem}
                      onChange={(e) => setLocalSaleRules({ ...localSaleRules, autoBarcodeScanAddItem: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="font-bold text-white text-xs">Auto-Add Line Item on Barcode Scan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. PRINT DEFAULTS & CUSTOMER VALIDATIONS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" /> 4. Invoice Print Defaults &amp; KYC Validation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Print Paper Format</label>
                  <select
                    value={localSaleRules.defaultPrintPaperFormat}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, defaultPrintPaperFormat: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="A4">A4 Full Sheet (Standard Commercial GST)</option>
                    <option value="A5">A5 Compact Sheet (Single Page Billing)</option>
                    <option value="THERMAL">Thermal 80mm POS Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Print Copy Mode</label>
                  <select
                    value={localSaleRules.defaultPrintCopyMode}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, defaultPrintCopyMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="customer">Original Customer Copy Only</option>
                    <option value="both">Both Original (Customer) + Duplicate (Office)</option>
                    <option value="office">Duplicate Office Copy Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSaleRules.requireCustomerPhone}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, requireCustomerPhone: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="font-bold text-white text-xs">Require Customer Mobile/Phone Number for Sales Invoice</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSaleRules.requireCustomerGstForB2B}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, requireCustomerGstForB2B: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="font-bold text-white text-xs">Require Customer GSTIN for B2B Tax Credit Invoices</span>
                </label>
              </div>
            </div>

            {/* 5. INVOICE PRINT ELEMENT VISIBILITY & DISPLAY TOGGLES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" /> 5. Invoice Print Element Visibility &amp; Display Toggles
              </h3>
              <p className="text-[10px] text-white/50">
                Control which line item details, badges, and financial cards are displayed on printed sales tax invoices by default.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-amber-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localSaleRules.showProductRemarksOnPrint ?? true}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, showProductRemarksOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Line Serial No., IMEI &amp; 3-Line Remarks</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints custom 3-line serial/batch notes under line item titles on bills.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-amber-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localSaleRules.showRefurbishedBadgeOnPrint ?? true}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, showRefurbishedBadgeOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Certified Refurbished Item Badge</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Displays '★ Refurbished' badge &amp; warranty descriptions on invoice rows.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-amber-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localSaleRules.showBankQrOnInvoice ?? true}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, showBankQrOnInvoice: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Bank A/C &amp; Scan &amp; Pay UPI QR Card</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints Company Bank Details &amp; Merchant UPI QR Code card on invoices.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 6. COMMERCIAL SALES TERMS & CONDITIONS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 5. Commercial Sales Terms &amp; Conditions List Box
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Configure terms, conditions, warranty policies, and legal notices printed under 'Remarks / Terms' on all sales bills.
                  </p>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <input
                    type="checkbox"
                    checked={localSaleRules.showTermsBoxOnInvoice}
                    onChange={(e) => setLocalSaleRules({ ...localSaleRules, showTermsBoxOnInvoice: e.target.checked })}
                    className="w-3.5 h-3.5 accent-amber-500"
                  />
                  <span className="font-bold text-amber-300 text-[11px]">Print Terms &amp; Conditions Box on Sales Bills</span>
                </label>
              </div>

              {/* LIST ITEM MANAGER */}
              <div className="space-y-2">
                {(localSaleRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleUpdateSaleTerm(index, e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSaleTerm(index)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 shrink-0 cursor-pointer"
                      title="Delete term clause line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD NEW SALE TERM INPUT */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newSaleTermInput}
                  onChange={(e) => setNewSaleTermInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSaleTerm();
                    }
                  }}
                  placeholder="Type new terms & conditions clause (e.g. '7. Interest @ 18% p.a. charged if bill unpaid after due date.') & press Enter..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddSaleTerm}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Term Line
                </button>
              </div>

              {/* FULL FREE TEXTAREA SPACE FOR ALL TERMS */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-amber-400" /> Full Terms &amp; Conditions Text Area (Paragraph Space)
                </label>
                <p className="text-[10px] text-white/50">
                  You can edit the full multiline terms block directly below. Each line corresponds to a printed bullet point clause on your sales bills.
                </p>
                <textarea
                  rows={6}
                  value={(localSaleRules.termsAndConditions || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setLocalSaleRules({ ...localSaleRules, termsAndConditions: lines });
                  }}
                  placeholder="Paste or type full Terms & Conditions here line by line..."
                  className="w-full p-3 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>

            {/* SAVE BUTTON & TOAST */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Commercial Sale Rules &amp; Terms &amp; Conditions Saved Globally!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">Sale Rules and Terms &amp; Conditions automatically apply to all commercial sales invoices and bill printouts.</span>
              )}

              <button
                onClick={handleSaveSaleSettings}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Sale Rules Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE RULES TAB CONTENT */}
      {activeTab === 'purchase_rules' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            
            {/* TAB TITLE & PRESETS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-sky-400" /> VENDOR PURCHASE &amp; INWARD POLICY SETTINGS
                </h2>
                <p className="text-xs text-white/50">
                  Configure default vendor bill prefixes, auto-numbering, inward GST tax modes, credit payment terms, auto-stock integration, and voucher printout terms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPurchasePreset('strict_b2b')}
                  className="px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-black font-extrabold text-[10px] uppercase tracking-wider transition-all border border-sky-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Preset: Strict Vendor B2B
                </button>
                <button
                  type="button"
                  onClick={() => applyPurchasePreset('lab_procurement')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-all border border-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Preset: Flexible Lab Inward
                </button>
              </div>
            </div>

            {/* 1. PURCHASE BILL AUTO-NUMBERING RULE */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> # 1. Purchase Bill Auto-Prefix &amp; Numbering Rule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Auto-Prefix Pattern</label>
                  <input
                    type="text"
                    value={localPurchaseRules.purchaseBillPrefix}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, purchaseBillPrefix: e.target.value.toUpperCase() })}
                    placeholder="e.g. PUR-"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Sample: <span className="text-sky-400 font-mono font-bold">{localPurchaseRules.purchaseBillPrefix}{localPurchaseRules.purchaseBillStartNo}</span></p>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                  <input
                    type="number"
                    value={localPurchaseRules.purchaseBillStartNo}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, purchaseBillStartNo: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. DEFAULT PAYMENT TERMS & GST TAX SUPPLY TYPE */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4" /> 2. Default Vendor Credit Terms &amp; Inward GST Tax Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Standard Credit Terms</label>
                  <select
                    value={localPurchaseRules.defaultPaymentTerms}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, defaultPaymentTerms: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 45 Days">Credit 45 Days</option>
                    <option value="Immediate Bank Transfer">Immediate Bank Transfer</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default GST Supply Mode</label>
                  <select
                    value={localPurchaseRules.defaultGstSupplyType}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, defaultGstSupplyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Intra-State (CGST + SGST)">Intra-State (CGST + SGST Input Credit)</option>
                    <option value="Inter-State (IGST)">Inter-State (IGST Input Credit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Product GST Rate (%)</label>
                  <select
                    value={localPurchaseRules.defaultTaxRate}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, defaultTaxRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-sky-400 font-mono font-bold"
                  >
                    <option value={18}>18% Standard Tax</option>
                    <option value={28}>28% High GST</option>
                    <option value={12}>12% IT Accessories</option>
                    <option value={5}>5% Low Tax</option>
                    <option value={0}>0% Tax Exempted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. STOCK INTEGRATION & COMPLIANCE RULES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4" /> 3. Stock Auto-Integration &amp; Vendor Compliance Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseRules.autoAddInventoryStock}
                      onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, autoAddInventoryStock: e.target.checked })}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Auto-Increase Inventory Stock on Saving Purchase Bill</span>
                      <p className="text-[10px] text-white/50">Automatically updates system stock counts when vendor inward bills are created.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseRules.autoRoundOffGrandTotal}
                      onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, autoRoundOffGrandTotal: e.target.checked })}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Auto-Round Off Grand Total to Nearest Rupee (₹)</span>
                      <p className="text-[10px] text-white/50">Rounds off inward bill totals to integers for clean ledger entries.</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseRules.requireVendorGst}
                      onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, requireVendorGst: e.target.checked })}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Require Vendor GSTIN for Input Tax Credit (ITC)</span>
                      <p className="text-[10px] text-white/50">Mandates GSTIN entry on vendor records for GST Input Credit claims.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseRules.requireVendorInvoiceNo}
                      onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, requireVendorInvoiceNo: e.target.checked })}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Require Original Vendor Tax Invoice Reference #</span>
                      <p className="text-[10px] text-white/50">Forces cashier to record supplier's physical tax invoice number.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. VOUCHER PRINT DEFAULTS & ELEMENT TOGGLES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" /> 4. Inward Voucher Print Defaults &amp; Display Toggles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Print Paper Format</label>
                  <select
                    value={localPurchaseRules.defaultPrintPaperFormat}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, defaultPrintPaperFormat: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="A4">A4 Full Sheet (Standard Inward Procurement Tax Voucher)</option>
                    <option value="A5">A5 Compact Sheet (Single Page Inward Memo)</option>
                    <option value="THERMAL">Thermal 80mm Receipt</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseRules.showInwardLogisticsNotes}
                      onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, showInwardLogisticsNotes: e.target.checked })}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <span className="font-bold text-white text-xs">Print Logistics &amp; Transport Notes Box on Voucher</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localPurchaseRules.showProductRemarksOnPrint ?? true}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, showProductRemarksOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-sky-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Line Serial No., IMEI &amp; Remarks</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints custom 3-line serial/batch notes under inward items.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localPurchaseRules.showRefurbishedBadgeOnPrint ?? true}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, showRefurbishedBadgeOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-sky-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Certified Refurbished Item Badge</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Displays '★ Refurbished' badge &amp; descriptions on voucher rows.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localPurchaseRules.showBankDetailsOnVoucher ?? true}
                    onChange={(e) => setLocalPurchaseRules({ ...localPurchaseRules, showBankDetailsOnVoucher: e.target.checked })}
                    className="w-4 h-4 accent-sky-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Bank Details &amp; Scan UPI QR</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints Company Bank Details &amp; UPI QR Code card on vouchers.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 5. INWARD PROCUREMENT TERMS & CONDITIONS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 5. Inward Procurement Terms &amp; Policy Conditions
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Configure stock verification rules, OEM serial inspection clauses, and ITC claim conditions printed at the bottom of inward vouchers.
                  </p>
                </div>
              </div>

              {/* LIST ITEM MANAGER */}
              <div className="space-y-2">
                {(localPurchaseRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sky-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleUpdatePurchaseTerm(index, e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePurchaseTerm(index)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 shrink-0 cursor-pointer"
                      title="Delete term clause line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD NEW PURCHASE TERM INPUT */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newPurchaseTermInput}
                  onChange={(e) => setNewPurchaseTermInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPurchaseTerm();
                    }
                  }}
                  placeholder="Type new inward procurement term clause & press Enter..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-sky-500/30 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleAddPurchaseTerm}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-sky-500/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Term Line
                </button>
              </div>

              {/* FULL FREE TEXTAREA SPACE FOR ALL TERMS */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-sky-400" /> Full Inward Terms &amp; Conditions Text Area
                </label>
                <p className="text-[10px] text-white/50">
                  You can edit the full multiline terms block directly below. Each line corresponds to a printed bullet point clause on your inward vouchers.
                </p>
                <textarea
                  rows={5}
                  value={(localPurchaseRules.termsAndConditions || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setLocalPurchaseRules({ ...localPurchaseRules, termsAndConditions: lines });
                  }}
                  placeholder="Paste or type full Purchase Inward Terms here line by line..."
                  className="w-full p-3 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400 leading-relaxed"
                />
              </div>
            </div>

            {/* SAVE BUTTON & TOAST */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Vendor Purchase Rules &amp; Inward Policy Saved Globally!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">Purchase Rules and Inward Policy automatically apply to all vendor purchase bills and procurement vouchers.</span>
              )}

              <button
                onClick={handleSavePurchaseSettings}
                className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Purchase Rules Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALES RETURN RULES TAB CONTENT */}
      {activeTab === 'sales_return_rules' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-rose-400" /> SALES RETURNS &amp; CREDIT NOTES POLICY
              </h2>
              <p className="text-xs text-white/50">
                Configure auto-prefix numbering, customer refund status defaults, inventory restocking policies, and credit note printout terms.
              </p>
            </div>

            {/* 1. AUTO-NUMBERING */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> # 1. Sales Return Auto-Prefix &amp; Numbering
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Return Voucher Prefix</label>
                  <input
                    type="text"
                    value={localSalesReturnRules.salesReturnPrefix}
                    onChange={(e) => setLocalSalesReturnRules({ ...localSalesReturnRules, salesReturnPrefix: e.target.value.toUpperCase() })}
                    placeholder="e.g. SLR-"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                  <input
                    type="number"
                    value={localSalesReturnRules.salesReturnStartNo}
                    onChange={(e) => setLocalSalesReturnRules({ ...localSalesReturnRules, salesReturnStartNo: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. INVENTORY RESTOCK & REFUND STATUS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4" /> 2. Inventory Restocking &amp; Refund Status Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Refund Reversal Status</label>
                  <select
                    value={localSalesReturnRules.defaultRefundStatus}
                    onChange={(e) => setLocalSalesReturnRules({ ...localSalesReturnRules, defaultRefundStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Cleared">Cleared (Refund Paid / Adjusted)</option>
                    <option value="Pending Credit Note">Pending Credit Reversal</option>
                    <option value="Partially Cleared">Partially Cleared</option>
                  </select>
                </div>

                <div className="pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSalesReturnRules.autoRestockInventory}
                      onChange={(e) => setLocalSalesReturnRules({ ...localSalesReturnRules, autoRestockInventory: e.target.checked })}
                      className="w-4 h-4 accent-rose-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Auto-Restock Returned Goods to Active Store Inventory</span>
                      <p className="text-[10px] text-white/50">Automatically adds returned item quantities back into available store stock.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. TERMS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 3. Credit Note Terms &amp; Conditions Clauses
              </h3>

              <div className="space-y-2">
                {(localSalesReturnRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-rose-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => {
                        const updated = [...(localSalesReturnRules.termsAndConditions || [])];
                        updated[index] = e.target.value;
                        setLocalSalesReturnRules({ ...localSalesReturnRules, termsAndConditions: updated });
                      }}
                      className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSalesReturnTerm(index)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newSalesReturnTermInput}
                  onChange={(e) => setNewSalesReturnTermInput(e.target.value)}
                  placeholder="Add new credit note return clause & press Enter..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-rose-500/30 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={handleAddSalesReturnTerm}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Clause
                </button>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Sales Return &amp; Credit Note Settings Saved!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">Sales Return rules apply to all customer returns and credit notes.</span>
              )}

              <button
                onClick={handleSaveSalesReturnSettings}
                className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Sales Return Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE RETURN RULES TAB CONTENT */}
      {activeTab === 'purchase_return_rules' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-orange-400" /> PURCHASE RETURNS &amp; DEBIT NOTES POLICY
              </h2>
              <p className="text-xs text-white/50">
                Configure vendor debit note auto-prefixing, RMA claim default status, stock deduction rules, and debit voucher terms.
              </p>
            </div>

            {/* 1. AUTO-NUMBERING */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> # 1. Debit Note Auto-Prefix &amp; Numbering
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Debit Note Prefix</label>
                  <input
                    type="text"
                    value={localPurchaseReturnRules.purchaseReturnPrefix}
                    onChange={(e) => setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, purchaseReturnPrefix: e.target.value.toUpperCase() })}
                    placeholder="e.g. PCR-"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Start with No.</label>
                  <input
                    type="number"
                    value={localPurchaseReturnRules.purchaseReturnStartNo}
                    onChange={(e) => setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, purchaseReturnStartNo: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. STOCK DEDUCTION & RMA STATUS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4" /> 2. Stock Deduction &amp; RMA Claim Status Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default RMA Vendor Claim Status</label>
                  <select
                    value={localPurchaseReturnRules.defaultRmaStatus}
                    onChange={(e) => setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, defaultRmaStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Completed">Completed (Reversed from Accounts Payable)</option>
                    <option value="Pending Vendor Replacement">Pending Vendor Replacement</option>
                    <option value="Claim Rejected">Claim Rejected</option>
                  </select>
                </div>

                <div className="pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPurchaseReturnRules.autoDeductInventory}
                      onChange={(e) => setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, autoDeductInventory: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">Auto-Deduct Defective Returned Goods from Active Store Inventory</span>
                      <p className="text-[10px] text-white/50">Automatically reduces stock count when returning defective items to vendors.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. TERMS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 3. Debit Note Terms &amp; Conditions Clauses
              </h3>

              <div className="space-y-2">
                {(localPurchaseReturnRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-orange-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => {
                        const updated = [...(localPurchaseReturnRules.termsAndConditions || [])];
                        updated[index] = e.target.value;
                        setLocalPurchaseReturnRules({ ...localPurchaseReturnRules, termsAndConditions: updated });
                      }}
                      className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePurchaseReturnTerm(index)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newPurchaseReturnTermInput}
                  onChange={(e) => setNewPurchaseReturnTermInput(e.target.value)}
                  placeholder="Add new debit note term clause & press Enter..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-orange-500/30 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={handleAddPurchaseReturnTerm}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-orange-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Clause
                </button>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Purchase Return &amp; Debit Note Settings Saved!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">Purchase Return rules apply to all vendor debit notes.</span>
              )}

              <button
                onClick={handleSavePurchaseReturnSettings}
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Purchase Return Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUOTATION RULES TAB CONTENT */}
      {activeTab === 'quotation_rules' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> B2B QUOTATIONS &amp; COMMERCIAL ESTIMATES POLICY
                </h2>
                <p className="text-xs text-white/50">
                  Configure quotation auto-prefixing, default validity days, payment terms, discount limits, paper format, and terms &amp; conditions clauses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyQuotationPreset('corporate')}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Preset: Corporate B2B Proposal
                </button>
                <button
                  type="button"
                  onClick={() => applyQuotationPreset('retail')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-extrabold text-[10px] uppercase tracking-wider transition-all border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Preset: Quick Counter Estimate
                </button>
              </div>
            </div>

            {/* 1. AUTO-NUMBERING & VALIDITY */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> # 1. Quotation Sequence Auto-Prefix &amp; Validity Counter
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Auto-Prefix Pattern *</label>
                  <input
                    type="text"
                    required
                    value={localQuotationRules.quotationPrefix}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, quotationPrefix: e.target.value.toUpperCase() })}
                    placeholder="QTN-"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Sample: <span className="text-purple-300 font-mono font-bold">{localQuotationRules.quotationPrefix}{localQuotationRules.quotationStartNo}</span></p>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Starting Sequence Counter *</label>
                  <input
                    type="number"
                    required
                    value={localQuotationRules.quotationStartNo}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, quotationStartNo: Number(e.target.value) })}
                    placeholder="1001"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Proposal Validity (Days) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={localQuotationRules.defaultValidityDays}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultValidityDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. DEFAULT PAYMENT TERMS & GST SUPPLY MODE */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4" /> 2. Default Commercial Payment Terms &amp; GST Tax Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Payment Schedule</label>
                  <select
                    value={localQuotationRules.defaultPaymentTerms || '50% Advance & 50% Delivery'}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultPaymentTerms: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="50% Advance & 50% Delivery">50% Advance &amp; 50% Delivery</option>
                    <option value="100% Advance Payment">100% Advance Payment</option>
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="100% Cash / Spot Payment">100% Cash / Spot Payment</option>
                    <option value="Due on Delivery">Due on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default GST Supply Mode</label>
                  <select
                    value={localQuotationRules.defaultGstSupplyType}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultGstSupplyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="Intra-State (CGST + SGST)">Intra-State (CGST + SGST)</option>
                    <option value="Inter-State (IGST)">Inter-State (IGST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Product GST Rate (%)</label>
                  <select
                    value={localQuotationRules.defaultTaxRate}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultTaxRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-purple-300 font-mono font-bold"
                  >
                    <option value={18}>18% Standard Tax</option>
                    <option value={28}>28% High GST</option>
                    <option value={12}>12% IT Accessories</option>
                    <option value={5}>5% Low Tax</option>
                    <option value={0}>0% Tax Exempted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. DISCOUNT & ROUNDING RULES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-4 h-4" /> 3. Discount Controls &amp; Grand Total Rounding Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Max Allowed Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={localQuotationRules.maxDiscountPercent ?? 15}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, maxDiscountPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-amber-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localQuotationRules.autoRoundOffGrandTotal ?? true}
                      onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, autoRoundOffGrandTotal: e.target.checked })}
                      className="w-4 h-4 accent-purple-400"
                    />
                    <span className="font-bold text-white text-xs">Auto-Round Off Grand Total to Nearest Rupee (₹)</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localQuotationRules.enableDiscountLimits ?? true}
                      onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, enableDiscountLimits: e.target.checked })}
                      className="w-4 h-4 accent-purple-400"
                    />
                    <span className="font-bold text-white text-xs">Enforce Maximum Discount Cap Limit</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localQuotationRules.autoBarcodeScanAddItem ?? true}
                      onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, autoBarcodeScanAddItem: e.target.checked })}
                      className="w-4 h-4 accent-purple-400"
                    />
                    <span className="font-bold text-white text-xs">Auto-Add Line Item on Barcode Scan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. PRINT DEFAULTS & CUSTOMER VALIDATIONS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" /> 4. Proposal Print Defaults &amp; Customer Validation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Print Paper Format</label>
                  <select
                    value={localQuotationRules.defaultPrintPaperFormat}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultPrintPaperFormat: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="A4">A4 Full Sheet (Standard B2B Commercial Proposal)</option>
                    <option value="A5">A5 Compact Sheet (Single Page Estimate Memo)</option>
                    <option value="THERMAL">Thermal 80mm Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Default Print Copy Mode</label>
                  <select
                    value={localQuotationRules.defaultPrintCopyMode || 'both'}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, defaultPrintCopyMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="both">Both Client Copy + Duplicate Office Copy</option>
                    <option value="customer">Original Client / Prospect Copy Only</option>
                    <option value="office">Duplicate Office Record Copy Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.requireCustomerPhone ?? true}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, requireCustomerPhone: e.target.checked })}
                    className="w-4 h-4 accent-purple-400"
                  />
                  <span className="font-bold text-white text-xs">Require Customer Prospect Phone Number</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.requireCustomerGstForB2B ?? false}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, requireCustomerGstForB2B: e.target.checked })}
                    className="w-4 h-4 accent-purple-400"
                  />
                  <span className="font-bold text-white text-xs">Require Customer GSTIN for B2B Commercial Proposals</span>
                </label>
              </div>
            </div>

            {/* 5. PRINT ELEMENT VISIBILITY & DISPLAY TOGGLES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" /> 5. Proposal Print Element Visibility &amp; Display Toggles
              </h3>
              <p className="text-[10px] text-white/50">
                Control which line item details, badges, and financial cards are displayed on printed quotation proposals by default.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-purple-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.showProductRemarksOnPrint ?? true}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, showProductRemarksOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-purple-400 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Line Serial No., IMEI &amp; 3-Line Remarks</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints custom 3-line serial/batch notes under line items.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-purple-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.showRefurbishedBadgeOnPrint ?? true}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, showRefurbishedBadgeOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-purple-400 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Certified Refurbished Item Badge</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Displays '★ Refurbished' badge &amp; descriptions on proposal rows.</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#0D1117] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-purple-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.showBankQrOnQuotation ?? true}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, showBankQrOnQuotation: e.target.checked })}
                    className="w-4 h-4 accent-purple-400 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">Bank A/C &amp; Scan &amp; Pay UPI QR Card</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Prints Company Bank Details &amp; Merchant UPI QR Code card.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 6. QUOTATION TERMS & CONDITIONS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 6. B2B Quotation Terms &amp; Conditions List Box
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Configure terms, validity clauses, payment schedules, and legal notices printed under 'Terms &amp; Conditions' on all quotation printouts.
                  </p>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                  <input
                    type="checkbox"
                    checked={localQuotationRules.showTermsBoxOnQuotation ?? true}
                    onChange={(e) => setLocalQuotationRules({ ...localQuotationRules, showTermsBoxOnQuotation: e.target.checked })}
                    className="w-3.5 h-3.5 accent-purple-400"
                  />
                  <span className="font-bold text-purple-300 text-[11px]">Print Terms &amp; Conditions Box on Proposals</span>
                </label>
              </div>

              {/* LIST ITEM MANAGER */}
              <div className="space-y-2">
                {(localQuotationRules.termsAndConditions || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-purple-400 font-mono font-bold text-xs w-6 text-right shrink-0">{index + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => {
                        const updated = [...(localQuotationRules.termsAndConditions || [])];
                        updated[index] = e.target.value;
                        setLocalQuotationRules({ ...localQuotationRules, termsAndConditions: updated });
                      }}
                      className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteQuotationTerm(index)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0 cursor-pointer"
                      title="Delete term clause line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD NEW QUOTATION TERM INPUT */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={newQuotationTermInput}
                  onChange={(e) => setNewQuotationTermInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuotationTerm();
                    }
                  }}
                  placeholder="Type new proposal clause & press Enter..."
                  className="flex-1 p-2.5 rounded-xl bg-[#0D1117] border border-purple-500/30 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={handleAddQuotationTerm}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Term Line
                </button>
              </div>

              {/* FULL FREE TEXTAREA SPACE FOR ALL TERMS */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-purple-400" /> Full Terms &amp; Conditions Text Area (Paragraph Space)
                </label>
                <p className="text-[10px] text-white/50">
                  You can edit the full multiline terms block directly below. Each line corresponds to a printed bullet point clause on your proposals.
                </p>
                <textarea
                  rows={6}
                  value={(localQuotationRules.termsAndConditions || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setLocalQuotationRules({ ...localQuotationRules, termsAndConditions: lines });
                  }}
                  placeholder="Paste or type full Quotation Terms here line by line..."
                  className="w-full p-3 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
                />
              </div>
            </div>

            {/* SAVE BUTTON & TOAST */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Quotation Rules &amp; Proposal Settings Saved Globally!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">Quotation Rules and Terms &amp; Conditions automatically apply to all estimates and proposals.</span>
              )}

              <button
                onClick={handleSaveQuotationSettings}
                className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Quotation Rules Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL VOUCHERS RULES SETTINGS */}
      {activeTab === 'voucher_rules' && (
        <div className="glass-panel p-8 rounded-2xl border border-indigo-500/30 space-y-6 text-xs">
          <div className="border-b border-indigo-500/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                ALL VOUCHERS RULES &amp; CONFIGURATION<span className="text-indigo-400">.</span>
              </h2>
              <p className="text-xs text-white/60 mt-1">Unified accounting rules, auto-numbering prefixes, double-entry audit checks, and printing formats for Receipts, Payments, Debit Notes, Credit Notes, Contra entries, and Journals.</p>
            </div>

            <button
              onClick={handleSaveVoucherSettings}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" /> Save All Vouchers Settings
            </button>
          </div>

          <div className="space-y-6">
            {/* SECTION 1: VOUCHER PREFIXES & AUTO NUMBERING */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> 1. Voucher Type Numbering Prefixes &amp; Starting Sequences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Receipt Vouchers */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                    <span>📥 Receipt Vouchers (Money In)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.receiptPrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, receiptPrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.receiptStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, receiptStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Vouchers */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                    <span>📤 Payment Vouchers (Money Out)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.paymentPrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, paymentPrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.paymentStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, paymentStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Debit Notes */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                    <span>📋 Debit Notes (Vendor Returns)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.debitNotePrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, debitNotePrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.debitNoteStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, debitNoteStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Credit Notes */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-purple-400">
                    <span>🔖 Credit Notes (Customer Returns)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.creditNotePrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, creditNotePrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.creditNoteStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, creditNoteStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Contra Entries */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
                    <span>🔄 Contra Transfers (Bank/Cash)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.contraPrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, contraPrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.contraStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, contraStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Journal Entries */}
                <div className="p-4 bg-[#0D1117] rounded-xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-indigo-400">
                    <span>📖 Journal Entries (Multi-Line)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={localVoucherRules.journalPrefix}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, journalPrefix: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Start No.</label>
                      <input
                        type="number"
                        value={localVoucherRules.journalStartNo}
                        onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, journalStartNo: Number(e.target.value) })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: AUDIT CONTROLS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 2. Accounting Verification &amp; Audit Enforcements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.autoStrictDoubleEntryCheck}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, autoStrictDoubleEntryCheck: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Strict Double-Entry Balancing Check (Dr = Cr)</span>
                    <span className="text-[10px] text-white/50">Enforces that Total Debits must equal Total Credits before posting any voucher.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.requirePartySelection}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, requirePartySelection: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Require Party / Ledger Account Selection</span>
                    <span className="text-[10px] text-white/50">Prevents posting unassigned or empty ledger entries across all voucher types.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.requireNarrationExplanation}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, requireNarrationExplanation: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Require Remarks / Narration Explanation</span>
                    <span className="text-[10px] text-white/50">Mandates a clear written audit narration for every posted voucher entry.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.enableLiveLedgerSearch}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, enableLiveLedgerSearch: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Enable Live Search Autocomplete Engine</span>
                    <span className="text-[10px] text-white/50">Queries Master Ledgers, Customers, and Vendors in voucher dropdowns.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* SECTION 3: PRINT FORMAT CONTROLS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" /> 3. Voucher Printing &amp; Legal Copy Layouts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-white/70 mb-1">Default Print Paper Format</label>
                  <select
                    value={localVoucherRules.defaultPrintPaperFormat}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, defaultPrintPaperFormat: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="A4">A4 Full Sheet Standard</option>
                    <option value="A5">A5 Compact Slip</option>
                    <option value="THERMAL">3" POS Thermal Roll</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white/70 mb-1">Default Copy Mode</label>
                  <select
                    value={localVoucherRules.defaultPrintCopyMode}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, defaultPrintCopyMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  >
                    <option value="both">Both Original &amp; Office Copy</option>
                    <option value="standard">Original Voucher Only</option>
                    <option value="office">Office Record Only</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.showBankDetailsOnPrint}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, showBankDetailsOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Show Company Bank &amp; IFSC Details</span>
                    <span className="text-[10px] text-white/50">Prints bank account credentials at bottom of vouchers for payments/transfers.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0D1117] rounded-xl border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVoucherRules.showSignatureBlockOnPrint}
                    onChange={(e) => setLocalVoucherRules({ ...localVoucherRules, showSignatureBlockOnPrint: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-white block">Show Dual Accountant &amp; Auditor Signature Lines</span>
                    <span className="text-[10px] text-white/50">Adds signature verification blocks for statutory audit records.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* SECTION 4: TERMS & CONDITIONS MANAGER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 4. Standard Voucher Terms &amp; Audit Declarations
              </h3>

              <div className="space-y-2 text-xs">
                {(localVoucherRules.termsAndConditions || []).map((term, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#0D1117] rounded-xl border border-white/10">
                    <span className="font-mono text-indigo-400 font-bold text-xs">{idx + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => {
                        const current = [...(localVoucherRules.termsAndConditions || [])];
                        current[idx] = e.target.value;
                        setLocalVoucherRules({ ...localVoucherRules, termsAndConditions: current });
                      }}
                      className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleDeleteVoucherTerm(idx)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add new voucher term or legal notice..."
                    value={newVoucherTermInput}
                    onChange={(e) => setNewVoucherTermInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white"
                  />
                  <button
                    onClick={handleAddVoucherTerm}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Term
                  </button>
                </div>
              </div>
            </div>

            {/* SAVE BUTTON & TOAST */}
            <div className="pt-4 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> All Vouchers Rules &amp; Numbering Configurations Saved Globally!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">All Voucher rules, numbering sequences, and audit controls apply across the ERP suite.</span>
              )}

              <button
                onClick={handleSaveVoucherSettings}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save All Vouchers Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HSN SETTINGS & GST LINKER */}
      {activeTab === 'hsn_settings' && (
        <div className="glass-panel p-8 rounded-2xl border border-[#16FFC6]/30 space-y-6 text-xs">
          <div className="border-b border-[#16FFC6]/30 pb-3">
            <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#16FFC6]" />
              HSN / SAC CODE SETTINGS & GST TAX RATE LINKER<span className="text-[#16FFC6]">.</span>
            </h2>
            <p className="text-xs text-white/50 mt-1">Configure statutory HSN codes and linked GST percentage rates for Retail & Service parts.</p>
          </div>

          {/* ADD / EDIT HSN CODE FORM */}
          <form onSubmit={handleSaveHsnCode} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#16FFC6] uppercase tracking-wider">
              {editingHsnCode ? `Modify HSN Code: ${editingHsnCode}` : '+ Add New Statutory HSN / SAC Code'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-white/70 mb-1 font-bold text-[11px]">HSN / SAC Code *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingHsnCode)}
                  value={newHsnInput.hsnCode}
                  onChange={(e) => setNewHsnInput({ ...newHsnInput, hsnCode: e.target.value })}
                  placeholder="e.g. 84713010"
                  className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold text-[11px]">Linked GST Rate (%) *</label>
                <select
                  value={newHsnInput.gstRate}
                  onChange={(e) => setNewHsnInput({ ...newHsnInput, gstRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  <option value={18}>18% GST (Standard Hardware / Services)</option>
                  <option value={12}>12% GST (Peripherals / Networking)</option>
                  <option value={28}>28% GST (Monitors / High Tax Items)</option>
                  <option value={5}>5% GST (Essential Parts)</option>
                  <option value={0}>0% Exempted</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold text-[11px]">Description</label>
                <input
                  type="text"
                  value={newHsnInput.description}
                  onChange={(e) => setNewHsnInput({ ...newHsnInput, description: e.target.value })}
                  placeholder="e.g. Laptops & Microcomputers"
                  className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              {editingHsnCode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingHsnCode(null);
                    setNewHsnInput({ hsnCode: '', gstRate: 18, description: '' });
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 font-bold uppercase text-[11px]"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-[11px] tracking-wider shadow-lg shadow-[#16FFC6]/20"
              >
                {editingHsnCode ? 'Save HSN Changes' : '+ Add HSN Code'}
              </button>
            </div>
          </form>

          {/* HSN CODES LIST TABLE */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                <tr>
                  <th className="p-3">HSN / SAC Code</th>
                  <th className="p-3">Linked GST Rate</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hsnCodes.map((hsn) => (
                  <tr key={hsn.hsnCode} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#16FFC6]">{hsn.hsnCode}</td>
                    <td className="p-3 font-mono font-bold text-white">{hsn.gstRate}% GST</td>
                    <td className="p-3 text-white/80">{hsn.description}</td>
                    <td className="p-3 text-right flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingHsnCode(hsn.hsnCode);
                          setNewHsnInput({ hsnCode: hsn.hsnCode, gstRate: hsn.gstRate, description: hsn.description });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#16FFC6] text-white hover:text-[#070B0A] font-bold text-[10px] uppercase"
                      >
                        Modify
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete HSN Code "${hsn.hsnCode}"?`)) {
                            deleteHsnCode(hsn.hsnCode);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-[10px] uppercase"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {savedSuccess && (
            <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
              <CheckCircle2 className="w-4 h-4" /> HSN Code Settings Updated Globally!
            </span>
          )}
        </div>
      )}

      {/* TAB 5: COMPANY DETAILS SETTINGS */}
      {activeTab === 'general' && (
        <div className="glass-panel p-8 rounded-2xl border border-[#5ED29C]/30 space-y-6 text-xs">
          <div className="border-b border-[#5ED29C]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5ED29C]" />
                COMPANY DETAILS &amp; STATUTORY INVOICE HEADER<span className="text-[#5ED29C]">.</span>
              </h2>
              <p className="text-xs text-white/60 mt-1">Configure company branding, address lines, GSTIN, bank account, designations, and payment UPI links.</p>
            </div>

            <button
              type="button"
              onClick={handleSaveCompanyDetails}
              className="px-6 py-3 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <Save className="w-4 h-4" /> Save Company Details
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveCompanyDetails(); }} className="space-y-6">
            {/* 1. BRANDING & IDENTITY */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> 1. Brand Identity &amp; Logo Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">1. Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={localCompanyDetails.companyLegalName}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, companyLegalName: e.target.value })}
                    placeholder="ACCNO SOLUTION SYSTEMS PVT LTD"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">2. Company Tag Line</label>
                  <input
                    type="text"
                    value={localCompanyDetails.companyTagLine}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, companyTagLine: e.target.value })}
                    placeholder="Computer Repair & Mobile Solution Hub"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">4. Merchant UPI ID (for Invoice Payment QR)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={localCompanyDetails.merchantUpiId}
                      onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, merchantUpiId: e.target.value })}
                      placeholder="support.time24x7-3@okhdfcbank"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold pl-8"
                    />
                    <CreditCard className="w-4 h-4 text-[#16FFC6] absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Company Logo Upload & Preview */}
              <div>
                <label className="block text-white/70 mb-1 font-bold">3. Company Logo (Image Upload or Path)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0D1117] p-3 rounded-2xl border border-white/10">
                  <div className="w-32 h-14 bg-black/40 rounded-xl border border-white/20 flex items-center justify-center p-1.5 shrink-0">
                    {localCompanyDetails.companyLogo ? (
                      <img src={localCompanyDetails.companyLogo} alt="Company Logo Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-white/40">No Logo Loaded</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={localCompanyDetails.companyLogo}
                        onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, companyLogo: e.target.value })}
                        placeholder="/logo.png or Base64 Data URL"
                        className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        id="company-logo-input"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />

                      <label
                        htmlFor="company-logo-input"
                        className="px-4 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-[11px] cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Logo
                      </label>
                    </div>
                    <p className="text-[10px] text-white/50">Upload high-resolution PNG/SVG logo to automatically appear on printed repair tickets, job sheets, and invoices.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. REGISTERED ADDRESS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 2. Registered Office &amp; Service Center Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">5. Address Line 1</label>
                  <input
                    type="text"
                    value={localCompanyDetails.addressLine1}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, addressLine1: e.target.value })}
                    placeholder="#80, Above Vijay Laxmi Medical Agency"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">6. Address Line 2</label>
                  <input
                    type="text"
                    value={localCompanyDetails.addressLine2}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, addressLine2: e.target.value })}
                    placeholder="Choudhary Dharmshala, Indira Chowk"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">7. Address Line 3</label>
                  <input
                    type="text"
                    value={localCompanyDetails.addressLine3}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, addressLine3: e.target.value })}
                    placeholder="Industrial Main Road"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">8. City *</label>
                  <input
                    type="text"
                    required
                    value={localCompanyDetails.city}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, city: e.target.value })}
                    placeholder="SANCHORE"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">9. State *</label>
                  <input
                    type="text"
                    required
                    value={localCompanyDetails.state}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, state: e.target.value })}
                    placeholder="Rajasthan"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">10. State Code (GST Numeric Code)</label>
                  <input
                    type="text"
                    value={localCompanyDetails.stateCode}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, stateCode: e.target.value })}
                    placeholder="08"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. CONTACT & TAX IDENTIFIERS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" /> 3. Contact Channels &amp; Statutory Tax IDs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">11. Website URL</label>
                  <input
                    type="text"
                    value={localCompanyDetails.website}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, website: e.target.value })}
                    placeholder="www.accnosolution.com"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">12. Email Address</label>
                  <input
                    type="email"
                    value={localCompanyDetails.email}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, email: e.target.value })}
                    placeholder="support@accnosolution.com"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">13. GSTIN Tax ID *</label>
                  <input
                    type="text"
                    required
                    value={localCompanyDetails.gstin}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, gstin: e.target.value })}
                    placeholder="08CAUPK8462J2ZT"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">18. PAN Card Number</label>
                  <input
                    type="text"
                    value={localCompanyDetails.panNumber}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, panNumber: e.target.value })}
                    placeholder="CAUPK8462J"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">14. Contact Person</label>
                  <input
                    type="text"
                    value={localCompanyDetails.contactPerson}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, contactPerson: e.target.value })}
                    placeholder="Bhavesh Patel"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                {/* Designation Field with Add & Remove Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-white/70 font-bold">15. Designation</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAddDesignationInput(!showAddDesignationInput)}
                        className="text-[10px] text-[#5ED29C] font-bold uppercase hover:underline"
                      >
                        + Add
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveDesignation}
                        className="text-[10px] text-rose-400 font-bold uppercase hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {showAddDesignationInput ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newDesignationInput}
                        onChange={(e) => setNewDesignationInput(e.target.value)}
                        placeholder="New designation..."
                        className="w-full p-2 rounded-xl bg-[#0D1117] border border-[#5ED29C] text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddDesignation}
                        className="px-2.5 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-[10px] uppercase shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <select
                      value={localCompanyDetails.designation}
                      onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, designation: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {localCompanyDetails.designationOptions.map((des) => (
                        <option key={des} value={des}>{des}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">16. Phone Number</label>
                  <input
                    type="text"
                    value={localCompanyDetails.phoneNumber}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, phoneNumber: e.target.value })}
                    placeholder="+91 95877 81166"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">17. Alternate Number</label>
                  <input
                    type="text"
                    value={localCompanyDetails.alternateNumber}
                    onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, alternateNumber: e.target.value })}
                    placeholder="+91 91663 58851"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. BANK ACCOUNT DETAILS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <BankIcon className="w-4 h-4" /> 19. Company Bank Account Details (for NEFT / RTGS)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">A/c Holder Name</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.accountHolderName}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, accountHolderName: e.target.value }
                    })}
                    placeholder="ACCNO SOLUTION SYSTEMS"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Bank Account Number</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.accountNumber}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, accountNumber: e.target.value }
                    })}
                    placeholder="50200012345678"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Bank Name</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.bankName}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, bankName: e.target.value }
                    })}
                    placeholder="HDFC Bank"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Branch Name</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.branchName}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, branchName: e.target.value }
                    })}
                    placeholder="Sanchore Main Branch"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Branch Code</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.branchCode}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, branchCode: e.target.value }
                    })}
                    placeholder="003430"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">IFSC Code</label>
                  <input
                    type="text"
                    value={localCompanyDetails.bankDetails.ifscCode}
                    onChange={(e) => setLocalCompanyDetails({
                      ...localCompanyDetails,
                      bankDetails: { ...localCompanyDetails.bankDetails, ifscCode: e.target.value }
                    })}
                    placeholder="HDFC0003430"
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            {/* 5. ADDITIONAL NOTES */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 20. Statutory Footnote &amp; Internal Notes
              </h3>

              <textarea
                rows={3}
                value={localCompanyDetails.notes}
                onChange={(e) => setLocalCompanyDetails({ ...localCompanyDetails, notes: e.target.value })}
                placeholder="Statutory Registered Repair Center & Enterprise IT Solutions Provider..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#16FFC6] flex items-center gap-1.5 bg-[#16FFC6]/10 px-4 py-2 rounded-xl border border-[#16FFC6]/30">
                  <CheckCircle2 className="w-4 h-4" /> Company Details Saved &amp; Updated Globally across ERP System!
                </span>
              ) : (
                <span className="text-[11px] text-white/40">All company &amp; bank parameters will update printed bills, job cards, and invoices.</span>
              )}

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Company Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
