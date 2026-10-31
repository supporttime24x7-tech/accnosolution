'use client';

import React, { useState, useEffect } from 'react';
import {
  HardDrive, Plus, Search, Filter, Printer, Edit, Trash2, ShieldCheck,
  CheckCircle2, AlertTriangle, FileText, Lock, DollarSign, Cpu, Eye, X, Receipt,
  ChevronDown, User, Smartphone, Tag, RefreshCw, Layers, Sliders, CheckSquare,
  Building, Phone, Mail, MapPin, AlertCircle, ArrowRight, RotateCw
} from 'lucide-react';
import { useErpStore, DataRecoveryCase } from '@/lib/store';
import {
  fetchDataRecoveryFromSupabase,
  pushDataRecoveryToSupabase,
  deleteDataRecoveryFromSupabase,
} from '@/lib/supabase-sync';
import { AccnoLogo } from '@/components/common/AccnoLogo';
import { getSyncQrDataUri, UpiPaymentQRCode } from '@/lib/qr-utils';

// Reusable Dynamic Option Selector Component with Inline +Add and Delete
const DynamicOptionSelect: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  onAddOption: (newOpt: string) => void;
  onRemoveOption: (optToRemove: string) => void;
}> = ({ label, value, onChange, options, onAddOption, onRemoveOption }) => {
  const [modalMode, setModalMode] = useState<'add' | 'remove' | null>(null);
  const [newVal, setNewVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newVal.trim();
    if (!trimmed) {
      setError('Option value cannot be empty.');
      return;
    }
    if (options.some((o) => o.toLowerCase() === trimmed.toLowerCase())) {
      setError('This option already exists.');
      return;
    }
    onAddOption(trimmed);
    onChange(trimmed);
    setNewVal('');
    setModalMode(null);
    setError(null);
  };

  const handleConfirmRemove = () => {
    if (options.length <= 1) {
      setError('At least one option must remain in the list.');
      return;
    }
    onRemoveOption(value);
    const remaining = options.filter((o) => o !== value);
    onChange(remaining[0] || '');
    setModalMode(null);
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{label} *</label>
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => {
              setNewVal('');
              setError(null);
              setModalMode('add');
            }}
            className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
          >
            + Add
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setModalMode('remove');
            }}
            className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-medium text-xs focus:border-[#5ED29C] focus:outline-none appearance-none pr-8"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-white">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
      </div>

      {/* In-app Modal Dialog for +ADD / REMOVE */}
      {modalMode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F15] border border-white/20 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                {modalMode === 'add' ? (
                  <>
                    <Plus className="w-4 h-4 text-[#5ED29C]" /> Add New {label} Option
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-rose-400" /> Remove {label} Option
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {modalMode === 'add' ? (
              <form onSubmit={handleConfirmAdd} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-bold mb-1">Option Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder={`Enter new ${label} value...`}
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white text-xs focus:border-[#5ED29C] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5ED29C]/20"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Option
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-white/80 leading-relaxed">
                  Are you sure you want to remove the option:
                </p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-rose-400 font-mono break-all">
                  &ldquo;{value || 'Selected Option'}&rdquo;
                </div>
                <p className="text-[11px] text-white/50">
                  This option will be removed from future selection dropdowns.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRemove}
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_DEVICE_BRANDS = [
  'Seagate', 'Western Digital (WD)', 'Toshiba', 'Samsung', 'SanDisk', 'Crucial / Micron', 'Kingston', 'Hitachi / HGST'
];
const DEFAULT_DAMAGE_TYPES = [
  'Head Crash / Physical Noise', 'PCB Electronic Damage', 'Logical Corruption / Formatted', 'Firmware Lock / Service Area', 'Bad Sectors / Slow Read', 'NAND Flash Degradation', 'Water / Liquid Damaged'
];
const DEFAULT_PRIORITIES = [
  'LOW', 'NORMAL', 'HIGH', 'EMERGENCY / CLEANROOM'
];
const DEFAULT_STATUSES = [
  'Intake Registered', 'Initial Assessment', 'Imaging in Cleanroom', 'Data Verification', 'Ready for Delivery', 'Completed / Delivered', 'Unrecoverable / Returned'
];
const DEFAULT_STORAGE_LOCATIONS = [
  'Safe Vault Locker 01', 'Cleanroom Bench 03', 'Rack Shelf A-04', 'ESD Shielded Storage Bin 02', 'Locker 12'
];
const DEFAULT_OUTSOURCE_DESTS = [
  'Stellar Data Recovery Delhi', 'Accno Central Cleanroom Lab', 'WD Authorized Service Center', 'Seagate Recovery Lab Bangalore'
];
const DEFAULT_OUTSOURCE_STATUSES = [
  'PENDING_DISPATCH', 'SHIPPED', 'IN_EXTERNAL_LAB', 'RETURNED_SUCCESS', 'RETURNED_UNSUCCESSFUL'
];

export default function ErpDataRecoveryPage() {
  const {
    dataRecoveryCases,
    addDataRecoveryCase,
    updateDataRecoveryCase,
    deleteDataRecoveryCase,
    setDataRecoveryCases,
    customers,
    employees,
    companyDetails,
    repairBillingRules,
  } = useErpStore();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncingCloud(true);
    setSyncStatusMsg('Syncing with Supabase Cloud...');
    try {
      const data = await fetchDataRecoveryFromSupabase();
      if (Array.isArray(data)) {
        setDataRecoveryCases(data);
        setSyncStatusMsg(`Synced ${data.length} cases from Cloud`);
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
    fetchDataRecoveryFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setDataRecoveryCases(data);
      }
    }).catch(() => {});
  }, [setDataRecoveryCases]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dynamic Options States with LocalStorage Persistence
  const [deviceBrandOptions, setDeviceBrandOptions] = useState<string[]>(DEFAULT_DEVICE_BRANDS);
  const [damageTypeOptions, setDamageTypeOptions] = useState<string[]>(DEFAULT_DAMAGE_TYPES);
  const [priorityOptions, setPriorityOptions] = useState<string[]>(DEFAULT_PRIORITIES);
  const [statusOptions, setStatusOptions] = useState<string[]>(DEFAULT_STATUSES);
  const empListNames = (employees || []).filter((e) => e.activeStatus !== 'Inactive').map((e) => e.name).filter(Boolean);
  const technicianOptionsList = empListNames.length > 0 ? Array.from(new Set(empListNames)) : ['Deepak Kumar', 'Rahul Gupta'];
  const [storageLocationOptions, setStorageLocationOptions] = useState<string[]>(DEFAULT_STORAGE_LOCATIONS);
  const [outsourceDestinationOptions, setOutsourceDestinationOptions] = useState<string[]>(DEFAULT_OUTSOURCE_DESTS);
  const [outsourceStatusOptions, setOutsourceStatusOptions] = useState<string[]>(DEFAULT_OUTSOURCE_STATUSES);

  useEffect(() => {
    try {
      const b = localStorage.getItem('accno_dr_device_brands');
      if (b) setDeviceBrandOptions(JSON.parse(b));
      const dt = localStorage.getItem('accno_dr_damage_types');
      if (dt) setDamageTypeOptions(JSON.parse(dt));
      const p = localStorage.getItem('accno_dr_priorities');
      if (p) setPriorityOptions(JSON.parse(p));
      const s = localStorage.getItem('accno_dr_statuses');
      if (s) setStatusOptions(JSON.parse(s));
      const sl = localStorage.getItem('accno_dr_storage_locations');
      if (sl) setStorageLocationOptions(JSON.parse(sl));
      const od = localStorage.getItem('accno_dr_outsource_dests');
      if (od) setOutsourceDestinationOptions(JSON.parse(od));
      const os = localStorage.getItem('accno_dr_outsource_statuses');
      if (os) setOutsourceStatusOptions(JSON.parse(os));
    } catch (e) {
      console.error('Failed to load DR options from localStorage', e);
    }
  }, []);

  const saveDeviceBrandOptions = (opts: string[]) => {
    setDeviceBrandOptions(opts);
    try { localStorage.setItem('accno_dr_device_brands', JSON.stringify(opts)); } catch {}
  };
  const saveDamageTypeOptions = (opts: string[]) => {
    setDamageTypeOptions(opts);
    try { localStorage.setItem('accno_dr_damage_types', JSON.stringify(opts)); } catch {}
  };
  const savePriorityOptions = (opts: string[]) => {
    setPriorityOptions(opts);
    try { localStorage.setItem('accno_dr_priorities', JSON.stringify(opts)); } catch {}
  };
  const saveStatusOptions = (opts: string[]) => {
    setStatusOptions(opts);
    try { localStorage.setItem('accno_dr_statuses', JSON.stringify(opts)); } catch {}
  };
  const saveStorageLocationOptions = (opts: string[]) => {
    setStorageLocationOptions(opts);
    try { localStorage.setItem('accno_dr_storage_locations', JSON.stringify(opts)); } catch {}
  };
  const saveOutsourceDestinationOptions = (opts: string[]) => {
    setOutsourceDestinationOptions(opts);
    try { localStorage.setItem('accno_dr_outsource_dests', JSON.stringify(opts)); } catch {}
  };
  const saveOutsourceStatusOptions = (opts: string[]) => {
    setOutsourceStatusOptions(opts);
    try { localStorage.setItem('accno_dr_outsource_statuses', JSON.stringify(opts)); } catch {}
  };

  // Modal States
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState<DataRecoveryCase | null>(null);

  // Quick Detail & Status Update Pop-up Modal (Clicking on Case Card/Row)
  const [quickViewCase, setQuickViewCase] = useState<DataRecoveryCase | null>(null);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);

  // Print Copy & Preview Modal
  const [showPrintCopyChoiceModal, setShowPrintCopyChoiceModal] = useState(false);
  const [pendingPrintType, setPendingPrintType] = useState<'intake' | 'bill' | null>(null);
  const [pendingPrintCase, setPendingPrintCase] = useState<DataRecoveryCase | null>(null);
  const [printFormat, setPrintFormat] = useState<'A4' | 'A5'>('A4');

  // Customer Autocomplete State
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    recoveryIdNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerGst: '',
    customerAddress: '',

    deviceBrand: 'Seagate',
    deviceType: 'Mechanical HDD (3.5"/2.5")',
    driveModel: '',
    driveSerial: '',
    capacity: '1TB',
    fileSystem: 'NTFS',

    damageType: 'Head Crash / Physical Noise',
    priority: 'NORMAL',
    symptoms: 'Clicking head sound, drive not detected in BIOS',
    status: 'Intake Registered',
    technician: technicianOptionsList[0] || 'Deepak Kumar',
    storageLocation: 'Safe Vault Locker 01',

    isOutsourced: false,
    outsourceDestination: 'Stellar Data Recovery Delhi',
    outsourceStatus: 'PENDING_DISPATCH',
    outsourceDispatchDate: new Date().toISOString().split('T')[0],
    outsourceReturnDate: '',
    outsourceAmount: 0,
    outsourceFreight: 0,

    estimateCost: 15000,
    advance: 1500,
    customerCharge: 12000,
    freight: 300,
    discount: 500,
    gstRate: 18,

    termsConsentAccepted: true,
    requestedWork: 'Partition D: / Photos & Tally ERP Data Backup',
    additionalInfo: 'Drive in USB 3.0 external enclosure with original cable',
    confidentialNotes: 'Platter cleanroom assessment passed. Sector clone in progress.',
    recoveryPhaseStatus: 'Phase 1: Lab Diagnostic',
    progressPercentage: 45,

    estimatedDataGb: 500,
    recoveredDataGb: 220,
    healthPercentage: 96,
    rackLocation: 'Safe Vault Locker 01',
    donorDriveSerial: '',
    targetDriveDetails: 'Customer Provided 1TB WD External Drive',
  });

  // Calculate Form Totals dynamically
  const calcSubtotal = Math.max(0, (formData.customerCharge || 0) + (formData.freight || 0) - (formData.discount || 0));
  const calcGstAmount = (calcSubtotal * (formData.gstRate || 0)) / 100;
  const calcTotalInvoice = Math.round(calcSubtotal + calcGstAmount);
  const calcBalanceDue = Math.max(0, calcTotalInvoice - (formData.advance || 0));

  const openNewCaseModal = () => {
    setEditingCase(null);
    const nextNo = 1001 + dataRecoveryCases.length;
    const recId = `REC-${nextNo}`;
    setCustomerSearchText('');
    setShowCustomerDropdown(false);
    setFormData({
      recoveryIdNumber: recId,
      entryDate: new Date().toISOString().split('T')[0],
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerGst: '',
      customerAddress: '',

      deviceBrand: deviceBrandOptions[0] || 'Seagate',
      deviceType: 'Mechanical HDD (3.5"/2.5")',
      driveModel: '',
      driveSerial: '',
      capacity: '1TB',
      fileSystem: 'NTFS',

      damageType: damageTypeOptions[0] || 'Head Crash / Physical Noise',
      priority: priorityOptions[1] || 'NORMAL',
      symptoms: 'Clicking noise when powered on, unreadable partitions',
      status: statusOptions[0] || 'Intake Registered',
      technician: technicianOptionsList[0] || 'Unassigned Staff',
      storageLocation: storageLocationOptions[0] || 'Safe Vault Locker 01',

      isOutsourced: false,
      outsourceDestination: outsourceDestinationOptions[0] || 'Stellar Data Recovery Delhi',
      outsourceStatus: outsourceStatusOptions[0] || 'PENDING_DISPATCH',
      outsourceDispatchDate: new Date().toISOString().split('T')[0],
      outsourceReturnDate: '',
      outsourceAmount: 0,
      outsourceFreight: 0,

      estimateCost: 15000,
      advance: 1500,
      customerCharge: 12000,
      freight: 300,
      discount: 500,
      gstRate: 18,

      termsConsentAccepted: true,
      requestedWork: 'All Desktop Documents, Photos, and Tally Backup Folder',
      additionalInfo: 'Submitted with original SATA power cable and protective anti-static bag',
      confidentialNotes: 'Confidential client data. Restrict access to senior lab team.',
      recoveryPhaseStatus: 'Phase 1: Lab Diagnostic',
      progressPercentage: 25,

      estimatedDataGb: 500,
      recoveredDataGb: 120,
      healthPercentage: 95,
      rackLocation: 'Safe Vault Locker 01',
      donorDriveSerial: '',
      targetDriveDetails: 'Customer Provided External Drive',
    });
    setShowCaseModal(true);
  };

  const openEditCaseModal = (item: DataRecoveryCase) => {
    setEditingCase(item);
    setCustomerSearchText(item.customerName || '');
    setShowCustomerDropdown(false);
    setFormData({
      recoveryIdNumber: item.recoveryIdNumber || item.caseNumber || `REC-1001`,
      entryDate: item.entryDate || new Date().toISOString().split('T')[0],
      customerName: item.customerName || '',
      customerPhone: item.customerPhone || '',
      customerEmail: item.customerEmail || '',
      customerGst: item.customerGst || '',
      customerAddress: item.customerAddress || '',

      deviceBrand: item.deviceBrand || 'Seagate',
      deviceType: item.deviceType || 'Mechanical HDD (3.5"/2.5")',
      driveModel: item.driveModel || '',
      driveSerial: item.driveSerial || '',
      capacity: item.capacity || '1TB',
      fileSystem: item.fileSystem || 'NTFS',

      damageType: item.damageType || 'Head Crash / Physical Noise',
      priority: item.priority || 'NORMAL',
      symptoms: item.symptoms || (item as any).mediaCondition || '',
      status: item.status || 'Intake Registered',
      technician: item.technician || technicianOptionsList[0] || 'Deepak Kumar',
      storageLocation: item.storageLocation || item.rackLocation || 'Safe Vault Locker 01',

      isOutsourced: !!item.isOutsourced,
      outsourceDestination: item.outsource?.destination || outsourceDestinationOptions[0],
      outsourceStatus: item.outsource?.status || outsourceStatusOptions[0],
      outsourceDispatchDate: item.outsource?.dispatchDate || new Date().toISOString().split('T')[0],
      outsourceReturnDate: item.outsource?.returnDate || '',
      outsourceAmount: item.outsource?.amount || 0,
      outsourceFreight: item.outsource?.freight || 0,

      estimateCost: item.estimateCost || item.recoveryFee || 15000,
      advance: item.advance || item.deposit || item.paidAmount || 0,
      customerCharge: item.customerCharge || item.recoveryFee || 12000,
      freight: item.freight || 0,
      discount: item.discount || 0,
      gstRate: item.gstRate || 18,

      termsConsentAccepted: item.termsConsentAccepted ?? true,
      requestedWork: item.requestedWork || '',
      additionalInfo: item.additionalInfo || '',
      confidentialNotes: item.confidentialNotes || item.notes || '',
      recoveryPhaseStatus: item.recoveryPhaseStatus || 'Phase 1: Lab Diagnostic',
      progressPercentage: item.progressPercentage || 50,

      estimatedDataGb: item.estimatedDataGb || 500,
      recoveredDataGb: item.recoveredDataGb || 250,
      healthPercentage: item.healthPercentage || 95,
      rackLocation: item.rackLocation || 'Safe Vault Locker 01',
      donorDriveSerial: item.donorDriveSerial || '',
      targetDriveDetails: item.targetDriveDetails || '',
    });
    setShowCaseModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.driveModel || !formData.driveSerial) {
      alert('Please fill out customer name, mobile number, drive model, and serial number.');
      return;
    }

    if (!formData.termsConsentAccepted) {
      alert('Customer consent must be confirmed to proceed.');
      return;
    }

    const netSubtotal = Math.max(0, formData.customerCharge + formData.freight - formData.discount);
    const gstAmt = (netSubtotal * formData.gstRate) / 100;
    const totalInv = Math.round(netSubtotal + gstAmt);
    const balDue = Math.max(0, totalInv - formData.advance);

    let payStatus = 'UNPAID';
    if (formData.advance >= totalInv && totalInv > 0) payStatus = 'PAID IN FULL';
    else if (formData.advance > 0) payStatus = 'PARTIALLY PAID';

    const payload: Partial<DataRecoveryCase> = {
      recoveryIdNumber: formData.recoveryIdNumber,
      caseNumber: formData.recoveryIdNumber,
      entryDate: formData.entryDate,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      customerGst: formData.customerGst,
      customerAddress: formData.customerAddress,

      deviceBrand: formData.deviceBrand,
      deviceType: formData.deviceType,
      driveModel: formData.driveModel,
      driveSerial: formData.driveSerial,
      capacity: formData.capacity,
      fileSystem: formData.fileSystem,

      damageType: formData.damageType,
      priority: formData.priority,
      symptoms: formData.symptoms,
      status: formData.status as any,
      technician: formData.technician,
      storageLocation: formData.storageLocation,
      rackLocation: formData.storageLocation,

      isOutsourced: formData.isOutsourced,
      outsource: formData.isOutsourced
        ? {
            destination: formData.outsourceDestination,
            status: formData.outsourceStatus,
            dispatchDate: formData.outsourceDispatchDate,
            returnDate: formData.outsourceReturnDate,
            amount: formData.outsourceAmount,
            freight: formData.outsourceFreight,
          }
        : undefined,

      estimateCost: formData.estimateCost,
      advance: formData.advance,
      customerCharge: formData.customerCharge,
      freight: formData.freight,
      discount: formData.discount,
      gstRate: formData.gstRate,
      totalInvoice: totalInv,
      deposit: formData.advance,
      balanceDue: balDue,

      diagnosticFee: 1500,
      recoveryFee: formData.customerCharge,
      paidAmount: formData.advance,
      paymentStatus: payStatus,

      termsConsentAccepted: formData.termsConsentAccepted,
      requestedWork: formData.requestedWork,
      additionalInfo: formData.additionalInfo,
      confidentialNotes: formData.confidentialNotes,
      recoveryPhaseStatus: formData.recoveryPhaseStatus,
      progressPercentage: formData.progressPercentage,

      estimatedDataGb: formData.estimatedDataGb,
      recoveredDataGb: formData.recoveredDataGb,
      healthPercentage: formData.healthPercentage,
      donorDriveSerial: formData.donorDriveSerial,
      targetDriveDetails: formData.targetDriveDetails,
      notes: formData.confidentialNotes,
    };

    if (editingCase) {
      updateDataRecoveryCase(editingCase.id, payload);
      pushDataRecoveryToSupabase({ ...editingCase, ...payload } as any).catch(() => {});
    } else {
      addDataRecoveryCase(payload as DataRecoveryCase);
      pushDataRecoveryToSupabase(payload as any).catch(() => {});
    }
    setShowCaseModal(false);
  };

  // Filter CRM customers for autocomplete
  const filteredCrmCustomers = customers.filter((c: any) => {
    const q = customerSearchText.toLowerCase().trim();
    if (!q) return true;
    const phoneNum = c.mobile || (c as any).phone || '';
    return (
      c.name.toLowerCase().includes(q) ||
      phoneNum.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.companyName && c.companyName.toLowerCase().includes(q))
    );
  });

  const selectCrmCustomer = (c: any) => {
    setFormData((prev) => ({
      ...prev,
      customerName: c.name || '',
      customerPhone: c.mobile || c.phone || '',
      customerEmail: c.email || '',
      customerGst: c.gstin || '',
      customerAddress: c.billingAddress || c.fullAddress || c.address || '',
    }));
    setCustomerSearchText(c.name || '');
    setShowCustomerDropdown(false);
  };

  // Quick View Pop-up Modal Opener (Clicking on Case Card/Row)
  const openQuickViewModal = (item: DataRecoveryCase) => {
    setQuickViewCase(item);
    setShowQuickViewModal(true);
  };

  const handleQuickStatusUpdate = (newStatus: string) => {
    if (!quickViewCase) return;
    const updated = { ...quickViewCase, status: newStatus };
    updateDataRecoveryCase(quickViewCase.id, { status: newStatus });
    pushDataRecoveryToSupabase(updated as any).catch(() => {});
    setQuickViewCase(updated);
  };

  const handleQuickPhaseUpdate = (newPhase: string) => {
    if (!quickViewCase) return;
    const updated = { ...quickViewCase, recoveryPhaseStatus: newPhase };
    updateDataRecoveryCase(quickViewCase.id, { recoveryPhaseStatus: newPhase });
    pushDataRecoveryToSupabase(updated as any).catch(() => {});
    setQuickViewCase(updated);
  };

  const handleQuickProgressUpdate = (newPct: number) => {
    if (!quickViewCase) return;
    const updated = { ...quickViewCase, progressPercentage: newPct };
    updateDataRecoveryCase(quickViewCase.id, { progressPercentage: newPct });
    pushDataRecoveryToSupabase(updated as any).catch(() => {});
    setQuickViewCase(updated);
  };

  const handleQuickNotesUpdate = (newNotes: string) => {
    if (!quickViewCase) return;
    const updated = { ...quickViewCase, confidentialNotes: newNotes, notes: newNotes };
    updateDataRecoveryCase(quickViewCase.id, { confidentialNotes: newNotes, notes: newNotes });
    pushDataRecoveryToSupabase(updated as any).catch(() => {});
    setQuickViewCase(updated);
  };

  // Filtered List
  const filteredCases = dataRecoveryCases.filter((item: any) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (item.recoveryIdNumber && item.recoveryIdNumber.toLowerCase().includes(query)) ||
      item.caseNumber.toLowerCase().includes(query) ||
      item.customerName.toLowerCase().includes(query) ||
      item.customerPhone.toLowerCase().includes(query) ||
      item.driveModel.toLowerCase().includes(query) ||
      item.driveSerial.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Metrics Calculations
  const totalCases = dataRecoveryCases.length;
  const activeCases = dataRecoveryCases.filter((c: any) =>
    ['Intake Registered', 'Initial Assessment', 'Imaging in Cleanroom', 'RECEIVED IN LAB', 'CLEANROOM DIAGNOSTIC', 'FIRMWARE REPAIR IN PROGRESS', 'HEAD SWAP IN CLEANROOM', 'BIT-STREAM IMAGING'].includes(c.status)
  ).length;
  const verifiedCases = dataRecoveryCases.filter((c: any) => ['Data Verification', 'Ready for Delivery', 'DELIVERED & VERIFIED', 'Completed / Delivered'].includes(c.status)).length;
  const totalRevenue = dataRecoveryCases.reduce((acc: number, c: any) => acc + (c.totalInvoice || c.recoveryFee || 0), 0);

  // Print Document Engine Handlers
  const triggerPrintChoice = (type: 'intake' | 'bill', item: DataRecoveryCase) => {
    setPendingPrintType(type);
    setPendingPrintCase(item);
    setShowPrintCopyChoiceModal(true);
  };

  const handleExecutePrint = (copyChoice: 'both' | 'customer' | 'office') => {
    setShowPrintCopyChoiceModal(false);
    if (!pendingPrintCase || !pendingPrintType) return;

    if (pendingPrintType === 'intake') {
      executeIntakePrintDocument(pendingPrintCase, copyChoice);
    } else {
      executeBillPrintDocument(pendingPrintCase, copyChoice);
    }
  };

  // Print Forensic Intake Order Sheet
  const executeIntakePrintDocument = (c: DataRecoveryCase, copyChoice: 'both' | 'customer' | 'office') => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    const renderSheet = (copyLabel: string) => `
      <div class="sheet-wrapper">
        <div class="sheet-header">
          <div class="brand">
            <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #000;">${companyDetails.companyLegalName || 'ACCNO SOLUTION'}</div>
            <div style="font-size: 8px; font-weight: 700; color: #475569; text-transform: uppercase;">Forensic Data Recovery Lab &amp; Hardware Diagnostics</div>
            <div style="font-size: 7.5px; color: #334155; margin-top: 3px;">
              ${companyDetails.addressLine1 || 'Plot 42, Sanchore Industrial Area'}<br/>
              ${companyDetails.addressLine2 || 'Near Bus Stand, Sanchore 343041'}<br/>
              Phone: ${companyDetails.phoneNumber || '+91 98765 43210'} | Email: ${companyDetails.email || 'support@accno.in'} | GSTIN: ${companyDetails.gstin || '08ABCDE1234F1Z5'}
            </div>
          </div>
          <div class="case-badge">
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; font-family: monospace;">${c.recoveryIdNumber || c.caseNumber}</div>
            <div style="font-size: 7.5px; font-weight: 800; color: #0f766e; text-transform: uppercase; margin-top: 2px;">FORENSIC INTAKE SHEET</div>
            <div style="font-size: 7px; color: #64748b; margin-top: 2px;">Date: ${c.entryDate}</div>
            <div style="font-size: 6.5px; font-weight: 800; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; margin-top: 4px; text-transform: uppercase;">${copyLabel}</div>
          </div>
        </div>

        <div class="section-title">I. CUSTOMER &amp; MEDIA SPECIFICATIONS</div>
        <table class="data-table">
          <tr>
            <td><strong>CUSTOMER NAME:</strong> ${c.customerName}</td>
            <td><strong>PHONE / MOBILE:</strong> ${c.customerPhone}</td>
          </tr>
          <tr>
            <td><strong>STORAGE DEVICE:</strong> ${c.deviceBrand || ''} ${c.deviceType}</td>
            <td><strong>BRAND / MODEL:</strong> ${c.driveModel}</td>
          </tr>
          <tr>
            <td><strong>SERIAL NUMBER:</strong> <span style="font-family: monospace; font-weight: 900;">${c.driveSerial}</span></td>
            <td><strong>CAPACITY &amp; FS:</strong> ${c.capacity} (${c.fileSystem})</td>
          </tr>
          <tr>
            <td><strong>DAMAGE / SYMPTOMS:</strong> ${c.damageType || c.symptoms || (c as any).mediaCondition}</td>
            <td><strong>PRIORITY / TECHNICIAN:</strong> ${c.priority || 'NORMAL'} | ${c.technician || 'Deepak Kumar'}</td>
          </tr>
          <tr>
            <td><strong>STORAGE VAULT LOCATION:</strong> ${c.storageLocation || c.rackLocation}</td>
            <td><strong>DONOR DRIVE SN:</strong> ${c.donorDriveSerial || 'N/A'}</td>
          </tr>
        </table>

        <div class="section-title">II. FORENSIC DIAGNOSTIC &amp; ESTIMATED RESTORATION SUMMARY</div>
        <table class="data-table">
          <tr>
            <td><strong>ESTIMATED RECOVERY COST:</strong> ₹${(c.estimateCost || c.recoveryFee || 0).toLocaleString()}</td>
            <td><strong>ADVANCE DEPOSIT:</strong> ₹${(c.advance || c.deposit || c.paidAmount || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>REQUESTED FILES / PARTITIONS:</strong> ${c.requestedWork || 'All Files & Folders'}</td>
            <td><strong>ADDITIONAL INFO:</strong> ${c.additionalInfo || 'N/A'}</td>
          </tr>
        </table>

        <div class="nda-box">
          <div style="font-weight: 900; text-transform: uppercase; color: #0f766e; margin-bottom: 2px;">100% DATA CONFIDENTIALITY &amp; NDA GUARANTEE</div>
          <div>Accno Solution warrants complete data privacy and non-disclosure for all recovered personal, medical, financial, and legal files. All extracted bit-stream images are destroyed 7 days after media delivery.</div>
        </div>

        <div class="terms-box">
          <div style="font-weight: 900; text-transform: uppercase; margin-bottom: 2px;">FORENSIC LAB TERMS &amp; CONDITIONS</div>
          <div>1. Data recovery success depends on the extent of damage.</div>
          <div>2. Clean room recovery may be required for physical damage.</div>
          <div>3. Customer will be notified of recovery progress via WhatsApp/SMS.</div>
          <div>4. Estimated cost may vary based on assessment results.</div>
        </div>

        <div class="footer-row">
          <div>
            <div style="font-weight: bold; font-size: 8px;">${repairBillingRules?.printFooterLegalNotice || 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.'}</div>
            <div style="font-size: 7.5px; color: #64748b;">${repairBillingRules?.printFooterDocTypeLabel || 'Computer Generated Official Repair Receipt.'}</div>
          </div>
          <div style="text-align: right; width: 180px;">
            <div style="border-bottom: 1px solid #000; height: 16px; margin-bottom: 2px;"></div>
            <div style="font-weight: 900; font-size: 8px; text-transform: uppercase;">CUSTOMER SIGNATURE</div>
            <div style="font-size: 7.5px; color: #475569;">Received Media &amp; Accepted Terms</div>
          </div>
        </div>
      </div>
    `;

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Recovery Intake ${c.recoveryIdNumber || c.caseNumber}</title>
        <style>
          @page { size: ${printFormat.toLowerCase()}; margin: 8mm; }
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 9px; }
          .sheet-wrapper { height: 275mm; max-height: 275mm; overflow: hidden; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; padding: 4mm; }
          .sheet-wrapper:last-child { page-break-after: avoid !important; }
          .sheet-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; pb: 8px; }
          .section-title { font-weight: 900; font-size: 8.5px; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; margin-top: 10px; margin-bottom: 4px; border-left: 3px solid #0f766e; }
          .data-table { width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 6px; }
          .data-table td { border: 1px solid #cbd5e1; padding: 4px 6px; width: 50%; }
          .nda-box { border: 1px solid #0f766e; background: #f0fdf4; padding: 6px; border-radius: 4px; font-size: 8px; margin-top: 6px; }
          .terms-box { border: 1px solid #94a3b8; background: #f8fafc; padding: 6px; border-radius: 4px; font-size: 8px; margin-top: 6px; }
          .footer-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; pt: 10px; border-top: 1px solid #cbd5e1; }
        </style>
      </head>
      <body>
    `;

    if (copyChoice === 'both') {
      htmlContent += renderSheet('CUSTOMER COPY') + renderSheet('OFFICE LAB COPY');
    } else if (copyChoice === 'customer') {
      htmlContent += renderSheet('CUSTOMER COPY');
    } else {
      htmlContent += renderSheet('OFFICE LAB COPY');
    }

    htmlContent += `</body></html>`;

    frameDoc.open();
    frameDoc.write(htmlContent);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => document.body.removeChild(printFrame), 1000);
    }, 500);
  };

  // Print Data Recovery Tax Invoice
  const executeBillPrintDocument = (c: DataRecoveryCase, copyChoice: 'both' | 'customer' | 'office') => {
    const subtotal = c.customerCharge || c.recoveryFee || 0;
    const freight = c.freight || 0;
    const discount = c.discount || 0;
    const gstRate = c.gstRate || 18;
    const netSubtotal = Math.max(0, subtotal + freight - discount);
    const gstAmount = (netSubtotal * gstRate) / 100;
    const grandTotal = Math.round(netSubtotal + gstAmount);
    const advancePaid = c.advance || c.deposit || c.paidAmount || 0;
    const balanceDue = Math.max(0, grandTotal - advancePaid);

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    const merchantUpi = (companyDetails.merchantUpiId || 'support.time24x7-3@okhdfcbank').trim();
    const upiPayUri = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(companyDetails.companyLegalName || 'Accno Solution')}&am=${balanceDue}&cu=INR&tn=${encodeURIComponent(`Case ${c.recoveryIdNumber || c.caseNumber}`)}`;

    const renderBillSheet = (copyLabel: string) => `
      <div class="sheet-wrapper">
        <div class="sheet-header">
          <div class="brand">
            <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #000;">${companyDetails.companyLegalName || 'ACCNO SOLUTION'}</div>
            <div style="font-size: 8px; font-weight: 700; color: #475569; text-transform: uppercase;">Class-100 Forensic Data Recovery Lab &amp; Cleanroom Services</div>
            <div style="font-size: 7.5px; color: #334155; margin-top: 3px;">
              ${companyDetails.addressLine1 || 'Plot 42, Sanchore Industrial Area'}<br/>
              ${companyDetails.addressLine2 || 'Near Bus Stand, Sanchore 343041'}<br/>
              Phone: ${companyDetails.phoneNumber || '+91 98765 43210'} | GSTIN: ${companyDetails.gstin || '08ABCDE1234F1Z5'}
            </div>
          </div>
          <div class="case-badge" style="text-align: right;">
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; font-family: monospace;">INV-${c.recoveryIdNumber || c.caseNumber}</div>
            <div style="font-size: 7.5px; font-weight: 800; color: #0f766e; text-transform: uppercase; margin-top: 2px;">DATA RECOVERY TAX INVOICE</div>
            <div style="font-size: 7px; color: #64748b; margin-top: 2px;">Date: ${c.entryDate}</div>
            <div style="font-size: 6.5px; font-weight: 800; background: #0f766e; color: #fff; padding: 2px 5px; border-radius: 3px; margin-top: 4px; display: inline-block; text-transform: uppercase;">${copyLabel}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px; margin-top: 8px; background: #f8fafc;">
          <div>
            <div style="font-size: 7px; font-weight: 800; color: #64748b; text-transform: uppercase;">BILLED TO CUSTOMER:</div>
            <div style="font-size: 10px; font-weight: 900; color: #0f172a;">${c.customerName}</div>
            <div style="font-size: 8px; color: #334155;">Phone: ${c.customerPhone} ${c.customerGst ? `| GSTIN: ${c.customerGst}` : ''}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 7px; font-weight: 800; color: #64748b; text-transform: uppercase;">MEDIA DETAILS:</div>
            <div style="font-size: 9px; font-weight: 800;">${c.deviceBrand || ''} ${c.driveModel}</div>
            <div style="font-size: 7.5px; color: #475569; font-family: monospace;">SN: ${c.driveSerial} (${c.capacity})</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; margin-top: 10px;">
          <thead>
            <tr style="background: #0f172a; color: #fff;">
              <th style="padding: 5px; text-align: left;">DESCRIPTION / SERVICE PARTICULARS</th>
              <th style="padding: 5px; text-align: center;">HSN/SAC</th>
              <th style="padding: 5px; text-align: right;">AMOUNT (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid #cbd5e1;">
                <strong>Forensic Data Recovery Service Fee</strong><br/>
                <span style="font-size: 7.5px; color: #475569;">${c.damageType || 'Cleanroom Head Swap & Sector Clone'} - Target: ${c.targetDriveDetails || 'External Drive'}</span>
              </td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace;">998315</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${subtotal.toLocaleString()}</td>
            </tr>
            ${freight > 0 ? `
            <tr>
              <td style="padding: 6px; border: 1px solid #cbd5e1;">Freight / Shipping Charges</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace;">996812</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: right;">₹${freight.toLocaleString()}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 10px; align-items: flex-start;">
          <div style="width: 55%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px; background: #fafafa;">
            <div style="font-size: 7.5px; font-weight: 900; color: #0f766e; text-transform: uppercase; margin-bottom: 3px;">SCAN TO PAY VIA BHIM UPI</div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <div style="width: 55px; height: 55px; background: #fff; border: 1px solid #cbd5e1; padding: 2px; text-align: center;">
                <img src="${getSyncQrDataUri(upiPayUri, 1)}" style="width: 100%; height: 100%; object-fit: contain;" alt="UPI QR" />
              </div>
              <div style="font-size: 7px; color: #334155;">
                <strong>UPI ID:</strong> ${merchantUpi}<br/>
                Scan with Google Pay, PhonePe, Paytm, BHIM.<br/>
                <span style="color: #059669; font-weight: bold;">Net Due: ₹${balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <table style="width: 42%; border-collapse: collapse; font-size: 8.5px;">
            <tr><td style="padding: 3px; border-bottom: 1px solid #e2e8f0;">Subtotal:</td><td style="padding: 3px; text-align: right; font-weight: bold;">₹${(subtotal + freight).toLocaleString()}</td></tr>
            ${discount > 0 ? `<tr><td style="padding: 3px; border-bottom: 1px solid #e2e8f0; color: #dc2626;">Discount:</td><td style="padding: 3px; text-align: right; color: #dc2626;">-₹${discount.toLocaleString()}</td></tr>` : ''}
            <tr><td style="padding: 3px; border-bottom: 1px solid #e2e8f0;">GST (${gstRate}%):</td><td style="padding: 3px; text-align: right;">₹${gstAmount.toLocaleString()}</td></tr>
            <tr style="background: #f1f5f9; font-weight: 900;"><td style="padding: 4px;">Grand Total:</td><td style="padding: 4px; text-align: right; font-size: 10px; color: #0f172a;">₹${grandTotal.toLocaleString()}</td></tr>
            <tr><td style="padding: 3px; border-bottom: 1px solid #e2e8f0; color: #059669;">Advance Paid:</td><td style="padding: 3px; text-align: right; color: #059669; font-weight: bold;">₹${advancePaid.toLocaleString()}</td></tr>
            <tr style="background: #0f172a; color: #fff; font-weight: 900;"><td style="padding: 5px;">NET BALANCE DUE:</td><td style="padding: 5px; text-align: right; font-size: 11px; color: #2dd4bf;">₹${balanceDue.toLocaleString()}</td></tr>
          </table>
        </div>

        <div class="footer-row" style="margin-top: auto; border-top: 1px solid #cbd5e1; pt: 8px;">
          <div>
            <div style="font-weight: bold; font-size: 8px;">${repairBillingRules?.printFooterLegalNotice || 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.'}</div>
            <div style="font-size: 7.5px; color: #64748b;">${repairBillingRules?.printFooterDocTypeLabel || 'Computer Generated Official Repair Receipt.'}</div>
          </div>
          <div style="text-align: right; width: 160px;">
            <div style="border-bottom: 1px solid #000; height: 16px; margin-bottom: 2px;"></div>
            <div style="font-weight: 900; font-size: 8px; text-transform: uppercase;">AUTHORIZED SIGNATORY</div>
          </div>
        </div>
      </div>
    `;

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Recovery Invoice ${c.recoveryIdNumber || c.caseNumber}</title>
        <style>
          @page { size: ${printFormat.toLowerCase()}; margin: 8mm; }
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 9px; }
          .sheet-wrapper { height: 275mm; max-height: 275mm; overflow: hidden; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; padding: 4mm; }
          .sheet-wrapper:last-child { page-break-after: avoid !important; }
          .sheet-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; pb: 8px; }
          .footer-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; pt: 10px; border-top: 1px solid #cbd5e1; }
        </style>
      </head>
      <body>
    `;

    if (copyChoice === 'both') {
      htmlContent += renderBillSheet('CUSTOMER COPY') + renderBillSheet('OFFICE ARCHIVE COPY');
    } else if (copyChoice === 'customer') {
      htmlContent += renderBillSheet('CUSTOMER COPY');
    } else {
      htmlContent += renderBillSheet('OFFICE ARCHIVE COPY');
    }

    htmlContent += `</body></html>`;

    frameDoc.open();
    frameDoc.write(htmlContent);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => document.body.removeChild(printFrame), 1000);
    }, 500);
  };

  return (
    <div className="space-y-6 w-full text-slate-100">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl bg-slate-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase flex flex-wrap items-center gap-2">
            <HardDrive className="w-6 h-6 text-[#5ED29C]" />
            <span>FORENSIC DATA RECOVERY LAB</span>
            <span className="text-[#5ED29C]">.</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/30 uppercase tracking-wider">
              REC-1001 ENGINE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Class-100 cleanroom cases, NAND flash extraction, forensic intake sheets, and GST tax billing.
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
            onClick={openNewCaseModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> REGISTER NEW FORENSIC RECOVERY CASE
          </button>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Recovery Cases</p>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{totalCases}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active In Cleanroom Lab</p>
            <h3 className="text-2xl font-black text-[#5ED29C] font-mono mt-1">{activeCases}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified &amp; Ready</p>
            <h3 className="text-2xl font-black text-amber-400 font-mono mt-1">{verifiedCases}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Recovery Value</p>
            <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID (REC-1001), Customer, Serial, Phone, Model..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#5ED29C]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['ALL', 'Intake Registered', 'Imaging in Cleanroom', 'Data Verification', 'Ready for Delivery', 'Completed / Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-md shadow-[#5ED29C]/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* DATA RECOVERY CASE TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-slate-900/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Case # / Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Storage Device &amp; Brand</th>
                <th className="p-4">Damage / Priority</th>
                <th className="p-4">Technician / Storage Location</th>
                <th className="p-4">Phase / Progress %</th>
                <th className="p-4 text-right">Estimate &amp; Due</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCases.length > 0 ? (
                filteredCases.map((item: any) => {
                  const recNo = item.recoveryIdNumber || item.caseNumber;
                  const grandTotal = item.totalInvoice || item.recoveryFee || 0;
                  const balDue = item.balanceDue ?? Math.max(0, grandTotal - (item.advance || item.deposit || item.paidAmount || 0));

                  return (
                    <tr
                      key={item.id}
                      onClick={() => openQuickViewModal(item)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-mono">
                        <div className="font-extrabold text-[#5ED29C] text-sm group-hover:underline">{recNo}</div>
                        <div className="text-[10px] text-slate-400">{item.entryDate}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white text-xs">{item.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.customerPhone}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-200 text-xs">
                          {item.deviceBrand ? `${item.deviceBrand} ` : ''}{item.driveModel}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          SN: {item.driveSerial} ({item.capacity})
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                          {item.damageType || (item as any).mediaCondition || 'Physical / Head Swap'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-bold">Priority: {item.priority || 'NORMAL'}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-xs text-slate-300 font-bold">{item.technician || 'Deepak Kumar'}</div>
                        <div className="text-[10px] text-[#5ED29C] font-mono">{item.storageLocation || item.rackLocation}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-[10px] font-bold text-slate-300 mb-1">{item.recoveryPhaseStatus || 'Phase 1: Diagnostic'}</div>
                        <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] h-full transition-all"
                            style={{ width: `${item.progressPercentage || 50}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 font-mono">{item.progressPercentage || 50}% Extracted</div>
                      </td>

                      <td className="p-4 text-right font-mono">
                        <div className="font-extrabold text-white text-xs">₹{grandTotal.toLocaleString()}</div>
                        <div className="text-[10px] text-rose-400 font-bold">Due: ₹{balDue.toLocaleString()}</div>
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditCaseModal(item)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10"
                            title="Edit Recovery Case"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerPrintChoice('intake', item)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#5ED29C] border border-white/10"
                            title="Print Forensic Intake Sheet"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerPrintChoice('bill', item)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#16FFC6] border border-white/10"
                            title="Print Tax Invoice Bill"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete Forensic Recovery Case ${recNo}?`)) {
                                deleteDataRecoveryCase(item.id);
                                deleteDataRecoveryFromSupabase(item.id).catch(() => {});
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20"
                            title="Delete Case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#5ED29C]" />
                    <p className="font-bold text-sm text-slate-300">No Forensic Data Recovery Cases Found</p>
                    <p className="text-xs text-slate-500 mt-1">Register a new case using the button above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 21. QUICK VIEW / STATUS UPDATE POP-UP MODAL (Clicking on Case Card/Row)   */}
      {/* ========================================================================= */}
      {showQuickViewModal && quickViewCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl bg-slate-900 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5ED29C]/20 border border-[#5ED29C]/40 flex items-center justify-center text-[#5ED29C]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                    FORENSIC RECOVERY CASE <span className="text-[#5ED29C] font-mono">{quickViewCase.recoveryIdNumber || quickViewCase.caseNumber}</span>
                  </h2>
                  <p className="text-xs text-slate-400">Entry Date: {quickViewCase.entryDate} | Technician: {quickViewCase.technician}</p>
                </div>
              </div>
              <button onClick={() => setShowQuickViewModal(false)} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Customer & Submitted Product Details */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Customer Details
                  </span>
                  <div className="text-sm font-extrabold text-white">{quickViewCase.customerName}</div>
                  <div className="text-xs text-slate-300 font-mono">Mobile: {quickViewCase.customerPhone}</div>
                  {quickViewCase.customerEmail && <div className="text-xs text-slate-400">Email: {quickViewCase.customerEmail}</div>}
                  {quickViewCase.customerGst && <div className="text-xs text-slate-400 font-mono">GSTIN: {quickViewCase.customerGst}</div>}
                  {quickViewCase.customerAddress && <div className="text-xs text-slate-400">Address: {quickViewCase.customerAddress}</div>}
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Submitted Product Details
                  </span>
                  <div className="text-sm font-extrabold text-slate-200">
                    {quickViewCase.deviceBrand} {quickViewCase.driveModel}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Serial Number: <span className="text-white font-bold">{quickViewCase.driveSerial}</span></div>
                  <div className="text-xs text-slate-400">Device Type: {quickViewCase.deviceType} ({quickViewCase.capacity} - {quickViewCase.fileSystem})</div>
                  <div className="text-xs text-amber-400 font-bold">Damage Type: {quickViewCase.damageType || (quickViewCase as any).mediaCondition}</div>
                  <div className="text-xs text-[#5ED29C] font-mono">Storage Vault Location: {quickViewCase.storageLocation || quickViewCase.rackLocation}</div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Requested Work &amp; Additional Specs
                  </span>
                  <div className="text-xs text-slate-300"><strong>Requested Work:</strong> {quickViewCase.requestedWork || 'All Files & Folders'}</div>
                  <div className="text-xs text-slate-400"><strong>Additional Info:</strong> {quickViewCase.additionalInfo || 'N/A'}</div>
                  <div className="text-xs text-slate-400"><strong>Target Media:</strong> {quickViewCase.targetDriveDetails || 'Customer Provided External Drive'}</div>
                </div>
              </div>

              {/* Right Column: Quick Status Update & Progress Controls */}
              <div className="space-y-4">
                
                {/* QUICK UPDATE STATUS DROPDOWN */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-[#5ED29C]/30 space-y-3">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1.5 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#5ED29C]" /> Set Quick Update Status
                  </span>
                  <select
                    value={quickViewCase.status}
                    onChange={(e) => handleQuickStatusUpdate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-[#5ED29C]/50 text-white font-extrabold text-xs focus:outline-none"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* RECOVERY PHASE STATUS */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recovery Phase Status</label>
                  <select
                    value={quickViewCase.recoveryPhaseStatus || 'Phase 1: Lab Diagnostic'}
                    onChange={(e) => handleQuickPhaseUpdate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none"
                  >
                    <option value="Phase 1: Lab Diagnostic">Phase 1: Lab Diagnostic &amp; Surface Scan</option>
                    <option value="Phase 2: Firmware / Head Swap">Phase 2: Cleanroom Head Swap &amp; Service Area</option>
                    <option value="Phase 3: Bit-Stream Mirroring">Phase 3: Sector-by-Sector Bit-Stream Imaging</option>
                    <option value="Phase 4: Extraction & Verification">Phase 4: File Structure Extraction &amp; Verification</option>
                  </select>
                </div>

                {/* SCAN / EXTRACTION PROGRESS SLIDER */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Scan / Extraction Progress (%)</span>
                    <span className="font-mono text-[#5ED29C] text-sm">{quickViewCase.progressPercentage || 50}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quickViewCase.progressPercentage || 50}
                    onChange={(e) => handleQuickProgressUpdate(Number(e.target.value))}
                    className="w-full accent-[#5ED29C] cursor-pointer"
                  />
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] h-full transition-all"
                      style={{ width: `${quickViewCase.progressPercentage || 50}%` }}
                    />
                  </div>
                </div>

                {/* CONFIDENTIAL INTERNAL NOTES */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidential Internal Notes</label>
                  <textarea
                    rows={3}
                    value={quickViewCase.confidentialNotes || quickViewCase.notes || ''}
                    onChange={(e) => handleQuickNotesUpdate(e.target.value)}
                    placeholder="Internal lab technician remarks (not printed on customer receipt)..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                {/* FINANCIAL & PRINT ACTION BUTTONS */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Estimate / Grand Total</span>
                    <span className="font-mono font-extrabold text-white text-sm">₹{(quickViewCase.totalInvoice || quickViewCase.estimateCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowQuickViewModal(false);
                        triggerPrintChoice('intake', quickViewCase);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#5ED29C] font-bold text-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" /> Intake Sheet
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickViewModal(false);
                        triggerPrintChoice('bill', quickViewCase);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Tax Invoice
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1-20. REGISTER / EDIT NEW FORENSIC RECOVERY CASE MODAL                      */}
      {/* ========================================================================= */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 w-full max-w-5xl max-h-[95vh] overflow-y-auto space-y-6 shadow-2xl bg-slate-900 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#5ED29C]" />
                {editingCase ? `MODIFY FORENSIC RECOVERY CASE (${editingCase.recoveryIdNumber})` : 'REGISTER NEW FORENSIC RECOVERY CASE'}
              </h2>
              <button onClick={() => setShowCaseModal(false)} className="p-1 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              
              {/* SECTION 1: RECOVERY CASE INFORMATION */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-[#5ED29C]/20 pb-1 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#5ED29C]" /> Section 1: Recovery Case Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Recovery ID # *
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryIdNumber}
                      onChange={(e) => setFormData({ ...formData, recoveryIdNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-[#5ED29C] font-mono font-extrabold text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Case Date *
                    </label>
                    <input
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CUSTOMER SEARCH & CASE IDENTIFICATION */}
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-[#5ED29C]/20 pb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5ED29C]" /> Section 2: Customer Search &amp; Case Identification
                </span>

                {/* CRM Customer Search Bar */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    CRM Customer Search Bar (Instant Auto-fill &amp; Lookup) *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={customerSearchText}
                      onChange={(e) => {
                        setCustomerSearchText(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Type customer name, phone, or email to auto-fill..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-medium text-xs focus:border-[#5ED29C] focus:outline-none"
                    />
                  </div>

                  {showCustomerDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-800">
                      {filteredCrmCustomers.length > 0 ? (
                        filteredCrmCustomers.map((cust: any) => (
                          <div
                            key={cust.id}
                            onClick={() => selectCrmCustomer(cust)}
                            className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-white text-xs">{cust.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{cust.mobile || (cust as any).phone} | {cust.email || 'No Email'}</div>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-[#5ED29C]/10 text-[#5ED29C] font-bold border border-[#5ED29C]/20">SELECT</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-slate-400 text-xs">No matching CRM customer found. Fill out details manually below.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Customer Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Mobile Number *</label>
                    <input
                      type="text"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Customer GSTIN</label>
                    <input
                      type="text"
                      value={formData.customerGst}
                      onChange={(e) => setFormData({ ...formData, customerGst: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MEDIA SPECIFICATIONS, DIAGNOSTICS & LOCATION */}
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-[#5ED29C]/20 pb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#5ED29C]" /> Section 3: Media Specifications, Diagnostics &amp; Location
                </span>

                {/* Row 1 (Hardware Specs): 1. Device Brand | 2. Media Type | 3. Drive Model | 4. Serial Number (SN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* 1. Device Brand */}
                  <DynamicOptionSelect
                    label="1. Device Brand"
                    value={formData.deviceBrand}
                    onChange={(val) => setFormData({ ...formData, deviceBrand: val })}
                    options={deviceBrandOptions}
                    onAddOption={(opt) => saveDeviceBrandOptions([...deviceBrandOptions, opt])}
                    onRemoveOption={(opt) => saveDeviceBrandOptions(deviceBrandOptions.filter((o) => o !== opt))}
                  />

                  {/* 2. Media Type */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">2. Media Type *</label>
                    <select
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none"
                    >
                      <option value='Mechanical HDD (3.5"/2.5")'>Mechanical HDD (3.5"/2.5")</option>
                      <option value="NVMe / M.2 PCIe SSD">NVMe / M.2 PCIe SSD</option>
                      <option value="SATA 2.5 SSD">SATA 2.5 SSD</option>
                      <option value="RAID 0/1/5/10 Server Array">RAID Server Array</option>
                      <option value="USB Pen Drive / Monolith Flash">USB Flash Pen Drive</option>
                      <option value="SD / MicroSD Card">SD / MicroSD Card</option>
                    </select>
                  </div>

                  {/* 3. Drive Model */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">3. Drive Model *</label>
                    <input
                      type="text"
                      value={formData.driveModel}
                      onChange={(e) => setFormData({ ...formData, driveModel: e.target.value })}
                      placeholder="e.g. ST2000DM008"
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  {/* 4. Serial Number (SN) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">4. Serial Number (SN) *</label>
                    <input
                      type="text"
                      value={formData.driveSerial}
                      onChange={(e) => setFormData({ ...formData, driveSerial: e.target.value })}
                      placeholder="e.g. Z5K189LM"
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-[#5ED29C] font-mono font-bold text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: 5. Capacity | 6. File System | 7. Damage Type | 8. Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* 5. Capacity */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">5. Capacity</label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                    />
                  </div>

                  {/* 6. File System */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">6. File System</label>
                    <input
                      type="text"
                      value={formData.fileSystem}
                      onChange={(e) => setFormData({ ...formData, fileSystem: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                    />
                  </div>

                  {/* 7. Damage Type */}
                  <DynamicOptionSelect
                    label="7. Damage Type"
                    value={formData.damageType}
                    onChange={(val) => setFormData({ ...formData, damageType: val })}
                    options={damageTypeOptions}
                    onAddOption={(opt) => saveDamageTypeOptions([...damageTypeOptions, opt])}
                    onRemoveOption={(opt) => saveDamageTypeOptions(damageTypeOptions.filter((o) => o !== opt))}
                  />

                  {/* 8. Priority */}
                  <DynamicOptionSelect
                    label="8. Priority"
                    value={formData.priority}
                    onChange={(val) => setFormData({ ...formData, priority: val })}
                    options={priorityOptions}
                    onAddOption={(opt) => savePriorityOptions([...priorityOptions, opt])}
                    onRemoveOption={(opt) => savePriorityOptions(priorityOptions.filter((o) => o !== opt))}
                  />
                </div>

                {/* Row 3: 9. Failure Symptoms | 10. Status | 11. Technician Assigned | 12. Device Vault Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* 9. Failure Symptoms */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">9. Failure Symptoms</label>
                    <input
                      type="text"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      placeholder="e.g. Clicking noise, drive unreadable, I/O error..."
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                    />
                  </div>

                  {/* 10. Status */}
                  <DynamicOptionSelect
                    label="10. Status"
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={statusOptions}
                    onAddOption={(opt) => saveStatusOptions([...statusOptions, opt])}
                    onRemoveOption={(opt) => saveStatusOptions(statusOptions.filter((o) => o !== opt))}
                  />

                  {/* 11. Technician Assigned */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      11. Technician Assigned *
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={formData.technician}
                        onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-medium text-xs focus:border-[#5ED29C] focus:outline-none appearance-none pr-8"
                      >
                        {technicianOptionsList.map((techName) => (
                          <option key={techName} value={techName} className="bg-slate-900 text-white">
                            {techName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 12. Device Vault Location */}
                  <DynamicOptionSelect
                    label="12. Device Vault Location"
                    value={formData.storageLocation}
                    onChange={(val) => setFormData({ ...formData, storageLocation: val })}
                    options={storageLocationOptions}
                    onAddOption={(opt) => saveStorageLocationOptions([...storageLocationOptions, opt])}
                    onRemoveOption={(opt) => saveStorageLocationOptions(storageLocationOptions.filter((o) => o !== opt))}
                  />
                </div>

                {/* Row 4 (Scope & Accessories): 13. Requested Work / Folders | 14. Additional Drive / Cable Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">13. Requested Work / Folders</label>
                    <input
                      type="text"
                      value={formData.requestedWork}
                      onChange={(e) => setFormData({ ...formData, requestedWork: e.target.value })}
                      placeholder="e.g. D:\Photos & Tally ERP Data Backup..."
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">14. Additional Drive / Cable Info</label>
                    <input
                      type="text"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="e.g. USB enclosure cable, original power adapter..."
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: OUTSOURCE 3RD-PARTY LAB DISPATCH */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOutsourced}
                      onChange={(e) => setFormData({ ...formData, isOutsourced: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#5ED29C]"
                    />
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-purple-400" /> Section 4: Enable Outsource 3rd-Party Lab Dispatch
                    </span>
                  </label>
                </div>

                {formData.isOutsourced && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 pt-1">
                    <DynamicOptionSelect
                      label="Outsource Destination"
                      value={formData.outsourceDestination}
                      onChange={(val) => setFormData({ ...formData, outsourceDestination: val })}
                      options={outsourceDestinationOptions}
                      onAddOption={(opt) => saveOutsourceDestinationOptions([...outsourceDestinationOptions, opt])}
                      onRemoveOption={(opt) => saveOutsourceDestinationOptions(outsourceDestinationOptions.filter((o) => o !== opt))}
                    />

                    <DynamicOptionSelect
                      label="Outsource Status"
                      value={formData.outsourceStatus}
                      onChange={(val) => setFormData({ ...formData, outsourceStatus: val })}
                      options={outsourceStatusOptions}
                      onAddOption={(opt) => saveOutsourceStatusOptions([...outsourceStatusOptions, opt])}
                      onRemoveOption={(opt) => saveOutsourceStatusOptions(outsourceStatusOptions.filter((o) => o !== opt))}
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dispatch Date</label>
                      <input
                        type="date"
                        value={formData.outsourceDispatchDate}
                        onChange={(e) => setFormData({ ...formData, outsourceDispatchDate: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Return Date</label>
                      <input
                        type="date"
                        value={formData.outsourceReturnDate}
                        onChange={(e) => setFormData({ ...formData, outsourceReturnDate: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outsource Amount (₹)</label>
                      <input
                        type="number"
                        value={formData.outsourceAmount}
                        onChange={(e) => setFormData({ ...formData, outsourceAmount: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outsource Freight (₹)</label>
                      <input
                        type="number"
                        value={formData.outsourceFreight}
                        onChange={(e) => setFormData({ ...formData, outsourceFreight: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 5: FINANCIAL LEDGER, ADVANCE & OUTSTANDING BALANCE */}
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-[#5ED29C]/20 pb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#5ED29C]" /> Section 5: Financial Ledger, Advance &amp; Outstanding Balance
                </span>

                {/* Row 1: 1. Estimate Cost | 2. Customer Charge | 3. Freight | 4. Discount */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* 1. Estimate Cost */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">1. Estimate Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.estimateCost}
                      onChange={(e) => setFormData({ ...formData, estimateCost: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono font-bold text-xs"
                    />
                  </div>

                  {/* 2. Customer Charge */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">2. Customer Charge (₹)</label>
                    <input
                      type="number"
                      value={formData.customerCharge}
                      onChange={(e) => setFormData({ ...formData, customerCharge: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-[#5ED29C] font-mono font-bold text-xs"
                    />
                  </div>

                  {/* 3. Freight */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">3. Freight (₹)</label>
                    <input
                      type="number"
                      value={formData.freight}
                      onChange={(e) => setFormData({ ...formData, freight: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-xs"
                    />
                  </div>

                  {/* 4. Discount */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">4. Discount (₹)</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-rose-400 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Row 2: 5. GST Tax Rate | 6. Deposit/Advance | 7. Total & 8. Balance Due */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 5. GST Tax Rate */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">5. GST Tax Rate</label>
                    <select
                      value={formData.gstRate}
                      onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-bold"
                    >
                      <option value={18}>18% GST (Standard)</option>
                      <option value={12}>12% GST</option>
                      <option value={5}>5% GST</option>
                      <option value={0}>0% Tax Exempt</option>
                    </select>
                  </div>

                  {/* 6. Deposit/Advance */}
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">6. Deposit/Advance (₹)</label>
                    <input
                      type="number"
                      value={formData.advance}
                      onChange={(e) => setFormData({ ...formData, advance: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono font-extrabold text-xs"
                    />
                  </div>

                  {/* 7. Total & 8. Balance Due */}
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-[#5ED29C]/40 text-right font-mono flex flex-col justify-center">
                    <div className="text-[9px] text-slate-400 font-bold">7. Total: ₹{calcTotalInvoice.toLocaleString()}</div>
                    <div className="text-xs font-extrabold text-rose-400">8. Due: ₹{calcBalanceDue.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* SECTION 6 & 7: TERMS & CONFIDENTIAL INTERNAL NOTES */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[11px] font-black uppercase text-[#5ED29C] tracking-wider block border-b border-slate-800 pb-1.5">
                    Section 6: Terms &amp; Recovery Consent
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-start gap-1.5"><span className="font-bold text-[#5ED29C]">1.</span> Data recovery success depends on the extent of damage.</div>
                    <div className="flex items-start gap-1.5"><span className="font-bold text-[#5ED29C]">2.</span> Clean room recovery may be required for physical damage.</div>
                    <div className="flex items-start gap-1.5"><span className="font-bold text-[#5ED29C]">3.</span> Customer will be notified of recovery progress via WhatsApp/SMS.</div>
                    <div className="flex items-start gap-1.5"><span className="font-bold text-[#5ED29C]">4.</span> Estimated cost may vary based on assessment results.</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termsConsentAccepted}
                        onChange={(e) => setFormData({ ...formData, termsConsentAccepted: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#5ED29C] focus:ring-[#5ED29C]"
                      />
                      <span className="text-xs font-black text-white">
                        Customer Consent Confirmed: I acknowledge the terms and privacy notice.
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Section 7: Confidential Internal Notes (Hidden from Customer Receipt)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.confidentialNotes}
                    onChange={(e) => setFormData({ ...formData, confidentialNotes: e.target.value })}
                    placeholder="Internal notes, platter condition, head slider SN, RAM dump status..."
                    className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold uppercase text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#5ED29C]/30 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  {editingCase ? 'UPDATE FORENSIC RECOVERY CASE' : 'REGISTER FORENSIC RECOVERY CASE'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 22. PRINT COPY CHOICE & PREVIEW MODAL                                     */}
      {/* ========================================================================= */}
      {showPrintCopyChoiceModal && pendingPrintCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 w-full max-w-md space-y-5 bg-slate-900 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#16FFC6]" />
                {pendingPrintType === 'intake' ? 'PRINT FORENSIC INTAKE SHEET' : 'PRINT TAX INVOICE BILL'}
              </h3>
              <button onClick={() => setShowPrintCopyChoiceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Paper Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrintFormat('A4')}
                    className={`py-2 rounded-xl text-xs font-bold border ${printFormat === 'A4' ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                  >
                    A4 Standard Sheet
                  </button>
                  <button
                    onClick={() => setPrintFormat('A5')}
                    className={`py-2 rounded-xl text-xs font-bold border ${printFormat === 'A5' ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                  >
                    A5 Compact Sheet
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Choose Print Copy</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExecutePrint('both')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-between"
                  >
                    <span>BOTH COPIES (CUSTOMER + OFFICE LAB)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExecutePrint('customer')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>CUSTOMER COPY ONLY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExecutePrint('office')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>OFFICE LAB COPY ONLY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
