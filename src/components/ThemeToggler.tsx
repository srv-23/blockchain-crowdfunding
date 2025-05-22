import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const themePreviews: Record<string, string> = {
  default: 'bg-gradient-to-r from-blue-400 to-blue-200',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-600',
  nature: 'bg-gradient-to-r from-green-400 to-lime-200',
  sunset: 'bg-gradient-to-r from-pink-500 to-yellow-300',
  ocean: 'bg-gradient-to-r from-cyan-500 to-blue-400',
};

const ThemeToggler: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle theme menu"
        type="button"
      >
        <span
          className={`w-5 h-5 mr-2 rounded ${themePreviews[currentTheme.name] || 'bg-gray-200'}`}
        ></span>
        <span className="font-semibold capitalize text-gray-700">{currentTheme.name}</span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {availableThemes.map((t) => (
            <button
              key={t.name}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition ${currentTheme.name === t.name ? 'font-bold' : ''}`}
              onClick={() => {
                setTheme(t.name);
                setOpen(false);
              }}
              type="button"
            >
              <span className={`w-5 h-5 mr-3 rounded ${themePreviews[t.name] || 'bg-gray-200'}`}></span>
              <span className="capitalize">{t.name}</span>
              {currentTheme.name === t.name && (
                <svg className="ml-auto w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggler; 