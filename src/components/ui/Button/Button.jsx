// src/components/ui/Button/Button.jsx
'use client';

export default function Button({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      {...props}
    >
      {children}
    </button>
  );
}