import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export interface LeadItem {
  id: string;
  lead_name: string;
  phone: string;
  email: string;
  company: string;
  service_interested: string;
  estimated_value: number;
  status: 'new' | 'contacted' | 'quotation_sent' | 'negotiation' | 'won' | 'lost';
  assigned_to: string;
  created_at: string;
}

// In-memory OmniCRM database state
let mockLeads: LeadItem[] = [
  {
    id: 'lead-101',
    lead_name: 'Hotel Grand Jammu',
    phone: '+91 94191-88990',
    email: 'info@hotelgrandjammu.com',
    company: 'Grand Hospitality Group',
    service_interested: 'CCTV 32-Camera IP Setup & AMC',
    estimated_value: 145000,
    status: 'quotation_sent',
    assigned_to: 'Priya Sharma (Sales Executive)',
    created_at: '2025-05-10',
  },
  {
    id: 'lead-102',
    lead_name: 'Apex Diagnostic Center',
    phone: '+91 98765-11223',
    email: 'contact@apexlabs.in',
    company: 'Apex Healthcare Jammu',
    service_interested: 'RAID 10 Server Data Recovery Lab Case',
    estimated_value: 65000,
    status: 'contacted',
    assigned_to: 'Rahul Gupta',
    created_at: '2025-05-11',
  },
  {
    id: 'lead-103',
    lead_name: 'St. Xavier International School',
    phone: '+91 94192-55667',
    email: 'admin@stxaviersjammu.edu.in',
    company: 'St. Xavier Trust',
    service_interested: 'Computer Lab Maintenance AMC (60 PCs)',
    estimated_value: 210000,
    status: 'won',
    assigned_to: 'Deepak Kumar',
    created_at: '2025-05-08',
  },
];

// Helper to sanitize user strings and remove HTML tags
function sanitize(input: any, maxLen = 200): string {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>?/gm, '').trim().slice(0, maxLen);
}

export async function GET(req: NextRequest) {
  // ROUTE-LEVEL DEFENSE: Strictly require authenticated employee session to read leads
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Authentication required to view CRM leads and customer data.' },
      { status: 401 }
    );
  }

  const session = await verifyAuthToken(token);
  if (!session || !session.empCode) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or expired session token.' },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  let filtered = [...mockLeads];

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((l) => l.status === statusFilter);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.lead_name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.service_interested.toLowerCase().includes(q)
    );
  }

  const pipelineSummary = {
    totalLeads: mockLeads.length,
    totalPipelineValue: mockLeads.reduce((acc, l) => acc + l.estimated_value, 0),
    wonValue: mockLeads.filter((l) => l.status === 'won').reduce((acc, l) => acc + l.estimated_value, 0),
  };

  return NextResponse.json({
    success: true,
    data: filtered,
    summary: pipelineSummary,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cleanName = sanitize(body.lead_name, 100);
    const cleanPhone = sanitize(body.phone, 30);
    const cleanEmail = sanitize(body.email, 100);
    const cleanCompany = sanitize(body.company, 100);
    const cleanService = sanitize(body.service_interested, 150);
    const rawVal = Number(body.estimated_value);
    const estimatedValue = isNaN(rawVal) ? 0 : Math.max(0, rawVal);

    if (!cleanName && !cleanPhone && !cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least a name, phone number, or email.' },
        { status: 400 }
      );
    }

    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      lead_name: cleanName || 'Website Inquiry',
      phone: cleanPhone || '+91 99060-00000',
      email: cleanEmail || 'inquiry@accnosolution.com',
      company: cleanCompany || 'Individual Client',
      service_interested: cleanService || 'General IT Support',
      estimated_value: estimatedValue,
      status: 'new',
      assigned_to: 'Sales Representative',
      created_at: new Date().toISOString().split('T')[0],
    };

    mockLeads.unshift(newLead);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been securely received by our team.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
