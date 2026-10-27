-- ============================================================================
-- ACCNO SOLUTION ENTERPRISE ERP & CUSTOMER PORTAL DATABASE SCHEMA
-- Target Database: PostgreSQL 15+ / Supabase PostgreSQL
-- Author: ACCNO SOLUTION Software Engineering Team
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & CONSTANTS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'technician', 'sales', 'accounts', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('received', 'diagnosing', 'waiting_approval', 'approved', 'in_progress', 'testing', 'ready_for_pickup', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'bank_transfer', 'split');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE inventory_type AS ENUM ('retail_product', 'service_part', 'accessory');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE recovery_status AS ENUM ('assessment', 'in_cleanroom', 'extracting', 'completed', 'unrecoverable');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE amc_type AS ENUM ('hardware', 'software', 'comprehensive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 2. USERS & ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'customer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 3. CUSTOMER MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    email VARCHAR(255),
    is_business BOOLEAN DEFAULT FALSE NOT NULL,
    company_name VARCHAR(255),
    gst_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100) DEFAULT 'Jammu',
    state VARCHAR(100) DEFAULT 'J&K',
    pincode VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);

-- ============================================================================
-- 4. TECHNICIANS & EMPLOYEES
-- ============================================================================

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    emp_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    salary DECIMAL(12,2) DEFAULT 0.00,
    joining_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 5. INVENTORY & PARTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    item_type inventory_type DEFAULT 'retail_product' NOT NULL,
    unit_purchase_price DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    unit_selling_price DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    quantity_in_stock INT DEFAULT 0 NOT NULL,
    min_stock_alert INT DEFAULT 5 NOT NULL,
    location VARCHAR(100),
    hsn_code VARCHAR(20),
    gst_rate DECIMAL(5,2) DEFAULT 18.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory_items(barcode);

CREATE TABLE IF NOT EXISTS serial_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    serial_or_imei VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'available' NOT NULL, -- available, sold, used_in_repair, defective
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 6. REPAIR TICKETS & JOB CARDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS repair_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    barcode_data VARCHAR(100) UNIQUE NOT NULL,
    qr_code_url TEXT,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    technician_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    
    device_type VARCHAR(100) NOT NULL, -- Laptop, Desktop, Mac, Printer, Data Recovery Media, CCTV DVR
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_or_imei VARCHAR(100),
    accessories_received TEXT,
    physical_condition TEXT,
    installed_os VARCHAR(100),
    device_password VARCHAR(100),
    
    problem_reported TEXT NOT NULL,
    diagnosis_notes TEXT,
    technician_private_notes TEXT,
    
    status ticket_status DEFAULT 'received' NOT NULL,
    priority ticket_priority DEFAULT 'normal' NOT NULL,
    
    estimated_cost DECIMAL(12,2) DEFAULT 0.00,
    advance_paid DECIMAL(12,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) DEFAULT 0.00,
    warranty_period VARCHAR(50) DEFAULT '30 Days Warranty',
    
    expected_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    customer_approved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_number ON repair_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON repair_tickets(customer_id);

CREATE TABLE IF NOT EXISTS ticket_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES repair_tickets(id) ON DELETE CASCADE NOT NULL,
    status ticket_status NOT NULL,
    notes TEXT,
    created_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 7. REPAIR BILLING, INVOICES & POS
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id UUID REFERENCES repair_tickets(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0.00,
    cgst_amount DECIMAL(12,2) DEFAULT 0.00,
    sgst_amount DECIMAL(12,2) DEFAULT 0.00,
    igst_amount DECIMAL(12,2) DEFAULT 0.00,
    total_tax DECIMAL(12,2) DEFAULT 0.00,
    grand_total DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    due_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid' NOT NULL, -- unpaid, partial, paid
    payment_method payment_method DEFAULT 'cash',
    invoice_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 18.00 NOT NULL,
    total DECIMAL(12,2) NOT NULL
);

-- ============================================================================
-- 8. DATA RECOVERY CASES
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_recovery_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id UUID REFERENCES repair_tickets(id) ON DELETE CASCADE NOT NULL,
    media_type VARCHAR(100) NOT NULL, -- HDD, SSD, NVMe, SD Card, RAID Array, Pen Drive
    capacity VARCHAR(50),
    file_system VARCHAR(50), -- NTFS, FAT32, exFAT, APFS, EXT4
    recovery_status recovery_status DEFAULT 'assessment' NOT NULL,
    total_data_size_gb DECIMAL(10,2) DEFAULT 0.00,
    recovered_data_size_gb DECIMAL(10,2) DEFAULT 0.00,
    recovered_file_types TEXT,
    cleanroom_required BOOLEAN DEFAULT FALSE,
    quote_amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 9. AMC (ANNUAL MAINTENANCE CONTRACTS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS amc_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    amc_type amc_type DEFAULT 'hardware' NOT NULL,
    total_devices_covered INT DEFAULT 1 NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_amount DECIMAL(12,2) NOT NULL,
    visits_per_year INT DEFAULT 4 NOT NULL,
    visits_completed INT DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- active, expired, pending_renewal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 10. LEADS & CRM
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    service_interested VARCHAR(100) NOT NULL,
    estimated_value DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'new' NOT NULL, -- new, contacted, quotation_sent, won, lost
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 11. EXPENSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- Rent, Electricity, Spare Parts, Salary, Internet, Miscellaneous
    amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method DEFAULT 'cash',
    reference_no VARCHAR(100),
    expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 12. AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 13. SEED INITIAL ADMINISTRATOR DATA
-- ============================================================================

INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@accnosolution.com',
    '$2a$10$7rK3xZ7aC8gK/K5E6ZzBQuX8JzN4o3Q1K1Z2X3Y4Z5W6V7U8T9S0R', -- Demo hashed pass: Admin@2025
    'ACCNO Super Admin',
    '+919419195050',
    'super_admin',
    true
) ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (id, customer_code, name, phone, email, is_business, company_name, gst_number)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'CUST-1001',
    'Rajesh Kumar',
    '+919876543210',
    'rajesh@example.com',
    true,
    'Tech Logics Pvt Ltd',
    '01AAAAA0000A1Z5'
) ON CONFLICT (customer_code) DO NOTHING;

-- Done Database Schema
