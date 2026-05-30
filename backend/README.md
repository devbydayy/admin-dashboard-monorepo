# E-Commerce Backend

## Setup
1. Clone repo and cd into backend/
2. Copy .env.example to .env and fill values
3. Install deps: `npm install`
4. Generate Prisma client: `npm run db:generate`
5. Run migrations: `npm run db:migrate`
6. Start dev server: `npm run dev`

## API Endpoints
- Auth: POST /api/v1/auth/register, /api/v1/auth/login
- Products: GET/POST/PUT/DELETE /api/v1/products
- Orders: GET/POST/PUT/DELETE /api/v1/orders
- And similarly for other modules...

## Structure
Modular: Each feature (products, orders, etc.) has service, controller, routes, etc.
Auth required for most endpoints (JWT in Authorization header).
