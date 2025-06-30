import { ToastContainer } from "react-toastify";
import ClientShell from "./ClientShell";

export const metadata = {
  title: "Zaporka - Магазин труб",
  description: "Просмотрите наш ассортимент труб в магазине Zaporka.",
};

export default function ShopLayout({ children }) {
  return (
    <>
      <ClientShell>{children}</ClientShell>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="light"
      />
    </>
  );
}
