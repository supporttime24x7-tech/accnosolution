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
} from './store';

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
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('repair_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching tickets from Supabase:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return data.map(mapRowToTicket);
    }
  } catch (err) {
    console.warn('Network exception while fetching Supabase tickets:', err);
  }
  return null;
}

/**
 * Fetch all repair invoices live from Supabase
 */
export async function fetchInvoicesFromSupabase(): Promise<RepairInvoice[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('repair_invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching invoices from Supabase:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return data.map(mapRowToInvoice);
    }
  } catch (err) {
    console.warn('Network exception while fetching Supabase invoices:', err);
  }
  return null;
}

/**
 * Push single ticket to Supabase Cloud
 */
export async function pushTicketToSupabase(ticket: RepairTicket): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const row = mapTicketToRow(ticket);
    const { error } = await supabase
      .from('repair_tickets')
      .upsert(row, { onConflict: 'ticket_number' });

    if (error) {
      console.error('Failed to sync ticket to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception syncing ticket to Supabase:', err);
    return false;
  }
}

/**
 * Delete ticket from Supabase Cloud
 */
export async function deleteTicketFromSupabase(id: string, ticketNumber?: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    let query = supabase.from('repair_tickets').delete();
    if (ticketNumber) {
      query = query.or(`id.eq.${id},ticket_number.eq.${ticketNumber}`);
    } else {
      query = query.or(`id.eq.${id},ticket_number.eq.${id}`);
    }

    const { error } = await query;
    if (error) {
      console.error('Failed to delete ticket from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception deleting ticket from Supabase:', err);
    return false;
  }
}

/**
 * Push repair invoice to Supabase Cloud
 */
export async function pushInvoiceToSupabase(inv: RepairInvoice): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const row = mapInvoiceToRow(inv);
    const { error } = await supabase
      .from('repair_invoices')
      .upsert(row, { onConflict: 'invoice_number' });

    if (error) {
      console.error('Failed to sync invoice to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception syncing invoice to Supabase:', err);
    return false;
  }
}

/**
 * Delete repair invoice from Supabase Cloud
 */
export async function deleteInvoiceFromSupabase(id: string, invoiceNumber?: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    let query = supabase.from('repair_invoices').delete();
    if (invoiceNumber) {
      query = query.or(`id.eq.${id},invoice_number.eq.${invoiceNumber}`);
    } else {
      query = query.or(`id.eq.${id},invoice_number.eq.${id}`);
    }

    const { error } = await query;
    if (error) {
      console.error('Failed to delete invoice from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception deleting invoice from Supabase:', err);
    return false;
  }
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
    alternateContact: row.alternate_phone || '',
    email: row.email || '',
    panNumber: '',
    gstin: row.gstin || '',
    billingAddress: row.address || '',
    city: row.city || 'Sanchore',
    state: row.state || 'Rajasthan',
    pinCode: row.pincode || '',
    accountStatus: 'Active',
    creditLimit: 0,
    outstandingBalance: 0,
    loyaltyPoints: 0,
    kycVerified: false,
    tier: 'Standard',
    totalRepairs: 0,
  };
}

export async function fetchCustomersFromSupabase(): Promise<CustomerItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data.map(mapRowToCustomer) : [];
  } catch {
    return null;
  }
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
    storageLocation: '',
    openingBalance: Number(row.stock_quantity) || 0,
  };
}

export async function fetchInventoryFromSupabase(): Promise<InventoryItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('inventory_items').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data.map(mapRowToInventory) : [];
  } catch {
    return null;
  }
}

export async function fetchOutsourceVouchersFromSupabase(): Promise<OutsourceVoucher[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('outsource_vouchers').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

export async function fetchDataRecoveryFromSupabase(): Promise<DataRecoveryCase[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('data_recovery_cases').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

export async function fetchAmcContractsFromSupabase(): Promise<AmcContract[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('amc_contracts').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

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
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('sales_invoices').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

export async function fetchPurchaseInvoicesFromSupabase(): Promise<PurchaseInvoiceItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('purchase_invoices').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
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
    ]);

    if (Array.isArray(tickets) && store.setTickets) store.setTickets(tickets);
    if (Array.isArray(invoices) && store.setRepairInvoices) store.setRepairInvoices(invoices);
    if (Array.isArray(customers) && store.setCustomers) store.setCustomers(customers);
    if (Array.isArray(inventory) && store.setInventory) store.setInventory(inventory);
    if (Array.isArray(outsource) && store.setOutsourceVouchers) store.setOutsourceVouchers(outsource);
    if (Array.isArray(dataRecovery) && store.setDataRecoveryCases) store.setDataRecoveryCases(dataRecovery);
    if (Array.isArray(amc) && store.setAmcContracts) store.setAmcContracts(amc);
    if (Array.isArray(supportLeads) && store.setSupportLeads) store.setSupportLeads(supportLeads);
    if (Array.isArray(bookLeads) && store.setBookRepairLeads) store.setBookRepairLeads(bookLeads);
    if (Array.isArray(salesInvoices) && store.setSalesInvoices) store.setSalesInvoices(salesInvoices);
    if (Array.isArray(purchaseInvoices) && store.setPurchaseInvoices) store.setPurchaseInvoices(purchaseInvoices);
    if (Array.isArray(blogs) && store.setBlogPosts) store.setBlogPosts(blogs);
    if (Array.isArray(milestones) && store.setMilestones) store.setMilestones(milestones);
  } catch (err) {
    console.warn('Sync entire ERP with Supabase failed:', err);
  }
}
