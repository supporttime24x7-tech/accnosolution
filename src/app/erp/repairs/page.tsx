'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Wrench, Search, Plus, Filter, QrCode, Barcode, Printer, User,
  Smartphone, CheckCircle2, Clock, ChevronDown, Edit, Shield, Eye, X,
  Grid, MapPin, KeyRound, Lock, DollarSign, FileText, Check, AlertCircle, Receipt, Trash2,
  Camera, Upload, Image as ImageIcon, Sparkles, Tag, Sliders, Calendar, ArrowRight, Phone, Mail, Building,
  MinusCircle, PlusCircle, LayoutGrid, List, Layers, Package
} from 'lucide-react';
import { useErpStore, RepairTicket, RepairInvoice, LineItemBilling, CustomerItem, InventoryItem, RepairBillingRulesConfig, HardwareRepairCatalogItem, RepairProcessStepItem } from '@/lib/store';
import { AccnoLogo } from '@/components/common/AccnoLogo';
import QRCode from 'qrcode';

// Interactive 3x3 Smartphone Pattern Lock Picker Component
const PatternLockPicker: React.FC<{
  sequence: number[];
  onChange: (newSeq: number[]) => void;
  readOnly?: boolean;
}> = ({ sequence, onChange, readOnly = false }) => {
  const handleCircleClick = (index: number) => {
    if (readOnly) return;
    if (sequence.includes(index)) {
      onChange(sequence.filter((i) => i !== index));
    } else {
      onChange([...sequence, index]);
    }
  };

  const getLineCoordinates = () => {
    const coords: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < sequence.length - 1; i++) {
      const from = sequence[i];
      const to = sequence[i + 1];
      const x1 = (from % 3) * 50 + 25;
      const y1 = Math.floor(from / 3) * 50 + 25;
      const x2 = (to % 3) * 50 + 25;
      const y2 = Math.floor(to / 3) * 50 + 25;
      coords.push({ x1, y1, x2, y2 });
    }
    return coords;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-[150px] h-[150px] bg-[#070B0A] border border-white/20 rounded-2xl p-2 select-none shadow-inner">
        {/* Lines between connected nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {getLineCoordinates().map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#16FFC6"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#16FFC6]"
            />
          ))}
        </svg>

        {/* 9 Circles Grid */}
        <div className="grid grid-cols-3 gap-2 w-full h-full relative z-20">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((circleIndex) => {
            const isSelected = sequence.includes(circleIndex);
            const orderNumber = sequence.indexOf(circleIndex) + 1;

            return (
              <button
                key={circleIndex}
                type="button"
                onClick={() => handleCircleClick(circleIndex)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#16FFC6] text-[#070B0A] font-extrabold shadow-lg shadow-[#16FFC6]/50 scale-105 border-2 border-white'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white/40'
                }`}
              >
                {isSelected ? (
                  <span className="text-[11px]">{orderNumber}</span>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#16FFC6]">
          {sequence.length > 0 ? `Pattern: ${sequence.map((n) => n + 1).join(' → ')}` : 'Click dots to record pattern'}
        </span>
        {!readOnly && sequence.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[9px] text-rose-400 hover:underline uppercase font-bold"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

// 1D Vector SVG Barcode Generator
const CODE39_PATTERNS: { [key: string]: string } = {
  '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
  '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
  '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
  'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
  'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
  'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
  'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
  'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
  'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
  '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
  '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010',
};

const generateBarcodeSVG = (codeText: string) => {
  const cleanCode = (codeText || 'TKT-1001').toUpperCase().trim();
  const fullCode = `*${cleanCode}*`;
  
  const rects: { x: number; width: number }[] = [];
  let currentX = 0;

  for (let i = 0; i < fullCode.length; i++) {
    const char = fullCode[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS['*'];

    for (let p = 0; p < 9; p++) {
      const isBar = p % 2 === 0;
      const isWide = pattern[p] === '1';
      const width = isWide ? 3 : 1;

      if (isBar) {
        rects.push({ x: currentX, width });
      }
      currentX += width;
    }
    currentX += 1;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg className="w-full h-5" viewBox={`0 0 ${currentX} 22`} preserveAspectRatio="none">
        {rects.map((r, idx) => (
          <rect
            key={idx}
            x={r.x}
            y={0}
            width={r.width}
            height={22}
            fill="#000000"
          />
        ))}
      </svg>
      <span className="text-[8px] font-mono font-extrabold tracking-wider text-black mt-0.5 leading-none">
        {cleanCode}
      </span>
    </div>
  );
};

// Authentic ISO/IEC Standard 2D QR Code SVG Generator Component for UPI Deep-Links
const UpiPaymentQRCode: React.FC<{ upiUri: string; size?: number }> = ({ upiUri, size = 60 }) => {
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  useEffect(() => {
    if (!upiUri) return;
    QRCode.toString(upiUri, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((svg) => {
        setSvgMarkup(svg);
      })
      .catch((err) => {
        console.error('Error generating QR SVG:', err);
      });
  }, [upiUri]);

  if (!svgMarkup) {
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUri)}`;
    return (
      <img
        src={fallbackUrl}
        alt="UPI Payment QR Code"
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      className="flex items-center justify-center shrink-0 [&_svg]:w-full [&_svg]:h-full"
    />
  );
};

const getTicketProgress = (t: Partial<RepairTicket>): number => {
  if (typeof t.progressPercentage === 'number' && !isNaN(t.progressPercentage)) {
    return Math.min(100, Math.max(0, t.progressPercentage));
  }
  switch (t.status) {
    case 'received':
      return 15;
    case 'diagnosing':
      return 30;
    case 'waiting_approval':
      return 45;
    case 'approved':
      return 60;
    case 'in_progress':
      return 78;
    case 'testing':
      return 90;
    case 'ready_for_pickup':
      return 95;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 50;
  }
};

export default function ErpRepairsPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    tickets, repairInvoices, customers, inventory, employees = [], repairBillingRules, companyDetails, outsourceVouchers,
    addTicket, updateTicket, updateTicketStatus, issueRepairInvoice, updateRepairInvoice, deleteRepairInvoice, deleteTicket, updateRepairBillingRules,
    hardwareRepairCatalog = [], addHardwareRepairCatalogItem, updateHardwareRepairCatalogItem, deleteHardwareRepairCatalogItem,
    repairProcessSteps = [], addRepairProcessStep, updateRepairProcessStep, deleteRepairProcessStep,
  } = useErpStore();

  const [activeTab, setActiveTab] = useState<'active_queue' | 'invoices_archive' | 'website_repair_catalog' | 'website_repair_process'>('active_queue');
  
  // Website Hardware Repair Catalog Editor Modal State
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState<HardwareRepairCatalogItem | null>(null);
  const [catCategory, setCatCategory] = useState<'desktop' | 'laptop' | 'mac' | 'phone' | 'printer' | 'datarecovery'>('desktop');
  const [catTitle, setCatTitle] = useState('');
  const [catPrice, setCatPrice] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catWarranty, setCatWarranty] = useState<number>(90);

  // Website Repair Process Step Editor Modal State
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingProcessStep, setEditingProcessStep] = useState<RepairProcessStepItem | null>(null);
  const [stepNumber, setStepNumber] = useState('01');
  const [stepTitle, setStepTitle] = useState('');
  const [stepDesc, setStepDesc] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'box' | 'line'>('box');

  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<RepairInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<RepairInvoice | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<RepairTicket | null>(null);

  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPrintChoiceModal, setShowPrintChoiceModal] = useState(false);
  const [printChoiceInvoice, setPrintChoiceInvoice] = useState<RepairInvoice | null>(null);
  const [printChoicePaper, setPrintChoicePaper] = useState<'A4' | 'A5'>('A4');

  const [showJobSheetModal, setShowJobSheetModal] = useState(false);
  const [jobSheetPrintFormat, setJobSheetPrintFormat] = useState<'A4' | 'A5'>('A4');

  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showCustomerPopUp, setShowCustomerPopUp] = useState<CustomerItem | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Customer Autocomplete Search State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Catalog Search States for Service & Retail Ledgers
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [showServiceCatalogDropdown, setShowServiceCatalogDropdown] = useState(false);

  const [retailSearchQuery, setRetailSearchQuery] = useState('');
  const [showRetailCatalogDropdown, setShowRetailCatalogDropdown] = useState(false);

  // Dynamic Options Registries (Persisted to Zustand Store)
  const [deviceCategoryOptions, setDeviceCategoryOptions] = useState<string[]>(
    repairBillingRules?.deviceCategoryOptions || ['Laptop', 'MacBook Pro / Air', 'Desktop PC', 'Smartphone / Tablet', 'Data Recovery Drive']
  );
  const [priorityOptions, setPriorityOptions] = useState<string[]>(
    repairBillingRules?.priorityOptions || ['normal', 'urgent', 'high', 'low']
  );
  const [osOptions, setOsOptions] = useState<string[]>(
    repairBillingRules?.osOptions || ['Windows 11 Pro 64-bit', 'Windows 10 Pro', 'macOS Sequoia / Sonoma', 'Ubuntu Linux 24.04', 'No OS / Storage Only']
  );
  const [pipelineOptions, setPipelineOptions] = useState<string[]>(
    repairBillingRules?.pipelineOptions || ['RECEIVED', 'DIAGNOSING', 'CHIP_LEVEL_REPAIR', 'OUTSOURCED_LAB', 'TESTING', 'READY_FOR_PICKUP']
  );
  // Effective Technician List strictly containing ONLY employee names from Employee Master
  const effectiveTechOptions = useMemo(() => {
    const employeeList = (employees || [])
      .filter((emp) => emp.activeStatus !== 'Inactive')
      .map((emp) => emp.name)
      .filter(Boolean);

    if (employeeList.length > 0) {
      return Array.from(new Set(employeeList));
    }
    return ['Deepak Kumar', 'Rahul Gupta', 'Priya Sharma'];
  }, [employees]);
  const [deliveryStatusOptions, setDeliveryStatusOptions] = useState<string[]>(
    repairBillingRules?.deliveryStatusOptions || ['IN REPAIR LAB', 'READY FOR PICKUP', 'DELIVERED TO CUSTOMER', 'RETURNED UNREPAIRED', 'DISPATCHED VIA COURIER']
  );
  const [warrantyStatusOptions, setWarrantyStatusOptions] = useState<string[]>(
    repairBillingRules?.warrantyStatusOptions || ['30 Days Parts & Labor Warranty', '90 Days Chip-Level Warranty', 'Out of Warranty Repair', 'Vendor Manufacturer Warranty']
  );

  const [statusFilterOptions, setStatusFilterOptions] = useState<string[]>(
    repairBillingRules?.statusFilterOptions || ['all', 'received', 'diagnosing', 'in_progress', 'chip_level_repair', 'outsourced_lab', 'testing', 'ready_for_pickup', 'delivered', 'cancelled']
  );
  const [priorityFilterOptions, setPriorityFilterOptions] = useState<string[]>(
    repairBillingRules?.priorityFilterOptions || ['all', 'urgent', 'high', 'normal', 'low']
  );

  const [stickerLabelSizeOptions, setStickerLabelSizeOptions] = useState<string[]>(
    repairBillingRules?.stickerLabelSizeOptions || ['70x35', '50x30']
  );
  const [barcodeLayoutOptions, setBarcodeLayoutOptions] = useState<string[]>(
    repairBillingRules?.barcodeLayoutOptions || ['right_h', 'right_v', 'bottom_h']
  );

  const [gstTaxModeOptions, setGstTaxModeOptions] = useState<string[]>(
    repairBillingRules?.gstTaxModeOptions || ['18% GST (9% + 9%)', '12% GST (6% + 6%)', '5% GST (2.5% + 2.5%)', '0% Exempt']
  );
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<string[]>(
    repairBillingRules?.paymentMethodOptions || ['Cash', 'UPI', 'Card', 'Netbanking']
  );
  const [paymentStatusOptions, setPaymentStatusOptions] = useState<string[]>(
    repairBillingRules?.paymentStatusOptions || ['Fully Paid', 'Partial', 'Unpaid']
  );

  // Option Modal for +ADD / REMOVE dropdown & checklist options in Repairs module
  const [optionModal, setOptionModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    title: string;
    currentValue?: string;
    nameInput: string;
    error?: string;
    onConfirmAdd?: (val: string) => void;
    onConfirmRemove?: () => void;
  }>({
    isOpen: false,
    type: 'add',
    title: '',
    nameInput: '',
  });

  const handleConfirmAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const val = optionModal.nameInput.trim();
    if (!val) {
      setOptionModal((prev) => ({ ...prev, error: 'Option value cannot be empty' }));
      return;
    }
    if (optionModal.onConfirmAdd) {
      optionModal.onConfirmAdd(val);
    }
    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmRemoveOption = () => {
    if (optionModal.onConfirmRemove) {
      optionModal.onConfirmRemove();
    }
    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Dynamic Options Input & Persistent Storage Helpers
  const handleAddOption = (
    categoryName: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    ruleKey?: keyof RepairBillingRulesConfig
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      title: `Add New ${categoryName} Option`,
      nameInput: '',
      error: undefined,
      onConfirmAdd: (val: string) => {
        setter((prev) => {
          const isExist = prev.some((x) => x.toLowerCase() === val.toLowerCase());
          const updated = isExist ? prev : [...prev, val];
          if (ruleKey && !isExist) {
            setTimeout(() => {
              updateRepairBillingRules({ [ruleKey]: updated });
            }, 0);
          }
          return updated;
        });
      },
    });
  };

  const handleRemoveOption = (
    valToRemove: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    ruleKey?: keyof RepairBillingRulesConfig
  ) => {
    if (!valToRemove) return;
    setOptionModal({
      isOpen: true,
      type: 'remove',
      title: 'Remove Option',
      currentValue: valToRemove,
      nameInput: '',
      error: undefined,
      onConfirmRemove: () => {
        setter((prev) => {
          if (prev.length <= 1) {
            return prev;
          }
          const updated = prev.filter((item) => item !== valToRemove);
          if (ruleKey) {
            setTimeout(() => {
              updateRepairBillingRules({ [ruleKey]: updated });
            }, 0);
          }
          return updated;
        });
      },
    });
  };

  // Checklist Options Registries & Persistent Storage
  const [hwChecklistItems, setHwChecklistItems] = useState<string[]>(
    repairBillingRules?.hwChecklistItems || [
      'Display / Touch Screen', 'Keyboard & Trackpad', 'Wi-Fi & Bluetooth', 'Camera & Mic', 'Speakers / Audio', 'Charging Port / Battery', 'Power Button / Touch ID'
    ]
  );
  const [conditionChecklistItems, setConditionChecklistItems] = useState<string[]>(
    repairBillingRules?.conditionChecklistItems || [
      'Scratches / Dents', 'Missing Screws', 'Cracked Body', 'Liquid Indicator Pink', 'Prior Repair Marks'
    ]
  );
  const [accessoriesChecklistItems, setAccessoriesChecklistItems] = useState<string[]>(
    repairBillingRules?.accessoriesChecklistItems || [
      'Power Adapter / Charger', 'Laptop Bag', 'Mouse / Dongle', 'Original Box / Bill', 'SIM / Memory Card'
    ]
  );

  const handleAddChecklistItem = (
    title: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    setSelected: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    ruleKey: keyof RepairBillingRulesConfig
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      title: `Add New ${title} Item`,
      nameInput: '',
      error: undefined,
      onConfirmAdd: (val: string) => {
        const updated = Array.from(new Set([...items, val]));
        setItems(updated);
        setSelected((prev) => ({ ...prev, [val]: true }));
        setTimeout(() => {
          updateRepairBillingRules({ [ruleKey]: updated });
        }, 0);
      },
    });
  };

  const handleRemoveChecklistItem = (
    itemToRemove: string,
    title: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    setSelected: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    ruleKey: keyof RepairBillingRulesConfig
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'remove',
      title: `Remove ${title} Item`,
      currentValue: itemToRemove,
      nameInput: '',
      error: undefined,
      onConfirmRemove: () => {
        const updated = items.filter((i) => i !== itemToRemove);
        setItems(updated);
        setSelected((prev) => {
          const copy = { ...prev };
          delete copy[itemToRemove];
          return copy;
        });
        setTimeout(() => {
          updateRepairBillingRules({ [ruleKey]: updated });
        }, 0);
      },
    });
  };



  // Checklist Selected States
  const [selectedHwChecklist, setSelectedHwChecklist] = useState<{ [key: string]: boolean }>({
    'Display / Touch Screen': true, 'Keyboard & Trackpad': true, 'Wi-Fi & Bluetooth': true, 'Camera & Mic': true, 'Speakers / Audio': true, 'Charging Port / Battery': true, 'Power Button / Touch ID': true
  });
  const [selectedConditionChecklist, setSelectedConditionChecklist] = useState<{ [key: string]: boolean }>({
    'Scratches / Dents': false, 'Missing Screws': false, 'Cracked Body': false, 'Liquid Indicator Pink': false, 'Prior Repair Marks': false
  });
  const [selectedAccessoriesChecklist, setSelectedAccessoriesChecklist] = useState<{ [key: string]: boolean }>({
    'Power Adapter / Charger': true, 'Laptop Bag': false, 'Mouse / Dongle': false, 'Original Box / Bill': false, 'SIM / Memory Card': false
  });

  // SEPARATED INTAKE LEDGERS: SERVICE PARTS & RETAIL PARTS
  const [intakeServiceParts, setIntakeServiceParts] = useState<LineItemBilling[]>([]);
  const [intakeRetailParts, setIntakeRetailParts] = useState<LineItemBilling[]>([]);



  // Intake Repair Ticket Form State
  const [newTicket, setNewTicket] = useState({
    manualTicketNo: '',
    entryDate: new Date().toISOString().split('T')[0],
    priority: 'normal',
    customer_name: '',
    customer_phone: '',
    customerAlternatePhone: '',
    customerEmail: '',
    customerGstin: '',
    customerCompanyName: '',
    customerAddress: '',
    customerType: 'RETAIL' as 'RETAIL' | 'CORPORATE',

    device_type: 'Laptop',
    brand: 'Dell',
    model: '',
    serial_or_imei: '',
    deviceColor: 'Space Gray',
    receivedQty: 1,
    passwordLock: '',
    patternLockSequence: [] as number[],
    rackLocation: 'Shelf A-1, Bin 01',
    problem_reported: '',
    physicalCondition: 'Normal wear & tear',
    requestedWork: '',

    osToInstall: 'Windows 11 Pro 64-bit',
    intakePhotos: [] as string[],
    outsourceHistoryDetails: '',
    freightCharges: 0,
    placeOfPurchase: '',
    purchaseInvoiceNo: '',
    purchaseDate: '',
    jobPipelineStatus: 'RECEIVED',
    assignedTechnician: employees && employees[0] ? employees[0].name : 'Deepak Kumar',
    estimated_cost: 4000,
    advance_paid: 0,
    deliveryStatus: 'IN REPAIR LAB',
    warrantyStatus: '30 Days Parts & Labor Warranty',
    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actualDeliveryDate: '',
    deliveredTo: '',
    partsToBeOrdered: '',
    extraInfoArea: '',
    progressPercentage: 50,
  });

  // Photo Upload Handler (Max 3 Images)
  const handleIntakePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 3 - newTicket.intakePhotos.length;
    if (remainingSlots <= 0) return;

    const count = Math.min(files.length, remainingSlots);

    for (let i = 0; i < count; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewTicket((prev) => ({
            ...prev,
            intakePhotos: [...prev.intakePhotos, event.target!.result as string].slice(0, 3),
          }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // Billing Modal State (Matching Image 6)
  const [billingInvoiceNo, setBillingInvoiceNo] = useState('TIN-1004');
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0]);
  const [actualDeliveryDate, setActualDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [billingCustomerName, setBillingCustomerName] = useState('');
  const [billingCustomerPhone, setBillingCustomerPhone] = useState('');
  const [billingCustomerGstin, setBillingCustomerGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingDeliveredTo, setBillingDeliveredTo] = useState('');
  const [billingDeliveryStatus, setBillingDeliveryStatus] = useState('DELIVERED');
  const [billingAfterServiceRemark, setBillingAfterServiceRemark] = useState('');

  const [billingServiceParts, setBillingServiceParts] = useState<LineItemBilling[]>([]);
  const [billingRetailParts, setBillingRetailParts] = useState<LineItemBilling[]>([]);

  const [billingOutsourceCharges, setBillingOutsourceCharges] = useState(0);
  const [billingFreightCharges, setBillingFreightCharges] = useState(0);
  const [billingGstTaxMode, setBillingGstTaxMode] = useState('18% GST (9% + 9%)');
  const [billingDiscountAdjustment, setBillingDiscountAdjustment] = useState(0);
  const [billingPaymentMethod, setBillingPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Netbanking'>('Cash');
  const [billingPaymentStatus, setBillingPaymentStatus] = useState<'Fully Paid' | 'Partial' | 'Unpaid'>('Fully Paid');
  const [billingEnableAutoRoundOff, setBillingEnableAutoRoundOff] = useState(true);

  const [serviceSearchQueryBilling, setServiceSearchQueryBilling] = useState('');
  const [showServiceCatalogBilling, setShowServiceCatalogBilling] = useState(false);
  const [retailSearchQueryBilling, setRetailSearchQueryBilling] = useState('');
  const [showRetailCatalogBilling, setShowRetailCatalogBilling] = useState(false);

  const [billingFormData, setBillingFormData] = useState({
    lineItems: [] as LineItemBilling[],
    outsourceCharges: 0,
    freightCharges: 0,
    discountAmount: 0,
    gstTaxRate: repairBillingRules.repair_bill_default_tax || 18,
    advancePaid: 0,
    paymentMethod: 'UPI' as 'CASH' | 'UPI' | 'CARD' | 'NETBANKING',
    paymentStatus: 'PAID' as 'PAID' | 'PARTIAL' | 'UNPAID',
    warrantyStatement: '30 Days Parts & Labor Warranty',
    deliveredTo: '',
    deliveryStatus: 'DELIVERED',
    afterServiceRemarks: 'Device stress tested. All diagnostics passed.',
  });

  // A4 vs A5 Print State
  const [printFormat, setPrintFormat] = useState<'A4' | 'A5'>('A4');

  // Thermal Sticker Tag Printer State
  const [labelSize, setLabelSize] = useState<'70x35' | '50x30' | '80x50'>('70x35');
  const [barcodeLayout, setBarcodeLayout] = useState<'right_h' | 'right_v' | 'bottom_h'>('right_h');
  const [labelFontSize, setLabelFontSize] = useState<number>(10);
  const [stickerFields, setStickerFields] = useState({
    companyName: true,
    ticketIdBarcode: true,
    intakeDate: true,
    customerName: true,
    mobileNumber: true,
    deviceBrandModel: true,
    serialImei: true,
    reportedProblem: true,
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedLineItems = [...intakeServiceParts, ...intakeRetailParts];
    const totalEst = combinedLineItems.reduce((sum, item) => sum + item.total, 0) || Number(newTicket.estimated_cost);

    addTicket({
      ticket_number: newTicket.manualTicketNo || '',
      entryDate: newTicket.entryDate,
      customer_name: newTicket.customer_name,
      customer_phone: newTicket.customer_phone,
      customerAlternatePhone: newTicket.customerAlternatePhone,
      customerEmail: newTicket.customerEmail,
      customerGstin: newTicket.customerGstin,
      customerAddress: newTicket.customerAddress,
      customerType: newTicket.customerType,

      device_type: newTicket.device_type,
      brand: newTicket.brand,
      model: newTicket.model,
      serial_or_imei: newTicket.serial_or_imei,
      deviceColor: newTicket.deviceColor,
      receivedQty: Number(newTicket.receivedQty),
      passwordLock: newTicket.passwordLock,
      patternLockSequence: newTicket.patternLockSequence,
      rackLocation: newTicket.rackLocation,
      problem_reported: newTicket.problem_reported,
      physicalCondition: newTicket.physicalCondition,
      requestedWork: newTicket.requestedWork,

      osToInstall: newTicket.osToInstall,
      intakePhotos: newTicket.intakePhotos,

      outsourceHistoryDetails: newTicket.outsourceHistoryDetails,
      placeOfPurchase: newTicket.placeOfPurchase,
      purchaseInvoiceNo: newTicket.purchaseInvoiceNo,
      purchaseDate: newTicket.purchaseDate,
      jobPipelineStatus: newTicket.jobPipelineStatus,
      assignedTechnician: newTicket.assignedTechnician,
      warrantyStatus: newTicket.warrantyStatus,
      partsToBeOrdered: newTicket.partsToBeOrdered,
      extraInfoArea: newTicket.extraInfoArea,

      status: 'received',
      priority: newTicket.priority as any,
      progressPercentage: Number((newTicket as any).progressPercentage) || 15,
      lineItems: combinedLineItems,
      outsourceCharges: 0,
      freightCharges: Number(newTicket.freightCharges),
      estimated_cost: totalEst,
      advance_paid: Number(newTicket.advance_paid),
      discountAmount: 0,
      gstTaxRate: repairBillingRules.repair_bill_default_tax || 18,
      subtotal: totalEst,
      taxableAmount: totalEst,
      cgstAmount: totalEst * 0.09,
      sgstAmount: totalEst * 0.09,
      roundOffAdjustment: 0,
      grandTotal: totalEst * 1.18,
      netDueBalance: totalEst * 1.18 - Number(newTicket.advance_paid),

      paymentMethod: 'CASH',
      paymentStatus: newTicket.advance_paid > 0 ? 'PARTIAL' : 'UNPAID',
      warrantyStatement: newTicket.warrantyStatus || '30 Days Parts & Labor Warranty',
      deliveryStatus: newTicket.deliveryStatus,

      technician_name: newTicket.assignedTechnician,
      estimatedDeliveryDate: newTicket.estimatedDeliveryDate,
    });

    setShowCreateModal(false);
  };

  const openEditModalForTicket = (ticket: RepairTicket) => {
    setEditingTicket(ticket);
    setNewTicket({
      manualTicketNo: ticket.ticket_number,
      entryDate: ticket.entryDate || new Date().toISOString().split('T')[0],
      priority: ticket.priority || 'normal',
      customer_name: ticket.customer_name,
      customer_phone: ticket.customer_phone,
      customerAlternatePhone: ticket.customerAlternatePhone || '',
      customerEmail: ticket.customerEmail || '',
      customerGstin: ticket.customerGstin || '',
      customerCompanyName: '',
      customerAddress: ticket.customerAddress || '',
      customerType: ticket.customerType || 'RETAIL',

      device_type: ticket.device_type,
      brand: ticket.brand,
      model: ticket.model,
      serial_or_imei: ticket.serial_or_imei,
      deviceColor: ticket.deviceColor || 'Space Gray',
      receivedQty: ticket.receivedQty || 1,
      passwordLock: ticket.passwordLock || '',
      patternLockSequence: ticket.patternLockSequence || [],
      rackLocation: ticket.rackLocation,
      problem_reported: ticket.problem_reported,
      physicalCondition: ticket.physicalCondition || 'Normal wear & tear',
      requestedWork: ticket.requestedWork || '',

      osToInstall: ticket.osToInstall || 'Windows 11 Pro 64-bit',
      intakePhotos: ticket.intakePhotos || [],
      outsourceHistoryDetails: ticket.outsourceHistoryDetails || '',
      freightCharges: ticket.freightCharges || 0,
      placeOfPurchase: ticket.placeOfPurchase || '',
      purchaseInvoiceNo: ticket.purchaseInvoiceNo || '',
      purchaseDate: ticket.purchaseDate || '',
      jobPipelineStatus: ticket.jobPipelineStatus || 'RECEIVED',
      assignedTechnician: ticket.assignedTechnician || ticket.technician_name,
      estimated_cost: ticket.estimated_cost,
      advance_paid: ticket.advance_paid,
      deliveryStatus: ticket.deliveryStatus || 'IN REPAIR LAB',
      warrantyStatus: ticket.warrantyStatus || '30 Days Parts & Labor Warranty',
      estimatedDeliveryDate: ticket.estimatedDeliveryDate || '',
      actualDeliveryDate: ticket.actualDeliveryDate || '',
      deliveredTo: ticket.deliveredTo || '',
      partsToBeOrdered: ticket.partsToBeOrdered || '',
      extraInfoArea: ticket.extraInfoArea || '',
      progressPercentage: ticket.progressPercentage ?? getTicketProgress(ticket),
    });

    if (ticket.lineItems && ticket.lineItems.length > 0) {
      setIntakeServiceParts(ticket.lineItems.filter((i) => i.itemType === 'service'));
      setIntakeRetailParts(ticket.lineItems.filter((i) => i.itemType === 'part'));
    }

    setShowEditModal(true);
  };

  const handleUpdateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    const combinedLineItems = [...intakeServiceParts, ...intakeRetailParts];
    const totalEst = combinedLineItems.reduce((sum, item) => sum + item.total, 0) || Number(newTicket.estimated_cost);
    const normalizedStatus = (newTicket.jobPipelineStatus?.toLowerCase().replace(/\s+/g, '_') as any) || editingTicket.status || 'received';

    updateTicket(editingTicket.id, {
      ticket_number: newTicket.manualTicketNo || editingTicket.ticket_number,
      entryDate: newTicket.entryDate,
      customer_name: newTicket.customer_name,
      customer_phone: newTicket.customer_phone,
      customerAlternatePhone: newTicket.customerAlternatePhone,
      customerEmail: newTicket.customerEmail,
      customerGstin: newTicket.customerGstin,
      customerAddress: newTicket.customerAddress,
      customerType: newTicket.customerType,

      device_type: newTicket.device_type,
      brand: newTicket.brand,
      model: newTicket.model,
      serial_or_imei: newTicket.serial_or_imei,
      deviceColor: newTicket.deviceColor,
      receivedQty: Number(newTicket.receivedQty),
      passwordLock: newTicket.passwordLock,
      patternLockSequence: newTicket.patternLockSequence,
      rackLocation: newTicket.rackLocation,
      problem_reported: newTicket.problem_reported,
      physicalCondition: newTicket.physicalCondition,
      requestedWork: newTicket.requestedWork,

      osToInstall: newTicket.osToInstall,
      intakePhotos: newTicket.intakePhotos,
      lineItems: combinedLineItems,

      outsourceHistoryDetails: newTicket.outsourceHistoryDetails,
      placeOfPurchase: newTicket.placeOfPurchase,
      purchaseInvoiceNo: newTicket.purchaseInvoiceNo,
      purchaseDate: newTicket.purchaseDate,
      status: normalizedStatus,
      jobPipelineStatus: newTicket.jobPipelineStatus,
      assignedTechnician: newTicket.assignedTechnician,
      warrantyStatus: newTicket.warrantyStatus,
      partsToBeOrdered: newTicket.partsToBeOrdered,
      extraInfoArea: newTicket.extraInfoArea,

      priority: newTicket.priority as any,
      progressPercentage: Number((newTicket as any).progressPercentage) ?? 50,
      estimated_cost: totalEst,
      advance_paid: Number(newTicket.advance_paid),
      deliveryStatus: newTicket.deliveryStatus,
      technician_name: newTicket.assignedTechnician,
      estimatedDeliveryDate: newTicket.estimatedDeliveryDate,
    });

    setShowEditModal(false);
    setEditingTicket(null);
  };

  const openEditInvoiceModal = (inv: RepairInvoice) => {
    setEditingInvoice(inv);
    const linkedTicket = tickets.find((t) => t.id === inv.ticketId || t.ticket_number === inv.ticketNumber) || ({
      id: inv.ticketId,
      ticket_number: inv.ticketNumber,
      customer_name: inv.customerName,
      customer_phone: inv.customerPhone,
      customerGstin: inv.customerGstin || '',
      brand: inv.brand,
      model: inv.model || '',
      device_type: inv.deviceType,
      serial_or_imei: inv.serial_or_imei,
      problem_reported: 'Repair & Component Service',
      estimated_cost: inv.grandTotal,
      advance_paid: inv.advancePaid,
      customerAddress: 'Above Choudhary Dharamshala, Sanchore',
      entryDate: inv.invoiceDate,
      created_at: inv.invoiceDate,
    } as any);

    setSelectedTicket(linkedTicket);

    setBillingInvoiceNo(inv.invoiceNumber);
    setBillingDate(inv.invoiceDate || new Date().toISOString().split('T')[0]);
    setActualDeliveryDate(inv.invoiceDate || new Date().toISOString().split('T')[0]);

    setBillingCustomerName(inv.customerName || '');
    setBillingCustomerPhone(inv.customerPhone || '');
    setBillingCustomerGstin(inv.customerGstin || '');
    setBillingAddress('Above Choudhary Dharamshala, Sanchore');

    setBillingDeliveredTo((inv as any).deliveredTo || inv.customerName || '');
    setBillingDeliveryStatus('DELIVERED');
    setBillingAfterServiceRemark(inv.afterServiceRemarks || 'Technician/cashier remark post-repair (e.g. Display & Touch replaced OK, 24hr battery testing complete)...');

    const serviceItems = inv.lineItems ? inv.lineItems.filter((i) => i.itemType === 'service') : [];
    const retailItems = inv.lineItems ? inv.lineItems.filter((i) => i.itemType === 'part') : [];

    setBillingServiceParts(serviceItems);
    setBillingRetailParts(retailItems);

    setBillingOutsourceCharges(inv.outsourceCharges || 0);
    setBillingFreightCharges(inv.freightCharges || 0);
    setBillingGstTaxMode(`${inv.gstTaxRate || 18}% GST (9% + 9%)`);
    setBillingDiscountAdjustment(inv.discountAmount || 0);
    setBillingPaymentMethod(inv.paymentMethod as any || 'Cash');
    setBillingPaymentStatus(inv.paymentStatus === 'PAID' ? 'Fully Paid' : inv.paymentStatus === 'PARTIAL' ? 'Partial' : 'Unpaid');
    setBillingEnableAutoRoundOff(true);

    setShowBillingModal(true);
  };

  const openBillingModalForTicket = (ticket: RepairTicket) => {
    setSelectedTicket(ticket);
    const existingInv = repairInvoices.find(
      (inv) => inv.ticketId === ticket.id || (ticket.ticket_number && inv.ticketNumber === ticket.ticket_number)
    );
    if (existingInv) {
      openEditInvoiceModal(existingInv);
      return;
    }

    setEditingInvoice(null);
    const prefix = repairBillingRules?.repair_invoice_prefix || 'RBN-';
    const startNo = repairBillingRules?.repair_invoice_start_no || 1001;
    const nextNo = startNo + repairInvoices.length;
    const initialInvoiceNo = (ticket as any).invoiceNumber || `${prefix}${nextNo}`;
    setBillingInvoiceNo(initialInvoiceNo);
    setBillingDate(new Date().toISOString().split('T')[0]);
    setActualDeliveryDate(ticket.actualDeliveryDate || new Date().toISOString().split('T')[0]);

    setBillingCustomerName(ticket.customer_name || '');
    setBillingCustomerPhone(ticket.customer_phone || '');
    setBillingCustomerGstin(ticket.customerGstin || '');
    setBillingAddress(ticket.customerAddress || 'Above Choudhary Dharamshala, Sanchore');

    setBillingDeliveredTo(ticket.deliveredTo || ticket.customer_name || '');
    setBillingDeliveryStatus(ticket.deliveryStatus || 'DELIVERED');
    setBillingAfterServiceRemark(ticket.afterServiceRemarks || 'Technician/cashier remark post-repair (e.g. Display & Touch replaced OK, 24hr battery testing complete)...');

    let serviceItems = ticket.lineItems ? ticket.lineItems.filter((i) => i.itemType === 'service') : [];
    let retailItems = ticket.lineItems ? ticket.lineItems.filter((i) => i.itemType === 'part') : [];

    if (serviceItems.length === 0 && retailItems.length === 0) {
      serviceItems = [
        {
          id: `item-${Date.now()}`,
          description: `${ticket.device_type || 'Device'} (${ticket.brand || ''} ${ticket.model || ''}) - ${ticket.problem_reported || 'Hardware Repair Service'}`.trim(),
          hsnCode: '998713',
          quantity: 1,
          unitPrice: ticket.estimated_cost || 0,
          total: ticket.estimated_cost || 0,
          itemType: 'service',
        },
      ];
    }

    setBillingServiceParts(serviceItems);
    setBillingRetailParts(retailItems);

    setBillingOutsourceCharges(ticket.outsourceCharges || 0);
    setBillingFreightCharges(ticket.freightCharges || 0);
    setBillingGstTaxMode('18% GST (9% + 9%)');
    setBillingDiscountAdjustment(ticket.discountAmount || 0);
    setBillingPaymentMethod('Cash');
    setBillingPaymentStatus('Fully Paid');
    setBillingEnableAutoRoundOff(true);

    setShowBillingModal(true);
  };

  const handleCalculateBilling = () => {
    const serviceSubtotal = billingServiceParts.reduce((acc, item) => acc + (item.total || 0), 0);
    const retailSubtotal = billingRetailParts.reduce((acc, item) => acc + (item.total || 0), 0);
    const itemsSubtotal = serviceSubtotal + retailSubtotal;
    const grossSubtotal = itemsSubtotal + Number(billingOutsourceCharges || 0) + Number(billingFreightCharges || 0);
    const taxable = Math.max(0, grossSubtotal - Number(billingDiscountAdjustment || 0));

    let taxRate = 18;
    if (billingGstTaxMode.includes('12%')) taxRate = 12;
    else if (billingGstTaxMode.includes('5%')) taxRate = 5;
    else if (billingGstTaxMode.includes('0%')) taxRate = 0;

    const cgst = (taxable * (taxRate / 2)) / 100;
    const sgst = (taxable * (taxRate / 2)) / 100;
    const totalWithTax = taxable + cgst + sgst;

    let roundOff = 0;
    let grandTotal = totalWithTax;

    if (billingEnableAutoRoundOff) {
      grandTotal = Math.round(totalWithTax);
      roundOff = Number((grandTotal - totalWithTax).toFixed(2));
    }

    const adv = selectedTicket?.advance_paid || 0;
    const balanceDue = billingPaymentStatus === 'Fully Paid' ? 0 : Math.max(0, grandTotal - adv);

    return {
      serviceSubtotal,
      retailSubtotal,
      subtotal: grossSubtotal,
      taxableAmount: taxable,
      taxRate,
      gstRate: taxRate,
      cgstAmount: cgst,
      sgstAmount: sgst,
      gstAmount: cgst + sgst,
      roundOffAdjustment: roundOff,
      grandTotal,
      netDueBalance: balanceDue,
    };
  };

  const handleIssueBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const calc = handleCalculateBilling();
    const combinedLineItems = [...billingServiceParts, ...billingRetailParts];
    const finalItems = combinedLineItems.length > 0 ? combinedLineItems : [
      { id: `item-${Date.now()}`, description: `${selectedTicket.device_type} ${selectedTicket.problem_reported || 'Repair'}`, hsnCode: '998713', quantity: 1, unitPrice: calc.grandTotal, total: calc.grandTotal, itemType: 'service' as const }
    ];

    const invoicePayload = {
      ticketId: selectedTicket.id,
      ticketNumber: selectedTicket.ticket_number,
      invoiceNumber: billingInvoiceNo,
      invoiceDate: billingDate,
      customerName: billingCustomerName,
      customerPhone: billingCustomerPhone,
      customerGstin: billingCustomerGstin,
      customerType: selectedTicket.customerType || 'RETAIL',
      deviceType: selectedTicket.device_type,
      brand: selectedTicket.brand,
      model: selectedTicket.model,
      serial_or_imei: selectedTicket.serial_or_imei,
      lineItems: finalItems,
      outsourceCharges: Number(billingOutsourceCharges),
      freightCharges: Number(billingFreightCharges),
      subtotal: calc.subtotal,
      discountAmount: Number(billingDiscountAdjustment),
      taxableAmount: calc.taxableAmount,
      gstTaxRate: calc.taxRate,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      roundOffAdjustment: calc.roundOffAdjustment,
      grandTotal: calc.grandTotal,
      advancePaid: Number(selectedTicket.advance_paid || 0),
      netDueBalance: calc.netDueBalance,
      paymentMethod: billingPaymentMethod as any,
      paymentStatus: (billingPaymentStatus === 'Fully Paid' ? 'PAID' : billingPaymentStatus === 'Partial' ? 'PARTIAL' : 'UNPAID') as any,
      warrantyStatement: '30 Days Parts & Labor Warranty',
      deliveredTo: billingDeliveredTo,
      deliveryStatus: billingDeliveryStatus,
      afterServiceRemarks: billingAfterServiceRemark,
      ticketDetails: selectedTicket,
    };

    if (editingInvoice) {
      updateRepairInvoice(editingInvoice.id, invoicePayload as any);
      const updatedInv: RepairInvoice = { ...editingInvoice, ...invoicePayload, status: invoicePayload.paymentStatus } as any;
      setSelectedInvoice(updatedInv);
      setPrintChoiceInvoice(updatedInv);
      setEditingInvoice(null);
    } else {
      issueRepairInvoice(selectedTicket.id, invoicePayload as any);
      const createdInvoice: RepairInvoice = {
        ...invoicePayload,
        id: `inv-${Date.now()}`,
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticket_number,
        status: invoicePayload.paymentStatus,
        createdAt: new Date().toISOString(),
      } as any;
      setSelectedInvoice(createdInvoice);
      setPrintChoiceInvoice(createdInvoice);
    }

    setShowBillingModal(false);
    setShowPrintChoiceModal(true);
  };

  const handlePrintInvoiceDocument = (
    inv: RepairInvoice,
    format: 'A4' | 'A5' = 'A4',
    copyType: 'both' | 'customer' | 'office' = 'both'
  ) => {
    const serviceSubtotal = (inv.lineItems || []).filter((i) => i.itemType === 'service').reduce((s, i) => s + (i.total || 0), 0) + (inv.outsourceCharges || 0) + (inv.freightCharges || 0);
    const retailSubtotal = (inv.lineItems || []).filter((i) => i.itemType === 'part').reduce((s, i) => s + (i.total || 0), 0);

    const serviceRows = (inv.lineItems || []).filter((i) => i.itemType === 'service');
    const retailRows = (inv.lineItems || []).filter((i) => i.itemType === 'part');

    const merchantUpi = (companyDetails.merchantUpiId || 'support.time24x7-3@okhdfcbank').trim();
    const upiPayUri = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(companyDetails.companyLegalName || 'Accno Solution')}&am=${inv.netDueBalance}&cu=INR&tn=${encodeURIComponent(`Bill ${inv.invoiceNumber}`)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(upiPayUri)}`;

    const renderSingleSheet = (copyLabel: string) => `
      <div class="bill-wrapper">
        <div class="top-section">
          <table class="header-table">
            <tr>
              <td style="vertical-align: top; width: 65%;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  ${companyDetails.companyLogo ? `<img src="${companyDetails.companyLogo}" alt="Logo" style="height: 52px; width: auto; max-width: 120px; object-fit: contain; flex-shrink: 0;" />` : ''}
                  <div>
                    <div class="company-title">${companyDetails.companyLegalName || 'Accno Solution'}</div>
                    <div class="tagline">${companyDetails.companyTagLine || 'COMPUTER REPAIR & MOBILE SOLUTION HUB'}</div>
                    <div class="company-address">
                      <div>${companyDetails.addressLine1 || '#80, Above Vijay Laxmi Medical Agency'}</div>
                      <div>${companyDetails.addressLine2 || 'Choudhary Dharmshala, Indira Chowk'}, ${companyDetails.city || 'SANCHORE'}, ${companyDetails.state || 'Rajasthan'} - ${companyDetails.stateCode || '343041'}</div>
                      <div style="font-weight: 700;"><strong>GSTIN:</strong> ${companyDetails.gstin || '08CAUPK8462J2ZT'} | <strong>Phone:</strong> ${companyDetails.phoneNumber || '+91 95877 81166'}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td style="vertical-align: top; text-align: right; width: 35%;">
                <div class="header-badge">TAX INVOICE / REPAIR BILL</div>
                <div class="copy-subtag">${copyLabel}</div>
                <div class="meta-text">
                  <div>BILL #: <strong>${inv.invoiceNumber}</strong></div>
                  <div>Billing Date: ${inv.invoiceDate}</div>
                  <div>Delivery Date: ${inv.invoiceDate}</div>
                </div>
              </td>
            </tr>
          </table>

          <div class="info-box">
            <table class="info-table">
              <tr>
                <td class="info-cell">
                  <div class="section-lbl">BILLED &amp; DELIVERED TO</div>
                  <div style="font-size: 11px; font-weight: 800; color: #000;">${inv.customerName}</div>
                  <div><strong>Phone:</strong> ${inv.customerPhone}</div>
                  <div><strong>Address:</strong> ${inv.customerGstin ? `GSTIN: ${inv.customerGstin} | ` : ''}Sanchore, Rajasthan</div>
                </td>
                <td class="info-cell">
                  <div class="section-lbl">REPAIR TICKET &amp; DEVICE DETAILS</div>
                  <div><strong>Ticket #:</strong> ${inv.ticketNumber} (Ticket Date: ${inv.invoiceDate})</div>
                  <div><strong>Device:</strong> ${inv.brand} ${inv.model || inv.deviceType}</div>
                  <div><strong>IMEI / Serial:</strong> ${inv.serial_or_imei || 'N/A'}</div>
                  <div><strong>Problem / Complaint:</strong> Hardware Repair &amp; Service Diagnostics</div>
                </td>
              </tr>
            </table>
          </div>

          <div class="ledger-box">
            <div class="ledger-header">
              <span>1. SERVICE PARTS &amp; LABOR LEDGER</span>
              <span>Service Subtotal: ₹${serviceSubtotal.toLocaleString()}</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 30px; text-align: center;">S.N.</th>
                  <th>SERVICE / LABOR DESCRIPTION</th>
                  <th style="width: 70px; text-align: center;">HSN/SAC</th>
                  <th style="width: 40px; text-align: center;">QTY</th>
                  <th style="width: 80px; text-align: right;">UNIT RATE</th>
                  <th style="width: 90px; text-align: right;">TOTAL (<span class="rupee-symbol">₹</span>)</th>
                </tr>
              </thead>
              <tbody>
                ${serviceRows.length > 0 ? serviceRows.map((r, i) => `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${i + 1}</td>
                    <td style="font-weight: bold;">${r.description}</td>
                    <td style="text-align: center; font-family: monospace;">${r.hsnCode || '9987'}</td>
                    <td style="text-align: center; font-family: monospace;">${r.quantity}</td>
                    <td style="text-align: right; font-family: monospace;">₹${r.unitPrice}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${r.total.toLocaleString()}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">1</td>
                    <td style="font-weight: bold;">Chip Level Repair &amp; Component Diagnostics Service</td>
                    <td style="text-align: center; font-family: monospace;">998713</td>
                    <td style="text-align: center; font-family: monospace;">1</td>
                    <td style="text-align: right; font-family: monospace;">₹${inv.subtotal}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${inv.subtotal.toLocaleString()}</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>

          <div class="ledger-box">
            <div class="ledger-header">
              <span>2. RETAIL PARTS &amp; ACCESSORIES LEDGER</span>
              <span>Retail Subtotal: ₹${retailSubtotal.toLocaleString()}</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 30px; text-align: center;">S.N.</th>
                  <th>RETAIL PART / ACCESSORY DESCRIPTION</th>
                  <th style="width: 70px; text-align: center;">HSN/SAC</th>
                  <th style="width: 40px; text-align: center;">QTY</th>
                  <th style="width: 80px; text-align: right;">UNIT RATE</th>
                  <th style="width: 90px; text-align: right;">TOTAL (<span class="rupee-symbol">₹</span>)</th>
                </tr>
              </thead>
              <tbody>
                ${retailRows.length > 0 ? retailRows.map((r, i) => `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${i + 1}</td>
                    <td style="font-weight: bold;">
                      <div>${r.description}</div>
                      ${r.remarks ? `
                        <div style="margin-top: 4px; padding: 4px 6px; background: #f8fafc; border-left: 3px solid #8b5cf6; border-radius: 4px; font-size: 10px; color: #334155; font-family: monospace; font-weight: normal;">
                          <strong style="color: #6b21a8; font-family: sans-serif;">Remarks / Included Parts:</strong><br/>
                          ${r.remarks}
                        </div>
                      ` : ''}
                    </td>
                    <td style="text-align: center; font-family: monospace;">${r.hsnCode || '8517'}</td>
                    <td style="text-align: center; font-family: monospace;">${r.quantity}</td>
                    <td style="text-align: right; font-family: monospace;">₹${r.unitPrice}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${r.total.toLocaleString()}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colSpan="6" style="text-align: center; font-style: italic; color: #64748b; padding: 12px;">
                      No retail accessories or parts charged for this service.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <div class="bottom-section" style="margin-top: auto; padding-top: 12px;">
          <div class="footer-grid">
            <div class="qr-box">
              <img src="${qrApiUrl}" style="width: 64px; height: 64px; border: 1px solid #000;" />
              <div>
                <div style="font-size: 8.5px; font-weight: 900; text-transform: uppercase;">PAY VIA BHIM UPI</div>
                <div style="font-size: 8px; font-family: monospace; color: #047857; font-weight: 700;">${merchantUpi}</div>
                <div style="font-size: 9px; font-weight: 900; color: #000; margin-top: 2px;">PAYABLE DUE: ₹${inv.netDueBalance.toLocaleString()}</div>
                <div style="font-size: 7px; color: #64748b;">GPay • PhonePe • Paytm • BHIM</div>
              </div>
            </div>

            <div class="terms-box">
              <div style="font-weight: 900; text-transform: uppercase; margin-bottom: 2px; color: #000;">TERMS &amp; CONDITIONS</div>
              ${(repairBillingRules?.billingTermsAndConditions || [
                '30 Days Parts & Labor Warranty.',
                'Warranty void with physical damage, liquid exposure, or open warranty seal.',
                'Backup data prior to servicing; Accno Solution is not liable for data loss.',
              ]).map((t) => `<div>- ${t}</div>`).join('')}
            </div>

            <div class="totals-box">
              <div class="totals-row"><span>Subtotal:</span><strong>₹${inv.subtotal.toLocaleString()}</strong></div>
              <div class="totals-row"><span>GST (${inv.gstTaxRate || 18}%):</span><strong>+₹${(inv.cgstAmount + inv.sgstAmount).toFixed(2)}</strong></div>
              <div class="totals-row" style="background: #f1f5f9; font-weight: 900; font-size: 11px;"><span>Grand Total:</span><span>₹${inv.grandTotal.toLocaleString()}</span></div>
              <div class="totals-row" style="color: #b91c1c; font-weight: 900;"><span>Net Due:</span><span>₹${inv.netDueBalance.toLocaleString()}</span></div>
            </div>
          </div>

          <div class="bottom-disclaimer" style="margin-top: 10px;">
            <div>
              <div>${repairBillingRules?.printFooterLegalNotice || 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.'}</div>
              <div style="font-weight: bold; margin-top: 2px;">${repairBillingRules?.printFooterDocTypeLabel || 'Computer Generated Official Repair Receipt.'}</div>
            </div>
            <div style="text-align: right; width: 180px;">
              <div style="border-bottom: 1px solid #000; height: 16px; margin-bottom: 2px;"></div>
              <div style="font-weight: 900; text-transform: uppercase; font-size: 8px;">AUTHORIZED SIGNATURE</div>
              <div style="font-size: 7.5px; color: #475569;">For ${companyDetails.companyLegalName || 'Accno Solution'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    let fullBodyHTML = '';
    if (copyType === 'both') {
      fullBodyHTML = `
        ${renderSingleSheet('ORIGINAL FOR RECIPIENT (CUSTOMER COPY)')}
        ${renderSingleSheet('DUPLICATE FOR SUPPLIER (OFFICE COPY)')}
      `;
    } else if (copyType === 'customer') {
      fullBodyHTML = renderSingleSheet('ORIGINAL FOR RECIPIENT (CUSTOMER COPY)');
    } else {
      fullBodyHTML = renderSingleSheet('DUPLICATE FOR SUPPLIER (OFFICE COPY)');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TAX INVOICE REPAIR BILL - ${inv.invoiceNumber}</title>
          <style>
            @font-face {
              font-family: 'RupeeSystemFallback';
              src: local('Segoe UI'), local('Arial'), local('Roboto');
              unicode-range: U+20B9;
            }
            @page {
              size: ${format === 'A4' ? 'A4 portrait' : 'A5 portrait'};
              margin: 4mm 6mm;
            }
            * { box-sizing: border-box; font-family: 'RupeeSystemFallback', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
            .rupee-symbol { font-family: 'Segoe UI', Arial, sans-serif !important; text-transform: none !important; display: inline-block; }
            html, body { margin: 0; padding: 0; background: #ffffff; color: #000000; font-size: 11px; line-height: 1.3; }
            .bill-wrapper { width: 100%; max-width: 800px; margin: 0 auto; padding: 4px; display: flex; flex-direction: column; justify-content: space-between; height: ${format === 'A4' ? '280mm' : '198mm'}; max-height: ${format === 'A4' ? '280mm' : '198mm'}; box-sizing: border-box; overflow: hidden; page-break-after: always; page-break-inside: avoid; }
            .bill-wrapper:last-child { page-break-after: avoid !important; page-break-after: auto !important; }
            .header-table { width: 100%; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 10px; border-collapse: collapse; }
            .company-title { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; margin: 0; color: #000; }
            .tagline { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; letter-spacing: 0.5px; margin-top: 1px; }
            .company-address { font-size: 9px; color: #334155; margin-top: 3px; }
            .header-badge { background: #000000; color: #ffffff; padding: 4px 12px; font-size: 11px; font-weight: 900; text-transform: uppercase; border-radius: 4px; display: inline-block; tracking-wider: 1px; }
            .copy-subtag { font-size: 8px; font-weight: 900; text-transform: uppercase; color: #000; margin-top: 2px; letter-spacing: 0.5px; }
            .meta-text { font-size: 10px; font-family: monospace; font-weight: 700; text-align: right; margin-top: 4px; }
            
            .info-box { border: 1px solid #000000; border-radius: 6px; margin-bottom: 12px; overflow: hidden; }
            .info-table { width: 100%; border-collapse: collapse; }
            .info-cell { width: 50%; vertical-align: top; padding: 8px 10px; font-size: 10px; }
            .info-cell:first-child { border-right: 1px solid #000000; }
            .section-lbl { font-size: 8.5px; font-weight: 900; text-transform: uppercase; color: #475569; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
            
            .ledger-box { border: 1px solid #000000; border-radius: 6px; margin-bottom: 12px; overflow: hidden; }
            .ledger-header { background-color: #f1f5f9; border-bottom: 1px solid #000000; padding: 4px 8px; font-size: 9.5px; font-weight: 900; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; }
            .data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 9.5px; }
            .data-table th { background-color: #000000 !important; background: #000000 !important; color: #ffffff !important; font-size: 8.5px; font-weight: 800; text-transform: uppercase; padding: 3px 5px; border: 1px solid #000000; white-space: nowrap; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .data-table td { padding: 5px 6px; border: 1px solid #cbd5e1; }
            
            .footer-grid { display: grid; grid-template-columns: 1.2fr 1.5fr 1fr; gap: 8px; margin-top: 10px; }
            .qr-box { border: 1px solid #000000; border-radius: 6px; padding: 6px; display: flex; align-items: center; gap: 8px; background: #f8fafc; }
            .terms-box { border: 1px solid #000000; border-radius: 6px; padding: 6px; font-size: 8px; color: #334155; background: #f8fafc; }
            .totals-box { border: 1px solid #000000; border-radius: 6px; font-family: monospace; font-size: 10px; overflow: hidden; }
            .totals-row { display: flex; justify-content: space-between; padding: 3px 8px; border-bottom: 1px solid #e2e8f0; }
            .totals-row:last-child { border-bottom: none; }

            .bottom-disclaimer { border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: auto; font-size: 7.5px; color: #475569; display: flex; justify-content: space-between; align-items: flex-end; }
          </style>
        </head>
        <body>
          ${fullBodyHTML}
        </body>
      </html>
    `;

    // Silent Iframe Printing (Bypasses popup blockers, guarantees full document print!)
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1500);
      }, 300);
    }
  };

  const handlePrintSticker = () => {
    const element = document.getElementById('printable-device-label');
    if (!element) return;

    const printWindow = window.open('', '_blank', 'width=650,height=450');
    if (!printWindow) {
      window.print();
      return;
    }

    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('\n');

    const labelW = labelSize === '80x50' ? '80mm' : labelSize === '70x35' ? '70mm' : '50mm';
    const labelH = labelSize === '80x50' ? '50mm' : labelSize === '70x35' ? '35mm' : '30mm';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sticker Tag - ${selectedTicket?.ticket_number || 'Print'}</title>
          ${headStyles}
          <style>
            @page {
              size: ${labelW} ${labelH};
              margin: 0mm;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: ${labelW} !important;
              height: ${labelH} !important;
              max-height: ${labelH} !important;
              overflow: hidden !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: monospace;
              -webkit-print-color-adjust: exact;
            }
            * {
              box-sizing: border-box !important;
            }
            #printable-device-label {
              width: ${labelW} !important;
              height: ${labelH} !important;
              max-height: ${labelH} !important;
              padding: ${labelSize === '80x50' ? '1.8mm' : '1.2mm'} !important;
              border: 2px solid #000000 !important;
              box-shadow: none !important;
              margin: 0 !important;
              overflow: hidden !important;
              background: #ffffff !important;
              color: #000000 !important;
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
              box-sizing: border-box !important;
            }
            /* Explicit Utility Class Fallbacks for Print Engine */
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .flex-1 { flex: 1 1 0% !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-content: center !important; }
            .justify-end { justify-content: flex-end !important; }
            .items-center { align-items: center !important; }
            .items-start { align-items: flex-start !important; }
            .items-stretch { align-items: stretch !important; }
            .shrink-0 { flex-shrink: 0 !important; }
            .w-full { width: 100% !important; }
            .w-24 { width: 96px !important; }
            .w-28 { width: 112px !important; }
            .h-full { height: 100% !important; }
            .h-5 { height: 20px !important; }
            .border { border: 1.5px solid #000000 !important; }
            .border-b { border-bottom: 1.5px solid #000000 !important; }
            .border-b-2 { border-bottom: 2px solid #000000 !important; }
            .border-r { border-right: 1.5px solid #000000 !important; }
            .border-t { border-top: 1.5px solid #000000 !important; }
            .font-mono { font-family: monospace !important; }
            .font-black, .font-extrabold { font-weight: 800 !important; }
            .font-bold { font-weight: 700 !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .line-clamp-2 {
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
              white-space: normal !important;
              word-break: break-word !important;
            }
            .break-words {
              word-break: break-word !important;
              overflow-wrap: break-word !important;
            }
            .leading-tight { line-height: 1.25 !important; }
            .-rotate-90 { transform: rotate(-90deg) !important; }
            .gap-1\.5 { gap: 6px !important; }
            .gap-2 { gap: 8px !important; }
            .p-2\.5 { padding: 8px !important; }
            .pr-1\.5 { padding-right: 6px !important; }
            .pl-0\.5 { padding-left: 2px !important; }
            .pb-1 { padding-bottom: 4px !important; }
            .pb-0\.5 { padding-bottom: 2px !important; }
            .pt-1 { padding-top: 4px !important; }
            .pt-0\.5 { padding-top: 2px !important; }
            .mb-1 { margin-bottom: 4px !important; }
            .text-gray-700, .text-gray-800 { color: #333333 !important; }
            .text-black { color: #000000 !important; }
            .bg-white { background-color: #ffffff !important; }
            img {
              max-height: 44px !important;
              object-fit: contain !important;
            }
            svg {
              max-width: 100% !important;
              max-height: ${labelSize === '80x50' ? '32px' : '22px'} !important;
              height: auto !important;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 350);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintJobSheet = () => {
    const element = document.getElementById('printable-repair-sheet');
    if (!element) return;

    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      window.print();
      return;
    }

    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('\n');

    const pageW = jobSheetPrintFormat === 'A4' ? '210mm' : '148mm';
    const pageH = jobSheetPrintFormat === 'A4' ? '297mm' : '210mm';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Repair Job Card - ${selectedTicket?.ticket_number || 'Print'}</title>
          ${headStyles}
          <style>
            @page {
              size: ${pageW} ${pageH};
              margin: 4mm 6mm;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: system-ui, -apple-system, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            * {
              box-sizing: border-box !important;
            }
            #printable-repair-sheet {
              width: 100% !important;
              height: 282mm !important;
              min-height: 282mm !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 2mm 4mm !important;
              background: #ffffff !important;
              color: #000000 !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              page-break-inside: avoid !important;
              overflow: hidden !important;
            }
            .mt-auto { margin-top: auto !important; }
            th, td {
              padding: 1px 3px !important;
              line-height: 1.15 !important;
            }
            .rounded-lg { border-radius: 6px !important; }
            .rounded-xl { border-radius: 8px !important; }
            .overflow-hidden { overflow: hidden !important; }
            .space-y-1 > * + * { margin-top: 2px !important; }
            .space-y-2\.5 > * + * { margin-top: 3px !important; }
            /* Explicit Utility Class Fallbacks for Print Engine */
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .flex-1 { flex: 1 1 0% !important; }
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-center: center !important; }
            .justify-end { justify-content: flex-end !important; }
            .items-center { align-items: center !important; }
            .items-start { align-items: flex-start !important; }
            .items-end { align-items: flex-end !important; }
            .gap-1 { gap: 4px !important; }
            .gap-2 { gap: 8px !important; }
            .gap-3 { gap: 12px !important; }
            .gap-4 { gap: 16px !important; }
            .w-full { width: 100% !important; }
            .w-1\/2 { width: 50% !important; }
            .w-2\/3 { width: 66.666667% !important; }
            .w-1\/3 { width: 33.333333% !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .font-mono { font-family: monospace !important; }
            .font-bold { font-weight: 700 !important; }
            .font-extrabold { font-weight: 800 !important; }
            .font-black { font-weight: 900 !important; }
            .uppercase { text-transform: uppercase !important; }
            .lowercase { text-transform: lowercase !important; }
            .italic { font-style: italic !important; }
            .border { border: 1px solid #cbd5e1 !important; }
            .border-b { border-bottom: 1px solid #cbd5e1 !important; }
            .border-t { border-top: 1px solid #cbd5e1 !important; }
            .border-r { border-right: 1px solid #cbd5e1 !important; }
            .border-b-2 { border-bottom: 2px solid #000000 !important; }
            .border-t-2 { border-top: 2px solid #000000 !important; }
            .bg-slate-900, .bg-slate-800 { background-color: #0f172a !important; color: #ffffff !important; }
            .bg-slate-100, .bg-gray-50 { background-color: #f8fafc !important; }
            .bg-rose-50 { background-color: #fff1f2 !important; }
            .border-rose-300 { border-color: #fca5a5 !important; }
            .text-rose-700 { color: #be123c !important; }
            .text-emerald-700 { color: #047857 !important; }
            .text-blue-700 { color: #1d4ed8 !important; }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 350);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // FILTERED TICKETS BY SEARCH, STATUS & PRIORITY (MEMOIZED FOR FASTER RENDERING & NO UNNECESSARY RE-COMPUTATIONS)
  const filteredTickets = useMemo(() => {
    const query = search.toLowerCase().trim();
    return tickets.filter((t) => {
      const matchesSearch =
        !query ||
        t.ticket_number.toLowerCase().includes(query) ||
        t.customer_name.toLowerCase().includes(query) ||
        t.device_type.toLowerCase().includes(query) ||
        t.customer_phone.includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        t.status.toLowerCase() === statusFilter.toLowerCase() ||
        (t.jobPipelineStatus && t.jobPipelineStatus.toLowerCase() === statusFilter.toLowerCase());

      const matchesPriority =
        priorityFilter === 'all' || t.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return repairInvoices;
    return repairInvoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.ticketNumber.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query) ||
        inv.customerPhone.includes(query)
    );
  }, [repairInvoices, search]);

  const calcState = useMemo(() => handleCalculateBilling(), [
    billingServiceParts,
    billingRetailParts,
    billingOutsourceCharges,
    billingFreightCharges,
    billingGstTaxMode,
    billingDiscountAdjustment,
    billingEnableAutoRoundOff,
  ]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5ED29C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#5ED29C]" />
            REPAIR TICKET DESK & JOB CARDS<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Modify, delete, A4/A5 job sheet printing, line/box view toggle, and status & priority filters.
          </p>
        </div>

        <button
          onClick={() => {
            const autoTicketNo = `TKT-${1001 + tickets.length + repairInvoices.length}`;
            setNewTicket((prev) => ({
              ...prev,
              manualTicketNo: autoTicketNo,
              entryDate: new Date().toISOString().split('T')[0],
              customer_name: '',
              customer_phone: '',
              customerAlternatePhone: '',
              customerEmail: '',
              customerGstin: '',
              customerCompanyName: '',
              customerAddress: '',
              problem_reported: '',
              requestedWork: '',
              advance_paid: 0,
              assignedTechnician: prev.assignedTechnician || effectiveTechOptions[0] || '',
            }));
            setIntakeServiceParts([]);
            setIntakeRetailParts([]);
            setCustomerSearchQuery('');
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create Repair Ticket
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('active_queue')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'active_queue'
              ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" /> Active Repair Tickets Ready for Billing (<span suppressHydrationWarning>{isMounted ? tickets.length : 0}</span>)
        </button>

        <button
          onClick={() => setActiveTab('invoices_archive')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'invoices_archive'
              ? 'bg-[#16FFC6] text-[#070B0A] shadow-lg shadow-[#16FFC6]/20'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" /> Generated Repair Bills Archive (<span suppressHydrationWarning>{isMounted ? repairInvoices.length : 0}</span>)
        </button>
      </div>

      {/* SEARCH, STATUS FILTER, PRIORITY FILTER & VIEW MODE TOGGLE BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Ticket #, Customer, Phone, Model..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:w-44">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-white/60 font-bold">Status Filter</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddOption('Status Filter', setStatusFilterOptions, 'statusFilterOptions')}
                  className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                >
                  + Add
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(statusFilter, setStatusFilterOptions, 'statusFilterOptions')}
                  className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white font-bold"
            >
              {statusFilterOptions.map((st) => (
                <option key={st} value={st}>{st === 'all' ? 'All Job Statuses' : st.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col sm:w-36">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-white/60 font-bold">Priority Filter</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddOption('Priority Filter', setPriorityFilterOptions, 'priorityFilterOptions')}
                  className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                >
                  + Add
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(priorityFilter, setPriorityFilterOptions, 'priorityFilterOptions')}
                  className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white font-bold"
            >
              {priorityFilterOptions.map((pr) => (
                <option key={pr} value={pr}>{pr === 'all' ? 'All Priorities' : pr.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LINE VIEW vs BOX VIEW TOGGLE BUTTONS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('box')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'box' ? 'bg-[#5ED29C] text-[#070B0A] shadow-md font-bold' : 'text-white/50 hover:text-white'
              }`}
              title="Box View (Grid Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('line')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'line' ? 'bg-[#5ED29C] text-[#070B0A] shadow-md font-bold' : 'text-white/50 hover:text-white'
              }`}
              title="Line View (Tabular Rows)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ACTIVE REPAIR TICKETS QUEUE */}
      {activeTab === 'active_queue' && (
        <>
          {/* BOX VIEW (GRID CARDS) */}
          {viewMode === 'box' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#5ED29C]/50 transition-all flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[#5ED29C]/5"
                >
                  <div>
                    {/* Header: Ticket Number, Priority Badge, Quick Job Status Dropdown */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#5ED29C] text-sm tracking-wide">{t.ticket_number}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            t.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : t.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      {/* Quick Job Status Switcher */}
                      <select
                        value={t.jobPipelineStatus || t.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          updateTicketStatus(t.id, newStatus as any);
                          updateTicket(t.id, { jobPipelineStatus: newStatus });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#0D1117] border border-white/20 text-[10px] font-extrabold text-[#16FFC6] uppercase focus:outline-none focus:border-[#5ED29C] cursor-pointer"
                      >
                        {pipelineOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    {/* Customer Info */}
                    <div
                      onClick={() => {
                        const custMatch = customers.find((c) => c.name === t.customer_name || c.mobile === t.customer_phone);
                        if (custMatch) setShowCustomerPopUp(custMatch);
                      }}
                      className="cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-[#5ED29C] transition-colors flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#5ED29C]" />
                          {t.customer_name}
                        </h3>
                        <p className="text-xs text-white/60 flex items-center gap-1 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-white/40" /> {t.customer_phone}
                        </p>
                      </div>

                      {t.assignedTechnician && (
                        <span className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-lg border border-white/10 font-medium">
                          👤 {t.assignedTechnician.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Device Specs & Rack Details */}
                    <div className="mt-3 p-3 rounded-xl bg-white/5 space-y-2 text-xs border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-[#16FFC6]" /> Device & Model:
                        </span>
                        <span className="font-bold text-white text-right">{t.brand} {t.model || t.device_type}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" /> Rack Storage:
                        </span>
                        <span className="font-mono font-bold text-[#16FFC6]">{t.rackLocation || 'Shelf A-1'}</span>
                      </div>

                      {t.passwordLock && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" /> Passcode / PIN:
                          </span>
                          <span className="font-mono font-bold text-amber-300">{t.passwordLock}</span>
                        </div>
                      )}

                      {t.patternLockSequence && t.patternLockSequence.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 flex items-center gap-1">
                            <Grid className="w-3 h-3 text-[#16FFC6]" /> Pattern Lock:
                          </span>
                          <span className="font-mono font-bold text-[#16FFC6]">
                            {t.patternLockSequence.map((n) => n + 1).join('→')}
                          </span>
                        </div>
                      )}

                      {/* Prominent Problem Field */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Reported Problem / Fault:
                        </div>
                        <p className="text-xs text-white/90 font-medium bg-black/40 p-2 rounded-lg border border-white/10 leading-relaxed">
                          {t.problem_reported || 'Standard Repair & Diagnostics'}
                        </p>
                      </div>

                      {/* Repair Progress Bar Section */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-[#5ED29C] uppercase tracking-wider flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-[#5ED29C]" /> Repair Stage Progress:
                          </span>
                          <span className="text-[#16FFC6] font-mono">{getTicketProgress(t)}% Complete</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden p-0.5 border border-white/10 relative">
                          <div
                            className="bg-gradient-to-r from-[#5ED29C] via-[#16FFC6] to-[#5ED29C] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#5ED29C]/50"
                            style={{ width: `${getTicketProgress(t)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-white/50 mt-1 font-mono">
                          <span>STAGE: {t.status.replace('_', ' ').toUpperCase()}</span>
                          <span className="text-[#5ED29C] font-semibold">{getTicketProgress(t) === 100 ? '100% Fully Repaired' : `${100 - getTicketProgress(t)}% Remaining`}</span>
                        </div>
                      </div>

                      {/* Received Parts / Intake Inspection Photos Preview */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#16FFC6] uppercase tracking-wider flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-[#16FFC6]" /> Received Parts / Intake Photos ({t.intakePhotos ? t.intakePhotos.length : 0}):
                          </span>
                        </div>

                        {t.intakePhotos && t.intakePhotos.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {t.intakePhotos.map((photo, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setPreviewImageModal(photo)}
                                className="relative h-16 rounded-lg overflow-hidden border border-white/20 hover:border-[#16FFC6] cursor-pointer group shadow-sm bg-black/40"
                              >
                                <img src={photo} alt={`Part Photo ${pIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-black/20 border border-dashed border-white/10 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> No received part photos attached
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                    {(() => {
                      const activeOutsourceVoucher = outsourceVouchers.find(
                        (v) => v.linkedTicketNumber === t.ticket_number && ['SHIPPED', 'IN_REPAIR'].includes(v.dispatchStatus)
                      );
                      const isOutsourceLocked = !!activeOutsourceVoucher;
                      return (
                        <>
                          {isOutsourceLocked && (
                            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 font-bold flex items-center gap-1.5">
                              <Lock className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>OUTSOURCED: {activeOutsourceVoucher.voucherNumber} ({activeOutsourceVoucher.dispatchStatus}) - Edit/Delete Locked</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-white/50 block">Est. Charges</span>
                              <span className="font-mono font-extrabold text-white text-sm">₹{t.estimated_cost.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Modify Button */}
                              <button
                                disabled={isOutsourceLocked}
                                onClick={() => !isOutsourceLocked && openEditModalForTicket(t)}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isOutsourceLocked
                                    ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed opacity-40'
                                    : 'bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10'
                                }`}
                                title={isOutsourceLocked ? `Locked: Currently in 3rd-party Outsourced Lab (${activeOutsourceVoucher.voucherNumber} - ${activeOutsourceVoucher.dispatchStatus})` : "Modify Repair Ticket"}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Print A4/A5 Job Card Work Order */}
                              <button
                                onClick={() => {
                                  setSelectedTicket(t);
                                  setShowJobSheetModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#16FFC6] border border-white/10"
                                title="Print Job Sheet (A4 / A5)"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Thermal Sticker Tag */}
                              <button
                                onClick={() => {
                                  setSelectedTicket(t);
                                  setShowStickerModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#5ED29C] border border-white/10"
                                title="Print Thermal Sticker Tag (70x35mm / 50x30mm)"
                              >
                                <Tag className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Ticket Button */}
                              <button
                                disabled={isOutsourceLocked}
                                onClick={() => {
                                  if (isOutsourceLocked) return;
                                  if (confirm(`Delete Repair Ticket ${t.ticket_number}?`)) {
                                    deleteTicket(t.id);
                                  }
                                }}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isOutsourceLocked
                                    ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed opacity-40'
                                    : 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20'
                                }`}
                                title={isOutsourceLocked ? `Locked: Currently in 3rd-party Outsourced Lab (${activeOutsourceVoucher.voucherNumber} - ${activeOutsourceVoucher.dispatchStatus})` : "Delete Ticket"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Issue Bill */}
                              <button
                                onClick={() => openBillingModalForTicket(t)}
                                className="px-3 py-1.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-[10px] uppercase tracking-wider ml-1"
                              >
                                {repairInvoices.some((inv) => inv.ticketId === t.id || inv.ticketNumber === t.ticket_number) ? 'MODIFY BILL' : 'ISSUE BILL'}
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LINE VIEW (TABULAR ROWS) */}
          {viewMode === 'line' && (
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Ticket #</th>
                    <th className="p-3">Entry Date</th>
                    <th className="p-3">Customer & Phone</th>
                    <th className="p-3">Device & Model</th>
                    <th className="p-3">Rack Storage</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status & Progress</th>
                    <th className="p-3">Est. Cost</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono font-extrabold text-[#5ED29C]">{t.ticket_number}</td>
                      <td className="p-3 font-mono text-white/60">{t.entryDate || t.created_at}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{t.customer_name}</div>
                        <div className="text-[10px] text-white/50 font-mono">{t.customer_phone}</div>
                      </td>
                      <td className="p-3 font-bold text-white/90">{t.brand} {t.model || t.device_type}</td>
                      <td className="p-3 font-mono font-bold text-[#16FFC6]">{t.rackLocation}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 uppercase border border-amber-400/20">
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-[#5ED29C] uppercase">{t.status.replace('_', ' ')}</span>
                            <span className="text-[#16FFC6] font-mono">{getTicketProgress(t)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] h-full transition-all duration-300"
                              style={{ width: `${getTicketProgress(t)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-extrabold text-white">₹{t.estimated_cost.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        {(() => {
                          const activeOutsourceVoucher = outsourceVouchers.find(
                            (v) => v.linkedTicketNumber === t.ticket_number && ['SHIPPED', 'IN_REPAIR'].includes(v.dispatchStatus)
                          );
                          const isOutsourceLocked = !!activeOutsourceVoucher;
                          return (
                            <div className="flex items-center justify-end gap-1.5">
                              {isOutsourceLocked && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 mr-1 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-purple-400" /> OUTSOURCED
                                </span>
                              )}
                              <button
                                disabled={isOutsourceLocked}
                                onClick={() => !isOutsourceLocked && openEditModalForTicket(t)}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isOutsourceLocked
                                    ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed opacity-40'
                                    : 'bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10'
                                }`}
                                title={isOutsourceLocked ? `Locked: Currently in 3rd-party Outsourced Lab (${activeOutsourceVoucher.voucherNumber} - ${activeOutsourceVoucher.dispatchStatus})` : "Modify Ticket"}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTicket(t);
                                  setShowJobSheetModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#16FFC6] border border-white/10"
                                title="Print Job Sheet (A4/A5)"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTicket(t);
                                  setShowStickerModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#5ED29C] border border-white/10"
                                title="Print Thermal Sticker Tag (70x35mm / 50x30mm)"
                              >
                                <Tag className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={isOutsourceLocked}
                                onClick={() => {
                                  if (isOutsourceLocked) return;
                                  if (confirm(`Delete Repair Ticket ${t.ticket_number}?`)) {
                                    deleteTicket(t.id);
                                  }
                                }}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isOutsourceLocked
                                    ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed opacity-40'
                                    : 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20'
                                }`}
                                title={isOutsourceLocked ? `Locked: Currently in 3rd-party Outsourced Lab (${activeOutsourceVoucher.voucherNumber} - ${activeOutsourceVoucher.dispatchStatus})` : "Delete Ticket"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openBillingModalForTicket(t)}
                                className="px-3 py-1 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-[10px] uppercase tracking-wider ml-1"
                              >
                                {repairInvoices.some((inv) => inv.ticketId === t.id || inv.ticketNumber === t.ticket_number) ? 'MODIFY BILL' : 'ISSUE BILL'}
                              </button>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB 2: GENERATED REPAIR BILLS ARCHIVE */}
      {activeTab === 'invoices_archive' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Ticket #</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Device Model</th>
                <th className="p-3">Grand Total</th>
                <th className="p-3">Advance Paid</th>
                <th className="p-3">Net Due</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono font-extrabold text-[#16FFC6]">{inv.invoiceNumber}</td>
                  <td className="p-3 font-mono text-white/70">{inv.ticketNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{inv.customerName}</div>
                    <div className="text-[10px] text-white/50">{inv.customerPhone}</div>
                  </td>
                  <td className="p-3 text-white/80">{inv.brand} {inv.model || inv.deviceType}</td>
                  <td className="p-3 font-mono font-bold text-white">₹{inv.grandTotal.toLocaleString()}</td>
                  <td className="p-3 font-mono text-emerald-400">₹{inv.advancePaid.toLocaleString()}</td>
                  <td className="p-3 font-mono font-extrabold text-rose-400">₹{inv.netDueBalance.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#16FFC6]/10 text-[#16FFC6] border border-[#16FFC6]/20 uppercase">
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditInvoiceModal(inv)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition-all"
                        title="Modify Repair Bill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete Repair Bill ${inv.invoiceNumber}?`)) {
                            deleteRepairInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all"
                        title="Delete Repair Bill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setPrintChoiceInvoice(inv);
                          setShowPrintChoiceModal(true);
                        }}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#16FFC6] border border-white/10 transition-all cursor-pointer"
                        title="Print Repair Bill (Choose Customer Copy / Office Copy / Both)"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowPrintModal(true);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase flex items-center gap-1 ml-1"
                      >
                        <Eye className="w-3 h-3 text-[#16FFC6]" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      {/* CREATE OR EDIT REPAIR TICKET MODAL */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/20 w-full max-w-5xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#5ED29C]" />
                {showEditModal ? `MODIFY REPAIR TICKET (${editingTicket?.ticket_number})` : 'INTAKE REPAIR TICKET & JOB CARD'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingTicket(null);
                }}
                className="p-1 rounded-full hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleUpdateTicketSubmit : handleCreateTicket} className="space-y-6 text-xs">
              
              {/* 1. CUSTOMER SEARCH & CRM PROFILE AUTOCOMPLETE */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-[#5ED29C]/30">
                <span className="text-[11px] font-bold text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#5ED29C]" /> 1. Customer Search &amp; CRM Profile Autocomplete
                  </span>
                  <span className="text-[10px] font-mono text-white/50 lowercase">Intake Date &amp; Ticket ID Editable</span>
                </span>

                {/* BACKDATED INTAKE DATE & CUSTOM TICKET ID FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/10">
                  <div>
                    <label className="block text-[#5ED29C] mb-1 font-extrabold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5ED29C]" /> Intake Date (For Backdated Entry) *
                    </label>
                    <input
                      type="date"
                      required
                      value={newTicket.entryDate}
                      onChange={(e) => setNewTicket({ ...newTicket, entryDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-[#5ED29C]/50 text-white font-mono font-extrabold focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#16FFC6] mb-1 font-extrabold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#16FFC6]" /> Ticket ID / Ticket Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.manualTicketNo}
                      onChange={(e) => setNewTicket({ ...newTicket, manualTicketNo: e.target.value.toUpperCase() })}
                      placeholder="e.g. TKT-1003"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-[#16FFC6]/50 text-white font-mono font-extrabold uppercase focus:outline-none focus:border-[#16FFC6]"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-white/70 mb-1 font-bold">Search Existing Customer Database *</label>
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    placeholder="Type Customer Name, Mobile Number or Code to Autocomplete..."
                    className="w-full p-3 rounded-xl bg-[#0D1117] border border-[#5ED29C]/40 text-white font-bold placeholder-white/30 focus:outline-none"
                  />

                  {showCustomerDropdown && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-[#0D1117] border border-white/20 rounded-xl shadow-2xl divide-y divide-white/10">
                      {customers
                        .filter((c) =>
                          c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                          c.mobile.includes(customerSearchQuery) ||
                          c.code.toLowerCase().includes(customerSearchQuery.toLowerCase())
                        )
                        .map((cust) => (
                          <div
                            key={cust.id}
                            onClick={() => {
                              setNewTicket({
                                ...newTicket,
                                customer_name: cust.name,
                                customer_phone: cust.mobile,
                                customerAlternatePhone: cust.alternateContact || '',
                                customerEmail: cust.email || '',
                                customerGstin: cust.gstin || '',
                                customerCompanyName: cust.companyName || '',
                                customerAddress: cust.billingAddress || '',
                                customerType: cust.creditLimit > 100000 ? 'CORPORATE' : 'RETAIL',
                              });
                              setCustomerSearchQuery(`${cust.name} (${cust.mobile})`);
                              setShowCustomerDropdown(false);
                            }}
                            className="p-3 hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <div className="font-bold text-white">{cust.name} <span className="text-[10px] text-[#5ED29C] font-mono">({cust.code})</span></div>
                              <div className="text-[10px] text-white/50 font-mono">{cust.mobile} | {cust.companyName || 'Retail'}</div>
                            </div>
                            <span className="text-[10px] font-bold text-[#16FFC6] bg-[#16FFC6]/10 px-2 py-0.5 rounded-full border border-[#16FFC6]/20">Select</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.customer_name}
                      onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.customer_phone}
                      onChange={(e) => setNewTicket({ ...newTicket, customer_phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Alternate Contact No.</label>
                    <input
                      type="text"
                      value={newTicket.customerAlternatePhone}
                      onChange={(e) => setNewTicket({ ...newTicket, customerAlternatePhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Customer Email ID</label>
                    <input
                      type="email"
                      value={newTicket.customerEmail}
                      onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Company Name</label>
                    <input
                      type="text"
                      value={newTicket.customerCompanyName}
                      onChange={(e) => setNewTicket({ ...newTicket, customerCompanyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">GSTIN (For Corporate)</label>
                    <input
                      type="text"
                      value={newTicket.customerGstin}
                      onChange={(e) => setNewTicket({ ...newTicket, customerGstin: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Full Postal Address</label>
                    <input
                      type="text"
                      value={newTicket.customerAddress}
                      onChange={(e) => setNewTicket({ ...newTicket, customerAddress: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. DEVICE DETAILS (LEFT) & REARRANGED 3X3 PATTERN LOCK (RIGHT) */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#16FFC6] uppercase tracking-wider block border-b border-[#16FFC6]/20 pb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#16FFC6]" /> 2. Device Specifications, Color, Warranty & Pattern Lock
                </span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Column: Device Detail Fields */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-white/70 font-bold">Device Category *</label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAddOption('Device Category', setDeviceCategoryOptions, 'deviceCategoryOptions')}
                              className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                            >
                              + Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(newTicket.device_type, setDeviceCategoryOptions, 'deviceCategoryOptions')}
                              className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <select
                          value={newTicket.device_type}
                          onChange={(e) => setNewTicket({ ...newTicket, device_type: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                        >
                          {deviceCategoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={newTicket.brand}
                          onChange={(e) => setNewTicket({ ...newTicket, brand: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Model Name / No.</label>
                        <input
                          type="text"
                          value={newTicket.model}
                          onChange={(e) => setNewTicket({ ...newTicket, model: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Device Color</label>
                        <input
                          type="text"
                          value={newTicket.deviceColor}
                          onChange={(e) => setNewTicket({ ...newTicket, deviceColor: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Received Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={newTicket.receivedQty}
                          onChange={(e) => setNewTicket({ ...newTicket, receivedQty: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Serial No / IMEI</label>
                        <input
                          type="text"
                          value={newTicket.serial_or_imei}
                          onChange={(e) => setNewTicket({ ...newTicket, serial_or_imei: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Rack Location *</label>
                        <input
                          type="text"
                          required
                          value={newTicket.rackLocation}
                          onChange={(e) => setNewTicket({ ...newTicket, rackLocation: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[#16FFC6] font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/70 mb-1 font-bold">Passcode / PIN</label>
                        <input
                          type="text"
                          value={newTicket.passwordLock}
                          onChange={(e) => setNewTicket({ ...newTicket, passwordLock: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-white/70 font-bold">Warranty Status</label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAddOption('Warranty Status', setWarrantyStatusOptions, 'warrantyStatusOptions')}
                              className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                            >
                              + Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(newTicket.warrantyStatus, setWarrantyStatusOptions, 'warrantyStatusOptions')}
                              className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <select
                          value={newTicket.warrantyStatus}
                          onChange={(e) => setNewTicket({ ...newTicket, warrantyStatus: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                        >
                          {warrantyStatusOptions.map((w) => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1 font-bold">Reported Problem / Fault *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Enter reported problem, fault symptoms, or issue description..."
                        value={newTicket.problem_reported}
                        onChange={(e) => setNewTicket({ ...newTicket, problem_reported: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1 font-bold">Requested Work</label>
                      <textarea
                        rows={2}
                        placeholder="Enter requested repair work scope..."
                        value={newTicket.requestedWork}
                        onChange={(e) => setNewTicket({ ...newTicket, requestedWork: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#5ED29C] focus:outline-none"
                      />
                    </div>

                    {/* Interactive Repair Progress % Slider & Stage Presets */}
                    <div className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/10 space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <label className="text-white/90 font-extrabold uppercase text-[11px] flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-[#5ED29C]" /> Repair Stage Progress:
                        </label>
                        <span className="font-mono font-extrabold text-[#16FFC6] text-xs bg-[#16FFC6]/10 px-2.5 py-1 rounded-xl border border-[#16FFC6]/30">
                          {(newTicket as any).progressPercentage ?? 50}% Complete
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={(newTicket as any).progressPercentage ?? 50}
                          onChange={(e) => setNewTicket({ ...newTicket, progressPercentage: Number(e.target.value) } as any)}
                          className="w-full accent-[#5ED29C] h-2 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
                          <div
                            className="bg-gradient-to-r from-[#5ED29C] via-[#16FFC6] to-[#5ED29C] h-full rounded-full transition-all duration-300"
                            style={{ width: `${(newTicket as any).progressPercentage ?? 50}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Stage Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-white/50 font-bold mr-1 self-center uppercase">Stage Presets:</span>
                        {[
                          { label: '15% Received', val: 15 },
                          { label: '30% Diagnosing', val: 30 },
                          { label: '60% Approved', val: 60 },
                          { label: '78% In Progress', val: 78 },
                          { label: '90% QC Testing', val: 90 },
                          { label: '100% Ready', val: 100 },
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => setNewTicket({ ...newTicket, progressPercentage: preset.val } as any)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              ((newTicket as any).progressPercentage ?? 50) === preset.val
                                ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C] shadow-md shadow-[#5ED29C]/30 font-extrabold'
                                : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Rearranged Interactive 3x3 Smartphone Pattern Lock Picker Grid */}
                  <div className="md:col-span-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3">
                    <label className="block text-white/80 font-bold uppercase text-[11px] flex items-center gap-1.5 text-center">
                      <Grid className="w-4 h-4 text-[#16FFC6]" /> 3x3 Pattern Lock Picker
                    </label>
                    <PatternLockPicker
                      sequence={newTicket.patternLockSequence}
                      onChange={(seq) => setNewTicket({ ...newTicket, patternLockSequence: seq })}
                    />
                  </div>
                </div>
              </div>

              {/* 3. HARDWARE & CONDITION CHECKLISTS */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block border-b border-amber-300/20 pb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" /> 3. Hardware Function & Physical Condition Checklists
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hardware Check */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="font-bold text-white text-[11px]">Hardware Function Check</span>
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem('Hardware Check', hwChecklistItems, setHwChecklistItems, setSelectedHwChecklist, 'hwChecklistItems')}
                        className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>

                    {hwChecklistItems.map((item) => (
                      <div key={item} className="flex items-center justify-between group py-0.5">
                        <label className="flex items-center space-x-2 text-white/80 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedHwChecklist[item])}
                            onChange={(e) => setSelectedHwChecklist({ ...selectedHwChecklist, [item]: e.target.checked })}
                            className="w-3.5 h-3.5 accent-[#5ED29C] cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item, 'Hardware Check', hwChecklistItems, setHwChecklistItems, setSelectedHwChecklist, 'hwChecklistItems')}
                          className="text-rose-400 text-[10px] font-bold hover:underline shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Physical Condition */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="font-bold text-white text-[11px]">Physical Condition Check</span>
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem('Condition Check', conditionChecklistItems, setConditionChecklistItems, setSelectedConditionChecklist, 'conditionChecklistItems')}
                        className="text-[9px] text-amber-300 font-bold uppercase hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>

                    {conditionChecklistItems.map((item) => (
                      <div key={item} className="flex items-center justify-between group py-0.5">
                        <label className="flex items-center space-x-2 text-white/80 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedConditionChecklist[item])}
                            onChange={(e) => setSelectedConditionChecklist({ ...selectedConditionChecklist, [item]: e.target.checked })}
                            className="w-3.5 h-3.5 accent-amber-300 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item, 'Condition Check', conditionChecklistItems, setConditionChecklistItems, setSelectedConditionChecklist, 'conditionChecklistItems')}
                          className="text-rose-400 text-[10px] font-bold hover:underline shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Accessories */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="font-bold text-white text-[11px]">Accessories Received</span>
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem('Accessories Received', accessoriesChecklistItems, setAccessoriesChecklistItems, setSelectedAccessoriesChecklist, 'accessoriesChecklistItems')}
                        className="text-[9px] text-purple-300 font-bold uppercase hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>

                    {accessoriesChecklistItems.map((item) => (
                      <div key={item} className="flex items-center justify-between group py-0.5">
                        <label className="flex items-center space-x-2 text-white/80 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedAccessoriesChecklist[item])}
                            onChange={(e) => setSelectedAccessoriesChecklist({ ...selectedAccessoriesChecklist, [item]: e.target.checked })}
                            className="w-3.5 h-3.5 accent-purple-400 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item, 'Accessories Received', accessoriesChecklistItems, setAccessoriesChecklistItems, setSelectedAccessoriesChecklist, 'accessoriesChecklistItems')}
                          className="text-rose-400 text-[10px] font-bold hover:underline shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. DYNAMIC REGISTRY OPTIONS */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block border-b border-purple-300/20 pb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-300" /> 4. OS, Priority, Job Status & Technician
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-bold">OS to Install</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddOption('OS to Install', setOsOptions, 'osOptions')}
                          className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(newTicket.osToInstall, setOsOptions, 'osOptions')}
                          className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={newTicket.osToInstall}
                      onChange={(e) => setNewTicket({ ...newTicket, osToInstall: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {osOptions.map((os) => (
                        <option key={os} value={os}>{os}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-bold">Priority</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddOption('Priority', setPriorityOptions, 'priorityOptions')}
                          className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(newTicket.priority, setPriorityOptions, 'priorityOptions')}
                          className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {priorityOptions.map((p) => (
                        <option key={p} value={p}>{p.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-bold">Job Status</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddOption('Job Status', setPipelineOptions, 'pipelineOptions')}
                          className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(newTicket.jobPipelineStatus, setPipelineOptions, 'pipelineOptions')}
                          className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={newTicket.jobPipelineStatus}
                      onChange={(e) => setNewTicket({ ...newTicket, jobPipelineStatus: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {pipelineOptions.map((pipe) => (
                        <option key={pipe} value={pipe}>{pipe}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Assign Technician</label>
                    <select
                      value={newTicket.assignedTechnician}
                      onChange={(e) => setNewTicket({ ...newTicket, assignedTechnician: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {effectiveTechOptions.map((tech) => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={newTicket.estimatedDeliveryDate}
                      onChange={(e) => setNewTicket({ ...newTicket, estimatedDeliveryDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Parts to be Ordered</label>
                    <input
                      type="text"
                      value={newTicket.partsToBeOrdered}
                      onChange={(e) => setNewTicket({ ...newTicket, partsToBeOrdered: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 5. INTAKE PHOTOS */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block border-b border-white/10 pb-1 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#16FFC6]" /> 5. Upload Device Intake Inspection Photos (Max 3 Files - Large Preview)
                </span>

                <div className="flex flex-wrap items-center gap-6">
                  {newTicket.intakePhotos.map((photo, idx) => (
                    <div key={idx} className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl group">
                      <img src={photo} alt={`Device photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNewTicket({
                            ...newTicket,
                            intakePhotos: newTicket.intakePhotos.filter((_, i) => i !== idx)
                          })}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase shadow-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {newTicket.intakePhotos.length < 3 && (
                    <label className="w-44 h-44 rounded-3xl border-2 border-dashed border-white/20 hover:border-[#16FFC6] flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/5 shadow-inner">
                      <Upload className="w-8 h-8 text-white/40 mb-2" />
                      <span className="text-xs text-white/80 font-extrabold uppercase">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleIntakePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 6. ITEMIZE SERVICE PARTS & RETAIL PARTS INTAKE (SEPARATED LEDGERS WITH DEDICATED CATALOG SEARCH) */}
              <div className="space-y-6 p-5 rounded-2xl bg-white/5 border border-[#5ED29C]/30">
                <span className="text-[12px] font-extrabold text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5ED29C]" /> 6. Itemize Service Parts & Retail Parts Intake (Separated Ledgers)
                </span>

                {/* LEDGER A: SERVICE SPARE PARTS & LABOR LEDGER */}
                <div className="space-y-3 bg-[#0D1117] p-4 rounded-2xl border border-[#5ED29C]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#5ED29C]" />
                      <span className="font-extrabold text-white text-xs uppercase tracking-wider">SERVICE SPARE PARTS & LABOR LEDGER</span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-md relative">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={serviceSearchQuery}
                          onFocus={() => setShowServiceCatalogDropdown(true)}
                          onChange={(e) => {
                            setServiceSearchQuery(e.target.value);
                            setShowServiceCatalogDropdown(true);
                          }}
                          placeholder="🔍 Search spare parts catalog to add instantly..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-[#5ED29C]/40 text-xs text-white placeholder-white/40 focus:outline-none"
                        />
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
                      </div>

                      {showServiceCatalogDropdown && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-[#0D1117] border border-white/20 rounded-xl shadow-2xl divide-y divide-white/10">
                          {inventory
                            .filter((item) =>
                              (item.itemType === 'Service Part' || item.category?.toLowerCase().includes('service')) &&
                              (item.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                                item.code.toLowerCase().includes(serviceSearchQuery.toLowerCase()))
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setIntakeServiceParts((prev) => [
                                    ...prev,
                                    {
                                      id: `sp-${Date.now()}`,
                                      description: item.name,
                                      hsnCode: item.hsnCode || '998713',
                                      quantity: 1,
                                      unitPrice: item.sellingPrice || 1500,
                                      total: item.sellingPrice || 1500,
                                      itemType: 'service',
                                      sku: item.code,
                                    },
                                  ]);
                                  setServiceSearchQuery('');
                                  setShowServiceCatalogDropdown(false);
                                }}
                                className="p-2.5 hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white">{item.name} <span className="text-[10px] text-[#5ED29C] font-mono">({item.code})</span></div>
                                  <div className="text-[10px] text-white/50 font-mono">₹{item.sellingPrice} | HSN: {item.hsnCode || '998713'}</div>
                                </div>
                                <span className="text-[10px] font-bold text-[#5ED29C] bg-[#5ED29C]/10 px-2 py-0.5 rounded-full border border-[#5ED29C]/20">+ Add</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table of Service Line Items */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-white/50 uppercase border-b border-white/10">
                        <tr>
                          <th className="p-2">SPARE ITEM DESCRIPTION / NAME</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2 text-center">QTY</th>
                          <th className="p-2 text-right">UNIT PRICE (₹)</th>
                          <th className="p-2 text-right">TOTAL (₹)</th>
                          <th className="p-2 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {intakeServiceParts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-white/40 text-xs italic">
                              No service parts or labor items added. Use the search bar above to search and add spare parts.
                            </td>
                          </tr>
                        ) : (
                          intakeServiceParts.map((item, idx) => (
                            <tr key={item.id}>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const updated = [...intakeServiceParts];
                                    updated[idx].description = e.target.value;
                                    setIntakeServiceParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold"
                                />
                              </td>
                              <td className="p-2 font-mono text-white/60 text-[11px]">{item.sku || 'SRV-1001'}</td>
                              <td className="p-2 w-20">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const updated = [...intakeServiceParts];
                                    const q = Number(e.target.value);
                                    updated[idx].quantity = q;
                                    updated[idx].total = q * updated[idx].unitPrice;
                                    setIntakeServiceParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-center font-mono"
                                />
                              </td>
                              <td className="p-2 w-28">
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => {
                                    const updated = [...intakeServiceParts];
                                    const p = Number(e.target.value);
                                    updated[idx].unitPrice = p;
                                    updated[idx].total = updated[idx].quantity * p;
                                    setIntakeServiceParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-right font-mono"
                                />
                              </td>
                              <td className="p-2 text-right font-mono font-extrabold text-white text-sm">
                                ₹{item.total.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setIntakeServiceParts(intakeServiceParts.filter((_, i) => i !== idx))}
                                  className="p-1 text-rose-400 hover:text-rose-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/10 font-mono text-xs text-white/80">
                    Service Parts Subtotal: <strong className="text-[#5ED29C] text-sm ml-2">₹{intakeServiceParts.reduce((s, i) => s + i.total, 0).toLocaleString()}</strong>
                  </div>
                </div>

                {/* LEDGER B: RETAIL PARTS & ACCESSORIES LEDGER */}
                <div className="space-y-3 bg-[#0D1117] p-4 rounded-2xl border border-[#16FFC6]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#16FFC6]" />
                      <span className="font-extrabold text-white text-xs uppercase tracking-wider">RETAIL PARTS & ACCESSORIES LEDGER</span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-md relative">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={retailSearchQuery}
                          onFocus={() => setShowRetailCatalogDropdown(true)}
                          onChange={(e) => {
                            setRetailSearchQuery(e.target.value);
                            setShowRetailCatalogDropdown(true);
                          }}
                          placeholder="🔍 Search retail parts catalog to add instantly..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-[#16FFC6]/40 text-xs text-white placeholder-white/40 focus:outline-none"
                        />
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
                      </div>

                      {showRetailCatalogDropdown && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-[#0D1117] border border-white/20 rounded-xl shadow-2xl divide-y divide-white/10">
                          {inventory
                            .filter((item) =>
                              (item.itemType === 'Retail Part' || item.category?.toLowerCase().includes('retail') || item.category?.toLowerCase().includes('accessory')) &&
                              (item.name.toLowerCase().includes(retailSearchQuery.toLowerCase()) ||
                                item.code.toLowerCase().includes(retailSearchQuery.toLowerCase()))
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setIntakeRetailParts((prev) => [
                                    ...prev,
                                    {
                                      id: `rp-${Date.now()}`,
                                      description: item.name,
                                      hsnCode: item.hsnCode || '851770',
                                      quantity: 1,
                                      unitPrice: item.sellingPrice || 1200,
                                      total: item.sellingPrice || 1200,
                                      itemType: 'part',
                                      sku: item.code,
                                    },
                                  ]);
                                  setRetailSearchQuery('');
                                  setShowRetailCatalogDropdown(false);
                                }}
                                className="p-2.5 hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white">{item.name} <span className="text-[10px] text-[#16FFC6] font-mono">({item.code})</span></div>
                                  <div className="text-[10px] text-white/50 font-mono">₹{item.sellingPrice} | HSN: {item.hsnCode || '851770'}</div>
                                </div>
                                <span className="text-[10px] font-bold text-[#16FFC6] bg-[#16FFC6]/10 px-2 py-0.5 rounded-full border border-[#16FFC6]/20">+ Add</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table of Retail Line Items */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-white/50 uppercase border-b border-white/10">
                        <tr>
                          <th className="p-2">RETAIL ITEM DESCRIPTION / NAME</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2 text-center">QTY</th>
                          <th className="p-2 text-right">UNIT PRICE (₹)</th>
                          <th className="p-2 text-right">TOTAL (₹)</th>
                          <th className="p-2 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {intakeRetailParts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-white/40 text-xs italic">
                              No retail parts or accessories added. Use the search bar above to search and add retail parts.
                            </td>
                          </tr>
                        ) : (
                          intakeRetailParts.map((item, idx) => (
                            <tr key={item.id}>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const updated = [...intakeRetailParts];
                                    updated[idx].description = e.target.value;
                                    setIntakeRetailParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold"
                                />
                              </td>
                              <td className="p-2 font-mono text-white/60 text-[11px]">{item.sku || 'PRT-1001'}</td>
                              <td className="p-2 w-20">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const updated = [...intakeRetailParts];
                                    const q = Number(e.target.value);
                                    updated[idx].quantity = q;
                                    updated[idx].total = q * updated[idx].unitPrice;
                                    setIntakeRetailParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-center font-mono"
                                />
                              </td>
                              <td className="p-2 w-28">
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => {
                                    const updated = [...intakeRetailParts];
                                    const p = Number(e.target.value);
                                    updated[idx].unitPrice = p;
                                    updated[idx].total = updated[idx].quantity * p;
                                    setIntakeRetailParts(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-right font-mono"
                                />
                              </td>
                              <td className="p-2 text-right font-mono font-extrabold text-white text-sm">
                                ₹{item.total.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setIntakeRetailParts(intakeRetailParts.filter((_, i) => i !== idx))}
                                  className="p-1 text-rose-400 hover:text-rose-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/10 font-mono text-xs text-white/80">
                    Retail Parts Subtotal: <strong className="text-[#16FFC6] text-sm ml-2">₹{intakeRetailParts.reduce((s, i) => s + i.total, 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* 7. SETTLEMENT DETAILS */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block border-b border-emerald-400/20 pb-1">
                  7. Financial Settlement, Purchase Details &amp; Delivery Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Estimated Repair Cost (₹)</label>
                    <input
                      type="number"
                      value={[...intakeServiceParts, ...intakeRetailParts].reduce((s, i) => s + i.total, 0) || newTicket.estimated_cost}
                      onChange={(e) => setNewTicket({ ...newTicket, estimated_cost: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Advance Deposit Received (₹)</label>
                    <input
                      type="number"
                      value={newTicket.advance_paid}
                      onChange={(e) => setNewTicket({ ...newTicket, advance_paid: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm font-bold text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Pending Balance (₹)</label>
                    <input
                      type="number"
                      disabled
                      value={Math.max(0, ([...intakeServiceParts, ...intakeRetailParts].reduce((s, i) => s + i.total, 0) || newTicket.estimated_cost) - newTicket.advance_paid)}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-rose-400 font-mono text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Freight / Shipping (₹)</label>
                    <input
                      type="number"
                      value={newTicket.freightCharges}
                      onChange={(e) => setNewTicket({ ...newTicket, freightCharges: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Place of Purchase</label>
                    <input
                      type="text"
                      value={newTicket.placeOfPurchase}
                      onChange={(e) => setNewTicket({ ...newTicket, placeOfPurchase: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Purchase Invoice No.</label>
                    <input
                      type="text"
                      value={newTicket.purchaseInvoiceNo}
                      onChange={(e) => setNewTicket({ ...newTicket, purchaseInvoiceNo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Purchase Date</label>
                    <input
                      type="date"
                      value={newTicket.purchaseDate}
                      onChange={(e) => setNewTicket({ ...newTicket, purchaseDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-bold">Delivery Status</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddOption('Delivery Status', setDeliveryStatusOptions, 'deliveryStatusOptions')}
                          className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(newTicket.deliveryStatus, setDeliveryStatusOptions, 'deliveryStatusOptions')}
                          className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={newTicket.deliveryStatus}
                      onChange={(e) => setNewTicket({ ...newTicket, deliveryStatus: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {deliveryStatusOptions.map((ds) => (
                        <option key={ds} value={ds}>{ds}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Actual Delivery Date</label>
                    <input
                      type="date"
                      value={newTicket.actualDeliveryDate}
                      onChange={(e) => setNewTicket({ ...newTicket, actualDeliveryDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Delivered To (Name)</label>
                    <input
                      type="text"
                      value={newTicket.deliveredTo}
                      onChange={(e) => setNewTicket({ ...newTicket, deliveredTo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Extra Information Area</label>
                  <textarea
                    rows={3}
                    value={newTicket.extraInfoArea}
                    onChange={(e) => setNewTicket({ ...newTicket, extraInfoArea: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div>
                  {showEditModal && editingTicket && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete Repair Ticket ${editingTicket.ticket_number}?`)) {
                          deleteTicket(editingTicket.id);
                          setShowEditModal(false);
                          setEditingTicket(null);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold uppercase border border-rose-500/20 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Ticket
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingTicket(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20"
                  >
                    {showEditModal ? 'Save Ticket Modifications' : '+ Create Repair Ticket (TKT-1001)'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INTAKE JOB CARD SHEET MODAL (A4 & A5 FORMATS) */}
      {showJobSheetModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-8 rounded-3xl border border-[#16FFC6]/40 w-full max-w-4xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase text-[#16FFC6]">PRINT INTAKE JOB CARD WORK ORDER</h2>
                <p className="text-xs text-white/60">Ticket No: <span className="font-mono text-white font-bold">{selectedTicket.ticket_number}</span></p>
              </div>

              {/* A4 vs A5 Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setJobSheetPrintFormat('A4')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
                    jobSheetPrintFormat === 'A4' ? 'bg-[#16FFC6] text-[#070B0A] border-[#16FFC6]' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A4 Full Page
                </button>
                <button
                  onClick={() => setJobSheetPrintFormat('A5')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
                    jobSheetPrintFormat === 'A5' ? 'bg-[#16FFC6] text-[#070B0A] border-[#16FFC6]' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A5 Half Page
                </button>

                <button
                  onClick={() => setShowJobSheetModal(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE CONTAINER (#printable-repair-sheet) */}
            <div className="flex justify-center bg-white/5 p-4 rounded-2xl border border-white/10 overflow-x-auto">
              <div
                id="printable-repair-sheet"
                style={{
                  width: jobSheetPrintFormat === 'A4' ? '100%' : '148mm',
                  minHeight: jobSheetPrintFormat === 'A4' ? '280mm' : '210mm',
                  fontSize: jobSheetPrintFormat === 'A4' ? '10px' : '8.5px',
                }}
                className="bg-white text-black p-5 sm:p-6 rounded shadow-2xl space-y-2.5 font-sans border border-slate-300 select-none overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Header Section */}
                  <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2 gap-4">
                    <div className="flex items-start gap-3">
                      {companyDetails.companyLogo ? (
                        <img
                          src={companyDetails.companyLogo}
                          alt="Company Logo"
                          className="h-10 max-w-[140px] object-contain shrink-0"
                        />
                      ) : (
                        <AccnoLogo height={38} />
                      )}
                      <div>
                        <div className="text-base font-black text-slate-900 tracking-tight leading-tight">{companyDetails.companyLegalName || 'Accno Solution'}</div>
                        <div className="text-[10px] font-extrabold text-blue-900 tracking-wider uppercase">{companyDetails.companyTagLine || 'COMPUTER REPAIR & MOBILE SOLUTION HUB'}</div>
                        <div className="text-[9.5px] text-slate-700 mt-0.5">{companyDetails.addressLine1} {companyDetails.addressLine2}</div>
                        <div className="text-[9.5px] text-slate-700 font-bold">{companyDetails.city}, {companyDetails.state} - {companyDetails.stateCode}</div>
                        <div className="text-[9.5px] text-slate-700 font-mono">GSTIN: {companyDetails.gstin} | Phone: {companyDetails.phoneNumber}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="bg-[#0F172A] text-white text-xs font-black uppercase px-3 py-1 rounded tracking-wider text-center shadow-sm">
                        REPAIR JOB CARD
                      </div>
                      <div className="mt-1 text-right">
                        <div className="w-32 flex justify-end mb-0.5">
                          {generateBarcodeSVG(selectedTicket.ticket_number || selectedTicket.barcode_data)}
                        </div>
                        <div className="text-xs font-black tracking-tight text-slate-900">
                          Ticket #: <span className="font-mono">{selectedTicket.ticket_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 1: CLIENT PROFILE DETAILS */}
                  <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 border-b border-slate-300 px-2.5 py-0.5 text-[9.5px] font-black uppercase text-slate-700 tracking-wider">
                      CLIENT PROFILE DETAILS
                    </div>
                    <div className="grid grid-cols-2 gap-0 bg-white text-[10px]">
                      {/* Left Column: CLIENT DETAILS */}
                      <div className="p-2 border-r border-slate-300 space-y-0.5">
                        <div className="font-bold text-[9px] uppercase text-slate-500 pb-0.5 border-b border-slate-100">CLIENT DETAILS</div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Name:</span>
                          <span className="col-span-2 font-bold text-slate-900">{selectedTicket.customer_name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Company Name:</span>
                          <span className="col-span-2 text-slate-800">{selectedTicket.customerCompanyName || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Mobile Phone:</span>
                          <span className="col-span-2 font-mono text-slate-900">{selectedTicket.customer_phone}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Alternate No:</span>
                          <span className="col-span-2 font-mono text-slate-800">{selectedTicket.customerAlternatePhone || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Email Address:</span>
                          <span className="col-span-2 text-slate-800">{selectedTicket.customerEmail || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Address:</span>
                          <span className="col-span-2 text-slate-800">{selectedTicket.customerAddress || 'Gardali, Sanchore'}</span>
                        </div>
                      </div>

                      {/* Right Column: JOB & TICKET TIMELINES */}
                      <div className="p-2 space-y-0.5">
                        <div className="font-bold text-[9px] uppercase text-slate-500 pb-0.5 border-b border-slate-100">JOB &amp; TICKET TIMELINES</div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Ticket No:</span>
                          <span className="col-span-2 font-mono font-bold text-blue-700">{selectedTicket.ticket_number}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Receive Date:</span>
                          <span className="col-span-2 font-mono text-slate-900">{selectedTicket.entryDate || selectedTicket.created_at}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Locker Location:</span>
                          <span className="col-span-2 font-mono text-slate-900">{selectedTicket.rackLocation || 'Cabinet C'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Priority / SLA:</span>
                          <span className="col-span-2 font-extrabold text-amber-700 uppercase">{selectedTicket.priority || 'HIGH'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Delivery Status:</span>
                          <span className="col-span-2 font-bold text-slate-900 uppercase">{selectedTicket.deliveryStatus || 'DELIVERED'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-bold text-slate-700">Est. Delivery Date:</span>
                          <span className="col-span-2 font-mono text-slate-900">{selectedTicket.estimatedDeliveryDate || '2026-07-31'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: DEVICE TECHNICAL SPECIFICATIONS */}
                  <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 border-b border-slate-300 px-2.5 py-0.5 text-[9.5px] font-black uppercase text-slate-700 tracking-wider">
                      DEVICE TECHNICAL SPECIFICATIONS
                    </div>
                    <div className="grid grid-cols-3 gap-0 bg-white p-2 text-[10px]">
                      <div className="space-y-0.5 border-r border-slate-200 pr-2">
                        <div><span className="font-bold text-slate-700">Device Category:</span> <span className="font-bold text-slate-900">{selectedTicket.device_type}</span></div>
                        <div><span className="font-bold text-slate-700">Device Name:</span> <span className="text-slate-900">{selectedTicket.brand} {selectedTicket.model || selectedTicket.device_type}</span></div>
                        <div><span className="font-bold text-slate-700">Quantity:</span> <span className="font-mono text-slate-900">{selectedTicket.receivedQty || selectedTicket.receivedQuantity || 1}</span></div>
                      </div>

                      <div className="space-y-0.5 px-2 border-r border-slate-200">
                        <div><span className="font-bold text-slate-700">Device Brand:</span> <span className="font-bold text-slate-900">{selectedTicket.brand}</span></div>
                        <div><span className="font-bold text-slate-700">Chassis Color:</span> <span className="text-slate-900">{selectedTicket.chassisColor || 'Dark Gray & Black'}</span></div>
                        <div><span className="font-bold text-slate-700">Device Password:</span> <span className="font-mono text-slate-900">{selectedTicket.passwordLock || 'None'}</span></div>
                      </div>

                      <div className="space-y-0.5 pl-2">
                        <div><span className="font-bold text-slate-700">Device Model:</span> <span className="font-bold text-slate-900">{selectedTicket.model || 'Latitude E5420'}</span></div>
                        <div><span className="font-bold text-slate-700">Serial/IMEI No:</span> <span className="font-mono text-slate-900">{selectedTicket.serial_or_imei || '18GF4S1'}</span></div>
                        <div><span className="font-bold text-slate-700">OS Installed:</span> <span className="text-slate-900">{selectedTicket.osToInstall || 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: LABOR SERVICES & PROBLEM DIAGNOSTICS */}
                  <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 border-b border-slate-300 px-2.5 py-0.5 text-[9.5px] font-black uppercase text-slate-700 tracking-wider">
                      LABOR SERVICES &amp; PROBLEM DIAGNOSTICS
                    </div>
                    <div className="bg-white p-2 text-[10px] space-y-0.5">
                      <div><span className="font-bold text-slate-700">Problem Log:</span> <span className="text-slate-900">{selectedTicket.problem_reported}</span></div>
                      <div><span className="font-bold text-slate-700">Requested Work:</span> <span className="text-slate-900">{selectedTicket.requestedWork || 'Body Change'}</span></div>
                    </div>
                  </div>

                  {/* SECTION 4: TAX INVOICE BILLING LEDGER */}
                  {(() => {
                    const grandTotal = [...intakeServiceParts, ...intakeRetailParts].reduce((sum, item) => sum + item.total, 0) || selectedTicket.estimated_cost;
                    const taxable = (grandTotal / 1.18).toFixed(2);
                    const gstTotal = (grandTotal - Number(taxable)).toFixed(2);
                    const halfGst = (Number(gstTotal) / 2).toFixed(2);
                    const adv = selectedTicket.advance_paid || 0;
                    const due = Math.max(0, grandTotal - adv);
                    const merchantUpi = (companyDetails.merchantUpiId || 'support.time24x7-3@okhdfcbank').trim();
                    const companyName = (companyDetails.companyLegalName || 'Accno Solution').trim();
                    const upiPayUri = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(companyName)}&am=${due}&cu=INR&tn=${encodeURIComponent(`Ticket ${selectedTicket.ticket_number}`)}`;

                    const serviceSubtotal = intakeServiceParts.reduce((sum, i) => sum + i.total, 0);
                    const retailSubtotal = intakeRetailParts.reduce((sum, i) => sum + i.total, 0);

                    return (
                      <div className="space-y-1.5">
                        {/* 4A: SERVICE SPARE PARTS & LABOR LEDGER */}
                        {intakeServiceParts.length > 0 && (
                          <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                            <div className="bg-slate-100 border-b border-slate-300 px-2 py-0.5 flex items-center justify-between text-[8.5px] font-black uppercase text-slate-700 tracking-wider">
                              <span>1. SERVICE SPARE PARTS &amp; LABOR LEDGER</span>
                              <span className="font-mono text-slate-900">SUBTOTAL: ₹{serviceSubtotal.toLocaleString()}</span>
                            </div>
                            <table className="w-full text-[8.5px] border-collapse text-left">
                              <thead>
                                <tr className="bg-[#0F172A] text-white text-[8px] font-bold uppercase tracking-wider">
                                  <th className="p-0.5 text-center border border-slate-700 w-6">S.N.</th>
                                  <th className="p-0.5 border border-slate-700">SERVICE / REWORK DESCRIPTION</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-12">HSN/SAC</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-16">RATE (EXCL.)</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-8">QTY</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-10">GST %</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-12">CGST</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-12">SGST</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-16">TOTAL (INCL.)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {intakeServiceParts.map((item, idx) => {
                                  const rateExcl = (item.unitPrice / 1.18).toFixed(2);
                                  const cgst = ((item.total - item.unitPrice / 1.18) / 2).toFixed(2);
                                  const sgst = cgst;
                                  return (
                                    <tr key={item.id} className="hover:bg-slate-50 text-slate-800">
                                      <td className="p-0.5 text-center font-bold border border-slate-200">{idx + 1}</td>
                                      <td className="p-0.5 border border-slate-200 font-bold leading-tight">{item.description}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">{item.hsnCode || '9987'}</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{rateExcl}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">{item.quantity}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">18%</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{cgst}</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{sgst}</td>
                                      <td className="p-0.5 text-right font-mono font-bold border border-slate-200">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* 4B: RETAIL PARTS & ACCESSORIES LEDGER */}
                        {intakeRetailParts.length > 0 && (
                          <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                            <div className="bg-slate-100 border-b border-slate-300 px-2 py-0.5 flex items-center justify-between text-[8.5px] font-black uppercase text-slate-700 tracking-wider">
                              <span>{intakeServiceParts.length > 0 ? '2.' : '1.'} RETAIL PARTS &amp; ACCESSORIES LEDGER</span>
                              <span className="font-mono text-slate-900">SUBTOTAL: ₹{retailSubtotal.toLocaleString()}</span>
                            </div>
                            <table className="w-full text-[8.5px] border-collapse text-left">
                              <thead>
                                <tr className="bg-[#0F172A] text-white text-[8px] font-bold uppercase tracking-wider">
                                  <th className="p-0.5 text-center border border-slate-700 w-6">S.N.</th>
                                  <th className="p-0.5 border border-slate-700">RETAIL ITEM / ACCESSORY DESCRIPTION</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-12">HSN/SAC</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-16">RATE (EXCL.)</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-8">QTY</th>
                                  <th className="p-0.5 text-center border border-slate-700 w-10">GST %</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-12">CGST</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-12">SGST</th>
                                  <th className="p-0.5 text-right border border-slate-700 w-16">TOTAL (INCL.)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {intakeRetailParts.map((item, idx) => {
                                  const rateExcl = (item.unitPrice / 1.18).toFixed(2);
                                  const cgst = ((item.total - item.unitPrice / 1.18) / 2).toFixed(2);
                                  const sgst = cgst;
                                  return (
                                    <tr key={item.id} className="hover:bg-slate-50 text-slate-800">
                                      <td className="p-0.5 text-center font-bold border border-slate-200">{idx + 1}</td>
                                      <td className="p-0.5 border border-slate-200 font-bold leading-tight">{item.description}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">{item.hsnCode || '8473'}</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{rateExcl}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">{item.quantity}</td>
                                      <td className="p-0.5 text-center font-mono border border-slate-200">18%</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{cgst}</td>
                                      <td className="p-0.5 text-right font-mono border border-slate-200">₹{sgst}</td>
                                      <td className="p-0.5 text-right font-mono font-bold border border-slate-200">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Financial Summary & Dynamic Amount Linked QR Code Box */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {/* Left: Dynamic Payment QR */}
                          {repairBillingRules.showUpiQrCode ? (
                            <div className="border border-slate-900 rounded-lg p-1.5 flex items-center gap-2 bg-slate-50 shadow-sm overflow-hidden">
                              <div className="w-14 h-14 bg-white p-0.5 border border-slate-900 rounded-md flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                <UpiPaymentQRCode upiUri={upiPayUri} size={52} />
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-[8px] font-black uppercase text-slate-900 tracking-wider">SCAN TO PAY VIA BHIM UPI</div>
                                <div className="text-[9.5px] font-black text-emerald-800 font-mono">
                                  PAYABLE DUE: ₹{due.toLocaleString()}
                                </div>
                                <div className="text-[7.5px] font-mono text-slate-800 font-bold tracking-tight">{merchantUpi}</div>
                                <div className="text-[6.5px] font-bold text-slate-500 uppercase">GPay • PhonePe • Paytm • BHIM • Cred</div>
                              </div>
                            </div>
                          ) : <div />}

                          {/* Right: Summary Numbers */}
                          <div className="border border-slate-300 rounded-lg overflow-hidden text-[8.5px] font-mono shadow-sm">
                            <div className="divide-y divide-slate-200">
                              <div className="flex justify-between px-1.5 py-0.5"><span className="font-sans font-bold text-slate-700">Taxable Amount (Excl. GST):</span><span>₹{taxable}</span></div>
                              <div className="flex justify-between px-1.5 py-0.5"><span className="font-sans text-slate-700">CGST Total (9%):</span><span>₹{halfGst}</span></div>
                              <div className="flex justify-between px-1.5 py-0.5"><span className="font-sans text-slate-700">SGST Total (9%):</span><span>₹{halfGst}</span></div>
                              <div className="flex justify-between px-1.5 py-0.5 font-bold bg-slate-100"><span className="font-sans text-slate-900">Grand Total (Incl. GST):</span><span className="text-slate-900">₹{grandTotal.toLocaleString()}</span></div>
                              <div className="flex justify-between px-1.5 py-0.5 text-blue-700"><span className="font-sans">Advance Paid Deposit:</span><span>₹{adv.toLocaleString()}</span></div>
                              <div className="flex justify-between px-1.5 py-0.5 bg-rose-50 text-rose-700 font-extrabold border-t border-rose-300"><span className="font-sans">Balance Outstanding Due:</span><span>₹{due.toLocaleString()}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* FOOTER SECTION: Pinned flush to the very bottom of the page */}
                <div className="mt-auto pt-3 border-t border-slate-300 space-y-2">
                  {/* SECTION 5: DATA LIABILITY NOTICE */}
                  {repairBillingRules.dataLiabilityNotice && (
                    <div className="border border-rose-300 bg-rose-50 text-rose-700 text-[9px] font-bold p-1.5 rounded-lg text-center shadow-sm">
                      {repairBillingRules.dataLiabilityNotice}
                    </div>
                  )}

                  {/* SECTION 6: CONTRACT TERMS & SIGNATURES */}
                  {repairBillingRules.showSignatureBlock && (
                    <div className="pt-2 border-t border-slate-200 text-[8.5px] text-slate-600 space-y-2">
                      <div className="space-y-0.5">
                        <div className="font-bold uppercase text-slate-800 text-[9px]">CONTRACT TERMS &amp; REPAIR CONDITIONS</div>
                        {(repairBillingRules.termsAndConditions || []).map((term, idx) => (
                          <div key={idx}>{idx + 1}. {term}</div>
                        ))}
                      </div>

                      {/* Side-by-Side Dual Signatures: Customer Left, Officer Right */}
                      <div className="flex items-end justify-between pt-3 gap-6">
                        {/* LEFT: AUTHORIZED CUSTOMER SIGNATURE */}
                        <div className="text-center font-bold text-slate-800 w-44">
                          <div className="h-5 border-b border-slate-400 w-full mb-1"></div>
                          <div className="text-[8px] uppercase font-black text-slate-900 tracking-wider">AUTHORIZED CUSTOMER SIGNATURE</div>
                          <div className="text-[7.5px] text-slate-500 font-mono">(CUSTOMER ACKNOWLEDGEMENT)</div>
                        </div>

                        {/* RIGHT: AUTHORIZED OFFICER SIGNATURE */}
                        <div className="text-center font-bold text-slate-800 w-44">
                          <div className="h-5 border-b border-slate-400 w-full mb-1"></div>
                          <div className="text-[8px] uppercase font-black text-slate-900 tracking-wider">AUTHORIZED OFFICER SIGNATURE</div>
                          <div className="text-[7.5px] text-slate-500 font-mono">FOR {companyDetails.companyLegalName || 'ACCNO SOLUTION SYSTEMS'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowJobSheetModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 font-bold uppercase text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintJobSheet}
                className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#16FFC6]/30 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Job Sheet ({jobSheetPrintFormat})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER INFORMATION POP-UP MODAL */}
      {showCustomerPopUp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-[#5ED29C]/40 w-full max-w-lg space-y-6 text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-extrabold uppercase text-[#5ED29C] flex items-center gap-2">
                <User className="w-5 h-5" /> CUSTOMER CRM PROFILE ({showCustomerPopUp.code})
              </h2>
              <button
                onClick={() => setShowCustomerPopUp(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-base font-bold text-white">{showCustomerPopUp.name}</div>
              <div className="flex items-center gap-2 text-white/70 font-mono"><Phone className="w-3.5 h-3.5 text-[#5ED29C]" /> {showCustomerPopUp.mobile}</div>
              {showCustomerPopUp.email && <div className="flex items-center gap-2 text-white/70"><Mail className="w-3.5 h-3.5 text-[#16FFC6]" /> {showCustomerPopUp.email}</div>}
              {showCustomerPopUp.companyName && <div className="flex items-center gap-2 text-white/70"><Building className="w-3.5 h-3.5 text-purple-400" /> {showCustomerPopUp.companyName}</div>}
              {showCustomerPopUp.gstin && <div className="font-mono text-[#16FFC6]">GSTIN: {showCustomerPopUp.gstin}</div>}
              {showCustomerPopUp.billingAddress && <div className="text-white/60">{showCustomerPopUp.billingAddress}</div>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Modifying customer ${showCustomerPopUp.code}`);
                  setShowCustomerPopUp(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-bold uppercase text-[11px]"
              >
                Modify
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete customer ${showCustomerPopUp.name}?`)) {
                    setShowCustomerPopUp(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold uppercase text-[11px]"
              >
                Delete
              </button>
              <button
                onClick={() => setShowCustomerPopUp(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/70 font-bold uppercase text-[11px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL STICKER TAG MODAL */}
      {showStickerModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#16FFC6]/40 w-full max-w-2xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-extrabold uppercase text-[#16FFC6] flex items-center gap-2">
                <Tag className="w-5 h-5" /> DEVICE STICKER TAG PRINTER ({labelSize}mm)
              </h2>
              <button
                onClick={() => setShowStickerModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sticker Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Sticker Dimension</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLabelSize('70x35')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      labelSize === '70x35' ? 'bg-[#16FFC6] text-[#070B0A] border-[#16FFC6]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    70×35 mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setLabelSize('50x30')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      labelSize === '50x30' ? 'bg-[#16FFC6] text-[#070B0A] border-[#16FFC6]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    50×30 mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setLabelSize('80x50')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      labelSize === '80x50' ? 'bg-[#16FFC6] text-[#070B0A] border-[#16FFC6]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    80×50 mm
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/70 font-bold">1D Barcode Placement</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAddOption('Barcode Placement', setBarcodeLayoutOptions, 'barcodeLayoutOptions')}
                      className="text-[9px] text-[#5ED29C] font-bold uppercase hover:underline"
                    >
                      + Add
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(barcodeLayout, setBarcodeLayoutOptions, 'barcodeLayoutOptions')}
                      className="text-[9px] text-rose-400 font-bold uppercase hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <select
                  value={barcodeLayout}
                  onChange={(e) => setBarcodeLayout(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                >
                  {barcodeLayoutOptions.map((layout) => (
                    <option key={layout} value={layout}>
                      {layout === 'right_h' ? 'Right Side (Horizontal)' : layout === 'right_v' ? 'Right Side (Rotated 90° Vertical)' : layout === 'bottom_h' ? 'Bottom (Horizontal Centered)' : layout}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selectable Fields to Print Checkboxes */}
            <div className="space-y-2.5 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
              <span className="font-extrabold text-[#16FFC6] uppercase block text-[11px] tracking-wider">
                Select Fields to Include on Sticker Tag:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.companyName}
                    onChange={(e) => setStickerFields({ ...stickerFields, companyName: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Company Name</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.ticketIdBarcode}
                    onChange={(e) => setStickerFields({ ...stickerFields, ticketIdBarcode: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Ticket ID / Barcode</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.intakeDate}
                    onChange={(e) => setStickerFields({ ...stickerFields, intakeDate: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Intake Date</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.customerName}
                    onChange={(e) => setStickerFields({ ...stickerFields, customerName: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Customer Name</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.mobileNumber}
                    onChange={(e) => setStickerFields({ ...stickerFields, mobileNumber: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Mobile Number</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.deviceBrandModel}
                    onChange={(e) => setStickerFields({ ...stickerFields, deviceBrandModel: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Device Brand & Model</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.serialImei}
                    onChange={(e) => setStickerFields({ ...stickerFields, serialImei: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Serial / IMEI</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={stickerFields.reportedProblem}
                    onChange={(e) => setStickerFields({ ...stickerFields, reportedProblem: e.target.checked })}
                    className="w-4 h-4 accent-[#16FFC6] rounded cursor-pointer"
                  />
                  <span>Reported Fault</span>
                </label>
              </div>
            </div>

            {/* Font Scaling Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="text-white/70 font-bold">Font Scale Slider: <span className="text-[#16FFC6] font-mono">{labelFontSize}px</span></label>
              </div>
              <input
                type="range"
                min={6}
                max={16}
                value={labelFontSize}
                onChange={(e) => setLabelFontSize(Number(e.target.value))}
                className="w-full accent-[#16FFC6] cursor-pointer"
              />
            </div>

            {/* LIVE STICKER TAG PREVIEW BOX (#printable-device-label) */}
            <div className="flex justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div
                id="printable-device-label"
                style={{
                  width: labelSize === '80x50' ? '320px' : labelSize === '70x35' ? '280px' : '220px',
                  height: labelSize === '80x50' ? '200px' : labelSize === '70x35' ? '140px' : '110px',
                  maxHeight: labelSize === '80x50' ? '200px' : labelSize === '70x35' ? '140px' : '110px',
                  padding: labelSize === '80x50' ? '10px' : labelSize === '70x35' ? '8px' : '6px',
                  fontSize: `${labelFontSize}px`,
                  lineHeight: labelSize === '80x50' ? '1.2' : '1.15',
                }}
                className="bg-white text-black rounded shadow-2xl flex flex-col justify-between select-none relative overflow-hidden font-mono border-2 border-black"
              >
                {/* Optional Top Company Header */}
                {stickerFields.companyName && (
                  <div className={`font-extrabold uppercase text-center border-b-2 border-black text-black tracking-wider ${labelSize === '80x50' ? 'pb-1 mb-1.5' : 'pb-0.5 mb-1'}`} style={{ fontSize: '0.95em' }}>
                    ACCNO SOLUTION
                  </div>
                )}

                {barcodeLayout === 'bottom_h' ? (
                  /* Vertical Stack Layout for Bottom Barcode */
                  <div className="flex flex-col h-full justify-between">
                    <div className={labelSize === '80x50' ? 'space-y-2' : 'space-y-1'}>
                      {/* Header Row */}
                      <div className={`flex justify-between items-start border-b border-black gap-2 ${labelSize === '80x50' ? 'pb-1' : 'pb-0.5'}`}>
                        <div>
                          {stickerFields.ticketIdBarcode && (
                            <div className="font-black tracking-tight" style={{ fontSize: '1.05em' }}>
                              {selectedTicket.ticket_number}
                            </div>
                          )}
                          {stickerFields.intakeDate && (
                            <div className="font-bold text-gray-700" style={{ fontSize: '0.75em' }}>
                              {selectedTicket.entryDate || selectedTicket.created_at}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          {stickerFields.customerName && (
                            <div className="font-extrabold uppercase truncate max-w-[140px]" style={{ fontSize: '0.85em' }}>
                              {selectedTicket.customer_name}
                            </div>
                          )}
                          {stickerFields.mobileNumber && (
                            <div className="font-bold text-gray-800" style={{ fontSize: '0.75em' }}>
                              {selectedTicket.customer_phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className={labelSize === '80x50' ? 'space-y-0.5' : 'space-y-0.5'}>
                        {stickerFields.deviceBrandModel && (
                          <div className="font-extrabold uppercase text-gray-900" style={{ fontSize: '0.82em' }}>
                            {selectedTicket.brand} {selectedTicket.model || selectedTicket.device_type}
                          </div>
                        )}
                        {stickerFields.serialImei && selectedTicket.serial_or_imei && (
                          <div className="text-gray-700 font-bold" style={{ fontSize: '0.75em' }}>
                            S/N: {selectedTicket.serial_or_imei}
                          </div>
                        )}
                        {stickerFields.reportedProblem && selectedTicket.problem_reported && (
                          <div
                            className={`italic text-gray-800 border-t border-black/40 pt-0.5 ${
                              labelSize === '80x50'
                                ? 'break-words leading-tight overflow-hidden'
                                : 'truncate'
                            }`}
                            style={{
                              fontSize: labelSize === '80x50' ? '0.78em' : '0.75em',
                              maxHeight: labelSize === '80x50' ? '2.6em' : '1.3em',
                              lineHeight: '1.25',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            Fault: {selectedTicket.problem_reported}
                          </div>
                        )}
                      </div>
                    </div>

                    {stickerFields.ticketIdBarcode && (
                      <div className={`border-t border-black w-full flex justify-center ${labelSize === '80x50' ? 'pt-1.5' : 'pt-1'}`}>
                        {generateBarcodeSVG(selectedTicket.ticket_number || selectedTicket.barcode_data)}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 2-Column Side-By-Side Layout for Right Barcode (right_h or right_v) */
                  <div className={`flex h-full w-full justify-between items-stretch overflow-hidden ${labelSize === '80x50' ? 'gap-2.5' : 'gap-1.5'}`}>
                    {/* Left Details Column */}
                    <div className={`flex-1 flex flex-col justify-start gap-1 overflow-hidden border-r border-black ${labelSize === '80x50' ? 'pr-2' : 'pr-1.5'}`}>
                      {/* Section 1: Header */}
                      <div className={`border-b border-black ${labelSize === '80x50' ? 'pb-0.5' : 'pb-0.5'}`}>
                        {stickerFields.ticketIdBarcode && (
                          <div className="font-black tracking-tight" style={{ fontSize: '1.05em' }}>
                            {selectedTicket.ticket_number}
                          </div>
                        )}
                        {stickerFields.intakeDate && (
                          <div className="font-bold text-gray-700" style={{ fontSize: '0.75em' }}>
                            {selectedTicket.entryDate || selectedTicket.created_at}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Customer & Mobile */}
                      {(stickerFields.customerName || stickerFields.mobileNumber) && (
                        <div>
                          {stickerFields.customerName && (
                            <div className="font-extrabold uppercase text-gray-900 truncate" style={{ fontSize: '0.82em' }}>
                              {selectedTicket.customer_name}
                            </div>
                          )}
                          {stickerFields.mobileNumber && (
                            <div className="font-bold text-gray-800" style={{ fontSize: '0.75em' }}>
                              {selectedTicket.customer_phone}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section 3: Device Brand/Model & Serial */}
                      {(stickerFields.deviceBrandModel || stickerFields.serialImei) && (
                        <div>
                          {stickerFields.deviceBrandModel && (
                            <div className="font-bold uppercase text-gray-900 leading-tight" style={{ fontSize: '0.8em' }}>
                              {selectedTicket.brand} {selectedTicket.model || selectedTicket.device_type}
                            </div>
                          )}
                          {stickerFields.serialImei && selectedTicket.serial_or_imei && (
                            <div className="text-gray-700 font-bold" style={{ fontSize: '0.75em' }}>
                              S/N: {selectedTicket.serial_or_imei}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section 4: Reported Fault */}
                      {stickerFields.reportedProblem && selectedTicket.problem_reported && (
                        <div
                          className={`italic text-gray-800 border-t border-black/40 pt-0.5 ${
                            labelSize === '80x50'
                              ? 'break-words leading-tight overflow-hidden'
                              : 'truncate'
                          }`}
                          style={{
                            fontSize: labelSize === '80x50' ? '0.78em' : '0.75em',
                            maxHeight: labelSize === '80x50' ? '2.6em' : '1.3em',
                            lineHeight: '1.25',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          Fault: {selectedTicket.problem_reported}
                        </div>
                      )}
                    </div>

                    {/* Right Barcode Column */}
                    {stickerFields.ticketIdBarcode && (
                      <div className={`${labelSize === '80x50' ? 'w-28 pl-1' : 'w-24 pl-0.5'} shrink-0 flex flex-col justify-center items-center`}>
                        {barcodeLayout === 'right_v' ? (
                          <div className={`transform -rotate-90 ${labelSize === '80x50' ? 'w-28' : 'w-24'}`}>
                            {generateBarcodeSVG(selectedTicket.ticket_number || selectedTicket.barcode_data)}
                          </div>
                        ) : (
                          <div className="w-full">
                            {generateBarcodeSVG(selectedTicket.ticket_number || selectedTicket.barcode_data)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStickerModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 font-bold uppercase text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePrintSticker}
                className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#16FFC6]/30 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Sticker Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE REPAIR BILL TAX INVOICE MODAL (1:1 MATCHING USER IMAGE 6) */}
      {showBillingModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
                    ISSUE REPAIR BILL TAX INVOICE
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Invoice #: <span className="text-blue-400 font-bold">{billingInvoiceNo}</span> | Ticket: <span className="text-slate-200 font-bold">{selectedTicket.ticket_number}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBillingModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleIssueBillSubmit} className="p-4 sm:p-6 space-y-6 text-xs flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN (Form Controls & Profiles) */}
                <div className="lg:col-span-5 space-y-4">

                  {/* Section 1: REPAIR BILLING INVOICE */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider block border-b border-slate-800 pb-1.5">
                      REPAIR BILLING INVOICE * (AUTO {billingInvoiceNo || 'RBN-1001'})
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">REPAIR BILLING INVOICE #</label>
                        <input
                          type="text"
                          value={billingInvoiceNo}
                          onChange={(e) => setBillingInvoiceNo(e.target.value)}
                          className="w-full p-2 rounded-lg bg-blue-950/30 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">REPAIR BILLING DATE *</label>
                        <input
                          type="date"
                          value={billingDate}
                          onChange={(e) => setBillingDate(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">ACTUAL DELIVERY DATE *</label>
                        <input
                          type="date"
                          value={actualDeliveryDate}
                          onChange={(e) => setActualDeliveryDate(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: CUSTOMER & BILLING PROFILE */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 text-blue-400 font-black uppercase text-[11px] tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      <span>CUSTOMER &amp; BILLING PROFILE</span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CUSTOMER NAME *</label>
                        <input
                          type="text"
                          required
                          value={billingCustomerName}
                          onChange={(e) => setBillingCustomerName(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">PHONE NO *</label>
                          <input
                            type="text"
                            required
                            value={billingCustomerPhone}
                            onChange={(e) => setBillingCustomerPhone(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">GSTIN NO</label>
                          <input
                            type="text"
                            placeholder="Optional GST"
                            value={billingCustomerGstin}
                            onChange={(e) => setBillingCustomerGstin(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">BILLING ADDRESS</label>
                        <input
                          type="text"
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: DELIVERY DETAILS & STATUS */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 text-emerald-400 font-black uppercase text-[11px] tracking-wider">
                      <Package className="w-3.5 h-3.5" />
                      <span>DELIVERY DETAILS &amp; STATUS</span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DELIVERED TO (NAME) *</label>
                        <input
                          type="text"
                          required
                          value={billingDeliveredTo}
                          onChange={(e) => setBillingDeliveredTo(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-bold focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">DELIVERY STATUS *</label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAddOption('Delivery Status', setDeliveryStatusOptions, 'deliveryStatusOptions')}
                              className="text-[9px] text-blue-400 hover:underline font-bold uppercase cursor-pointer"
                            >
                              + Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(billingDeliveryStatus, setDeliveryStatusOptions, 'deliveryStatusOptions')}
                              className="text-[9px] text-rose-400 hover:underline font-bold uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <select
                          value={billingDeliveryStatus}
                          onChange={(e) => setBillingDeliveryStatus(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-extrabold uppercase focus:outline-none"
                        >
                          {deliveryStatusOptions.map((ds) => (
                            <option key={ds} value={ds}>{ds}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">AFTER SERVICE REMARK</label>
                        <textarea
                          rows={2}
                          value={billingAfterServiceRemark}
                          onChange={(e) => setBillingAfterServiceRemark(e.target.value)}
                          placeholder="Technician/cashier remark post-repair (e.g. Display & Touch replaced OK, 24hr battery testing complete)..."
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: DEVICE SPECIFICATIONS */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-800 pb-1">
                      DEVICE SPECIFICATIONS
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">BRAND &amp; MODEL</span>
                        <span className="font-bold text-white">{selectedTicket.brand} {selectedTicket.model || selectedTicket.device_type}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">IMEI / SERIAL</span>
                        <span className="font-mono text-slate-300">{selectedTicket.serial_or_imei || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">ISSUE COMPLAINT</span>
                      <span className="text-amber-300 font-bold">{selectedTicket.problem_reported || 'General Fault'}</span>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN (Ledgers & Financial Summary Panel) */}
                <div className="lg:col-span-7 space-y-5">

                  {/* Section 5: SERVICE PARTS & LABOR LEDGER */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-[11px] tracking-wider">
                        <Wrench className="w-4 h-4" />
                        <span>SERVICE PARTS &amp; LABOR LEDGER</span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 max-w-sm relative">
                        <div className="relative w-full">
                          <input
                            type="text"
                            value={serviceSearchQueryBilling}
                            onFocus={() => setShowServiceCatalogBilling(true)}
                            onChange={(e) => {
                              setServiceSearchQueryBilling(e.target.value);
                              setShowServiceCatalogBilling(true);
                            }}
                            placeholder="🔍 Search service parts catalog to add..."
                            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                        </div>

                        {showServiceCatalogBilling && (
                          <div className="absolute top-full left-0 right-0 z-40 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800">
                            {inventory
                              .filter((item) =>
                                (item.itemType === 'Service Part' || item.category?.toLowerCase().includes('service')) &&
                                (item.name.toLowerCase().includes(serviceSearchQueryBilling.toLowerCase()) ||
                                  item.code.toLowerCase().includes(serviceSearchQueryBilling.toLowerCase()))
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    setBillingServiceParts((prev) => [
                                      ...prev,
                                      {
                                        id: `sp-${Date.now()}`,
                                        description: item.name,
                                        hsnCode: item.hsnCode || '998713',
                                        quantity: 1,
                                        unitPrice: item.sellingPrice || 1500,
                                        total: item.sellingPrice || 1500,
                                        itemType: 'service',
                                        sku: item.code,
                                      },
                                    ]);
                                    setServiceSearchQueryBilling('');
                                    setShowServiceCatalogBilling(false);
                                  }}
                                  className="p-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors text-xs"
                                >
                                  <div>
                                    <div className="font-bold text-white">{item.name} <span className="text-[10px] text-blue-400 font-mono">({item.code})</span></div>
                                    <div className="text-[10px] text-slate-400 font-mono">₹{item.sellingPrice} | HSN: {item.hsnCode || '998713'}</div>
                                  </div>
                                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-700/50">+ Add</span>
                                </div>
                              ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setBillingServiceParts([
                            ...billingServiceParts,
                            { id: `sp-${Date.now()}`, description: '', hsnCode: '998713', quantity: 1, unitPrice: 0, total: 0, itemType: 'service' }
                          ])}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase whitespace-nowrap shadow"
                        >
                          + Add Service
                        </button>
                      </div>
                    </div>

                    {/* Service Parts Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                          <tr>
                            <th className="p-2">SERVICE DESCRIPTION / LABOR</th>
                            <th className="p-2 text-center">HSN/SAC</th>
                            <th className="p-2 text-center">QTY</th>
                            <th className="p-2 text-right">UNIT RATE (₹)</th>
                            <th className="p-2 text-right">TOTAL (₹)</th>
                            <th className="p-2 text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {billingServiceParts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-slate-500 italic">
                                No service parts added. Search catalog above or click "+ Add Service".
                              </td>
                            </tr>
                          ) : (
                            billingServiceParts.map((item, idx) => (
                              <tr key={item.id}>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Service description"
                                    value={item.description}
                                    onChange={(e) => {
                                      const updated = [...billingServiceParts];
                                      updated[idx].description = e.target.value;
                                      setBillingServiceParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-bold"
                                  />
                                </td>
                                <td className="p-2 w-24">
                                  <input
                                    type="text"
                                    value={item.hsnCode}
                                    onChange={(e) => {
                                      const updated = [...billingServiceParts];
                                      updated[idx].hsnCode = e.target.value;
                                      setBillingServiceParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-center font-mono"
                                  />
                                </td>
                                <td className="p-2 w-16">
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updated = [...billingServiceParts];
                                      const q = Number(e.target.value);
                                      updated[idx].quantity = q;
                                      updated[idx].total = q * updated[idx].unitPrice;
                                      setBillingServiceParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-center font-mono"
                                  />
                                </td>
                                <td className="p-2 w-28">
                                  <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => {
                                      const updated = [...billingServiceParts];
                                      const p = Number(e.target.value);
                                      updated[idx].unitPrice = p;
                                      updated[idx].total = updated[idx].quantity * p;
                                      setBillingServiceParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-right font-mono"
                                  />
                                </td>
                                <td className="p-2 text-right font-mono font-bold text-blue-400">
                                  ₹{item.total.toLocaleString()}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setBillingServiceParts(billingServiceParts.filter((_, i) => i !== idx))}
                                    className="p-1 text-rose-400 hover:text-rose-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 6: RETAIL PARTS & ACCESSORIES LEDGER */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[11px] tracking-wider">
                        <Package className="w-4 h-4" />
                        <span>RETAIL PARTS &amp; ACCESSORIES LEDGER</span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 max-w-sm relative">
                        <div className="relative w-full">
                          <input
                            type="text"
                            value={retailSearchQueryBilling}
                            onFocus={() => setShowRetailCatalogBilling(true)}
                            onChange={(e) => {
                              setRetailSearchQueryBilling(e.target.value);
                              setShowRetailCatalogBilling(true);
                            }}
                            placeholder="🔍 Search retail accessories catalog to add..."
                            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                        </div>

                        {showRetailCatalogBilling && (
                          <div className="absolute top-full left-0 right-0 z-40 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800">
                            {inventory
                              .filter((item) =>
                                (item.itemType === 'Retail Part' || item.category?.toLowerCase().includes('retail') || item.category?.toLowerCase().includes('accessory')) &&
                                (item.name.toLowerCase().includes(retailSearchQueryBilling.toLowerCase()) ||
                                  item.code.toLowerCase().includes(retailSearchQueryBilling.toLowerCase()))
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    setBillingRetailParts((prev) => [
                                      ...prev,
                                      {
                                        id: `rp-${Date.now()}`,
                                        description: item.name,
                                        hsnCode: item.hsnCode || '851770',
                                        quantity: 1,
                                        unitPrice: item.sellingPrice || 1200,
                                        total: item.sellingPrice || 1200,
                                        itemType: 'part',
                                        sku: item.code,
                                      },
                                    ]);
                                    setRetailSearchQueryBilling('');
                                    setShowRetailCatalogBilling(false);
                                  }}
                                  className="p-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors text-xs"
                                >
                                  <div>
                                    <div className="font-bold text-white">{item.name} <span className="text-[10px] text-emerald-400 font-mono">({item.code})</span></div>
                                    <div className="text-[10px] text-slate-400 font-mono">₹{item.sellingPrice} | HSN: {item.hsnCode || '851770'}</div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/50">+ Add</span>
                                </div>
                              ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setBillingRetailParts([
                            ...billingRetailParts,
                            { id: `rp-${Date.now()}`, description: '', hsnCode: '851770', quantity: 1, unitPrice: 0, total: 0, itemType: 'part' }
                          ])}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase whitespace-nowrap shadow"
                        >
                          + Add Retail
                        </button>
                      </div>
                    </div>

                    {/* Retail Parts Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                          <tr>
                            <th className="p-2">RETAIL ITEM DESCRIPTION</th>
                            <th className="p-2 text-center">HSN/SAC</th>
                            <th className="p-2 text-center">QTY</th>
                            <th className="p-2 text-right">UNIT RATE (₹)</th>
                            <th className="p-2 text-right">TOTAL (₹)</th>
                            <th className="p-2 text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {billingRetailParts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-slate-500 italic">
                                No retail accessories added. Search catalog above or click "+ Add Retail".
                              </td>
                            </tr>
                          ) : (
                            billingRetailParts.map((item, idx) => (
                              <tr key={item.id}>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Retail item description"
                                    value={item.description}
                                    onChange={(e) => {
                                      const updated = [...billingRetailParts];
                                      updated[idx].description = e.target.value;
                                      setBillingRetailParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-bold"
                                  />
                                </td>
                                <td className="p-2 w-24">
                                  <input
                                    type="text"
                                    value={item.hsnCode}
                                    onChange={(e) => {
                                      const updated = [...billingRetailParts];
                                      updated[idx].hsnCode = e.target.value;
                                      setBillingRetailParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-center font-mono"
                                  />
                                </td>
                                <td className="p-2 w-16">
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updated = [...billingRetailParts];
                                      const q = Number(e.target.value);
                                      updated[idx].quantity = q;
                                      updated[idx].total = q * updated[idx].unitPrice;
                                      setBillingRetailParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-center font-mono"
                                  />
                                </td>
                                <td className="p-2 w-28">
                                  <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => {
                                      const updated = [...billingRetailParts];
                                      const p = Number(e.target.value);
                                      updated[idx].unitPrice = p;
                                      updated[idx].total = updated[idx].quantity * p;
                                      setBillingRetailParts(updated);
                                    }}
                                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-right font-mono"
                                  />
                                </td>
                                <td className="p-2 text-right font-mono font-bold text-emerald-400">
                                  ₹{item.total.toLocaleString()}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setBillingRetailParts(billingRetailParts.filter((_, i) => i !== idx))}
                                    className="p-1 text-rose-400 hover:text-rose-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 7: FINANCIAL SUMMARY & BILLING LEDGER PANEL (Dark Navy Box Matching Image 6) */}
                  {(() => {
                    const calc = handleCalculateBilling();

                    return (
                      <div className="bg-[#0B131E] p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
                        
                        {/* Top Input Row + Right Side Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          
                          {/* Inputs Left */}
                          <div className="md:col-span-7 grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">OUTSOURCE HRS (₹)</label>
                              <input
                                type="number"
                                value={billingOutsourceCharges}
                                onChange={(e) => setBillingOutsourceCharges(Number(e.target.value))}
                                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">FREIGHT / SHIPPING (₹)</label>
                              <input
                                type="number"
                                value={billingFreightCharges}
                                onChange={(e) => setBillingFreightCharges(Number(e.target.value))}
                                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>

                          {/* Calculations Right */}
                          <div className="md:col-span-5 text-right space-y-1 font-mono">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>Subtotal:</span>
                              <span className="font-bold text-slate-200">₹{calc.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-blue-400">
                              <span>GST ({calc.gstRate}%):</span>
                              <span className="font-bold">+₹{calc.gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-slate-800">
                              <span>Grand Total:</span>
                              <span className="text-base text-white">₹{calc.grandTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-amber-400 font-extrabold">
                              <span>Balance Due:</span>
                              <span>₹{calc.netDueBalance.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls Middle Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">GST TAX MODE</label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddOption('GST Tax Mode', setGstTaxModeOptions, 'gstTaxModeOptions')}
                                  className="text-[9px] text-blue-400 hover:underline font-bold uppercase"
                                >
                                  + Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(billingGstTaxMode, setGstTaxModeOptions, 'gstTaxModeOptions')}
                                  className="text-[9px] text-rose-400 hover:underline font-bold uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <select
                              value={billingGstTaxMode}
                              onChange={(e) => setBillingGstTaxMode(e.target.value)}
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-bold focus:outline-none"
                            >
                              {gstTaxModeOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DISCOUNT ADJUSTMENT</label>
                            <input
                              type="number"
                              value={billingDiscountAdjustment}
                              onChange={(e) => setBillingDiscountAdjustment(Number(e.target.value))}
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono font-bold focus:outline-none"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">PAYMENT METHOD</label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddOption('Payment Method', setPaymentMethodOptions, 'paymentMethodOptions')}
                                  className="text-[9px] text-blue-400 hover:underline font-bold uppercase"
                                >
                                  + Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(billingPaymentMethod, setPaymentMethodOptions, 'paymentMethodOptions')}
                                  className="text-[9px] text-rose-400 hover:underline font-bold uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <select
                              value={billingPaymentMethod}
                              onChange={(e) => setBillingPaymentMethod(e.target.value as any)}
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-bold focus:outline-none"
                            >
                              {paymentMethodOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">PAYMENT STATUS</label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddOption('Payment Status', setPaymentStatusOptions, 'paymentStatusOptions')}
                                  className="text-[9px] text-blue-400 hover:underline font-bold uppercase"
                                >
                                  + Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(billingPaymentStatus, setPaymentStatusOptions, 'paymentStatusOptions')}
                                  className="text-[9px] text-rose-400 hover:underline font-bold uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <select
                              value={billingPaymentStatus}
                              onChange={(e) => setBillingPaymentStatus(e.target.value as any)}
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-extrabold focus:outline-none"
                            >
                              {paymentStatusOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Bottom Row: Checkbox & Big Green Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs font-bold select-none">
                            <input
                              type="checkbox"
                              checked={billingEnableAutoRoundOff}
                              onChange={(e) => setBillingEnableAutoRoundOff(e.target.checked)}
                              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                            />
                            <span>Enable Auto Round Off to Nearest Rupee (₹)</span>
                          </label>

                          <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                          >
                            <Printer className="w-4 h-4" /> Issue &amp; Print Repair Bill
                          </button>
                        </div>

                      </div>
                    );
                  })()}

                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE A4 & A5 REPAIR BILL TAX INVOICE PREVIEW MODAL (1:1 MATCHING USER IMAGE 7) */}
      {showPrintModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/20 w-full max-w-5xl text-white space-y-5 my-auto bg-[#0B131E] shadow-2xl print:p-0 print:border-none print:bg-white print:my-0 print:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3 print:hidden">
              <div>
                <h2 className="text-lg font-black uppercase text-[#16FFC6] flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> REPAIR BILL TAX INVOICE PREVIEW ({selectedInvoice.invoiceNumber})
                </h2>
                <p className="text-xs text-white/60">Ticket: <span className="font-mono text-white font-bold">{selectedInvoice.ticketNumber}</span> | Client: <span className="text-white font-bold">{selectedInvoice.customerName}</span></p>
              </div>

              {/* Action Buttons: Modify, Delete, Print & Page Format Switcher */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    openEditInvoiceModal(selectedInvoice);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs uppercase border border-amber-400/40 transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Modify
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete Repair Bill ${selectedInvoice.invoiceNumber}?`)) {
                      deleteRepairInvoice(selectedInvoice.id);
                      setShowPrintModal(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs uppercase border border-rose-500/40 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                
                <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>

                <button
                  onClick={() => setPrintFormat('A4')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border ${
                    printFormat === 'A4' ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A4
                </button>
                <button
                  onClick={() => setPrintFormat('A5')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border ${
                    printFormat === 'A5' ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  A5
                </button>

                <button
                  onClick={() => handlePrintInvoiceDocument(selectedInvoice, printFormat, 'both')}
                  className="px-4 py-1.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-black uppercase text-xs tracking-wider shadow-lg shadow-[#16FFC6]/20 flex items-center gap-1.5 ml-1"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE CONTAINER (#printable-repair-bill - Exact Image 7 Formatting) */}
            <div className="flex justify-center bg-white/5 p-4 rounded-2xl border border-white/10 overflow-x-auto">
              <div
                id="printable-repair-bill"
                style={{
                  width: printFormat === 'A4' ? '100%' : '148mm',
                  minHeight: printFormat === 'A4' ? '280mm' : '210mm',
                  fontSize: printFormat === 'A4' ? '11px' : '9.5px',
                }}
                className="bg-white text-black p-6 sm:p-8 rounded shadow-2xl font-sans border-2 border-black select-none overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Letterhead Header */}
                  <div className="flex items-start justify-between border-b-2 border-black pb-3">
                    <div className="flex items-start gap-3">
                      {companyDetails.companyLogo && (
                        <img
                          src={companyDetails.companyLogo}
                          alt="Company Logo"
                          className="h-12 w-auto max-w-[120px] object-contain shrink-0"
                        />
                      )}
                      <div>
                        <div className="text-xl font-black text-black tracking-tight uppercase leading-none">
                          {companyDetails.companyLegalName || 'Accno Solution'}
                        </div>
                        <div className="text-[10px] font-extrabold text-blue-900 tracking-wider uppercase mt-0.5">
                          {companyDetails.companyTagLine || 'COMPUTER REPAIR & MOBILE SOLUTION HUB'}
                        </div>
                        <div className="text-[9px] text-slate-700 mt-1 leading-snug space-y-0.5">
                          <div>{companyDetails.addressLine1 || '#80, Above Vijay Laxmi Medical Agency'}</div>
                          <div>
                            {companyDetails.addressLine2 || 'Choudhary Dharmshala, Indira Chowk'}, {companyDetails.city || 'SANCHORE'}, {companyDetails.state || 'Rajasthan'} - {companyDetails.stateCode || '343041'}
                          </div>
                          <div className="font-mono font-bold text-slate-900">
                            GSTIN: {companyDetails.gstin || '08CAUPK8462J2ZT'} | Phone: {companyDetails.phoneNumber || '+91 95877 81166'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="bg-black text-white text-xs font-black uppercase px-3 py-1 rounded tracking-wider inline-block">
                        TAX INVOICE / REPAIR BILL
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] text-slate-900 font-bold space-y-0.5">
                        <div>BILL #: <span className="text-black font-extrabold">{selectedInvoice.invoiceNumber}</span></div>
                        <div>Billing Date: {selectedInvoice.invoiceDate}</div>
                        <div>Delivery Date: {selectedInvoice.invoiceDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Client & Device Details 2-Column Box */}
                  <div className="border border-black rounded-lg overflow-hidden text-[10px]">
                    <div className="grid grid-cols-2 divide-x divide-black">
                      <div className="p-2.5 space-y-0.5">
                        <div className="font-extrabold text-[8.5px] uppercase text-slate-500 pb-0.5 border-b border-slate-200">BILLED &amp; DELIVERED TO</div>
                        <div className="font-black text-slate-900 text-xs">{selectedInvoice.customerName}</div>
                        <div><strong className="text-slate-700">Phone:</strong> <span className="font-mono text-slate-900 font-bold">{selectedInvoice.customerPhone}</span></div>
                        <div><strong className="text-slate-700">Address:</strong> {selectedInvoice.customerGstin ? `GSTIN: ${selectedInvoice.customerGstin} | ` : ''}Sanchore, Rajasthan</div>
                      </div>

                      <div className="p-2.5 space-y-0.5">
                        <div className="font-extrabold text-[8.5px] uppercase text-slate-500 pb-0.5 border-b border-slate-200">REPAIR TICKET &amp; DEVICE DETAILS</div>
                        <div><strong className="text-slate-700">Ticket #:</strong> <span className="font-mono font-bold text-slate-900">{selectedInvoice.ticketNumber}</span> (Ticket Date: {selectedInvoice.invoiceDate})</div>
                        <div><strong className="text-slate-700">Device:</strong> <span className="font-bold text-slate-900">{selectedInvoice.brand} {selectedInvoice.model || selectedInvoice.deviceType}</span></div>
                        <div><strong className="text-slate-700">IMEI / Serial:</strong> <span className="font-mono text-slate-900">{selectedInvoice.serial_or_imei || 'N/A'}</span></div>
                        <div><strong className="text-slate-700">Problem / Complaint:</strong> Hardware Repair &amp; Service Diagnostics</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 1: SERVICE PARTS & LABOR LEDGER */}
                  {(() => {
                    const serviceRows = (selectedInvoice.lineItems || []).filter((i) => i.itemType === 'service');
                    const serviceSubtotal = serviceRows.reduce((s, i) => s + (i.total || 0), 0) + (selectedInvoice.outsourceCharges || 0) + (selectedInvoice.freightCharges || 0);

                    return (
                      <div className="border border-black rounded-lg overflow-hidden text-[9.5px]">
                        <div className="bg-slate-100 border-b border-black px-2.5 py-1 font-black text-[9px] uppercase tracking-wider flex justify-between">
                          <span>1. SERVICE PARTS &amp; LABOR LEDGER</span>
                          <span className="font-mono">Service Subtotal: ₹{serviceSubtotal.toLocaleString()}</span>
                        </div>
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-black text-white text-[8.5px] font-bold uppercase">
                              <th className="p-1 text-center border-r border-slate-700 w-8">S.N.</th>
                              <th className="p-1 border-r border-slate-700">SERVICE / LABOR DESCRIPTION</th>
                              <th className="p-1 text-center border-r border-slate-700 w-16">HSN/SAC</th>
                              <th className="p-1 text-center border-r border-slate-700 w-10">QTY</th>
                              <th className="p-1 text-right border-r border-slate-700 w-20">UNIT RATE</th>
                              <th className="p-1 text-right w-24">TOTAL (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {serviceRows.length > 0 ? serviceRows.map((r, i) => (
                              <tr key={r.id || i}>
                                <td className="p-1 text-center font-bold border-r border-slate-200">{i + 1}</td>
                                <td className="p-1 border-r border-slate-200 font-bold">{r.description}</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">{r.hsnCode || '9987'}</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">{r.quantity}</td>
                                <td className="p-1 text-right font-mono border-r border-slate-200">₹{r.unitPrice}</td>
                                <td className="p-1 text-right font-mono font-bold">₹{r.total.toLocaleString()}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td className="p-1 text-center font-bold border-r border-slate-200">1</td>
                                <td className="p-1 border-r border-slate-200 font-bold">Chip Level Motherboard Repair &amp; Diagnostics Service</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">998713</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">1</td>
                                <td className="p-1 text-right font-mono border-r border-slate-200">₹{selectedInvoice.subtotal}</td>
                                <td className="p-1 text-right font-mono font-bold">₹{selectedInvoice.subtotal.toLocaleString()}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  {/* SECTION 2: RETAIL PARTS & ACCESSORIES LEDGER */}
                  {(() => {
                    const retailRows = (selectedInvoice.lineItems || []).filter((i) => i.itemType === 'part');
                    const retailSubtotal = retailRows.reduce((s, i) => s + (i.total || 0), 0);

                    return (
                      <div className="border border-black rounded-lg overflow-hidden text-[9.5px]">
                        <div className="bg-slate-100 border-b border-black px-2.5 py-1 font-black text-[9px] uppercase tracking-wider flex justify-between">
                          <span>2. RETAIL PARTS &amp; ACCESSORIES LEDGER</span>
                          <span className="font-mono">Retail Subtotal: ₹{retailSubtotal.toLocaleString()}</span>
                        </div>
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-black text-white text-[8.5px] font-bold uppercase">
                              <th className="p-1 text-center border-r border-slate-700 w-8">S.N.</th>
                              <th className="p-1 border-r border-slate-700">RETAIL PART / ACCESSORY DESCRIPTION</th>
                              <th className="p-1 text-center border-r border-slate-700 w-16">HSN/SAC</th>
                              <th className="p-1 text-center border-r border-slate-700 w-10">QTY</th>
                              <th className="p-1 text-right border-r border-slate-700 w-20">UNIT RATE</th>
                              <th className="p-1 text-right w-24">TOTAL (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {retailRows.length > 0 ? retailRows.map((r, i) => (
                              <tr key={r.id || i}>
                                <td className="p-1 text-center font-bold border-r border-slate-200">{i + 1}</td>
                                <td className="p-1 border-r border-slate-200 font-bold">{r.description}</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">{r.hsnCode || '8517'}</td>
                                <td className="p-1 text-center font-mono border-r border-slate-200">{r.quantity}</td>
                                <td className="p-1 text-right font-mono border-r border-slate-200">₹{r.unitPrice}</td>
                                <td className="p-1 text-right font-mono font-bold">₹{r.total.toLocaleString()}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} className="p-2.5 text-center italic text-slate-500 font-semibold">
                                  No retail accessories or parts charged for this service.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* BOTTOM SECTION: FOOTER SUMMARY GRID (QR + TERMS + TOTALS) & DISCLAIMER */}
                <div className="mt-auto pt-4 space-y-3">
                  {(() => {
                    const merchantUpi = (companyDetails.merchantUpiId || 'support.time24x7-3@okhdfcbank').trim();
                    const upiPayUri = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(companyDetails.companyLegalName || 'Accno Solution')}&am=${selectedInvoice.netDueBalance}&cu=INR&tn=${encodeURIComponent(`Bill ${selectedInvoice.invoiceNumber}`)}`;

                    return (
                      <div className="grid grid-cols-12 gap-2 text-[9.5px]">
                        {/* UPI QR BOX */}
                        <div className="col-span-4 border border-black rounded-lg p-2 bg-slate-50 flex items-center gap-2">
                          <div className="w-14 h-14 bg-white p-0.5 border border-black rounded shrink-0 flex items-center justify-center">
                            <UpiPaymentQRCode upiUri={upiPayUri} size={52} />
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-[8px] uppercase text-black">PAY VIA BHIM UPI</div>
                            <div className="font-mono text-[8px] text-emerald-800 font-bold">{merchantUpi}</div>
                            <div className="font-mono font-black text-slate-900 text-[10px]">PAYABLE DUE: ₹{selectedInvoice.netDueBalance.toLocaleString()}</div>
                            <div className="text-[6.5px] text-slate-500 font-bold">GPay • PhonePe • Paytm • BHIM</div>
                          </div>
                        </div>

                        {/* TERMS BOX */}
                        <div className="col-span-5 border border-black rounded-lg p-2 bg-slate-50 text-[8px] text-slate-700 space-y-0.5">
                          <div className="font-black uppercase text-black text-[8.5px]">TERMS &amp; CONDITIONS</div>
                          {(repairBillingRules?.billingTermsAndConditions || [
                            '30 Days Parts & Labor Warranty.',
                            'Warranty void with physical damage, liquid exposure, or open warranty seal.',
                            'Backup data prior to servicing; Accno Solution is not liable for data loss.',
                          ]).map((t, idx) => (
                            <div key={idx}>- {t}</div>
                          ))}
                        </div>

                        {/* TOTALS BOX */}
                        <div className="col-span-3 border border-black rounded-lg font-mono text-[9.5px] overflow-hidden">
                          <div className="divide-y divide-slate-200">
                            <div className="flex justify-between px-2 py-0.5"><span>Subtotal:</span><span>₹{selectedInvoice.subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between px-2 py-0.5 text-slate-700"><span>GST ({selectedInvoice.gstTaxRate || 18}%):</span><span>+₹{(selectedInvoice.cgstAmount + selectedInvoice.sgstAmount).toFixed(2)}</span></div>
                            <div className="flex justify-between px-2 py-0.5 bg-slate-100 font-black text-slate-900"><span>Grand Total:</span><span>₹{selectedInvoice.grandTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between px-2 py-0.5 font-black text-rose-700 bg-rose-50"><span>Net Due:</span><span>₹{selectedInvoice.netDueBalance.toLocaleString()}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* BOTTOM DISCLAIMER & SIGNATURES */}
                  <div className="pt-2 border-t border-slate-300 text-[8px] text-slate-600 flex justify-between items-end">
                    <div>
                      <div className="font-bold">{repairBillingRules?.printFooterLegalNotice || 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.'}</div>
                      <div className="font-mono text-slate-500">{repairBillingRules?.printFooterDocTypeLabel || 'Computer Generated Official Repair Receipt.'}</div>
                    </div>
                    <div className="text-center font-bold w-44">
                      <div className="border-b border-black h-4 mb-0.5"></div>
                      <div className="text-[8px] font-black uppercase text-slate-900">AUTHORIZED SIGNATURE</div>
                      <div className="text-[7.5px] text-slate-500">For {companyDetails.companyLegalName || 'Accno Solution'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 print:hidden">
              <div className="text-xs text-white/50 font-mono">
                Supports Printing: Customer Copy (Original) + Office Copy (Duplicate)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePrintInvoiceDocument(selectedInvoice, printFormat, 'customer')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs border border-white/10"
                >
                  Customer Copy Only
                </button>
                <button
                  onClick={() => handlePrintInvoiceDocument(selectedInvoice, printFormat, 'both')}
                  className="px-6 py-2.5 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#16FFC6]/30 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Both Copies (Customer + Office)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPAIR BILL PRINT COPY SELECTION MODAL (CUSTOMER COPY / OFFICE COPY / BOTH) */}
      {showPrintChoiceModal && printChoiceInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D131A] p-6 sm:p-8 rounded-3xl border border-[#5ED29C]/30 w-full max-w-xl text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-[#16FFC6] flex items-center gap-2">
                  <Printer className="w-5 h-5" /> PRINT REPAIR BILL ({printChoiceInvoice.invoiceNumber})
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Client: <span className="text-white font-bold">{printChoiceInvoice.customerName}</span> | Ticket: <span className="font-mono text-white font-bold">{printChoiceInvoice.ticketNumber}</span>
                </p>
              </div>

              <button
                onClick={() => setShowPrintChoiceModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paper Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/70 uppercase">Select Paper Format</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPrintChoicePaper('A4')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase border transition-all ${
                    printChoicePaper === 'A4'
                      ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C] shadow-lg shadow-[#5ED29C]/20'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  A4 Standard Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setPrintChoicePaper('A5')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase border transition-all ${
                    printChoicePaper === 'A5'
                      ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C] shadow-lg shadow-[#5ED29C]/20'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  A5 Compact Receipt
                </button>
              </div>
            </div>

            {/* 3 Copy Options Cards */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-white/70 uppercase">Select Copy Option to Print</label>
              
              {/* Option 1: BOTH COPIES */}
              <button
                onClick={() => {
                  handlePrintInvoiceDocument(printChoiceInvoice, printChoicePaper, 'both');
                  setShowPrintChoiceModal(false);
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#5ED29C]/15 to-[#16FFC6]/15 hover:from-[#5ED29C]/25 hover:to-[#16FFC6]/25 border border-[#5ED29C]/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-white group-hover:text-[#16FFC6] transition-colors flex items-center gap-2">
                    <span>Print Both Copies (Customer + Office)</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#5ED29C] text-[#070B0A] font-black uppercase">Recommended</span>
                  </div>
                  <p className="text-xs text-white/60">Prints 2 pages: Original for Recipient (Customer Copy) + Duplicate for Supplier (Office Copy)</p>
                </div>
                <Printer className="w-5 h-5 text-[#16FFC6] shrink-0 ml-3" />
              </button>

              {/* Option 2: CUSTOMER COPY ONLY */}
              <button
                onClick={() => {
                  handlePrintInvoiceDocument(printChoiceInvoice, printChoicePaper, 'customer');
                  setShowPrintChoiceModal(false);
                }}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-white group-hover:text-[#16FFC6] transition-colors">
                    Print Customer Copy Only
                  </div>
                  <p className="text-xs text-white/60">Prints 1 page: Original for Recipient (Customer Tax Receipt)</p>
                </div>
                <FileText className="w-5 h-5 text-emerald-400 shrink-0 ml-3" />
              </button>

              {/* Option 3: OFFICE COPY ONLY */}
              <button
                onClick={() => {
                  handlePrintInvoiceDocument(printChoiceInvoice, printChoicePaper, 'office');
                  setShowPrintChoiceModal(false);
                }}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                    Print Office Copy Only
                  </div>
                  <p className="text-xs text-white/60">Prints 1 page: Duplicate for Supplier (Accounts / Office Record)</p>
                </div>
                <FileText className="w-5 h-5 text-amber-400 shrink-0 ml-3" />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrintChoiceModal(false)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX MODAL */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] p-3 bg-[#0D1117] rounded-3xl border border-[#16FFC6]/40 shadow-2xl overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImageModal}
              alt="Received Part / Device Inspection Photo"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl mx-auto"
            />
            <div className="p-3 text-center text-xs font-extrabold text-[#16FFC6] tracking-wider uppercase flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#16FFC6]" /> Received Device Part / Intake Inspection Photo Preview
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Option Modal for +ADD / REMOVE */}
      {optionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F15] border border-white/20 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                {optionModal.type === 'add' ? (
                  <>
                    <Plus className="w-4 h-4 text-[#5ED29C]" />
                    {optionModal.title}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    {optionModal.title}
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {optionModal.error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{optionModal.error}</span>
              </div>
            )}

            {optionModal.type === 'add' ? (
              <form onSubmit={handleConfirmAddOption} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-bold mb-1">Option Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="Enter new option value..."
                    value={optionModal.nameInput}
                    onChange={(e) => setOptionModal((prev) => ({ ...prev, nameInput: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/15 text-white text-xs focus:border-[#5ED29C] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
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
                  &ldquo;{optionModal.currentValue || 'Selected Option'}&rdquo;
                </div>
                <p className="text-[11px] text-white/50">
                  This option will be removed from future selection dropdowns.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOptionModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRemoveOption}
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
}
