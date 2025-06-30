import React from 'react'
import Link from 'next/link'
import { CgProfile } from 'react-icons/cg'
import { MdCategory, MdContactPhone } from 'react-icons/md'
import { CgMenuGridO } from "react-icons/cg";

const NavBottom = () => {
  const pages = [
    { name: 'Главная', href: '/', icon: <CgMenuGridO className="text-2xl" /> },
    { name: 'Каталог', href: '/products/catalog', icon: <MdCategory className="text-2xl" /> },
    { name: 'Компания', href: '/about', icon: <CgProfile className="text-2xl" /> },
    { name: 'Контакты', href: '/contacts', icon: <MdContactPhone className="text-2xl" /> },
  ]

  return (
    <div className="z-10 bg-primary shadow-md">
      <div className="flex items-center ">
        {pages.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex justify-center active:scale-95 py-5 px-10 w-full hover:bg-primary-content hover:text-base-content duration-300 text-base-100 gap-2 items-center"
          >
            {item.icon}
            <span className="">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavBottom
