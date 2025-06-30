'use client';

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Не отображать пагинацию, если только одна страница

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка наверх
  };

  return (
    <div className="flex justify-center mt-8">
      <nav aria-label="Pagination" className="flex space-x-2">
        {/* Кнопка "Предыдущая" */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded ${
            currentPage === 1
              ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          aria-label="Предыдущая страница"
        >
          &lt;
        </button>
        {/* Номера страниц */}
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-base-200 text-base-content hover:bg-base-300'
              }`}
              aria-label={`Страница ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
        {/* Кнопка "Следующая" */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          aria-label="Следующая страница"
        >
          &gt;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;