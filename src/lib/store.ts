import { create } from 'zustand';
import {
  pushTicketToSupabase,
  deleteTicketFromSupabase,
  pushInvoiceToSupabase,
  deleteInvoiceFromSupabase,
  pushBookRepairLeadToSupabase,
  pushSupportLeadToSupabase,
  pushEmployeeToSupabase,
  deleteEmployeeFromSupabase,
} from './supabase-sync';

export interface LineItemBilling {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
  itemType: 'service' | 'part' | 'outsource';
  sku?: string;
  remarks?: string;
}

export interface RepairTicket {
  id: string;
  ticket_number: string; // TKT-1001
  barcode_data: string;
  customer_name: string;
  customer_phone: string;
  customerAlternatePhone?: string;
  customerCompanyName?: string;
  customerEmail?: string;
  customerGstin?: string;
  customerAddress?: string;
  customerType: 'RETAIL' | 'CORPORATE';

  device_type: string;
  brand: string;
  model: string;
  serial_or_imei: string;
  passwordLock?: string;
  patternLockSequence?: number[]; // Array of node indices (0..8) on 3x3 pattern lock picker grid
  rackLocation: string; // Physical storage shelf/bin designation
  problem_reported: string;
  physicalCondition: string;

  status: 'received' | 'diagnosing' | 'waiting_approval' | 'approved' | 'in_progress' | 'testing' | 'ready_for_pickup' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progressPercentage?: number;

  lineItems: LineItemBilling[];
  outsourceCharges: number;
  freightCharges: number;
  estimated_cost: number;
  advance_paid: number;
  discountAmount: number;
  gstTaxRate: number; // e.g. 18%
  subtotal: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  roundOffAdjustment: number;
  grandTotal: number;
  netDueBalance: number;

  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'NETBANKING';
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';

  warrantyStatement: string; // "30 Days Parts & Labor Warranty"
  deliveredTo?: string;
  deliveryStatus: string;
  afterServiceRemarks?: string;

  technician_name: string;
  entryDate: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;

  // Extended Intake Fields
  deviceColor?: string;
  chassisColor?: string;
  receivedQty?: number;
  receivedQuantity?: number;
  hwChecklist?: {
    display: boolean;
    keyboard: boolean;
    wifi: boolean;
    camera: boolean;
    speakers: boolean;
    charging: boolean;
    powerBtn: boolean;
  };
  conditionChecklist?: {
    scratches: boolean;
    missingScrews: boolean;
    crackedBody: boolean;
    liquidIndicator: boolean;
    priorRepair: boolean;
  };
  accessoriesChecklist?: {
    charger: boolean;
    bag: boolean;
    mouse: boolean;
    boxBill: boolean;
    simCard: boolean;
  };
  osToInstall?: string;
  intakePhotos?: string[]; // Max 3 image base64 / data URLs
  outsourceHistoryDetails?: string;
  placeOfPurchase?: string;
  purchaseInvoiceNo?: string;
  purchaseDate?: string;
  jobPipelineStatus?: string;
  assignedTechnician?: string;
  warrantyStatus?: string;
  partsToBeOrdered?: string;
  requestedWork?: string;
  extraInfoArea?: string;

  invoiceId?: string;
  invoiceNumber?: string;
  invoiceDate?: string;

  created_at: string;
}

export interface RepairInvoice {
  id: string;
  invoiceNumber: string; // TIN-1001
  ticketId: string;
  ticketNumber: string; // TKT-1001
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
  customerType: 'RETAIL' | 'CORPORATE';
  deviceType: string;
  brand: string;
  model: string;
  serial_or_imei: string;
  lineItems: LineItemBilling[];
  outsourceCharges: number;
  freightCharges: number;
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstTaxRate: number;
  cgstAmount: number;
  sgstAmount: number;
  roundOffAdjustment: number;
  grandTotal: number;
  advancePaid: number;
  netDueBalance: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'NETBANKING';
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  warrantyStatement: string;
  deliveredTo?: string;
  deliveryStatus?: string;
  afterServiceRemarks?: string;
  invoiceDate: string;
  ticketDetails?: RepairTicket;
}

export interface OutsourceVoucher {
  id: string;
  voucherNumber: string; // OUT-1001 (editable for back-dated entry)
  voucherDate: string;   // YYYY-MM-DD (voucher date for back-dated entry)
  linkedTicketNumber: string; // TKT-1001
  vendorJobId?: string; // Vendor's internal reference ticket number
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorCity: string;
  vendorAddress?: string;
  vendorGstin?: string;
  serviceType: string; // CPU Reballing, Screen Refurbishing, Motherboard Repair, etc.

  // Point 2: Outgoing Courier Details
  outgoingCourier: string; // Courier Company (e.g. Bluedart, DTDC, Speed Post)
  outgoingDocket: string;  // Docket / Tracking No.
  outgoingDispatchDate: string; // Dispatch Date
  outgoingFreightCost: number; // Outgoing Freight Cost (₹)

  // Point 2: Incoming Courier Details (Return)
  incomingCourier?: string; // Courier Company
  incomingDocket?: string;  // Docket / Tracking No.
  incomingDispatchDate?: string; // Dispatch Date / Return Date
  incomingFreightCost?: number; // Incoming Freight Cost (₹)
  expectedReturnDate?: string;
  receivedDate?: string;

  // Cost & Profit Ledger
  vendorCostPrice: number;
  freightCharges: number; // Total freight (outgoing + incoming)
  customerSellingPrice: number;
  profitMargin: number; // customerSellingPrice - (vendorCostPrice + totalFreight)

  // Point 4: Outsource Status & Detailed Description
  dispatchStatus: 'SHIPPED' | 'IN_REPAIR' | 'RETURNED' | 'COMPLETED' | 'CANCELLED';
  technicalInstructions?: string; // Outsource Job Detailed Description
  testingNotes?: string;
}

export interface CustomerItem {
  id: string;
  code: string;
  name: string;
  companyName?: string;
  category?: string;
  accountGroup?: string;
  mobile: string;
  phone?: string;
  alternateContact?: string;
  email?: string;
  website?: string;
  dob?: string;
  weddingAnniversary?: string;
  panNumber?: string;
  gstin?: string;
  state?: string;
  billingAddress?: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  accountStatus: string;
  referredBy?: string;
  creditLimit: number;
  outstandingBalance: number;
  internalNotes?: string;

  bankAccountName?: string;
  bankAccountType?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  bankBranch?: string;
  upiId?: string;

  loyaltyPoints?: number;
  kycVerified?: boolean;
  tier?: 'Platinum VIP' | 'Standard' | 'High Risk';
  totalRepairs: number;
}

export interface VendorItem {
  id: string;
  vendorType: 'Standard Vendor' | 'Outsource Vendor';
  code: string; // VEN-1001 or OVE-1001
  companyName: string;
  name?: string;
  contactPerson: string;
  category?: string;
  accountGroup?: string;
  designation?: string;
  activeStatus: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  website?: string;
  station?: string;
  state?: string;
  fullAddress?: string;
  address?: string;
  gstin?: string;
  pan?: string;
  openingBalance: number;
  outstandingBalance: number;
  maxCreditLimit: number;
  internalNotes?: string;

  bankAccountName?: string;
  bankAccountType?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  bankBranch?: string;
  upiId?: string;
}

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface EmployeePermissions {
  repairTickets: ModulePermission;     // Service Tickets / Job Intake
  repairBilling: ModulePermission;     // Repair Tax Invoices & Receipt Bills
  salesBilling: ModulePermission;      // General POS, Retail Invoices & Quotations
  accountingVouchers: ModulePermission;// Accounting Vouchers (Receipts, Payments, Contra, Journals, Debit/Credit Notes)
  inventory: ModulePermission;         // Spare Parts & Product Inventory
  customers: ModulePermission;         // Customer Masters & Ledgers
  vendors: ModulePermission;           // Vendor Masters & Suppliers
  outsource: ModulePermission;         // Outsource Repair Vouchers
  dataRecovery: ModulePermission;      // Data Recovery Cases
  amc: ModulePermission;               // AMC Contracts & PM Visits
  reports: ModulePermission;           // Financial Reports & Analytics
  settings: ModulePermission;          // System Rules & Settings
}

export const defaultEmployeePermissions: EmployeePermissions = {
  repairTickets: { view: true, create: true, edit: true, delete: false },
  repairBilling: { view: true, create: true, edit: true, delete: false },
  salesBilling: { view: true, create: true, edit: true, delete: false },
  accountingVouchers: { view: true, create: false, edit: false, delete: false },
  inventory: { view: true, create: false, edit: false, delete: false },
  customers: { view: true, create: true, edit: true, delete: false },
  vendors: { view: true, create: false, edit: false, delete: false },
  outsource: { view: true, create: true, edit: true, delete: false },
  dataRecovery: { view: true, create: true, edit: true, delete: false },
  amc: { view: true, create: false, edit: false, delete: false },
  reports: { view: false, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
};

export const adminEmployeePermissions: EmployeePermissions = {
  repairTickets: { view: true, create: true, edit: true, delete: true },
  repairBilling: { view: true, create: true, edit: true, delete: true },
  salesBilling: { view: true, create: true, edit: true, delete: true },
  accountingVouchers: { view: true, create: true, edit: true, delete: true },
  inventory: { view: true, create: true, edit: true, delete: true },
  customers: { view: true, create: true, edit: true, delete: true },
  vendors: { view: true, create: true, edit: true, delete: true },
  outsource: { view: true, create: true, edit: true, delete: true },
  dataRecovery: { view: true, create: true, edit: true, delete: true },
  amc: { view: true, create: true, edit: true, delete: true },
  reports: { view: true, create: true, edit: true, delete: true },
  settings: { view: true, create: true, edit: true, delete: true },
};

export const viewOnlyPermissions: EmployeePermissions = {
  repairTickets: { view: true, create: false, edit: false, delete: false },
  repairBilling: { view: true, create: false, edit: false, delete: false },
  salesBilling: { view: true, create: false, edit: false, delete: false },
  accountingVouchers: { view: true, create: false, edit: false, delete: false },
  inventory: { view: true, create: false, edit: false, delete: false },
  customers: { view: true, create: false, edit: false, delete: false },
  vendors: { view: true, create: false, edit: false, delete: false },
  outsource: { view: true, create: false, edit: false, delete: false },
  dataRecovery: { view: true, create: false, edit: false, delete: false },
  amc: { view: true, create: false, edit: false, delete: false },
  reports: { view: true, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
};

export interface EmployeeItem {
  id: string;
  empCode: string; // EMP-1001 (Employee ID)
  name: string; // Employee Name
  phone: string; // Contact Number
  alternatePhone?: string; // Alternate Number
  email: string; // Email
  address?: string; // Address
  department: string; // Department (Selectable)
  designation: string; // Designation / Role Title (Selectable)
  baseSalary: number; // Base Monthly Salary
  joiningDate: string; // Joining Date
  emergencyContactName?: string; // Emergency Contact Name
  emergencyContactPhone?: string; // Emergency Phone
  govtIdType?: string; // Government ID Type (Selectable)
  govtIdNumber?: string; // Government ID Number
  idAttachment?: string; // ID Attachment Link / Document URL
  activeStatus: 'Active' | 'On Leave' | 'Inactive'; // Active Status
  role?: string;
  password?: string; // Portal Access Password

  // Permissions Matrix
  permissions?: EmployeePermissions;

  // Bank Details
  bankAccountName?: string; // A/c Holder
  bankAccountNumber?: string; // A/c Number
  bankName?: string; // Bank Name
  bankBranch?: string; // Branch
  bankBranchCode?: string; // Branch Code
  bankIfscCode?: string; // IFS Code

  created_at: string;
}

export interface EmployeeRulesConfig {
  employeePrefix: string;
  employeeStartWithNo: number;
  displayFormat: 'tabular' | 'grid';
  departmentOptions: string[];
  designationOptions: string[];
  govtIdTypeOptions: string[];
  fieldVisibility: {
    empCode: boolean;
    name: boolean;
    phone: boolean;
    alternatePhone: boolean;
    email: boolean;
    address: boolean;
    department: boolean;
    designation: boolean;
    baseSalary: boolean;
    joiningDate: boolean;
    emergencyContact: boolean;
    govtId: boolean;
    idAttachment: boolean;
    activeStatus: boolean;
    bankDetails: boolean;
  };
}

export interface HsnMasterItem {

  hsnCode: string;
  gstRate: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  itemType: 'Retail Part' | 'Service Part';
  code: string; // PRT-1001 or SRV-1001
  name: string;
  category: string;
  uom: string;
  defaultQuantity: number;
  sellingPrice: number;
  mrp: number;
  costPrice: number;
  currentStock: number;
  lowStockAlert: number;
  activeStatus: string;
  hsnCode: string;
  gstRate: number;
  barcode: string;
  productImage?: string;
  productGroup: string;
  description?: string;
  productCondition?: 'New' | 'Refurbished';
  refurbishedDescription?: string;

  compatibleModels?: string;
  comfortabilityFeatures?: string;
  supplierVendor?: string;
  storageLocation?: string;
  conversionFactor?: number;
  conversionUnit?: string;
  openingBalance?: number;
  showOnWebsiteShop?: boolean;
}

export interface CartItem {
  product: InventoryItem;
  quantity: number;
}

export interface CustomerRulesConfig {
  autoPrefixPattern: string;
  startWithNo: number;
  displayFormat: 'tabular' | 'grid';
  defaultMaxCreditLimit: number;
  blockBillingOnCreditExceeded: boolean;
  paymentDueTerms: string;
  requiredFields: {
    gstinForB2B: boolean;
    panNumber: boolean;
    billingAddress: boolean;
    alternatePhone: boolean;
  };
  loyaltyAndGreetings: {
    enableLoyaltyPoints: boolean;
    pointsPerHundred: number;
    pointValueInRupees: number;
    signupBonusPoints: number;
    minRedemptionPoints: number;
    maxRedemptionPercent: number;
    vipMultiplier: number;
    birthdayBonusPoints: number;
    anniversaryBonusPoints: number;
    pointsExpiryDays: number;
    autoSmsBirthdayGreeting: boolean;
    autoSmsAnniversaryGreeting: boolean;
  };
  creditRiskAndLateFees: {
    enableGracePeriod: boolean;
    gracePeriodDays: number;
    lateFeePercentPerMonth: number;
    autoCalculateRiskScore: boolean;
  };
  notifications: {
    autoWhatsappInvoice: boolean;
    autoWhatsappRepairUpdates: boolean;
    overdueReminderDaysBefore: number;
  };
  documentKYC: {
    requireGstCertificateForB2B: boolean;
    requirePanCopyForCredit: boolean;
  };
  archivalPolicy: {
    preventHardDeleteWithBalance: boolean;
  };
  fieldVisibility: {
    name: boolean;
    companyName: boolean;
    category: boolean;
    accountGroup: boolean;
    mobile: boolean;
    alternateContact: boolean;
    email: boolean;
    website: boolean;
    dob: boolean;
    weddingAnniversary: boolean;
    panNumber: boolean;
    gstin: boolean;
    state: boolean;
    billingAddress: boolean;
    shippingAddress: boolean;
    city: boolean;
    pinCode: boolean;
    accountStatus: boolean;
    referredBy: boolean;
    creditLimit: boolean;
    outstandingBalance: boolean;
    internalNotes: boolean;
    bankDetails: boolean;
  };
}

export interface VendorRulesConfig {
  standardPrefix: string;
  standardStartWithNo: number;
  outsourcePrefix: string;
  outsourceStartWithNo: number;
  displayFormat: 'tabular' | 'grid';
  defaultMaxCreditLimit: number;
  blockPoOnCreditExceeded: boolean;
  paymentDueTerms: string;
  requireGstin: boolean;
  requirePan: boolean;
  fieldVisibility: {
    vendorType: boolean;
    companyName: boolean;
    contactPerson: boolean;
    category: boolean;
    accountGroup: boolean;
    designation: boolean;
    activeStatus: boolean;
    phone: boolean;
    alternatePhone: boolean;
    email: boolean;
    website: boolean;
    station: boolean;
    state: boolean;
    fullAddress: boolean;
    gstin: boolean;
    pan: boolean;
    openingBalance: boolean;
    outstandingBalance: boolean;
    maxCreditLimit: boolean;
    internalNotes: boolean;
    bankDetails: boolean;
  };
}

export interface InventoryRulesConfig {
  retailPrefix: string;
  retailStartWithNo: number;
  servicePrefix: string;
  serviceStartWithNo: number;
  displayFormat: 'tabular' | 'grid';
  defaultLowStockAlert: number;
  fieldVisibility: {
    productImage: boolean;
    hsnCode: boolean;
    gstRate: boolean;
    barcode: boolean;
    storageLocation: boolean;
    compatibleModels: boolean;
    comfortabilityFeatures: boolean;
    supplierVendor: boolean;
    conversionFactor: boolean;
    openingBalance: boolean;
  };
}

export interface RepairBillingRulesConfig {
  repair_ticket_prefix: string; // TKT-
  repair_ticket_start_no: number; // 1001
  repair_invoice_prefix: string; // RBN-
  repair_invoice_start_no: number; // 1001
  repair_bill_prefix?: string; // TKT- (legacy fallback)
  repair_bill_start_no?: number; // 1001 (legacy fallback)
  repair_bill_default_tax: number; // 18%
  repair_bill_auto_roundoff: boolean; // true
  repair_bill_delivery_statuses: string[];
  defaultPrintCopyMode?: 'both' | 'customer' | 'office';
  showTermsBoxOnBill?: boolean;
  
  // Separate Terms & Conditions for Tickets & Billing
  ticketTermsAndConditions?: string[];
  billingTermsAndConditions?: string[];
  termsAndConditions: string[]; // fallback
  dataLiabilityNotice: string;
  defaultWarrantyStatement: string;
  rackLocationOptions: string[];
  priorityOptions: string[];
  // Printed Footer Customization
  printFooterLegalNotice?: string;
  printFooterDocTypeLabel?: string;

  showPatternLockGrid: boolean;
  showUpiQrCode: boolean;
  showSignatureBlock: boolean;
  fitToOnePage: boolean;

  deviceCategoryOptions?: string[];
  osOptions?: string[];
  pipelineOptions?: string[];
  techOptions?: string[];
  deliveryStatusOptions?: string[];
  warrantyStatusOptions?: string[];
  statusFilterOptions?: string[];
  priorityFilterOptions?: string[];
  stickerLabelSizeOptions?: string[];
  barcodeLayoutOptions?: string[];
  gstTaxModeOptions?: string[];
  paymentMethodOptions?: string[];
  paymentStatusOptions?: string[];
  hwChecklistItems?: string[];
  conditionChecklistItems?: string[];
  accessoriesChecklistItems?: string[];
}

export interface OutsourceRulesConfig {
  outsource_ticket_prefix: string; // OUT-
  outsource_ticket_start_no: number; // 1001
  outsource_service_types: string[];
  outsource_default_freight: number; // 250
  outsource_default_vendor_id?: string;
  outsource_auto_lock_ticket?: boolean;
  outsource_default_label_size?: '70x35' | '50x30';
  outsource_require_tracking_ref?: boolean;
}

export interface PosRulesConfig {
  posPrefix: string;
  posStartWithNo: number;
  defaultPrintMode: 'thermal' | 'a4';
  autoPrintInvoiceOnPayment: boolean;
  showMerchantQr: boolean;
  enableDiscountControl: boolean;
  maxDiscountPercent: number;
  enableLoyaltyRedemption: boolean;
  terminalId: string;
  defaultPaymentMethod: 'upi' | 'cash' | 'card';
  enableHoldParkBills: boolean;
  autoDeductInventory: boolean;
  allowNegativeStock: boolean;
  defaultCustomerName: string;
  showTermsOnPosReceipt?: boolean;
  posTermsAndConditions?: string[];
}

export interface SaleRulesConfig {
  salesInvoicePrefix: string;
  salesInvoiceStartNo: number;
  defaultPaymentTerms: string;
  defaultGstSupplyType: string;
  defaultTaxRate: number;
  autoRoundOffGrandTotal: boolean;
  enableDiscountLimits: boolean;
  maxDiscountPercent: number;
  autoBarcodeScanAddItem: boolean;
  requireCustomerPhone: boolean;
  requireCustomerGstForB2B: boolean;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  defaultPrintCopyMode: 'both' | 'customer' | 'office';
  showTermsBoxOnInvoice: boolean;
  showProductRemarksOnPrint?: boolean;
  showRefurbishedBadgeOnPrint?: boolean;
  showBankQrOnInvoice?: boolean;
  termsAndConditions: string[];
}

export interface PurchaseRulesConfig {
  purchaseBillPrefix: string;
  purchaseBillStartNo: number;
  defaultPaymentTerms: string;
  defaultGstSupplyType: string;
  defaultTaxRate: number;
  autoRoundOffGrandTotal: boolean;
  autoAddInventoryStock: boolean;
  requireVendorGst: boolean;
  requireVendorInvoiceNo: boolean;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  showInwardLogisticsNotes: boolean;
  showProductRemarksOnPrint?: boolean;
  showRefurbishedBadgeOnPrint?: boolean;
  showBankDetailsOnVoucher?: boolean;
  termsAndConditions: string[];
}

export interface SalesReturnRulesConfig {
  salesReturnPrefix: string;
  salesReturnStartNo: number;
  autoRestockInventory: boolean;
  defaultRefundStatus: string;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  showBankDetailsOnVoucher?: boolean;
  termsAndConditions: string[];
}

export interface PurchaseReturnRulesConfig {
  purchaseReturnPrefix: string;
  purchaseReturnStartNo: number;
  autoDeductInventory: boolean;
  defaultRmaStatus: string;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  showBankDetailsOnVoucher?: boolean;
  termsAndConditions: string[];
}

export interface QuotationRulesConfig {
  quotationPrefix: string;
  quotationStartNo: number;
  defaultValidityDays: number;
  defaultPaymentTerms: string;
  defaultGstSupplyType: string;
  defaultTaxRate: number;
  autoRoundOffGrandTotal: boolean;
  enableDiscountLimits: boolean;
  maxDiscountPercent: number;
  autoBarcodeScanAddItem: boolean;
  requireCustomerPhone: boolean;
  requireCustomerGstForB2B: boolean;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  defaultPrintCopyMode: 'both' | 'customer' | 'office';
  showTermsBoxOnQuotation: boolean;
  showProductRemarksOnPrint?: boolean;
  showRefurbishedBadgeOnPrint?: boolean;
  showBankQrOnQuotation?: boolean;
  termsAndConditions: string[];
}

export interface VoucherRulesConfig {
  receiptPrefix: string;
  receiptStartNo: number;
  paymentPrefix: string;
  paymentStartNo: number;
  debitNotePrefix: string;
  debitNoteStartNo: number;
  creditNotePrefix: string;
  creditNoteStartNo: number;
  contraPrefix: string;
  contraStartNo: number;
  journalPrefix: string;
  journalStartNo: number;
  defaultPrintPaperFormat: 'A4' | 'A5' | 'THERMAL';
  defaultPrintCopyMode: 'both' | 'standard' | 'office';
  requirePartySelection: boolean;
  requireNarrationExplanation: boolean;
  autoStrictDoubleEntryCheck: boolean;
  showBankDetailsOnPrint: boolean;
  showSignatureBlockOnPrint: boolean;
  enableLiveLedgerSearch: boolean;
  termsAndConditions: string[];
}

export interface CompanyBankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  branchCode: string;
  ifscCode: string;
}

export interface CompanyDetailsConfig {
  companyLegalName: string;
  companyTagLine: string;
  companyLogo: string;
  merchantUpiId: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  stateCode: string;
  website: string;
  email: string;
  gstin: string;
  contactPerson: string;
  designation: string;
  designationOptions: string[];
  phoneNumber: string;
  alternateNumber: string;
  panNumber: string;
  bankDetails: CompanyBankDetails;
  notes: string;
}

export interface DataRecoveryOutsource {
  destination: string;
  status: string;
  dispatchDate?: string;
  returnDate?: string;
  amount?: number;
  freight?: number;
}

export interface DataRecoveryCase {
  id: string;
  recoveryIdNumber: string;
  caseNumber: string;
  entryDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGst?: string;
  customerAddress?: string;

  deviceBrand: string;
  deviceType: string;
  driveModel: string;
  driveSerial: string;
  capacity: string;
  fileSystem: string;

  damageType: string;
  priority: string;
  symptoms: string;
  status: string;
  technician: string;
  storageLocation: string;

  isOutsourced?: boolean;
  outsource?: DataRecoveryOutsource;

  estimateCost: number;
  advance: number;
  customerCharge: number;
  freight: number;
  discount: number;
  gstRate: number;
  totalInvoice: number;
  deposit: number;
  balanceDue: number;

  diagnosticFee: number;
  recoveryFee: number;
  paidAmount: number;
  paymentStatus: string;

  termsConsentAccepted: boolean;
  requestedWork: string;
  additionalInfo: string;
  confidentialNotes: string;
  recoveryPhaseStatus: string;
  progressPercentage: number;

  estimatedDataGb: number;
  recoveredDataGb: number;
  healthPercentage: number;
  rackLocation: string;
  donorDriveSerial?: string;
  notes?: string;
  targetDriveDetails?: string;
  created_at: string;
}

export interface PosCartItem {
  id: string;
  name: string;
  sku: string;
  code?: string;
  barcode?: string;
  unit_price: number;
  quantity: number;
  gst_rate: number;
  type: 'part' | 'service' | 'product';
  description?: string;
  remarks?: string;
  productImage?: string;
  category?: string;
  productGroup?: string;
  productCondition?: 'New' | 'Refurbished';
  refurbishedDescription?: string;
}

export interface AmcAssetItem {
  id: string;
  assetName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
}

export interface AmcRetailProductItem {
  id: string;
  productId?: string;
  name: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  gstRate: number;
  totalPrice: number;
}

export interface AmcPmVisit {
  id: string;
  visitNumber: number;
  visitDate: string;
  status: string; // Scheduled / Completed / Missed / Rescheduled
  technician: string;
  visitPurpose: string;
  serviceActionsPerformed?: string;
  completedDate?: string;
}

export interface AmcComplaint {
  id: string;
  complaintNumber: string;
  logDate: string;
  description: string;
  status: string; // Open / In Progress / Resolved / Closed
  technician: string;
  internalNotes?: string;
  resolvedDate?: string;
}

export interface AmcContract {
  id: string;
  contractNumber: string; // AMC-1001 (Auto)
  manualEntryDate: string;

  // Customer Details (Item 3 & 4)
  customerId?: string;
  customerName: string;
  companyName?: string;
  customerPhone: string;
  alternatePhone?: string;
  customerEmail?: string;
  customerGst?: string;
  customerAddress?: string;

  // Plan & Financials (Item 5, 6, 7, 22)
  planOption: string; // Silver Plan / Gold Plan / Platinum Plan
  contractCost: number;
  amcAmount: number;
  gstRate: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: string; // Unpaid / Partially Paid / Paid

  // Dates & Status (Item 8, 9, 10, 15)
  startDate: string;
  endDate: string;
  renewalDate: string;
  contractStatus: string; // Active / Expiring / Expired / Renewed / Cancelled

  // Service Scope & Specs (Item 11, 12, 13, 14, 17, 18, 19, 20, 21, 23, 24)
  coverageScopeDetails: string;
  source: string; // Direct / Referral / Website / Phone Inquiry
  serviceType: string; // On-site / Remote / Hybrid / Hardware + Software
  numberOfDevices: number;
  totalServiceVisits: number;
  assignedTechnician: string;
  priority: string; // Low / Normal / High / Emergency
  deviceType: string; // Desktop PC / Laptop / Server / Printer / CCTV DVR / Router
  issueFound?: string;
  notes?: string;

  // Lists & Linked Sections (Item 16, 23, PM Schedule, Complaints)
  serviceIncludedChecklist: string[];
  retailProducts: AmcRetailProductItem[];
  coveredAssets: AmcAssetItem[];
  pmVisits: AmcPmVisit[];
  complaints: AmcComplaint[];

  // Legacy field support
  planType?: string;
  slaTier?: string;
  paymentFrequency?: string;
  status?: string;

  // Invoice linkage
  invoiceGenerated: boolean;
  invoiceNumber?: string;
  invoiceDate?: string;

  created_at: string;
}

export interface SupportLeadItem {
  id: string;
  lead_name: string;
  phone: string;
  email?: string;
  company?: string;
  subject: string;
  message: string;
  service_interested: string;
  status: 'New Inquiry' | 'Contacted' | 'Quotation Sent' | 'Closed Won' | 'Archived';
  source: 'Website Contact Form' | 'Online Shop Order' | 'ERP Software Quote' | 'Data Recovery Form' | 'Corporate AMC Form' | 'Direct Call' | 'WhatsApp Inquiry' | 'Walk-in';
  formCategory?: 'shop_order' | 'erp_quote' | 'contact_form' | 'data_recovery' | 'corporate_amc' | 'general';
  paymentProofImage?: string;
  utrNumber?: string;
  orderTotal?: number;
  licenseNo?: string;
  created_at: string;
}

export interface BookRepairLeadItem {
  id: string;
  bookingNo: string;
  name: string;
  phone: string;
  email?: string;
  deviceType: string;
  brand: string;
  model?: string;
  serviceMode: string;
  problemDescription: string;
  address?: string;
  status: 'New Booking' | 'Confirmed' | 'Job Card Converted' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  coverImage: string;
  imagePosition: 'top' | 'header_hero' | 'inline_middle' | 'sidebar_right' | 'bottom';
  status: 'Published' | 'Draft' | 'Archived';
  featured?: boolean;
  views: number;
  created_at: string;
}

export interface MilestoneItem {
  id: string;
  year: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  order?: number;
  created_at: string;
}

export interface AchievementStatItem {
  id: string;
  label: string;
  value: string;
  description?: string;
  order?: number;
  created_at: string;
}

export interface LeadershipTeamMember {
  id: string;
  name: string;
  role: string;
  experienceBio: string;
  photoUrl?: string;
  initials?: string;
  order?: number;
  created_at: string;
}

export interface HardwareRepairCatalogItem {
  id: string;
  category: 'desktop' | 'laptop' | 'mac' | 'phone' | 'printer' | 'datarecovery';
  title: string;
  estPrice: string;
  desc: string;
  warrantyDays?: number;
  order?: number;
  created_at: string;
}

export interface RepairProcessStepItem {
  id: string;
  step: string;
  title: string;
  desc: string;
  order?: number;
  created_at: string;
}

export interface EnterpriseSolutionItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  link: string;
  iconName?: string;
  order?: number;
  created_at?: string;
}

