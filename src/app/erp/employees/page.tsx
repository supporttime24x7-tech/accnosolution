'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Plus, Search, Filter, Phone, Mail, MapPin, Calendar,
  DollarSign, Shield, CheckCircle2, AlertTriangle, Edit3, Trash2,
  X, UserCheck, Briefcase, ChevronRight, Eye, EyeOff, KeyRound, UserPlus, PhoneCall,
  Landmark, FileText, ExternalLink, Settings, Sparkles, Building2,
  CreditCard, FileCheck, ShieldAlert, ShieldCheck, Upload, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  useErpStore, EmployeeItem, EmployeePermissions,
  defaultEmployeePermissions, adminEmployeePermissions, viewOnlyPermissions
} from '@/lib/store';
import {
  fetchEmployeesFromSupabase,
  pushEmployeeToSupabase,
  deleteEmployeeFromSupabase,
} from '@/lib/supabase-sync';

export default function EmployeesPage() {
  const {
    employees,
    setEmployees,
    employeeRules,
    currentUser,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDepartmentOption,
    removeDepartmentOption,
    addDesignationOption,
    removeDesignationOption,
    addGovtIdTypeOption,
    removeGovtIdTypeOption,
  } = useErpStore();

  const userDept = (currentUser as any)?.department || 'Admin';
  const userDesig = (currentUser as any)?.designation || (currentUser as any)?.role || 'Admin';
  const isEmployeeModuleVisible =
    userDept.toLowerCase().includes('admin') &&
    userDesig.toLowerCase().includes('admin');

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<EmployeeItem | null>(null);
  const [viewingEmp, setViewingEmp] = useState<EmployeeItem | null>(null);
  const [modalTab, setModalTab] = useState<'all' | 'permissions' | 'basic' | 'bank'>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [showViewDrawerPassword, setShowViewDrawerPassword] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const loadStaffFromCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const cloudEmps = await fetchEmployeesFromSupabase();
      if (cloudEmps) {
        setEmployees(cloudEmps);
      } else {
        const res = await fetch('/api/erp/employees');
        const data = await res.json();
        if (data.success && Array.isArray(data.employees)) {
          setEmployees(data.employees);
        }
      }
    } catch (err) {
      console.warn('Staff cloud sync failed:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Immediate Cloud Synchronization on Component Mount
  useEffect(() => {
    loadStaffFromCloud();
  }, []);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$&';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  const modulePermissionLabels: { key: keyof EmployeePermissions; label: string; desc: string }[] = [
    { key: 'repairTickets', label: 'Service Tickets (Intake & Jobs)', desc: 'View, intake, update repair status & diagnosis' },
    { key: 'repairBilling', label: 'Repair Billing & Tax Invoices', desc: 'Generate & edit repair invoices, tax receipts & balance dues' },
    { key: 'salesBilling', label: 'General POS & Sales Billing', desc: 'Process counter sales, quotations & retail invoices' },
    { key: 'accountingVouchers', label: 'Accounting Vouchers', desc: 'Receipts, Payments, Contra, Journals, Debit/Credit Notes' },
    { key: 'inventory', label: 'Inventory & Spare Parts', desc: 'View stock, manage parts, prices & HSN tax rates' },
    { key: 'customers', label: 'Customer Masters & Ledgers', desc: 'Add/edit customers, credit limits & account ledgers font-mono' },
    { key: 'vendors', label: 'Vendor Masters & Suppliers', desc: 'Add/edit vendors, purchase ledgers & suppliers' },
    { key: 'outsource', label: 'Outsource Repair Vouchers', desc: 'Manage lab outsource vouchers, freight & courier tracking' },
    { key: 'dataRecovery', label: 'Data Recovery Cases', desc: 'Manage cleanroom recovery cases, drives & donor parts' },
    { key: 'amc', label: 'AMC Contracts & PM Visits', desc: 'Manage AMC clients, preventive maintenance & visits' },
    { key: 'reports', label: 'Financial Reports & Analytics', desc: 'Access revenue reports, profit/loss & tax summaries' },
    { key: 'settings', label: 'System Rules & Configuration', desc: 'Configure ERP prefix rules, print formats & settings' },
  ];

  // Form State with all 19 required fields + RBAC Permissions Matrix
  const [formData, setFormData] = useState<Omit<EmployeeItem, 'id' | 'created_at'>>({
    empCode: '',
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    password: '',
    address: '',
    department: 'Admin',
    designation: 'Admin',
    baseSalary: 35000,
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContactName: '',
    emergencyContactPhone: '',
    govtIdType: 'Aadhaar Card',
    govtIdNumber: '',
    idAttachment: '',
    activeStatus: 'Active',
    role: 'Admin',
    permissions: adminEmployeePermissions,
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    bankBranch: '',
    bankBranchCode: '',
    bankIfscCode: '',
  });

  const defaultDepts = [
    'Admin',
    'Technical Lab',
    'Billing & POS',
    'Customer Support',
    'Logistics & Outsource',
    'Management',
    'Accounts & Finance',
    'Inventory & Stock',
  ];
  const rawDepts = employeeRules?.departmentOptions || defaultDepts;
  const departmentList = rawDepts.includes('Admin') ? rawDepts : ['Admin', ...rawDepts];

  const defaultDesigs = [
    'Admin',
    'Senior Chip-Level Repair Engineer',
    'Hardware Diagnostic Specialist',
    'Store Manager & Billing Lead',
    'Data Recovery Specialist',
    'Logistics & Outsource Executive',
    'Customer Support Executive',
    'Junior Technician',
    'Accountant',
  ];
  const rawDesigs = employeeRules?.designationOptions || defaultDesigs;
  const designationList = rawDesigs.includes('Admin') ? rawDesigs : ['Admin', ...rawDesigs];

  const govtIdList = employeeRules?.govtIdTypeOptions || [
    'Aadhaar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Voter ID Card',
  ];

  const handleOpenAdd = () => {
    const prefix = employeeRules?.employeePrefix || 'EMP-';
    const startNo = employeeRules?.employeeStartWithNo || 1001;
    const autoCode = `${prefix}${startNo + (employees || []).length}`;

    setFormData({
      empCode: autoCode,
      name: '',
      phone: '',
      alternatePhone: '',
      email: '',
      password: '',
      address: '',
      department: 'Admin',
      designation: 'Admin',
      baseSalary: 35000,
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContactName: '',
      emergencyContactPhone: '',
      govtIdType: govtIdList[0] || 'Aadhaar Card',
      govtIdNumber: '',
      idAttachment: '',
      activeStatus: 'Active',
      role: 'Admin',
      permissions: adminEmployeePermissions,
      bankAccountName: '',
      bankAccountNumber: '',
      bankName: '',
      bankBranch: '',
      bankBranchCode: '',
      bankIfscCode: '',
    });
    setEditingEmp(null);
    setShowAddModal(true);
  };

  // Synchronize Employee Credentials with Edge Authentication Registry
  useEffect(() => {
    if (employees && employees.length > 0) {
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees }),
      }).catch(() => {});
    }
  }, [employees]);

  const handleOpenEdit = (emp: EmployeeItem) => {
    setEditingEmp(emp);
    setFormData({
      empCode: emp.empCode || '',
      name: emp.name || '',
      phone: emp.phone || '',
      alternatePhone: emp.alternatePhone || '',
      email: emp.email || '',
      password: emp.password || '',
      address: emp.address || '',
      department: emp.department || departmentList[0] || 'Technical Lab',
      designation: emp.designation || designationList[0] || 'Senior Engineer',
      baseSalary: emp.baseSalary || 0,
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      emergencyContactName: emp.emergencyContactName || '',
      emergencyContactPhone: emp.emergencyContactPhone || '',
      govtIdType: emp.govtIdType || govtIdList[0] || 'Aadhaar Card',
      govtIdNumber: emp.govtIdNumber || '',
      idAttachment: emp.idAttachment || '',
      activeStatus: emp.activeStatus || 'Active',
      role: emp.role || 'Technician',
      permissions: emp.permissions || defaultEmployeePermissions,
      bankAccountName: emp.bankAccountName || '',
      bankAccountNumber: emp.bankAccountNumber || '',
      bankName: emp.bankName || '',
      bankBranch: emp.bankBranch || '',
      bankBranchCode: emp.bankBranchCode || '',
      bankIfscCode: emp.bankIfscCode || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Requirement: Only those entries that exist or are created within the 'Employee' module should be granted permission to log in
    // Password set in this form is the exact password used for logging in
    const effectivePassword = formData.password?.trim() || `${formData.name.split(' ')[0]}@Accno2026#`;
    const finalData = { ...formData, password: effectivePassword };

    if (editingEmp) {
      updateEmployee(editingEmp.id, finalData);
      try {
        await fetch('/api/erp/employees', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...finalData, id: editingEmp.id }),
        });
      } catch (err) {
        console.error('Update error:', err);
      }
    } else {
      addEmployee(finalData);
      try {
        await fetch('/api/erp/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData),
        });
      } catch (err) {
        console.error('Add error:', err);
      }
    }

    setShowAddModal(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete employee record for "${name}"?`)) {
      deleteEmployee(id);
      try {
        await fetch(`/api/erp/employees?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({
            ...prev,
            idAttachment: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // In-App Modal Dialog for +ADD and REMOVE dropdown options
  const [optionModal, setOptionModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    field: 'department' | 'designation' | 'govtIdType';
    title: string;
    currentValue?: string;
    nameInput: string;
    error?: string;
  }>({
    isOpen: false,
    type: 'add',
    field: 'department',
    title: '',
    nameInput: '',
  });

  const openAddModal = (field: 'department' | 'designation' | 'govtIdType', title: string) => {
    setOptionModal({
      isOpen: true,
      type: 'add',
      field,
      title,
      nameInput: '',
      error: undefined,
    });
  };

  const openRemoveModal = (field: 'department' | 'designation' | 'govtIdType', title: string, currentValue?: string) => {
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
      setOptionModal((prev) => ({ ...prev, error: 'Option name cannot be empty.' }));
      return;
    }

    if (optionModal.field === 'department') {
      if (departmentList.some((d) => d.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This department already exists.' }));
        return;
      }
      addDepartmentOption(val);
      setFormData((prev) => ({ ...prev, department: val }));
    } else if (optionModal.field === 'designation') {
      if (designationList.some((d) => d.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This designation already exists.' }));
        return;
      }
      addDesignationOption(val);
      setFormData((prev) => ({ ...prev, designation: val }));
    } else if (optionModal.field === 'govtIdType') {
      if (govtIdList.some((g) => g.toLowerCase() === val.toLowerCase())) {
        setOptionModal((prev) => ({ ...prev, error: 'This ID type already exists.' }));
        return;
      }
      addGovtIdTypeOption(val);
      setFormData((prev) => ({ ...prev, govtIdType: val }));
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmRemoveOption = () => {
    if (optionModal.field === 'department') {
      if (departmentList.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one department must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.department || '';
      if (target) removeDepartmentOption(target);
      const remaining = departmentList.filter((d) => d !== target);
      if (formData.department === target) {
        setFormData((prev) => ({ ...prev, department: remaining[0] || '' }));
      }
    } else if (optionModal.field === 'designation') {
      if (designationList.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one designation must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.designation || '';
      if (target) removeDesignationOption(target);
      const remaining = designationList.filter((d) => d !== target);
      if (formData.designation === target) {
        setFormData((prev) => ({ ...prev, designation: remaining[0] || '' }));
      }
    } else if (optionModal.field === 'govtIdType') {
      if (govtIdList.length <= 1) {
        setOptionModal((prev) => ({ ...prev, error: 'At least one ID type must remain.' }));
        return;
      }
      const target = optionModal.currentValue || formData.govtIdType || '';
      if (target) removeGovtIdTypeOption(target);
      const remaining = govtIdList.filter((g) => g !== target);
      if (formData.govtIdType === target) {
        setFormData((prev) => ({ ...prev, govtIdType: remaining[0] || '' }));
      }
    }

    setOptionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Filtered List
  const filteredEmployees = (employees || []).filter((emp) => {
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.empCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.phone || '').includes(searchTerm) ||
      (emp.alternatePhone || '').includes(searchTerm) ||
      (emp.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.govtIdNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.activeStatus === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Metrics
  const totalStaff = (employees || []).length;
  const activeStaff = (employees || []).filter((e) => e.activeStatus === 'Active').length;
  const onLeaveStaff = (employees || []).filter((e) => e.activeStatus === 'On Leave').length;
  const totalPayroll = (employees || []).reduce((sum, e) => sum + (e.baseSalary || 0), 0);

  if (!isEmployeeModuleVisible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-rose-500/10 border border-rose-500/30 p-8 rounded-3xl max-w-md w-full backdrop-blur-md space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
            Access Restricted
          </h2>
          <p className="text-xs text-white/70 leading-relaxed">
            The Employee Module is visible and accessible only to System Administrators with Admin privileges in both Department and Designation.
          </p>
          <div className="pt-2">
            <Link
              href="/erp"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#5ED29C]/20"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Global Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5ED29C]" />
              MASTER EMPLOYEE ROSTER
            </h1>
            <span className="text-[10px] bg-[#5ED29C]/20 text-[#5ED29C] border border-[#5ED29C]/40 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Staff Management &amp; Payroll
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Manage complete employee profiles, government IDs, bank account details, department access, and monthly salary rosters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadStaffFromCloud}
            disabled={isCloudSyncing}
            className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isCloudSyncing
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/15'
            }`}
            title="Synchronize employee roster with Supabase Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin text-amber-400' : 'text-[#5ED29C]'}`} />
            <span>{isCloudSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <Link
            href="/erp/settings?tab=employee_rules"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Configure Employee Rules & Settings"
          >
            <Settings className="w-4 h-4 text-[#5ED29C]" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
              Total Employees
            </span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {totalStaff} Staff
            </div>
            <span className="text-[10px] text-[#5ED29C] font-semibold">Active Roster</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
              Active On Duty
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
              {activeStaff} Members
            </div>
            <span className="text-[10px] text-emerald-400/80 font-semibold">Present &amp; Available</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
              On Leave / Away
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
              {onLeaveStaff} Staff
            </div>
            <span className="text-[10px] text-amber-400/80 font-semibold">Temporary Leave</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
              Monthly Payroll
            </span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300 mt-1">
              ₹{totalPayroll.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-cyan-300/80 font-semibold">Base Payroll Outflow</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 text-lg font-bold font-mono">
            ₹
          </div>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, name, phone, govt ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white focus:outline-none focus:border-[#5ED29C]"
          >
            <option value="ALL">All Departments</option>
            {departmentList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-xs text-white focus:outline-none focus:border-[#5ED29C]"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-end md:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-white/60 hover:text-white'
            }`}
          >
            Grid Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-[#5ED29C] text-[#070B0A]' : 'text-white/60 hover:text-white'
            }`}
          >
            Data Table
          </button>
        </div>
      </div>

      {/* Main Employee Content List */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#5ED29C]/50 transition-all space-y-3 relative group"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#5ED29C]/15 border border-[#5ED29C]/40 text-[#5ED29C] font-extrabold text-base flex items-center justify-center shrink-0">
                    {emp.name ? emp.name.charAt(0) : 'E'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{emp.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-[#5ED29C] font-bold px-1.5 py-0.2 rounded bg-[#5ED29C]/10 border border-[#5ED29C]/20">
                        {emp.empCode}
                      </span>
                      <span className="text-[10px] text-white/50">{emp.department}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    emp.activeStatus === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : emp.activeStatus === 'On Leave'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {emp.activeStatus}
                </span>
              </div>

              {/* Details Body */}
              <div className="space-y-1.5 text-xs text-white/80 border-t border-b border-white/10 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px]">Designation:</span>
                  <span className="font-bold text-white text-right truncate max-w-[170px]">{emp.designation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px]">Contact &amp; Alt:</span>
                  <span className="font-mono text-cyan-300">
                    {emp.phone} {emp.alternatePhone ? `/ ${emp.alternatePhone}` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px]">Govt ID:</span>
                  <span className="font-mono text-slate-300">
                    {emp.govtIdType || 'ID'}: {emp.govtIdNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px]">Bank A/c:</span>
                  <span className="font-mono text-amber-300/90 text-[11px]">
                    {emp.bankName ? `${emp.bankName} (${emp.bankAccountNumber || ''})` : 'Not Added'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px]">Base Salary:</span>
                  <span className="font-mono font-bold text-[#5ED29C]">
                    ₹{(emp.baseSalary || 0).toLocaleString('en-IN')} / mo
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setViewingEmp(emp)}
                  className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5ED29C]" /> View Full Profile
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(emp)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 transition-all cursor-pointer"
                    title="Edit Employee"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(emp.id, emp.name)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Table View */
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] font-bold text-white/50 tracking-wider">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Name &amp; Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Contact &amp; Alternate</th>
                  <th className="p-3">Govt ID</th>
                  <th className="p-3">Bank Account</th>
                  <th className="p-3">Base Salary</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#5ED29C]">{emp.empCode}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{emp.name}</div>
                      <div className="text-[10px] text-white/50">{emp.designation}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-cyan-300">{emp.phone}</div>
                      {emp.alternatePhone && (
                        <div className="text-[10px] text-white/40 font-mono">Alt: {emp.alternatePhone}</div>
                      )}
                      <div className="text-[10px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white/90">{emp.govtIdType || 'N/A'}</div>
                      <div className="font-mono text-[10px] text-slate-400">{emp.govtIdNumber || 'N/A'}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-amber-300/90">
                      {emp.bankName ? (
                        <div>
                          <div>{emp.bankName}</div>
                          <div className="text-[10px] text-white/40">A/c: {emp.bankAccountNumber}</div>
                        </div>
                      ) : (
                        <span className="text-white/30">N/A</span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      ₹{(emp.baseSalary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          emp.activeStatus === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : emp.activeStatus === 'On Leave'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {emp.activeStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewingEmp(emp)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#5ED29C]" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal Drawer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/15 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col space-y-3 border-b border-white/10 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#5ED29C]" />
                  {editingEmp ? 'Edit Employee Details' : 'Add New Staff Member'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Section Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setModalTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    modalTab === 'all' ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  📋 All Sections
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('permissions')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    modalTab === 'permissions'
                      ? 'bg-[#5ED29C] text-[#070B0A] shadow-lg shadow-[#5ED29C]/30'
                      : 'bg-[#5ED29C]/15 text-[#5ED29C] border border-[#5ED29C]/40 hover:bg-[#5ED29C]/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> 🛡️ Permissions Matrix (RBAC)
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('basic')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    modalTab === 'basic' ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  👤 Personal &amp; Position
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('bank')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    modalTab === 'bank' ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  🆔 Govt ID &amp; Bank Details
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Section 1: Basic Information */}
              {(modalTab === 'all' || modalTab === 'basic') && (
                <>
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-[#5ED29C] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> 1. Personal &amp; Identification Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Employee ID */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">1. Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.empCode}
                      onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                      placeholder="e.g. EMP-1001"
                      className="w-full p-2.5 rounded-xl bg-[#070B0A] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono font-bold text-[#5ED29C]"
                    />
                  </div>

                  {/* 2. Employee Name */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">2. Employee Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Amit Verma"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  {/* 3. Contact Number */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">3. Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765-11001"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  {/* 4. Alternate Number */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">4. Alternate Number</label>
                    <input
                      type="text"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      placeholder="e.g. +91 94191-22001"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  {/* 5. Email */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">5. Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. amit@accnosolution.com"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  {/* 7. Portal Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-semibold flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-[#5ED29C]" /> Portal Login Password *
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-[10px] bg-[#5ED29C]/20 hover:bg-[#5ED29C]/30 text-[#5ED29C] px-1.5 py-0.5 rounded border border-[#5ED29C]/40 font-bold cursor-pointer transition-colors"
                        title="Generate strong random password"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Set employee login password (e.g. Admin@123)"
                        className="w-full p-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1 flex items-center gap-1 font-sans">
                      <KeyRound className="w-3 h-3 shrink-0" />
                      This password is saved and directly used by this employee to log in.
                    </p>
                  </div>

                  {/* 6. Address */}
                  <div className="sm:col-span-3">
                    <label className="block text-white/70 font-semibold mb-1">6. Residential Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House No 14, Sector 2, Gandhi Nagar, Jammu"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Department, Role & Salary */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> 2. Department &amp; Position Assignment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 8. Department (Selectable with Add/Remove) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-semibold">8. Department *</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openAddModal('department', 'Add New Department')}
                          className="text-[10px] bg-[#5ED29C]/20 hover:bg-[#5ED29C]/30 text-[#5ED29C] px-1.5 py-0.5 rounded border border-[#5ED29C]/40 font-bold cursor-pointer"
                          title="Add new Department option"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('department', 'Remove Department', formData.department)}
                          className="text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold cursor-pointer"
                          title="Remove current Department option"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isNowAdmin = val.toLowerCase() === 'admin' || formData.designation.toLowerCase() === 'admin';
                        setFormData((prev) => ({
                          ...prev,
                          department: val,
                          permissions: isNowAdmin ? adminEmployeePermissions : prev.permissions,
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#070B0A] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    >
                      {departmentList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 9. Designation / Role Title (Selectable with Add/Remove) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-semibold">9. Designation / Role Title *</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openAddModal('designation', 'Add New Designation / Role Title')}
                          className="text-[10px] bg-[#5ED29C]/20 hover:bg-[#5ED29C]/30 text-[#5ED29C] px-1.5 py-0.5 rounded border border-[#5ED29C]/40 font-bold cursor-pointer"
                          title="Add new Designation option"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('designation', 'Remove Designation', formData.designation)}
                          className="text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold cursor-pointer"
                          title="Remove current Designation option"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.designation}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isNowAdmin = val.toLowerCase() === 'admin' || formData.department.toLowerCase() === 'admin';
                        setFormData((prev) => ({
                          ...prev,
                          designation: val,
                          permissions: isNowAdmin ? adminEmployeePermissions : prev.permissions,
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#070B0A] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    >
                      {designationList.map((desig) => (
                        <option key={desig} value={desig}>
                          {desig}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 10. Base Monthly Salary */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">10. Base Monthly Salary (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      placeholder="e.g. 45000"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono font-bold"
                    />
                  </div>

                  {/* 11. Joining Date */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">11. Joining Date</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  {/* 17. Active Status */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">17. Active Status *</label>
                    <select
                      value={formData.activeStatus}
                      onChange={(e) => setFormData({ ...formData, activeStatus: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-[#070B0A] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    >
                      <option value="Active">Active (On Duty)</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">12. Emergency Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Sunita Verma (Wife)"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  {/* Emergency Phone */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">13. Emergency Phone</label>
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="e.g. +91 98765-11002"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>
                </div>
              </div>
                </>
              )}

              {/* Section 3: Government ID & Documentation */}
              {(modalTab === 'all' || modalTab === 'bank') && (
                <>
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 3. Government ID &amp; Document Attachment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 14. Government ID (Selectable with Add/Remove) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/70 font-semibold">14. Govt ID Type</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openAddModal('govtIdType', 'Add New Govt ID Option')}
                          className="text-[10px] bg-[#5ED29C]/20 hover:bg-[#5ED29C]/30 text-[#5ED29C] px-1.5 py-0.5 rounded border border-[#5ED29C]/40 font-bold cursor-pointer"
                          title="Add new Govt ID Option"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => openRemoveModal('govtIdType', 'Remove Govt ID Option', formData.govtIdType)}
                          className="text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold cursor-pointer"
                          title="Remove current Govt ID Option"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <select
                      value={formData.govtIdType}
                      onChange={(e) => setFormData({ ...formData, govtIdType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#070B0A] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    >
                      {govtIdList.map((gid) => (
                        <option key={gid} value={gid}>
                          {gid}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 15. Government ID Number */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">15. Government ID Number</label>
                    <input
                      type="text"
                      value={formData.govtIdNumber}
                      onChange={(e) => setFormData({ ...formData, govtIdNumber: e.target.value })}
                      placeholder="e.g. 4829-1092-8831"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  {/* 16. ID Attachment / Document File */}
                  <div className="sm:col-span-3 space-y-2 pt-1 border-t border-white/5">
                    <label className="block text-white/70 font-semibold">
                      16. Government ID Attachment / Document File (Upload File or Enter URL)
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      {/* File Upload Button */}
                      <input
                        type="file"
                        id="govt-id-file-input"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="govt-id-file-input"
                        className="px-4 py-2.5 rounded-xl bg-[#5ED29C]/20 hover:bg-[#5ED29C]/30 text-[#5ED29C] border border-[#5ED29C]/40 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                      >
                        <Upload className="w-4 h-4" /> Upload Document File
                      </label>

                      <div className="text-white/40 text-[10px] uppercase font-bold text-center sm:text-left shrink-0">
                        OR PASTE LINK:
                      </div>

                      {/* URL Text Input */}
                      <input
                        type="text"
                        value={formData.idAttachment}
                        onChange={(e) => setFormData({ ...formData, idAttachment: e.target.value })}
                        placeholder="e.g. https://.../aadhaar.pdf or paste document URL"
                        className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono text-xs"
                      />
                    </div>

                    {/* Document Attachment Status / Preview Badge */}
                    {formData.idAttachment && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-xs mt-2">
                        <div className="flex items-center gap-2 text-white truncate max-w-md">
                          <FileCheck className="w-4 h-4 text-[#5ED29C] shrink-0" />
                          <span className="font-mono text-[11px] truncate text-slate-200">
                            {formData.idAttachment.startsWith('data:')
                              ? '✅ Document File Attached (Uploaded Image / PDF File)'
                              : formData.idAttachment}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={formData.idAttachment}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-[#5ED29C] text-[#070B0A] text-[10px] font-extrabold flex items-center gap-1 hover:bg-[#16FFC6] transition-all"
                          >
                            <Eye className="w-3 h-3" /> View / Download
                          </a>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, idAttachment: '' })}
                            className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 cursor-pointer"
                            title="Clear document attachment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: 19. Bank Details */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" /> 19. Bank Account &amp; Payroll Transfer Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">A/c Holder Name</label>
                    <input
                      type="text"
                      value={formData.bankAccountName}
                      onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                      placeholder="e.g. Amit Verma"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      placeholder="e.g. 50100492817263"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={formData.bankBranch}
                      onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                      placeholder="e.g. Gandhi Nagar Branch"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Branch Code</label>
                    <input
                      type="text"
                      value={formData.bankBranchCode}
                      onChange={(e) => setFormData({ ...formData, bankBranchCode: e.target.value })}
                      placeholder="e.g. 000412"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">IFS Code</label>
                    <input
                      type="text"
                      value={formData.bankIfscCode}
                      onChange={(e) => setFormData({ ...formData, bankIfscCode: e.target.value })}
                      placeholder="e.g. HDFC0000412"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C] font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
                </>
              )}

              {/* Section 4: Module Access & Function Permissions Matrix (RBAC) */}
              {(modalTab === 'all' || modalTab === 'permissions') && (
                <>
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2.5 gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" /> 4. Module Access &amp; Function Permissions Matrix (RBAC)
                    </h3>
                    <p className="text-[11px] text-white/50">
                      Determine exactly which ERP functions this employee can View, Create, Edit, or Delete.
                    </p>
                  </div>

                  {/* Permission Quick Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, permissions: adminEmployeePermissions }))}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, permissions: defaultEmployeePermissions }))}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Technician
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, permissions: viewOnlyPermissions }))}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      View-Only
                    </button>
                  </div>
                </div>

                {/* Permissions Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[10px] uppercase font-bold text-white/50 border-b border-white/10">
                      <tr>
                        <th className="p-2.5">Module Function</th>
                        <th className="p-2.5 text-center w-20">View</th>
                        <th className="p-2.5 text-center w-20">Create</th>
                        <th className="p-2.5 text-center w-20">Edit</th>
                        <th className="p-2.5 text-center w-20">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {modulePermissionLabels.map(({ key, label, desc }) => {
                        const currentPerm = (formData.permissions || defaultEmployeePermissions)[key] || {
                          view: false, create: false, edit: false, delete: false
                        };

                        const updatePerm = (field: 'view' | 'create' | 'edit' | 'delete', val: boolean) => {
                          const updatedModule = { ...currentPerm, [field]: val };
                          if (val && field !== 'view') updatedModule.view = true;
                          if (!val && field === 'view') {
                            updatedModule.create = false;
                            updatedModule.edit = false;
                            updatedModule.delete = false;
                          }

                          const updatedPerms = {
                            ...(formData.permissions || defaultEmployeePermissions),
                            [key]: updatedModule,
                          };
                          setFormData((prev) => ({ ...prev, permissions: updatedPerms }));
                        };

                        return (
                          <tr key={key} className="hover:bg-white/5 transition-colors">
                            <td className="p-2.5">
                              <div className="font-bold text-white text-xs">{label}</div>
                              <div className="text-[10px] text-white/40">{desc}</div>
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={currentPerm.view}
                                onChange={(e) => updatePerm('view', e.target.checked)}
                                className="w-4 h-4 accent-[#5ED29C] rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={currentPerm.create}
                                onChange={(e) => updatePerm('create', e.target.checked)}
                                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={currentPerm.edit}
                                onChange={(e) => updatePerm('edit', e.target.checked)}
                                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={currentPerm.delete}
                                onChange={(e) => updatePerm('delete', e.target.checked)}
                                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                >
                  {editingEmp ? 'Save Employee Profile' : 'Create Staff Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Drawer Modal */}
      {viewingEmp && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/15 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/20 border border-[#5ED29C] text-[#5ED29C] font-extrabold text-lg flex items-center justify-center">
                  {viewingEmp.name ? viewingEmp.name.charAt(0) : 'E'}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{viewingEmp.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-[#5ED29C] bg-[#5ED29C]/10 border border-[#5ED29C]/30 px-2 py-0.2 rounded">
                      {viewingEmp.empCode}
                    </span>
                    <span className="text-xs text-white/60">{viewingEmp.designation}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingEmp(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4 text-xs">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-white/50 text-[10px] block uppercase font-bold">Department</span>
                  <span className="font-bold text-white">{viewingEmp.department}</span>
                </div>
                <div>
                  <span className="text-white/50 text-[10px] block uppercase font-bold">Status</span>
                  <span
                    className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      viewingEmp.activeStatus === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : viewingEmp.activeStatus === 'On Leave'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {viewingEmp.activeStatus}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 text-[10px] block uppercase font-bold">Joining Date</span>
                  <span className="font-mono text-slate-300">{viewingEmp.joiningDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-white/50 text-[10px] block uppercase font-bold">Base Monthly Salary</span>
                  <span className="font-mono font-extrabold text-[#5ED29C]">
                    ₹{(viewingEmp.baseSalary || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Contact Information & Portal Access */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                  Contact Details &amp; Access Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/50">Primary Contact Phone:</span>
                    <span className="font-mono text-cyan-300 font-bold ml-2">{viewingEmp.phone}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Alternate Phone:</span>
                    <span className="font-mono text-cyan-300 ml-2">{viewingEmp.alternatePhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Email Address:</span>
                    <span className="font-mono text-slate-300 ml-2">{viewingEmp.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Portal Password:</span>
                    {viewingEmp.password ? (
                      <span className="font-mono text-[#5ED29C] font-bold ml-2 inline-flex items-center gap-1.5 bg-[#5ED29C]/10 px-2 py-0.5 rounded border border-[#5ED29C]/30">
                        {showViewDrawerPassword ? viewingEmp.password : '••••••••'}
                        <button
                          type="button"
                          onClick={() => setShowViewDrawerPassword(!showViewDrawerPassword)}
                          className="text-white/50 hover:text-white ml-1 cursor-pointer"
                          title={showViewDrawerPassword ? 'Hide password' : 'Show password'}
                        >
                          {showViewDrawerPassword ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </span>
                    ) : (
                      <span className="text-white/40 ml-2 italic">Not set</span>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-white/50">Address:</span>
                    <span className="text-white font-semibold ml-2">{viewingEmp.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/50">Contact Person:</span>
                    <span className="text-white font-bold ml-2">{viewingEmp.emergencyContactName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Emergency Phone:</span>
                    <span className="font-mono text-amber-400 font-bold ml-2">
                      {viewingEmp.emergencyContactPhone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Government ID Documentation */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Government ID &amp; Document Attachment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-white/50">Govt ID Type:</span>
                    <span className="text-white font-bold ml-2">{viewingEmp.govtIdType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50">ID Number:</span>
                    <span className="font-mono text-slate-200 ml-2">{viewingEmp.govtIdNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50">ID Attachment:</span>
                    {viewingEmp.idAttachment ? (
                      <a
                        href={viewingEmp.idAttachment}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-[#5ED29C] hover:underline font-bold"
                      >
                        <ExternalLink className="w-3 h-3" /> View Document
                      </a>
                    ) : (
                      <span className="text-white/40 ml-2">Not Attached</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                  Bank Account &amp; Direct Deposit Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <span className="text-white/50 block text-[10px]">A/c Holder Name</span>
                    <span className="text-white font-bold">{viewingEmp.bankAccountName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[10px]">Account Number</span>
                    <span className="font-mono text-amber-300 font-bold">{viewingEmp.bankAccountNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[10px]">Bank Name</span>
                    <span className="text-white font-semibold">{viewingEmp.bankName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[10px]">Branch Name</span>
                    <span className="text-slate-300">{viewingEmp.bankBranch || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[10px]">Branch Code</span>
                    <span className="font-mono text-slate-300">{viewingEmp.bankBranchCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[10px]">IFS Code</span>
                    <span className="font-mono text-[#5ED29C] font-bold uppercase">{viewingEmp.bankIfscCode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Module Access & Function Permissions Matrix */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Authorized Module Access &amp; Role Permissions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {modulePermissionLabels.map(({ key, label }) => {
                    const p = (viewingEmp.permissions || defaultEmployeePermissions)[key] || {
                      view: false, create: false, edit: false, delete: false
                    };

                    return (
                      <div key={key} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="font-semibold text-white/90 text-[11px] truncate max-w-[160px]">{label}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              p.view ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/30'
                            }`}
                            title="View Permission"
                          >
                            V
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              p.create ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-white/30'
                            }`}
                            title="Create Permission"
                          >
                            C
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              p.edit ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/30'
                            }`}
                            title="Edit Permission"
                          >
                            E
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              p.delete ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 text-white/30'
                            }`}
                            title="Delete Permission"
                          >
                            D
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const emp = viewingEmp;
                  setViewingEmp(null);
                  handleOpenEdit(emp);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>

              <button
                onClick={() => setViewingEmp(null)}
                className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold cursor-pointer"
              >
                Close Profile
              </button>
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
