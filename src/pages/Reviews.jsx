import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Search, Star, ArrowRight, ShoppingBag, CheckCircle } from "lucide-react";

export default function Reviews() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    base44.entities.Product.list("-created_date", 50)
      .then((data) => setProducts(data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
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
            <ShoppingBag className="h-3.5 w-3.5" /> Product Reviews
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Honest Amazon Product Reviews</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            We test and review the best health and fitness products on Amazon so you don't have to. Every
            recommendation is based on real research — never paid placements.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="border-b border-border sticky top-16 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
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
        </div>
      </section>

      {/* Products grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fittingType="fill"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{product.category}</span>
                    <h3 className="mt-2 font-heading font-semibold text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold">{product.price_range}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium group-hover:gap-2 transition-all">
                        Read review <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Trust banner */}
          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-semibold mb-1">How we review products</h3>
                <p className="text-sm text-muted-foreground">
                  We research materials, read verified customer feedback, compare specs across brands, and only
                  recommend products we'd use ourselves. Our ratings are never influenced by manufacturers. As an
                  Amazon Associate we earn from qualifying purchases — at no extra cost to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}