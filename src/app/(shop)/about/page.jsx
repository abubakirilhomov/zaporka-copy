"use client";
import Loading from "@/components/ui/Loading/Loading";
import React from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa6";
import { RiBuilding2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { IoMdTime } from "react-icons/io";
import WorkTimeCountdown from "@/components/ui/WorkTimeCountdown/WorkTimeCountdown";

const Page = () => {
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
    companyInfo = "Нет информации",
    workTime = "",
    email = [],
    phoneNumbers = [],
    companyAddress = { address: "", latitude: null, longitude: null },
  } = info;

  const getMapSrc = (lat, lon) => {
    const defaultLat = 41.239957;
    const defaultLon = 69.336054;
    const isValid = Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0;
    const latitude = isValid ? lat : defaultLat;
    const longitude = isValid ? lon : defaultLon;
    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  };

  const sanitizePhoneNumber = (num) => num.replace(/[^+\d]/g, "");

  const mapSrc = getMapSrc(companyAddress.latitude, companyAddress.longitude);

  return (
    <div className="max-w-full mx-auto p-6 rounded-xl mt-10">
      <p className="text-3xl font-bold text-center mb-6 text-primary flex items-center gap-2">
        <RiBuilding2Fill aria-hidden="true" /> О компании
      </p>

      <div className="space-y-4 text-lg leading-relaxed">
        <div className="p-4 rounded-lg border-b-2 border-primary">
          <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
            <TbFileDescription className="text-primary" aria-hidden="true" /> Описание:
          </h2>
          <p>{companyInfo}</p>
        </div>

        <div className="p-4 rounded-lg border-b-2 border-primary md:flex items-center justify-between">
          <h2 className="font-semibold text-xl mb-2 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2">
             <IoMdTime className="text-primary" aria-hidden="true" /> Режим работы:
           </div>
            <p>{workTime || "Не указано"}</p>
          </h2>
          <div className="flex justify-center">
            <WorkTimeCountdown />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-b-2 border-primary">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <MdOutlineMarkEmailUnread className="text-primary" aria-hidden="true" /> Email:
            </h2>
            <p>{email[0] || "Не указано"}</p>
          </div>

          <div className="p-4 rounded-lg border-b-2 border-primary">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <FaPhoneAlt className="text-primary" aria-hidden="true" /> Телефон:
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

          <div className="p-4 rounded-lg md:col-span-2 border-b-2 border-primary">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
              <FaAddressCard className="text-primary" aria-hidden="true" /> Адрес:
            </h2>
            <p>{companyAddress.address || "Не указано"}</p>
            <p className="text-sm text-base-content mt-1">
              Координаты: {companyAddress.latitude ?? "N/A"},{" "}
              {companyAddress.longitude ?? "N/A"}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" aria-hidden="true" /> Карта:
              </h3>
              <iframe
                className="w-full h-96 rounded-lg border"
                loading="lazy"
                allowFullScreen
                aria-label="Карта местоположения компании"
                src={mapSrc}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;