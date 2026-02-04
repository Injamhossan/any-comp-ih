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
*   **API**: Next.js API Routes (App Router).
*   **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on **Neon Tech** (Serverless Postgres).
*   **ORM**: [Prisma](https://www.prisma.io/) for type-safe database access and schema management.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js) with Google & Credentials providers.
*   **Storage**: **Local Storage** for storing images (Profile photos, Service images, etc.) within the `public/uploads` directory.

---

## ✨ Key Features

### 1. **Service Marketplace**
*   **Browse Services**: Users can view verified specialists and their service offerings (e.g., "Sdn Bhd Registration").
*   **Service Details**: Comprehensive pages showing price breakdowns, secretary profiles, certifications (MAICSA, SSM), and completion time.
*   **Dynamic Pricing**: Calculates Base Price + Platform Fees automatically.

### 2. **Authentication & Identity**
*   **NextAuth Implementation**: Secure JWT-based session management.
*   **Google Login**: Seamless OAuth integration for users.
*   **Credentials Login**: Email/Password authentication using `bcrypt` for hashing.
*   **Role-Based Access**: Specialized views for Users, Specialists, and Admins.

### 3. **Dashboards**
*   **Customer Dashboard**: View "My Companies", track order status, and manage profile settings.
*   **Admin Panel**: 
    *   **Verify Specialists**: Approve/Reject company registrations.
    *   **Client Management**: Professional table view with detailed registration modals.
    *   **Master Data**: Manage global service offerings and configurations.

### 4. **Modern UI/UX**
*   **Responsive Design**: Mobile-first approach.
*   **Real-time Feedback**: Instant validation and success/error toasts using *Sonner*.
*   **Local Media Handling**: Efficient local file uploads with automatic directory management.

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
│   ├── context/        # React Context (AuthContext)
│   ├── lib/            # Utility libraries (DB client, Auth options)
│   ├── modules/        # Domain-specific logic (Controllers & Services)
│   └── types/          # Global TypeScript definitions
├── public/
│   └── uploads/        # Local file storage for uploaded images
└── ...
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
    Create a `.env.local` file in the root directory:
    ```env
    # Database (Neon Tech)
    DATABASE_URL="postgresql://neondb_owner:..."

    # Next Auth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-here"

    # Google Auth (Optional for Dev)
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."
    ```

4.  **Database Setup:**
    Sync your Prisma schema with the database:
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
*   `pnpm build`: Build the application for production.
*   `npx prisma studio`: Open GUI to manage database records.
*   `npx prisma db push`: Sync schema changes to DB.
*   `npx prisma generate`: Update TypeScript client after schema changes.

---

## 🔒 Security & Best Practices

*   **JWT Authentication**: Securely signed tokens with expiration.
*   **Type Safety**: Complete TypeScript implementation.
*   **Server-Side Logic**: Business logic is encapsulated in controllers for separation of concerns.
*   **Encryption**: User passwords are saved as modern `bcrypt` hashes.

---

*Verified & Updated: 2026-02-04*
