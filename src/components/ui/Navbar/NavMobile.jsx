"use client";

import {
  FaBars,
  FaGift,
  FaTools,
  FaTelegram,
  FaHeart,
  FaChartBar,
  FaChevronRight,
} from "react-icons/fa";
import { CgMenuGridO, CgProfile } from "react-icons/cg";
import { MdCategory, MdContactPhone } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images/logo.png";
import SearchInput from "./SearchInput";
import { TiShoppingCart } from "react-icons/ti";
import { TbBrandBulma } from "react-icons/tb";

export default function NavMobile({ info }) {
  const phoneNumber = info?.phoneNumbers[0] || "999001507";
  const telegramLink = info?.telegram || "https://t.me/DoniyorSamadov";

  const pages = [
    { name: "Главная", href: "/", icon: <CgMenuGridO className="text-2xl" /> },
    {
      name: "Каталог",
      href: "/products/catalog",
      icon: <MdCategory className="text-lg text-base-content" />,
    },
    {
      name: "Компания",
      href: "/about",
      icon: <CgProfile className="text-lg text-base-content" />,
    },
    {
      name: "Контакты",
      href: "/contacts",
      icon: <MdContactPhone className="text-lg text-base-content" />,
    },
  ];

  return (
    <div className="drawer drawer-start md:hidden sticky top-0 z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-100 shadow-xs px-4 py-3 border-b border-base-300">
        <div className="flex justify-between items-center">
          <label
            htmlFor="my-drawer"
            className="p-2 cursor-pointer"
            aria-label="Открыть меню"
          >
            <FaBars className="w-6 h-6 text-base-content" />
          </label>

          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <Image
              src={logo}
              alt="Логотип компании"
              width={100}
              height={40}
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="bg-base-300 p-2 rounded-2xl"
              aria-label="Позвонить"
            >
              <IoMdCall className="text-xl text-success" aria-hidden="true" />
            </a>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-base-300 p-2 rounded-2xl"
              aria-label="Написать в Telegram"
            >
              <FaTelegram className="text-xl text-info" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-2">
          <SearchInput className="" mobile={true} />
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="flex flex-col justify-between h-full w-64 bg-base-100">
          <div className="px-4 py-3">
            <div className="flex justify-end mb-4">
              <label
                htmlFor="my-drawer"
                className="cursor-pointer"
                aria-label="Закрыть меню"
              >
                <RxCross2 className="text-xl text-base-content hover:text-primary transition" />
              </label>
            </div>

            <ul className="divide-y divide-base-300">
              {pages.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-center active:scale-95 duration-300 justify-between px-4 py-3 hover:bg-base-300 rounded text-base-content"
                    onClick={() =>
                      (document.getElementById("my-drawer").checked = false)
                    }
                  >
                    <span className="flex items-center gap-3">
                      {item.icon} {item.name}
                    </span>
                    <span className="text-lg font-bold text-base-content">
                      <FaChevronRight className="text-xs" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={"/cart"}
            className="active:scale-95 duration-300 border-base-300 px-7 py-3 space-y-3 text-sm text-base-content"
          >
            <div className="flex items-center">
              <p className="text-xl text-primary">
                <TiShoppingCart />
              </p>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center justify-between px-4 py-3 hover:bg-base-300 rounded text-base-content text-lg">
                  Корзина
                </div>
                <span className="text-lg font-bold text-base-content">
                  <FaChevronRight className="text-xs" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
