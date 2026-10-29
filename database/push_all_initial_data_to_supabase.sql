-- ============================================================================
-- ACCNO SOLUTION - PUSH ALL COMPLETE FIELD DATA DIRECTLY INTO SUPABASE TABLES
-- Run this in Supabase SQL Editor to populate every single field for all modules
-- ============================================================================

-- 1. SEED CUSTOMERS (ALL FIELDS)
INSERT INTO customers (
    id, code, customer_code, name, company_name, category, account_group,
    mobile, phone, alternate_phone, email, website, dob, wedding_anniversary,
    pan_number, gstin, address, billing_address, shipping_address, city, state, pincode,
    account_status, credit_limit, current_balance, loyalty_points, kyc_verified,
    tier, total_repairs, notes, bank_account_name, bank_account_type,
    bank_account_number, bank_ifsc, bank_name, bank_branch, upi_id
) VALUES 
(
    'c-1001', 'CUS-1001', 'CUS-1001', 'Rahul Vaishnav', 'Vaishnav Tech Solutions', 'Sundry Debtor', 'Retail / Cash',
    '+91 8696718967', '+91 8696718967', '+91 9414012345', 'rahul.vaishnav@gmail.com', 'https://accnosolution.com', '1992-05-14', '2018-11-20',
    'ABCDE1234F', '08ABCDE1234F1Z5', 'Main Market, Near Char Rasta', 'Main Market, Near Char Rasta', 'Main Market, Near Char Rasta', 'Sanchore', 'Rajasthan', '343041',
    'Active', 25000.00, 0.00, 150, true,
    'Standard', 5, 'Valued local customer with regular printer and desktop services.', 'Rahul Vaishnav', 'Savings',
    '3098101004523', 'SBIN0031234', 'State Bank of India', 'Sanchore Branch', 'rahul8696@upi'
),
(
    'c-1002', 'CUS-1002', 'CUS-1002', 'Mukesh Choudhary', 'Choudhary Hardware Store', 'Sundry Debtor', 'Corporate / B2B',
    '+91 9829012345', '+91 9829012345', '+91 9414098765', 'mukesh@choudharyhardware.in', 'https://choudharyhardware.in', '1985-08-22', '2010-02-15',
    'XYZAB5678G', '08XYZAB5678G1Z9', 'Industrial Area, NH-68', 'Industrial Area, NH-68', 'Industrial Area, NH-68', 'Sanchore', 'Rajasthan', '343041',
    'Active', 100000.00, 12500.00, 480, true,
    'Platinum VIP', 14, 'Commercial client with annual AMC contract.', 'Mukesh Choudhary', 'Current',
    '50200012345678', 'HDFC0001234', 'HDFC Bank', 'Sanchore Branch', 'mukesh@hdfcbank'
),
(
    'c-1003', 'CUS-1003', 'CUS-1003', 'Pooja Dave', 'Dave Education Academy', 'Sundry Debtor', 'Corporate / B2B',
    '+91 9414123456', '+91 9414123456', null, 'info@daveacademy.org', null, null, null,
    null, null, 'Court Road, Behind Bus Stand', 'Court Road, Behind Bus Stand', null, 'Sanchore', 'Rajasthan', '343041',
    'Active', 50000.00, 0.00, 85, true,
    'Standard', 3, 'Academy lab maintenance customer.', 'Dave Education Academy', 'Savings',
    '102345678901', 'BARB0SANCHO', 'Bank of Baroda', 'Sanchore', 'daveacademy@barodampay'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    customer_code = EXCLUDED.customer_code,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    company_name = EXCLUDED.company_name,
    address = EXCLUDED.address,
    gstin = EXCLUDED.gstin,
    updated_at = CURRENT_TIMESTAMP;

-- 2. SEED REPAIR TICKETS (ALL FIELDS - MATCHING UI MODAL EXACTLY)
INSERT INTO repair_tickets (
    id, ticket_number, barcode_data, customer_name, customer_phone,
    customer_alternate_phone, customer_company_name, customer_email, customer_gstin, customer_address, customer_type,
    device_type, brand, model, serial_or_imei, device_color, chassis_color, received_qty, received_quantity,
    password_lock, pattern_lock_sequence, rack_location, problem_reported, physical_condition, requested_work,
    os_to_install, intake_photos, outsource_history_details, place_of_purchase, purchase_invoice_no, purchase_date,
    job_pipeline_status, assigned_technician, technician_name, warranty_status, parts_to_be_ordered, extra_info_area,
    status, priority, progress_percentage, line_items, outsource_charges, freight_charges, estimated_cost,
    advance_paid, discount_amount, gst_tax_rate, subtotal, taxable_amount, cgst_amount, sgst_amount,
    round_off_adjustment, grand_total, net_due_balance, payment_method, payment_status, warranty_statement,
    delivery_status, delivered_to, entry_date, estimated_delivery_date, actual_delivery_date,
    hw_checklist, condition_checklist, accessories_checklist
) VALUES 
(
    't-1001', 'TKT-1001', 'TKT-1001', 'Rahul Vaishnav', '+91 8696718967',
    null, 'Vaishnav Tech Solutions', 'rahul.vaishnav@gmail.com', null, 'Main Market, Near Char Rasta, Sanchore', 'RETAIL',
    'Printer', 'HP', 'MFP 1005M', 'CNB3B112F8', 'Gray', 'Gray', 1, 1,
    '', '[]'::jsonb, 'Shelf A-1, Bin 01', 'Printer not Working. Printing issue.', 'Normal wear & tear', 'Printer pickup roller cleaning and Teflon replacement',
    'No OS / Storage Only', '[]'::jsonb, null, 'Sanchore IT Store', 'INV-8821', '2023-04-10',
    'RECEIVED', 'Deepak Kumar', 'Deepak Kumar', '30 Days Parts & Labor Warranty', 'HP 1005 Teflon Sleeve & Pressure Roller', 'Customer needs emergency turnaround by weekend',
    'received', 'normal', 100,
    '[{"id":"li-1","itemType":"service","description":"LaserJet Fuser Servicing & Teflon Replacement","hsn":"998713","qty":1,"unitPrice":850,"discount":0,"taxRate":18,"taxAmount":153,"total":1003},{"id":"li-2","itemType":"part","description":"HP 1005 Compatible Teflon Sleeve","hsn":"84733020","qty":1,"unitPrice":421.19,"discount":0,"taxRate":18,"taxAmount":75.81,"total":497}]'::jsonb,
    0.00, 0.00, 1500.00, 0.00, 0.00, 18.00, 1271.19, 1271.19, 114.41, 114.41,
    0.00, 1500.00, 1500.00, 'CASH', 'UNPAID', '30 Days Parts & Labor Warranty',
    'IN REPAIR LAB', null, '2026-08-07', '2026-10-31', null,
    '{"display": true, "keyboard": true, "wifi": true, "camera": true, "speakers": true, "charging": true, "powerBtn": true}'::jsonb,
    '{"scratches": true, "missingScrews": false, "crackedBody": false, "liquidIndicator": false, "priorRepair": false}'::jsonb,
    '{"charger": true, "bag": true, "mouse": false, "boxBill": false, "simCard": false}'::jsonb
),
(
    't-1002', 'TKT-1002', 'TKT-1002', 'Mukesh Choudhary', '+91 9829012345',
    '+91 9414098765', 'Choudhary Hardware Store', 'mukesh@choudharyhardware.in', '08XYZAB5678G1Z9', 'Industrial Area, NH-68, Sanchore', 'CORPORATE',
    'Laptop', 'Dell', 'Latitude 3520', '8XK7M22', 'Carbon Black', 'Carbon Black', 1, 1,
    'Dell@2026', '[0, 1, 2, 4, 6, 7, 8]'::jsonb, 'Shelf B-2, Bin 04', 'No power on, blue screen error after 10 minutes of running', 'Minor corner dent, LCD intact', 'Motherboard shorting removal and heat sink re-pasting',
    'Windows 11 Pro 64-bit', '[]'::jsonb, 'None', 'Dell Official Online Store', 'DELL-9921', '2022-09-18',
    'IN_PROGRESS', 'Deepak Kumar', 'Deepak Kumar', '30 Days Parts & Labor Warranty', '19V Power Charging IC', 'Priority business laptop',
    'in_progress', 'high', 60,
    '[{"id":"li-3","itemType":"service","description":"Chip Level Motherboard Diagnostic & BGA Re-Soldering","hsn":"998713","qty":1,"unitPrice":2118.64,"discount":0,"taxRate":18,"taxAmount":381.36,"total":2500}]'::jsonb,
    0.00, 0.00, 2500.00, 1000.00, 0.00, 18.00, 2118.64, 2118.64, 190.68, 190.68,
    0.00, 2500.00, 1500.00, 'UPI', 'PARTIAL', '30 Days Parts & Labor Warranty',
    'IN REPAIR LAB', null, '2026-08-10', '2026-10-30', null,
    '{"display": true, "keyboard": true, "wifi": true, "camera": true, "speakers": true, "charging": false, "powerBtn": true}'::jsonb,
    '{"scratches": true, "missingScrews": false, "crackedBody": false, "liquidIndicator": false, "priorRepair": true}'::jsonb,
    '{"charger": true, "bag": true, "mouse": true, "boxBill": false, "simCard": false}'::jsonb
)
ON CONFLICT (ticket_number) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    customer_phone = EXCLUDED.customer_phone,
    problem_reported = EXCLUDED.problem_reported,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    progress_percentage = EXCLUDED.progress_percentage,
    hw_checklist = EXCLUDED.hw_checklist,
    condition_checklist = EXCLUDED.condition_checklist,
    accessories_checklist = EXCLUDED.accessories_checklist,
    grand_total = EXCLUDED.grand_total,
    net_due_balance = EXCLUDED.net_due_balance,
    updated_at = CURRENT_TIMESTAMP;

-- 3. SEED INVENTORY & RETAIL ITEMS (ALL FIELDS)
INSERT INTO inventory_items (
    id, code, sku, barcode, name, category, item_type, brand, model, product_group,
    uom, unit, default_quantity, mrp, cost_price, selling_price, current_stock,
    quantity_in_stock, min_stock_level, low_stock_alert, active_status, hsn_code,
    gst_rate, tax_rate, storage_location, rack_number, shelf_number, description,
    condition, product_condition, show_on_website_shop
) VALUES 
(
    'inv-1001', 'SSD-512GB-SATA', 'SSD-512GB-SATA', '890123456701', 'Crucial BX500 512GB 2.5 Inch SATA SSD', 'Storage Devices', 'Retail Part', 'Crucial', 'BX500', 'Internal SSD',
    'Pcs', 'Pcs', 1, 3500.00, 2200.00, 2650.00, 18,
    18, 5, 5, 'Active', '84733020',
    18.00, 18.00, 'Shop Shelf A', 'Rack 1', 'Shelf 2', 'High performance 540MB/s 3D NAND Solid State Drive',
    'New', 'New', true
),
(
    'inv-1002', 'RAM-16GB-DDR4', 'RAM-16GB-DDR4', '890123456702', 'Kingston 16GB DDR4 3200MHz Laptop RAM', 'Memory (RAM)', 'Retail Part', 'Kingston', 'ValueRAM', 'Laptop RAM',
    'Pcs', 'Pcs', 1, 4200.00, 2700.00, 3150.00, 12,
    12, 4, 4, 'Active', '84733020',
    18.00, 18.00, 'Shop Shelf A', 'Rack 1', 'Shelf 3', 'SO-DIMM 260-Pin 1.2V High Speed Laptop Memory',
    'New', 'New', true
),
(
    'inv-1003', 'ADP-DELL-65W', 'ADP-DELL-65W', '890123456703', 'Dell 65W Original Round Pin Laptop Adapter', 'Adapters & Chargers', 'Retail Part', 'Dell', 'Original 65W', 'Power Supply',
    'Pcs', 'Pcs', 1, 1800.00, 950.00, 1250.00, 25,
    25, 6, 6, 'Active', '85044020',
    18.00, 18.00, 'Shop Shelf B', 'Rack 2', 'Shelf 1', '19.5V 3.34A 4.5mm Small Pin High Reliability Adapter',
    'New', 'New', true
),
(
    'inv-1004', 'LPT-HP-REF-840G3', 'LPT-HP-REF-840G3', '890123456704', 'HP EliteBook 840 G3 Refurbished Laptop (Core i5 6th, 8GB, 256GB SSD)', 'Refurbished Laptops', 'Retail Part', 'HP', 'EliteBook 840 G3', 'Commercial Laptop',
    'Pcs', 'Pcs', 1, 28000.00, 14000.00, 17500.00, 4,
    4, 2, 2, 'Active', '84713010',
    18.00, 18.00, 'Display Glass Counter', 'Counter 1', 'Top Shelf', 'A+ Grade Refurbished, Metal Body, FHD Display, 6 Months Warranty',
    'Refurbished', 'Refurbished', true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    selling_price = EXCLUDED.selling_price,
    cost_price = EXCLUDED.cost_price,
    current_stock = EXCLUDED.current_stock,
    updated_at = CURRENT_TIMESTAMP;

-- 4. SEED VENDORS & SUPPLIERS (ALL FIELDS)
INSERT INTO suppliers (
    id, code, vendor_code, company_name, vendor_name, name, contact_person,
    vendor_type, category, account_group, phone, alternate_phone, email, website,
    station, state, full_address, address, gstin, pan_number, bank_name,
    bank_account_name, bank_account_number, bank_ifsc, bank_branch, upi_id,
    opening_balance, current_balance, max_credit_limit, active_status
) VALUES 
(
    'ven-1001', 'VEN-1001', 'VEN-1001', 'Supertron Infotech Pvt Ltd', 'Supertron Infotech', 'Supertron Infotech', 'Rajesh Mehta',
    'Standard Vendor', 'Hardware Distributor', 'Sundry Creditor', '+91 9825011223', '+91 7926543210', 'sales@supertron.com', 'https://supertron.com',
    'Ahmedabad', 'Gujarat', '402, Titanium City Centre, Anandnagar Road, Ahmedabad', '402, Titanium City Centre, Anandnagar Road, Ahmedabad', '24AABCS1234D1Z2', 'AABCS1234D', 'ICICI Bank',
    'Supertron Infotech Pvt Ltd', '002405001234', 'ICIC0000024', 'Anandnagar Branch', 'supertron@icici',
    0.00, 18500.00, 200000.00, 'Active'
),
(
    'ove-1001', 'OVE-1001', 'OVE-1001', 'Rajasthan Laser BGA Lab', 'Rajasthan Laser BGA Lab', 'Rajasthan Laser BGA Lab', 'Dinesh Suthar',
    'Outsource Vendor', 'BGA / Motherboard Outsource', 'Sundry Creditor', '+91 9414288990', null, 'bgalab.jodhpur@gmail.com', null,
    'Jodhpur', 'Rajasthan', 'Near Jalori Gate, Jodhpur', 'Near Jalori Gate, Jodhpur', null, 'APSDS8891K', 'State Bank of India',
    'Dinesh Suthar', '201948572019', 'SBIN0001245', 'Jalori Gate', 'dineshbga@sbi',
    0.00, 3200.00, 50000.00, 'Active'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone,
    current_balance = EXCLUDED.current_balance,
    updated_at = CURRENT_TIMESTAMP;

-- 5. SEED OUTSOURCED REPAIRS (ALL FIELDS)
INSERT INTO outsource_vouchers (
    id, voucher_number, voucher_date, linked_ticket_number, vendor_id, vendor_name,
    vendor_phone, vendor_city, vendor_address, service_type, outgoing_courier, outgoing_docket,
    outgoing_dispatch_date, outgoing_freight_cost, incoming_courier, incoming_docket,
    incoming_dispatch_date, incoming_freight_cost, expected_return_date, vendor_cost_price,
    freight_charges, customer_selling_price, profit_margin, dispatch_status, technical_instructions
) VALUES 
(
    'out-1001', 'OUT-1001', '2026-08-11', 'TKT-1002', 'ove-1001', 'Rajasthan Laser BGA Lab',
    '+91 9414288990', 'Jodhpur', 'Near Jalori Gate, Jodhpur', 'Laptop Motherboard BGA Repair', 'DTDC Courier', 'D48920192',
    '2026-08-11', 150.00, 'DTDC Courier', 'D48929944',
    null, 150.00, '2026-08-16', 1200.00,
    300.00, 2500.00, 1000.00, 'SHIPPED', 'Please re-ball southbridge controller and inspect 3.3V power regulator circuit.'
)
ON CONFLICT (id) DO UPDATE SET
    vendor_name = EXCLUDED.vendor_name,
    dispatch_status = EXCLUDED.dispatch_status,
    profit_margin = EXCLUDED.profit_margin,
    updated_at = CURRENT_TIMESTAMP;

-- 6. SEED DATA RECOVERY CASES (ALL FIELDS)
INSERT INTO data_recovery_cases (
    id, case_number, recovery_id_number, entry_date, customer_name, customer_phone,
    customer_email, device_brand, device_type, drive_model, serial_number, capacity,
    file_system, damage_type, priority, status, recovery_phase_status, progress_percentage,
    estimate_cost, quoted_amount, advance_paid, balance_due, payment_status,
    technician, diagnosis_notes
) VALUES 
(
    'dr-1001', 'REC-1001', 'REC-1001', '2026-08-08', 'Mahesh Jain', '+91 9829144556',
    'mahesh.jain@tallyaccountant.com', 'Western Digital', 'Hard Drive (HDD)', 'WD Blue 1TB', 'WD-WCC4N70291', '1 TB',
    'NTFS', 'Head Click / Read Head Malfunction', 'Urgent', 'In Progress', 'Phase 2: Cleanroom Donor Swap', 65,
    6500.00, 6500.00, 2000.00, 4500.00, 'Partial',
    'Deepak Kumar', 'Drive making repeated clicking sound. Requires donor head assembly replacement in Class 100 clean bench.'
)
ON CONFLICT (id) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    status = EXCLUDED.status,
    progress_percentage = EXCLUDED.progress_percentage,
    balance_due = EXCLUDED.balance_due,
    updated_at = CURRENT_TIMESTAMP;

-- 7. SEED AMC CONTRACTS (ALL FIELDS)
INSERT INTO amc_contracts (
    id, contract_number, manual_entry_date, customer_name, customer_phone,
    customer_email, customer_address, company_name, plan_option, start_date,
    end_date, renewal_date, contract_status, service_type, number_of_devices,
    total_service_visits, completed_visits, amc_amount, total_amount, advance_paid,
    balance_due, payment_status, assigned_technician, notes
) VALUES 
(
    'amc-1001', 'AMC-1001', '2026-01-01', 'Mukesh Choudhary', '+91 9829012345',
    'mukesh@choudharyhardware.in', 'Industrial Area, NH-68, Sanchore', 'Choudhary Hardware Store', 'Comprehensive Gold Plan', '2026-01-01',
    '2026-12-31', '2026-12-31', 'Active', 'On-site Support', 8,
    4, 2, 24000.00, 28320.00, 28320.00,
    0.00, 'Paid', 'Deepak Kumar', 'Covers 6 Desktops, 2 Laptops, LAN switch and printer connectivity quarterly visits.'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    contract_status = EXCLUDED.contract_status,
    updated_at = CURRENT_TIMESTAMP;

-- 8. SEED HSN CODE MASTER (ALL FIELDS)
INSERT INTO hsn_master (id, hsn_code, description, gst_rate, cgst_rate, sgst_rate, igst_rate) VALUES
('hsn-1', '84733020', 'Parts and accessories of the machines of heading 8471 (Computer Parts, Motherboards, RAM, SSD)', 18.00, 9.00, 9.00, 18.00),
('hsn-2', '84713010', 'Personal computers (Laptops, Desktops, Microcomputers)', 18.00, 9.00, 9.00, 18.00),
('hsn-3', '85044020', 'Electric power supplies (Laptop Chargers, Desktop SMPS, Adapters)', 18.00, 9.00, 9.00, 18.00),
('hsn-4', '998713', 'Maintenance and repair services of computers and peripheral equipment (Hardware Labor)', 18.00, 9.00, 9.00, 18.00),
('hsn-5', '998313', 'Information technology (IT) support and data recovery consulting services', 18.00, 9.00, 9.00, 18.00),
('hsn-6', '85285200', 'Computer monitors capable of directly connecting to and designed for use with an automatic data processing machine', 18.00, 9.00, 9.00, 18.00)
ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    gst_rate = EXCLUDED.gst_rate;

-- 9. SEED CHART OF ACCOUNTS / CUSTOM LEDGERS (ALL FIELDS)
INSERT INTO account_ledgers (id, account_name, account_group, opening_balance, balance_type, description) VALUES
('led-1', 'Cash in Hand (Counter)', 'Cash-in-Hand', 15400.00, 'Dr', 'Daily shop counter physical cash register'),
('led-2', 'HDFC Bank Current A/c', 'Bank Accounts', 142500.00, 'Dr', 'Primary operational commercial business current account'),
('led-3', 'State Bank of India (SBI)', 'Bank Accounts', 38200.00, 'Dr', 'Secondary UPI collection and vendor payout account'),
('led-4', 'Hardware Repair & Labor Income', 'Direct Incomes', 0.00, 'Cr', 'Revenue earned from component-level repairing and lab servicing'),
('led-5', 'Retail Products Sales Account', 'Sales Accounts', 0.00, 'Cr', 'Revenue earned from selling computer parts and refurbished laptops'),
('led-6', 'Inventory Purchase Account', 'Purchase Accounts', 0.00, 'Dr', 'Stock inventory and spare component inward acquisition costs'),
('led-7', 'Outsource Vendor Repair Charges', 'Direct Expenses', 0.00, 'Dr', 'Expenses paid to external specialized BGA labs and cleanrooms')
ON CONFLICT (id) DO UPDATE SET
    account_name = EXCLUDED.account_name,
    account_group = EXCLUDED.account_group;

-- 10. SEED COMPANY PROFILE & SETTINGS (ALL FIELDS)
INSERT INTO company_settings (id, key, value) VALUES
(
    'set-1',
    'company_details',
    '{
        "companyName": "Accno Solution",
        "tagline": "Advanced Chip-Level Laptop, Desktop & Printer Care",
        "phone": "+91 9468781166",
        "alternatePhone": "+91 9587781166",
        "email": "support@accnosolution.com",
        "website": "https://accnosolution.com",
        "gstin": "08ABCDE1234F1Z5",
        "panNumber": "ABCDE1234F",
        "address": "Opposite Court Road, Near Char Rasta",
        "city": "Sanchore",
        "state": "Rajasthan",
        "pinCode": "343041",
        "bankName": "HDFC Bank",
        "bankAccountName": "Accno Solution",
        "bankAccountNumber": "50200088991122",
        "bankIfscCode": "HDFC0001234",
        "bankBranch": "Sanchore Branch",
        "upiId": "support.time24x7-3@okhdfcbank"
    }'::jsonb
),
(
    'set-2',
    'website_promotion_bar',
    '{
        "enabled": true,
        "bannerText": "🔥 Festive Offer: Free Motherboard Diagnosis & 15% OFF on High-Speed NVMe SSD Upgrades in Sanchore!",
        "badgeText": "FLASH DEAL",
        "buttonText": "Book Service",
        "buttonLink": "/book-repair",
        "gradientTheme": "green"
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;
