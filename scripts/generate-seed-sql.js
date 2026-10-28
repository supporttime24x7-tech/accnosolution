const fs = require('fs');
const path = require('path');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Read employees
const employeesPath = path.join(__dirname, '../src/data/employees.json');
const employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));

let sql = `-- ============================================================================
-- ACCNO SOLUTION - FULL DATABASE SEED DATA FOR SUPABASE
-- Run this in Supabase SQL Editor AFTER executing supabase_schema.sql
-- ============================================================================

-- 1. SEED EMPLOYEES & STAFF RECORDS (${employees.length} Records)
`;

for (const emp of employees) {
  sql += `INSERT INTO employees (
    id, emp_code, name, email, role, department, designation, active_status,
    password_hash_or_plain, phone, alternate_phone, joining_date, base_salary,
    address, emergency_contact_name, emergency_contact_phone, govt_id_type,
    govt_id_number, bank_account_name, bank_account_number, bank_name,
    bank_branch, bank_branch_code, bank_ifsc_code, permissions
) VALUES (
    ${escapeSql(emp.id)},
    ${escapeSql(emp.empCode)},
    ${escapeSql(emp.name)},
    ${escapeSql(emp.email)},
    ${escapeSql(emp.role)},
    ${escapeSql(emp.department)},
    ${escapeSql(emp.designation)},
    ${escapeSql(emp.activeStatus || 'Active')},
    ${escapeSql(emp.passwordHashOrPlain)},
    ${escapeSql(emp.phone)},
    ${escapeSql(emp.alternatePhone)},
    ${escapeSql(emp.joiningDate || '2022-01-01')},
    ${escapeSql(emp.baseSalary || 0)},
    ${escapeSql(emp.address)},
    ${escapeSql(emp.emergencyContactName)},
    ${escapeSql(emp.emergencyContactPhone)},
    ${escapeSql(emp.govtIdType)},
    ${escapeSql(emp.govtIdNumber)},
    ${escapeSql(emp.bankAccountName)},
    ${escapeSql(emp.bankAccountNumber)},
    ${escapeSql(emp.bankName)},
    ${escapeSql(emp.bankBranch)},
    ${escapeSql(emp.bankBranchCode)},
    ${escapeSql(emp.bankIfscCode)},
    ${escapeSql(emp.permissions || {})}
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
\n`;
}

// 2. SEED SAMPLE REPAIR TICKETS
sql += `\n-- 2. SEED REPAIR TICKETS & JOB CARDS\n`;
const tickets = [
  {
    id: 't-1001',
    ticket_number: 'TKT-1001',
    barcode_data: 'TKT1001',
    customer_name: 'Rajesh Kumar (Tech Logics)',
    customer_phone: '+91 98765-43210',
    customer_alternate_phone: '+91 94191-88776',
    customer_email: 'rajesh@techlogics.in',
    customer_gstin: '01AAAAA0000A1Z5',
    customer_address: 'Plot 42, Sector 3, Industrial Area, Jammu',
    customer_type: 'CORPORATE',
    device_type: 'MacBook Pro M2',
    brand: 'Apple',
    model: 'A2442 (14-inch 2022)',
    serial_or_imei: 'C02G1234MD6R',
    password_lock: 'mac2025@pass',
    rack_location: 'Shelf A-3, Bin 04',
    problem_reported: 'MacBook Pro M2 Motherboard Repair - Logic Board Micro-soldering',
    physical_condition: 'Minor bezel scratches. Moisture indicator turned pink near USB-C port.',
    status: 'in_progress',
    priority: 'urgent',
    progress_percentage: 78,
    estimated_cost: 18500,
    advance_paid: 5000,
    grand_total: 21239,
    net_due_balance: 16239,
    payment_method: 'UPI',
    payment_status: 'PARTIAL',
    technician_name: 'Deepak Kumar',
    entry_date: '2025-05-10',
    estimated_delivery_date: '2025-05-14',
    line_items: [
      { id: 'li-1', description: 'MacBook M2 Motherboard Liquid Damage Micro-soldering', hsnCode: '998713', quantity: 1, unitPrice: 12500, total: 12500, itemType: 'service' },
      { id: 'li-2', description: 'Apple OEM Force Touch Trackpad Assembly', hsnCode: '84733020', quantity: 1, unitPrice: 6000, total: 6000, itemType: 'part' }
    ]
  },
  {
    id: 't-1002',
    ticket_number: 'TKT-1002',
    barcode_data: 'TKT1002',
    customer_name: 'Dr. Anita Roy',
    customer_phone: '+91 94191-12233',
    customer_alternate_phone: '+91 94191-12234',
    customer_email: 'anita@royhospital.org',
    customer_gstin: '01BBBBB1111B2Z6',
    customer_address: 'Channi Himmat Main Road, Jammu',
    customer_type: 'CORPORATE',
    device_type: 'Data Recovery (Seagate 2TB HDD)',
    brand: 'Seagate',
    model: 'ST2000LM015',
    serial_or_imei: 'Z3901XQP',
    rack_location: 'Cleanroom Safe Locker 02',
    problem_reported: 'Clicking sound from drive. Heads stuck. Hospital records recovery.',
    physical_condition: 'Sealed drive casing intact. No prior opening marks.',
    status: 'diagnosing',
    priority: 'urgent',
    progress_percentage: 45,
    estimated_cost: 17550,
    advance_paid: 3000,
    grand_total: 20709,
    net_due_balance: 17709,
    payment_method: 'NETBANKING',
    payment_status: 'PARTIAL',
    technician_name: 'Rahul Gupta',
    entry_date: '2025-05-11',
    estimated_delivery_date: '2025-05-16',
    line_items: [
      { id: 'li-3', description: 'Class-100 Cleanroom Mechanical Head Replacement & Data Extraction', hsnCode: '998713', quantity: 1, unitPrice: 14000, total: 14000, itemType: 'service' }
    ]
  }
];

