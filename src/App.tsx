import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AdminProvider } from "@/context/AdminContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CustomOrderPage from "@/pages/CustomOrderPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "@/pages/WishlistPage";
import NotFound from "@/pages/NotFound";

import AdminLayout from "@/layouts/AdminLayout";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCRMPage from "@/pages/AdminCRMPage";
import { isSupabaseConfigured } from "@/lib/supabase";

const queryClient = new QueryClient();

function SupabaseSetupScreen() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-xl rounded-card border border-border bg-card p-8 shadow-card">
        <p className="label-uppercase text-accent mb-3">Setup Required</p>
        <h1 className="font-display text-3xl font-bold text-foreground">Connect Supabase</h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
          Add your Supabase project URL and anon key to a local <span className="font-semibold text-foreground">.env</span> file, then restart the dev server.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-xs text-foreground">
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
      </div>
    </main>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {!isSupabaseConfigured ? (
        <SupabaseSetupScreen />
      ) : (
        <AdminAuthProvider>
        <AdminProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Admin login (public) */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Protected admin routes */}
                  <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminOverview />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="crm" element={<AdminCRMPage />} />
                      <Route path="categories" element={<AdminCategories />} />
                    </Route>
                  </Route>

                  {/* Public store routes */}
                  <Route
                    path="*"
                    element={
                      <>
                        <Navbar />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/shop" element={<ShopPage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/custom" element={<CustomOrderPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <Footer />
                      </>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AdminProvider>
      </AdminAuthProvider>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
