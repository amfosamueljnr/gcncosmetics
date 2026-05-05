import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Smartphone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function CheckoutPage() {
  const { items, subtotal: totalPrice, clearCart } = useCart();
  const { addOrder } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shipping, setShipping] = useState({ fullName: "", phone: "", address: "" });
  const [momoNetwork, setMomoNetwork] = useState("");
  const [momoPhone, setMomoPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  if (items.length === 0 && step !== "confirmation") {
    return (
      <main className="section-grid">
        <div className="container max-w-md text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">Your cart is empty</h1>
          <p className="mt-3 text-muted-foreground">Add a few products before checking out.</p>
          <Link to="/shop"><Button className="mt-6">Browse products</Button></Link>
        </div>
      </main>
    );
  }

  if (step === "confirmation") {
    return (
      <main className="section-editorial">
        <div className="container flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="text-center max-w-md">
            <CheckCircle className="mx-auto h-16 w-16 text-accent mb-6" />
            <h2 className="font-display text-3xl font-semibold text-foreground">Order Confirmed</h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">Order #{orderId}</p>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Thank you for your purchase. We'll call you shortly on the number provided to confirm delivery.
            </p>
            <Link to="/shop">
              <Button className="mt-8">Continue Shopping</Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const update = (field: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePay = async () => {
    if (!momoNetwork || !momoPhone) {
      toast({ title: "Missing payment details", description: "Select a network and enter your MoMo number.", variant: "destructive" });
      return;
    }
    setPlacingOrder(true);
    try {
      const created = await addOrder({
        customer: shipping.fullName,
        customerPhone: shipping.phone,
        shippingAddress: shipping.address,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total: totalPrice,
      });
      setOrderId(created.id);
      clearCart();
      setStep("confirmation");
      toast({ title: "Order confirmed", description: `Order ${created.id} sent to admin.` });
    } catch (err) {
      toast({
        title: "Unable to place order",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="section-grid">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <h1 className="font-display text-4xl font-semibold text-foreground mb-8">Checkout</h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-10">
            {[
              { id: "shipping", label: "Delivery", icon: MapPin },
              { id: "payment", label: "Payment", icon: Smartphone },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-8 bg-border" />}
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body ${step === s.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <s.icon className="h-4 w-4" /> {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              {step === "shipping" && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}
                  className="rounded-card bg-card p-8 shadow-card space-y-5"
                >
                  <h2 className="font-display text-2xl font-semibold text-foreground">Delivery Information</h2>
                  <p className="text-sm text-muted-foreground">No account needed — just tell us where to send it.</p>

                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Full Name</label>
                    <Input value={shipping.fullName} onChange={update("fullName")} placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Phone Number</label>
                    <Input value={shipping.phone} onChange={update("phone")} placeholder="+233 24 000 0000" required />
                  </div>
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Delivery Address</label>
                    <Textarea value={shipping.address} onChange={update("address")} placeholder="House number, street, area, city" required rows={3} />
                  </div>

                  <Button type="submit" className="w-full">Continue to Payment</Button>
                </motion.form>
              )}

              {step === "payment" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-card bg-card p-8 shadow-card space-y-5">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Mobile Money Payment</h2>
                  <p className="font-body text-sm text-muted-foreground">Select your network and enter your MoMo number to complete payment.</p>
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Network</label>
                    <Select value={momoNetwork} onValueChange={setMomoNetwork}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="telecel">Telecel Cash</SelectItem>
                        <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Mobile Money Number</label>
                    <Input value={momoPhone} onChange={(e) => setMomoPhone(e.target.value)} placeholder="0XX XXX XXXX" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("shipping")}>Back</Button>
                    <Button className="flex-1" onClick={handlePay} disabled={placingOrder}>
                      {placingOrder ? "Placing Order..." : `Pay GH₵${totalPrice.toFixed(2)}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order summary */}
            <div className="rounded-card bg-card p-6 shadow-card h-fit">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm text-foreground">{item.product.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Volume: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm font-semibold text-foreground price-text">GH₵{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="price-text">GH₵{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-base font-semibold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="price-text text-accent">GH₵{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
