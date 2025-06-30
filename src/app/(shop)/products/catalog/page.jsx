'use client';
import CatalogCard from '@/components/ui/CatalogCard/CatalogCard';
import Loading from '@/components/ui/Loading/Loading';
import useFetch from '@/hooks/useFetch/useFetch';
import React from 'react';

const Page = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const { data: categories, loading, error } = useFetch(`${serverUrl}/api/v1/categories`);
  return (
    <main className="container mx-auto md:px-4 py-8">
      <h1 className="text-3xl font-bold">Каталог</h1>
      <p className="text-neutral-400 pt-5">Главная - Каталог</p>

      {loading && <Loading />}
      {error && (
        <p className="mt-10 text-error">
          Ошибка загрузки категорий: {error.message || 'Неизвестная ошибка'}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-10">
          {categories && categories.length > 0 ? (
            <CatalogCard categories={categories} />
          ) : (
            <p className="text-neutral-500">Категории не найдены</p>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;