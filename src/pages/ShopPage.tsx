import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useAdmin } from "@/context/AdminContext";
import type { Category } from "@/services/products";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export default function ShopPage() {
  const { getPublishedProducts, categories, loading, error } = useAdmin();
  const products = getPublishedProducts();
  const [searchParams] = useSearchParams();
  const initialGender = searchParams.get("gender") || "all";
  const initialCategory = searchParams.get("category") || "all";

  const [gender, setGender] = useState(initialGender);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (gender !== "all" && p.gender !== gender && p.gender !== "unisex") return false;
      if (category !== "all" && p.category !== category) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        break;
    }
    return result;
  }, [products, gender, category, sort, priceRange]);

  const activeFilters = [
    gender !== "all" && gender,
    category !== "all" && category,
  ].filter(Boolean) as string[];

  return (
    <main className="section-grid">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-[-0.03em]">
            The Collection
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <FilterPanel
              categories={categories}
              gender={gender}
              setGender={setGender}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Mobile filter toggle + active filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 font-body text-xs font-semibold text-foreground shadow-card lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="label-uppercase flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] text-foreground"
                >
                  {f}
                  <button
                    onClick={() => {
                      if (f === gender) setGender("all");
                      if (f === category) setCategory("all");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {/* Sort (desktop inline) */}
              <div className="ml-auto hidden lg:block">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-lg bg-card px-3 py-2 font-body text-xs font-semibold text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low–High</option>
                  <option value="price-desc">Price: High–Low</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="py-24 text-center">
                <p className="font-display text-2xl font-bold text-foreground">Unable to load products</p>
                <p className="mt-2 font-body text-sm text-destructive">{error}</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-2xl font-bold text-foreground">No products found</p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Try adjusting your filters to discover more.
                </p>
                <button
                  onClick={() => {
                    setGender("all");
                    setCategory("all");
                    setPriceRange([0, 1000]);
                  }}
                  className="mt-4 rounded-lg bg-primary px-5 py-2 font-body text-sm font-semibold text-primary-foreground"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setFiltersOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="absolute inset-y-0 left-0 w-72 bg-background p-6 shadow-modal overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                gender={gender}
                setGender={setGender}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterPanel({
  categories,
  gender, setGender,
  category, setCategory,
  sort, setSort,
  priceRange, setPriceRange,
}: {
  categories: Category[];
  gender: string; setGender: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  sort: SortOption; setSort: (v: SortOption) => void;
  priceRange: [number, number]; setPriceRange: (v: [number, number]) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Gender */}
      <div>
        <h4 className="label-uppercase mb-3 text-foreground">Gender</h4>
        <div className="space-y-2">
          {["all", "women", "men"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`block w-full text-left rounded-md px-3 py-2 font-body text-sm transition-colors ${
                gender === g
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="label-uppercase mb-3 text-foreground">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => setCategory("all")}
            className={`block w-full text-left rounded-md px-3 py-2 font-body text-sm transition-colors ${
              category === "all"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 font-body text-sm transition-colors ${
                category === c.slug
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {c.name}
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort (mobile) */}
      <div className="lg:hidden">
        <h4 className="label-uppercase mb-3 text-foreground">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-full rounded-lg bg-card px-3 py-2 font-body text-sm text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low–High</option>
          <option value="price-desc">Price: High–Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <h4 className="label-uppercase mb-3 text-foreground">Price Range</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-20 rounded-lg bg-card px-3 py-2 font-body text-sm text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-accent"
            min={0}
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-20 rounded-lg bg-card px-3 py-2 font-body text-sm text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-accent"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
