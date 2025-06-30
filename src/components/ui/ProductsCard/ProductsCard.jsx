// components/ui/ProductsCard/ProductsCard.jsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BsCartPlus } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

const ProductCard = ({
  product,
  index,
  motionProps,
  imageErrors,
  setImageErrors,
  setSelectedProduct,
}) => {
  const dispatch = useDispatch();
  const productId =
    product._id || product.id || `${product.title}-${product.price}-${index}`;
  const imageSrc = `${process.env.NEXT_PUBLIC_SERVER_URL}${product.images}` || '/placeholder-image.png';
  const altText = product.title
    ? `Изображение ${product.title}`
    : 'Изображение товара';

  return (
    <motion.div {...motionProps} className="flex">
      <div className="relative flex flex-col items-center w-full">
        <Link
          href={`/products/product/${productId}`}
          className="relative p-4 rounded-2xl border border-neutral-300 flex flex-col items-center w-full hover:shadow-lg transition-shadow"
          aria-label={`Посмотреть ${product.title || 'товар'}`}
        >
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

          <div className="relative w-full h-32 mb-3">
            {!imageErrors[productId] ? (
              <Image
                src={imageSrc}
                alt={altText}
                width={150}
                height={128}
                className="w-full h-full object-cover rounded"
                priority={false}
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [productId]: true }))
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded">
                <span className="text-neutral-500 text-sm text-center">
                  {altText}
                </span>
              </div>
            )}
          </div>

          <span className="hover:text-primary font-medium text-center line-clamp-2">
            {product.title || 'Без названия'}
          </span>
          <p className="text-neutral-800 font-bold text-md text-center mt-1">
            {product.price
              ? `${product.price} ${product.currency || 'UZS'}`
              : 'Цена неизвестна'}
          </p>
          <div className="mt-2 text-xs hidden md:block text-neutral-600 text-center space-y-1">
            {product.material && <p>Материал: {product.material}</p>}
            {product.steelGrade && <p>Марка стали: {product.steelGrade}</p>}
            {product.workingPressure && (
              <p>Рабочее давление: {product.workingPressure} бар</p>
            )}
          </div>
          <button
            className="mt-3 btn w-full relative btn-primary font-semibold py-3 px-6 rounded-xl
              shadow-lg hover:shadow-xl
              transform transition-all duration-300 ease-in-out
              hover:scale-105 active:scale-95
              flex items-center justify-center gap-2 text-xs
              group"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedProduct({
                id: product._id || product.id,
                title: product.title,
                price: Number(product.price),
                currency: product.currency || 'UZS',
              }));
              window.my_modal_1.showModal();
            }}
          >
            <span className="relative z-10">В корзину</span>
            <BsCartPlus
              className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-base-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;