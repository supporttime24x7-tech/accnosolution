import { supabase, isSupabaseConfigured } from './supabase';
import type {
  RepairTicket,
  RepairInvoice,
  BookRepairLeadItem,
  SupportLeadItem,
  CustomerItem,
  InventoryItem,
  OutsourceVoucher,
  DataRecoveryCase,
  AmcContract,
  SalesInvoiceItem,
  PurchaseInvoiceItem,
  SalesReturnItem,
  PurchaseReturnItem,
  QuotationItem,
  AccountingVoucher,
  AccountLedgerItem,
  HsnMasterItem,
  BlogPostItem,
  MilestoneItem,
  EmployeeItem,
  VendorItem,
  HardwareRepairCatalogItem,
  RepairProcessStepItem,
  AchievementStatItem,
  LeadershipTeamMember,
  EnterpriseSolutionItem,
  DetailedServiceItem,
  ServiceStatItem,
  ServicePillarItem,
  ServicesFaqItem,
  WebsitePromotionItem,
  CompanyDetailsConfig,
} from './store';
import { adminEmployeePermissions } from './store';

// Helper to convert snake_case Supabase row to camelCase RepairTicket
export function mapRowToTicket(row: any): RepairTicket {
  return {
    id: row.id || `t-${Date.now()}`,
    ticket_number: row.ticket_number || '',
    barcode_data: row.barcode_data || row.ticket_number || '',
    customer_name: row.customer_name || 'Customer',
    customer_phone: row.customer_phone || '',
    customerAlternatePhone: row.customer_alternate_phone || '',
    customerEmail: row.customer_email || '',
    customerGstin: row.customer_gstin || '',
    customerAddress: row.customer_address || '',
    customerCompanyName: row.customer_company_name || '',
    customerType: (row.customer_type || 'RETAIL') as any,

    device_type: row.device_type || 'Device',
    brand: row.brand || '',
    model: row.model || '',
    serial_or_imei: row.serial_or_imei || '',
    deviceColor: row.device_color || '',
    chassisColor: row.chassis_color || '',
    receivedQty: Number(row.received_qty || row.received_quantity) || 1,
    receivedQuantity: Number(row.received_quantity || row.received_qty) || 1,
    hwChecklist: row.hw_checklist || undefined,
    conditionChecklist: row.condition_checklist || undefined,
    accessoriesChecklist: row.accessories_checklist || undefined,
    outsourceHistoryDetails: row.outsource_history_details || undefined,
    placeOfPurchase: row.place_of_purchase || undefined,
    purchaseInvoiceNo: row.purchase_invoice_no || undefined,
    purchaseDate: row.purchase_date || undefined,
    jobPipelineStatus: row.job_pipeline_status || 'Queue',
    assignedTechnician: row.assigned_technician || undefined,
    warrantyStatus: row.warranty_status || 'Out of Warranty',
    partsToBeOrdered: row.parts_to_be_ordered || undefined,
    extraInfoArea: row.extra_info_area || undefined,
    passwordLock: row.password_lock || '',
    patternLockSequence: Array.isArray(row.pattern_lock_sequence) ? row.pattern_lock_sequence : [],
    rackLocation: row.rack_location || 'Shelf A-1',
    problem_reported: row.problem_reported || '',
    physicalCondition: row.physical_condition || '',
    requestedWork: row.requested_work || '',
    osToInstall: row.os_to_install || '',
    intakePhotos: Array.isArray(row.intake_photos) ? row.intake_photos : [],

    status: (row.status || 'received') as any,
    priority: (row.priority || 'normal') as any,
    progressPercentage: Number(row.progress_percentage) || 0,

    lineItems: Array.isArray(row.line_items) ? row.line_items : [],
    outsourceCharges: Number(row.outsource_charges) || 0,
    freightCharges: Number(row.freight_charges) || 0,
    estimated_cost: Number(row.estimated_cost) || 0,
    advance_paid: Number(row.advance_paid) || 0,
    discountAmount: Number(row.discount_amount) || 0,
    gstTaxRate: Number(row.gst_tax_rate) || 18,
    subtotal: Number(row.subtotal) || 0,
    taxableAmount: Number(row.taxable_amount) || 0,
    cgstAmount: Number(row.cgst_amount) || 0,
    sgstAmount: Number(row.sgst_amount) || 0,
    roundOffAdjustment: Number(row.round_off_adjustment) || 0,
    grandTotal: Number(row.grand_total) || 0,
    netDueBalance: Number(row.net_due_balance) || 0,

    paymentMethod: (row.payment_method || 'CASH') as any,
    paymentStatus: (row.payment_status || 'UNPAID') as any,
    warrantyStatement: row.warranty_statement || '30 Days Parts & Labor Warranty',
    deliveredTo: row.delivered_to || '',
    deliveryStatus: row.delivery_status || 'IN REPAIR LAB',
    afterServiceRemarks: row.after_service_remarks || '',

    technician_name: row.technician_name || 'Deepak Kumar',
    entryDate: row.entry_date || new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: row.estimated_delivery_date || '',
    actualDeliveryDate: row.actual_delivery_date || '',
    invoiceId: row.invoice_id || '',
    invoiceNumber: row.invoice_number || '',
    invoiceDate: row.invoice_date || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

// Helper to convert camelCase RepairTicket to snake_case Supabase payload
export function mapTicketToRow(ticket: RepairTicket): Record<string, any> {
  return {
    id: ticket.id,
    ticket_number: ticket.ticket_number,
    barcode_data: ticket.barcode_data || ticket.ticket_number,
    customer_name: ticket.customer_name,
    customer_phone: ticket.customer_phone,
    customer_alternate_phone: ticket.customerAlternatePhone || null,
    customer_company_name: ticket.customerCompanyName || null,
    customer_email: ticket.customerEmail || null,
    customer_gstin: ticket.customerGstin || null,
    customer_address: ticket.customerAddress || null,
    customer_type: ticket.customerType || 'RETAIL',

    device_type: ticket.device_type,
    brand: ticket.brand,
    model: ticket.model,
    serial_or_imei: ticket.serial_or_imei || null,
    device_color: ticket.deviceColor || null,
    chassis_color: ticket.chassisColor || null,
    received_qty: ticket.receivedQty || 1,
    received_quantity: ticket.receivedQuantity || ticket.receivedQty || 1,
    hw_checklist: ticket.hwChecklist || {},
    condition_checklist: ticket.conditionChecklist || {},
    accessories_checklist: ticket.accessoriesChecklist || {},
    outsource_history_details: ticket.outsourceHistoryDetails || null,
    place_of_purchase: ticket.placeOfPurchase || null,
    purchase_invoice_no: ticket.purchaseInvoiceNo || null,
    purchase_date: ticket.purchaseDate || null,
    job_pipeline_status: ticket.jobPipelineStatus || 'Queue',
    assigned_technician: ticket.assignedTechnician || ticket.technician_name || null,
    warranty_status: ticket.warrantyStatus || 'Out of Warranty',
    parts_to_be_ordered: ticket.partsToBeOrdered || null,
    extra_info_area: ticket.extraInfoArea || null,
    password_lock: ticket.passwordLock || null,
    pattern_lock_sequence: ticket.patternLockSequence || [],
    rack_location: ticket.rackLocation || 'Shelf A-1',
    problem_reported: ticket.problem_reported || '',
    physical_condition: ticket.physicalCondition || null,
    requested_work: ticket.requestedWork || null,
    os_to_install: ticket.osToInstall || null,
    intake_photos: ticket.intakePhotos || [],

    status: ticket.status || 'received',
    priority: ticket.priority || 'normal',
    progress_percentage: ticket.progressPercentage || 0,

    line_items: ticket.lineItems || [],
    outsource_charges: ticket.outsourceCharges || 0,
    freight_charges: ticket.freightCharges || 0,
    estimated_cost: ticket.estimated_cost || 0,
    advance_paid: ticket.advance_paid || 0,
    discount_amount: ticket.discountAmount || 0,
    gst_tax_rate: ticket.gstTaxRate || 18,
    subtotal: ticket.subtotal || 0,
    taxable_amount: ticket.taxableAmount || 0,
    cgst_amount: ticket.cgstAmount || 0,
    sgst_amount: ticket.sgstAmount || 0,
    round_off_adjustment: ticket.roundOffAdjustment || 0,
    grand_total: ticket.grandTotal || 0,
    net_due_balance: ticket.netDueBalance || 0,

    payment_method: ticket.paymentMethod || 'CASH',
    payment_status: ticket.paymentStatus || 'UNPAID',
    warranty_statement: ticket.warrantyStatement || '30 Days Parts & Labor Warranty',
    delivered_to: ticket.deliveredTo || null,
    delivery_status: ticket.deliveryStatus || 'IN REPAIR LAB',
    after_service_remarks: ticket.afterServiceRemarks || null,

    technician_name: ticket.technician_name || 'Deepak Kumar',
    entry_date: ticket.entryDate || new Date().toISOString().split('T')[0],
    estimated_delivery_date: ticket.estimatedDeliveryDate || null,
    actual_delivery_date: ticket.actualDeliveryDate || null,
    invoice_id: ticket.invoiceId || null,
    invoice_number: ticket.invoiceNumber || null,
    invoice_date: ticket.invoiceDate || null,
  };
}

// Map Supabase row to RepairInvoice
export function mapRowToInvoice(row: any): RepairInvoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    ticketId: row.ticket_id || '',
    ticketNumber: row.ticket_number || '',
    invoiceDate: row.invoice_date || new Date().toISOString().split('T')[0],
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    customerGstin: row.customer_gstin || '',
    customerType: row.customer_type || 'RETAIL',
    deviceType: row.device_type || '',
    brand: row.brand || '',
    model: row.model || '',
    serial_or_imei: row.serial_or_imei || '',
    lineItems: row.line_items || [],
    outsourceCharges: Number(row.outsource_charges) || 0,
    freightCharges: Number(row.freight_charges) || 0,
    subtotal: Number(row.subtotal) || 0,
    discountAmount: Number(row.discount_amount) || 0,
    taxableAmount: Number(row.taxable_amount) || 0,
    gstTaxRate: Number(row.gst_tax_rate) || 18,
    cgstAmount: Number(row.cgst_amount) || 0,
    sgstAmount: Number(row.sgst_amount) || 0,
    roundOffAdjustment: Number(row.round_off_adjustment) || 0,
    grandTotal: Number(row.grand_total) || 0,
    advancePaid: Number(row.advance_paid) || 0,
    netDueBalance: Number(row.net_due_balance) || 0,
    paymentMethod: row.payment_method || 'CASH',
    paymentStatus: row.payment_status || 'PAID',
    warrantyStatement: row.warranty_statement || '30 Days Parts & Labor Warranty',
    deliveredTo: row.delivered_to || '',
    deliveryStatus: row.delivery_status || 'DELIVERED TO CUSTOMER',
    afterServiceRemarks: row.after_service_remarks || '',
    problem_reported: row.problem_reported || row.ticket_details?.problem_reported || '',
    requestedWork: row.requested_work || row.ticket_details?.requestedWork || '',
    ticketDetails: row.ticket_details || undefined,
  };
}

export function mapInvoiceToRow(inv: RepairInvoice): Record<string, any> {
  return {
    id: inv.id,
    invoice_number: inv.invoiceNumber,
    ticket_id: inv.ticketId || null,
    ticket_number: inv.ticketNumber || null,
    problem_reported: inv.problem_reported || inv.ticketDetails?.problem_reported || null,
    requested_work: inv.requestedWork || inv.ticketDetails?.requestedWork || null,
    invoice_date: inv.invoiceDate || new Date().toISOString().split('T')[0],
    customer_name: inv.customerName,
    customer_phone: inv.customerPhone,
    customer_gstin: inv.customerGstin || null,
    customer_type: inv.customerType || 'RETAIL',
    device_type: inv.deviceType || null,
    brand: inv.brand || null,
    model: inv.model || null,
    serial_or_imei: inv.serial_or_imei || null,
    line_items: inv.lineItems || [],
    outsource_charges: inv.outsourceCharges || 0,
    freight_charges: inv.freightCharges || 0,
    subtotal: inv.subtotal || 0,
    discount_amount: inv.discountAmount || 0,
    taxable_amount: inv.taxableAmount || 0,
    gst_tax_rate: inv.gstTaxRate || 18,
    cgst_amount: inv.cgstAmount || 0,
    sgst_amount: inv.sgstAmount || 0,
    round_off_adjustment: inv.roundOffAdjustment || 0,
    grand_total: inv.grandTotal || 0,
    advance_paid: inv.advancePaid || 0,
    net_due_balance: inv.netDueBalance || 0,
    payment_method: inv.paymentMethod || 'CASH',
    payment_status: inv.paymentStatus || 'PAID',
    warranty_statement: inv.warrantyStatement || '30 Days Parts & Labor Warranty',
    delivered_to: inv.deliveredTo || null,
    delivery_status: inv.deliveryStatus || 'DELIVERED TO CUSTOMER',
    after_service_remarks: inv.afterServiceRemarks || null,
    ticket_details: inv.ticketDetails || null,
  };
}

