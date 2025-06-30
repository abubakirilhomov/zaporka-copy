"use client";
import Catalog from "@/components/shop/Catalog/Catalog";
import CustomSwiper from "@/components/ui/CustomSwiper/CustomSwiper";
import Footer from "@/components/ui/Footer/Footer";
import NavCombined from "@/components/ui/Navbar/NavCombined";
import { TiShoppingCart } from "react-icons/ti";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {
  const cartItems = useSelector((state) => state.cart);

  return (
    <>
      <header>
        <NavCombined />
        <CustomSwiper />
      </header>
      <main className="px-3 relative">
        <Catalog />
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
      <footer>
        <Footer />
      </footer>
    </>
  );
}
