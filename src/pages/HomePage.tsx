import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useAdmin } from "@/context/AdminContext";
import { testimonials } from "@/services/products";
import heroImage1 from "@/assets/hero-1.jpg";
import heroImage2 from "@/assets/hero-2.jpg";
import categoryHair from "@/assets/category-women.jpg";
import categorySkin from "@/assets/category-men.jpg";
import categoryHerbal from "@/assets/category-accessories.jpg";
import { useState } from "react";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

export default function HomePage() {
  const { getPublishedProducts, categories, loading, error } = useAdmin();
  const products = getPublishedProducts();
  const featured = products.filter((product) => product.isFeatured);
  const newArrivals = products.filter((product) => product.isNewArrival);
  const [email, setEmail] = useState("");

  return (
    <main>
      <h1 className="sr-only">GCN Cosmetics — Premium Lip & Hair Care</h1>

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden -mt-16 md:-mt-20 pt-16 md:pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImage1}
            alt="Premium lip care and hair care products"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-transparent to-foreground/60" />
        </div>

        <div className="container relative z-10 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="label-uppercase text-accent mb-4">Natural Beauty Care</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-background leading-[1] tracking-[-0.03em]">
              Lip & Hair Care.{" "}
              <span className="text-accent">Made in Ghana.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-background/80" style={{ textWrap: "pretty" }}>
              Premium lip balms and hair care crafted in Accra. Every formula combines raw shea, argan oil, and West African botanicals for lips that shine and hair that thrives.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-sm font-semibold text-accent-foreground transition-shadow hover:shadow-button-hover"
                >
                  Shop the Collection <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-lg border border-background/30 bg-background/10 backdrop-blur-sm px-6 py-3 font-body text-sm font-semibold text-background transition-colors hover:bg-background/20"
                >
                  Our Story <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-grid">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mb-12 text-center"
          >
            <p className="label-uppercase text-accent mb-2">Discover</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              Shop by Category
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-card bg-secondary animate-pulse" />
            ))}
            {!loading && error && <p className="col-span-full text-sm text-destructive">{error}</p>}
            {!loading && !error && categories.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">No categories available.</p>
            )}
            {!loading && !error && categories.slice(0, 3).map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
              >
                <Link to={`/shop?category=${cat.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-card">
                  <img
                    src={[categoryHair, categorySkin, categoryHerbal][i]}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-display text-2xl font-bold text-background">{cat.name}</h3>
                    <p className="label-uppercase mt-1 flex items-center gap-1 text-background/80 text-[11px]">
                      Discover <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="section-grid">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="label-uppercase text-accent mb-2">The Edit</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
                Bestselling Rituals
              </h2>
            </div>
            <Link
              to="/shop"
              className="label-uppercase hidden items-center gap-1 text-[11px] text-primary transition-colors hover:text-foreground md:flex"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading && Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            {!loading && error && <p className="col-span-full text-sm text-destructive">{error}</p>}
            {!loading && !error && featured.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">No featured products available.</p>
            )}
            {!loading && !error && featured.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL BANNER ===== */}
      <section className="section-editorial">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="label-uppercase text-accent mb-4">Our Craft</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1] tracking-[-0.03em]">
              Lips That Shine. Hair That Thrives.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-muted-foreground" style={{ textWrap: "pretty" }}>
              Formulated for African hair textures and complexions. Our lip balms deliver moisture and shine. Our hair oils nourish from root to tip. Every product blends ancestral wisdom with modern cosmetic science.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} className="mt-8 inline-block">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-button-hover"
              >
                Discover Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="section-grid">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="label-uppercase text-accent mb-2">Just In</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="label-uppercase hidden items-center gap-1 text-[11px] text-primary transition-colors hover:text-foreground md:flex"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading && Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            {!loading && error && <p className="col-span-full text-sm text-destructive">{error}</p>}
            {!loading && !error && newArrivals.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">No new arrivals available.</p>
            )}
            {!loading && !error && newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-editorial bg-secondary/40">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mb-12 text-center"
          >
            <p className="label-uppercase text-accent mb-2">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              Loved by Our Community
            </h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="rounded-card bg-card p-8 shadow-card"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="font-body text-sm leading-relaxed text-foreground">"{t.text}"</p>
                <div className="mt-6">
                  <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="section-grid">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mx-auto max-w-lg text-center"
          >
            <p className="label-uppercase text-accent mb-2">Stay Connected</p>
            <h2 className="font-display text-3xl font-bold text-foreground tracking-[-0.03em]">
              Join the GCN Beauty Circle
            </h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Be first to hear about new launches, herbal rituals and member-only offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="mt-6 flex gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-accent bg-card"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-button-hover"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
