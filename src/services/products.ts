import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  gender: "men" | "women" | "unisex";
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  description: string;
  materials: string;
  deliveryInfo: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stock: number;
  style: string;
  status: "published" | "draft";
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  count: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Akosua Mensah",
    location: "Accra, Ghana",
    text: "My hair has never felt better. The Argan Hair Oil transformed my dry, brittle ends into silk. Visible shine in just two weeks.",
    rating: 5,
  },
  {
    id: "2",
    name: "Kwame Boateng",
    location: "Kumasi, Ghana",
    text: "I've tried so many lip balms. This one finally keeps my lips soft and hydrated all day. Love the natural color too.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ama Owusu",
    location: "Tema, Ghana",
    text: "The Shea Hair Treatment strengthened my natural curls and reduced breakage noticeably. Worth every cedi. I'm obsessed.",
    rating: 5,
  },
];

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  products?: { count: number }[];
};

type ProductRow = {
  id: string;
  name: string;
  category_id: string | null;
  categories?: { name: string; slug: string } | null;
  gender: Product["gender"];
  price: number;
  original_price: number | null;
  discount_price: number | null;
  description: string | null;
  materials: string | null;
  delivery_info: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock_status: Product["stockStatus"];
  stock: number;
  style: string | null;
  status: Product["status"];
};

type OrderRow = {
  id: string;
  customer_id: string;
  total: number;
  status: Order["status"];
  created_at: string;
  shipping_address: string;
  customers?: { full_name: string; email: string | null; phone: string } | null;
  order_items?: {
    product_id: string | null;
    product_name: string;
    size: string | null;
    quantity: number;
    unit_price: number;
  }[];
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.categories?.slug ?? row.category_id ?? "",
    categoryName: row.categories?.name,
    gender: row.gender,
    price: Number(row.price),
    originalPrice: row.original_price ?? undefined,
    discountPrice: row.discount_price ?? undefined,
    description: row.description ?? "",
    materials: row.materials ?? "",
    deliveryInfo: row.delivery_info ?? "",
    images: row.images ?? [],
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    isFeatured: row.is_featured,
    isNewArrival: row.is_new_arrival,
    stockStatus: row.stock_status,
    stock: row.stock,
    style: row.style ?? "",
    status: row.status,
  };
}

export function productToRow(product: Omit<Product, "id" | "categoryName">, categoryId: string) {
  return {
    name: product.name,
    category_id: categoryId,
    gender: product.gender,
    price: product.price,
    original_price: product.originalPrice ?? null,
    discount_price: product.discountPrice ?? null,
    description: product.description,
    materials: product.materials,
    delivery_info: product.deliveryInfo,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    is_featured: product.isFeatured,
    is_new_arrival: product.isNewArrival,
    stock_status: product.stockStatus,
    stock: product.stock,
    style: product.style,
    status: product.status,
    is_active: true,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    count: row.products?.[0]?.count ?? 0,
  };
}

export function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customer: row.customers?.full_name ?? "",
    customerPhone: row.customers?.phone ?? "",
    customerEmail: row.customers?.email ?? undefined,
    items: (row.order_items ?? []).map((item) => ({
      productId: item.product_id ?? "",
      name: item.product_name,
      size: item.size ?? "",
      quantity: item.quantity,
      price: Number(item.unit_price),
    })),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at.slice(0, 10),
    shippingAddress: row.shipping_address,
  };
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, products(count)")
    .order("name");

  if (error) throw error;
  return (data ?? []).map((row) => mapCategory(row as CategoryRow));
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(full_name, email, phone), order_items(product_id, product_name, size, quantity, unit_price)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapOrder(row as OrderRow));
}
