import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Mail, Phone, MapPin, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Inactive";
  joinDate: string;
  location: string;
  deliveryAddress?: string;
  orders: { id: string; date: string; total: number; status: string }[];
}

type CustomerRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  status: string;
  created_at: string;
  default_address: string | null;
  orders?: { id: string; created_at: string; total: number; status: string }[];
};

function mapCustomer(row: CustomerRow): Customer {
  const orders = (row.orders ?? []).filter((order) => ["paid", "shipped", "delivered"].includes(order.status));
  return {
    id: row.id,
    name: row.full_name,
    email: row.email ?? "",
    phone: row.phone,
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.total), 0),
    status: row.status === "inactive" ? "Inactive" : "Active",
    joinDate: new Date(row.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
    location: row.default_address ?? "",
    deliveryAddress: row.default_address ?? undefined,
    orders: orders.map((order) => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString(),
      total: Number(order.total),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    })),
  };
}

export default function AdminCRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      setError(null);
      const { data, error: customersError } = await supabase
        .from("customers")
        .select("*, orders(id, created_at, total, status)")
        .order("created_at", { ascending: false });

      if (customersError) {
        setError(customersError.message);
      } else {
        setCustomers((data ?? []).map((row) => mapCustomer(row as CustomerRow)).filter((customer) => customer.totalOrders > 0));
      }
      setLoading(false);
    }

    void loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCustomer) {
    const c = selectedCustomer;
    return (
      <main className="section-grid">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Customers
            </Button>

            <div className="rounded-card bg-card p-8 shadow-card mb-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{c.name}</h2>
                  <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{c.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{c.location || "No address"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{c.totalOrders} orders · GH₵{c.totalSpent.toLocaleString()}</span>
                </div>
              </div>
              {c.deliveryAddress && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-display text-sm font-semibold text-foreground mb-3">Delivery Address</h4>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <p className="font-body text-sm text-foreground">{c.deliveryAddress}</p>
                  </div>
                </div>
              )}
            </div>

            <h3 className="font-display text-lg font-bold text-foreground mb-4">Order History</h3>
            {c.orders.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No orders found.</p>
            ) : (
              <div className="rounded-card bg-card shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>{o.date}</TableCell>
                        <TableCell className="price-text">GH₵{o.total.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="outline">{o.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-grid">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="label-uppercase text-primary mb-1">Admin</p>
              <h1 className="font-display text-3xl font-bold text-foreground">Customer Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-64" />
            </div>
          </div>

          <div className="rounded-card bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading customers...</TableCell>
                  </TableRow>
                )}
                {!loading && error && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-destructive">{error}</TableCell>
                  </TableRow>
                )}
                {!loading && !error && filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{c.name}</p>
                        <p className="font-body text-xs text-muted-foreground md:hidden">{c.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-body text-sm text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="hidden lg:table-cell font-body text-sm text-muted-foreground">{c.phone}</TableCell>
                    <TableCell className="font-body text-sm text-foreground">{c.totalOrders}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(c)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && !error && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No customers found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
