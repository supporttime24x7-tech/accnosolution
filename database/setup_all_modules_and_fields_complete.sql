-- ============================================================================
-- ACCNO SOLUTION - UNIVERSAL SUPABASE CLOUD SCHEMA & FIELD MIGRATION
-- Project: Accno Solution Website & ERP
-- Description: Creates and updates ALL tables and columns across ALL modules
--              present across the entire website and ERP.
-- ============================================================================

-- Ensure required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. EMPLOYEES & STAFF DIRECTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    emp_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    department VARCHAR(100) DEFAULT 'Technical',
    designation VARCHAR(100) DEFAULT 'Technician',
    base_salary NUMERIC(12,2) DEFAULT 0.00,
    joining_date DATE DEFAULT CURRENT_DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    govt_id_type VARCHAR(100) DEFAULT 'Aadhaar Card',
    govt_id_number VARCHAR(100),
    id_attachment TEXT,
    active_status VARCHAR(50) DEFAULT 'Active',
    role VARCHAR(100) DEFAULT 'Technician',
    password_hash_or_plain TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    bank_branch_code VARCHAR(50),
    bank_ifsc_code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE employees ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS govt_id_type VARCHAR(100) DEFAULT 'Aadhaar Card';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS govt_id_number VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS id_attachment TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_branch_code VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_ifsc_code VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. CUSTOMERS MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Sundry Debtor',
    account_group VARCHAR(100) DEFAULT 'Retail / Cash',
    mobile VARCHAR(50),
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    alternate_contact VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    dob VARCHAR(50),
    wedding_anniversary VARCHAR(50),
    pan_number VARCHAR(50),
    gstin VARCHAR(50),
    tax_id VARCHAR(50),
    billing_address TEXT,
    shipping_address TEXT,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Sanchore',
    state VARCHAR(100) DEFAULT 'Rajasthan',
    pincode VARCHAR(20),
    account_status VARCHAR(50) DEFAULT 'Active',
    referred_by VARCHAR(255),
    credit_limit NUMERIC(12,2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12,2) DEFAULT 0.00,
    current_balance NUMERIC(12,2) DEFAULT 0.00,
    balance NUMERIC(12,2) DEFAULT 0.00,
    payment_terms VARCHAR(100) DEFAULT 'Immediate',
    internal_notes TEXT,
    notes TEXT,
    bank_details JSONB DEFAULT '{}'::jsonb,
    bank_account_name VARCHAR(255),
    bank_account_type VARCHAR(50) DEFAULT 'Savings',
    bank_account_number VARCHAR(100),
    bank_ifsc VARCHAR(50),
    bank_ifsc_code VARCHAR(50),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    upi_id VARCHAR(100),
    loyalty_points INT DEFAULT 0,
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(50) DEFAULT 'Verified',
    tier VARCHAR(50) DEFAULT 'Standard',
    customer_tier VARCHAR(50) DEFAULT 'Standard',
    customer_type VARCHAR(50) DEFAULT 'RETAIL',
    is_blocked BOOLEAN DEFAULT FALSE,
    source VARCHAR(100) DEFAULT 'Direct',
    total_repairs INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Sundry Debtor';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_group VARCHAR(100) DEFAULT 'Retail / Cash';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS mobile VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS alternate_contact VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS wedding_anniversary VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Sanchore';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Rajasthan';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS outstanding_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS current_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Immediate';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_type VARCHAR(50) DEFAULT 'Savings';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_ifsc_code VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'Verified';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'Standard';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_tier VARCHAR(50) DEFAULT 'Standard';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'RETAIL';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Direct';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_repairs INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 3. VENDORS & SUPPLIERS MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code VARCHAR(50) UNIQUE,
    vendor_code VARCHAR(50),
    vendor_type VARCHAR(50) DEFAULT 'Standard Vendor',
    company_name VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    contact_person VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Hardware Supplier',
    account_group VARCHAR(100) DEFAULT 'Sundry Creditor',
    designation VARCHAR(100),
    active_status VARCHAR(50) DEFAULT 'Active',
    status VARCHAR(50) DEFAULT 'Active',
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    station VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    full_address TEXT,
    address TEXT,
    gstin VARCHAR(50),
    gst_type VARCHAR(50) DEFAULT 'Registered',
    pan VARCHAR(50),
    pan_number VARCHAR(50),
    opening_balance NUMERIC(12,2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12,2) DEFAULT 0.00,
    current_balance NUMERIC(12,2) DEFAULT 0.00,
    balance NUMERIC(12,2) DEFAULT 0.00,
    max_credit_limit NUMERIC(12,2) DEFAULT 0.00,
    credit_limit NUMERIC(12,2) DEFAULT 0.00,
    payment_terms VARCHAR(100) DEFAULT 'Net 30',
    internal_notes TEXT,
    notes TEXT,
    bank_account_name VARCHAR(255),
    bank_account_type VARCHAR(50) DEFAULT 'Current',
    bank_account_number VARCHAR(100),
    bank_ifsc VARCHAR(50),
    bank_ifsc_code VARCHAR(50),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    upi_id VARCHAR(100),
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vendor_code VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vendor_type VARCHAR(50) DEFAULT 'Standard Vendor';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Hardware Supplier';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS account_group VARCHAR(100) DEFAULT 'Sundry Creditor';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS designation VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS active_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS station VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS full_address TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS gst_type VARCHAR(50) DEFAULT 'Registered';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS pan VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS outstanding_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS current_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS max_credit_limit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Net 30';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_type VARCHAR(50) DEFAULT 'Current';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_ifsc_code VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 4. INVENTORY & SPARE PARTS MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    item_type VARCHAR(50) DEFAULT 'Retail Part',
    code VARCHAR(100) UNIQUE,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    uom VARCHAR(50) DEFAULT 'Pcs',
    unit VARCHAR(50) DEFAULT 'Pcs',
    default_quantity INT DEFAULT 1,
    selling_price NUMERIC(12,2) DEFAULT 0.00,
    mrp NUMERIC(12,2) DEFAULT 0.00,
    cost_price NUMERIC(12,2) DEFAULT 0.00,
    current_stock INT DEFAULT 0,
    quantity_in_stock INT DEFAULT 0,
    low_stock_alert INT DEFAULT 5,
    min_stock_level INT DEFAULT 5,
    active_status VARCHAR(50) DEFAULT 'Active',
    status VARCHAR(50) DEFAULT 'Active',
    hsn_code VARCHAR(50),
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    cess_rate NUMERIC(5,2) DEFAULT 0.00,
    cgst_rate NUMERIC(5,2) DEFAULT 9.00,
    sgst_rate NUMERIC(5,2) DEFAULT 9.00,
    igst_rate NUMERIC(5,2) DEFAULT 18.00,
    barcode VARCHAR(100),
    barcodes JSONB DEFAULT '[]'::jsonb,
    product_image TEXT,
    product_group VARCHAR(100) DEFAULT 'General',
    brand VARCHAR(100),
    model VARCHAR(100),
    warranty_period VARCHAR(50),
    condition VARCHAR(50) DEFAULT 'New',
    product_condition VARCHAR(50) DEFAULT 'New',
    description TEXT,
    refurbished_specs TEXT,
    refurbished_description TEXT,
    compatible_models TEXT,
    comfortability_features TEXT,
    supplier_vendor VARCHAR(255),
    supplier_id TEXT,
    storage_location VARCHAR(100),
    rack_number VARCHAR(50),
    shelf_number VARCHAR(50),
    batch_number VARCHAR(100),
    expiry_date DATE,
    conversion_factor NUMERIC(10,4) DEFAULT 1.0000,
    conversion_unit VARCHAR(50),
    primary_unit VARCHAR(50) DEFAULT 'Pcs',
    secondary_unit VARCHAR(50),
    unit_conversion_ratio NUMERIC(10,4) DEFAULT 1.0000,
    opening_balance NUMERIC(12,2) DEFAULT 0.00,
    total_stock_value NUMERIC(12,2) DEFAULT 0.00,
    reorder_quantity INT DEFAULT 10,
    min_order_qty INT DEFAULT 1,
    show_on_website_shop BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'Retail Part';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS barcodes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_group VARCHAR(100) DEFAULT 'General';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS uom VARCHAR(50) DEFAULT 'Pcs';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'Pcs';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS default_quantity INT DEFAULT 1;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS mrp NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS selling_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS current_stock INT DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS quantity_in_stock INT DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS low_stock_alert INT DEFAULT 5;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS min_stock_level INT DEFAULT 5;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS active_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS cess_rate NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS cgst_rate NUMERIC(5,2) DEFAULT 9.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS sgst_rate NUMERIC(5,2) DEFAULT 9.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS igst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_image TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS warranty_period VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'New';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_condition VARCHAR(50) DEFAULT 'New';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS refurbished_specs TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS refurbished_description TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS compatible_models TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS comfortability_features TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS supplier_vendor VARCHAR(255);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS supplier_id TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS rack_number VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS shelf_number VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS batch_number VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS conversion_factor NUMERIC(10,4) DEFAULT 1.0000;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS conversion_unit VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS primary_unit VARCHAR(50) DEFAULT 'Pcs';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS secondary_unit VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS unit_conversion_ratio NUMERIC(10,4) DEFAULT 1.0000;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS total_stock_value NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS reorder_quantity INT DEFAULT 10;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS min_order_qty INT DEFAULT 1;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS show_on_website_shop BOOLEAN DEFAULT FALSE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 5. REPAIR TICKETS MASTER (SERVICE DESK / JOB INTAKE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_tickets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_no VARCHAR(50),
    barcode_data VARCHAR(100),
    barcode VARCHAR(100),
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_alternate_phone VARCHAR(50),
    customer_company_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_gstin VARCHAR(50),
    customer_address TEXT,
    customer_type VARCHAR(50) DEFAULT 'RETAIL',
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_or_imei VARCHAR(100) NOT NULL,
    password_lock VARCHAR(100),
    pattern_lock_sequence JSONB DEFAULT '[]'::jsonb,
    rack_location VARCHAR(100),
    problem_reported TEXT NOT NULL,
    physical_condition TEXT,
    status VARCHAR(50) DEFAULT 'received',
    priority VARCHAR(50) DEFAULT 'normal',
    progress_percentage INT DEFAULT 0,
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
    round_off_adjustment NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    net_due_balance NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    warranty_statement VARCHAR(255) DEFAULT '30 Days Parts & Labor Warranty',
    delivered_to VARCHAR(255),
    delivery_status VARCHAR(100) DEFAULT 'Pending Pickup',
    after_service_remarks TEXT,
    technician_name VARCHAR(255) DEFAULT 'Senior Technician',
    technician VARCHAR(255),
    entry_date DATE DEFAULT CURRENT_DATE,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    device_color VARCHAR(100),
    chassis_color VARCHAR(100),
    received_qty INT DEFAULT 1,
    received_quantity INT DEFAULT 1,
    hw_checklist JSONB DEFAULT '{}'::jsonb,
    condition_checklist JSONB DEFAULT '{}'::jsonb,
    accessories_checklist JSONB DEFAULT '{}'::jsonb,
    accessories_received TEXT,
    os_to_install VARCHAR(100),
    intake_photos JSONB DEFAULT '[]'::jsonb,
    outsource_history_details TEXT,
    place_of_purchase VARCHAR(255),
    purchase_invoice_no VARCHAR(100),
    purchase_date DATE,
    job_pipeline_status VARCHAR(100) DEFAULT 'Queue',
    assigned_technician VARCHAR(255),
    warranty_status VARCHAR(100) DEFAULT 'Out of Warranty',
    parts_to_be_ordered TEXT,
    requested_work TEXT,
    extra_info_area TEXT,
    internal_notes TEXT,
    invoice_id TEXT,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS ticket_no VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS barcode_data VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_alternate_phone VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_company_name VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'RETAIL';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS password_lock VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS pattern_lock_sequence JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS rack_location VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS physical_condition TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS outsource_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS gst_tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS cgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS sgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS round_off_adjustment NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS net_due_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'UNPAID';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS warranty_statement VARCHAR(255) DEFAULT '30 Days Parts & Labor Warranty';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS delivered_to VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(100) DEFAULT 'Pending Pickup';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS after_service_remarks TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS technician_name VARCHAR(255) DEFAULT 'Senior Technician';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS technician VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS actual_delivery_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS device_color VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS chassis_color VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS received_qty INT DEFAULT 1;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS received_quantity INT DEFAULT 1;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS hw_checklist JSONB DEFAULT '{}'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS condition_checklist JSONB DEFAULT '{}'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS accessories_checklist JSONB DEFAULT '{}'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS accessories_received TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS os_to_install VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS intake_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS outsource_history_details TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS place_of_purchase VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS purchase_invoice_no VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS job_pipeline_status VARCHAR(100) DEFAULT 'Queue';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS assigned_technician VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS warranty_status VARCHAR(100) DEFAULT 'Out of Warranty';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS parts_to_be_ordered TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS requested_work TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS extra_info_area TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_id TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 6. REPAIR INVOICES MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    ticket_id TEXT NOT NULL,
    ticket_number VARCHAR(100) NOT NULL,
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_gstin VARCHAR(50),
    customer_type VARCHAR(50) DEFAULT 'RETAIL',
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_or_imei VARCHAR(100) NOT NULL,
    line_items JSONB DEFAULT '[]'::jsonb,
    outsource_charges NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) DEFAULT 0.00,
    gst_tax_rate NUMERIC(5,2) DEFAULT 18.00,
    cgst_amount NUMERIC(12,2) DEFAULT 0.00,
    sgst_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_rate NUMERIC(5,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    round_off_adjustment NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    net_due_balance NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    transaction_reference VARCHAR(100),
    warranty_statement VARCHAR(255) DEFAULT '30 Days Parts & Labor Warranty',
    delivered_to VARCHAR(255),
    delivery_status VARCHAR(100) DEFAULT 'Delivered',
    after_service_remarks TEXT,
    invoice_notes TEXT,
    print_title VARCHAR(100) DEFAULT 'TAX INVOICE',
    show_bank_details BOOLEAN DEFAULT TRUE,
    show_terms BOOLEAN DEFAULT TRUE,
    invoice_date DATE DEFAULT CURRENT_DATE,
    ticket_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'RETAIL';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS outsource_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS gst_tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS cgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS sgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS discount_rate NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS round_off_adjustment NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS net_due_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(100);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS warranty_statement VARCHAR(255) DEFAULT '30 Days Parts & Labor Warranty';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS delivered_to VARCHAR(255);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(100) DEFAULT 'Delivered';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS after_service_remarks TEXT;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS invoice_notes TEXT;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS print_title VARCHAR(100) DEFAULT 'TAX INVOICE';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS show_bank_details BOOLEAN DEFAULT TRUE;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS show_terms BOOLEAN DEFAULT TRUE;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS ticket_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 7. OUTSOURCE VOUCHERS MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS outsource_vouchers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_number VARCHAR(100) UNIQUE NOT NULL,
    voucher_date DATE DEFAULT CURRENT_DATE,
    linked_ticket_number VARCHAR(100) NOT NULL,
    vendor_job_id VARCHAR(100),
    vendor_id TEXT NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_phone VARCHAR(50) NOT NULL,
    vendor_city VARCHAR(100) DEFAULT 'Sanchore',
    vendor_address TEXT,
    vendor_gstin VARCHAR(50),
    vendor_contact_person VARCHAR(255),
    service_type VARCHAR(100) NOT NULL,
    outgoing_courier VARCHAR(100) NOT NULL,
    outgoing_docket VARCHAR(100) NOT NULL,
    outgoing_dispatch_date DATE NOT NULL,
    outgoing_freight_cost NUMERIC(12,2) DEFAULT 0.00,
    incoming_courier VARCHAR(100),
    incoming_docket VARCHAR(100),
    incoming_dispatch_date DATE,
    incoming_freight_cost NUMERIC(12,2) DEFAULT 0.00,
    courier_service VARCHAR(100),
    tracking_number VARCHAR(100),
    dispatch_date DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    received_date DATE,
    dispatch_cost NUMERIC(12,2) DEFAULT 0.00,
    return_cost NUMERIC(12,2) DEFAULT 0.00,
    vendor_cost_price NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    customer_selling_price NUMERIC(12,2) DEFAULT 0.00,
    profit_margin NUMERIC(12,2) DEFAULT 0.00,
    dispatch_status VARCHAR(50) DEFAULT 'SHIPPED',
    technical_instructions TEXT,
    testing_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_job_id VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_city VARCHAR(100) DEFAULT 'Sanchore';
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_address TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_phone VARCHAR(50);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_gstin VARCHAR(50);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_contact_person VARCHAR(255);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_courier VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_docket VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_dispatch_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_freight_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_courier VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_docket VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_dispatch_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_freight_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS courier_service VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS dispatch_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS expected_return_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS actual_return_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS received_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS dispatch_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS return_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_cost_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS customer_selling_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS dispatch_status VARCHAR(50) DEFAULT 'SHIPPED';
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS technical_instructions TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS testing_notes TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 8. DATA RECOVERY FORENSIC CASES
-- ============================================================================
CREATE TABLE IF NOT EXISTS data_recovery_cases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    recovery_id_number VARCHAR(50),
    entry_date DATE DEFAULT CURRENT_DATE,
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    customer_gst VARCHAR(50),
    customer_address TEXT,
    device_brand VARCHAR(100),
    device_type VARCHAR(100) DEFAULT 'HDD',
    patient_drive_type VARCHAR(100) DEFAULT 'SATA 3.5 Inch',
    drive_model VARCHAR(100) NOT NULL,
    drive_serial VARCHAR(100) NOT NULL,
    capacity VARCHAR(50),
    capacity_gb INT DEFAULT 1000,
    file_system VARCHAR(50) DEFAULT 'NTFS',
    operating_system VARCHAR(100) DEFAULT 'Windows',
    partition_count INT DEFAULT 1,
    damage_type VARCHAR(100) DEFAULT 'Logical / Bad Sectors',
    priority VARCHAR(50) DEFAULT 'Normal',
    symptoms TEXT,
    status VARCHAR(50) DEFAULT 'Diagnosing',
    case_status VARCHAR(50) DEFAULT 'In Progress',
    case_priority VARCHAR(50) DEFAULT 'Normal',
    technician VARCHAR(255) DEFAULT 'Data Recovery Specialist',
    storage_location VARCHAR(100) DEFAULT 'Cleanroom Bench 1',
    rack_location VARCHAR(100),
    is_outsourced BOOLEAN DEFAULT FALSE,
    outsource JSONB DEFAULT '{}'::jsonb,
    firmware_status VARCHAR(100) DEFAULT 'Healthy',
    head_count INT DEFAULT 2,
    platter_count INT DEFAULT 1,
    cleanroom_required BOOLEAN DEFAULT FALSE,
    cleanroom_phase VARCHAR(100) DEFAULT 'Level 1 Soft Imaging',
    encryption_type VARCHAR(100) DEFAULT 'None',
    encryption_key_provided BOOLEAN DEFAULT FALSE,
    diagnosis_notes TEXT,
    recovery_progress INT DEFAULT 0,
    progress_percentage INT DEFAULT 0,
    estimate_cost NUMERIC(12,2) DEFAULT 0.00,
    quoted_amount NUMERIC(12,2) DEFAULT 0.00,
    advance NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    customer_charge NUMERIC(12,2) DEFAULT 0.00,
    freight NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    total_invoice NUMERIC(12,2) DEFAULT 0.00,
    deposit NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    diagnostic_fee NUMERIC(12,2) DEFAULT 0.00,
    recovery_fee NUMERIC(12,2) DEFAULT 0.00,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'Unpaid',
    terms_consent_accepted BOOLEAN DEFAULT TRUE,
    requested_work TEXT,
    additional_info TEXT,
    confidential_notes TEXT,
    recovery_phase_status VARCHAR(100) DEFAULT 'Diagnosis',
    estimated_data_gb NUMERIC(12,2) DEFAULT 0.00,
    recovered_data_gb NUMERIC(12,2) DEFAULT 0.00,
    extracted_gb NUMERIC(12,2) DEFAULT 0.00,
    health_percentage INT DEFAULT 100,
    donor_drive_model VARCHAR(100),
    donor_drive_serial VARCHAR(100),
    target_drive_details TEXT,
    notes TEXT,
    completion_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_id_number VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS device_brand VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS device_type VARCHAR(100) DEFAULT 'HDD';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS capacity VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS capacity_gb INT DEFAULT 1000;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS patient_drive_type VARCHAR(100) DEFAULT 'SATA 3.5 Inch';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS file_system VARCHAR(50) DEFAULT 'NTFS';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS operating_system VARCHAR(100) DEFAULT 'Windows';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS partition_count INT DEFAULT 1;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS damage_type VARCHAR(100) DEFAULT 'Logical / Bad Sectors';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS symptoms TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Diagnosing';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS case_status VARCHAR(50) DEFAULT 'In Progress';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS case_priority VARCHAR(50) DEFAULT 'Normal';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS technician VARCHAR(255) DEFAULT 'Data Recovery Specialist';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100) DEFAULT 'Cleanroom Bench 1';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS rack_location VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS is_outsourced BOOLEAN DEFAULT FALSE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS outsource JSONB DEFAULT '{}'::jsonb;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS firmware_status VARCHAR(100) DEFAULT 'Healthy';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS head_count INT DEFAULT 2;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS platter_count INT DEFAULT 1;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS cleanroom_required BOOLEAN DEFAULT FALSE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS cleanroom_phase VARCHAR(100) DEFAULT 'Level 1 Soft Imaging';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS encryption_type VARCHAR(100) DEFAULT 'None';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS encryption_key_provided BOOLEAN DEFAULT FALSE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS diagnosis_notes TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_progress INT DEFAULT 0;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS estimate_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS quoted_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS advance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_charge NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS freight NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS total_invoice NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS deposit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS diagnostic_fee NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_fee NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Unpaid';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS terms_consent_accepted BOOLEAN DEFAULT TRUE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS requested_work TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS additional_info TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS confidential_notes TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_phase_status VARCHAR(100) DEFAULT 'Diagnosis';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS estimated_data_gb NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovered_data_gb NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS extracted_gb NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS health_percentage INT DEFAULT 100;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS donor_drive_model VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS donor_drive_serial VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS target_drive_details TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS completion_date DATE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 9. AMC CONTRACTS & ASSET MANAGEMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS amc_contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    manual_entry_date DATE DEFAULT CURRENT_DATE,
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_gst VARCHAR(50),
    customer_address TEXT,
    plan_option VARCHAR(100) DEFAULT 'Gold Plan',
    contract_cost NUMERIC(12,2) DEFAULT 0.00,
    amc_amount NUMERIC(12,2) DEFAULT 0.00,
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    total_amount NUMERIC(12,2) DEFAULT 0.00,
    advance_paid NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'Unpaid',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    renewal_date DATE,
    contract_status VARCHAR(50) DEFAULT 'Active',
    coverage_scope_details TEXT,
    source VARCHAR(100) DEFAULT 'Direct',
    service_type VARCHAR(100) DEFAULT 'On-site',
    number_of_devices INT DEFAULT 1,
    total_service_visits INT DEFAULT 4,
    service_interval_months INT DEFAULT 3,
    total_visits INT DEFAULT 4,
    completed_visits INT DEFAULT 0,
    sla_response_time_hrs INT DEFAULT 4,
    sla_resolution_time_hrs INT DEFAULT 24,
    assigned_technician VARCHAR(255),
    priority VARCHAR(50) DEFAULT 'Normal',
    device_type VARCHAR(100) DEFAULT 'Desktop PC',
    issue_found TEXT,
    notes TEXT,
    service_included_checklist JSONB DEFAULT '[]'::jsonb,
    retail_products JSONB DEFAULT '[]'::jsonb,
    covered_assets JSONB DEFAULT '[]'::jsonb,
    pm_visits JSONB DEFAULT '[]'::jsonb,
    complaints JSONB DEFAULT '[]'::jsonb,
    plan_type VARCHAR(100),
    sla_tier VARCHAR(100),
    payment_frequency VARCHAR(50) DEFAULT 'Annual',
    status VARCHAR(50) DEFAULT 'Active',
    invoice_generated BOOLEAN DEFAULT FALSE,
    invoice_id TEXT,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    terms_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS manual_entry_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS plan_option VARCHAR(100) DEFAULT 'Gold Plan';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS contract_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS amc_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Unpaid';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS renewal_date DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS contract_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS coverage_scope_details TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Direct';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS service_type VARCHAR(100) DEFAULT 'On-site';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS number_of_devices INT DEFAULT 1;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS total_service_visits INT DEFAULT 4;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS service_interval_months INT DEFAULT 3;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS total_visits INT DEFAULT 4;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS completed_visits INT DEFAULT 0;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS sla_response_time_hrs INT DEFAULT 4;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS sla_resolution_time_hrs INT DEFAULT 24;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS assigned_technician VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS device_type VARCHAR(100) DEFAULT 'Desktop PC';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS issue_found TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS service_included_checklist JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS retail_products JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS covered_assets JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS pm_visits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS complaints JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS plan_type VARCHAR(100);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS sla_tier VARCHAR(100);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS payment_frequency VARCHAR(50) DEFAULT 'Annual';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_id TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_date DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 10. SALES INVOICES MASTER (B2B & B2C COMMERCIAL SALES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sales_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_no VARCHAR(100),
    invoice_date DATE DEFAULT CURRENT_DATE,
    customer_id TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_gst VARCHAR(50),
    customer_gstin VARCHAR(50),
    customer_address TEXT,
    place_of_supply VARCHAR(100) DEFAULT 'Rajasthan (08)',
    shipping_address TEXT,
    vehicle_number VARCHAR(50),
    dispatch_through VARCHAR(100),
    e_way_bill_number VARCHAR(100),
    payment_terms VARCHAR(100) DEFAULT 'Due On Receipt',
    payment_method VARCHAR(50) DEFAULT 'CASH',
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'fixed',
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    shipping_charges NUMERIC(12,2) DEFAULT 0.00,
    round_off NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    due_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    sales_rep VARCHAR(255),
    remarks TEXT,
    notes TEXT,
    print_title VARCHAR(100) DEFAULT 'TAX INVOICE',
    show_bank_details BOOLEAN DEFAULT TRUE,
    show_terms BOOLEAN DEFAULT TRUE,
    show_product_remarks_on_print BOOLEAN DEFAULT FALSE,
    show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS invoice_no VARCHAR(100);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS place_of_supply VARCHAR(100) DEFAULT 'Rajasthan (08)';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS dispatch_through VARCHAR(100);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS e_way_bill_number VARCHAR(100);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Due On Receipt';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'fixed';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS shipping_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS round_off NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS due_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS sales_rep VARCHAR(255);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS print_title VARCHAR(100) DEFAULT 'TAX INVOICE';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_bank_details BOOLEAN DEFAULT TRUE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_terms BOOLEAN DEFAULT TRUE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_product_remarks_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 11. PURCHASE INVOICES MASTER (VENDOR PURCHASE BILLS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS purchase_invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bill_number VARCHAR(100) UNIQUE NOT NULL,
    bill_no VARCHAR(100),
    vendor_invoice_number VARCHAR(100),
    supplier_invoice_no VARCHAR(100),
    bill_date DATE DEFAULT CURRENT_DATE,
    delivery_date DATE,
    supplier_id TEXT,
    vendor_id TEXT NOT NULL,
    supplier_name VARCHAR(255),
    vendor_name VARCHAR(255) NOT NULL,
    supplier_phone VARCHAR(50),
    vendor_phone VARCHAR(50),
    supplier_email VARCHAR(255),
    vendor_gst VARCHAR(50),
    supplier_address TEXT,
    vendor_address TEXT,
    payment_terms VARCHAR(100) DEFAULT 'Net 30',
    payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
    supply_type VARCHAR(50) DEFAULT 'INTRA_STATE',
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    shipping_cost NUMERIC(12,2) DEFAULT 0.00,
    freight_charges NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'fixed',
    po_ref_no VARCHAR(100),
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    balance_due NUMERIC(12,2) DEFAULT 0.00,
    balance_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    remarks TEXT,
    notes TEXT,
    print_title VARCHAR(100) DEFAULT 'PURCHASE BILL',
    show_bank_details BOOLEAN DEFAULT TRUE,
    show_terms BOOLEAN DEFAULT TRUE,
    show_product_remarks_on_print BOOLEAN DEFAULT FALSE,
    show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS bill_no VARCHAR(100);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_invoice_number VARCHAR(100);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_invoice_no VARCHAR(100);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS delivery_date DATE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_id TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_id TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(255);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_phone VARCHAR(50);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_phone VARCHAR(50);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_email VARCHAR(255);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_gst VARCHAR(50);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_address TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_address TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Net 30';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supply_type VARCHAR(50) DEFAULT 'INTRA_STATE';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'fixed';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS po_ref_no VARCHAR(100);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS print_title VARCHAR(100) DEFAULT 'PURCHASE BILL';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_bank_details BOOLEAN DEFAULT TRUE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_terms BOOLEAN DEFAULT TRUE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_product_remarks_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 12. SALES RETURNS MASTER (CREDIT NOTES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sales_returns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    return_no VARCHAR(100) UNIQUE NOT NULL,
    return_date DATE DEFAULT CURRENT_DATE,
    original_invoice_no VARCHAR(100),
    customer_id TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_gst VARCHAR(50),
    customer_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    return_reason TEXT NOT NULL,
    restock_to_stock BOOLEAN DEFAULT TRUE,
    refund_status VARCHAR(50) DEFAULT 'Refunded',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS original_invoice_no VARCHAR(100);
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS return_reason TEXT;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS restock_to_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50) DEFAULT 'Refunded';
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE sales_returns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 13. PURCHASE RETURNS MASTER (DEBIT NOTES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS purchase_returns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    return_no VARCHAR(100) UNIQUE NOT NULL,
    return_date DATE DEFAULT CURRENT_DATE,
    original_bill_no VARCHAR(100),
    vendor_id TEXT NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_phone VARCHAR(50),
    vendor_gst VARCHAR(50),
    vendor_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    return_reason TEXT NOT NULL,
    deduct_from_stock BOOLEAN DEFAULT TRUE,
    rma_status VARCHAR(50) DEFAULT 'Completed',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS original_bill_no VARCHAR(100);
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS vendor_phone VARCHAR(50);
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS vendor_gst VARCHAR(50);
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS vendor_address TEXT;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS return_reason TEXT;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS deduct_from_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS rma_status VARCHAR(50) DEFAULT 'Completed';
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE purchase_returns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 14. QUOTATIONS & PROFORMA ESTIMATES MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    quotation_no VARCHAR(100) UNIQUE NOT NULL,
    quotation_date DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    customer_id TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_gst VARCHAR(50),
    customer_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Draft',
    terms_and_conditions TEXT,
    notes TEXT,
    converted_invoice_no VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS valid_until DATE;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft';
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS converted_invoice_no VARCHAR(100);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 15. ACCOUNTING VOUCHERS MASTER (RECEIPTS, PAYMENTS, CONTRA, JOURNALS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounting_vouchers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_number VARCHAR(100) UNIQUE NOT NULL,
    voucher_type VARCHAR(50) NOT NULL,
    voucher_date DATE DEFAULT CURRENT_DATE,
    party_name VARCHAR(255),
    party_phone VARCHAR(50),
    party_gst VARCHAR(50),
    ref_invoice_number VARCHAR(100),
    payment_mode VARCHAR(100) DEFAULT 'Cash',
    instrument_ref_no VARCHAR(100),
    debit_ledger VARCHAR(255),
    credit_ledger VARCHAR(255),
    amount NUMERIC(12,2) DEFAULT 0.00,
    gst_amount NUMERIC(12,2) DEFAULT 0.00,
    total_amount NUMERIC(12,2) DEFAULT 0.00,
    journal_lines JSONB DEFAULT '[]'::jsonb,
    narration TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS party_name VARCHAR(255);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS party_phone VARCHAR(50);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS party_gst VARCHAR(50);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS ref_invoice_number VARCHAR(100);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(100) DEFAULT 'Cash';
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS instrument_ref_no VARCHAR(100);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS debit_ledger VARCHAR(255);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS credit_ledger VARCHAR(255);
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS gst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS journal_lines JSONB DEFAULT '[]'::jsonb;
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS narration TEXT;
ALTER TABLE accounting_vouchers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 16. ACCOUNT LEDGERS MASTER (CUSTOM CHART OF ACCOUNTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS account_ledgers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    account_name VARCHAR(255) NOT NULL,
    group_type VARCHAR(100) NOT NULL DEFAULT 'Expense',
    opening_balance NUMERIC(12,2) DEFAULT 0.00,
    balance_type VARCHAR(10) DEFAULT 'Dr',
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    ifsc_code VARCHAR(50),
    branch_name VARCHAR(100),
    remarks TEXT,
    active_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS group_type VARCHAR(100) DEFAULT 'Expense';
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS balance_type VARCHAR(10) DEFAULT 'Dr';
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS account_number VARCHAR(100);
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(50);
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS branch_name VARCHAR(100);
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS active_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE account_ledgers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 17. HSN CODES MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS hsn_master (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    hsn_code VARCHAR(50) UNIQUE NOT NULL,
    gst_rate NUMERIC(5,2) DEFAULT 18.00,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE hsn_master ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE hsn_master ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE hsn_master ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 18. SUPPORT & LEAD CAPTURE (INQUIRIES, ORDERS, QUOTES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_name VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    service_interested VARCHAR(100) DEFAULT 'General Inquiry',
    status VARCHAR(50) DEFAULT 'New Inquiry',
    source VARCHAR(100) DEFAULT 'Website Contact Form',
    form_category VARCHAR(100) DEFAULT 'general',
    payment_proof_image TEXT,
    utr_number VARCHAR(100),
    order_total NUMERIC(12,2) DEFAULT 0.00,
    license_no VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS form_category VARCHAR(100) DEFAULT 'general';
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS payment_proof_image TEXT;
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS utr_number VARCHAR(100);
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS order_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS license_no VARCHAR(100);
ALTER TABLE support_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 19. ONLINE BOOK REPAIR LEADS
-- ============================================================================
CREATE TABLE IF NOT EXISTS book_repair_leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_no VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    service_mode VARCHAR(100) DEFAULT 'Doorstep Pickup',
    problem_description TEXT NOT NULL,
    address TEXT,
    status VARCHAR(50) DEFAULT 'New Booking',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE book_repair_leads ADD COLUMN IF NOT EXISTS booking_no VARCHAR(100);
ALTER TABLE book_repair_leads ADD COLUMN IF NOT EXISTS service_mode VARCHAR(100) DEFAULT 'Doorstep Pickup';
ALTER TABLE book_repair_leads ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE book_repair_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 20. BLOG ARTICLES MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) DEFAULT 'Accno Technical Team',
    date DATE DEFAULT CURRENT_DATE,
    read_time VARCHAR(50) DEFAULT '5 min read',
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    image_position VARCHAR(50) DEFAULT 'top',
    status VARCHAR(50) DEFAULT 'Published',
    featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'top';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 21. COMPANY MILESTONES & JOURNEY TIMELINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE milestones ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 22. KEY ACHIEVEMENT COUNTER METRICS
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievement_stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE achievement_stats ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE achievement_stats ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE achievement_stats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 23. LEADERSHIP & EXECUTIVE TEAM MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS leadership_team (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    experience_bio TEXT,
    photo_url TEXT,
    initials VARCHAR(10),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leadership_team ADD COLUMN IF NOT EXISTS experience_bio TEXT;
ALTER TABLE leadership_team ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE leadership_team ADD COLUMN IF NOT EXISTS initials VARCHAR(10);
ALTER TABLE leadership_team ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE leadership_team ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 24. HARDWARE REPAIR CATALOG (WEBSITE SHOWCASE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hardware_repair_catalog (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    est_price VARCHAR(100) NOT NULL,
    description TEXT,
    warranty_days INT DEFAULT 30,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE hardware_repair_catalog ADD COLUMN IF NOT EXISTS est_price VARCHAR(100);
ALTER TABLE hardware_repair_catalog ADD COLUMN IF NOT EXISTS warranty_days INT DEFAULT 30;
ALTER TABLE hardware_repair_catalog ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE hardware_repair_catalog ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 25. REPAIR PROCESS STEPS (WEBSITE SOP)
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_process_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    step VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE repair_process_steps ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE repair_process_steps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 26. ENTERPRISE IT & SOLUTIONS GRID
-- ============================================================================
CREATE TABLE IF NOT EXISTS enterprise_solutions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    badge VARCHAR(100),
    link VARCHAR(255),
    icon_name VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE enterprise_solutions ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
ALTER TABLE enterprise_solutions ADD COLUMN IF NOT EXISTS link VARCHAR(255);
ALTER TABLE enterprise_solutions ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE enterprise_solutions ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE enterprise_solutions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 27. DETAILED SERVICES CATALOG (SERVICES PAGE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS detailed_services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category VARCHAR(100) NOT NULL,
    badge VARCHAR(100),
    icon_name VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    short_desc TEXT NOT NULL,
    why_choose TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    ideal_for TEXT,
    turnaround VARCHAR(100),
    warranty VARCHAR(100),
    action_link VARCHAR(255),
    action_text VARCHAR(100),
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS why_choose TEXT;
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS ideal_for TEXT;
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS turnaround VARCHAR(100);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS warranty VARCHAR(100);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS action_link VARCHAR(255);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS action_text VARCHAR(100);
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE detailed_services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 28. SERVICES STATS, PILLARS & FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    value VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_pillars (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    icon_name VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    badge VARCHAR(100),
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services_faqs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 29. WEBSITE PROMOTION BANNERS & CAMPAIGNS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website_promotions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Announcement',
    text TEXT NOT NULL,
    badge_text VARCHAR(100),
    action_text VARCHAR(100),
    action_link VARCHAR(255),
    theme VARCHAR(50) DEFAULT 'emerald',
    is_dismissible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 30. COMPANY SETTINGS & MASTER RULES CONFIGURATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_settings (
    id TEXT PRIMARY KEY DEFAULT 'global_settings',
    settings_key VARCHAR(100) UNIQUE NOT NULL DEFAULT 'global_settings',
    company_details JSONB DEFAULT '{}'::jsonb,
    customer_rules JSONB DEFAULT '{}'::jsonb,
    vendor_rules JSONB DEFAULT '{}'::jsonb,
    inventory_rules JSONB DEFAULT '{}'::jsonb,
    repair_billing_rules JSONB DEFAULT '{}'::jsonb,
    outsource_rules JSONB DEFAULT '{}'::jsonb,
    pos_rules JSONB DEFAULT '{}'::jsonb,
    sale_rules JSONB DEFAULT '{}'::jsonb,
    purchase_rules JSONB DEFAULT '{}'::jsonb,
    sales_return_rules JSONB DEFAULT '{}'::jsonb,
    purchase_return_rules JSONB DEFAULT '{}'::jsonb,
    quotation_rules JSONB DEFAULT '{}'::jsonb,
    voucher_rules JSONB DEFAULT '{}'::jsonb,
    amc_rules JSONB DEFAULT '{}'::jsonb,
    employee_rules JSONB DEFAULT '{}'::jsonb,
    website_promotion_bar JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ACROSS ALL 30 TABLES
-- ============================================================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE outsource_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_recovery_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hsn_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_repair_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE hardware_repair_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE detailed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES (PERMISSIVE ACCESS FOR WEBSITE APPLICATION)
-- ============================================================================
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'employees', 'customers', 'suppliers', 'inventory_items',
        'repair_tickets', 'repair_invoices', 'outsource_vouchers',
        'data_recovery_cases', 'amc_contracts', 'sales_invoices',
        'purchase_invoices', 'sales_returns', 'purchase_returns',
        'quotations', 'accounting_vouchers', 'account_ledgers',
        'hsn_master', 'support_leads', 'book_repair_leads',
        'blog_posts', 'milestones', 'achievement_stats',
        'leadership_team', 'hardware_repair_catalog',
        'repair_process_steps', 'enterprise_solutions',
        'detailed_services', 'service_stats', 'service_pillars',
        'services_faqs', 'website_promotions', 'company_settings'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Read All" ON %I;', tbl);
        EXECUTE format('CREATE POLICY "Public Read All" ON %I FOR SELECT USING (true);', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public Manage All" ON %I;', tbl);
        EXECUTE format('CREATE POLICY "Public Manage All" ON %I FOR ALL USING (true);', tbl);
    END LOOP;
END $$;

-- ============================================================================
-- ADD ALL TABLES TO SUPABASE REALTIME PUBLICATION
-- ============================================================================
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'employees', 'customers', 'suppliers', 'inventory_items',
        'repair_tickets', 'repair_invoices', 'outsource_vouchers',
        'data_recovery_cases', 'amc_contracts', 'sales_invoices',
        'purchase_invoices', 'sales_returns', 'purchase_returns',
        'quotations', 'accounting_vouchers', 'account_ledgers',
        'hsn_master', 'support_leads', 'book_repair_leads',
        'blog_posts', 'milestones', 'achievement_stats',
        'leadership_team', 'hardware_repair_catalog',
        'repair_process_steps', 'enterprise_solutions',
        'detailed_services', 'service_stats', 'service_pillars',
        'services_faqs', 'website_promotions', 'company_settings'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        BEGIN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I;', tbl);
        EXCEPTION
            WHEN duplicate_object THEN
                NULL; -- Already added to realtime, ignore
            WHEN others THEN
                NULL;
        END;
    END LOOP;
END $$;

-- ============================================================================
-- CREATE OPTIMIZATION INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);

CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(code);
CREATE INDEX IF NOT EXISTS idx_suppliers_phone ON suppliers(phone);

CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory_items(code);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory_items(barcode);

CREATE INDEX IF NOT EXISTS idx_tickets_number ON repair_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON repair_tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON repair_tickets(status);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON repair_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_ticket ON repair_invoices(ticket_number);

CREATE INDEX IF NOT EXISTS idx_outsource_voucher ON outsource_vouchers(voucher_number);
CREATE INDEX IF NOT EXISTS idx_outsource_ticket ON outsource_vouchers(linked_ticket_number);

CREATE INDEX IF NOT EXISTS idx_recovery_case ON data_recovery_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_recovery_phone ON data_recovery_cases(customer_phone);

CREATE INDEX IF NOT EXISTS idx_amc_number ON amc_contracts(contract_number);
CREATE INDEX IF NOT EXISTS idx_amc_phone ON amc_contracts(customer_phone);

CREATE INDEX IF NOT EXISTS idx_sales_invoice_no ON sales_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_purch_bill_no ON purchase_invoices(bill_number);
CREATE INDEX IF NOT EXISTS idx_sales_returns_no ON sales_returns(return_no);
CREATE INDEX IF NOT EXISTS idx_purch_returns_no ON purchase_returns(return_no);
CREATE INDEX IF NOT EXISTS idx_quotations_no ON quotations(quotation_no);
CREATE INDEX IF NOT EXISTS idx_vouchers_no ON accounting_vouchers(voucher_number);
CREATE INDEX IF NOT EXISTS idx_ledgers_name ON account_ledgers(account_name);
CREATE INDEX IF NOT EXISTS idx_hsn_code ON hsn_master(hsn_code);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_milestones_year ON milestones(year);
