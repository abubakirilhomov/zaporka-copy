'use client';

import Link from 'next/link';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { useSelector } from 'react-redux';

export default function Footer() {
  const info = useSelector((state) => state.companyInfo);
  const data = info?.info;

  return (
    <footer className="bg-base-200 text-base-content py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-between gap-8 text-left md:text-center">
        <div className='md:text-left text-center'>
          <h3 className="font-bold uppercase mb-3">Каталог</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products/catalog" className="hover:underline">Смотреть Каталог</Link></li>
          </ul>
        </div>

        <div className='md:text-left text-center'>
          <h3 className="font-bold uppercase mb-3">Компания</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">О компании</Link></li>
            <li><Link href="/contacts" className="hover:underline">Контакты</Link></li>
          </ul>
        </div>

        <div className=''>
          <h3 className="font-bold md:text-left text-center uppercase mb-3">Контакты</h3>
          <ul className="space-y-3 text-sm ">
            {data?.phoneNumbers?.map((phone, index) => (
              <li key={index} className="flex items-center justify-center md:justify-start gap-2">
                <MdPhone />
                <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
              </li>
            ))}
            {data?.email?.map((email, index) => (
              <li key={index} className="flex items-center justify-center md:justify-start gap-2">
                <MdEmail />
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </li>
            ))}
            {data?.companyAddress?.address && (
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MdLocationOn />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.companyAddress.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {data.companyAddress.address}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-base-300 mt-10 pt-6 text-sm text-center px-2">
        <p>
          2025 © Запорка.uz – клапана, задвижки, затворы,
          кабель оптом со склада
          <Link href="#" className="text-primary hover:underline ml-1">СПб</Link>
        </p>
      </div>
    </footer>
  );
}