for (const t of tickets) {
  sql += `INSERT INTO repair_tickets (
    id, ticket_number, barcode_data, customer_name, customer_phone, customer_alternate_phone,
    customer_email, customer_gstin, customer_address, customer_type, device_type, brand, model,
    serial_or_imei, password_lock, rack_location, problem_reported, physical_condition,
    status, priority, progress_percentage, estimated_cost, advance_paid, grand_total,
    net_due_balance, payment_method, payment_status, technician_name, entry_date,
    estimated_delivery_date, line_items
) VALUES (
    ${escapeSql(t.id)}, ${escapeSql(t.ticket_number)}, ${escapeSql(t.barcode_data)},
    ${escapeSql(t.customer_name)}, ${escapeSql(t.customer_phone)}, ${escapeSql(t.customer_alternate_phone)},
    ${escapeSql(t.customer_email)}, ${escapeSql(t.customer_gstin)}, ${escapeSql(t.customer_address)},
    ${escapeSql(t.customer_type)}, ${escapeSql(t.device_type)}, ${escapeSql(t.brand)}, ${escapeSql(t.model)},
    ${escapeSql(t.serial_or_imei)}, ${escapeSql(t.password_lock)}, ${escapeSql(t.rack_location)},
    ${escapeSql(t.problem_reported)}, ${escapeSql(t.physical_condition)}, ${escapeSql(t.status)},
    ${escapeSql(t.priority)}, ${escapeSql(t.progress_percentage)}, ${escapeSql(t.estimated_cost)},
    ${escapeSql(t.advance_paid)}, ${escapeSql(t.grand_total)}, ${escapeSql(t.net_due_balance)},
    ${escapeSql(t.payment_method)}, ${escapeSql(t.payment_status)}, ${escapeSql(t.technician_name)},
    ${escapeSql(t.entry_date)}, ${escapeSql(t.estimated_delivery_date)}, ${escapeSql(t.line_items)}
) ON CONFLICT (ticket_number) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    problem_reported = EXCLUDED.problem_reported,
    status = EXCLUDED.status,
    grand_total = EXCLUDED.grand_total;\n`;
}

// 3. SEED REPAIR INVOICES
sql += `\n-- 3. SEED REPAIR INVOICES ARCHIVE\n`;
sql += `INSERT INTO repair_invoices (
    id, invoice_number, ticket_id, ticket_number, invoice_date, customer_name,
    customer_phone, customer_gstin, customer_type, device_type, brand, model,
    subtotal, grand_total, advance_paid, net_due_balance, payment_status, payment_method,
    delivered_to, delivery_status, after_service_remarks
) VALUES (
    'inv-1001', 'TKT-3001', 't-1002', 'TKT-1002', CURRENT_DATE, 'Dr. Anita Roy',
    '+91 94191-12233', '01BBBBB1111B2Z6', 'CORPORATE', 'Data Recovery (Seagate 2TB HDD)',
    'Seagate', 'ST2000LM015', 17550.00, 20709.00, 3000.00, 17709.00, 'PAID', 'NETBANKING',
    'Dr. Anita Roy', 'DELIVERED TO CUSTOMER', 'Donor drive head assembly received from Delhi lab.'
) ON CONFLICT (invoice_number) DO NOTHING;\n`;

