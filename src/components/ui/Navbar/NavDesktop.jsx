"use client";

import { FaTelegram } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images/logo.png"; // Adjust path based on your structure
import SearchInput from "./SearchInput"; // Adjust path based on your structure

export function NavDesktop() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "999001507";
  const telegramLink = process.env.NEXT_PUBLIC_TELEGRAM_LINK || "https://t.me/DoniyorSamadov";

  return (
    <nav className="hidden md:flex justify-between items-center px-10 py-4 bg-base-100 shadow sticky top-0 z-50">
      <Link href="/" aria-label="Главная страница">
        <Image src={logo} alt="Запорка" width={150} height={50} priority />
      </Link>

      <div className="relative w-1/2">
        <SearchInput />
      </div>

      <div className="flex gap-4 items-center">
        <a
          href={`tel:${phoneNumber}`}
          className="btn btn-outline btn-success"
          aria-label="Позвонить"
        >
          <IoMdCall aria-hidden="true" /> Позвонить
        </a>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-info"
          aria-label="Написать в Telegram"
        >
          <FaTelegram aria-hidden="true" /> Написать
        </a>
      </div>
    </nav>
  );
}