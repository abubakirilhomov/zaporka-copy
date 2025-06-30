// app/ClientLayout.jsx
'use client';

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";

export default function ClientLayout({ children }) {
  return <Provider store={store}>{children}</Provider>;
}