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
  BlogPostItem,
  MilestoneItem,
  EmployeeItem,
  VendorItem,
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
    customerType: (row.customer_type || 'RETAIL') as any,

    device_type: row.device_type || 'Device',
    brand: row.brand || '',
    model: row.model || '',
    serial_or_imei: row.serial_or_imei || '',
    deviceColor: row.device_color || '',
    receivedQty: Number(row.received_qty) || 1,
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
    customer_email: ticket.customerEmail || null,
    customer_gstin: ticket.customerGstin || null,
    customer_address: ticket.customerAddress || null,
    customer_type: ticket.customerType || 'RETAIL',

    device_type: ticket.device_type,
    brand: ticket.brand,
    model: ticket.model,
    serial_or_imei: ticket.serial_or_imei || null,
    device_color: ticket.deviceColor || null,
    received_qty: ticket.receivedQty || 1,
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
    ticketDetails: row.ticket_details || undefined,
  };
}

export function mapInvoiceToRow(inv: RepairInvoice): Record<string, any> {
  return {
    id: inv.id,
    invoice_number: inv.invoiceNumber,
    ticket_id: inv.ticketId || null,
    ticket_number: inv.ticketNumber || null,
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
    code: row.customer_code || '',
    name: row.name || 'Customer',
    companyName: row.company_name || '',
    category: 'Sundry Debtor',
    accountGroup: row.customer_type === 'CORPORATE' ? 'Corporate / B2B' : 'Retail / Cash',
    mobile: row.phone || '',
    phone: row.phone || '',
    alternateContact: row.alternate_phone || '',
    email: row.email || '',
    panNumber: '',
    gstin: row.gstin || '',
    billingAddress: row.address || '',
    address: row.address || '',
    city: row.city || 'Sanchore',
    state: row.state || 'Rajasthan',
    pinCode: row.pincode || '',
    accountStatus: 'Active',
    creditLimit: Number(row.credit_limit) || 0,
    outstandingBalance: Number(row.current_balance) || 0,
    loyaltyPoints: 0,
    kycVerified: Boolean(row.gstin),
    tier: (Number(row.credit_limit) || 0) > 100000 ? 'Platinum VIP' : 'Standard',
    totalRepairs: 0,
    internalNotes: row.notes || '',
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
      const payload = {
        id: cust.id,
        customer_code: cust.code || '',
        name: cust.name || 'Customer',
        phone: cust.mobile || cust.phone || '',
        alternate_phone: cust.alternateContact || null,
        email: cust.email || null,
        customer_type: (cust.accountGroup || '').includes('Corporate') ? 'CORPORATE' : 'RETAIL',
        company_name: cust.companyName || null,
        gstin: cust.gstin || null,
        address: cust.billingAddress || cust.address || null,
        city: cust.city || 'Sanchore',
        state: cust.state || 'Rajasthan',
        pincode: cust.pinCode || null,
        notes: cust.internalNotes || null,
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
      const payload = {
        id: item.id,
        sku: item.code || '',
        name: item.name || '',
        category: item.category || 'General Hardware',
        item_type: item.itemType === 'Retail Part' ? 'retail_product' : 'service_part',
        unit: item.uom || 'Pcs',
        cost_price: Number(item.costPrice) || 0,
        selling_price: Number(item.sellingPrice) || 0,
        mrp: Number(item.mrp) || 0,
        stock_quantity: Number(item.currentStock) || 0,
        min_stock_alert: Number(item.lowStockAlert) || 2,
        hsn_code: item.hsnCode || '84733020',
        gst_rate: Number(item.gstRate) || 18,
        location: (item as any).location || item.storageLocation || 'Shop Shelf',
        description: item.description || null,
        is_active: item.activeStatus === 'Active',
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
    code: row.sku || '',
    name: row.name || 'Inventory Item',
    category: row.category || 'General Hardware',
    uom: row.unit || 'pcs',
    defaultQuantity: 1,
    sellingPrice: Number(row.selling_price) || 0,
    mrp: Number(row.mrp) || 0,
    costPrice: Number(row.cost_price) || 0,
    currentStock: Number(row.stock_quantity) || 0,
    lowStockAlert: Number(row.min_stock_alert) || 2,
    activeStatus: 'Active',
    hsnCode: row.hsn_code || '84733020',
    gstRate: 18,
    barcode: row.barcode || '',
    productGroup: row.brand || '',
    description: row.model || '',
    supplierVendor: '',
    storageLocation: row.location || 'Shop Shelf',
    openingBalance: Number(row.stock_quantity) || 0,
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
    vendorType: (row.category || '').toLowerCase().includes('outsource') ? 'Outsource Vendor' : 'Standard Vendor',
    code: row.vendor_code || '',
    companyName: row.vendor_name || 'Vendor',
    name: row.vendor_name || 'Vendor',
    contactPerson: row.contact_person || '',
    category: row.category || 'Components',
    activeStatus: row.is_active ? 'Active' : 'Inactive',
    phone: row.phone || '',
    alternatePhone: row.alternate_phone || '',
    email: row.email || '',
    station: row.city || '',
    state: row.state || '',
    fullAddress: row.address || '',
    gstin: row.gstin || '',
    pan: row.pan_number || '',
    openingBalance: Number(row.opening_balance) || 0,
    outstandingBalance: Number(row.current_balance) || 0,
    maxCreditLimit: 0,
    bankName: row.bank_name || '',
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc || '',
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
      const payload = {
        id: vendor.id,
        vendor_code: vendor.code || null,
        vendor_name: vendor.companyName || vendor.name || 'Vendor',
        contact_person: vendor.contactPerson || null,
        phone: vendor.phone || '+91 99999-00000',
        alternate_phone: vendor.alternatePhone || null,
        email: vendor.email || null,
        gstin: vendor.gstin || null,
        pan_number: vendor.pan || null,
        address: vendor.fullAddress || vendor.address || null,
        city: vendor.station || null,
        state: vendor.state || null,
        bank_name: vendor.bankName || null,
        bank_account_number: vendor.bankAccountNumber || null,
        bank_ifsc: vendor.bankIfscCode || null,
        opening_balance: Number(vendor.openingBalance) || 0,
        current_balance: Number(vendor.outstandingBalance) || 0,
        category: vendor.category || 'Components',
        is_active: vendor.activeStatus !== 'Inactive',
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
    customerGst: '',
    customerAddress: '',
    deviceBrand: row.media_brand || '',
    deviceType: row.media_type || 'Hard Drive (HDD)',
    driveModel: row.media_model || '',
    driveSerial: row.serial_number || '',
    capacity: row.capacity || '1 TB',
    fileSystem: row.file_system || 'NTFS',
    damageType: row.reported_fault || 'Drive Not Detected',
    priority: row.priority || 'Normal',
    symptoms: row.reported_fault || '',
    status: row.status || 'Received',
    technician: row.technician_name || 'Deepak Kumar',
    storageLocation: 'Safe Locker',
    estimateCost: quote,
    advance: advance,
    customerCharge: quote,
    freight: 0,
    discount: 0,
    gstRate: 18,
    totalInvoice: quote,
    deposit: advance,
    balanceDue: Math.max(0, quote - advance),
    diagnosticFee: 500,
    recoveryFee: quote,
    paidAmount: advance,
    paymentStatus: advance >= quote && quote > 0 ? 'Paid' : advance > 0 ? 'Partial' : 'Unpaid',
    termsConsentAccepted: true,
    requestedWork: 'Data Recovery Lab Extraction',
    additionalInfo: '',
    confidentialNotes: '',
    recoveryPhaseStatus: row.cleanroom_status || 'In Inspection',
    progressPercentage: row.status === 'Completed' ? 100 : 35,
    estimatedDataGb: 100,
    recoveredDataGb: Number(row.recovered_data_size_gb) || 0,
    healthPercentage: 85,
    rackLocation: 'Rack DR-1',
    targetDriveDetails: row.target_media_provided || '',
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
      const payload = {
        id: c.id,
        recovery_id_number: recId,
        case_number: c.caseNumber || recId,
        entry_date: c.entryDate || new Date().toISOString().split('T')[0],
        customer_name: c.customerName || 'Customer',
        customer_phone: c.customerPhone || '+91 99999-00000',
        customer_email: c.customerEmail || null,
        media_type: c.deviceType || 'Hard Drive (HDD)',
        media_brand: c.deviceBrand || null,
        media_model: c.driveModel || null,
        serial_number: c.driveSerial || null,
        capacity: c.capacity || '1 TB',
        file_system: c.fileSystem || 'NTFS',
        reported_fault: c.damageType || c.symptoms || 'Drive Not Detected',
        cleanroom_status: c.recoveryPhaseStatus || 'Pending Diagnostic',
        recovery_stage: c.status || 'In Lab Inspection',
        priority: c.priority || 'Normal',
        estimated_quote: Number(c.estimateCost) || 0,
        advance_paid: Number(c.advance) || 0,
        technician_name: c.technician || 'Deepak Kumar',
        status: c.status || 'Received',
        target_media_provided: c.targetDriveDetails || null,
        recovered_data_size_gb: Number(c.recoveredDataGb) || 0,
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
    manualEntryDate: row.start_date || new Date().toISOString().split('T')[0],
    customerName: row.customer_name || 'Customer',
    companyName: row.company_name || '',
    customerPhone: row.customer_phone || '',
    alternatePhone: '',
    customerEmail: row.customer_email || '',
    customerGst: row.customer_gstin || '',
    customerAddress: row.customer_address || '',
    planOption: row.amc_type || 'Comprehensive Plan',
    contractCost: Number(row.contract_amount) || 0,
    amcAmount: Number(row.taxable_amount || row.contract_amount) || 0,
    gstRate: 18,
    totalAmount: Number(row.grand_total || row.contract_amount) || 0,
    advancePaid: Number(row.advance_paid) || 0,
    balanceDue: Number(row.balance_due) || 0,
    paymentStatus: row.payment_status || 'Unpaid',
    startDate: row.start_date || new Date().toISOString().split('T')[0],
    endDate: row.end_date || new Date().toISOString().split('T')[0],
    renewalDate: row.end_date || new Date().toISOString().split('T')[0],
    contractStatus: row.status || 'Active',
    coverageScopeDetails: row.terms_and_conditions || '',
    source: 'Direct Customer',
    serviceType: row.billing_cycle || 'On-site Support',
    numberOfDevices: Number(row.total_devices_covered) || 1,
    totalServiceVisits: 4,
    assignedTechnician: row.assigned_technician || 'Deepak Kumar',
    priority: 'Normal',
    deviceType: row.devices_covered || 'Desktop PC / Laptop',
    serviceIncludedChecklist: ['Quarterly Maintenance', 'OS Tuning', 'Antivirus Updates'],
    retailProducts: [],
    coveredAssets: [],
    pmVisits: [],
    complaints: [],
    invoiceGenerated: false,
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

      const payload = {
        id: a.id,
        contract_number: contractNum,
        customer_name: a.customerName || 'Customer',
        customer_phone: a.customerPhone || '+91 99999-00000',
        customer_email: a.customerEmail || null,
        customer_gstin: a.customerGst || null,
        customer_address: a.customerAddress || null,
        company_name: a.companyName || null,
        amc_type: a.planOption || 'Comprehensive AMC',
        billing_cycle: a.serviceType || 'Yearly',
        start_date: startDate,
        end_date: endDate,
        total_devices_covered: Number(a.numberOfDevices) || 1,
        contract_amount: Number(a.contractCost || a.amcAmount) || 0,
        taxable_amount: Number(a.amcAmount || a.contractCost) || 0,
        gst_amount: Number(a.totalAmount ? a.totalAmount - (a.amcAmount || 0) : 0),
        grand_total: Number(a.totalAmount || a.contractCost) || 0,
        advance_paid: Number(a.advancePaid) || 0,
        balance_due: Number(a.balanceDue) || 0,
        status: a.contractStatus || 'Active',
        payment_status: a.paymentStatus || 'Unpaid',
        payment_mode: 'Cash / UPI / Bank Transfer',
        assigned_technician: a.assignedTechnician || 'Deepak Kumar',
        devices_covered: a.deviceType || 'Desktop PC / Laptop',
        preventative_maintenance_frequency: `${a.totalServiceVisits || 4} Visits/Year`,
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
    paymentTerms: 'Immediate',
    paymentMethod: row.payment_method || 'CASH',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount_amount) || 0,
    discountType: 'fixed',
    taxAmount: (Number(row.cgst_amount) || 0) + (Number(row.sgst_amount) || 0),
    shippingCharges: 0,
    grandTotal: Number(row.grand_total) || 0,
    paidAmount: Number(row.paid_amount) || 0,
    balanceDue: Number(row.due_amount) || 0,
    paymentStatus: (row.payment_status || 'Paid') as any,
    remarks: row.notes || '',
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

      const payload = {
        id: s.id,
        invoice_number: s.invoiceNo || `INV-${Date.now().toString().slice(-4)}`,
        invoice_date: s.invoiceDate || new Date().toISOString().split('T')[0],
        customer_id: s.customerId || null,
        customer_name: s.customerName || 'Retail Customer',
        customer_phone: s.customerPhone || '+91 99999-00000',
        customer_gstin: s.customerGst || null,
        billing_address: s.customerAddress || null,
        items: Array.isArray(s.items) ? s.items : [],
        subtotal: sub,
        discount_amount: Number(s.discount) || 0,
        taxable_amount: sub,
        cgst_amount: Math.round(tax / 2),
        sgst_amount: Math.round(tax / 2),
        round_off_adjustment: 0,
        grand_total: grand,
        paid_amount: paid,
        due_amount: due,
        payment_method: s.paymentMethod || 'CASH',
        payment_status: s.paymentStatus || 'Paid',
        sales_rep: 'Accno Solution',
        notes: s.remarks || null,
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
    vendorPhone: '',
    vendorGst: '',
    vendorAddress: '',
    paymentTerms: 'Net 30',
    paymentMethod: row.payment_method || 'BANK_TRANSFER',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    freightCharges: 0,
    grandTotal: Number(row.grand_total) || 0,
    paidAmount: Number(row.paid_amount) || 0,
    balanceDue: Number(row.balance_amount) || 0,
    paymentStatus: (row.payment_status || 'Paid') as any,
    remarks: row.notes || '',
    poRefNo: row.supplier_invoice_no || '',
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

      const payload = {
        id: p.id,
        purchase_number: p.billNo || `PUR-${Date.now().toString().slice(-4)}`,
        supplier_invoice_no: p.poRefNo || null,
        supplier_id: p.vendorId || null,
        supplier_name: p.vendorName || 'Supplier Vendor',
        purchase_date: p.billDate || new Date().toISOString().split('T')[0],
        items: Array.isArray(p.items) ? p.items : [],
        subtotal: sub,
        tax_amount: tax,
        grand_total: grand,
        paid_amount: paid,
        balance_amount: balance,
        payment_status: p.paymentStatus || 'Paid',
        payment_method: p.paymentMethod || 'BANK_TRANSFER',
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
      emp_code: emp.empCode.trim().toUpperCase(),
      name: emp.name.trim(),
      phone: emp.phone || '',
      alternate_phone: emp.alternatePhone || '',
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

/**
 * Sync entire ERP state exclusively from Supabase Cloud
 */
export async function syncEntireErpWithSupabase(store: any) {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    const [
      tickets,
      invoices,
      customers,
      inventory,
      outsource,
      dataRecovery,
      amc,
      supportLeads,
      bookLeads,
      salesInvoices,
      purchaseInvoices,
      blogs,
      milestones,
      employees,
    ] = await Promise.all([
      fetchTicketsFromSupabase(),
      fetchInvoicesFromSupabase(),
      fetchCustomersFromSupabase(),
      fetchInventoryFromSupabase(),
      fetchOutsourceVouchersFromSupabase(),
      fetchDataRecoveryFromSupabase(),
      fetchAmcContractsFromSupabase(),
      fetchSupportLeadsFromSupabase(),
      fetchBookRepairLeadsFromSupabase(),
      fetchSalesInvoicesFromSupabase(),
      fetchPurchaseInvoicesFromSupabase(),
      fetchBlogPostsFromSupabase(),
      fetchMilestonesFromSupabase(),
      fetchEmployeesFromSupabase(),
    ]);

    if (Array.isArray(tickets) && store.setTickets) store.setTickets(tickets);
    if (Array.isArray(invoices) && store.setRepairInvoices) store.setRepairInvoices(invoices);
    
    // Customers 2-way cloud synchronization
    if (Array.isArray(customers)) {
      if (customers.length > 0) {
        if (store.setCustomers) store.setCustomers(customers);
      } else if (Array.isArray(store.customers) && store.customers.length > 0) {
        for (const c of store.customers) {
          pushCustomerToSupabase(c).catch(() => {});
        }
      }
    }

    // Inventory 2-way cloud synchronization
    if (Array.isArray(inventory)) {
      if (inventory.length > 0) {
        if (store.setInventory) store.setInventory(inventory);
      } else if (Array.isArray(store.inventory) && store.inventory.length > 0) {
        for (const i of store.inventory) {
          pushInventoryToSupabase(i).catch(() => {});
        }
      }
    }

    if (Array.isArray(outsource) && store.setOutsourceVouchers) store.setOutsourceVouchers(outsource);
    if (Array.isArray(dataRecovery) && store.setDataRecoveryCases) store.setDataRecoveryCases(dataRecovery);
    if (Array.isArray(amc) && store.setAmcContracts) store.setAmcContracts(amc);
    if (Array.isArray(supportLeads) && store.setSupportLeads) store.setSupportLeads(supportLeads);
    if (Array.isArray(bookLeads) && store.setBookRepairLeads) store.setBookRepairLeads(bookLeads);
    if (Array.isArray(salesInvoices) && store.setSalesInvoices) store.setSalesInvoices(salesInvoices);
    if (Array.isArray(purchaseInvoices) && store.setPurchaseInvoices) store.setPurchaseInvoices(purchaseInvoices);
    if (Array.isArray(blogs) && store.setBlogPosts) store.setBlogPosts(blogs);
    if (Array.isArray(milestones) && store.setMilestones) store.setMilestones(milestones);
    if (Array.isArray(employees) && store.setEmployees) store.setEmployees(employees);
  } catch (err) {
    console.warn('Sync entire ERP with Supabase failed:', err);
  }
}
