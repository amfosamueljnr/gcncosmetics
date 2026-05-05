import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { isAdmin, loading, login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ok = await login(username || "admin@gcncosmetics.com", password);
      if (ok) {
        toast({ title: "Welcome back", description: "Signed in to admin panel." });
        navigate("/admin", { replace: true });
      } else {
        toast({ title: "Access denied", description: "This account is not an admin.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Invalid credentials", description: "Please check your email and password.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-10 shadow-modal"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Admin Access</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Sign in to manage GCN Cosmetics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Email</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin@gcncosmetics.com" required className="pl-10" />
            </div>
          </div>
          <div>
            <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="pl-10" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
