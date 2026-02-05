# ST Comp Holdings Sdn Bhd - Service Marketplace Platform

A modern, full-stack web application designed for **ST Comp Holdings Sdn Bhd** to facilitate corporate service purchases, specialist management, and order tracking.

This platform connects customers (both registered and guests) with corporate service specialists (e.g., Company Secretaries), allowing for seamless browsing, purchasing, and management of business services like company incorporation.

---

## 🚀 Technology Stack

We use a robust, type-safed, and modern stack to ensure performance, scalability, and developer experience.

### **Frontend**
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type checking.
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global client-state management (Orders, Services).
*   **Styling**: 
    *   [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling.
    *   [Shadcn UI](https://ui.shadcn.com/) for accessible, reusable component primitives (Radix UI based).
    *   [Lucide React](https://lucide.dev/) for beautiful icons.
    *   **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/) for elegant, non-intrusive alerts.

### **Backend**
*   **API**: Next.js API Routes (App Router).
*   **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on **Neon Tech** (Serverless Postgres).
*   **ORM**: [TypeORM](https://typeorm.io/) for advanced relationship management and database interaction (Recently migrated from Prisma).
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js) / Custom Auth implementation.
*   **Storage**: **Local Storage** for storing images (Profile photos, Service images, etc.) within the `public/uploads` directory.

---

## ✨ Key Features

### 1. **Service Marketplace**
*   **Browse Services**: Users can view verified specialists and their service offerings (e.g., "Sdn Bhd Registration").
*   **Service Details**: Comprehensive pages showing price breakdowns, secretary profiles, certifications (MAICSA, SSM), and completion time.
*   **Dynamic Pricing**: Calculates Base Price + Platform Fees automatically (Base Price + 30%).
*   **Additional Offerings**: Integrated logic to fetch and display optional service add-ons.

### 2. **Ordering & Transactions**
*   **Guest Checkout**: Allows users to purchase services without creating an account by providing Name, Email, and Phone.
*   **Registered Purchase**: Logged-in users can buy services linked directly to their profile.
*   **Order Workflow**:
    1.  User selects a service.
    2.  Fills in details (or auto-filled for logged-in users).
    3.  Confirm Order.
    4.  Order is created (`PENDING`) and `purchase_count` for the Specialist is incremented.

### 3. **Admin Dashboard**
*   **Order Management**: 
    *   View all orders (Guest & Registered).
    *   Filter orders by ID, Customer Name, or Email.
    *   **Status Update**: Admins can update order status (PENDING -> PAID -> COMPLETED) directly from the table.
    *   Detailed view of customer info (Name, Email, Phone).
*   **Service Management**:
    *   Create, Edit, and Publish Specialist Services.
    *   Approve/Reject services.
    *   Manage rich media (Images) and Certifications.
*   **Sales Tracking**: Real-time sales counts displayed on service cards.

### 4. **User Dashboard**
*   **My Orders**: Users can see their own purchase history.
*   **Profile Management**: Update user details.

---

## 📂 Project Structure

```bash
.
├── src/
│   ├── app/            # Next.js App Router (Pages & API)
│   │   ├── admin/      # Admin Panel (Orders, Specialists, Clients)
│   │   ├── dashboard/  # User Dashboard
│   │   ├── services/   # Public Service Pages ([slug])
│   │   └── api/        # Backend API Routes (RESTful endpoints)
│   ├── entities/       # TypeORM Entities (DB Schema Definitions)
│   ├── modules/        # Domain Logic (Controllers, Services)
│   │   ├── order/      # Order creation, fetching, updating logic
│   │   ├── specialist/ # Service management logic
│   │   └── ...
│   ├── store/          # Zustand Stores (useOrderStore, useServiceStore)
│   ├── lib/            # Utilities (Data Source, Auth)
│   └── components/     # UI Components
├── public/             # Static Assets & Uploads
└── ...
```

---

## 🚀 How It Works

### **1. The Order Flow**
1.  **Selection**: A user navigates to `/services/[slug]`.
2.  **Interaction**: They click "Purchase".
    *   **If Guest**: A form appears asking for Name, Email, Phone, and Requirements.
    *   **If Logged In**: The system uses their Profile ID.
3.  **Processing**: 
    *   The frontend calls `POST /api/orders`.
    *   The backend (OrderController) verifies metadata.
    *   An `Order` record is created in the database.
    *   The `Specialist` entity's `purchase_count` is incremented.
4.  **Confirmation**: The user receives a success toast/message.

### **2. Admin Management**
1.  **View**: Admin logs in and goes to `/admin/orders`.
2.  **Fetch**: The page calls `GET /api/admin/orders`.
3.  **Update**: 
    *   Admin sees a "PENDING" order.
    *   Changes dropdown to "PAID".
    *   Frontend calls `PATCH /api/orders/[id]` with new status.
    *   Backend updates the database record.
    *   UI updates optimistically to reflect the change immediately.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   pnpm (Recommended) or npm
*   A PostgreSQL Database

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
    Create a `.env.local` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/any_comp_db"
    NEXTAUTH_SECRET="your-secret-here"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Migration (TypeORM):**
    Ensure your database is running and run the sync script (or rely on `synchronize: true` in dev).
    ```bash
    npm run typeorm schema:sync # if script exists, otherwise run dev
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📝 Key Commands

*   `pnpm dev`: Start dev server.
*   `pnpm build`: Build the application for production.
*   `pnpm start`: Run the production build.

---

*Updated: 2026-02-06*
