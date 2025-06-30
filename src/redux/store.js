// redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import companyInfoReducer from './slices/companyInfoSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Сохранять только cart (добавьте 'auth', если нужно)
};

// Комбинируем редьюсеры в единый корневой редьюсер
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  companyInfo: companyInfoReducer,
});

// Оборачиваем корневой редьюсер в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);