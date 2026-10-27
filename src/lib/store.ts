import { create } from 'zustand';

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
  estimatedDeliveryDate: string;
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
  addSalesInvoice: (invoice: Omit<SalesInvoiceItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateSalesInvoice: (id: string, updated: Partial<SalesInvoiceItem>) => void;
  deleteSalesInvoice: (id: string) => void;

  // Purchase Invoices State
  purchaseInvoices: PurchaseInvoiceItem[];
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
  outsourceRules: OutsourceRulesConfig;
  addOutsourceVoucher: (voucherData: Omit<OutsourceVoucher, 'id' | 'profitMargin'> & { voucherNumber?: string }) => void;
  updateOutsourceVoucher: (id: string, updatedData: Partial<OutsourceVoucher>) => void;
  deleteOutsourceVoucher: (id: string) => void;
  updateOutsourceRules: (rules: Partial<OutsourceRulesConfig>) => void;
  
  // Customers State
  customers: CustomerItem[];
  customerRules: CustomerRulesConfig;
  addCustomer: (cust: Omit<CustomerItem, 'id' | 'code' | 'totalRepairs'>) => void;
  updateCustomer: (id: string, cust: Partial<CustomerItem>) => void;
  deleteCustomer: (id: string) => void;
  updateCustomerRules: (rules: Partial<CustomerRulesConfig>) => void;

  // Vendors State & Rules
  vendors: VendorItem[];
  vendorRules: VendorRulesConfig;
  addVendor: (vendorData: Omit<VendorItem, 'id' | 'code'>) => void;
  updateVendor: (id: string, vendorData: Partial<VendorItem>) => void;
  deleteVendor: (id: string) => void;
  updateVendorRules: (rules: Partial<VendorRulesConfig>) => void;

  // Employees State & Actions
  employees: EmployeeItem[];
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
  inventoryRules: InventoryRulesConfig;
  addInventoryItem: (itemData: Omit<InventoryItem, 'id' | 'code'>) => void;
  updateInventoryItem: (id: string, itemData: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateInventoryRules: (rules: Partial<InventoryRulesConfig>) => void;

  // Data Recovery Cases State
  dataRecoveryCases: DataRecoveryCase[];
  addDataRecoveryCase: (caseData: Omit<DataRecoveryCase, 'id' | 'created_at'> & { caseNumber?: string }) => void;
  updateDataRecoveryCase: (id: string, updatedData: Partial<DataRecoveryCase>) => void;
  deleteDataRecoveryCase: (id: string) => void;

  // AMC Contracts State
  amcContracts: AmcContract[];
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
  addSupportLead: (lead: Omit<SupportLeadItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateSupportLead: (id: string, updated: Partial<SupportLeadItem>) => void;
  deleteSupportLead: (id: string) => void;

  // Book Repair Online Leads State & Actions
  bookRepairLeads: BookRepairLeadItem[];
  addBookRepairLead: (lead: Omit<BookRepairLeadItem, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  updateBookRepairLead: (id: string, updated: Partial<BookRepairLeadItem>) => void;
  deleteBookRepairLead: (id: string) => void;

  // Blog Management State & Actions
  blogPosts: BlogPostItem[];
  addBlogPost: (post: Omit<BlogPostItem, 'id' | 'views' | 'created_at'> & { id?: string; views?: number; created_at?: string }) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPostItem>) => void;
  deleteBlogPost: (id: string) => void;

  // Company Milestones State & Actions
  milestones: MilestoneItem[];
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
  // Repair Tickets Initial State
  tickets: (() => {
    const loaded = loadFromStorage<RepairTicket[]>('accno_erp_tickets', [
      {
        id: 't-1001',
        ticket_number: 'TKT-1001',
        barcode_data: 'TKT1001',
        customer_name: 'Rajesh Kumar (Tech Logics)',
        customer_phone: '+91 98765-43210',
        customerAlternatePhone: '+91 94191-88776',
        customerEmail: 'rajesh@techlogics.in',
        customerGstin: '01AAAAA0000A1Z5',
        customerAddress: 'Plot 42, Sector 3, Industrial Area, Jammu',
        customerType: 'CORPORATE',

        device_type: 'MacBook Pro M2',
        brand: 'Apple',
        model: 'A2442 (14-inch 2022)',
        serial_or_imei: 'C02G1234MD6R',
        passwordLock: 'mac2025@pass',
        patternLockSequence: [0, 1, 2, 5, 8], // Z pattern
        rackLocation: 'Shelf A-3, Bin 04',
        problem_reported: 'MacBook Pro M2 Motherboard Repair - Logic Board Micro-soldering',
        physicalCondition: 'Minor bezel scratches. Moisture indicator turned pink near USB-C port.',

        status: 'in_progress',
        priority: 'urgent',
        progressPercentage: 78,

        lineItems: [
          { id: 'li-1', description: 'MacBook M2 Motherboard Liquid Damage Micro-soldering', hsnCode: '998713', quantity: 1, unitPrice: 12500, total: 12500, itemType: 'service' },
          { id: 'li-2', description: 'Apple OEM Force Touch Trackpad Assembly', hsnCode: '84733020', quantity: 1, unitPrice: 6000, total: 6000, itemType: 'part' },
        ],
        outsourceCharges: 0,
        freightCharges: 0,
        estimated_cost: 18500,
        advance_paid: 5000,
        discountAmount: 500,
        gstTaxRate: 18,
        subtotal: 18000,
        taxableAmount: 18000,
        cgstAmount: 1620,
        sgstAmount: 1620,
        roundOffAdjustment: -0.24,
        grandTotal: 21239,
        netDueBalance: 16239,

        paymentMethod: 'UPI',
        paymentStatus: 'PARTIAL',
        warrantyStatement: '30 Days Parts & Labor Warranty',
        deliveredTo: '',
        deliveryStatus: 'IN REPAIR LAB',
        afterServiceRemarks: 'Replaced power IC controller and trackpad flex cable.',

        technician_name: 'Deepak Kumar',
        entryDate: '2025-05-10',
        estimatedDeliveryDate: '2025-05-14',
        created_at: '2025-05-10 10:30 AM',
      },
      {
        id: 't-1002',
        ticket_number: 'TKT-1002',
        barcode_data: 'TKT1002',
        customer_name: 'Dr. Anita Roy',
        customer_phone: '+91 94191-12233',
        customerAlternatePhone: '+91 94191-12234',
        customerEmail: 'anita@royhospital.org',
        customerGstin: '01BBBBB1111B2Z6',
        customerAddress: 'Channi Himmat Main Road, Jammu',
        customerType: 'CORPORATE',

        device_type: 'Data Recovery (Seagate 2TB HDD)',
        brand: 'Seagate',
        model: 'ST2000LM015',
        serial_or_imei: 'Z3901XQP',
        passwordLock: 'N/A',
        patternLockSequence: [],
        rackLocation: 'Cleanroom Safe Locker 02',
        problem_reported: 'Clicking sound from drive. Heads stuck. Hospital records recovery.',
        physicalCondition: 'Sealed drive casing intact. No prior opening marks.',

        status: 'diagnosing',
        priority: 'urgent',

        lineItems: [
          { id: 'li-3', description: 'Class-100 Cleanroom Mechanical Head Replacement & Data Extraction', hsnCode: '998713', quantity: 1, unitPrice: 14000, total: 14000, itemType: 'service' },
        ],
        outsourceCharges: 3200,
        freightCharges: 350,
        estimated_cost: 17550,
        advance_paid: 3000,
        discountAmount: 0,
        gstTaxRate: 18,
        subtotal: 17550,
        taxableAmount: 17550,
        cgstAmount: 1579.5,
        sgstAmount: 1579.5,
        roundOffAdjustment: 0,
        grandTotal: 20709,
        netDueBalance: 17709,

        paymentMethod: 'NETBANKING',
        paymentStatus: 'PARTIAL',
        warrantyStatement: 'Data Recovery Guarantee - No Data No Fee',
        deliveredTo: '',
        deliveryStatus: 'DIAGNOSING IN CLEANROOM',
        afterServiceRemarks: 'Donor drive head assembly received from Delhi lab.',

        technician_name: 'Rahul Gupta',
        entryDate: '2025-05-11',
        estimatedDeliveryDate: '2025-05-16',
        created_at: '2025-05-11 11:15 AM',
      }
    ]);
    return loaded;
  })(),
  repairInvoices: loadFromStorage('accno_erp_repair_invoices', [
    {
      id: 'inv-1001',
      invoiceNumber: 'TKT-3001',
      ticketId: 't-1002',
      ticketNumber: 'TKT-1002',
      invoiceDate: new Date().toISOString().split('T')[0],
      customerName: 'Dr. Anita Roy',
      customerPhone: '+91 94191-12233',
      customerGstin: '01BBBBB1111B2Z6',
      customerType: 'CORPORATE',
      deviceType: 'Data Recovery (Seagate 2TB HDD)',
      brand: 'Seagate',
      model: 'ST2000LM015',
      serial_or_imei: 'Z3901XQP',
      lineItems: [
        { id: 'li-3', description: 'Class-100 Cleanroom Mechanical Head Replacement & Data Extraction', hsnCode: '998713', quantity: 1, unitPrice: 14000, total: 14000, itemType: 'service' },
      ],
      outsourceCharges: 3200,
      freightCharges: 350,
      subtotal: 17550,
      discountAmount: 0,
      taxableAmount: 17550,
      gstTaxRate: 18,
      cgstAmount: 1579.5,
      sgstAmount: 1579.5,
      roundOffAdjustment: 0,
      grandTotal: 20709,
      advancePaid: 3000,
      netDueBalance: 17709,
      paymentMethod: 'NETBANKING',
      paymentStatus: 'PAID',
      warrantyStatement: '30 Days Parts & Labor Warranty',
      deliveredTo: 'Dr. Anita Roy',
      deliveryStatus: 'DELIVERED TO CUSTOMER',
      afterServiceRemarks: 'Donor drive head assembly received from Delhi lab.',
    }
  ]),

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
  setTickets: (tickets: RepairTicket[]) => set({ tickets }),
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
      return { tickets: updatedTickets };
    }),
  deleteTicket: (id: string) =>
    set((state: ErpState) => {
      const updatedTickets = state.tickets.filter((t: RepairTicket) => t.id !== id && t.ticket_number !== id);
      saveToStorage('accno_erp_tickets', updatedTickets);
      return { tickets: updatedTickets };
    }),
  updateTicketStatus: (id: string, status: RepairTicket['status']) =>
    set((state: ErpState) => {
      const updatedTickets = state.tickets.map((t: RepairTicket) =>
        t.id === id || t.ticket_number === id ? { ...t, status } : t
      );
      saveToStorage('accno_erp_tickets', updatedTickets);
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

      return {
        repairInvoices: updatedInvoices,
        tickets: updatedTickets,
      };
    }),

  updateRepairInvoice: (id: string, updatedData: Partial<RepairInvoice>) =>
    set((state: ErpState) => {
      const updatedInvoices = state.repairInvoices.map((inv: RepairInvoice) => (inv.id === id ? { ...inv, ...updatedData } : inv));
      saveToStorage('accno_erp_repair_invoices', updatedInvoices);
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
  outsourceVouchers: loadFromStorage<OutsourceVoucher[]>('accno_erp_outsource_vouchers', [
    {
      id: 'out-1001',
      voucherNumber: 'OUT-1001',
      voucherDate: '2025-05-11',
      linkedTicketNumber: 'TKT-1002',
      vendorJobId: 'LAB-DEL-8890',
      vendorId: 'v-1002',
      vendorName: 'Cleanroom Data Recovery Labs',
      vendorPhone: '+91 94192-33445',
      vendorCity: 'Delhi NCR',
      vendorAddress: 'Plot 12, Nehru Place, Delhi NCR',
      vendorGstin: '07BBBBB8888C1Z2',
      serviceType: 'Data Recovery Lab',

      outgoingCourier: 'Bluedart Express',
      outgoingDocket: 'BLU-990088112',
      outgoingDispatchDate: '2025-05-11',
      outgoingFreightCost: 200,

      incomingCourier: 'DTDC Courier',
      incomingDocket: 'DTD-77665544',
      incomingDispatchDate: '2025-05-15',
      incomingFreightCost: 150,
      expectedReturnDate: '2025-05-15',
      receivedDate: '2025-05-15',

      vendorCostPrice: 3200,
      freightCharges: 350,
      customerSellingPrice: 6500,
      profitMargin: 2950,

      dispatchStatus: 'COMPLETED',
      technicalInstructions: 'Swap HDD mechanical head platter assembly under Class-100 laminar cleanroom bench.',
      testingNotes: 'Head swap successful. Sector-by-sector clone created on 2TB target drive.',
    },
  ]),

  dataRecoveryCases: loadFromStorage<DataRecoveryCase[]>('accno_erp_data_recovery_cases', [
    {
      id: 'drc-1001',
      recoveryIdNumber: 'REC-1001',
      caseNumber: 'REC-1001',
      entryDate: '2025-05-10',
      customerName: 'Tech Logics Pvt Ltd',
      customerPhone: '+91 98765-43210',
      customerEmail: 'techlogics@gmail.com',
      customerGst: '07AAAAA0000A1Z5',
      customerAddress: 'Plot 42, Sector 3, Industrial Area',
      deviceBrand: 'Seagate',
      deviceType: 'Mechanical HDD (3.5"/2.5")',
      driveModel: 'Seagate Barracuda 2TB (ST2000DM008)',
      driveSerial: 'Z5K189LM',
      capacity: '2TB',
      fileSystem: 'NTFS',
      damageType: 'Head Crash / Physical Noise',
      priority: 'HIGH',
      symptoms: 'CLICKING HEAD NOISE',
      status: 'Completed / Delivered',
      technician: 'Rahul Gupta',
      storageLocation: 'Safe Vault Locker 01',
      estimateCost: 16000,
      advance: 1500,
      customerCharge: 14500,
      freight: 300,
      discount: 1000,
      gstRate: 18,
      totalInvoice: 17700,
      deposit: 1500,
      balanceDue: 0,
      diagnosticFee: 1500,
      recoveryFee: 14500,
      paidAmount: 17700,
      paymentStatus: 'PAID IN FULL',
      termsConsentAccepted: true,
      requestedWork: 'D:\\Photos & Tally ERP Data Backup',
      additionalInfo: 'Drive in USB 3.0 enclosure',
      confidentialNotes: 'Donor head slider swapped under Class-100 cleanroom bench.',
      recoveryPhaseStatus: 'Phase 4: Extraction & Verification',
      progressPercentage: 100,
      estimatedDataGb: 1450,
      recoveredDataGb: 1420,
      healthPercentage: 97.9,
      rackLocation: 'Safe Vault Locker 01',
      donorDriveSerial: 'Z5K998AB',
      notes: 'Donor head slider swapped under Class-100 cleanroom bench.',
      targetDriveDetails: 'Restored to Customer 2TB WD Passport (SN: WX12A45)',
      created_at: '2025-05-10 10:30 AM',
    },
    {
      id: 'drc-1002',
      recoveryIdNumber: 'REC-1002',
      caseNumber: 'REC-1002',
      entryDate: '2025-05-12',
      customerName: 'Dr. Anita Roy',
      customerPhone: '+91 94321-12233',
      customerEmail: 'anita.roy@royhospital.org',
      customerAddress: 'Roy Memorial Hospital, Sanchore',
      deviceBrand: 'Samsung',
      deviceType: 'NVMe / M.2 PCIe SSD',
      driveModel: 'Samsung 980 PRO 1TB NVMe SSD',
      driveSerial: 'S5GXNX0R982134K',
      capacity: '1TB',
      fileSystem: 'APFS',
      damageType: 'Firmware Lock / Service Area',
      priority: 'NORMAL',
      symptoms: 'NOT DETECTED / BUSY STATE',
      status: 'Imaging in Cleanroom',
      technician: 'Deepak Kumar',
      storageLocation: 'Cleanroom Bench 03',
      estimateCost: 19500,
      advance: 5000,
      customerCharge: 18000,
      freight: 200,
      discount: 1500,
      gstRate: 18,
      totalInvoice: 19706,
      deposit: 5000,
      balanceDue: 14706,
      diagnosticFee: 1500,
      recoveryFee: 18000,
      paidAmount: 5000,
      paymentStatus: 'PARTIALLY PAID',
      termsConsentAccepted: true,
      requestedWork: 'Patient Records & X-Ray Dicom Files',
      additionalInfo: 'M.2 PCIe board with heatsink',
      confidentialNotes: 'NAND controller entered safe mode. Shorted BOOT ROM pads & rebuilt translator table.',
      recoveryPhaseStatus: 'Phase 3: Bit-Stream Mirroring',
      progressPercentage: 65,
      estimatedDataGb: 680,
      recoveredDataGb: 650,
      healthPercentage: 95.5,
      rackLocation: 'Cleanroom Bench 03',
      notes: 'NAND controller entered safe mode. Shorted BOOT ROM pads & rebuilt translator table.',
      targetDriveDetails: 'Targeting 1TB SanDisk Extreme Portable SSD',
      created_at: '2025-05-12 11:15 AM',
    },
  ]),

  amcContracts: loadFromStorage<AmcContract[]>('accno_erp_amc_contracts', [
    {
      id: 'amc-1001',
      contractNumber: 'AMC-1001',
      manualEntryDate: '2025-04-01',
      customerId: 'CUST-1001',
      customerName: 'Tech Logics Pvt Ltd',
      companyName: 'Tech Logics Private Limited',
      customerPhone: '+91 98765-43210',
      alternatePhone: '+91 98765-99887',
      customerEmail: 'techlogics@gmail.com',
      customerGst: '07AAAAA0000A1Z5',
      customerAddress: 'Plot 42, Sector 3, Industrial Area, Sanchore',
      planOption: 'Gold Plan',
      contractCost: 45000,
      amcAmount: 45000,
      gstRate: 18,
      totalAmount: 53100,
      advancePaid: 25000,
      balanceDue: 28100,
      paymentStatus: 'Partially Paid',
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      renewalDate: '2026-03-31',
      contractStatus: 'Active',
      coverageScopeDetails: 'Full Server & Desktop Hardware, OS Maintenance, Quarterly PM Visit, and 4-Hour Emergency Response.',
      source: 'Direct',
      serviceType: 'Hardware + Software On-site Support',
      numberOfDevices: 5,
      totalServiceVisits: 4,
      assignedTechnician: 'Rahul Gupta',
      priority: 'High',
      deviceType: 'Server',
      issueFound: 'Server RAID array fan noise & high thermal load.',
      notes: 'Covers all hardware repairs, quarterly PM visits, and 4-hr SLA.',
      serviceIncludedChecklist: [
        'Dusting & Cleaning',
        'OS & Antivirus Update',
        'RAID Health Check',
        'Thermal Paste Refresh',
        'UPS & Power Check'
      ],
      coveredAssets: [
        { id: 'ast-1', assetName: 'Main ERP Server', category: 'Server', brand: 'Dell', model: 'PowerEdge T340', serialNumber: 'DLT340-9981', location: 'Server Room' },
        { id: 'ast-2', assetName: 'Accounts Desktop', category: 'Desktop PC', brand: 'HP', model: 'ProDesk 400 G7', serialNumber: 'HPP400-1120', location: 'Accounts Dept' }
      ],
      pmVisits: [
        { id: 'pm-1', visitNumber: 1, visitDate: '2025-06-15', completedDate: '2025-06-14', status: 'Completed', technician: 'Rahul Gupta', visitPurpose: 'Quarterly Hardware Cleaning & Thermal Paste', serviceActionsPerformed: 'Dust cleaned, thermal paste refreshed on CPU.' },
        { id: 'pm-2', visitNumber: 2, visitDate: '2025-09-15', completedDate: '2025-09-15', status: 'Completed', technician: 'Deepak Kumar', visitPurpose: 'RAID Array Health & OS Patch Update', serviceActionsPerformed: 'RAID 5 verified, OS security patches installed.' },
        { id: 'pm-3', visitNumber: 3, visitDate: '2025-12-15', status: 'Scheduled', technician: 'Rahul Gupta', visitPurpose: 'Q3 Preventive Maintenance Visit' },
        { id: 'pm-4', visitNumber: 4, visitDate: '2026-03-15', status: 'Scheduled', technician: 'Rahul Gupta', visitPurpose: 'Q4 Final Contract Audit & PM Visit' },
      ],
      complaints: [
        { id: 'cmp-1', complaintNumber: 'CMP-1001', logDate: '2025-07-10', description: 'Server overheating warning alarm in server room.', status: 'Resolved', technician: 'Rahul Gupta', internalNotes: 'Replaced faulty chassis fan unit.', resolvedDate: '2025-07-11' }
      ],
      retailProducts: [
        { id: 'rp-1', productId: 'inv-1', name: 'Kingston NV2 1TB NVMe PCIe 4.0 SSD', sku: 'KNG-NV2-1TB', unitPrice: 5200, quantity: 1, gstRate: 18, totalPrice: 6136 }
      ],
      invoiceGenerated: true,
      invoiceNumber: 'AMC-1001',
      invoiceDate: '2025-04-01',
      planType: 'Comprehensive (Parts + Labor)',
      slaTier: '4-Hour Emergency Response',
      paymentFrequency: 'Quarterly Installments',
      status: 'ACTIVE',
      created_at: '2025-04-01 10:00 AM'
    }
  ]),

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

  accountingVouchers: loadFromStorage<AccountingVoucher[]>('accno_erp_accounting_vouchers', [
    {
      id: 'vch-1001',
      voucherNumber: 'RCT-1001',
      voucherType: 'RECEIPT',
      voucherDate: '2025-05-15',
      partyName: 'Tech Logics Pvt Ltd',
      partyPhone: '+91 98765-43210',
      partyGst: '07AAAAA0000A1Z5',
      refInvoiceNumber: 'TKT-1001',
      paymentMode: 'UPI / GPay',
      instrumentRefNo: 'UPI9823145100',
      debitLedger: 'HDFC Bank A/c 9812',
      creditLedger: 'Tech Logics Pvt Ltd (Debtor)',
      amount: 17700,
      gstAmount: 2700,
      totalAmount: 17700,
      narration: 'Payment received against Repair Invoice RBN-1001 (Ticket TKT-1001).',
      created_at: '2025-05-15 11:30 AM'
    },
    {
      id: 'vch-1002',
      voucherNumber: 'PAY-1002',
      voucherType: 'PAYMENT',
      voucherDate: '2025-05-16',
      partyName: 'Vaidik InfoTech Labs',
      partyPhone: '+91 98220-11223',
      refInvoiceNumber: 'OUT-1001',
      paymentMode: 'HDFC Bank NEFT/RTGS',
      instrumentRefNo: 'NFT88210931',
      debitLedger: 'Outsource Repair Expense',
      creditLedger: 'HDFC Bank A/c 9812',
      amount: 3500,
      gstAmount: 533.9,
      totalAmount: 3500,
      narration: 'Vendor payment for BGA Reballing Outsource Job OUT-1001.',
      created_at: '2025-05-16 02:15 PM'
    },
    {
      id: 'vch-1003',
      voucherNumber: 'DBN-1001',
      voucherType: 'DEBIT_NOTE',
      voucherDate: '2025-05-18',
      partyName: 'Vaidik InfoTech Labs',
      partyPhone: '+91 98220-11223',
      refInvoiceNumber: 'OUT-1001',
      debitLedger: 'Vaidik InfoTech Labs (Creditor)',
      creditLedger: 'Outsource Repair Return',
      amount: 500,
      gstAmount: 76.2,
      totalAmount: 500,
      narration: 'Debit Note issued for overcharge on BGA Reballing freight.',
      created_at: '2025-05-18 04:00 PM'
    },
    {
      id: 'vch-1004',
      voucherNumber: 'CRN-1001',
      voucherType: 'CREDIT_NOTE',
      voucherDate: '2025-05-20',
      partyName: 'Dr. Anita Roy',
      partyPhone: '+91 94321-12233',
      refInvoiceNumber: 'REC-1002',
      debitLedger: 'Data Recovery Service Discount',
      creditLedger: 'Dr. Anita Roy (Debtor)',
      amount: 1000,
      gstAmount: 152.5,
      totalAmount: 1000,
      narration: 'Credit Note issued for goodwill discount on SSD Recovery.',
      created_at: '2025-05-20 10:45 AM'
    },
    {
      id: 'vch-1005',
      voucherNumber: 'CNT-1001',
      voucherType: 'CONTRA',
      voucherDate: '2025-05-22',
      paymentMode: 'Cash',
      debitLedger: 'HDFC Bank A/c 9812',
      creditLedger: 'Cash-in-Hand',
      amount: 15000,
      totalAmount: 15000,
      narration: 'Cash deposited into HDFC Bank Account.',
      created_at: '2025-05-22 05:00 PM'
    },
    {
      id: 'vch-1006',
      voucherNumber: 'JRN-1001',
      voucherType: 'JOURNAL',
      voucherDate: '2025-05-25',
      amount: 4500,
      totalAmount: 4500,
      journalLines: [
        { id: 'j1', accountLedger: 'Depreciation Expense', type: 'DEBIT', amount: 4500, narration: 'Monthly lab equipment depreciation' },
        { id: 'j2', accountLedger: 'Accumulated Depreciation - Cleanroom Equipment', type: 'CREDIT', amount: 4500, narration: 'Accumulated depreciation credit' }
      ],
      narration: 'Month-end depreciation journal entry for Cleanroom Workstation.',
      created_at: '2025-05-25 06:30 PM'
    }
  ]),

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
  customers: loadFromStorage<CustomerItem[]>('accno_erp_customers', [
    {
      id: 'c-1001',
      code: 'CUST-1001',
      name: 'Rajesh Kumar',
      companyName: 'Tech Logics Pvt Ltd',
      category: 'Sundry Debtor',
      accountGroup: 'Corporate / B2B',
      mobile: '+91 98765-43210',
      alternateContact: '+91 94191-88776',
      email: 'rajesh@techlogics.in',
      website: 'www.techlogics.in',
      dob: '1985-08-15',
      weddingAnniversary: '2012-11-20',
      panNumber: 'ABCDE1234F',
      gstin: '01AAAAA0000A1Z5',
      state: '01 - Jammu & Kashmir',
      billingAddress: 'Plot 42, Sector 3, Industrial Area',
      shippingAddress: 'Site Office: Subhash Nagar Branch',
      city: 'Jammu',
      pinCode: '180012',
      accountStatus: 'Active',
      referredBy: 'Dr. Anita Roy',
      creditLimit: 150000,
      outstandingBalance: 18500,
      internalNotes: 'VIP B2B Client. Prompt payment history. 15-day credit terms.',

      bankAccountName: 'Tech Logics Pvt Ltd',
      bankAccountType: 'Current Account',
      bankAccountNumber: '50100239485712',
      bankIfscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      bankBranch: 'Gandhi Nagar Branch, Jammu',
      upiId: 'techlogics@okhdfcbank',

      loyaltyPoints: 385,
      kycVerified: true,
      tier: 'Platinum VIP',
      totalRepairs: 5,
    },
    {
      id: 'c-1002',
      code: 'CUST-1002',
      name: 'Dr. Anita Roy',
      companyName: 'Roy Hospital & Research Center',
      category: 'Sundry Debtor',
      accountGroup: 'Healthcare / Institutional',
      mobile: '+91 94191-12233',
      alternateContact: '+91 94191-12234',
      email: 'anita@royhospital.org',
      website: 'www.royhospital.org',
      dob: '1978-04-12',
      weddingAnniversary: '2005-02-14',
      panNumber: 'FGHIJ5678K',
      gstin: '01BBBBB1111B2Z6',
      state: '01 - Jammu & Kashmir',
      billingAddress: 'Channi Himmat Main Road',
      shippingAddress: 'Emergency Ward IT Desk',
      city: 'Jammu',
      pinCode: '180015',
      accountStatus: 'Active',
      referredBy: 'Walk-in Direct',
      creditLimit: 200000,
      outstandingBalance: 0,
      internalNotes: 'Cleanroom data recovery priority account.',

      bankAccountName: 'Roy Hospital Trust',
      bankAccountType: 'Current Account',
      bankAccountNumber: '00120101998823',
      bankIfscCode: 'JAKA0CHANNI',
      bankName: 'J&K Bank',
      bankBranch: 'Channi Himmat, Jammu',
      upiId: 'royhospital@jkbank',

      loyaltyPoints: 670,
      kycVerified: true,
      tier: 'Platinum VIP',
      totalRepairs: 3,
    },
  ]),
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

  // Employees State & Actions Implementation
  employees: loadFromStorage<EmployeeItem[]>('accno_erp_employees', [
    {
      id: 'emp-1001',
      empCode: 'EMP-1001',
      name: 'Deepak Kumar',
      phone: '+91 9468781166',
      alternatePhone: '+91 9587781166',
      email: 'admin@accnosolution.com',
      designation: 'Admin',
      department: 'Admin',
      joiningDate: '2020-06-15',
      baseSalary: 45000,
      activeStatus: 'Active',
      address: 'Sanchore',
      emergencyContactName: 'Deepak Kumar',
      emergencyContactPhone: '+91 9587781166',
      govtIdType: 'Aadhaar Card',
      govtIdNumber: '4829-1092-8831',
      idAttachment: '',
      bankAccountName: 'Deepak Kumar',
      bankAccountNumber: '29150100022394',
      bankName: 'Bank of Baroda',
      bankBranch: 'Main Branch',
      bankBranchCode: 'BARB0JAMMU',
      bankIfscCode: 'BARB0JAMMU',
      role: 'Admin',
      password: 'Admin@123',
      permissions: adminEmployeePermissions,
      created_at: new Date().toISOString(),
    },
    {
      id: 'emp-1002',
      empCode: 'EMP-1002',
      name: 'Priya Sharma',
      phone: '+91 98765-11003',
      alternatePhone: '+91 94191-22003',
      email: 'priya.sharma@accnosolution.com',
      designation: 'Store Manager & Billing Lead',
      department: 'Billing & POS',
      joiningDate: '2023-01-10',
      baseSalary: 32000,
      activeStatus: 'Active',
      address: 'Lane 4, Channi Himmat, Jammu',
      emergencyContactName: 'Rajesh Sharma (Father)',
      emergencyContactPhone: '+91 98765-11004',
      govtIdType: 'PAN Card',
      govtIdNumber: 'BPRPS9182K',
      idAttachment: 'https://accnosolution.com/docs/emp1002_pan.pdf',
      bankAccountName: 'Priya Sharma',
      bankAccountNumber: '001201589342',
      bankName: 'ICICI Bank',
      bankBranch: 'Channi Branch',
      bankBranchCode: 'ICIC0000120',
      bankIfscCode: 'ICIC0000120',
      role: 'Billing Specialist',
      password: 'Priya@Accno2026#',
      created_at: new Date().toISOString(),
    },
    {
      id: 'emp-1003',
      empCode: 'EMP-1003',
      name: 'Rahul Gupta',
      phone: '+91 98765-11005',
      alternatePhone: '+91 94191-22005',
      email: 'rahul.gupta@accnosolution.com',
      designation: 'Hardware Diagnostic Specialist',
      department: 'Technical Lab',
      joiningDate: '2023-06-01',
      baseSalary: 38000,
      activeStatus: 'Active',
      address: 'Trikuta Nagar, Jammu',
      emergencyContactName: 'Karan Gupta (Brother)',
      emergencyContactPhone: '+91 98765-11006',
      govtIdType: 'Driving License',
      govtIdNumber: 'JK02202100984',
      idAttachment: '',
      bankAccountName: 'Rahul Gupta',
      bankAccountNumber: '39482710492',
      bankName: 'State Bank of India',
      bankBranch: 'Trikuta Nagar',
      bankBranchCode: 'SBIN0002194',
      bankIfscCode: 'SBIN0002194',
      role: 'Technician',
      password: 'Rahul@Accno2026#',
      created_at: new Date().toISOString(),
    },
    {
      id: 'emp-1004',
      empCode: 'EMP-1004',
      name: 'Sonia Mahajan',
      phone: '+91 98765-11007',
      alternatePhone: '+91 94191-22007',
      email: 'sonia.m@accnosolution.com',
      designation: 'Customer Support Executive',
      department: 'Customer Support',
      joiningDate: '2023-09-15',
      baseSalary: 35000,
      activeStatus: 'On Leave',
      address: 'Sainik Colony, Jammu',
      emergencyContactName: 'Vikram Mahajan (Husband)',
      emergencyContactPhone: '+91 98765-11008',
      govtIdType: 'Aadhaar Card',
      govtIdNumber: '9912-3847-1092',
      idAttachment: '',
      bankAccountName: 'Sonia Mahajan',
      bankAccountNumber: '918273645019',
      bankName: 'Axis Bank',
      bankBranch: 'Sainik Colony',
      bankBranchCode: 'UTIB0001092',
      bankIfscCode: 'UTIB0001092',
      role: 'Desk Manager',
      password: 'Sonia@Accno2026#',
      created_at: new Date().toISOString(),
    },
  ]),
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
      return { employees: updated };
    }),
  updateEmployee: (id: string, empData: Partial<EmployeeItem>) =>
    set((state: ErpState) => {
      const updated = state.employees.map((e: EmployeeItem) => (e.id === id ? { ...e, ...empData } : e));
      saveToStorage('accno_erp_employees', updated);
      return { employees: updated };
    }),
  deleteEmployee: (id: string) =>
    set((state: ErpState) => {
      const updated = state.employees.filter((e: EmployeeItem) => e.id !== id);
      saveToStorage('accno_erp_employees', updated);
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
  inventory: loadFromStorage('accno_erp_inventory', [
    {
      id: 'i-1001',
      itemType: 'Retail Part',
      code: 'PRT-1001',
      name: 'Intel Core i7-14700K 20-Core Desktop Processor',
      category: 'Processor (CPU)',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 38500,
      mrp: 46000,
      costPrice: 33200,
      currentStock: 15,
      lowStockAlert: 3,
      activeStatus: 'Active',
      hsnCode: '84713010',
      gstRate: 18,
      barcode: '5032037278776',
      productGroup: 'Intel 14th Gen Desktop CPUs',
      description: 'LGA1700 Socket, 20 Cores (8P + 12E), up to 5.6 GHz, 125W TDP.',
      compatibleModels: 'LGA1700 Motherboards (Z790, B760)',
      comfortabilityFeatures: 'Socket LGA1700, 125W TDP, DDR4/DDR5 Support',
      supplierVendor: 'Ingram Micro India',
      storageLocation: 'Shelf A-1, Bin 01',
      openingBalance: 15,
    },
    {
      id: 'i-1002',
      itemType: 'Retail Part',
      code: 'PRT-1002',
      name: 'AMD Ryzen 7 7800X3D 8-Core 3D V-Cache Gaming CPU',
      category: 'Processor (CPU)',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 36900,
      mrp: 44000,
      costPrice: 31800,
      currentStock: 10,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84713010',
      gstRate: 18,
      barcode: '730143314930',
      productGroup: 'AMD Ryzen 7000 Series',
      description: 'Socket AM5, 8 Cores / 16 Threads, 104MB Cache, 120W TDP.',
      compatibleModels: 'Socket AM5 Motherboards (X670, B650)',
      comfortabilityFeatures: 'Socket AM5, 120W TDP, DDR5 Only',
      supplierVendor: 'Supertron Electronics Pvt Ltd',
      storageLocation: 'Shelf A-1, Bin 02',
      openingBalance: 10,
    },
    {
      id: 'i-1003',
      itemType: 'Retail Part',
      code: 'PRT-1003',
      name: 'ASUS ROG Strix Z790-F Gaming WiFi ATX Motherboard',
      category: 'Motherboard',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 34500,
      mrp: 41000,
      costPrice: 29800,
      currentStock: 8,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '4711081944514',
      productGroup: 'Intel Z790 Gaming Series',
      description: 'Intel LGA1700 Socket, DDR5, PCIe 5.0, WiFi 6E, 4x M.2 Slots.',
      compatibleModels: 'Intel 12th/13th/14th Gen Core Processors',
      comfortabilityFeatures: 'LGA1700 Socket, DDR5, ATX Form Factor',
      supplierVendor: 'Savex Technologies',
      storageLocation: 'Shelf A-2, Bin 01',
      openingBalance: 8,
    },
    {
      id: 'i-1004',
      itemType: 'Retail Part',
      code: 'PRT-1004',
      name: 'MSI MAG B650 Tomahawk WiFi Gaming ATX Motherboard',
      category: 'Motherboard',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 21500,
      mrp: 26000,
      costPrice: 18200,
      currentStock: 12,
      lowStockAlert: 3,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '4719072978013',
      productGroup: 'AMD AM5 Motherboards',
      description: 'AMD Socket AM5, DDR5 6600+MHz (OC), PCIe 4.0 M.2, WiFi 6E.',
      compatibleModels: 'AMD Ryzen 7000 / 8000 Series Processors',
      comfortabilityFeatures: 'AM5 Socket, DDR5, ATX Form Factor',
      supplierVendor: 'Supertron Electronics Pvt Ltd',
      storageLocation: 'Shelf A-2, Bin 02',
      openingBalance: 12,
    },
    {
      id: 'i-1005',
      itemType: 'Retail Part',
      code: 'PRT-1005',
      name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30 RAM',
      category: 'Memory (RAM)',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 11800,
      mrp: 14500,
      costPrice: 9800,
      currentStock: 20,
      lowStockAlert: 4,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '840006698129',
      productGroup: 'High Speed DDR5 RAM',
      description: 'Dual Channel Desktop Memory Kit with Intel XMP 3.0 & AMD EXPO.',
      compatibleModels: 'DDR5 Motherboards (Intel Z790 / AMD B650)',
      comfortabilityFeatures: 'DDR5, 6000MHz CL30, RGB Dynamic Lighting',
      supplierVendor: 'Ingram Micro India',
      storageLocation: 'Shelf B-1, Bin 05',
      openingBalance: 20,
    },
    {
      id: 'i-1006',
      itemType: 'Retail Part',
      code: 'PRT-1006',
      name: 'Samsung 980 PRO 1TB NVMe PCIe 4.0 M.2 SSD',
      category: 'Storage Devices',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 8500,
      mrp: 11000,
      costPrice: 6800,
      currentStock: 24,
      lowStockAlert: 5,
      activeStatus: 'Active',
      hsnCode: '85235100',
      gstRate: 18,
      barcode: '8806090563811',
      productGroup: 'High Speed NVMe Storage',
      description: 'Internal PCIe Gen4 x4 M.2 NVMe SSD (Read 7000 MB/s).',
      compatibleModels: 'Desktop PCs, Laptops, PS5 Storage Expansion',
      comfortabilityFeatures: 'PCIe 4.0 NVMe M.2 2280, 7000MB/s Read',
      supplierVendor: 'Supertron Electronics Pvt Ltd',
      storageLocation: 'Shelf A-4, Bin 12',
      openingBalance: 30,
    },
    {
      id: 'i-1007',
      itemType: 'Retail Part',
      code: 'PRT-1007',
      name: 'ZOTAC Gaming GeForce RTX 4070 Ti Super Trinity 16GB GDDR6X',
      category: 'Graphics Card (GPU)',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 78500,
      mrp: 92000,
      costPrice: 68900,
      currentStock: 6,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '4895173628005',
      productGroup: 'NVIDIA RTX 40-Series GPUs',
      description: 'DLSS 3, Ray Tracing, 16GB 256-bit GDDR6X, IceStorm 2.0 Cooling.',
      compatibleModels: 'PCIe 4.0 x16 Desktop Systems (Min 750W PSU)',
      comfortabilityFeatures: 'PCIe 4.0 x16, 750W Min PSU, 285W TDP',
      supplierVendor: 'Savex Technologies',
      storageLocation: 'Rack B-1, Lock 3',
      openingBalance: 6,
    },
    {
      id: 'i-1008',
      itemType: 'Retail Part',
      code: 'PRT-1008',
      name: 'Corsair RM850x 850W 80+ Gold Fully Modular Power Supply',
      category: 'Power Supply Unit (PSU)',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 12500,
      mrp: 15500,
      costPrice: 10200,
      currentStock: 14,
      lowStockAlert: 3,
      activeStatus: 'Active',
      hsnCode: '85044090',
      gstRate: 18,
      barcode: '840006631188',
      productGroup: 'Corsair RM Series Modular PSUs',
      description: '80 PLUS Gold Certified, Zero RPM Fan Mode, 100% Japanese Capacitors.',
      compatibleModels: 'ATX Mid/Full Tower Cabinets',
      comfortabilityFeatures: '850W Output, 80+ Gold, Fully Modular',
      supplierVendor: 'Ingram Micro India',
      storageLocation: 'Shelf C-2, Bin 01',
      openingBalance: 14,
    },
    {
      id: 'i-1009',
      itemType: 'Retail Part',
      code: 'PRT-1009',
      name: 'Lian Li O11 Dynamic EVO Dual Chamber ATX Mid Tower Cabinet',
      category: 'PC Cabinet / Chassis',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 14900,
      mrp: 18000,
      costPrice: 12100,
      currentStock: 7,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '840353041902',
      productGroup: 'Lian Li O11 Series Cases',
      description: 'Reversible Dual-Chamber Chassis, Tempered Glass, Mesh Airflow.',
      compatibleModels: 'ATX, Micro-ATX, E-ATX Motherboards',
      comfortabilityFeatures: 'Dual Chamber, Tempered Glass, Up to 10 Fans',
      supplierVendor: 'Supertron Electronics Pvt Ltd',
      storageLocation: 'Main Store Room',
      openingBalance: 7,
    },
    {
      id: 'i-1010',
      itemType: 'Retail Part',
      code: 'PRT-1010',
      name: 'NZXT Kraken 360 RGB LCD Liquid AIO CPU Cooler (360mm)',
      category: 'Cooling System',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 18900,
      mrp: 23000,
      costPrice: 15400,
      currentStock: 5,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '815671017406',
      productGroup: 'Liquid AIO CPU Coolers',
      description: '1.54" Square LCD Display, High-performance Pump, F120 RGB Core Fans.',
      compatibleModels: 'Intel LGA1700 / AMD AM5 Sockets',
      comfortabilityFeatures: '360mm Radiator, Customizable LCD Screen, RGB Fans',
      supplierVendor: 'Ingram Micro India',
      storageLocation: 'Shelf C-1, Bin 04',
      openingBalance: 5,
    },
    {
      id: 'i-1011',
      itemType: 'Service Part',
      code: 'SRV-1001',
      name: 'MacBook Pro 16" A2141 Retina Display Panel Assembly',
      category: 'Screen & Display Rework',
      uom: 'pcs',
      defaultQuantity: 1,
      sellingPrice: 32000,
      mrp: 42000,
      costPrice: 24500,
      currentStock: 4,
      lowStockAlert: 2,
      activeStatus: 'Active',
      hsnCode: '84733020',
      gstRate: 18,
      barcode: '190199348911',
      productGroup: 'Apple OEM Spare Display Assemblies',
      description: 'Original Space Gray TrueTone LCD Assembly for A2141 MacBook Pro 2019.',
    },
  ]),
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
  salesInvoices: loadFromStorage('accno_erp_sales_invoices', [
    {
      id: 'sal-1001',
      invoiceNo: 'SAL-1001',
      invoiceDate: '2026-08-10T10:30:00.000Z',
      customerId: 'c-1001',
      customerName: 'Rajesh Kumar (Tech Logics)',
      customerPhone: '+91 98765-43210',
      customerGst: '08AAAAA0000A1Z5',
      customerAddress: 'Plot 42, Sector 3, Industrial Area, Sanchore',
      paymentTerms: 'Credit 15 Days',
      paymentMethod: 'Bank Transfer',
      items: [
        { id: 'sli-1', itemId: 'i-1001', name: 'Intel Core i7-14700K 20-Core Desktop Processor', hsnCode: '84713010', gstRate: 18, quantity: 2, unitPrice: 38500, totalPrice: 77000 },
        { id: 'sli-2', itemId: 'i-1003', name: 'ASUS ROG Strix Z790-F Gaming WiFi ATX Motherboard', hsnCode: '84733020', gstRate: 18, quantity: 1, unitPrice: 34500, totalPrice: 34500 },
      ],
      subtotal: 94491.53,
      discount: 0,
      discountType: 'fixed',
      taxAmount: 17008.47,
      shippingCharges: 0,
      grandTotal: 111500,
      paidAmount: 111500,
      balanceDue: 0,
      paymentStatus: 'Paid',
      remarks: 'Standard Commercial Sales Supply',
      created_at: '2026-08-10T10:30:00.000Z',
    },
    {
      id: 'sal-1002',
      invoiceNo: 'SAL-1002',
      invoiceDate: '2026-08-12T14:15:00.000Z',
      customerId: 'c-1002',
      customerName: 'Supertron Infotech',
      customerPhone: '+91 98290-11223',
      customerGst: '08BAPPM9910B1Z2',
      customerAddress: 'Station Road, Sanchore',
      paymentTerms: 'Credit 30 Days',
      paymentMethod: 'UPI',
      items: [
        { id: 'sli-3', itemId: 'i-1006', name: 'Samsung 980 PRO 1TB NVMe PCIe 4.0 M.2 SSD', hsnCode: '84733020', gstRate: 18, quantity: 5, unitPrice: 8500, totalPrice: 42500 },
        { id: 'sli-4', itemId: 'i-1005', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM', hsnCode: '84733020', gstRate: 18, quantity: 4, unitPrice: 11800, totalPrice: 47200 },
      ],
      subtotal: 76016.95,
      discount: 0,
      discountType: 'fixed',
      taxAmount: 13683.05,
      shippingCharges: 0,
      grandTotal: 89700,
      paidAmount: 50000,
      balanceDue: 39700,
      paymentStatus: 'Partial',
      remarks: 'Bulk Component Supply for Office Workstations',
      created_at: '2026-08-12T14:15:00.000Z',
    },
  ]),

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
  purchaseInvoices: loadFromStorage('accno_erp_purchase_invoices', [
    {
      id: 'pur-1001',
      billNo: 'PUR-2026-088',
      billDate: '2026-08-05T11:00:00.000Z',
      vendorId: 'v-1001',
      vendorName: 'Supertron Electronics Pvt Ltd',
      vendorPhone: '+91 98300-12345',
      vendorGst: '19AAAAA0000A1Z5',
      vendorAddress: 'Kolkata Head Office & Logistics Hub',
      paymentTerms: 'Credit 30 Days',
      paymentMethod: 'Bank Transfer',
      items: [
        { id: 'pli-1', itemId: 'i-1002', name: 'AMD Ryzen 7 7800X3D 8-Core 3D V-Cache Gaming CPU', hsnCode: '84713010', gstRate: 18, quantity: 10, unitPrice: 31000, totalPrice: 310000 },
        { id: 'pli-2', itemId: 'i-1004', name: 'MSI MAG B650 Tomahawk WiFi Gaming ATX Motherboard', hsnCode: '84733020', gstRate: 18, quantity: 10, unitPrice: 18200, totalPrice: 182000 },
      ],
      subtotal: 416949.15,
      taxAmount: 75050.85,
      freightCharges: 5000,
      grandTotal: 497000,
      paidAmount: 497000,
      balanceDue: 0,
      paymentStatus: 'Paid',
      remarks: 'Direct Factory Distribution Batch Procurement',
      created_at: '2026-08-05T11:00:00.000Z',
    },
  ]),

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
  salesReturns: loadFromStorage('accno_erp_sales_returns', [
    {
      id: 'slr-1001',
      returnNo: 'SLR-1001',
      returnDate: '2026-08-11T16:20:00.000Z',
      originalInvoiceNo: 'SAL-1001',
      customerId: 'c-1001',
      customerName: 'Rajesh Kumar (Tech Logics)',
      customerPhone: '+91 98765-43210',
      items: [
        { id: 'sri-1', itemId: 'i-1005', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM', hsnCode: '84733020', gstRate: 18, quantity: 1, unitPrice: 11800, totalPrice: 11800 },
      ],
      subtotal: 10000,
      taxAmount: 1800,
      grandTotal: 11800,
      returnReason: 'Defective RAM Module / Frequency Instability',
      restockToStock: false,
      refundStatus: 'Refunded',
      remarks: 'Replaced under instant over-the-counter warranty claim',
      created_at: '2026-08-11T16:20:00.000Z',
    },
  ]),

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
  purchaseReturns: loadFromStorage('accno_erp_purchase_returns', [
    {
      id: 'pcr-1001',
      returnNo: 'PCR-1001',
      returnDate: '2026-08-08T12:00:00.000Z',
      originalBillNo: 'PUR-2026-088',
      vendorId: 'v-1002',
      vendorName: 'Ingram Micro India',
      vendorPhone: '+91 98111-99887',
      items: [
        { id: 'pri-1', itemId: 'i-1006', name: 'Samsung 980 PRO 1TB NVMe PCIe 4.0 M.2 SSD', hsnCode: '84733020', gstRate: 18, quantity: 2, unitPrice: 8500, totalPrice: 17000 },
      ],
      subtotal: 14406.78,
      taxAmount: 2593.22,
      grandTotal: 17000,
      returnReason: 'Dead On Arrival (DOA) / NAND Controller Failure',
      rmaStatus: 'Completed',
      remarks: 'Returned to Vendor Distribution Hub for Credit Note Reversal',
      created_at: '2026-08-08T12:00:00.000Z',
    },
  ]),

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
  quotations: loadFromStorage('accno_erp_quotations', [
    {
      id: 'qtn-1001',
      quotationNo: 'QTN-1001',
      quotationDate: '2026-08-13T09:00:00.000Z',
      validUntil: '2026-08-20T23:59:59.000Z',
      customerId: 'c-1003',
      customerName: 'Sharma Computer Services',
      customerPhone: '+91 94140-55443',
      customerGst: '08AAAPS1234F1Z1',
      customerAddress: 'Main Market, Sanchore',
      items: [
        { id: 'qli-1', itemId: 'i-1001', name: 'Intel Core i7-14700K 20-Core Desktop Processor', hsnCode: '84713010', gstRate: 18, quantity: 2, unitPrice: 38500, totalPrice: 77000 },
        { id: 'qli-2', itemId: 'i-1003', name: 'ASUS ROG Strix Z790-F Gaming WiFi ATX Motherboard', hsnCode: '84733020', gstRate: 18, quantity: 2, unitPrice: 34500, totalPrice: 69000 },
        { id: 'qli-3', itemId: 'i-1005', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM', hsnCode: '84733020', gstRate: 18, quantity: 4, unitPrice: 11800, totalPrice: 47200 },
      ],
      subtotal: 163728.81,
      discount: 2000,
      taxAmount: 29471.19,
      grandTotal: 191200,
      status: 'Approved',
      termsAndConditions: 'Valid for 7 days. 100% advance payment prior to dispatch. 1 Year Warranty.',
      notes: 'Custom Corporate CAD & 3D Render Station Estimate',
      created_at: '2026-08-13T09:00:00.000Z',
    },
  ]),

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
  supportLeads: loadFromStorage<SupportLeadItem[]>('accno_erp_support_leads', [
    {
      id: 'lead-101',
      lead_name: 'Hotel Grand Sanchore',
      phone: '+91 94191-88990',
      email: 'info@hotelgrandsanchore.com',
      company: 'Grand Hospitality Group',
      subject: 'CCTV Security & AMC Inquiry',
      message: 'Need 32-camera IP CCTV installation with 1-Year AMC contract for hotel premises.',
      service_interested: 'CCTV 32-Camera IP Setup & AMC',
      status: 'Quotation Sent',
      source: 'Website Contact Form',
      created_at: '2026-08-15T10:00:00.000Z',
    },
    {
      id: 'lead-102',
      lead_name: 'Apex Diagnostic Center',
      phone: '+91 98765-11223',
      email: 'contact@apexlabs.in',
      company: 'Apex Healthcare Sanchore',
      subject: 'RAID Server Data Recovery',
      message: 'Server hard drive controller failed in RAID 10 array. Require emergency cleanroom recovery.',
      service_interested: 'RAID 10 Server Data Recovery Lab Case',
      status: 'Contacted',
      source: 'Website Contact Form',
      created_at: '2026-08-18T14:30:00.000Z',
    },
    {
      id: 'lead-103',
      lead_name: 'St. Xavier International School',
      phone: '+91 94192-55667',
      email: 'admin@stxavierssanchore.edu.in',
      company: 'St. Xavier Trust',
      subject: 'Computer Lab Annual Maintenance',
      message: 'Looking for annual hardware AMC software support for 60 desktop PCs.',
      service_interested: 'Computer Lab Maintenance AMC (60 PCs)',
      status: 'Closed Won',
      source: 'Walk-in',
      created_at: '2026-08-20T09:15:00.000Z',
    },
  ]),

  addSupportLead: (lead) =>
    set((state: ErpState) => {
      const newLead: SupportLeadItem = {
        ...lead,
        id: lead.id || `lead-${Date.now()}`,
        created_at: lead.created_at || new Date().toISOString(),
      };
      const updated = [newLead, ...state.supportLeads];
      saveToStorage('accno_erp_support_leads', updated);
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
  bookRepairLeads: loadFromStorage<BookRepairLeadItem[]>('accno_erp_book_repair_leads', [
    {
      id: 'br-101',
      bookingNo: 'BK-1001',
      name: 'Rajesh Kumar',
      phone: '+91 98765-43210',
      email: 'rajesh@techlogics.com',
      deviceType: 'Laptop',
      brand: 'Apple MacBook Pro M2',
      model: 'A2442 14-inch',
      serviceMode: 'In-Store Drop Off (Gandhi Nagar)',
      problemDescription: 'Liquid spill on keyboard, backlight flickering, battery charging error.',
      address: 'Plot 42, Sector 3, Sanchore',
      status: 'New Booking',
      created_at: '2026-08-21T11:00:00.000Z',
    },
    {
      id: 'br-102',
      bookingNo: 'BK-1002',
      name: 'Vikram Sharma',
      phone: '+91 94140-55443',
      email: 'vikram@cadstudio.in',
      deviceType: 'Desktop / Custom PC',
      brand: 'ASUS ROG Workstation',
      model: 'RTX 4090 Rendering Rig',
      serviceMode: 'Onsite Doorstep Pickup',
      problemDescription: 'System auto-rebooting under heavy 3D GPU load, blue screen memory error.',
      address: 'Main Market, Indira Chowk, Sanchore',
      status: 'Confirmed',
      created_at: '2026-08-21T12:30:00.000Z',
    },
  ]),

  addBookRepairLead: (lead) =>
    set((state: ErpState) => {
      const newLead: BookRepairLeadItem = {
        ...lead,
        id: lead.id || `br-${Date.now()}`,
        created_at: lead.created_at || new Date().toISOString(),
      };
      const updated = [newLead, ...state.bookRepairLeads];
      saveToStorage('accno_erp_book_repair_leads', updated);
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
  blogPosts: loadFromStorage<BlogPostItem[]>('accno_erp_blog_posts', [
    {
      id: 'blog-101',
      slug: 'prevent-macbook-liquid-damage',
      title: 'How to Prevent MacBook M1/M2 Motherboard Liquid Damage Short Circuits',
      category: 'Mac Repair Guide',
      author: 'Vikram Sharma (Lead Micro-Soldering Engineer)',
      date: 'May 10, 2025',
      readTime: '6 min read',
      excerpt: 'Learn critical emergency steps after tea or coffee spills on Apple Silicon MacBooks to prevent power rail oxidation and PMIC chip burnout.',
      content: `Spilling liquid on an Apple MacBook M1/M2/M3 is one of the most critical hardware emergencies. Modern USB-C and MagSafe 3 MacBooks carry high-voltage power lines (up to 28V) adjacent to delicate 1.8V CPU power rails on the logic board.

### Emergency Steps Immediately Following a Liquid Spill:
1. **Force Shutdown Immediately**: Hold the power / Touch ID button down for 8 seconds until the screen turns pitch black. Do not try to save files if liquid is actively penetrating the keyboard.
2. **Disconnect Charging Cable**: Unplug MagSafe 3 or USB-C charging cords immediately. Keeping power connected accelerates galvanic corrosion within seconds.
3. **The Tent Position**: Flip the MacBook upside down in an inverted 'V' tent shape on a dry towel. This prevents liquid from draining deeper into the battery cell connectors and display T-CON board.
4. **Do NOT Use Rice**: Rice dust and starch react with liquid to form sticky corrosive paste inside cooling fans and under BGA chips.
5. **Cleanroom Ultrasonic Bath**: Professional micro-soldering labs submerge the logic board in an ultrasonic bath filled with pure 99.9% Isopropyl Alcohol (IPA) to neutralize mineral salts before applying thermal heat.`,
      coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      imagePosition: 'header_hero',
      status: 'Published',
      featured: true,
      views: 1240,
      created_at: '2025-05-10T10:00:00.000Z',
    },
    {
      id: 'blog-102',
      slug: 'forensic-data-recovery-cleanroom-hdd',
      title: 'Forensic Data Recovery: How Cleanrooms Swap Mechanical HDD Heads',
      category: 'Data Recovery',
      author: 'Rahul Verma (Data Recovery Specialist)',
      date: 'April 28, 2025',
      readTime: '8 min read',
      excerpt: 'Inside ISO Class 100 cleanroom environments: swapping micro-actuator reader heads on clicking hard drives to recover lost databases.',
      content: `When a 3.5-inch or 2.5-inch hard drive emits repetitive clicking sounds (the dreaded "Click of Death"), it indicates physical head stack assembly (HSA) failure. Attempting to run software recovery tools on a physically damaged mechanical drive will scrape magnetic platter coatings permanently destroying data.

### Cleanroom Head Replacement Protocol:
- **ISO Class 100 Airflow**: Cleanroom laminar flow benches filter out 99.99% of airborne dust particles down to 0.5 microns. A single particle of dust trapped under a flying magnetic head will crash the drive at 7200 RPM.
- **Donor Drive Matching**: Matching donor head assemblies requires exact compatibility across Drive Family, Firmware Microcode, Controller Revision, and P-List / G-List head map configurations.
- **Micro-Precision Head Combs**: Specialized head separator combs prevent magnetic reader sliders from touching each other during transfer from donor to patient chassis.`,
      coverImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
      imagePosition: 'inline_middle',
      status: 'Published',
      featured: false,
      views: 890,
      created_at: '2025-04-28T14:30:00.000Z',
    },
    {
      id: 'blog-103',
      slug: 'enterprise-repair-shop-barcode-erp',
      title: 'Why Enterprise Repair Shops Need Real-Time Barcode ERP Systems',
      category: 'ERP & Software',
      author: 'ACCNO Software Team',
      date: 'April 14, 2025',
      readTime: '5 min read',
      excerpt: 'How automated job cards, barcode scanning, POS terminal checkout, and GST compliance double repair shop revenue and operational speed.',
      content: `Modern IT service centers and multi-branch repair outlets handle hundreds of computer repairs, spare part inventories, and customer inquiries daily. Relying on manual registers or paper billing leads to lost inventory, delayed deliveries, and untracked revenue.

### Core Pillars of Modern Repair ERP Software:
1. **Automated Barcode Tracking**: Every incoming repair ticket gets a thermal barcode label printed for instant rack location lookup.
2. **Integrated POS & GST Billing**: Seamlessly transition from diagnostic estimates to GST invoices with CGST/SGST breakdowns and UPI QR payments.
3. **Real-Time Customer WhatsApp Alerts**: Automatic WhatsApp notifications when repair status changes from 'In Repair' to 'Ready for Delivery'.`,
      coverImage: 'https://images.unsplash.com/photo-1556742049-0a67daf40954?auto=format&fit=crop&w=1200&q=80',
      imagePosition: 'sidebar_right',
      status: 'Published',
      featured: false,
      views: 650,
      created_at: '2025-04-14T09:15:00.000Z',
    },
  ]),

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
  milestones: loadFromStorage<MilestoneItem[]>('accno_erp_milestones', [
    {
      id: 'm-1',
      year: '2015',
      title: 'Established in Jammu & Sanchore',
      description: 'Started as a precision component-level repair workshop with 2 engineers specializing in desktop and laptop motherboard diagnostics.',
      status: 'Completed',
      order: 1,
      created_at: '2015-01-15T00:00:00.000Z',
    },
    {
      id: 'm-2',
      year: '2018',
      title: 'Apple Mac Micro-Soldering Desk',
      description: 'Expanded to logic board diagnostics for MacBook Pro, iMac & Mac Studio with BGA reballing stations and digital microscopes.',
      status: 'Completed',
      order: 2,
      created_at: '2018-04-10T00:00:00.000Z',
    },
    {
      id: 'm-3',
      year: '2021',
      title: 'Class-100 Cleanroom Data Lab',
      description: 'Invested in forensic data extraction tools for dead mechanical HDDs, SSDs, NAND chip-off & RAID array recovery.',
      status: 'Completed',
      order: 3,
      created_at: '2021-09-01T00:00:00.000Z',
    },
    {
      id: 'm-4',
      year: '2024',
      title: 'ACCNO ERP Software Suite',
      description: 'Launched enterprise repair shop management, POS counter checkout & barcode inventory ERP suite.',
      status: 'Completed',
      order: 4,
      created_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'm-5',
      year: '2025',
      title: '45,000+ Devices Repaired',
      description: 'Serving healthcare diagnostic centers, hospitality, schools, government offices, and corporate power users.',
      status: 'Completed',
      order: 5,
      created_at: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'm-6',
      year: '2026',
      title: 'Headquarters & Dual Tracker Portal Expansion',
      description: 'Expanded Sanchore headquarters with automated barcode tracking and real-time client status portal.',
      status: 'In Progress',
      order: 6,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]),

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
