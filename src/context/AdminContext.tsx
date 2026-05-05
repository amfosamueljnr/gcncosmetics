import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAdminSession, supabase } from "@/lib/supabase";
import type { Product, Category, Order } from "@/services/products";
import { fetchCategories, fetchOrders, fetchProducts, mapOrder, productToRow } from "@/services/products";

interface AdminContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "count">) => Promise<void>;
  updateCategory: (slug: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  getPublishedProducts: () => Product[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);

      const { isAdmin } = await getAdminSession();
      if (isAdmin) {
        const [
          ordersData,
          { count: totalOrders },
          { count: totalCustomers },
          { data: revenueRows },
        ] = await Promise.all([
          fetchOrders(),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("customers").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("total").eq("status", "confirmed"),
        ]);
        setOrders(ordersData);
        setDashboardStats({
          totalRevenue: revenueRows?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0,
          totalOrders: totalOrders ?? 0,
          totalCustomers: totalCustomers ?? 0,
        });
      } else {
        setOrders([]);
        setDashboardStats({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load store data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const categoryIdForSlug = useCallback(
    async (slug: string) => {
      const existing = categories.find((category) => category.slug === slug);
      if (existing?.id) return existing.id;

      const { data, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

      if (categoryError || !data) throw categoryError ?? new Error("Category not found.");
      return data.id as string;
    },
    [categories]
  );

  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      const categoryId = await categoryIdForSlug(product.category);
      const { error: insertError } = await supabase.from("products").insert(productToRow(product, categoryId));
      if (insertError) throw insertError;
      await refresh();
    },
    [categoryIdForSlug, refresh]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const current = products.find((product) => product.id === id);
      if (!current) throw new Error("Product not found.");
      const next = { ...current, ...updates };
      const categoryId = await categoryIdForSlug(next.category);
      const { error: updateError } = await supabase
        .from("products")
        .update(productToRow(next, categoryId))
        .eq("id", id);

      if (updateError) throw updateError;
      await refresh();
    },
    [categoryIdForSlug, products, refresh]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from("products").update({ is_active: false }).eq("id", id);
      if (deleteError) throw deleteError;
      await refresh();
    },
    [refresh]
  );

  const addCategory = useCallback(
    async (category: Omit<Category, "count">) => {
      const { error: insertError } = await supabase.from("categories").insert({
        name: category.name,
        slug: category.slug,
      });
      if (insertError) throw insertError;
      await refresh();
    },
    [refresh]
  );

  const updateCategory = useCallback(
    async (slug: string, updates: Partial<Category>) => {
      const { error: updateError } = await supabase
        .from("categories")
        .update({ name: updates.name, slug: updates.slug })
        .eq("slug", slug);
      if (updateError) throw updateError;
      await refresh();
    },
    [refresh]
  );

  const deleteCategory = useCallback(
    async (slug: string) => {
      const { error: deleteError } = await supabase.from("categories").delete().eq("slug", slug);
      if (deleteError) throw deleteError;
      await refresh();
    },
    [refresh]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: Order["status"]) => {
      const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", id);
      if (updateError) throw updateError;
      await refresh();
    },
    [refresh]
  );

  const addOrder = useCallback(
    async (order: Omit<Order, "id" | "createdAt" | "status">) => {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .upsert(
          {
            full_name: order.customer,
            email: order.customerEmail ?? null,
            phone: order.customerPhone,
            default_address: order.shippingAddress,
            status: "active",
          },
          { onConflict: "phone" }
        )
        .select()
        .single();

      if (customerError) throw customerError;

      const { data: createdOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customer.id,
          total: order.total,
          status: "confirmed",
          shipping_address: order.shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        order.items.map((item) => ({
          order_id: createdOrder.id,
          product_id: item.productId || null,
          product_name: item.name,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }))
      );

      if (itemsError) throw itemsError;

      const { data: fullOrder, error: fullOrderError } = await supabase
        .from("orders")
        .select("*, customers(full_name, email, phone), order_items(product_id, product_name, size, quantity, unit_price)")
        .eq("id", createdOrder.id)
        .single();

      if (fullOrderError) throw fullOrderError;
      const mapped = mapOrder(fullOrder as Parameters<typeof mapOrder>[0]);
      await refresh();
      return mapped;
    },
    [refresh]
  );

  const getPublishedProducts = useCallback(() => {
    return products.filter((product) => product.status === "published");
  }, [products]);

  const stats = useMemo(() => {
    return {
      totalRevenue: dashboardStats.totalRevenue,
      totalOrders: dashboardStats.totalOrders,
      totalCustomers: dashboardStats.totalCustomers,
      totalProducts: products.length,
    };
  }, [dashboardStats, products]);

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        loading,
        error,
        refresh,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrderStatus,
        getPublishedProducts,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be inside AdminProvider");
  return ctx;
}
