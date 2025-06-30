"use client";

import React, { useState, useEffect } from "react";
import { FiGrid, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CatalogSidebar = ({ categories, loading }) => {
  const [open, setOpen] = useState(false); // Default to false, will be updated in useEffect

  // Set initial open state based on screen size
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // Tailwind's 'md' breakpoint
    setOpen(!isMobile); // Open by default on non-mobile (≥768px), closed on mobile (<768px)
  }, []);

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <aside className="w-full rounded-md md:w-64 bg-base-200 border border-base-200 p-4" aria-busy={loading}>
      {/* Заголовок */}
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-bold text-lg flex items-center gap-2">
          <FiGrid /> КАТАЛОГ
        </h2>
        {open ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
      </div>

      {/* Список категорий с анимацией */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="categories"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col divide-y divide-base-200 border border-base-200 rounded-md">
              {loading ? (
                // Skeleton Loader with DaisyUI
                <>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="px-4 py-3 flex justify-between items-center">
                      <div className="skeleton h-4 w-3/4"></div>
                      <div className="skeleton h-4 w-4"></div>
                    </div>
                  ))}
                </>
              ) : safeCategories.length > 0 ? (
                safeCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products/catalog/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-3 text-sm bg-base-100 hover:bg-base-200 cursor-pointer flex justify-between items-center"
                  >
                    <span>{cat.name}</span>
                    <FiChevronRight size={14} />
                  </Link>
                ))
              ) : (
                <p className="text-base-content px-4 py-3">Категории не найдены</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default CatalogSidebar;