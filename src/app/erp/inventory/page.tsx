'use client';

import React, { useState } from 'react';
import {
  Package, Plus, Search, Trash2, Edit3, X, Check, Image as ImageIcon,
  Tag, Shield, AlertTriangle, Layers, ArrowUpRight, Barcode, Layers3,
  Sliders, Settings, Landmark, ShieldCheck, CheckCircle2, FileText,
  List, LayoutGrid, Upload, Wrench, Cpu, Monitor, Zap, HardDrive, Disc,
  Printer, CheckCircle, AlertCircle as WarningIcon, DollarSign, Truck, ChevronDown, RefreshCw
} from 'lucide-react';
import { useErpStore, InventoryItem, HsnMasterItem } from '@/lib/store';
import {
  fetchInventoryFromSupabase,
  pushInventoryToSupabase,
  deleteInventoryFromSupabase,
  pushHsnMasterToSupabase,
  deleteHsnMasterFromSupabase,
} from '@/lib/supabase-sync';

export default function InventoryPage() {
  const {
    inventory,
    setInventory,
    inventoryRules,
    hsnCodes,
    companyDetails,
    vendors: storeVendors,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addHsnCode,
    updateHsnCode,
    deleteHsnCode,
  } = useErpStore();
  
  const [isMounted, setIsMounted] = React.useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const syncInventoryFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Syncing Cloud...');
    try {
      const cloudData = await fetchInventoryFromSupabase();
      if (cloudData && Array.isArray(cloudData)) {
        setInventory(cloudData);
        setSyncStatusMsg(`Synced ${cloudData.length} from Supabase Cloud`);
        setTimeout(() => setSyncStatusMsg(null), 3000);
      } else {
        setSyncStatusMsg('Sync completed');
        setTimeout(() => setSyncStatusMsg(null), 3000);
      }
    } catch (e) {
      console.warn('Inventory sync error:', e);
      setSyncStatusMsg('Offline / Retrying');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    setIsMounted(true);
    syncInventoryFromCloud();
  }, []);

  const [search, setSearch] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'All' | 'Retail Part' | 'Service Part'>('All');

  // Display Format State: List View vs Box Grid View
  const [viewMode, setViewMode] = useState<'tabular' | 'grid'>(inventoryRules?.displayFormat || 'tabular');
  
  // Modal state for Inventory Item: null = closed, 'new' = creating, InventoryItem = editing
  const [activeItemModal, setActiveItemModal] = useState<'new' | InventoryItem | null>(null);

  // Modal state for HSN Settings Manager
  const [isHsnManagerOpen, setIsHsnManagerOpen] = useState(false);

  // Modal state for Interactive Assembled PC Builder Studio
  const [isPcBuilderOpen, setIsPcBuilderOpen] = useState(false);

  // Inline HSN Creator inside Modal State
  const [showInlineHsnCreator, setShowInlineHsnCreator] = useState(false);
  const [inlineHsnForm, setInlineHsnForm] = useState({ hsnCode: '', gstRate: 18, description: '' });

  // Default Options with LocalStorage Persistence
  const DEFAULT_INVENTORY_CATEGORIES = [
    'Processor (CPU)',
    'Motherboard',
    'Memory (RAM)',
    'Storage Devices',
    'Graphics Card (GPU)',
    'Power Supply Unit (PSU)',
    'PC Cabinet / Chassis',
    'Cooling System',
    'Case Fans & RGB Accessories',
    'Peripherals & Monitor',
    'Screen & Display Rework',
    'Power Adaptors & Cables',
    'BGA IC & SMD Components',
  ];

  const DEFAULT_UOMS = ['pcs', 'set', 'unit', 'meter', 'box', 'pack', 'roll', 'kit'];
  const DEFAULT_ACTIVE_STATUSES = ['Active', 'Discontinued', 'Out of Stock', 'Reserved'];
  const DEFAULT_VENDOR_OPTIONS = [
    'Supertron Electronics Pvt Ltd',
    'Ingram Micro India',
    'Savex Technologies',
    'Cleanroom Data Recovery Labs',
    'Vaidik InfoTech Labs',
  ];
  const DEFAULT_STORAGE_LOCATIONS = [
    'Shelf A-1, Bin 01',
    'Shelf A-2, Bin 01',
    'Shelf A-4, Bin 12',
    'Rack B-1, Lock 3',
    'Main Store Room',
    'Service Rework Bench 02',
  ];
  const DEFAULT_PRODUCT_GROUPS = [
    'Intel 14th Gen Desktop CPUs',
    'AMD Ryzen 7000 Series',
    'Intel Z790 Gaming Series',
    'AMD AM5 Motherboards',
    'High Speed DDR5 RAM',
    'High Speed NVMe Storage',
    'NVIDIA RTX 40-Series GPUs',
    'Corsair RM Series Modular PSUs',
    'Lian Li O11 Series Cases',
    'Liquid AIO CPU Coolers',
    'Laptop BGA & Reballing Supplies',
  ];
  const DEFAULT_CONVERSION_UNITS = ['box', 'carton', 'bundle', 'strip'];
  const DEFAULT_WARRANTIES = [
    '3 Years Manufacturer Warranty',
    '1 Year Brand Warranty',
    '6 Months Repair Rework Warranty',
    '90 Days Service Guarantee',
    'No Warranty / Testing Only',
  ];

  // Dynamic Options with Add & Remove capability
  const [categories, setCategories] = useState<string[]>(DEFAULT_INVENTORY_CATEGORIES);
  const [uoms, setUoms] = useState<string[]>(DEFAULT_UOMS);
  const [activeStatuses, setActiveStatuses] = useState<string[]>(DEFAULT_ACTIVE_STATUSES);
  const [vendorOptions, setVendorOptions] = useState<string[]>(DEFAULT_VENDOR_OPTIONS);
  const [storageLocations, setStorageLocations] = useState<string[]>(DEFAULT_STORAGE_LOCATIONS);
  const [productGroups, setProductGroups] = useState<string[]>(DEFAULT_PRODUCT_GROUPS);
  const [conversionUnits, setConversionUnits] = useState<string[]>(DEFAULT_CONVERSION_UNITS);
  const [warranties, setWarranties] = useState<string[]>(DEFAULT_WARRANTIES);

  // In-App Modal Dialog for +ADD and REMOVE dropdown options
  const [optionModal, setOptionModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    field: 'category' | 'productGroup' | 'storageLocation' | 'uom' | 'vendor' | 'warranty';
    title: string;
    currentValue?: string;
    nameInput: string;
    error?: string;
  }>({
    isOpen: false,
    type: 'add',
    field: 'category',
    title: '',
    nameInput: '',
  });

  // Load persisted dropdown options on mount
  React.useEffect(() => {
    try {
      const sCat = localStorage.getItem('accno_inventory_categories');
      if (sCat) setCategories(JSON.parse(sCat));
      const sGrp = localStorage.getItem('accno_inventory_product_groups');
      if (sGrp) setProductGroups(JSON.parse(sGrp));
      const sLoc = localStorage.getItem('accno_inventory_storage_locations');
      if (sLoc) setStorageLocations(JSON.parse(sLoc));
      const sUom = localStorage.getItem('accno_inventory_uoms');
      if (sUom) setUoms(JSON.parse(sUom));
      const sVen = localStorage.getItem('accno_inventory_vendor_options');
      if (sVen) setVendorOptions(JSON.parse(sVen));
      const sWar = localStorage.getItem('accno_inventory_warranties');
      if (sWar) setWarranties(JSON.parse(sWar));
    } catch {}
  }, []);

  // Inventory Form State
  const defaultFormData = {
    itemType: 'Retail Part' as 'Retail Part' | 'Service Part',
    name: '',
    category: 'Processor (CPU)',
    uom: 'pcs',
    defaultQuantity: 1,
    sellingPrice: 0,
    mrp: 0,
    costPrice: 0,
    currentStock: 10,
    lowStockAlert: 3,
    activeStatus: 'Active',
    hsnCode: hsnCodes[0]?.hsnCode || '84713010',
    gstRate: hsnCodes[0]?.gstRate || 18,
    barcode: '',
    productImage: '',
    productGroup: 'Intel 14th Gen Desktop CPUs',
    description: '',
    productCondition: 'New' as 'New' | 'Refurbished',
    refurbishedDescription: '',

    compatibleModels: '',
    comfortabilityFeatures: '',
    supplierVendor: 'Ingram Micro India',
    storageLocation: 'Shelf A-1, Bin 01',
    conversionFactor: 1,
    conversionUnit: 'box',
    openingBalance: 10,
  };

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'code'>>(defaultFormData);

  // Assembled PC Builder State
  const [pcBuildForm, setPcBuildForm] = useState({
    buildName: 'Custom Extreme Gaming / Workstation PC',
    assemblyLaborFee: 1500,
    category: 'PC Cabinet / Chassis',
    productGroup: 'Custom PC Builds',
    hsnCode: '84713010',
    gstRate: 18,
    barcode: `DESK-${Math.floor(100000 + Math.random() * 900000)}`,
    productImage: '',
    storageLocation: 'Main Store Room',
    uom: 'pcs',
    warrantyPeriod: '1 Year Comprehensive Warranty',
    notes: 'Professional custom gaming build stress tested for 24 hours.',
  });

  const handlePcImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPcBuildForm((prev) => ({ ...prev, productImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [newOptionInput, setNewOptionInput] = useState<{ [key: string]: string }>({});

  // Search filter states for Category, Product Group, and HSN Code dropdowns inside Modal
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [productGroupSearchQuery, setProductGroupSearchQuery] = useState('');
  const [hsnSearchQuery, setHsnSearchQuery] = useState('');
  const [activeDropdownOpen, setActiveDropdownOpen] = useState<'category' | 'productGroup' | 'hsnCode' | null>(null);

  const handleOpenNewModal = (type: 'Retail Part' | 'Service Part' = 'Retail Part') => {
    const defaultHsn = hsnCodes[0] || { hsnCode: '84713010', gstRate: 18 };
    setCategorySearchQuery('');
    setProductGroupSearchQuery('');
    setHsnSearchQuery('');
    setActiveDropdownOpen(null);
    setFormData({
      ...defaultFormData,
      itemType: type,
      category: type === 'Retail Part' ? 'Processor (CPU)' : 'Screen & Display Rework',
      uom: uoms[0] || 'pcs',
      productGroup: type === 'Retail Part' ? productGroups[0] : 'Laptop BGA & Reballing Supplies',
      hsnCode: defaultHsn.hsnCode,
      gstRate: defaultHsn.gstRate,
      barcode: `${type === 'Retail Part' ? 'PRT' : 'SRV'}${Math.floor(100000 + Math.random() * 900000)}`,
      supplierVendor: vendorOptions[0] || 'Ingram Micro India',
      storageLocation: storageLocations[0] || 'Shelf A-1, Bin 01',
    });
    setShowInlineHsnCreator(false);
    setActiveItemModal('new');
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    if (item.category && !categories.includes(item.category)) setCategories((prev) => [...prev, item.category as string]);
    if (item.productGroup && !productGroups.includes(item.productGroup)) setProductGroups((prev) => [...prev, item.productGroup as string]);
    if (item.storageLocation && !storageLocations.includes(item.storageLocation)) setStorageLocations((prev) => [...prev, item.storageLocation as string]);
    if (item.uom && !uoms.includes(item.uom)) setUoms((prev) => [...prev, item.uom as string]);
    if (item.supplierVendor && !vendorOptions.includes(item.supplierVendor)) setVendorOptions((prev) => [...prev, item.supplierVendor as string]);
    if (item.compatibleModels && !warranties.includes(item.compatibleModels)) setWarranties((prev) => [...prev, item.compatibleModels as string]);

    setCategorySearchQuery('');
    setProductGroupSearchQuery('');
    setHsnSearchQuery('');
    setActiveDropdownOpen(null);

    setFormData({
      itemType: item.itemType,
      name: item.name,
      category: item.category || categories[0],
      uom: item.uom || uoms[0],
      defaultQuantity: item.defaultQuantity || 1,
      sellingPrice: item.sellingPrice || 0,
      mrp: item.mrp || 0,
      costPrice: item.costPrice || 0,
      currentStock: item.currentStock || 0,
      lowStockAlert: item.lowStockAlert || 2,
      activeStatus: item.activeStatus || 'Active',
      hsnCode: item.hsnCode || '84713010',
      gstRate: item.gstRate || 18,
      barcode: item.barcode || '',
      productImage: item.productImage || '',
      productGroup: item.productGroup || productGroups[0],
      description: item.description || '',
      productCondition: item.productCondition || 'New',
      refurbishedDescription: item.refurbishedDescription || '',

      compatibleModels: item.compatibleModels || '',
      comfortabilityFeatures: item.comfortabilityFeatures || '',
      supplierVendor: item.supplierVendor || vendorOptions[0],
      storageLocation: item.storageLocation || storageLocations[0],
      conversionFactor: item.conversionFactor || 1,
      conversionUnit: item.conversionUnit || conversionUnits[0],
      openingBalance: item.openingBalance || item.currentStock,
    });
    setShowInlineHsnCreator(false);
    setActiveItemModal(item);
  };

  const handleSubmitItemForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter Product / Part Name.');
      return;
    }

    if (activeItemModal === 'new') {
      const generatedId = `i-${Date.now()}`;
      const newItemData = { ...formData, id: generatedId };
      addInventoryItem(newItemData);
      pushInventoryToSupabase(newItemData as any).catch(() => {});
      
      if (activeSlotForNewPart) {
        handleUpdateSlot(activeSlotForNewPart, { selectedItemId: generatedId, category: formData.category });
        setActiveSlotForNewPart(null);
      }
      alert(`Product "${formData.name}" created and saved successfully!`);
    } else if (activeItemModal && typeof activeItemModal === 'object') {
      updateInventoryItem(activeItemModal.id, formData);
      pushInventoryToSupabase({ ...activeItemModal, ...formData } as any).catch(() => {});
      alert(`Product "${formData.name}" updated and saved successfully!`);
    }
    setActiveItemModal(null);
  };

  const handleDeleteItem = () => {
    if (typeof activeItemModal === 'object' && activeItemModal !== null) {
      if (confirm(`Are you sure you want to delete inventory item "${activeItemModal.name}"?`)) {
        deleteInventoryItem(activeItemModal.id);
        deleteInventoryFromSupabase(activeItemModal.id).catch(() => {});
        setActiveItemModal(null);
      }
    }
  };

  // Image Upload File Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, productImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Inline HSN Creator Handler
  const handleCreateInlineHsn = () => {
    if (!inlineHsnForm.hsnCode.trim()) {
      alert('Please enter a valid HSN Code (e.g. 84713020).');
      return;
    }
    const newHsn: HsnMasterItem = {
      hsnCode: inlineHsnForm.hsnCode.trim(),
      gstRate: Number(inlineHsnForm.gstRate || 18),
      description: inlineHsnForm.description.trim() || 'Custom Part HSN Code',
    };
    addHsnCode(newHsn);
    pushHsnMasterToSupabase(newHsn).catch(() => {});
    setFormData({
      ...formData,
      hsnCode: newHsn.hsnCode,
      gstRate: newHsn.gstRate,
    });
    setInlineHsnForm({ hsnCode: '', gstRate: 18, description: '' });
    setShowInlineHsnCreator(false);
  };

  // LocalStorage persistence helpers
  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('accno_inventory_categories', JSON.stringify(updated));
    } catch {}
  };

  const saveProductGroups = (updated: string[]) => {
    setProductGroups(updated);
    try {
      localStorage.setItem('accno_inventory_product_groups', JSON.stringify(updated));
    } catch {}
  };

  const saveStorageLocations = (updated: string[]) => {
    setStorageLocations(updated);
    try {
      localStorage.setItem('accno_inventory_storage_locations', JSON.stringify(updated));
    } catch {}
  };

  const saveUoms = (updated: string[]) => {
    setUoms(updated);
    try {
      localStorage.setItem('accno_inventory_uoms', JSON.stringify(updated));
    } catch {}
  };

  const saveVendorOptions = (updated: string[]) => {
    setVendorOptions(updated);
    try {
      localStorage.setItem('accno_inventory_vendor_options', JSON.stringify(updated));
    } catch {}
  };

  const saveWarranties = (updated: string[]) => {
    setWarranties(updated);
    try {
      localStorage.setItem('accno_inventory_warranties', JSON.stringify(updated));
    } catch {}
  };

  const openAddModal = (
    field: 'category' | 'productGroup' | 'storageLocation' | 'uom' | 'vendor' | 'warranty',
    title: string
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      field,
      title,
      nameInput: '',
      error: undefined,
    });
  };

  const openRemoveModal = (
    field: 'category' | 'productGroup' | 'storageLocation' | 'uom' | 'vendor' | 'warranty',
    title: string,
    currentValue?: string
  ) => {
    setOptionModal({
      isOpen: true,
      type: 'remove',
      field,
      title,
      currentValue: currentValue || 'Current Selection',
      nameInput: '',
      error: undefined,
    });
  };

  const handleConfirmAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const val = optionModal.nameInput.trim();
    if (!val) {
      setOptionModal((prev) => ({ ...prev, error: 'Option value cannot be empty' }));
      return;
    }

    if (optionModal.field === 'category') {
      if (categories.some((c) => c.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This category already exists.' }));
        return;
      }
      const updated = [...categories, val];
      saveCategories(updated);
      setFormData((prev) => ({ ...prev, category: val }));
    } else if (optionModal.field === 'productGroup') {
      if (productGroups.some((g) => g.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This product group already exists.' }));
        return;
      }
      const updated = [...productGroups, val];
      saveProductGroups(updated);
      setFormData((prev) => ({ ...prev, productGroup: val }));
    } else if (optionModal.field === 'storageLocation') {
      if (storageLocations.some((l) => l.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This storage location already exists.' }));
        return;
      }
      const updated = [...storageLocations, val];
      saveStorageLocations(updated);
      setFormData((prev) => ({ ...prev, storageLocation: val }));
    } else if (optionModal.field === 'uom') {
      if (uoms.some((u) => u.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This unit of measurement already exists.' }));
        return;
      }
      const updated = [...uoms, val];
      saveUoms(updated);
      setFormData((prev) => ({ ...prev, uom: val }));
    } else if (optionModal.field === 'vendor') {
      if (vendorOptions.some((v) => v.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This supplier vendor already exists.' }));
        return;
      }
      const updated = [...vendorOptions, val];
      saveVendorOptions(updated);
      setFormData((prev) => ({ ...prev, supplierVendor: val }));
    } else if (optionModal.field === 'warranty') {
      if (warranties.some((w) => w.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This warranty option already exists.' }));
        return;
      }
      const updated = [...warranties, val];
      saveWarranties(updated);
      setFormData((prev) => ({ ...prev, compatibleModels: val }));
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmRemoveOption = () => {
    if (optionModal.field === 'category') {
      if (categories.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one category must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.category;
      const updated = categories.filter((c) => c !== target);
      saveCategories(updated);
      if (formData.category === target) {
        setFormData((prev) => ({ ...prev, category: updated[0] || '' }));
      }
    } else if (optionModal.field === 'productGroup') {
      if (productGroups.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one product group must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.productGroup;
      const updated = productGroups.filter((g) => g !== target);
      saveProductGroups(updated);
      if (formData.productGroup === target) {
        setFormData((prev) => ({ ...prev, productGroup: updated[0] || '' }));
      }
    } else if (optionModal.field === 'storageLocation') {
      if (storageLocations.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one storage location must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.storageLocation;
      const updated = storageLocations.filter((l) => l !== target);
      saveStorageLocations(updated);
      if (formData.storageLocation === target) {
        setFormData((prev) => ({ ...prev, storageLocation: updated[0] || '' }));
      }
    } else if (optionModal.field === 'uom') {
      if (uoms.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one unit of measurement must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.uom;
      const updated = uoms.filter((u) => u !== target);
      saveUoms(updated);
      if (formData.uom === target) {
        setFormData((prev) => ({ ...prev, uom: updated[0] || '' }));
      }
    } else if (optionModal.field === 'vendor') {
      if (vendorOptions.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one supplier vendor must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.supplierVendor;
      const updated = vendorOptions.filter((v) => v !== target);
      saveVendorOptions(updated);
      if (formData.supplierVendor === target) {
        setFormData((prev) => ({ ...prev, supplierVendor: updated[0] || '' }));
      }
    } else if (optionModal.field === 'warranty') {
      if (warranties.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one warranty option must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.compatibleModels;
      const updated = warranties.filter((w) => w !== target);
      saveWarranties(updated);
      if (formData.compatibleModels === target) {
        setFormData((prev) => ({ ...prev, compatibleModels: updated[0] || '' }));
      }
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync unique options from store inventory and vendors into dropdown arrays
  React.useEffect(() => {
    if (inventory.length > 0) {
      const invCategories = inventory.map((i) => i.category).filter((x): x is string => Boolean(x));
      setCategories((prev) => Array.from(new Set([...prev, ...invCategories])));

      const invGroups = inventory.map((i) => i.productGroup).filter((x): x is string => Boolean(x));
      setProductGroups((prev) => Array.from(new Set([...prev, ...invGroups])));

      const invLocs = inventory.map((i) => i.storageLocation).filter((x): x is string => Boolean(x));
      setStorageLocations((prev) => Array.from(new Set([...prev, ...invLocs])));

      const invUoms = inventory.map((i) => i.uom).filter((x): x is string => Boolean(x));
      setUoms((prev) => Array.from(new Set([...prev, ...invUoms])));

      const invVendors = [
        ...storeVendors.map((v) => v.name || v.contactPerson).filter((x): x is string => Boolean(x)),
        ...inventory.map((i) => i.supplierVendor).filter((x): x is string => Boolean(x))
      ];
      setVendorOptions((prev) => Array.from(new Set([...prev, ...invVendors])));

      const invWarranties = inventory.map((i) => i.compatibleModels).filter((x): x is string => Boolean(x));
      setWarranties((prev) => Array.from(new Set([...prev, ...invWarranties])));
    }
  }, [inventory, storeVendors]);

  // Filtered dropdown lists for search functionality inside Modal
  const filteredCategoriesList = categories.filter((c) =>
    c.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const filteredProductGroupsList = productGroups.filter((g) =>
    g.toLowerCase().includes(productGroupSearchQuery.toLowerCase())
  );

  const filteredHsnCodesList = hsnCodes.filter((h) =>
    h.hsnCode.toLowerCase().includes(hsnSearchQuery.toLowerCase()) ||
    (h.description && h.description.toLowerCase().includes(hsnSearchQuery.toLowerCase())) ||
    `${h.gstRate}%`.includes(hsnSearchQuery)
  );

  // Unified Dynamic Component Slots State System
  const initialStudioSlots: {
    id: string;
    slotName: string;
    category: string;
    selectedItemId: string;
    qty: number;
    isDefault?: boolean;
  }[] = [
    { id: 'slot-cpu', slotName: '1. Processor (CPU)', category: 'Processor (CPU)', selectedItemId: inventory.find((i: any) => i.category === 'Processor (CPU)')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-mobo', slotName: '2. Motherboard', category: 'Motherboard', selectedItemId: inventory.find((i: any) => i.category === 'Motherboard')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-ram', slotName: '3. Memory (RAM)', category: 'Memory (RAM)', selectedItemId: inventory.find((i: any) => i.category === 'Memory (RAM)')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-storage', slotName: '4. Storage (NVMe / HDD)', category: 'Storage Devices', selectedItemId: inventory.find((i: any) => i.category === 'Storage Devices')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-gpu', slotName: '5. Graphics Card (GPU)', category: 'Graphics Card (GPU)', selectedItemId: inventory.find((i: any) => i.category === 'Graphics Card (GPU)')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-psu', slotName: '6. Power Supply (PSU)', category: 'Power Supply Unit (PSU)', selectedItemId: inventory.find((i: any) => i.category === 'Power Supply Unit (PSU)')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-cabinet', slotName: '7. PC Cabinet / Chassis', category: 'PC Cabinet / Chassis', selectedItemId: inventory.find((i: any) => i.category === 'PC Cabinet / Chassis')?.id || '', qty: 1, isDefault: true },
    { id: 'slot-cooler', slotName: '8. CPU Cooling System', category: 'Cooling System', selectedItemId: inventory.find((i: any) => i.category === 'Cooling System')?.id || '', qty: 1, isDefault: true },
  ];

  const [pcSlots, setPcSlots] = useState(initialStudioSlots);
  const [activeSlotForNewPart, setActiveSlotForNewPart] = useState<string | null>(null);
  const [newSlotCategoryInput, setNewSlotCategoryInput] = useState('Case Fans & Accessories');
  const [newSlotTitleInput, setNewSlotTitleInput] = useState('');

  const handleUpdateSlot = (slotId: string, updates: Partial<{ slotName: string; category: string; selectedItemId: string; qty: number }>) => {
    setPcSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        if (updates.category && updates.category !== s.category && !('selectedItemId' in updates)) {
          return { ...s, ...updates, selectedItemId: '' };
        }
        return { ...s, ...updates };
      })
    );
  };

  const handleDeleteSlot = (slotId: string) => {
    setPcSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleAddSlotForCategory = (catName?: string, customTitle?: string) => {
    const targetCat = catName || newSlotCategoryInput || categories[0] || 'Retail Part';
    const nextNo = pcSlots.length + 1;
    const title = customTitle || newSlotTitleInput.trim() || `${nextNo}. ${targetCat}`;
    const newSlot = {
      id: `slot-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      slotName: title,
      category: targetCat,
      selectedItemId: '',
      qty: 1,
      isDefault: false,
    };
    setPcSlots((prev) => [...prev, newSlot]);
    setNewSlotTitleInput('');
  };

  const handleOpenNewPartForSlot = (slotId: string, category: string) => {
    setActiveSlotForNewPart(slotId);
    const defaultHsn = hsnCodes[0] || { hsnCode: '84713010', gstRate: 18 };
    setFormData({
      ...defaultFormData,
      itemType: 'Retail Part',
      category: category || categories[0],
      uom: uoms[0] || 'pcs',
      productGroup: productGroups[0],
      hsnCode: defaultHsn.hsnCode,
      gstRate: defaultHsn.gstRate,
      barcode: `PRT${Math.floor(100000 + Math.random() * 900000)}`,
      supplierVendor: vendorOptions[0] || 'Ingram Micro India',
      storageLocation: storageLocations[0] || 'Shelf A-1, Bin 01',
    });
    setShowInlineHsnCreator(false);
    setActiveItemModal('new');
  };

  const handleModifyPartInSlot = (partId: string) => {
    const item = inventory.find((i: any) => i.id === partId);
    if (item) handleOpenEditModal(item);
  };

  // Assembled PC Builder helper calculations
  const getSelectedPart = (id: string) => inventory.find((i: any) => i.id === id);

  // Dynamic parts list from unified pcSlots
  const buildPartsList = pcSlots
    .map((slot) => {
      const part = getSelectedPart(slot.selectedItemId);
      return part ? { part, qty: slot.qty, slotName: slot.slotName, category: slot.category, slotId: slot.id } : null;
    })
    .filter(Boolean) as { part: InventoryItem; qty: number; slotName: string; category: string; slotId: string }[];

  const totalBuildCost = buildPartsList.reduce((acc: number, item: any) => acc + item.part.costPrice * item.qty, 0);
  const totalBuildSelling = buildPartsList.reduce((acc: number, item: any) => acc + item.part.sellingPrice * item.qty, 0) + pcBuildForm.assemblyLaborFee;
  const totalBuildMargin = totalBuildSelling - totalBuildCost;

  // Compatibility checking
  const cpuSlot = pcSlots.find((s: any) => s.category === 'Processor (CPU)' || s.slotName.toLowerCase().includes('processor') || s.slotName.toLowerCase().includes('cpu'));
  const moboSlot = pcSlots.find((s: any) => s.category === 'Motherboard' || s.slotName.toLowerCase().includes('motherboard'));
  const selectedCpu = cpuSlot ? getSelectedPart(cpuSlot.selectedItemId) : null;
  const selectedMobo = moboSlot ? getSelectedPart(moboSlot.selectedItemId) : null;

  const compatibilityIssues: string[] = [];
  if (selectedCpu && selectedMobo) {
    const cpuSpecs = (selectedCpu.comfortabilityFeatures || selectedCpu.description || '').toUpperCase();
    const moboSpecs = (selectedMobo.comfortabilityFeatures || selectedMobo.description || '').toUpperCase();
    if (cpuSpecs.includes('LGA1700') && !moboSpecs.includes('LGA1700') && !moboSpecs.includes('Z790') && !moboSpecs.includes('B760')) {
      compatibilityIssues.push('Warning: Socket LGA1700 Intel CPU requires an LGA1700 (Z790/B760) Motherboard.');
    }
    if (cpuSpecs.includes('AM5') && !moboSpecs.includes('AM5') && !moboSpecs.includes('B650') && !moboSpecs.includes('X670')) {
      compatibilityIssues.push('Warning: Socket AM5 Ryzen CPU requires an AMD AM5 Motherboard.');
    }
  }

  // Print PC Builder Quotation
  const handlePrintPcQuotation = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>PC Assembly Quotation - ${pcBuildForm.buildName}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #111; }
            h1 { margin-bottom: 5px; color: #0f172a; }
            .meta { color: #64748b; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
            th { background: #f1f5f9; text-transform: uppercase; font-size: 11px; }
            .total { font-weight: bold; font-size: 16px; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>${companyDetails.companyLegalName}</h1>
          <p class="meta">CUSTOM PC BUILD QUOTATION • Date: ${new Date().toLocaleDateString()} • Warranty: ${pcBuildForm.warrantyPeriod} • Location: ${pcBuildForm.storageLocation}</p>
          <h2>${pcBuildForm.buildName}</h2>
          <table>
            <thead>
              <tr>
                <th>Component Slot</th>
                <th>Part Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${buildPartsList.map((item: any) => `
                <tr>
                  <td>${item.slotName}</td>
                  <td>${item.part.name}</td>
                  <td>${item.part.hsnCode}</td>
                  <td>${item.qty}</td>
                  <td>₹${item.part.sellingPrice.toLocaleString()}</td>
                  <td>₹${(item.part.sellingPrice * item.qty).toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="5"><strong>PC Assembly, Stress Testing & OS Configuration Fee</strong></td>
                <td><strong>₹${pcBuildForm.assemblyLaborFee.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Grand Total (Incl. Taxes): ₹${totalBuildSelling.toLocaleString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Save Assembled PC as New Inventory SKU & Deduct Component Stocks
  const handleSavePcAsSku = () => {
    const skuCode = pcBuildForm.barcode || `DESK-${Math.floor(100000 + Math.random() * 900000)}`;
    const fallbackImage = buildPartsList.find((item: any) => item.part.productImage)?.part.productImage || '';
    const masterImage = pcBuildForm.productImage || fallbackImage;
    const partsSummary = buildPartsList.map((item: any) => `${item.slotName}: ${item.part.name} [x${item.qty}]`).join(' • ');
    
    addInventoryItem({
      itemType: 'Retail Part',
      name: pcBuildForm.buildName,
      category: pcBuildForm.category || 'PC Cabinet / Chassis',
      uom: pcBuildForm.uom || 'pcs',
      defaultQuantity: 1,
      sellingPrice: totalBuildSelling,
      costPrice: totalBuildCost,
      mrp: totalBuildSelling + 5000,
      currentStock: 1,
      lowStockAlert: 1,
      activeStatus: 'Active',
      hsnCode: pcBuildForm.hsnCode || '84713010',
      gstRate: pcBuildForm.gstRate || 18,
      barcode: skuCode,
      productImage: masterImage,
      productGroup: pcBuildForm.productGroup || 'Custom PC Builds',
      description: `Assembled Desktop PC comprising: ${partsSummary}.\nNotes: ${pcBuildForm.notes}`,
      comfortabilityFeatures: `Assembled Parts: ${partsSummary}`,
      storageLocation: pcBuildForm.storageLocation || 'Main Store Room',
      supplierVendor: 'In-House Assembly Lab',
      conversionFactor: 1,
      conversionUnit: pcBuildForm.uom || 'pcs',
      openingBalance: 1,
    });

    // Automatically deduct stock for each component used in build
    buildPartsList.forEach((item: any) => {
      const updatedStock = Math.max(0, (item.part.currentStock || 0) - item.qty);
      updateInventoryItem(item.part.id, { currentStock: updatedStock });
    });

    alert(`Desktop SKU "${pcBuildForm.buildName}" (${skuCode}) saved to Inventory Master successfully!\nStock deducted for all ${buildPartsList.length} assembled components.`);
    setIsPcBuilderOpen(false);
  };

  // Filter Inventory
  const filteredInventory = inventory.filter((item: any) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.hsnCode.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      (item.barcode && item.barcode.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      activeTypeFilter === 'All' || item.itemType === activeTypeFilter;

    return matchesSearch && matchesType;
  });

  // Calculate profit margin %
  const currentCost = Number(formData.costPrice || 0);
  const currentSelling = Number(formData.sellingPrice || 0);
  const profitMarginPercent = currentCost > 0 ? (((currentSelling - currentCost) / currentCost) * 100).toFixed(1) : '0.0';



  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070B0E] text-white p-6 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-[#5ED29C] text-sm font-bold">
          <span className="w-3 h-3 rounded-full bg-[#5ED29C] animate-ping" />
          Loading Inventory Directory...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Package className="w-6 h-6 text-[#5ED29C]" />
            PRODUCTS &amp; INVENTORY DIRECTORY<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Retail Parts ({inventoryRules?.retailPrefix || 'PRT-'}{inventoryRules?.retailStartWithNo || 1001}) &amp; Service Rework Components ({inventoryRules?.servicePrefix || 'SRV-'}{inventoryRules?.serviceStartWithNo || 1001}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {syncStatusMsg && (
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] font-semibold animate-pulse">
              {syncStatusMsg}
            </span>
          )}

          <button
            onClick={syncInventoryFromCloud}
            disabled={isSyncing}
            className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isSyncing
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/15'
            }`}
            title="Synchronize inventory with Supabase Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-[#5ED29C]'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            onClick={() => handleOpenNewModal('Retail Part')}
            className="px-4 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5"
          >
            <Tag className="w-4 h-4" /> + Create New Retail Part
          </button>

          <button
            onClick={() => handleOpenNewModal('Service Part')}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4" /> + Create New Service Part
          </button>

          <button
            onClick={() => setIsPcBuilderOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4 text-blue-200" /> Custom PC Builder
          </button>

          <button
            onClick={() => setIsHsnManagerOpen(true)}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-bold text-xs uppercase border border-white/10 flex items-center gap-1.5"
          >
            <Landmark className="w-4 h-4 text-[#16FFC6]" /> HSN Master
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['All', 'Retail Part', 'Service Part'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTypeFilter === t
                  ? t === 'Service Part'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/20'
                  : 'bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              {t === 'All' ? 'All Inventory' : t}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SKU code, HSN, barcode..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('tabular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'tabular'
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Box Grid View
            </button>
          </div>
        </div>
      </div>

      {/* TABULAR LIST VIEW */}
      {viewMode === 'tabular' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">SKU Code &amp; Image</th>
                <th className="p-4">Product Name &amp; Group</th>
                <th className="p-4">Category &amp; Location</th>
                <th className="p-4">Cost vs Selling Price</th>
                <th className="p-4">HSN &amp; GST</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInventory.map((item: any) => {
                const isService = item.itemType === 'Service Part';
                const margin = item.costPrice > 0 ? (((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(0) : '0';
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-xl border border-white/10 bg-slate-950"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span className={`font-mono font-bold px-2.5 py-1 rounded-full text-xs border ${
                          isService
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-[#5ED29C]/10 text-[#5ED29C] border-[#5ED29C]/30'
                        }`}>
                          {item.code}
                        </span>
                        <span className="block text-[10px] text-white/40 mt-1 uppercase">{item.itemType}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-[10px] text-white/50">{item.productGroup || 'General Inventory'}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-white/90 font-semibold">{item.category}</div>
                      <div className="text-[10px] text-white/40">{item.storageLocation || 'Main Store Room'}</div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-[#5ED29C] text-sm">₹{item.sellingPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-white/50">Cost: ₹{item.costPrice.toLocaleString()} ({margin}% profit)</div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-[#16FFC6]">{item.hsnCode}</div>
                      <div className="text-[10px] text-white/50">{item.gstRate}% GST</div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className={`font-bold text-sm ${item.currentStock <= item.lowStockAlert ? 'text-amber-400' : 'text-white'}`}>
                        {item.currentStock} {item.uom}
                      </div>
                      {item.currentStock <= item.lowStockAlert && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                          LOW STOCK
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#5ED29C] text-white hover:text-[#070B0A] font-bold text-xs uppercase transition-all"
                      >
                        Modify / View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* BOX GRID VIEW (4 PRODUCTS PER ROW WITH SQUARE IMAGES) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item: any) => {
            const isService = item.itemType === 'Service Part';
            return (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-3xl border border-white/10 hover:border-[#5ED29C]/40 transition-all space-y-3.5 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* SQUARE PRODUCT IMAGE BANNER */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-white/10 mb-2 flex items-center justify-center relative shadow-md">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.name} className="w-full h-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full h-full aspect-square flex flex-col items-center justify-center text-white/30 bg-gradient-to-b from-white/5 to-transparent">
                        <Package className="w-10 h-10 text-white/30" />
                        <span className="text-[9px] font-mono font-bold text-white/30 uppercase mt-1">SQUARE IMAGE</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className={`font-mono font-bold px-3 py-1 rounded-full text-xs border ${
                      isService
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-[#5ED29C]/10 text-[#5ED29C] border-[#5ED29C]/30'
                    }`}>
                      {item.code}
                    </span>

                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10">
                      {item.itemType}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">{item.name}</h3>
                      {item.productCondition === 'Refurbished' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black uppercase shrink-0">
                          Refurbished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">{item.category}</p>
                    <p className="text-[10px] text-white/40">{item.productGroup}</p>
                    {item.productCondition === 'Refurbished' && item.refurbishedDescription && (
                      <p className="text-[10px] text-amber-300/80 font-mono italic mt-1 bg-amber-950/30 p-1.5 rounded-lg border border-amber-500/20">
                        {item.refurbishedDescription}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase">Selling Price</span>
                      <span className="font-bold text-[#5ED29C] text-sm">₹{item.sellingPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-sans">Current Stock</span>
                      <span className={`font-bold text-sm ${item.currentStock <= item.lowStockAlert ? 'text-amber-400' : 'text-white'}`}>
                        {item.currentStock} {item.uom}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="w-full py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider transition-all"
                  >
                    Modify Item Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INVENTORY ITEM MODAL FOR CREATE NEW RETAIL PART & SERVICE PART */}
      {activeItemModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
          <div className="glass-panel rounded-3xl border border-[#5ED29C]/40 max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden bg-[#0A0E14]">
            
            {/* FROZEN STICKY MODAL TITLE BAR */}
            <div className="sticky top-0 z-30 bg-[#0D131A] px-6 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide text-white flex items-center gap-2.5">
                  <Tag className="w-6 h-6 text-[#5ED29C]" />
                  {activeItemModal === 'new'
                    ? `CREATE NEW ${formData.itemType.toUpperCase()}`
                    : `MODIFY ${formData.itemType.toUpperCase()}: ${activeItemModal.code}`}
                </h2>
                <p className="text-xs text-white/50 mt-0.5 font-medium">
                  Configure inventory SKU classification, category, HSN tax, profit margin engine, part image & stock locations
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE INVENTORY MASTER FORM */}
            <form onSubmit={handleSubmitItemForm} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
              
              {/* SECTION 1: CLASSIFICATION & PRIMARY IDENTITY */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5ED29C]" /> 1. SKU Classification & Primary Identity
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Item Classification *</label>
                    <select
                      value={formData.itemType}
                      onChange={(e) => setFormData({ ...formData, itemType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:border-[#5ED29C] outline-none"
                    >
                      <option value="Retail Part">Retail Part (For Over-the-Counter Sales & PC Builds)</option>
                      <option value="Service Part">Service Part (For In-House Repairs & Rework Jobs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Product / Part Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Intel Core i7-14700K Processor / 15.6 FHD LED Panel"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:border-[#5ED29C] outline-none"
                    />
                  </div>
                </div>

                {/* PRODUCT TYPE (NEW vs REFURBISHED) & 5-LINE CONDITIONAL DESCRIPTION (RETAIL PARTS ONLY) */}
                {formData.itemType === 'Retail Part' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/80 mb-1 font-bold flex items-center justify-between">
                        <span>Product Type / Condition *</span>
                        {formData.productCondition === 'Refurbished' && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] uppercase font-black tracking-wider">
                            Refurbished Product Selected
                          </span>
                        )}
                      </label>
                      <select
                        value={formData.productCondition || 'New'}
                        onChange={(e) => setFormData({ ...formData, productCondition: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:border-[#5ED29C] outline-none"
                      >
                        <option value="New">New (Brand New / Factory Sealed)</option>
                        <option value="Refurbished">Refurbished (Pre-Owned / Tested Working)</option>
                      </select>
                    </div>

                    {/* 5-LINE DESCRIPTION TEXTAREA - APPEARS ONLY WHEN 'Refurbished' IS SELECTED */}
                    {formData.productCondition === 'Refurbished' && (
                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-amber-300 font-bold text-xs uppercase tracking-wider">
                            Refurbished Description & Condition Remarks (5-Line Entry) *
                          </label>
                          <span className="text-[10px] text-amber-400/80 font-mono">Will be printed in bill's remarks area</span>
                        </div>
                        <textarea
                          rows={5}
                          required
                          value={formData.refurbishedDescription || ''}
                          onChange={(e) => setFormData({ ...formData, refurbishedDescription: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#0D1117] border border-amber-500/50 text-amber-200 font-mono text-xs focus:border-amber-400 outline-none resize-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CATEGORY SEARCHABLE DROPDOWN */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Category</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('category', 'Add New Inventory Category')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('category', 'Remove Category Option', formData.category)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdownOpen(activeDropdownOpen === 'category' ? null : 'category');
                        setCategorySearchQuery('');
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{formData.category || 'Select Category...'}</span>
                      <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${activeDropdownOpen === 'category' ? 'rotate-180 text-[#5ED29C]' : ''}`} />
                    </button>

                    {activeDropdownOpen === 'category' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownOpen(null)} />
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0D131A] border border-[#5ED29C]/40 rounded-2xl p-2 shadow-2xl space-y-2 max-h-64 flex flex-col">
                          <div className="relative shrink-0">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-white/40" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Search categories..."
                              value={categorySearchQuery}
                              onChange={(e) => setCategorySearchQuery(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#5ED29C] outline-none"
                            />
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                            {filteredCategoriesList.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, category: c });
                                  setActiveDropdownOpen(null);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  formData.category === c
                                    ? 'bg-[#5ED29C]/20 text-[#5ED29C] font-bold border border-[#5ED29C]/30'
                                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span>{c}</span>
                                {formData.category === c && <Check className="w-3.5 h-3.5 text-[#5ED29C]" />}
                              </button>
                            ))}
                            {filteredCategoriesList.length === 0 && (
                              <div className="p-3 text-center text-xs text-white/40 font-medium">No matching categories found</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* PRODUCT GROUP SEARCHABLE DROPDOWN */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Product Group</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('productGroup', 'Add New Product Group')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('productGroup', 'Remove Product Group Option', formData.productGroup)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdownOpen(activeDropdownOpen === 'productGroup' ? null : 'productGroup');
                        setProductGroupSearchQuery('');
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{formData.productGroup || 'Select Product Group...'}</span>
                      <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${activeDropdownOpen === 'productGroup' ? 'rotate-180 text-[#5ED29C]' : ''}`} />
                    </button>

                    {activeDropdownOpen === 'productGroup' && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownOpen(null)} />
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0D131A] border border-[#5ED29C]/40 rounded-2xl p-2 shadow-2xl space-y-2 max-h-64 flex flex-col">
                          <div className="relative shrink-0">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-white/40" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Search product groups..."
                              value={productGroupSearchQuery}
                              onChange={(e) => setProductGroupSearchQuery(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#5ED29C] outline-none"
                            />
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                            {filteredProductGroupsList.map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, productGroup: g });
                                  setActiveDropdownOpen(null);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  formData.productGroup === g
                                    ? 'bg-[#5ED29C]/20 text-[#5ED29C] font-bold border border-[#5ED29C]/30'
                                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span>{g}</span>
                                {formData.productGroup === g && <Check className="w-3.5 h-3.5 text-[#5ED29C]" />}
                              </button>
                            ))}
                            {filteredProductGroupsList.length === 0 && (
                              <div className="p-3 text-center text-xs text-white/40 font-medium">No matching product groups found</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* HSN CODE & STATUTORY GST RATE SEARCHABLE DROPDOWN */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-white/80 font-bold">HSN Code & Statutory GST Rate *</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowInlineHsnCreator(!showInlineHsnCreator)}
                        className="text-[10px] text-[#5ED29C] font-extrabold uppercase hover:underline cursor-pointer"
                      >
                        {showInlineHsnCreator ? 'Close HSN Configurator' : '+ Configure New HSN Code'}
                      </button>
                      {hsnCodes.length > 1 && (
                        <>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove HSN Code ${formData.hsnCode}?`)) {
                                deleteHsnCode(formData.hsnCode);
                                const remaining = hsnCodes.filter((h: any) => h.hsnCode !== formData.hsnCode);
                                if (remaining[0]) {
                                  setFormData({ ...formData, hsnCode: remaining[0].hsnCode, gstRate: remaining[0].gstRate });
                                }
                              }
                            }}
                            className="text-[10px] text-rose-400 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Remove Selected HSN
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveDropdownOpen(activeDropdownOpen === 'hsnCode' ? null : 'hsnCode');
                      setHsnSearchQuery('');
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#16FFC6] font-mono font-bold focus:border-[#5ED29C] outline-none flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">
                      {formData.hsnCode
                        ? `${formData.hsnCode} (${formData.gstRate}% GST) - ${
                            hsnCodes.find((h) => h.hsnCode === formData.hsnCode)?.description || ''
                          }`
                        : 'Select HSN Code & GST Rate...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${activeDropdownOpen === 'hsnCode' ? 'rotate-180 text-[#16FFC6]' : ''}`} />
                  </button>

                  {activeDropdownOpen === 'hsnCode' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownOpen(null)} />
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0D131A] border border-[#16FFC6]/40 rounded-2xl p-2 shadow-2xl space-y-2 max-h-64 flex flex-col">
                        <div className="relative shrink-0">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#16FFC6]/60" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search HSN code, GST rate % or description..."
                            value={hsnSearchQuery}
                            onChange={(e) => setHsnSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#16FFC6] outline-none font-mono"
                          />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                          {filteredHsnCodesList.map((h) => (
                            <button
                              key={h.hsnCode}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  hsnCode: h.hsnCode,
                                  gstRate: h.gstRate,
                                });
                                setActiveDropdownOpen(null);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                                formData.hsnCode === h.hsnCode
                                  ? 'bg-[#16FFC6]/20 text-[#16FFC6] font-bold border border-[#16FFC6]/30'
                                  : 'text-white/80 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>{h.hsnCode} ({h.gstRate}% GST) - {h.description}</span>
                              {formData.hsnCode === h.hsnCode && <Check className="w-3.5 h-3.5 text-[#16FFC6]" />}
                            </button>
                          ))}
                          {filteredHsnCodesList.length === 0 && (
                            <div className="p-3 text-center text-xs text-white/40 font-medium">No matching HSN codes found</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* INLINE HSN CREATOR */}
                  {showInlineHsnCreator && (
                    <div className="p-4 rounded-xl bg-[#161B22] border border-[#16FFC6]/30 space-y-3 mt-3">
                      <div className="text-[11px] font-bold text-[#16FFC6] uppercase">New HSN & Statutory GST Rate Configurator</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-white/70 mb-1 text-[10px]">HSN Code *</label>
                          <input
                            type="text"
                            placeholder="e.g. 84713020"
                            value={inlineHsnForm.hsnCode}
                            onChange={(e) => setInlineHsnForm({ ...inlineHsnForm, hsnCode: e.target.value })}
                            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1 text-[10px]">GST Tax Rate (%) *</label>
                          <select
                            value={inlineHsnForm.gstRate}
                            onChange={(e) => setInlineHsnForm({ ...inlineHsnForm, gstRate: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold"
                          >
                            <option value={0}>0% (Exempt)</option>
                            <option value={5}>5% GST</option>
                            <option value={12}>12% GST</option>
                            <option value={18}>18% GST (Standard)</option>
                            <option value={28}>28% GST (Luxury)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1 text-[10px]">Description</label>
                          <input
                            type="text"
                            placeholder="e.g. Power Adaptors & Rework"
                            value={inlineHsnForm.description}
                            onChange={(e) => setInlineHsnForm({ ...inlineHsnForm, description: e.target.value })}
                            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleCreateInlineHsn}
                          className="px-4 py-2 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase cursor-pointer"
                        >
                          + Save HSN to Master
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* WEBSITE SHOP DISPLAY CONTROL TOGGLE */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#16FFC6]/10 border border-[#16FFC6]/30">
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-5 h-5 text-[#16FFC6]" />
                    <div>
                      <div className="text-xs font-extrabold text-white uppercase tracking-wider">Publish &amp; Display in Website Shop</div>
                      <div className="text-[10px] text-white/60">Controls whether this part appears for clients on the public website's /shop page.</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnWebsiteShop !== false}
                      onChange={(e) => setFormData({ ...formData, showOnWebsiteShop: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16FFC6]"></div>
                  </label>
                </div>
              </div>

              {/* SECTION 2: PRODUCT / PART IMAGE ASSET */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#5ED29C]" /> Product / Part Image Asset
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {formData.productImage ? (
                    <div className="relative group shrink-0">
                      <img
                        src={formData.productImage}
                        alt="Part Preview"
                        className="w-24 h-24 object-cover rounded-2xl border-2 border-[#5ED29C]/50 bg-slate-950 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productImage: '' })}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-white/40 shrink-0">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[9px] uppercase font-bold">No Image</span>
                    </div>
                  )}

                  <div className="space-y-2 flex-1 w-full">
                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Upload Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#5ED29C]/20 file:text-[#5ED29C] hover:file:bg-[#5ED29C] hover:file:text-[#070B0A] file:cursor-pointer transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-1 font-bold">Or Image URL</label>
                      <input
                        type="text"
                        value={formData.productImage}
                        onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:border-[#5ED29C] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: FINANCIAL PRICING LEDGER & PROFIT MARGIN ENGINE */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-[#5ED29C]/20 pb-2">
                  <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block">
                    2. Financial Pricing Ledger & Profit Margin Engine
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    Calculated Margin: <strong className="text-[#16FFC6]">{profitMarginPercent}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Cost Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold focus:border-[#5ED29C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-[#5ED29C] font-mono font-bold focus:border-[#5ED29C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: STOCK CONTROL & STORAGE BIN LOCATION */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  3. Stock Control & Storage Bin Location
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Opening Stock Qty *</label>
                    <input
                      type="number"
                      required
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold focus:border-[#5ED29C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-bold">Barcode / Serial No</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="e.g. PRT-982145 / Scan Barcode"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono focus:border-[#5ED29C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Storage Location / Bin</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('storageLocation', 'Add New Storage Location / Bin')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('storageLocation', 'Remove Storage Location', formData.storageLocation)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.storageLocation}
                      onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                    >
                      {storageLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Unit of Measurement (UOM)</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('uom', 'Add New Unit of Measurement (UOM)')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('uom', 'Remove Unit of Measurement', formData.uom)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.uom}
                      onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                    >
                      {uoms.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: SUPPLIER VENDOR & WARRANTY SPECIFICATIONS */}
              <div className="p-5 rounded-2xl bg-[#0F1722]/90 border border-white/10 space-y-4 shadow-md">
                <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-[#5ED29C]/20 pb-2">
                  4. Supplier Vendor & Warranty Specifications
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Supplier Vendor</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('vendor', 'Add New Supplier Vendor')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('vendor', 'Remove Supplier Vendor', formData.supplierVendor)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.supplierVendor}
                      onChange={(e) => setFormData({ ...formData, supplierVendor: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                    >
                      {vendorOptions.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/80 font-bold">Warranty Period</label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => openAddModal('warranty', 'Add New Warranty Option')}
                          className="text-[#5ED29C] hover:text-[#16FFC6] font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('warranty', 'Remove Warranty Option', formData.compatibleModels)}
                          className="text-rose-400 hover:text-rose-300 font-extrabold uppercase hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.compatibleModels}
                      onChange={(e) => setFormData({ ...formData, compatibleModels: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-medium focus:border-[#5ED29C] outline-none"
                    >
                      {warranties.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-bold">Hardware Specs & PC Builder Notes</label>
                  <textarea
                    rows={2}
                    value={formData.comfortabilityFeatures}
                    onChange={(e) => setFormData({ ...formData, comfortabilityFeatures: e.target.value })}
                    placeholder="e.g. Socket LGA1700, 125W TDP, DDR4/DDR5 Support..."
                    className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:border-[#5ED29C] outline-none"
                  />
                </div>
              </div>

              {/* FROZEN STICKY MODAL FOOTER ACTION BAR */}
              <div className="sticky bottom-0 z-30 bg-[#0D131A] px-6 sm:px-8 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 mt-6">
                <div>
                  {typeof activeItemModal === 'object' && activeItemModal !== null && (
                    <button
                      type="button"
                      onClick={handleDeleteItem}
                      className="px-6 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Inventory Item
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveItemModal(null)}
                    className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel / Close
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black uppercase tracking-wider shadow-lg shadow-[#5ED29C]/25 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    {activeItemModal === 'new'
                      ? formData.itemType === 'Retail Part'
                        ? '+ SAVE RETAIL PART'
                        : '+ SAVE SERVICE PART'
                      : 'SAVE CHANGES'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE CUSTOM PC BUILDER STUDIO MODAL (ULTRA-WIDE EXPANSIVE STUDIO DESIGN) */}
      {isPcBuilderOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto font-sans">
          <div className="glass-panel p-6 sm:p-8 rounded-[36px] border border-blue-500/40 w-full max-w-[96vw] max-h-[95vh] overflow-y-auto text-white space-y-6 bg-[#070B0E] shadow-2xl shadow-blue-500/10">
            
            {/* STUDIO TOP NAVIGATION BAR */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-500/20 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest">
                    Intelligent Assembly Engine
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#5ED29C]/20 border border-[#5ED29C]/30 text-[#5ED29C] text-[10px] font-extrabold uppercase tracking-widest">
                    Real-Time Margin Ledger
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2 tracking-wide">
                  <Cpu className="w-7 h-7 text-blue-400" />
                  CUSTOM PC ASSEMBLY &amp; QUOTATION STUDIO
                </h2>
                <p className="text-xs text-white/50">
                  Select hardware parts from live store inventory, calculate real-time net profit margin %, verify socket &amp; power compatibility, and save directly as a new stock SKU.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintPcQuotation}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 uppercase tracking-wider transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Branded PC Quotation
                </button>
                <button
                  type="button"
                  onClick={handleSavePcAsSku}
                  className="px-6 py-3 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs flex items-center gap-2 shadow-lg shadow-[#5ED29C]/30 uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> + Save Desktop SKU to Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setIsPcBuilderOpen(false)}
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 transition-colors border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* TWO-COLUMN STUDIO WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: COMPONENT SELECTION SLOTS (8 SLOTS IN Sleek Cards) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* HARDWARE COMPATIBILITY STATUS SHIELD */}
                {compatibilityIssues.length > 0 ? (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs font-bold space-y-1.5 shadow-lg">
                    {compatibilityIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <WarningIcon className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#5ED29C]/10 border border-[#5ED29C]/30 rounded-2xl p-3.5 text-[#5ED29C] text-xs font-bold flex items-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-[#5ED29C] shrink-0" />
                    <span>100% System Hardware Compatible (CPU Socket, Motherboard Chipset, RAM Generation &amp; Wattage Cleared)</span>
                  </div>
                )}

                {/* UNIFIED FULLY CONFIGURABLE COMPONENT SLOTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pcSlots.map((slot, idx) => {
                    const selectedPart = getSelectedPart(slot.selectedItemId);
                    const slotNo = idx + 1;
                    const filteredInventory = slot.category === 'All'
                      ? inventory.filter((i) => i.itemType === 'Retail Part')
                      : inventory.filter((i) => i.category === slot.category);

                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-[#121820] border border-white/10 hover:border-purple-500/40 transition-all space-y-3 shadow-md relative group"
                      >
                        {/* SLOT CARD HEADER CONTROL BAR */}
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-extrabold text-xs flex items-center justify-center border border-purple-500/30 shrink-0">
                              {slotNo}
                            </span>
                            <input
                              type="text"
                              value={slot.slotName}
                              onChange={(e) => handleUpdateSlot(slot.id, { slotName: e.target.value })}
                              placeholder="Slot Title..."
                              className="bg-transparent text-purple-300 font-extrabold text-xs uppercase border-b border-transparent hover:border-purple-500/30 focus:border-purple-400 focus:outline-none w-full truncate"
                            />
                          </div>

                          {/* SLOT HEADER ACTIONS: QTY, + NEW PART, MODIFY PART, DELETE SLOT */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="text-white/40 font-bold">Qty:</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={slot.qty}
                                onChange={(e) => handleUpdateSlot(slot.id, { qty: Math.max(1, Number(e.target.value)) })}
                                className="w-10 p-0.5 rounded bg-[#0B0F14] border border-white/20 text-white font-bold text-xs text-center"
                              />
                            </div>

                            {/* + CREATE NEW PART IN THIS CATEGORY BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleOpenNewPartForSlot(slot.id, slot.category)}
                              className="p-1 rounded bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-bold transition-all flex items-center gap-1"
                              title={`Create New Retail Part for ${slot.category}`}
                            >
                              <Plus className="w-3 h-3 stroke-[3]" /> Part
                            </button>

                            {/* MODIFY SELECTED PART BUTTON */}
                            {selectedPart && (
                              <button
                                type="button"
                                onClick={() => handleModifyPartInSlot(selectedPart.id)}
                                className="p-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/30 text-[10px] font-bold transition-all flex items-center gap-1"
                                title="Modify Selected Part Details"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            )}

                            {/* DELETE / CLEAR SLOT BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded transition-all"
                              title="Delete Component Slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* CATEGORY TARGET SELECTOR */}
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="text-white/40 font-bold uppercase shrink-0">Retail Category:</span>
                          <select
                            value={slot.category}
                            onChange={(e) => handleUpdateSlot(slot.id, { category: e.target.value })}
                            className="bg-[#0B0F14] border border-white/15 rounded-lg px-2 py-1 text-purple-300 font-bold text-[10px] focus:outline-none focus:border-purple-400 w-full"
                          >
                            <option value="All">-- All Retail Categories --</option>
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* PART PRODUCT SELECTOR ROW */}
                        <div className="flex gap-3 items-center">
                          {selectedPart?.productImage ? (
                            <img
                              src={selectedPart.productImage}
                              alt={slot.slotName}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-950"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                              <Cpu className="w-6 h-6" />
                            </div>
                          )}

                          <div className="flex-1 space-y-1">
                            <select
                              value={slot.selectedItemId}
                              onChange={(e) => handleUpdateSlot(slot.id, { selectedItemId: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none focus:border-purple-500"
                            >
                              <option value="">-- Select {slot.category} Part --</option>
                              {filteredInventory.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.name} (Stock: {i.currentStock}) - ₹{i.sellingPrice.toLocaleString()}
                                </option>
                              ))}
                            </select>

                            {selectedPart && (
                              <div className="flex justify-between items-center text-[10px] font-mono text-white/50 px-1">
                                <span>SKU: {selectedPart.code} ({slot.qty} Pcs)</span>
                                <span className="text-[#5ED29C] font-bold">
                                  Price: ₹{(selectedPart.sellingPrice * slot.qty).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DYNAMIC SLOT GENERATOR ENGINE CONTROL BAR */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black uppercase text-blue-300 flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-blue-400 stroke-[3]" /> Add Custom Component Slot
                      </span>
                      <p className="text-[11px] text-white/50">
                        Select any Retail Part category (e.g. Case Fans, Monitor, Keyboard, OS, UPS) to create a new slot or add custom hardware.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <select
                        value={newSlotCategoryInput}
                        onChange={(e) => setNewSlotCategoryInput(e.target.value)}
                        className="p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                      >
                        <option value="">-- Select Retail Part Category --</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Custom Slot Title (Optional)..."
                        value={newSlotTitleInput}
                        onChange={(e) => setNewSlotTitleInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSlotForCategory()}
                        className="p-2.5 rounded-xl bg-[#0B0F14] border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-400 sm:w-48"
                      />

                      <button
                        type="button"
                        onClick={() => handleAddSlotForCategory()}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1.5 shrink-0 transition-all"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" /> + Add Slot
                      </button>
                    </div>
                  </div>

                  {/* QUICK PRESET CATEGORY BUTTONS */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[10px]">
                    <span className="text-white/40 font-bold uppercase">Quick Add Category Slots:</span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleAddSlotForCategory(cat)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-500/20 text-white/80 hover:text-blue-300 border border-white/10 font-bold transition-all"
                      >
                        + {cat}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: FINANCIAL LEDGER & BUILD IDENTITY SIDEBAR */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* BUILD IDENTITY CARD */}
                <div className="p-5 rounded-3xl bg-[#121820] border border-blue-500/30 space-y-4 shadow-xl">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block border-b border-white/10 pb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-blue-400" /> PC Build Configuration Identity
                  </span>

                  <div className="space-y-3 text-xs">
                    {/* 1. BUILD TITLE */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">PC Model / Build Title *</label>
                      <input
                        type="text"
                        value={pcBuildForm.buildName}
                        onChange={(e) => setPcBuildForm({ ...pcBuildForm, buildName: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-blue-500/40 text-white font-bold text-xs focus:outline-none focus:border-blue-400"
                        placeholder="e.g. Custom Extreme Gaming / Workstation PC"
                      />
                    </div>

                    {/* 2. ASSEMBLY LABOR FEE */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">Assembly, Testing &amp; Cable Mgmt Fee (₹)</label>
                      <input
                        type="number"
                        value={pcBuildForm.assemblyLaborFee}
                        onChange={(e) => setPcBuildForm({ ...pcBuildForm, assemblyLaborFee: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/15 text-[#5ED29C] font-mono font-bold text-xs focus:outline-none focus:border-[#5ED29C]"
                      />
                    </div>

                    {/* 3. CATEGORY & PRODUCT GROUP */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-white/80 font-bold mb-1">Category *</label>
                        <select
                          value={pcBuildForm.category}
                          onChange={(e) => setPcBuildForm({ ...pcBuildForm, category: e.target.value })}
                          className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/80 font-bold mb-1">Product Group *</label>
                        <select
                          value={pcBuildForm.productGroup}
                          onChange={(e) => setPcBuildForm({ ...pcBuildForm, productGroup: e.target.value })}
                          className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none"
                        >
                          {productGroups.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 4. HSN CODE & GST RATE */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">HSN Code &amp; Statutory GST Rate *</label>
                      <select
                        value={pcBuildForm.hsnCode}
                        onChange={(e) => {
                          const matched = hsnCodes.find((h) => h.hsnCode === e.target.value);
                          setPcBuildForm({
                            ...pcBuildForm,
                            hsnCode: e.target.value,
                            gstRate: matched ? matched.gstRate : 18,
                          });
                        }}
                        className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-emerald-400 font-bold text-xs focus:outline-none"
                      >
                        {hsnCodes.map((h) => (
                          <option key={h.hsnCode} value={h.hsnCode}>
                            {h.hsnCode} ({h.gstRate}% GST) - {h.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 5. BARCODE / SERIAL NO & REFRESH */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-white/80 font-bold">Barcode / SKU Serial No *</label>
                        <button
                          type="button"
                          onClick={() => setPcBuildForm({ ...pcBuildForm, barcode: `DESK-${Math.floor(100000 + Math.random() * 900000)}` })}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                        >
                          + Auto Gen
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pcBuildForm.barcode}
                        onChange={(e) => setPcBuildForm({ ...pcBuildForm, barcode: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-mono font-bold text-xs focus:outline-none"
                      />
                    </div>

                    {/* 6. STORAGE LOCATION & UOM */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-white/80 font-bold mb-1">Storage Location *</label>
                        <select
                          value={pcBuildForm.storageLocation}
                          onChange={(e) => setPcBuildForm({ ...pcBuildForm, storageLocation: e.target.value })}
                          className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none"
                        >
                          {storageLocations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/80 font-bold mb-1">Unit of Measure *</label>
                        <select
                          value={pcBuildForm.uom}
                          onChange={(e) => setPcBuildForm({ ...pcBuildForm, uom: e.target.value })}
                          className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none"
                        >
                          {uoms.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 7. WARRANTY PERIOD */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">Warranty Period *</label>
                      <select
                        value={pcBuildForm.warrantyPeriod}
                        onChange={(e) => setPcBuildForm({ ...pcBuildForm, warrantyPeriod: e.target.value })}
                        className="w-full p-2 rounded-xl bg-[#0B0F14] border border-white/15 text-white font-bold text-xs focus:outline-none"
                      >
                        {warranties.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    {/* 8. PRODUCT IMAGE ASSET UPLOAD */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">Product / Part Image Asset</label>
                      <div className="flex items-center gap-2">
                        {pcBuildForm.productImage ? (
                          <img
                            src={pcBuildForm.productImage}
                            alt="Master Asset"
                            className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0 bg-slate-950"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePcImageUpload}
                          className="text-[10px] text-white/60 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 w-full"
                        />
                      </div>
                    </div>

                    {/* 9. NOTES / BUILD REMARKS */}
                    <div>
                      <label className="block text-white/80 font-bold mb-1">Build Notes / Remarks</label>
                      <textarea
                        rows={2}
                        value={pcBuildForm.notes}
                        onChange={(e) => setPcBuildForm({ ...pcBuildForm, notes: e.target.value })}
                        placeholder="Assembly notes, technician testing status, customer special requests..."
                        className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-white/15 text-white text-xs placeholder-white/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ITEMIZATION PREVIEW SUMMARY */}
                <div className="p-5 rounded-3xl bg-[#121820] border border-white/10 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                    <span className="font-extrabold text-white uppercase flex items-center gap-1.5">
                      <List className="w-4 h-4 text-[#16FFC6]" /> Selected Components ({buildPartsList.length})
                    </span>
                    <span className="font-mono text-[10px] text-white/50">Auto HSN: 84713010</span>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-2 text-xs font-mono pr-1">
                    {buildPartsList.map((item, idx) => (
                      <div key={item.slotId} className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded-xl border border-white/5">
                        <span className="truncate max-w-[170px] font-sans text-white/80">{idx + 1}. {item.part.name}</span>
                        <span className="text-[#5ED29C] font-bold shrink-0">₹{(item.part.sellingPrice * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    {pcBuildForm.assemblyLaborFee > 0 && (
                      <div className="flex items-center justify-between text-[11px] bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
                        <span className="font-sans text-blue-300">Assembly &amp; Testing Fee</span>
                        <span className="text-blue-300 font-bold">₹{pcBuildForm.assemblyLaborFee.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* REAL-TIME PROFIT MARGIN & FINANCIAL LEDGER CARD */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#121820] to-[#0A0D11] border border-emerald-500/30 space-y-4 shadow-2xl font-mono text-xs">
                  <span className="text-xs font-black text-[#5ED29C] uppercase tracking-wider block border-b border-white/10 pb-2 font-sans flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-[#5ED29C]" /> Real-Time Profit Margin Ledger
                  </span>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white/70">
                      <span>Total Component Cost:</span>
                      <span className="font-bold text-white text-sm">₹{totalBuildCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-white/70">
                      <span>System Selling Price:</span>
                      <span className="font-extrabold text-[#5ED29C] text-base">₹{totalBuildSelling.toLocaleString()}</span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-purple-300 font-sans font-bold">Net Profit Margin:</span>
                      <span className="text-[#16FFC6] font-black text-lg">
                        ₹{totalBuildMargin.toLocaleString()} ({totalBuildCost > 0 ? ((totalBuildMargin / totalBuildCost) * 100).toFixed(1) : '0'}%)
                      </span>
                    </div>

                    {/* MARGIN PROGRESS BAR */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#5ED29C] to-[#16FFC6] transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, totalBuildCost > 0 ? Number(((totalBuildMargin / totalBuildCost) * 100).toFixed(0)) : 0))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-sans text-white/40">
                        <span>Cost Basis</span>
                        <span>{totalBuildCost > 0 ? ((totalBuildMargin / totalBuildCost) * 100).toFixed(1) : 0}% Net Margin</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="pt-4 border-t border-white/10 space-y-3 font-sans">
                    <button
                      type="button"
                      onClick={handleSavePcAsSku}
                      className="w-full py-3.5 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" /> + SAVE DESKTOP SKU TO INVENTORY
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPcQuotation}
                      className="w-full py-3 rounded-2xl bg-white/5 hover:bg-blue-600 text-white hover:text-white border border-white/10 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <Printer className="w-4 h-4" /> PRINT BRANDED QUOTATION
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* HSN SETTINGS MANAGER MODAL */}
      {isHsnManagerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#16FFC6]" />
                HSN MASTER &amp; GST TAX RATE SETTINGS
              </h2>
              <button
                onClick={() => setIsHsnManagerOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <table className="w-full text-left text-xs border-collapse border border-white/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-white/5 text-white/50 text-[10px] uppercase font-black">
                    <th className="p-3">HSN Code</th>
                    <th className="p-3">GST Tax %</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {hsnCodes.map((h) => (
                    <tr key={h.hsnCode}>
                      <td className="p-3 font-bold text-[#16FFC6]">{h.hsnCode}</td>
                      <td className="p-3 font-bold text-white">{h.gstRate}%</td>
                      <td className="p-3 text-white/70 font-sans">{h.description}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            deleteHsnCode(h.hsnCode);
                            deleteHsnMasterFromSupabase(h.hsnCode).catch(() => {});
                          }}
                          className="p-1 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <WarningIcon className="w-4 h-4 shrink-0" />
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
