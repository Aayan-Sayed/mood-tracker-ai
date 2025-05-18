import React, { useState } from 'react';
import { Home, BarChart, Calendar, Settings, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';

const Navbar: React.FC = () => {
  const { themeColors } = useTheme();
  const { streak } = useMood();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Trends', href: '/trends', icon: BarChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`py-4 ${themeColors.card} theme-transition shadow-md sticky top-0 z-20`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className={`text-2xl font-bold ${themeColors.text} theme-transition`}>
            Mood<span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500`}>Tracker</span>
          </span>
        </Link>

        {/* Streak counter */}
        <div className="hidden md:flex items-center space-x-1">
          <div className={`px-3 py-1 rounded-full ${themeColors.primary} text-white font-medium text-sm flex items-center space-x-1`}>
            <span className={streak.current >= 3 ? 'pulse' : ''}>🔥</span>
            <span>{streak.current} day{streak.current !== 1 ? 's' : ''}</span>
          </div>
          <span className={`text-sm ${themeColors.textSecondary}`}>
            Best: {streak.longest}
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive 
                    ? `${themeColors.primary} text-white` 
                    : `${themeColors.text} hover:${themeColors.secondary} hover:text-white`
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className={`md:hidden ${themeColors.card} shadow-lg scale-in absolute w-full`}>
          <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-gray-200">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 rounded-md ${
                    isActive 
                      ? `${themeColors.primary} text-white` 
                      : `${themeColors.text}`
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile Streak */}
            <div className="flex justify-between items-center px-3 py-3">
              <span className={`${themeColors.text}`}>Streak</span>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${themeColors.primary} text-white font-medium text-sm flex items-center`}>
                  <span className="mr-1">🔥</span>
                  <span>{streak.current}</span>
                </div>
                <span className={`text-sm ${themeColors.textSecondary}`}>
                  Best: {streak.longest}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;