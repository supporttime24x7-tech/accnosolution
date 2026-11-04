'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer, CtaSection } from '@/components/home/Sections';
import { Search, ShoppingBag, Filter, CheckCircle2, ShieldCheck, Tag, ArrowRight, X, Sparkles, Monitor, Cpu, Laptop, HardDrive, Package, AlertCircle, Wrench, Check, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErpStore, InventoryItem } from '@/lib/store';
import { fetchInventoryFromSupabase } from '@/lib/supabase-sync';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function ShopPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { inventory = [], setInventory, addToWebsiteCart } = useErpStore();

  useEffect(() => {
    setMounted(true);
    async function loadLiveShopData() {
      try {
        setLoading(true);
        const cloudData = await fetchInventoryFromSupabase();
        if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
          setInventory(cloudData);
        }
      } catch (err) {
        console.warn('Unable to sync live shop inventory from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveShopData();
  }, [setInventory]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  if (!mounted) return null;

  // Filter items: Only show items where showOnWebsiteShop !== false AND currentStock > 0
  const shopItems = inventory.filter((item) => item.showOnWebsiteShop !== false && (item.currentStock || 0) > 0);

  // Extract unique categories
  const categoriesList = ['All', ...Array.from(new Set(shopItems.map((i) => i.category || 'General')))];

  const filteredItems = shopItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.productGroup || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.refurbishedDescription || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: InventoryItem) => {
    addToWebsiteCart(product, 1);
    setAddedToast(`Added "${product.name}" to cart!`);
    setTimeout(() => setAddedToast(null), 3500);
    setIsCartDrawerOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#070B0A] text-white font-sans relative">
      <Navbar />

      {/* Added to Cart Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-[#16FFC6] text-[#070B0A] font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs border border-[#070B0A]/20"
          >
            <CheckCircle2 className="w-4 h-4 text-[#070B0A]" />
            <span>{addedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section */}
      <section className="pt-28 sm:pt-32 pb-6 sm:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3 mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16FFC6]/10 border border-[#16FFC6]/30 text-[#16FFC6] text-[11px] font-extrabold uppercase tracking-widest">
            <ShoppingBag className="w-3.5 h-3.5" /> ONLINE HARDWARE STORE &amp; SPARES
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            SHOP ACCNO SOLUTION<span className="text-[#16FFC6]">.</span>
          </h1>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Genuine desktop computer hardware, high-performance PC parts, micro-soldering spares, and assembled workstations direct from our certified diagnostics hub in Sanchore.
          </p>
        </motion.div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3 sm:p-4 rounded-2xl border border-white/10">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, RAM, CPUs, SSDs, Cartridges..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#16FFC6] font-medium"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
            </div>

            <div className="text-xs text-white/60 font-mono flex items-center gap-2">
              {loading && <RotateCw className="w-3.5 h-3.5 text-[#16FFC6] animate-spin" />}
              <span>
                Showing <strong className="text-[#16FFC6]">{filteredItems.length}</strong> of {shopItems.length} Products
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#16FFC6] text-[#070B0A] shadow-md shadow-[#16FFC6]/20 font-extrabold scale-105'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-8">
          {filteredItems.map((item) => {
            const isLowStock = item.currentStock > 0 && item.currentStock <= (item.lowStockAlert || 2);
            const isOutOfStock = item.currentStock <= 0;
            const discountPercent = item.mrp && item.mrp > item.sellingPrice
              ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
              : 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 flex flex-col justify-between hover:border-[#16FFC6]/40 hover:shadow-xl hover:shadow-[#16FFC6]/5 transition-all group relative bg-white/5"
              >
                <div className="space-y-3">
                  {/* Product Image Container: Uncropped, centered, beautifully framed */}
                  <div className="relative w-full h-44 sm:h-48 rounded-xl sm:rounded-2xl bg-black/50 border border-white/10 p-3 overflow-hidden flex items-center justify-center group-hover:border-[#16FFC6]/40 transition-all">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-white/20" />
                    )}

                    <span className="absolute top-2.5 left-2.5 text-[9.5px] font-mono font-extrabold uppercase bg-[#070B0A]/85 text-[#16FFC6] border border-[#16FFC6]/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                      {item.code}
                    </span>

                    {discountPercent > 0 && (
                      <span className="absolute bottom-2.5 left-2.5 text-[9px] font-extrabold uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-full shadow-md font-mono">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {item.productCondition === 'Refurbished' && (
                      <span className="absolute top-2.5 right-2.5 text-[9.5px] font-extrabold uppercase bg-amber-400 text-black px-2 py-0.5 rounded-full shadow-md">
                        Refurbished
                      </span>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#16FFC6] truncate">
                        {item.category}
                      </span>
                      {(item.brand || item.productGroup) && (
                        <span className="text-[9.5px] text-white/40 font-mono shrink-0">
                          {item.brand || item.productGroup}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#16FFC6] transition-colors min-h-[2.5rem]">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1 leading-relaxed min-h-[2rem]">
                      {item.description || item.model || 'Genuine hardware verified by certified diagnostics engineers.'}
                    </p>
                  </div>
                </div>

                {/* Pricing & Stock Footer */}
                <div className="pt-3 border-t border-white/10 space-y-2.5 mt-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-lg font-black font-mono text-[#16FFC6] leading-none">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </div>
                      {item.mrp > item.sellingPrice && (
                        <div className="text-[10px] text-white/40 line-through font-mono mt-1">
                          MRP: ₹{item.mrp.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        isOutOfStock
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : isLowStock
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low (${item.currentStock})` : `In Stock`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(item)}
                      className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      Specs
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="py-2 rounded-xl bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-[#16FFC6]/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-3 max-w-md mx-auto my-12">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase">No Products Found</h3>
            <p className="text-xs text-white/60">Try adjusting your search query or selecting another category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#16FFC6]/20 text-[#16FFC6] font-bold text-xs uppercase hover:bg-[#16FFC6] hover:text-[#070B0A] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ULTRA-WIDE SPECS DETAILS MODAL (2-COLUMN HORIZONTAL LAYOUT - NO SCROLL NEEDED) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#16FFC6]/40 max-w-4xl lg:max-w-5xl w-full relative bg-[#070B0A] text-white shadow-2xl my-auto">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 2-Column Horizontal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Square Image & Refurbishment Notes (5 cols) */}
              <div className="md:col-span-5 space-y-4">
                {/* Clean Image Container */}
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 bg-black/60 p-4 flex items-center justify-center shadow-inner">
                  {selectedProduct.productImage ? (
                    <img
                      src={selectedProduct.productImage}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  ) : (
                    <Package className="w-20 h-20 text-white/20" />
                  )}
                </div>

                {/* Refurbishment & Quality Inspection Notes */}
                {(selectedProduct.productCondition === 'Refurbished' || selectedProduct.refurbishedDescription) && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" /> Certified Refurbishment Notes
                    </div>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                      {selectedProduct.refurbishedDescription || 'Tested 100% functional by certified hardware engineers with full store warranty.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Full Specifications & Price Breakdown (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Header Pills & Product Name */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#16FFC6] bg-[#16FFC6]/10 border border-[#16FFC6]/30 px-3 py-0.5 rounded-full">
                      {selectedProduct.code} • {selectedProduct.category}
                    </span>
                    <span
                      className={`text-xs font-extrabold uppercase px-3 py-0.5 rounded-full border ${
                        selectedProduct.productCondition === 'Refurbished'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {selectedProduct.productCondition || 'New'} Condition
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">{selectedProduct.name}</h2>
                </div>

                {/* Product Description / Remarks */}
                {selectedProduct.description && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/50">Product Remarks &amp; Technical Overview</span>
                    <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 font-sans">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Technical Specifications Grid Table */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/70">
                    <span>Product Group Series:</span>
                    <span className="text-white font-bold">{selectedProduct.productGroup}</span>
                  </div>
                  {selectedProduct.brand && (
                    <div className="flex justify-between text-white/70">
                      <span>Brand / Manufacturer:</span>
                      <span className="text-white font-bold">{selectedProduct.brand}</span>
                    </div>
                  )}
                  {selectedProduct.model && (
                    <div className="flex justify-between text-white/70">
                      <span>Model / Part Number:</span>
                      <span className="text-white font-bold">{selectedProduct.model}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/70">
                    <span>HSN Code &amp; GST Rate:</span>
                    <span className="text-[#16FFC6] font-bold">{selectedProduct.hsnCode} ({selectedProduct.gstRate}% GST)</span>
                  </div>
                  {selectedProduct.compatibleModels && (
                    <div className="flex justify-between text-white/70">
                      <span>Compatibility / System:</span>
                      <span className="text-white font-bold">{selectedProduct.compatibleModels}</span>
                    </div>
                  )}
                  {selectedProduct.storageLocation && (
                    <div className="flex justify-between text-white/70">
                      <span>Stock Storage Bin:</span>
                      <span className="text-white">{selectedProduct.storageLocation}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/70">
                    <span>Available Stock:</span>
                    <span className="text-emerald-400 font-bold">{selectedProduct.currentStock} {selectedProduct.uom}</span>
                  </div>

                  {/* Pricing Footer */}
                  <div className="flex justify-between items-center text-sm font-extrabold text-[#16FFC6] pt-2.5 border-t border-white/10 font-sans">
                    <div>
                      <span>Selling Price:</span>
                      {selectedProduct.mrp > selectedProduct.sellingPrice && (
                        <span className="text-xs text-white/40 line-through ml-2 font-mono">
                          MRP: ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-black font-mono">₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                  >
                    Close Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#16FFC6] hover:bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-[#16FFC6]/20 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart &amp; Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />

      <CtaSection />
      <Footer />
    </main>
  );
}
