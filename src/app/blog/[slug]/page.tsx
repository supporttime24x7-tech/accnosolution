'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/home/Sections';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Clock, User, Eye, Share2, Wrench, Shield,
  PhoneCall, CheckCircle2, ChevronRight, Newspaper, Layout
} from 'lucide-react';
import { useErpStore } from '@/lib/store';

export default function SingleBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [mounted, setMounted] = useState(false);
  const { blogPosts = [], updateBlogPost } = useErpStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const post = blogPosts.find((p) => p.slug === slug || p.id === slug);

  useEffect(() => {
    if (post) {
      // Increment view counter
      updateBlogPost(post.id, { views: (post.views || 0) + 1 });
    }
  }, [post?.id]);

  if (!mounted) return null;

  if (!post) {
    return (
      <main className="min-h-screen bg-[#070B0A] text-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center space-y-4 my-auto pt-36">
          <Newspaper className="w-16 h-16 text-white/20 mx-auto" />
          <h1 className="text-2xl font-bold uppercase">Article Not Found</h1>
          <p className="text-xs text-white/50">The technical blog article you requested does not exist or has been archived.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog Hub
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const imagePos = post.imagePosition || 'header_hero';

  return (
    <main className="min-h-screen bg-[#070B0A] text-white">
      <Navbar />

      <article className="pt-32 pb-20 max-w-4xl mx-auto px-4 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5ED29C] hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Technical Blog
          </Link>
        </div>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-[#5ED29C]/10 text-[#5ED29C] border border-[#5ED29C]/30">
              {post.category}
            </span>
            <span className="text-xs text-white/40 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> {(post.views || 0) + 1} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-2 border-y border-white/10 py-3 font-mono">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#5ED29C]" /> {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#5ED29C]" /> {post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#5ED29C]" /> {post.readTime || '5 min read'}</span>
          </div>
        </div>

        {/* IMAGE PLACEMENT MODE 1: HEADER HERO BANNER */}
        {(imagePos === 'header_hero' || imagePos === 'top') && (
          <div className="rounded-3xl overflow-hidden border border-white/10 max-h-[480px] shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Lead Excerpt */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#5ED29C]/5 text-sm text-white/90 font-medium leading-relaxed italic">
          "{post.excerpt}"
        </div>

        {/* IMAGE PLACEMENT MODE 2: SIDEBAR RIGHT (FLOATING) */}
        {imagePos === 'sidebar_right' && (
          <div className="float-right ml-6 mb-6 w-full sm:w-80 rounded-2xl overflow-hidden border border-white/10 space-y-2 bg-white/5 p-2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="text-[10px] text-white/50 font-mono text-center">Article Reference Media</div>
          </div>
        )}

        {/* IMAGE PLACEMENT MODE 3: INLINE MIDDLE */}
        {imagePos === 'inline_middle' && (
          <div className="my-6 rounded-2xl overflow-hidden border border-white/10 max-h-96">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-white/80 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* IMAGE PLACEMENT MODE 4: BOTTOM FOOTER */}
        {imagePos === 'bottom' && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 max-h-96">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="p-3 bg-white/5 text-[10px] text-white/50 font-mono text-center">
              Figure 1.0 - ACCNO Engineering Technical Illustration
            </div>
          </div>
        )}

        {/* Call to Action Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-[#5ED29C]/30 bg-[#5ED29C]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold uppercase text-white">Need Expert Hardware Repair or Data Recovery?</h3>
            <p className="text-xs text-white/70">Contact Sanchore's premier Apple logic board micro-soldering and ISO cleanroom specialists.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/book-repair"
              className="px-5 py-3 rounded-2xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20"
            >
              Book Repair Online
            </Link>

            <Link
              href="/contact"
              className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase border border-white/10"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
