import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Eye, Reply, Users } from "lucide-react";

export default function Forum() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    base44.entities.ForumTopic.list("-created_date", 50)
      .then((data) => setTopics(data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(topics.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? topics : topics.filter((t) => t.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-purple-700 mb-4">
            <Users className="h-3.5 w-3.5" /> Community Forum
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">The Fitness Galaxy Community</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Ask questions, share your journey, and connect with thousands of fitness enthusiasts. Our forum is
            free, friendly, and moderated to keep it a supportive space for everyone.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap gap-2">
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
      </section>

      {/* Topics */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex flex-shrink-0 h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold text-sm">
                      {topic.author_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{topic.category}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg leading-snug">{topic.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>by {topic.author_name}</span>
                        <span className="flex items-center gap-1"><Reply className="h-3.5 w-3.5" /> {topic.replies} replies</span>
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {topic.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Join CTA */}
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-10 text-center text-white">
            <MessageCircle className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="font-heading text-2xl font-bold">Have a question? Join the conversation.</h2>
            <p className="mt-2 text-indigo-100 max-w-lg mx-auto">
              Connect with our community on social media and be part of the discussion. Follow us and tag your posts
              with #FitnessGalaxy.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="https://www.instagram.com/thefitnessgalaxy1/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors">
                Follow on Instagram
              </a>
              <a href="https://www.youtube.com/@TheFitnessGalaxy-z3q" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}