/**
 * Fetch all tickets live from Supabase
 */
export async function fetchTicketsFromSupabase(): Promise<RepairTicket[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('repair_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapRowToTicket);
      }
    } catch (err) {
      console.warn('Network exception while fetching Supabase tickets:', err);
    }
  }
  try {
    const res = await fetch('/api/erp/repairs');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

/**
 * Fetch all repair invoices live from Supabase
 */
export async function fetchInvoicesFromSupabase(): Promise<RepairInvoice[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('repair_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapRowToInvoice);
      }
    } catch (err) {
      console.warn('Network exception while fetching Supabase invoices:', err);
    }
  }
  try {
    const res = await fetch('/api/erp/invoices');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

/**
 * Push single ticket to Supabase Cloud
 */
export async function pushTicketToSupabase(ticket: RepairTicket): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const row = mapTicketToRow(ticket);
      const { error } = await supabase
        .from('repair_tickets')
        .upsert(row, { onConflict: 'ticket_number' });

      if (!error) saved = true;
    } catch (err) {
      console.error('Exception syncing ticket to Supabase:', err);
    }
  }
  try {
    const res = await fetch('/api/erp/repairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

/**
 * Delete ticket from Supabase Cloud
 */
export async function deleteTicketFromSupabase(id: string, ticketNumber?: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      let query = supabase.from('repair_tickets').delete();
      if (ticketNumber) {
        query = query.or(`id.eq.${id},ticket_number.eq.${ticketNumber}`);
      } else {
        query = query.or(`id.eq.${id},ticket_number.eq.${id}`);
      }
      const { error } = await query;
      if (!error) deleted = true;
    } catch (err) {}
  }
  try {
    const numParam = ticketNumber ? `&ticketNumber=${encodeURIComponent(ticketNumber)}` : '';
    const res = await fetch(`/api/erp/repairs?id=${encodeURIComponent(id)}${numParam}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

/**
 * Push repair invoice to Supabase Cloud
 */
export async function pushInvoiceToSupabase(inv: RepairInvoice): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const row = mapInvoiceToRow(inv);
      const { error } = await supabase
        .from('repair_invoices')
        .upsert(row, { onConflict: 'invoice_number' });

      if (!error) saved = true;
    } catch (err) {
      console.error('Exception syncing invoice to Supabase:', err);
    }
  }
  try {
    const res = await fetch('/api/erp/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inv),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

/**
 * Delete repair invoice from Supabase Cloud
 */
export async function deleteInvoiceFromSupabase(id: string, invoiceNumber?: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      let query = supabase.from('repair_invoices').delete();
      if (invoiceNumber) {
        query = query.or(`id.eq.${id},invoice_number.eq.${invoiceNumber}`);
      } else {
        query = query.or(`id.eq.${id},invoice_number.eq.${id}`);
      }
      const { error } = await query;
      if (!error) deleted = true;
    } catch (err) {}
  }
  try {
    const numParam = invoiceNumber ? `&invoiceNumber=${encodeURIComponent(invoiceNumber)}` : '';
    const res = await fetch(`/api/erp/invoices?id=${encodeURIComponent(id)}${numParam}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

/**
 * Push Book Repair Online lead directly to Supabase
 */
export async function pushBookRepairLeadToSupabase(lead: BookRepairLeadItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const row = {
      id: lead.id,
      booking_no: lead.bookingNo,
      customer_name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      address: lead.address || null,
      device_type: lead.deviceType,
      brand: lead.brand || null,
      model: lead.model || null,
      problem_reported: lead.problemDescription || '',
      service_mode: lead.serviceMode || 'Store Drop-off',
      status: lead.status || 'New Booking',
      created_at: lead.created_at || new Date().toISOString(),
    };

    const { error } = await supabase
      .from('book_repair_leads')
      .upsert(row, { onConflict: 'booking_no' });

    if (error) {
      console.warn('Failed to sync book repair lead to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception syncing book repair lead to Supabase:', err);
    return false;
  }
}

/**
 * Push Contact / Support lead directly to Supabase
 */
export async function pushSupportLeadToSupabase(lead: SupportLeadItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const row = {
      id: lead.id,
      lead_name: lead.lead_name,
      phone: lead.phone,
      email: lead.email || null,
      company: lead.company || null,
      service_interested: lead.service_interested || lead.subject || 'General Inquiry',
      status: lead.status || 'new',
      source: lead.source || 'Website Form',
      notes: `${lead.subject ? lead.subject + ': ' : ''}${lead.message || ''}`,
      created_at: lead.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('support_leads').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Failed to sync support lead to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception syncing support lead to Supabase:', err);
    return false;
  }
}

/**
 * Direct Live Lookup for Customer Track Status
 */
export async function searchTicketFromSupabase(query?: string, phone?: string): Promise<RepairTicket | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    let q = supabase.from('repair_tickets').select('*');
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const cleanQuery = query ? query.trim() : '';

    if (cleanQuery && cleanPhone) {
      q = q.or(`ticket_number.ilike.%${cleanQuery}%,barcode_data.ilike.%${cleanQuery}%`).ilike('customer_phone', `%${cleanPhone}%`);
    } else if (cleanQuery) {
      q = q.or(`ticket_number.ilike.%${cleanQuery}%,barcode_data.ilike.%${cleanQuery}%`);
    } else if (cleanPhone) {
      q = q.ilike('customer_phone', `%${cleanPhone}%`);
    } else {
      return null;
    }

    const { data, error } = await q.limit(1);
    if (error || !data || data.length === 0) return null;
    return mapRowToTicket(data[0]);
  } catch (e) {
    console.warn('Search ticket in Supabase exception:', e);
    return null;
  }
}

// ----------------------------------------------------------------------
// EXTENDED ENTITY FETCHERS: ALL ERP TABLES DIRECTLY FROM SUPABASE
// ----------------------------------------------------------------------

export function mapRowToCustomer(row: any): CustomerItem {
  return {
    id: row.id,
    code: row.code || row.customer_code || '',
    name: row.name || 'Customer',
    companyName: row.company_name || '',
    category: row.category || 'Sundry Debtor',
    accountGroup: row.account_group || (row.customer_type === 'CORPORATE' ? 'Corporate / B2B' : 'Retail / Cash'),
    mobile: row.mobile || row.phone || '',
    phone: row.phone || row.mobile || '',
    alternateContact: row.alternate_phone || '',
    email: row.email || '',
    website: row.website || '',
    dob: row.dob || '',
    weddingAnniversary: row.wedding_anniversary || '',
    referredBy: row.referred_by || '',
    panNumber: row.pan_number || '',
    gstin: row.gstin || '',
    billingAddress: row.billing_address || row.address || '',
    shippingAddress: row.shipping_address || '',
    address: row.address || row.billing_address || '',
    city: row.city || 'Sanchore',
    state: row.state || 'Rajasthan',
    pinCode: row.pincode || '',
    accountStatus: row.account_status || 'Active',
    creditLimit: Number(row.credit_limit) || 0,
    outstandingBalance: Number(row.current_balance) || 0,
    loyaltyPoints: Number(row.loyalty_points) || 0,
    kycVerified: Boolean(row.kyc_verified || row.gstin),
    tier: row.tier || ((Number(row.credit_limit) || 0) > 100000 ? 'Platinum VIP' : 'Standard'),
    totalRepairs: Number(row.total_repairs) || 0,
    internalNotes: row.notes || '',
    bankAccountName: row.bank_account_name || (row.bank_details?.accountName || undefined),
    bankAccountType: row.bank_account_type || (row.bank_details?.accountType || undefined),
    bankAccountNumber: row.bank_account_number || (row.bank_details?.accountNumber || undefined),
    bankIfscCode: row.bank_ifsc || (row.bank_details?.ifsc || undefined),
    bankName: row.bank_name || (row.bank_details?.bankName || undefined),
    bankBranch: row.bank_branch || (row.bank_details?.branch || undefined),
    upiId: row.upi_id || (row.bank_details?.upiId || undefined),
  };
}

export async function fetchCustomersFromSupabase(): Promise<CustomerItem[] | null> {
  // 1. Try Direct Supabase SDK Client
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data.map(mapRowToCustomer);
      }
    } catch (err) {
      console.warn('fetchCustomersFromSupabase direct client error:', err);
    }
  }

  // 2. Fallback to Server API Route (Bypasses any browser CORS or network isolation)
  try {
    const res = await fetch('/api/erp/customers');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (apiErr) {
    console.warn('fetchCustomersFromSupabase API fallback error:', apiErr);
  }

  return null;
}

export async function pushCustomerToSupabase(cust: CustomerItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload: Record<string, any> = {
        id: cust.id,
        code: cust.code || '',
        customer_code: cust.code || '',
        name: cust.name || 'Customer',
        phone: cust.mobile || cust.phone || '',
        alternate_phone: cust.alternateContact || null,
        email: cust.email || null,
        website: cust.website || null,
        dob: cust.dob || null,
        wedding_anniversary: cust.weddingAnniversary || null,
        referred_by: cust.referredBy || null,
        customer_type: (cust.accountGroup || '').includes('Corporate') ? 'CORPORATE' : 'RETAIL',
        company_name: cust.companyName || null,
        gstin: cust.gstin || null,
        address: cust.billingAddress || cust.address || null,
        billing_address: cust.billingAddress || cust.address || null,
        shipping_address: cust.shippingAddress || null,
        city: cust.city || 'Sanchore',
        state: cust.state || 'Rajasthan',
        pincode: cust.pinCode || null,
        category: cust.category || 'Sundry Debtor',
        account_group: cust.accountGroup || 'Retail / Cash',
        pan_number: cust.panNumber || null,
        account_status: cust.accountStatus || 'Active',
        credit_limit: Number(cust.creditLimit) || 0,
        current_balance: Number(cust.outstandingBalance) || 0,
        loyalty_points: Number(cust.loyaltyPoints) || 0,
        kyc_verified: Boolean(cust.kycVerified),
        tier: cust.tier || 'Standard',
        total_repairs: Number(cust.totalRepairs) || 0,
        notes: cust.internalNotes || null,
        bank_account_name: cust.bankAccountName || null,
        bank_account_type: cust.bankAccountType || 'Savings',
        bank_account_number: cust.bankAccountNumber || null,
        bank_ifsc: cust.bankIfscCode || null,
        bank_name: cust.bankName || null,
        bank_branch: cust.bankBranch || null,
        upi_id: cust.upiId || null,
        bank_details: {
          accountName: cust.bankAccountName || null,
          accountNumber: cust.bankAccountNumber || null,
          ifsc: cust.bankIfscCode || null,
          bankName: cust.bankName || null,
        },
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('customers').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch (err) {
      console.warn('pushCustomerToSupabase direct client error:', err);
    }
  }

  // Also push to internal server API for guaranteed delivery
  try {
    const res = await fetch('/api/erp/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cust),
    });
    if (res.ok) saved = true;
  } catch {}

  return saved;
}

export async function deleteCustomerFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (!error) deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/customers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