// 4. SEED OUTSOURCE VOUCHERS
sql += `\n-- 4. SEED OUTSOURCED REPAIRS\n`;
sql += `INSERT INTO outsource_vouchers (
    id, voucher_number, voucher_date, linked_ticket_number, vendor_name, vendor_phone,
    vendor_city, vendor_job_id, service_type, outgoing_courier, outgoing_docket,
    vendor_cost_price, freight_charges, customer_selling_price, profit_margin, dispatch_status
) VALUES (
    'out-1001', 'OUT-1001', CURRENT_DATE, 'TKT-1002', 'Cleanroom Data Recovery Labs',
    '+91 94192-33445', 'Delhi NCR', 'LAB-DEL-8890', 'Data Recovery Lab',
    'Bluedart Express', 'BLU-990088112', 3200.00, 350.00, 6500.00, 2950.00, 'COMPLETED'
) ON CONFLICT (voucher_number) DO NOTHING;\n`;

// 5. SEED DATA RECOVERY CASES
sql += `\n-- 5. SEED DATA RECOVERY CASES\n`;
sql += `INSERT INTO data_recovery_cases (
    id, recovery_id_number, case_number, customer_name, customer_phone,
    customer_email, media_type, media_brand, media_model, serial_number, capacity,
    reported_fault, cleanroom_status, recovery_stage, priority, estimated_quote, technician_name
) VALUES (
    'drc-1001', 'REC-1001', 'REC-1001', 'Tech Logics Pvt Ltd', '+91 98765-43210',
    'techlogics@gmail.com', 'Hard Disk Drive (HDD)', 'Western Digital', 'WD Blue 1TB',
    'WD-WCC4N123456', '1 TB', 'Drive not spinning, PCB burnt due to power surge',
    'Cleanroom Safe Locker 01', 'PCB Firmware Adaptation', 'High', 8500.00, 'Rahul Gupta'
) ON CONFLICT (case_number) DO NOTHING;\n`;

// 6. SEED AMC CONTRACTS
sql += `\n-- 6. SEED AMC CONTRACTS & COMPLAINTS\n`;
sql += `INSERT INTO amc_contracts (
    id, contract_number, customer_name, customer_phone, customer_email, company_name,
    amc_type, start_date, end_date, total_devices_covered, contract_amount, grand_total,
    status, payment_status, assigned_technician
) VALUES (
    'amc-1001', 'AMC-2025-01', 'Apex Healthcare Labs', '+91 94191-77889', 'it@apexlabs.in',
    'Apex Healthcare Labs Jammu', 'Comprehensive Hardware AMC', CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year', 25, 65000.00, 76700.00, 'Active', 'Paid', 'Deepak Kumar'
) ON CONFLICT (contract_number) DO NOTHING;\n`;

// 7. SEED INVENTORY & POS PRODUCTS
sql += `\n-- 7. SEED INVENTORY ITEMS & SPARE PARTS\n`;
const items = [
  { sku: 'RAM-DDR4-8GB', barcode: '890123456701', name: 'Crucial 8GB DDR4 3200MHz Laptop RAM', category: 'Memory (RAM)', brand: 'Crucial', cost: 1450, price: 2100, qty: 15 },
  { sku: 'SSD-NVME-500GB', barcode: '890123456702', name: 'WD Blue SN580 500GB NVMe PCIe 4.0 SSD', category: 'Storage (SSD)', brand: 'Western Digital', cost: 2850, price: 3800, qty: 12 },
  { sku: 'DISP-156-FHD', barcode: '890123456703', name: '15.6" Slim FHD 30-Pin IPS Screen Panel (Non-Touch)', category: 'Screen Panels', brand: 'BOE', cost: 3200, price: 4600, qty: 8 },
  { sku: 'BAT-DELL-5400', barcode: '890123456704', name: 'Dell Latitude 5400 / 5410 4-Cell 68Wh Battery', category: 'Batteries', brand: 'Dell OEM', cost: 2400, price: 3600, qty: 6 },
  { sku: 'ADP-65W-TYPEC', barcode: '890123456705', name: 'Universal 65W GaN Type-C Laptop Fast Charger', category: 'Chargers / Adapters', brand: 'Accno OEM', cost: 950, price: 1650, qty: 25 },
  { sku: 'PASTE-MX4-4G', barcode: '890123456706', name: 'Arctic MX-4 High Performance Thermal Paste (4g)', category: 'Consumables', brand: 'Arctic', cost: 380, price: 650, qty: 30 }
];

for (const it of items) {
  sql += `INSERT INTO inventory_items (
    sku, barcode, name, category, brand, cost_price, selling_price, stock_quantity, hsn_code, gst_rate
) VALUES (
    ${escapeSql(it.sku)}, ${escapeSql(it.barcode)}, ${escapeSql(it.name)}, ${escapeSql(it.category)},
    ${escapeSql(it.brand)}, ${it.cost}, ${it.price}, ${it.qty}, '84733020', 18.00
) ON CONFLICT (sku) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    stock_quantity = EXCLUDED.stock_quantity;\n`;
}

