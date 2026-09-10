import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Search, ArrowRight } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    base44.entities.BlogPost.list("-created_date", 50)
      .then((data) => setPosts(data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">The Fitness Galaxy Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Evidence-based articles on training, nutrition, recovery, and wellness — plus honest reviews of the best
            fitness products on Amazon.
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
              placeholder="Search articles..."
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

      {/* Posts grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image src={post.image_url} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" fittingType="fill" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{post.category}</span>
                    <h3 className="mt-2 font-heading font-semibold text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.read_time}</span>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}