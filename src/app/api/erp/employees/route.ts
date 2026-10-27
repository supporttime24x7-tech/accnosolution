import { NextRequest, NextResponse } from 'next/server';
import { loadEmployeesFromFile, saveEmployeesToFile, VerifiedEmployee } from '@/lib/employee-registry';
import { verifyAuthToken } from '@/lib/auth';

async function verifyAdminSession(req: NextRequest) {
  const token = req.cookies.get('accno_erp_token')?.value || req.cookies.get('omnicrm_token')?.value;
  if (!token) {
    return null;
  }
  const session = await verifyAuthToken(token);
  if (!session || !session.empCode) {
    return null;
  }
  return session;
}

// GET: Fetch all employees from server
export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Access to employee database is restricted to authenticated sessions.' }, { status: 401 });
    }

    const employees = loadEmployeesFromFile();
    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add new employee (with exact portal login password)
export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Creating employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.empCode || !body.name) {
      return NextResponse.json({ success: false, error: 'Employee ID and Name are required.' }, { status: 400 });
    }

    const employees = loadEmployeesFromFile();
    const cleanCode = body.empCode.trim().toUpperCase();

    // Check duplicate
    if (employees.some((e) => e.empCode === cleanCode)) {
      return NextResponse.json({ success: false, error: `Employee ID ${cleanCode} already exists.` }, { status: 400 });
    }

    const cleanPassword = (body.password || '').trim();

    const newEmp = {
      id: body.id || `emp-${Date.now()}`,
      empCode: cleanCode,
      name: body.name.trim(),
      phone: body.phone || '',
      alternatePhone: body.alternatePhone || '',
      email: body.email || `${cleanCode.toLowerCase()}@accnosolution.com`,
      password: cleanPassword,
      passwordHashOrPlain: cleanPassword,
      address: body.address || '',
      department: body.department || 'General',
      designation: body.designation || 'Staff',
      baseSalary: body.baseSalary || 0,
      joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
      activeStatus: body.activeStatus || 'Active',
      govtIdType: body.govtIdType || 'Aadhaar Card',
      govtIdNumber: body.govtIdNumber || '',
      role: body.role || 'technician',
    };

    employees.push(newEmp as any);
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${cleanCode} created successfully with login password.`,
      employee: newEmp,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update existing employee (updates portal login password immediately)
export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Updating employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const body = await req.json();
    const id = body.id;
    const cleanCode = (body.empCode || '').trim().toUpperCase();

    if (!id && !cleanCode) {
      return NextResponse.json({ success: false, error: 'Employee ID is required.' }, { status: 400 });
    }

    const employees = loadEmployeesFromFile();
    const index = employees.findIndex((e) => e.id === id || e.empCode === cleanCode);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Employee record not found.' }, { status: 404 });
    }

    const existing = employees[index] as any;
    const cleanPassword = body.password !== undefined && body.password !== '' 
      ? body.password.trim() 
      : (existing.password || existing.passwordHashOrPlain || '');

    const updated = {
      ...existing,
      ...body,
      empCode: cleanCode || existing.empCode,
      password: cleanPassword,
      passwordHashOrPlain: cleanPassword,
    };

    employees[index] = updated;
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${updated.empCode} updated successfully with new login credentials.`,
      employee: updated,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove employee (revokes login permission)
export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Deleting employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required for deletion.' }, { status: 400 });
    }

    let employees = loadEmployeesFromFile();
    const target = employees.find((e) => e.id === id || e.empCode === id.toUpperCase());
    employees = employees.filter((e) => e.id !== id && e.empCode !== id.toUpperCase());
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${target?.empCode || id} deleted and login access revoked.`,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
