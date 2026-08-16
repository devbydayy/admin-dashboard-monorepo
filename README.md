# Admin Dashboard - Full Stack Application

A complete admin dashboard with e-commerce features, real-time updates, and analytics.

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Socket.IO (Real-time)
- Bull Queue (Background jobs)
- Winston (Logging)

### Frontend  
- Next.js 14 (App Router)
- TypeScript
- Bootstrap CSS
- TanStack React Query
- Recharts (Analytics)
- Socket.IO Client

## Project Structure
.
├── backend/ # Express.js backend API
│ ├── src/ # Source code
│ ├── prisma/ # Database schema & migrations
│ └── tests/ # Unit tests
└── frontend/ # Next.js frontend app
├── app/ # App router pages
├── components/ # React components
├── hooks/ # Custom hooks
└── lib/ # Utilities & API clients


## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis
- npm or yarn

Before starting the backend, make sure you have a Redis-compatible server running.

### Option 1: Redis
Install Redis and start it:
redis-server

### Option 2: Memurai (Windows)
Install Memurai and start the Memurai service.

Verify connectivity:
memurai-cli ping

Expected response:
PONG

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd your-project
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### 3. Frontend Setup (new terminal)
```bash

cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### 4. Access the App

    Frontend: http://localhost:3000

    Backend API: http://localhost:5000

    Default login: admin@example.com / password123

Features
Backend Features

    ✅ JWT Authentication & Authorization (Admin/User roles)

    ✅ CRUD operations for Products, Orders, Customers, Categories

    ✅ Blog management

    ✅ Real-time order updates via Socket.IO

    ✅ Analytics aggregation with background jobs

    ✅ Rate limiting & security middleware

    ✅ Request logging with Winston

Frontend Features

    ✅ Dashboard with key metrics

    ✅ Real-time order notifications

    ✅ Dark/Light mode toggle

    ✅ Responsive design

    ✅ Data tables with sorting, filtering, pagination

    ✅ Charts & analytics visualizations

    ✅ Customer details slide-over panel

    ✅ Audit logs & user role management

API Documentation

Authentication

- Register new user:
POST /api/auth/register
- Login & get JWT token:
POST /api/auth/login
- Get current user:
GET  /api/auth/profile  

Products

- List all products:
GET    /api/products     
- Get single product: 
GET    /api/products/:id
- Create product (Admin): 
POST   /api/products
- Update product (Admin): 
PUT    /api/products/:id
- Delete product (Admin): 
DELETE /api/products/:id 

Orders

- List all orders: 
GET    /api/orders
- Get order details: 
GET    /api/orders/:id
- Create order: 
POST   /api/orders
- Update order status: 
PUT    /api/orders/:id
- Delete order: 
DELETE /api/orders/:id   

Analytics

- Dashboard statistics:
GET /api/analytics/overview
- Sales report by date: GET /api/analytics/sales-report 
