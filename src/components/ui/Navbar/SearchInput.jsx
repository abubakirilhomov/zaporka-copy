"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchInput({ onSearch, className = "", mobile = false }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setIsLoading(true);
        setError(null);
        axios
          .get(`${apiUrl}/api/v1/products/search?query=${encodeURIComponent(searchQuery)}`)
          .then((res) => {

            setSearchResults(res.data.results || []);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setError("Ошибка при поиске");
            setIsLoading(false);
          });
      } else {
        setSearchResults([]);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, apiUrl]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery && mobile) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]); // Clear results after navigation
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <label className="input border rounded-sm flex items-center h-10 border-primary bg-base-100 w-full">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Поиск товаров..."
          className="text-base-content text-lg bg-transparent focus:outline-none w-full"
          aria-label="Поиск товаров"
        />
        <svg
          className="h-4 w-4 text-base-content flex-shrink-0 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
      </label>
      {!mobile && (
        <>
          {isLoading && <div className="absolute top-12 left-0 p-2 bg-base-100 w-full shadow rounded">Загрузка...</div>}
          {error && <div className="absolute top-12 left-0 p-2 bg-base-100 w-full shadow rounded text-error">{error}</div>}
          {searchResults.length > 0 && !isLoading && !error && (
            <div className="absolute top-12 left-0 bg-base-100 w-full shadow rounded max-h-64 overflow-y-auto z-50">
              {searchResults.map((item, i) => (
                <Link
                  key={item.id || i}
                  href={`/products/product/${item._id}`}
                  className="block p-2 border-b border-base-200 hover:bg-base-200"
                  onClick={() => setSearchResults([])}
                >
                  {item.title || item.name}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}