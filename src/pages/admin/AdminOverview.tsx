import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function AdminOverview() {
  const { stats, orders, loading, error } = useAdmin();

  const cards = [
    { label: "Total Revenue", value: `GH₵${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, color: "text-accent" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-primary" },
  ];

  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const statusColor: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-accent/15 text-accent",
    paid: "bg-accent/15 text-accent",
    shipped: "bg-bronze/15 text-bronze",
    delivered: "bg-primary/10 text-primary",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Welcome back to GCN Cosmetics Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.08 }}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</p>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }}>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Orders</h2>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading dashboard...</TableCell>
                </TableRow>
              )}
              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">{error}</TableCell>
                </TableRow>
              )}
              {!loading && !error && recentOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{o.createdAt}</TableCell>
                  <TableCell className="font-semibold">GH₵{o.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColor[o.status] || ""} variant="outline">
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !error && recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No recent orders found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
