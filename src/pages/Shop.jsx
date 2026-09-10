import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Search, Star, ArrowRight, ShoppingBag, CheckCircle } from "lucide-react";

const CATEGORIES = [
  "Strength Training",
  "Recovery & Wellness",
  "Nutrition",
  "Cardio & Running",
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Strength Training");

  useEffect(() => {
    base44.entities.Product.list("-created_date", 100)
      .then((data) => setProducts(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 mb-4">
            <ShoppingBag className="h-3.5 w-3.5" /> Amazon Store
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">The Fitness Galaxy Shop</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Hand-picked health and fitness products from Amazon UK across strength training, recovery, nutrition and
            cardio. Every link supports us through the Amazon Associates programme — at no extra cost to you.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <section className="border-b border-border sticky top-16 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${activeCategory}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold">{activeCategory}</h2>
            <span className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length} products`}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products match your search. Try another term.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <div key={product.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fittingType="fill"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold leading-snug">
                      <Link to={`/products/${product.id}`} className="group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                    <div className="mt-3">
                      <a
                        href={product.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
                      >
                        Check on Amazon
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Affiliate notice */}
          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-semibold mb-1">As an Amazon Associate we earn from qualifying purchases</h3>
                <p className="text-sm text-muted-foreground">
                  The Fitness Galaxy is a participant in the Amazon Associates Programme. When you buy through our links,
                  we earn a small commission at no extra cost to you. Prices and availability are accurate as of the date
                  and time indicated and are subject to change. We only list products we genuinely recommend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}