export interface DetailedServiceItem {
  id: string;
  category: string;
  badge: string;
  iconName?: string;
  title: string;
  shortDesc: string;
  whyChoose: string;
  features: string[];
  idealFor: string;
  turnaround: string;
  warranty: string;
  actionLink: string;
  actionText: string;
  isVisible: boolean;
  order?: number;
  created_at?: string;
}

export interface ServiceStatItem {
  id: string;
  value: string;
  label: string;
  color?: string;
  isVisible: boolean;
  order?: number;
  created_at?: string;
}

export interface ServicePillarItem {
  id: string;
  iconName?: string;
  title: string;
  desc: string;
  badge?: string;
  isVisible: boolean;
  order?: number;
  created_at?: string;
}

export interface ServicesFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isVisible: boolean;
  order?: number;
  created_at?: string;
}

export interface WebsitePromotionBar {
  isEnabled: boolean;
  text: string;
  badgeText: string;
  actionText: string;
  actionLink: string;
  theme: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose';
  isDismissible: boolean;
}

export interface WebsitePromotionItem {
  id: string;
  title: string;
  category: string;
  text: string;
  badgeText: string;
  actionText: string;
  actionLink: string;
  theme: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose';
  isDismissible: boolean;
  isActive: boolean;
  created_at?: string;
}

export interface AmcRulesConfig {
  amc_contract_prefix: string;
  amc_contract_start_no: number;
  amc_plan_options: string[];
  amc_payment_statuses: string[];
  amc_contract_statuses: string[];
  amc_sources: string[];
  amc_device_types: string[];
  amc_priorities: string[];
  amc_technicians: string[];
  amc_service_checklists: string[];
}

export interface AccountLedgerItem {
  id: string;
  accountName: string;
  groupType: 'Bank' | 'Cash' | 'Credit / Party' | 'Expense' | 'Income' | 'Capital' | 'Asset' | 'Liability';
  openingBalance: number;
  balanceType: 'Dr' | 'Cr';
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  remarks?: string;
  activeStatus: 'Active' | 'Inactive';
  created_at: string;
}

export interface JournalLineItem {
  id: string;
  accountLedger: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  narration?: string;
}

export interface AccountingVoucher {
  id: string;
  voucherNumber: string;
  voucherType: 'RECEIPT' | 'PAYMENT' | 'DEBIT_NOTE' | 'CREDIT_NOTE' | 'CONTRA' | 'JOURNAL';
  voucherDate: string;

  partyName?: string;
  partyPhone?: string;
  partyGst?: string;
  refInvoiceNumber?: string;
  paymentMode?: 'Cash' | 'UPI / GPay' | 'HDFC Bank NEFT/RTGS' | 'Cheque' | 'Petty Cash' | 'Cash Deposit' | 'Cash Withdrawal' | 'Inter-Bank Transfer' | 'Petty Cash Transfer';
  instrumentRefNo?: string;

  debitLedger?: string;
  creditLedger?: string;
  amount: number;
  gstAmount?: number;
  totalAmount: number;

  journalLines?: JournalLineItem[];
  narration: string;
  created_at: string;
}

export interface TransactionItemLine {
  id: string;
  itemId?: string;
  name: string;
  sku?: string;
  category?: string;
  hsnCode?: string;
  gstRate: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: 'fixed' | 'percent';
  totalPrice: number;
  serialNumber?: string;
  remarks?: string;
  productCondition?: 'New' | 'Refurbished';
  refurbishedDescription?: string;
}

