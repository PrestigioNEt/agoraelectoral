import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded focus:outline-none transition"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  );
};

export default ThemeToggle; 