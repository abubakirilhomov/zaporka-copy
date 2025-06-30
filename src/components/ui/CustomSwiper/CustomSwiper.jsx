'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

const BannerPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (!baseURL) {
      console.error("NEXT_PUBLIC_SERVER_URL is not defined in .env");
      return;
    }

    const fetchSlides = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/swiper`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        const formatted = data.map(item => {
          let imageUrl = item.image;

          // Agar image allaqachon http(s) bilan boshlansa, o'zgartirmaymiz
          if (!/^https?:\/\//i.test(imageUrl)) {
            imageUrl = baseURL.replace(/\/$/, '') + '/' + imageUrl.replace(/^\/+/, '');
          }

          return {
            image: imageUrl,
            title: item.title || 'Новинка',
            link: item.link || null,
          };
        });

        setSlides(formatted);
      } catch (error) {
        console.error("Bannerlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [baseURL]);

  return (
    <div className="relative w-full">
      {loading ? (
        <div className="h-[400px] sm:h-[500px] flex items-center justify-center">
          <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next-banner",
            prevEl: ".swiper-button-prev-banner",
          }}
          className="w-full h-[400px] sm:h-[500px] rounded-2xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-full relative rounded-2xl bg-center bg-cover"
                style={{
                  backgroundImage: `url(${slide?.image || "/placeholder-image.png"})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-base-300 to-base/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-3xl sm:text-5xl font-extrabold drop-shadow mb-6">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-banner hidden md:flex items-center justify-center absolute top-1/2 left-4 transform -translate-y-1/2 bg-base-100 rounded-full p-3 hover:bg-neutral-100 transition duration-300 z-10 shadow-md">
        <svg
          className="w-6 h-6 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="swiper-button-next-banner hidden md:flex items-center justify-center absolute top-1/2 right-4 transform -translate-y-1/2 bg-base-100 rounded-full p-3 hover:bg-neutral-100 transition duration-300 z-10 shadow-md">
        <svg
          className="w-6 h-6 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default BannerPage;
