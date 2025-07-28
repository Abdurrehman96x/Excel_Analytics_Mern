import { useState } from 'react';
import toast from 'react-hot-toast'; 

const AuthForm = ({ type = 'login', onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'register' && !validatePassword(formData.password)) {
      toast.error("Password must be at least 8 characters, include a number and a symbol.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl w-full space-y-4 bg-white dark:bg-slate-700 shadow-md transition-colors"
    >
      <h2 className="text-2xl font-semibold text-center capitalize text-gray-800 dark:text-white">
        {type} Form
      </h2>

      {type === 'register' && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-white"
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-white"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-white"
        required
      />

      {type === 'register' && (
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Password must be at least 8 characters and include a number and a special symbol.
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md hover:opacity-90 transition"
      >
        {type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
