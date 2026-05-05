import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/services/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0];
    if (!size) {
      toast({ title: "No volume available", variant: "destructive" });
      return;
    }
    addItem(product, size);
    toast({ title: "Added to bag", description: `${product.name} - ${size}` });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, type: "spring", bounce: 0.2 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="rounded-card bg-card shadow-card hover-lift overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-card">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card-hover"
                aria-label="Add to bag"
              >
                <ShoppingBag className="h-4 w-4 text-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card-hover"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`}
                />
              </motion.button>
            </div>
            {product.isNewArrival && (
              <span className="label-uppercase absolute left-3 top-3 rounded-sm bg-accent px-2 py-1 text-[10px] text-accent-foreground">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="label-uppercase absolute right-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] text-primary-foreground">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-body text-sm font-medium text-foreground leading-tight">{product.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="price-text font-body text-sm font-semibold text-foreground">
                GH₵{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="price-text text-xs text-muted-foreground line-through">
                  GH₵{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.stockStatus === "low-stock" && (
              <p className="mt-1 text-xs text-accent font-medium">Few left</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
