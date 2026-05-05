import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import logoImage from "@/assets/IMG_9442.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const transparent = isHome && !mobileOpen && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoImage}
            alt="GCN Cosmetics Logo"
            className="nav-logo h-28 w-28 md:h-32 md:w-32 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const baseColor = transparent
              ? isActive ? "text-accent" : "text-background/80 hover:text-accent"
              : isActive ? "text-primary" : "text-muted-foreground hover:text-primary";
            return (
              <li key={link.href} className="relative">
                <Link
                  to={link.href}
                  className={`label-uppercase text-[11px] transition-colors ${baseColor}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${transparent ? "bg-accent" : "bg-primary"}`}
                      transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link to="/wishlist" className={`relative p-2 transition-colors ${transparent ? "text-background hover:text-accent" : "text-foreground hover:text-primary"}`} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className={`relative p-2 transition-colors ${transparent ? "text-background hover:text-accent" : "text-foreground hover:text-primary"}`} aria-label="Shopping bag">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 lg:hidden ${transparent ? "text-background" : "text-foreground"}`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Divider */}
      {!transparent && <div className="h-px bg-border" />}

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background lg:hidden"
          >
            <ul className="container flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="label-uppercase text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
