# ACCNO SOLUTION — Enterprise Website, Repair ERP & Customer Portal

> **Production-Ready Enterprise Web Platform & Repair Business ERP Suite**
> Designed for computer repair, Apple Mac logic board micro-soldering, forensic data recovery, CCTV networking, AMC management, POS counter billing, and customer live ticket tracking.

---

## 🚀 Tech Stack Overview

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, HLS.js, Lucide React
- **State & Data**: Zustand, TanStack Query (v5), React Hook Form, Zod
- **Backend & Database**: Express.js API handlers, Supabase Client + PostgreSQL Database, Normalized Schemas, RLS Policies, Audit Logging
- **Authentication**: JWT Auth with Role-Based Access Control (RBAC: Super Admin, Admin, Manager, Technician, Sales, Accounts, Customer)
- **Deployment**: Hostinger Node.js Hosting via PM2 (`ecosystem.config.js`) and GitHub Actions Automated Workflow (`.github/workflows/deploy.yml`)

---

## 🛠️ Features Included

1. **Premium Dark Website**:
   - Fullscreen HLS streaming video background player (`hls.js`)
   - Desktop 3-line grid overlay & center top SVG cyan/green blur glow
   - Floating Liquid Glass Card with `[ 2025 ]` tag & Instrument Serif typography
   - Interactive Services grid, 4-step Repair Process, Stats, Brands, FAQ Accordion, Footer

2. **Customer Portal**:
   - Live ticket status tracker & visual repair lifecycle timeline
   - Download GST invoices & payment history
   - Approve/Reject quotation estimates
   - AMC contract status & preventive visit scheduler
   - Submit service feedback & rating

3. **Enterprise Business ERP System**:
   - **Executive Dashboard**: Today's Repairs, Revenue, Low Stock alerts, Recent Activity feed
   - **Repair Ticket Desk**: Barcode generation, QR codes, Device specs (Brand, Model, IMEI/Serial), Technician assignment, Printable Digital Job Cards
   - **POS Counter & Billing**: Instant barcode scanning, parts & service items, 18% GST calculation, UPI QR modal, Split payments, Thermal receipt print engine
   - **Inventory & IMEI Manager**: Retail stock vs Service bench parts, low stock thresholds
   - **Customer 360 & GST Profiles**: B2B corporate profiles, GSTIN validation, repair histories
   - **Reports & Analytics**: Financial P&L, GST GSTR-1 summaries, CSV/PDF exports
   - **System Settings**: Business profile setup, API keys (WhatsApp/SMS), Role matrix

---

## 📦 Installation & Setup

1. **Clone repository & install dependencies**:
   ```bash
   git clone https://github.com/your-username/accno-solution-website.git
   cd accno-solution-website
   npm install
   ```

2. **Database Migration**:
   - Open `database/supabase_schema.sql` and run the script in your Supabase PostgreSQL SQL Editor.

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`, etc.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Hostinger Deployment Guide

1. Push your code to GitHub `main` branch.
2. In Hostinger Node.js Web Hosting panel, point the application root to `/public_html/accno-solution`.
3. Set Node.js version to `20.x` or `24.x`.
4. The `.github/workflows/deploy.yml` will automatically build the app and trigger `pm2 reload ecosystem.config.js`.

---

## 📄 License
Licensed under the [MIT License](LICENSE). Copyright © 2025 ACCNO SOLUTION.
