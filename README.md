
# ST Comp Holdings Sdn Bhd - Service Marketplace Platform

A modern, full-stack web application designed for **ST Comp Holdings Sdn Bhd** to facilitate corporate service purchases, specialist management, and order tracking.

This platform connects customers (both registered and guests) with corporate service specialists (e.g., Company Secretaries), allowing for seamless browsing, purchasing, and management of business services like company incorporation.

---

## 🚀 Technology Stack

We use a robust, type-safed, and modern stack to ensure performance, scalability, and developer experience.

### **Frontend**
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type checking.
*   **Styling**: 
    *   [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling.
    *   [Shadcn UI](https://ui.shadcn.com/) for accessible, reusable component primitives (Radix UI based).
    *   [Lucide React](https://lucide.dev/) for beautiful icons.
    *   **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/) for elegant, non-intrusive alerts.

### **Backend**
*   **API**: Next.js Server Actions & API Routes.
*   **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on **Neon Tech** (Serverless Postgres).
*   **ORM**: [Prisma](https://www.prisma.io/) for type-safe database access and schema management.
*   **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) for managing User, Specialist, and Admin identities.
*   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) for storing images (Profile photos, Service images, etc.).

---

## ✨ Key Features

### 1. **Service Marketplace**
*   **Browse Services**: Users can view verified specialists and their service offerings (e.g., "Sdn Bhd Registration").
*   **Service Details**: Comprehensive pages showing price breakdowns, secretary profiles, certifications (MAICSA, SSM), and completion time.
*   **Dynamic Pricing**: Calculates Base Price + Platform Fees automatically.

### 2. **Guest & User Checkout**
*   **Flexible Access**: 
    *   **Registered Users**: One-click purchase using their profile data.
    *   **Guest Users**: Public users can purchase services *without* creating an account by simply providing contact details (Name, Email, Phone).
*   **Order Creation**: Atomic transactions ensure orders and purchase counts are updated reliably.

### 3. **Dashboards**
*   **Customer Dashboard**: View "My Purchases" and track order status.
*   **Specialist/Company Dashboard**: 
    *   **Manage Services**: Create, Edit, and Publish services with a rich editor.
    *   **Client Orders**: View incoming orders from customers (including Guest details) in a dedicated "Sales" tab.
    *   **Analytics**: Track purchase counts and ratings.
*   **Admin Panel**: 
    *   **Verify Specialists**: Approve/Reject company registrations.
    *   **Master Data**: Manage global service offerings and configurations.

### 4. **Modern UI/UX**
*   **Responsive Design**: Mobile-first approach.
*   **Real-time Feedback**: Instant validation and success/error toasts using *Sonner*.
*   **Rich Media**: Drag-and-drop image uploads for profiles and services.

---

## 📂 Project Structure

```bash
.
├── prisma/             # Database Schema & Seeds
│   ├── schema.prisma   # Main DB Schema
│   └── seed.ts         # Initial data seeding script
├── src/
│   ├── app/            # Next.js App Router (Pages & API)
│   │   ├── admin/      # Admin Panel Pages
│   │   ├── dashboard/  # User/Company Dashboard Pages
│   │   ├── services/   # Public Service Marketplace Pages
│   │   └── api/        # Backend API Routes
│   ├── components/     # Reusable UI Components
│   │   ├── ui/         # Shadcn UI Primitives (Button, Input, etc.)
│   │   └── ...
│   ├── context/        # React Context (AuthContext, etc.)
│   ├── firebase/       # Firebase Config
│   └── modules/        # Domain-specific logic
└── public/             # Static Assets
```

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   pnpm (Recommended) or npm
*   A Neon Tech PostgreSQL Database URL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd any-comp-project
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    # Database (Neon Tech)
    DATABASE_URL="postgresql://neondb_owner:..."

    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # ... other firebase keys
    ```

4.  **Database Setup:**
    Sync your Prisma schema with the Neon database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

    *(Optional) Seed initial data:*
    ```bash
    npx prisma db seed
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📝 Key Commands

*   `pnpm dev`: Start dev server.
*   `npx prisma studio`: Open GUI to manage database records.
*   `npx prisma db push`: Sync schema changes to DB.
*   `npx prisma generate`: Update TypeScript client after schema changes.

---

## 🔒 Security & Best Practices

*   **Atomic Transactions**: Critical operations (like placing an order) use Prisma Transactions to prevent data inconsistency.
*   **Type Safety**: Full TypeScript implementation across frontend and backend.
*   **Environment Variables**: Sensitive keys are strictly kept in `.env` and not committed.

---

*Verified & Updated: 2026-02-04*
