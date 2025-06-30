"use client";
import React from "react";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/Loading/Loading";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { RiBuilding2Fill } from "react-icons/ri";
import { FaTelegram } from "react-icons/fa";

const ContactPage = () => {
  const { info, loading, error } = useSelector((state) => state.companyInfo);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading />
      </div>
    );
  }

  if (error || !info) {
    return <p className="text-center text-error">Ошибка загрузки данных</p>;
  }

  const {
    email = [],
    phoneNumbers = [],
  } = info;

  const sanitizePhoneNumber = (num) => num.replace(/[^+\d]/g, "");
  return (
    <div className="max-w-full mx-auto p-6 rounded-xl mt-10">
      <p className="text-3xl font-bold text-center mb-6 text-primary flex items-center gap-2">
        <RiBuilding2Fill aria-hidden="true" /> Контактная информация
      </p>

      <div className="space-y-4 text-lg leading-relaxed">
        {/* Email */}
        <div className="p-4 flex items- flex-col md:flex-row md:justify-between rounded-lg border-b-2 border-primary">
          <div className="md:mb-0 mb-4">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <MdOutlineMarkEmailUnread
                className="text-primary"
                aria-hidden="true"
              />
              Email:
            </h2>
            <p>{email[0] || "Не указано"}</p>
          </div>
          <div className="md:mb-0 mb-4">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <FaPhoneAlt className="text-primary" aria-hidden="true" />
              Телефон:
            </h2>
            {phoneNumbers.length > 0 ? (
              phoneNumbers.map((num, index) => (
                <p key={index}>
                  <a href={`tel:${sanitizePhoneNumber(num)}`}>{num}</a>
                </p>
              ))
            ) : (
              <p>Не указано</p>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <FaTelegram className="text-primary" aria-hidden="true" />
              Телеграм:
            </h2>
            <a className="underline text-blue-500" href={info?.telegram}>{info?.telegram}</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
