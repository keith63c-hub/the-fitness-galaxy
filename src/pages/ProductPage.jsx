import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Star, ArrowLeft, ShoppingBag, CheckCircle, ShieldCheck, Truck, Award } from "lucide-react";
import PinterestSaveButton from "@/components/PinterestSaveButton";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.get(id)
      .then(async (data) => {
        setProduct(data);
        if (data) {
          const all = await base44.entities.Product.list("-created_date", 50);
          const rel = (all || []).filter((p) => p.category === data.category && p.id !== data.id).slice(0, 3);
          setRelated(rel);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} Review | The Fitness Galaxy`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", `${product.name} review — ${product.description.slice(0, 140)}`);
    }
    return () => {
      document.title = "The Fitness Galaxy | Health, Fitness & Wellness Product Reviews";
    };
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 animate-pulse">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">This product review doesn't exist or has been removed.</p>
        <Link to="/reviews" className="inline-flex items-center gap-2 text-indigo-600 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Reviews
        </Link>
      </div>
    );
  }

  const trustBadges = [
    { icon: ShieldCheck, label: "Independently Tested" },
    { icon: Truck, label: "Amazon Prime Eligible" },
    { icon: Award, label: "Editor Recommended" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Image */}
            <div className="group relative rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-square">
                <Image src={product.image_url} alt={product.name} className="h-full w-full object-cover" fittingType="fill" />
              </div>
              <PinterestSaveButton imageUrl={product.image_url} title={product.name} description={product.description} />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{product.category}</span>
              <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>

              <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Amazon CTA */}
              <a
                href={product.amazon_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4" /> Check on Amazon
              </a>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center text-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
                    <badge.icon className="h-5 w-5 text-indigo-600" />
                    <span className="text-xs font-medium leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review verdict */}
      <section className="py-12 md:py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-bold mb-6">Our Verdict</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The <strong>{product.name}</strong> earns our recommendation in the {product.category} category. After
              thorough research into its build quality, user reviews, and value for money, we're confident it delivers
              on its promises for most fitness enthusiasts.
            </p>
            <p>
              What stands out is the combination of quality and practicality. Whether you're a beginner building your
              first home gym or an experienced athlete looking to upgrade your kit, this product hits the sweet spot
              between performance and price.
            </p>
          </div>

          {/* Pros */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-semibold mb-4">Why We Recommend It</h3>
            <ul className="space-y-3">
              {[
                "Excellent build quality and durability",
                "Great value compared to alternatives in this category",
                "Highly rated by verified Amazon customers",
                "Suitable for a wide range of fitness levels",
              ].map((pro) => (
                <li key={pro} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclosure */}
          <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-5 text-sm text-amber-900">
            <strong>Affiliate Disclosure:</strong> The Fitness Galaxy is an Amazon Associate. If you buy through the
            link above, we earn a small commission at no extra cost to you. This never affects our ratings or
            recommendations.
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold mb-8">More in {product.category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.id} to={`/products/${rel.id}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden">
                    <Image src={rel.image_url} alt={rel.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" fittingType="fill" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{rel.rating}</span>
                    </div>
                    <h3 className="font-heading font-semibold leading-snug group-hover:text-indigo-600 transition-colors">{rel.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}