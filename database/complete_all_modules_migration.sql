-- ============================================================================
-- ACCNO SOLUTION ENTERPRISE ERP - COMPLETE ALL MODULES SCHEMA MIGRATION
-- Adds all missing columns and creates all missing tables across all ERP modules
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/aicszyyvlqzxbpqknwum/sql
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CUSTOMERS DIRECTORY - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Sundry Debtor';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_group VARCHAR(100) DEFAULT 'Retail / Cash';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Sanchore';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Rajasthan';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS current_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'Standard';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_repairs INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_type VARCHAR(50) DEFAULT 'Savings';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. INVENTORY & POS PRODUCTS - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'retail_product';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_group VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'Pcs';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS default_quantity INT DEFAULT 1;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS selling_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS mrp NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS min_stock_alert INT DEFAULT 2;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(20) DEFAULT '84733020';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS location VARCHAR(100) DEFAULT 'Shop Shelf';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100) DEFAULT 'Shop Shelf';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS active_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_image TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS product_condition VARCHAR(50) DEFAULT 'New';
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS refurbished_description TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS compatible_models TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS comfortability_features TEXT;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS supplier_vendor VARCHAR(255);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS conversion_factor NUMERIC(8,2) DEFAULT 1.00;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS conversion_unit VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS opening_balance INT DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS show_on_website_shop BOOLEAN DEFAULT TRUE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 3. SUPPLIERS & VENDORS - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vendor_type VARCHAR(50) DEFAULT 'Standard Vendor';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vendor_code VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS account_group VARCHAR(100) DEFAULT 'Sundry Creditor';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS designation VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_type VARCHAR(50) DEFAULT 'Current';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Net 30 Days';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS current_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS max_credit_limit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Components';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS active_status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 4. REPAIR TICKETS & JOB CARDS - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS barcode_data VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_alternate_phone VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'RETAIL';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS device_color VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS received_qty INT DEFAULT 1;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS password_lock VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS pattern_lock_sequence JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS rack_location VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS physical_condition TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS requested_work TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS os_to_install VARCHAR(100);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS intake_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS job_pipeline_status VARCHAR(100) DEFAULT 'RECEIVED';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS outsource_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS gst_tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS cgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS sgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS round_off_adjustment NUMERIC(6,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS net_due_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'UNPAID';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS warranty_statement TEXT DEFAULT '30 Days Parts & Labor Warranty';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS delivered_to VARCHAR(255);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(100) DEFAULT 'IN REPAIR LAB';
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS after_service_remarks TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS outsource_history_details TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS technician_signature TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS customer_signature TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS actual_delivery_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_id TEXT;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS invoice_date DATE;
ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 5. REPAIR INVOICES - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS ticket_id TEXT;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS ticket_number VARCHAR(50);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'RETAIL';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS device_type VARCHAR(100);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS serial_or_imei VARCHAR(100);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS outsource_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS gst_tax_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS cgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS sgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS round_off_adjustment NUMERIC(6,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS net_due_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS warranty_statement TEXT DEFAULT '30 Days Parts & Labor Warranty';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS delivered_to VARCHAR(255);
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(100) DEFAULT 'DELIVERED TO CUSTOMER';
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS after_service_remarks TEXT;
ALTER TABLE repair_invoices ADD COLUMN IF NOT EXISTS ticket_details JSONB;

-- ============================================================================
-- 6. DATA RECOVERY CASES - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_gst VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS media_brand VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS media_model VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS capacity VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS file_system VARCHAR(50);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS damage_type VARCHAR(100) DEFAULT 'Drive Not Detected';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS symptoms TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS cleanroom_status VARCHAR(100) DEFAULT 'Pending Inspection';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_stage VARCHAR(100) DEFAULT 'In Lab Inspection';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_phase_status VARCHAR(100) DEFAULT 'Phase 1: Diagnostic';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 35;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS estimated_quote NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS customer_charge NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS freight NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS total_invoice NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS deposit NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS diagnostic_fee NUMERIC(12,2) DEFAULT 500.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovery_fee NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Unpaid';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS technician_name VARCHAR(255) DEFAULT 'Deepak Kumar';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100) DEFAULT 'Safe Locker';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS rack_location VARCHAR(100) DEFAULT 'Rack DR-1';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS is_outsourced BOOLEAN DEFAULT FALSE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS outsource_details JSONB;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS target_media_provided VARCHAR(255);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS recovered_data_size_gb NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS estimated_data_gb NUMERIC(10,2) DEFAULT 100.00;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS health_percentage INT DEFAULT 85;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS donor_drive_serial VARCHAR(100);
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS terms_consent_accepted BOOLEAN DEFAULT TRUE;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS requested_work TEXT DEFAULT 'Data Recovery Lab Extraction';
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS additional_info TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS confidential_notes TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE data_recovery_cases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 7. AMC CONTRACTS - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS manual_entry_date DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS plan_option VARCHAR(100) DEFAULT 'Comprehensive Plan';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS contract_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS amc_type VARCHAR(100) DEFAULT 'Comprehensive Hardware AMC';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(50) DEFAULT 'Annual';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS total_devices_covered INT DEFAULT 1;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS total_service_visits INT DEFAULT 4;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS contract_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS gst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS renewal_date DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Unpaid';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50) DEFAULT 'Bank Transfer';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS assigned_technician VARCHAR(255) DEFAULT 'Deepak Kumar';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS devices_covered TEXT DEFAULT 'Desktop PC / Laptop';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS device_type VARCHAR(100) DEFAULT 'Desktop PC / Laptop';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Direct Customer';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS service_type VARCHAR(100) DEFAULT 'On-site Support';
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS issue_found TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS service_included_checklist JSONB DEFAULT '["Quarterly Maintenance", "OS Tuning", "Antivirus Updates"]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS retail_products JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS covered_assets JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS pm_visits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS complaints JSONB DEFAULT '[]'::jsonb;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS invoice_date DATE;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE amc_contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 8. OUTSOURCE VOUCHERS - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS linked_ticket_id TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS linked_ticket_number VARCHAR(50);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_job_id VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_id TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_phone VARCHAR(50);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_city VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_address TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_gstin VARCHAR(50);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS service_type VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_courier VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_docket VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_dispatch_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS outgoing_freight_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_courier VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_docket VARCHAR(100);
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_dispatch_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS incoming_freight_cost NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS expected_return_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS received_date DATE;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS vendor_cost_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS customer_selling_price NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS dispatch_status VARCHAR(100) DEFAULT 'SHIPPED';
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS technical_instructions TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS testing_notes TEXT;
ALTER TABLE outsource_vouchers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 9. SALES INVOICES - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS customer_gstin VARCHAR(50);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Immediate';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'fixed';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS taxable_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS cgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS sgst_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS round_off_adjustment NUMERIC(6,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS shipping_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS due_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS sales_rep VARCHAR(255);
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_product_remarks_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 10. PURCHASE INVOICES - ADD ALL MISSING FIELDS
-- ============================================================================
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_invoice_no VARCHAR(100);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supplier_id TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_phone VARCHAR(50);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_gst VARCHAR(50);
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS vendor_address TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100) DEFAULT 'Net 30';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS freight_charges NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PAID';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS supply_type VARCHAR(50) DEFAULT 'INTRA_STATE';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'fixed';
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_product_remarks_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS show_refurbished_badge_on_print BOOLEAN DEFAULT FALSE;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE purchase_invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- 11. CREATE TABLE: ACCOUNTING VOUCHERS & LEDGERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounting_vouchers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    voucher_type VARCHAR(50) NOT NULL, -- RECEIPT, PAYMENT, CONTRA, JOURNAL, DEBIT_NOTE, CREDIT_NOTE
    voucher_date DATE DEFAULT CURRENT_DATE,
    party_type VARCHAR(50) DEFAULT 'CUSTOMER', -- CUSTOMER, VENDOR, EXPENSE, BANK, CASH
    party_id TEXT,
    party_name VARCHAR(255) NOT NULL,
    party_phone VARCHAR(50),
    amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_mode VARCHAR(50) DEFAULT 'CASH', -- CASH, UPI, NEFT, CHEQUE
    reference_no VARCHAR(100),
    debit_account VARCHAR(100),
    credit_account VARCHAR(100),
    narration TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounting_vouchers_no ON accounting_vouchers(voucher_number);
CREATE INDEX IF NOT EXISTS idx_accounting_vouchers_type ON accounting_vouchers(voucher_type);

-- ============================================================================
-- 12. CREATE TABLE: SALES RETURNS (CREDIT NOTES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sales_returns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    return_no VARCHAR(50) UNIQUE NOT NULL,
    return_date DATE DEFAULT CURRENT_DATE,
    original_invoice_no VARCHAR(50),
    customer_id TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    refund_mode VARCHAR(50) DEFAULT 'Store Credit',
    return_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sales_returns_no ON sales_returns(return_no);

-- ============================================================================
-- 13. CREATE TABLE: PURCHASE RETURNS (DEBIT NOTES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS purchase_returns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    return_no VARCHAR(50) UNIQUE NOT NULL,
    return_date DATE DEFAULT CURRENT_DATE,
    original_bill_no VARCHAR(50),
    vendor_id TEXT,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_phone VARCHAR(50),
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    refund_mode VARCHAR(50) DEFAULT 'Vendor Balance Adjustment',
    return_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_purchase_returns_no ON purchase_returns(return_no);

-- ============================================================================
-- 14. CREATE TABLE: QUOTATIONS & ESTIMATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    quotation_no VARCHAR(50) UNIQUE NOT NULL,
    quotation_date DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_gst VARCHAR(50),
    customer_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Draft',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotations_no ON quotations(quotation_no);

-- ============================================================================
-- 15. CREATE TABLE: HARDWARE REPAIR CATALOG (WEBSITE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hardware_repair_catalog (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category VARCHAR(100) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    turnaround_time VARCHAR(100),
    starting_price NUMERIC(12,2) DEFAULT 0.00,
    warranty_period VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 16. CREATE TABLE: REPAIR PROCESS STEPS (WEBSITE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS repair_process_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    step_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'CheckCircle',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 17. CREATE TABLE: COMPANY SETTINGS & RULES CONFIGURATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    company_details JSONB DEFAULT '{}'::jsonb,
    customer_rules JSONB DEFAULT '{}'::jsonb,
    vendor_rules JSONB DEFAULT '{}'::jsonb,
    inventory_rules JSONB DEFAULT '{}'::jsonb,
    repair_billing_rules JSONB DEFAULT '{}'::jsonb,
    outsource_rules JSONB DEFAULT '{}'::jsonb,
    amc_rules JSONB DEFAULT '{}'::jsonb,
    sale_rules JSONB DEFAULT '{}'::jsonb,
    purchase_rules JSONB DEFAULT '{}'::jsonb,
    pos_rules JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 18. ENABLE ROW LEVEL SECURITY & PUBLIC POLICIES FOR ALL TABLES
-- ============================================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE outsource_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_recovery_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_repair_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hardware_repair_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Full Access Customers" ON customers;
    CREATE POLICY "Public Full Access Customers" ON customers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Inventory" ON inventory_items;
    CREATE POLICY "Public Full Access Inventory" ON inventory_items FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Suppliers" ON suppliers;
    CREATE POLICY "Public Full Access Suppliers" ON suppliers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Tickets" ON repair_tickets;
    CREATE POLICY "Public Full Access Tickets" ON repair_tickets FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Invoices" ON repair_invoices;
    CREATE POLICY "Public Full Access Invoices" ON repair_invoices FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Outsource" ON outsource_vouchers;
    CREATE POLICY "Public Full Access Outsource" ON outsource_vouchers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Recovery" ON data_recovery_cases;
    CREATE POLICY "Public Full Access Recovery" ON data_recovery_cases FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access AMC" ON amc_contracts;
    CREATE POLICY "Public Full Access AMC" ON amc_contracts FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Sales" ON sales_invoices;
    CREATE POLICY "Public Full Access Sales" ON sales_invoices FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Purchases" ON purchase_invoices;
    CREATE POLICY "Public Full Access Purchases" ON purchase_invoices FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Employees" ON employees;
    CREATE POLICY "Public Full Access Employees" ON employees FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Accounting" ON accounting_vouchers;
    CREATE POLICY "Public Full Access Accounting" ON accounting_vouchers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access SalesReturns" ON sales_returns;
    CREATE POLICY "Public Full Access SalesReturns" ON sales_returns FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access PurchaseReturns" ON purchase_returns;
    CREATE POLICY "Public Full Access PurchaseReturns" ON purchase_returns FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Quotations" ON quotations;
    CREATE POLICY "Public Full Access Quotations" ON quotations FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Catalog" ON hardware_repair_catalog;
    CREATE POLICY "Public Full Access Catalog" ON hardware_repair_catalog FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Process" ON repair_process_steps;
    CREATE POLICY "Public Full Access Process" ON repair_process_steps FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Full Access Settings" ON company_settings;
    CREATE POLICY "Public Full Access Settings" ON company_settings FOR ALL USING (true);
END $$;

-- ============================================================================
-- 19. ENABLE SUPABASE REALTIME REPLICATION FOR ALL TABLES
-- ============================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE customers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE inventory_items;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE repair_tickets;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE repair_invoices;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE outsource_vouchers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE data_recovery_cases;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE amc_contracts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE sales_invoices;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE purchase_invoices;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE employees;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE accounting_vouchers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE sales_returns;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE purchase_returns;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE quotations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
