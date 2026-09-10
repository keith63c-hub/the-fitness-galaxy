import React, { useState } from "react";
import { Mail, MessageCircle, Instagram, Facebook, Youtube, Twitter, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const socials = [
  { label: "Instagram", icon: Instagram, url: "https://instagram.com/thefitnessgalaxy", handle: "@thefitnessgalaxy" },
  { label: "Facebook", icon: Facebook, url: "https://facebook.com/thefitnessgalaxy", handle: "/thefitnessgalaxy" },
  { label: "YouTube", icon: Youtube, url: "https://youtube.com/@thefitnessgalaxy", handle: "@thefitnessgalaxy" },
  { label: "Twitter", icon: Twitter, url: "https://twitter.com/thefitnessgalaxy", handle: "@thefitnessgalaxy" },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
      toast({ title: "Message sent!", description: "Thanks for reaching out. We'll get back to you soon." });
    }, 800);
  };

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Get In Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, a product to review, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold mb-4">Connect with us</h2>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media for daily fitness tips, product highlights, and community updates.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <social.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium text-sm">{social.label}</p>
                        <p className="text-xs text-muted-foreground">{social.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-semibold text-sm">Email</h3>
                </div>
                <p className="text-sm text-muted-foreground">hello@thefitnessgalaxy.com</p>
              </div>
              <div className="rounded-xl bg-muted/50 border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-semibold text-sm">Community</h3>
                </div>
                <p className="text-sm text-muted-foreground">Join our forum and social channels to connect with thousands of fitness enthusiasts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}