'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import Link from 'next/link';
import { Newspaper, Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useErpStore } from '@/lib/store';

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { blogPosts = [] } = useErpStore();

  if (!mounted) return null;

  const publishedPosts = blogPosts.filter((p) => p.status === 'Published' || !p.status);
  const categories = Array.from(new Set(publishedPosts.map((p) => p.category)));

  const filteredPosts = publishedPosts.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-4 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#5ED29C] font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-1.5">
            <Newspaper className="w-4 h-4" /> ENGINEERING &amp; HARDWARE BLOG
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            TECHNICAL INSIGHTS &amp; GUIDES<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-sm text-white/60">
            Professional repair tutorials, micro-soldering insights, cleanroom data recovery protocols, and enterprise ERP solutions from ACCNO engineers.
          </p>
        </div>

        {/* Featured Post Hero Card (if available) */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-[#5ED29C]/10 via-transparent to-transparent grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-[#5ED29C] text-[#070B0A]">
                  FEATURED ARTICLE
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-white/5 border border-white/10 text-[#5ED29C]">
                  {featuredPost.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-sm text-white/70 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 pt-2 font-mono">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#5ED29C]" /> {featuredPost.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#5ED29C]" /> {featuredPost.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#5ED29C]" /> {featuredPost.readTime}</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 transition-all"
                >
                  Read Full Technical Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-white/10 max-h-80">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#5ED29C] text-[#070B0A] shadow-md shadow-[#5ED29C]/20'
                : 'bg-white/5 text-white/70 border border-white/10 hover:text-white'
            }`}
          >
            All Guides ({publishedPosts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#5ED29C] text-[#070B0A] shadow-md shadow-[#5ED29C]/20'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#5ED29C]/40 transition-all duration-300 group"
            >
              <div>
                {/* Post Cover Image */}
                <div className="h-48 overflow-hidden relative border-b border-white/10">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-extrabold text-[#5ED29C] bg-[#070B0A]/80 border border-[#5ED29C]/30 backdrop-blur-md px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-white/40 font-mono">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#5ED29C] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-between items-center border-t border-white/5 mt-4">
                <span className="text-[10px] text-white/40 font-mono">By {post.author.split(' ')[0]}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-[#5ED29C] font-extrabold hover:underline inline-flex items-center gap-1"
                >
                  Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
