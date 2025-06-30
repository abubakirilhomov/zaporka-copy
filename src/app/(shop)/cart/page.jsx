"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import Head from "next/head";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Loading from "@/components/ui/Loading/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const maxQuantity = item.stock || Infinity;
  const [isEditing, setIsEditing] = useState(false);

  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty) && newQty >= 1 && newQty <= maxQuantity) {
      onIncrement(item.id, newQty);
    }
  };

  return (
    <li className="card bg-base-100 shadow-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-base-300 last:border-b-0">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-primary">{item.title}</h3>
        <p className="text-sm text-neutral-600 mt-1">
          Цена: {item.price} {"UZS"}
        </p>
        {item.stock && (
          <p className="text-xs text-neutral-500 mt-1">
            В наличии: {item.stock} шт.
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onDecrement(item.id)}
          disabled={item.quantity <= 1}
          className="btn btn-sm btn-outline btn-primary w-10 h-10 rounded-full transition-transform hover:scale-105 disabled:opacity-50"
          aria-label={`Уменьшить количество ${item.title} до ${item.quantity - 1}`}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={item.quantity}
          onChange={handleQuantityChange}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className="input input-sm w-16 text-center bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          aria-label={`Количество ${item.title}, сейчас ${item.quantity}`}
        />
        <button
          onClick={() => onIncrement(item.id)}
          disabled={item.quantity >= maxQuantity}
          className="btn btn-sm btn-outline btn-primary w-10 h-10 rounded-full transition-transform hover:scale-105 disabled:opacity-50"
          aria-label={`Увеличить количество ${item.title} до ${item.quantity + 1}`}
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="btn btn-sm btn-error w-10 h-10 rounded-full transition-transform hover:scale-105"
          aria-label={`Удалить ${item.title} из корзины`}
        >
          ✕
        </button>
      </div>
    </li>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { userData, items: cartItems } = useSelector((state) => state.cart);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [cartItems]
  );

  const handleIncrement = (id, newQty = null) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const maxQuantity = item.stock || Infinity;
      const quantity = newQty !== null ? newQty : item.quantity + 1;
      if (quantity <= maxQuantity) {
        dispatch(updateQuantity({ id, quantity }));
      } else {
        toast.info(`Максимум в наличии: ${maxQuantity} шт.`);
      }
    }
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (id) => dispatch(removeFromCart(id));

  const handleBuy = async () => {
    if (!cartItems.length) return toast.error("Корзина пуста");
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.phoneNumber ||
      !userData.address
    ) {
      return toast.error("Заполните все данные для доставки");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${serverUrl}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cartItems.map((item) => item.id),
          ...userData,
          totalPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Ошибка при оформлении");
      toast.success("Заказ успешно оформлен!");
      dispatch(clearCart());
    } catch (err) {
      toast.error(
        <>
          {err.message || "Ошибка"}
          <button onClick={handleBuy} className="btn btn-sm btn-link ml-2">
            Повторить
          </button>
        </>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  return (
    <>
      <Head>
        <title>Корзина | Ваш Магазин</title>
        <meta
          name="description"
          content="Просмотрите товары в корзине и оформите заказ."
        />
      </Head>

      <motion.main
        {...motionProps}
        className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <nav aria-label="Breadcrumb" className="pt-5 mb-6">
          <ol className="flex space-x-2 text-neutral-400">
            <li>
              <Link href="/" className="hover:text-primary">
                Главная
              </Link>
            </li>
            <li> / </li>
            <li>
              <span className="text-neutral-700 font-semibold">Корзина</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-8 text-primary">Ваша корзина</h1>

        {cartItems.length > 0 ? (
          <>
            <ul className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </ul>

            <div className="card bg-base-200 p-6 shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary">Данные для доставки</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-700 text-sm">
                <p><strong>Имя:</strong> {userData.firstName || "—"}</p>
                <p><strong>Фамилия:</strong> {userData.lastName || "—"}</p>
                <p><strong>Телефон:</strong> {userData.phoneNumber || "—"}</p>
                <p><strong>Адрес:</strong> {userData.address || "—"}</p>
              </div>
            </div>

            <div className="text-right text-2xl font-bold mb-6 text-success">
              <mark className="p-2">Итого: {totalPrice.toFixed(2)} {"UZS"}</mark>
            </div>

            <button
              onClick={handleBuy}
              disabled={isSubmitting}
              className="btn btn-primary w-full py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              {isSubmitting ? <Loading /> : "Оформить заказ"}
            </button>
          </>
        ) : (
          <motion.div
            {...motionProps}
            className="text-center text-neutral-500"
          >
            <p className="mb-6 text-lg">Корзина пуста</p>
            <button
              className="btn btn-primary py-2 px-6 rounded-xl hover:bg-primary-dark transition-colors"
              onClick={() => router.push("/products/catalog")}
            >
              Перейти к покупкам
            </button>
          </motion.div>
        )}

      </motion.main>
    </>
  );
};

export default CartPage;