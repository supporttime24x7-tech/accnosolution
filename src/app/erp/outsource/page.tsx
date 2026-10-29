'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck, Search, Plus, Filter, QrCode, Barcode, Printer, User,
  Smartphone, CheckCircle2, Clock, ChevronDown, Edit, Shield, Eye, X,
  MapPin, FileText, Check, AlertCircle, DollarSign, PackageCheck, ExternalLink, ArrowRight,
  Trash2, Lock, Tag, Calendar, Building2, Layers, AlertTriangle, RotateCw
} from 'lucide-react';
import { useErpStore, OutsourceVoucher } from '@/lib/store';
import {
  fetchOutsourceVouchersFromSupabase,
  pushOutsourceVoucherToSupabase,
  deleteOutsourceVoucherFromSupabase,
} from '@/lib/supabase-sync';

export default function ErpOutsourcePage() {
  const {
    outsourceVouchers,
    vendors,
    tickets,
    outsourceRules,
    companyDetails,
    addOutsourceVoucher,
    updateOutsourceVoucher,
    deleteOutsourceVoucher,
    setOutsourceVouchers,
  } = useErpStore();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncingCloud(true);
    setSyncStatusMsg('Syncing with Supabase Cloud...');
    try {
      const data = await fetchOutsourceVouchersFromSupabase();
      if (Array.isArray(data)) {
        setOutsourceVouchers(data);
        setSyncStatusMsg(`Synced ${data.length} vouchers from Cloud`);
      } else {
        setSyncStatusMsg('Cloud sync completed');
      }
    } catch {
      setSyncStatusMsg('Sync error occurred');
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  useEffect(() => {
    fetchOutsourceVouchersFromSupabase().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setOutsourceVouchers(data);
      }
    }).catch(() => {});
  }, [setOutsourceVouchers]);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);

  const [showChallanModal, setShowChallanModal] = useState(false);
  const [showShippingLabelModal, setShowShippingLabelModal] = useState(false);
  const [showBatchPrintModal, setShowBatchPrintModal] = useState(false);
  
  const [selectedVoucher, setSelectedVoucher] = useState<OutsourceVoucher | null>(null);
  
  // Batch Manifest Vendor Selection, Date Filter & Checked Voucher IDs
  const [selectedBatchVendorId, setSelectedBatchVendorId] = useState<string>(vendors[0]?.id || 'v-1002');
  const [selectedBatchDate, setSelectedBatchDate] = useState<string>('all');
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<Set<string>>(new Set());

  // Toggle for printing Dispatch Reference on Shipping Label
  const [includeShippingReference, setIncludeShippingReference] = useState<boolean>(true);

  // Filter available batch vouchers based on Vendor AND Date selection
  const availableBatchVouchers = outsourceVouchers.filter((v) => {
    const matchVendor = selectedBatchVendorId === 'all' || v.vendorId === selectedBatchVendorId;
    const vDate = v.voucherDate || v.outgoingDispatchDate;
    const matchDate = selectedBatchDate === 'all' || !selectedBatchDate || vDate === selectedBatchDate;
    return matchVendor && matchDate;
  });

  // Selected batch vouchers to print
  const printableBatchVouchers = availableBatchVouchers.filter((v) => selectedVoucherIds.has(v.id));

  // Initialize batch voucher selection when batch modal opens or vendor/date changes
  useEffect(() => {
    setSelectedVoucherIds(new Set(availableBatchVouchers.map((v) => v.id)));
  }, [selectedBatchVendorId, selectedBatchDate, outsourceVouchers, showBatchPrintModal]);

  // Unique dates available for current vendor or all vouchers
  const uniqueBatchDates = Array.from(
    new Set(
      outsourceVouchers
        .filter((v) => selectedBatchVendorId === 'all' || v.vendorId === selectedBatchVendorId)
        .map((v) => v.voucherDate || v.outgoingDispatchDate)
        .filter(Boolean)
    )
  ).sort().reverse();

  // Outsource Voucher Form State (Create & Edit)
  const [voucherForm, setVoucherForm] = useState({
    voucherNumber: '',
    voucherDate: new Date().toISOString().split('T')[0],
    linkedTicketNumber: tickets[0]?.ticket_number || 'TKT-1001',
    vendorJobId: 'LAB-OUT-9901',
    vendorId: vendors[0]?.id || 'v-1002',
    serviceType: 'CPU Reballing',

    // Point 2: Outgoing Courier
    outgoingCourier: 'Bluedart Express',
    outgoingDocket: 'BLU-88776655',
    outgoingDispatchDate: new Date().toISOString().split('T')[0],
    outgoingFreightCost: 250,

    // Point 2: Incoming Courier
    incomingCourier: 'DTDC Express',
    incomingDocket: 'DTD-998877',
    incomingDispatchDate: '',
    incomingFreightCost: 0,
    expectedReturnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Financials
    vendorCostPrice: 2500,
    customerSellingPrice: 5500,

    // Point 4: Outsource Status & Detailed Description
    dispatchStatus: 'SHIPPED' as 'SHIPPED' | 'IN_REPAIR' | 'RETURNED' | 'COMPLETED' | 'CANCELLED',
    technicalInstructions: 'Level-4 BGA Chip Reballing & Cleanroom Inspection',
  });

  // Open Create Voucher Modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingVoucherId(null);
    const nextNo = outsourceRules.outsource_ticket_start_no + outsourceVouchers.length;
    const defaultVoucherNo = `${outsourceRules.outsource_ticket_prefix}${nextNo}`;
    
    setVoucherForm({
      voucherNumber: defaultVoucherNo,
      voucherDate: new Date().toISOString().split('T')[0],
      linkedTicketNumber: tickets[0]?.ticket_number || 'TKT-1001',
      vendorJobId: `LAB-OUT-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId: vendors[0]?.id || '',
      serviceType: outsourceRules.outsource_service_types[0] || 'CPU Reballing',
      outgoingCourier: 'Bluedart Express',
      outgoingDocket: `BLU-${Math.floor(10000000 + Math.random() * 90000000)}`,
      outgoingDispatchDate: new Date().toISOString().split('T')[0],
      outgoingFreightCost: outsourceRules.outsource_default_freight || 250,
      incomingCourier: '',
      incomingDocket: '',
      incomingDispatchDate: '',
      incomingFreightCost: 0,
      expectedReturnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vendorCostPrice: 2500,
      customerSellingPrice: 5500,
      dispatchStatus: 'SHIPPED',
      technicalInstructions: 'Level-4 BGA Chip Reballing & Micro-soldering Inspection',
    });
    setShowFormModal(true);
  };

  // Open Edit Voucher Modal
  const handleOpenEditModal = (v: OutsourceVoucher) => {
    setIsEditMode(true);
    setEditingVoucherId(v.id);
    setVoucherForm({
      voucherNumber: v.voucherNumber,
      voucherDate: v.voucherDate || v.outgoingDispatchDate || new Date().toISOString().split('T')[0],
      linkedTicketNumber: v.linkedTicketNumber,
      vendorJobId: v.vendorJobId || '',
      vendorId: v.vendorId,
      serviceType: v.serviceType,

      outgoingCourier: v.outgoingCourier || '',
      outgoingDocket: v.outgoingDocket || '',
      outgoingDispatchDate: v.outgoingDispatchDate || '',
      outgoingFreightCost: v.outgoingFreightCost || 250,

      incomingCourier: v.incomingCourier || '',
      incomingDocket: v.incomingDocket || '',
      incomingDispatchDate: v.incomingDispatchDate || v.receivedDate || '',
      incomingFreightCost: v.incomingFreightCost || 0,
      expectedReturnDate: v.expectedReturnDate || '',

      vendorCostPrice: v.vendorCostPrice || 0,
      customerSellingPrice: v.customerSellingPrice || 0,

      dispatchStatus: v.dispatchStatus,
      technicalInstructions: v.technicalInstructions || '',
    });
    setShowFormModal(true);
  };

  // Submit Create / Modify Outsource Voucher
  const handleSubmitVoucherForm = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVendor = vendors.find((v) => v.id === voucherForm.vendorId) || vendors[0] || {
      id: 'v-1002',
      companyName: 'Cleanroom Data Recovery Labs',
      phone: '+91 94192-33445',
      station: 'Delhi NCR',
      fullAddress: 'Plot 12, Nehru Place, Delhi NCR',
      gstin: '07BBBBB8888C1Z2',
    };

    const outgoingFreight = Number(voucherForm.outgoingFreightCost || 0);
    const incomingFreight = Number(voucherForm.incomingFreightCost || 0);
    const totalFreight = outgoingFreight + incomingFreight;

    const voucherPayload = {
      voucherNumber: voucherForm.voucherNumber,
      voucherDate: voucherForm.voucherDate,
      linkedTicketNumber: voucherForm.linkedTicketNumber,
      vendorJobId: voucherForm.vendorJobId,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.companyName,
      vendorPhone: selectedVendor.phone,
      vendorCity: selectedVendor.station || 'Delhi NCR',
      vendorAddress: selectedVendor.fullAddress || '',
      vendorGstin: selectedVendor.gstin,
      serviceType: voucherForm.serviceType,

      outgoingCourier: voucherForm.outgoingCourier,
      outgoingDocket: voucherForm.outgoingDocket,
      outgoingDispatchDate: voucherForm.outgoingDispatchDate,
      outgoingFreightCost: outgoingFreight,

      incomingCourier: voucherForm.incomingCourier,
      incomingDocket: voucherForm.incomingDocket,
      incomingDispatchDate: voucherForm.incomingDispatchDate,
      incomingFreightCost: incomingFreight,
      expectedReturnDate: voucherForm.expectedReturnDate,

      vendorCostPrice: Number(voucherForm.vendorCostPrice),
      freightCharges: totalFreight,
      customerSellingPrice: Number(voucherForm.customerSellingPrice),
      dispatchStatus: voucherForm.dispatchStatus,
      technicalInstructions: voucherForm.technicalInstructions,
    };

    if (isEditMode && editingVoucherId) {
      updateOutsourceVoucher(editingVoucherId, voucherPayload);
      pushOutsourceVoucherToSupabase({ id: editingVoucherId, ...voucherPayload } as any).catch(() => {});
    } else {
      addOutsourceVoucher(voucherPayload);
      pushOutsourceVoucherToSupabase(voucherPayload as any).catch(() => {});
    }

    setShowFormModal(false);
  };

  // Filter vouchers by search & active status
  const filteredVouchers = outsourceVouchers.filter((v) => {
    const matchSearch =
      v.voucherNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.linkedTicketNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      v.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      (v.outgoingDocket && v.outgoingDocket.toLowerCase().includes(search.toLowerCase())) ||
      (v.incomingDocket && v.incomingDocket.toLowerCase().includes(search.toLowerCase()));

    if (activeFilter === 'all') return matchSearch;
    return matchSearch && v.dispatchStatus.toLowerCase() === activeFilter.toLowerCase();
  });

  // Multi-selection handlers
  const toggleVoucherSelection = (id: string) => {
    const next = new Set(selectedVoucherIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedVoucherIds(next);
  };

  const handleSelectAllBatch = () => {
    setSelectedVoucherIds(new Set(availableBatchVouchers.map((v) => v.id)));
  };

  const handleDeselectAllBatch = () => {
    setSelectedVoucherIds(new Set());
  };

  const handleSelectShippedOnlyBatch = () => {
    const shipped = availableBatchVouchers.filter((v) => v.dispatchStatus === 'SHIPPED');
    setSelectedVoucherIds(new Set(shipped.map((v) => v.id)));
  };

  // Helper to format display date on printed manifest
  const getManifestDisplayDate = () => {
    if (selectedBatchDate && selectedBatchDate !== 'all') {
      const parts = selectedBatchDate.split('-');
      if (parts.length === 3) return `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}/${parts[0]}`;
      return selectedBatchDate;
    }
    return new Date().toLocaleDateString('en-GB');
  };

  // 1:1 EXACT PRINT FUNCTION FOR OUTSOURCE SERVICE ORDER (MATCHES USER IMAGE 1)
  const handlePrintOutsourceOrder = (v: OutsourceVoucher) => {
    const linkedTicket = tickets.find((t) => t.ticket_number === v.linkedTicketNumber);
    const vendorObj = vendors.find((vend) => vend.id === v.vendorId);
    const fullAddress = [companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state]
      .filter(Boolean)
      .join(', ') || '880, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk';
    const companyPhone = companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 95877 XXXXX';
    const gstinStr = companyDetails.gstin || '06ABCDE1234F1Z7';

    const totalFreight = (v.outgoingFreightCost || 0) + (v.incomingFreightCost || 0) || v.freightCharges || 0;
    const totalAmount = (v.vendorCostPrice || 0) + totalFreight;

    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Please allow popups to print Outsource Service Order.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Outsource Service Order - ${v.voucherNumber}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            body {
              background: #ffffff;
              color: #000000;
              font-size: 11px;
              line-height: 1.3;
              padding: 4mm 6mm;
            }
            .container {
              width: 100%;
              max-width: 190mm;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #000000;
              padding-bottom: 12px;
              margin-bottom: 14px;
            }
            .company-title {
              font-size: 20px;
              font-weight: 900;
              letter-spacing: -0.5px;
              text-transform: uppercase;
              color: #000000;
            }
            .company-sub {
              font-size: 9.5px;
              color: #333333;
              margin-top: 3px;
            }
            .badge-container {
              text-align: right;
            }
            .badge {
              background: #000000;
              color: #ffffff;
              font-weight: 900;
              font-size: 11px;
              text-transform: uppercase;
              padding: 5px 12px;
              border-radius: 6px;
              display: inline-block;
              letter-spacing: 0.5px;
            }
            .voucher-no {
              font-family: monospace;
              font-size: 13px;
              font-weight: 800;
              margin-top: 5px;
            }
            .voucher-date {
              font-size: 10px;
              color: #444444;
              font-weight: 600;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 14px;
            }
            .box {
              border: 1px solid #000000;
              border-radius: 8px;
              padding: 10px 12px;
              background: #ffffff;
            }
            .box-header {
              font-size: 9.5px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #333333;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-bottom: 8px;
            }
            .row-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              font-size: 10.5px;
            }
            .label {
              font-weight: 700;
              color: #000000;
            }
            .val {
              font-weight: 600;
              color: #111111;
              font-family: monospace;
            }
            .val-text {
              font-weight: 700;
              color: #000000;
            }
            .grid-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 12px;
              margin-bottom: 14px;
            }
            .date-box {
              border: 1px solid #000000;
              border-radius: 8px;
              padding: 8px;
              text-align: center;
            }
            .date-label {
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              color: #555555;
              margin-bottom: 3px;
            }
            .date-val {
              font-size: 12px;
              font-weight: 800;
              font-family: monospace;
            }
            .desc-box {
              border: 1px solid #000000;
              border-radius: 8px;
              padding: 10px 12px;
              margin-bottom: 14px;
            }
            .desc-title {
              font-size: 9.5px;
              font-weight: 900;
              text-transform: uppercase;
              color: #333333;
              margin-bottom: 6px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
            }
            .desc-content {
              font-size: 11px;
              font-weight: 600;
              color: #111111;
              font-style: italic;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              border: 1px solid #000000;
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background: #f1f5f9;
              color: #000000;
              font-size: 9.5px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 8px 10px;
              border-bottom: 1px solid #000000;
              border-right: 1px solid #cbd5e1;
              text-align: left;
            }
            th:last-child {
              border-right: none;
            }
            td {
              padding: 10px;
              font-size: 10.5px;
              border-right: 1px solid #cbd5e1;
            }
            td:last-child {
              border-right: none;
            }
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 16px;
              margin-top: 40px;
              padding-top: 10px;
            }
            .sig-block {
              border-top: 1px solid #000000;
              text-align: center;
              padding-top: 6px;
            }
            .sig-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
            }
            .sig-sub {
              font-size: 9px;
              color: #666666;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <div>
                <div class="company-title">${companyDetails.companyLegalName}</div>
                <div class="company-sub">${fullAddress}</div>
                <div class="company-sub"><strong>Phone:</strong> ${companyPhone} | <strong>GSTIN:</strong> ${gstinStr}</div>
              </div>
              <div class="badge-container">
                <div class="badge">OUTSOURCE SERVICE ORDER</div>
                <div class="voucher-no">${v.voucherNumber}</div>
                <div class="voucher-date">Date: ${v.voucherDate || v.outgoingDispatchDate}</div>
              </div>
            </div>

            <!-- SECTION 1: DEVICE SPECS & ENCLOSED HARDWARE | OUTSOURCING LAB DETAILS -->
            <div class="grid-2">
              <!-- LEFT BOX: DEVICE SPECS -->
              <div class="box">
                <div class="box-header">DEVICE SPECS & ENCLOSED HARDWARE</div>
                <div class="row-item"><span class="label">Job Ticket Ref:</span><span class="val">${v.linkedTicketNumber}</span></div>
                <div class="row-item"><span class="label">Device Category:</span><span class="val-text">${linkedTicket?.device_type || 'Motherboard'}</span></div>
                <div class="row-item"><span class="label">Brand & Model:</span><span class="val-text">${linkedTicket ? `${linkedTicket.brand} ${linkedTicket.model}` : 'Gigabyte B450 Aorus Pro WiFi'}</span></div>
                <div class="row-item"><span class="label">IMEI / Serial No:</span><span class="val">${linkedTicket?.serial_or_imei || 'SN2401889988112'}</span></div>
                <div class="row-item"><span class="label">Enclosed Parts / Specs:</span><span class="val-text">${linkedTicket?.physicalCondition || 'Motherboard & Assembly Unit Enclosed'}</span></div>
              </div>

              <!-- RIGHT BOX: OUTSOURCING LAB DETAILS -->
              <div class="box">
                <div class="box-header">OUTSOURCING LAB DETAILS</div>
                <div class="row-item"><span class="label">Lab Partner Company:</span><span class="val-text">${v.vendorName}</span></div>
                <div class="row-item"><span class="label">Lab Vendor ID:</span><span class="val">${vendorObj?.code || v.vendorId || 'OVE-1001'}</span></div>
                <div class="row-item"><span class="label">Lab Contact Person:</span><span class="val-text">${vendorObj?.contactPerson || v.vendorName} (${v.vendorPhone})</span></div>
                <div class="row-item"><span class="label">Lab Ref Job ID:</span><span class="val">${v.vendorJobId || 'N3V-8162'}</span></div>
                <div class="row-item"><span class="label">Service Type:</span><span class="val-text">${v.serviceType}</span></div>
              </div>
            </div>

            <!-- SECTION 2: DATES ROW -->
            <div class="grid-3">
              <div class="date-box">
                <div class="date-label">OUTSOURCE DATE</div>
                <div class="date-val">${v.outgoingDispatchDate || v.voucherDate}</div>
              </div>
              <div class="date-box">
                <div class="date-label">EXPECTED RETURN DATE</div>
                <div class="date-val">${v.expectedReturnDate || 'N/A'}</div>
              </div>
              <div class="date-box">
                <div class="date-label">RECEIVED RETURN DATE</div>
                <div class="date-val">${v.incomingDispatchDate || v.receivedDate || 'N/A'}</div>
              </div>
            </div>

            <!-- SECTION 3: REPAIR WORK DESCRIPTION & SPECIFICATIONS -->
            <div class="desc-box">
              <div class="desc-title">REPAIR WORK DESCRIPTION & SPECIFICATIONS</div>
              <div class="desc-content">${v.technicalInstructions || 'With Processor Ryzen 5 3600 / Level-4 BGA Micro-soldering Work.'}</div>
            </div>

            <!-- SECTION 4: FINANCIAL & SERVICE LEDGER TABLE -->
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">SERVICE DESCRIPTION</th>
                  <th style="width: 25%;">SERVICE TYPE</th>
                  <th style="width: 12%; text-align: right;">COST PRICE (₹)</th>
                  <th style="width: 13%; text-align: right;">FREIGHT/SHIPPING (₹)</th>
                  <th style="width: 10%; text-align: right;">TOTAL AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 700;">Outsource Labor & Component Repair Charge</td>
                  <td style="font-weight: 600;">${v.serviceType}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: 700;">₹${v.vendorCostPrice.toLocaleString()}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: 700;">₹${totalFreight.toLocaleString()}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: 900;">₹${totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <!-- SECTION 5: SIGNATURE BLOCKS -->
            <div class="signatures">
              <div class="sig-block">
                <div class="sig-title">Dispatched By (Staff)</div>
                <div class="sig-sub">${companyDetails.companyLegalName} ERP</div>
              </div>
              <div class="sig-block">
                <div class="sig-title">Lab Receiver Signature</div>
                <div class="sig-sub">${v.vendorName}</div>
              </div>
              <div class="sig-block">
                <div class="sig-title">Authorized Signatory</div>
                <div class="sig-sub">For ${companyDetails.companyLegalName} Pvt Ltd</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // 1:1 EXACT PRINT FUNCTION FOR A5 SHIPPING LABEL (WITH OPTIONAL REFERENCE TOGGLE)
  const handlePrintShippingLabel = (v: OutsourceVoucher, printRef: boolean = includeShippingReference) => {
    const linkedTicket = tickets.find((t) => t.ticket_number === v.linkedTicketNumber);
    const vendorObj = vendors.find((vend) => vend.id === v.vendorId);
    const fullCompanyAddress = [companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state]
      .filter(Boolean)
      .join(', ') || '#80, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk, SANCHORE, Rajasthan, Pincode: 343041';
    const companyPhoneStr = companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 98765 43210';
    const companyGstinStr = companyDetails.gstin || '08AABCC1234F1Z0';

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print A5 Shipping Label.');
      return;
    }

    const dispatchReferenceHtml = printRef ? `
      <!-- BOX 3: DISPATCH REFERENCE -->
      <div class="card-box">
        <div class="box-tag">DISPATCH REFERENCE:</div>
        <div class="ref-grid">
          <div>
            <div style="margin-bottom: 4px;"><span class="ref-lbl">Outsource ID:</span> <span class="ref-val">${v.voucherNumber}</span></div>
            <div><span class="ref-lbl">Device:</span> <span class="ref-val" style="font-family: sans-serif; font-weight: 800;">${linkedTicket ? `${linkedTicket.brand} ${linkedTicket.model}` : 'Gigabyte B450 Aorus Pro WiFi'}</span></div>
          </div>
          <div>
            <div style="margin-bottom: 4px;"><span class="ref-lbl">Ticket #:</span> <span class="ref-val">${v.linkedTicketNumber}</span></div>
            <div><span class="ref-lbl">Service:</span> <span class="ref-val" style="font-family: sans-serif; font-weight: 800;">${v.serviceType}</span></div>
          </div>
        </div>
      </div>
    ` : '';

    const footerRefHtml = printRef ? `<div>Ref: ${v.voucherNumber}</div>` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Parcel & Courier Shipping Label - ${v.voucherNumber}</title>
          <style>
            @page {
              size: A5 portrait;
              margin: 4mm 5mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            body {
              background: #ffffff;
              color: #000000;
              font-size: 11px;
              line-height: 1.35;
              padding: 2mm;
            }
            .label-outer {
              border: 2px solid #000000;
              border-radius: 12px;
              padding: 16px;
              width: 100%;
              min-height: 190mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: #ffffff;
            }
            .header-banner {
              border-bottom: 2px solid #000000;
              padding-bottom: 8px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header-title {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: -0.5px;
              text-transform: uppercase;
              color: #000000;
            }
            .header-subtitle {
              font-size: 9px;
              font-weight: 800;
              color: #444444;
              letter-spacing: 0.5px;
              margin-top: 1px;
            }
            .badge-a5 {
              background: #000000;
              color: #ffffff;
              font-weight: 900;
              font-size: 9px;
              padding: 4px 10px;
              border-radius: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .card-box {
              border: 1.5px solid #000000;
              border-radius: 10px;
              padding: 12px 14px;
              margin-bottom: 12px;
              background: #ffffff;
            }
            .box-tag {
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              color: #555555;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 3px;
              margin-bottom: 6px;
            }
            .recipient-name {
              font-size: 16px;
              font-weight: 900;
              text-transform: uppercase;
              color: #000000;
              margin-bottom: 4px;
            }
            .sender-name {
              font-size: 14px;
              font-weight: 900;
              text-transform: uppercase;
              color: #000000;
              margin-bottom: 3px;
            }
            .address-line {
              font-size: 10.5px;
              color: #111111;
              font-weight: 600;
              line-height: 1.35;
              margin-bottom: 3px;
            }
            .address-sub {
              font-size: 10px;
              color: #444444;
              font-weight: 700;
              margin-bottom: 3px;
            }
            .meta-line {
              font-size: 10px;
              font-weight: 800;
              font-family: monospace;
              color: #000000;
              margin-top: 4px;
            }
            .ref-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              font-size: 10.5px;
              padding-top: 2px;
            }
            .ref-lbl {
              font-weight: 700;
              color: #444444;
            }
            .ref-val {
              font-weight: 800;
              color: #000000;
              font-family: monospace;
            }
            .footer-bar {
              border-top: 2px solid #000000;
              padding-top: 10px;
              margin-top: auto;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 9.5px;
            }
            .fragile-container {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .fragile-pill {
              background: #000000;
              color: #ffffff;
              font-weight: 900;
              font-size: 8.5px;
              padding: 3px 8px;
              border-radius: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .fragile-sub {
              font-weight: 700;
              color: #333333;
              font-size: 9px;
            }
            .footer-meta {
              text-align: right;
              font-family: monospace;
              font-weight: 700;
              color: #555555;
              line-height: 1.3;
            }
          </style>
        </head>
        <body>
          <div class="label-outer">
            <div>
              <!-- TOP BANNER -->
              <div class="header-banner">
                <div>
                  <div class="header-title">PARCEL & COURIER SHIPPING LABEL</div>
                  <div class="header-subtitle">OUTSOURCING & LOGISTICS DISPATCH</div>
                </div>
                <div>
                  <div class="badge-a5">A5 FORMAT</div>
                </div>
              </div>

              <!-- BOX 1: TO (RECIPIENT / LAB VENDOR) -->
              <div class="card-box">
                <div class="box-tag">TO (RECIPIENT / LAB VENDOR):</div>
                <div class="recipient-name">${v.vendorName}</div>
                <div class="address-line">${vendorObj?.fullAddress || v.vendorAddress || 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur, India, Rajasthan'}</div>
                <div class="address-sub">${v.vendorCity || 'Local, Rajasthan'}</div>
                <div class="meta-line">Primary Phone: ${v.vendorPhone}</div>
              </div>

              <!-- BOX 2: FROM (SENDER DETAILS / COMPANY) -->
              <div class="card-box">
                <div class="box-tag">FROM (SENDER DETAILS / COMPANY):</div>
                <div class="sender-name">${companyDetails.companyLegalName}</div>
                <div class="address-line">${fullCompanyAddress}</div>
                <div class="meta-line">Phone: ${companyPhoneStr} | GSTIN: ${companyGstinStr}</div>
              </div>

              ${dispatchReferenceHtml}
            </div>

            <!-- FOOTER BAR -->
            <div class="footer-bar">
              <div class="fragile-container">
                <span class="fragile-pill">FRAGILE - HANDLE WITH CARE</span>
                <span class="fragile-sub">Precision Electronic Equipment / Repair Shipment</span>
              </div>
              <div class="footer-meta">
                <div>Date: ${v.voucherDate || v.outgoingDispatchDate}</div>
                ${footerRefHtml}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // 1:1 EXACT PRINT FUNCTION FOR A4 CONSOLIDATED BATCH MANIFEST (MATCHES USER IMAGE 4 & 5 EXACTLY)
  const handlePrintBatchManifest = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=1100');
    if (!printWindow) {
      alert('Please allow popups to print A4 Batch Manifest.');
      return;
    }

    const currentVendorObj = vendors.find((v) => v.id === selectedBatchVendorId) || vendors[0] || {
      id: 'v-1002',
      companyName: 'Nivial Hardware Solution',
      contactPerson: 'Nivial Hardware Solution',
      phone: '9460530006',
      station: 'Jodhpur, India, Rajasthan, Local, Rajasthan',
      fullAddress: 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur',
      code: 'OVE-1001',
      gstin: 'N/A',
    };

    const fullCompanyAddress = [companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state]
      .filter(Boolean)
      .join(', ') || '480, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk';
    const companyPhoneStr = companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 95877 81166';
    const companyGstinStr = companyDetails.gstin || '08CAUPK8462J1ZT';
    const manifestDateFormatted = getManifestDisplayDate();

    const rowsHtml = printableBatchVouchers.map((v, idx) => {
      const ticketObj = tickets.find((t) => t.ticket_number === v.linkedTicketNumber);
      const problemDesc = ticketObj?.problem_reported || 'No Display | No Boot Issue';
      const instructions = v.technicalInstructions || 'With Processor Ryzen 5 3600';
      const enclosedParts = ticketObj?.physicalCondition || 'Motherboard & Hardware Unit';

      return `
        <tr>
          <td style="border: 1px solid #000000; padding: 8px 6px; text-align: center; font-weight: bold;">${idx + 1}</td>
          <td style="border: 1px solid #000000; padding: 8px 6px; font-weight: bold; font-family: monospace; color: #1e1b4b;">${v.voucherNumber}</td>
          <td style="border: 1px solid #000000; padding: 8px 6px; font-weight: bold; font-family: monospace; color: #1e3a8a;">${v.linkedTicketNumber}</td>
          <td style="border: 1px solid #000000; padding: 8px 6px; font-weight: bold;">${ticketObj ? `${ticketObj.brand} ${ticketObj.model || ticketObj.device_type}` : 'Gigabyte B450 Aorus Pro WiFi'} (${ticketObj?.device_type || 'Motherboard'})</td>
          <td style="border: 1px solid #000000; padding: 8px 6px; font-family: monospace; font-size: 10px;">${ticketObj?.serial_or_imei || 'SN2401889988112'}</td>
          <td style="border: 1px solid #000000; padding: 8px 6px;">
            <div style="font-weight: 900; color: #1e1b4b; text-transform: uppercase; margin-bottom: 4px; font-size: 11px;">${v.serviceType}</div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; padding: 4px 6px; font-size: 9.5px; font-weight: 700; color: #92400e; margin-bottom: 4px;">
              <strong>Fault / Problem:</strong> ${problemDesc}
            </div>
            <div style="font-size: 9.5px; color: #374151; font-style: italic;">
              <strong>Instructions:</strong> ${instructions}
            </div>
          </td>
          <td style="border: 1px solid #000000; padding: 8px 6px; font-size: 10.5px;">${enclosedParts}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consolidated Outsource Dispatch Manifest - ${currentVendorObj.companyName}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            body {
              background: #ffffff;
              color: #000000;
              font-size: 11px;
              line-height: 1.35;
              padding: 2mm;
            }
            .manifest-container {
              width: 100%;
              max-width: 190mm;
              margin: 0 auto;
            }
            .header-row {
              border-bottom: 2px solid #000000;
              padding-bottom: 10px;
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .company-name {
              font-size: 20px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: -0.5px;
              color: #000000;
            }
            .company-address {
              font-size: 9.5px;
              color: #333333;
              margin-top: 2px;
            }
            .badge-manifest {
              background: #1e1b4b;
              color: #ffffff;
              font-weight: 900;
              font-size: 11px;
              padding: 5px 12px;
              border-radius: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: inline-block;
            }
            .manifest-date {
              font-size: 10px;
              font-weight: 700;
              color: #444444;
              margin-top: 4px;
              text-align: right;
            }
            .vendor-card {
              border: 1.5px solid #000000;
              border-radius: 8px;
              padding: 10px 14px;
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              background: #ffffff;
            }
            .vendor-tag {
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              color: #555555;
              margin-bottom: 3px;
            }
            .vendor-title {
              font-size: 15px;
              font-weight: 900;
              text-transform: uppercase;
              color: #000000;
              margin-bottom: 2px;
            }
            .vendor-sub {
              font-size: 10px;
              color: #222222;
              line-height: 1.3;
            }
            .vendor-meta {
              text-align: right;
              font-size: 10px;
              font-family: monospace;
              font-weight: 700;
            }
            .alert-banner {
              background: #fffbeb;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 8px 12px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9.5px;
              font-weight: 800;
              color: #b45309;
            }
            .confidential-pill {
              background: #fef3c7;
              color: #92400e;
              font-size: 8.5px;
              padding: 2px 8px;
              border-radius: 4px;
              text-transform: uppercase;
              border: 1px solid #fde68a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              border: 1.5px solid #000000;
            }
            th {
              background: #1e1b4b;
              color: #ffffff;
              font-size: 9.5px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 8px 6px;
              border: 1px solid #000000;
              text-align: left;
            }
            td {
              font-size: 10.5px;
              vertical-align: top;
            }
            .signatures-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 16px;
              margin-top: 36px;
              padding-top: 10px;
            }
            .sig-box {
              border-top: 1px solid #000000;
              text-align: center;
              padding-top: 6px;
            }
            .sig-label {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
            }
            .sig-subtext {
              font-size: 9px;
              color: #666666;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="manifest-container">
            <!-- HEADER -->
            <div class="header-row">
              <div>
                <div class="company-name">${companyDetails.companyLegalName}</div>
                <div class="company-address">${fullCompanyAddress}</div>
                <div class="company-address"><strong>Phone:</strong> ${companyPhoneStr} | <strong>GSTIN:</strong> ${companyGstinStr}</div>
              </div>
              <div>
                <div class="badge-manifest">CONSOLIDATED DISPATCH MANIFEST</div>
                <div class="manifest-date">Date: ${manifestDateFormatted}</div>
              </div>
            </div>

            <!-- RECIPIENT LAB VENDOR CARD -->
            <div class="vendor-card">
              <div>
                <div class="vendor-tag">RECIPIENT LAB VENDOR:</div>
                <div class="vendor-title">${currentVendorObj.companyName}</div>
                <div class="vendor-sub"><strong>Attn:</strong> ${currentVendorObj.contactPerson || currentVendorObj.companyName} (Phone: ${currentVendorObj.phone})</div>
                <div class="vendor-sub">${currentVendorObj.fullAddress || 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur, India, Rajasthan, Local, Rajasthan'}</div>
              </div>
              <div class="vendor-meta">
                <div>Vendor ID: <strong>${currentVendorObj.code || 'OVE-1001'}</strong></div>
                <div>GSTIN: <strong>${currentVendorObj.gstin || 'N/A'}</strong></div>
                <div style="margin-top: 4px; color: #1e1b4b; font-weight: 900;">Total Selected Items: ${printableBatchVouchers.length} Job(s) Selected</div>
              </div>
            </div>

            <!-- CAUTION / DISCLAIMER ALERT BANNER -->
            <div class="alert-banner">
              <div>⚠️ REPAIR SERVICE MANIFEST (PARTS & TECHNICAL SPECIFICATIONS ONLY - NO CUSTOMER DATA INCLUDED)</div>
              <div class="confidential-pill">CONFIDENTIAL DISPATCH</div>
            </div>

            <!-- MANIFEST TABLE -->
            <table>
              <thead>
                <tr>
                  <th style="width: 4%; text-align: center;">#</th>
                  <th style="width: 14%;">OUTSOURCE ID</th>
                  <th style="width: 11%;">TICKET REF</th>
                  <th style="width: 25%;">DEVICE SPECS / CATEGORY</th>
                  <th style="width: 14%;">IMEI / SERIAL NO</th>
                  <th style="width: 22%;">REQUESTED SERVICE & FAULT DESCRIPTION</th>
                  <th style="width: 10%;">ENCLOSED PARTS / SPECS</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <!-- SIGNATURE BLOCKS -->
            <div class="signatures-grid">
              <div class="sig-box">
                <div class="sig-label">Dispatched By (Staff)</div>
                <div class="sig-subtext">${companyDetails.companyLegalName} ERP</div>
              </div>
              <div class="sig-box">
                <div class="sig-label">Lab Receiver Signature</div>
                <div class="sig-subtext">${currentVendorObj.companyName}</div>
              </div>
              <div class="sig-box">
                <div class="sig-label">Authorized Signatory</div>
                <div class="sig-subtext">For ${companyDetails.companyLegalName} Pvt Ltd</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-purple-400" />
            OUTSOURCED SERVICE & REPAIR DESK<span className="text-purple-400">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Manage 3rd-party lab dispatches, courier dockets, cost ledgers, A5 shipping labels & batch manifests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncStatusMsg && (
            <span className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg animate-fade-in font-medium">
              {syncStatusMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncingCloud}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            title="Force refresh data directly from Supabase Cloud Database"
          >
            <RotateCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{isSyncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          {/* BATCH PRINT BUTTON */}
          <button
            onClick={() => setShowBatchPrintModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Batch Print Manifest
          </button>

          {/* CREATE OUTSOURCE VOUCHER BUTTON */}
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Create Outsource Voucher
          </button>
        </div>
      </div>

      {/* Toolbar & Filter Pills */}
      <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Voucher #, Ticket #, Vendor, Courier Docket #..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
          />
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['all', 'SHIPPED', 'IN_REPAIR', 'RETURNED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all ${
                activeFilter === status
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* OUTSOURCE VOUCHERS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVouchers.map((v) => {
          const linkedTicket = tickets.find((t) => t.ticket_number === v.linkedTicketNumber);
          const totalFreight = (v.outgoingFreightCost || 0) + (v.incomingFreightCost || 0) || v.freightCharges || 0;

          return (
            <div
              key={v.id}
              className="glass-panel p-5 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-purple-400 text-sm">{v.voucherNumber}</span>
                    <span className="text-[10px] text-white/40 font-mono">Date: <strong className="text-white">{v.voucherDate || v.outgoingDispatchDate}</strong></span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      v.dispatchStatus === 'COMPLETED'
                        ? 'bg-[#16FFC6]/10 text-[#16FFC6] border border-[#16FFC6]/20'
                        : v.dispatchStatus === 'RETURNED'
                        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                        : v.dispatchStatus === 'SHIPPED'
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : 'bg-purple-400/10 text-purple-400 border border-purple-400/20'
                    }`}
                  >
                    {v.dispatchStatus}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-300 font-bold uppercase block">{v.serviceType}</span>
                    <span className="text-[10px] font-mono text-[#5ED29C] font-bold">Ticket: {v.linkedTicketNumber}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{v.vendorName}</h3>
                  <p className="text-xs text-white/60 flex items-center gap-1 font-mono">{v.vendorPhone} | Station: {v.vendorCity}</p>
                  {linkedTicket && (
                    <p className="text-[11px] text-white/50 italic">
                      Device: {linkedTicket.brand} {linkedTicket.model || linkedTicket.device_type} (S/N: {linkedTicket.serial_or_imei || 'N/A'})
                    </p>
                  )}
                </div>

                {/* Point 2: Outgoing & Incoming Courier Details */}
                <div className="mt-3 p-3 rounded-xl bg-white/5 space-y-2 text-xs border border-white/5 font-mono">
                  {/* Outgoing Courier */}
                  <div className="space-y-1 border-b border-white/10 pb-1.5">
                    <div className="text-[10px] text-[#16FFC6] font-bold uppercase flex items-center justify-between">
                      <span>1. Outgoing Courier</span>
                      <span>₹{v.outgoingFreightCost || 0}</span>
                    </div>
                    <div className="flex justify-between text-white/70 text-[11px]">
                      <span>Courier / Docket:</span>
                      <span className="text-white font-bold">{v.outgoingCourier} ({v.outgoingDocket})</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-[10px]">
                      <span>Dispatch Date:</span>
                      <span>{v.outgoingDispatchDate}</span>
                    </div>
                  </div>

                  {/* Incoming Courier */}
                  <div className="space-y-1 pt-0.5">
                    <div className="text-[10px] text-amber-300 font-bold uppercase flex items-center justify-between">
                      <span>2. Return / Incoming Courier</span>
                      <span>₹{v.incomingFreightCost || 0}</span>
                    </div>
                    <div className="flex justify-between text-white/70 text-[11px]">
                      <span>Courier / Docket:</span>
                      <span className="text-white font-bold">{v.incomingCourier || 'Pending Return'} {v.incomingDocket ? `(${v.incomingDocket})` : ''}</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-[10px]">
                      <span>Return / Exp Date:</span>
                      <span>{v.incomingDispatchDate || v.expectedReturnDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Point 4: Outsource Job Detailed Description */}
                {v.technicalInstructions && (
                  <div className="mt-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-white/70 italic">
                    <strong className="text-purple-300 font-bold not-italic block text-[10px] uppercase">Outsource Job Description:</strong>
                    "{v.technicalInstructions}"
                  </div>
                )}

                {/* Financial Ledger */}
                <div className="mt-3 p-3 rounded-xl bg-[#0D1117] border border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Vendor Cost Price:</span>
                    <span className="font-mono text-white">₹{v.vendorCostPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Total Freight (Out + In):</span>
                    <span className="font-mono text-white">₹{totalFreight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Customer Selling Price:</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{v.customerSellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 text-xs font-black">
                    <span className="text-purple-300">Net Profit Margin:</span>
                    <span className="font-mono text-[#16FFC6]">₹{v.profitMargin.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS: MODIFY, DELETE, PRINT SERVICE ORDER, PRINT SHIPPING LABEL */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  {/* Status Dropdown */}
                  <select
                    value={v.dispatchStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      updateOutsourceVoucher(v.id, { dispatchStatus: newStatus });
                      pushOutsourceVoucherToSupabase({ ...v, dispatchStatus: newStatus }).catch(() => {});
                    }}
                    className="p-1.5 rounded-lg bg-[#0D1117] border border-purple-500/30 text-white font-bold text-[10px]"
                  >
                    <option value="SHIPPED">SHIPPED VIA COURIER</option>
                    <option value="IN_REPAIR">IN REPAIR AT LAB</option>
                    <option value="RETURNED">RETURNED FROM LAB</option>
                    <option value="COMPLETED">COMPLETED & VERIFIED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <div className="flex items-center gap-1">
                    {/* MODIFY BUTTON */}
                    <button
                      onClick={() => handleOpenEditModal(v)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition-all"
                      title="Modify Outsource Voucher"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete Outsource Voucher ${v.voucherNumber}?`)) {
                          deleteOutsourceVoucher(v.id);
                          deleteOutsourceVoucherFromSupabase(v.id).catch(() => {});
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all"
                      title="Delete Outsource Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {/* PRINT OUTSOURCE SERVICE ORDER (MATCHES USER IMAGE 1) */}
                  <button
                    onClick={() => handlePrintOutsourceOrder(v)}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md"
                  >
                    <Printer className="w-3 h-3" /> Print Service Order
                  </button>

                  {/* PRINT A5 SHIPPING LABEL */}
                  <button
                    onClick={() => {
                      setSelectedVoucher(v);
                      setShowShippingLabelModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#16FFC6]/10 hover:bg-[#16FFC6] text-[#16FFC6] hover:text-[#070B0A] font-extrabold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 border border-[#16FFC6]/30"
                  >
                    <Tag className="w-3 h-3" /> Shipping Label
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / MODIFY OUTSOURCE VOUCHER MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
              <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-400" />
                {isEditMode ? `MODIFY OUTSOURCE DISPATCH VOUCHER (${voucherForm.voucherNumber})` : `CREATE OUTSOURCE DISPATCH VOUCHER`}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVoucherForm} className="space-y-6 text-xs">
              {/* BACK-DATED VOUCHER DATE & OUTSOURCE ID */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block border-b border-purple-500/20 pb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Voucher Date & Outsource ID (Allows Back-dated Entries)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Outsource Voucher Date *</label>
                    <input
                      type="date"
                      required
                      value={voucherForm.voucherDate}
                      onChange={(e) => setVoucherForm({ ...voucherForm, voucherDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-purple-500/40 text-white font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Outsource ID / Voucher Number *</label>
                    <input
                      type="text"
                      required
                      value={voucherForm.voucherNumber}
                      onChange={(e) => setVoucherForm({ ...voucherForm, voucherNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. OUT-1001"
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-purple-500/40 text-white font-mono font-bold uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* POINT 1: INTERNAL REPAIR LINKAGE & VENDOR SELECTION */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block border-b border-purple-400/20 pb-1">
                  1. Internal Repair Linkage & External Vendor Selection
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Linked Repair Ticket *</label>
                    <select
                      value={voucherForm.linkedTicketNumber}
                      onChange={(e) => setVoucherForm({ ...voucherForm, linkedTicketNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                    >
                      {tickets.map((t) => (
                        <option key={t.id} value={t.ticket_number}>
                          {t.ticket_number} - {t.customer_name} ({t.brand} {t.model || t.device_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Assigned External Vendor *</label>
                    <select
                      value={voucherForm.vendorId}
                      onChange={(e) => setVoucherForm({ ...voucherForm, vendorId: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.companyName} ({v.vendorType}) - {v.station}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Service Type *</label>
                    <select
                      value={voucherForm.serviceType}
                      onChange={(e) => setVoucherForm({ ...voucherForm, serviceType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold"
                    >
                      {outsourceRules.outsource_service_types.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* POINT 2: OUTGOING COURIER DETAILS */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-[#16FFC6] uppercase tracking-wider block border-b border-[#16FFC6]/20 pb-1">
                  2. Outgoing Courier & Docket Tracking (To Vendor Lab)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Courier Company *</label>
                    <input
                      type="text"
                      required
                      value={voucherForm.outgoingCourier}
                      onChange={(e) => setVoucherForm({ ...voucherForm, outgoingCourier: e.target.value })}
                      placeholder="Bluedart / DTDC / Speedpost"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Docket / Tracking No *</label>
                    <input
                      type="text"
                      required
                      value={voucherForm.outgoingDocket}
                      onChange={(e) => setVoucherForm({ ...voucherForm, outgoingDocket: e.target.value })}
                      placeholder="BLU-88776655"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-[#16FFC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Dispatch Date</label>
                    <input
                      type="date"
                      value={voucherForm.outgoingDispatchDate}
                      onChange={(e) => setVoucherForm({ ...voucherForm, outgoingDispatchDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Freight Cost (₹)</label>
                    <input
                      type="number"
                      value={voucherForm.outgoingFreightCost}
                      onChange={(e) => setVoucherForm({ ...voucherForm, outgoingFreightCost: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* POINT 2: INCOMING COURIER DETAILS */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block border-b border-amber-300/20 pb-1">
                  2 (Return). Incoming Courier & Return Docket Tracking (From Vendor Lab)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Return Courier Company</label>
                    <input
                      type="text"
                      value={voucherForm.incomingCourier}
                      onChange={(e) => setVoucherForm({ ...voucherForm, incomingCourier: e.target.value })}
                      placeholder="DTDC / Bluedart Return"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Return Docket / Tracking No</label>
                    <input
                      type="text"
                      value={voucherForm.incomingDocket}
                      onChange={(e) => setVoucherForm({ ...voucherForm, incomingDocket: e.target.value })}
                      placeholder="DTD-998877"
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Return Dispatch / Recv Date</label>
                    <input
                      type="date"
                      value={voucherForm.incomingDispatchDate}
                      onChange={(e) => setVoucherForm({ ...voucherForm, incomingDispatchDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Return Freight Cost (₹)</label>
                    <input
                      type="number"
                      value={voucherForm.incomingFreightCost}
                      onChange={(e) => setVoucherForm({ ...voucherForm, incomingFreightCost: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* POINT 4: OUTSOURCE STATUS & DETAILED DESCRIPTION */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block border-b border-emerald-400/20 pb-1">
                  4. Outsource Status & Outsource Job Detailed Description
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Outsource Status *</label>
                    <select
                      value={voucherForm.dispatchStatus}
                      onChange={(e) => setVoucherForm({ ...voucherForm, dispatchStatus: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-emerald-500/40 text-emerald-400 font-bold"
                    >
                      <option value="SHIPPED">SHIPPED VIA COURIER</option>
                      <option value="IN_REPAIR">IN REPAIR AT LAB</option>
                      <option value="RETURNED">RETURNED FROM LAB</option>
                      <option value="COMPLETED">COMPLETED & VERIFIED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Vendor Cost Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={voucherForm.vendorCostPrice}
                      onChange={(e) => setVoucherForm({ ...voucherForm, vendorCostPrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-bold">Customer Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={voucherForm.customerSellingPrice}
                      onChange={(e) => setVoucherForm({ ...voucherForm, customerSellingPrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-emerald-400 font-mono font-bold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Outsource Job Detailed Description / Lab Work Report</label>
                  <textarea
                    rows={3}
                    value={voucherForm.technicalInstructions}
                    onChange={(e) => setVoucherForm({ ...voucherForm, technicalInstructions: e.target.value })}
                    placeholder="Enter detailed technical fault description, lab instructions, components replaced, cleanroom head swap notes..."
                    className="w-full p-3 rounded-xl bg-[#0D1117] border border-white/10 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-[#0D1117] border border-purple-500/30 flex items-center justify-between text-xs font-black">
                  <span className="text-purple-300 uppercase">Calculated Net Profit Margin:</span>
                  <span className="font-mono text-[#16FFC6] text-sm">
                    ₹{(Number(voucherForm.customerSellingPrice) - (Number(voucherForm.vendorCostPrice) + (Number(voucherForm.outgoingFreightCost) + Number(voucherForm.incomingFreightCost)))).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold uppercase tracking-wider shadow-lg shadow-purple-500/20"
                >
                  {isEditMode ? `Save Changes (${voucherForm.voucherNumber})` : `+ Issue Outsource Voucher`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL FOR OUTSOURCE SERVICE ORDER (MATCHES USER IMAGE 1) */}
      {showChallanModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-white space-y-6">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase text-purple-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  OUTSOURCE SERVICE ORDER PRINT PREVIEW
                </h2>
                <p className="text-xs text-white/60">High-fidelity 1:1 printable document preview matching official print layout.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintOutsourceOrder(selectedVoucher)}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" /> Print Outsource Service Order
                </button>
                <button
                  onClick={() => setShowChallanModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER MATCHING IMAGE 1 EXACTLY */}
            <div className="p-6 rounded-2xl bg-white text-black font-sans space-y-4 border-2 border-black shadow-2xl">
              {/* HEADER */}
              <div className="border-b-2 border-black pb-3 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight text-black">{companyDetails.companyLegalName}</h1>
                  <p className="text-[10px] text-gray-700 font-medium mt-0.5">
                    {[companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state].filter(Boolean).join(', ') || '880, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk'}
                  </p>
                  <p className="text-[10px] text-gray-800 font-bold font-mono mt-0.5">
                    Phone: {companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 95877 XXXXX'} | GSTIN: {companyDetails.gstin || '06ABCDE1234F1Z7'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-black text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                    OUTSOURCE SERVICE ORDER
                  </div>
                  <div className="font-mono text-sm font-extrabold mt-1">{selectedVoucher.voucherNumber}</div>
                  <div className="text-[10px] font-bold text-gray-600">Date: {selectedVoucher.voucherDate || selectedVoucher.outgoingDispatchDate}</div>
                </div>
              </div>

              {/* SECTION 1: 2 BOXES */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* LEFT BOX */}
                <div className="border border-black rounded-lg p-3 space-y-1 bg-white">
                  <div className="font-black text-[10px] uppercase text-gray-700 border-b border-gray-300 pb-1 mb-2">DEVICE SPECS & ENCLOSED HARDWARE</div>
                  <div className="flex justify-between"><span className="font-bold">Job Ticket Ref:</span><span className="font-mono font-bold text-purple-900">{selectedVoucher.linkedTicketNumber}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Device Category:</span><span className="font-semibold">{tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.device_type || 'Motherboard'}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Brand & Model:</span><span className="font-bold">{tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber) ? `${tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.brand} ${tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.model}` : 'Gigabyte B450 Aorus Pro WiFi'}</span></div>
                  <div className="flex justify-between"><span className="font-bold">IMEI / Serial No:</span><span className="font-mono">{tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.serial_or_imei || 'SN2401889988112'}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Enclosed Parts / Specs:</span><span>{tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.physicalCondition || 'Motherboard & Assembly Unit Enclosed'}</span></div>
                </div>

                {/* RIGHT BOX */}
                <div className="border border-black rounded-lg p-3 space-y-1 bg-white">
                  <div className="font-black text-[10px] uppercase text-gray-700 border-b border-gray-300 pb-1 mb-2">OUTSOURCING LAB DETAILS</div>
                  <div className="flex justify-between"><span className="font-bold">Lab Partner Company:</span><span className="font-bold text-black">{selectedVoucher.vendorName}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Lab Vendor ID:</span><span className="font-mono">{vendors.find(v=>v.id===selectedVoucher.vendorId)?.code || selectedVoucher.vendorId || 'OVE-1001'}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Lab Contact Person:</span><span className="font-semibold">{vendors.find(v=>v.id===selectedVoucher.vendorId)?.contactPerson || selectedVoucher.vendorName} ({selectedVoucher.vendorPhone})</span></div>
                  <div className="flex justify-between"><span className="font-bold">Lab Ref Job ID:</span><span className="font-mono font-bold">{selectedVoucher.vendorJobId || 'N3V-8162'}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Service Type:</span><span className="font-bold text-purple-900">{selectedVoucher.serviceType}</span></div>
                </div>
              </div>

              {/* SECTION 2: 3 DATES BOXES */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="border border-black rounded-lg p-2">
                  <div className="text-[9px] font-black uppercase text-gray-600">OUTSOURCE DATE</div>
                  <div className="font-mono font-extrabold text-sm">{selectedVoucher.outgoingDispatchDate || selectedVoucher.voucherDate}</div>
                </div>
                <div className="border border-black rounded-lg p-2">
                  <div className="text-[9px] font-black uppercase text-gray-600">EXPECTED RETURN DATE</div>
                  <div className="font-mono font-extrabold text-sm">{selectedVoucher.expectedReturnDate || 'N/A'}</div>
                </div>
                <div className="border border-black rounded-lg p-2">
                  <div className="text-[9px] font-black uppercase text-gray-600">RECEIVED RETURN DATE</div>
                  <div className="font-mono font-extrabold text-sm">{selectedVoucher.incomingDispatchDate || selectedVoucher.receivedDate || 'N/A'}</div>
                </div>
              </div>

              {/* SECTION 3: REPAIR WORK DESCRIPTION */}
              <div className="border border-black rounded-lg p-3 text-xs space-y-1">
                <div className="font-black text-[10px] uppercase text-gray-700 border-b border-gray-300 pb-1">REPAIR WORK DESCRIPTION & SPECIFICATIONS</div>
                <div className="font-semibold italic text-gray-900 pt-1">{selectedVoucher.technicalInstructions || 'With Processor Ryzen 5 3600 / Level-4 BGA Micro-soldering Work.'}</div>
              </div>

              {/* SECTION 4: FINANCIAL TABLE */}
              <table className="w-full text-left text-xs border-collapse border border-black rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase font-black text-[10px] border-b border-black">
                    <th className="p-2 border-r border-gray-300">SERVICE DESCRIPTION</th>
                    <th className="p-2 border-r border-gray-300">SERVICE TYPE</th>
                    <th className="p-2 border-r border-gray-300 text-right">COST PRICE (₹)</th>
                    <th className="p-2 border-r border-gray-300 text-right">FREIGHT/SHIPPING (₹)</th>
                    <th className="p-2 text-right">TOTAL AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  <tr>
                    <td className="p-2 border-r border-gray-300 font-sans font-bold">Outsource Labor & Component Repair Charge</td>
                    <td className="p-2 border-r border-gray-300 font-sans font-semibold">{selectedVoucher.serviceType}</td>
                    <td className="p-2 border-r border-gray-300 text-right font-bold">₹{selectedVoucher.vendorCostPrice.toLocaleString()}</td>
                    <td className="p-2 border-r border-gray-300 text-right font-bold">₹{((selectedVoucher.outgoingFreightCost || 0) + (selectedVoucher.incomingFreightCost || 0) || selectedVoucher.freightCharges || 0).toLocaleString()}</td>
                    <td className="p-2 text-right font-black text-black">₹{(selectedVoucher.vendorCostPrice + ((selectedVoucher.outgoingFreightCost || 0) + (selectedVoucher.incomingFreightCost || 0) || selectedVoucher.freightCharges || 0)).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* SECTION 5: SIGNATURES */}
              <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs font-sans">
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Dispatched By (Staff)</div>
                  <div className="text-[9px] text-gray-600">{companyDetails.companyLegalName} ERP</div>
                </div>
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Lab Receiver Signature</div>
                  <div className="text-[9px] text-gray-600">{selectedVoucher.vendorName}</div>
                </div>
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Authorized Signatory</div>
                  <div className="text-[9px] text-gray-600">For {companyDetails.companyLegalName} Pvt Ltd</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE A5 SHIPPING LABEL MODAL (WITH OPTIONAL REFERENCE PRINT TOGGLE) */}
      {showShippingLabelModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 w-full max-w-xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
              <div>
                <h2 className="text-base font-black uppercase text-[#16FFC6] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#16FFC6]" />
                  A5 OUTSOURCE SHIPPING LABEL PREVIEW
                </h2>
                <p className="text-[11px] text-white/60">Pre-configured for A5 page print size (Shipper & Consignee details)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintShippingLabel(selectedVoucher, includeShippingReference)}
                  className="px-4 py-2 rounded-xl bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs flex items-center gap-1.5 shadow-lg uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" /> Print A5 Label
                </button>
                <button
                  onClick={() => setShowShippingLabelModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* REFERENCE OPTION TOGGLE BAR */}
            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-white select-none">
                <input
                  type="checkbox"
                  checked={includeShippingReference}
                  onChange={(e) => setIncludeShippingReference(e.target.checked)}
                  className="w-4 h-4 rounded border-purple-500 text-purple-600 focus:ring-purple-500 accent-purple-500 cursor-pointer"
                />
                <span className="text-purple-300">Include Dispatch Reference Box (Outsource ID, Ticket #, Device & Service Details)</span>
              </label>
            </div>

            {/* PRINTABLE A5 CONTAINER MOCK */}
            <div className="p-6 rounded-2xl bg-white text-black font-sans space-y-4 border-2 border-black shadow-2xl">
              {/* TOP BANNER */}
              <div className="border-b-2 border-black pb-3 flex justify-between items-start">
                <div>
                  <div className="text-sm font-black uppercase tracking-tight text-black">PARCEL & COURIER SHIPPING LABEL</div>
                  <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-0.5">OUTSOURCING & LOGISTICS DISPATCH</div>
                </div>
                <div>
                  <span className="bg-black text-white font-black text-[9px] px-2.5 py-1 rounded uppercase tracking-wider">A5 FORMAT</span>
                </div>
              </div>

              {/* BOX 1: TO (RECIPIENT / LAB VENDOR) */}
              <div className="border-1.5 border-black rounded-xl p-3 bg-white space-y-1 border border-black">
                <div className="text-[9px] font-black text-gray-600 uppercase border-b border-gray-300 pb-1 mb-2">TO (RECIPIENT / LAB VENDOR):</div>
                <div className="text-base font-black uppercase text-black">{selectedVoucher.vendorName}</div>
                <div className="text-xs font-semibold text-gray-800">
                  {vendors.find(v=>v.id===selectedVoucher.vendorId)?.fullAddress || selectedVoucher.vendorAddress || 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur, India, Rajasthan'}
                </div>
                <div className="text-xs text-gray-700 font-bold">{selectedVoucher.vendorCity || 'Local, Rajasthan'}</div>
                <div className="text-xs font-mono font-bold text-black pt-1">Primary Phone: {selectedVoucher.vendorPhone}</div>
              </div>

              {/* BOX 2: FROM (SENDER DETAILS / COMPANY) */}
              <div className="border-1.5 border-black rounded-xl p-3 bg-white space-y-1 border border-black">
                <div className="text-[9px] font-black text-gray-600 uppercase border-b border-gray-300 pb-1 mb-2">FROM (SENDER DETAILS / COMPANY):</div>
                <div className="text-sm font-black uppercase text-black">{companyDetails.companyLegalName}</div>
                <div className="text-xs font-semibold text-gray-800">
                  {[companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state].filter(Boolean).join(', ') || '#80, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk, SANCHORE, Rajasthan, Pincode: 343041'}
                </div>
                <div className="text-xs font-mono font-bold text-black pt-1">
                  Phone: {companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 98765 43210'} | GSTIN: {companyDetails.gstin || '08AABCC1234F1Z0'}
                </div>
              </div>

              {/* OPTIONAL BOX 3: DISPATCH REFERENCE */}
              {includeShippingReference && (
                <div className="border-1.5 border-black rounded-xl p-3 bg-white border border-black space-y-2">
                  <div className="text-[9px] font-black text-gray-600 uppercase border-b border-gray-300 pb-1">DISPATCH REFERENCE:</div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="mb-1"><span className="text-gray-600 font-bold">Outsource ID:</span> <strong className="font-mono text-black">{selectedVoucher.voucherNumber}</strong></div>
                      <div><span className="text-gray-600 font-bold">Device:</span> <strong className="text-black">{tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber) ? `${tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.brand} ${tickets.find(t=>t.ticket_number===selectedVoucher.linkedTicketNumber)?.model}` : 'Gigabyte B450 Aorus Pro WiFi'}</strong></div>
                    </div>
                    <div>
                      <div className="mb-1"><span className="text-gray-600 font-bold">Ticket #:</span> <strong className="font-mono text-purple-900">{selectedVoucher.linkedTicketNumber}</strong></div>
                      <div><span className="text-gray-600 font-bold">Service:</span> <strong className="text-black">{selectedVoucher.serviceType}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER BAR */}
              <div className="border-t-2 border-black pt-3 flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white font-black px-2.5 py-0.5 rounded-full text-[9px] uppercase">FRAGILE - HANDLE WITH CARE</span>
                  <span className="font-bold text-gray-800 text-[9px]">Precision Electronic Equipment / Repair Shipment</span>
                </div>
                <div className="text-right font-mono font-bold text-gray-700">
                  <div>Date: {selectedVoucher.voucherDate || selectedVoucher.outgoingDispatchDate}</div>
                  {includeShippingReference && <div>Ref: {selectedVoucher.voucherNumber}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH PRINT MANIFEST MODAL (A4 PAGE PRINT WITH LAB VENDOR & DATE FILTERING) */}
      {showBatchPrintModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 w-full max-w-5xl max-h-[90vh] overflow-y-auto text-white space-y-6">
            
            {/* MODAL TOP HEADER WITH VENDOR & DATE FILTERS */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/30 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase text-purple-300 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  Consolidated Outsource Dispatch Manifest (Batch Print)
                </h2>
                <p className="text-xs text-white/60">Combines all repair tickets sent to a single lab vendor onto one printable manifest.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* VENDOR SELECTOR */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-purple-300">Lab Vendor:</label>
                  <select
                    value={selectedBatchVendorId}
                    onChange={(e) => setSelectedBatchVendorId(e.target.value)}
                    className="p-2 rounded-xl bg-[#0D1117] border border-purple-500/40 text-white font-bold text-xs"
                  >
                    <option value="all">ALL VENDORS (CONSOLIDATED DISPATCH)</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.companyName} ({v.contactPerson || v.companyName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* DISPATCH DATE SELECTOR */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Dispatch Date:
                  </label>
                  <select
                    value={selectedBatchDate}
                    onChange={(e) => setSelectedBatchDate(e.target.value)}
                    className="p-2 rounded-xl bg-[#0D1117] border border-purple-500/40 text-white font-bold text-xs font-mono"
                  >
                    <option value="all">ALL DATES (CONSOLIDATED)</option>
                    {uniqueBatchDates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={selectedBatchDate === 'all' ? '' : selectedBatchDate}
                    onChange={(e) => setSelectedBatchDate(e.target.value || 'all')}
                    title="Select custom date"
                    className="p-1.5 rounded-xl bg-[#0D1117] border border-purple-500/40 text-white font-bold text-xs font-mono"
                  />
                  {selectedBatchDate !== 'all' && (
                    <button
                      onClick={() => setSelectedBatchDate('all')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white/80"
                    >
                      Reset Date
                    </button>
                  )}
                </div>

                {/* PRINT MANIFEST BUTTON */}
                <button
                  onClick={handlePrintBatchManifest}
                  disabled={printableBatchVouchers.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 uppercase tracking-wider transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Manifest
                </button>

                <button
                  onClick={() => setShowBatchPrintModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SELECTION CONTROL TOOLBAR (IMAGE 4) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white/70">Select Outsource IDs To Print:</span>
                <button
                  onClick={handleSelectShippedOnlyBatch}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all"
                >
                  Select SHIPPED-Only ({availableBatchVouchers.filter(v=>v.dispatchStatus==='SHIPPED').length})
                </button>
                <button
                  onClick={handleSelectAllBatch}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all"
                >
                  Select All ({availableBatchVouchers.length})
                </button>
                <button
                  onClick={handleDeselectAllBatch}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-bold text-[11px] transition-all"
                >
                  Deselect All
                </button>
              </div>

              <div className="font-mono text-purple-300 font-bold">
                {printableBatchVouchers.length} of {availableBatchVouchers.length} Jobs Checked {selectedBatchDate !== 'all' ? `(For Date: ${selectedBatchDate})` : ''}
              </div>
            </div>

            {/* PRINTABLE BATCH MANIFEST DOCUMENT CONTAINER (MATCHES IMAGE 4 & 5 EXACTLY) */}
            <div className="p-6 rounded-2xl bg-white text-black font-sans space-y-4 border-2 border-black shadow-2xl">
              
              {/* MAIN HEADER */}
              <div className="border-b-2 border-black pb-3 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black uppercase text-black tracking-tight">{companyDetails.companyLegalName}</h1>
                  <p className="text-[10px] text-gray-700 font-medium mt-0.5">
                    {[companyDetails.addressLine1, companyDetails.addressLine2, companyDetails.city, companyDetails.state].filter(Boolean).join(', ') || '480, Above Vijay Laxmi Medical Agency, Choudhary Dharamshala, Indira Chowk'}
                  </p>
                  <p className="text-[10px] text-gray-800 font-bold font-mono mt-0.5">
                    Phone: {companyDetails.phoneNumber || companyDetails.alternateNumber || '+91 95877 81166'} | GSTIN: {companyDetails.gstin || '08CAUPK8462J1ZT'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-[#1e1b4b] text-white font-black text-xs px-3 py-1 rounded uppercase tracking-wider inline-block">
                    CONSOLIDATED DISPATCH MANIFEST
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 mt-1">Date: {getManifestDisplayDate()}</div>
                </div>
              </div>

              {/* RECIPIENT LAB VENDOR CARD */}
              {(() => {
                const currentVendorObj = vendors.find((v) => v.id === selectedBatchVendorId) || vendors[0] || {
                  companyName: 'Nivial Hardware Solution',
                  contactPerson: 'Nivial Hardware Solution',
                  phone: '9460530006',
                  fullAddress: 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur, India, Rajasthan, Local, Rajasthan',
                  code: 'OVE-1001',
                  gstin: 'N/A',
                };
                return (
                  <div className="border-1.5 border-black rounded-xl p-3 bg-white border border-black flex justify-between items-start text-xs">
                    <div>
                      <div className="text-[9px] font-black text-gray-500 uppercase">RECIPIENT LAB VENDOR:</div>
                      <div className="text-base font-black uppercase text-black">{currentVendorObj.companyName}</div>
                      <div className="text-[11px] text-gray-800 font-bold">Attn: {currentVendorObj.contactPerson || currentVendorObj.companyName} (Phone: {currentVendorObj.phone})</div>
                      <div className="text-[10px] text-gray-700">{currentVendorObj.fullAddress || 'S-6, 2ND FLOOR, KASTURI PLAZA, BOMBAY MOTOR CIRCLE, Jodhpur'}</div>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <div>Vendor ID: <strong className="text-black">{currentVendorObj.code || 'OVE-1001'}</strong></div>
                      <div>GSTIN: <strong className="text-black">{currentVendorObj.gstin || 'N/A'}</strong></div>
                      <div className="mt-1 text-purple-950 font-black text-xs">Total Selected Items: {printableBatchVouchers.length} Job(s) Selected</div>
                    </div>
                  </div>
                );
              })()}

              {/* CAUTION / DISCLAIMER ALERT BANNER */}
              <div className="bg-[#fffbeb] border border-[#f59e0b] rounded-lg p-2.5 flex justify-between items-center text-[10px] font-bold text-[#b45309]">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#d97706]" />
                  REPAIR SERVICE MANIFEST (PARTS & TECHNICAL SPECIFICATIONS ONLY - NO CUSTOMER DATA INCLUDED)
                </div>
                <span className="bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded text-[8.5px] uppercase border border-[#fde68a]">
                  CONFIDENTIAL DISPATCH
                </span>
              </div>

              {/* MANIFEST TABLE (IMAGE 4 & 5 MATCH) */}
              <table className="w-full text-left text-xs border-collapse border-1.5 border-black border">
                <thead>
                  <tr className="bg-[#1e1b4b] text-white uppercase font-black text-[9.5px]">
                    <th className="p-2 border border-black text-center w-8">PRINT</th>
                    <th className="p-2 border border-black text-center w-8">#</th>
                    <th className="p-2 border border-black">OUTSOURCE ID</th>
                    <th className="p-2 border border-black">TICKET REF</th>
                    <th className="p-2 border border-black">DEVICE SPECS / CATEGORY</th>
                    <th className="p-2 border border-black">IMEI / SERIAL NO</th>
                    <th className="p-2 border border-black">REQUESTED SERVICE & FAULT DESCRIPTION</th>
                    <th className="p-2 border border-black">ENCLOSED PARTS / SPECS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 font-sans text-[10.5px]">
                  {availableBatchVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-500 font-bold italic">
                        No outsourced repair tickets found for the selected Lab Vendor and Date ({selectedBatchDate}).
                      </td>
                    </tr>
                  ) : (
                    availableBatchVouchers.map((v, idx) => {
                      const ticketObj = tickets.find((t) => t.ticket_number === v.linkedTicketNumber);
                      const isChecked = selectedVoucherIds.has(v.id);
                      const problemDesc = ticketObj?.problem_reported || 'No Display | No Boot Issue';
                      const instructions = v.technicalInstructions || 'With Processor Ryzen 5 3600';
                      const enclosedParts = ticketObj?.physicalCondition || 'Motherboard & Hardware Unit';

                      return (
                        <tr key={v.id} className={isChecked ? 'bg-white' : 'bg-gray-100 opacity-60'}>
                          <td className="p-2 border border-black text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleVoucherSelection(v.id)}
                              className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                            />
                          </td>
                          <td className="p-2 border border-black text-center font-bold">{idx + 1}</td>
                          <td className="p-2 border border-black font-mono font-bold text-purple-950">{v.voucherNumber}</td>
                          <td className="p-2 border border-black font-mono font-bold text-blue-900">{v.linkedTicketNumber}</td>
                          <td className="p-2 border border-black font-bold">
                            {ticketObj ? `${ticketObj.brand} ${ticketObj.model || ticketObj.device_type}` : 'Gigabyte B450 Aorus Pro WiFi'} ({ticketObj?.device_type || 'Motherboard'})
                          </td>
                          <td className="p-2 border border-black font-mono text-[10px]">{ticketObj?.serial_or_imei || 'SN2401889988112'}</td>
                          <td className="p-2 border border-black space-y-1">
                            <div className="font-extrabold text-purple-950 uppercase text-[11px]">{v.serviceType}</div>
                            <div className="bg-[#fffbeb] border border-[#fde68a] rounded p-1 text-[9.5px] font-bold text-[#92400e]">
                              <strong>Fault / Problem:</strong> {problemDesc}
                            </div>
                            <div className="text-[9.5px] text-gray-700 italic">
                              <strong>Instructions:</strong> {instructions}
                            </div>
                          </td>
                          <td className="p-2 border border-black">{enclosedParts}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* SIGNATURE BLOCKS */}
              <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs font-sans">
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Dispatched By (Staff)</div>
                  <div className="text-[9px] text-gray-600">{companyDetails.companyLegalName} ERP</div>
                </div>
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Lab Receiver Signature</div>
                  <div className="text-[9px] text-gray-600">{vendors.find((v)=>v.id===selectedBatchVendorId)?.companyName || 'Nivial Hardware Solution'}</div>
                </div>
                <div className="border-t border-black pt-1">
                  <div className="font-extrabold uppercase text-[10px]">Authorized Signatory</div>
                  <div className="text-[9px] text-gray-600">For {companyDetails.companyLegalName} Pvt Ltd</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
