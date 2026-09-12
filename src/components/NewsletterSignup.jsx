import React, { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function NewsletterSignup({ source = "footer", variant = "card" }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.NewsletterSubscriber.create({ email, source });
      setDone(true);
      setEmail("");
      toast({
        title: "You're subscribed!",
        description: "Thanks for joining — watch your inbox for fitness tips and reviews.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "We couldn't sign you up. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white mb-4">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
          Join The Fitness Galaxy Newsletter
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Get our latest training tips, nutrition guides, and honest product reviews delivered straight to your inbox.
        </p>
        {done ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" /> You're subscribed — check your inbox!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // compact variant for footer
  return (
    <div>
      <h3 className="font-heading font-semibold text-sm mb-3">Newsletter</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Get fitness tips, guides, and product reviews in your inbox.
      </p>
      {done ? (
        <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4" /> You're subscribed!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </button>
        </form>
      )}
      <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </div>
  );
}