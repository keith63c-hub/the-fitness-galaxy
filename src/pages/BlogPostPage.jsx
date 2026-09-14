import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import PinterestSaveButton from "@/components/PinterestSaveButton";
import FacebookShareButton from "@/components/FacebookShareButton";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.BlogPost.filter({ slug }, "-created_date", 1)
      .then(async (data) => {
        const found = data && data[0];
        setPost(found);
        if (found) {
          const all = await base44.entities.BlogPost.list("-created_date", 50);
          const rel = (all || []).filter((p) => p.category === found.category && p.id !== found.id).slice(0, 3);
          setRelated(rel);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | The Fitness Galaxy`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && post.meta_description) metaDesc.setAttribute("content", post.meta_description);
    }
    return () => {
      document.title = "The Fitness Galaxy | Health, Fitness & Wellness";
    };
  }, [post]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero image */}
      <div className="group relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image src={post.image_url} alt={post.title} className="h-full w-full object-cover" fittingType="fill" />
        <PinterestSaveButton imageUrl={post.image_url} title={post.title} description={post.excerpt || post.meta_description} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-950/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 pb-8">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <span className="inline-block text-xs font-medium text-indigo-300 uppercase tracking-wide mb-3">{post.category}</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read_time}</span>
            </div>
            <FacebookShareButton label="Share" />
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-li:my-1 prose-a:text-indigo-600">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Disclosure */}
          <div className="mt-12 rounded-lg bg-muted/50 border border-border p-5 text-sm text-muted-foreground">
            <strong>Affiliate Disclosure:</strong> As an Amazon Associate, The Fitness Galaxy earns from qualifying
            purchases. Links in this article may be affiliate links. This does not affect the price you pay.
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image src={rel.image_url} alt={rel.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" fittingType="fill" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{rel.category}</span>
                    <h3 className="mt-2 font-heading font-semibold leading-snug group-hover:text-indigo-600 transition-colors">{rel.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                View all articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}