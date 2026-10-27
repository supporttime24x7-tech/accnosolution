'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper, Plus, Search, Filter, Eye, Edit3, Trash2, ExternalLink,
  CheckCircle2, FileText, Image as ImageIcon, Sparkles, X, Layout, ArrowUpRight
} from 'lucide-react';
import { useErpStore, BlogPostItem } from '@/lib/store';

export default function ErpBlogPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Mac Repair Guide');
  const [author, setAuthor] = useState('Vikram Sharma (Lead Hardware Engineer)');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80');
  const [imagePosition, setImagePosition] = useState<'header_hero' | 'inline_middle' | 'sidebar_right' | 'bottom'>('header_hero');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { blogPosts = [], addBlogPost, updateBlogPost, deleteBlogPost } = useErpStore();

  if (!mounted) return null;

  // Auto Generate Slug from Title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setCategory('Mac Repair Guide');
    setAuthor('Vikram Sharma (Lead Hardware Engineer)');
    setReadTime('5 min read');
    setCoverImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80');
    setImagePosition('header_hero');
    setExcerpt('');
    setContent('');
    setStatus('Published');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPostItem) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setAuthor(post.author);
    setReadTime(post.readTime || '5 min read');
    setCoverImage(post.coverImage);
    setImagePosition((post.imagePosition as any) || 'header_hero');
    setExcerpt(post.excerpt);
    setContent(post.content);
    setStatus(post.status === 'Draft' ? 'Draft' : 'Published');
    setFeatured(!!post.featured);
    setIsModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (editingPost) {
      updateBlogPost(editingPost.id, {
        title,
        slug: slug || editingPost.slug,
        category,
        author,
        date: formattedDate,
        readTime,
        coverImage,
        imagePosition,
        excerpt,
        content,
        status,
        featured,
      });
    } else {
      addBlogPost({
        title,
        slug: slug || `post-${Date.now()}`,
        category,
        author,
        date: formattedDate,
        readTime,
        coverImage,
        imagePosition,
        excerpt,
        content,
        status,
        featured,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (confirm(`Are you sure you want to delete article "${postTitle}"?`)) {
      deleteBlogPost(id);
    }
  };

  // Filtered List
  const filteredPosts = blogPosts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(blogPosts.map((p) => p.category)));
  const publishedCount = blogPosts.filter((p) => p.status === 'Published').length;
  const draftCount = blogPosts.filter((p) => p.status === 'Draft').length;
  const totalViews = blogPosts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Preset Cover Image Options
  const presetImages = [
    { label: 'MacBook Motherboard Repair', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cleanroom Data Recovery', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Barcode ERP & Software', url: 'https://images.unsplash.com/photo-1556742049-0a67daf40954?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Gaming PC Custom Rig', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Server Rack & Networking', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#5ED29C]" />
            TECHNICAL BLOG &amp; CONTENT MANAGER<span className="text-[#5ED29C]">.</span>
          </h1>
          <p className="text-xs text-white/60">
            Publish hardware repair guides, cleanroom data recovery articles, and configure cover image positions live on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#5ED29C] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#5ED29C]" />
            View Public Blog Page
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Write New Article
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">TOTAL ARTICLES</span>
            <div className="text-2xl font-extrabold font-mono text-white">{blogPosts.length}</div>
            <div className="text-[11px] text-[#5ED29C] font-semibold mt-1">Live blog content</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 text-[#5ED29C] flex items-center justify-center font-extrabold text-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">PUBLISHED POSTS</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">{publishedCount}</div>
            <div className="text-[11px] text-white/50 mt-1">Visible on website</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">DRAFT ARTICLES</span>
            <div className="text-2xl font-extrabold font-mono text-amber-400">{draftCount}</div>
            <div className="text-[11px] text-amber-400/80 font-semibold mt-1">In progress</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-xl">
            <Edit3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/50 uppercase font-bold tracking-wider block mb-1">TOTAL READER VIEWS</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">{totalViews.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-white/50 mt-1">Cumulative views</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-extrabold text-xl">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'All' ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold' : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            All Categories ({blogPosts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat ? 'bg-[#5ED29C] text-[#070B0A] font-extrabold' : 'bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#5ED29C]"
          >
            <option value="All">All Status</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#5ED29C]"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Articles Directory Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#5ED29C]" />
            ARTICLE CATALOG ({filteredPosts.length})
          </h3>
          <span className="text-[10px] text-white/40 font-mono">Changes persist automatically</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-white/40 space-y-2">
            <Newspaper className="w-12 h-12 mx-auto text-white/20" />
            <p className="text-sm font-bold">No blog articles match your search filter.</p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-[#5ED29C]/20 text-[#5ED29C] hover:bg-[#5ED29C] hover:text-[#070B0A] font-extrabold text-xs transition-all cursor-pointer"
            >
              + Create First Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-white/50 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="p-4">Article &amp; Image</th>
                  <th className="p-4">Category &amp; Author</th>
                  <th className="p-4">Image Display Placement</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 max-w-md">
                      <div className="flex gap-3 items-center">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-white line-clamp-1">{post.title}</div>
                          <div className="text-[10px] text-[#5ED29C] font-mono mt-0.5">/blog/{post.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-[#5ED29C]/10 text-[#5ED29C] border-[#5ED29C]/20 inline-block mb-1">
                        {post.category}
                      </span>
                      <div className="text-white/70 text-[11px]">{post.author}</div>
                      <div className="text-white/40 text-[10px] font-mono">{post.date} • {post.readTime}</div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border bg-indigo-500/20 text-indigo-300 border-indigo-500/30 flex items-center gap-1.5 w-fit">
                        <Layout className="w-3 h-3" />
                        {post.imagePosition === 'header_hero' && 'Header Hero'}
                        {post.imagePosition === 'inline_middle' && 'Inline Middle'}
                        {post.imagePosition === 'sidebar_right' && 'Sidebar Right'}
                        {post.imagePosition === 'bottom' && 'Bottom Footer'}
                        {(!post.imagePosition || post.imagePosition === 'top') && 'Header Hero'}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          updateBlogPost(post.id, {
                            status: post.status === 'Published' ? 'Draft' : 'Published',
                          })
                        }
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-all ${
                          post.status === 'Published'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {post.status}
                      </button>
                    </td>

                    <td className="p-4 font-mono text-cyan-300 font-bold">
                      {post.views || 0}
                    </td>

                    <td className="p-4 text-right space-x-2 shrink-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3 h-3 text-[#5ED29C]" /> View
                      </Link>

                      <button
                        onClick={() => handleOpenEditModal(post)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ARTICLE EDITOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-4xl w-full rounded-2xl border border-white/20 p-6 space-y-6 bg-[#0D1117] text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-extrabold uppercase text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#5ED29C]" />
                  {editingPost ? 'Edit Blog Article' : 'Publish New Technical Article'}
                </h2>
                <p className="text-xs text-white/50">Write technical repair guides and configure image placement.</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How to Repair Liquid Damaged MacBook Motherboard"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. repair-macbook-liquid-damage"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#5ED29C] focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              {/* Category, Author & Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  >
                    <option value="Mac Repair Guide">Mac Repair Guide</option>
                    <option value="Data Recovery">Data Recovery</option>
                    <option value="ERP & Software">ERP &amp; Software</option>
                    <option value="Hardware Upgrades">Hardware Upgrades</option>
                    <option value="CCTV & Networking">CCTV &amp; Networking</option>
                    <option value="Gaming PC Assembly">Gaming PC Assembly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Vikram Sharma (Lead Hardware Specialist)"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-bold uppercase text-[11px]">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                  />
                </div>
              </div>

              {/* IMAGE DISPLAY POSITION CONFIGURATION */}
              <div className="p-4 rounded-xl bg-[#5ED29C]/10 border border-[#5ED29C]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[#5ED29C] font-extrabold uppercase text-xs flex items-center gap-1.5">
                    <Layout className="w-4 h-4" />
                    Configure Article Cover Image Display Placement *
                  </label>
                  <span className="text-[10px] text-white/60">Determines where the image renders in the article</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'header_hero', label: 'Header Hero Banner', desc: 'Large banner at top of article' },
                    { id: 'inline_middle', label: 'Inline Middle', desc: 'Embedded inside content text' },
                    { id: 'sidebar_right', label: 'Sidebar Right', desc: 'Floating media box on right' },
                    { id: 'bottom', label: 'Bottom Footer', desc: 'Displayed at end of article' },
                  ].map((pos) => (
                    <button
                      type="button"
                      key={pos.id}
                      onClick={() => setImagePosition(pos.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                        imagePosition === pos.id
                          ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C] font-bold shadow-md'
                          : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-extrabold uppercase">{pos.label}</div>
                      <div className="text-[10px] opacity-70 leading-tight">{pos.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image URL & Presets */}
              <div className="space-y-2">
                <label className="text-white/70 font-bold uppercase text-[11px] flex items-center justify-between">
                  <span>Cover / Article Image URL *</span>
                  <span className="text-[#5ED29C]">Or pick from preset lab library below</span>
                </label>
                <input
                  type="text"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                />

                {/* Preset Image Gallery */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {presetImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        coverImage === img.url
                          ? 'bg-[#5ED29C] text-[#070B0A] border-[#5ED29C]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Short Summary / Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence teaser summary shown on blog cards..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              {/* Full Article Content */}
              <div className="space-y-1">
                <label className="text-white/70 font-bold uppercase text-[11px]">Full Article Body Content *</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write full article body text (supports markdown headings ###, bullet points - or standard text)..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[#5ED29C]"
                />
              </div>

              {/* Publication Status & Featured Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-white/70 font-bold uppercase text-[11px]">Publish Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-white/10 text-white font-bold focus:outline-none focus:border-[#5ED29C]"
                    >
                      <option value="Published">Published (Visible on Website)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded bg-white/5 border-white/10 text-[#5ED29C] focus:ring-[#5ED29C]"
                    />
                    <span>Mark as Featured Article</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5ED29C] hover:bg-[#16FFC6] text-[#070B0A] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#5ED29C]/20 cursor-pointer"
                  >
                    {editingPost ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