export async function pushInventoryToSupabase(item: InventoryItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload: Record<string, any> = {
        id: item.id,
        code: item.code || '',
        sku: item.code || '',
        name: item.name || '',
        category: item.category || 'General Hardware',
        item_type: item.itemType === 'Retail Part' ? 'retail_product' : 'service_part',
        unit: item.uom || 'Pcs',
        default_quantity: item.defaultQuantity || 1,
        cost_price: Number(item.costPrice) || 0,
        selling_price: Number(item.sellingPrice) || 0,
        mrp: Number(item.mrp) || 0,
        stock_quantity: Number(item.currentStock) || 0,
        current_stock: Number(item.currentStock) || 0,
        quantity_in_stock: Number(item.currentStock) || 0,
        min_stock_alert: Number(item.lowStockAlert) || 2,
        low_stock_alert: Number(item.lowStockAlert) || 2,
        min_stock_level: Number(item.lowStockAlert) || 2,
        hsn_code: item.hsnCode || '84733020',
        gst_rate: Number(item.gstRate) || 18,
        location: (item as any).location || item.storageLocation || 'Shop Shelf',
        storage_location: item.storageLocation || (item as any).location || 'Shop Shelf',
        description: item.description || null,
        is_active: item.activeStatus !== 'Inactive',
        active_status: item.activeStatus || 'Active',
        product_image: item.productImage || null,
        brand: item.productGroup || null,
        product_group: item.productGroup || null,
        product_condition: item.productCondition || 'New',
        refurbished_description: item.refurbishedDescription || null,
        compatible_models: item.compatibleModels || null,
        comfortability_features: item.comfortabilityFeatures || null,
        supplier_vendor: item.supplierVendor || null,
        conversion_factor: Number(item.conversionFactor) || 1,
        conversion_unit: item.conversionUnit || null,
        opening_balance: Number(item.openingBalance || item.currentStock) || 0,
        show_on_website_shop: item.showOnWebsiteShop !== false,
        barcode: item.barcode || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('inventory_items').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch (err) {
      console.warn('pushInventoryToSupabase error:', err);
    }
  }

  try {
    const res = await fetch('/api/erp/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) saved = true;
  } catch {}

  return saved;
}

export async function deleteInventoryFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('inventory_items').delete().eq('id', id);
      if (!error) deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/inventory?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

export function mapRowToInventory(row: any): InventoryItem {
  return {
    id: row.id,
    itemType: row.item_type === 'service_part' ? 'Service Part' : 'Retail Part',
    code: row.code || row.sku || '',
    name: row.name || 'Inventory Item',
    category: row.category || 'General Hardware',
    uom: row.unit || row.uom || 'pcs',
    defaultQuantity: Number(row.default_quantity) || 1,
    sellingPrice: Number(row.selling_price) || 0,
    mrp: Number(row.mrp) || 0,
    costPrice: Number(row.cost_price) || 0,
    currentStock: Number(row.current_stock ?? row.stock_quantity ?? row.quantity_in_stock) || 0,
    lowStockAlert: Number(row.low_stock_alert ?? row.min_stock_alert ?? row.min_stock_level) || 2,
    activeStatus: row.active_status || (row.is_active ? 'Active' : 'Inactive'),
    hsnCode: row.hsn_code || '84733020',
    gstRate: Number(row.gst_rate) || 18,
    barcode: row.barcode || '',
    productImage: row.product_image || undefined,
    productGroup: row.product_group || row.brand || '',
    description: row.description || row.model || '',
    productCondition: row.product_condition || 'New',
    refurbishedDescription: row.refurbished_description || undefined,
    compatibleModels: row.compatible_models || undefined,
    comfortabilityFeatures: row.comfortability_features || undefined,
    supplierVendor: row.supplier_vendor || '',
    storageLocation: row.storage_location || row.location || 'Shop Shelf',
    conversionFactor: Number(row.conversion_factor) || 1,
    conversionUnit: row.conversion_unit || undefined,
    openingBalance: Number(row.opening_balance || row.stock_quantity) || 0,
    showOnWebsiteShop: row.show_on_website_shop !== false,
  };
}

export async function fetchInventoryFromSupabase(): Promise<InventoryItem[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('inventory_items').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToInventory);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/inventory');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export function mapRowToVendor(row: any): VendorItem {
  return {
    id: row.id,
    vendorType: row.vendor_type || ((row.category || '').toLowerCase().includes('outsource') ? 'Outsource Vendor' : 'Standard Vendor'),
    code: row.code || row.vendor_code || '',
    companyName: row.company_name || row.vendor_name || 'Vendor',
    name: row.name || row.vendor_name || row.company_name || 'Vendor',
    contactPerson: row.contact_person || '',
    category: row.category || 'Components',
    accountGroup: row.account_group || 'Sundry Creditor',
    designation: row.designation || undefined,
    activeStatus: row.active_status || (row.is_active ? 'Active' : 'Inactive'),
    phone: row.phone || '',
    alternatePhone: row.alternate_phone || '',
    email: row.email || '',
    website: row.website || undefined,
    station: row.city || '',
    state: row.state || '',
    fullAddress: row.address || '',
    address: row.address || '',
    gstin: row.gstin || '',
    pan: row.pan_number || '',
    openingBalance: Number(row.opening_balance) || 0,
    outstandingBalance: Number(row.current_balance) || 0,
    maxCreditLimit: Number(row.max_credit_limit) || 0,
    internalNotes: row.internal_notes || undefined,
    bankName: row.bank_name || '',
    bankAccountName: row.bank_account_name || undefined,
    bankAccountType: row.bank_account_type || 'Current',
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc || '',
    bankBranch: row.bank_branch || undefined,
    upiId: row.upi_id || undefined,
  };
}

export async function fetchVendorsFromSupabase(): Promise<VendorItem[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToVendor);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/suppliers');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushVendorToSupabase(vendor: VendorItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload: Record<string, any> = {
        id: vendor.id,
        code: vendor.code || null,
        vendor_code: vendor.code || null,
        company_name: vendor.companyName || vendor.name || 'Vendor',
        vendor_name: vendor.companyName || vendor.name || 'Vendor',
        name: vendor.companyName || vendor.name || 'Vendor',
        vendor_type: vendor.vendorType || 'Standard Vendor',
        contact_person: vendor.contactPerson || null,
        account_group: vendor.accountGroup || 'Sundry Creditor',
        designation: vendor.designation || null,
        phone: vendor.phone || '+91 99999-00000',
        alternate_phone: vendor.alternatePhone || null,
        email: vendor.email || null,
        website: vendor.website || null,
        gstin: vendor.gstin || null,
        pan_number: vendor.pan || null,
        address: vendor.fullAddress || vendor.address || null,
        city: vendor.station || null,
        state: vendor.state || null,
        bank_name: vendor.bankName || null,
        bank_account_name: vendor.bankAccountName || null,
        bank_account_type: vendor.bankAccountType || 'Current',
        bank_account_number: vendor.bankAccountNumber || null,
        bank_ifsc: vendor.bankIfscCode || null,
        bank_branch: vendor.bankBranch || null,
        upi_id: vendor.upiId || null,
        opening_balance: Number(vendor.openingBalance) || 0,
        current_balance: Number(vendor.outstandingBalance) || 0,
        max_credit_limit: Number(vendor.maxCreditLimit) || 0,
        category: vendor.category || 'Components',
        is_active: vendor.activeStatus !== 'Inactive',
        active_status: vendor.activeStatus || 'Active',
        internal_notes: vendor.internalNotes || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('suppliers').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deleteVendorFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('suppliers').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/suppliers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

// ----------------------------------------------------------------------
// OUTSOURCE VOUCHERS DUAL-CHANNEL SYNC
// ----------------------------------------------------------------------

export function mapRowToOutsource(row: any): OutsourceVoucher {
  return {
    id: row.id,
    voucherNumber: row.voucher_number || '',
    voucherDate: row.voucher_date || '',
    linkedTicketNumber: row.linked_ticket_number || '',
    vendorJobId: row.vendor_job_id || '',
    vendorId: row.vendor_id || '',
    vendorName: row.vendor_name || 'Vendor',
    vendorPhone: row.vendor_phone || '',
    vendorCity: row.vendor_city || '',
    vendorAddress: row.vendor_address || '',
    vendorGstin: row.vendor_gstin || '',
    serviceType: row.service_type || 'Motherboard Repair',
    outgoingCourier: row.outgoing_courier || '',
    outgoingDocket: row.outgoing_docket || '',
    outgoingDispatchDate: row.outgoing_dispatch_date || '',
    outgoingFreightCost: Number(row.outgoing_freight_cost) || 0,
    incomingCourier: row.incoming_courier || '',
    incomingDocket: row.incoming_docket || '',
    incomingDispatchDate: row.incoming_dispatch_date || '',
    incomingFreightCost: Number(row.incoming_freight_cost) || 0,
    expectedReturnDate: row.expected_return_date || '',
    receivedDate: row.received_date || '',
    vendorCostPrice: Number(row.vendor_cost_price) || 0,
    freightCharges: Number(row.freight_charges) || 0,
    customerSellingPrice: Number(row.customer_selling_price) || 0,
    profitMargin: Number(row.profit_margin) || 0,
    dispatchStatus: row.dispatch_status || 'SHIPPED',
    technicalInstructions: row.technical_instructions || '',
    testingNotes: row.testing_notes || '',
  };
}

