# E-Commerce Platform with RBAC

> A modern full-stack e-commerce platform with secure buyer-seller flows, role-based routing, analytics, and OTP authentication.

## Live Demo

## 🌐 Live Demo

 [View Site on Netlify](https://earnest-moxie-5f2842.netlify.app)

## Features

- Authentication with OTP for signup, JWT and password/OTP for login sessions. 
-  Role-based routing for **Buyer** and **Seller**
-  Buyer cart, order placement, search
-  Seller product management, analytics
-  Seller-side order and product analytics
-  OTP and order confirmation emails via Nodemailer
-  Zustand for state management
-  RESTful APIs built with Next.js App Router
-  Built with performance and separation of concerns in mind
-  PostgreSQL DB hosted on Railway

## Tech Stack

| Layer         | Tech                        |
|--------------|-----------------------------|
| Frontend     | Next.js (App Router), React |
| State        | Zustand                      |
| Styling      | Tailwind CSS                |
| Backend      | Next.js API routes          |
| Auth         | JWT, OTP via Nodemailer     |
| Database     | PostgreSQL + Prisma ORM     |
| Mail         | Nodemailer                  |



## Folder Structure

- `app/api/` – API routes (auth, buyer, seller)
- `app/components/` – Reusable components
- `app/hooks/` – Custom React hooks
- `app/layout.tsx` – Root layout
- `app/lib/` – Auth, Prisma, JWT, cookies, mailing
- `app/pages/` – Core page logic components. Used to keep route files clean.
- `app/(routes)/` – Route-based rendering (App Router)
- `app/store/` – Zustand stores
- `app/types/` – Type definitions
- `app/utils/` – Utility logic
- `prisma/` – Prisma schema, migrations, seed
- `public/` – Static assets

```
.
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   ├── me
│   │   │   │   └── route.ts
│   │   │   └── otp
│   │   │       ├── request
│   │   │       │   └── route.ts
│   │   │       └── verify
│   │   │           └── route.ts
│   │   ├── buyer
│   │   │   ├── cart
│   │   │   │   ├── add
│   │   │   │   │   └── route.ts
│   │   │   │   ├── remove
│   │   │   │   │   └── route.ts
│   │   │   │   ├── route.ts
│   │   │   │   └── update
│   │   │   │       └── route.ts
│   │   │   ├── order
│   │   │   │   ├── checkout
│   │   │   │   │   └── route.ts
│   │   │   │   ├── confirm
│   │   │   │   │   └── route.ts
│   │   │   │   ├── display
│   │   │   │   │   └── route.ts
│   │   │   │   └── pending
│   │   │   │       └── route.ts
│   │   │   ├── profile
│   │   │   │   └── route.ts
│   │   │   └── search
│   │   │       └── route.ts
│   │   ├── categories
│   │   │   └── route.ts
│   │   └── seller
│   │       ├── analytics
│   │       │   ├── extended
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       ├── deleteproduct
│   │       │   └── route.ts
│   │       ├── editproduct
│   │       │   └── route.ts
│   │       ├── newproduct
│   │       │   └── route.ts
│   │       ├── orders
│   │       │   ├── route.ts
│   │       │   └── [subOrderId]
│   │       │       └── route.ts
│   │       ├── products
│   │       │   └── route.ts
│   │       └── profile
│   │           └── route.ts
│   ├── components
│   │   ├── Auth
│   │   │   ├── AuthCard.tsx
│   │   │   ├── AuthSubmit.tsx
│   │   │   └── AuthToggle.tsx
│   │   ├── layout
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── HeaderUser.tsx
│   │   ├── SearchBar.tsx
│   │   └── Seller
│   │       └── SellerAside.tsx
│   ├── globals.css
│   ├── hooks
│   │   └── useSyncUser.tsx
│   ├── layout.tsx
│   ├── lib
│   │   ├── auth.ts
│   │   ├── cookie.ts
│   │   ├── jwt.ts
│   │   ├── mail
│   │   │   ├── orderConfirmed.ts
│   │   │   └── otpmail.ts
│   │   └── prisma.ts
│   ├── loading.tsx
│   ├── pages
│   │   ├── AuthPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── SellerPage.tsx
│   │   └── SellerProductsPage.tsx
│   ├── (routes)
│   │   ├── auth
│   │   │   ├── business
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── buyer
│   │   │   ├── cart
│   │   │   │   └── page.tsx
│   │   │   ├── checkout
│   │   │   │   └── page.tsx
│   │   │   ├── mypayments
│   │   │   │   └── page.tsx
│   │   │   ├── orders
│   │   │   │   └── page.tsx
│   │   │   ├── payment
│   │   │   │   └── page.tsx
│   │   │   └── profile
│   │   │       └── page.tsx
│   │   ├── home
│   │   │   └── page.tsx
│   │   ├── search
│   │   │   └── page.tsx
│   │   └── seller
│   │       ├── analytics
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── orders
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── products
│   │       │   └── page.tsx
│   │       └── profile
│   │           └── page.tsx
│   ├── store
│   │   ├── useAuthStore.tsx
│   │   └── useSessionStore.tsx
│   ├── types
│   │   └── auth.d.ts
│   └── utils
│       ├── auth.ts
│       └── otp.ts
├── eslint.config.mjs
├── .gitignore
├── middleware.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20250708121519_init
│   │   │   └── migration.sql
│   │   ├── 20250709120929_add_suborder_model
│   │   │   └── migration.sql
│   │   ├── 20250714062918_profile_fields
│   │   │   └── migration.sql
│   │   ├── 20250714064059_remove_join_date
│   │   │   └── migration.sql
│   │   ├── 20250714070934_add_gender_name
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── project-structure.txt
├── public
│   ├── favicon.png
│   ├── Hero-Section.jpg
│   └── placeholder-product.png
├── README.md
└── tsconfig.json
```

## API Endpoints

### Auth

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/api/auth/login`         | Login via email with Password or OTP  |
| POST   | `/api/auth/logout`        | Logout current user                |
| GET    | `/api/auth/me`            | Get logged-in user info            |
| POST   | `/api/auth/otp/request`   | Request OTP for signup or login    |
| POST   | `/api/auth/otp/verify`    | Verify OTP for login/signup        |

### Buyer

#### Cart

| Method | Endpoint                        | Description            |
|--------|----------------------------------|------------------------|
| GET    | `/api/buyer/cart`              | Get cart items         |
| POST   | `/api/buyer/cart/add`          | Add item to cart       |
| POST   | `/api/buyer/cart/remove`       | Remove item from cart  |
| POST   | `/api/buyer/cart/update`       | Update quantity        |

#### Orders

| Method | Endpoint                            | Description                |
|--------|--------------------------------------|----------------------------|
| POST   | `/api/buyer/order/checkout`         | Begin checkout             |
| POST   | `/api/buyer/order/confirm`          | Confirm and place order    |
| GET    | `/api/buyer/order/display`          | Display past orders        |
| GET    | `/api/buyer/order/pending`          | View pending orders        |

#### Profile & Search

| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| GET    | `/api/buyer/profile`       | Get profile details |
| GET    | `/api/buyer/search`        | Product search      |



### Seller

#### Analytics

| Method | Endpoint                                | Description                |
|--------|------------------------------------------|----------------------------|
| GET    | `/api/seller/analytics`                 | Basic analytics            |
| GET    | `/api/seller/analytics/extended`        | Detailed analytics         |

#### Product Management

| Method | Endpoint                           | Description             |
|--------|-------------------------------------|-------------------------|
| POST   | `/api/seller/newproduct`           | Add a new product       |
| POST   | `/api/seller/editproduct`          | Edit product            |
| POST   | `/api/seller/deleteproduct`        | Delete product          |
| GET    | `/api/seller/products`             | List all products       |

#### Orders & Profile

| Method | Endpoint                                | Description                     |
|--------|------------------------------------------|---------------------------------|
| GET    | `/api/seller/orders`                    | Get seller's orders             |
| GET    | `/api/seller/orders/[subOrderId]`       | Get specific suborder           |
| GET    | `/api/seller/profile`                   | Get seller profile              |



### Categories

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/categories`    | List all categories      |


## Environment Setup

```bash
git clone <your-repo-url>
cd Commercial
npm install
```

```bash
# Create a .env file with the following:
# DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
# JWT_SECRET=your-secret
# MAIL_USER=your-mail
# MAIL_PASS=your-pass

npx prisma migrate dev --name init
npx prisma db seed
npm run dev

```

## Test Accounts

| Role   | Login Email                                     |
| ------ | ----------------------------------------------- |
| Buyer  | [buyer@example.com](mailto:buyer@example.com)   |
| Seller | [seller@example.com](mailto:seller@example.com) |


## Contributing

  1. Fork the repo
  2. Create a new branch
  3. Make your changes
  4. Submit a PR
