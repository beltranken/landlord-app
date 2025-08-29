# 🏠 Apartment Management App – Documentation

## 📌 Overview

The **Apartment Management App** is designed to help landlords and property managers efficiently manage their rental business. It centralizes property information, tenant records, rent collection, and maintenance requests in a single platform.

The goal is to reduce manual work, improve tenant communication, and provide clear insights into the business’s financial health.

---

## ✨ Features

### 1. Properties / Units

- Add and manage buildings, apartments, or individual rooms.
- Track occupancy status: **Vacant**, **Occupied**, **Under Maintenance**.
- Quick view of property details and rental pricing.

### 2. Tenants

- Store tenant information (name, contact, documents).
- Manage lease agreements and rental terms.
- Keep a tenant history (current & past rentals).

### 3. Payments

- Record rent payments, deposits, and other charges.
- Track payment status: **Paid**, **Pending**, **Overdue**.
- Generate invoices and receipts for tenants.

### 4. Maintenance

- Log tenant repair requests or property issues.
- Assign tasks to staff/contractors.
- Update request progress (**New**, **In Progress**, **Completed**).

### 5. Reports & Analytics

- Monthly and yearly income overview.
- Outstanding balances and overdue rent.
- Occupancy rates and financial trends.

---

## 📱 Main Tabs (Navigation)

- **🏠 Properties** – Manage apartments and units.
- **👥 Tenants** – Manage tenant profiles and leases.
- **💵 Payments** – Record and track payments.
- **🛠 Maintenance** – Manage repair requests and property upkeep.
- **📊 Reports** – Business performance insights.

---

## 🔐 User Roles (Optional, if needed)

- **Admin / Landlord** – Full access to all features.
- **Staff / Manager** – Limited access (e.g., maintenance, payments).
- **Tenant (future)** – Tenant portal to view bills, request maintenance.

---

## 🎨 Color Theme

The app uses a **consistent color palette** for branding and usability:

```ts
const Colors = {
  primary: "#3338A0", // Primary brand color
  secondary: "#C59560", // Supporting brand color
  accent: "#FCC61D", // Highlights and important actions
  background: "#F7F7F7", // App background
};
```
