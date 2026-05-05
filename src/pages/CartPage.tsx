import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="section-editorial">
        <div className="container flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground">Your Bag is Empty</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Discover our collection and find something you love.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground"
            >
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const deliveryEstimate = subtotal >= 300 ? 0 : 15;
  const total = subtotal + deliveryEstimate;

  return (
    <main className="section-grid">
      <div className="container">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em] mb-8">
          Your Bag ({totalItems})
        </h1>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.size}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-4 rounded-card bg-card p-4 shadow-card"
              >
                <Link to={`/product/${item.product.id}`} className="h-28 w-20 shrink-0 overflow-hidden rounded-card-inner">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`} className="font-body text-sm font-medium text-foreground hover:text-primary">
                        {item.product.name}
                      </Link>
                      <p className="mt-0.5 font-body text-xs text-muted-foreground">Volume: {item.size}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md bg-secondary">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="px-2 py-1 text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="price-text w-8 text-center font-body text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="px-2 py-1 text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="price-text font-body text-sm font-semibold text-foreground">
                      GH₵{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="rounded-card bg-card p-6 shadow-card sticky top-24">
              <h2 className="font-display text-lg font-bold text-foreground mb-6">Order Summary</h2>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="price-text text-foreground font-medium">GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="price-text text-foreground font-medium">
                    {deliveryEstimate === 0 ? "Free" : `GH₵${deliveryEstimate.toFixed(2)}`}
                  </span>
                </div>
                {deliveryEstimate > 0 && (
                  <p className="text-xs text-accent">Free delivery on orders over GH₵300</p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="price-text font-semibold text-foreground">GH₵{total.toFixed(2)}</span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring} className="mt-6">
                <Link
                  to="/checkout"
                  className="block w-full rounded-lg bg-primary py-3 text-center font-body text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-button-hover"
                >
                  Proceed to Checkout
                </Link>
              </motion.div>
              <Link
                to="/shop"
                className="mt-4 block text-center font-body text-xs text-muted-foreground hover:text-primary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
