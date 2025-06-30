'use client';

import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

export default function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    dispatch(login({ email }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
    </div>
  );
}