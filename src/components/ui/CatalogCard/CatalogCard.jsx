"use client"; // Required for client-side hooks and Framer Motion
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const CatalogCard = ({ categories, serverUrl }) => {
  return (
    <div className="md:gap-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-1">
      {categories.map((category) => {
        const [isImageLoaded, setIsImageLoaded] = useState(false);
        const [hasImageError, setHasImageError] = useState(false); // Новое состояние для ошибки загрузки

        return (
          <motion.div
            key={category.name} // Use unique identifier instead of index
            initial={{ opacity: 0, scale: 0.9 }} // Start faded and slightly scaled down
            animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and scale
            transition={{ duration: 0.3, ease: "easeOut" }} // Smooth animation
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} // Smooth hover effect
            className="w-full sm:max-w-[100%] md:max-w-[354px] lg:max-w-[300px] md:mb-2 sm:mb-0"
          >
            <Link
              href={`/products/catalog/${category.slug}`}
              className="p-6 sm:p-8 flex-1 h-full border border-neutral-400 md:rounded flex flex-col justify-between items-center"
            >
              <div className="relative w-full h-32 mb-3">
                {!isImageLoaded && !hasImageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="loading loading-ring loading-md text-primary"></span>
                  </div>
                )}
                {hasImageError ? (
                  // Запасное изображение или заполнитель
                  <div className="w-full h-32 bg-base-200 flex flex-col items-center justify-center rounded">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-neutral-500">{category.name}</span>
                  </div>
                ) : (
                  <img
                    src={`${serverUrl}${category.image || "/placeholder-image.png"}`}
                    alt={`${category.name}`}
                    className={`w-full h-32 object-cover transition-opacity duration-300 ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => {
                      setIsImageLoaded(true); // Скрываем лоадер
                      setHasImageError(true); // Устанавливаем ошибку
                    }}
                  />
                )}
              </div>
              <motion.span
                className="hover:text-primary font-light text-center line-clamp-2"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {category.name}
              </motion.span>
              <p className="text-neutral-500 md:text-sm text-xs text-center pt-3 line-clamp-2">
                {category?.productsQuantity} товаров
              </p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CatalogCard;