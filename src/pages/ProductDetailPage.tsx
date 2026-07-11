import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Minus, Plus, Heart } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, getPublishedProducts, loading, error } = useAdmin();
  const product = products.find((p) => p.id === (id || ""));
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "materials">("description");

  if (loading) {
    return (
      <main className="section-grid">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div className="aspect-[3/4] rounded-card bg-secondary animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded bg-secondary animate-pulse" />
            <div className="h-6 w-32 rounded bg-secondary animate-pulse" />
            <div className="h-28 rounded bg-secondary animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Unable to load product</h1>
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Product Not Found</h1>
          <Link to="/shop" className="mt-4 inline-block font-body text-sm text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = getPublishedProducts().filter((p) => p.id !== product.id).slice(0, 4);
  const hasVolumeOptions = product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasVolumeOptions && !selectedSize) {
      toast({ title: "Please select a volume", variant: "destructive" });
      return;
    }
    addItem(product, selectedSize, quantity);
    toast({ title: "Added to bag", description: `${product.name} — ${selectedSize} × ${quantity}` });
  };

  return (
    <main className="section-grid">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-body text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-card bg-secondary">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            {product.isNewArrival && (
              <span className="label-uppercase mb-3 inline-block rounded-sm bg-foreground px-2 py-1 text-[10px] text-background">
                New Arrival
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              {selectedSize && product.volumePricing?.[selectedSize] ? (
                <>
                  <span className="price-text font-body text-xl font-semibold text-foreground">
                    GH₵{(product.volumePricing[selectedSize].discountPrice ?? product.volumePricing[selectedSize].price).toFixed(2)}
                  </span>
                  {product.volumePricing[selectedSize].discountPrice && (
                    <span className="price-text font-body text-base text-muted-foreground line-through">
                      GH₵{product.volumePricing[selectedSize].price.toFixed(2)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="price-text font-body text-xl font-semibold text-foreground">
                    GH₵{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="price-text font-body text-base text-muted-foreground line-through">
                      GH₵{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground" style={{ textWrap: "pretty" }}>
              {product.description}
            </p>

            {/* Volume selector */}
            <div className="mt-8">
              <h3 className="label-uppercase mb-3 text-foreground">Volume</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg px-4 py-2 font-body text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-foreground text-background shadow-card"
                        : "bg-card text-foreground shadow-card hover:shadow-card-hover"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="label-uppercase mb-3 text-foreground">Quantity</h3>
              <div className="inline-flex items-center rounded-lg bg-card shadow-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-foreground hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="price-text w-10 text-center font-body text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-foreground hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-button-hover"
              >
                Add to Bag
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                onClick={() => {
                  toggleWishlist(product.id);
                  toast({
                    title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
                    description: product.name,
                  });
                }}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-card shadow-card"
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-t border-border pt-8">
              <div className="flex gap-6 border-b border-border">
                {(["description", "materials"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`label-uppercase relative pb-3 text-[11px] transition-colors ${
                      activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "materials" ? "Notes" : "Description"}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">
                {activeTab === "description" && product.description}
                {activeTab === "materials" && product.materials}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-2xl font-bold text-foreground tracking-[-0.03em] mb-8">
              You May Also Like
            </h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
