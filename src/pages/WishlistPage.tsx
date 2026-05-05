import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useAdmin } from "@/context/AdminContext";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { products: allProducts, loading, error } = useAdmin();
  const products = wishlist.map((id) => allProducts.find((product) => product.id === id)).filter(Boolean);

  return (
    <main className="section-grid">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Wishlist</h1>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-card bg-secondary animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="py-20 text-center text-sm text-destructive">{error}</p>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring} className="py-20 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-display text-xl font-bold text-foreground">Your wishlist is empty</p>
            <p className="mt-2 font-body text-sm text-muted-foreground">Save items you love to find them later.</p>
            <Link to="/shop"><Button className="mt-6">Browse Shop</Button></Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => product && <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