export interface SalesInvoiceItem {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerGst?: string;
  customerAddress?: string;
  paymentTerms: string;
  paymentMethod: string;
  items: TransactionItemLine[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  taxAmount: number;
  shippingCharges: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  remarks?: string;
  showProductRemarksOnPrint?: boolean;
  showRefurbishedBadgeOnPrint?: boolean;
  created_at: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  billNo: string;
  billDate: string;
  vendorId: string;
  vendorName: string;
  vendorPhone?: string;
  vendorGst?: string;
  vendorAddress?: string;
  paymentTerms: string;
  paymentMethod: string;
  items: TransactionItemLine[];
  subtotal: number;
  taxAmount: number;
  freightCharges: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  supplyType?: 'INTRA_STATE' | 'INTER_STATE';
  discount?: number;
  discountType?: 'fixed' | 'percent';
  poRefNo?: string;
  showProductRemarksOnPrint?: boolean;
  showRefurbishedBadgeOnPrint?: boolean;
  remarks?: string;
  created_at: string;
}

export interface SalesReturnItem {
  id: string;
  returnNo: string;
  returnDate: string;
  originalInvoiceNo?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerGst?: string;
  customerAddress?: string;
  items: TransactionItemLine[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  returnReason: string;
  restockToStock: boolean;
  refundStatus: 'Refunded' | 'Adjusted' | 'Pending' | 'Cleared';
  remarks?: string;
  created_at: string;
}

export interface PurchaseReturnItem {
  id: string;
  returnNo: string;
  returnDate: string;
  originalBillNo?: string;
  vendorId: string;
  vendorName: string;
  vendorPhone?: string;
  vendorGst?: string;
  vendorAddress?: string;
  items: TransactionItemLine[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  returnReason: string;
  deductFromStock?: boolean;
  rmaStatus: 'Completed' | 'Pending' | 'Rejected' | 'Pending Vendor Credit';
  remarks?: string;
  created_at: string;
}

export interface QuotationItem {
  id: string;
  quotationNo: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerGst?: string;
  customerAddress?: string;
  items: TransactionItemLine[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Converted';
  termsAndConditions?: string;
  notes?: string;
  convertedInvoiceNo?: string;
  created_at: string;
}

export interface ErpStore {
  // Sales Invoices State
  salesInvoices: SalesInvoiceItem[];
  setSalesInvoices: (invoices: SalesInvoiceItem[]) => void;
  addSalesInvoice: (invoice: Omit<SalesInvoiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateSalesInvoice: (id: string, updated: Partial<SalesInvoiceItem>) => void;
  deleteSalesInvoice: (id: string) => void;

  // Purchase Invoices State
  purchaseInvoices: PurchaseInvoiceItem[];
  setPurchaseInvoices: (invoices: PurchaseInvoiceItem[]) => void;
  addPurchaseInvoice: (bill: Omit<PurchaseInvoiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updatePurchaseInvoice: (id: string, updated: Partial<PurchaseInvoiceItem>) => void;
  deletePurchaseInvoice: (id: string) => void;

  // Sales Returns State
  salesReturns: SalesReturnItem[];
  addSalesReturn: (ret: Omit<SalesReturnItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateSalesReturn: (id: string, updatedData: Partial<SalesReturnItem>) => void;
  deleteSalesReturn: (id: string) => void;

  // Purchase Returns State
  purchaseReturns: PurchaseReturnItem[];
  addPurchaseReturn: (ret: Omit<PurchaseReturnItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updatePurchaseReturn: (id: string, updatedData: Partial<PurchaseReturnItem>) => void;
  deletePurchaseReturn: (id: string) => void;

  // Quotations State
  quotations: QuotationItem[];
  addQuotation: (q: Omit<QuotationItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateQuotation: (id: string, updated: Partial<QuotationItem>) => void;
  deleteQuotation: (id: string) => void;
  convertQuotationToSalesInvoice: (quotationId: string) => string | undefined;

  // Existing Repair Ticket & Invoice State
  tickets: RepairTicket[];
  repairInvoices: RepairInvoice[];
  repairBillingRules: RepairBillingRulesConfig;
  activeFilter: string;
  setTickets: (tickets: RepairTicket[]) => void;
  setRepairInvoices: (invoices: RepairInvoice[]) => void;
  addTicket: (ticketData: Omit<RepairTicket, 'id' | 'created_at' | 'barcode_data'> & { ticket_number?: string }) => void;

  updateTicket: (id: string, updatedData: Partial<RepairTicket>) => void;
  deleteTicket: (id: string) => void;
  updateTicketStatus: (id: string, status: RepairTicket['status']) => void;
  issueRepairInvoice: (ticketId: string, invoiceData: Omit<RepairInvoice, 'id' | 'invoiceDate'> & { invoiceNumber?: string; invoiceDate?: string }) => void;
  updateRepairInvoice: (id: string, updatedData: Partial<RepairInvoice>) => void;
  deleteRepairInvoice: (id: string) => void;
  updateRepairBillingRules: (rules: Partial<RepairBillingRulesConfig>) => void;

  // Outsourced Repairs State & Rules
  outsourceVouchers: OutsourceVoucher[];
  setOutsourceVouchers: (vouchers: OutsourceVoucher[]) => void;
  outsourceRules: OutsourceRulesConfig;
  addOutsourceVoucher: (voucherData: Omit<OutsourceVoucher, 'id' | 'profitMargin'> & { voucherNumber?: string }) => void;
  updateOutsourceVoucher: (id: string, updatedData: Partial<OutsourceVoucher>) => void;
  deleteOutsourceVoucher: (id: string) => void;
  updateOutsourceRules: (rules: Partial<OutsourceRulesConfig>) => void;
  
  // Customers State
  customers: CustomerItem[];
  setCustomers: (customers: CustomerItem[]) => void;
  customerRules: CustomerRulesConfig;
  addCustomer: (cust: Omit<CustomerItem, 'id' | 'code' | 'totalRepairs'>) => void;
  updateCustomer: (id: string, cust: Partial<CustomerItem>) => void;
  deleteCustomer: (id: string) => void;
  updateCustomerRules: (rules: Partial<CustomerRulesConfig>) => void;

  // Vendors State & Rules
  vendors: VendorItem[];
  setVendors: (vendors: VendorItem[]) => void;
  vendorRules: VendorRulesConfig;
  addVendor: (vendorData: Omit<VendorItem, 'id' | 'code'>) => void;
  updateVendor: (id: string, vendorData: Partial<VendorItem>) => void;
  deleteVendor: (id: string) => void;
  updateVendorRules: (rules: Partial<VendorRulesConfig>) => void;

  // Employees State & Actions
  employees: EmployeeItem[];
  setEmployees: (employees: EmployeeItem[]) => void;
  employeeRules: EmployeeRulesConfig;
  addEmployee: (emp: Omit<EmployeeItem, 'id' | 'empCode' | 'created_at'> & { empCode?: string }) => void;
  updateEmployee: (id: string, emp: Partial<EmployeeItem>) => void;
  deleteEmployee: (id: string) => void;
  updateEmployeeRules: (rules: Partial<EmployeeRulesConfig>) => void;
  addDepartmentOption: (dept: string) => void;
  removeDepartmentOption: (dept: string) => void;
  addDesignationOption: (desig: string) => void;
  removeDesignationOption: (desig: string) => void;
  addGovtIdTypeOption: (type: string) => void;
  removeGovtIdTypeOption: (type: string) => void;


  // Inventory State & Rules
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  inventoryRules: InventoryRulesConfig;
  addInventoryItem: (itemData: Omit<InventoryItem, 'id' | 'code'>) => void;
  updateInventoryItem: (id: string, itemData: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateInventoryRules: (rules: Partial<InventoryRulesConfig>) => void;

  // Data Recovery Cases State
  dataRecoveryCases: DataRecoveryCase[];
  setDataRecoveryCases: (cases: DataRecoveryCase[]) => void;
  addDataRecoveryCase: (caseData: Omit<DataRecoveryCase, 'id' | 'created_at'> & { caseNumber?: string }) => void;
  updateDataRecoveryCase: (id: string, updatedData: Partial<DataRecoveryCase>) => void;
  deleteDataRecoveryCase: (id: string) => void;

  // AMC Contracts State
  amcContracts: AmcContract[];
  setAmcContracts: (contracts: AmcContract[]) => void;
  amcRules: AmcRulesConfig;
  addAmcContract: (contractData: Omit<AmcContract, 'id' | 'created_at'> & { contractNumber?: string }) => void;
  updateAmcContract: (id: string, updatedData: Partial<AmcContract>) => void;
  deleteAmcContract: (id: string) => void;
  updateAmcRules: (rules: Partial<AmcRulesConfig>) => void;

  // Accounting Vouchers State
  accountingVouchers: AccountingVoucher[];
  addAccountingVoucher: (voucherData: Omit<AccountingVoucher, 'id' | 'created_at'> & { voucherNumber?: string }) => void;
  updateAccountingVoucher: (id: string, updatedData: Partial<AccountingVoucher>) => void;
  deleteAccountingVoucher: (id: string) => void;

  // HSN Master Settings State
  hsnCodes: HsnMasterItem[];
  addHsnCode: (hsn: HsnMasterItem) => void;
  updateHsnCode: (hsnCode: string, updated: Partial<HsnMasterItem>) => void;
  deleteHsnCode: (hsnCode: string) => void;

  // Company Details Configuration State
  companyDetails: CompanyDetailsConfig;
  updateCompanyDetails: (details: Partial<CompanyDetailsConfig>) => void;

  // POS Rules & Configuration State
  posRules: PosRulesConfig;
  updatePosRules: (rules: Partial<PosRulesConfig>) => void;

  // Commercial Sale Rules Configuration State
  saleRules: SaleRulesConfig;
  updateSaleRules: (rules: Partial<SaleRulesConfig>) => void;

  // Vendor Purchase Rules Configuration State
  purchaseRules: PurchaseRulesConfig;
  updatePurchaseRules: (rules: Partial<PurchaseRulesConfig>) => void;

  // Sales Return Rules Configuration State
  salesReturnRules: SalesReturnRulesConfig;
  updateSalesReturnRules: (rules: Partial<SalesReturnRulesConfig>) => void;

  // Purchase Return Rules Configuration State
  purchaseReturnRules: PurchaseReturnRulesConfig;
  updatePurchaseReturnRules: (rules: Partial<PurchaseReturnRulesConfig>) => void;

  // Quotation Rules Configuration State
  quotationRules: QuotationRulesConfig;
  updateQuotationRules: (rules: Partial<QuotationRulesConfig>) => void;

  // All Vouchers Rules Configuration State
  voucherRules: VoucherRulesConfig;
  updateVoucherRules: (rules: Partial<VoucherRulesConfig>) => void;

  // POS State
  cart: PosCartItem[];
  selectedCustomer: { id: string; name: string; phone: string; gst?: string } | null;
  addToCart: (item: PosCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateUnitPrice: (id: string, newPrice: number) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: { id: string; name: string; phone: string; gst?: string } | null) => void;
  
  // App User
  currentUser: { name: string; role: string; email: string; department?: string; designation?: string } | null;
  setCurrentUser: (user: { name: string; role: string; email: string; department?: string; designation?: string } | null) => void;

  // Custom Account Ledgers State
  customLedgers: AccountLedgerItem[];
  addAccountLedger: (ledger: Omit<AccountLedgerItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateAccountLedger: (id: string, updated: Partial<AccountLedgerItem>) => void;
  deleteAccountLedger: (id: string) => void;

  // Support Leads State & Actions
  supportLeads: SupportLeadItem[];
  setSupportLeads: (leads: SupportLeadItem[]) => void;
  addSupportLead: (lead: Omit<SupportLeadItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateSupportLead: (id: string, updated: Partial<SupportLeadItem>) => void;
  deleteSupportLead: (id: string) => void;

  // Book Repair Online Leads State & Actions
  bookRepairLeads: BookRepairLeadItem[];
  setBookRepairLeads: (leads: BookRepairLeadItem[]) => void;
  addBookRepairLead: (lead: Omit<BookRepairLeadItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateBookRepairLead: (id: string, updated: Partial<BookRepairLeadItem>) => void;
  deleteBookRepairLead: (id: string) => void;

  // Blog Management State & Actions
  blogPosts: BlogPostItem[];
  setBlogPosts: (posts: BlogPostItem[]) => void;
  addBlogPost: (post: Omit<BlogPostItem, 'id' | 'views' | 'created_at'> & { id?: string; views?: number; created_at?: string }) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPostItem>) => void;
  deleteBlogPost: (id: string) => void;

  // Company Milestones State & Actions
  milestones: MilestoneItem[];
  setMilestones: (milestones: MilestoneItem[]) => void;
  addMilestone: (milestone: Omit<MilestoneItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateMilestone: (id: string, updated: Partial<MilestoneItem>) => void;
  deleteMilestone: (id: string) => void;

  // Key Achievement Counter Metrics State & Actions
  achievementStats: AchievementStatItem[];
  addAchievementStat: (stat: Omit<AchievementStatItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateAchievementStat: (id: string, updated: Partial<AchievementStatItem>) => void;
  deleteAchievementStat: (id: string) => void;

  // Leadership Team State & Actions
  leadershipMembers: LeadershipTeamMember[];
  addLeadershipMember: (member: Omit<LeadershipTeamMember, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateLeadershipMember: (id: string, updated: Partial<LeadershipTeamMember>) => void;
  deleteLeadershipMember: (id: string) => void;

  // Hardware Repair Catalog State & Actions
  hardwareRepairCatalog: HardwareRepairCatalogItem[];
  addHardwareRepairCatalogItem: (item: Omit<HardwareRepairCatalogItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateHardwareRepairCatalogItem: (id: string, updated: Partial<HardwareRepairCatalogItem>) => void;
  deleteHardwareRepairCatalogItem: (id: string) => void;

  // Repair Process Steps (SOP) State & Actions
  repairProcessSteps: RepairProcessStepItem[];
  addRepairProcessStep: (step: Omit<RepairProcessStepItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateRepairProcessStep: (id: string, updated: Partial<RepairProcessStepItem>) => void;
  deleteRepairProcessStep: (id: string) => void;

  // Enterprise IT & Solutions Grid State & Actions
  enterpriseSolutions: EnterpriseSolutionItem[];
  addEnterpriseSolution: (item: Omit<EnterpriseSolutionItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateEnterpriseSolution: (id: string, updated: Partial<EnterpriseSolutionItem>) => void;
  deleteEnterpriseSolution: (id: string) => void;

  // Detailed Services & Specifications State & Actions
  detailedServices: DetailedServiceItem[];
  addDetailedService: (item: Omit<DetailedServiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateDetailedService: (id: string, updated: Partial<DetailedServiceItem>) => void;
  deleteDetailedService: (id: string) => void;
  toggleDetailedServiceVisibility: (id: string) => void;

  // Service Highlights & Stats State & Actions
  serviceStats: ServiceStatItem[];
  addServiceStat: (item: Omit<ServiceStatItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateServiceStat: (id: string, updated: Partial<ServiceStatItem>) => void;
  deleteServiceStat: (id: string) => void;
  toggleServiceStatVisibility: (id: string) => void;

  // Service Pillars & Rationale State & Actions
  servicePillars: ServicePillarItem[];
  addServicePillar: (item: Omit<ServicePillarItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateServicePillar: (id: string, updated: Partial<ServicePillarItem>) => void;
  deleteServicePillar: (id: string) => void;
  toggleServicePillarVisibility: (id: string) => void;

  // Services Page Frequently Asked Questions (FAQs) State & Actions
  servicesFaqs: ServicesFaqItem[];
  addServicesFaq: (item: Omit<ServicesFaqItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateServicesFaq: (id: string, updated: Partial<ServicesFaqItem>) => void;
  deleteServicesFaq: (id: string) => void;
  toggleServicesFaqVisibility: (id: string) => void;

  // Website Shopping Cart State & Actions
  websiteCart: CartItem[];
  addToWebsiteCart: (product: InventoryItem, qty?: number) => void;
  removeFromWebsiteCart: (productId: string) => void;
  updateWebsiteCartQty: (productId: string, qty: number) => void;
  clearWebsiteCart: () => void;

  // Website Top Promotion Bar & Promotion Campaigns State & Actions
  websitePromotions: WebsitePromotionItem[];
  addWebsitePromotion: (item: Omit<WebsitePromotionItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateWebsitePromotion: (id: string, updated: Partial<WebsitePromotionItem>) => void;
  deleteWebsitePromotion: (id: string) => void;
  selectActivePromotion: (id: string) => void;
  websitePromotionBar: WebsitePromotionBar;
  updateWebsitePromotionBar: (data: Partial<WebsitePromotionBar>) => void;
}

export type ErpState = ErpStore;

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (!saved || !saved.trim() || saved === 'undefined' || saved === 'null') return defaultValue;
    const parsed = JSON.parse(saved);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue)) {
      return (Array.isArray(parsed) ? parsed : defaultValue) as T;
    }
    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return { ...defaultValue, ...parsed };
    }
    return parsed as T;
  } catch (err) {
    console.warn(`Corrupted localStorage key "${key}", resetting to default:`, err);
    try {
      localStorage.removeItem(key);
    } catch {}
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    let toSave: any = value;
    // Security: Strip plain-text passwords from client localStorage to prevent credential theft
    if (key === 'accno_erp_employees' && Array.isArray(value)) {
      toSave = value.map((emp: any) => {
        if (!emp || typeof emp !== 'object') return emp;
        const { password, passwordHashOrPlain, ...safeEmp } = emp;
        return safeEmp;
      });
    }
    localStorage.setItem(key, JSON.stringify(toSave));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
    try {
      // If localStorage quota exceeded, sanitize large Base64 strings to prevent corruption
      const sanitized = JSON.parse(JSON.stringify(value, (k, v) => {
        if (typeof v === 'string' && v.startsWith('data:image/') && v.length > 30000) {
          return v.slice(0, 100) + '...[Attachment Saved]';
        }
        return v;
      }));
      localStorage.setItem(key, JSON.stringify(sanitized));
    } catch {}
  }
}

export const useErpStore = create<ErpState>((set, get) => ({
  // Repair Tickets & Invoices Initial State (Hydrated dynamically from Supabase Cloud)
  tickets: loadFromStorage<RepairTicket[]>('accno_erp_tickets', []),
  repairInvoices: loadFromStorage<RepairInvoice[]>('accno_erp_repair_invoices', []),

  // Repair Billing / Ticket Rules Configuration
  repairBillingRules: loadFromStorage('accno_erp_repair_billing_rules', {
    repair_ticket_prefix: 'TKT-',
    repair_ticket_start_no: 1001,
    repair_invoice_prefix: 'RBN-',
    repair_invoice_start_no: 1001,
    repair_bill_prefix: 'TKT-',
    repair_bill_start_no: 1001,
    repair_bill_default_tax: 18,
    repair_bill_auto_roundoff: true,
    defaultPrintCopyMode: 'both',
    showTermsBoxOnBill: true,
    repair_bill_delivery_statuses: [
      'RECEIVED IN LAB',
      'DIAGNOSING',
      'WAITING APPROVAL',
      'APPROVED FOR REPAIR',
      'IN PROGRESS',
      'TESTING & QC',
      'READY FOR PICKUP',
      'DELIVERED',
      'CANCELLED',
    ],
    ticketTermsAndConditions: [
      'Diagnosis charges are non-refundable once testing diagnostics begin.',
      'Estimate is subject to change if additional internal hardware faults are discovered during diagnostics.',
      'Customer must clear up all due balance prior to delivery or device release.',
      'Devices not claimed within 60 days after completion notification will be disposed of per shop policy.',
    ],
    billingTermsAndConditions: [
      '30 Days Parts & Labor Warranty.',
      'Warranty void with physical damage, liquid exposure, or open warranty seal.',
      'Backup data prior to servicing; Accno Solution is not liable for data loss.',
    ],
    termsAndConditions: [
      'Diagnosis charges are non-refundable once testing diagnostics begin.',
      'We offer 30 days warranty on replaced spare parts and associated labor.',
      'Customer must clear up all due balance prior to delivery or device release.',
      'Devices not claimed within 60 days after completion notification will be disposed of per shop policy.',
    ],
    dataLiabilityNotice: 'DATA LIABILITY NOTICE: Customers are requested to back up all data before submitting devices. Accno Solution is not liable for data loss during hardware/software service diagnostics.',
    defaultWarrantyStatement: '30 Days Parts & Labor Warranty',
    printFooterLegalNotice: 'THANK YOU FOR YOUR BUSINESS. ALL DISPUTES SUBJECT TO SANCHORE JURISDICTION.',
    printFooterDocTypeLabel: 'Computer Generated Official Repair Receipt.',
    rackLocationOptions: ['Cabinet C', 'Shelf A-1, B-04', 'Bin 04', 'Locker 12', 'Rack 02'],
    priorityOptions: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
    showPatternLockGrid: true,
    showUpiQrCode: true,
    showSignatureBlock: true,
    fitToOnePage: true,
  }),

  activeFilter: 'all',
  setTickets: (tickets: RepairTicket[]) => {
    saveToStorage('accno_erp_tickets', tickets);
    set({ tickets });
  },
  setRepairInvoices: (repairInvoices: RepairInvoice[]) => {
    saveToStorage('accno_erp_repair_invoices', repairInvoices);
    set({ repairInvoices });
  },
  addTicket: (ticketData: Omit<RepairTicket, 'id' | 'created_at' | 'barcode_data'> & { ticket_number?: string }) =>
    set((state: ErpState) => {
      const prefix = state.repairBillingRules.repair_ticket_prefix || state.repairBillingRules.repair_bill_prefix || 'TKT-';
      const startNo = state.repairBillingRules.repair_ticket_start_no || 1001;
      const nextNo = startNo + state.tickets.length;
      const defaultNo = `${prefix}${nextNo}`;
      const ticket_number = ticketData.ticket_number || defaultNo;
      const barcode_data = (ticketData as any).barcode_data || ticket_number.replace('-', '');
      const newTicket: RepairTicket = {
        ...ticketData,
        id: `t-${Date.now()}`,
        ticket_number,
        barcode_data,
        created_at: ticketData.entryDate ? `${ticketData.entryDate} 09:00 AM` : new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      const updatedTickets = [newTicket, ...state.tickets];
      saveToStorage('accno_erp_tickets', updatedTickets);
      try {
        pushTicketToSupabase(newTicket).catch((err) => console.warn('Supabase pushTicket error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
      return { tickets: updatedTickets };
    }),
  updateTicket: (id: string, updatedData: Partial<RepairTicket>) =>
    set((state: ErpState) => {
      const updatedTickets = state.tickets.map((t: RepairTicket) =>
        t.id === id || (t.ticket_number && (t.ticket_number === id || t.ticket_number === updatedData.ticket_number))
          ? { ...t, ...updatedData }
          : t
      );
      saveToStorage('accno_erp_tickets', updatedTickets);
      const target = updatedTickets.find((t: RepairTicket) => t.id === id || t.ticket_number === id);
      if (target) {
        try {
          pushTicketToSupabase(target).catch((err) => console.warn('Supabase updateTicket error:', err));
        } catch (e) {
          console.warn('Sync failed:', e);
        }
      }
      return { tickets: updatedTickets };
    }),
  deleteTicket: (id: string) =>
    set((state: ErpState) => {
      const target = state.tickets.find((t: RepairTicket) => t.id === id || t.ticket_number === id);
      const updatedTickets = state.tickets.filter((t: RepairTicket) => t.id !== id && t.ticket_number !== id);
      saveToStorage('accno_erp_tickets', updatedTickets);
      try {
        deleteTicketFromSupabase(id, target?.ticket_number).catch((err) => console.warn('Supabase deleteTicket error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
      return { tickets: updatedTickets };
    }),
  updateTicketStatus: (id: string, status: RepairTicket['status']) =>
    set((state: ErpState) => {
      const updatedTickets = state.tickets.map((t: RepairTicket) =>
        t.id === id || t.ticket_number === id ? { ...t, status } : t
      );
      saveToStorage('accno_erp_tickets', updatedTickets);
      const target = updatedTickets.find((t: RepairTicket) => t.id === id || t.ticket_number === id);
      if (target) {
        try {
          pushTicketToSupabase(target).catch((err) => console.warn('Supabase updateTicketStatus error:', err));
        } catch (e) {
          console.warn('Sync failed:', e);
        }
      }
      return { tickets: updatedTickets };
    }),

  issueRepairInvoice: (ticketId: string, invoiceData: Omit<RepairInvoice, 'id' | 'invoiceDate'> & { invoiceNumber?: string; invoiceDate?: string }) =>
    set((state: ErpState) => {
      const existing = state.repairInvoices.find(
        (inv: RepairInvoice) => inv.ticketId === ticketId || (invoiceData.ticketNumber && inv.ticketNumber === invoiceData.ticketNumber)
      );

      if (existing) {
        const merged: RepairInvoice = {
          ...existing,
          ...invoiceData,
        };
        const updatedInvoices = state.repairInvoices.map((inv: RepairInvoice) => (inv.id === existing.id ? merged : inv));
        saveToStorage('accno_erp_repair_invoices', updatedInvoices);

        const updatedTickets = state.tickets.map((t: RepairTicket) =>
          t.id === ticketId || t.ticket_number === merged.ticketNumber
            ? {
                ...t,
                status: 'delivered' as const,
                invoiceId: merged.id,
                invoiceNumber: merged.invoiceNumber,
                invoiceDate: merged.invoiceDate,
                deliveryStatus: merged.deliveryStatus || t.deliveryStatus || 'DELIVERED TO CUSTOMER',
                deliveredTo: merged.deliveredTo || t.deliveredTo || t.customer_name,
                afterServiceRemarks: merged.afterServiceRemarks || t.afterServiceRemarks,
              }
            : t
        );
        saveToStorage('accno_erp_tickets', updatedTickets);

        try {
          pushInvoiceToSupabase(merged).catch((err) => console.warn('Supabase pushInvoice error:', err));
          const updatedT = updatedTickets.find((t) => t.id === ticketId || t.ticket_number === merged.ticketNumber);
          if (updatedT) pushTicketToSupabase(updatedT).catch((err) => console.warn('Supabase pushTicket error:', err));
        } catch (e) {
          console.warn('Sync failed:', e);
        }

        return { repairInvoices: updatedInvoices, tickets: updatedTickets };
      }

      const prefix = state.repairBillingRules.repair_invoice_prefix || 'RBN-';
      const startNo = state.repairBillingRules.repair_invoice_start_no || 1001;
      const nextNo = startNo + state.repairInvoices.length;
      const autoInvNo = `${prefix}${nextNo}`;
      const finalInvoiceNumber = (invoiceData as any).invoiceNumber || autoInvNo;

      const newInvoice: RepairInvoice = {
        ...invoiceData,
        id: `inv-${Date.now()}`,
        ticketId: invoiceData.ticketId || ticketId,
        ticketNumber: (invoiceData as any).ticketNumber || '',
        invoiceNumber: finalInvoiceNumber,
        invoiceDate: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      };

      const updatedInvoices = [newInvoice, ...state.repairInvoices];
      const updatedTickets = state.tickets.map((t: RepairTicket) =>
        t.id === ticketId || (newInvoice.ticketNumber && t.ticket_number === newInvoice.ticketNumber)
          ? {
              ...t,
              status: 'delivered' as const,
              invoiceId: newInvoice.id,
              invoiceNumber: newInvoice.invoiceNumber,
              invoiceDate: newInvoice.invoiceDate,
              deliveryStatus: newInvoice.deliveryStatus || t.deliveryStatus || 'DELIVERED TO CUSTOMER',
              deliveredTo: newInvoice.deliveredTo || t.deliveredTo || t.customer_name,
              afterServiceRemarks: newInvoice.afterServiceRemarks || t.afterServiceRemarks,
            }
          : t
      );

      saveToStorage('accno_erp_repair_invoices', updatedInvoices);
      saveToStorage('accno_erp_tickets', updatedTickets);

      try {
        pushInvoiceToSupabase(newInvoice).catch((err) => console.warn('Supabase pushInvoice error:', err));
        const updatedT = updatedTickets.find((t) => t.id === ticketId || (newInvoice.ticketNumber && t.ticket_number === newInvoice.ticketNumber));
        if (updatedT) pushTicketToSupabase(updatedT).catch((err) => console.warn('Supabase pushTicket error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }

      return {
        repairInvoices: updatedInvoices,
        tickets: updatedTickets,
      };
    }),

  updateRepairInvoice: (id: string, updatedData: Partial<RepairInvoice>) =>
    set((state: ErpState) => {
      const updatedInvoices = state.repairInvoices.map((inv: RepairInvoice) => (inv.id === id ? { ...inv, ...updatedData } : inv));
      saveToStorage('accno_erp_repair_invoices', updatedInvoices);
      const target = updatedInvoices.find((inv) => inv.id === id);
      if (target) {
        try {
          pushInvoiceToSupabase(target).catch((err) => console.warn('Supabase updateRepairInvoice error:', err));
        } catch (e) {
          console.warn('Sync failed:', e);
        }
      }
      return { repairInvoices: updatedInvoices };
    }),

  deleteRepairInvoice: (id: string) =>
    set((state: ErpState) => {
      const targetInv = state.repairInvoices.find((inv: RepairInvoice) => inv.id === id);
      const updatedInvoices = state.repairInvoices.filter((inv: RepairInvoice) => inv.id !== id);
      saveToStorage('accno_erp_repair_invoices', updatedInvoices);

      let updatedTickets = state.tickets;
      if (targetInv) {
        updatedTickets = state.tickets.map((t: RepairTicket) => {
          if (t.id === targetInv.ticketId || t.ticket_number === targetInv.ticketNumber) {
            const copy = { ...t };
            delete copy.invoiceId;
            delete copy.invoiceNumber;
            return copy;
          }
          return t;
        });
        saveToStorage('accno_erp_tickets', updatedTickets);
      }

      try {
        deleteInvoiceFromSupabase(id, targetInv?.invoiceNumber).catch((err) => console.warn('Supabase deleteInvoice error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }

      return { repairInvoices: updatedInvoices, tickets: updatedTickets };
    }),

  updateRepairBillingRules: (rules: Partial<RepairBillingRulesConfig>) =>
    set((state: ErpState) => {
      const updated = {
        ...state.repairBillingRules,
        ...rules,
      };
      saveToStorage('accno_erp_repair_billing_rules', updated);
      return { repairBillingRules: updated };
    }),

  // Outsourced Repairs Initial State
  outsourceVouchers: loadFromStorage<OutsourceVoucher[]>('accno_erp_outsource_vouchers', []),
  setOutsourceVouchers: (outsourceVouchers: OutsourceVoucher[]) => {
    saveToStorage('accno_erp_outsource_vouchers', outsourceVouchers);
    set({ outsourceVouchers });
  },

  dataRecoveryCases: loadFromStorage<DataRecoveryCase[]>('accno_erp_data_recovery_cases', []),
  setDataRecoveryCases: (dataRecoveryCases: DataRecoveryCase[]) => {
    saveToStorage('accno_erp_data_recovery_cases', dataRecoveryCases);
    set({ dataRecoveryCases });
  },

  amcContracts: loadFromStorage<AmcContract[]>('accno_erp_amc_contracts', []),
  setAmcContracts: (amcContracts: AmcContract[]) => {
    saveToStorage('accno_erp_amc_contracts', amcContracts);
    set({ amcContracts });
  },

  setCustomers: (customers: CustomerItem[]) => {
    saveToStorage('accno_erp_customers', customers);
    set({ customers });
  },

  setVendors: (vendors: VendorItem[]) => {
    saveToStorage('accno_erp_vendors', vendors);
    set({ vendors });
  },

  setInventory: (inventory: InventoryItem[]) => {
    saveToStorage('accno_erp_inventory', inventory);
    set({ inventory });
  },

  setSalesInvoices: (salesInvoices: SalesInvoiceItem[]) => {
    saveToStorage('accno_erp_sales_invoices', salesInvoices);
    set({ salesInvoices });
  },

  setPurchaseInvoices: (purchaseInvoices: PurchaseInvoiceItem[]) => {
    saveToStorage('accno_erp_purchase_invoices', purchaseInvoices);
    set({ purchaseInvoices });
  },

  setSupportLeads: (supportLeads: SupportLeadItem[]) => {
    saveToStorage('accno_erp_support_leads', supportLeads);
    set({ supportLeads });
  },

  setBookRepairLeads: (bookRepairLeads: BookRepairLeadItem[]) => {
    saveToStorage('accno_erp_book_repair_leads', bookRepairLeads);
    set({ bookRepairLeads });
  },

  setBlogPosts: (blogPosts: BlogPostItem[]) => {
    saveToStorage('accno_erp_blog_posts', blogPosts);
    set({ blogPosts });
  },

  setMilestones: (milestones: MilestoneItem[]) => {
    saveToStorage('accno_erp_milestones', milestones);
    set({ milestones });
  },

  amcRules: loadFromStorage<AmcRulesConfig>('accno_erp_amc_rules', {
    amc_contract_prefix: 'AMC-',
    amc_contract_start_no: 1001,
    amc_plan_options: ['Silver Plan', 'Gold Plan', 'Platinum Plan', 'Custom Plan'],
    amc_payment_statuses: ['Unpaid', 'Partially Paid', 'Paid'],
    amc_contract_statuses: ['Active', 'Expiring', 'Expired', 'Renewed', 'Cancelled'],
    amc_sources: ['Direct', 'Referral', 'Website', 'Phone Inquiry', 'Walk-in Client'],
    amc_device_types: ['Desktop PC', 'Laptop', 'Server', 'Printer', 'CCTV DVR', 'Router / Switch'],
    amc_priorities: ['Low', 'Normal', 'High', 'Emergency'],
    amc_technicians: ['Deepak Kumar', 'Rahul Gupta', 'Priya Sharma', 'Sonia Mahajan'],
    amc_service_checklists: [
      'Dusting & Cleaning',
      'OS & Antivirus Update',
      'RAID Health Check',
      'Thermal Paste Refresh',
      'UPS & Power Back-up Test',
      'Data Back-up Audit'
    ],
  }),

  accountingVouchers: loadFromStorage<AccountingVoucher[]>('accno_erp_accounting_vouchers', []),

  outsourceRules: loadFromStorage('accno_erp_outsource_rules', {
    outsource_ticket_prefix: 'OUT-',
    outsource_ticket_start_no: 1001,
    outsource_service_types: [
      'CPU Reballing',
      'Screen Refurbishing',
      'Motherboard Repair',
      'Data Recovery Lab',
      'GPU Repair',
      'BIOS Reprogramming',
      'Laser Flex Bonding',
    ],
    outsource_default_freight: 250,
    outsource_default_vendor_id: 'v-1002',
    outsource_auto_lock_ticket: true,
    outsource_default_label_size: '70x35',
    outsource_require_tracking_ref: false,
  }),

  addOutsourceVoucher: (voucherData) =>
    set((state: ErpState) => {
      const nextNo = state.outsourceRules.outsource_ticket_start_no + state.outsourceVouchers.length;
      const defaultNo = `${state.outsourceRules.outsource_ticket_prefix}${nextNo}`;
      const voucherNumber = voucherData.voucherNumber || defaultNo;
      const outgoingFreight = Number(voucherData.outgoingFreightCost || 0);
      const incomingFreight = Number(voucherData.incomingFreightCost || 0);
      const totalFreight = outgoingFreight + incomingFreight || Number(voucherData.freightCharges || 0);
      const margin = voucherData.customerSellingPrice - (voucherData.vendorCostPrice + totalFreight);

      const newVoucher: OutsourceVoucher = {
        ...voucherData,
        id: `out-${Date.now()}`,
        voucherNumber,
        voucherDate: voucherData.voucherDate || new Date().toISOString().split('T')[0],
        outgoingFreightCost: outgoingFreight,
        incomingFreightCost: incomingFreight,
        freightCharges: totalFreight,
        profitMargin: margin,
      };

      // Auto update linked Repair Ticket if status is RETURNED or COMPLETED
      let updatedTickets = state.tickets;
      if (['RETURNED', 'COMPLETED'].includes(voucherData.dispatchStatus)) {
        updatedTickets = state.tickets.map((t: RepairTicket) => {
          if (t.ticket_number === voucherData.linkedTicketNumber) {
            return {
              ...t,
              outsourceCharges: voucherData.vendorCostPrice + totalFreight,
              outsourceHistoryDetails: `Outsourced to ${voucherData.vendorName} (${voucherData.serviceType}) - Status: ${voucherData.dispatchStatus}. Outgoing Docket: ${voucherData.outgoingDocket}. Lab Report: ${voucherData.technicalInstructions || 'N/A'}`,
            };
          }
          return t;
        });
      }

      const updatedVouchers = [newVoucher, ...state.outsourceVouchers];
      saveToStorage('accno_erp_outsource_vouchers', updatedVouchers);
      if (updatedTickets !== state.tickets) {
        saveToStorage('accno_erp_tickets', updatedTickets);
      }

      return {
        outsourceVouchers: updatedVouchers,
        tickets: updatedTickets,
      };
    }),

  updateOutsourceVoucher: (id, updatedData) =>
    set((state: ErpState) => {
      const updatedVouchers = state.outsourceVouchers.map((v: OutsourceVoucher) => {
        if (v.id !== id) return v;
        const merged = { ...v, ...updatedData };
        const outgoingFreight = Number(merged.outgoingFreightCost || 0);
        const incomingFreight = Number(merged.incomingFreightCost || 0);
        const totalFreight = outgoingFreight + incomingFreight || Number(merged.freightCharges || 0);
        const profitMargin = (merged.customerSellingPrice || 0) - ((merged.vendorCostPrice || 0) + totalFreight);
        return { ...merged, freightCharges: totalFreight, profitMargin };
      });

      const updatedVoucher = updatedVouchers.find((v: OutsourceVoucher) => v.id === id);
      let updatedTickets = state.tickets;

      if (updatedVoucher && ['RETURNED', 'COMPLETED'].includes(updatedVoucher.dispatchStatus)) {
        updatedTickets = state.tickets.map((t: RepairTicket) => {
          if (t.ticket_number === updatedVoucher.linkedTicketNumber) {
            return {
              ...t,
              outsourceCharges: updatedVoucher.vendorCostPrice + updatedVoucher.freightCharges,
              outsourceHistoryDetails: `Outsourced to ${updatedVoucher.vendorName} (${updatedVoucher.serviceType}) - Status: ${updatedVoucher.dispatchStatus}. Outgoing Docket: ${updatedVoucher.outgoingDocket}. Lab Report: ${updatedVoucher.technicalInstructions || 'N/A'}`,
            };
          }
          return t;
        });
      }

      saveToStorage('accno_erp_outsource_vouchers', updatedVouchers);
      if (updatedTickets !== state.tickets) {
        saveToStorage('accno_erp_tickets', updatedTickets);
      }

      return {
        outsourceVouchers: updatedVouchers,
        tickets: updatedTickets,
      };
    }),

  deleteOutsourceVoucher: (id: string) =>
    set((state: ErpState) => {
      const updated = state.outsourceVouchers.filter((v: OutsourceVoucher) => v.id !== id);
      saveToStorage('accno_erp_outsource_vouchers', updated);
      return { outsourceVouchers: updated };
    }),

  updateOutsourceRules: (rules: Partial<OutsourceRulesConfig>) =>
    set((state: ErpState) => {
      const updated = {
        ...state.outsourceRules,
        ...rules,
      };
      saveToStorage('accno_erp_outsource_rules', updated);
      return { outsourceRules: updated };
    }),

  addDataRecoveryCase: (caseData) =>
    set((state) => {
      const nextNo = 1001 + state.dataRecoveryCases.length;
      const recId = caseData.recoveryIdNumber || `REC-${nextNo}`;
      const caseNumber = caseData.caseNumber || recId;
      const newCase: DataRecoveryCase = {
        ...caseData,
        id: `drc-${Date.now()}`,
        recoveryIdNumber: recId,
        caseNumber,
        created_at: caseData.entryDate ? `${caseData.entryDate} 10:00 AM` : new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      const updated = [newCase, ...state.dataRecoveryCases];
      saveToStorage('accno_erp_data_recovery_cases', updated);
      return { dataRecoveryCases: updated };
    }),

  addAmcContract: (contractData) =>
    set((state) => {
      const nextNo = 1001 + state.amcContracts.length;
      const contractNumber = contractData.contractNumber || `AMC-${nextNo}`;
      const newContract: AmcContract = {
        ...contractData,
        id: `amc-${Date.now()}`,
        contractNumber,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      const updated = [newContract, ...state.amcContracts];
      saveToStorage('accno_erp_amc_contracts', updated);
      return { amcContracts: updated };
    }),

  updateAmcContract: (id, updatedData) =>
    set((state) => {
      const updated = state.amcContracts.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      saveToStorage('accno_erp_amc_contracts', updated);
      return { amcContracts: updated };
    }),

  deleteAmcContract: (id) =>
    set((state) => {
      const updated = state.amcContracts.filter((c) => c.id !== id);
      saveToStorage('accno_erp_amc_contracts', updated);
      return { amcContracts: updated };
    }),

  updateAmcRules: (rules) =>
    set((state) => {
      const updated = { ...state.amcRules, ...rules };
      saveToStorage('accno_erp_amc_rules', updated);
      return { amcRules: updated };
    }),

  addAccountingVoucher: (voucherData) =>
    set((state) => {
      const typePrefixes: Record<string, string> = {
        RECEIPT: 'RCT',
        PAYMENT: 'PAY',
        DEBIT_NOTE: 'DBN',
        CREDIT_NOTE: 'CRN',
        CONTRA: 'CNT',
        JOURNAL: 'JRN',
      };
      const prefix = typePrefixes[voucherData.voucherType] || 'VCH';
      const countForType = state.accountingVouchers.filter((v) => v.voucherType === voucherData.voucherType).length;
      const voucherNumber = voucherData.voucherNumber || `${prefix}-${1001 + countForType}`;
      const newVoucher: AccountingVoucher = {
        ...voucherData,
        id: `vch-${Date.now()}`,
        voucherNumber,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      const updated = [newVoucher, ...state.accountingVouchers];
      saveToStorage('accno_erp_accounting_vouchers', updated);
      return { accountingVouchers: updated };
    }),

  updateAccountingVoucher: (id, updatedData) =>
    set((state) => {
      const updated = state.accountingVouchers.map((v) => (v.id === id ? { ...v, ...updatedData } : v));
      saveToStorage('accno_erp_accounting_vouchers', updated);
      return { accountingVouchers: updated };
    }),

  deleteAccountingVoucher: (id) =>
    set((state) => {
      const updated = state.accountingVouchers.filter((v) => v.id !== id);
      saveToStorage('accno_erp_accounting_vouchers', updated);
      return { accountingVouchers: updated };
    }),

  updateDataRecoveryCase: (id, updatedData) =>
    set((state) => {
      const updated = state.dataRecoveryCases.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      saveToStorage('accno_erp_data_recovery_cases', updated);
      return { dataRecoveryCases: updated };
    }),

  deleteDataRecoveryCase: (id) =>
    set((state) => {
      const updated = state.dataRecoveryCases.filter((c) => c.id !== id);
      saveToStorage('accno_erp_data_recovery_cases', updated);
      return { dataRecoveryCases: updated };
    }),

  // Customers Rules Default Configuration
  customerRules: loadFromStorage('accno_erp_customer_rules', {
    autoPrefixPattern: 'CUST-',
    startWithNo: 1001,
    displayFormat: 'tabular',
    defaultMaxCreditLimit: 50000,
    blockBillingOnCreditExceeded: true,
    paymentDueTerms: 'net15',
    requiredFields: {
      gstinForB2B: true,
      panNumber: false,
      billingAddress: true,
      alternatePhone: false,
    },
    loyaltyAndGreetings: {
      enableLoyaltyPoints: true,
      pointsPerHundred: 1,
      pointValueInRupees: 1.0,
      signupBonusPoints: 100,
      minRedemptionPoints: 100,
      maxRedemptionPercent: 20,
      vipMultiplier: 2.0,
      birthdayBonusPoints: 250,
      anniversaryBonusPoints: 300,
      pointsExpiryDays: 365,
      autoSmsBirthdayGreeting: true,
      autoSmsAnniversaryGreeting: true,
    },
    creditRiskAndLateFees: {
      enableGracePeriod: true,
      gracePeriodDays: 5,
      lateFeePercentPerMonth: 1.5,
      autoCalculateRiskScore: true,
    },
    notifications: {
      autoWhatsappInvoice: true,
      autoWhatsappRepairUpdates: true,
      overdueReminderDaysBefore: 3,
    },
    documentKYC: {
      requireGstCertificateForB2B: false,
      requirePanCopyForCredit: false,
    },
    archivalPolicy: {
      preventHardDeleteWithBalance: true,
    },
    fieldVisibility: {
      name: true,
      companyName: true,
      category: true,
      accountGroup: true,
      mobile: true,
      alternateContact: true,
      email: true,
      website: true,
      dob: true,
      weddingAnniversary: true,
      panNumber: true,
      gstin: true,
      state: true,
      billingAddress: true,
      shippingAddress: true,
      city: true,
      pinCode: true,
      accountStatus: true,
      referredBy: true,
      creditLimit: true,
      outstandingBalance: true,
      internalNotes: true,
      bankDetails: true,
    },
  }),

  // Vendor Rules Default Configuration
  vendorRules: loadFromStorage('accno_erp_vendor_rules', {
    standardPrefix: 'VEN-',
    standardStartWithNo: 1001,
    outsourcePrefix: 'OVE-',
    outsourceStartWithNo: 1001,
    displayFormat: 'tabular',
    defaultMaxCreditLimit: 500000,
    blockPoOnCreditExceeded: true,
    paymentDueTerms: 'net30',
    requireGstin: true,
    requirePan: true,
    fieldVisibility: {
      vendorType: true,
      companyName: true,
      contactPerson: true,
      category: true,
      accountGroup: true,
      designation: true,
      activeStatus: true,
      phone: true,
      alternatePhone: true,
      email: true,
      website: true,
      station: true,
      state: true,
      fullAddress: true,
      gstin: true,
      pan: true,
      openingBalance: true,
      outstandingBalance: true,
      maxCreditLimit: true,
      internalNotes: true,
      bankDetails: true,
    },
  }),

  // Inventory Rules Default Configuration
  inventoryRules: loadFromStorage('accno_erp_inventory_rules', {
    retailPrefix: 'PRT-',
    retailStartWithNo: 1001,
    servicePrefix: 'SRV-',
    serviceStartWithNo: 1001,
    displayFormat: 'tabular',
    defaultLowStockAlert: 3,
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
  }),

  // Customers initial state
  customers: loadFromStorage<CustomerItem[]>('accno_erp_customers', []),
  addCustomer: (custData) =>
    set((state: ErpState) => {
      const nextNum = state.customerRules.startWithNo + state.customers.length;
      const code = `${state.customerRules.autoPrefixPattern}${nextNum}`;
      const signupPoints = state.customerRules.loyaltyAndGreetings.enableLoyaltyPoints
        ? state.customerRules.loyaltyAndGreetings.signupBonusPoints
        : 0;

      const newCust: CustomerItem = {
        ...custData,
        id: `c-${Date.now()}`,
        code,
        loyaltyPoints: signupPoints,
        kycVerified: Boolean(custData.gstin || custData.panNumber),
        tier: custData.creditLimit > 100000 ? 'Platinum VIP' : 'Standard',
        totalRepairs: 0,
      };
      const updated = [newCust, ...state.customers];
      saveToStorage('accno_erp_customers', updated);
      return { customers: updated };
    }),
  updateCustomer: (id: string, custData: Partial<CustomerItem>) =>
    set((state: ErpState) => {
      const updated = state.customers.map((c: CustomerItem) => (c.id === id ? { ...c, ...custData } : c));
      saveToStorage('accno_erp_customers', updated);
      return { customers: updated };
    }),
  deleteCustomer: (id: string) =>
    set((state: ErpState) => {
      const updated = state.customers.filter((c: CustomerItem) => c.id !== id);
      saveToStorage('accno_erp_customers', updated);
      return { customers: updated };
    }),
  updateCustomerRules: (rules: Partial<CustomerRulesConfig>) =>
    set((state: ErpState) => {
      const updated = {
        ...state.customerRules,
        ...rules,
        loyaltyAndGreetings: {
          ...state.customerRules.loyaltyAndGreetings,
          ...(rules.loyaltyAndGreetings || {}),
        },
        creditRiskAndLateFees: {
          ...state.customerRules.creditRiskAndLateFees,
          ...(rules.creditRiskAndLateFees || {}),
        },
        notifications: {
          ...state.customerRules.notifications,
          ...(rules.notifications || {}),
        },
        documentKYC: {
          ...state.customerRules.documentKYC,
          ...(rules.documentKYC || {}),
        },
        archivalPolicy: {
          ...state.customerRules.archivalPolicy,
          ...(rules.archivalPolicy || {}),
        },
        fieldVisibility: {
          ...state.customerRules.fieldVisibility,
          ...(rules.fieldVisibility || {}),
        },
      };
      saveToStorage('accno_erp_customer_rules', updated);
      return { customerRules: updated };
    }),

  // Vendors Initial State & Auto-Numbering Rules (VEN-1001 and OVE-1001)
  vendors: loadFromStorage<VendorItem[]>('accno_erp_vendors', [
    {
      id: 'v-1001',
      vendorType: 'Standard Vendor',
      code: 'VEN-1001',
      companyName: 'Supertron Electronics Pvt Ltd',
      contactPerson: 'Suresh Raina (Regional Lead)',
      category: 'Hardware & Components Supplier',
      accountGroup: 'Sundry Creditor',
      designation: 'Area Sales Manager',
      activeStatus: 'Active',
      phone: '+91 98110-99887',
      alternatePhone: '+91 98110-99888',
      email: 'suresh@supertron.in',
      website: 'www.supertronindia.com',
      station: 'Jammu',
      state: '01 - Jammu & Kashmir',
      fullAddress: 'Warehouse 14, Transport Nagar',
      gstin: '01AAAAA5555B1Z9',
      pan: 'AAAAA5555B',
      openingBalance: 50000,
      outstandingBalance: 124000,
      maxCreditLimit: 500000,
      internalNotes: 'Primary distributor for Asus, Gigabyte, and Samsung components.',

      bankAccountName: 'Supertron Electronics Pvt Ltd',
      bankAccountType: 'Current Account',
      bankAccountNumber: '00120200009876',
      bankIfscCode: 'ICIC0000012',
      bankName: 'ICICI Bank',
      bankBranch: 'Connaught Place, New Delhi',
      upiId: 'supertron@icici',
    },
    {
      id: 'v-1002',
      vendorType: 'Outsource Vendor',
      code: 'OVE-1001',
      companyName: 'Cleanroom Data Recovery Labs',
      contactPerson: 'Pankaj Mahajan (Master Tech)',
      category: 'Outsourced BGA Repair & Data Lab',
      accountGroup: 'Outsource Service Partner',
      designation: 'Technical Director',
      activeStatus: 'Active',
      phone: '+91 94192-33445',
      alternatePhone: '+91 94192-33446',
      email: 'pankaj@cleanroomlabs.com',
      website: 'www.cleanroomlabs.com',
      station: 'Delhi NCR',
      state: '07 - Delhi',
      fullAddress: 'Phase 3, Okhla Industrial Estate',
      gstin: '07BBBBB8888C1Z2',
      pan: 'BBBBB8888C',
      openingBalance: 0,
      outstandingBalance: 32000,
      maxCreditLimit: 150000,
      internalNotes: 'Level 4 Motherboard BGA rework & Hard Drive platter cleanroom recovery partner.',

      bankAccountName: 'Cleanroom Labs Private Limited',
      bankAccountType: 'Current Account',
      bankAccountNumber: '987654321098',
      bankIfscCode: 'HDFC0000999',
      bankName: 'HDFC Bank',
      bankBranch: 'Okhla Phase 3, Delhi',
      upiId: 'cleanroom@hdfcbank',
    },
  ]),

  employeeRules: loadFromStorage<EmployeeRulesConfig>('accno_erp_employee_rules', {
    employeePrefix: 'EMP-',
    employeeStartWithNo: 1001,
    displayFormat: 'tabular',
    departmentOptions: [
      'Technical Lab',
      'Billing & POS',
      'Customer Support',
      'Logistics & Outsource',
      'Management',
      'Accounts & Finance',
      'Inventory & Stock',
    ],
    designationOptions: [
      'Senior Chip-Level Repair Engineer',
      'Hardware Diagnostic Specialist',
      'Store Manager & Billing Lead',
      'Data Recovery Specialist',
      'Logistics & Outsource Executive',
      'Customer Support Executive',
      'Junior Technician',
      'Accountant',
    ],
    govtIdTypeOptions: [
      'Aadhaar Card',
      'PAN Card',
      'Passport',
      'Driving License',
      'Voter ID Card',
    ],
    fieldVisibility: {
      empCode: true,
      name: true,
      phone: true,
      alternatePhone: true,
      email: true,
      address: true,
      department: true,
      designation: true,
      baseSalary: true,
      joiningDate: true,
      emergencyContact: true,
      govtId: true,
      idAttachment: true,
      activeStatus: true,
      bankDetails: true,
    },
  }),

  // Employees State & Actions Implementation (Sensitive passwords & credentials secured in Supabase Cloud)
  employees: loadFromStorage<EmployeeItem[]>('accno_erp_employees', []),
  setEmployees: (employees: EmployeeItem[]) => {
    saveToStorage('accno_erp_employees', employees);
    set({ employees });
  },
  addEmployee: (empData) =>
    set((state: ErpState) => {
      const prefix = state.employeeRules?.employeePrefix || 'EMP-';
      const startNo = state.employeeRules?.employeeStartWithNo || 1001;
      const nextNum = startNo + state.employees.length;
      const empCode = empData.empCode || `${prefix}${nextNum}`;
      const newEmp: EmployeeItem = {
        ...empData,
        id: `emp-${Date.now()}`,
        empCode,
        created_at: new Date().toISOString(),
      };
      const updated = [newEmp, ...state.employees];
      saveToStorage('accno_erp_employees', updated);
      pushEmployeeToSupabase(newEmp).catch(() => {});
      return { employees: updated };
    }),
  updateEmployee: (id: string, empData: Partial<EmployeeItem>) =>
    set((state: ErpState) => {
      let updatedTarget: EmployeeItem | null = null;
      const updated = state.employees.map((e: EmployeeItem) => {
        if (e.id === id || e.empCode === id) {
          const merged = { ...e, ...empData };
          updatedTarget = merged;
          return merged;
        }
        return e;
      });
      saveToStorage('accno_erp_employees', updated);
      if (updatedTarget) {
        pushEmployeeToSupabase(updatedTarget).catch(() => {});
      }
      return { employees: updated };
    }),
  deleteEmployee: (id: string) =>
    set((state: ErpState) => {
      const target = state.employees.find((e: EmployeeItem) => e.id === id || e.empCode === id);
      const updated = state.employees.filter((e: EmployeeItem) => e.id !== id && e.empCode !== id);
      saveToStorage('accno_erp_employees', updated);
      deleteEmployeeFromSupabase(id, target?.empCode).catch(() => {});
      return { employees: updated };
    }),
  updateEmployeeRules: (rules: Partial<EmployeeRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.employeeRules, ...rules };
      saveToStorage('accno_erp_employee_rules', updated);
      return { employeeRules: updated };
    }),
  addDepartmentOption: (dept: string) =>
    set((state: ErpState) => {
      const trimmed = dept.trim();
      if (!trimmed || state.employeeRules.departmentOptions.includes(trimmed)) return state;
      const updatedOptions = [...state.employeeRules.departmentOptions, trimmed];
      const updatedRules = { ...state.employeeRules, departmentOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),
  removeDepartmentOption: (dept: string) =>
    set((state: ErpState) => {
      const updatedOptions = state.employeeRules.departmentOptions.filter((d) => d !== dept);
      const updatedRules = { ...state.employeeRules, departmentOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),
  addDesignationOption: (desig: string) =>
    set((state: ErpState) => {
      const trimmed = desig.trim();
      if (!trimmed || state.employeeRules.designationOptions.includes(trimmed)) return state;
      const updatedOptions = [...state.employeeRules.designationOptions, trimmed];
      const updatedRules = { ...state.employeeRules, designationOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),
  removeDesignationOption: (desig: string) =>
    set((state: ErpState) => {
      const updatedOptions = state.employeeRules.designationOptions.filter((d) => d !== desig);
      const updatedRules = { ...state.employeeRules, designationOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),
  addGovtIdTypeOption: (type: string) =>
    set((state: ErpState) => {
      const trimmed = type.trim();
      if (!trimmed || state.employeeRules.govtIdTypeOptions.includes(trimmed)) return state;
      const updatedOptions = [...state.employeeRules.govtIdTypeOptions, trimmed];
      const updatedRules = { ...state.employeeRules, govtIdTypeOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),
  removeGovtIdTypeOption: (type: string) =>
    set((state: ErpState) => {
      const updatedOptions = state.employeeRules.govtIdTypeOptions.filter((t) => t !== type);
      const updatedRules = { ...state.employeeRules, govtIdTypeOptions: updatedOptions };
      saveToStorage('accno_erp_employee_rules', updatedRules);
      return { employeeRules: updatedRules };
    }),

  addVendor: (vendorData) =>

    set((state: ErpState) => {
      const type = vendorData.vendorType;
      const prefix = type === 'Outsource Vendor'
        ? state.vendorRules.outsourcePrefix
        : state.vendorRules.standardPrefix;
      const startNo = type === 'Outsource Vendor'
        ? state.vendorRules.outsourceStartWithNo
        : state.vendorRules.standardStartWithNo;
      const sameTypeVendors = state.vendors.filter((v: VendorItem) => v.vendorType === type);
      const nextNo = startNo + sameTypeVendors.length;
      const code = `${prefix}${nextNo}`;

      const newVendor: VendorItem = {
        ...vendorData,
        id: `v-${Date.now()}`,
        code,
      };
      const updated = [newVendor, ...state.vendors];
      saveToStorage('accno_erp_vendors', updated);
      return { vendors: updated };
    }),
  updateVendor: (id: string, vendorData: Partial<VendorItem>) =>
    set((state: ErpState) => {
      const updated = state.vendors.map((v: VendorItem) => (v.id === id ? { ...v, ...vendorData } : v));
      saveToStorage('accno_erp_vendors', updated);
      return { vendors: updated };
    }),
  deleteVendor: (id: string) =>
    set((state: ErpState) => {
      const updated = state.vendors.filter((v: VendorItem) => v.id !== id);
      saveToStorage('accno_erp_vendors', updated);
      return { vendors: updated };
    }),
  updateVendorRules: (rules: Partial<VendorRulesConfig>) =>
    set((state: ErpState) => {
      const updated = {
        ...state.vendorRules,
        ...rules,
        fieldVisibility: {
          ...state.vendorRules.fieldVisibility,
          ...(rules.fieldVisibility || {}),
        },
      };
      saveToStorage('accno_erp_vendor_rules', updated);
      return { vendorRules: updated };
    }),

  // HSN Master Settings Initial State
  hsnCodes: loadFromStorage<HsnMasterItem[]>('accno_erp_hsn_codes', [
    { hsnCode: '84713010', gstRate: 18, description: 'Microcomputers / Laptops / Personal Computers' },
    { hsnCode: '84733020', gstRate: 18, description: 'Motherboards & Motherboard Assemblies' },
    { hsnCode: '85044090', gstRate: 18, description: 'SMPS Power Supply & Adaptors' },
    { hsnCode: '85235100', gstRate: 18, description: 'Solid State Drives (SSD) & Flash Memory' },
    { hsnCode: '84717020', gstRate: 18, description: 'Hard Disk Drives (HDD) & Storage Arrays' },
    { hsnCode: '998713', gstRate: 18, description: 'Computer & Peripheral Equipment Repair Services' },
    { hsnCode: '998313', gstRate: 18, description: 'Information Technology Consulting & AMC Services' },
    { hsnCode: '85285200', gstRate: 18, description: 'Computer LED / LCD Monitors & Displays' },
  ]),
  addHsnCode: (hsn: HsnMasterItem) =>
    set((state: ErpState) => {
      if (state.hsnCodes.some((h: HsnMasterItem) => h.hsnCode === hsn.hsnCode)) return state;
      const updated = [hsn, ...state.hsnCodes];
      saveToStorage('accno_erp_hsn_codes', updated);
      return { hsnCodes: updated };
    }),
  updateHsnCode: (hsnCode: string, updated: Partial<HsnMasterItem>) =>
    set((state: ErpState) => {
      const updatedList = state.hsnCodes.map((h: HsnMasterItem) => (h.hsnCode === hsnCode ? { ...h, ...updated } : h));
      saveToStorage('accno_erp_hsn_codes', updatedList);
      return { hsnCodes: updatedList };
    }),
  deleteHsnCode: (hsnCode: string) =>
    set((state: ErpState) => {
      const updated = state.hsnCodes.filter((h: HsnMasterItem) => h.hsnCode !== hsnCode);
      saveToStorage('accno_erp_hsn_codes', updated);
      return { hsnCodes: updated };
    }),

  // Inventory Initial State (Retail Parts: PRT-1001, Service Parts: SRV-1001)
  inventory: loadFromStorage<InventoryItem[]>('accno_erp_inventory', []),
  addInventoryItem: (itemData: Omit<InventoryItem, 'id' | 'code'>) =>
    set((state: ErpState) => {
      const type = itemData.itemType;
      const prefix = type === 'Retail Part'
        ? state.inventoryRules.retailPrefix
        : state.inventoryRules.servicePrefix;
      const startNo = type === 'Retail Part'
        ? state.inventoryRules.retailStartWithNo
        : state.inventoryRules.serviceStartWithNo;
      const sameTypeItems = state.inventory.filter((i: InventoryItem) => i.itemType === type);
      const nextNo = startNo + sameTypeItems.length;
      const code = (itemData as any).code || `${prefix}${nextNo}`;

      const newItem: InventoryItem = {
        ...itemData,
        id: (itemData as any).id || `i-${Date.now()}`,
        code,
      };
      const updated = [newItem, ...state.inventory];
      saveToStorage('accno_erp_inventory', updated);
      return { inventory: updated };
    }),
  updateInventoryItem: (id: string, itemData: Partial<InventoryItem>) =>
    set((state: ErpState) => {
      const updated = state.inventory.map((i: InventoryItem) => (i.id === id ? { ...i, ...itemData } : i));
      saveToStorage('accno_erp_inventory', updated);
      return { inventory: updated };
    }),
  deleteInventoryItem: (id: string) =>
    set((state: ErpState) => {
      const updated = state.inventory.filter((i: InventoryItem) => i.id !== id);
      saveToStorage('accno_erp_inventory', updated);
      return { inventory: updated };
    }),
  updateInventoryRules: (rules: Partial<InventoryRulesConfig>) =>
    set((state: ErpState) => ({
      inventoryRules: {
        ...state.inventoryRules,
        ...rules,
        fieldVisibility: {
          ...state.inventoryRules.fieldVisibility,
          ...(rules.fieldVisibility || {}),
        },
      },
    })),

  // POS
  cart: [],
  selectedCustomer: { id: 'c-1', name: 'Walk-in Retail Customer', phone: '+919906000000' },
  addToCart: (item: PosCartItem) =>
    set((state: ErpState) => {
      const existing = state.cart.find((c: PosCartItem) => c.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((c: PosCartItem) =>
            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id: string) =>
    set((state: ErpState) => ({ cart: state.cart.filter((c: PosCartItem) => c.id !== id) })),
  updateQuantity: (id: string, delta: number) =>
    set((state: ErpState) => ({
      cart: state.cart
        .map((c: PosCartItem) => (c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))
        .filter((c: PosCartItem) => c.quantity > 0),
    })),
  updateUnitPrice: (id: string, newPrice: number) =>
    set((state: ErpState) => ({
      cart: state.cart.map((c: PosCartItem) => (c.id === id ? { ...c, unit_price: Math.max(0, newPrice) } : c)),
    })),
  clearCart: () => set({ cart: [] }),
  setSelectedCustomer: (selectedCustomer: { id: string; name: string; phone: string; gst?: string } | null) => set({ selectedCustomer }),

  // Company Details Configuration State
  companyDetails: loadFromStorage('accno_erp_company_details', {
    companyLegalName: 'ACCNO SOLUTION SYSTEMS PVT LTD',
    companyTagLine: 'COMPUTER REPAIR & MOBILE SOLUTION HUB',
    companyLogo: '/logo.png',
    merchantUpiId: 'support.time24x7-3@okhdfcbank',
    addressLine1: '#80, Above Vijay Laxmi Medical Agency',
    addressLine2: 'Choudhary Dharmshala, Indira Chowk',
    addressLine3: 'Industrial Main Road',
    city: 'SANCHORE',
    state: 'Rajasthan',
    stateCode: '08',
    website: 'www.accnosolution.com',
    email: 'support@accnosolution.com',
    gstin: '08CAUPK8462J2ZT',
    contactPerson: 'Bhavesh Patel',
    designation: 'Managing Director',
    designationOptions: [
      'Managing Director',
      'Proprietor',
      'General Manager',
      'Service Center Head',
      'Senior Hardware Engineer',
      'Accounts Head',
      'Technical Lead',
    ],
    phoneNumber: '+91 80900 20060',
    alternateNumber: '+91 2979 357020',
    panNumber: 'CAUPK8462J',
    bankDetails: {
      accountHolderName: 'ACCNO SOLUTION SYSTEMS',
      accountNumber: '50200012345678',
      bankName: 'HDFC Bank',
      branchName: 'Sanchore Main Branch',
      branchCode: '003430',
      ifscCode: 'HDFC0003430',
    },
    notes: 'Statutory Registered Repair Center & Enterprise IT Solutions Provider. Tax invoice subject to Sanchore jurisdiction.',
  }),
  updateCompanyDetails: (details: Partial<CompanyDetailsConfig>) =>
    set((state: ErpState) => {
      const updated = {
        ...state.companyDetails,
        ...details,
        bankDetails: {
          ...state.companyDetails.bankDetails,
          ...(details?.bankDetails || {}),
        },
      };
      saveToStorage('accno_erp_company_details', updated);
      return { companyDetails: updated };
    }),

  // Sales Invoices State
  salesInvoices: loadFromStorage<SalesInvoiceItem[]>('accno_erp_sales_invoices', []),

  addSalesInvoice: (invoice: Omit<SalesInvoiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) =>
    set((state: ErpState) => {
      const newInv: SalesInvoiceItem = {
        ...invoice,
        id: invoice.id || `sal-${Date.now()}`,
        created_at: invoice.created_at || new Date().toISOString(),
      };
      const updated = [newInv, ...state.salesInvoices];
      saveToStorage('accno_erp_sales_invoices', updated);
      return { salesInvoices: updated };
    }),

  updateSalesInvoice: (id: string, updatedData: Partial<SalesInvoiceItem>) =>
    set((state: ErpState) => {
      const updated = state.salesInvoices.map((inv: SalesInvoiceItem) => (inv.id === id ? { ...inv, ...updatedData } : inv));
      saveToStorage('accno_erp_sales_invoices', updated);
      return { salesInvoices: updated };
    }),

  deleteSalesInvoice: (id: string) =>
    set((state: ErpState) => {
      const updated = state.salesInvoices.filter((inv: SalesInvoiceItem) => inv.id !== id);
      saveToStorage('accno_erp_sales_invoices', updated);
      return { salesInvoices: updated };
    }),

  // Purchase Invoices State
  purchaseInvoices: loadFromStorage<PurchaseInvoiceItem[]>('accno_erp_purchase_invoices', []),

  addPurchaseInvoice: (bill: Omit<PurchaseInvoiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) =>
    set((state: ErpState) => {
      const newBill: PurchaseInvoiceItem = {
        ...bill,
        id: bill.id || `pur-${Date.now()}`,
        created_at: bill.created_at || new Date().toISOString(),
      };
      const updated = [newBill, ...state.purchaseInvoices];
      saveToStorage('accno_erp_purchase_invoices', updated);

      // Auto increase inventory stock for purchased items
      const updatedInventory = [...state.inventory];
      bill.items.forEach((line: TransactionItemLine) => {
        if (line.itemId) {
          const itemIdx = updatedInventory.findIndex((i: InventoryItem) => i.id === line.itemId);
          if (itemIdx >= 0) {
            updatedInventory[itemIdx] = {
              ...updatedInventory[itemIdx],
              currentStock: (updatedInventory[itemIdx].currentStock || 0) + line.quantity,
              costPrice: line.unitPrice || updatedInventory[itemIdx].costPrice,
            };
          }
        }
      });
      saveToStorage('accno_erp_inventory', updatedInventory);

      return { purchaseInvoices: updated, inventory: updatedInventory };
    }),

  updatePurchaseInvoice: (id: string, updatedData: Partial<PurchaseInvoiceItem>) =>
    set((state: ErpState) => {
      const updated = state.purchaseInvoices.map((b: PurchaseInvoiceItem) => (b.id === id ? { ...b, ...updatedData } : b));
      saveToStorage('accno_erp_purchase_invoices', updated);
      return { purchaseInvoices: updated };
    }),

  deletePurchaseInvoice: (id: string) =>
    set((state: ErpState) => {
      const updated = state.purchaseInvoices.filter((b: PurchaseInvoiceItem) => b.id !== id);
      saveToStorage('accno_erp_purchase_invoices', updated);
      return { purchaseInvoices: updated };
    }),

  // Sales Returns State
  salesReturns: loadFromStorage<SalesReturnItem[]>('accno_erp_sales_returns', []),

  addSalesReturn: (ret: Omit<SalesReturnItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) =>
    set((state: ErpState) => {
      const newRet: SalesReturnItem = {
        ...ret,
        id: ret.id || `slr-${Date.now()}`,
        created_at: ret.created_at || new Date().toISOString(),
      };
      const updated = [newRet, ...state.salesReturns];
      saveToStorage('accno_erp_sales_returns', updated);

      // If restock to active stock is checked, increment inventory stock
      let updatedInventory = state.inventory;
      if (ret.restockToStock) {
        updatedInventory = [...state.inventory];
        ret.items.forEach((line: TransactionItemLine) => {
          if (line.itemId) {
            const idx = updatedInventory.findIndex((i: InventoryItem) => i.id === line.itemId);
            if (idx >= 0) {
              updatedInventory[idx] = {
                ...updatedInventory[idx],
                currentStock: (updatedInventory[idx].currentStock || 0) + line.quantity,
              };
            }
          }
        });
        saveToStorage('accno_erp_inventory', updatedInventory);
      }

      return { salesReturns: updated, inventory: updatedInventory };
    }),

  updateSalesReturn: (id: string, updatedData: Partial<SalesReturnItem>) =>
    set((state: ErpState) => {
      const updated = state.salesReturns.map((r: SalesReturnItem) => (r.id === id ? { ...r, ...updatedData } : r));
      saveToStorage('accno_erp_sales_returns', updated);
      return { salesReturns: updated };
    }),

  deleteSalesReturn: (id: string) =>
    set((state: ErpState) => {
      const updated = state.salesReturns.filter((r: SalesReturnItem) => r.id !== id);
      saveToStorage('accno_erp_sales_returns', updated);
      return { salesReturns: updated };
    }),

  // Purchase Returns State
  purchaseReturns: loadFromStorage<PurchaseReturnItem[]>('accno_erp_purchase_returns', []),

  addPurchaseReturn: (ret: Omit<PurchaseReturnItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) =>
    set((state: ErpState) => {
      const newRet: PurchaseReturnItem = {
        ...ret,
        id: ret.id || `pcr-${Date.now()}`,
        created_at: ret.created_at || new Date().toISOString(),
      };
      const updated = [newRet, ...state.purchaseReturns];
      saveToStorage('accno_erp_purchase_returns', updated);

      // Auto deduct inventory stock for returned goods
      const updatedInventory = [...state.inventory];
      ret.items.forEach((line: TransactionItemLine) => {
        if (line.itemId) {
          const idx = updatedInventory.findIndex((i: InventoryItem) => i.id === line.itemId);
          if (idx >= 0) {
            updatedInventory[idx] = {
              ...updatedInventory[idx],
              currentStock: Math.max(0, (updatedInventory[idx].currentStock || 0) - line.quantity),
            };
          }
        }
      });
      saveToStorage('accno_erp_inventory', updatedInventory);

      return { purchaseReturns: updated, inventory: updatedInventory };
    }),

  updatePurchaseReturn: (id: string, updatedData: Partial<PurchaseReturnItem>) =>
    set((state: ErpState) => {
      const updated = state.purchaseReturns.map((r: PurchaseReturnItem) => (r.id === id ? { ...r, ...updatedData } : r));
      saveToStorage('accno_erp_purchase_returns', updated);
      return { purchaseReturns: updated };
    }),

  deletePurchaseReturn: (id: string) =>
    set((state: ErpState) => {
      const updated = state.purchaseReturns.filter((r: PurchaseReturnItem) => r.id !== id);
      saveToStorage('accno_erp_purchase_returns', updated);
      return { purchaseReturns: updated };
    }),

  // Quotations State
  quotations: loadFromStorage<QuotationItem[]>('accno_erp_quotations', []),

  addQuotation: (q: Omit<QuotationItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) =>
    set((state: ErpState) => {
      const newQtn: QuotationItem = {
        ...q,
        id: q.id || `qtn-${Date.now()}`,
        created_at: q.created_at || new Date().toISOString(),
      };
      const updated = [newQtn, ...state.quotations];
      saveToStorage('accno_erp_quotations', updated);
      return { quotations: updated };
    }),

  updateQuotation: (id: string, updatedData: Partial<QuotationItem>) =>
    set((state: ErpState) => {
      const updated = state.quotations.map((q: QuotationItem) => (q.id === id ? { ...q, ...updatedData } : q));
      saveToStorage('accno_erp_quotations', updated);
      return { quotations: updated };
    }),

  deleteQuotation: (id: string) =>
    set((state: ErpState) => {
      const updated = state.quotations.filter((q: QuotationItem) => q.id !== id);
      saveToStorage('accno_erp_quotations', updated);
      return { quotations: updated };
    }),

  convertQuotationToSalesInvoice: (quotationId: string): string | undefined => {
    const state = get();
    const qtn = state.quotations.find((q: QuotationItem) => q.id === quotationId);
    if (!qtn) return undefined;

    const prefix = state.saleRules?.salesInvoicePrefix || 'SAL-';
    const startNo = state.saleRules?.salesInvoiceStartNo || 1001;
    const nextSalesNo = `${prefix}${startNo + state.salesInvoices.length}`;
    const newSalesInvoice: SalesInvoiceItem = {
      id: `sal-${Date.now()}`,
      invoiceNo: nextSalesNo,
      invoiceDate: new Date().toISOString(),
      customerId: qtn.customerId,
      customerName: qtn.customerName,
      customerPhone: qtn.customerPhone,
      customerGst: qtn.customerGst,
      customerAddress: qtn.customerAddress,
      paymentTerms: state.saleRules?.defaultPaymentTerms || 'Credit 15 Days',
      paymentMethod: 'Bank Transfer',
      items: qtn.items,
      subtotal: qtn.subtotal,
      discount: qtn.discount,
      discountType: 'fixed',
      taxAmount: qtn.taxAmount,
      shippingCharges: 0,
      grandTotal: qtn.grandTotal,
      paidAmount: 0,
      balanceDue: qtn.grandTotal,
      paymentStatus: 'Unpaid',
      remarks: `Converted from Quotation Estimate ${qtn.quotationNo}`,
      created_at: new Date().toISOString(),
    };

    const updatedQuotations = state.quotations.map((q: QuotationItem) =>
      q.id === quotationId ? { ...q, status: 'Converted' as const, convertedInvoiceNo: nextSalesNo } : q
    );
    const updatedSalesInvoices = [newSalesInvoice, ...state.salesInvoices];

    saveToStorage('accno_erp_quotations', updatedQuotations);
    saveToStorage('accno_erp_sales_invoices', updatedSalesInvoices);

    set({ quotations: updatedQuotations, salesInvoices: updatedSalesInvoices });
    return nextSalesNo;
  },

  currentUser: loadFromStorage('accno_erp_current_user', null),
  setCurrentUser: (currentUser) => {
    saveToStorage('accno_erp_current_user', currentUser);
    set({ currentUser });
  },

  // POS Rules State & Update Action
  posRules: loadFromStorage<PosRulesConfig>('accno_erp_pos_rules', {
    posPrefix: 'POS-',
    posStartWithNo: 1001,
    defaultPrintMode: 'a4',
    autoPrintInvoiceOnPayment: true,
    showMerchantQr: true,
    enableDiscountControl: true,
    maxDiscountPercent: 20,
    enableLoyaltyRedemption: true,
    terminalId: 'TERMINAL #01 (ACTIVE)',
    defaultPaymentMethod: 'upi',
    enableHoldParkBills: true,
    autoDeductInventory: true,
    allowNegativeStock: false,
    defaultCustomerName: 'Walk-in Retail Customer',
    showTermsOnPosReceipt: true,
    posTermsAndConditions: [
      'Goods once sold will not be accepted back or exchanged without a valid GST tax invoice.',
      'Hardware items carry manufacturer warranty. Physical, burnt, or liquid damage voids warranty.',
      'Customers are advised to inspect products and verify serial numbers at the time of delivery.',
      'Full payment is due upon counter delivery. Subject to Sanchore jurisdiction.',
    ],
  }),

  updatePosRules: (rules: Partial<PosRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.posRules, ...rules };
      saveToStorage('accno_erp_pos_rules', updated);
      return { posRules: updated };
    }),

  // Commercial Sale Rules State & Update Action
  saleRules: loadFromStorage<SaleRulesConfig>('accno_erp_sale_rules', {
    salesInvoicePrefix: 'SAL-',
    salesInvoiceStartNo: 1001,
    defaultPaymentTerms: 'Credit 15 Days',
    defaultGstSupplyType: 'Intra-State (CGST + SGST)',
    defaultTaxRate: 18,
    autoRoundOffGrandTotal: true,
    enableDiscountLimits: true,
    maxDiscountPercent: 20,
    autoBarcodeScanAddItem: true,
    requireCustomerPhone: true,
    requireCustomerGstForB2B: true,
    defaultPrintPaperFormat: 'A4',
    defaultPrintCopyMode: 'customer',
    showTermsBoxOnInvoice: true,
    showProductRemarksOnPrint: true,
    showRefurbishedBadgeOnPrint: true,
    showBankQrOnInvoice: true,
    termsAndConditions: [
      '1. Goods once sold will not be taken back without original tax invoice.',
      '2. Hardware items carry manufacturer warranty as per OEM policies.',
      '3. Physical, liquid, or burnt damage strictly voids warranty.',
      '4. Customers are requested to verify items & serial numbers upon receipt.',
      '5. Subject to Sanchore Jurisdiction only.',
      '6. Payment due as per agreed billing credit terms.',
    ],
  }),

  updateSaleRules: (rules: Partial<SaleRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.saleRules, ...rules };
      saveToStorage('accno_erp_sale_rules', updated);
      return { saleRules: updated };
    }),

  // Vendor Purchase Rules State & Update Action
  purchaseRules: loadFromStorage<PurchaseRulesConfig>('accno_erp_purchase_rules', {
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
    termsAndConditions: [
      '1. Inward inventory stock verified & added into system inventory store.',
      '2. Goods received in good physical condition with OEM serial numbers.',
      '3. Input Tax Credit (ITC) claimed as per GST Act Section 16 provisions.',
      '4. Payment due as per agreed vendor credit terms.',
      '5. Subject to Sanchore Jurisdiction only.',
    ],
  }),

  updatePurchaseRules: (rules: Partial<PurchaseRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.purchaseRules, ...rules };
      saveToStorage('accno_erp_purchase_rules', updated);
      return { purchaseRules: updated };
    }),

  // Sales Return Rules State & Update Action
  salesReturnRules: loadFromStorage<SalesReturnRulesConfig>('accno_erp_sales_return_rules', {
    salesReturnPrefix: 'SLR-',
    salesReturnStartNo: 1001,
    autoRestockInventory: true,
    defaultRefundStatus: 'Cleared',
    defaultPrintPaperFormat: 'A4',
    showBankDetailsOnVoucher: true,
    termsAndConditions: [
      '1. Sales Return / Credit Note issued subject to verification of original invoice & serial numbers.',
      '2. Physical, burnt, or liquid damaged components are strictly non-returnable.',
      '3. Restocked items are returned to active inventory store.',
      '4. Subject to Sanchore Jurisdiction only.',
    ],
  }),

  updateSalesReturnRules: (rules: Partial<SalesReturnRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.salesReturnRules, ...rules };
      saveToStorage('accno_erp_sales_return_rules', updated);
      return { salesReturnRules: updated };
    }),

  // Purchase Return Rules State & Update Action
  purchaseReturnRules: loadFromStorage<PurchaseReturnRulesConfig>('accno_erp_purchase_return_rules', {
    purchaseReturnPrefix: 'PCR-',
    purchaseReturnStartNo: 1001,
    autoDeductInventory: true,
    defaultRmaStatus: 'Completed',
    defaultPrintPaperFormat: 'A4',
    showBankDetailsOnVoucher: true,
    termsAndConditions: [
      '1. Debit Note issued to vendor for defective component return / RMA claim.',
      '2. Inward stock quantity automatically reversed from active store inventory.',
      '3. Credit reversal adjusted against Vendor Accounts Payable ledger.',
      '4. Subject to Sanchore Jurisdiction only.',
    ],
  }),

  updatePurchaseReturnRules: (rules: Partial<PurchaseReturnRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.purchaseReturnRules, ...rules };
      saveToStorage('accno_erp_purchase_return_rules', updated);
      return { purchaseReturnRules: updated };
    }),

  // Quotation Rules State & Update Action
  quotationRules: loadFromStorage<QuotationRulesConfig>('accno_erp_quotation_rules', {
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
    requireCustomerGstForB2B: false,
    defaultPrintPaperFormat: 'A4',
    defaultPrintCopyMode: 'both',
    showTermsBoxOnQuotation: true,
    showProductRemarksOnPrint: true,
    showRefurbishedBadgeOnPrint: true,
    showBankQrOnQuotation: true,
    termsAndConditions: [
      '1. Quotation estimate valid for 15 days from the date of issue.',
      '2. Prices subject to OEM market availability and component price revisions.',
      '3. 50% advance payment required upon purchase order confirmation.',
      '4. Warranty claims backed by official OEM manufacturer warranty terms.',
      '5. Subject to Sanchore Jurisdiction only.',
    ],
  }),

  updateQuotationRules: (rules: Partial<QuotationRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.quotationRules, ...rules };
      saveToStorage('accno_erp_quotation_rules', updated);
      return { quotationRules: updated };
    }),

  // All Vouchers Rules State & Update Action
  voucherRules: loadFromStorage<VoucherRulesConfig>('accno_erp_voucher_rules', {
    receiptPrefix: 'RCT-',
    receiptStartNo: 1001,
    paymentPrefix: 'PAY-',
    paymentStartNo: 1001,
    debitNotePrefix: 'DBN-',
    debitNoteStartNo: 1001,
    creditNotePrefix: 'CRN-',
    creditNoteStartNo: 1001,
    contraPrefix: 'CNT-',
    contraStartNo: 1001,
    journalPrefix: 'JRN-',
    journalStartNo: 1001,
    defaultPrintPaperFormat: 'A4',
    defaultPrintCopyMode: 'both',
    requirePartySelection: true,
    requireNarrationExplanation: true,
    autoStrictDoubleEntryCheck: true,
    showBankDetailsOnPrint: true,
    showSignatureBlockOnPrint: true,
    enableLiveLedgerSearch: true,
    termsAndConditions: [
      '1. All accounting voucher entries are subject to strict double-entry ledger posting rules (Debit = Credit).',
      '2. Receipts and Payment vouchers update customer/vendor outstanding balances and bank/cash account registers in real time.',
      '3. Debit Notes and Credit Notes reflect adjustments, purchase returns, and customer sales return rebates.',
      '4. Internal Contra transfers must occur between verified Bank Accounts, Cash-in-Hand, or Petty Cash accounts.',
      '5. Subject to Sanchore Jurisdiction only.',
    ],
  }),

  updateVoucherRules: (rules: Partial<VoucherRulesConfig>) =>
    set((state: ErpState) => {
      const updated = { ...state.voucherRules, ...rules };
      saveToStorage('accno_erp_voucher_rules', updated);
      return { voucherRules: updated };
    }),

  // Custom Account Ledgers Implementation
  customLedgers: loadFromStorage<AccountLedgerItem[]>('accno_erp_custom_ledgers', [
    { id: 'ldg-101', accountName: 'HDFC Bank A/c 9812', groupType: 'Bank', openingBalance: 250000, balanceType: 'Dr', bankName: 'HDFC Bank', accountNumber: '50200012345678', ifscCode: 'HDFC0003430', branchName: 'Okhla Phase 3, Delhi', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-102', accountName: 'ICICI Bank Current A/c 4410', groupType: 'Bank', openingBalance: 120000, balanceType: 'Dr', bankName: 'ICICI Bank', accountNumber: '000405012988', ifscCode: 'ICIC0000004', branchName: 'Connaught Place, Delhi', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-103', accountName: 'Cash-in-Hand', groupType: 'Cash', openingBalance: 45000, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-104', accountName: 'Petty Cash Float', groupType: 'Cash', openingBalance: 10000, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-105', accountName: 'Accounts Receivable (Debtors)', groupType: 'Credit / Party', openingBalance: 85000, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-106', accountName: 'Accounts Payable (Creditors)', groupType: 'Credit / Party', openingBalance: 62000, balanceType: 'Cr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-107', accountName: 'Outsource Repair Expense Account', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-108', accountName: 'Depreciation Expense', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-109', accountName: 'Sales Return / Customer Rebate Account', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-110', accountName: 'Purchase Return / Defective Claims Account', groupType: 'Income', openingBalance: 0, balanceType: 'Cr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-111', accountName: 'Store Electricity & Utilities', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-112', accountName: 'Office Rent Expense', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-113', accountName: 'Salary & Technician Commission', groupType: 'Expense', openingBalance: 0, balanceType: 'Dr', activeStatus: 'Active', created_at: '2026-01-01' },
    { id: 'ldg-114', accountName: 'Capital Account', groupType: 'Capital', openingBalance: 500000, balanceType: 'Cr', activeStatus: 'Active', created_at: '2026-01-01' }
  ]),

  addAccountLedger: (ledgerData) =>
    set((state: ErpState) => {
      const newLedger: AccountLedgerItem = {
        ...ledgerData,
        id: ledgerData.id || `ldg-${Date.now()}`,
        created_at: ledgerData.created_at || new Date().toISOString().split('T')[0],
      };
      const updated = [newLedger, ...state.customLedgers];
      saveToStorage('accno_erp_custom_ledgers', updated);
      return { customLedgers: updated };
    }),

  updateAccountLedger: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.customLedgers.map((l) => (l.id === id ? { ...l, ...updated } : l));
      saveToStorage('accno_erp_custom_ledgers', updatedList);
      return { customLedgers: updatedList };
    }),

  deleteAccountLedger: (id) =>
    set((state: ErpState) => {
      const updatedList = state.customLedgers.filter((l) => l.id !== id);
      saveToStorage('accno_erp_custom_ledgers', updatedList);
      return { customLedgers: updatedList };
    }),

  // Support Leads Implementation
  supportLeads: loadFromStorage<SupportLeadItem[]>('accno_erp_support_leads', []),

  addSupportLead: (lead) =>
    set((state: ErpState) => {
      const newLead: SupportLeadItem = {
        ...lead,
        id: lead.id || `lead-${Date.now()}`,
        created_at: lead.created_at || new Date().toISOString(),
      };
      const updated = [newLead, ...state.supportLeads];
      saveToStorage('accno_erp_support_leads', updated);
      try {
        pushSupportLeadToSupabase(newLead).catch((err) => console.warn('Supabase pushSupportLead error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
      return { supportLeads: updated };
    }),

  updateSupportLead: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.supportLeads.map((l) => (l.id === id ? { ...l, ...updated } : l));
      saveToStorage('accno_erp_support_leads', updatedList);
      return { supportLeads: updatedList };
    }),

  deleteSupportLead: (id) =>
    set((state: ErpState) => {
      const updatedList = state.supportLeads.filter((l) => l.id !== id);
      saveToStorage('accno_erp_support_leads', updatedList);
      return { supportLeads: updatedList };
    }),

  // Book Repair Online Leads Implementation
  bookRepairLeads: loadFromStorage<BookRepairLeadItem[]>('accno_erp_book_repair_leads', []),

  addBookRepairLead: (lead) =>
    set((state: ErpState) => {
      const newLead: BookRepairLeadItem = {
        ...lead,
        id: lead.id || `br-${Date.now()}`,
        created_at: lead.created_at || new Date().toISOString(),
      };
      const updated = [newLead, ...state.bookRepairLeads];
      saveToStorage('accno_erp_book_repair_leads', updated);
      try {
        pushBookRepairLeadToSupabase(newLead).catch((err) => console.warn('Supabase pushBookRepairLead error:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
      return { bookRepairLeads: updated };
    }),

  updateBookRepairLead: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.bookRepairLeads.map((l) => (l.id === id ? { ...l, ...updated } : l));
      saveToStorage('accno_erp_book_repair_leads', updatedList);
      return { bookRepairLeads: updatedList };
    }),

  deleteBookRepairLead: (id) =>
    set((state: ErpState) => {
      const updatedList = state.bookRepairLeads.filter((l) => l.id !== id);
      saveToStorage('accno_erp_book_repair_leads', updatedList);
      return { bookRepairLeads: updatedList };
    }),

  // Blog Management Implementation
  blogPosts: loadFromStorage<BlogPostItem[]>('accno_erp_blog_posts', []),

  addBlogPost: (post) =>
    set((state: ErpState) => {
      const newPost: BlogPostItem = {
        ...post,
        id: post.id || `blog-${Date.now()}`,
        views: post.views || 0,
        created_at: post.created_at || new Date().toISOString(),
      };
      const updated = [newPost, ...state.blogPosts];
      saveToStorage('accno_erp_blog_posts', updated);
      return { blogPosts: updated };
    }),

  updateBlogPost: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.blogPosts.map((p) => (p.id === id ? { ...p, ...updated } : p));
      saveToStorage('accno_erp_blog_posts', updatedList);
      return { blogPosts: updatedList };
    }),

  deleteBlogPost: (id) =>
    set((state: ErpState) => {
      const updatedList = state.blogPosts.filter((p) => p.id !== id);
      saveToStorage('accno_erp_blog_posts', updatedList);
      return { blogPosts: updatedList };
    }),

  // Company Milestones Implementation
  milestones: loadFromStorage<MilestoneItem[]>('accno_erp_milestones', []),

  addMilestone: (milestone) =>
    set((state: ErpState) => {
      const newMilestone: MilestoneItem = {
        ...milestone,
        id: milestone.id || `m-${Date.now()}`,
        created_at: milestone.created_at || new Date().toISOString(),
      };
      const updated = [...state.milestones, newMilestone].sort((a, b) => a.year.localeCompare(b.year));
      saveToStorage('accno_erp_milestones', updated);
      return { milestones: updated };
    }),

  updateMilestone: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.milestones
        .map((m) => (m.id === id ? { ...m, ...updated } : m))
        .sort((a, b) => a.year.localeCompare(b.year));
      saveToStorage('accno_erp_milestones', updatedList);
      return { milestones: updatedList };
    }),

  deleteMilestone: (id) =>
    set((state: ErpState) => {
      const updatedList = state.milestones.filter((m) => m.id !== id);
      saveToStorage('accno_erp_milestones', updatedList);
      return { milestones: updatedList };
    }),

  // Key Achievement Counter Metrics Implementation
  achievementStats: loadFromStorage<AchievementStatItem[]>('accno_erp_achievement_stats', [
    {
      id: 'stat-1',
      label: 'Repairs Completed',
      value: '45,000+',
      description: 'Laptops, MacBooks, desktops, printers, & servers successfully restored.',
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-2',
      label: 'Data Recovery Success',
      value: '98.6%',
      description: 'ISO Class-100 cleanroom head swap & NAND flash data extraction rate.',
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-3',
      label: 'Corporate AMC Clients',
      value: '180+',
      description: 'Annual Maintenance Contracts for corporate networks, schools & hospitals.',
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-4',
      label: 'Certified Engineers',
      value: '15+',
      description: 'Apple ACMT, Cisco CCNA, and MCSE certified hardware specialists.',
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addAchievementStat: (stat) =>
    set((state: ErpState) => {
      const newStat: AchievementStatItem = {
        ...stat,
        id: stat.id || `stat-${Date.now()}`,
        created_at: stat.created_at || new Date().toISOString(),
      };
      const updated = [...state.achievementStats, newStat];
      saveToStorage('accno_erp_achievement_stats', updated);
      return { achievementStats: updated };
    }),

  updateAchievementStat: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.achievementStats.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_achievement_stats', updatedList);
      return { achievementStats: updatedList };
    }),

  deleteAchievementStat: (id) =>
    set((state: ErpState) => {
      const updatedList = state.achievementStats.filter((s) => s.id !== id);
      saveToStorage('accno_erp_achievement_stats', updatedList);
      return { achievementStats: updatedList };
    }),

  // Leadership Team Implementation
  leadershipMembers: loadFromStorage<LeadershipTeamMember[]>('accno_erp_leadership_members', [
    {
      id: 'lead-1',
      name: 'Alex Devid',
      role: 'FOUNDER & CEO',
      experienceBio: '12+ years of enterprise IT repair operations management experience.',
      initials: 'AD',
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'lead-2',
      name: 'Siddharth Mehta',
      role: 'LEAD MICRO-SOLDERING ENGINEER',
      experienceBio: 'Specializes in Apple logic boards, complex IC replacements, and board trace repairs.',
      initials: 'SM',
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'lead-3',
      name: 'Rohan Alva',
      role: 'HEAD OF DATA RECOVERY',
      experienceBio: 'Certified HDD/SSD forensic recovery technician with a 94% recovery success rate.',
      initials: 'RA',
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addLeadershipMember: (member) =>
    set((state: ErpState) => {
      const newMember: LeadershipTeamMember = {
        ...member,
        id: member.id || `lead-${Date.now()}`,
        created_at: member.created_at || new Date().toISOString(),
      };
      const updated = [...state.leadershipMembers, newMember];
      saveToStorage('accno_erp_leadership_members', updated);
      return { leadershipMembers: updated };
    }),

  updateLeadershipMember: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.leadershipMembers.map((m) => (m.id === id ? { ...m, ...updated } : m));
      saveToStorage('accno_erp_leadership_members', updatedList);
      return { leadershipMembers: updatedList };
    }),

  deleteLeadershipMember: (id) =>
    set((state: ErpState) => {
      const updatedList = state.leadershipMembers.filter((m) => m.id !== id);
      saveToStorage('accno_erp_leadership_members', updatedList);
      return { leadershipMembers: updatedList };
    }),

  // Hardware Repair Catalog Implementation
  hardwareRepairCatalog: loadFromStorage<HardwareRepairCatalogItem[]>('accno_erp_hardware_repair_catalog', [
    {
      id: 'rep-1',
      category: 'desktop',
      title: 'Desktop & Gaming PC Circuit Repair',
      estPrice: '₹800 - ₹2,500',
      desc: 'Motherboard recapping, SMPS power supply fix, GPU reballing, BIOS chip flashing.',
      warrantyDays: 90,
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rep-2',
      category: 'laptop',
      title: 'Laptop Screen & Keyboard Overhaul',
      estPrice: '₹1,200 - ₹4,800',
      desc: 'FHD/4K display panel replacement, keyboard key fixing, battery swap, thermal repasting.',
      warrantyDays: 90,
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rep-3',
      category: 'mac',
      title: 'Apple Mac Logic Board Micro-Soldering',
      estPrice: '₹2,500 - ₹9,500',
      desc: 'M1/M2/M3 chip repair, liquid spill short-circuit restoration, SMC/T2 power rail diagnostics.',
      warrantyDays: 90,
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rep-4',
      category: 'phone',
      title: 'Smartphone Glass & Charging Port Fix',
      estPrice: '₹600 - ₹3,500',
      desc: 'OLED screen glass replacement, battery swap, charging port soldering for iPhone & Android.',
      warrantyDays: 90,
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rep-5',
      category: 'printer',
      title: 'Epson & Canon Head Cleaning & Roller Fix',
      estPrice: '₹500 - ₹1,800',
      desc: 'Continuous ink head unclogging, paper feed roller replacement, power card fix.',
      warrantyDays: 90,
      order: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rep-6',
      category: 'datarecovery',
      title: 'Cleanroom Forensic Data Extraction',
      estPrice: '₹3,500 - ₹14,000',
      desc: 'Class-100 cleanroom head swap for clicking HDDs, dead NVMe SSDs, corrupted RAID arrays.',
      warrantyDays: 90,
      order: 6,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addHardwareRepairCatalogItem: (item) =>
    set((state: ErpState) => {
      const newItem: HardwareRepairCatalogItem = {
        ...item,
        id: item.id || `rep-${Date.now()}`,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.hardwareRepairCatalog, newItem];
      saveToStorage('accno_erp_hardware_repair_catalog', updated);
      return { hardwareRepairCatalog: updated };
    }),

  updateHardwareRepairCatalogItem: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.hardwareRepairCatalog.map((i) => (i.id === id ? { ...i, ...updated } : i));
      saveToStorage('accno_erp_hardware_repair_catalog', updatedList);
      return { hardwareRepairCatalog: updatedList };
    }),

  deleteHardwareRepairCatalogItem: (id) =>
    set((state: ErpState) => {
      const updatedList = state.hardwareRepairCatalog.filter((i) => i.id !== id);
      saveToStorage('accno_erp_hardware_repair_catalog', updatedList);
      return { hardwareRepairCatalog: updatedList };
    }),

  // Repair Process Steps Implementation
  repairProcessSteps: loadFromStorage<RepairProcessStepItem[]>('accno_erp_repair_process_steps', [
    {
      id: 'step-1',
      step: '01',
      title: 'Free Diagnostic & Job Card',
      desc: 'Bring your device or request onsite pick-up. We issue a digital job card with barcode & transparent initial checkup.',
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'step-2',
      step: '02',
      title: 'Engineer Diagnosis & Quote',
      desc: 'Our certified engineers inspect hardware circuits and provide an exact cost estimate & turnaround timeline for approval.',
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'step-3',
      step: '03',
      title: 'Precision Micro-Repair',
      desc: 'Components are repaired using cleanroom ESD workstations, genuine spare parts, and strict QA bench testing.',
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'step-4',
      step: '04',
      title: 'Delivery & 90-Day Warranty',
      desc: 'Receive instant WhatsApp/SMS notification, inspect your device live, download GST invoice, and enjoy 90 days warranty.',
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addRepairProcessStep: (step) =>
    set((state: ErpState) => {
      const newStep: RepairProcessStepItem = {
        ...step,
        id: step.id || `step-${Date.now()}`,
        created_at: step.created_at || new Date().toISOString(),
      };
      const updated = [...state.repairProcessSteps, newStep].sort((a, b) => a.step.localeCompare(b.step));
      saveToStorage('accno_erp_repair_process_steps', updated);
      return { repairProcessSteps: updated };
    }),

  updateRepairProcessStep: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.repairProcessSteps
        .map((s) => (s.id === id ? { ...s, ...updated } : s))
        .sort((a, b) => a.step.localeCompare(b.step));
      saveToStorage('accno_erp_repair_process_steps', updatedList);
      return { repairProcessSteps: updatedList };
    }),

  deleteRepairProcessStep: (id) =>
    set((state: ErpState) => {
      const updatedList = state.repairProcessSteps.filter((s) => s.id !== id);
      saveToStorage('accno_erp_repair_process_steps', updatedList);
      return { repairProcessSteps: updatedList };
    }),

  // Enterprise IT & Solutions Grid Implementation
  enterpriseSolutions: loadFromStorage<EnterpriseSolutionItem[]>('accno_erp_enterprise_solutions', [
    {
      id: 'sol-1',
      iconName: 'Laptop',
      title: 'Laptop & Computer Repair',
      desc: 'Chip-level motherboard repair, liquid damage restoration, screen replacement, & keyboard fixing for all major brands.',
      link: '/repairs',
      badge: 'Popular',
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-2',
      iconName: 'Cpu',
      title: 'Apple Mac Repair Specialist',
      desc: 'MacBook Pro, Air, iMac & Mac Studio logic board repairs, M1/M2/M3 chip troubleshooting, & original component replacement.',
      link: '/repairs',
      badge: 'Specialist',
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-3',
      iconName: 'HardDrive',
      title: 'Forensic Data Recovery',
      desc: 'Class-100 cleanroom data extraction from dead HDDs, SSDs, NVMe, RAID arrays, & corrupted flash drives.',
      link: '/data-recovery',
      badge: 'Cleanroom',
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-4',
      iconName: 'ShieldAlert',
      title: 'CCTV & Security Solutions',
      desc: 'IP camera setup, 4K DVR/NVR installation, remote mobile view configuration, & AMC security upkeep.',
      link: '/corporate',
      badge: 'Enterprise',
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-5',
      iconName: 'Wifi',
      title: 'Networking & Structured Cabling',
      desc: 'Cat6/Fiber optic layout, Cisco/MikroTik router configuration, Wi-Fi mesh networks, & firewall security.',
      link: '/networking',
      badge: 'Corporate',
      order: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-6',
      iconName: 'Server',
      title: 'Annual Maintenance Contracts (AMC)',
      desc: 'Comprehensive hardware & software AMC packages for corporate offices, schools, & retail establishments.',
      link: '/amc',
      badge: 'Contract',
      order: 6,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-7',
      iconName: 'Monitor',
      title: 'Custom Workstation & Gaming PCs',
      desc: 'Bespoke liquid-cooled PC builds for video editing, AI deep learning, gaming, & architectural rendering.',
      link: '/products',
      badge: 'Custom',
      order: 7,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'sol-8',
      iconName: 'Layers',
      title: 'Accounting & Business ERP',
      desc: 'Marg ERP, Logic ERP, custom cloud repair shop ERP software, & POS setup with GST integration.',
      link: '/erp/dashboard',
      badge: 'Software ERP',
      order: 8,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addEnterpriseSolution: (item) =>
    set((state: ErpState) => {
      const newItem: EnterpriseSolutionItem = {
        ...item,
        id: item.id || `sol-${Date.now()}`,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.enterpriseSolutions, newItem];
      saveToStorage('accno_erp_enterprise_solutions', updated);
      return { enterpriseSolutions: updated };
    }),

  updateEnterpriseSolution: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.enterpriseSolutions.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_enterprise_solutions', updatedList);
      return { enterpriseSolutions: updatedList };
    }),

  deleteEnterpriseSolution: (id) =>
    set((state: ErpState) => {
      const updatedList = state.enterpriseSolutions.filter((s) => s.id !== id);
      saveToStorage('accno_erp_enterprise_solutions', updatedList);
      return { enterpriseSolutions: updatedList };
    }),

  // Detailed Services & Specifications Implementation
  detailedServices: loadFromStorage<DetailedServiceItem[]>('accno_erp_detailed_services', [
    {
      id: 'srv-1',
      category: 'hardware',
      badge: 'Micro-Soldering Repair',
      iconName: 'Wrench',
      title: 'Chip-Level Motherboard & Laptop Micro-Repair',
      shortDesc: 'Precision SMD/BGA micro-soldering, liquid damage restoration, and component-level circuit diagnostics for all laptop & PC brands.',
      whyChoose: 'Traditional service centers force customers to buy expensive replacement motherboards when only a single IC or capacitor is shorted. We fix the exact component to save up to 70% in costs.',
      features: [
        'BGA chip reballing & power IC replacement',
        'Liquid damage oxidation ultrasonic cleaning',
        'Thermal camera short-circuit location tracing',
        'BIOS EEPROM chip reprogramming & ME-region cleaning',
        'Original screen, keyboard & hinge structural fixes',
      ],
      idealFor: 'Individual laptop owners, corporate computer fleets, schools, retail customers.',
      turnaround: '24 - 48 Hours',
      warranty: '90 Days Standard Labor & Spare Parts Warranty',
      actionLink: '/repairs',
      actionText: 'Book Hardware Repair',
      isVisible: true,
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-2',
      category: 'mac',
      badge: 'Apple Mac Specialist',
      iconName: 'Cpu',
      title: 'Apple Mac & MacBook Logic Board Micro-Soldering',
      shortDesc: 'Specialized logic board repairs, M1/M2/M3 chip troubleshooting, T2 security restores, and genuine OEM component replacements.',
      whyChoose: 'Official Apple repair estimates often exceed the value of the device, and generic shops lack ESD cleanroom tools. We offer component-level Mac repairs with Apple-certified diagnostic precision.',
      features: [
        'M1, M2 & M3 Silicon chip power rail troubleshooting',
        'Flexgate & backlight display flex cable micro-soldering',
        'T2 Security Chip & SMC firmware restoration',
        'MacBook Pro/Air liquid damage restoration',
        'Genuine battery, trackpad & magsafe port replacements',
      ],
      idealFor: 'Graphic designers, software engineers, video editors, Mac power users.',
      turnaround: '24 - 72 Hours',
      warranty: '90 Days Apple Repair Warranty',
      actionLink: '/repairs',
      actionText: 'Request Mac Diagnostics',
      isVisible: true,
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-3',
      category: 'datarecovery',
      badge: 'Class-100 Cleanroom',
      iconName: 'HardDrive',
      title: 'Forensic Cleanroom Data Recovery Services',
      shortDesc: 'Certified data extraction from dead HDDs, failed SSDs, corrupted NVMe drives, RAID arrays, and damaged flash memory.',
      whyChoose: 'Dust particles ruin exposed drive platters instantly. We operate a dust-free Class-100 cleanroom lab for mechanical head swaps, ensuring maximum data retrieval without permanent loss.',
      features: [
        'Dust-free Class-100 cleanroom head & platter swaps',
        'NVMe & SATA SSD controller chip-off extraction',
        'RAID 0, RAID 5 & RAID 10 server array reconstruction',
        'BitLocker & file system corruption recovery',
        'Strict NDA & 100% data confidentiality guarantee',
      ],
      idealFor: 'Law firms, healthcare clinics, photographers, financial firms, enterprise servers.',
      turnaround: '1 - 5 Business Days',
      warranty: 'No Data, No Fee Evaluation Policy',
      actionLink: '/data-recovery',
      actionText: 'Start Data Recovery',
      isVisible: true,
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-4',
      category: 'custompc',
      badge: 'Bespoke Custom PC',
      iconName: 'Monitor',
      title: 'Custom Workstation & High-Performance Gaming Rigs',
      shortDesc: 'Custom-built liquid-cooled workstations designed for AI deep learning, 4K video rendering, 3D animation, and esports gaming.',
      whyChoose: 'Pre-built PCs suffer from cheap power supplies, single-channel memory bottlenecking, and poor thermal cases. We hand-assemble custom rigs benchmark-tested for maximum performance and longevity.',
      features: [
        'Hard-line & soft-tube custom liquid cooling loops',
        'Pro-grade cable sleeving & clean airflow management',
        'Stress-bench thermal & RAM stability testing',
        'AI workstation multi-GPU configuration (NVIDIA RTX / Quadro)',
        'BIOS tuning, XMP profile activation & thermal repasting',
      ],
      idealFor: 'Competitive gamers, 3D animators, AI researchers, architects, video editors.',
      turnaround: '24 - 48 Hours Build Time',
      warranty: '3-Year Component Warranty + Lifetime Technical Support',
      actionLink: '/shop',
      actionText: 'Browse Store & Components',
      isVisible: true,
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-5',
      category: 'cctv',
      badge: '4K CCTV Surveillance',
      iconName: 'ShieldCheck',
      title: '4K IP Camera & CCTV Security Infrastructure',
      shortDesc: 'Commercial and residential 4K Ultra-HD security systems with PoE switches, redundant NVR storage, and secure mobile view.',
      whyChoose: 'Security cameras fail when installations lack proper weatherproofing or power isolation. We build industrial-grade surveillance networks that guarantee 24/7 continuous recording without frame drops.',
      features: [
        '4K Ultra-HD IP cameras with infrared night vision',
        '32-Channel NVR RAID redundancy setup',
        'PoE smart switch cabling & surge protection',
        'AI motion detection & instant mobile alerts',
        'Remote mobile app live view configuration',
      ],
      idealFor: 'Retail showrooms, warehouses, commercial buildings, residential villas.',
      turnaround: '1 - 3 Days Onsite Installation',
      warranty: '1-Year Comprehensive Onsite Maintenance',
      actionLink: '/corporate',
      actionText: 'Inquire Onsite Survey',
      isVisible: true,
      order: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-6',
      category: 'networking',
      badge: 'Enterprise Networking',
      iconName: 'Wifi',
      title: 'Structured Fiber Cabling & Network Infrastructure',
      shortDesc: 'Gigabit Cat6/Cat6A structured cabling, Cisco Catalyst VLAN configuration, MikroTik load balancing, and enterprise Wi-Fi 6 mesh.',
      whyChoose: 'Unorganized networking causes data packet drops, latency spikes, and Wi-Fi dead zones. We install certified structured cabling that handles high bandwidth demands with zero bottlenecking.',
      features: [
        'Gigabit Cat6 & Fiber optic backbone layout',
        'Cisco switch VLAN network segmentation',
        'MikroTik router dual-ISP failover load balancing',
        'Wi-Fi 6 seamless mesh roaming configuration',
        'Server rack patch panel cable dressing & labeling',
      ],
      idealFor: 'Corporate offices, call centers, hotels, educational campuses, hospitals.',
      turnaround: 'Custom Project SLA',
      warranty: '25-Year Cabling Infrastructure Guarantee',
      actionLink: '/networking',
      actionText: 'Request Network Audit',
      isVisible: true,
      order: 6,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-7',
      category: 'amc',
      badge: 'Annual Maintenance AMC',
      iconName: 'Server',
      title: 'Corporate IT Hardware Annual Maintenance Contracts (AMC)',
      shortDesc: 'Proactive annual IT maintenance packages covering workstation health, server upkeep, standby PC support, and 2-hour SLA response.',
      whyChoose: 'Unexpected IT failures disrupt business operations and spike emergency costs. Our AMC contracts deliver predictable annual budgeting, preventive quarterly checkups, and instant standby hardware replacement.',
      features: [
        'Quarterly preventive hardware & software cleaning',
        'Guaranteed 2-hour emergency SLA response time',
        'Standby backup PCs during repairs to eliminate downtime',
        'OS security patching, antivirus & malware removal',
        'Dedicated account manager & resident engineer options',
      ],
      idealFor: 'Offices, schools, call centers, financial firms with 5 to 500+ systems.',
      turnaround: 'Continuous 365-Day Coverage',
      warranty: 'Guaranteed SLA Uptime Commitment',
      actionLink: '/amc',
      actionText: 'Get Corporate AMC Quote',
      isVisible: true,
      order: 7,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv-8',
      category: 'software',
      badge: 'Software ERP & POS',
      iconName: 'Layers',
      title: 'Custom Repair Shop ERP & POS Counter System Software',
      shortDesc: 'Cloud-based repair shop management software featuring barcode ticket tracking, POS billing, GST compliance, and automated WhatsApp alerts.',
      whyChoose: 'Traditional billing tools lack repair ticket status tracking, serial number histories, and technician assignments. We engineered an all-in-one ERP that automates shop workflow and boosts client trust.',
      features: [
        'Barcode repair ticket & job card tracking',
        'POS counter billing with instant GST tax invoices',
        'Automated WhatsApp status notifications to customers',
        'Inventory stock alert sync & vendor purchase history',
        'Technician performance analytics & daily ledger reports',
      ],
      idealFor: 'Computer repair shop owners, mobile service centers, electronics retailers.',
      turnaround: 'Instant Cloud Deployment',
      warranty: 'Free Updates & Continuous Cloud Support',
      actionLink: '/services/repair-shop-erp',
      actionText: 'Explore Repair ERP Software',
      isVisible: true,
      order: 8,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addDetailedService: (item) =>
    set((state: ErpState) => {
      const newItem: DetailedServiceItem = {
        ...item,
        id: item.id || `srv-${Date.now()}`,
        isVisible: item.isVisible ?? true,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.detailedServices, newItem];
      saveToStorage('accno_erp_detailed_services', updated);
      return { detailedServices: updated };
    }),

  updateDetailedService: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.detailedServices.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_detailed_services', updatedList);
      return { detailedServices: updatedList };
    }),

  deleteDetailedService: (id) =>
    set((state: ErpState) => {
      const updatedList = state.detailedServices.filter((s) => s.id !== id);
      saveToStorage('accno_erp_detailed_services', updatedList);
      return { detailedServices: updatedList };
    }),

  toggleDetailedServiceVisibility: (id) =>
    set((state: ErpState) => {
      const updatedList = state.detailedServices.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      );
      saveToStorage('accno_erp_detailed_services', updatedList);
      return { detailedServices: updatedList };
    }),

  // Service Highlights & Stats Implementation
  serviceStats: loadFromStorage<ServiceStatItem[]>('accno_erp_service_stats', [
    {
      id: 'stat-1',
      value: '10+ Years',
      label: 'Technical Experience',
      color: '#5ED29C',
      isVisible: true,
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-2',
      value: '15,000+',
      label: 'Devices Repaired',
      color: '#16FFC6',
      isVisible: true,
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-3',
      value: 'Class-100',
      label: 'Cleanroom Recovery Lab',
      color: '#38BDF8',
      isVisible: true,
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'stat-4',
      value: '90 Days',
      label: 'Standard Repair Warranty',
      color: '#818CF8',
      isVisible: true,
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addServiceStat: (item) =>
    set((state: ErpState) => {
      const newItem: ServiceStatItem = {
        ...item,
        id: item.id || `stat-${Date.now()}`,
        isVisible: item.isVisible ?? true,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.serviceStats, newItem];
      saveToStorage('accno_erp_service_stats', updated);
      return { serviceStats: updated };
    }),

  updateServiceStat: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.serviceStats.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_service_stats', updatedList);
      return { serviceStats: updatedList };
    }),

  deleteServiceStat: (id) =>
    set((state: ErpState) => {
      const updatedList = state.serviceStats.filter((s) => s.id !== id);
      saveToStorage('accno_erp_service_stats', updatedList);
      return { serviceStats: updatedList };
    }),

  toggleServiceStatVisibility: (id) =>
    set((state: ErpState) => {
      const updatedList = state.serviceStats.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      );
      saveToStorage('accno_erp_service_stats', updatedList);
      return { serviceStats: updatedList };
    }),

  // Service Pillars & Rationale Implementation
  servicePillars: loadFromStorage<ServicePillarItem[]>('accno_erp_service_pillars', [
    {
      id: 'plr-1',
      iconName: 'DollarSign',
      title: 'Economic Component Repair',
      desc: 'Rather than forcing board replacements, we micro-repair individual failed IC chips and capacitors — saving our clients up to 70% in repair bills.',
      badge: 'Cost Savings',
      isVisible: true,
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'plr-2',
      iconName: 'Shield',
      title: 'Class-100 Data Privacy',
      desc: 'We operate specialized dust-free cleanroom labs for mechanical drive extraction, guaranteeing 100% strict data privacy compliance for all sensitive files.',
      badge: '100% Confidential',
      isVisible: true,
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'plr-3',
      iconName: 'Zap',
      title: 'Rapid SLA & Standby PCs',
      desc: 'Hardware breakdowns stall operations. Our 2-hour SLA response and standby PC program keep corporate clients working without lost billable hours.',
      badge: 'Zero Downtime',
      isVisible: true,
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'plr-4',
      iconName: 'BarChart3',
      title: 'In-House Repair Shop ERP',
      desc: 'We developed custom barcode tracking & POS ERP software specifically to give customers real-time repair progress and complete invoice transparency.',
      badge: 'Live Transparency',
      isVisible: true,
      order: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addServicePillar: (item) =>
    set((state: ErpState) => {
      const newItem: ServicePillarItem = {
        ...item,
        id: item.id || `plr-${Date.now()}`,
        isVisible: item.isVisible ?? true,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.servicePillars, newItem];
      saveToStorage('accno_erp_service_pillars', updated);
      return { servicePillars: updated };
    }),

  updateServicePillar: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.servicePillars.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_service_pillars', updatedList);
      return { servicePillars: updatedList };
    }),

  deleteServicePillar: (id) =>
    set((state: ErpState) => {
      const updatedList = state.servicePillars.filter((s) => s.id !== id);
      saveToStorage('accno_erp_service_pillars', updatedList);
      return { servicePillars: updatedList };
    }),

  toggleServicePillarVisibility: (id) =>
    set((state: ErpState) => {
      const updatedList = state.servicePillars.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      );
      saveToStorage('accno_erp_service_pillars', updatedList);
      return { servicePillars: updatedList };
    }),

  // Services Page Frequently Asked Questions Implementation
  servicesFaqs: loadFromStorage<ServicesFaqItem[]>('accno_erp_services_faqs', [
    {
      id: 'faq-1',
      question: 'How does your 90-day repair warranty work?',
      answer: 'Every hardware repair, micro-soldering job, or component replacement carried out at ACCNO SOLUTION comes with a standard 90-day warranty covering both labor and replacement spare parts. If the exact issue reoccurs within 90 days, we fix it free of charge.',
      category: 'Warranty & SLA',
      isVisible: true,
      order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'faq-2',
      question: 'Will my personal files and data be safe during motherboard repair?',
      answer: 'Yes. We adhere to strict data privacy standards. During motherboard micro-soldering, storage drives are isolated whenever possible. For data recovery cases, data is extracted in an offline Class-100 cleanroom environment under strict non-disclosure agreements.',
      category: 'Data Privacy',
      isVisible: true,
      order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'faq-3',
      question: 'Can I track my repair status live?',
      answer: 'Yes! Every device checked in receives a unique barcode ticket ID (e.g. TKT-1001). You can enter your ticket ID on our "Track Status" page or click the link in your automated WhatsApp updates to see real-time repair progress and engineer diagnostics.',
      category: 'Live Tracking',
      isVisible: true,
      order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addServicesFaq: (item) =>
    set((state: ErpState) => {
      const newItem: ServicesFaqItem = {
        ...item,
        id: item.id || `faq-${Date.now()}`,
        isVisible: item.isVisible ?? true,
        created_at: item.created_at || new Date().toISOString(),
      };
      const updated = [...state.servicesFaqs, newItem];
      saveToStorage('accno_erp_services_faqs', updated);
      return { servicesFaqs: updated };
    }),

  updateServicesFaq: (id, updated) =>
    set((state: ErpState) => {
      const updatedList = state.servicesFaqs.map((s) => (s.id === id ? { ...s, ...updated } : s));
      saveToStorage('accno_erp_services_faqs', updatedList);
      return { servicesFaqs: updatedList };
    }),

  deleteServicesFaq: (id) =>
    set((state: ErpState) => {
      const updatedList = state.servicesFaqs.filter((s) => s.id !== id);
      saveToStorage('accno_erp_services_faqs', updatedList);
      return { servicesFaqs: updatedList };
    }),

  toggleServicesFaqVisibility: (id) =>
    set((state: ErpState) => {
      const updatedList = state.servicesFaqs.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      );
      saveToStorage('accno_erp_services_faqs', updatedList);
      return { servicesFaqs: updatedList };
    }),

  // Website Shopping Cart Implementation
  websiteCart: loadFromStorage<CartItem[]>('accno_shop_cart', []),

  addToWebsiteCart: (product, qty = 1) =>
    set((state: ErpState) => {
      const existing = state.websiteCart || [];
      const index = existing.findIndex((c) => c.product.id === product.id);
      let updatedCart: CartItem[] = [];
      if (index > -1) {
        updatedCart = existing.map((c, i) =>
          i === index ? { ...c, quantity: c.quantity + qty } : c
        );
      } else {
        updatedCart = [...existing, { product, quantity: qty }];
      }
      saveToStorage('accno_shop_cart', updatedCart);
      return { websiteCart: updatedCart };
    }),

  removeFromWebsiteCart: (productId) =>
    set((state: ErpState) => {
      const updatedCart = (state.websiteCart || []).filter((c) => c.product.id !== productId);
      saveToStorage('accno_shop_cart', updatedCart);
      return { websiteCart: updatedCart };
    }),

  updateWebsiteCartQty: (productId, qty) =>
    set((state: ErpState) => {
      if (qty <= 0) {
        const updatedCart = (state.websiteCart || []).filter((c) => c.product.id !== productId);
        saveToStorage('accno_shop_cart', updatedCart);
        return { websiteCart: updatedCart };
      }
      const updatedCart = (state.websiteCart || []).map((c) =>
        c.product.id === productId ? { ...c, quantity: qty } : c
      );
      saveToStorage('accno_shop_cart', updatedCart);
      return { websiteCart: updatedCart };
    }),

  clearWebsiteCart: () =>
    set(() => {
      saveToStorage('accno_shop_cart', []);
      return { websiteCart: [] };
    }),

  // Website Top Promotion Campaigns & Bar Implementation
  websitePromotions: loadFromStorage<WebsitePromotionItem[]>('accno_website_promotions', [
    {
      id: 'promo-tech-1',
      title: 'Laptop & Apple Mac Chip-Level Repairs (20% OFF)',
      category: 'Laptops & Computers',
      text: '⚡ SPECIAL OFFER: Get Up to 20% OFF on Laptop & Apple Mac Chip-Level Repairs! Free Pick & Drop Across Jammu.',
      badgeText: 'LIMITED TIME OFFER',
      actionText: 'Book Repair Now →',
      actionLink: '/book-repair',
      theme: 'emerald',
      isDismissible: false,
      isActive: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'promo-car-1',
      title: 'Car ECM/ECU & Automotive Electronics Diagnostics',
      category: 'Cars & Automobile Electronics',
      text: '🚗 CAR ELECTRONICS: Up to 20% OFF on Car ECM/ECU Diagnostics, Touchscreen Infotainment & Dashboard Repairs!',
      badgeText: 'CAR ELECTRONICS SPECIAL',
      actionText: 'Book Car Service →',
      actionLink: '/book-repair',
      theme: 'cyan',
      isDismissible: false,
      isActive: false,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'promo-car-2',
      title: 'Car Audio, Stereo & GPS Reverse Camera Overhaul',
      category: 'Cars & Automobile Electronics',
      text: '🚘 AUTO AUDIO & DISPLAY: Precision component diagnostics for dead car stereos, amplifiers & reverse camera modules.',
      badgeText: 'CAR AUDIO LAB',
      actionText: 'Explore Repairs →',
      actionLink: '/repairs',
      theme: 'amber',
      isDismissible: false,
      isActive: false,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'promo-cctv-1',
      title: 'CCTV Security & Corporate IT Infrastructure AMC',
      category: 'CCTV & Security',
      text: '🔥 FESTIVAL SPECIAL: Flat 15% OFF on CCTV Installation & Corporate IT Infrastructure AMC Packages!',
      badgeText: 'MEGA SALE',
      actionText: 'Explore Packages →',
      actionLink: '/services',
      theme: 'rose',
      isDismissible: false,
      isActive: false,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

  addWebsitePromotion: (item) =>
    set((state: ErpState) => {
      const newItem: WebsitePromotionItem = {
        ...item,
        id: item.id || `promo-${Date.now()}`,
        isActive: item.isActive ?? false,
        created_at: item.created_at || new Date().toISOString(),
      };
      let updatedList = [...state.websitePromotions];
      if (newItem.isActive) {
        updatedList = updatedList.map((p) => ({ ...p, isActive: false }));
        updatedList.push(newItem);
        const updatedBar: WebsitePromotionBar = {
          isEnabled: state.websitePromotionBar.isEnabled,
          text: newItem.text,
          badgeText: newItem.badgeText,
          actionText: newItem.actionText,
          actionLink: newItem.actionLink,
          theme: newItem.theme,
          isDismissible: newItem.isDismissible,
        };
        saveToStorage('accno_website_promotion_bar', updatedBar);
        saveToStorage('accno_website_promotions', updatedList);
        return { websitePromotions: updatedList, websitePromotionBar: updatedBar };
      }
      updatedList.push(newItem);
      saveToStorage('accno_website_promotions', updatedList);
      return { websitePromotions: updatedList };
    }),

  updateWebsitePromotion: (id, updated) =>
    set((state: ErpState) => {
      let updatedBar = state.websitePromotionBar;
      const updatedList = state.websitePromotions.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updated };
          if (merged.isActive) {
            updatedBar = {
              isEnabled: state.websitePromotionBar.isEnabled,
              text: merged.text,
              badgeText: merged.badgeText,
              actionText: merged.actionText,
              actionLink: merged.actionLink,
              theme: merged.theme,
              isDismissible: merged.isDismissible,
            };
            saveToStorage('accno_website_promotion_bar', updatedBar);
          }
          return merged;
        }
        if (updated.isActive) {
          return { ...p, isActive: false };
        }
        return p;
      });
      saveToStorage('accno_website_promotions', updatedList);
      return { websitePromotions: updatedList, websitePromotionBar: updatedBar };
    }),

  deleteWebsitePromotion: (id) =>
    set((state: ErpState) => {
      const target = state.websitePromotions.find((p) => p.id === id);
      const deletedWasActive = target?.isActive;
      let updatedList = state.websitePromotions.filter((p) => p.id !== id);
      let updatedBar = state.websitePromotionBar;
      if (deletedWasActive && updatedList.length > 0) {
        updatedList[0] = { ...updatedList[0], isActive: true };
        updatedBar = {
          isEnabled: state.websitePromotionBar.isEnabled,
          text: updatedList[0].text,
          badgeText: updatedList[0].badgeText,
          actionText: updatedList[0].actionText,
          actionLink: updatedList[0].actionLink,
          theme: updatedList[0].theme,
          isDismissible: updatedList[0].isDismissible,
        };
        saveToStorage('accno_website_promotion_bar', updatedBar);
      }
      saveToStorage('accno_website_promotions', updatedList);
      return { websitePromotions: updatedList, websitePromotionBar: updatedBar };
    }),

  selectActivePromotion: (id) =>
    set((state: ErpState) => {
      const target = state.websitePromotions.find((p) => p.id === id);
      if (!target) return state;
      const updatedList = state.websitePromotions.map((p) => ({
        ...p,
        isActive: p.id === id,
      }));
      const updatedBar: WebsitePromotionBar = {
        isEnabled: state.websitePromotionBar.isEnabled,
        text: target.text,
        badgeText: target.badgeText,
        actionText: target.actionText,
        actionLink: target.actionLink,
        theme: target.theme,
        isDismissible: target.isDismissible,
      };
      saveToStorage('accno_website_promotions', updatedList);
      saveToStorage('accno_website_promotion_bar', updatedBar);
      return { websitePromotions: updatedList, websitePromotionBar: updatedBar };
    }),

  websitePromotionBar: loadFromStorage<WebsitePromotionBar>('accno_website_promotion_bar', {
    isEnabled: true,
    text: '⚡ SPECIAL OFFER: Get Up to 20% OFF on Laptop & Apple Mac Chip-Level Repairs! Free Pick & Drop Across Jammu.',
    badgeText: 'LIMITED TIME OFFER',
    actionText: 'Book Repair Now →',
    actionLink: '/book-repair',
    theme: 'emerald',
    isDismissible: false,
  }),

  updateWebsitePromotionBar: (data) =>
    set((state: ErpState) => {
      const updated = { ...state.websitePromotionBar, ...data };
      saveToStorage('accno_website_promotion_bar', updated);
      return { websitePromotionBar: updated };
    }),
}));