// 8. SEED SUPPLIERS
sql += `\n-- 8. SEED SUPPLIERS / VENDORS\n`;
sql += `INSERT INTO suppliers (
    vendor_code, vendor_name, contact_person, phone, email, city, category
) VALUES (
    'VEN-001', 'Nehru Place Hardware Hub', 'Suresh Agrawal', '+91 98112-44556',
    'orders@nehruplaceparts.in', 'New Delhi', 'Laptop Screens & BGA Chips'
) ON CONFLICT (vendor_code) DO NOTHING;\n`;

// 9. SEED CRM LEADS
sql += `\n-- 9. SEED CRM & WEBSITE INQUIRY LEADS\n`;
sql += `INSERT INTO support_leads (
    lead_name, phone, email, company, service_interested, estimated_value, status, assigned_to
) VALUES (
    'Apex Healthcare Jammu', '+91 94191-12233', 'contact@apexlabs.in', 'Apex Healthcare',
    'RAID 10 Server Data Recovery Lab Case', 65000.00, 'contacted', 'Rahul Gupta'
);\n`;

// 10. SEED MILESTONES
sql += `\n-- 10. SEED COMPANY MILESTONES\n`;
const milestones = [
  { year: '2020', title: 'Accno Solution Founded', description: 'Established advanced micro-soldering and motherboard repair lab.' },
  { year: '2022', title: 'Class-100 Cleanroom Opened', description: 'Launched dedicated cleanroom data recovery unit for HDD and SSD forensic extraction.' },
  { year: '2024', title: 'Enterprise AMC Division', description: 'Crossed 120+ active corporate AMC contracts across hospitals, schools, and IT offices.' },
  { year: '2026', title: 'Next-Gen Cloud ERP & POS', description: 'Deployed digital ticketing, barcode automation, and live customer self-service tracking portal.' }
];

for (const m of milestones) {
  sql += `INSERT INTO milestones (year, title, description) VALUES (${escapeSql(m.year)}, ${escapeSql(m.title)}, ${escapeSql(m.description)});\n`;
}

// 11. SEED BLOG POSTS
sql += `\n-- 11. SEED BLOG POSTS & GUIDES\n`;
const blogs = [
  {
    slug: 'macbook-liquid-damage-motherboard-repair-guide',
    title: 'How to Fix Liquid Damage on MacBook Pro M-Series Logic Boards',
    excerpt: 'Step-by-step diagnostic guide to ultrasonic PCB cleaning, short detection with thermal imaging, and PMIC replacement.',
    content: 'Liquid spill accidents are among the most frequent MacBook casualties. In this technical walkthrough, our lead engineers explain how we isolate corroded rails, neutralize oxide deposits under BGA chips, and restore charging circuitry...',
    author: 'Deepak Kumar'
  },
  {
    slug: 'clicking-hard-drive-cleanroom-data-recovery',
    title: 'Why Hard Drives Click: Mechanical Head Swap in a Class-100 Cleanroom',
    excerpt: 'What causes the infamous click of death in mechanical hard drives and how donor head assemblies are transplanted safely.',
    content: 'When an HDD clicks repeatedly, its read/write heads are striking the ramp after failing to calibrate tracking servos. Powering on the drive in this state risks catastrophic platter scratch. Here is our cleanroom procedure...',
    author: 'Rahul Gupta'
  }
];

for (const b of blogs) {
  sql += `INSERT INTO blog_posts (slug, title, excerpt, content, author) VALUES (
    ${escapeSql(b.slug)}, ${escapeSql(b.title)}, ${escapeSql(b.excerpt)}, ${escapeSql(b.content)}, ${escapeSql(b.author)}
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt;\n`;
}

// 12. SEED COMPANY PROFILE
sql += `\n-- 12. SEED PRIMARY COMPANY PROFILE\n`;
sql += `INSERT INTO company_profile (
    id, company_name, legal_name, tagline, phone, email, website, gstin, address, city, state, pincode, merchant_upi_id
) VALUES (
    'primary_company', 'Accno Solution', 'Accno Solution Computer & Mobile Lab',
    'Enterprise Computer Repair & Data Recovery Hub', '+91 9468781166',
    'admin@accnosolution.com', 'https://accnosolution.com', '01AAAAA0000A1Z5',
    'Above Choudhary Dharamshala, Main Market, Sanchore', 'Sanchore', 'Rajasthan', '343041',
    'support.time24x7-3@okhdfcbank'
) ON CONFLICT (id) DO UPDATE SET phone = EXCLUDED.phone, address = EXCLUDED.address;\n`;

const outPath = path.join(__dirname, '../database/seed_all_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Successfully generated complete Supabase seed script at:', outPath);
