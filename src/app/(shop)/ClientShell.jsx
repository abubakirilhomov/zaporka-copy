"use client";

import Navbar from "@/components/ui/Navbar/NavCombined";
import Footer from "@/components/ui/Footer/Footer";
import Link from "next/link";
import { TiShoppingCart } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { fetchCompanyInfo } from "@/redux/slices/companyInfoSlice";
import { useEffect } from "react";

export default function ClientShell({ children }) {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow relative container mx-auto px-2 py-8">
        {children}
        <Link
          href="/cart"
          className="py-3 bg-primary z-10 text-base-100 px-5 fixed right-0 md:top-[30%] top-[25%] flex items-center gap-1 rounded-l-2xl rounded-none"
        >
          <TiShoppingCart />
          <span className="rounded text-warning font-bold">
            {cartItems?.items?.length != 0 ? cartItems?.items?.length : ""}
          </span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
