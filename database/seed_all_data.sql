-- ============================================================================
-- ACCNO SOLUTION - FULL DATABASE SEED DATA FOR SUPABASE
-- Run this in Supabase SQL Editor AFTER executing supabase_schema.sql
-- ============================================================================

-- 1. SEED EMPLOYEES & STAFF RECORDS (4 Records)
INSERT INTO employees (
    id, emp_code, name, email, role, department, designation, active_status,
    password_hash_or_plain, phone, alternate_phone, joining_date, base_salary,
    address, emergency_contact_name, emergency_contact_phone, govt_id_type,
    govt_id_number, bank_account_name, bank_account_number, bank_name,
    bank_branch, bank_branch_code, bank_ifsc_code, permissions
) VALUES (
    'emp-1001',
    'EMP-1001',
    'Deepak Kumar',
    'admin@accnosolution.com',
    'Lead Technician',
    'Admin',
    'Admin',
    'Active',
    'Admin@123',
    '+91 9468781166',
    '+91 9587781166',
    '2020-06-15',
    45000,
    'Sanchore',
    '',
    '',
    'Aadhaar Card',
    '',
    'Deepak Kumar',
    '29450100022394',
    'Bank of Baroda',
    'Sanchore',
    'BARB0SANCHO',
    'BARB0SANCHO',
    '{"repairTickets":{"view":true,"create":true,"edit":true,"delete":true},"repairBilling":{"view":true,"create":true,"edit":true,"delete":true},"salesBilling":{"view":true,"create":true,"edit":true,"delete":true},"accountingVouchers":{"view":true,"create":true,"edit":true,"delete":true},"inventory":{"view":true,"create":true,"edit":true,"delete":true},"customers":{"view":true,"create":true,"edit":true,"delete":true},"vendors":{"view":true,"create":true,"edit":true,"delete":true},"outsource":{"view":true,"create":true,"edit":true,"delete":true},"dataRecovery":{"view":true,"create":true,"edit":true,"delete":true},"amc":{"view":true,"create":true,"edit":true,"delete":true},"reports":{"view":true,"create":true,"edit":true,"delete":true},"settings":{"view":true,"create":true,"edit":true,"delete":true}}'::jsonb
) ON CONFLICT (emp_code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    active_status = EXCLUDED.active_status,
    phone = EXCLUDED.phone,
    base_salary = EXCLUDED.base_salary,
    permissions = EXCLUDED.permissions;

INSERT INTO employees (
    id, emp_code, name, email, role, department, designation, active_status,
    password_hash_or_plain, phone, alternate_phone, joining_date, base_salary,
    address, emergency_contact_name, emergency_contact_phone, govt_id_type,
    govt_id_number, bank_account_name, bank_account_number, bank_name,
    bank_branch, bank_branch_code, bank_ifsc_code, permissions
) VALUES (
    'emp-1002',
    'EMP-1002',
    'Priya Sharma',
    'priya.sharma@accnosolution.com',
    'Billing Specialist',
    'Billing & POS',
    'Store Manager & Billing Lead',
    'Active',
    '3QmRJRvEt3',
    '+91 98765-11003',
    '+91 94191-22003',
    '2023-01-10',
    32000,
    'Lane 4, Channi Himmat, Jammu',
    'Rajesh Sharma (Father)',
    '+91 98765-11004',
    'PAN Card',
    'BPRPS9182K',
    'Priya Sharma',
    '001201589342',
    'ICICI Bank',
    'Channi Branch',
    'ICIC0000120',
    'ICIC0000120',
    '{"repairTickets":{"view":true,"create":true,"edit":true,"delete":false},"repairBilling":{"view":true,"create":true,"edit":true,"delete":false},"salesBilling":{"view":true,"create":true,"edit":true,"delete":false},"accountingVouchers":{"view":true,"create":false,"edit":false,"delete":false},"inventory":{"view":true,"create":false,"edit":false,"delete":false},"customers":{"view":true,"create":true,"edit":true,"delete":false},"vendors":{"view":true,"create":false,"edit":false,"delete":false},"outsource":{"view":true,"create":true,"edit":true,"delete":false},"dataRecovery":{"view":true,"create":true,"edit":true,"delete":false},"amc":{"view":true,"create":false,"edit":false,"delete":false},"reports":{"view":false,"create":false,"edit":false,"delete":false},"settings":{"view":false,"create":false,"edit":false,"delete":false}}'::jsonb
) ON CONFLICT (emp_code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    active_status = EXCLUDED.active_status,
    phone = EXCLUDED.phone,
    base_salary = EXCLUDED.base_salary,
    permissions = EXCLUDED.permissions;

INSERT INTO employees (
    id, emp_code, name, email, role, department, designation, active_status,
    password_hash_or_plain, phone, alternate_phone, joining_date, base_salary,
    address, emergency_contact_name, emergency_contact_phone, govt_id_type,
    govt_id_number, bank_account_name, bank_account_number, bank_name,
    bank_branch, bank_branch_code, bank_ifsc_code, permissions
) VALUES (
    'emp-1003',
    'EMP-1003',
    'Rahul Gupta',
    'rahul.gupta@accnosolution.com',
    'Technician',
    'Technical Lab',
    'Hardware Diagnostic Specialist',
    'Active',
    'Rahul@Accno2026#',
    '+91 98765-11005',
    '+91 94191-22005',
    '2023-06-01',
    38000,
    'Trikuta Nagar, Jammu',
    'Karan Gupta (Brother)',
    '+91 98765-11006',
    'Driving License',
    'JK02202100984',
    'Rahul Gupta',
    '39482710492',
    'State Bank of India',
    'Trikuta Nagar',
    'SBIN0002194',
    'SBIN0002194',
    '{}'::jsonb
) ON CONFLICT (emp_code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    active_status = EXCLUDED.active_status,
    phone = EXCLUDED.phone,
    base_salary = EXCLUDED.base_salary,
    permissions = EXCLUDED.permissions;

INSERT INTO employees (
    id, emp_code, name, email, role, department, designation, active_status,
    password_hash_or_plain, phone, alternate_phone, joining_date, base_salary,
    address, emergency_contact_name, emergency_contact_phone, govt_id_type,
    govt_id_number, bank_account_name, bank_account_number, bank_name,
    bank_branch, bank_branch_code, bank_ifsc_code, permissions
) VALUES (
    'emp-1004',
    'EMP-1004',
    'Sonia Mahajan',
    'sonia.m@accnosolution.com',
    'Desk Manager',
    'Customer Support',
    'Customer Support Executive',
    'On Leave',
    'Sonia@Accno2026#',
    '+91 98765-11007',
    '+91 94191-22007',
    '2023-09-15',
    35000,
    'Sainik Colony, Jammu',
    'Vikram Mahajan (Husband)',
    '+91 98765-11008',
    'Aadhaar Card',
    '9912-3847-1092',
    'Sonia Mahajan',
    '918273645019',
    'Axis Bank',
    'Sainik Colony',
    'UTIB0001092',
    'UTIB0001092',
    '{}'::jsonb
) ON CONFLICT (emp_code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    active_status = EXCLUDED.active_status,
    phone = EXCLUDED.phone,
    base_salary = EXCLUDED.base_salary,
    permissions = EXCLUDED.permissions;


-- 2. SEED REPAIR TICKETS & JOB CARDS
INSERT INTO repair_tickets (
    id, ticket_number, barcode_data, customer_name, customer_phone, customer_alternate_phone,
    customer_email, customer_gstin, customer_address, customer_type, device_type, brand, model,
    serial_or_imei, password_lock, rack_location, problem_reported, physical_condition,
    status, priority, progress_percentage, estimated_cost, advance_paid, grand_total,
    net_due_balance, payment_method, payment_status, technician_name, entry_date,
    estimated_delivery_date, line_items
) VALUES (
    't-1001', 'TKT-1001', 'TKT1001',
    'Rajesh Kumar (Tech Logics)', '+91 98765-43210', '+91 94191-88776',
    'rajesh@techlogics.in', '01AAAAA0000A1Z5', 'Plot 42, Sector 3, Industrial Area, Jammu',
    'CORPORATE', 'MacBook Pro M2', 'Apple', 'A2442 (14-inch 2022)',
    'C02G1234MD6R', 'mac2025@pass', 'Shelf A-3, Bin 04',
    'MacBook Pro M2 Motherboard Repair - Logic Board Micro-soldering', 'Minor bezel scratches. Moisture indicator turned pink near USB-C port.', 'in_progress',
    'urgent', 78, 18500,
    5000, 21239, 16239,
    'UPI', 'PARTIAL', 'Deepak Kumar',
    '2025-05-10', '2025-05-14', '[{"id":"li-1","description":"MacBook M2 Motherboard Liquid Damage Micro-soldering","hsnCode":"998713","quantity":1,"unitPrice":12500,"total":12500,"itemType":"service"},{"id":"li-2","description":"Apple OEM Force Touch Trackpad Assembly","hsnCode":"84733020","quantity":1,"unitPrice":6000,"total":6000,"itemType":"part"}]'::jsonb
) ON CONFLICT (ticket_number) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    problem_reported = EXCLUDED.problem_reported,
    status = EXCLUDED.status,
    grand_total = EXCLUDED.grand_total;
INSERT INTO repair_tickets (
    id, ticket_number, barcode_data, customer_name, customer_phone, customer_alternate_phone,
    customer_email, customer_gstin, customer_address, customer_type, device_type, brand, model,
    serial_or_imei, password_lock, rack_location, problem_reported, physical_condition,
    status, priority, progress_percentage, estimated_cost, advance_paid, grand_total,
    net_due_balance, payment_method, payment_status, technician_name, entry_date,
    estimated_delivery_date, line_items
) VALUES (
    't-1002', 'TKT-1002', 'TKT1002',
    'Dr. Anita Roy', '+91 94191-12233', '+91 94191-12234',
    'anita@royhospital.org', '01BBBBB1111B2Z6', 'Channi Himmat Main Road, Jammu',
    'CORPORATE', 'Data Recovery (Seagate 2TB HDD)', 'Seagate', 'ST2000LM015',
    'Z3901XQP', NULL, 'Cleanroom Safe Locker 02',
    'Clicking sound from drive. Heads stuck. Hospital records recovery.', 'Sealed drive casing intact. No prior opening marks.', 'diagnosing',
    'urgent', 45, 17550,
    3000, 20709, 17709,
    'NETBANKING', 'PARTIAL', 'Rahul Gupta',
    '2025-05-11', '2025-05-16', '[{"id":"li-3","description":"Class-100 Cleanroom Mechanical Head Replacement & Data Extraction","hsnCode":"998713","quantity":1,"unitPrice":14000,"total":14000,"itemType":"service"}]'::jsonb
) ON CONFLICT (ticket_number) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    problem_reported = EXCLUDED.problem_reported,
    status = EXCLUDED.status,
    grand_total = EXCLUDED.grand_total;

-- 3. SEED REPAIR INVOICES ARCHIVE
INSERT INTO repair_invoices (
    id, invoice_number, ticket_id, ticket_number, invoice_date, customer_name,
    customer_phone, customer_gstin, customer_type, device_type, brand, model,
    subtotal, grand_total, advance_paid, net_due_balance, payment_status, payment_method,
    delivered_to, delivery_status, after_service_remarks
) VALUES (
    'inv-1001', 'TKT-3001', 't-1002', 'TKT-1002', CURRENT_DATE, 'Dr. Anita Roy',
    '+91 94191-12233', '01BBBBB1111B2Z6', 'CORPORATE', 'Data Recovery (Seagate 2TB HDD)',
    'Seagate', 'ST2000LM015', 17550.00, 20709.00, 3000.00, 17709.00, 'PAID', 'NETBANKING',
    'Dr. Anita Roy', 'DELIVERED TO CUSTOMER', 'Donor drive head assembly received from Delhi lab.'
) ON CONFLICT (invoice_number) DO NOTHING;

-- 4. SEED OUTSOURCED REPAIRS
INSERT INTO outsource_vouchers (
    id, voucher_number, voucher_date, linked_ticket_number, vendor_name, vendor_phone,
    vendor_city, vendor_job_id, service_type, outgoing_courier, outgoing_docket,
    vendor_cost_price, freight_charges, customer_selling_price, profit_margin, dispatch_status
) VALUES (
    'out-1001', 'OUT-1001', CURRENT_DATE, 'TKT-1002', 'Cleanroom Data Recovery Labs',
    '+91 94192-33445', 'Delhi NCR', 'LAB-DEL-8890', 'Data Recovery Lab',
    'Bluedart Express', 'BLU-990088112', 3200.00, 350.00, 6500.00, 2950.00, 'COMPLETED'
) ON CONFLICT (voucher_number) DO NOTHING;

-- 5. SEED DATA RECOVERY CASES
INSERT INTO data_recovery_cases (
    id, recovery_id_number, case_number, customer_name, customer_phone,
    customer_email, media_type, media_brand, media_model, serial_number, capacity,
    reported_fault, cleanroom_status, recovery_stage, priority, estimated_quote, technician_name
) VALUES (
    'drc-1001', 'REC-1001', 'REC-1001', 'Tech Logics Pvt Ltd', '+91 98765-43210',
    'techlogics@gmail.com', 'Hard Disk Drive (HDD)', 'Western Digital', 'WD Blue 1TB',
    'WD-WCC4N123456', '1 TB', 'Drive not spinning, PCB burnt due to power surge',
    'Cleanroom Safe Locker 01', 'PCB Firmware Adaptation', 'High', 8500.00, 'Rahul Gupta'
) ON CONFLICT (case_number) DO NOTHING;

-- 6. SEED AMC CONTRACTS & COMPLAINTS
INSERT INTO amc_contracts (
    id, contract_number, customer_name, customer_phone, customer_email, company_name,
    amc_type, start_date, end_date, total_devices_covered, contract_amount, grand_total,
    status, payment_status, assigned_technician
) VALUES (
    'amc-1001', 'AMC-2025-01', 'Apex Healthcare Labs', '+91 94191-77889', 'it@apexlabs.in',
    'Apex Healthcare Labs Jammu', 'Comprehensive Hardware AMC', CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year', 25, 65000.00, 76700.00, 'Active', 'Paid', 'Deepak Kumar'
) ON CONFLICT (contract_number) DO NOTHING;

-- 7. SEED INVENTORY ITEMS & SPARE PARTS
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'RAM-DDR4-8GB', '890123456701', 'Crucial 8GB DDR4 3200MHz Laptop RAM', 'Memory (RAM)',
    'Crucial', 1450, 2100, 15, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'SSD-NVME-500GB', '890123456702', 'WD Blue SN580 500GB NVMe PCIe 4.0 SSD', 'Storage (SSD)',
    'Western Digital', 2850, 3800, 12, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'DISP-156-FHD', '890123456703', '15.6" Slim FHD 30-Pin IPS Screen Panel (Non-Touch)', 'Screen Panels',
    'BOE', 3200, 4600, 8, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'BAT-DELL-5400', '890123456704', 'Dell Latitude 5400 / 5410 4-Cell 68Wh Battery', 'Batteries',
    'Dell OEM', 2400, 3600, 6, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'ADP-65W-TYPEC', '890123456705', 'Universal 65W GaN Type-C Laptop Fast Charger', 'Chargers / Adapters',
    'Accno OEM', 950, 1650, 25, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    'PASTE-MX4-4G', '890123456706', 'Arctic MX-4 High Performance Thermal Paste (4g)', 'Consumables',
    'Arctic', 380, 650, 30, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 8. SEED SUPPLIERS / VENDORS
INSERT INTO suppliers (
    vendor_code, vendor_name, contact_person, phone, email, city, category
) VALUES (
    'VEN-001', 'Nehru Place Hardware Hub', 'Suresh Agrawal', '+91 98112-44556',
    'orders@nehruplaceparts.in', 'New Delhi', 'Laptop Screens & BGA Chips'
) ON CONFLICT (vendor_code) DO NOTHING;

-- 9. SEED CRM & WEBSITE INQUIRY LEADS
INSERT INTO support_leads (
    lead_name, phone, email, company, service_interested, estimated_value, status, assigned_to
) VALUES (
    'Apex Healthcare Jammu', '+91 94191-12233', 'contact@apexlabs.in', 'Apex Healthcare',
    'RAID 10 Server Data Recovery Lab Case', 65000.00, 'contacted', 'Rahul Gupta'
);

-- 10. SEED COMPANY MILESTONES
INSERT INTO milestones (year, title, description) VALUES ('2020', 'Accno Solution Founded', 'Established advanced micro-soldering and motherboard repair lab.');
INSERT INTO milestones (year, title, description) VALUES ('2022', 'Class-100 Cleanroom Opened', 'Launched dedicated cleanroom data recovery unit for HDD and SSD forensic extraction.');
INSERT INTO milestones (year, title, description) VALUES ('2024', 'Enterprise AMC Division', 'Crossed 120+ active corporate AMC contracts across hospitals, schools, and IT offices.');
INSERT INTO milestones (year, title, description) VALUES ('2026', 'Next-Gen Cloud ERP & POS', 'Deployed digital ticketing, barcode automation, and live customer self-service tracking portal.');

-- 11. SEED BLOG POSTS & GUIDES
INSERT INTO blog_posts (slug, title, excerpt, content, author) VALUES (
    'macbook-liquid-damage-motherboard-repair-guide', 'How to Fix Liquid Damage on MacBook Pro M-Series Logic Boards', 'Step-by-step diagnostic guide to ultrasonic PCB cleaning, short detection with thermal imaging, and PMIC replacement.', 'Liquid spill accidents are among the most frequent MacBook casualties. In this technical walkthrough, our lead engineers explain how we isolate corroded rails, neutralize oxide deposits under BGA chips, and restore charging circuitry...', 'Deepak Kumar'
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt;
INSERT INTO blog_posts (slug, title, excerpt, content, author) VALUES (
    'clicking-hard-drive-cleanroom-data-recovery', 'Why Hard Drives Click: Mechanical Head Swap in a Class-100 Cleanroom', 'What causes the infamous click of death in mechanical hard drives and how donor head assemblies are transplanted safely.', 'When an HDD clicks repeatedly, its read/write heads are striking the ramp after failing to calibrate tracking servos. Powering on the drive in this state risks catastrophic platter scratch. Here is our cleanroom procedure...', 'Rahul Gupta'
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt;

-- 12. SEED PRIMARY COMPANY PROFILE
INSERT INTO company_profile (
    id, company_name, legal_name, tagline, phone, email, website, gstin, address, city, state, pincode, merchant_upi_id
) VALUES (
    'primary_company', 'Accno Solution', 'Accno Solution Computer & Mobile Lab',
    'Enterprise Computer Repair & Data Recovery Hub', '+91 9468781166',
    'admin@accnosolution.com', 'https://accnosolution.com', '01AAAAA0000A1Z5',
    'Above Choudhary Dharamshala, Main Market, Sanchore', 'Sanchore', 'Rajasthan', '343041',
    'support.time24x7-3@okhdfcbank'
) ON CONFLICT (id) DO UPDATE SET phone = EXCLUDED.phone, address = EXCLUDED.address;
