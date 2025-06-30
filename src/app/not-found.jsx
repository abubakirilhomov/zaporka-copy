import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center transform transition-all duration-300 hover:scale-[1.02]">
        {/* Animated 404 text */}
        <h1 className="text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 animate-pulse">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          К сожалению, страница, которую вы ищете, не существует. Возможно, она была удалена или вы ввели неправильный адрес.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Вернуться на главную
        </Link>
        {/* Decorative subtle background element */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-100/30 to-transparent rounded-2xl" />
      </div>
    </div>
  );
};

export default NotFoundPage;