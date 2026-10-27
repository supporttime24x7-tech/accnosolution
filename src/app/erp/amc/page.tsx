'use client';

import React, { useState } from 'react';
import { useErpStore, AmcContract, AmcPmVisit, AmcComplaint, AmcRetailProductItem, AmcAssetItem } from '@/lib/store';
import {
  ShieldCheck,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  X,
  FileText,
  Calendar,
  User,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Wrench,
  DollarSign,
  MessageSquare,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Activity,
  Layers,
  CheckSquare,
  TrendingUp,
} from 'lucide-react';

// Reusable Dynamic Option Selector with Add and Remove Buttons
const DynamicOptionSelect = ({
  label,
  value,
  options,
  onChange,
  onAddOption,
  onRemoveOption,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  onAddOption: (newOpt: string) => void;
  onRemoveOption: (optToRemove: string) => void;
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newVal, setNewVal] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-slate-300 font-bold text-xs">{label}</label>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-[#5ED29C] hover:underline font-bold flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> {showAdd ? 'Cancel' : '+ Add Option'}
        </button>
      </div>
      {showAdd && (
        <div className="flex gap-1 mb-2">
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder={`New ${label}`}
            className="p-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white flex-1"
          />
          <button
            type="button"
            onClick={() => {
              if (newVal.trim()) {
                onAddOption(newVal.trim());
                onChange(newVal.trim());
                setNewVal('');
                setShowAdd(false);
              }
            }}
            className="px-2.5 py-1 text-xs bg-[#5ED29C] text-black font-extrabold rounded-lg uppercase"
          >
            Add
          </button>
        </div>
      )}
      <div className="flex gap-1 items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {options.length > 1 && (
          <button
            type="button"
            title={`Remove "${value}" option`}
            onClick={() => onRemoveOption(value)}
            className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function AmcSoftwareSuitePage() {
  const {
    amcContracts,
    amcRules,
    customers,
    inventory,
    companyDetails,
    employees,
    addAmcContract,
    updateAmcContract,
    deleteAmcContract,
    updateAmcRules,
    addAccountingVoucher,
  } = useErpStore();

  // Active Sub-Module Navigation Tab State
  const [activeSubModule, setActiveSubModule] = useState<'amc-directory' | 'pm-board' | 'complaints-board' | 'renewals-hub' | 'assets-inventory'>('amc-directory');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPmVisitModal, setShowPmVisitModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [selectedContract, setSelectedContract] = useState<AmcContract | null>(null);

  // Autocomplete & Dynamic Options State
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Dynamic Rule Option Arrays from Store with Fallbacks
  const [planOptions, setPlanOptions] = useState<string[]>(
    amcRules?.amc_plan_options || ['Silver Plan', 'Gold Plan', 'Platinum Plan', 'Custom Plan']
  );
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>(
    amcRules?.amc_payment_statuses || ['Unpaid', 'Partially Paid', 'Paid']
  );
  const [contractStatuses, setContractStatuses] = useState<string[]>(
    amcRules?.amc_contract_statuses || ['Active', 'Expiring', 'Expired', 'Renewed', 'Cancelled']
  );
  const [sourcesList, setSourcesList] = useState<string[]>(
    amcRules?.amc_sources || ['Direct', 'Referral', 'Website', 'Phone Inquiry', 'Walk-in Client']
  );
  const [deviceTypes, setDeviceTypes] = useState<string[]>(
    amcRules?.amc_device_types || ['Desktop PC', 'Laptop', 'Server', 'Printer', 'CCTV DVR', 'Router / Switch']
  );
  const [prioritiesList, setPrioritiesList] = useState<string[]>(
    amcRules?.amc_priorities || ['Low', 'Normal', 'High', 'Emergency']
  );
  const employeeNames = React.useMemo(() => {
    const list = (employees || [])
      .filter((e) => e.activeStatus !== 'Inactive')
      .map((e) => e.name)
      .filter(Boolean);
    return list.length > 0 ? Array.from(new Set(list)) : ['Deepak Kumar', 'Rahul Gupta', 'Priya Sharma'];
  }, [employees]);

  const [techniciansList, setTechniciansList] = useState<string[]>(employeeNames);

  React.useEffect(() => {
    if (employeeNames.length > 0) {
      setTechniciansList(employeeNames);
    }
  }, [employeeNames]);
  const [serviceChecklists, setServiceChecklists] = useState<string[]>(
    amcRules?.amc_service_checklists || [
      'Dusting & Cleaning',
      'OS & Antivirus Update',
      'RAID Health Check',
      'Thermal Paste Refresh',
      'UPS & Power Back-up Test',
      'Data Back-up Audit',
    ]
  );

  // Comprehensive Form State (All 25 Fields)
  const defaultFormData = {
    contractNumber: '',
    manualEntryDate: new Date().toISOString().split('T')[0],

    // Customer
    customerId: '',
    customerName: '',
    companyName: '',
    customerPhone: '',
    alternatePhone: '',
    customerEmail: '',
    customerGst: '',
    customerAddress: '',

    // Plan & Costs
    planOption: 'Gold Plan',
    contractCost: 45000,
    amcAmount: 45000,
    gstRate: 18,
    advancePaid: 25000,
    paymentStatus: 'Partially Paid',

    // Dates & Status
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contractStatus: 'Active',

    // Specs & Scope
    coverageScopeDetails: 'Full hardware component support, OS updates, quarterly PM visits, and 4-hour SLA.',
    source: 'Direct',
    serviceType: 'Hardware + Software On-site Support',
    numberOfDevices: 5,
    totalServiceVisits: 4,
    assignedTechnician: employeeNames[0] || 'Deepak Kumar',
    priority: 'High',
    deviceType: 'Server',
    issueFound: '',
    notes: '',
    selectedChecklistItems: [
      'Dusting & Cleaning',
      'OS & Antivirus Update',
      'RAID Health Check',
      'Thermal Paste Refresh',
    ],
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Linked Assets & Linked Retail Products Lists
  const [coveredAssets, setCoveredAssets] = useState<AmcAssetItem[]>([
    { id: 'ast-1', assetName: 'Main ERP Server', category: 'Server', brand: 'Dell', model: 'PowerEdge T340', serialNumber: 'DLT340-9981', location: 'Server Room' },
  ]);

  const [retailProducts, setRetailProducts] = useState<AmcRetailProductItem[]>([]);

  // Asset Form State
  const [newAsset, setNewAsset] = useState({
    assetName: '',
    category: 'Desktop PC',
    brand: '',
    model: '',
    serialNumber: '',
    location: 'Main Office',
  });

  // Retail Product Entry Form State
  const [newRetailProduct, setNewRetailProduct] = useState({
    productId: '',
    name: '',
    sku: '',
    unitPrice: 0,
    quantity: 1,
    gstRate: 18,
  });

  // PM Visit Creation Form State
  const [newPmVisit, setNewPmVisit] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    technician: employeeNames[0] || 'Deepak Kumar',
    visitPurpose: 'Quarterly Preventive Maintenance Check',
    serviceActionsPerformed: '',
  });

  // Complaint Logging Form State
  const [newComplaint, setNewComplaint] = useState({
    description: '',
    status: 'Open',
    technician: employeeNames[0] || 'Deepak Kumar',
    internalNotes: '',
    resolvedDate: '',
  });

  // Financial Calculations
  const retailProductsTotal = retailProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalBaseCost = Number(formData.contractCost || 0) + retailProductsTotal;
  const calcGstAmount = Math.round((totalBaseCost * Number(formData.gstRate || 0)) / 100);
  const calcTotalAmount = totalBaseCost + calcGstAmount;
  const calcBalanceDue = Math.max(0, calcTotalAmount - Number(formData.advancePaid || 0));

  // Handlers for Dynamic Option Selectors
  const handleAddOption = (listName: string, newOption: string) => {
    let updated: string[] = [];
    if (listName === 'plan') {
      updated = [...planOptions, newOption];
      setPlanOptions(updated);
      updateAmcRules({ amc_plan_options: updated });
    } else if (listName === 'payment') {
      updated = [...paymentStatuses, newOption];
      setPaymentStatuses(updated);
      updateAmcRules({ amc_payment_statuses: updated });
    } else if (listName === 'contract') {
      updated = [...contractStatuses, newOption];
      setContractStatuses(updated);
      updateAmcRules({ amc_contract_statuses: updated });
    } else if (listName === 'source') {
      updated = [...sourcesList, newOption];
      setSourcesList(updated);
      updateAmcRules({ amc_sources: updated });
    } else if (listName === 'device') {
      updated = [...deviceTypes, newOption];
      setDeviceTypes(updated);
      updateAmcRules({ amc_device_types: updated });
    } else if (listName === 'priority') {
      updated = [...prioritiesList, newOption];
      setPrioritiesList(updated);
      updateAmcRules({ amc_priorities: updated });
    } else if (listName === 'technician') {
      updated = [...techniciansList, newOption];
      setTechniciansList(updated);
      updateAmcRules({ amc_technicians: updated });
    } else if (listName === 'checklist') {
      updated = [...serviceChecklists, newOption];
      setServiceChecklists(updated);
      updateAmcRules({ amc_service_checklists: updated });
    }
  };

  const handleRemoveOption = (listName: string, optToRemove: string) => {
    let updated: string[] = [];
    if (listName === 'plan') {
      updated = planOptions.filter((o) => o !== optToRemove);
      setPlanOptions(updated);
      updateAmcRules({ amc_plan_options: updated });
    } else if (listName === 'payment') {
      updated = paymentStatuses.filter((o) => o !== optToRemove);
      setPaymentStatuses(updated);
      updateAmcRules({ amc_payment_statuses: updated });
    } else if (listName === 'contract') {
      updated = contractStatuses.filter((o) => o !== optToRemove);
      setContractStatuses(updated);
      updateAmcRules({ amc_contract_statuses: updated });
    } else if (listName === 'source') {
      updated = sourcesList.filter((o) => o !== optToRemove);
      setSourcesList(updated);
      updateAmcRules({ amc_sources: updated });
    } else if (listName === 'device') {
      updated = deviceTypes.filter((o) => o !== optToRemove);
      setDeviceTypes(updated);
      updateAmcRules({ amc_device_types: updated });
    } else if (listName === 'priority') {
      updated = prioritiesList.filter((o) => o !== optToRemove);
      setPrioritiesList(updated);
      updateAmcRules({ amc_priorities: updated });
    } else if (listName === 'technician') {
      updated = techniciansList.filter((o) => o !== optToRemove);
      setTechniciansList(updated);
      updateAmcRules({ amc_technicians: updated });
    } else if (listName === 'checklist') {
      updated = serviceChecklists.filter((o) => o !== optToRemove);
      setServiceChecklists(updated);
      updateAmcRules({ amc_service_checklists: updated });
    }
  };

  // CRM Customer Selection Autocomplete
  const filteredCrmCustomers = customers.filter((c: any) => {
    const q = customerSearchText.toLowerCase().trim();
    if (!q) return true;
    const phoneNum = c.mobile || (c as any).phone || '';
    const custCode = (c as any).code || (c as any).id || '';
    return (
      c.name.toLowerCase().includes(q) ||
      phoneNum.toLowerCase().includes(q) ||
      custCode.toLowerCase().includes(q) ||
      (c.gstin && c.gstin.toLowerCase().includes(q)) ||
      (c.companyName && c.companyName.toLowerCase().includes(q))
    );
  });

  const selectCrmCustomer = (c: any) => {
    setFormData((prev) => ({
      ...prev,
      customerId: c.code || c.id || '',
      customerName: c.name || '',
      companyName: c.companyName || '',
      customerPhone: c.mobile || (c as any).phone || '',
      alternatePhone: c.alternatePhone || '',
      customerEmail: c.email || '',
      customerGst: c.gstin || '',
      customerAddress: c.billingAddress || c.fullAddress || c.address || '',
    }));
    setCustomerSearchText(c.name || '');
    setShowCustomerDropdown(false);
  };

  // Asset Handlers
  const handleAddAsset = () => {
    if (!newAsset.assetName || !newAsset.serialNumber) return;
    setCoveredAssets((prev) => [...prev, { ...newAsset, id: `ast-${Date.now()}` }]);
    setNewAsset({ assetName: '', category: 'Desktop PC', brand: '', model: '', serialNumber: '', location: 'Main Office' });
  };

  const handleRemoveAsset = (id: string) => {
    setCoveredAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Retail Product Handlers
  const handleAddRetailProduct = () => {
    if (!newRetailProduct.name || newRetailProduct.unitPrice <= 0) return;
    const subtotal = newRetailProduct.unitPrice * newRetailProduct.quantity;
    const itemGst = Math.round((subtotal * newRetailProduct.gstRate) / 100);
    const itemTotal = subtotal + itemGst;

    setRetailProducts((prev) => [
      ...prev,
      {
        id: `rp-${Date.now()}`,
        productId: newRetailProduct.productId,
        name: newRetailProduct.name,
        sku: newRetailProduct.sku,
        unitPrice: newRetailProduct.unitPrice,
        quantity: newRetailProduct.quantity,
        gstRate: newRetailProduct.gstRate,
        totalPrice: itemTotal,
      },
    ]);

    setNewRetailProduct({ productId: '', name: '', sku: '', unitPrice: 0, quantity: 1, gstRate: 18 });
  };

  const handleRemoveRetailProduct = (id: string) => {
    setRetailProducts((prev) => prev.filter((rp) => rp.id !== id));
  };

  // Service Checklist Item Toggle Handler
  const toggleChecklistItem = (item: string) => {
    const current = formData.selectedChecklistItems;
    if (current.includes(item)) {
      setFormData({ ...formData, selectedChecklistItems: current.filter((i) => i !== item) });
    } else {
      setFormData({ ...formData, selectedChecklistItems: [...current, item] });
    }
  };

  // Form Submit Handler
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      alert('Please fill out Customer Name and Mobile Number.');
      return;
    }

    const nextNo = (amcRules?.amc_contract_start_no || 1001) + amcContracts.length;
    const contractNo = formData.contractNumber || `${amcRules?.amc_contract_prefix || 'AMC-'}${nextNo}`;

    // Generate Default Quarterly PM Visits if totalServiceVisits = 4
    const generatedVisits: AmcPmVisit[] = Array.from({ length: formData.totalServiceVisits || 4 }).map((_, idx) => ({
      id: `pm-${idx + 1}`,
      visitNumber: idx + 1,
      visitDate: new Date(Date.parse(formData.startDate) + idx * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: idx === 0 ? 'Completed' : 'Scheduled',
      technician: formData.assignedTechnician,
      visitPurpose: `Quarterly Preventive Maintenance Visit #${idx + 1}`,
      serviceActionsPerformed: idx === 0 ? 'Initial hardware inspection, dust cleaning & thermal check.' : undefined,
      completedDate: idx === 0 ? formData.startDate : undefined,
    }));

    addAmcContract({
      contractNumber: contractNo,
      manualEntryDate: formData.manualEntryDate,
      customerId: formData.customerId,
      customerName: formData.customerName,
      companyName: formData.companyName,
      customerPhone: formData.customerPhone,
      alternatePhone: formData.alternatePhone,
      customerEmail: formData.customerEmail,
      customerGst: formData.customerGst,
      customerAddress: formData.customerAddress,

      planOption: formData.planOption,
      contractCost: Number(formData.contractCost),
      amcAmount: Number(formData.contractCost),
      gstRate: Number(formData.gstRate),
      totalAmount: calcTotalAmount,
      advancePaid: Number(formData.advancePaid),
      balanceDue: calcBalanceDue,
      paymentStatus: formData.paymentStatus,

      startDate: formData.startDate,
      endDate: formData.endDate,
      renewalDate: formData.renewalDate,
      contractStatus: formData.contractStatus,

      coverageScopeDetails: formData.coverageScopeDetails,
      source: formData.source,
      serviceType: formData.serviceType,
      numberOfDevices: Number(formData.numberOfDevices),
      totalServiceVisits: Number(formData.totalServiceVisits),
      assignedTechnician: formData.assignedTechnician,
      priority: formData.priority,
      deviceType: formData.deviceType,
      issueFound: formData.issueFound,
      notes: formData.notes,

      serviceIncludedChecklist: formData.selectedChecklistItems,
      retailProducts: retailProducts,
      coveredAssets: coveredAssets,
      pmVisits: generatedVisits,
      complaints: [],

      invoiceGenerated: false,
    });

    setShowCreateModal(false);
    resetForm();
  };

  // Edit Submit Handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    updateAmcContract(selectedContract.id, {
      contractNumber: formData.contractNumber,
      manualEntryDate: formData.manualEntryDate,
      customerId: formData.customerId,
      customerName: formData.customerName,
      companyName: formData.companyName,
      customerPhone: formData.customerPhone,
      alternatePhone: formData.alternatePhone,
      customerEmail: formData.customerEmail,
      customerGst: formData.customerGst,
      customerAddress: formData.customerAddress,

      planOption: formData.planOption,
      contractCost: Number(formData.contractCost),
      amcAmount: Number(formData.contractCost),
      gstRate: Number(formData.gstRate),
      totalAmount: calcTotalAmount,
      advancePaid: Number(formData.advancePaid),
      balanceDue: calcBalanceDue,
      paymentStatus: formData.paymentStatus,

      startDate: formData.startDate,
      endDate: formData.endDate,
      renewalDate: formData.renewalDate,
      contractStatus: formData.contractStatus,

      coverageScopeDetails: formData.coverageScopeDetails,
      source: formData.source,
      serviceType: formData.serviceType,
      numberOfDevices: Number(formData.numberOfDevices),
      totalServiceVisits: Number(formData.totalServiceVisits),
      assignedTechnician: formData.assignedTechnician,
      priority: formData.priority,
      deviceType: formData.deviceType,
      issueFound: formData.issueFound,
      notes: formData.notes,

      serviceIncludedChecklist: formData.selectedChecklistItems,
      retailProducts: retailProducts,
      coveredAssets: coveredAssets,
    });

    setShowEditModal(false);
    resetForm();
  };

  // Add PM Visit Handler
  const handleAddPmVisit = () => {
    if (!selectedContract) return;
    const currentVisits = selectedContract.pmVisits || [];
    const nextVisitNum = currentVisits.length + 1;
    const newVisitObj: AmcPmVisit = {
      id: `pm-${Date.now()}`,
      visitNumber: nextVisitNum,
      visitDate: newPmVisit.visitDate,
      status: newPmVisit.status,
      technician: newPmVisit.technician,
      visitPurpose: newPmVisit.visitPurpose,
      serviceActionsPerformed: newPmVisit.serviceActionsPerformed,
      completedDate: newPmVisit.status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
    };

    const updatedVisits = [...currentVisits, newVisitObj];
    updateAmcContract(selectedContract.id, { pmVisits: updatedVisits });
    setSelectedContract({ ...selectedContract, pmVisits: updatedVisits });
    setShowPmVisitModal(false);
  };

  // Log Complaint Handler
  const handleLogComplaint = () => {
    if (!selectedContract || !newComplaint.description) return;
    const currentComplaints = selectedContract.complaints || [];
    const nextNo = 1001 + currentComplaints.length;
    const newCmp: AmcComplaint = {
      id: `cmp-${Date.now()}`,
      complaintNumber: `CMP-${nextNo}`,
      logDate: new Date().toISOString().split('T')[0],
      description: newComplaint.description,
      status: newComplaint.status,
      technician: newComplaint.technician,
      internalNotes: newComplaint.internalNotes,
      resolvedDate: newComplaint.status === 'Resolved' ? new Date().toISOString().split('T')[0] : undefined,
    };

    const updatedComplaints = [...currentComplaints, newCmp];
    updateAmcContract(selectedContract.id, { complaints: updatedComplaints });
    setSelectedContract({ ...selectedContract, complaints: updatedComplaints });
    setShowComplaintModal(false);
    setNewComplaint({ description: '', status: 'Open', technician: formData.assignedTechnician, internalNotes: '', resolvedDate: '' });
  };

  // Renew Contract for 1 Year Handler
  const handleRenewContractOneYear = (contract: AmcContract) => {
    const newStart = contract.endDate || new Date().toISOString().split('T')[0];
    const newEnd = new Date(Date.parse(newStart) + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const renewedVisits: AmcPmVisit[] = Array.from({ length: contract.totalServiceVisits || 4 }).map((_, idx) => ({
      id: `pm-renew-${idx + 1}`,
      visitNumber: idx + 1,
      visitDate: new Date(Date.parse(newStart) + idx * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Scheduled',
      technician: contract.assignedTechnician || employeeNames[0] || 'Deepak Kumar',
      visitPurpose: `Renewed Year PM Visit #${idx + 1}`,
    }));

    updateAmcContract(contract.id, {
      startDate: newStart,
      endDate: newEnd,
      renewalDate: newEnd,
      contractStatus: 'Renewed',
      status: 'ACTIVE',
      pmVisits: renewedVisits,
    });

    alert(`Contract ${contract.contractNumber} renewed successfully for 1 Year until ${newEnd}!`);
  };

  // Generate Tax Invoice Handler
  const handleGenerateInvoice = () => {
    if (!selectedContract) return;
    const invNo = selectedContract.contractNumber;
    const invDate = new Date().toISOString().split('T')[0];

    updateAmcContract(selectedContract.id, {
      invoiceGenerated: true,
      invoiceNumber: invNo,
      invoiceDate: invDate,
    });

    // Record Accounting Voucher in Accounting Store
    addAccountingVoucher({
      voucherNumber: `RCT-AMC-${Date.now().toString().slice(-4)}`,
      voucherType: 'RECEIPT',
      voucherDate: invDate,
      partyName: selectedContract.customerName,
      partyPhone: selectedContract.customerPhone,
      partyGst: selectedContract.customerGst,
      refInvoiceNumber: invNo,
      paymentMode: 'HDFC Bank NEFT/RTGS',
      debitLedger: 'HDFC Bank A/c 9812',
      creditLedger: 'AMC Contract Revenue',
      amount: selectedContract.advancePaid || selectedContract.totalAmount,
      totalAmount: selectedContract.totalAmount,
      narration: `Official Tax Invoice generated for AMC Contract ${invNo} (${selectedContract.planOption}).`,
    });

    setSelectedContract({
      ...selectedContract,
      invoiceGenerated: true,
      invoiceNumber: invNo,
      invoiceDate: invDate,
    });
    alert(`Tax Invoice ${invNo} generated and synced to Accounting Ledger successfully!`);
  };

  const openEditModal = (contract: AmcContract) => {
    setSelectedContract(contract);
    setFormData({
      contractNumber: contract.contractNumber,
      manualEntryDate: contract.manualEntryDate || contract.startDate,

      customerId: contract.customerId || '',
      customerName: contract.customerName,
      companyName: contract.companyName || '',
      customerPhone: contract.customerPhone,
      alternatePhone: contract.alternatePhone || '',
      customerEmail: contract.customerEmail || '',
      customerGst: contract.customerGst || '',
      customerAddress: contract.customerAddress || '',

      planOption: contract.planOption || 'Gold Plan',
      contractCost: contract.contractCost || (contract as any).contractAmount || 45000,
      amcAmount: contract.amcAmount || (contract as any).contractAmount || 45000,
      gstRate: contract.gstRate || 18,
      advancePaid: contract.advancePaid || 0,
      paymentStatus: contract.paymentStatus || 'Partially Paid',

      startDate: contract.startDate,
      endDate: contract.endDate,
      renewalDate: contract.renewalDate || contract.endDate,
      contractStatus: contract.contractStatus || contract.status || 'Active',

      coverageScopeDetails: contract.coverageScopeDetails || '',
      source: contract.source || 'Direct',
      serviceType: contract.serviceType || 'Hardware + Software On-site Support',
      numberOfDevices: contract.numberOfDevices || 5,
      totalServiceVisits: contract.totalServiceVisits || 4,
      assignedTechnician: contract.assignedTechnician || employeeNames[0] || 'Deepak Kumar',
      priority: contract.priority || 'High',
      deviceType: contract.deviceType || 'Server',
      issueFound: contract.issueFound || '',
      notes: contract.notes || '',
      selectedChecklistItems: contract.serviceIncludedChecklist || [],
    });
    setCoveredAssets(contract.coveredAssets || []);
    setRetailProducts(contract.retailProducts || []);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setCoveredAssets([
      { id: 'ast-1', assetName: 'Main ERP Server', category: 'Server', brand: 'Dell', model: 'PowerEdge T340', serialNumber: 'DLT340-9981', location: 'Server Room' },
    ]);
    setRetailProducts([]);
    setSelectedContract(null);
  };

  // Table Filter
  const filteredContracts = amcContracts.filter((c: any) => {
    const matchesSearch =
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerPhone.includes(searchTerm) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (c.contractStatus || c.status)?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Collect All PM Visits across all contracts
  const allPmVisitsList = amcContracts.flatMap((c: any) =>
    (c.pmVisits || []).map((pm: any) => ({
      ...pm,
      contractNumber: c.contractNumber,
      customerName: c.customerName,
      customerPhone: c.customerPhone,
      contractId: c.id,
    }))
  );

  // Collect All Service Complaints across all contracts
  const allComplaintsList = amcContracts.flatMap((c: any) =>
    (c.complaints || []).map((cmp: any) => ({
      ...cmp,
      contractNumber: c.contractNumber,
      customerName: c.customerName,
      customerPhone: c.customerPhone,
      contractId: c.id,
    }))
  );

  // Collect All Covered Hardware Assets across all contracts
  const allCoveredAssetsList = amcContracts.flatMap((c: any) =>
    (c.coveredAssets || []).map((ast: any) => ({
      ...ast,
      contractNumber: c.contractNumber,
      customerName: c.customerName,
      customerPhone: c.customerPhone,
      planOption: c.planOption,
    }))
  );

  return (
    <div className="w-full space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#5ED29C]/20 to-[#16FFC6]/10 rounded-2xl border border-[#5ED29C]/30 text-[#5ED29C]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white uppercase flex items-center gap-2">
              AMC Contracts Software Suite <span className="text-[#5ED29C]">.</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Annual Maintenance Contracts • PM Dispatch Board • Service Complaints • Renewals Hub • Covered Assets
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#5ED29C]/20"
        >
          <Plus className="w-4 h-4" /> Register New AMC Contract
        </button>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Active AMC</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {amcContracts.filter((c: any) => (c.contractStatus || c.status)?.toUpperCase() === 'ACTIVE').length}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">✔ Live SLAs Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Contract Value</span>
          <span className="text-2xl font-black text-[#5ED29C] mt-1 block">
            ₹{amcContracts.reduce((sum: number, c: any) => sum + (c.totalAmount || 0), 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Cumulative AMC Revenue</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Scheduled PM Visits</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">
            {allPmVisitsList.filter((pm: any) => pm.status === 'Scheduled').length}
          </span>
          <span className="text-[10px] text-blue-300 font-bold mt-1 block">Maintenance Visits Queued</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Open Service Complaints</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">
            {allComplaintsList.filter((cmp: any) => cmp.status === 'Open' || cmp.status === 'In Progress').length}
          </span>
          <span className="text-[10px] text-rose-300 font-bold mt-1 block">Active Tickets Resolved</span>
        </div>
      </div>

      {/* SUB-MODULE SOFTWARE NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubModule('amc-directory')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 transition-all ${
            activeSubModule === 'amc-directory'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> AMC Contracts Directory
        </button>
        <button
          onClick={() => setActiveSubModule('pm-board')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 transition-all ${
            activeSubModule === 'pm-board'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> PM Visits Board ({allPmVisitsList.length})
        </button>
        <button
          onClick={() => setActiveSubModule('complaints-board')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 transition-all ${
            activeSubModule === 'complaints-board'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Service Desk Complaints ({allComplaintsList.length})
        </button>
        <button
          onClick={() => setActiveSubModule('renewals-hub')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 transition-all ${
            activeSubModule === 'renewals-hub'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Renewals &amp; ARR Hub
        </button>
        <button
          onClick={() => setActiveSubModule('assets-inventory')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 transition-all ${
            activeSubModule === 'assets-inventory'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Covered Assets Database ({allCoveredAssetsList.length})
        </button>
      </div>

      {/* SUB-MODULE 1: AMC CONTRACTS DIRECTORY */}
      {activeSubModule === 'amc-directory' && (
        <div className="space-y-4">
          {/* FILTER & SEARCH CONTROL BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search AMC #, Customer, Phone, GSTIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5ED29C]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'RENEWED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#5ED29C] text-[#070B0A] shadow-md shadow-[#5ED29C]/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* AMC CONTRACTS MAIN DIRECTORY TABLE */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                    <th className="p-4">Contract # / Date</th>
                    <th className="p-4">Customer &amp; Company</th>
                    <th className="p-4">Plan &amp; Scope</th>
                    <th className="p-4">Device &amp; Technician</th>
                    <th className="p-4">Contract Cost &amp; Due</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredContracts.length > 0 ? (
                    filteredContracts.map((contract: any) => (
                      <tr key={contract.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-white text-sm block">{contract.contractNumber}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {contract.startDate} to {contract.endDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-extrabold text-white">{contract.customerName}</div>
                          {contract.companyName && <div className="text-[11px] text-slate-400">{contract.companyName}</div>}
                          <div className="text-[10px] text-[#5ED29C] font-mono">{contract.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-white font-extrabold rounded-lg inline-block">
                            {contract.planOption || contract.planType || 'Gold Plan'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{contract.serviceType}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{contract.deviceType || 'Server'} ({contract.numberOfDevices || 1} units)</div>
                          <div className="text-[10px] text-blue-400 font-bold">Tech: {contract.assignedTechnician || 'Unassigned'}</div>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="font-black text-[#5ED29C] text-sm">₹{contract.totalAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-amber-400 font-bold">
                            Due: ₹{(contract.balanceDue || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4 font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                              contract.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : contract.paymentStatus === 'Partially Paid'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {contract.paymentStatus || 'Partially Paid'}
                          </span>
                        </td>
                        <td className="p-4 font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                              (contract.contractStatus || contract.status) === 'Active' || (contract.contractStatus || contract.status) === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : (contract.contractStatus || contract.status) === 'Expiring'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {contract.contractStatus || contract.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedContract(contract);
                                setShowDetailModal(true);
                              }}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all"
                              title="Quick View Contract Info & PM Schedule"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(contract)}
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20"
                              title="Modify Contract"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedContract(contract);
                                setShowPrintModal(true);
                              }}
                              className="p-2 bg-[#5ED29C]/10 hover:bg-[#5ED29C]/20 text-[#5ED29C] rounded-xl transition-all border border-[#5ED29C]/20"
                              title="Print AMC Certificate & SLA"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete AMC Contract ${contract.contractNumber}?`)) {
                                  deleteAmcContract(contract.id);
                                }
                              }}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/20"
                              title="Delete Contract"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                        No AMC contracts found matching your search. Click "Register New AMC Contract" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: PM VISITS OPERATIONS BOARD */}
      {activeSubModule === 'pm-board' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-extrabold text-white uppercase text-sm">Preventive Maintenance (PM) Visits Schedule</h3>
              <p className="text-xs text-slate-400">Quarterly Maintenance Visit Dispatch &amp; Technician Tracker</p>
            </div>
            <button
              onClick={() => {
                if (amcContracts.length > 0) {
                  setSelectedContract(amcContracts[0]);
                  setShowPmVisitModal(true);
                } else {
                  alert('Please create an AMC contract first.');
                }
              }}
              className="px-4 py-2 bg-[#5ED29C] text-black font-extrabold text-xs uppercase rounded-xl"
            >
              + Schedule PM Visit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPmVisitsList.map((pm: any) => (
              <div
                key={pm.id}
                className={`p-4 rounded-2xl border space-y-2.5 backdrop-blur-md transition-all ${
                  pm.status === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : pm.status === 'Missed'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-[#5ED29C] text-xs">{pm.contractNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      pm.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : pm.status === 'Missed'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {pm.status}
                  </span>
                </div>

                <div className="font-extrabold text-white text-sm">{pm.customerName}</div>
                <div className="text-slate-300 text-xs font-mono">Scheduled Date: {pm.visitDate}</div>
                <div className="text-blue-400 font-bold text-xs">Tech: {pm.technician}</div>
                <p className="text-xs text-slate-400">{pm.visitPurpose}</p>

                {pm.serviceActionsPerformed && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40">
                    ✔ {pm.serviceActionsPerformed}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MODULE 3: SERVICE DESK COMPLAINTS */}
      {activeSubModule === 'complaints-board' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-extrabold text-white uppercase text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> AMC Service Complaints &amp; Incident Desk
              </h3>
              <p className="text-xs text-slate-400">Client Incident Ticket Log &amp; Resolution Tracker</p>
            </div>
            <button
              onClick={() => {
                if (amcContracts.length > 0) {
                  setSelectedContract(amcContracts[0]);
                  setShowComplaintModal(true);
                } else {
                  alert('Please create an AMC contract first.');
                }
              }}
              className="px-4 py-2 bg-rose-500 text-white font-extrabold text-xs uppercase rounded-xl shadow-lg shadow-rose-500/20"
            >
              + Log Service Complaint
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                    <th className="p-4">Ticket # / Date</th>
                    <th className="p-4">Client &amp; Contract</th>
                    <th className="p-4">Complaint Description</th>
                    <th className="p-4">Assigned Tech</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {allComplaintsList.length > 0 ? (
                    allComplaintsList.map((cmp: any) => (
                      <tr key={cmp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-rose-400">
                          {cmp.complaintNumber}
                          <div className="text-[10px] text-slate-400">{cmp.logDate}</div>
                        </td>
                        <td className="p-4 font-bold text-white">
                          {cmp.customerName}
                          <div className="text-[10px] text-[#5ED29C] font-mono">{cmp.contractNumber}</div>
                        </td>
                        <td className="p-4 max-w-xs">{cmp.description}</td>
                        <td className="p-4 text-blue-400 font-bold">{cmp.technician}</td>
                        <td className="p-4 font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                              cmp.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {cmp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => alert(`Complaint ${cmp.complaintNumber} details: ${cmp.internalNotes || 'No notes'}`)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            View Ticket
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No service complaints logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 4: RENEWALS & REVENUE HUB */}
      {activeSubModule === 'renewals-hub' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-white uppercase text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#5ED29C]" /> AMC Contract Renewals &amp; Annual Recurring Revenue (ARR) Hub
            </h3>
            <p className="text-xs text-slate-400">Contract Lifecycle Extensions &amp; Renewal Quotations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {amcContracts.map((c: any) => (
              <div key={c.id} className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-black text-[#5ED29C] text-sm">{c.contractNumber}</span>
                    <h4 className="font-extrabold text-white text-base">{c.customerName}</h4>
                    <p className="text-xs text-slate-400 font-mono">Expiry: {c.endDate}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-white font-extrabold rounded-xl text-xs">
                    {c.planOption || 'Gold Plan'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl flex justify-between items-center text-xs font-mono">
                  <span>Contract Value: <strong className="text-[#5ED29C]">₹{c.totalAmount.toLocaleString()}</strong></span>
                  <span>Status: <strong className="text-amber-400">{c.contractStatus || 'Active'}</strong></span>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleRenewContractOneYear(c)}
                    className="px-4 py-2 bg-[#5ED29C] text-black font-extrabold text-xs uppercase rounded-xl shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Renew for 1 Year (+365 Days)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MODULE 5: COVERED ASSETS DATABASE */}
      {activeSubModule === 'assets-inventory' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-white uppercase text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-[#5ED29C]" /> Client Hardware Assets &amp; Warranty Inventory Database
            </h3>
            <p className="text-xs text-slate-400">Master register of all covered hardware servers, workstations &amp; printers across client contracts</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                    <th className="p-4">Asset Name &amp; Category</th>
                    <th className="p-4">Brand &amp; Model</th>
                    <th className="p-4">Serial Number</th>
                    <th className="p-4">Client &amp; Contract</th>
                    <th className="p-4">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {allCoveredAssetsList.length > 0 ? (
                    allCoveredAssetsList.map((ast: any) => (
                      <tr key={ast.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-white">
                          {ast.assetName}
                          <div className="text-[10px] text-slate-400 font-normal">{ast.category}</div>
                        </td>
                        <td className="p-4">{ast.brand} {ast.model}</td>
                        <td className="p-4 font-mono font-black text-[#5ED29C]">{ast.serialNumber}</td>
                        <td className="p-4 font-bold text-white">
                          {ast.customerName}
                          <div className="text-[10px] text-slate-400 font-mono">{ast.contractNumber}</div>
                        </td>
                        <td className="p-4">{ast.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No hardware assets registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER / EDIT AMC CONTRACT MODAL (FULL 25 FIELDS) */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5ED29C]" />
                {showEditModal ? `Modify AMC Contract: ${formData.contractNumber}` : 'Register New AMC Contract (All 25 Specifications)'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-6">
              {/* SECTION 1: DATES & INVOICE IDENTIFIER */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block">
                  1. Manual Entry Date &amp; Invoice Auto-Sequence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Contract Invoice # *</label>
                    <input
                      type="text"
                      value={formData.contractNumber}
                      onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                      placeholder="AMC-1001 (Auto)"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Manual Entry Date *</label>
                    <input
                      type="date"
                      value={formData.manualEntryDate}
                      onChange={(e) => setFormData({ ...formData, manualEntryDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">End Date / Expiry *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CUSTOMER SELECTION & DETAIL FILE */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3 relative">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block">
                  2. Select Customer File (Search Name / Phone / GSTIN / ID)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <label className="block text-slate-300 font-bold mb-1">Search Customer *</label>
                    <input
                      type="text"
                      value={customerSearchText || formData.customerName}
                      onChange={(e) => {
                        setCustomerSearchText(e.target.value);
                        setFormData({ ...formData, customerName: e.target.value });
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Type name, phone or GSTIN..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                    {showCustomerDropdown && filteredCrmCustomers.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                        {filteredCrmCustomers.map((c: any) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => selectCrmCustomer(c)}
                            className="w-full p-2.5 text-left hover:bg-slate-800 border-b border-slate-800/50 flex flex-col text-xs text-white"
                          >
                            <span className="font-extrabold text-[#5ED29C]">{c.name} {c.companyName ? `(${c.companyName})` : ''}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{c.mobile || (c as any).phone} • GSTIN: {c.gstin || 'N/A'}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Tech Logics Pvt Ltd"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98765-43210"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Alternate Phone</label>
                    <input
                      type="text"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      placeholder="+91 98765-99887"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={formData.customerGst}
                      onChange={(e) => setFormData({ ...formData, customerGst: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Address</label>
                  <input
                    type="text"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Full street address, area, city, pincode"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* SECTION 3: PLAN OPTION, STATUSES & SCOPE */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block">
                  3. Plan Tier, Source, Service Type &amp; Status Controls
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <DynamicOptionSelect
                    label="Plan Option"
                    value={formData.planOption}
                    options={planOptions}
                    onChange={(val) => setFormData({ ...formData, planOption: val })}
                    onAddOption={(opt) => handleAddOption('plan', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('plan', opt)}
                  />

                  <DynamicOptionSelect
                    label="Contract Status"
                    value={formData.contractStatus}
                    options={contractStatuses}
                    onChange={(val) => setFormData({ ...formData, contractStatus: val })}
                    onAddOption={(opt) => handleAddOption('contract', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('contract', opt)}
                  />

                  <DynamicOptionSelect
                    label="Payment Status"
                    value={formData.paymentStatus}
                    options={paymentStatuses}
                    onChange={(val) => setFormData({ ...formData, paymentStatus: val })}
                    onAddOption={(opt) => handleAddOption('payment', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('payment', opt)}
                  />

                  <DynamicOptionSelect
                    label="Lead Source"
                    value={formData.source}
                    options={sourcesList}
                    onChange={(val) => setFormData({ ...formData, source: val })}
                    onAddOption={(opt) => handleAddOption('source', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('source', opt)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <DynamicOptionSelect
                    label="Primary Device Type"
                    value={formData.deviceType}
                    options={deviceTypes}
                    onChange={(val) => setFormData({ ...formData, deviceType: val })}
                    onAddOption={(opt) => handleAddOption('device', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('device', opt)}
                  />

                  <DynamicOptionSelect
                    label="Assigned Technician"
                    value={formData.assignedTechnician}
                    options={techniciansList}
                    onChange={(val) => setFormData({ ...formData, assignedTechnician: val })}
                    onAddOption={(opt) => handleAddOption('technician', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('technician', opt)}
                  />

                  <DynamicOptionSelect
                    label="Priority Level"
                    value={formData.priority}
                    options={prioritiesList}
                    onChange={(val) => setFormData({ ...formData, priority: val })}
                    onAddOption={(opt) => handleAddOption('priority', opt)}
                    onRemoveOption={(opt) => handleRemoveOption('priority', opt)}
                  />

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Renewal Date</label>
                    <input
                      type="date"
                      value={formData.renewalDate}
                      onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Service Type</label>
                    <input
                      type="text"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      placeholder="e.g. Hardware + Software On-site"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Number of Devices</label>
                    <input
                      type="number"
                      value={formData.numberOfDevices}
                      onChange={(e) => setFormData({ ...formData, numberOfDevices: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Total Service Visits / Year</label>
                    <input
                      type="number"
                      value={formData.totalServiceVisits}
                      onChange={(e) => setFormData({ ...formData, totalServiceVisits: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: SERVICE INCLUDED CHECKLIST */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider">
                    4. Service Included Checklist (Dynamic Selectable Items)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {serviceChecklists.map((chk) => {
                    const isSelected = formData.selectedChecklistItems.includes(chk);
                    return (
                      <button
                        type="button"
                        key={chk}
                        onClick={() => toggleChecklistItem(chk)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#5ED29C]/10 border-[#5ED29C]/40 text-[#5ED29C] font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{chk}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5ED29C]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: RETAIL PRODUCTS LINKED TO AMC */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block">
                  5. Retail Products Linked to AMC (Hardware Spare &amp; Inventory Bundles)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newRetailProduct.name}
                      onChange={(e) => setNewRetailProduct({ ...newRetailProduct, name: e.target.value })}
                      placeholder="Product Name (e.g. Kingston 1TB SSD)"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newRetailProduct.unitPrice || ''}
                      onChange={(e) => setNewRetailProduct({ ...newRetailProduct, unitPrice: Number(e.target.value) })}
                      placeholder="Unit Price ₹"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newRetailProduct.quantity}
                      onChange={(e) => setNewRetailProduct({ ...newRetailProduct, quantity: Number(e.target.value) })}
                      placeholder="Qty"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddRetailProduct}
                      className="w-full py-2 bg-[#5ED29C] text-black font-extrabold rounded-lg uppercase"
                    >
                      + Link Product
                    </button>
                  </div>
                </div>

                {retailProducts.length > 0 && (
                  <div className="space-y-1.5">
                    {retailProducts.map((rp) => (
                      <div key={rp.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{rp.name}</span>
                          <span className="text-slate-400 font-mono text-[11px] ml-2">
                            (Qty: {rp.quantity} × ₹{rp.unitPrice} + {rp.gstRate}% GST)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[#5ED29C] font-black">₹{rp.totalPrice.toLocaleString()}</span>
                          <button type="button" onClick={() => handleRemoveRetailProduct(rp.id)} className="text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 6: FINANCIAL LEDGER & INVOICE CALCULATOR */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block">
                  6. Financial Contract Ledger &amp; Automatic Calculation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Base AMC Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.contractCost}
                      onChange={(e) => setFormData({ ...formData, contractCost: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">GST Rate (%)</label>
                    <input
                      type="number"
                      value={formData.gstRate}
                      onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Total Invoice (₹)</label>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[#5ED29C] font-mono font-black text-sm">
                      ₹{calcTotalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Advance Deposit (₹)</label>
                    <input
                      type="number"
                      value={formData.advancePaid}
                      onChange={(e) => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Balance Due (₹)</label>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-black text-sm">
                      ₹{calcBalanceDue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-black uppercase shadow-lg shadow-[#5ED29C]/20"
                >
                  {showEditModal ? 'Save AMC Changes' : 'Register AMC Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK VIEW AMC CONTRACT INFORMATION POP-UP WINDOW */}
      {showDetailModal && selectedContract && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto font-sans text-xs">
            {/* POPUP HEADER */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#5ED29C]" />
                  AMC Contract Information Window: <span className="font-mono text-[#5ED29C]">{selectedContract.contractNumber}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Validity Period: {selectedContract.startDate} to {selectedContract.endDate} • Entry Date: {selectedContract.manualEntryDate || 'N/A'}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CUSTOMER & SCOPE SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1">
                  Customer &amp; Company Detail File
                </span>
                <div className="font-extrabold text-white text-sm">{selectedContract.customerName}</div>
                {selectedContract.companyName && <div className="text-slate-300 font-bold">{selectedContract.companyName}</div>}
                <div className="text-slate-300 font-mono">Mobile: {selectedContract.customerPhone}</div>
                {selectedContract.alternatePhone && <div className="text-slate-400 font-mono">Alt: {selectedContract.alternatePhone}</div>}
                {selectedContract.customerEmail && <div className="text-slate-400">Email: {selectedContract.customerEmail}</div>}
                {selectedContract.customerGst && <div className="text-slate-400 font-mono">GSTIN: {selectedContract.customerGst}</div>}
                {selectedContract.customerAddress && <div className="text-slate-400 text-[11px]">{selectedContract.customerAddress}</div>}
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1">
                  Plan, Device &amp; Scope Specifications
                </span>
                <div className="font-extrabold text-white text-sm">{selectedContract.planOption || 'Gold Plan'}</div>
                <div className="text-blue-400 font-bold">Assigned Tech: {selectedContract.assignedTechnician || 'Unassigned'}</div>
                <div className="text-slate-300">Device Type: {selectedContract.deviceType} ({selectedContract.numberOfDevices} units)</div>
                <div className="text-slate-400">Service Type: {selectedContract.serviceType}</div>
                <div className="text-amber-400 font-bold">Priority: {selectedContract.priority}</div>
                <div className="text-slate-400">Source: {selectedContract.source}</div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1">
                  Financial Ledger &amp; Invoice Status
                </span>
                <div className="text-[#5ED29C] font-mono font-black text-base">₹{selectedContract.totalAmount.toLocaleString()}</div>
                <div className="text-slate-300 font-mono">Advance Deposit: ₹{(selectedContract.advancePaid || 0).toLocaleString()}</div>
                <div className="text-amber-400 font-mono font-bold">Balance Due: ₹{(selectedContract.balanceDue || 0).toLocaleString()}</div>
                <div className="text-slate-400 mt-1">Payment Status: <span className="font-bold text-white">{selectedContract.paymentStatus}</span></div>
                <div className="mt-2 pt-2 border-t border-slate-800">
                  {selectedContract.invoiceGenerated ? (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                      ✔ GST Invoice Generated ({selectedContract.invoiceNumber})
                    </span>
                  ) : (
                    <button
                      onClick={handleGenerateInvoice}
                      className="px-3 py-1.5 bg-amber-500 text-black font-extrabold rounded-xl uppercase text-[10px] shadow-lg shadow-amber-500/20"
                    >
                      ⚡ Generate GST Tax Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PREVENTIVE MAINTENANCE VISIT SCHEDULE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-[#5ED29C] tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5ED29C]" /> Scheduled Preventive Maintenance (PM) Visits ({selectedContract.pmVisits?.length || 0})
                </span>
                <button
                  onClick={() => setShowPmVisitModal(true)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#5ED29C]" /> + Schedule New PM Visit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedContract.pmVisits?.map((pm) => (
                  <div
                    key={pm.id}
                    className={`p-3 rounded-2xl border ${
                      pm.status === 'Completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : pm.status === 'Missed'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>PM Visit #{pm.visitNumber}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {pm.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono mt-1 text-slate-400">Date: {pm.visitDate}</div>
                    <div className="text-[10px] font-bold text-blue-400 mt-0.5">Tech: {pm.technician}</div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{pm.visitPurpose}</p>
                    {pm.serviceActionsPerformed && (
                      <div className="mt-1.5 text-[9px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-800/40">
                        Actions: {pm.serviceActionsPerformed}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOMER COMPLAINTS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-[#5ED29C] tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Customer Service Complaints Log ({selectedContract.complaints?.length || 0})
                </span>
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[10px] rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> + Log New Complaint
                </button>
              </div>

              {selectedContract.complaints && selectedContract.complaints.length > 0 ? (
                <div className="space-y-2">
                  {selectedContract.complaints.map((cmp) => (
                    <div key={cmp.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span className="text-rose-400 font-mono">{cmp.complaintNumber}</span>
                          <span>• {cmp.description}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Logged: {cmp.logDate} • Assigned: {cmp.technician}
                        </div>
                        {cmp.internalNotes && <p className="text-[10px] text-slate-300 mt-1">Actions: {cmp.internalNotes}</p>}
                      </div>
                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-400 font-black text-[10px] uppercase rounded-lg">
                        {cmp.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-[11px] italic">No active customer complaints logged against this AMC contract.</p>
              )}
            </div>

            {/* COVERED HARDWARE ASSETS & RETAIL PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1">
                  Covered Assets ({selectedContract.coveredAssets?.length || 0})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5">
                  {selectedContract.coveredAssets?.map((ast) => (
                    <div key={ast.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] flex justify-between">
                      <span className="font-bold text-white">{ast.assetName} ({ast.brand} {ast.model})</span>
                      <span className="font-mono text-[#5ED29C]">SN: {ast.serialNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1">
                  Linked Retail Products ({selectedContract.retailProducts?.length || 0})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5">
                  {selectedContract.retailProducts?.map((rp) => (
                    <div key={rp.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] flex justify-between">
                      <span className="font-bold text-white">{rp.name} (Qty: {rp.quantity})</span>
                      <span className="font-mono text-[#5ED29C]">₹{rp.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* POP-UP WINDOW ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedContract);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Edit className="w-4 h-4" /> Modify Contract
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete AMC Contract ${selectedContract.contractNumber}?`)) {
                      deleteAmcContract(selectedContract.id);
                      setShowDetailModal(false);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" /> Delete Contract
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowPrintModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-[#070B0A] font-extrabold uppercase text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Printer className="w-4 h-4" /> Print AMC Agreement
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE NEW PM VISIT MODAL */}
      {showPmVisitModal && selectedContract && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-white uppercase text-sm">Schedule Preventive Maintenance Visit</h3>
              <button onClick={() => setShowPmVisitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Visit Date *</label>
                <input
                  type="date"
                  value={newPmVisit.visitDate}
                  onChange={(e) => setNewPmVisit({ ...newPmVisit, visitDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Visit Status</label>
                <select
                  value={newPmVisit.status}
                  onChange={(e) => setNewPmVisit({ ...newPmVisit, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assign Technician</label>
                <select
                  value={newPmVisit.technician}
                  onChange={(e) => setNewPmVisit({ ...newPmVisit, technician: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  {techniciansList.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Visit Purpose &amp; Notes</label>
                <input
                  type="text"
                  value={newPmVisit.visitPurpose}
                  onChange={(e) => setNewPmVisit({ ...newPmVisit, visitPurpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Service Actions Performed / History</label>
                <textarea
                  value={newPmVisit.serviceActionsPerformed}
                  onChange={(e) => setNewPmVisit({ ...newPmVisit, serviceActionsPerformed: e.target.value })}
                  placeholder="Details of dust cleaning, OS patches, RAM test..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowPmVisitModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleAddPmVisit} className="px-5 py-2 bg-[#5ED29C] text-black font-extrabold uppercase rounded-xl">
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOG CUSTOMER COMPLAINT MODAL */}
      {showComplaintModal && selectedContract && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-white uppercase text-sm text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Log Customer Complaint Ticket
              </h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Complaint Description *</label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="e.g. Printer driver offline / Server network dropping..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white h-20"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Status</label>
                <select
                  value={newComplaint.status}
                  onChange={(e) => setNewComplaint({ ...newComplaint, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assign Technician</label>
                <select
                  value={newComplaint.technician}
                  onChange={(e) => setNewComplaint({ ...newComplaint, technician: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  {techniciansList.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Internal Actions / Resolution Notes</label>
                <input
                  type="text"
                  value={newComplaint.internalNotes}
                  onChange={(e) => setNewComplaint({ ...newComplaint, internalNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowComplaintModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleLogComplaint} className="px-5 py-2 bg-rose-500 text-white font-extrabold uppercase rounded-xl">
                Log Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {showPrintModal && selectedContract && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#5ED29C]" /> AMC Certificate &amp; Printable Invoice
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div>
                  <h2 className="text-lg font-black tracking-wider uppercase text-slate-900">
                    {companyDetails.companyLegalName || (companyDetails as any).companyName || 'ACCNO SOLUTION ERP'}
                  </h2>
                  <p className="text-[10px] text-slate-600">{companyDetails.addressLine1 || (companyDetails as any).address}</p>
                  <p className="text-[10px] text-slate-600">
                    GSTIN: {companyDetails.gstin} | Contact: {companyDetails.phoneNumber || (companyDetails as any).phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase rounded">
                    ANNUAL MAINTENANCE AGREEMENT
                  </span>
                  <p className="text-[10px] font-mono mt-1 text-slate-700 font-bold">Contract #: {selectedContract.contractNumber}</p>
                  <p className="text-[10px] text-slate-600">Valid: {selectedContract.startDate} to {selectedContract.endDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Customer Profile:</p>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedContract.customerName}</p>
                  {selectedContract.companyName && <p className="font-bold text-slate-700">{selectedContract.companyName}</p>}
                  <p className="font-mono text-slate-700">{selectedContract.customerPhone}</p>
                  {selectedContract.customerGst && <p className="font-mono text-slate-700">GSTIN: {selectedContract.customerGst}</p>}
                  <p className="text-slate-600 text-[10px]">{selectedContract.customerAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Plan &amp; Tech Assigned:</p>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedContract.planOption}</p>
                  <p className="font-bold text-slate-700">Tech: {selectedContract.assignedTechnician}</p>
                  <p className="text-slate-700 font-mono">Total Contract: ₹{selectedContract.totalAmount.toLocaleString()}</p>
                  <p className="text-slate-700 font-mono">Paid Advance: ₹{(selectedContract.advancePaid || 0).toLocaleString()}</p>
                  <p className="text-slate-900 font-mono font-black">Balance Due: ₹{(selectedContract.balanceDue || 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="font-black text-slate-900 uppercase text-[10px] mb-1">Covered Assets Inventory ({selectedContract.coveredAssets?.length || 0}):</p>
                <table className="w-full border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 uppercase font-black">
                      <th className="border border-slate-300 p-1">Asset</th>
                      <th className="border border-slate-300 p-1">Brand &amp; Model</th>
                      <th className="border border-slate-300 p-1">Serial Number</th>
                      <th className="border border-slate-300 p-1">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedContract.coveredAssets?.map((ast) => (
                      <tr key={ast.id}>
                        <td className="border border-slate-300 p-1 font-bold">{ast.assetName}</td>
                        <td className="border border-slate-300 p-1">{ast.brand} {ast.model}</td>
                        <td className="border border-slate-300 p-1 font-mono font-bold">{ast.serialNumber}</td>
                        <td className="border border-slate-300 p-1">{ast.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedContract.retailProducts && selectedContract.retailProducts.length > 0 && (
                <div>
                  <p className="font-black text-slate-900 uppercase text-[10px] mb-1">Linked Retail Products ({selectedContract.retailProducts.length}):</p>
                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 uppercase font-black">
                        <th className="border border-slate-300 p-1">Product</th>
                        <th className="border border-slate-300 p-1 text-center">Qty</th>
                        <th className="border border-slate-300 p-1 text-right">Price</th>
                        <th className="border border-slate-300 p-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedContract.retailProducts.map((rp) => (
                        <tr key={rp.id}>
                          <td className="border border-slate-300 p-1 font-bold">{rp.name}</td>
                          <td className="border border-slate-300 p-1 text-center font-mono">{rp.quantity}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">₹{rp.unitPrice}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono font-bold">₹{rp.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-8 grid grid-cols-2 gap-8 text-[10px] border-t border-slate-300">
                <div className="text-center border-t border-slate-400 pt-1">
                  Customer Acceptance Signature
                </div>
                <div className="text-center border-t border-slate-400 pt-1 font-bold">
                  Authorized Signatory (ACCNO SOLUTION)
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#5ED29C] text-[#070B0A] font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-[#5ED29C]/20"
              >
                <Printer className="w-4 h-4" /> Print Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
