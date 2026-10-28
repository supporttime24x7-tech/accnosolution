-- ============================================================================
-- ACCNO SOLUTION ENTERPRISE ERP & CUSTOMER PORTAL - SUPABASE SCHEMA
-- Target Database: Supabase PostgreSQL 15+
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. EMPLOYEES & STAFF DIRECTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    emp_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100) DEFAULT 'Technician',
    department VARCHAR(100) DEFAULT 'Technical',
    designation VARCHAR(100),
    active_status VARCHAR(50) DEFAULT 'Active',
    password_hash_or_plain TEXT,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    joining_date DATE,
    base_salary NUMERIC(12,2) DEFAULT 0.00,
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    govt_id_type VARCHAR(100),
    govt_id_number VARCHAR(100),
    id_attachment TEXT,
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    bank_branch_code VARCHAR(50),
    bank_ifsc_code VARCHAR(50),
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employees_emp_code ON employees(emp_code);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON employees(phone);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- ============================================================================
-- 2. CUSTOMERS DIRECTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    email VARCHAR(255),
    customer_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL or CORPORATE
    company_name VARCHAR(255),
    gstin VARCHAR(50),
    address TEXT,
    city VARCHAR(100) DEFAULT 'Sanchore',
    state VARCHAR(100) DEFAULT 'Rajasthan',
    pincode VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);

