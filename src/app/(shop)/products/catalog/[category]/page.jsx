'use client';

import { useParams } from 'next/navigation';
import useFetch from '@/hooks/useFetch/useFetch';
import Loading from '@/components/ui/Loading/Loading';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductsCard/ProductsCard';
import CartModal from '@/components/ui/CartModal/CartModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct, addToCart } from '@/redux/slices/cartSlice';
import { BsCartPlus } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import CatalogSidebar from '@/components/ui/CatalogSidebar/CatalogSidebar';
import Pagination from '@/components/ui/Pagination/Pagination';

const Page = () => {
  const { category } = useParams();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const shouldReduceMotion = useReducedMotion();
  const dispatch = useDispatch();
  const { selectedProduct, userData } = useSelector((state) => state.cart);

  // Получение продуктов по категории
  const { data: products, loading: productsLoading, error: productsError, refetch } = useFetch(
    `${serverUrl}/api/v1/products/by-category/${category}`,
    {}
  );

  // Получение списка категорий
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch(
    `${serverUrl}/api/v1/categories`,
    {}
  );

  const [imageErrors, setImageErrors] = useState({});
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Количество продуктов на странице

  const initializeImageErrors = useCallback(() => {
    if (!products) return;
    setImageErrors((prev) => {
      const newErrors = { ...prev };
      products.forEach((product, index) => {
        const productId = product._id || product.id || `${product.title}-${product?.price}-${index}`;
        if (!(productId in newErrors)) {
          newErrors[productId] = false;
        }
      });
      return newErrors;
    });
  }, [products]);

  useEffect(() => {
    if (products && Object.keys(imageErrors).length === 0) {
      initializeImageErrors();
    }
  }, [products, initializeImageErrors]);

  const handleRefetch = useCallback(() => {
    if (isRefetching) return;
    setIsRefetching(true);
    refetch();
    setTimeout(() => setIsRefetching(false), 1000);
  }, [refetch, isRefetching]);

  const handleAddToCart = (product) => {
    const price = Number(product?.price);
    if (isNaN(price)) {
      toast.error('Ошибка: некорректная цена товара');
      return;
    }
    toast.success(`${product.title} добавлен в корзину!`);
    const productData = {
      id: product._id || product.id,
      title: product.title,
      price,
      currency: product.currency || '₽',
      quantity: 1,
    };

    const isUserDataComplete =
      userData.firstName &&
      userData.lastName &&
      userData.phoneNumber &&
      userData.address;

    if (isUserDataComplete) {
      dispatch(addToCart(productData));
      toast.success(`${product.title} добавлен в корзину!`);
      dispatch(setSelectedProduct(productData));
      window.my_modal_1.showModal();
    }
    toast.success(`${product.title} добавлен в корзину!`);
  };

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: 'easeOut' },
        whileHover: { y: 0, transition: { duration: 0.2 } },
      };

  if (!serverUrl || !category) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <p className="text-error text-center mt-10">
          {serverUrl ? 'Ошибка: категория не указана' : 'Ошибка: сервер не настроен'}
        </p>
      </motion.main>
    );
  }

  // Логика пагинации
  const totalProducts = products ? products.length : 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products ? products.slice(startIndex, endIndex) : [];

  const decodedCategory = decodeURIComponent(category);
  return (
    <>
      <Head>
        <title>Категория: {decodedCategory} | Ваш Магазин</title>
        <meta
          name="description"
          content={`Просмотрите товары в категории ${decodedCategory} - высококачественные изделия с доставкой.`}
        />
      </Head>
      <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full md:w-64 mb-8 md:mb-0">
          {categoriesError && (
            <p className="text-error">
              Ошибка загрузки категорий: {categoriesError.message || 'Неизвестная ошибка'}
            </p>
          )}
          {!categoriesError && (
            <CatalogSidebar categories={categories || []} loading={categoriesLoading} />
          )}
        </div>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          <CartModal
            selectedProduct={selectedProduct}
            setSelectedProduct={(product) => dispatch(setSelectedProduct(product))}
          />

          <h1 className="text-3xl font-bold">Категория: {decodedCategory}</h1>
          <nav aria-label="Breadcrumb" className="pt-5">
            <ol className="flex space-x-2 text-neutral-400">
              <li>
                <Link href="/" className="hover:text-primary">
                  Главная
                </Link>
              </li>
              <li> / </li>
              <li>
                <Link href="/catalog" className="hover:text-primary">
                  Каталог
                </Link>
              </li>
              <li> / {decodedCategory}</li>
            </ol>
          </nav>


          {productsLoading && (
            <div className="flex justify-center mt-10">
              <Loading height={"30vh"} aria-label="Загрузка товаров" />
            </div>
          )}

          {productsError && (
            <div className="mt-10 text-center">
              <p className="text-error">
                Ошибка загрузки товаров:{' '}
                {productsError instanceof Error ? productsError.message : 'Неизвестная ошибка'}
              </p>
              <button
                onClick={handleRefetch}
                disabled={isRefetching}
                className={`mt-4 px-4 py-2 text-base-300 rounded ${
                  isRefetching
                    ? 'cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!productsLoading && !productsError && (
            <div className="mt-10">
              {products && products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2">
                    {currentProducts.map((product, index) => (
                      <ProductCard
                        key={product._id || product.id || `${product.title}-${product?.price}-${index}`}
                        product={product}
                        index={index}
                        motionProps={motionProps}
                        imageErrors={imageErrors}
                        setImageErrors={setImageErrors}
                        setSelectedProduct={(product) => dispatch(setSelectedProduct(product))}
                        renderButton={() => (
                          <button
                            className="mt-3 btn w-full relative overflow-hidden btn-primary font-semibold py-3 px-6 rounded-xl
                              shadow-lg hover:shadow-xl
                              transform transition-all duration-300 ease-in-out
                              hover:scale-105 active:scale-95
                              flex items-center justify-center gap-2
                              group"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            aria-label={`Добавить ${product.title} в корзину`}
                          >
                            <span className="relative z-10">Добавить в корзину</span>
                            <BsCartPlus
                              size={20}
                              className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                            />
                            <span className="absolute inset-0 bg-base-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                          </button>
                        )}
                      />
                    ))}
                  </div>
                  {/* Используем компонент Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="text-center mt-10">
                  <p className="text-neutral-500">Товары в категории не найдены</p>
                  <Link
                    href="/products/catalog"
                    className="mt-4 inline-block px-4 py-2 bg-primary text-base-100 rounded hover:bg-primary-dark"
                  >
                    Вернуться в каталог
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.main>
      </div>
    </>
  );
};

export default Page;