export async function fetchOutsourceVouchersFromSupabase(): Promise<OutsourceVoucher[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('outsource_vouchers').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToOutsource);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/outsource');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushOutsourceVoucherToSupabase(v: OutsourceVoucher): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const outgoingFreight = Number(v.outgoingFreightCost) || 0;
      const incomingFreight = Number(v.incomingFreightCost) || 0;
      const totalFreight = outgoingFreight + incomingFreight;
      const vendorCost = Number(v.vendorCostPrice) || 0;
      const sellingPrice = Number(v.customerSellingPrice) || 0;
      const profit = sellingPrice - (vendorCost + totalFreight);

      const payload = {
        id: v.id,
        voucher_number: v.voucherNumber || `OUT-${Date.now().toString().slice(-4)}`,
        voucher_date: v.voucherDate || new Date().toISOString().split('T')[0],
        linked_ticket_number: v.linkedTicketNumber || null,
        vendor_job_id: v.vendorJobId || null,
        vendor_id: v.vendorId || `v-${Date.now()}`,
        vendor_name: v.vendorName || 'Outsource Vendor',
        vendor_phone: v.vendorPhone || '+91 99999-00000',
        vendor_city: v.vendorCity || 'Jodhpur',
        vendor_address: v.vendorAddress || null,
        vendor_gstin: v.vendorGstin || null,
        service_type: v.serviceType || 'Motherboard Repair',
        outgoing_courier: v.outgoingCourier || 'DTDC Courier',
        outgoing_docket: v.outgoingDocket || '',
        outgoing_dispatch_date: v.outgoingDispatchDate || new Date().toISOString().split('T')[0],
        outgoing_freight_cost: outgoingFreight,
        incoming_courier: v.incomingCourier || null,
        incoming_docket: v.incomingDocket || null,
        incoming_dispatch_date: v.incomingDispatchDate || null,
        incoming_freight_cost: incomingFreight,
        expected_return_date: v.expectedReturnDate || null,
        received_date: v.receivedDate || null,
        vendor_cost_price: vendorCost,
        freight_charges: totalFreight,
        customer_selling_price: sellingPrice,
        profit_margin: profit,
        dispatch_status: v.dispatchStatus || 'SHIPPED',
        technical_instructions: v.technicalInstructions || null,
        testing_notes: v.testingNotes || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('outsource_vouchers').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/outsource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deleteOutsourceVoucherFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('outsource_vouchers').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/outsource?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

// ----------------------------------------------------------------------
// DATA RECOVERY CASES DUAL-CHANNEL SYNC
// ----------------------------------------------------------------------

export function mapRowToDataRecovery(row: any): DataRecoveryCase {
  const quote = Number(row.estimated_quote) || 0;
  const advance = Number(row.advance_paid) || 0;
  return {
    id: row.id,
    recoveryIdNumber: row.recovery_id_number || '',
    caseNumber: row.case_number || row.recovery_id_number || '',
    entryDate: row.entry_date || new Date().toISOString().split('T')[0],
    customerName: row.customer_name || 'Customer',
    customerPhone: row.customer_phone || '',
    customerEmail: row.customer_email || '',
    customerGst: row.customer_gst || '',
    customerAddress: row.customer_address || '',
    deviceBrand: row.media_brand || '',
    deviceType: row.media_type || 'Hard Drive (HDD)',
    driveModel: row.media_model || '',
    driveSerial: row.serial_number || '',
    capacity: row.capacity || '1 TB',
    fileSystem: row.file_system || 'NTFS',
    damageType: row.damage_type || row.reported_fault || 'Drive Not Detected',
    priority: row.priority || 'Normal',
    symptoms: row.symptoms || row.reported_fault || '',
    status: row.status || 'Received',
    technician: row.technician_name || 'Deepak Kumar',
    storageLocation: row.storage_location || 'Safe Locker',
    estimateCost: quote,
    advance: advance,
    customerCharge: Number(row.customer_charge) || quote,
    freight: Number(row.freight) || 0,
    discount: Number(row.discount) || 0,
    gstRate: Number(row.gst_rate) || 18,
    totalInvoice: Number(row.total_invoice) || quote,
    deposit: Number(row.deposit) || advance,
    balanceDue: Number(row.balance_due) || Math.max(0, quote - advance),
    diagnosticFee: Number(row.diagnostic_fee) || 500,
    recoveryFee: Number(row.recovery_fee) || quote,
    paidAmount: Number(row.paid_amount) || advance,
    paymentStatus: row.payment_status || (advance >= quote && quote > 0 ? 'Paid' : advance > 0 ? 'Partial' : 'Unpaid'),
    termsConsentAccepted: row.terms_consent_accepted !== false,
    requestedWork: row.requested_work || 'Data Recovery Lab Extraction',
    additionalInfo: row.additional_info || '',
    confidentialNotes: row.confidential_notes || '',
    recoveryPhaseStatus: row.recovery_phase_status || row.cleanroom_status || 'Phase 1: Diagnostic',
    progressPercentage: Number(row.progress_percentage) || (row.status === 'Completed' ? 100 : 35),
    estimatedDataGb: Number(row.estimated_data_gb) || 100,
    recoveredDataGb: Number(row.recovered_data_size_gb) || 0,
    healthPercentage: Number(row.health_percentage) || 85,
    rackLocation: row.rack_location || 'Rack DR-1',
    donorDriveSerial: row.donor_drive_serial || undefined,
    notes: row.notes || undefined,
    targetDriveDetails: row.target_media_provided || '',
    isOutsourced: Boolean(row.is_outsourced),
    outsource: row.outsource_details || undefined,
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchDataRecoveryFromSupabase(): Promise<DataRecoveryCase[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('data_recovery_cases').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToDataRecovery);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/data-recovery');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushDataRecoveryToSupabase(c: DataRecoveryCase): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const recId = c.recoveryIdNumber || `REC-${Date.now().toString().slice(-4)}`;
      const payload: Record<string, any> = {
        id: c.id,
        recovery_id_number: recId,
        case_number: c.caseNumber || recId,
        entry_date: c.entryDate || new Date().toISOString().split('T')[0],
        customer_name: c.customerName || 'Customer',
        customer_phone: c.customerPhone || '+91 99999-00000',
        customer_email: c.customerEmail || null,
        customer_gst: c.customerGst || null,
        customer_address: c.customerAddress || null,
        media_type: c.deviceType || 'Hard Drive (HDD)',
        media_brand: c.deviceBrand || null,
        media_model: c.driveModel || null,
        serial_number: c.driveSerial || null,
        capacity: c.capacity || '1 TB',
        file_system: c.fileSystem || 'NTFS',
        damage_type: c.damageType || null,
        reported_fault: c.damageType || c.symptoms || 'Drive Not Detected',
        symptoms: c.symptoms || null,
        cleanroom_status: c.recoveryPhaseStatus || 'Pending Inspection',
        recovery_stage: c.status || 'In Lab Inspection',
        recovery_phase_status: c.recoveryPhaseStatus || 'Phase 1: Diagnostic',
        priority: c.priority || 'Normal',
        estimated_quote: Number(c.estimateCost) || 0,
        advance_paid: Number(c.advance) || 0,
        customer_charge: Number(c.customerCharge) || 0,
        freight: Number(c.freight) || 0,
        discount: Number(c.discount) || 0,
        gst_rate: Number(c.gstRate) || 18,
        total_invoice: Number(c.totalInvoice) || 0,
        deposit: Number(c.deposit) || 0,
        balance_due: Number(c.balanceDue) || 0,
        diagnostic_fee: Number(c.diagnosticFee) || 500,
        recovery_fee: Number(c.recoveryFee) || 0,
        paid_amount: Number(c.paidAmount) || 0,
        payment_status: c.paymentStatus || 'Unpaid',
        technician_name: c.technician || 'Deepak Kumar',
        storage_location: c.storageLocation || 'Safe Locker',
        status: c.status || 'Received',
        target_media_provided: c.targetDriveDetails || null,
        recovered_data_size_gb: Number(c.recoveredDataGb) || 0,
        estimated_data_gb: Number(c.estimatedDataGb) || 100,
        health_percentage: Number(c.healthPercentage) || 85,
        rack_location: c.rackLocation || 'Rack DR-1',
        donor_drive_serial: c.donorDriveSerial || null,
        terms_consent_accepted: c.termsConsentAccepted !== false,
        requested_work: c.requestedWork || 'Data Recovery Lab Extraction',
        additional_info: c.additionalInfo || null,
        confidential_notes: c.confidentialNotes || null,
        notes: c.notes || null,
        is_outsourced: Boolean(c.isOutsourced),
        outsource_details: c.outsource || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('data_recovery_cases').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/data-recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deleteDataRecoveryFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('data_recovery_cases').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/data-recovery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

// ----------------------------------------------------------------------
// AMC CONTRACTS DUAL-CHANNEL SYNC
// ----------------------------------------------------------------------

export function mapRowToAmc(row: any): AmcContract {
  return {
    id: row.id,
    contractNumber: row.contract_number || '',
    manualEntryDate: row.manual_entry_date || row.start_date || new Date().toISOString().split('T')[0],
    customerId: row.customer_id || undefined,
    customerName: row.customer_name || 'Customer',
    companyName: row.company_name || '',
    customerPhone: row.customer_phone || '',
    alternatePhone: row.alternate_phone || '',
    customerEmail: row.customer_email || '',
    customerGst: row.customer_gstin || '',
    customerAddress: row.customer_address || '',
    planOption: row.plan_option || row.amc_type || 'Comprehensive Plan',
    contractCost: Number(row.contract_cost || row.contract_amount) || 0,
    amcAmount: Number(row.taxable_amount || row.contract_amount) || 0,
    gstRate: Number(row.gst_rate) || 18,
    totalAmount: Number(row.grand_total || row.contract_amount) || 0,
    advancePaid: Number(row.advance_paid) || 0,
    balanceDue: Number(row.balance_due) || 0,
    paymentStatus: row.payment_status || 'Unpaid',
    startDate: row.start_date || new Date().toISOString().split('T')[0],
    endDate: row.end_date || new Date().toISOString().split('T')[0],
    renewalDate: row.renewal_date || row.end_date || new Date().toISOString().split('T')[0],
    contractStatus: row.status || 'Active',
    coverageScopeDetails: row.terms_and_conditions || '',
    source: row.source || 'Direct Customer',
    serviceType: row.service_type || row.billing_cycle || 'On-site Support',
    numberOfDevices: Number(row.total_devices_covered) || 1,
    totalServiceVisits: Number(row.total_service_visits) || 4,
    assignedTechnician: row.assigned_technician || 'Deepak Kumar',
    priority: row.priority || 'Normal',
    deviceType: typeof row.devices_covered === 'string' ? row.devices_covered : (row.device_type || 'Desktop PC / Laptop'),
    issueFound: row.issue_found || undefined,
    notes: row.notes || undefined,
    serviceIncludedChecklist: Array.isArray(row.service_included_checklist) ? row.service_included_checklist : ['Quarterly Maintenance', 'OS Tuning', 'Antivirus Updates'],
    retailProducts: Array.isArray(row.retail_products) ? row.retail_products : [],
    coveredAssets: Array.isArray(row.covered_assets) ? row.covered_assets : [],
    pmVisits: Array.isArray(row.pm_visits) ? row.pm_visits : [],
    complaints: Array.isArray(row.complaints) ? row.complaints : [],
    invoiceGenerated: Boolean(row.invoice_generated),
    invoiceNumber: row.invoice_number || undefined,
    invoiceDate: row.invoice_date || undefined,
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchAmcContractsFromSupabase(): Promise<AmcContract[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('amc_contracts').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToAmc);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/amc');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushAmcContractToSupabase(a: AmcContract): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const contractNum = a.contractNumber || `AMC-${Date.now().toString().slice(-4)}`;
      const startDate = a.startDate || a.manualEntryDate || new Date().toISOString().split('T')[0];
      const endDate = a.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const payload: Record<string, any> = {
        id: a.id,
        contract_number: contractNum,
        manual_entry_date: a.manualEntryDate || startDate,
        customer_id: a.customerId || null,
        customer_name: a.customerName || 'Customer',
        customer_phone: a.customerPhone || '+91 99999-00000',
        alternate_phone: a.alternatePhone || null,
        customer_email: a.customerEmail || null,
        customer_gstin: a.customerGst || null,
        customer_address: a.customerAddress || null,
        company_name: a.companyName || null,
        plan_option: a.planOption || 'Comprehensive Plan',
        amc_type: a.planOption || 'Comprehensive AMC',
        billing_cycle: a.serviceType || 'Yearly',
        service_type: a.serviceType || 'On-site Support',
        start_date: startDate,
        end_date: endDate,
        renewal_date: a.renewalDate || endDate,
        total_devices_covered: Number(a.numberOfDevices) || 1,
        total_service_visits: Number(a.totalServiceVisits) || 4,
        contract_cost: Number(a.contractCost || a.amcAmount) || 0,
        contract_amount: Number(a.contractCost || a.amcAmount) || 0,
        taxable_amount: Number(a.amcAmount || a.contractCost) || 0,
        gst_amount: Number(a.totalAmount ? a.totalAmount - (a.amcAmount || 0) : 0),
        gst_rate: Number(a.gstRate) || 18,
        grand_total: Number(a.totalAmount || a.contractCost) || 0,
        advance_paid: Number(a.advancePaid) || 0,
        balance_due: Number(a.balanceDue) || 0,
        status: a.contractStatus || 'Active',
        payment_status: a.paymentStatus || 'Unpaid',
        payment_mode: 'Cash / UPI / Bank Transfer',
        assigned_technician: a.assignedTechnician || 'Deepak Kumar',
        priority: a.priority || 'Normal',
        source: a.source || 'Direct Customer',
        devices_covered: a.deviceType || 'Desktop PC / Laptop',
        device_type: a.deviceType || 'Desktop PC / Laptop',
        preventative_maintenance_frequency: `${a.totalServiceVisits || 4} Visits/Year`,
        issue_found: a.issueFound || null,
        notes: a.notes || null,
        service_included_checklist: Array.isArray(a.serviceIncludedChecklist) ? a.serviceIncludedChecklist : [],
        retail_products: Array.isArray(a.retailProducts) ? a.retailProducts : [],
        covered_assets: Array.isArray(a.coveredAssets) ? a.coveredAssets : [],
        pm_visits: Array.isArray(a.pmVisits) ? a.pmVisits : [],
        complaints: Array.isArray(a.complaints) ? a.complaints : [],
        invoice_generated: Boolean(a.invoiceGenerated),
        invoice_number: a.invoiceNumber || null,
        invoice_date: a.invoiceDate || null,
        terms_and_conditions: a.coverageScopeDetails || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('amc_contracts').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/amc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(a),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deleteAmcContractFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('amc_contracts').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/amc?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

// ----------------------------------------------------------------------
// SALES INVOICES DUAL-CHANNEL SYNC
// ----------------------------------------------------------------------

export function mapRowToSalesInvoice(row: any): SalesInvoiceItem {
  return {
    id: row.id,
    invoiceNo: row.invoice_number || '',
    invoiceDate: row.invoice_date || '',
    customerId: row.customer_id || '',
    customerName: row.customer_name || 'Retail Customer',
    customerPhone: row.customer_phone || '',
    customerGst: row.customer_gstin || '',
    customerAddress: row.billing_address || '',
    paymentTerms: row.payment_terms || 'Immediate',
    paymentMethod: row.payment_method || 'CASH',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount_amount) || 0,
    discountType: (row.discount_type || 'fixed') as any,
    taxAmount: Number(row.tax_amount) || ((Number(row.cgst_amount) || 0) + (Number(row.sgst_amount) || 0)),
    shippingCharges: Number(row.shipping_charges) || 0,
    grandTotal: Number(row.grand_total) || 0,
    paidAmount: Number(row.paid_amount) || 0,
    balanceDue: Number(row.due_amount) || 0,
    paymentStatus: (row.payment_status || 'Paid') as any,
    remarks: row.notes || '',
    showProductRemarksOnPrint: Boolean(row.show_product_remarks_on_print),
    showRefurbishedBadgeOnPrint: Boolean(row.show_refurbished_badge_on_print),
    created_at: row.created_at || new Date().toISOString(),
  };
}

// ----------------------------------------------------------------------
// LEADS LIVE FETCHERS
// ----------------------------------------------------------------------

export async function fetchSupportLeadsFromSupabase(): Promise<SupportLeadItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('support_leads').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data)
      ? data.map((row) => ({
          id: row.id,
          lead_name: row.lead_name || 'Inquiry',
          phone: row.phone || '',
          email: row.email || '',
          company: row.company || '',
          subject: row.service_interested || 'General Inquiry',
          message: row.notes || '',
          service_interested: row.service_interested || 'General Inquiry',
          status: 'New Inquiry',
          source: 'Website Contact Form',
          created_at: row.created_at || new Date().toISOString(),
        }))
      : [];
  } catch {
    return null;
  }
}

export async function fetchBookRepairLeadsFromSupabase(): Promise<BookRepairLeadItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('book_repair_leads').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data)
      ? data.map((row) => ({
          id: row.id,
          bookingNo: row.booking_no || '',
          name: row.customer_name || 'Customer',
          phone: row.phone || '',
          email: row.email || '',
          deviceType: row.device_type || 'Device',
          brand: row.brand || '',
          model: row.model || '',
          serviceMode: row.service_mode || 'Store Drop-off',
          problemDescription: row.problem_reported || '',
          address: row.address || '',
          status: (row.status || 'New Booking') as any,
          created_at: row.created_at || new Date().toISOString(),
        }))
      : [];
  } catch {
    return null;
  }
}

