"use client";

import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch/useFetch";
import Loading from "@/components/ui/Loading/Loading";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProduct, addToCart } from "@/redux/slices/cartSlice";
import { BsCartPlus } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import CartModal from "@/components/ui/CartModal/CartModal";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ProductPage = () => {
  const { id } = useParams();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const shouldReduceMotion = useReducedMotion();
  const { selectedProduct, userData } = useSelector((state) => state.cart);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const [quantity, setQuantity] = useState(1); // Initial quantity state
  const [inputValue, setInputValue] = useState("1");

  const {
    data: product,
    loading,
    error,
  } = useFetch(`${serverUrl}/api/v1/products/${id}`, {});
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  useEffect(() => {
    if (product?.stock > 0) {
      setQuantity(1);
      setInputValue("1");
    }
  }, [product]);

  // Handle quantity increment
  const handleIncrement = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const input = Number(e.target.value);
    if (isNaN(input)) return;
    const value = Math.max(1, Math.min(product?.stock || 1, input));
    setQuantity(value);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product) return;

    const price = Number(product.price);
    if (isNaN(price)) {
      toast.error("Ошибка: некорректная цена товара");
      return;
    }

    const productData = {
      id: product._id || product.id,
      title: product.title,
      price,
      currency: product.currency || "₽",
      quantity,
    };

    const isUserDataComplete =
      userData.firstName &&
      userData.lastName &&
      userData.phoneNumber &&
      userData.address;

    if (isUserDataComplete) {
      dispatch(addToCart(productData));
      toast.success(`${product.title} добавлен в корзину!`);
    } else {
      dispatch(setSelectedProduct(productData));
      // Open the modal programmatically
      const modal = document.getElementById("my_modal_1");
      if (modal) {
        modal.showModal();
      }
    }
  };

  if (!serverUrl || !id) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <p className="text-error text-center mt-10">
          {serverUrl ? "Ошибка: товар не указан" : "Ошибка: сервер не настроен"}
        </p>
      </motion.main>
    );
  }

  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex justify-center mt-10">
          <Loading aria-label="Загрузка товара" />
        </div>
      </motion.main>
    );
  }

  if (error || !product) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <p className="text-error text-center mt-10">
          Ошибка загрузки товара:{" "}
          {error instanceof Error ? error.message : "Товар не найден"}
        </p>
        <Link
          href="/products/catalog"
          className="mt-4 inline-block px-4 py-2 bg-primary text-base-300 rounded hover:bg-primary-dark"
        >
          Вернуться в каталог
        </Link>
      </motion.main>
    );
  }

  const images = (product.images || [])
    .filter(Boolean)
    .map((img) => `${serverUrl}${img}`); // Use the new images array

  return (
    <>
      <Head>
        <title>{product.title} | Ваш Магазин</title>
        <meta
          name="description"
          content={`Подробная информация о товаре ${product.title} - высококачественное изделие с доставкой.`}
        />
      </Head>

      <motion.main
        {...motionProps}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <CartModal
          selectedProduct={selectedProduct}
          setSelectedProduct={(product) =>
            dispatch(setSelectedProduct(product))
          }
        />


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
            <li> / </li>
            <li>
              <Link
                href={`/products/catalog/${product?.category?.name}`}
                className="hover:text-primary"
              >
                {product.category?.name || "Без категории"}
              </Link>
            </li>
            <li> / {product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Image Swiper */}
          <div className="relative">
            {product.stock > 0 && (
              <span className="absolute z-10 top-2 left-2 badge badge-success rounded-2xl text-base-100 font-bold">
                В наличии
              </span>
            )}
            {product.views > 50 && (
              <span className="absolute z-10 top-2 right-2 badge badge-info rounded-2xl text-base-100 font-bold">
                Популярно
              </span>
            )}
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              className="w-full rounded-lg"
            >
              {images.length > 0 ? (
                images.map((img, index) => (
                  <SwiperSlide key={index}>
                    {!imageErrors[img] ? (
                      <Image
                        src={img}
                        alt={`Изображение ${product.title} ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-96 object-cover rounded-lg"
                        priority={index === 0}
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [img]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-96 flex items-center justify-center rounded-lg bg-neutral-100">
                        <span className="text-neutral-500 text-sm text-center">
                          Изображение недоступно
                        </span>
                      </div>
                    )}
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-full h-96 flex items-center justify-center rounded-lg bg-neutral-100">
                    <span className="text-neutral-500 text-sm text-center">
                      Изображение недоступно
                    </span>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
            {images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={3}
                freeMode
                watchSlidesProgress
                modules={[Thumbs]}
                className="mt-4"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    {!imageErrors[img] ? (
                      <Image
                        src={img}
                        alt={`Миниатюра ${product.title} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded cursor-pointer"
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [img]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center rounded bg-neutral-100 cursor-pointer">
                        <span className="text-neutral-500 text-xs text-center">
                          Недоступно
                        </span>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">
              {product.title || "Без названия"}
            </h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              {product.price
                ? `${product.price} ${product.currency || "UZS"}`
                : "Цена неизвестна"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-neutral-700 text-sm">
              {product.type && (
                <p>
                  <strong>Тип:</strong> {product.type}
                </p>
              )}
              {product.size && (
                <p>
                  <strong>Размер:</strong> {product.size}
                </p>
              )}
              {product.weight && (
                <p>
                  <strong>Вес:</strong> {product.weight}
                </p>
              )}
              {product.maxTemperature && (
                <p>
                  <strong>Макс. температура:</strong> {product.maxTemperature}°C
                </p>
              )}
              {product.pressure && (
                <p>
                  <strong>Давление:</strong> {product.pressure} бар
                </p>
              )}
              {product.material && (
                <p>
                  <strong>Материал:</strong> {product.material}
                </p>
              )}
              {product.category?.name && (
                <p>
                  <strong>Категория:</strong> {product.category.name}
                </p>
              )}
              {product.controlType && (
                <p>
                  <strong>Тип управления:</strong> {product.controlType}
                </p>
              )}
              {product.stock !== undefined && (
                <p>
                  <strong>В наличии:</strong> {product.stock} шт.
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => {
                  if (quantity > 1) {
                    const newQty = quantity - 1;
                    setQuantity(newQty);
                    setInputValue(String(newQty));
                  }
                }}
                className="btn btn-outline btn-primary w-10 h-10 rounded-full"
                aria-label="Уменьшить количество"
              >
                -
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setInputValue(val);
                  }
                }}
                onBlur={() => {
                  const num = Number(inputValue);
                  const stock = product?.stock || 1;
                  const validated = Math.max(1, Math.min(stock, num || 1));
                  setQuantity(validated);
                  setInputValue(String(validated));
                }}
                className="input input-bordered w-20 text-center"
                aria-label="Количество товара"
              />

              <button
                onClick={() => {
                  const stock = product?.stock || Infinity;
                  if (quantity < stock) {
                    const newQty = quantity + 1;
                    setQuantity(newQty);
                    setInputValue(String(newQty));
                  }
                }}
                className="btn btn-outline btn-primary w-10 h-10 rounded-full"
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 relative overflow-hidden"
                aria-label="Добавить в корзину"
              >
                <span className="absolute inset-0 bg-base-100 opacity-0 hover:opacity-10 transition-opacity duration-300 z-0"></span>
                <BsCartPlus className="relative z-10" />
                <span className="relative z-10">Добавить в корзину</span>
              </button>
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default ProductPage;
