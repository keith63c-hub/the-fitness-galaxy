import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { ArrowRight, Star, TrendingUp, Users, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";

const heroImage = "https://media.base44.com/images/public/6aa282c8da7d58b1320c186e/6c3077789_generated_f87de50a.jpg";

const categories = [
  { name: "Strength Training", icon: TrendingUp, desc: "Build muscle and power with the right gear and guidance." },
  { name: "Cardio & Running", icon: Star, desc: "Everything you need to improve endurance and heart health." },
  { name: "Nutrition", icon: BookOpen, desc: "Supplements, meal prep, and science-backed eating guides." },
  { name: "Recovery & Wellness", icon: ShieldCheck, desc: "Recover faster and protect your long-term health." },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.BlogPost.list("-created_date", 3),
      base44.entities.ForumTopic.list("-created_date", 3),
    ])
      .then(([blogPosts, forumTopics]) => {
        setPosts(blogPosts || []);
        setTopics(forumTopics || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Athletic woman in yoga pose with galaxy backdrop at sunrise" className="h-full w-full object-cover" fittingType="fill" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-medium text-indigo-200 mb-5">
              Health · Fitness · Wellness
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Explore Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Fitness Galaxy</span>
            </h1>
            <p className="mt-5 text-lg text-slate-200 leading-relaxed max-w-xl">
              Expert reviews, science-backed guides, and a supportive community to help you build a stronger,
              healthier, happier life. Your journey to better fitness starts here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/blog">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
                  Read the Blog <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/forum">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                  Join the Forum
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: BookOpen, value: "100+", label: "Expert Articles" },
              { icon: Users, value: "5,000+", label: "Community Members" },
              { icon: Star, value: "200+", label: "Product Reviews" },
              { icon: TrendingUp, value: "4.8/5", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-2xl font-bold font-heading">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">Find Your Focus</h2>
            <p className="mt-3 text-muted-foreground">
              Whatever your fitness goal, we've got expert content and curated product recommendations to support you.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.name} className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-indigo-300 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest blog posts */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">From the Blog</h2>
              <p className="mt-2 text-muted-foreground">Fresh, evidence-based fitness and nutrition content.</p>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image src={post.image_url} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" fittingType="fill" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{post.category}</span>
                    <h3 className="mt-2 font-heading font-semibold text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Community / Forum preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 mb-4">
                <MessageCircle className="h-3.5 w-3.5" /> Community
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">Join the Conversation</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Fitness is better together. Our forum is a welcoming space to ask questions, share wins, find
                accountability partners, and learn from thousands of members on the same journey as you.
              </p>
              <ul className="mt-6 space-y-3">
                {["Ask questions and get real answers", "Share your progress and celebrate wins", "Discover product tips from real users", "Find motivation and accountability"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">✓</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/forum" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                Visit the Forum <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading font-semibold mb-4">Latest Discussions</h3>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded" />)}
                </div>
              ) : (
                <div className="space-y-1">
                  {topics.map((topic) => (
                    <Link key={topic.id} to="/forum" className="block rounded-lg p-3 hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm leading-snug">{topic.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">by {topic.author_name} · {topic.replies} replies</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 whitespace-nowrap">{topic.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}