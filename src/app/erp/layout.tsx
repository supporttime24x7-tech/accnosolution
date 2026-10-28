'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, CreditCard, ShoppingCart, ShoppingBag,
  RotateCcw, FileText, BookOpen, Receipt, DollarSign, FileSpreadsheet,
  Users, Package, Wrench, HardDrive, ShieldCheck, Settings, HelpCircle,
  LogOut, Bell, Search, ChevronRight, Menu, X, Shield, Activity, Truck, PhoneCall, Newspaper, Trophy,
  AlertTriangle, CheckCircle2, Clock, Eye, CheckCheck, ExternalLink, ArrowRight
} from 'lucide-react';
import { useErpStore } from '@/lib/store';
import { AccnoLogo } from '@/components/common/AccnoLogo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  syncEntireErpWithSupabase,
  fetchTicketsFromSupabase,
  fetchInvoicesFromSupabase,
  fetchEmployeesFromSupabase,
} from '@/lib/supabase-sync';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NotificationItem {
  id: string;
  type: 'shop_order' | 'book_repair' | 'low_stock' | 'repair_ticket' | 'outsource';
  title: string;
  description: string;
  timestamp: string;
  targetHref: string;
  read?: boolean;
}

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');
  const notificationRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    setCurrentUser,
    supportLeads = [],
    bookRepairLeads = [],
    inventory = [],
    tickets = [],
    outsourceVouchers = [],
    setTickets,
    setRepairInvoices,
    setEmployees,
  } = useErpStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-Time Supabase Cloud Sync & Cross-Browser Synchronization
  useEffect(() => {
    let isSubscribed = true;

    async function syncFromCloud() {
      if (!isSupabaseConfigured() || !supabase) {
        setCloudSyncStatus('offline');
        return;
      }
      try {
        setCloudSyncStatus('syncing');

        // One-time client cleanup of legacy hardcoded sample localStorage items
        if (typeof window !== 'undefined') {
          try {
            const legacyKeys = [
              'accno_erp_tickets',
              'accno_erp_repair_invoices',
              'accno_erp_outsource_vouchers',
              'accno_erp_data_recovery_cases',
              'accno_erp_amc_contracts',
              'accno_erp_inventory',
              'accno_erp_customers',
              'accno_erp_sales_invoices',
              'accno_erp_purchase_invoices',
              'accno_erp_support_leads',
              'accno_erp_book_repair_leads',
              'accno_erp_blog_posts',
              'accno_erp_milestones',
              'accno_erp_accounting_vouchers',
              'accno_erp_employees',
            ];
            const hasCleanedV2 = localStorage.getItem('accno_supabase_pure_cloud_v2');
            if (!hasCleanedV2) {
              for (const k of legacyKeys) {
                localStorage.removeItem(k);
              }
              localStorage.setItem('accno_supabase_pure_cloud_v2', 'true');
            }
          } catch (e) {}
        }

        const store = useErpStore.getState();
        await syncEntireErpWithSupabase(store);
        if (isSubscribed) {
          setCloudSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Initial cloud sync error:', err);
        if (isSubscribed) setCloudSyncStatus('offline');
      }
    }

    syncFromCloud();

    // Supabase Realtime Channel Subscription
    if (supabase && isSupabaseConfigured()) {
      const channel = supabase
        .channel('accno-erp-realtime-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'repair_tickets' },
          async () => {
            const freshTickets = await fetchTicketsFromSupabase();
            if (freshTickets && isSubscribed) {
              setTickets(freshTickets);
              setCloudSyncStatus('synced');
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'repair_invoices' },
          async () => {
            const freshInvoices = await fetchInvoicesFromSupabase();
            if (freshInvoices && isSubscribed) {
              setRepairInvoices(freshInvoices);
              setCloudSyncStatus('synced');
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'employees' },
          async () => {
            const freshEmps = await fetchEmployeesFromSupabase();
            if (freshEmps && isSubscribed) {
              setEmployees(freshEmps);
              setCloudSyncStatus('synced');
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED' && isSubscribed) {
            setCloudSyncStatus('synced');
          }
        });

      return () => {
        isSubscribed = false;
        supabase?.removeChannel(channel);
      };
    }
  }, [setTickets, setRepairInvoices, setEmployees]);

  // Strict Client-Side Defense-in-Depth Auth Check
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        if (!data.success || !data.user) {
          throw new Error('Invalid session');
        }
        if (isMounted) {
          setCurrentUser(data.user);
          setAuthChecking(false);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accno_erp_current_user');
          }
          setAuthChecking(false);
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };
    verifySession();
    return () => {
      isMounted = false;
    };
  }, [pathname, router, setCurrentUser]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accno_erp_current_user');
    }
    router.replace('/login');
  };

  // Load read notification IDs from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accno_read_notifications');
      if (saved) {
        setReadNotifIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save read notification IDs to LocalStorage
  const markAsRead = (id: string) => {
    if (!readNotifIds.includes(id)) {
      const updated = [...readNotifIds, id];
      setReadNotifIds(updated);
      try {
        localStorage.setItem('accno_read_notifications', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const markAllAsRead = (allIds: string[]) => {
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem('accno_read_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate dynamic real-time notifications from live store state
  const notifications: NotificationItem[] = [];

  // 1. Website Shop Orders & Leads
  supportLeads.forEach((lead) => {
    if (lead.status === 'New Inquiry') {
      const isShop = (lead.source || '').toLowerCase().includes('shop') || (lead.subject || '').toLowerCase().includes('shop order');
      notifications.push({
        id: `notif-lead-${lead.id}`,
        type: 'shop_order',
        title: isShop ? `New Shop Order: ${lead.lead_name}` : `New Lead: ${lead.lead_name}`,
        description: lead.subject || lead.message.slice(0, 50),
        timestamp: lead.created_at || new Date().toISOString(),
        targetHref: '/erp/leads',
      });
    }
  });

  // 2. Online Repair Bookings
  bookRepairLeads.forEach((book) => {
    if (book.status === 'New Booking') {
      notifications.push({
        id: `notif-book-${book.id}`,
        type: 'book_repair',
        title: `Repair Booking: ${book.bookingNo}`,
        description: `${book.name} - ${book.deviceType} (${book.brand})`,
        timestamp: book.created_at || new Date().toISOString(),
        targetHref: '/erp/leads',
      });
    }
  });

  // 3. Low Stock Inventory Alerts
  inventory.forEach((item) => {
    const minLevel = item.lowStockAlert || 5;
    if (item.currentStock <= minLevel) {
      notifications.push({
        id: `notif-stock-${item.id}`,
        type: 'low_stock',
        title: `Low Stock Alert: ${item.name}`,
        description: `Only ${item.currentStock} ${item.uom || 'unit(s)'} remaining (Min threshold: ${minLevel})`,
        timestamp: new Date().toISOString(),
        targetHref: '/erp/inventory',
      });
    }
  });

  // 4. Pending Bench Repair Tickets
  tickets.forEach((t) => {
    if (t.status === 'received' || t.status === 'diagnosing') {
      notifications.push({
        id: `notif-tkt-${t.id}`,
        type: 'repair_ticket',
        title: `Pending Ticket: ${t.ticket_number}`,
        description: `${t.customer_name} - ${t.device_type} (${t.problem_reported})`,
        timestamp: t.created_at || new Date().toISOString(),
        targetHref: '/erp/repairs',
      });
    }
  });

  // 5. Outsource Lab Tickets
  outsourceVouchers.forEach((v) => {
    if (v.dispatchStatus === 'IN_REPAIR' || v.dispatchStatus === 'SHIPPED') {
      notifications.push({
        id: `notif-out-${v.id}`,
        type: 'outsource',
        title: `Outsource Lab: ${v.voucherNumber}`,
        description: `${v.vendorName} - ${v.serviceType} (${v.dispatchStatus})`,
        timestamp: v.voucherDate || new Date().toISOString(),
        targetHref: '/erp/outsource',
      });
    }
  });

  // Attach read status
  const finalNotifications = notifications.map((n) => ({
    ...n,
    read: readNotifIds.includes(n.id),
  }));

  const unreadCount = finalNotifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/erp/repairs?search=${encodeURIComponent(globalSearch.trim())}`);
  };

  const userDept = (currentUser as any)?.department || 'Admin';
  const userDesig = (currentUser as any)?.designation || (currentUser as any)?.role || 'Admin';
  const isAdminUser =
    userDept.toLowerCase().includes('admin') &&
    userDesig.toLowerCase().includes('admin');

  const masterItems: NavItem[] = [
    { name: 'Customers', href: '/erp/customers', icon: Users },
    { name: 'Vendors & Suppliers', href: '/erp/vendors', icon: Users },
    { name: 'Products & Inventory', href: '/erp/inventory', icon: Package },
  ];

  if (isAdminUser) {
    masterItems.push({ name: 'Employees', href: '/erp/employees', icon: Users, badge: 'STAFF' });
  }

  const sidebarSections: NavSection[] = [
    {
      title: 'CORE OPERATIONS',
      items: [
        { name: 'Dashboard', href: '/erp/dashboard', icon: LayoutDashboard },
        { name: 'Reports & Analytics', href: '/erp/reports', icon: BarChart3 },
        { name: 'Blog Management', href: '/erp/blog', icon: Newspaper, badge: 'BLOG' },
        { name: 'Our Milestones', href: '/erp/milestones', icon: Trophy, badge: 'GROWTH' },
        { name: 'Website Repairs', href: '/erp/website-repairs', icon: Wrench, badge: 'SITE' },
      ],
    },
    {
      title: 'SERVICE',
      items: [
        { name: 'Leads', href: '/erp/leads', icon: PhoneCall, badge: 'NEW' },
        { name: 'Repair Tickets', href: '/erp/repairs', icon: Wrench, badge: `${tickets.filter(t => t.status !== 'delivered').length}` },
        { name: 'Outsourced Repairs', href: '/erp/outsource', icon: Truck, badge: 'OUT' },
        { name: 'Data Recovery Cases', href: '/erp/data-recovery', icon: HardDrive },
        { name: 'AMC Contracts', href: '/erp/amc', icon: ShieldCheck },
        { name: 'AMC Software', href: '/erp/amc-software', icon: ShieldCheck },
      ],
    },
    {
      title: 'TRANSACTIONS',
      items: [
        { name: 'POS Terminal', href: '/erp/pos', icon: CreditCard, highlight: true },
        { name: 'Sales', href: '/erp/sales', icon: ShoppingCart },
        { name: 'Purchases', href: '/erp/purchases', icon: ShoppingBag },
        { name: 'Sales Returns', href: '/erp/sales-returns', icon: RotateCcw },
        { name: 'Purchase Returns', href: '/erp/purchase-returns', icon: RotateCcw },
        { name: 'Quotations', href: '/erp/quotations', icon: FileText },
      ],
    },
    {
      title: 'VOUCHERS',
      items: [
        { name: 'All Ledgers', href: '/erp/ledgers', icon: BookOpen },
        { name: 'Receipts', href: '/erp/vouchers/receipts', icon: Receipt },
        { name: 'Payments', href: '/erp/vouchers/payments', icon: DollarSign },
        { name: 'Debit Notes', href: '/erp/vouchers/debit-notes', icon: FileSpreadsheet },
        { name: 'Credit Notes', href: '/erp/vouchers/credit-notes', icon: FileSpreadsheet },
        { name: 'Contra Entries', href: '/erp/vouchers/contra', icon: Activity },
        { name: 'Journals', href: '/erp/vouchers/journals', icon: BookOpen },
      ],
    },
    {
      title: 'MASTER',
      items: masterItems,
    },
  ];

  const fixedSystemItems = [
    { name: 'Settings', href: '/erp/settings', icon: Settings },
    { name: 'Contact Support', href: '/contact', icon: HelpCircle },
  ];

  if (authChecking) {
    return (
      <div className="h-screen w-screen bg-[#070B0A] flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <AccnoLogo height={52} showTagline={true} />
          <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/10 border border-[#5ED29C]/40 flex items-center justify-center text-[#5ED29C] shadow-[0_0_25px_rgba(94,210,156,0.25)] animate-pulse">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white tracking-wider uppercase">Verifying Enterprise Session</p>
            <p className="text-xs text-white/50">Validating cryptographic credentials &amp; Employee ID authorization...</p>
          </div>
          <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-gradient-to-r from-[#28D08B] via-[#16FFC6] to-[#28D08B] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#070B0A] text-white flex overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-[#0D1117] border-r border-white/10 flex flex-col justify-between overflow-hidden transition-transform duration-300 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRAND HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0D1117]">
          <Link href="/erp/dashboard" className="flex items-center select-none" draggable={false}>
            <AccnoLogo height={38} showTagline={false} />
          </Link>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase select-none">
            Licensed Enterprise
          </span>
        </div>

        {/* MIDDLE SCROLLABLE NAV SECTIONS */}
        <nav className="p-3 space-y-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          {sidebarSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 block select-none">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    draggable={false}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                      isActive
                        ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-lg shadow-[#5ED29C]/20'
                        : item.highlight
                        ? 'bg-[#16FFC6]/10 text-[#16FFC6] hover:bg-[#16FFC6]/20 border border-[#16FFC6]/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        suppressHydrationWarning
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          isActive ? 'bg-[#070B0A] text-[#5ED29C]' : 'bg-[#5ED29C]/20 text-[#5ED29C]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* FIXED IN PLACE BOTTOM FOOTER */}
        <div className="p-3 border-t border-white/10 bg-[#0D1117] shrink-0 select-none space-y-2.5 z-10 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 block select-none">
              SYSTEM
            </span>

            {fixedSystemItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  draggable={false}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold shadow-lg shadow-[#5ED29C]/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ADMIN USER PROFILE FOOTER BLOCK */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between select-none">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#5ED29C]/20 border border-[#5ED29C] flex items-center justify-center font-bold text-xs text-[#5ED29C] select-none" suppressHydrationWarning>
                {mounted ? (currentUser?.name?.charAt(0) || 'A') : 'A'}
              </div>
              <div className="flex flex-col select-none">
                <span className="text-xs font-bold text-white leading-tight" suppressHydrationWarning>
                  {mounted ? (currentUser?.name || 'Admin') : 'Admin'}
                </span>
                <span className="text-[10px] text-[#5ED29C] font-semibold" suppressHydrationWarning>
                  {mounted ? (currentUser?.role || 'Super Admin') : 'Super Admin'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 p-1.5 rounded-lg transition-colors cursor-pointer"
              title="Secure Logout from Backend"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0D1117]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-80">
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search tickets, bills, serials..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            </form>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}
              title={
                cloudSyncStatus === 'synced'
                  ? 'Supabase Cloud Sync Active — Real-time bidirectional database synchronization'
                  : cloudSyncStatus === 'syncing'
                  ? 'Connecting to Supabase Cloud...'
                  : 'Local Storage Mode'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  cloudSyncStatus === 'synced'
                    ? 'bg-emerald-400 animate-pulse'
                    : cloudSyncStatus === 'syncing'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <span>
                {cloudSyncStatus === 'synced'
                  ? 'Cloud Sync Active'
                  : cloudSyncStatus === 'syncing'
                  ? 'Syncing Cloud...'
                  : 'Local Storage'}
              </span>
            </span>

            <Link
              href="/erp/pos"
              draggable={false}
              className="px-4 py-1.5 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 transition-all flex items-center space-x-1.5 select-none"
            >
              <CreditCard className="w-4 h-4" />
              <span>POS TERMINAL</span>
            </Link>

            {/* FULLY FUNCTIONAL BELL NOTIFICATION ICON & DROPDOWN */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                  showNotifications
                    ? 'bg-[#5ED29C] text-slate-950 border-[#5ED29C]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                }`}
                title="ERP System Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {mounted && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION CENTER DROPDOWN DRAWER */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#070B0A] border border-white/15 shadow-2xl z-50 overflow-hidden text-xs">
                  {/* Header */}
                  <div className="p-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#5ED29C]" />
                      <span className="font-extrabold text-white uppercase tracking-wider text-xs">System Alerts</span>
                      {mounted && unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>
                    {mounted && unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead(finalNotifications.map((n) => n.id))}
                        className="text-[10px] text-[#5ED29C] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark All Read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                    {finalNotifications.length === 0 ? (
                      <div className="p-8 text-center text-white/40 space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto" />
                        <p className="text-xs font-semibold">All caught up!</p>
                        <p className="text-[10px] text-white/30">No active system alerts at this moment.</p>
                      </div>
                    ) : (
                      finalNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 transition-colors hover:bg-white/5 flex items-start gap-3 relative group ${
                            n.read ? 'opacity-60 bg-transparent' : 'bg-white/[0.02]'
                          }`}
                        >
                          {/* Type Icon Badge */}
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'shop_order' && (
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === 'book_repair' && (
                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                                <Wrench className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === 'low_stock' && (
                              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === 'repair_ticket' && (
                              <div className="w-7 h-7 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === 'outsource' && (
                              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                                <Truck className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="font-bold text-white text-xs truncate">{n.title}</div>
                            <div className="text-[11px] text-white/60 line-clamp-2 leading-relaxed mt-0.5">
                              {n.description}
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[9px] text-white/40 font-mono">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <Link
                                href={n.targetHref}
                                onClick={() => {
                                  markAsRead(n.id);
                                  setShowNotifications(false);
                                }}
                                className="text-[10px] text-[#5ED29C] hover:underline font-bold flex items-center gap-0.5"
                              >
                                View Details <ArrowRight className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>

                          {/* Dismiss Button */}
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="absolute top-3 right-3 text-white/30 hover:text-white p-0.5"
                              title="Mark as Read"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer Jump Links */}
                  <div className="p-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                    <Link
                      href="/erp/leads"
                      onClick={() => setShowNotifications(false)}
                      className="hover:text-[#5ED29C] font-semibold"
                    >
                      Leads ({supportLeads.length})
                    </Link>
                    <Link
                      href="/erp/repairs"
                      onClick={() => setShowNotifications(false)}
                      className="hover:text-[#5ED29C] font-semibold"
                    >
                      Tickets ({tickets.length})
                    </Link>
                    <Link
                      href="/erp/inventory"
                      onClick={() => setShowNotifications(false)}
                      className="hover:text-[#5ED29C] font-semibold"
                    >
                      Inventory ({inventory.length})
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              draggable={false}
              className="hidden sm:flex items-center space-x-1 text-xs text-white/60 hover:text-white px-2 py-1 select-none"
            >
              <span>Public Website</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 lg:p-4 overflow-y-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
