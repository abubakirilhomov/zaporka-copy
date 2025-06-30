// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zaporka - Лучшие трубы для бизнеса",
  description:
    "Компания Ideal Import предлагает широкий выбор труб высокого качества. Доставка по всей стране.",
  keywords: "трубы, продажа труб, металлические трубы, строительные материалы",
  openGraph: {
    title: "Zaporka - Лучшие трубы для бизнеса",
    description: "Широкий ассортимент труб с доставкой.",
    url: "https://zaporka.uz",
    siteName: "Zaporka",
    images: [
      {
        url: "https://idealimport.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zaporka - трубы",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>{children}</ReduxProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
