import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Target, Heart, Shield, Award, ArrowRight } from "lucide-react";

const aboutImage = "https://media.base44.com/images/public/6aa282c8da7d58b1320c186e/6c3077789_generated_f87de50a.jpg";

const values = [
  { icon: Target, title: "Evidence-Based", desc: "Every recommendation is backed by science and real-world testing." },
  { icon: Heart, title: "Community First", desc: "We build a supportive, judgment-free space for every fitness level." },
  { icon: Shield, title: "Honest Reviews", desc: "We only recommend products we'd use ourselves. No paid placements." },
  { icon: Award, title: "Quality Content", desc: "In-depth, practical guides you can actually apply to your life." },
];

export default function About() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">About The Fitness Galaxy</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make health and fitness accessible, understandable, and achievable for everyone —
            one honest review and one helpful article at a time.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="rounded-2xl overflow-hidden">
              <Image src={aboutImage} alt="Fitness and wellness" className="h-full w-full object-cover" fittingType="fill" />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Fitness Galaxy was born from a simple frustration: the fitness world is full of noise, hype, and
                conflicting advice. We wanted to cut through it all and provide clear, trustworthy guidance for real
                people with real goals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're taking your first steps into fitness or you're a seasoned athlete chasing new PRs, we're
                here to help you navigate the galaxy of products, programmes, and information — so you can focus on
                what matters: showing up and getting better.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">How We Make Money</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Fitness Galaxy is an Amazon Associate. When you click links to Amazon and make a purchase, we may earn
            a small commission at no extra cost to you. This keeps our content free and independent.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We never accept payment for positive reviews. Our recommendations are based on research, testing, and
            genuine belief that a product will help our readers.
          </p>
          <Link to="/blog" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Explore our content <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}