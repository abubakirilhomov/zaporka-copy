'use client';

import { useSelector, useDispatch } from 'react-redux';
import useFetch from '@/hooks/useFetch/useFetch';
import { clearCart } from '@/redux/slices/cartSlice';
import Loading from '@/components/ui/Loading/Loading';
import { toast } from 'react-toastify';
import { useState } from 'react';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { userData, items: cartItems } = useSelector((state) => state.cart);
  const store = useSelector((store) => store)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productIds = cartItems.map((item) => item.id).join(',');
  const { data: products, loading, error } = useFetch(
    productIds ? `${serverUrl}/api/v1/products?ids=${productIds}` : null,
    {}
  );

  const handleBuy = async () => {
    if (
      !cartItems.length ||
      !userData.firstName ||
      !userData.lastName ||
      !userData.phoneNumber ||
      !userData.address
    ) {
      toast.error('Пожалуйста, заполните данные и добавьте товары в корзину');
      return;
    }

    setIsSubmitting(true);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0),
      0
    );
    if (isNaN(totalPrice)) {
      toast.error('Ошибка: некорректная цена товаров');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      products: cartItems.map((item) => item.id), // Send array of ObjectId strings
      ...userData,
      totalPrice,
    };

    try {
      const response = await fetch(`${serverUrl}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Заказ успешно отправлен!');
        dispatch(clearCart());
        document.getElementById('cart_drawer').checked = false;
      } else {
        throw new Error(data.message || 'Ошибка при оформления заказа');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Ошибка при оформления заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer drawer-end">
      <input id="cart_drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="cart_drawer" className="btn btn-primary drawer-button">
          Открыть корзину
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="cart_drawer" className="drawer-overlay"></label>
        <div className="p-4 w-80 h-full bg-base-100 text-base-content">
          <h2 className="text-xl font-bold mb-4">Ваша корзина</h2>
          {loading && <Loading aria-label="Загрузка товаров" />}
          {error && (
            <p className="text-error">
              Ошибка: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
            </p>
          )}
          {!loading && !error && (
            <div>
              {cartItems.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="border p-2 rounded">
                        <h3 className="text-md font-medium">{item.title}</h3>
                        <p>Цена: {item.price} ₽</p>
                        <p>Количество: {item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mt-4">Данные для доставки</h3>
                  <div className="border p-2 rounded mt-2">
                    <p><strong>Имя:</strong> {userData.firstName || 'Не указано'}</p>
                    <p><strong>Фамилия:</strong> {userData.lastName || 'Не указано'}</p>
                    <p><strong>Телефон:</strong> {userData.phoneNumber || 'Не указано'}</p>
                    <p><strong>Адрес:</strong> {userData.address || 'Не указано'}</p>
                  </div>
                  <button
                    onClick={handleBuy}
                    disabled={isSubmitting}
                    className="mt-4 btn w-full relative overflow-hidden
                      bg-gradient-to-r from-success to-success
                      hover:from-success hover:to-success
                      text-base-300 font-semibold py-2 px-4 rounded-lg
                      shadow-lg hover:shadow-xl
                      transform transition-all duration-300 ease-in-out
                      hover:scale-105 active:scale-95
                      flex items-center justify-center gap-2
                      group"
                    aria-label={isSubmitting ? 'Отправка заказа...' : 'Купить'}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        'Купить'
                      )}
                    </span>
                    <span className="absolute inset-0 bg-base-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  </button>
                </>
              ) : (
                <p className="text-neutral-500">Корзина пуста</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;