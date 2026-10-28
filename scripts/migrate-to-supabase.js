const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Resolve environment variables from .env.local or process.env
const envLocalPath = path.join(__dirname, '../.env.local');
const envPath = path.join(__dirname, '../.env');

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile(envLocalPath);
loadEnvFile(envPath);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-project')) {
  console.log('\n================================================================');
  console.log('📌 SUPABASE MIGRATION READY');
  console.log('================================================================');
  console.log('Status: Supabase credentials not found in .env.local yet.');
  console.log('\nTo connect directly via API, add your Supabase credentials to .env.local:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-service-role-key>');
  console.log('\nAlternatively, you can run the SQL migration files directly in your Supabase SQL Editor:');
  console.log('  1. database/supabase_schema.sql (Creates all tables and RLS security policies)');
  console.log('  2. database/seed_all_data.sql   (Inserts all employee records & model data)');
  console.log('================================================================\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log(`\n🚀 Connecting to Supabase project at: ${supabaseUrl}`);

  // 1. Migrate Employees
  const employeesPath = path.join(__dirname, '../src/data/employees.json');
  if (fs.existsSync(employeesPath)) {
    const rawEmployees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
    console.log(`\n📦 Migrating ${rawEmployees.length} Employee records...`);

    const formattedEmployees = rawEmployees.map((emp) => ({
      id: emp.id,
      emp_code: emp.empCode,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      designation: emp.designation,
      active_status: emp.activeStatus || 'Active',
      password_hash_or_plain: emp.passwordHashOrPlain,
      phone: emp.phone,
      alternate_phone: emp.alternatePhone,
      joining_date: emp.joiningDate || '2022-01-01',
      base_salary: emp.baseSalary || 0,
      address: emp.address,
      emergency_contact_name: emp.emergencyContactName,
      emergency_contact_phone: emp.emergencyContactPhone,
      govt_id_type: emp.govtIdType,
      govt_id_number: emp.govtIdNumber,
      bank_account_name: emp.bankAccountName,
      bank_account_number: emp.bankAccountNumber,
      bank_name: emp.bankName,
      bank_branch: emp.bankBranch,
      bank_branch_code: emp.bankBranchCode,
      bank_ifsc_code: emp.bankIfscCode,
      permissions: emp.permissions || {},
    }));

    const { error: empError } = await supabase.from('employees').upsert(formattedEmployees, { onConflict: 'emp_code' });
    if (empError) {
      console.error('❌ Error migrating employees:', empError.message);
    } else {
      console.log(`✅ Successfully migrated ${formattedEmployees.length} employees to Supabase!`);
    }
  }

  // 2. Migrate Repair Tickets
  console.log(`\n📦 Migrating Repair Tickets...`);
  const sampleTickets = [
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

  const { error: tktError } = await supabase.from('repair_tickets').upsert(sampleTickets, { onConflict: 'ticket_number' });
  if (tktError) {
    console.error('❌ Error migrating repair tickets:', tktError.message);
  } else {
    console.log(`✅ Successfully migrated ${sampleTickets.length} repair tickets!`);
  }

  // 3. Migrate Inventory Items
  console.log(`\n📦 Migrating POS Inventory Items...`);
  const items = [
    { sku: 'RAM-DDR4-8GB', barcode: '890123456701', name: 'Crucial 8GB DDR4 3200MHz Laptop RAM', category: 'Memory (RAM)', brand: 'Crucial', cost_price: 1450, selling_price: 2100, stock_quantity: 15, hsn_code: '84733020', gst_rate: 18.00 },
    { sku: 'SSD-NVME-500GB', barcode: '890123456702', name: 'WD Blue SN580 500GB NVMe PCIe 4.0 SSD', category: 'Storage (SSD)', brand: 'Western Digital', cost_price: 2850, selling_price: 3800, stock_quantity: 12, hsn_code: '84733020', gst_rate: 18.00 },
    { sku: 'DISP-156-FHD', barcode: '890123456703', name: '15.6" Slim FHD 30-Pin IPS Screen Panel (Non-Touch)', category: 'Screen Panels', brand: 'BOE', cost_price: 3200, selling_price: 4600, stock_quantity: 8, hsn_code: '84733020', gst_rate: 18.00 },
    { sku: 'BAT-DELL-5400', barcode: '890123456704', name: 'Dell Latitude 5400 / 5410 4-Cell 68Wh Battery', category: 'Batteries', brand: 'Dell OEM', cost_price: 2400, selling_price: 3600, stock_quantity: 6, hsn_code: '84733020', gst_rate: 18.00 },
    { sku: 'ADP-65W-TYPEC', barcode: '890123456705', name: 'Universal 65W GaN Type-C Laptop Fast Charger', category: 'Chargers / Adapters', brand: 'Accno OEM', cost_price: 950, selling_price: 1650, stock_quantity: 25, hsn_code: '84733020', gst_rate: 18.00 },
    { sku: 'PASTE-MX4-4G', barcode: '890123456706', name: 'Arctic MX-4 High Performance Thermal Paste (4g)', category: 'Consumables', brand: 'Arctic', cost_price: 380, selling_price: 650, stock_quantity: 30, hsn_code: '84733020', gst_rate: 18.00 }
  ];

  const { error: invError } = await supabase.from('inventory_items').upsert(items, { onConflict: 'sku' });
  if (invError) {
    console.error('❌ Error migrating inventory:', invError.message);
  } else {
    console.log(`✅ Successfully migrated ${items.length} inventory items!`);
  }

  // 4. Migrate Milestones & Blogs
  console.log(`\n📦 Migrating Website Milestones & Blog Posts...`);
  const milestones = [
    { year: '2020', title: 'Accno Solution Founded', description: 'Established advanced micro-soldering and motherboard repair lab.' },
    { year: '2022', title: 'Class-100 Cleanroom Opened', description: 'Launched dedicated cleanroom data recovery unit for HDD and SSD forensic extraction.' },
    { year: '2024', title: 'Enterprise AMC Division', description: 'Crossed 120+ active corporate AMC contracts across hospitals, schools, and IT offices.' },
    { year: '2026', title: 'Next-Gen Cloud ERP & POS', description: 'Deployed digital ticketing, barcode automation, and live customer self-service tracking portal.' }
  ];
  await supabase.from('milestones').upsert(milestones);

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
  await supabase.from('blog_posts').upsert(blogs, { onConflict: 'slug' });

  // 5. Migrate Company Profile
  console.log(`\n📦 Migrating Primary Company Profile...`);
  const companyProfile = {
    id: 'primary_company',
    company_name: 'Accno Solution',
    legal_name: 'Accno Solution Computer & Mobile Lab',
    tagline: 'Enterprise Computer Repair & Data Recovery Hub',
    phone: '+91 9468781166',
    email: 'admin@accnosolution.com',
    website: 'https://accnosolution.com',
    gstin: '01AAAAA0000A1Z5',
    address: 'Above Choudhary Dharamshala, Main Market, Sanchore',
    city: 'Sanchore',
    state: 'Rajasthan',
    pincode: '343041',
    merchant_upi_id: 'support.time24x7-3@okhdfcbank'
  };
  await supabase.from('company_profile').upsert(companyProfile, { onConflict: 'id' });

  console.log('\n🎉 ALL WEBSITE DATA & MODEL RECORDS MIGRATED TO SUPABASE SUCCESSFULLY!\n');
}

runMigration().catch((err) => {
  console.error('\n❌ Unhandled migration error:', err);
  process.exit(1);
});
