import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  // Default to light theme unless 'dark' is explicitly saved
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-3 rounded-full bg-white/50 dark:bg-gray-700 hover:bg-white hover:shadow-md dark:hover:bg-gray-600 transition"
      title="Toggle Theme"
    >
      {isDark ? <Sun size={28} /> : <Moon size={28} />}
    </button>
  );
};

export default ThemeToggle;
