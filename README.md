# Any Comp Project

A modern web application built with the MERN stack principles, utilizing **Next.js** for full-stack capabilities and **PostgreSQL** for robust data management.

## 🚀 Tech Stack

This project is built using industry-standard technologies to ensure performance, scalability, and type safety.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Deployment**: Vercel (Recommended)

### 💾 Database Implementation (PostgreSQL)

This project strictly uses **PostgreSQL** as the relational database management system. 

- **Integration**: The connection is handled via **Prisma ORM**, which serves as the data access layer.
- **Configuration**: The `prisma/schema.prisma` file is configured with `provider = "postgresql"`.
- **Connection**: Database connection strings are securely managed via environment variables (`DATABASE_URL`).
- **Data Integrity**: Uses PostgreSQL's robust features like UUIDs (`@db.Uuid`), distinct data types (`Decimal`, `Text`), and relational integrity (Foreign Keys).

## 📂 Project Structure

```bash
.
├── src/
│   ├── app/            # Next.js App Router pages and API routes
│   ├── components/     # Reusable UI components
│   ├── lib/            # Shared libraries (Prisma client instance: db.ts)
│   ├── modules/        # Feature-based logic (Services, Types)
│   └── ...
├── prisma/
│   └── schema.prisma   # Database schema definition
├── public/             # Static assets
└── ...
```

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (installed and running)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd any-comp-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your PostgreSQL connection string:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

4.  **Database Migration:**
    Push the schema directly to your database to sync the tables:
    ```bash
    npx prisma db push
    ```
    *Or if using migrations:*
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛡️ Key Features

- **Specialist Management**: CRUD operations for specialists using PostgreSQL.
- **Admin Dashboard**: Comprehensive management interface.
- **User Authentication**: Secure user roles (Admin, Specialist, User).
- **Media Management**: Service image uploads and handling.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npx prisma studio`: Opens a visual editor for your PostgreSQL database.
