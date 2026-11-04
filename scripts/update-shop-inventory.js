const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const lines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = {};
lines.forEach(l => {
  const idx = l.indexOf('=');
  if (idx > 0) env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const updates = [
  {
    id: 'i-1001',
    name: 'HP LaserJet M1005 / 1020 Fuser Drive Gear (29T)',
    brand: 'HP Compatible',
    model: 'RU5-0018 / 29 Teeth',
    category: 'Printer Accessories',
    product_group: 'Printer Spares',
    description: 'Heavy-duty replacement fuser drive gear (29T) for HP LaserJet M1005 MFP, 1020, 1018, 1015, 1010. High-temp wear resistant nylon.',
    selling_price: 80,
    mrp: 150,
    stock_quantity: 15,
    current_stock: 15,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1002',
    name: 'HP LaserJet M1005 Paper Pickup Roller',
    brand: 'HP Compatible',
    model: 'RL1-0266 / M1005 Pickup',
    category: 'Printer Accessories',
    product_group: 'Printer Spares',
    description: 'High-friction rubber paper pickup roller for HP LaserJet M1005 MFP, 1020, 1018, 1010 printers. Fixes paper feeding and misfeed errors.',
    selling_price: 80,
    mrp: 150,
    stock_quantity: 20,
    current_stock: 20,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1003',
    name: 'HP LaserJet M1005 Teflon Fuser Film Sleeve',
    brand: 'HP Compatible',
    model: 'M1005 / 1020 Teflon Sleeve',
    category: 'Printer Accessories',
    product_group: 'Printer Spares',
    description: 'Premium high-durability Teflon fuser fixing film sleeve with thermal grease for HP LaserJet M1005, 1020, 1018. Ensures clean toner bonding.',
    selling_price: 250,
    mrp: 350,
    stock_quantity: 12,
    current_stock: 12,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1004',
    name: 'HP LaserJet M1005 Lower Pressure Roller',
    brand: 'HP Compatible',
    model: 'RC1-3630 Lower Roller',
    category: 'Printer Accessories',
    product_group: 'Printer Spares',
    description: 'High-temperature silicone lower pressure roller for HP LaserJet M1005 MFP, 1020, 1018. Eliminates paper wrinkles and uneven fusion.',
    selling_price: 360,
    mrp: 450,
    stock_quantity: 8,
    current_stock: 8,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1005',
    name: 'SRC 12A Laser Toner Cartridge (Q2612A)',
    brand: 'SRC',
    model: '12A / Q2612A Black',
    category: 'Printer Accessories',
    product_group: 'Toner Cartridges',
    description: 'High-yield compatible 12A black laser toner cartridge for HP LaserJet 1010, 1018, 1020, 1022, 3015, M1005, M1319f MFP. Yields up to 2,000 pages.',
    selling_price: 450,
    mrp: 950,
    stock_quantity: 15,
    current_stock: 15,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1006',
    name: 'WD 2TB Elements Portable External HDD',
    brand: 'Western Digital',
    model: 'Elements Portable 2TB USB 3.0',
    category: 'Storage Devices',
    product_group: 'External Hard Drive',
    description: 'High-capacity 2TB portable external hard drive with fast USB 3.0 connectivity, plug-and-play simplicity for Windows & Mac, and shock-resistant casing.',
    selling_price: 6800,
    mrp: 9500,
    stock_quantity: 4,
    current_stock: 4,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1007',
    name: 'PowerX 128GB M.2 NVMe PCIe SSD',
    brand: 'PowerX',
    model: 'M.2 2280 NVMe PCIe 3.0',
    category: 'SSD/NVMe',
    product_group: 'Internal SSD',
    description: 'Ultra-fast M.2 2280 NVMe PCIe Gen3 x4 internal solid state drive. Speeds up to 2100 MB/s read, low latency 3D NAND flash, and durable compact form factor.',
    selling_price: 1400,
    mrp: 2200,
    stock_quantity: 10,
    current_stock: 10,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1008',
    name: 'Dell Latitude E5420 Laptop Top Body (A+B Shell)',
    brand: 'Dell OEM',
    model: 'Latitude E5420 / E5430 A+B Panel',
    category: 'Laptop Accessories',
    product_group: 'Chassis & Shells',
    description: 'OEM replacement laptop back lid cover and front screen bezel (A and B shell panels) for Dell Latitude E5420 and E5430 series laptops.',
    selling_price: 2500,
    mrp: 4500,
    stock_quantity: 3,
    current_stock: 3,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1009',
    name: '70mai A510 3K Dual-Channel Smart Dashcam',
    brand: '70mai',
    model: 'A510 Dual Vision (Front + Rear)',
    category: 'Dashcam & Smart Devices',
    product_group: 'Car Dashcam',
    description: 'Flagship 3K HDR front and rear dual-channel smart car dashcam with Sony STARVIS 2 IMX675 sensor, built-in GPS, ADAS driver assist, and 24H parking guard.',
    selling_price: 9000,
    mrp: 15999,
    stock_quantity: 20,
    current_stock: 20,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1010',
    name: 'Seagate 1TB 2.5 Inch Laptop Internal HDD (Refurbished)',
    brand: 'Seagate',
    model: 'BarraCuda 2.5 Inch 1TB SATA 6Gb/s',
    category: 'Storage Devices',
    product_group: 'Laptop HDD',
    description: 'Certified refurbished 1TB 2.5-inch SATA internal laptop hard drive. 5400 RPM, 128MB cache, 100% health checked with zero bad sectors and 30-day warranty.',
    product_condition: 'Refurbished',
    refurbished_description: '100% sector health verified on S.M.A.R.T diagnostics. Zero bad sectors, tested under read/write stress with 30-day store warranty.',
    selling_price: 1800,
    mrp: 2800,
    stock_quantity: 6,
    current_stock: 6,
    show_on_website_shop: true,
    active_status: 'Active'
  },
  {
    id: 'i-1011',
    name: 'Laptop Chip-Level Diagnosis & Complete Service',
    brand: 'Accno Service Desk',
    model: 'Chip-Level Diagnostics',
    category: 'Services & Repairs',
    product_group: 'Diagnostics & Servicing',
    description: 'Full laptop deep clean, high-grade thermal paste replacement, motherboard ultrasonic wash, fan servicing, and comprehensive diagnostic hardware health report.',
    selling_price: 250,
    mrp: 500,
    stock_quantity: 50,
    current_stock: 50,
    show_on_website_shop: true,
    active_status: 'Active'
  }
];

async function updateAll() {
  console.log('Updating all inventory items in Supabase...');
  for (const item of updates) {
    const { error } = await supabase.from('inventory_items').update(item).eq('id', item.id);
    if (error) {
      console.error('Error on', item.id, error.message);
    } else {
      console.log('Successfully updated:', item.id, '|', item.name);
    }
  }
  console.log('Done!');
}

updateAll();