export async function fetchSalesInvoicesFromSupabase(): Promise<SalesInvoiceItem[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('sales_invoices').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToSalesInvoice);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/sales');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushSalesInvoiceToSupabase(s: SalesInvoiceItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const sub = Number(s.subtotal) || 0;
      const tax = Number(s.taxAmount) || 0;
      const grand = Number(s.grandTotal) || (sub + tax);
      const paid = Number(s.paidAmount) || 0;
      const due = Number(s.balanceDue) || Math.max(0, grand - paid);

      const payload: Record<string, any> = {
        id: s.id,
        invoice_number: s.invoiceNo || `INV-${Date.now().toString().slice(-4)}`,
        invoice_date: s.invoiceDate || new Date().toISOString().split('T')[0],
        customer_id: s.customerId || null,
        customer_name: s.customerName || 'Retail Customer',
        customer_phone: s.customerPhone || '+91 99999-00000',
        customer_gstin: s.customerGst || null,
        billing_address: s.customerAddress || null,
        payment_terms: s.paymentTerms || 'Immediate',
        items: Array.isArray(s.items) ? s.items : [],
        subtotal: sub,
        discount_amount: Number(s.discount) || 0,
        discount_type: s.discountType || 'fixed',
        taxable_amount: sub,
        tax_amount: tax,
        cgst_amount: Math.round(tax / 2),
        sgst_amount: Math.round(tax / 2),
        round_off_adjustment: 0,
        shipping_charges: Number(s.shippingCharges) || 0,
        grand_total: grand,
        paid_amount: paid,
        due_amount: due,
        payment_method: s.paymentMethod || 'CASH',
        payment_status: s.paymentStatus || 'Paid',
        sales_rep: 'Accno Solution',
        notes: s.remarks || null,
        show_product_remarks_on_print: Boolean(s.showProductRemarksOnPrint),
        show_refurbished_badge_on_print: Boolean(s.showRefurbishedBadgeOnPrint),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('sales_invoices').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deleteSalesInvoiceFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('sales_invoices').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/sales?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

// ----------------------------------------------------------------------
// PURCHASE INVOICES DUAL-CHANNEL SYNC
// ----------------------------------------------------------------------

export function mapRowToPurchaseInvoice(row: any): PurchaseInvoiceItem {
  return {
    id: row.id,
    billNo: row.purchase_number || '',
    billDate: row.purchase_date || '',
    vendorId: row.supplier_id || '',
    vendorName: row.supplier_name || 'Supplier',
    vendorPhone: row.vendor_phone || undefined,
    vendorGst: row.vendor_gst || undefined,
    vendorAddress: row.vendor_address || undefined,
    paymentTerms: row.payment_terms || 'Net 30',
    paymentMethod: row.payment_method || 'BANK_TRANSFER',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    freightCharges: Number(row.freight_charges) || 0,
    grandTotal: Number(row.grand_total) || 0,
    paidAmount: Number(row.paid_amount) || 0,
    balanceDue: Number(row.balance_amount) || 0,
    paymentStatus: (row.payment_status || 'Paid') as any,
    supplyType: (row.supply_type || 'INTRA_STATE') as any,
    discount: Number(row.discount) || 0,
    discountType: (row.discount_type || 'fixed') as any,
    poRefNo: row.supplier_invoice_no || '',
    showProductRemarksOnPrint: Boolean(row.show_product_remarks_on_print),
    showRefurbishedBadgeOnPrint: Boolean(row.show_refurbished_badge_on_print),
    remarks: row.notes || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchPurchaseInvoicesFromSupabase(): Promise<PurchaseInvoiceItem[] | null> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('purchase_invoices').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data.map(mapRowToPurchaseInvoice);
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/purchases');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {}
  return null;
}

export async function pushPurchaseInvoiceToSupabase(p: PurchaseInvoiceItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const sub = Number(p.subtotal) || 0;
      const tax = Number(p.taxAmount) || 0;
      const grand = Number(p.grandTotal) || (sub + tax);
      const paid = Number(p.paidAmount) || 0;
      const balance = Number(p.balanceDue) || Math.max(0, grand - paid);

      const payload: Record<string, any> = {
        id: p.id,
        purchase_number: p.billNo || `PUR-${Date.now().toString().slice(-4)}`,
        supplier_invoice_no: p.poRefNo || null,
        supplier_id: p.vendorId || null,
        supplier_name: p.vendorName || 'Supplier Vendor',
        vendor_phone: p.vendorPhone || null,
        vendor_gst: p.vendorGst || null,
        vendor_address: p.vendorAddress || null,
        payment_terms: p.paymentTerms || 'Net 30',
        purchase_date: p.billDate || new Date().toISOString().split('T')[0],
        items: Array.isArray(p.items) ? p.items : [],
        subtotal: sub,
        tax_amount: tax,
        freight_charges: Number(p.freightCharges) || 0,
        grand_total: grand,
        paid_amount: paid,
        balance_amount: balance,
        payment_status: p.paymentStatus || 'Paid',
        payment_method: p.paymentMethod || 'BANK_TRANSFER',
        supply_type: p.supplyType || 'INTRA_STATE',
        discount: Number(p.discount) || 0,
        discount_type: p.discountType || 'fixed',
        show_product_remarks_on_print: Boolean(p.showProductRemarksOnPrint),
        show_refurbished_badge_on_print: Boolean(p.showRefurbishedBadgeOnPrint),
        notes: p.remarks || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('purchase_invoices').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
    } catch {}
  }
  try {
    const res = await fetch('/api/erp/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    if (res.ok) saved = true;
  } catch {}
  return saved;
}

export async function deletePurchaseInvoiceFromSupabase(id: string): Promise<boolean> {
  let deleted = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('purchase_invoices').delete().eq('id', id);
      deleted = true;
    } catch {}
  }
  try {
    const res = await fetch(`/api/erp/purchases?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {}
  return deleted;
}

export async function fetchBlogPostsFromSupabase(): Promise<BlogPostItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

export async function fetchMilestonesFromSupabase(): Promise<MilestoneItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('milestones').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

export function mapRowToEmployee(row: any): EmployeeItem {
  return {
    id: row.id || `emp-${Date.now()}`,
    empCode: row.emp_code || '',
    name: row.name || '',
    phone: row.phone || '',
    alternatePhone: row.alternate_phone || '',
    email: row.email || '',
    password: row.password_hash_or_plain || '',
    address: row.address || '',
    department: row.department || 'Admin',
    designation: row.designation || 'Admin',
    baseSalary: Number(row.base_salary) || 0,
    joiningDate: row.joining_date || new Date().toISOString().split('T')[0],
    emergencyContactName: row.emergency_contact_name || '',
    emergencyContactPhone: row.emergency_contact_phone || '',
    govtIdType: row.govt_id_type || 'Aadhaar Card',
    govtIdNumber: row.govt_id_number || '',
    idAttachment: row.id_attachment || '',
    activeStatus: row.active_status || 'Active',
    role: row.role || 'Admin',
    permissions: row.permissions || adminEmployeePermissions,
    bankAccountName: row.bank_account_name || '',
    bankAccountNumber: row.bank_account_number || '',
    bankName: row.bank_name || '',
    bankBranch: row.bank_branch || '',
    bankBranchCode: row.bank_branch_code || '',
    bankIfscCode: row.bank_ifsc_code || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchEmployeesFromSupabase(): Promise<EmployeeItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('emp_code', { ascending: true });
    if (error) {
      console.warn('fetchEmployeesFromSupabase error:', error);
      return null;
    }
    return Array.isArray(data) ? data.map(mapRowToEmployee) : [];
  } catch (err) {
    console.warn('fetchEmployeesFromSupabase exception:', err);
    return null;
  }
}

export async function pushEmployeeToSupabase(emp: EmployeeItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: emp.id || `emp-${Date.now()}`,
      code: emp.empCode.trim().toUpperCase(),
      emp_code: emp.empCode.trim().toUpperCase(),
      name: emp.name.trim(),
      phone: emp.phone || '',
      alternate_phone: emp.alternatePhone || '',
      emergency_contact_name: emp.emergencyContactName || null,
      emergency_contact_phone: emp.emergencyContactPhone || null,
      email: emp.email || '',
      password_hash_or_plain: emp.password || '',
      address: emp.address || '',
      department: emp.department || 'Admin',
      designation: emp.designation || 'Admin',
      base_salary: Number(emp.baseSalary) || 0,
      joining_date: emp.joiningDate || new Date().toISOString().split('T')[0],
      active_status: emp.activeStatus || 'Active',
      govt_id_type: emp.govtIdType || 'Aadhaar Card',
      govt_id_number: emp.govtIdNumber || '',
      id_attachment: emp.idAttachment || '',
      bank_account_name: emp.bankAccountName || '',
      bank_account_number: emp.bankAccountNumber || '',
      bank_name: emp.bankName || '',
      bank_branch: emp.bankBranch || '',
      bank_branch_code: emp.bankBranchCode || '',
      bank_ifsc_code: emp.bankIfscCode || '',
      role: emp.role || 'Admin',
      permissions: emp.permissions || {},
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('employees').upsert(payload, { onConflict: 'emp_code' });
    if (error) {
      console.warn('pushEmployeeToSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('pushEmployeeToSupabase exception:', err);
    return false;
  }
}

export async function deleteEmployeeFromSupabase(id: string, empCode?: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    let query = supabase.from('employees').delete();
    if (empCode && id) {
      query = query.or(`id.eq.${id},emp_code.eq.${empCode.trim().toUpperCase()}`);
    } else if (empCode) {
      query = query.eq('emp_code', empCode.trim().toUpperCase());
    } else {
      query = query.eq('id', id);
    }
    const { error } = await query;
    if (error) {
      console.warn('deleteEmployeeFromSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('deleteEmployeeFromSupabase exception:', err);
    return false;
  }
}

// ============================================================================
// SALES RETURNS CLOUD SYNC
// ============================================================================
export function mapRowToSalesReturn(row: any): SalesReturnItem {
  return {
    id: row.id || `sr-${Date.now()}`,
    returnNo: row.return_no || '',
    returnDate: row.return_date || new Date().toISOString().split('T')[0],
    originalInvoiceNo: row.original_invoice_no || '',
    customerId: row.customer_id || '',
    customerName: row.customer_name || 'Customer',
    customerPhone: row.customer_phone || '',
    customerGst: row.customer_gst || '',
    customerAddress: row.customer_address || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    grandTotal: Number(row.grand_total) || 0,
    returnReason: row.return_reason || '',
    restockToStock: Boolean(row.restock_to_stock),
    refundStatus: (row.refund_status || 'Refunded') as any,
    remarks: row.remarks || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchSalesReturnsFromSupabase(): Promise<SalesReturnItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('sales_returns').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('fetchSalesReturnsFromSupabase error:', error);
      return null;
    }
    return Array.isArray(data) ? data.map(mapRowToSalesReturn) : [];
  } catch (err) {
    console.warn('fetchSalesReturnsFromSupabase exception:', err);
    return null;
  }
}

export async function pushSalesReturnToSupabase(ret: SalesReturnItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload = {
        id: ret.id || `sr-${Date.now()}`,
        return_no: ret.returnNo.trim(),
        return_date: ret.returnDate || new Date().toISOString().split('T')[0],
        original_invoice_no: ret.originalInvoiceNo || null,
        customer_id: ret.customerId || 'walkin',
        customer_name: ret.customerName.trim(),
        customer_phone: ret.customerPhone || null,
        customer_gst: ret.customerGst || null,
        customer_address: ret.customerAddress || null,
        items: ret.items || [],
        subtotal: Number(ret.subtotal) || 0,
        tax_amount: Number(ret.taxAmount) || 0,
        grand_total: Number(ret.grandTotal) || 0,
        return_reason: ret.returnReason || 'Customer Return',
        restock_to_stock: ret.restockToStock ?? true,
        refund_status: ret.refundStatus || 'Refunded',
        remarks: ret.remarks || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('sales_returns').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
      else console.warn('pushSalesReturnToSupabase direct error:', error);
    } catch {}
  }
  return saved;
}

export async function deleteSalesReturnFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('sales_returns').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// PURCHASE RETURNS CLOUD SYNC
// ============================================================================
export function mapRowToPurchaseReturn(row: any): PurchaseReturnItem {
  return {
    id: row.id || `pr-${Date.now()}`,
    returnNo: row.return_no || '',
    returnDate: row.return_date || new Date().toISOString().split('T')[0],
    originalBillNo: row.original_bill_no || '',
    vendorId: row.vendor_id || '',
    vendorName: row.vendor_name || 'Vendor',
    vendorPhone: row.vendor_phone || '',
    vendorGst: row.vendor_gst || '',
    vendorAddress: row.vendor_address || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    grandTotal: Number(row.grand_total) || 0,
    returnReason: row.return_reason || '',
    deductFromStock: Boolean(row.deduct_from_stock),
    rmaStatus: (row.rma_status || 'Completed') as any,
    remarks: row.remarks || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchPurchaseReturnsFromSupabase(): Promise<PurchaseReturnItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('purchase_returns').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('fetchPurchaseReturnsFromSupabase error:', error);
      return null;
    }
    return Array.isArray(data) ? data.map(mapRowToPurchaseReturn) : [];
  } catch (err) {
    console.warn('fetchPurchaseReturnsFromSupabase exception:', err);
    return null;
  }
}

export async function pushPurchaseReturnToSupabase(ret: PurchaseReturnItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload = {
        id: ret.id || `pr-${Date.now()}`,
        return_no: ret.returnNo.trim(),
        return_date: ret.returnDate || new Date().toISOString().split('T')[0],
        original_bill_no: ret.originalBillNo || null,
        vendor_id: ret.vendorId || 'standard-vendor',
        vendor_name: ret.vendorName.trim(),
        vendor_phone: ret.vendorPhone || null,
        vendor_gst: ret.vendorGst || null,
        vendor_address: ret.vendorAddress || null,
        items: ret.items || [],
        subtotal: Number(ret.subtotal) || 0,
        tax_amount: Number(ret.taxAmount) || 0,
        grand_total: Number(ret.grandTotal) || 0,
        return_reason: ret.returnReason || 'Defective Stock Return',
        deduct_from_stock: ret.deductFromStock ?? true,
        rma_status: ret.rmaStatus || 'Completed',
        remarks: ret.remarks || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('purchase_returns').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
      else console.warn('pushPurchaseReturnToSupabase error:', error);
    } catch {}
  }
  return saved;
}

export async function deletePurchaseReturnFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('purchase_returns').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// QUOTATIONS CLOUD SYNC
// ============================================================================
export function mapRowToQuotation(row: any): QuotationItem {
  return {
    id: row.id || `qtn-${Date.now()}`,
    quotationNo: row.quotation_no || '',
    quotationDate: row.quotation_date || new Date().toISOString().split('T')[0],
    validUntil: row.valid_until || '',
    customerId: row.customer_id || '',
    customerName: row.customer_name || 'Customer',
    customerPhone: row.customer_phone || '',
    customerGst: row.customer_gst || '',
    customerAddress: row.customer_address || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    grandTotal: Number(row.grand_total) || 0,
    status: (row.status || 'Draft') as any,
    termsAndConditions: row.terms_and_conditions || '',
    notes: row.notes || '',
    convertedInvoiceNo: row.converted_invoice_no || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchQuotationsFromSupabase(): Promise<QuotationItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('quotations').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('fetchQuotationsFromSupabase error:', error);
      return null;
    }
    return Array.isArray(data) ? data.map(mapRowToQuotation) : [];
  } catch (err) {
    console.warn('fetchQuotationsFromSupabase exception:', err);
    return null;
  }
}

export async function pushQuotationToSupabase(q: QuotationItem): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload = {
        id: q.id || `qtn-${Date.now()}`,
        quotation_no: q.quotationNo.trim(),
        quotation_date: q.quotationDate || new Date().toISOString().split('T')[0],
        valid_until: q.validUntil || null,
        customer_id: q.customerId || 'walkin',
        customer_name: q.customerName.trim(),
        customer_phone: q.customerPhone || null,
        customer_gst: q.customerGst || null,
        customer_address: q.customerAddress || null,
        items: q.items || [],
        subtotal: Number(q.subtotal) || 0,
        discount: Number(q.discount) || 0,
        tax_amount: Number(q.taxAmount) || 0,
        grand_total: Number(q.grandTotal) || 0,
        status: q.status || 'Draft',
        terms_and_conditions: q.termsAndConditions || null,
        notes: q.notes || null,
        converted_invoice_no: q.convertedInvoiceNo || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('quotations').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
      else console.warn('pushQuotationToSupabase error:', error);
    } catch {}
  }
  return saved;
}

export async function deleteQuotationFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('quotations').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// ACCOUNTING VOUCHERS CLOUD SYNC
// ============================================================================
export function mapRowToAccountingVoucher(row: any): AccountingVoucher {
  return {
    id: row.id || `vch-${Date.now()}`,
    voucherNumber: row.voucher_number || '',
    voucherType: (row.voucher_type || 'PAYMENT') as any,
    voucherDate: row.voucher_date || new Date().toISOString().split('T')[0],
    partyName: row.party_name || '',
    partyPhone: row.party_phone || '',
    partyGst: row.party_gst || '',
    refInvoiceNumber: row.ref_invoice_number || '',
    paymentMode: (row.payment_mode || 'Cash') as any,
    instrumentRefNo: row.instrument_ref_no || '',
    debitLedger: row.debit_ledger || '',
    creditLedger: row.credit_ledger || '',
    amount: Number(row.amount) || 0,
    gstAmount: Number(row.gst_amount) || 0,
    totalAmount: Number(row.total_amount) || 0,
    journalLines: Array.isArray(row.journal_lines) ? row.journal_lines : [],
    narration: row.narration || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchAccountingVouchersFromSupabase(): Promise<AccountingVoucher[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('accounting_vouchers').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('fetchAccountingVouchersFromSupabase error:', error);
      return null;
    }
    return Array.isArray(data) ? data.map(mapRowToAccountingVoucher) : [];
  } catch (err) {
    console.warn('fetchAccountingVouchersFromSupabase exception:', err);
    return null;
  }
}

export async function pushAccountingVoucherToSupabase(v: AccountingVoucher): Promise<boolean> {
  let saved = false;
  if (supabase && isSupabaseConfigured()) {
    try {
      const payload = {
        id: v.id || `vch-${Date.now()}`,
        voucher_number: v.voucherNumber.trim(),
        voucher_type: v.voucherType,
        voucher_date: v.voucherDate || new Date().toISOString().split('T')[0],
        party_name: v.partyName || null,
        party_phone: v.partyPhone || null,
        party_gst: v.partyGst || null,
        ref_invoice_number: v.refInvoiceNumber || null,
        payment_mode: v.paymentMode || 'Cash',
        instrument_ref_no: v.instrumentRefNo || null,
        debit_ledger: v.debitLedger || null,
        credit_ledger: v.creditLedger || null,
        amount: Number(v.amount) || 0,
        gst_amount: Number(v.gstAmount) || 0,
        total_amount: Number(v.totalAmount) || 0,
        journal_lines: v.journalLines || [],
        narration: v.narration || '',
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('accounting_vouchers').upsert(payload, { onConflict: 'id' });
      if (!error) saved = true;
      else console.warn('pushAccountingVoucherToSupabase error:', error);
    } catch {}
  }
  return saved;
}

export async function deleteAccountingVoucherFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('accounting_vouchers').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// ACCOUNT LEDGERS CLOUD SYNC
// ============================================================================
export function mapRowToAccountLedger(row: any): AccountLedgerItem {
  return {
    id: row.id || `ldg-${Date.now()}`,
    accountName: row.account_name || 'Account Ledger',
    groupType: (row.group_type || 'Expense') as any,
    openingBalance: Number(row.opening_balance) || 0,
    balanceType: (row.balance_type || 'Dr') as any,
    bankName: row.bank_name || '',
    accountNumber: row.account_number || '',
    ifscCode: row.ifsc_code || '',
    branchName: row.branch_name || '',
    remarks: row.remarks || '',
    activeStatus: (row.active_status || 'Active') as any,
    created_at: row.created_at || new Date().toISOString().split('T')[0],
  };
}

export async function fetchAccountLedgersFromSupabase(): Promise<AccountLedgerItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('account_ledgers').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data.map(mapRowToAccountLedger) : [];
  } catch {
    return null;
  }
}

export async function pushAccountLedgerToSupabase(l: AccountLedgerItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: l.id || `ldg-${Date.now()}`,
      account_name: l.accountName.trim(),
      group_type: l.groupType || 'Expense',
      opening_balance: Number(l.openingBalance) || 0,
      balance_type: l.balanceType || 'Dr',
      bank_name: l.bankName || null,
      account_number: l.accountNumber || null,
      ifsc_code: l.ifscCode || null,
      branch_name: l.branchName || null,
      remarks: l.remarks || null,
      active_status: l.activeStatus || 'Active',
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('account_ledgers').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAccountLedgerFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('account_ledgers').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// HSN CODES CLOUD SYNC
// ============================================================================
export function mapRowToHsnMaster(row: any): HsnMasterItem {
  return {
    hsnCode: row.hsn_code || '',
    gstRate: Number(row.gst_rate) || 18,
    description: row.description || '',
  };
}

export async function fetchHsnMasterFromSupabase(): Promise<HsnMasterItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('hsn_master').select('*').order('hsn_code', { ascending: true });
    if (error) return null;
    return Array.isArray(data) ? data.map(mapRowToHsnMaster) : [];
  } catch {
    return null;
  }
}

export async function pushHsnMasterToSupabase(h: HsnMasterItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      hsn_code: h.hsnCode.trim(),
      gst_rate: Number(h.gstRate) || 18,
      description: h.description || '',
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('hsn_master').upsert(payload, { onConflict: 'hsn_code' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteHsnMasterFromSupabase(hsnCode: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('hsn_master').delete().eq('hsn_code', hsnCode);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// WEBSITE LEADS DELETE ACTIONS
// ============================================================================
export async function deleteSupportLeadFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('support_leads').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteBookRepairLeadFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('book_repair_leads').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// BLOG POSTS CLOUD SYNC
// ============================================================================
export async function pushBlogPostToSupabase(post: BlogPostItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: post.id || `blog-${Date.now()}`,
      slug: post.slug.trim(),
      title: post.title.trim(),
      category: post.category || 'General',
      author: post.author || 'Accno Team',
      date: post.date || new Date().toISOString().split('T')[0],
      read_time: post.readTime || '5 min read',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.coverImage || '',
      image_position: post.imagePosition || 'top',
      status: post.status || 'Published',
      featured: Boolean(post.featured),
      views: Number(post.views) || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('blog_posts').upsert(payload, { onConflict: 'slug' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// MILESTONES CLOUD SYNC
// ============================================================================
export async function pushMilestoneToSupabase(m: MilestoneItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: m.id || `m-${Date.now()}`,
      year: m.year,
      title: m.title.trim(),
      description: m.description,
      status: m.status || 'Completed',
      display_order: m.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('milestones').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteMilestoneFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('milestones').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// HARDWARE REPAIR CATALOG CLOUD SYNC
// ============================================================================
export async function fetchHardwareRepairCatalogFromSupabase(): Promise<HardwareRepairCatalogItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('hardware_repair_catalog').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      estPrice: row.est_price,
      desc: row.description || '',
      warrantyDays: row.warranty_days || 30,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushHardwareRepairCatalogToSupabase(item: HardwareRepairCatalogItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `rep-${Date.now()}`,
      category: item.category,
      title: item.title,
      est_price: item.estPrice,
      description: item.desc,
      warranty_days: item.warrantyDays || 30,
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('hardware_repair_catalog').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteHardwareRepairCatalogFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('hardware_repair_catalog').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// REPAIR PROCESS STEPS (SOP) CLOUD SYNC
// ============================================================================
export async function fetchRepairProcessStepsFromSupabase(): Promise<RepairProcessStepItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('repair_process_steps').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      step: row.step,
      title: row.title,
      desc: row.description,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushRepairProcessStepToSupabase(step: RepairProcessStepItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: step.id || `step-${Date.now()}`,
      step: step.step,
      title: step.title,
      description: step.desc,
      display_order: step.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('repair_process_steps').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteRepairProcessStepFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('repair_process_steps').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// ACHIEVEMENT COUNTER STATS CLOUD SYNC
// ============================================================================
export async function fetchAchievementStatsFromSupabase(): Promise<AchievementStatItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('achievement_stats').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      description: row.description || '',
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushAchievementStatToSupabase(stat: AchievementStatItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: stat.id || `stat-${Date.now()}`,
      label: stat.label,
      value: stat.value,
      description: stat.description || null,
      display_order: stat.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('achievement_stats').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAchievementStatFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('achievement_stats').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// LEADERSHIP TEAM CLOUD SYNC
// ============================================================================
export async function fetchLeadershipTeamFromSupabase(): Promise<LeadershipTeamMember[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('leadership_team').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      experienceBio: row.experience_bio || '',
      photoUrl: row.photo_url || '',
      initials: row.initials || '',
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushLeadershipTeamToSupabase(member: LeadershipTeamMember): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: member.id || `lead-${Date.now()}`,
      name: member.name,
      role: member.role,
      experience_bio: member.experienceBio || '',
      photo_url: member.photoUrl || '',
      initials: member.initials || '',
      display_order: member.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('leadership_team').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteLeadershipTeamFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('leadership_team').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// ENTERPRISE SOLUTIONS CLOUD SYNC
// ============================================================================
export async function fetchEnterpriseSolutionsFromSupabase(): Promise<EnterpriseSolutionItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('enterprise_solutions').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      desc: row.description,
      badge: row.badge || '',
      link: row.link || '',
      iconName: row.icon_name || '',
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushEnterpriseSolutionToSupabase(item: EnterpriseSolutionItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `sol-${Date.now()}`,
      title: item.title,
      description: item.desc,
      badge: item.badge || '',
      link: item.link || '',
      icon_name: item.iconName || '',
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('enterprise_solutions').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteEnterpriseSolutionFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('enterprise_solutions').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// DETAILED SERVICES CLOUD SYNC
// ============================================================================
export async function fetchDetailedServicesFromSupabase(): Promise<DetailedServiceItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('detailed_services').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      category: row.category,
      badge: row.badge || '',
      iconName: row.icon_name || '',
      title: row.title,
      shortDesc: row.short_desc,
      whyChoose: row.why_choose || '',
      features: Array.isArray(row.features) ? row.features : [],
      idealFor: row.ideal_for || '',
      turnaround: row.turnaround || '',
      warranty: row.warranty || '',
      actionLink: row.action_link || '',
      actionText: row.action_text || '',
      isVisible: row.is_visible ?? true,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushDetailedServiceToSupabase(item: DetailedServiceItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `srv-${Date.now()}`,
      category: item.category,
      badge: item.badge || '',
      icon_name: item.iconName || '',
      title: item.title,
      short_desc: item.shortDesc,
      why_choose: item.whyChoose || '',
      features: item.features || [],
      ideal_for: item.idealFor || '',
      turnaround: item.turnaround || '',
      warranty: item.warranty || '',
      action_link: item.actionLink || '',
      action_text: item.actionText || '',
      is_visible: item.isVisible ?? true,
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('detailed_services').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteDetailedServiceFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('detailed_services').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// SERVICE STATS, PILLARS & FAQS CLOUD SYNC
// ============================================================================
export async function fetchServiceStatsFromSupabase(): Promise<ServiceStatItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('service_stats').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      value: row.value,
      label: row.label,
      color: row.color || '',
      isVisible: row.is_visible ?? true,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushServiceStatToSupabase(item: ServiceStatItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `sstat-${Date.now()}`,
      value: item.value,
      label: item.label,
      color: item.color || null,
      is_visible: item.isVisible ?? true,
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('service_stats').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteServiceStatFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('service_stats').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchServicePillarsFromSupabase(): Promise<ServicePillarItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('service_pillars').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      iconName: row.icon_name || '',
      title: row.title,
      desc: row.description,
      badge: row.badge || '',
      isVisible: row.is_visible ?? true,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushServicePillarToSupabase(item: ServicePillarItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `pillar-${Date.now()}`,
      icon_name: item.iconName || '',
      title: item.title,
      description: item.desc,
      badge: item.badge || '',
      is_visible: item.isVisible ?? true,
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('service_pillars').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteServicePillarFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('service_pillars').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchServicesFaqsFromSupabase(): Promise<ServicesFaqItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('services_faqs').select('*').order('display_order', { ascending: true });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category || 'General',
      isVisible: row.is_visible ?? true,
      order: row.display_order || 0,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushServicesFaqToSupabase(item: ServicesFaqItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `faq-${Date.now()}`,
      question: item.question,
      answer: item.answer,
      category: item.category || 'General',
      is_visible: item.isVisible ?? true,
      display_order: item.order || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('services_faqs').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteServicesFaqFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('services_faqs').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// WEBSITE PROMOTIONS CLOUD SYNC
// ============================================================================
export async function fetchWebsitePromotionsFromSupabase(): Promise<WebsitePromotionItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('website_promotions').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category || 'Announcement',
      text: row.text,
      badgeText: row.badge_text || '',
      actionText: row.action_text || '',
      actionLink: row.action_link || '',
      theme: (row.theme || 'emerald') as any,
      isDismissible: row.is_dismissible ?? true,
      isActive: row.is_active ?? true,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function pushWebsitePromotionToSupabase(item: WebsitePromotionItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id || `promo-${Date.now()}`,
      title: item.title,
      category: item.category || 'Announcement',
      text: item.text,
      badge_text: item.badgeText || '',
      action_text: item.actionText || '',
      action_link: item.actionLink || '',
      theme: item.theme || 'emerald',
      is_dismissible: item.isDismissible ?? true,
      is_active: item.isActive ?? true,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('website_promotions').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteWebsitePromotionFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('website_promotions').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// COMPANY SETTINGS & MASTER RULES CONFIGURATION CLOUD SYNC
// ============================================================================
export async function fetchCompanySettingsFromSupabase(): Promise<any | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('company_settings').select('*').eq('settings_key', 'global_settings').single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function pushCompanySettingsToSupabase(field: string, data: any): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const payload: any = {
      settings_key: 'global_settings',
      [field]: data,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('company_settings').upsert(payload, { onConflict: 'settings_key' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync entire ERP state exclusively from Supabase Cloud across ALL modules
 */
export async function syncEntireErpWithSupabase(store: any) {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    const [
      tickets,
      invoices,
      customers,
      inventory,
      vendors,
      outsource,
      dataRecovery,
      amc,
      supportLeads,
      bookLeads,
      salesInvoices,
      purchaseInvoices,
      salesReturns,
      purchaseReturns,
      quotations,
      accountingVouchers,
      customLedgers,
      hsnCodes,
      blogs,
      milestones,
      employees,
      hardwareCatalog,
      repairSteps,
      achievementStats,
      leadershipTeam,
      enterpriseSolutions,
      detailedServices,
      serviceStats,
      servicePillars,
      servicesFaqs,
      websitePromotions,
      companySettings,
    ] = await Promise.all([
      fetchTicketsFromSupabase(),
      fetchInvoicesFromSupabase(),
      fetchCustomersFromSupabase(),
      fetchInventoryFromSupabase(),
      fetchVendorsFromSupabase(),
      fetchOutsourceVouchersFromSupabase(),
      fetchDataRecoveryFromSupabase(),
      fetchAmcContractsFromSupabase(),
      fetchSupportLeadsFromSupabase(),
      fetchBookRepairLeadsFromSupabase(),
      fetchSalesInvoicesFromSupabase(),
      fetchPurchaseInvoicesFromSupabase(),
      fetchSalesReturnsFromSupabase(),
      fetchPurchaseReturnsFromSupabase(),
      fetchQuotationsFromSupabase(),
      fetchAccountingVouchersFromSupabase(),
      fetchAccountLedgersFromSupabase(),
      fetchHsnMasterFromSupabase(),
      fetchBlogPostsFromSupabase(),
      fetchMilestonesFromSupabase(),
      fetchEmployeesFromSupabase(),
      fetchHardwareRepairCatalogFromSupabase(),
      fetchRepairProcessStepsFromSupabase(),
      fetchAchievementStatsFromSupabase(),
      fetchLeadershipTeamFromSupabase(),
      fetchEnterpriseSolutionsFromSupabase(),
      fetchDetailedServicesFromSupabase(),
      fetchServiceStatsFromSupabase(),
      fetchServicePillarsFromSupabase(),
      fetchServicesFaqsFromSupabase(),
      fetchWebsitePromotionsFromSupabase(),
      fetchCompanySettingsFromSupabase(),
    ]);

    if (Array.isArray(tickets) && store.setTickets) store.setTickets(tickets);
    if (Array.isArray(invoices) && store.setRepairInvoices) store.setRepairInvoices(invoices);
    if (Array.isArray(customers) && store.setCustomers) store.setCustomers(customers);
    if (Array.isArray(inventory) && store.setInventory) store.setInventory(inventory);
    if (Array.isArray(vendors) && store.setVendors) store.setVendors(vendors);
    if (Array.isArray(outsource) && store.setOutsourceVouchers) store.setOutsourceVouchers(outsource);
    if (Array.isArray(dataRecovery) && store.setDataRecoveryCases) store.setDataRecoveryCases(dataRecovery);
    if (Array.isArray(amc) && store.setAmcContracts) store.setAmcContracts(amc);
    if (Array.isArray(supportLeads) && store.setSupportLeads) store.setSupportLeads(supportLeads);
    if (Array.isArray(bookLeads) && store.setBookRepairLeads) store.setBookRepairLeads(bookLeads);
    if (Array.isArray(salesInvoices) && store.setSalesInvoices) store.setSalesInvoices(salesInvoices);
    if (Array.isArray(purchaseInvoices) && store.setPurchaseInvoices) store.setPurchaseInvoices(purchaseInvoices);
    if (Array.isArray(salesReturns) && store.salesReturns && store.setSalesReturns) store.setSalesReturns(salesReturns);
    if (Array.isArray(purchaseReturns) && store.purchaseReturns && store.setPurchaseReturns) store.setPurchaseReturns(purchaseReturns);
    if (Array.isArray(quotations) && store.quotations && store.setQuotations) store.setQuotations(quotations);
    if (Array.isArray(accountingVouchers) && store.accountingVouchers && store.setAccountingVouchers) store.setAccountingVouchers(accountingVouchers);
    if (Array.isArray(customLedgers) && store.customLedgers && store.setCustomLedgers) store.setCustomLedgers(customLedgers);
    if (Array.isArray(hsnCodes) && store.hsnCodes && store.setHsnCodes) store.setHsnCodes(hsnCodes);
    if (Array.isArray(blogs) && store.setBlogPosts) store.setBlogPosts(blogs);
    if (Array.isArray(milestones) && store.setMilestones) store.setMilestones(milestones);
    if (Array.isArray(employees) && store.setEmployees) store.setEmployees(employees);
    if (Array.isArray(hardwareCatalog) && store.setHardwareRepairCatalog) store.setHardwareRepairCatalog(hardwareCatalog);
    if (Array.isArray(repairSteps) && store.setRepairProcessSteps) store.setRepairProcessSteps(repairSteps);
    if (Array.isArray(achievementStats) && store.setAchievementStats) store.setAchievementStats(achievementStats);
    if (Array.isArray(leadershipTeam) && store.setLeadershipMembers) store.setLeadershipMembers(leadershipTeam);
    if (Array.isArray(enterpriseSolutions) && store.setEnterpriseSolutions) store.setEnterpriseSolutions(enterpriseSolutions);
    if (Array.isArray(detailedServices) && store.setDetailedServices) store.setDetailedServices(detailedServices);
    if (Array.isArray(serviceStats) && store.setServiceStats) store.setServiceStats(serviceStats);
    if (Array.isArray(servicePillars) && store.setServicePillars) store.setServicePillars(servicePillars);
    if (Array.isArray(servicesFaqs) && store.setServicesFaqs) store.setServicesFaqs(servicesFaqs);
    if (Array.isArray(websitePromotions) && store.setWebsitePromotions) store.setWebsitePromotions(websitePromotions);

    if (companySettings) {
      if (companySettings.company_details && store.updateCompanyDetails) store.updateCompanyDetails(companySettings.company_details);
      if (companySettings.customer_rules && store.updateCustomerRules) store.updateCustomerRules(companySettings.customer_rules);
      if (companySettings.vendor_rules && store.updateVendorRules) store.updateVendorRules(companySettings.vendor_rules);
      if (companySettings.inventory_rules && store.updateInventoryRules) store.updateInventoryRules(companySettings.inventory_rules);
      if (companySettings.repair_billing_rules && store.updateRepairBillingRules) store.updateRepairBillingRules(companySettings.repair_billing_rules);
      if (companySettings.outsource_rules && store.updateOutsourceRules) store.updateOutsourceRules(companySettings.outsource_rules);
      if (companySettings.pos_rules && store.updatePosRules) store.updatePosRules(companySettings.pos_rules);
      if (companySettings.sale_rules && store.updateSaleRules) store.updateSaleRules(companySettings.sale_rules);
      if (companySettings.purchase_rules && store.updatePurchaseRules) store.updatePurchaseRules(companySettings.purchase_rules);
      if (companySettings.sales_return_rules && store.updateSalesReturnRules) store.updateSalesReturnRules(companySettings.sales_return_rules);
      if (companySettings.purchase_return_rules && store.updatePurchaseReturnRules) store.updatePurchaseReturnRules(companySettings.purchase_return_rules);
      if (companySettings.quotation_rules && store.updateQuotationRules) store.updateQuotationRules(companySettings.quotation_rules);
      if (companySettings.voucher_rules && store.updateVoucherRules) store.updateVoucherRules(companySettings.voucher_rules);
      if (companySettings.amc_rules && store.updateAmcRules) store.updateAmcRules(companySettings.amc_rules);
      if (companySettings.employee_rules && store.updateEmployeeRules) store.updateEmployeeRules(companySettings.employee_rules);
      if (companySettings.website_promotion_bar && store.updateWebsitePromotionBar) store.updateWebsitePromotionBar(companySettings.website_promotion_bar);
    }
  } catch (err) {
    console.warn('Sync entire ERP with Supabase failed:', err);
  }
}


/**
 * Push all local store data for all 30 modules into Supabase tables
 */
export async function pushAllStoreDataToSupabase(store: any): Promise<{ success: boolean; pushedCounts: Record<string, number> }> {
  const counts: Record<string, number> = {};

  try {
    if (Array.isArray(store.tickets)) {
      counts.tickets = 0;
      for (const t of store.tickets) {
        const ok = await pushTicketToSupabase(t);
        if (ok) counts.tickets++;
      }
    }
    if (Array.isArray(store.repairInvoices)) {
      counts.repairInvoices = 0;
      for (const inv of store.repairInvoices) {
        const ok = await pushInvoiceToSupabase(inv);
        if (ok) counts.repairInvoices++;
      }
    }
    if (Array.isArray(store.customers)) {
      counts.customers = 0;
      for (const c of store.customers) {
        const ok = await pushCustomerToSupabase(c);
        if (ok) counts.customers++;
      }
    }
    if (Array.isArray(store.employees)) {
      counts.employees = 0;
      for (const e of store.employees) {
        const ok = await pushEmployeeToSupabase(e);
        if (ok) counts.employees++;
      }
    }
    if (Array.isArray(store.inventory)) {
      counts.inventory = 0;
      for (const i of store.inventory) {
        const ok = await pushInventoryToSupabase(i);
        if (ok) counts.inventory++;
      }
    }
    if (Array.isArray(store.vendors)) {
      counts.vendors = 0;
      for (const v of store.vendors) {
        const ok = await pushVendorToSupabase(v);
        if (ok) counts.vendors++;
      }
    }
    if (Array.isArray(store.outsourceVouchers)) {
      counts.outsourceVouchers = 0;
      for (const o of store.outsourceVouchers) {
        const ok = await pushOutsourceVoucherToSupabase(o);
        if (ok) counts.outsourceVouchers++;
      }
    }
    if (Array.isArray(store.dataRecoveryCases)) {
      counts.dataRecoveryCases = 0;
      for (const dr of store.dataRecoveryCases) {
        const ok = await pushDataRecoveryToSupabase(dr);
        if (ok) counts.dataRecoveryCases++;
      }
    }
    if (Array.isArray(store.amcContracts)) {
      counts.amcContracts = 0;
      for (const a of store.amcContracts) {
        const ok = await pushAmcContractToSupabase(a);
        if (ok) counts.amcContracts++;
      }
    }
    if (Array.isArray(store.salesInvoices)) {
      counts.salesInvoices = 0;
      for (const s of store.salesInvoices) {
        const ok = await pushSalesInvoiceToSupabase(s);
        if (ok) counts.salesInvoices++;
      }
    }
    if (Array.isArray(store.purchaseInvoices)) {
      counts.purchaseInvoices = 0;
      for (const p of store.purchaseInvoices) {
        const ok = await pushPurchaseInvoiceToSupabase(p);
        if (ok) counts.purchaseInvoices++;
      }
    }
    if (Array.isArray(store.salesReturns)) {
      counts.salesReturns = 0;
      for (const sr of store.salesReturns) {
        const ok = await pushSalesReturnToSupabase(sr);
        if (ok) counts.salesReturns++;
      }
    }
    if (Array.isArray(store.purchaseReturns)) {
      counts.purchaseReturns = 0;
      for (const pr of store.purchaseReturns) {
        const ok = await pushPurchaseReturnToSupabase(pr);
        if (ok) counts.purchaseReturns++;
      }
    }
    if (Array.isArray(store.quotations)) {
      counts.quotations = 0;
      for (const q of store.quotations) {
        const ok = await pushQuotationToSupabase(q);
        if (ok) counts.quotations++;
      }
    }
    if (Array.isArray(store.accountingVouchers)) {
      counts.accountingVouchers = 0;
      for (const av of store.accountingVouchers) {
        const ok = await pushAccountingVoucherToSupabase(av);
        if (ok) counts.accountingVouchers++;
      }
    }
    if (Array.isArray(store.customLedgers)) {
      counts.customLedgers = 0;
      for (const cl of store.customLedgers) {
        const ok = await pushAccountLedgerToSupabase(cl);
        if (ok) counts.customLedgers++;
      }
    }
    if (Array.isArray(store.hsnCodes)) {
      counts.hsnCodes = 0;
      for (const h of store.hsnCodes) {
        const ok = await pushHsnMasterToSupabase(h);
        if (ok) counts.hsnCodes++;
      }
    }
    if (Array.isArray(store.supportLeads)) {
      counts.supportLeads = 0;
      for (const sl of store.supportLeads) {
        const ok = await pushSupportLeadToSupabase(sl);
        if (ok) counts.supportLeads++;
      }
    }
    if (Array.isArray(store.bookRepairLeads)) {
      counts.bookRepairLeads = 0;
      for (const br of store.bookRepairLeads) {
        const ok = await pushBookRepairLeadToSupabase(br);
        if (ok) counts.bookRepairLeads++;
      }
    }
    if (Array.isArray(store.blogPosts)) {
      counts.blogPosts = 0;
      for (const bp of store.blogPosts) {
        const ok = await pushBlogPostToSupabase(bp);
        if (ok) counts.blogPosts++;
      }
    }
    if (Array.isArray(store.milestones)) {
      counts.milestones = 0;
      for (const m of store.milestones) {
        const ok = await pushMilestoneToSupabase(m);
        if (ok) counts.milestones++;
      }
    }
    if (Array.isArray(store.achievementStats)) {
      counts.achievementStats = 0;
      for (const ast of store.achievementStats) {
        const ok = await pushAchievementStatToSupabase(ast);
        if (ok) counts.achievementStats++;
      }
    }
    if (Array.isArray(store.leadershipMembers)) {
      counts.leadershipMembers = 0;
      for (const lm of store.leadershipMembers) {
        const ok = await pushLeadershipTeamToSupabase(lm);
        if (ok) counts.leadershipMembers++;
      }
    }
    if (Array.isArray(store.hardwareRepairCatalog)) {
      counts.hardwareRepairCatalog = 0;
      for (const hc of store.hardwareRepairCatalog) {
        const ok = await pushHardwareRepairCatalogToSupabase(hc);
        if (ok) counts.hardwareRepairCatalog++;
      }
    }
    if (Array.isArray(store.repairProcessSteps)) {
      counts.repairProcessSteps = 0;
      for (const rp of store.repairProcessSteps) {
        const ok = await pushRepairProcessStepToSupabase(rp);
        if (ok) counts.repairProcessSteps++;
      }
    }
    if (Array.isArray(store.enterpriseSolutions)) {
      counts.enterpriseSolutions = 0;
      for (const es of store.enterpriseSolutions) {
        const ok = await pushEnterpriseSolutionToSupabase(es);
        if (ok) counts.enterpriseSolutions++;
      }
    }
    if (Array.isArray(store.detailedServices)) {
      counts.detailedServices = 0;
      for (const ds of store.detailedServices) {
        const ok = await pushDetailedServiceToSupabase(ds);
        if (ok) counts.detailedServices++;
      }
    }
    if (Array.isArray(store.serviceStats)) {
      counts.serviceStats = 0;
      for (const ss of store.serviceStats) {
        const ok = await pushServiceStatToSupabase(ss);
        if (ok) counts.serviceStats++;
      }
    }
    if (Array.isArray(store.servicePillars)) {
      counts.servicePillars = 0;
      for (const sp of store.servicePillars) {
        const ok = await pushServicePillarToSupabase(sp);
        if (ok) counts.servicePillars++;
      }
    }
    if (Array.isArray(store.servicesFaqs)) {
      counts.servicesFaqs = 0;
      for (const sf of store.servicesFaqs) {
        const ok = await pushServicesFaqToSupabase(sf);
        if (ok) counts.servicesFaqs++;
      }
    }
    if (Array.isArray(store.websitePromotions)) {
      counts.websitePromotions = 0;
      for (const wp of store.websitePromotions) {
        const ok = await pushWebsitePromotionToSupabase(wp);
        if (ok) counts.websitePromotions++;
      }
    }
    if (store.companyDetails) {
      await pushCompanySettingsToSupabase('company_details', store.companyDetails);
      counts.companyDetails = 1;
    }

    return { success: true, pushedCounts: counts };
  } catch (e) {
    console.warn('pushAllStoreDataToSupabase error:', e);
    return { success: false, pushedCounts: counts };
  }
}
