import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Facebook, Youtube, Twitter, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },
  { label: "Forum", path: "/forum" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const socialLinks = [
  { label: "Instagram", icon: Instagram, url: "https://instagram.com/thefitnessgalaxy" },
  { label: "Facebook", icon: Facebook, url: "https://facebook.com/thefitnessgalaxy" },
  { label: "YouTube", icon: Youtube, url: "https://youtube.com/@thefitnessgalaxy" },
  { label: "Twitter", icon: Twitter, url: "https://twitter.com/thefitnessgalaxy" },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span>The Fitness Galaxy</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <Dumbbell className="h-5 w-5" />
                </span>
                The Fitness Galaxy
              </Link>
              <p className="text-sm text-muted-foreground max-w-md">
                Your trusted guide to health, fitness, and wellness. We review the best Amazon products and share
                expert advice to help you reach your goals.
              </p>
              <div className="flex gap-3 mt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Explore</h3>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="https://www.amazon.co.uk" target="_blank" rel="noopener noreferrer sponsored" className="text-muted-foreground hover:text-foreground transition-colors">
                    Amazon Store
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Affiliate Disclosure:</strong> The Fitness Galaxy is a participant in the Amazon Associates
              Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising
              fees by advertising and linking to Amazon.co.uk. As an Amazon Associate, we earn from qualifying
              purchases. This does not affect the price you pay.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} The Fitness Galaxy. All rights reserved. thefitnessgalaxy.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}