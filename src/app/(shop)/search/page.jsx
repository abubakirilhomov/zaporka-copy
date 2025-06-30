"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${apiUrl}/api/v1/products/search?query=${encodeURIComponent(query)}`
          );
          // Extract the 'results' array from the response
          setSearchResults(response.data.results || []);
        } catch (err) {
          console.error(err);
          setError("Ошибка при поиске");
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [query, apiUrl]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Результаты поиска для: "{query}"</h1>
      {isLoading && <div className="p-2 bg-base-100 w-full shadow rounded">Загрузка...</div>}
      {error && <div className="p-2 bg-base-100 w-full shadow rounded text-error">{error}</div>}
      {searchResults.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((item, index) => (
            <li key={index} className="p-4 bg-base-100 rounded shadow">
              <Link href={`/products/product/${item._id}`}>
                <h2 className="text-lg font-semibold">{item.title || item.name}</h2>
              </Link>
            </li>
          ))}
        </ul>
      ) : !isLoading && !error ? (
        <p>Ничего не найдено</p>
      ) : null}
    </div>
  );
}