-- ============================================================================
-- 3. REPAIR TICKETS & JOB CARDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_tickets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    barcode_data VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_alternate_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_gstin VARCHAR(50),
    customer_address TEXT,
    customer_type VARCHAR(50) DEFAULT 'RETAIL',
    
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_or_imei VARCHAR(100),
    device_color VARCHAR(50),
    received_qty INT DEFAULT 1,
    password_lock VARCHAR(100),
    pattern_lock_sequence JSONB DEFAULT '[]'::jsonb,
    rack_location VARCHAR(100),
    problem_reported TEXT NOT NULL,
    physical_condition TEXT,
    requested_work TEXT,
    os_to_install VARCHAR(100),
    intake_photos JSONB DEFAULT '[]'::jsonb,
    
    status VARCHAR(50) DEFAULT 'received', -- received, diagnosing, in_progress, ready_for_pickup, delivered, cancelled
    priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
    progress_percentage INT DEFAULT 0,
    job_pipeline_status VARCHAR(100) DEFAULT 'RECEIVED',
    
    line_items JSONB DEFAULT '[]'::jsonb,
    outsource_charges NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    estimated_cost NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    gst_tax_rate NUMERIC(5,2) DEFAULT 18.00,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) DEFAULT 0.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) DEFAULT 0.00,
    round_off_adjustment NUMERIC(6,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    net_due_balance NUMERIC(12,2) DEFAULT 0.00,
    
    payment_method VARCHAR(50) DEFAULT 'CASH',
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    warranty_statement TEXT DEFAULT '30 Days Parts & Labor Warranty',
    delivered_to VARCHAR(255),
    delivery_status VARCHAR(100) DEFAULT 'IN REPAIR LAB',
    after_service_remarks TEXT,
    technician_name VARCHAR(255),
    entry_date DATE DEFAULT CURRENT_DATE,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    invoice_id TEXT,
    invoice_number VARCHAR(50),
    invoice_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_repair_tickets_number ON repair_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_status ON repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_phone ON repair_tickets(customer_phone);

-- ============================================================================
-- 4. REPAIR INVOICES & BILLS
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id TEXT,
    ticket_number VARCHAR(50),
    invoice_date DATE DEFAULT CURRENT_DATE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_gstin VARCHAR(50),
    customer_type VARCHAR(50) DEFAULT 'RETAIL',
    device_type VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_or_imei VARCHAR(100),
    line_items JSONB DEFAULT '[]'::jsonb,
    outsource_charges NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) DEFAULT 0.00,
    gst_tax_rate NUMERIC(5,2) DEFAULT 18.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) DEFAULT 0.00,
    round_off_adjustment NUMERIC(6,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    net_due_balance NUMERIC(12,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    warranty_statement TEXT DEFAULT '30 Days Parts & Labor Warranty',
    delivered_to VARCHAR(255),
    delivery_status VARCHAR(100) DEFAULT 'DELIVERED TO CUSTOMER',
    after_service_remarks TEXT,
    ticket_details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_repair_invoices_number ON repair_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_repair_invoices_ticket ON repair_invoices(ticket_number);

-- ============================================================================
-- 5. OUTSOURCED LAB REPAIRS
-- ============================================================================
CREATE TABLE IF NOT EXISTS outsource_vouchers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    voucher_date DATE DEFAULT CURRENT_DATE,
    linked_ticket_id TEXT,
    linked_ticket_number VARCHAR(50),
    vendor_job_id VARCHAR(100),
    vendor_id TEXT,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_phone VARCHAR(50),
    vendor_city VARCHAR(100),
    vendor_address TEXT,
    vendor_gstin VARCHAR(50),
    service_type VARCHAR(100),
    
    outgoing_courier VARCHAR(100),
    outgoing_docket VARCHAR(100),
    outgoing_dispatch_date DATE,
    outgoing_freight_cost NUMERIC(12,2) DEFAULT 0.00,
    
    incoming_courier VARCHAR(100),
    incoming_docket VARCHAR(100),
    incoming_dispatch_date DATE,
    incoming_freight_cost NUMERIC(12,2) DEFAULT 0.00,
    expected_return_date DATE,
    received_date DATE,
    
    vendor_cost_price NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    customer_selling_price NUMERIC(12,2) DEFAULT 0.00,
    profit_margin NUMERIC(12,2) DEFAULT 0.00,
    
    dispatch_status VARCHAR(100) DEFAULT 'DISPATCHED',
    technical_instructions TEXT,
    testing_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outsource_voucher_number ON outsource_vouchers(voucher_number);

-- ============================================================================
-- 6. DATA RECOVERY CASES
-- ============================================================================
CREATE TABLE IF NOT EXISTS data_recovery_cases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    recovery_id_number VARCHAR(50) UNIQUE NOT NULL,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE DEFAULT CURRENT_DATE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    media_type VARCHAR(100) NOT NULL, -- HDD, SSD, NVMe, SD Card, RAID Array
    media_brand VARCHAR(100),
    media_model VARCHAR(100),
    serial_number VARCHAR(100),
    capacity VARCHAR(50),
    file_system VARCHAR(50),
    reported_fault TEXT NOT NULL,
    cleanroom_status VARCHAR(100) DEFAULT 'Pending Inspection',
    recovery_stage VARCHAR(100) DEFAULT 'Diagnosing',
    priority VARCHAR(50) DEFAULT 'Normal',
    estimated_quote NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    technician_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'diagnosing',
    target_media_provided VARCHAR(255),
    recovered_data_size_gb NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_data_recovery_case ON data_recovery_cases(case_number);

-- ============================================================================
-- 7. AMC (ANNUAL MAINTENANCE CONTRACTS) & COMPLAINTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS amc_contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    customer_gstin VARCHAR(50),
    customer_address TEXT,
    company_name VARCHAR(255),
    amc_type VARCHAR(100) DEFAULT 'Comprehensive Hardware AMC',
    billing_cycle VARCHAR(50) DEFAULT 'Annual',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_devices_covered INT DEFAULT 1,
    contract_amount NUMERIC(12,2) DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) DEFAULT 0.00,
    gst_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    payment_mode VARCHAR(50) DEFAULT 'Bank Transfer',
    assigned_technician VARCHAR(255),
    devices_covered JSONB DEFAULT '[]'::jsonb,
    preventative_maintenance_frequency VARCHAR(50) DEFAULT 'Quarterly',
    terms_and_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS amc_complaint_tickets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    contract_number VARCHAR(50) REFERENCES amc_contracts(contract_number) ON DELETE CASCADE,
    complaint_date DATE DEFAULT CURRENT_DATE,
    reported_by VARCHAR(255),
    contact_phone VARCHAR(50),
    device_name VARCHAR(255),
    problem_reported TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Normal',
    assigned_technician VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Open',
    resolution_notes TEXT,
    resolved_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_amc_contracts_number ON amc_contracts(contract_number);
CREATE INDEX IF NOT EXISTS idx_amc_complaints_number ON amc_complaint_tickets(complaint_number);

-- ============================================================================
-- 8. INVENTORY / POS PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Hardware',
    brand VARCHAR(100),
    model VARCHAR(100),
    item_type VARCHAR(50) DEFAULT 'retail_product', -- retail_product, service_part
    cost_price NUMERIC(12,2) DEFAULT 0.00,
    selling_price NUMERIC(12,2) DEFAULT 0.00,
    mrp NUMERIC(12,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    unit VARCHAR(50) DEFAULT 'Pcs',
    hsn_code VARCHAR(20) DEFAULT '84733020',
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    location VARCHAR(100) DEFAULT 'Shop Shelf',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items(sku);

-- ============================================================================
-- 9. SUPPLIERS & VENDORS
-- ============================================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    vendor_code VARCHAR(50) UNIQUE,
    vendor_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    email VARCHAR(255),
    gstin VARCHAR(50),
    pan_number VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(100),
    bank_ifsc VARCHAR(50),
    payment_terms VARCHAR(100) DEFAULT 'Net 30 Days',
    opening_balance NUMERIC(12,2) DEFAULT 0.00,
    current_balance NUMERIC(12,2) DEFAULT 0.00,
    category VARCHAR(100) DEFAULT 'Components',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. POS SALES INVOICES & ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS sales_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE DEFAULT CURRENT_DATE,
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_gstin VARCHAR(50),
    billing_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) DEFAULT 0.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) DEFAULT 0.00,
    round_off_adjustment NUMERIC(6,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    due_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    sales_rep VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sales_invoices_number ON sales_invoices(invoice_number);

-- ============================================================================
-- 11. PURCHASE INVOICES (GRN)
-- ============================================================================
CREATE TABLE IF NOT EXISTS purchase_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    purchase_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_invoice_no VARCHAR(100),
    supplier_id TEXT,
    supplier_name VARCHAR(255) NOT NULL,
    purchase_date DATE DEFAULT CURRENT_DATE,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    balance_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    payment_method VARCHAR(50) DEFAULT 'NEFT',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 12. LEADS & ONLINE SERVICE BOOKINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    service_interested VARCHAR(100) NOT NULL,
    estimated_value NUMERIC(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, won, lost
    assigned_to VARCHAR(255),
    notes TEXT,
    source VARCHAR(100) DEFAULT 'Website Form',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS book_repair_leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_no VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    problem_reported TEXT NOT NULL,
    service_mode VARCHAR(50) DEFAULT 'Store Drop-off',
    preferred_date DATE,
    preferred_time_slot VARCHAR(50),
    status VARCHAR(50) DEFAULT 'New Booking',
    converted_ticket_id TEXT,
    converted_ticket_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. WEBSITE CONTENT: BLOG POSTS & MILESTONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Hardware Repair',
    author VARCHAR(100) DEFAULT 'Deepak Kumar',
    cover_image TEXT,
    published_date DATE DEFAULT CURRENT_DATE,
    read_time VARCHAR(50) DEFAULT '5 min read',
    tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    year VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Growth',
    icon_name VARCHAR(100) DEFAULT 'Award',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 14. COMPANY PROFILE & BUSINESS CONFIGURATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_profile (
    id TEXT PRIMARY KEY DEFAULT 'primary_company',
    company_name VARCHAR(255) DEFAULT 'Accno Solution',
    legal_name VARCHAR(255) DEFAULT 'Accno Solution Computer & Mobile Lab',
    tagline VARCHAR(255) DEFAULT 'Enterprise Computer Repair & Data Recovery Hub',
    phone VARCHAR(50) DEFAULT '+91 9468781166',
    email VARCHAR(255) DEFAULT 'admin@accnosolution.com',
    website VARCHAR(255) DEFAULT 'https://accnosolution.com',
    gstin VARCHAR(50) DEFAULT '01AAAAA0000A1Z5',
    pan_number VARCHAR(50) DEFAULT 'AAAAA0000A',
    address TEXT DEFAULT 'Above Choudhary Dharamshala, Main Market, Sanchore',
    city VARCHAR(100) DEFAULT 'Sanchore',
    state VARCHAR(100) DEFAULT 'Rajasthan',
    pincode VARCHAR(20) DEFAULT '343041',
    merchant_upi_id VARCHAR(100) DEFAULT 'support.time24x7-3@okhdfcbank',
    bank_name VARCHAR(100) DEFAULT 'Bank of Baroda',
    bank_account_number VARCHAR(100) DEFAULT '29450100022394',
    bank_ifsc_code VARCHAR(50) DEFAULT 'BARB0SANCHO',
    repair_rules JSONB DEFAULT '{"ticket_prefix":"TKT-","ticket_start_no":1001,"invoice_prefix":"RBN-","invoice_start_no":1001}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 15. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
-- ============================================================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE outsource_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_recovery_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_complaint_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_repair_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for authorized application usage
CREATE POLICY "Public Read All" ON employees FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON employees FOR ALL USING (true);

CREATE POLICY "Public Read Customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public Manage Customers" ON customers FOR ALL USING (true);

CREATE POLICY "Public Read Tickets" ON repair_tickets FOR SELECT USING (true);
CREATE POLICY "Public Manage Tickets" ON repair_tickets FOR ALL USING (true);

CREATE POLICY "Public Read Invoices" ON repair_invoices FOR SELECT USING (true);
CREATE POLICY "Public Manage Invoices" ON repair_invoices FOR ALL USING (true);

CREATE POLICY "Public Outsource" ON outsource_vouchers FOR ALL USING (true);
CREATE POLICY "Public Recovery" ON data_recovery_cases FOR ALL USING (true);
CREATE POLICY "Public AMC" ON amc_contracts FOR ALL USING (true);
CREATE POLICY "Public Complaints" ON amc_complaint_tickets FOR ALL USING (true);
CREATE POLICY "Public Inventory" ON inventory_items FOR ALL USING (true);
CREATE POLICY "Public Suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Public Sales" ON sales_invoices FOR ALL USING (true);
CREATE POLICY "Public Purchases" ON purchase_invoices FOR ALL USING (true);

CREATE POLICY "Public Read Leads" ON support_leads FOR SELECT USING (true);
CREATE POLICY "Public Insert Leads" ON support_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Leads" ON support_leads FOR ALL USING (true);

CREATE POLICY "Public Read Bookings" ON book_repair_leads FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON book_repair_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Bookings" ON book_repair_leads FOR ALL USING (true);

CREATE POLICY "Public Read Blogs" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Admin Manage Blogs" ON blog_posts FOR ALL USING (true);

CREATE POLICY "Public Read Milestones" ON milestones FOR SELECT USING (true);
CREATE POLICY "Admin Manage Milestones" ON milestones FOR ALL USING (true);

CREATE POLICY "Public Read Profile" ON company_profile FOR SELECT USING (true);
CREATE POLICY "Admin Manage Profile" ON company_profile FOR ALL USING (true);
