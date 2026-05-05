# GCN E-Commerce Platform

A modern, full-featured e-commerce application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features a responsive product catalog, shopping cart, wishlist functionality, and a complete admin dashboard for managing products, categories, and orders.

## 🌐 Access the Application

### Production
**URL**: https://gcn-rho.vercel.app/

### Local Development
**URL**: http://localhost:8080

The application will be available at http://localhost:8080 once the development server is running (see instructions below).

## ✨ Features

- **Product Catalog** - Browse and search products with detailed information
- **Shopping Cart** - Add/remove items, manage quantities, and checkout
- **Wishlist** - Save favorite products for later
- **User Accounts** - Secure authentication and user profiles
- **Admin Dashboard** - Complete product, category, and order management
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## 📋 Prerequisites

- **Node.js** v16 or higher (or use **Bun** v1.0+)
- **npm** (comes with Node.js) or **Bun** package manager
- Git (for cloning the repository)

**Install Node.js**: https://nodejs.org/ (recommended: use [nvm](https://github.com/nvm-sh/nvm) for easy version management)



## 🚀 Getting Started

### Step 1: Clone the Repository
```bash
git clone <https://github.com/amfosamueljnr/gcn.git>
cd gcn
```

### Step 2: Install Dependencies

**Using npm:**
```bash
npm install
```

**Using Bun:**
```bash
bun install
```

### Step 3: Start the Development Server

**Using npm:**
```bash
npm run dev
```

**Using Bun:**
```bash
bun run dev
```

The application will automatically open at **http://localhost:8080** with hot-reload enabled. For production, visit **https://gcn-rho.vercel.app/**

## 📦 Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AdminSidebar.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── WishlistPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── CustomOrderPage.tsx
│   └── admin/          # Admin pages
├── context/            # React Context for state management
│   ├── AdminAuthContext.tsx
│   ├── AdminContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── services/           # API services and data fetching
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
└── lib/                # Utility functions
```

## 👨‍💼 Admin Features

### Accessing the Admin Dashboard
1. Navigate to the admin login page
2. Sign in with your admin credentials
3. Access the admin dashboard at `/admin`

### Admin Capabilities
- **Products** - Create, read, update, and delete products
- **Categories** - Manage product categories
- **Orders** - View and manage customer orders
- **Overview** - Dashboard with key metrics and statistics
- **Customer Management** - View customer information and purchase history

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: TanStack Query (React Query)
- **Testing**: Vitest with Playwright for E2E tests
- **Code Quality**: ESLint

## 🧪 Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Production Build

To create an optimized production build:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 🐛 Troubleshooting

**Port 8080 already in use?**
- The development server will automatically try the next available port
- You can also specify a different port by modifying `vite.config.ts`

**Dependencies not installing?**
- Try clearing your package manager cache: `npm cache clean --force` (or `bun cache clean`)
- Delete `node_modules` and lock files, then reinstall

**Changes not reflecting?**
- Make sure the dev server is running
- Check that you're editing files in the `src/` directory
- Try a hard refresh in your browser (Ctrl+Shift+R or Cmd+Shift+R)

## 📞 Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🚀 Deployment

The GCN E-Commerce Platform is deployed on **Vercel**.

**Live Site**: https://gcn-rho.vercel.app/

To deploy your own instance:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy on every push to the master branch

For more information on deploying to Vercel, visit: [Vercel Deployment Docs](https://vercel.com/docs)
